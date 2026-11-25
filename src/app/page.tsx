import dynamic from "next/dynamic";
import Hero from "@/components/Hero";
import {
  getPublicGallery,
  getPublicPlans,
  getPublicSiteSettings,
  getPublicTestimonials,
  getPublicTrainers,
} from "@/server/services/cms";

const WhyChooseUs = dynamic(() => import("@/components/WhyChooseUs"));
const Services = dynamic(() => import("@/components/Services"));
const MembershipPlans = dynamic(() => import("@/components/MembershipPlans"));
const TrainerCards = dynamic(() => import("@/components/TrainerCards"));
const Testimonials = dynamic(() => import("@/components/Testimonials"));
const GalleryPreview = dynamic(() => import("@/components/GalleryPreview"));
const CTASection = dynamic(() => import("@/components/CTASection"));

export default async function HomePage() {
  const [settings, plans, trainers, testimonials, gallery] = await Promise.all([
    getPublicSiteSettings(),
    getPublicPlans(),
    getPublicTrainers(),
    getPublicTestimonials(),
    getPublicGallery(),
  ]);

  const homePlans = plans.filter((p) => p.category === "GYM_MEMBERSHIP" && p.showOnHome);
  const displayPlans =
    homePlans.length > 0
      ? homePlans.map((p) => ({
          name: p.name,
          description: p.description,
          price: p.price,
          period: p.periodLabel,
          features: Array.isArray(p.features)
            ? (p.features as Array<{ name: string; included: boolean }>)
                .filter((f) => f.included)
                .map((f) => f.name)
            : [],
          popular: p.isPopular,
          color: p.isPopular ? "green" : p.slug === "annual" ? "gold" : "gray",
        }))
      : undefined;

  const displayTrainers =
    trainers.length > 0
      ? trainers.map((t) => ({
          id: t.slug,
          name: t.name,
          role: t.role,
          title: t.title,
          image: t.photoUrl,
          specializations: t.specialties,
          experience: t.experienceLabel ?? `${t.experienceYears}+ years`,
          certifications: t.certifications,
          bio: t.bio,
          achievements: t.achievements,
          gallery: t.galleryImages,
          isFeatured: t.isFeatured,
          accentColor: t.accentColor ?? undefined,
          social: (t.socialLinks as Record<string, string | undefined>) ?? {},
          contact: { email: t.contactEmail ?? "", phone: t.contactPhone ?? "" },
        }))
      : undefined;

  const displayStats = Array.isArray(settings.stats)
    ? (settings.stats as Array<{ number: string; value: number; suffix: string; label: string }>)
    : undefined;

  return (
    <>
      <Hero
        eyebrow={settings.heroEyebrow}
        title={settings.heroTitle}
        subtitle={settings.heroSubtitle}
        stats={displayStats}
        heroImageUrl={settings.heroImageUrl ?? undefined}
        trialDays={settings.trialDays}
      />
      <WhyChooseUs stats={displayStats} />
      <Services />
      <MembershipPlans plans={displayPlans} />
      <TrainerCards trainers={displayTrainers} />
      <Testimonials
        items={testimonials.map((t) => ({
          name: t.name,
          role: t.result,
          image: t.photoUrl ?? "/trainers/1.webp",
          content: t.quote,
          rating: t.rating,
        }))}
      />
      <GalleryPreview
        items={gallery.slice(0, 6).map((g) => ({
          src: g.imageUrl,
          alt: g.caption,
          size: g.size,
        }))}
      />
      <CTASection trialDays={settings.trialDays} />
    </>
  );
}
