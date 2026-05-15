"use client";

import { FadeUp } from "@/components/ScrollAnimations";
import Link from "next/link";
import PageHero from "@/components/PageHero";

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-[var(--background)] transition-colors duration-300">
            <PageHero
                eyebrow="House Rules"
                title={<>Terms & <span className="text-gradient-gold">Conditions</span></>}
                description="Membership expectations, gym etiquette, billing terms, and safety responsibilities."
                imageSrc="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1920&q=80"
                align="left"
            />
            <section className="container-custom px-4 md:px-8 py-16">

                <FadeUp delay={0.1}>
                    <div className="prose prose-lg max-w-none space-y-8">
                        <div className="card-glass p-8 bg-[var(--card)] border border-[var(--border)] shadow-sm">
                            <h2 className="text-2xl font-bold text-[var(--foreground)] mb-4">1. Membership Agreement</h2>
                            <p className="text-[var(--muted-foreground)]">
                                By signing up for a Rafithub membership, you agree to abide by these terms and conditions.
                                Memberships are personal and non-transferable. You must be at least 18 years old to
                                become a member, or have parental consent.
                            </p>
                        </div>

                        <div className="card-glass p-8 bg-[var(--card)] border border-[var(--border)] shadow-sm">
                            <h2 className="text-2xl font-bold text-[var(--foreground)] mb-4">2. Payment Terms</h2>
                            <ul className="text-[var(--muted-foreground)] space-y-2 list-none pl-0">
                                <li>• Membership fees are billed according to your selected plan</li>
                                <li>• All payments are processed securely through our payment partners</li>
                                <li>• Failed payments may result in suspension of membership privileges</li>
                                <li>• Refunds are provided according to our 30-day money-back guarantee</li>
                            </ul>
                        </div>

                        <div className="card-glass p-8 bg-[var(--card)] border border-[var(--border)] shadow-sm">
                            <h2 className="text-2xl font-bold text-[var(--foreground)] mb-4">3. Gym Rules & Etiquette</h2>
                            <ul className="text-[var(--muted-foreground)] space-y-2 list-none pl-0">
                                <li>• Proper workout attire and footwear required at all times</li>
                                <li>• Wipe down equipment after use</li>
                                <li>• Return weights and equipment to designated areas</li>
                                <li>• Respect other members and staff</li>
                                <li>• No photography or video without permission</li>
                                <li>• Locker room policies must be followed</li>
                            </ul>
                        </div>

                        <div className="card-glass p-8 bg-[var(--card)] border border-[var(--border)] shadow-sm">
                            <h2 className="text-2xl font-bold text-[var(--foreground)] mb-4">4. Liability Waiver</h2>
                            <p className="text-[var(--muted-foreground)]">
                                Members assume all risks associated with the use of gym facilities and equipment.
                                Rafithub is not liable for any injuries, accidents, or health issues that may occur
                                during or as a result of exercising at our facilities. We recommend consulting a
                                physician before starting any exercise program.
                            </p>
                        </div>

                        <div className="card-glass p-8 bg-[var(--card)] border border-[var(--border)] shadow-sm">
                            <h2 className="text-2xl font-bold text-[var(--foreground)] mb-4">5. Cancellation Policy</h2>
                            <p className="text-[var(--muted-foreground)]">
                                You may cancel your membership at any time. Monthly memberships require 30 days
                                notice. Annual memberships may be cancelled with a pro-rated refund within the first
                                30 days. Freeze options are available for qualifying circumstances.
                            </p>
                        </div>

                        <div className="card-glass p-8 bg-[var(--card)] border border-[var(--border)] shadow-sm">
                            <h2 className="text-2xl font-bold text-[var(--foreground)] mb-4">6. Contact</h2>
                            <p className="text-[var(--muted-foreground)]">
                                For questions about these terms, please contact:{" "}
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
