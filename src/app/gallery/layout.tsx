import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Facility Gallery",
    description: "Take a virtual tour of Rafithub. Explore our premium fitness facility, state-of-the-art equipment, and dynamic workout zones in Madurai.",
    alternates: { canonical: "/gallery" },
};

export default function GalleryLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
