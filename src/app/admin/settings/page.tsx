import { prisma } from "@/lib/db";
import { requireStaff } from "@/lib/auth/server";
import { StaffSettingsManager } from "@/components/admin/StaffSettingsManager";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  await requireStaff({ permission: "staff:manage" });

  const [staffUsers, auditLogs] = await Promise.all([
    prisma.user.findMany({
      orderBy: [{ role: "asc" }, { createdAt: "asc" }],
      select: { id: true, name: true, email: true, role: true, active: true },
    }),
    prisma.auditLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 30,
      include: { user: { select: { name: true, email: true } } },
    }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Staff &amp; Audit Log</h1>
        <p className="text-sm text-[var(--muted-foreground)] mt-1">
          Control who can access the admin panel and review every CMS/data change.
        </p>
      </div>
      <StaffSettingsManager staffUsers={staffUsers} auditLogs={auditLogs} />
    </div>
  );
}
