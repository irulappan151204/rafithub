"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { LeadStatus, Role } from "@prisma/client";
import { prisma } from "@/lib/db";
import { requireStaff } from "@/lib/auth/server";
import { recordAuditLog } from "@/server/services/audit";
import { CMS_TAGS } from "@/server/services/cms";
import {
  faqSchema,
  galleryItemSchema,
  gymClassUpsertSchema,
  planUpsertSchema,
  siteSettingsUpdateSchema,
  testimonialSchema,
  trainerUpsertSchema,
} from "@/lib/validators/cms";
import { z } from "zod";

function revalidateAllPublic() {
  revalidateTag(CMS_TAGS.settings);
  revalidateTag(CMS_TAGS.plans);
  revalidateTag(CMS_TAGS.trainers);
  revalidateTag(CMS_TAGS.classes);
  revalidateTag(CMS_TAGS.gallery);
  revalidateTag(CMS_TAGS.testimonials);
  revalidateTag(CMS_TAGS.faqs);
  revalidatePath("/");
  revalidatePath("/membership");
  revalidatePath("/trainers");
  revalidatePath("/classes");
  revalidatePath("/gallery");
  revalidatePath("/contact");
  revalidatePath("/about");
}

export async function updateSiteSettingsAction(rawInput: unknown) {
  const staff = await requireStaff({ permission: "cms:manage" });
  const data = siteSettingsUpdateSchema.parse(rawInput);

  const updated = await prisma.siteSettings.upsert({
    where: { id: "default" },
    update: {
      gymName: data.gymName,
      tagline: data.tagline,
      description: data.description,
      address: data.address,
      landmark: data.landmark || null,
      phone: data.phone,
      phoneDisplay: data.phoneDisplay,
      email: data.email,
      whatsappUrl: data.whatsappUrl,
      mapUrl: data.mapUrl,
      mapEmbedUrl: data.mapEmbedUrl,
      heroEyebrow: data.heroEyebrow,
      heroTitle: data.heroTitle,
      heroSubtitle: data.heroSubtitle,
      heroImageUrl: data.heroImageUrl || null,
      heroImageKey: data.heroImageKey || null,
      trialDays: data.trialDays,
      checkoutMode: data.checkoutMode,
      workingHours: data.workingHours,
      socialLinks: data.socialLinks,
      stats: data.stats,
    },
    create: {
      id: "default",
      gymName: data.gymName,
      tagline: data.tagline,
      description: data.description,
      address: data.address,
      landmark: data.landmark || null,
      phone: data.phone,
      phoneDisplay: data.phoneDisplay,
      email: data.email,
      whatsappUrl: data.whatsappUrl,
      mapUrl: data.mapUrl,
      mapEmbedUrl: data.mapEmbedUrl,
      heroEyebrow: data.heroEyebrow,
      heroTitle: data.heroTitle,
      heroSubtitle: data.heroSubtitle,
      heroImageUrl: data.heroImageUrl || null,
      heroImageKey: data.heroImageKey || null,
      trialDays: data.trialDays,
      checkoutMode: data.checkoutMode,
      workingHours: data.workingHours,
      socialLinks: data.socialLinks,
      stats: data.stats,
    },
  });

  await recordAuditLog({
    userId: staff.user.id,
    action: "UPDATE_SITE_SETTINGS",
    entity: "SiteSettings",
    entityId: "default",
    diff: { gymName: data.gymName, checkoutMode: data.checkoutMode, trialDays: data.trialDays },
  });

  revalidateAllPublic();
  revalidatePath("/admin/cms");
  return updated;
}

