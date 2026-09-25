"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { FadeUp, StaggerContainer, StaggerItem } from "./ScrollAnimations";
import { trainers } from "@/data/trainers";
import { FaInstagram, FaYoutube, FaLinkedin, FaFacebook } from "react-icons/fa";
import { HiArrowRight } from "react-icons/hi";

export default function TrainerCards() {
    const featured = trainers.find((t) => t.isFeatured);
    const others = trainers.filter((t) => !t.isFeatured).slice(0, 3);

    return (
        <section className="section-padding bg-[var(--background)] relative overflow-hidden transition-colors duration-300">
            <div className="container-custom relative z-10">
                {/* Section Header */}
                <FadeUp className="text-center mb-16">
                    <span className="text-[var(--primary)] font-medium uppercase tracking-wider text-sm">
                        Expert Trainers
                    </span>
                    <h2 className="heading-lg text-[var(--foreground)] mt-4">
                        Meet Your <span className="text-gradient-green">Coaches</span>
                    </h2>
                    <p className="text-[var(--muted-foreground)] max-w-2xl mx-auto mt-4">
                        Led by Mr. India champion Rajith, our certified coaches bring decades of
                        experience to help you achieve results you never imagined.
                    </p>
                </FadeUp>

                {/* Featured CEO Card */}
                {featured && (
                    <FadeUp className="mb-12">
                        <Link href={`/trainers/${featured.id}`}>
                            <motion.div
                                whileHover={{ y: -6 }}
                                className="group relative rounded-3xl overflow-hidden bg-[var(--card)] border-2 border-[var(--primary)]/30 hover:border-[var(--primary)] transition-all duration-500 shadow-[0_4px_24px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_40px_rgba(0,0,0,0.15)]"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                                    {/* Image Side */}
                                    <div className="relative aspect-[4/5] md:aspect-auto md:min-h-[420px] overflow-hidden">
                                        <Image
                                            src={featured.image}
                                            alt={featured.name}
                                            fill
                                            sizes="(max-width: 768px) 100vw, 50vw"
                                            className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                                            priority
                                        />
                                        {/* Always dark overlay on image for text contrast */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent md:bg-gradient-to-r md:from-transparent md:via-black/10 md:to-[var(--card)]" />
                                        {/* "Featured" Badge */}
                                        <div className="absolute top-4 left-4">
                                            <span className="bg-[var(--primary)] text-[var(--primary-foreground)] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-md">
                                                🏆 CEO & Founder
                                            </span>
                                        </div>
                                    </div>

                                    {/* Content Side */}
                                    <div className="p-8 md:p-10 flex flex-col justify-center">
                                        <span className="text-[var(--primary)] text-sm font-bold uppercase tracking-wider mb-2">
                                            {featured.title}
                                        </span>
                                        <h3 className="text-3xl md:text-4xl font-display font-bold text-[var(--card-foreground)] mb-3">
                                            {featured.name}
                                        </h3>
                                        <p className="text-[var(--secondary)] font-semibold text-sm mb-4">
                                            {featured.role}
                                        </p>
                                        <p className="text-[var(--muted-foreground)] leading-relaxed mb-6 line-clamp-3">
                                            {featured.bio}
                                        </p>

                                        {/* Key Achievements */}
                                        <div className="flex flex-wrap gap-2 mb-6">
                                            {featured.achievements.slice(0, 3).map((ach) => (
                                                <span
                                                    key={ach}
                                                    className="text-xs px-3 py-1.5 bg-[var(--primary)]/10 border border-[var(--primary)]/25 rounded-full text-[var(--primary)] font-semibold"
                                                >
                                                    {ach}
                                                </span>
                                            ))}
                                        </div>

                                        {/* Social + CTA */}
                                        <div className="flex items-center justify-between">
                                            <div className="flex gap-2">
                                                {featured.social.instagram && (
                                                    <span className="w-9 h-9 bg-[var(--accent)] rounded-full flex items-center justify-center text-[var(--muted-foreground)] hover:bg-[var(--primary)] hover:text-[var(--primary-foreground)] transition-colors cursor-pointer">
                                                        <FaInstagram className="w-4 h-4" />
                                                    </span>
                                                )}
                                                {featured.social.youtube && (
                                                    <span className="w-9 h-9 bg-[var(--accent)] rounded-full flex items-center justify-center text-[var(--muted-foreground)] hover:bg-[var(--primary)] hover:text-[var(--primary-foreground)] transition-colors cursor-pointer">
                                                        <FaYoutube className="w-4 h-4" />
                                                    </span>
                                                )}
                                                {featured.social.linkedin && (
                                                    <span className="w-9 h-9 bg-[var(--accent)] rounded-full flex items-center justify-center text-[var(--muted-foreground)] hover:bg-[var(--primary)] hover:text-[var(--primary-foreground)] transition-colors cursor-pointer">
                                                        <FaLinkedin className="w-4 h-4" />
                                                    </span>
                                                )}
                                            </div>
                                            <motion.span
                                                whileHover={{ scale: 1.05 }}
                                                className="btn-primary text-sm flex items-center gap-2"
                                            >
                                                View Profile
                                                <HiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                            </motion.span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </Link>
                    </FadeUp>
                )}

                {/* Other Trainers Grid — Show 3 on homepage */}
                <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {others.map((trainer) => (
                        <StaggerItem key={trainer.id}>
                            <Link href={`/trainers/${trainer.id}`}>
                                <motion.div
                                    whileHover={{ y: -10 }}
                                    className="group relative cursor-pointer h-full"
                                >
                                    <div className="relative overflow-hidden rounded-2xl bg-[var(--card)] border border-[var(--border)] transition-all duration-300 hover:border-[var(--primary)]/50 shadow-[0_2px_12px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] h-full">
                                        {/* Image */}
                                        <div className="relative aspect-[4/5] overflow-hidden">
                                            <Image
                                                src={trainer.image}
                                                alt={trainer.name}
                                                fill
                                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                            {/* Always-dark overlay for text on image */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

                                            {/* View Profile Badge */}
                                            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                <span className="bg-[var(--primary)] text-[var(--primary-foreground)] px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-md">
                                                    View <HiArrowRight className="w-3 h-3" />
                                                </span>
                                            </div>

                                            {/* Social Links on Hover — always over dark overlay so white icons work */}
                                            <div className="absolute bottom-20 left-0 right-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                {trainer.social.instagram && (
                                                    <motion.span
                                                        whileHover={{ scale: 1.2 }}
                                                        className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-[var(--primary)] hover:text-[var(--primary-foreground)] transition-colors"
                                                        onClick={(e) => e.preventDefault()}
                                                    >
                                                        <FaInstagram className="w-4 h-4" />
                                                    </motion.span>
                                                )}
                                                {trainer.social.youtube && (
                                                    <motion.span
                                                        whileHover={{ scale: 1.2 }}
                                                        className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-[var(--primary)] hover:text-[var(--primary-foreground)] transition-colors"
                                                        onClick={(e) => e.preventDefault()}
                                                    >
                                                        <FaYoutube className="w-4 h-4" />
                                                    </motion.span>
                                                )}
                                                {trainer.social.linkedin && (
                                                    <motion.span
                                                        whileHover={{ scale: 1.2 }}
                                                        className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-[var(--primary)] hover:text-[var(--primary-foreground)] transition-colors"
                                                        onClick={(e) => e.preventDefault()}
                                                    >
                                                        <FaLinkedin className="w-4 h-4" />
                                                    </motion.span>
                                                )}
                                                {trainer.social.facebook && (
                                                    <motion.span
                                                        whileHover={{ scale: 1.2 }}
                                                        className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-[var(--primary)] hover:text-[var(--primary-foreground)] transition-colors"
                                                        onClick={(e) => e.preventDefault()}
                                                    >
                                                        <FaFacebook className="w-4 h-4" />
                                                    </motion.span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Info — fully theme-aware */}
                                        <div className="p-5">
                                            <h3 className="text-xl font-bold text-[var(--card-foreground)] group-hover:text-[var(--primary)] transition-colors">
                                                {trainer.name}
                                            </h3>
                                            <p className="text-[var(--primary)] font-semibold text-sm mb-1">{trainer.role}</p>
                                            <p className="text-[var(--muted-foreground)] text-xs mb-3">{trainer.experience} Experience</p>
                                            <div className="flex flex-wrap gap-2">
                                                {trainer.specializations.slice(0, 2).map((spec) => (
                                                    <span
                                                        key={spec}
                                                        className="text-xs px-2.5 py-1 bg-[var(--primary)]/8 border border-[var(--primary)]/20 rounded-full text-[var(--primary)] font-medium"
                                                    >
                                                        {spec}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </Link>
                        </StaggerItem>
                    ))}
                </StaggerContainer>

                {/* CTA */}
                <FadeUp delay={0.3} className="text-center mt-12">
                    <Link href="/trainers">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="btn-secondary"
                        >
                            View All 6 Trainers
                        </motion.button>
                    </Link>
                </FadeUp>
            </div>
        </section>
    );
}
