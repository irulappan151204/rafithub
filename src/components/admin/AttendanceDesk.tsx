"use client";

import { useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { recordCheckInAction, recordCheckOutAction } from "@/server/actions/gym-ops";

export interface AttendanceMemberItem {
  id: string;
  memberCode: string;
  name: string;
  phone: string;
  status: string;
  planName: string | null;
  endDate: string | null;
}

export interface TodayAttendanceRow {
  id: string;
  memberId: string;
  memberCode: string;
  memberName: string;
  memberStatus: string;
  checkInAt: string;
  checkOutAt: string | null;
  method: string;
}

interface AttendanceDeskProps {
  members: AttendanceMemberItem[];
  todayLogs: TodayAttendanceRow[];
}

function formatTimeIST(iso: string): string {
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(iso));
}

export function AttendanceDesk({ members, todayLogs }: AttendanceDeskProps) {
  const router = useRouter();
  const [scanInput, setScanInput] = useState("");
  const [search, setSearch] = useState("");
  const [submittingId, setSubmittingId] = useState<string | null>(null);
  const [alert, setAlert] = useState<{
    type: "success" | "blocked" | "error";
    message: string;
    blockedMemberCode?: string;
    blockedMemberId?: string;
  } | null>(null);

  const filteredMembers = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return members.slice(0, 12);
    return members
      .filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.memberCode.toLowerCase().includes(q) ||
          m.phone.toLowerCase().includes(q)
      )
      .slice(0, 20);
  }, [members, search]);

  async function runCheckIn(
    memberCodeOrId: string,
    method: "MANUAL" | "QR",
    overrideBlocked = false
  ) {
    setSubmittingId(memberCodeOrId);
    setAlert(null);
    try {
      const res = await recordCheckInAction({ memberCodeOrId, method, overrideBlocked });
      if (!res.ok) {
        setAlert({
          type: res.blocked ? "blocked" : "error",
          message: res.message,
          blockedMemberCode: res.blocked ? res.memberCode : undefined,
          blockedMemberId: res.blocked ? res.memberId : undefined,
        });
      } else {
        setAlert({ type: "success", message: res.message });
        setScanInput("");
        router.refresh();
      }
    } catch (err) {
      setAlert({
        type: "error",
        message: err instanceof Error ? err.message : "Could not record check-in.",
      });
    } finally {
      setSubmittingId(null);
    }
  }

  async function handleScanSubmit(event: FormEvent) {
    event.preventDefault();
    if (!scanInput.trim()) return;
    await runCheckIn(scanInput.trim(), "QR", false);
  }

  async function handleCheckOut(attendanceId: string) {
    setSubmittingId(attendanceId);
    try {
      await recordCheckOutAction(attendanceId);
      router.refresh();
    } finally {
      setSubmittingId(null);
    }
  }

  return (
    <div className="space-y-6">
      {alert && (
        <div
          className={`rounded-2xl border px-4 py-3 text-xs flex flex-wrap items-center justify-between gap-3 ${
            alert.type === "success"
              ? "border-[var(--primary)]/40 bg-[var(--primary)]/10 text-[var(--primary)]"
              : alert.type === "blocked"
              ? "border-red-500/50 bg-red-500/15 text-red-300"
              : "border-amber-500/40 bg-amber-500/10 text-amber-300"
          }`}
        >
          <span className="font-medium">{alert.message}</span>
          {alert.type === "blocked" && alert.blockedMemberCode && (
            <div className="flex items-center gap-2">
              {alert.blockedMemberId && (
                <Link
                  href={`/admin/members/${alert.blockedMemberId}`}
                  className="btn-outline px-3 py-1 text-xs"
                >
                  Open profile / Renew
                </Link>
              )}
              <button
                type="button"
                onClick={() => runCheckIn(alert.blockedMemberCode!, "MANUAL", true)}
                className="rounded-lg bg-red-500/20 px-3 py-1 font-semibold hover:bg-red-500/30"
              >
                Staff override
              </button>
            </div>
          )}
        </div>
      )}

      {/* QR / Pass Check-In Bar */}
      <form
        onSubmit={handleScanSubmit}
        className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 flex flex-wrap items-center gap-3"
      >
        <div className="flex-1 min-w-[220px]">
          <label htmlFor="qr-pass-input" className="block text-xs font-semibold mb-1">
            QR Scan / Member Code Check-In
          </label>
          <input
            id="qr-pass-input"
            value={scanInput}
            onChange={(e) => setScanInput(e.target.value)}
            placeholder="Scan RAFITHUB:RH-0001 or enter RH-0001 / phone..."
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm font-mono"
          />
        </div>
        <button
          type="submit"
          disabled={submittingId !== null || !scanInput.trim()}
          className="btn-primary px-5 py-2.5 text-xs self-end"
        >
          Check in via QR / Code
        </button>
      </form>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Member Lookup */}
        <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-base font-bold">Desk Member Lookup</h2>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, phone, RH-..."
              className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-1.5 text-xs w-52"
            />
          </div>

          <div className="divide-y divide-[var(--border)] text-xs">
            {filteredMembers.length === 0 ? (
              <p className="py-6 text-center text-[var(--muted-foreground)]">
                No matching members.
              </p>
            ) : (
              filteredMembers.map((m) => (
                <div key={m.id} className="py-3 flex items-center justify-between gap-3">
                  <div>
                    <Link
                      href={`/admin/members/${m.id}`}
                      className="font-semibold hover:text-[var(--primary)]"
                    >
                      {m.name} <span className="font-mono text-[var(--primary)]">({m.memberCode})</span>
                    </Link>
                    <p className="text-[var(--muted-foreground)]">
                      {m.phone} ·{" "}
                      <span
                        className={
                          m.status === "ACTIVE" ? "text-[var(--primary)]" : "text-red-400 font-semibold"
                        }
                      >
                        {m.status}
                      </span>
                      {m.planName ? ` · ${m.planName}` : ""}
                    </p>
                  </div>
                  <button
                    type="button"
                    disabled={submittingId === m.id}
                    onClick={() => runCheckIn(m.id, "MANUAL", false)}
                    className={
                      m.status === "ACTIVE"
                        ? "btn-primary px-3 py-1.5 text-xs"
                        : "btn-outline px-3 py-1.5 text-xs border-red-500/40 text-red-300"
                    }
                  >
                    {m.status === "ACTIVE" ? "Check in" : "Check status"}
                  </button>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Today's Check-Ins */}
        <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold">Today&apos;s Check-ins ({todayLogs.length})</h2>
          </div>

          <div className="divide-y divide-[var(--border)] text-xs">
            {todayLogs.length === 0 ? (
              <p className="py-6 text-center text-[var(--muted-foreground)]">
                No check-ins recorded yet today.
              </p>
            ) : (
              todayLogs.map((row) => (
                <div key={row.id} className="py-3 flex items-center justify-between gap-3">
                  <div>
                    <Link
                      href={`/admin/members/${row.memberId}`}
                      className="font-semibold hover:text-[var(--primary)]"
                    >
                      {row.memberName}{" "}
                      <span className="font-mono text-[var(--muted-foreground)]">
                        ({row.memberCode})
                      </span>
                    </Link>
                    <p className="text-[var(--muted-foreground)] tabular-nums">
                      In: {formatTimeIST(row.checkInAt)} ({row.method})
                      {row.checkOutAt ? ` · Out: ${formatTimeIST(row.checkOutAt)}` : ""}
                    </p>
                  </div>
                  {!row.checkOutAt ? (
                    <button
                      type="button"
                      disabled={submittingId === row.id}
                      onClick={() => handleCheckOut(row.id)}
                      className="btn-outline px-3 py-1.5 text-xs"
                    >
                      Check out
                    </button>
                  ) : (
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                      Completed
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
