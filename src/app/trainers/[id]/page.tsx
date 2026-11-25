import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTrainerById, trainers as fallbackTrainers, type Trainer } from "@/data/trainers";
import { getPublicTrainers } from "@/server/services/cms";
import { getSiteUrl } from "@/lib/format";
import TrainerDetailClient from "./TrainerDetailClient";

interface Props {
  params: { id: string };
}

export async function generateStaticParams() {
  const dbTrainers = await getPublicTrainers();
  if (dbTrainers.length > 0) {
    return dbTrainers.map((t) => ({ id: t.slug }));
  }
  return fallbackTrainers.map((trainer) => ({ id: trainer.id }));
}

async function resolveTrainer(slug: string): Promise<Trainer | undefined> {
  const dbTrainers = await getPublicTrainers();
  const dbMatch = dbTrainers.find((t) => t.slug === slug);
  if (dbMatch) {
    return {
      id: dbMatch.slug,
      name: dbMatch.name,
      role: dbMatch.role,
      title: dbMatch.title,
      image: dbMatch.photoUrl,
      specializations: dbMatch.specialties,
      experience: dbMatch.experienceLabel ?? `${dbMatch.experienceYears}+ years`,
      certifications: dbMatch.certifications,
      bio: dbMatch.bio,
      achievements: dbMatch.achievements,
      gallery: dbMatch.galleryImages,
      isFeatured: dbMatch.isFeatured,
      accentColor: dbMatch.accentColor ?? undefined,
      social: (dbMatch.socialLinks as Record<string, string | undefined>) ?? {},
      contact: { email: dbMatch.contactEmail ?? "", phone: dbMatch.contactPhone ?? "" },
    };
  }
  return getTrainerById(slug);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const trainer = await resolveTrainer(params.id);
  if (!trainer) return {};

  const siteUrl = getSiteUrl();
  const descriptionSnippet = trainer.bio.slice(0, 155).trimEnd() + "…";

  return {
    title: `${trainer.name} | ${trainer.title}`,
    description: descriptionSnippet,
    alternates: {
      canonical: `/trainers/${trainer.id}`,
    },
    openGraph: {
      title: `${trainer.name} | Rafithub`,
      description: descriptionSnippet,
      url: `${siteUrl}/trainers/${trainer.id}`,
      images: [
        {
          url: trainer.image.startsWith("http") ? trainer.image : `${siteUrl}${trainer.image}`,
          width: 800,
          height: 1067,
          alt: trainer.name,
        },
      ],
    },
  };
}

export default async function TrainerDetailPage({ params }: Props) {
  const trainer = await resolveTrainer(params.id);
  if (!trainer) notFound();

  return <TrainerDetailClient trainer={trainer} />;
}
