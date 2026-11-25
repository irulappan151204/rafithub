import { prisma } from "@/lib/db";
import { requireStaff } from "@/lib/auth/server";
import { TrainersManager } from "@/components/admin/TrainersManager";

export const dynamic = "force-dynamic";

export default async function AdminTrainersPage() {
  await requireStaff({ permission: "trainers:manage" });
  const trainers = await prisma.trainer.findMany({
    where: { isActive: true },
    orderBy: [{ isFeatured: "desc" }, { sortOrder: "asc" }],
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Trainers</h1>
        <p className="text-sm text-[var(--muted-foreground)] mt-1">
          Edit trainer names, slugs, bios, certifications, and upload photos to Neon Object Storage.
        </p>
      </div>
      <TrainersManager trainers={trainers} />
    </div>
  );
}
