import { prisma } from "@/lib/db";
import { requireStaff } from "@/lib/auth/server";
import { getPublicSiteSettings } from "@/server/services/cms";
import { CmsEditor } from "@/components/admin/CmsEditor";

export const dynamic = "force-dynamic";

export default async function AdminCmsPage() {
  await requireStaff({ permission: "cms:manage" });

  const [settings, galleryItems, testimonials, faqs] = await Promise.all([
    getPublicSiteSettings(),
    prisma.galleryItem.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }] }),
    prisma.testimonial.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }] }),
    prisma.fAQ.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Website CMS</h1>
        <p className="text-sm text-[var(--muted-foreground)] mt-1">
          Edit gym details, hero copy, photos (stored in Neon Object Storage), testimonials, and
          FAQs without code changes.
        </p>
      </div>

      <CmsEditor
        settings={{
          ...settings,
          workingHours: Array.isArray(settings.workingHours)
            ? (settings.workingHours as Array<{ days: string; hours: string }>)
            : [],
          socialLinks: Array.isArray(settings.socialLinks)
            ? (settings.socialLinks as Array<{
                platform: string;
                href: string;
                label: string;
                color?: string;
              }>)
            : [],
          stats: Array.isArray(settings.stats)
            ? (settings.stats as Array<{
                number: string;
                value: number;
                suffix: string;
                label: string;
              }>)
            : [],
        }}
        galleryItems={galleryItems}
        testimonials={testimonials}
        faqs={faqs}
      />
    </div>
  );
}
