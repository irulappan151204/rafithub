"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  addBodyMeasurementAction,
  assignOrRenewMembershipAction,
  freezeMembershipAction,
  recordManualPaymentAction,
  unfreezeMembershipAction,
} from "@/server/actions/gym-ops";
import { formatDateIN, formatINR } from "@/lib/format";
import { buildWhatsAppReminderUrl } from "@/server/services/gym-ops";
import { MemberPassCard } from "@/components/admin/MemberPassCard";

interface MemberProfileProps {
  member: {
    id: string;
    memberCode: string;
    name: string;
    phone: string;
    email: string | null;
    status: string;
    goal: string | null;
    healthNotes: string | null;
    joinedAt: string;
    trainerName: string | null;
  };
  memberships: Array<{
    id: string;
    planName: string;
    planPrice: number;
    startDate: string;
    endDate: string;
    status: string;
    pricePaid: number;
    discount: number;
  }>;
  payments: Array<{
    id: string;
    receiptNo: string;
    amount: number;
    method: string;
    paidAt: string;
    notes: string | null;
  }>;
  attendances: Array<{ id: string; checkInAt: string; method: string }>;
  measurements: Array<{
    id: string;
    date: string;
    weight: number | null;
    bodyFat: number | null;
    waist: number | null;
  }>;
  plans: Array<{ id: string; name: string; price: number }>;
  canWriteMembers: boolean;
  canWritePayments: boolean;
  canViewHealthNotes: boolean;
}

