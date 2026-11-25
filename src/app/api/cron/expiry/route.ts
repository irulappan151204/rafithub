import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendExpiryReminderEmail } from "@/lib/email";
import { formatDateIN } from "@/lib/format";

export async function GET(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = request.headers.get("authorization");

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const msPerDay = 24 * 60 * 60 * 1000;

  // 1. Mark overdue active memberships as EXPIRED
  const expiredResult = await prisma.membership.updateMany({
    where: {
      status: "ACTIVE",
      deletedAt: null,
      endDate: { lt: now },
    },
    data: { status: "EXPIRED" },
  });

  // Sync members whose active memberships all expired
  const activeMembersWithNoActivePlan = await prisma.member.findMany({
    where: {
      status: "ACTIVE",
      deletedAt: null,
      memberships: {
        none: { status: "ACTIVE", deletedAt: null },
      },
    },
    select: { id: true },
  });

  if (activeMembersWithNoActivePlan.length > 0) {
    await prisma.member.updateMany({
      where: { id: { in: activeMembersWithNoActivePlan.map((m) => m.id) } },
      data: { status: "EXPIRED" },
    });
  }

  // 2. Send 7-day, 3-day, and 0-day expiry reminders
  const upcomingWindow = new Date(now.getTime() + 8 * msPerDay);
  const candidates = await prisma.membership.findMany({
    where: {
      status: { in: ["ACTIVE", "EXPIRED"] },
      deletedAt: null,
      endDate: {
        gte: new Date(now.getTime() - msPerDay),
        lte: upcomingWindow,
      },
    },
    include: {
      member: { select: { name: true, email: true } },
      plan: { select: { name: true } },
    },
  });

  let remindersSent = 0;
  for (const m of candidates) {
    if (!m.member.email) continue;
    const daysLeft = Math.ceil((m.endDate.getTime() - now.getTime()) / msPerDay);
    if (daysLeft === 7 || daysLeft === 3 || daysLeft === 0) {
      const sent = await sendExpiryReminderEmail({
        to: m.member.email,
        memberName: m.member.name,
        planName: m.plan.name,
        endDateFormatted: formatDateIN(m.endDate),
        daysLeft,
      });
      if (sent) remindersSent += 1;
    }
  }

  return NextResponse.json({
    ok: true,
    expiredMemberships: expiredResult.count,
    expiredMembersSynced: activeMembersWithNoActivePlan.length,
    remindersSent,
  });
}
