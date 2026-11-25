import "dotenv/config";
import { PrismaClient, PlanCategory, CheckoutMode } from "@prisma/client";
import bcrypt from "bcryptjs";
import { trainers as staticTrainers } from "../src/data/trainers";
import { contactInfo, socialLinks } from "../src/data/contact";

const prisma = new PrismaClient();

async function ensureNeonAuthOwner(email: string, password: string, name: string) {
  const baseUrl = process.env.NEON_AUTH_BASE_URL;
  if (!baseUrl) {
    console.log("NEON_AUTH_BASE_URL not set; skipping remote Neon Auth sign-up check.");
    return;
  }

  try {
    const res = await fetch(`${baseUrl.replace(/\/+$/, "")}/sign-up/email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
      },
      body: JSON.stringify({ email, password, name }),
    });

    if (res.ok) {
      console.log(`Created Neon Auth account for owner: ${email}`);
    } else {
      const text = await res.text();
      if (res.status === 422 || text.toLowerCase().includes("exist")) {
        console.log(`Neon Auth owner account already exists for ${email}`);
      } else {
        console.warn(`Neon Auth sign-up returned ${res.status}: ${text}`);
      }
    }
  } catch (err) {
    console.warn("Could not reach Neon Auth during seed:", err);
  }
}

async function main() {
  console.log("Seeding Rafithub database...");

  // 1. SiteSettings (singleton)
  await prisma.siteSettings.upsert({
    where: { id: "default" },
    update: {},
    create: {
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
      socialLinks: socialLinks.map((s) => ({
        platform: s.platform,
        href: s.href,
        label: s.label,
        color: s.color,
      })),
      workingHours: [
        { days: "Monday – Saturday", hours: "05:00 AM – 10:00 PM" },
        { days: "Sunday", hours: "06:00 AM – 02:00 PM" },
      ],
      heroEyebrow: "Welcome to Rafithub",
      heroTitle: "Transform Your Body & Mind",
      heroSubtitle:
        "Experience world-class training, cutting-edge equipment, and personalized programs designed to help you achieve your ultimate fitness goals.",
      heroImageUrl: "/assets/hero/hero-desktop-lg.webp",
      stats: [
        { number: "15+", value: 15, suffix: "+", label: "Years Experience" },
        { number: "6+", value: 6, suffix: "+", label: "Expert Trainers" },
        { number: "10K+", value: 10, suffix: "K+", label: "Happy Members" },
        { number: "100+", value: 100, suffix: "+", label: "Weekly Classes" },
      ],
      trialDays: 7,
      checkoutMode: CheckoutMode.ENQUIRY,
      seoDefaults: {
        title: "Rafithub | Premium Fitness & Personal Training",
        description:
          "Rafithub is a premium fitness center in Madurai offering expert personal training, group fitness programs, strength training, crossfit, and transformation-focused workouts.",
        ogImage: "/og-image.jpg",
      },
      pageSeo: {},
    },
  });

  // 2. Plans (4 Gym Memberships + 3 Personal Training tiers)
  const plansData = [
    {
      slug: "monthly",
      name: "Monthly",
      description: "Perfect for beginners starting their fitness journey",
      category: PlanCategory.GYM_MEMBERSHIP,
      durationDays: 30,
      periodLabel: "month",
      price: 2000,
      isPopular: false,
      showOnHome: true,
      sortOrder: 1,
      ptSessionsIncluded: 0,
      features: [
        { name: "Full access to gym facilities", included: true },
        { name: "Access to cardio area", included: true },
        { name: "Access to strength training area", included: true },
        { name: "Basic fitness assessment", included: true },
        { name: "Personalized workout plan", included: false },
        { name: "Free personal training session", included: false },
        { name: "Access to group classes", included: false },
        { name: "Nutrition consultation", included: false },
      ],
    },
    {
      slug: "3-month",
      name: "3-Month",
      description: "All Monthly plan features plus personalized guidance",
      category: PlanCategory.GYM_MEMBERSHIP,
      durationDays: 90,
      periodLabel: "3 months",
      price: 5500,
      isPopular: true,
      showOnHome: true,
      sortOrder: 2,
      ptSessionsIncluded: 1,
      features: [
        { name: "All Monthly plan features", included: true },
        { name: "Personalized workout plan", included: true },
        { name: "1 free personal training session", included: true },
        { name: "Access to group classes", included: true },
        { name: "Monthly fitness assessment", included: true },
        { name: "2 free personal training sessions", included: false },
        { name: "Nutrition consultation", included: false },
        { name: "Body composition analysis", included: false },
      ],
    },
    {
      slug: "6-month",
      name: "6-Month",
      description: "Comprehensive fitness experience with premium perks",
      category: PlanCategory.GYM_MEMBERSHIP,
      durationDays: 180,
      periodLabel: "6 months",
      price: 7500,
      isPopular: false,
      showOnHome: false,
      sortOrder: 3,
      ptSessionsIncluded: 2,
      features: [
        { name: "All 3-Month plan features", included: true },
        { name: "2 free personal training sessions", included: true },
        { name: "Nutrition consultation", included: true },
        { name: "Body composition analysis", included: true },
        { name: "Priority class booking", included: true },
        { name: "4 free personal training sessions", included: false },
        { name: "Quarterly nutrition consultation", included: false },
        { name: "Exclusive member events", included: false },
      ],
    },
    {
      slug: "annual",
      name: "Annual",
      description: "The ultimate fitness commitment with maximum value",
      category: PlanCategory.GYM_MEMBERSHIP,
      durationDays: 365,
      periodLabel: "year",
      price: 10000,
      isPopular: false,
      showOnHome: true,
      sortOrder: 4,
      ptSessionsIncluded: 4,
      features: [
        { name: "All 6-Month plan features", included: true },
        { name: "4 free personal training sessions", included: true },
        { name: "Quarterly nutrition consultation", included: true },
        { name: "Exclusive member events", included: true },
        { name: "Priority class booking", included: true },
        { name: "Body composition analysis", included: true },
        { name: "VIP locker access", included: true },
        { name: "Guest passes (4/year)", included: true },
      ],
    },
    {
      slug: "pt-basic",
      name: "Basic Training",
      description: "One-on-one foundational coaching (12 or 24 sessions/month)",
      category: PlanCategory.PERSONAL_TRAINING,
      durationDays: 30,
      periodLabel: "month",
      price: 6000,
      secondaryPrice: 12000,
      isPopular: false,
      showOnHome: false,
      sortOrder: 5,
      ptSessionsIncluded: 12,
      features: [
        { name: "Personalized workout plans", included: true },
        { name: "Progress tracking", included: true },
        { name: "Form correction", included: true },
        { name: "Basic nutrition guidance", included: true },
      ],
    },
    {
      slug: "pt-advanced",
      name: "Advanced Training",
      description: "Targeted transformation, rehab, and sports conditioning",
      category: PlanCategory.PERSONAL_TRAINING,
      durationDays: 30,
      periodLabel: "month",
      price: 8000,
      secondaryPrice: 16000,
      specialties: ["Personal Training", "Injury Rehabilitation", "Sports Fitness"],
      isPopular: true,
      showOnHome: false,
      sortOrder: 6,
      ptSessionsIncluded: 12,
      features: [
        { name: "Advanced nutrition planning", included: true },
        { name: "Regular assessments", included: true },
        { name: "Specialized programs", included: true },
        { name: "Flexible scheduling", included: true },
      ],
    },
    {
      slug: "pt-elite",
      name: "Elite Training",
      description: "Competition prep and VIP coaching with senior staff",
      category: PlanCategory.PERSONAL_TRAINING,
      durationDays: 30,
      periodLabel: "month",
      price: 10000,
      secondaryPrice: 20000,
      isPopular: false,
      showOnHome: false,
      sortOrder: 7,
      ptSessionsIncluded: 12,
      features: [
        { name: "Certified Professional Training", included: true },
        { name: "Specialized programs", included: true },
        { name: "Competition preparation", included: true },
        { name: "Advanced performance tracking", included: true },
        { name: "Priority scheduling", included: true },
        { name: "VIP amenities access", included: true },
      ],
    },
  ];

  for (const plan of plansData) {
    await prisma.plan.upsert({
      where: { slug: plan.slug },
      update: {},
      create: plan,
    });
  }

  // 3. Trainers (preserve existing /trainers/[id] slugs)
  const trainerRecords: Record<string, string> = {};
  for (let i = 0; i < staticTrainers.length; i++) {
    const t = staticTrainers[i];
    const yearsNum = parseInt(t.experience, 10) || 5;
    const saved = await prisma.trainer.upsert({
      where: { slug: t.id },
      update: {},
      create: {
        slug: t.id,
        name: t.name,
        role: t.role,
        title: t.title,
        bio: t.bio,
        experienceYears: yearsNum,
        experienceLabel: t.experience,
        specialties: t.specializations,
        certifications: t.certifications,
        achievements: t.achievements,
        galleryImages: [],
        photoUrl: t.image,
        accentColor: t.accentColor ?? null,
        socialLinks: t.social,
        contactEmail: null,
        contactPhone: null,
        isFeatured: Boolean(t.isFeatured),
        sortOrder: i + 1,
        isActive: true,
      },
    });
    trainerRecords[t.id] = saved.id;
  }

  // 4. Classes + Weekly Schedules
  const classesData = [
    {
      slug: "strength-conditioning",
      name: "Strength & Conditioning",
      category: "Strength",
      intensity: "Intermediate",
      description:
        "Build raw power and functional strength through compound movements and progressive overload techniques.",
      trainerId: trainerRecords["antony"] ?? null,
      durationMin: 60,
      capacity: 20,
      schedules: [
        { dayOfWeek: 1, startTime: "06:00", endTime: "07:00" },
        { dayOfWeek: 3, startTime: "06:00", endTime: "07:00" },
        { dayOfWeek: 5, startTime: "18:00", endTime: "19:00" },
      ],
    },
    {
      slug: "hiit-burn",
      name: "HIIT Burn",
      category: "High Intensity",
      intensity: "High",
      description:
        "Maximize calorie burn and boost metabolism with short bursts of intense exercise followed by recovery periods.",
      trainerId: trainerRecords["sophiea"] ?? null,
      durationMin: 45,
      capacity: 24,
      schedules: [
        { dayOfWeek: 2, startTime: "07:00", endTime: "07:45" },
        { dayOfWeek: 4, startTime: "18:30", endTime: "19:15" },
        { dayOfWeek: 6, startTime: "07:30", endTime: "08:15" },
      ],
    },
    {
      slug: "functional-training",
      name: "Functional Training",
      category: "Mobility & Strength",
      intensity: "All Levels",
      description:
        "Prepare your body for daily life with movements that mimic real-world activities. Improve balance and coordination.",
      trainerId: trainerRecords["prabha"] ?? null,
      durationMin: 45,
      capacity: 18,
      schedules: [
        { dayOfWeek: 1, startTime: "07:30", endTime: "08:15" },
        { dayOfWeek: 4, startTime: "07:30", endTime: "08:15" },
      ],
    },
    {
      slug: "core-abs",
      name: "Core & Abs",
      category: "Core Stability",
      intensity: "Intermediate",
      description:
        "A targeted session meant to carve your midsection, improve posture, and build a rock-solid core foundation.",
      trainerId: trainerRecords["ganesh"] ?? null,
      durationMin: 30,
      capacity: 25,
      schedules: [
        { dayOfWeek: 2, startTime: "18:00", endTime: "18:30" },
        { dayOfWeek: 5, startTime: "07:00", endTime: "07:30" },
      ],
    },
    {
      slug: "cardio-blast",
      name: "Cardio Blast",
      category: "Endurance",
      intensity: "Intermediate",
      description:
        "Heart-pumping aerobic workout designed to increase stamina, lung capacity, and overall cardiovascular health.",
      trainerId: trainerRecords["sophiea"] ?? null,
      durationMin: 45,
      capacity: 25,
      schedules: [
        { dayOfWeek: 3, startTime: "18:00", endTime: "18:45" },
        { dayOfWeek: 6, startTime: "09:00", endTime: "09:45" },
      ],
    },
    {
      slug: "mobility-recovery",
      name: "Mobility & Recovery",
      category: "Flexibility",
      intensity: "Low",
      description:
        "Reduce risk of injury and improve range of motion with guided stretching and active recovery exercises.",
      trainerId: trainerRecords["prabha"] ?? null,
      durationMin: 45,
      capacity: 20,
      schedules: [{ dayOfWeek: 0, startTime: "08:00", endTime: "08:45" }],
    },
  ];

  for (let i = 0; i < classesData.length; i++) {
    const c = classesData[i];
    const existing = await prisma.gymClass.findUnique({ where: { slug: c.slug } });
    if (!existing) {
      await prisma.gymClass.create({
        data: {
          slug: c.slug,
          name: c.name,
          category: c.category,
          intensity: c.intensity,
          description: c.description,
          trainerId: c.trainerId,
          durationMin: c.durationMin,
          capacity: c.capacity,
          sortOrder: i + 1,
          schedules: {
            create: c.schedules,
          },
        },
      });
    }
  }

  // 5. FAQs
  const existingFaqCount = await prisma.fAQ.count();
  if (existingFaqCount === 0) {
    await prisma.fAQ.createMany({
      data: [
        {
          question: "What are your operating hours?",
          answer: "We are open Mon–Sat 5:00 AM – 10:00 PM and Sunday 6:00 AM – 2:00 PM.",
          category: "Contact",
          sortOrder: 1,
        },
        {
          question: "Do you offer free trials?",
          answer: "Yes! We offer a complimentary 7-day trial for all first-time visitors.",
          category: "Membership",
          sortOrder: 2,
        },
        {
          question: "Is parking available?",
          answer: "Yes, we have free parking space for our members at ABHI Complex, Kochadai.",
          category: "Contact",
          sortOrder: 3,
        },
        {
          question: "Do you provide personal training?",
          answer:
            "Absolutely! We have certified trainers available for personalized 1-on-1 coaching and nutrition guidance.",
          category: "Membership",
          sortOrder: 4,
        },
        {
          question: "Can I freeze my membership?",
          answer:
            "Yes, 6-Month and Annual members can freeze their membership for up to 3 months. 3-Month members can freeze for 1 month.",
          category: "Membership",
          sortOrder: 5,
        },
        {
          question: "Are there family discounts?",
          answer:
            "Yes! We offer 15% off for family plans when two or more family members join together. Contact us for details.",
          category: "Membership",
          sortOrder: 6,
        },
      ],
    });
  }

  // 6. Seed Initial OWNER from env vars (no hardcoded password!)
  const ownerEmail = process.env.OWNER_EMAIL?.trim().toLowerCase();
  const ownerPassword = process.env.OWNER_INITIAL_PASSWORD;

  if (ownerEmail) {
    const passwordHash = ownerPassword ? await bcrypt.hash(ownerPassword, 12) : null;
    await prisma.user.upsert({
      where: { email: ownerEmail },
      update: {},
      create: {
        email: ownerEmail,
        name: "Dr. Ranjith (Owner)",
        role: "OWNER",
        active: true,
        mustChangePassword: Boolean(ownerPassword),
        passwordHash,
      },
    });
    if (ownerPassword) {
      await ensureNeonAuthOwner(ownerEmail, ownerPassword, "Dr. Ranjith (Owner)");
    }
    console.log(`Owner staff record ensured for ${ownerEmail}`);
  } else {
    console.log("OWNER_EMAIL not set; skipping initial OWNER creation.");
  }

  console.log("Seed completed.");
}

main()
  .catch((error) => {
    console.error("Seed error:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
