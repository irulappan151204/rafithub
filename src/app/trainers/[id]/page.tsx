// Trainer detail page — server component wrapper for static generation +
// per-trainer metadata. Client-side motion effects live in the inner component.
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTrainerById, trainers } from "@/data/trainers";
import TrainerDetailClient from "./TrainerDetailClient";

interface Props {
    params: { id: string };
}

// Pre-generate a static page for every trainer at build time.
export function generateStaticParams() {
    return trainers.map((trainer) => ({ id: trainer.id }));
}

// Per-trainer meta title, description and OG image so Google indexes
// each profile page independently with meaningful titles.
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const trainer = getTrainerById(params.id);
    if (!trainer) return {};

    const descriptionSnippet = trainer.bio.slice(0, 155).trimEnd() + "…";

    return {
        title: `${trainer.name} | ${trainer.title}`,
        description: descriptionSnippet,
        alternates: {
            canonical: `https://rafithub.com/trainers/${trainer.id}`,
        },
        openGraph: {
            title: `${trainer.name} | Rafithub`,
            description: descriptionSnippet,
            url: `https://rafithub.com/trainers/${trainer.id}`,
            images: [
                {
                    url: `https://rafithub.com${trainer.image}`,
                    width: 800,
                    height: 1067,
                    alt: trainer.name,
                },
            ],
        },
    };
}

export default function TrainerDetailPage({ params }: Props) {
    const trainer = getTrainerById(params.id);
    if (!trainer) notFound();

    return <TrainerDetailClient trainer={trainer!} />;
}
