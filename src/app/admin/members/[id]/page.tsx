import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireStaff } from "@/lib/auth/server";
import { hasPermission } from "@/lib/rbac";
import { MemberProfileClient } from "@/components/admin/MemberProfileClient";

export const dynamic = "force-dynamic";

export default async function MemberProfilePage({ params }: { params: { id: string } }) {
  const staff = await requireStaff({ permission: "members:read" });
  const canViewHealthNotes = hasPermission(staff.user.role, "members:health_notes");

  const [member, plans] = await Promise.all([
    prisma.member.findFirst({
      where: { id: params.id, deletedAt: null },
      include: {
        assignedTrainer: { select: { name: true } },
        memberships: {
          where: { deletedAt: null },
          orderBy: { endDate: "desc" },
          include: { plan: { select: { name: true, price: true } } },
        },
        payments: {
          where: { deletedAt: null },
          orderBy: { paidAt: "desc" },
        },
        attendances: {
          orderBy: { checkInAt: "desc" },
          take: 20,
        },
        measurements: {
          orderBy: { date: "desc" },
          take: 10,
        },
      },
    }),
    prisma.plan.findMany({
      where: { isActive: true },
      select: { id: true, name: true, price: true },
      orderBy: { sortOrder: "asc" },
    }),
  ]);

  if (!member) notFound();

  return (
    <MemberProfileClient
      member={{
        id: member.id,
        memberCode: member.memberCode,
        name: member.name,
        phone: member.phone,
        email: member.email,
        status: member.status,
        goal: member.goal,
        healthNotes: canViewHealthNotes ? member.healthNotes : null,
        joinedAt: member.joinedAt.toISOString(),
        trainerName: member.assignedTrainer?.name ?? null,
      }}
      memberships={member.memberships.map((ms) => ({
        id: ms.id,
        planName: ms.plan.name,
        planPrice: ms.plan.price,
        startDate: ms.startDate.toISOString(),
        endDate: ms.endDate.toISOString(),
        status: ms.status,
        pricePaid: ms.pricePaid,
        discount: ms.discount,
      }))}
      payments={member.payments.map((p) => ({
        id: p.id,
        receiptNo: p.receiptNo,
        amount: p.amount,
        method: p.method,
        paidAt: p.paidAt.toISOString(),
        notes: p.notes,
      }))}
      attendances={member.attendances.map((a) => ({
        id: a.id,
        checkInAt: a.checkInAt.toISOString(),
        method: a.method,
      }))}
      measurements={member.measurements.map((m) => ({
        id: m.id,
        date: m.date.toISOString(),
        weight: m.weight,
        bodyFat: m.bodyFat,
        waist: m.waist,
      }))}
      plans={plans}
      canWriteMembers={hasPermission(staff.user.role, "members:write")}
      canWritePayments={hasPermission(staff.user.role, "payments:write")}
      canViewHealthNotes={canViewHealthNotes}
    />
  );
}