export async function upsertPlanAction(rawInput: unknown) {
  const staff = await requireStaff({ permission: "plans:manage" });
  const data = planUpsertSchema.parse(rawInput);

  const payload = {
    slug: data.slug,
    name: data.name,
    description: data.description,
    category: data.category,
    durationDays: data.durationDays,
    periodLabel: data.periodLabel,
    price: data.price,
    secondaryPrice: data.secondaryPrice ?? null,
    ptSessionsIncluded: data.ptSessionsIncluded,
    isPopular: data.isPopular,
    showOnHome: data.showOnHome,
    isActive: data.isActive,
    sortOrder: data.sortOrder,
    features: data.features,
  };

  const plan = data.id
    ? await prisma.plan.update({ where: { id: data.id }, data: payload })
    : await prisma.plan.create({ data: payload });

  await recordAuditLog({
    userId: staff.user.id,
    action: data.id ? "UPDATE_PLAN" : "CREATE_PLAN",
    entity: "Plan",
    entityId: plan.id,
    diff: { name: plan.name, price: plan.price },
  });

  revalidateTag(CMS_TAGS.plans);
  revalidatePath("/");
  revalidatePath("/membership");
  revalidatePath("/admin/plans");
  return plan;
}

export async function deletePlanAction(id: string) {
  const staff = await requireStaff({ permission: "plans:manage" });
  await prisma.plan.update({ where: { id }, data: { isActive: false } });
  await recordAuditLog({
    userId: staff.user.id,
    action: "DEACTIVATE_PLAN",
    entity: "Plan",
    entityId: id,
  });
  revalidateTag(CMS_TAGS.plans);
  revalidatePath("/");
  revalidatePath("/membership");
  revalidatePath("/admin/plans");
}

export async function upsertTrainerAction(rawInput: unknown) {
  const staff = await requireStaff({ permission: "trainers:manage" });
  const data = trainerUpsertSchema.parse(rawInput);

  const payload = {
    slug: data.slug,
    name: data.name,
    role: data.role,
    title: data.title,
    bio: data.bio,
    experienceYears: data.experienceYears,
    experienceLabel: data.experienceLabel || `${data.experienceYears}+ years`,
    photoUrl: data.photoUrl,
    photoKey: data.photoKey || null,
    accentColor: data.accentColor || null,
    specialties: data.specialties,
    certifications: data.certifications,
    achievements: data.achievements,
    isFeatured: data.isFeatured,
    isActive: data.isActive,
    sortOrder: data.sortOrder,
    socialLinks: data.socialLinks,
  };

  const trainer = data.id
    ? await prisma.trainer.update({ where: { id: data.id }, data: payload })
    : await prisma.trainer.create({ data: payload });

  await recordAuditLog({
    userId: staff.user.id,
    action: data.id ? "UPDATE_TRAINER" : "CREATE_TRAINER",
    entity: "Trainer",
    entityId: trainer.id,
    diff: { name: trainer.name, slug: trainer.slug },
  });

  revalidateTag(CMS_TAGS.trainers);
  revalidatePath("/");
  revalidatePath("/trainers");
  revalidatePath(`/trainers/${trainer.slug}`);
  revalidatePath("/admin/trainers");
  return trainer;
}

export async function deleteTrainerAction(id: string) {
  const staff = await requireStaff({ permission: "trainers:manage" });
  await prisma.trainer.update({ where: { id }, data: { isActive: false } });
  await recordAuditLog({
    userId: staff.user.id,
    action: "DEACTIVATE_TRAINER",
    entity: "Trainer",
    entityId: id,
  });
  revalidateTag(CMS_TAGS.trainers);
  revalidatePath("/");
  revalidatePath("/trainers");
  revalidatePath("/admin/trainers");
}

export async function upsertGymClassAction(rawInput: unknown) {
  const staff = await requireStaff({ permission: "classes:manage" });
  const data = gymClassUpsertSchema.parse(rawInput);

  const payload = {
    slug: data.slug,
    name: data.name,
    description: data.description,
    category: data.category,
    intensity: data.intensity,
    capacity: data.capacity,
    durationMin: data.durationMin,
    trainerId: data.trainerId || null,
    imageUrl: data.imageUrl || null,
    imageKey: data.imageKey || null,
    isActive: data.isActive,
    sortOrder: data.sortOrder,
  };

  const gymClass = data.id
    ? await prisma.gymClass.update({ where: { id: data.id }, data: payload })
    : await prisma.gymClass.create({ data: payload });

  await recordAuditLog({
    userId: staff.user.id,
    action: data.id ? "UPDATE_CLASS" : "CREATE_CLASS",
    entity: "GymClass",
    entityId: gymClass.id,
    diff: { name: gymClass.name },
  });

  revalidateTag(CMS_TAGS.classes);
  revalidatePath("/classes");
  revalidatePath("/admin/classes");
  return gymClass;
}

