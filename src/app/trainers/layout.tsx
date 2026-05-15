import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Our Expert Trainers | Rafithub",
    description: "Meet the elite fitness coaches at Rafithub. Our certified specialists in bodybuilding, combat fitness, clinical nutrition, yoga, and women's fitness.",
};

export default function TrainersLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
