import { prisma } from "@/lib/db";
import { requireStaff } from "@/lib/auth/server";
import { hasPermission } from "@/lib/rbac";
import { MembersDirectory } from "@/components/admin/MembersDirectory";

export const dynamic = "force-dynamic";

export default async function AdminMembersPage() {
  const staff = await requireStaff({ permission: "members:read" });

  const [members, plans, trainers] = await Promise.all([
    prisma.member.findMany({
      where: {
        deletedAt: null,
        ...(staff.user.role === "TRAINER"
          ? { assignedTrainer: { name: { contains: staff.user.name.split(" ")[0] } } }
          : {}),
      },
      include: {
        assignedTrainer: { select: { name: true } },
        memberships: {
          where: { deletedAt: null },
          orderBy: { endDate: "desc" },
          take: 1,
          include: { plan: { select: { name: true } } },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.plan.findMany({
      where: { isActive: true },
      select: { id: true, name: true, price: true },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.trainer.findMany({
      where: { isActive: true },
      select: { id: true, name: true },
      orderBy: { sortOrder: "asc" },
    }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Members</h1>
        <p className="text-sm text-[var(--muted-foreground)] mt-1">
          Manage member records, plans, CSV imports, and expiry reminders.
        </p>
      </div>
      <MembersDirectory
        members={members.map((m) => ({
          id: m.id,
          memberCode: m.memberCode,
          name: m.name,
          phone: m.phone,
          email: m.email,
          status: m.status,
          trainerName: m.assignedTrainer?.name ?? null,
          activePlanName: m.memberships[0]?.plan.name ?? null,
          expiryDate: m.memberships[0]?.endDate?.toISOString() ?? null,
        }))}
        plans={plans}
        trainers={trainers}
        canDelete={hasPermission(staff.user.role, "members:delete")}
      />
    </div>
  );
}
