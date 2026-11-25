"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { MemberStatus } from "@prisma/client";
import {
  importMembersCsvAction,
  softDeleteMemberAction,
  upsertMemberAction,
} from "@/server/actions/gym-ops";
import { formatDateIN } from "@/lib/format";
import { ImageUploader } from "./ImageUploader";

interface MemberRow {
  id: string;
  memberCode: string;
  name: string;
  phone: string;
  email: string | null;
  status: MemberStatus;
  trainerName: string | null;
  activePlanName: string | null;
  expiryDate: string | null;
}

interface MembersDirectoryProps {
  members: MemberRow[];
  plans: Array<{ id: string; name: string; price: number }>;
  trainers: Array<{ id: string; name: string }>;
  canDelete: boolean;
}

export function MembersDirectory({
  members,
  plans,
  trainers,
  canDelete,
}: MembersDirectoryProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [page, setPage] = useState(1);
  const pageSize = 15;

  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    gender: "",
    goal: "",
    source: "walk-in",
    assignedTrainerId: "",
    initialPlanId: "",
    photoUrl: "",
    photoKey: "",
    healthNotes: "",
  });

  const [csvPreview, setCsvPreview] = useState<{
    rows: Array<Record<string, string>>;
    validCount: number;
    skippedCount: number;
    errors: Array<{ row: number; reason: string }>;
  } | null>(null);

  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const filtered = members.filter((m) => {
    const matchesStatus = statusFilter === "ALL" || m.status === statusFilter;
    const q = search.trim().toLowerCase();
    const matchesQuery =
      !q ||
      m.name.toLowerCase().includes(q) ||
      m.phone.toLowerCase().includes(q) ||
      m.memberCode.toLowerCase().includes(q);
    return matchesStatus && matchesQuery;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  async function handleCreateMember(event: FormEvent) {
    event.preventDefault();
    setErrorMsg(null);
    setStatusMsg(null);
    try {
      await upsertMemberAction({
        ...form,
        assignedTrainerId: form.assignedTrainerId || null,
        initialPlanId: form.initialPlanId || "",
      });
      setShowAdd(false);
      setForm({
        name: "",
        phone: "",
        email: "",
        gender: "",
        goal: "",
        source: "walk-in",
        assignedTrainerId: "",
        initialPlanId: "",
        photoUrl: "",
        photoKey: "",
        healthNotes: "",
      });
      setStatusMsg("Member added.");
      router.refresh();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Could not create member.");
    }
  }

  async function handleCsvFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setErrorMsg(null);
    const text = await file.text();
    const lines = text
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);
    if (lines.length < 2) {
      setErrorMsg("CSV must include a header row and at least one member row.");
      return;
    }
    const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
    const rows = lines.slice(1).map((line) => {
      const cols = line.split(",").map((c) => c.trim());
      const obj: Record<string, string> = {};
      headers.forEach((h, i) => {
        obj[h] = cols[i] ?? "";
      });
      return obj;
    });
    const result = await importMembersCsvAction(rows, true);
    setCsvPreview({ rows, ...result });
    event.target.value = "";
  }

  async function confirmCsvImport() {
    if (!csvPreview) return;
    const res = await importMembersCsvAction(csvPreview.rows, false);
    setCsvPreview(null);
    setStatusMsg(`Imported ${res.createdCount} new member(s).`);
    router.refresh();
  }

  function exportCsv() {
    const header = "memberCode,name,phone,email,status,plan,expiry\n";
    const body = filtered
      .map(
        (m) =>
          `"${m.memberCode}","${m.name.replace(/"/g, '""')}","${m.phone}","${m.email ?? ""}","${m.status}","${m.activePlanName ?? ""}","${m.expiryDate ? formatDateIN(m.expiryDate) : ""}"`
      )
      .join("\n");
    const blob = new Blob([header + body], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "rafithub-members.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      {statusMsg && (
        <div className="rounded-xl border border-[var(--primary)]/30 bg-[var(--primary)]/10 px-4 py-3 text-sm text-[var(--primary)]">
          {statusMsg}
        </div>
      )}
      {errorMsg && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {errorMsg}
        </div>
      )}

      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search name, phone, or RH-0001..."
            className="w-full sm:w-64 rounded-xl border border-[var(--border)] bg-[var(--card)] px-3.5 py-2 text-sm"
          />
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="rounded-xl border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm"
          >
            <option value="ALL">All statuses</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="EXPIRED">EXPIRED</option>
            <option value="FROZEN">FROZEN</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>
        </div>

        <div className="flex flex-wrap gap-2">
          <label className="btn-outline cursor-pointer px-3.5 py-2 text-xs">
            Import CSV
            <input type="file" accept=".csv" onChange={handleCsvFile} className="sr-only" />
          </label>
          <button type="button" onClick={exportCsv} className="btn-outline px-3.5 py-2 text-xs">
            Export CSV
          </button>
          <button
            type="button"
            onClick={() => setShowAdd(!showAdd)}
            className="btn-primary px-4 py-2 text-xs"
          >
            {showAdd ? "Close form" : "Add member"}
          </button>
        </div>
      </div>

      {/* CSV Dry-Run Preview */}
      {csvPreview && (
        <div className="rounded-2xl border border-[var(--primary)]/30 bg-[var(--card)] p-5 space-y-3 text-sm">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="font-bold">CSV Dry-Run Preview</h3>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setCsvPreview(null)}
                className="btn-outline px-3 py-1.5 text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmCsvImport}
                disabled={csvPreview.validCount === 0}
                className="btn-primary px-4 py-1.5 text-xs"
              >
                Import {csvPreview.validCount} valid row(s)
              </button>
            </div>
          </div>
          <p className="text-xs text-[var(--muted-foreground)]">
            Valid: <strong>{csvPreview.validCount}</strong> · Skipped/invalid:{" "}
            <strong>{csvPreview.skippedCount}</strong>
          </p>
          {csvPreview.errors.length > 0 && (
            <ul className="text-xs text-red-400 space-y-1 max-h-28 overflow-y-auto">
              {csvPreview.errors.map((e, idx) => (
                <li key={idx}>
                  Row {e.row}: {e.reason}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Add Member Form */}
      {showAdd && (
        <form
          onSubmit={handleCreateMember}
          className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 space-y-4"
        >
          <h2 className="text-lg font-bold">New Member</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Full Name *"
              className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm"
            />
            <input
              required
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="Phone * (+91...)"
              className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm"
            />
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="Email (optional)"
              className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm"
            />
            <select
              value={form.initialPlanId}
              onChange={(e) => setForm({ ...form, initialPlanId: e.target.value })}
              className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm"
            >
              <option value="">Assign plan (optional)</option>
              {plans.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} (₹{p.price})
                </option>
              ))}
            </select>
            <select
              value={form.assignedTrainerId}
              onChange={(e) => setForm({ ...form, assignedTrainerId: e.target.value })}
              className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm"
            >
              <option value="">Assign trainer (optional)</option>
              {trainers.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
            <input
              value={form.goal}
              onChange={(e) => setForm({ ...form, goal: e.target.value })}
              placeholder="Goal (Fat loss, Muscle gain...)"
              className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm"
            />
          </div>
          <ImageUploader
            folder="members"
            visibility="private"
            currentUrl={form.photoUrl}
            label="Upload member photo (private Neon bucket)"
            onUploaded={({ url, key }) =>
              setForm((prev) => ({ ...prev, photoUrl: url, photoKey: key }))
            }
          />
          <button type="submit" className="btn-primary px-5 py-2.5 text-xs">
            Save member
          </button>
        </form>
      )}

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-[var(--border)] bg-[var(--card)]">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-[var(--border)] text-xs text-[var(--muted-foreground)]">
            <tr>
              <th className="px-4 py-3">Code</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Plan / Expiry</th>
              <th className="px-4 py-3">Trainer</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-[var(--muted-foreground)]">
                  No matching members found.
                </td>
              </tr>
            ) : (
              paginated.map((m) => (
                <tr key={m.id} className="hover:bg-[var(--muted)]/40">
                  <td className="px-4 py-3 font-mono text-xs tabular-nums">{m.memberCode}</td>
                  <td className="px-4 py-3 font-medium">
                    <Link href={`/admin/members/${m.id}`} className="hover:text-[var(--primary)]">
                      {m.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 tabular-nums text-xs">{m.phone}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full border border-[var(--border)] px-2.5 py-0.5 text-[11px] font-semibold">
                      {m.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs">
                    {m.activePlanName ? (
                      <span>
                        {m.activePlanName}
                        {m.expiryDate ? ` · ${formatDateIN(m.expiryDate)}` : ""}
                      </span>
                    ) : (
                      <span className="text-[var(--muted-foreground)]">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-xs">{m.trainerName ?? "—"}</td>
                  <td className="px-4 py-3 text-right space-x-3 text-xs">
                    <Link
                      href={`/admin/members/${m.id}`}
                      className="text-[var(--primary)] font-semibold hover:underline"
                    >
                      Profile
                    </Link>
                    {canDelete && (
                      <button
                        type="button"
                        onClick={async () => {
                          await softDeleteMemberAction(m.id);
                          router.refresh();
                        }}
                        className="text-red-400 hover:underline"
                      >
                        Archive
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between text-xs text-[var(--muted-foreground)]">
          <span>
            Page {page} of {totalPages} ({filtered.length} members)
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="btn-outline px-3 py-1.5 disabled:opacity-40"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="btn-outline px-3 py-1.5 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
