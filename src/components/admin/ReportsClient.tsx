"use client";

import { formatINR } from "@/lib/format";

export interface ReportMonthlyRow {
  month: string;
  totalRevenue: number;
  paymentCount: number;
  newMembers: number;
  checkIns: number;
}

export interface ReportMethodRow {
  method: string;
  total: number;
  count: number;
}

interface ReportsClientProps {
  monthlyRows: ReportMonthlyRow[];
  byMethod: ReportMethodRow[];
  memberBreakdown: Array<{ status: string; count: number }>;
  leadBreakdown: Array<{ status: string; count: number }>;
  totalCollected: number;
}

export function ReportsClient({
  monthlyRows,
  byMethod,
  memberBreakdown,
  leadBreakdown,
  totalCollected,
}: ReportsClientProps) {
  function downloadReportCsv() {
    const header = ["Month", "Revenue (INR)", "Payments Count", "New Members", "Check-ins"];
    const lines = monthlyRows.map((r) => [
      r.month,
      String(r.totalRevenue),
      String(r.paymentCount),
      String(r.newMembers),
      String(r.checkIns),
    ]);
    const csv = [header, ...lines].map((cols) => cols.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `rafithub-monthly-report-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
          <p className="text-xs text-[var(--muted-foreground)]">Total Recorded Revenue</p>
          <p className="mt-1 font-display text-3xl text-[var(--primary)] tabular-nums">
            {formatINR(totalCollected)}
          </p>
        </div>
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
          <p className="text-xs text-[var(--muted-foreground)] mb-2">Revenue by Method</p>
          <div className="space-y-1 text-xs">
            {byMethod.length === 0 ? (
              <p className="text-[var(--muted-foreground)]">No payments yet.</p>
            ) : (
              byMethod.map((row) => (
                <div key={row.method} className="flex justify-between">
                  <span className="font-medium">
                    {row.method} ({row.count})
                  </span>
                  <span className="tabular-nums font-semibold">{formatINR(row.total)}</span>
                </div>
              ))
            )}
          </div>
        </div>
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 flex flex-col justify-between gap-3">
          <div>
            <p className="text-xs text-[var(--muted-foreground)]">Online Checkout</p>
            <p className="text-sm font-semibold mt-1">Razorpay Phase 5 is on hold</p>
            <p className="text-xs text-[var(--muted-foreground)] mt-1">
              Reports include all Cash, UPI, and Card front-desk collections.
            </p>
          </div>
          <button type="button" onClick={downloadReportCsv} className="btn-primary px-4 py-2 text-xs self-start">
            Export monthly CSV
          </button>
        </div>
      </div>

      {/* Monthly Performance Table */}
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 space-y-3">
        <h2 className="text-base font-bold">Last 6 Months Performance</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[var(--border)] text-[var(--muted-foreground)]">
                <th className="py-2.5 pr-4">Month</th>
                <th className="py-2.5 pr-4">Revenue</th>
                <th className="py-2.5 pr-4">Receipts</th>
                <th className="py-2.5 pr-4">New Joins</th>
                <th className="py-2.5">Attendance Check-ins</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {monthlyRows.map((row) => (
                <tr key={row.month}>
                  <td className="py-3 pr-4 font-semibold">{row.month}</td>
                  <td className="py-3 pr-4 text-[var(--primary)] font-semibold tabular-nums">
                    {formatINR(row.totalRevenue)}
                  </td>
                  <td className="py-3 pr-4 tabular-nums">{row.paymentCount}</td>
                  <td className="py-3 pr-4 tabular-nums">{row.newMembers}</td>
                  <td className="py-3 tabular-nums">{row.checkIns}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 space-y-3">
          <h2 className="text-base font-bold">Members by Status</h2>
          <div className="space-y-2 text-xs">
            {memberBreakdown.map((item) => (
              <div key={item.status} className="flex justify-between border-b border-[var(--border)] pb-2">
                <span className="font-medium">{item.status}</span>
                <span className="font-semibold text-[var(--primary)] tabular-nums">{item.count}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 space-y-3">
          <h2 className="text-base font-bold">Leads Funnel Breakdown</h2>
          <div className="space-y-2 text-xs">
            {leadBreakdown.map((item) => (
              <div key={item.status} className="flex justify-between border-b border-[var(--border)] pb-2">
                <span className="font-medium">{item.status}</span>
                <span className="font-semibold text-[var(--primary)] tabular-nums">{item.count}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
