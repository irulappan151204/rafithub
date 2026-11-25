import "server-only";

import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/db";
import { contactInfo, socialLinks } from "@/data/contact";

export const CMS_TAGS = {
  settings: "cms-settings",
  plans: "cms-plans",
  trainers: "cms-trainers",
  classes: "cms-classes",
  gallery: "cms-gallery",
  testimonials: "cms-testimonials",
  faqs: "cms-faqs",
} as const;

export const getPublicSiteSettings = unstable_cache(
  async () => {
    try {
      const settings = await prisma.siteSettings.findUnique({ where: { id: "default" } });
      if (settings) return settings;
    } catch {
      // Fallback when DB is not yet migrated/reachable during static build
    }
    return {
      id: "default",
      gymName: "Rafithub",
      tagline: "Transform Your Body & Mind",
      description:
        "Rafithub is a premium fitness center in Madurai offering expert personal training, group fitness programs, strength training, crossfit, and transformation-focused workouts.",
      address: contactInfo.address,
      landmark: contactInfo.landmark,
      phone: contactInfo.phone,
      phoneDisplay: contactInfo.phoneDisplay,
      email: contactInfo.email,
      whatsappUrl: contactInfo.whatsapp,
      mapUrl: contactInfo.mapUrl,
      mapEmbedUrl:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15721.492572579737!2d78.0838!3d9.9252!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b00c58e5a00d7d3%3A0x6b6a032870191823!2sKochadai%2C%20Madurai%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1703000000000!5m2!1sen!2sin",
      socialLinks: socialLinks.map((s) => ({ ...s })),
      workingHours: [
        { days: "Monday – Saturday", hours: "05:00 AM – 10:00 PM" },
        { days: "Sunday", hours: "06:00 AM – 02:00 PM" },
      ],
      heroEyebrow: "Welcome to Rafithub",
      heroTitle: "Transform Your Body & Mind",
      heroSubtitle:
        "Experience world-class training, cutting-edge equipment, and personalized programs designed to help you achieve your ultimate fitness goals.",
      heroImageUrl: "/assets/hero/hero-desktop-lg.webp",
      heroImageKey: null,
      stats: [
        { number: "15+", value: 15, suffix: "+", label: "Years Experience" },
        { number: "6+", value: 6, suffix: "+", label: "Expert Trainers" },
        { number: "10K+", value: 10, suffix: "K+", label: "Happy Members" },
        { number: "100+", value: 100, suffix: "+", label: "Weekly Classes" },
      ],
      trialDays: 7,
      checkoutMode: "ENQUIRY" as const,
      seoDefaults: {},
      pageSeo: {},
      updatedAt: new Date(),
    };
  },
  ["public-site-settings"],
  { tags: [CMS_TAGS.settings], revalidate: 300 }
);

export const getPublicPlans = unstable_cache(
  async () => {
    try {
      return await prisma.plan.findMany({
        where: { isActive: true },
        orderBy: [{ sortOrder: "asc" }, { price: "asc" }],
      });
    } catch {
      return [];
    }
  },
  ["public-plans"],
  { tags: [CMS_TAGS.plans], revalidate: 300 }
);

export const getPublicTrainers = unstable_cache(
  async () => {
    try {
      return await prisma.trainer.findMany({
        where: { isActive: true },
        orderBy: [{ isFeatured: "desc" }, { sortOrder: "asc" }, { name: "asc" }],
      });
    } catch {
      return [];
    }
  },
  ["public-trainers"],
  { tags: [CMS_TAGS.trainers], revalidate: 300 }
);

export const getPublicClasses = unstable_cache(
  async () => {
    try {
      return await prisma.gymClass.findMany({
        where: { isActive: true },
        include: {
          trainer: { select: { id: true, name: true, slug: true } },
          schedules: { orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }] },
        },
        orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      });
    } catch {
      return [];
    }
  },
  ["public-classes"],
  { tags: [CMS_TAGS.classes], revalidate: 300 }
);

export const getPublicGallery = unstable_cache(
  async () => {
    try {
      return await prisma.galleryItem.findMany({
        where: { isActive: true },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      });
    } catch {
      return [];
    }
  },
  ["public-gallery"],
  { tags: [CMS_TAGS.gallery], revalidate: 300 }
);

export const getPublicTestimonials = unstable_cache(
  async () => {
    try {
      return await prisma.testimonial.findMany({
        where: { isApproved: true },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      });
    } catch {
      return [];
    }
  },
  ["public-testimonials"],
  { tags: [CMS_TAGS.testimonials], revalidate: 300 }
);

export const getPublicFaqs = unstable_cache(
  async () => {
    try {
      return await prisma.fAQ.findMany({
        where: { isActive: true },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      });
    } catch {
      return [];
    }
  },
  ["public-faqs"],
  { tags: [CMS_TAGS.faqs], revalidate: 300 }
);
