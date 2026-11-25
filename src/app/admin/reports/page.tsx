import { prisma } from "@/lib/db";
import { requireStaff } from "@/lib/auth/server";
import { ReportsClient } from "@/components/admin/ReportsClient";

export const dynamic = "force-dynamic";

function istMonthKey(date: Date): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(date).slice(0, 7);
}

export default async function AdminReportsPage() {
  await requireStaff({ permission: "reports:view" });

  const now = new Date();
  const currentKey = istMonthKey(now);
  const [yearNum, monthNum] = currentKey.split("-").map(Number);
  const sixMonthsStart = new Date(Date.UTC(yearNum, monthNum - 6, 1));

  const buckets: Array<{
    key: string;
    month: string;
    totalRevenue: number;
    paymentCount: number;
    newMembers: number;
    checkIns: number;
  }> = [];

  for (let offset = 5; offset >= 0; offset--) {
    const d = new Date(Date.UTC(yearNum, monthNum - 1 - offset, 1));
    const key = d.toISOString().slice(0, 7);
    const label = new Intl.DateTimeFormat("en-IN", {
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    }).format(d);
    buckets.push({
      key,
      month: label,
      totalRevenue: 0,
      paymentCount: 0,
      newMembers: 0,
      checkIns: 0,
    });
  }

  const [payments, members, attendances, methodGroups, memberGroups, leadGroups, totalAgg] =
    await Promise.all([
      prisma.payment.findMany({
        where: { deletedAt: null, status: "PAID", paidAt: { gte: sixMonthsStart } },
        select: { amount: true, paidAt: true },
      }),
      prisma.member.findMany({
        where: { deletedAt: null, joinedAt: { gte: sixMonthsStart } },
        select: { joinedAt: true },
      }),
      prisma.attendance.findMany({
        where: { checkInAt: { gte: sixMonthsStart } },
        select: { checkInAt: true },
      }),
      prisma.payment.groupBy({
        by: ["method"],
        where: { deletedAt: null, status: "PAID" },
        _sum: { amount: true },
        _count: { _all: true },
      }),
      prisma.member.groupBy({
        by: ["status"],
        where: { deletedAt: null },
        _count: { _all: true },
      }),
      prisma.lead.groupBy({
        by: ["status"],
        _count: { _all: true },
      }),
      prisma.payment.aggregate({
        where: { deletedAt: null, status: "PAID" },
        _sum: { amount: true },
      }),
    ]);

  for (const p of payments) {
    const b = buckets.find((x) => x.key === istMonthKey(p.paidAt));
    if (b) {
      b.totalRevenue += p.amount;
      b.paymentCount += 1;
    }
  }
  for (const m of members) {
    const b = buckets.find((x) => x.key === istMonthKey(m.joinedAt));
    if (b) b.newMembers += 1;
  }
  for (const a of attendances) {
    const b = buckets.find((x) => x.key === istMonthKey(a.checkInAt));
    if (b) b.checkIns += 1;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Financial &amp; Retention Reports</h1>
        <p className="text-sm text-[var(--muted-foreground)] mt-1">
          Owner and manager analytics across collections, joins, attendance, and lead conversion.
        </p>
      </div>

      <ReportsClient
        monthlyRows={buckets.map(({ month, totalRevenue, paymentCount, newMembers, checkIns }) => ({
          month,
          totalRevenue,
          paymentCount,
          newMembers,
          checkIns,
        }))}
        byMethod={methodGroups.map((g) => ({
          method: g.method,
          total: g._sum.amount ?? 0,
          count: g._count._all,
        }))}
        memberBreakdown={memberGroups.map((g) => ({ status: g.status, count: g._count._all }))}
        leadBreakdown={leadGroups.map((g) => ({ status: g.status, count: g._count._all }))}
        totalCollected={totalAgg._sum.amount ?? 0}
      />
    </div>
  );
}
