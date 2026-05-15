import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Fitness Classes & Programs | Rafithub",
    description: "Explore world-class workouts at Rafithub including Strength & Conditioning, HIIT, Functional Training, Cardio, and Yoga in Madurai.",
};

export default function ClassesLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
