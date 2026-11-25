import { prisma } from "@/lib/db";
import { requireStaff } from "@/lib/auth/server";
import { hasPermission } from "@/lib/rbac";
import { computeOutstandingDue } from "@/server/services/gym-ops";
import { PaymentsManager } from "@/components/admin/PaymentsManager";

export const dynamic = "force-dynamic";

function startOfTodayIST(): Date {
  const istDateStr = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(
    new Date()
  );
  return new Date(`${istDateStr}T00:00:00+05:30`);
}

function startOfMonthIST(): Date {
  const istDateStr = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(
    new Date()
  );
  return new Date(`${istDateStr.slice(0, 7)}-01T00:00:00+05:30`);
}

export default async function AdminPaymentsPage() {
  const staff = await requireStaff({ permission: "payments:read" });
  const canWritePayments = hasPermission(staff.user.role, "payments:write");

  const todayStart = startOfTodayIST();
  const monthStart = startOfMonthIST();

  const [payments, members, activeMemberships, todayAgg, monthAgg] = await Promise.all([
    prisma.payment.findMany({
      where: { deletedAt: null },
      orderBy: { paidAt: "desc" },
      take: 200,
      include: {
        member: { select: { id: true, name: true, memberCode: true, phone: true } },
        membership: { include: { plan: { select: { name: true } } } },
        collectedBy: { select: { name: true } },
      },
    }),
    prisma.member.findMany({
      where: { deletedAt: null },
      orderBy: { name: "asc" },
      select: {
        id: true,
        memberCode: true,
        name: true,
        phone: true,
        memberships: {
          orderBy: { startDate: "desc" },
          take: 1,
          select: { id: true },
        },
      },
    }),
    prisma.membership.findMany({
      where: {
        member: { deletedAt: null },
        status: { in: ["ACTIVE", "EXPIRED", "FROZEN"] },
      },
      include: {
        member: { select: { id: true, name: true, memberCode: true } },
        plan: { select: { name: true, price: true } },
      },
      orderBy: { startDate: "desc" },
      take: 100,
    }),
    prisma.payment.aggregate({
      where: { deletedAt: null, status: "PAID", paidAt: { gte: todayStart } },
      _sum: { amount: true },
    }),
    prisma.payment.aggregate({
      where: { deletedAt: null, status: "PAID", paidAt: { gte: monthStart } },
      _sum: { amount: true },
    }),
  ]);

  const dues = activeMemberships
    .map((ms) => ({
      membershipId: ms.id,
      memberId: ms.member.id,
      memberName: ms.member.name,
      memberCode: ms.member.memberCode,
      planName: ms.plan.name,
      dueAmount: computeOutstandingDue(ms.plan.price, ms.discount, ms.pricePaid),
    }))
    .filter((d) => d.dueAmount > 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Payments &amp; Receipts</h1>
        <p className="text-sm text-[var(--muted-foreground)] mt-1">
          Collect front-desk payments (Cash/UPI/Card), track balance dues, and print PDF receipts.
        </p>
      </div>

      <PaymentsManager
        payments={payments.map((p) => ({
          id: p.id,
          receiptNo: p.receiptNo,
          amount: p.amount,
          method: p.method,
          status: p.status,
          paidAt: p.paidAt.toISOString(),
          notes: p.notes,
          memberId: p.member.id,
          memberName: p.member.name,
          memberCode: p.member.memberCode,
          memberPhone: p.member.phone,
          planName: p.membership?.plan.name ?? null,
          collectedByName: p.collectedBy?.name ?? null,
        }))}
        dues={dues}
        members={members.map((m) => ({
          id: m.id,
          memberCode: m.memberCode,
          name: m.name,
          phone: m.phone,
          latestMembershipId: m.memberships[0]?.id ?? null,
        }))}
        todayTotal={todayAgg._sum.amount ?? 0}
        monthTotal={monthAgg._sum.amount ?? 0}
        canWritePayments={canWritePayments}
      />
    </div>
  );
}
