"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import type { Role } from "@prisma/client";
import { authClient } from "@/lib/auth/client";
import { hasPermission, type Permission } from "@/lib/rbac";
import ThemeToggle from "@/components/ThemeToggle";
import {
  HiCash,
  HiChartBar,
  HiCheckCircle,
  HiCog,
  HiCollection,
  HiDocumentReport,
  HiDocumentText,
  HiInbox,
  HiLogout,
  HiMenu,
  HiUserGroup,
  HiUsers,
  HiViewGrid,
  HiX,
} from "react-icons/hi";

interface AdminShellProps {
  user: {
    id: string;
    name: string;
    email: string;
    role: Role;
    mustChangePassword?: boolean;
  };
  children: ReactNode;
}

const NAV_ITEMS: Array<{
  href: string;
  label: string;
  icon: typeof HiViewGrid;
  permission: Permission;
}> = [
  { href: "/admin", label: "Dashboard", icon: HiViewGrid, permission: "dashboard:view" },
  { href: "/admin/members", label: "Members", icon: HiUsers, permission: "members:read" },
  { href: "/admin/attendance", label: "Attendance", icon: HiCheckCircle, permission: "attendance:manage" },
  { href: "/admin/payments", label: "Payments", icon: HiCash, permission: "payments:read" },
  { href: "/admin/leads", label: "Leads", icon: HiInbox, permission: "leads:manage" },
  { href: "/admin/cms", label: "Website CMS", icon: HiDocumentText, permission: "cms:manage" },
  { href: "/admin/plans", label: "Plans", icon: HiCollection, permission: "plans:manage" },
  { href: "/admin/trainers", label: "Trainers", icon: HiUserGroup, permission: "trainers:manage" },
  { href: "/admin/classes", label: "Classes", icon: HiChartBar, permission: "classes:manage" },
  { href: "/admin/reports", label: "Reports", icon: HiDocumentReport, permission: "reports:view" },
  { href: "/admin/settings", label: "Staff & Audit", icon: HiCog, permission: "staff:manage" },
];

export function AdminShell({ user, children }: AdminShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const visibleItems = NAV_ITEMS.filter((item) => hasPermission(user.role, item.permission));
  const mobileQuickItems = visibleItems.filter((i) =>
    ["/admin", "/admin/attendance", "/admin/members", "/admin/payments"].includes(i.href)
  );

  async function handleSignOut() {
    setSigningOut(true);
    try {
      await authClient.signOut();
    } finally {
      window.location.assign("/login");
    }
  }

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex flex-col md:flex-row">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:w-64 md:flex-col border-r border-[var(--border)] bg-[var(--card)] shrink-0">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
          <Link href="/admin" className="font-display text-2xl tracking-wide">
            RAFI<span className="text-[var(--primary)]">THUB</span>
          </Link>
          <span className="rounded-md border border-[var(--border)] bg-[var(--surface)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--primary)]">
            {user.role}
          </span>
        </div>

        <nav className="flex-1 space-y-1 p-3 overflow-y-auto" aria-label="Admin navigation">
          {visibleItems.map((item) => {
            const active =
              item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-[var(--primary)]/12 text-[var(--primary)] border border-[var(--primary)]/25"
                    : "text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
                }`}
              >
                <item.icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-[var(--border)] p-4 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{user.name}</p>
              <p className="truncate text-xs text-[var(--muted-foreground)]">{user.email}</p>
            </div>
            <ThemeToggle />
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="flex-1 rounded-xl border border-[var(--border)] px-3 py-2 text-center text-xs font-medium hover:border-[var(--primary)]"
            >
              View site
            </Link>
            <button
              type="button"
              onClick={handleSignOut}
              disabled={signingOut}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-[var(--border)] px-3 py-2 text-xs font-medium text-[var(--muted-foreground)] hover:border-red-500/40 hover:text-red-400"
            >
              <HiLogout className="w-4 h-4" />
              <span>{signingOut ? "..." : "Sign out"}</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Topbar */}
      <header className="flex md:hidden items-center justify-between border-b border-[var(--border)] bg-[var(--card)] px-4 py-3 sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle admin menu"
            className="rounded-lg border border-[var(--border)] p-2"
          >
            {mobileOpen ? <HiX className="w-5 h-5" /> : <HiMenu className="w-5 h-5" />}
          </button>
          <Link href="/admin" className="font-display text-xl tracking-wide">
            RAFI<span className="text-[var(--primary)]">THUB</span>
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-md border border-[var(--border)] px-2 py-0.5 text-[10px] font-semibold uppercase text-[var(--primary)]">
            {user.role}
          </span>
          <ThemeToggle />
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden border-b border-[var(--border)] bg-[var(--card)] px-4 py-3 space-y-1">
          {visibleItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium hover:bg-[var(--muted)]"
            >
              <item.icon className="w-4 h-4" />
              <span>{item.label}</span>
            </Link>
          ))}
          <div className="pt-2 flex gap-2 border-t border-[var(--border)]">
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                router.push("/");
              }}
              className="flex-1 rounded-xl border border-[var(--border)] py-2 text-xs font-medium"
            >
              View site
            </button>
            <button
              type="button"
              onClick={handleSignOut}
              className="flex-1 rounded-xl border border-red-500/30 py-2 text-xs font-medium text-red-400"
            >
              Sign out
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 min-w-0 p-4 md:p-8 pb-24 md:pb-8">
        <div className="mx-auto max-w-6xl space-y-6">
          {user.mustChangePassword && (
            <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-xs flex flex-wrap items-center justify-between gap-2">
              <span>
                You are signed in with your initial seeded password. Update your password for
                security.
              </span>
              <Link
                href="/admin/settings#change-password"
                className="font-bold text-amber-400 underline"
              >
                Change password
              </Link>
            </div>
          )}
          {children}
        </div>
      </main>

      {/* Mobile Reception Quick Nav */}
      <nav
        aria-label="Mobile quick navigation"
        className="fixed inset-x-0 bottom-0 z-30 flex md:hidden border-t border-[var(--border)] bg-[var(--card)]/95 backdrop-blur-lg"
      >
        {mobileQuickItems.map((item) => {
          const active =
            item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex-1 flex flex-col items-center justify-center py-2 text-[11px] font-medium ${
                active ? "text-[var(--primary)]" : "text-[var(--muted-foreground)]"
              }`}
            >
              <item.icon className="w-5 h-5 mb-0.5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
