"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { LeadStatus } from "@prisma/client";
import { updateLeadAction } from "@/server/actions/admin-cms";
import { convertLeadToMemberAction } from "@/server/actions/gym-ops";
import { formatDateIN } from "@/lib/format";

interface LeadRecord {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  interest: string | null;
  message: string | null;
  source: string;
  status: LeadStatus;
  notes: string | null;
  createdAt: Date | string;
}

const STATUSES: LeadStatus[] = ["NEW", "CONTACTED", "TRIAL_BOOKED", "CONVERTED", "LOST"];

const STATUS_LABELS: Record<LeadStatus, string> = {
  NEW: "New",
  CONTACTED: "Contacted",
  TRIAL_BOOKED: "Trial Booked",
  CONVERTED: "Converted",
  LOST: "Lost",
};

export function LeadsManager({ leads }: { leads: LeadRecord[] }) {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban");
  const [search, setSearch] = useState("");
  const [savingId, setSavingId] = useState<string | null>(null);
  const [notesDraft, setNotesDraft] = useState<Record<string, string>>({});
  const [convertedInfo, setConvertedInfo] = useState<{
    leadId: string;
    memberId: string;
    memberCode: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return leads;
    return leads.filter(
      (l) =>
        l.name.toLowerCase().includes(q) ||
        l.phone.toLowerCase().includes(q) ||
        (l.interest ?? "").toLowerCase().includes(q)
    );
  }, [leads, search]);

  async function handleStatusChange(lead: LeadRecord, nextStatus: LeadStatus) {
    setSavingId(lead.id);
    setError(null);
    try {
      await updateLeadAction({
        id: lead.id,
        status: nextStatus,
        notes: notesDraft[lead.id] ?? lead.notes ?? undefined,
      });
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update lead.");
    } finally {
      setSavingId(null);
    }
  }

  async function handleConvertToMember(lead: LeadRecord) {
    setSavingId(lead.id);
    setError(null);
    try {
      const res = await convertLeadToMemberAction(lead.id);
      setConvertedInfo({ leadId: lead.id, memberId: res.memberId, memberCode: res.memberCode });
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not convert lead.");
    } finally {
      setSavingId(null);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search lead name, phone, interest..."
          className="rounded-xl border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-xs w-full sm:w-72"
        />
        <div className="flex rounded-xl border border-[var(--border)] bg-[var(--card)] p-1 text-xs">
          <button
            type="button"
            onClick={() => setViewMode("kanban")}
            className={`rounded-lg px-3 py-1 font-semibold ${
              viewMode === "kanban"
                ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                : "text-[var(--muted-foreground)]"
            }`}
          >
            Kanban
          </button>
          <button
            type="button"
            onClick={() => setViewMode("list")}
            className={`rounded-lg px-3 py-1 font-semibold ${
              viewMode === "list"
                ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                : "text-[var(--muted-foreground)]"
            }`}
          >
            List
          </button>
        </div>
      </div>

      {convertedInfo && (
        <div className="rounded-xl border border-[var(--primary)]/30 bg-[var(--primary)]/10 px-4 py-2.5 text-xs text-[var(--primary)] flex flex-wrap items-center justify-between gap-2">
          <span>Lead converted to member ({convertedInfo.memberCode}).</span>
          <Link href={`/admin/members/${convertedInfo.memberId}`} className="font-bold underline">
            Open member profile &rarr;
          </Link>
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-xs text-red-400">
          {error}
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8 text-center text-sm text-[var(--muted-foreground)]">
          No enquiries captured yet. Submissions from Contact, Book a Trial, and Join Now appear
          here.
        </div>
      ) : viewMode === "kanban" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4 items-start">
          {STATUSES.map((colStatus) => {
            const items = filtered.filter((l) => l.status === colStatus);
            return (
              <section
                key={colStatus}
                className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-3.5 space-y-3"
              >
                <header className="flex items-center justify-between pb-2 border-b border-[var(--border)]">
                  <h2 className="text-xs font-bold uppercase tracking-wider">
                    {STATUS_LABELS[colStatus]}
                  </h2>
                  <span className="rounded-full bg-[var(--background)] px-2 py-0.5 text-[10px] font-semibold text-[var(--primary)]">
                    {items.length}
                  </span>
                </header>

                <div className="space-y-3">
                  {items.map((lead) => (
                    <article
                      key={lead.id}
                      className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-3 space-y-2 text-xs"
                    >
                      <div>
                        <p className="font-bold text-sm">{lead.name}</p>
                        <p className="text-[var(--muted-foreground)]">{lead.phone}</p>
                        {lead.interest && (
                          <p className="mt-1 text-[var(--primary)] font-medium">{lead.interest}</p>
                        )}
                        <p className="text-[10px] text-[var(--muted-foreground)] mt-1">
                          {lead.source} · {formatDateIN(lead.createdAt)}
                        </p>
                      </div>

                      <select
                        aria-label={`Status for ${lead.name}`}
                        value={lead.status}
                        disabled={savingId === lead.id}
                        onChange={(e) => handleStatusChange(lead, e.target.value as LeadStatus)}
                        className="w-full rounded-lg border border-[var(--border)] bg-[var(--card)] px-2 py-1 text-[11px]"
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {STATUS_LABELS[s]}
                          </option>
                        ))}
                      </select>

                      <div className="flex flex-wrap gap-1.5">
                        <a
                          href={`https://wa.me/${lead.phone.replace(/[^\d]/g, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-lg border border-[var(--border)] px-2 py-1 text-[11px] hover:border-[var(--primary)]"
                        >
                          WhatsApp
                        </a>
                        {lead.status !== "CONVERTED" && (
                          <button
                            type="button"
                            disabled={savingId === lead.id}
                            onClick={() => handleConvertToMember(lead)}
                            className="rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] px-2 py-1 text-[11px] font-semibold"
                          >
                            Convert
                          </button>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((lead) => (
            <div
              key={lead.id}
              className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 space-y-3"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="font-bold text-base">{lead.name}</h3>
                  <p className="text-xs text-[var(--muted-foreground)]">
                    {lead.phone}
                    {lead.email ? ` · ${lead.email}` : ""} · {lead.source} ·{" "}
                    {formatDateIN(lead.createdAt)}
                  </p>
                  {lead.interest && (
                    <p className="mt-1 text-xs font-medium text-[var(--primary)]">
                      Interest: {lead.interest}
                    </p>
                  )}
                  {lead.message && (
                    <p className="mt-1 text-xs text-[var(--muted-foreground)]">{lead.message}</p>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <a
                    href={`https://wa.me/${lead.phone.replace(/[^\d]/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-xl border border-[var(--border)] px-3 py-1.5 text-xs font-medium hover:border-[var(--primary)]"
                  >
                    WhatsApp
                  </a>
                  {lead.status !== "CONVERTED" && (
                    <button
                      type="button"
                      disabled={savingId === lead.id}
                      onClick={() => handleConvertToMember(lead)}
                      className="btn-primary px-3 py-1.5 text-xs"
                    >
                      Convert to Member
                    </button>
                  )}
                  <select
                    value={lead.status}
                    disabled={savingId === lead.id}
                    onChange={(e) => handleStatusChange(lead, e.target.value as LeadStatus)}
                    className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-1.5 text-xs font-semibold"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {STATUS_LABELS[s]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex gap-2">
                <input
                  value={notesDraft[lead.id] ?? lead.notes ?? ""}
                  onChange={(e) => setNotesDraft((prev) => ({ ...prev, [lead.id]: e.target.value }))}
                  placeholder="Follow-up notes..."
                  className="flex-1 rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-1.5 text-xs"
                />
                <button
                  type="button"
                  disabled={savingId === lead.id}
                  onClick={() => handleStatusChange(lead, lead.status)}
                  className="btn-outline px-3 py-1.5 text-xs"
                >
                  Save note
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
