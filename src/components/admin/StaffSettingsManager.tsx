"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { Role } from "@prisma/client";
import { upsertStaffUserAction } from "@/server/actions/admin-cms";
import { clearMustChangePasswordAction } from "@/server/actions/gym-ops";
import { authClient } from "@/lib/auth/client";
import { formatDateIN } from "@/lib/format";

interface StaffSettingsProps {
  staffUsers: Array<{
    id: string;
    name: string;
    email: string;
    role: Role;
    active: boolean;
  }>;
  auditLogs: Array<{
    id: string;
    action: string;
    entity: string;
    entityId: string;
    createdAt: Date | string;
    user: { name: string; email: string } | null;
  }>;
}

const ROLES: Role[] = ["OWNER", "ADMIN", "RECEPTIONIST", "TRAINER"];

export function StaffSettingsManager({ staffUsers, auditLogs }: StaffSettingsProps) {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", role: "ADMIN" as Role });
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPwd, setChangingPwd] = useState(false);

  async function handleChangePassword(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setStatus(null);
    if (newPassword.length < 10) {
      setError("New password must be at least 10 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("New password and confirmation do not match.");
      return;
    }
    setChangingPwd(true);
    try {
      const res = await authClient.changePassword({
        currentPassword,
        newPassword,
        revokeOtherSessions: false,
      });
      if (res?.error) {
        setError(res.error.message ?? "Could not change password.");
        return;
      }
      await clearMustChangePasswordAction();
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setStatus("Your password has been updated successfully.");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not change password.");
    } finally {
      setChangingPwd(false);
    }
  }

  async function handleAddStaff(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setStatus(null);
    try {
      await upsertStaffUserAction({ ...form, active: true });
      setForm({ name: "", email: "", role: "ADMIN" });
      setStatus("Staff member added. They can now sign in with Neon Auth using that email.");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not add staff user.");
    }
  }

  return (
    <div className="space-y-8">
      {status && (
        <div className="rounded-xl border border-[var(--primary)]/30 bg-[var(--primary)]/10 px-4 py-3 text-sm text-[var(--primary)]">
          {status}
        </div>
      )}
      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 space-y-5">
        <h2 className="text-lg font-bold">Staff Accounts &amp; Roles</h2>
        <form onSubmit={handleAddStaff} className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Staff name"
            className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm"
            required
          />
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="Staff email"
            className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm"
            required
          />
          <select
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value as Role })}
            className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm"
          >
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
          <button type="submit" className="btn-primary px-4 py-2 text-xs">
            Add staff user
          </button>
        </form>

        <div className="divide-y divide-[var(--border)]">
          {staffUsers.map((u) => (
            <div key={u.id} className="py-3 flex flex-wrap items-center justify-between gap-3 text-sm">
              <div>
                <p className="font-semibold">{u.name}</p>
                <p className="text-xs text-[var(--muted-foreground)]">{u.email}</p>
              </div>
              <div className="flex items-center gap-3">
                <select
                  value={u.role}
                  onChange={async (e) => {
                    await upsertStaffUserAction({
                      id: u.id,
                      name: u.name,
                      email: u.email,
                      role: e.target.value as Role,
                      active: u.active,
                    });
                    router.refresh();
                  }}
                  className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-2.5 py-1 text-xs"
                >
                  {ROLES.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={async () => {
                    await upsertStaffUserAction({
                      id: u.id,
                      name: u.name,
                      email: u.email,
                      role: u.role,
                      active: !u.active,
                    });
                    router.refresh();
                  }}
                  className={`text-xs font-semibold ${u.active ? "text-[var(--primary)]" : "text-red-400"}`}
                >
                  {u.active ? "Active" : "Disabled"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section
        id="change-password"
        className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 space-y-4"
      >
        <div>
          <h2 className="text-lg font-bold">Change Your Password</h2>
          <p className="text-xs text-[var(--muted-foreground)]">
            Update your Neon Auth sign-in password at any time. Recommended minimum: 10+ characters.
          </p>
        </div>
        <form onSubmit={handleChangePassword} className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Current password"
            className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm"
            required
          />
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="New password (min 10 chars)"
            className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm"
            required
            minLength={10}
          />
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm"
            required
            minLength={10}
          />
          <button type="submit" disabled={changingPwd} className="btn-primary px-4 py-2 text-xs">
            {changingPwd ? "Updating..." : "Update password"}
          </button>
        </form>
      </section>

      <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 space-y-4">
        <h2 className="text-lg font-bold">Recent Audit Log</h2>
        <div className="divide-y divide-[var(--border)] text-xs">
          {auditLogs.map((log) => (
            <div key={log.id} className="py-2.5 flex flex-wrap justify-between gap-2">
              <div>
                <span className="font-semibold text-[var(--primary)]">{log.action}</span>{" "}
                <span className="text-[var(--muted-foreground)]">
                  on {log.entity} ({log.entityId}) by {log.user?.email ?? "System"}
                </span>
              </div>
              <span className="text-[var(--muted-foreground)] tabular-nums">
                {formatDateIN(log.createdAt)}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
