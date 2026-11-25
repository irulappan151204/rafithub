"use server";

import { revalidatePath } from "next/cache";
import { PaymentMethod, PaymentStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { requireStaff } from "@/lib/auth/server";
import { hasPermission } from "@/lib/rbac";
import { recordAuditLog } from "@/server/services/audit";
import { sendPaymentReceiptEmail } from "@/lib/email";
import { formatDateIN, formatINR } from "@/lib/format";
import {
  assignMembershipSchema,
  bodyMeasurementSchema,
  csvMemberRowSchema,
  manualPaymentSchema,
  memberUpsertSchema,
} from "@/lib/validators/gym-ops";
import {
  calculateFreezeExtensionDays,
  calculateMembershipEndDate,
  calculateRenewalEndDate,
  extendEndDateByDays,
  formatMemberCode,
  formatReceiptNumber,
} from "@/server/services/gym-ops";

async function nextMemberCode(): Promise<string> {
  const count = await prisma.member.count();
  let seq = count + 1;
  while (await prisma.member.findUnique({ where: { memberCode: formatMemberCode(seq) } })) {
    seq += 1;
  }
  return formatMemberCode(seq);
}

async function nextReceiptNo(date = new Date()): Promise<string> {
  const count = await prisma.payment.count();
  let seq = count + 1;
  while (await prisma.payment.findUnique({ where: { receiptNo: formatReceiptNumber(date, seq) } })) {
    seq += 1;
  }
  return formatReceiptNumber(date, seq);
}

export async function clearMustChangePasswordAction() {
  const staff = await requireStaff({ permission: "dashboard:view" });
  await prisma.user.update({
    where: { id: staff.user.id },
    data: { mustChangePassword: false },
  });
  revalidatePath("/admin");
}

export async function upsertMemberAction(rawInput: unknown) {
  const staff = await requireStaff({ permission: "members:write" });
  const data = memberUpsertSchema.parse(rawInput);

  const canEditHealthNotes = hasPermission(staff.user.role, "members:health_notes");

  if (data.id) {
    const member = await prisma.member.update({
      where: { id: data.id },
      data: {
        name: data.name,
        phone: data.phone,
        email: data.email || null,
        gender: data.gender || null,
        dob: data.dob ? new Date(data.dob) : null,
        address: data.address || null,
        emergencyContact: data.emergencyContact || null,
        photoUrl: data.photoUrl || null,
        photoKey: data.photoKey || null,
        goal: data.goal || null,
        ...(canEditHealthNotes ? { healthNotes: data.healthNotes || null } : {}),
        source: data.source,
        assignedTrainerId: data.assignedTrainerId || null,
        status: data.status,
        notes: data.notes || null,
      },
    });
    await recordAuditLog({
      userId: staff.user.id,
      action: "UPDATE_MEMBER",
      entity: "Member",
      entityId: member.id,
      diff: { name: member.name, status: member.status },
    });
    revalidatePath("/admin/members");
    revalidatePath(`/admin/members/${member.id}`);
    return member;
  }

  const memberCode = await nextMemberCode();
  const member = await prisma.member.create({
    data: {
      memberCode,
      name: data.name,
      phone: data.phone,
      email: data.email || null,
      gender: data.gender || null,
      dob: data.dob ? new Date(data.dob) : null,
      address: data.address || null,
      emergencyContact: data.emergencyContact || null,
      photoUrl: data.photoUrl || null,
      photoKey: data.photoKey || null,
      goal: data.goal || null,
      healthNotes: canEditHealthNotes ? data.healthNotes || null : null,
      source: data.source,
      assignedTrainerId: data.assignedTrainerId || null,
      status: data.status,
      notes: data.notes || null,
    },
  });

  if (data.initialPlanId) {
    const plan = await prisma.plan.findUnique({ where: { id: data.initialPlanId } });
    if (plan) {
      const startDate = new Date();
      const endDate = calculateMembershipEndDate(startDate, plan.durationDays);
      await prisma.membership.create({
        data: {
          memberId: member.id,
          planId: plan.id,
          startDate,
          endDate,
          status: "ACTIVE",
          pricePaid: 0,
        },
      });
    }
  }

  await recordAuditLog({
    userId: staff.user.id,
    action: "CREATE_MEMBER",
    entity: "Member",
    entityId: member.id,
    diff: { memberCode: member.memberCode, name: member.name },
  });

  revalidatePath("/admin/members");
  revalidatePath("/admin");
  return member;
}

export async function softDeleteMemberAction(memberId: string) {
  const staff = await requireStaff({ permission: "members:delete" });
  await prisma.member.update({
    where: { id: memberId },
    data: { deletedAt: new Date(), status: "CANCELLED" },
  });
  await recordAuditLog({
    userId: staff.user.id,
    action: "SOFT_DELETE_MEMBER",
    entity: "Member",
    entityId: memberId,
  });
  revalidatePath("/admin/members");
  revalidatePath("/admin");
}

export async function assignOrRenewMembershipAction(rawInput: unknown) {
  const staff = await requireStaff({ permission: "members:write" });
  const data = assignMembershipSchema.parse(rawInput);

  const plan = await prisma.plan.findUniqueOrThrow({ where: { id: data.planId } });
  const currentActive = await prisma.membership.findFirst({
    where: { memberId: data.memberId, status: "ACTIVE", deletedAt: null },
    orderBy: { endDate: "desc" },
  });

  const { startDate, endDate } = calculateRenewalEndDate(currentActive?.endDate, plan.durationDays);

  const membership = await prisma.membership.create({
    data: {
      memberId: data.memberId,
      planId: plan.id,
      startDate,
      endDate,
      status: "ACTIVE",
      pricePaid: data.amountPaid,
      discount: data.discount,
      notes: data.notes || null,
    },
  });

  await prisma.member.update({
    where: { id: data.memberId },
    data: { status: "ACTIVE" },
  });

  if (data.amountPaid > 0) {
    const receiptNo = await nextReceiptNo();
    const netPrice = Math.max(0, plan.price - data.discount);
    const payment = await prisma.payment.create({
      data: {
        memberId: data.memberId,
        membershipId: membership.id,
        amount: data.amountPaid,
        method: data.paymentMethod as PaymentMethod,
        status: data.amountPaid < netPrice ? PaymentStatus.PARTIAL : PaymentStatus.PAID,
        receiptNo,
        collectedById: staff.user.id,
        notes: data.notes || `${plan.name} membership`,
      },
      include: { member: true },
    });

    if (payment.member.email) {
      void sendPaymentReceiptEmail({
        to: payment.member.email,
        memberName: payment.member.name,
        receiptNo: payment.receiptNo,
        amountFormatted: formatINR(payment.amount),
        method: payment.method,
        paidAtFormatted: formatDateIN(payment.paidAt),
      });
    }
  }

  await recordAuditLog({
    userId: staff.user.id,
    action: "ASSIGN_MEMBERSHIP",
    entity: "Membership",
    entityId: membership.id,
    diff: { memberId: data.memberId, plan: plan.name, amountPaid: data.amountPaid },
  });

  revalidatePath(`/admin/members/${data.memberId}`);
  revalidatePath("/admin/members");
  revalidatePath("/admin/payments");
  revalidatePath("/admin");
  return membership;
}

export async function freezeMembershipAction(membershipId: string) {
  const staff = await requireStaff({ permission: "members:write" });
  const now = new Date();
  const membership = await prisma.membership.update({
    where: { id: membershipId },
    data: { status: "FROZEN", freezeStart: now },
  });
  await prisma.member.update({
    where: { id: membership.memberId },
    data: { status: "FROZEN" },
  });
  await recordAuditLog({
    userId: staff.user.id,
    action: "FREEZE_MEMBERSHIP",
    entity: "Membership",
    entityId: membershipId,
  });
  revalidatePath(`/admin/members/${membership.memberId}`);
  revalidatePath("/admin/members");
}

export async function unfreezeMembershipAction(membershipId: string) {
  const staff = await requireStaff({ permission: "members:write" });
  const existing = await prisma.membership.findUniqueOrThrow({ where: { id: membershipId } });
  const now = new Date();
  const frozenDays = existing.freezeStart ? calculateFreezeExtensionDays(existing.freezeStart, now) : 0;
  const newEndDate = extendEndDateByDays(existing.endDate, frozenDays);

  const updated = await prisma.membership.update({
    where: { id: membershipId },
    data: {
      status: "ACTIVE",
      freezeEnd: now,
      endDate: newEndDate,
    },
  });
  await prisma.member.update({
    where: { id: updated.memberId },
    data: { status: "ACTIVE" },
  });
  await recordAuditLog({
    userId: staff.user.id,
    action: "UNFREEZE_MEMBERSHIP",
    entity: "Membership",
    entityId: membershipId,
    diff: { extendedDays: frozenDays },
  });
  revalidatePath(`/admin/members/${updated.memberId}`);
  revalidatePath("/admin/members");
}

export async function recordManualPaymentAction(rawInput: unknown) {
  const staff = await requireStaff({ permission: "payments:write" });
  const data = manualPaymentSchema.parse(rawInput);

  const receiptNo = await nextReceiptNo();
  const payment = await prisma.payment.create({
    data: {
      memberId: data.memberId,
      membershipId: data.membershipId || null,
      amount: data.amount,
      method: data.method,
      status: "PAID",
      receiptNo,
      collectedById: staff.user.id,
      notes: data.notes || null,
    },
    include: { member: true },
  });

  if (data.membershipId) {
    await prisma.membership.update({
      where: { id: data.membershipId },
      data: { pricePaid: { increment: data.amount } },
    });
  }

  if (payment.member.email) {
    void sendPaymentReceiptEmail({
      to: payment.member.email,
      memberName: payment.member.name,
      receiptNo: payment.receiptNo,
      amountFormatted: formatINR(payment.amount),
      method: payment.method,
      paidAtFormatted: formatDateIN(payment.paidAt),
    });
  }

  await recordAuditLog({
    userId: staff.user.id,
    action: "RECORD_PAYMENT",
    entity: "Payment",
    entityId: payment.id,
    diff: { receiptNo: payment.receiptNo, amount: payment.amount, method: payment.method },
  });

  revalidatePath("/admin/payments");
  revalidatePath(`/admin/members/${data.memberId}`);
  revalidatePath("/admin");
  return payment;
}

export async function addBodyMeasurementAction(rawInput: unknown) {
  const staff = await requireStaff({ permission: "members:health_notes" });
  const data = bodyMeasurementSchema.parse(rawInput);

  const entry = await prisma.bodyMeasurement.create({
    data: {
      memberId: data.memberId,
      weight: data.weight ?? null,
      height: data.height ?? null,
      bodyFat: data.bodyFat ?? null,
      chest: data.chest ?? null,
      waist: data.waist ?? null,
      hips: data.hips ?? null,
      arms: data.arms ?? null,
      thighs: data.thighs ?? null,
      notes: data.notes || null,
    },
  });

  await recordAuditLog({
    userId: staff.user.id,
    action: "ADD_MEASUREMENT",
    entity: "BodyMeasurement",
    entityId: entry.id,
    diff: { memberId: data.memberId },
  });

  revalidatePath(`/admin/members/${data.memberId}`);
  return entry;
}

export async function importMembersCsvAction(
  rows: Array<Record<string, string>>,
  dryRun = true
): Promise<{
  validCount: number;
  skippedCount: number;
  errors: Array<{ row: number; reason: string }>;
  createdCount: number;
}> {
  const staff = await requireStaff({ permission: "members:write" });
  const errors: Array<{ row: number; reason: string }> = [];
  const validRows: Array<ReturnType<typeof csvMemberRowSchema.parse>> = [];

  for (let i = 0; i < rows.length; i++) {
    const parsed = csvMemberRowSchema.safeParse(rows[i]);
    if (!parsed.success) {
      errors.push({
        row: i + 1,
        reason: parsed.error.issues[0]?.message ?? "Invalid row",
      });
    } else {
      validRows.push(parsed.data);
    }
  }

  if (dryRun) {
    return {
      validCount: validRows.length,
      skippedCount: errors.length,
      errors,
      createdCount: 0,
    };
  }

  let createdCount = 0;
  for (const row of validRows) {
    const exists = await prisma.member.findUnique({ where: { phone: row.phone } });
    if (exists) continue;
    const memberCode = await nextMemberCode();
    await prisma.member.create({
      data: {
        memberCode,
        name: row.name,
        phone: row.phone,
        email: row.email || null,
        gender: row.gender || null,
        goal: row.goal || null,
        source: row.source || "csv-import",
        status: "ACTIVE",
      },
    });
    createdCount += 1;
  }

  await recordAuditLog({
    userId: staff.user.id,
    action: "IMPORT_MEMBERS_CSV",
    entity: "Member",
    entityId: "batch",
    diff: { createdCount, invalidRows: errors.length },
  });

  revalidatePath("/admin/members");
  revalidatePath("/admin");

  return {
    validCount: validRows.length,
    skippedCount: errors.length,
    errors,
    createdCount,
  };
}

export async function recordCheckInAction(input: {
  memberCodeOrId: string;
  method?: "MANUAL" | "QR";
  overrideBlocked?: boolean;
}) {
  const staff = await requireStaff({ permission: "attendance:manage" });
  const raw = input.memberCodeOrId.trim();
  const normalizedCode = raw.replace(/^RAFITHUB:/i, "").trim().toUpperCase();

  const member = await prisma.member.findFirst({
    where: {
      deletedAt: null,
      OR: [{ id: raw }, { memberCode: normalizedCode }, { phone: raw }],
    },
    include: {
      memberships: { orderBy: { endDate: "desc" }, take: 1, include: { plan: true } },
    },
  });

  if (!member) {
    return {
      ok: false as const,
      blocked: false,
      message: `No active member found matching "${raw}".`,
    };
  }

  const latestMembership = member.memberships[0];
  const membershipExpired =
    member.status !== "ACTIVE" ||
    (latestMembership &&
      latestMembership.status === "ACTIVE" &&
      latestMembership.endDate.getTime() < Date.now());

  if (membershipExpired && !input.overrideBlocked) {
    const effectiveStatus = member.status !== "ACTIVE" ? member.status : "EXPIRED";
    return {
      ok: false as const,
      blocked: true,
      memberId: member.id,
      memberCode: member.memberCode,
      memberName: member.name,
      status: effectiveStatus,
      message: `Check-in blocked: ${member.name} (${member.memberCode}) is ${effectiveStatus}. Renew or unfreeze membership first.`,
    };
  }

  const attendance = await prisma.attendance.create({
    data: {
      memberId: member.id,
      method: input.method === "QR" ? "QR" : "MANUAL",
    },
  });

  await recordAuditLog({
    userId: staff.user.id,
    action: "CHECK_IN",
    entity: "Attendance",
    entityId: attendance.id,
    diff: {
      memberId: member.id,
      memberCode: member.memberCode,
      method: attendance.method,
      overrideBlocked: Boolean(input.overrideBlocked),
    },
  });

  revalidatePath("/admin/attendance");
  revalidatePath(`/admin/members/${member.id}`);
  revalidatePath("/admin");

  return {
    ok: true as const,
    blocked: false,
    memberId: member.id,
    memberCode: member.memberCode,
    memberName: member.name,
    status: member.status,
    attendanceId: attendance.id,
    message: `Checked in ${member.name} (${member.memberCode}).`,
  };
}

export async function recordCheckOutAction(attendanceId: string) {
  const staff = await requireStaff({ permission: "attendance:manage" });
  const updated = await prisma.attendance.update({
    where: { id: attendanceId },
    data: { checkOutAt: new Date() },
  });

  await recordAuditLog({
    userId: staff.user.id,
    action: "CHECK_OUT",
    entity: "Attendance",
    entityId: attendanceId,
    diff: { memberId: updated.memberId },
  });

  revalidatePath("/admin/attendance");
  revalidatePath(`/admin/members/${updated.memberId}`);
}

export async function convertLeadToMemberAction(leadId: string) {
  const staff = await requireStaff({ permission: "leads:manage" });
  if (!hasPermission(staff.user.role, "members:write")) {
    throw new Error("Forbidden: missing members:write permission");
  }

  const lead = await prisma.lead.findUnique({ where: { id: leadId } });
  if (!lead) {
    throw new Error("Lead not found");
  }

  const existing = await prisma.member.findFirst({
    where: { phone: lead.phone, deletedAt: null },
  });

  if (existing) {
    await prisma.lead.update({
      where: { id: leadId },
      data: { status: "CONVERTED" },
    });
    revalidatePath("/admin/leads");
    revalidatePath("/admin/members");
    revalidatePath("/admin");
    return {
      memberId: existing.id,
      memberCode: existing.memberCode,
      alreadyExisted: true,
    };
  }

  const memberCode = await nextMemberCode();
  const member = await prisma.member.create({
    data: {
      memberCode,
      name: lead.name,
      phone: lead.phone,
      email: lead.email || null,
      goal: lead.interest || null,
      notes: lead.message || null,
      source: lead.source || "website",
      status: "ACTIVE",
    },
  });

  await prisma.lead.update({
    where: { id: leadId },
    data: { status: "CONVERTED" },
  });

  await recordAuditLog({
    userId: staff.user.id,
    action: "CONVERT_LEAD_TO_MEMBER",
    entity: "Member",
    entityId: member.id,
    diff: { leadId, memberCode: member.memberCode },
  });

  revalidatePath("/admin/leads");
  revalidatePath("/admin/members");
  revalidatePath("/admin");

  return {
    memberId: member.id,
    memberCode: member.memberCode,
    alreadyExisted: false,
  };
}
