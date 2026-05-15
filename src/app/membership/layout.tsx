import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Membership Plans | Rafithub",
    description: "Choose the perfect membership plan at Rafithub. Monthly, 3-Month, 6-Month, and Annual plans with access to premium fitness facilities and expert personal training.",
};

export default function MembershipLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
