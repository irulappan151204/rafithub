import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "About Us | Rafithub",
    description: "Learn about the story and team behind Rafithub. Discover our journey, values, and the expert trainers who help you achieve your fitness goals in Madurai.",
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
