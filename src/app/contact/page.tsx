import ContactClient from "./ContactClient";
import { getPublicFaqs, getPublicSiteSettings } from "@/server/services/cms";

export default async function ContactPage() {
  const [settings, faqs] = await Promise.all([getPublicSiteSettings(), getPublicFaqs()]);

  const contactFaqs = faqs.filter((f) => f.category === "Contact" || f.category === "General");
  const displayFaqs =
    contactFaqs.length > 0
      ? contactFaqs
      : [
          {
            id: "hours",
            question: "What are your operating hours?",
            answer: "We are open Mon-Sat 5AM-10PM and Sunday 6AM-2PM.",
          },
          {
            id: "trial",
            question: "Do you offer free trials?",
            answer: `Yes! We offer a complimentary ${settings.trialDays}-day trial for all first-time visitors.`,
          },
        ];

  return (
    <ContactClient
      settings={{
        phone: settings.phone,
        phoneDisplay: settings.phoneDisplay,
        email: settings.email,
        address: settings.address,
        mapUrl: settings.mapUrl,
        mapEmbedUrl: settings.mapEmbedUrl,
        whatsappUrl: settings.whatsappUrl,
        trialDays: settings.trialDays,
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
      }}
      faqs={displayFaqs}
    />
  );
}
