"use client";

import { useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import { recordManualPaymentAction } from "@/server/actions/gym-ops";
import { formatDateIN, formatINR } from "@/lib/format";

export interface PaymentRow {
  id: string;
  receiptNo: string;
  amount: number;
  method: string;
  status: string;
  paidAt: string;
  notes: string | null;
  memberId: string;
  memberName: string;
  memberCode: string;
  memberPhone: string;
  planName: string | null;
  collectedByName: string | null;
}

export interface DueMembershipRow {
  membershipId: string;
  memberId: string;
  memberName: string;
  memberCode: string;
  planName: string;
  dueAmount: number;
}

export interface PaymentMemberOption {
  id: string;
  memberCode: string;
  name: string;
  phone: string;
  latestMembershipId: string | null;
}

interface PaymentsManagerProps {
  payments: PaymentRow[];
  dues: DueMembershipRow[];
  members: PaymentMemberOption[];
  todayTotal: number;
  monthTotal: number;
  canWritePayments: boolean;
}

export function PaymentsManager({
  payments,
  dues,
  members,
  todayTotal,
  monthTotal,
  canWritePayments,
}: PaymentsManagerProps) {
  const [search, setSearch] = useState("");
  const [methodFilter, setMethodFilter] = useState<string>("ALL");

  const [memberId, setMemberId] = useState(members[0]?.id ?? "");
  const [amount, setAmount] = useState<number>(2000);
  const [method, setMethod] = useState<"CASH" | "UPI" | "CARD">("UPI");
  const [notes, setNotes] = useState("");
  const [selectedMembershipId, setSelectedMembershipId] = useState<string>(
    members[0]?.latestMembershipId ?? ""
  );
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const totalDue = useMemo(() => dues.reduce((acc, item) => acc + item.dueAmount, 0), [dues]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return payments.filter((p) => {
      const matchesMethod = methodFilter === "ALL" || p.method === methodFilter;
      const matchesQuery =
        !q ||
        p.receiptNo.toLowerCase().includes(q) ||
        p.memberName.toLowerCase().includes(q) ||
        p.memberCode.toLowerCase().includes(q) ||
        p.memberPhone.toLowerCase().includes(q);
      return matchesMethod && matchesQuery;
    });
  }, [payments, search, methodFilter]);

  function handleMemberChange(nextId: string) {
    setMemberId(nextId);
    const foundMember = members.find((m) => m.id === nextId);
    setSelectedMembershipId(foundMember?.latestMembershipId ?? "");
  }

  function prefillFromDue(due: DueMembershipRow) {
    setMemberId(due.memberId);
    setSelectedMembershipId(due.membershipId);
    setAmount(due.dueAmount);
    setNotes(`Balance due for ${due.planName}`);
    setFeedback(null);
    setError(null);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!memberId) return;
    setSaving(true);
    setFeedback(null);
    setError(null);
    try {
      const created = await recordManualPaymentAction({
        memberId,
        membershipId: selectedMembershipId || null,
        amount,
        method,
        notes,
      });
      setNotes("");
      setFeedback(`Payment recorded (${created.receiptNo}).`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to record payment.");
    } finally {
      setSaving(false);
    }
  }

  function exportCsv() {
    const header = ["Receipt No", "Date", "Member Code", "Member", "Phone", "Plan", "Method", "Amount", "Notes"];
    const rows = filtered.map((p) => [
      p.receiptNo,
      formatDateIN(p.paidAt),
      p.memberCode,
      p.memberName,
      p.memberPhone,
      p.planName ?? "",
      p.method,
      String(p.amount),
      p.notes ?? "",
    ]);
    const csv = [header, ...rows]
      .map((cols) => cols.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `rafithub-payments-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      {/* KPI strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4">
          <p className="text-xs text-[var(--muted-foreground)]">Collected Today</p>
          <p className="mt-1 font-display text-3xl text-[var(--primary)] tabular-nums">
            {formatINR(todayTotal)}
          </p>
        </div>
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4">
          <p className="text-xs text-[var(--muted-foreground)]">Collected This Month</p>
          <p className="mt-1 font-display text-3xl text-[var(--foreground)] tabular-nums">
            {formatINR(monthTotal)}
          </p>
        </div>
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4">
          <p className="text-xs text-[var(--muted-foreground)]">Outstanding Dues ({dues.length})</p>
          <p className="mt-1 font-display text-3xl text-amber-400 tabular-nums">
            {formatINR(totalDue)}
          </p>
        </div>
      </div>

      {feedback && (
        <div className="rounded-xl border border-[var(--primary)]/30 bg-[var(--primary)]/10 px-4 py-2.5 text-xs text-[var(--primary)]">
          {feedback}
        </div>
      )}
      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-xs text-red-400">
          {error}
        </div>
      )}

      {/* Manual Desk Payment Form */}
      {canWritePayments && (
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 space-y-4"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-base font-bold">Record Front-Desk Payment</h2>
              <p className="text-xs text-[var(--muted-foreground)]">
                Log Cash, UPI, or Card receipts. Online Razorpay checkout is currently on hold (Phase 5).
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            <select
              value={memberId}
              onChange={(e) => handleMemberChange(e.target.value)}
              required
              className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-xs lg:col-span-2"
            >
              {members.length === 0 ? (
                <option value="">No active members found</option>
              ) : (
                members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.memberCode} — {m.name} ({m.phone})
                  </option>
                ))
              )}
            </select>

            <input
              type="number"
              min={1}
              required
              value={amount || ""}
              onChange={(e) => setAmount(Number(e.target.value))}
              placeholder="Amount (INR)"
              className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-xs"
            />

            <select
              value={method}
              onChange={(e) => setMethod(e.target.value as "CASH" | "UPI" | "CARD")}
              className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-xs"
            >
              <option value="UPI">UPI</option>
              <option value="CASH">CASH</option>
              <option value="CARD">CARD</option>
            </select>

            <input
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Notes (optional)"
              className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-xs"
            />
          </div>

          <button type="submit" disabled={saving || !memberId} className="btn-primary px-5 py-2 text-xs">
            {saving ? "Recording..." : "Record payment & generate receipt"}
          </button>
        </form>
      )}

      {/* Outstanding Dues */}
      {dues.length > 0 && (
        <section className="rounded-2xl border border-amber-500/30 bg-[var(--card)] p-5 space-y-3">
          <h2 className="text-base font-bold text-amber-400">Pending Membership Balances</h2>
          <div className="divide-y divide-[var(--border)] text-xs">
            {dues.slice(0, 8).map((due) => (
              <div key={due.membershipId} className="py-2.5 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <Link
                    href={`/admin/members/${due.memberId}`}
                    className="font-semibold hover:text-[var(--primary)]"
                  >
                    {due.memberName} ({due.memberCode})
                  </Link>
                  <p className="text-[var(--muted-foreground)]">{due.planName}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-amber-400 tabular-nums">
                    Due {formatINR(due.dueAmount)}
                  </span>
                  {canWritePayments && (
                    <button
                      type="button"
                      onClick={() => prefillFromDue(due)}
                      className="btn-outline px-3 py-1 text-xs"
                    >
                      Collect
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Payment Ledger */}
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2 flex-1">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search receipt no, member name, code, phone..."
              className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-xs w-full sm:w-72"
            />
            <select
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
              className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-xs"
            >
              <option value="ALL">All methods</option>
              <option value="UPI">UPI</option>
              <option value="CASH">CASH</option>
              <option value="CARD">CARD</option>
            </select>
          </div>
          <button type="button" onClick={exportCsv} className="btn-outline px-4 py-2 text-xs">
            Export CSV
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[var(--border)] text-[var(--muted-foreground)]">
                <th className="py-2.5 pr-3">Receipt</th>
                <th className="py-2.5 pr-3">Date</th>
                <th className="py-2.5 pr-3">Member</th>
                <th className="py-2.5 pr-3">Method</th>
                <th className="py-2.5 pr-3">Amount</th>
                <th className="py-2.5 pr-3">Collected By</th>
                <th className="py-2.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-[var(--muted-foreground)]">
                    No payments match your filter.
                  </td>
                </tr>
              ) : (
                filtered.map((p) => (
                  <tr key={p.id}>
                    <td className="py-3 pr-3 font-mono font-semibold">{p.receiptNo}</td>
                    <td className="py-3 pr-3 tabular-nums text-[var(--muted-foreground)]">
                      {formatDateIN(p.paidAt)}
                    </td>
                    <td className="py-3 pr-3">
                      <Link
                        href={`/admin/members/${p.memberId}`}
                        className="font-semibold hover:text-[var(--primary)]"
                      >
                        {p.memberName}
                      </Link>
                      <span className="block text-[10px] text-[var(--muted-foreground)]">
                        {p.memberCode} {p.planName ? `· ${p.planName}` : ""}
                      </span>
                    </td>
                    <td className="py-3 pr-3 font-medium">{p.method}</td>
                    <td className="py-3 pr-3 font-semibold text-[var(--primary)] tabular-nums">
                      {formatINR(p.amount)}
                    </td>
                    <td className="py-3 pr-3 text-[var(--muted-foreground)]">
                      {p.collectedByName ?? "System"}
                    </td>
                    <td className="py-3 text-right">
                      <Link
                        href={`/admin/receipts/${p.id}`}
                        className="text-[var(--primary)] font-semibold hover:underline"
                      >
                        Print receipt
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