export function MemberProfileClient({
  member,
  memberships,
  payments,
  attendances,
  measurements,
  plans,
  canWriteMembers,
  canWritePayments,
  canViewHealthNotes,
}: MemberProfileProps) {
  const router = useRouter();
  const [renewPlanId, setRenewPlanId] = useState(plans[0]?.id ?? "");
  const [renewPaid, setRenewPaid] = useState(plans[0]?.price ?? 2000);
  const [renewMethod, setRenewMethod] = useState<"CASH" | "UPI" | "CARD">("CASH");

  const [payAmount, setPayAmount] = useState(0);
  const [payMethod, setPayMethod] = useState<"CASH" | "UPI" | "CARD">("UPI");
  const [payNotes, setPayNotes] = useState("");

  const [weight, setWeight] = useState("");
  const [bodyFat, setBodyFat] = useState("");
  const [waist, setWaist] = useState("");

  const [msg, setMsg] = useState<string | null>(null);

  const latestMembership = memberships[0];
  const whatsappReminderUrl = latestMembership
    ? buildWhatsAppReminderUrl(member.phone, member.name, formatDateIN(latestMembership.endDate))
    : `https://wa.me/${member.phone.replace(/[^\d]/g, "")}`;

  async function handleRenew(event: FormEvent) {
    event.preventDefault();
    await assignOrRenewMembershipAction({
      memberId: member.id,
      planId: renewPlanId,
      amountPaid: renewPaid,
      paymentMethod: renewMethod,
      discount: 0,
    });
    setMsg("Membership assigned / renewed.");
    router.refresh();
  }

  async function handlePayment(event: FormEvent) {
    event.preventDefault();
    await recordManualPaymentAction({
      memberId: member.id,
      membershipId: latestMembership?.id ?? null,
      amount: payAmount,
      method: payMethod,
      notes: payNotes,
    });
    setPayAmount(0);
    setPayNotes("");
    setMsg("Payment recorded.");
    router.refresh();
  }

  async function handleMeasurement(event: FormEvent) {
    event.preventDefault();
    await addBodyMeasurementAction({
      memberId: member.id,
      weight: weight ? Number(weight) : undefined,
      bodyFat: bodyFat ? Number(bodyFat) : undefined,
      waist: waist ? Number(waist) : undefined,
    });
    setWeight("");
    setBodyFat("");
    setWaist("");
    setMsg("Measurement saved.");
    router.refresh();
  }

  return (
    <div className="space-y-6">
      {msg && (
        <div className="rounded-xl border border-[var(--primary)]/30 bg-[var(--primary)]/10 px-4 py-3 text-sm text-[var(--primary)]">
          {msg}
        </div>
      )}

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-mono text-xs text-[var(--primary)]">{member.memberCode}</p>
          <h1 className="text-2xl font-bold mt-1">{member.name}</h1>
          <p className="text-sm text-[var(--muted-foreground)] mt-1">
            {member.phone}
            {member.email ? ` · ${member.email}` : ""} · Joined {formatDateIN(member.joinedAt)}
          </p>
          <p className="text-xs text-[var(--muted-foreground)] mt-1">
            Status: <strong>{member.status}</strong> · Trainer: {member.trainerName ?? "Unassigned"}
            {member.goal ? ` · Goal: ${member.goal}` : ""}
          </p>
          {canViewHealthNotes && member.healthNotes && (
            <p className="mt-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs">
              Health Notes: {member.healthNotes}
            </p>
          )}
        </div>

        <div className="flex flex-col items-stretch sm:items-end gap-3">
          <MemberPassCard
            memberCode={member.memberCode}
            memberName={member.name}
            status={member.status}
          />
          <div className="flex flex-wrap gap-2">
            <a
              href={whatsappReminderUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary px-4 py-2 text-xs"
            >
              Send WhatsApp reminder
            </a>
            <Link href="/admin/members" className="btn-outline px-4 py-2 text-xs">
              Back to members
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Renew / Assign Plan */}
        {canWriteMembers && (
          <form
            onSubmit={handleRenew}
            className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 space-y-3"
          >
            <h2 className="font-bold text-base">Assign / Renew Membership</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <select
                value={renewPlanId}
                onChange={(e) => {
                  const id = e.target.value;
                  setRenewPlanId(id);
                  const found = plans.find((p) => p.id === id);
                  if (found) setRenewPaid(found.price);
                }}
                className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-xs"
              >
                {plans.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({formatINR(p.price)})
                  </option>
                ))}
              </select>
              <input
                type="number"
                min={0}
                value={renewPaid}
                onChange={(e) => setRenewPaid(Number(e.target.value))}
                placeholder="Amount paid"
                className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-xs"
              />
              <select
                value={renewMethod}
                onChange={(e) => setRenewMethod(e.target.value as "CASH" | "UPI" | "CARD")}
                className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-xs"
              >
                <option value="CASH">CASH</option>
                <option value="UPI">UPI</option>
                <option value="CARD">CARD</option>
              </select>
            </div>
            <button type="submit" className="btn-primary px-4 py-2 text-xs">
              Assign / Renew plan
            </button>
          </form>
        )}

        {/* Record Payment */}
        {canWritePayments && (
          <form
            onSubmit={handlePayment}
            className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 space-y-3"
          >
            <h2 className="font-bold text-base">Record Manual Payment</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <input
                type="number"
                min={1}
                required
                value={payAmount || ""}
                onChange={(e) => setPayAmount(Number(e.target.value))}
                placeholder="Amount (INR)"
                className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-xs"
              />
              <select
                value={payMethod}
                onChange={(e) => setPayMethod(e.target.value as "CASH" | "UPI" | "CARD")}
                className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-xs"
              >
                <option value="UPI">UPI</option>
                <option value="CASH">CASH</option>
                <option value="CARD">CARD</option>
              </select>
              <input
                value={payNotes}
                onChange={(e) => setPayNotes(e.target.value)}
                placeholder="Notes"
                className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-xs"
              />
            </div>
            <button type="submit" className="btn-primary px-4 py-2 text-xs">
              Record payment
            </button>
          </form>
        )}
      </div>

      {/* Memberships History */}
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 space-y-3">
        <h2 className="font-bold text-base">Membership History</h2>
        <div className="divide-y divide-[var(--border)] text-sm">
          {memberships.map((ms) => (
            <div key={ms.id} className="py-2.5 flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="font-semibold">
                  {ms.planName} · <span className="text-xs text-[var(--primary)]">{ms.status}</span>
                </p>
                <p className="text-xs text-[var(--muted-foreground)]">
                  {formatDateIN(ms.startDate)} – {formatDateIN(ms.endDate)} · Paid{" "}
                  {formatINR(ms.pricePaid)} / {formatINR(ms.planPrice)}
                </p>
              </div>
              {canWriteMembers && (
                <div className="flex gap-2 text-xs">
                  {ms.status === "ACTIVE" && (
                    <button
                      type="button"
                      onClick={async () => {
                        await freezeMembershipAction(ms.id);
                        router.refresh();
                      }}
                      className="btn-outline px-3 py-1"
                    >
                      Freeze
                    </button>
                  )}
                  {ms.status === "FROZEN" && (
                    <button
                      type="button"
                      onClick={async () => {
                        await unfreezeMembershipAction(ms.id);
                        router.refresh();
                      }}
                      className="btn-primary px-3 py-1"
                    >
                      Unfreeze
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payments */}
        <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 space-y-3">
          <h2 className="font-bold text-base">Payments &amp; Receipts</h2>
          <div className="divide-y divide-[var(--border)] text-xs">
            {payments.map((p) => (
              <div key={p.id} className="py-2.5 flex items-center justify-between">
                <div>
                  <p className="font-semibold">
                    {formatINR(p.amount)} ({p.method})
                  </p>
                  <p className="text-[var(--muted-foreground)]">
                    {p.receiptNo} · {formatDateIN(p.paidAt)}
                  </p>
                </div>
                <Link
                  href={`/admin/receipts/${p.id}`}
                  className="text-[var(--primary)] font-semibold hover:underline"
                >
                  Print receipt
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Measurements & Attendance */}
        <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 space-y-4">
          <h2 className="font-bold text-base">Body Measurements &amp; Check-ins</h2>
          {canViewHealthNotes && (
            <form onSubmit={handleMeasurement} className="grid grid-cols-4 gap-2">
              <input
                type="number"
                step="0.1"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="kg"
                className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-2.5 py-1.5 text-xs"
              />
              <input
                type="number"
                step="0.1"
                value={bodyFat}
                onChange={(e) => setBodyFat(e.target.value)}
                placeholder="Fat %"
                className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-2.5 py-1.5 text-xs"
              />
              <input
                type="number"
                step="0.1"
                value={waist}
                onChange={(e) => setWaist(e.target.value)}
                placeholder="Waist cm"
                className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-2.5 py-1.5 text-xs"
              />
              <button type="submit" className="btn-outline px-2 py-1.5 text-xs">
                Log
              </button>
            </form>
          )}
          <div className="space-y-2 text-xs">
            {measurements.slice(0, 5).map((m) => (
              <div key={m.id} className="flex justify-between text-[var(--muted-foreground)]">
                <span>{formatDateIN(m.date)}</span>
                <span>
                  {m.weight ? `${m.weight} kg` : "—"} · {m.bodyFat ? `${m.bodyFat}% fat` : "—"} ·{" "}
                  {m.waist ? `${m.waist} cm waist` : "—"}
                </span>
              </div>
            ))}
          </div>
          <div className="border-t border-[var(--border)] pt-3">
            <p className="text-xs font-semibold mb-2">Recent Check-ins ({attendances.length})</p>
            <div className="space-y-1 text-xs text-[var(--muted-foreground)]">
              {attendances.slice(0, 6).map((a) => (
                <div key={a.id} className="flex justify-between">
                  <span>{formatDateIN(a.checkInAt)}</span>
                  <span>{a.method}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
