"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { FadeUp, SlideLeft, SlideRight, StaggerContainer, StaggerItem } from "@/components/ScrollAnimations";
import PageHero from "@/components/PageHero";
import { HiHeart, HiLightningBolt, HiUserGroup, HiStar } from "react-icons/hi";

const timeline = [
    {
        year: "2009",
        title: "The Dream Begins",
        description: "Rafithub was founded in a small 2,000 sq ft space with a small team and a vision to transform lives.",
    },
    {
        year: "2012",
        title: "First Expansion",
        description: "Expanded to 10,000 sq ft facility and introduced CrossFit and HIIT programs.",
    },
    {
        year: "2015",
        title: "Going Premium",
        description: "Launched elite membership tier and added spa, recovery zone, and nutrition services.",
    },
    {
        year: "2018",
        title: "Community Growth",
        description: "Reached 5,000 active members and opened second location.",
    },
    {
        year: "2021",
        title: "Innovation Era",
        description: "Introduced smart gym technology, mobile app, and virtual training options.",
    },
    {
        year: "2024",
        title: "Industry Leader",
        description: "Named #1 premium gym in the city with 10,000+ members and a team of elite specialized coaches.",
    },
];

const values = [
    {
        icon: HiHeart,
        title: "Passion",
        description: "We live and breathe fitness. Every rep counts, every member matters.",
    },
    {
        icon: HiLightningBolt,
        title: "Excellence",
        description: "We never settle. Continuous improvement drives everything we do.",
    },
    {
        icon: HiUserGroup,
        title: "Community",
        description: "Stronger together. Our members are family, supporting each other always.",
    },
    {
        icon: HiStar,
        title: "Results",
        description: "We deliver. Your transformation is our success story.",
    },
];

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-[var(--background)] transition-colors duration-300">
            <PageHero
                eyebrow="About Us"
                title={<>Our <span className="text-gradient-gold">Story</span></>}
                description="From a focused training floor to Madurai's premium fitness destination, Rafithub has been transforming lives for over 15 years through passion, innovation, and an unwavering commitment to members."
                imageSrc="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&q=80"
                stats={[
                    { value: "2009", label: "Founded" },
                    { value: "10K+", label: "Members" },
                    { value: "25K", label: "Sq Ft" },
                    { value: "4.9", label: "Rating" },
                ]}
            />

            {/* Founder Section */}
            <section className="container-custom px-4 md:px-8 py-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <SlideRight>
                        <div className="relative aspect-square rounded-3xl overflow-hidden">
                            <Image
                                src="/trainers/1.jpg"
                                alt="Founder Dr. Ranjith"
                                fill
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)]/80 to-transparent" />
                            <div className="absolute bottom-8 left-8">
                                <h3 className="text-2xl font-bold text-white">Dr. Ranjith</h3>
                                <p className="text-[var(--secondary)]">Founder & CEO</p>
                            </div>
                        </div>
                    </SlideRight>

                    <SlideLeft>
                        <div>
                            <span className="text-[var(--primary)] font-medium uppercase tracking-wider text-sm">
                                The Vision
                            </span>
                            <h2 className="heading-md text-[var(--foreground)] mt-4 mb-6">
                                Building Champions Since 2009
                            </h2>
                            <div className="space-y-4 text-[var(--muted-foreground)]">
                                <p>
                                    &ldquo;When I founded Rafithub, I had one simple goal: create a space where
                                    anyone, regardless of their fitness level, could feel empowered to become
                                    the best version of themselves.&rdquo;
                                </p>
                                <p>
                                    &ldquo;Today, seeing thousands of members transform their bodies and minds
                                    is the greatest reward. This isn&apos;t just a gym—it&apos;s a movement, a family,
                                    a lifestyle. And we&apos;re just getting started.&rdquo;
                                </p>
                            </div>
                            <div className="mt-8 flex gap-8">
                                <div>
                                    <div className="font-display text-4xl text-[var(--primary)]">15+</div>
                                    <div className="text-[var(--muted-foreground)] text-sm">Years Experience</div>
                                </div>
                                <div>
                                    <div className="font-display text-4xl text-[var(--secondary)]">10K+</div>
                                    <div className="text-[var(--muted-foreground)] text-sm">Lives Changed</div>
                                </div>
                                <div>
                                    <div className="font-display text-4xl text-[var(--primary)]">6+</div>
                                    <div className="text-[var(--muted-foreground)] text-sm">Expert Trainers</div>
                                </div>
                            </div>
                        </div>
                    </SlideLeft>
                </div>
            </section>

            {/* Values */}
            <section className="container-custom px-4 md:px-8 py-20">
                <FadeUp className="text-center mb-12">
                    <span className="text-[var(--secondary)] font-medium uppercase tracking-wider text-sm">
                        Our Core Values
                    </span>
                    <h2 className="heading-md text-[var(--foreground)] mt-4">
                        What Drives <span className="text-[var(--primary)]">Us</span>
                    </h2>
                </FadeUp>

                <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {values.map((value) => (
                        <StaggerItem key={value.title}>
                            <motion.div
                                whileHover={{ y: -10 }}
                                className="card-glass p-8 text-center h-full bg-[var(--card)]/80"
                            >
                                <motion.div
                                    whileHover={{ scale: 1.1, rotate: 10 }}
                                    className="w-16 h-16 mx-auto bg-[var(--primary)]/10 rounded-2xl flex items-center justify-center mb-6"
                                >
                                    <value.icon className="w-8 h-8 text-[var(--primary)]" />
                                </motion.div>
                                <h3 className="text-xl font-bold text-[var(--foreground)] mb-3">{value.title}</h3>
                                <p className="text-[var(--muted-foreground)]">{value.description}</p>
                            </motion.div>
                        </StaggerItem>
                    ))}
                </StaggerContainer>
            </section>

            {/* Timeline */}
            <section className="container-custom px-4 md:px-8 py-20">
                <FadeUp className="text-center mb-16">
                    <span className="text-[var(--primary)] font-medium uppercase tracking-wider text-sm">
                        Our Journey
                    </span>
                    <h2 className="heading-md text-[var(--foreground)] mt-4">
                        The <span className="text-gradient-gold">Timeline</span>
                    </h2>
                </FadeUp>

                <div className="relative">
                    {/* Vertical Line */}
                    <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[var(--primary)] via-[var(--secondary)] to-[var(--primary)]" />

                    <div className="space-y-12">
                        {timeline.map((item, index) => (
                            <FadeUp key={item.year} delay={index * 0.1}>
                                <div
                                    className={`relative flex flex-col md:flex-row gap-8 ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                                        }`}
                                >
                                    {/* Content */}
                                    <div
                                        className={`md:w-1/2 ${index % 2 === 0 ? "md:text-right md:pr-12" : "md:pl-12"
                                            } pl-12 md:pl-0`}
                                    >
                                        <span className="font-display text-4xl text-[var(--primary)]">{item.year}</span>
                                        <h3 className="text-xl font-bold text-[var(--foreground)] mt-2 mb-2">{item.title}</h3>
                                        <p className="text-[var(--muted-foreground)]">{item.description}</p>
                                    </div>

                                    {/* Dot */}
                                    <div className="absolute left-4 md:left-1/2 top-2 w-4 h-4 -translate-x-1/2 bg-[var(--background)] border-4 border-[var(--primary)] rounded-full" />

                                    {/* Empty space for opposite side */}
                                    <div className="hidden md:block md:w-1/2" />
                                </div>
                            </FadeUp>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="container-custom px-4 md:px-8 py-20">
                <FadeUp>
                    <div className="bg-gradient-to-r from-[var(--primary)]/10 to-[var(--secondary)]/10 border border-[var(--border)] rounded-3xl p-8 md:p-12">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                            {[
                                { value: "25,000", label: "Square Feet" },
                                { value: "200+", label: "Equipment Pieces" },
                                { value: "100+", label: "Weekly Classes" },
                                { value: "4.9", label: "Star Rating" },
                            ].map((stat) => (
                                <div key={stat.label}>
                                    <div className="font-display text-4xl md:text-5xl text-[var(--primary)]">{stat.value}</div>
                                    <div className="text-[var(--muted-foreground)] uppercase tracking-wider text-sm mt-2">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </FadeUp>
            </section>
        </div>
    );
}
