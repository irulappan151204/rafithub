import { prisma } from "@/lib/db";
import { requireStaff } from "@/lib/auth/server";
import { LeadsManager } from "@/components/admin/LeadsManager";

export const dynamic = "force-dynamic";

export default async function AdminLeadsPage() {
  await requireStaff({ permission: "leads:manage" });
  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Leads &amp; Enquiries</h1>
        <p className="text-sm text-[var(--muted-foreground)] mt-1">
          Follow up on trial bookings, membership enquiries, and contact submissions.
        </p>
      </div>
      <LeadsManager leads={leads} />
    </div>
  );
}