export async function addClassScheduleAction(input: {
  classId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}) {
  const staff = await requireStaff({ permission: "classes:manage" });
  const parsed = z
    .object({
      classId: z.string().min(1),
      dayOfWeek: z.coerce.number().int().min(0).max(6),
      startTime: z.string().regex(/^\d{2}:\d{2}$/),
      endTime: z.string().regex(/^\d{2}:\d{2}$/),
    })
    .parse(input);

  const schedule = await prisma.classSchedule.create({ data: parsed });
  await recordAuditLog({
    userId: staff.user.id,
    action: "ADD_CLASS_SCHEDULE",
    entity: "ClassSchedule",
    entityId: schedule.id,
    diff: parsed,
  });
  revalidateTag(CMS_TAGS.classes);
  revalidatePath("/classes");
  revalidatePath("/admin/classes");
  return schedule;
}

export async function deleteClassScheduleAction(id: string) {
  const staff = await requireStaff({ permission: "classes:manage" });
  await prisma.classSchedule.delete({ where: { id } });
  await recordAuditLog({
    userId: staff.user.id,
    action: "DELETE_CLASS_SCHEDULE",
    entity: "ClassSchedule",
    entityId: id,
  });
  revalidateTag(CMS_TAGS.classes);
  revalidatePath("/classes");
  revalidatePath("/admin/classes");
}

export async function createGalleryItemAction(rawInput: unknown) {
  const staff = await requireStaff({ permission: "cms:manage" });
  const data = galleryItemSchema.parse(rawInput);
  const item = await prisma.galleryItem.create({
    data: {
      imageUrl: data.imageUrl,
      imageKey: data.imageKey || null,
      caption: data.caption,
      category: data.category,
      size: data.size,
      sortOrder: data.sortOrder,
      isActive: data.isActive,
    },
  });
  await recordAuditLog({
    userId: staff.user.id,
    action: "CREATE_GALLERY_ITEM",
    entity: "GalleryItem",
    entityId: item.id,
    diff: { caption: item.caption, category: item.category },
  });
  revalidateTag(CMS_TAGS.gallery);
  revalidatePath("/");
  revalidatePath("/gallery");
  revalidatePath("/admin/cms");
  return item;
}

export async function deleteGalleryItemAction(id: string) {
  const staff = await requireStaff({ permission: "cms:manage" });
  await prisma.galleryItem.delete({ where: { id } });
  await recordAuditLog({
    userId: staff.user.id,
    action: "DELETE_GALLERY_ITEM",
    entity: "GalleryItem",
    entityId: id,
  });
  revalidateTag(CMS_TAGS.gallery);
  revalidatePath("/");
  revalidatePath("/gallery");
  revalidatePath("/admin/cms");
}

export async function upsertTestimonialAction(rawInput: unknown) {
  const staff = await requireStaff({ permission: "cms:manage" });
  const data = testimonialSchema.parse(rawInput);
  const payload = {
    name: data.name,
    result: data.result,
    quote: data.quote,
    photoUrl: data.photoUrl || null,
    photoKey: data.photoKey || null,
    rating: data.rating,
    isApproved: data.isApproved,
    sortOrder: data.sortOrder,
  };
  const item = data.id
    ? await prisma.testimonial.update({ where: { id: data.id }, data: payload })
    : await prisma.testimonial.create({ data: payload });

  await recordAuditLog({
    userId: staff.user.id,
    action: data.id ? "UPDATE_TESTIMONIAL" : "CREATE_TESTIMONIAL",
    entity: "Testimonial",
    entityId: item.id,
  });
  revalidateTag(CMS_TAGS.testimonials);
  revalidatePath("/");
  revalidatePath("/admin/cms");
  return item;
}

