import TrainersClient from "./TrainersClient";
import { trainers as fallbackTrainers, type Trainer } from "@/data/trainers";
import { getPublicTrainers } from "@/server/services/cms";

export default async function TrainersPage() {
  const dbTrainers = await getPublicTrainers();

  const mapped: Trainer[] =
    dbTrainers.length > 0
      ? dbTrainers.map((t) => ({
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
      : fallbackTrainers;

  return <TrainersClient trainers={mapped} />;
}
