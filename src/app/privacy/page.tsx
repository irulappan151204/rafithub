// Privacy policy — server component so metadata can be exported properly.
// PageHero and FadeUp contain their own "use client" boundaries so the
// page itself does not need to be a client component.
import type { Metadata } from "next";
import { FadeUp } from "@/components/ScrollAnimations";
import Link from "next/link";
import PageHero from "@/components/PageHero";

export const metadata: Metadata = {
    title: "Privacy Policy",
    description: "Read Rafithub's privacy policy — how we collect, use, and protect your personal information as a member of our fitness community.",
    alternates: {
        canonical: "https://rafithub.com/privacy",
    },
};

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-[var(--background)] transition-colors duration-300">
            <PageHero
                eyebrow="Member Trust"
                title={<>Privacy <span className="text-gradient-gold">Policy</span></>}
                description="How Rafithub handles member information, privacy expectations, and service communications."
                imageSrc="https://images.unsplash.com/photo-1593079831268-3381b0db4a77?w=1920&q=80"
                align="left"
            />
            <section className="container-custom px-4 md:px-8 py-16">
                <FadeUp delay={0.1}>
                    <div className="prose max-w-none space-y-8">
                        <div className="card-glass p-8">
                            <h2 className="text-2xl font-bold text-[var(--foreground)] mb-4">1. Information We Collect</h2>
                            <p className="text-[var(--muted-foreground)]">
                                We collect information you provide directly to us, such as when you create an account,
                                make a purchase, subscribe to our newsletter, or contact us for support. This information
                                may include your name, email address, phone number, payment information, and health data
                                relevant to your fitness goals.
                            </p>
                        </div>

                        <div className="card-glass p-8">
                            <h2 className="text-2xl font-bold text-[var(--foreground)] mb-4">2. How We Use Your Information</h2>
                            <ul className="text-[var(--muted-foreground)] space-y-2">
                                <li>• To provide, maintain, and improve our services</li>
                                <li>• To process transactions and send related information</li>
                                <li>• To send promotional communications (with your consent)</li>
                                <li>• To monitor and analyze trends, usage, and activities</li>
                                <li>• To personalize your experience and workout recommendations</li>
                            </ul>
                        </div>

                        <div className="card-glass p-8">
                            <h2 className="text-2xl font-bold text-[var(--foreground)] mb-4">3. Information Sharing</h2>
                            <p className="text-[var(--muted-foreground)]">
                                We do not sell, trade, or rent your personal information to third parties. We may share
                                your information with service providers who assist us in operating our website and
                                conducting our business, so long as those parties agree to keep this information confidential.
                            </p>
                        </div>

                        <div className="card-glass p-8">
                            <h2 className="text-2xl font-bold text-[var(--foreground)] mb-4">4. Data Security</h2>
                            <p className="text-[var(--muted-foreground)]">
                                We implement appropriate security measures to protect your personal information against
                                unauthorized access, alteration, disclosure, or destruction. This includes encryption,
                                secure servers, and regular security audits.
                            </p>
                        </div>

                        <div className="card-glass p-8">
                            <h2 className="text-2xl font-bold text-[var(--foreground)] mb-4">5. Your Rights</h2>
                            <p className="text-[var(--muted-foreground)]">
                                You have the right to access, correct, or delete your personal information. You may also
                                opt out of receiving promotional communications from us by following the unsubscribe
                                instructions in those messages.
                            </p>
                        </div>

                        <div className="card-glass p-8">
                            <h2 className="text-2xl font-bold text-[var(--foreground)] mb-4">6. Contact Us</h2>
                            <p className="text-[var(--muted-foreground)]">
                                If you have any questions about this Privacy Policy, please contact us at:{" "}
                                <Link href="mailto:rafithubmdu@gmail.com" className="text-[var(--primary)] hover:underline">
                                    rafithubmdu@gmail.com
                                </Link>
                            </p>
                        </div>

                        <p className="text-[var(--muted-foreground)] text-sm">
                            Last updated: December 2024
                        </p>
                    </div>
                </FadeUp>
            </section>
        </div>
    );
}