export async function deleteTestimonialAction(id: string) {
  const staff = await requireStaff({ permission: "cms:manage" });
  await prisma.testimonial.delete({ where: { id } });
  await recordAuditLog({
    userId: staff.user.id,
    action: "DELETE_TESTIMONIAL",
    entity: "Testimonial",
    entityId: id,
  });
  revalidateTag(CMS_TAGS.testimonials);
  revalidatePath("/");
  revalidatePath("/admin/cms");
}

export async function upsertFaqAction(rawInput: unknown) {
  const staff = await requireStaff({ permission: "cms:manage" });
  const data = faqSchema.parse(rawInput);
  const payload = {
    question: data.question,
    answer: data.answer,
    category: data.category,
    sortOrder: data.sortOrder,
    isActive: data.isActive,
  };
  const faq = data.id
    ? await prisma.fAQ.update({ where: { id: data.id }, data: payload })
    : await prisma.fAQ.create({ data: payload });

  await recordAuditLog({
    userId: staff.user.id,
    action: data.id ? "UPDATE_FAQ" : "CREATE_FAQ",
    entity: "FAQ",
    entityId: faq.id,
  });
  revalidateTag(CMS_TAGS.faqs);
  revalidatePath("/contact");
  revalidatePath("/membership");
  revalidatePath("/admin/cms");
  return faq;
}

export async function deleteFaqAction(id: string) {
  const staff = await requireStaff({ permission: "cms:manage" });
  await prisma.fAQ.delete({ where: { id } });
  await recordAuditLog({
    userId: staff.user.id,
    action: "DELETE_FAQ",
    entity: "FAQ",
    entityId: id,
  });
  revalidateTag(CMS_TAGS.faqs);
  revalidatePath("/contact");
  revalidatePath("/membership");
  revalidatePath("/admin/cms");
}

export async function updateLeadAction(input: {
  id: string;
  status: LeadStatus;
  notes?: string;
}) {
  const staff = await requireStaff({ permission: "leads:manage" });
  const parsed = z
    .object({
      id: z.string().min(1),
      status: z.nativeEnum(LeadStatus),
      notes: z.string().max(1000).optional(),
    })
    .parse(input);

  const lead = await prisma.lead.update({
    where: { id: parsed.id },
    data: {
      status: parsed.status,
      notes: parsed.notes,
      assignedToId: staff.user.id,
    },
  });

  await recordAuditLog({
    userId: staff.user.id,
    action: "UPDATE_LEAD",
    entity: "Lead",
    entityId: lead.id,
    diff: { status: lead.status },
  });

  revalidatePath("/admin/leads");
  revalidatePath("/admin");
  return lead;
}

export async function upsertStaffUserAction(input: {
  id?: string;
  name: string;
  email: string;
  role: Role;
  active: boolean;
}) {
  const staff = await requireStaff({ permission: "staff:manage" });
  const parsed = z
    .object({
      id: z.string().optional(),
      name: z.string().trim().min(2).max(80),
      email: z.string().trim().email().transform((v) => v.toLowerCase()),
      role: z.nativeEnum(Role),
      active: z.boolean(),
    })
    .parse(input);

  const user = parsed.id
    ? await prisma.user.update({
        where: { id: parsed.id },
        data: { name: parsed.name, role: parsed.role, active: parsed.active },
      })
    : await prisma.user.create({
        data: {
          name: parsed.name,
          email: parsed.email,
          role: parsed.role,
          active: parsed.active,
        },
      });

  await recordAuditLog({
    userId: staff.user.id,
    action: parsed.id ? "UPDATE_STAFF" : "CREATE_STAFF",
    entity: "User",
    entityId: user.id,
    diff: { email: user.email, role: user.role, active: user.active },
  });

  revalidatePath("/admin/settings");
  return user;
}
