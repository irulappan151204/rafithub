import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Contact Us | Rafithub",
    description: "Get in touch with Rafithub in Madurai. Contact us for inquiries, memberships, personal training, or scheduling a free trial. Find our address, phone, and hours.",
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
