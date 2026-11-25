import Link from "next/link";
import { prisma } from "@/lib/db";
import { getRealtimeServer, isRealtimeConfigured, recentLeadsLiveQuery } from "@/lib/realtime";
import { RealtimeDashboardFeed } from "@/components/admin/RealtimeDashboardFeed";
import { DashboardCharts } from "@/components/admin/DashboardCharts";
import { formatDateIN, formatINR } from "@/lib/format";
import { buildWhatsAppReminderUrl, computeOutstandingDue } from "@/server/services/gym-ops";

export const dynamic = "force-dynamic";

function istDateKey(date: Date): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(date);
}

function istHour(date: Date): number {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    hour12: false,
  }).formatToParts(date);
  const hourStr = parts.find((p) => p.type === "hour")?.value ?? "0";
  return Number(hourStr) % 24;
}

export default async function AdminDashboardPage() {
  const now = new Date();
  const todayKey = istDateKey(now);
  const todayStart = new Date(`${todayKey}T00:00:00+05:30`);
  const monthStart = new Date(`${todayKey.slice(0, 7)}-01T00:00:00+05:30`);
  const sevenDaysAhead = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  // Build 6-month bucket keys ending at current month
  const [yearNum, monthNum] = todayKey.slice(0, 7).split("-").map(Number);
  const sixMonthsStart = new Date(Date.UTC(yearNum, monthNum - 6, 1));
  const monthBuckets: Array<{ key: string; label: string; revenue: number; newMembers: number }> = [];
  for (let offset = 5; offset >= 0; offset--) {
    const d = new Date(Date.UTC(yearNum, monthNum - 1 - offset, 1));
    const key = d.toISOString().slice(0, 7);
    const label = new Intl.DateTimeFormat("en-IN", { month: "short", timeZone: "UTC" }).format(d);
    monthBuckets.push({ key, label, revenue: 0, newMembers: 0 });
  }

  const [
    activeMembers,
    expiredMembers,
    newJoinsThisMonth,
    expiringMemberships,
    todayCheckIns,
    todayPaymentsAgg,
    monthPaymentsAgg,
    dueMemberships,
    newLeadsCount,
    recentLeads,
    recentPayments6m,
    recentMembers6m,
    attendance30d,
    membersWithDob,
    settings,
  ] = await Promise.all([
    prisma.member.count({ where: { status: "ACTIVE", deletedAt: null } }),
    prisma.member.count({ where: { status: "EXPIRED", deletedAt: null } }),
    prisma.member.count({ where: { deletedAt: null, joinedAt: { gte: monthStart } } }),
    prisma.membership.findMany({
      where: {
        status: "ACTIVE",
        endDate: { gte: now, lte: sevenDaysAhead },
        member: { deletedAt: null },
      },
      orderBy: { endDate: "asc" },
      take: 10,
      include: {
        member: { select: { id: true, name: true, phone: true, memberCode: true } },
        plan: { select: { name: true } },
      },
    }),
    prisma.attendance.count({ where: { checkInAt: { gte: todayStart } } }),
    prisma.payment.aggregate({
      where: { deletedAt: null, status: "PAID", paidAt: { gte: todayStart } },
      _sum: { amount: true },
    }),
    prisma.payment.aggregate({
      where: { deletedAt: null, status: "PAID", paidAt: { gte: monthStart } },
      _sum: { amount: true },
    }),
    prisma.membership.findMany({
      where: {
        member: { deletedAt: null },
        status: { in: ["ACTIVE", "EXPIRED", "FROZEN"] },
      },
      include: { plan: { select: { price: true } } },
    }),
    prisma.lead.count({ where: { status: "NEW" } }),
    prisma.lead.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
      select: {
        id: true,
        name: true,
        phone: true,
        interest: true,
        source: true,
        status: true,
        createdAt: true,
      },
    }),
    prisma.payment.findMany({
      where: { deletedAt: null, status: "PAID", paidAt: { gte: sixMonthsStart } },
      select: { amount: true, paidAt: true },
    }),
    prisma.member.findMany({
      where: { deletedAt: null, joinedAt: { gte: sixMonthsStart } },
      select: { joinedAt: true },
    }),
    prisma.attendance.findMany({
      where: { checkInAt: { gte: thirtyDaysAgo } },
      select: { checkInAt: true },
    }),
    prisma.member.findMany({
      where: { deletedAt: null, dob: { not: null } },
      select: { id: true, name: true, phone: true, memberCode: true, dob: true },
    }),
    prisma.siteSettings.findUnique({ where: { id: "default" } }),
  ]);

  const outstandingDues = dueMemberships.reduce(
    (sum, ms) => sum + computeOutstandingDue(ms.plan.price, ms.discount, ms.pricePaid),
    0
  );

  for (const p of recentPayments6m) {
    const key = istDateKey(p.paidAt).slice(0, 7);
    const bucket = monthBuckets.find((b) => b.key === key);
    if (bucket) bucket.revenue += p.amount;
  }

  for (const m of recentMembers6m) {
    const key = istDateKey(m.joinedAt).slice(0, 7);
    const bucket = monthBuckets.find((b) => b.key === key);
    if (bucket) bucket.newMembers += 1;
  }

  const hourCounts = Array.from({ length: 18 }, (_, i) => i + 5).map((hour) => ({
    hour,
    hourLabel: `${hour}:00`,
    checkIns: 0,
  }));
  for (const a of attendance30d) {
    const h = istHour(a.checkInAt);
    const slot = hourCounts.find((s) => s.hour === h);
    if (slot) slot.checkIns += 1;
  }

  const todayMmDd = todayKey.slice(5);
  const birthdaysToday = membersWithDob.filter((m) => {
    if (!m.dob) return false;
    return istDateKey(m.dob).slice(5) === todayMmDd;
  });

  let sealedLeadsQuery = null;
  if (isRealtimeConfigured()) {
    try {
      sealedLeadsQuery = await getRealtimeServer().seal({ query: recentLeadsLiveQuery() });
    } catch {
      sealedLeadsQuery = null;
    }
  }

  const realtimeUrl =
    process.env.NEXT_PUBLIC_NEON_REALTIME_URL ?? process.env.NEON_REALTIME_URL ?? null;

  const kpis = [
    { label: "Active Members", value: String(activeMembers), href: "/admin/members" },
    { label: "New Joins (Month)", value: String(newJoinsThisMonth), href: "/admin/members" },
    { label: "Expiring in 7d", value: String(expiringMemberships.length), href: "/admin/members" },
    { label: "Expired Members", value: String(expiredMembers), href: "/admin/members" },
    { label: "Today Check-ins", value: String(todayCheckIns), href: "/admin/attendance" },
    {
      label: "Revenue Today",
      value: formatINR(todayPaymentsAgg._sum.amount ?? 0),
      href: "/admin/payments",
    },
    {
      label: "Revenue (Month)",
      value: formatINR(monthPaymentsAgg._sum.amount ?? 0),
      href: "/admin/payments",
    },
    { label: "Outstanding Dues", value: formatINR(outstandingDues), href: "/admin/payments" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Operations Dashboard</h1>
          <p className="text-sm text-[var(--muted-foreground)] mt-1">
            {settings?.gymName ?? "Rafithub"} · Live gym metrics, renewals, collections, and CMS.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/admin/attendance" className="btn-primary px-4 py-2 text-xs">
            Attendance desk
          </Link>
          <Link href="/admin/members" className="btn-outline px-4 py-2 text-xs">
            Members ({activeMembers})
          </Link>
          <Link href="/admin/payments" className="btn-outline px-4 py-2 text-xs">
            Payments
          </Link>
          <Link href="/admin/cms" className="btn-outline px-4 py-2 text-xs">
            Edit website ({newLeadsCount} new leads)
          </Link>
        </div>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {kpis.map((kpi) => (
          <Link
            key={kpi.label}
            href={kpi.href}
            className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 hover:border-[var(--primary)]/50 transition-colors"
          >
            <p className="text-xs text-[var(--muted-foreground)]">{kpi.label}</p>
            <p className="mt-1 font-display text-2xl md:text-3xl text-[var(--primary)] tabular-nums">
              {kpi.value}
            </p>
          </Link>
        ))}
      </div>

      {/* Recharts Analytics */}
      <DashboardCharts
        monthlyData={monthBuckets.map((b) => ({
          month: b.label,
          revenue: b.revenue,
          newMembers: b.newMembers,
        }))}
        peakHours={hourCounts.map(({ hourLabel, checkIns }) => ({ hourLabel, checkIns }))}
      />

      {/* Operational Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Expiring Soon */}
        <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold">Expiring in 7 Days</h2>
            <Link href="/admin/members" className="text-xs text-[var(--primary)] hover:underline">
              All members
            </Link>
          </div>
          {expiringMemberships.length === 0 ? (
            <p className="text-xs text-[var(--muted-foreground)] py-4">
              No memberships expiring in the next 7 days.
            </p>
          ) : (
            <div className="divide-y divide-[var(--border)] text-xs">
              {expiringMemberships.map((ms) => {
                const expiryStr = formatDateIN(ms.endDate);
                const waUrl = buildWhatsAppReminderUrl(ms.member.phone, ms.member.name, expiryStr);
                return (
                  <div key={ms.id} className="py-2.5 flex items-center justify-between gap-2">
                    <div>
                      <Link
                        href={`/admin/members/${ms.member.id}`}
                        className="font-semibold hover:text-[var(--primary)]"
                      >
                        {ms.member.name}
                      </Link>
                      <p className="text-[var(--muted-foreground)]">
                        {ms.plan.name} · Ends {expiryStr}
                      </p>
                    </div>
                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg border border-[var(--border)] px-2.5 py-1 font-semibold hover:border-[var(--primary)]"
                    >
                      WhatsApp
                    </a>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Live Enquiries (Neon Realtime) */}
        <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold">New Leads &amp; Trials</h2>
            <Link href="/admin/leads" className="text-xs text-[var(--primary)] hover:underline">
              Open pipeline
            </Link>
          </div>
          <RealtimeDashboardFeed
            realtimeUrl={realtimeUrl}
            initialLeads={recentLeads}
            sealedLeadsQuery={sealedLeadsQuery}
          />
        </section>

        {/* Birthdays Today */}
        <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold">Birthdays Today</h2>
            <span className="text-xs text-[var(--primary)] font-semibold">
              {birthdaysToday.length}
            </span>
          </div>
          {birthdaysToday.length === 0 ? (
            <p className="text-xs text-[var(--muted-foreground)] py-4">
              No member birthdays today.
            </p>
          ) : (
            <div className="divide-y divide-[var(--border)] text-xs">
              {birthdaysToday.map((m) => (
                <div key={m.id} className="py-2.5 flex items-center justify-between gap-2">
                  <div>
                    <Link
                      href={`/admin/members/${m.id}`}
                      className="font-semibold hover:text-[var(--primary)]"
                    >
                      {m.name}
                    </Link>
                    <p className="text-[var(--muted-foreground)]">{m.memberCode}</p>
                  </div>
                  <a
                    href={`https://wa.me/${m.phone.replace(/[^\d]/g, "")}?text=${encodeURIComponent(
                      `Happy Birthday ${m.name}! Wishing you strength and good health from team Rafithub.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg border border-[var(--border)] px-2.5 py-1 font-semibold hover:border-[var(--primary)]"
                  >
                    Wish on WhatsApp
                  </a>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
