import { prisma } from "@/lib/db";
import { requireStaff } from "@/lib/auth/server";
import { PlansManager } from "@/components/admin/PlansManager";

export const dynamic = "force-dynamic";

export default async function AdminPlansPage() {
  await requireStaff({ permission: "plans:manage" });
  const plans = await prisma.plan.findMany({
    where: { isActive: true },
    orderBy: [{ sortOrder: "asc" }, { price: "asc" }],
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Membership &amp; PT Plans</h1>
        <p className="text-sm text-[var(--muted-foreground)] mt-1">
          Changes here update the Home page and /membership pricing immediately.
        </p>
      </div>
      <PlansManager
        plans={plans.map((p) => ({
          ...p,
          features: Array.isArray(p.features)
            ? (p.features as Array<{ name: string; included: boolean }>)
            : [],
        }))}
      />
    </div>
  );
}
