import { prisma } from "@/lib/db";
import { requireStaff } from "@/lib/auth/server";
import { ClassesManager } from "@/components/admin/ClassesManager";

export const dynamic = "force-dynamic";

export default async function AdminClassesPage() {
  await requireStaff({ permission: "classes:manage" });
  const [classes, trainers] = await Promise.all([
    prisma.gymClass.findMany({
      where: { isActive: true },
      include: { schedules: { orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }] } },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    }),
    prisma.trainer.findMany({
      where: { isActive: true },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Classes &amp; Weekly Schedule</h1>
        <p className="text-sm text-[var(--muted-foreground)] mt-1">
          Manage workout programs and class timings displayed on /classes.
        </p>
      </div>
      <ClassesManager classes={classes} trainers={trainers} />
    </div>
  );
}
