import MembershipClient, { type PublicPlanItem } from "./MembershipClient";
import { getPublicFaqs, getPublicPlans, getPublicSiteSettings } from "@/server/services/cms";

export default async function MembershipPage() {
  const [plans, faqs, settings] = await Promise.all([
    getPublicPlans(),
    getPublicFaqs(),
    getPublicSiteSettings(),
  ]);

  const normalizedPlans: PublicPlanItem[] = plans.map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    description: p.description,
    category: p.category,
    price: p.price,
    secondaryPrice: p.secondaryPrice,
    periodLabel: p.periodLabel,
    isPopular: p.isPopular,
    specialties: p.specialties,
    features: Array.isArray(p.features)
      ? (p.features as Array<{ name: string; included: boolean }>)
      : [],
  }));

  const gymPlans = normalizedPlans.filter((p) => p.category === "GYM_MEMBERSHIP");
  const ptPlans = normalizedPlans.filter((p) => p.category === "PERSONAL_TRAINING");
  const membershipFaqs = faqs.filter((f) => f.category === "Membership" || f.category === "General");

  return (
    <MembershipClient
      gymPlans={gymPlans}
      ptPlans={ptPlans}
      faqs={membershipFaqs}
      whatsappUrl={settings.whatsappUrl}
      trialDays={settings.trialDays}
      checkoutMode={settings.checkoutMode}
    />
  );
}
