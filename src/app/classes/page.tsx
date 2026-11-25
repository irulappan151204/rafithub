import ClassesClient from "./ClassesClient";
import { getPublicClasses } from "@/server/services/cms";

export default async function ClassesPage() {
  const dbClasses = await getPublicClasses();

  return (
    <ClassesClient
      classes={dbClasses.map((c) => ({
        id: c.id,
        name: c.name,
        category: c.category,
        description: c.description,
        intensity: c.intensity,
        durationMin: c.durationMin,
        trainerName: c.trainer?.name ?? null,
        schedules: c.schedules,
      }))}
    />
  );
}
