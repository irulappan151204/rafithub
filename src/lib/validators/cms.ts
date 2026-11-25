import { z } from "zod";

export const leadCreateSchema = z.object({
  name: z.string().trim().min(2, "Enter your full name").max(100),
  phone: z
    .string()
    .trim()
    .regex(/^[+\d][\d\s-]{8,16}$/, "Enter a valid phone number"),
  email: z.string().trim().email("Enter a valid email").optional().or(z.literal("")),
  interest: z.string().trim().max(120).optional().or(z.literal("")),
  message: z.string().trim().max(1000).optional().or(z.literal("")),
  source: z.string().trim().max(50).default("website"),
  consentGiven: z.literal(true, {
    error: "Please accept the privacy policy to continue.",
  }),
  website: z.string().max(0, "Invalid submission").optional().default(""),
  calculator: z
    .object({
      bmi: z.number().optional(),
      caloriesTarget: z.number().optional(),
      goal: z.string().optional(),
    })
    .optional(),
});

export const siteSettingsUpdateSchema = z.object({
  gymName: z.string().trim().min(2).max(80),
  tagline: z.string().trim().min(2).max(160),
  description: z.string().trim().min(10).max(1000),
  address: z.string().trim().min(5).max(300),
  landmark: z.string().trim().max(120).optional().or(z.literal("")),
  phone: z.string().trim().min(6).max(30),
  phoneDisplay: z.string().trim().min(6).max(30),
  email: z.string().trim().email(),
  whatsappUrl: z.string().trim().url(),
  mapUrl: z.string().trim().url(),
  mapEmbedUrl: z.string().trim().url(),
  heroEyebrow: z.string().trim().min(2).max(80),
  heroTitle: z.string().trim().min(2).max(160),
  heroSubtitle: z.string().trim().min(10).max(600),
  heroImageUrl: z.string().trim().optional().or(z.literal("")),
  heroImageKey: z.string().trim().optional().or(z.literal("")),
  trialDays: z.coerce.number().int().min(1).max(30),
  checkoutMode: z.enum(["ENQUIRY", "RAZORPAY"]),
  workingHours: z.array(
    z.object({
      days: z.string().trim().min(1),
      hours: z.string().trim().min(1),
    })
  ),
  socialLinks: z.array(
    z.object({
      platform: z.string().trim().min(1),
      href: z.string().trim().url(),
      label: z.string().trim().min(1),
      color: z.string().trim().optional(),
    })
  ),
  stats: z.array(
    z.object({
      number: z.string().trim().min(1),
      value: z.coerce.number().int().min(0),
      suffix: z.string().trim(),
      label: z.string().trim().min(1),
    })
  ),
});

export const planUpsertSchema = z.object({
  id: z.string().optional(),
  slug: z.string().trim().min(2).max(60).regex(/^[a-z0-9-]+$/),
  name: z.string().trim().min(2).max(80),
  description: z.string().trim().min(4).max(300),
  category: z.enum(["GYM_MEMBERSHIP", "PERSONAL_TRAINING"]),
  durationDays: z.coerce.number().int().min(1).max(1095),
  periodLabel: z.string().trim().min(1).max(40),
  price: z.coerce.number().int().min(0),
  secondaryPrice: z.coerce.number().int().min(0).nullable().optional(),
  ptSessionsIncluded: z.coerce.number().int().min(0).default(0),
  isPopular: z.boolean().default(false),
  showOnHome: z.boolean().default(false),
  isActive: z.boolean().default(true),
  sortOrder: z.coerce.number().int().min(0).default(0),
  features: z.array(
    z.object({
      name: z.string().trim().min(1),
      included: z.boolean(),
    })
  ),
});

export const trainerUpsertSchema = z.object({
  id: z.string().optional(),
  slug: z.string().trim().min(2).max(60).regex(/^[a-z0-9-]+$/),
  name: z.string().trim().min(2).max(100),
  role: z.string().trim().min(2).max(120),
  title: z.string().trim().min(2).max(160),
  bio: z.string().trim().min(10).max(3000),
  experienceYears: z.coerce.number().int().min(0).max(60),
  experienceLabel: z.string().trim().max(40).optional().or(z.literal("")),
  photoUrl: z.string().trim().min(1),
  photoKey: z.string().trim().optional().or(z.literal("")),
  accentColor: z.string().trim().optional().or(z.literal("")),
  specialties: z.array(z.string().trim().min(1)),
  certifications: z.array(z.string().trim().min(1)),
  achievements: z.array(z.string().trim().min(1)),
  isFeatured: z.boolean().default(false),
  isActive: z.boolean().default(true),
  sortOrder: z.coerce.number().int().min(0).default(0),
  socialLinks: z
    .object({
      instagram: z.string().trim().optional(),
      youtube: z.string().trim().optional(),
      linkedin: z.string().trim().optional(),
      facebook: z.string().trim().optional(),
    })
    .default({}),
});

export const gymClassUpsertSchema = z.object({
  id: z.string().optional(),
  slug: z.string().trim().min(2).max(60).regex(/^[a-z0-9-]+$/),
  name: z.string().trim().min(2).max(100),
  description: z.string().trim().min(10).max(1000),
  category: z.string().trim().min(2).max(80),
  intensity: z.string().trim().min(2).max(40),
  capacity: z.coerce.number().int().min(1).max(200),
  durationMin: z.coerce.number().int().min(10).max(240),
  trainerId: z.string().optional().nullable(),
  imageUrl: z.string().trim().optional().or(z.literal("")),
  imageKey: z.string().trim().optional().or(z.literal("")),
  isActive: z.boolean().default(true),
  sortOrder: z.coerce.number().int().min(0).default(0),
});

export const galleryItemSchema = z.object({
  id: z.string().optional(),
  imageUrl: z.string().trim().min(1),
  imageKey: z.string().trim().optional().or(z.literal("")),
  caption: z.string().trim().min(2).max(160),
  category: z.string().trim().min(2).max(50),
  size: z.enum(["small", "large", "tall"]).default("small"),
  sortOrder: z.coerce.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
});

export const testimonialSchema = z.object({
  id: z.string().optional(),
  name: z.string().trim().min(2).max(80),
  result: z.string().trim().min(2).max(120),
  quote: z.string().trim().min(10).max(1000),
  photoUrl: z.string().trim().optional().or(z.literal("")),
  photoKey: z.string().trim().optional().or(z.literal("")),
  rating: z.coerce.number().int().min(1).max(5).default(5),
  isApproved: z.boolean().default(true),
  sortOrder: z.coerce.number().int().min(0).default(0),
});

export const faqSchema = z.object({
  id: z.string().optional(),
  question: z.string().trim().min(4).max(250),
  answer: z.string().trim().min(4).max(1500),
  category: z.string().trim().min(2).max(40).default("General"),
  sortOrder: z.coerce.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
});
