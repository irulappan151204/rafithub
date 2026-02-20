"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { FadeUp, StaggerContainer, StaggerItem } from "@/components/ScrollAnimations";
import { trainers } from "@/data/trainers";
import { FaInstagram, FaYoutube, FaLinkedin, FaFacebook } from "react-icons/fa";
import { HiArrowRight } from "react-icons/hi";

function SocialIcon({ platform, href }: { platform: string; href: string }) {
    const icons: Record<string, React.ReactNode> = {
        instagram: <FaInstagram className="w-5 h-5" />,
        youtube: <FaYoutube className="w-5 h-5" />,
        linkedin: <FaLinkedin className="w-5 h-5" />,
        facebook: <FaFacebook className="w-5 h-5" />,
    };
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={platform}
            className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-[var(--primary)] hover:text-[var(--primary-foreground)] transition-colors"
        >
            {icons[platform]}
        </a>
    );
}

export default function TrainersPage() {
    const featured = trainers.find((t) => t.isFeatured);
    const others = trainers.filter((t) => !t.isFeatured);

    return (
        <div className="min-h-screen bg-[var(--background)] pt-24 transition-colors duration-300">
            {/* Hero Section */}
            <section className="py-16 px-4 md:px-8 text-center">
                <FadeUp>
                    <span className="text-[var(--primary)] font-medium uppercase tracking-wider text-sm">
                        Our Experts
                    </span>
                    <h1 className="heading-lg text-[var(--foreground)] mt-4">
                        Meet Your <span className="text-gradient-gold">Coaches</span>
                    </h1>
                    <p className="text-[var(--muted-foreground)] max-w-2xl mx-auto mt-4">
                        Led by Mr. India champion Rajith, our 6 certified trainers bring decades of
                        experience and passion to transform your fitness journey.
                    </p>
                </FadeUp>
            </section>

            {/* Featured CEO Card */}
            {featured && (
                <section className="container-custom px-4 md:px-8 pb-12">
                    <FadeUp>
                        <Link href={`/trainers/${featured.id}`}>
                            <motion.div
                                whileHover={{ y: -6 }}
                                className="group relative rounded-3xl overflow-hidden bg-[var(--card)] border-2 border-[var(--primary)]/30 hover:border-[var(--primary)] transition-all duration-500 shadow-[0_4px_24px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_40px_rgba(0,0,0,0.15)]"
                            >
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                                    {/* Image Side */}
                                    <div className="relative aspect-[4/5] lg:aspect-auto lg:min-h-[550px] overflow-hidden">
                                        <Image
                                            src={featured.image}
                                            alt={featured.name}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                                            priority
                                        />
                                        {/* Always-dark overlay on image */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-black/10 lg:to-[var(--card)]" />
                                        {/* Badge */}
                                        <div className="absolute top-6 left-6">
                                            <span className="bg-[var(--primary)] text-[var(--primary-foreground)] px-5 py-2 rounded-full text-sm font-bold uppercase tracking-wider shadow-lg">
                                                🏆 CEO & Founder
                                            </span>
                                        </div>
                                        {/* Social on Image — always over dark overlay */}
                                        <div className="absolute bottom-6 left-6 flex gap-3">
                                            {Object.entries(featured.social).map(([platform, href]) =>
                                                href ? <SocialIcon key={platform} platform={platform} href={href} /> : null
                                            )}
                                        </div>
                                    </div>

                                    {/* Content Side — fully theme-aware */}
                                    <div className="p-8 lg:p-12 flex flex-col justify-center">
                                        <span className="text-[var(--primary)] text-sm font-bold uppercase tracking-wider mb-2">
                                            {featured.title}
                                        </span>
                                        <h2 className="text-4xl lg:text-5xl font-display font-bold text-[var(--card-foreground)] mb-2">
                                            {featured.name}
                                        </h2>
                                        <p className="text-[var(--secondary)] font-semibold mb-6">
                                            {featured.role}
                                        </p>
                                        <p className="text-[var(--muted-foreground)] leading-relaxed mb-6">
                                            {featured.bio}
                                        </p>

                                        {/* Achievements */}
                                        <div className="mb-6">
                                            <h3 className="text-sm font-bold text-[var(--card-foreground)] uppercase tracking-wider mb-3">
                                                Key Achievements
                                            </h3>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                {featured.achievements.map((ach) => (
                                                    <span
                                                        key={ach}
                                                        className="text-xs px-3 py-2 bg-[var(--primary)]/10 border border-[var(--primary)]/20 rounded-lg text-[var(--card-foreground)] font-medium"
                                                    >
                                                        {ach}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Specializations */}
                                        <div className="mb-6">
                                            <div className="flex flex-wrap gap-2">
                                                {featured.specializations.slice(0, 3).map((spec) => (
                                                    <span
                                                        key={spec}
                                                        className="text-xs px-3 py-1.5 bg-[var(--secondary)]/10 border border-[var(--secondary)]/25 rounded-full text-[var(--secondary)] font-semibold"
                                                    >
                                                        {spec}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Certifications */}
                                        <p className="text-xs text-[var(--muted-foreground)] mb-6">
                                            <span className="font-bold text-[var(--card-foreground)]">Certifications: </span>
                                            {featured.certifications.join(" | ")}
                                        </p>

                                        <motion.span
                                            whileHover={{ scale: 1.05 }}
                                            className="btn-primary text-center flex items-center justify-center gap-2 w-fit"
                                        >
                                            View Full Profile
                                            <HiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </motion.span>
                                    </div>
                                </div>
                            </motion.div>
                        </Link>
                    </FadeUp>
                </section>
            )}

            {/* Other Trainers Grid */}
            <section className="container-custom px-4 md:px-8 pb-20">
                <FadeUp className="mb-10">
                    <h2 className="heading-md text-[var(--foreground)]">
                        Our <span className="text-gradient-green">Team</span>
                    </h2>
                </FadeUp>

                <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {others.map((trainer) => (
                        <StaggerItem key={trainer.id}>
                            <motion.div
                                whileHover={{ y: -10 }}
                                className="group h-full"
                            >
                                <div className="relative rounded-3xl overflow-hidden bg-[var(--card)] border border-[var(--border)] shadow-[0_2px_16px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:border-[var(--primary)]/40 transition-all duration-500 h-full flex flex-col">
                                    {/* Image — always-dark overlay for white text on image */}
                                    <div className="relative aspect-[3/4] overflow-hidden">
                                        <Image
                                            src={trainer.image}
                                            alt={trainer.name}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

                                        {/* Social Links on Hover — over dark overlay */}
                                        <div className="absolute top-4 right-4 flex flex-col gap-2 translate-x-16 group-hover:translate-x-0 transition-transform duration-300">
                                            {Object.entries(trainer.social).map(([platform, href]) =>
                                                href ? <SocialIcon key={platform} platform={platform} href={href} /> : null
                                            )}
                                        </div>

                                        {/* Sophiea accent badge */}
                                        {trainer.accentColor && (
                                            <div className="absolute top-4 left-4">
                                                <span
                                                    className="px-3 py-1 rounded-full text-xs font-bold text-white shadow-md"
                                                    style={{ backgroundColor: trainer.accentColor }}
                                                >
                                                    ✨ Women&apos;s Specialist
                                                </span>
                                            </div>
                                        )}

                                        {/* Content on Image — white text on dark overlay */}
                                        <div className="absolute bottom-0 left-0 right-0 p-6">
                                            <h3 className="text-2xl font-display font-bold text-white mb-1">
                                                {trainer.name}
                                            </h3>
                                            <p className="text-emerald-400 font-semibold text-sm mb-1">
                                                {trainer.title}
                                            </p>
                                            <p className="text-gray-300 text-xs mb-4">
                                                {trainer.role} · {trainer.experience}
                                            </p>

                                            {/* Specialization Tags — on dark overlay */}
                                            <div className="flex flex-wrap gap-1.5 mb-4">
                                                {trainer.specializations.slice(0, 3).map((spec) => (
                                                    <span
                                                        key={spec}
                                                        className="text-[10px] px-2 py-0.5 bg-white/15 backdrop-blur-sm rounded-full text-white/90 font-medium"
                                                    >
                                                        {spec}
                                                    </span>
                                                ))}
                                            </div>

                                            <Link href={`/trainers/${trainer.id}`}>
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    className="flex items-center gap-2 text-sm font-bold text-white group/btn"
                                                >
                                                    View Profile
                                                    <HiArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                                </motion.button>
                                            </Link>
                                        </div>
                                    </div>

                                    {/* Expanded Info — fully theme-aware */}
                                    <div className="p-5 flex-1 flex flex-col">
                                        <p className="text-[var(--muted-foreground)] text-sm leading-relaxed line-clamp-3 mb-4">
                                            {trainer.bio}
                                        </p>

                                        {/* Key Achievements */}
                                        <div className="flex flex-wrap gap-1.5 mb-4">
                                            {trainer.achievements.slice(0, 3).map((ach) => (
                                                <span
                                                    key={ach}
                                                    className="text-[11px] px-2 py-1 bg-[var(--primary)]/8 border border-[var(--primary)]/15 rounded-md text-[var(--muted-foreground)] font-medium"
                                                >
                                                    {ach}
                                                </span>
                                            ))}
                                        </div>

                                        {/* Certifications */}
                                        <p className="text-[10px] text-[var(--muted-foreground)] mt-auto pt-3 border-t border-[var(--border)]">
                                            <span className="font-bold text-[var(--card-foreground)]">Cert: </span>
                                            {trainer.certifications.join(" | ")}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        </StaggerItem>
                    ))}
                </StaggerContainer>
            </section>

            {/* CTA */}
            <section className="container-custom px-4 md:px-8 pb-20">
                <FadeUp>
                    <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                        <Image
                            src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1200&q=80"
                            alt="Train with us"
                            fill
                            className="object-cover"
                        />
                        {/* Always-dark overlay — theme-independent for CTA readability */}
                        <div className="absolute inset-0 bg-black/70" />
                        <div className="relative z-10 p-8 md:p-16 text-center">
                            <h2 className="heading-md text-white mb-6">
                                Ready to Train with the Best?
                            </h2>
                            <p className="text-gray-300 max-w-2xl mx-auto mb-8 text-lg">
                                Book a session with one of our 6 expert trainers and start your transformation journey today.
                            </p>
                            <div className="flex justify-center gap-4 flex-wrap">
                                <Link href="/contact">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="btn-primary"
                                    >
                                        Book a Session
                                    </motion.button>
                                </Link>
                                <Link href="/membership">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="btn-outline border-white text-white hover:bg-white hover:text-black hover:border-white"
                                    >
                                        View Memberships
                                    </motion.button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </FadeUp>
            </section>
        </div>
    );
}
