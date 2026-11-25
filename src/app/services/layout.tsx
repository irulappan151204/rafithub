import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services & Training Programs",
  description:
    "Explore strength training, CrossFit, cardio & HIIT, 1-on-1 personal training, yoga, and nutrition coaching at Rafithub in Kochadai, Madurai.",
  alternates: {
    canonical: "/services",
  },
};

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
