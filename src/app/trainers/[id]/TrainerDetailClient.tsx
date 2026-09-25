"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { FadeUp, StaggerContainer, StaggerItem } from "@/components/ScrollAnimations";
import PageHero from "@/components/PageHero";
import { trainers, type Trainer } from "@/data/trainers";
import { FaYoutube, FaLinkedin } from "react-icons/fa";
import { HiArrowLeft, HiStar, HiBadgeCheck } from "react-icons/hi";

interface Props {
    trainer: Trainer;
}

export default function TrainerDetailClient({ trainer }: Props) {
    return (
        <div className="min-h-screen bg-[var(--background)] transition-colors duration-300">
            <PageHero
                eyebrow={trainer.title}
                title={<>{trainer.name}</>}
                description={trainer.bio}
                imageSrc={trainer.image}
                align="left"
                stats={[
                    { value: trainer.experience.replace(" years", "y"), label: "Experience" },
                    { value: String(trainer.specializations.length), label: "Specialties" },
                    { value: String(trainer.certifications.length), label: "Certs" },
                    { value: String(trainer.achievements.length), label: "Awards" },
                ]}
            />

            {/* Back Button */}
            <div className="container-custom px-4 md:px-8 py-4">
                <Link href="/trainers">
                    <motion.button
                        whileHover={{ x: -5 }}
                        className="flex items-center gap-2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
                    >
                        <HiArrowLeft className="w-5 h-5" />
                        Back to Trainers
                    </motion.button>
                </Link>
            </div>

            {/* Hero Section */}
            <section className="container-custom px-4 md:px-8 pb-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                    {/* Image — corrected sizes: 50vw at lg+ */}
                    <FadeUp>
                        <div className="relative">
                            <div className="relative aspect-[3/4] rounded-3xl overflow-hidden">
                                <Image
                                    src={trainer.image}
                                    alt={trainer.name}
                                    fill
                                    sizes="(max-width: 1024px) 100vw, 50vw"
                                    className="object-cover"
                                    priority
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)]/60 via-transparent to-transparent" />
                            </div>
                            {/* Social Links */}
                            <div className="absolute bottom-6 left-6 flex gap-3">
                                {trainer.social.youtube && (
                                    <motion.a
                                        href={trainer.social.youtube}
                                        whileHover={{ scale: 1.1 }}
                                        aria-label={`${trainer.name} on YouTube`}
                                        className="w-12 h-12 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-[var(--primary)] hover:text-[var(--primary-foreground)] transition-colors"
                                    >
                                        <FaYoutube className="w-5 h-5" />
                                    </motion.a>
                                )}
                                {trainer.social.linkedin && (
                                    <motion.a
                                        href={trainer.social.linkedin}
                                        whileHover={{ scale: 1.1 }}
                                        aria-label={`${trainer.name} on LinkedIn`}
                                        className="w-12 h-12 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-[var(--primary)] hover:text-[var(--primary-foreground)] transition-colors"
                                    >
                                        <FaLinkedin className="w-5 h-5" />
                                    </motion.a>
                                )}
                            </div>
                        </div>
                    </FadeUp>

                    {/* Content */}
                    <div>
                        <FadeUp>
                            <span className="text-[var(--primary)] font-medium uppercase tracking-wider text-sm">
                                {trainer.title}
                            </span>
                            <h1 className="heading-lg text-[var(--foreground)] mt-2">{trainer.name}</h1>
                            <p className="text-[var(--secondary)] font-medium mt-1">{trainer.role}</p>
                            <div className="flex items-center gap-4 mt-4">
                                <span className="text-[var(--primary)] font-bold">{trainer.experience} Experience</span>
                            </div>
                        </FadeUp>

                        {/* Specializations */}
                        <FadeUp delay={0.1} className="mt-8">
                            <h3 className="text-lg font-bold text-[var(--foreground)] mb-4">Specializations</h3>
                            <div className="flex flex-wrap gap-2">
                                {trainer.specializations.map((spec) => (
                                    <span
                                        key={spec}
                                        className="px-4 py-2 bg-[var(--primary)]/10 border border-[var(--primary)]/30 rounded-full text-[var(--primary)] text-sm"
                                    >
                                        {spec}
                                    </span>
                                ))}
                            </div>
                        </FadeUp>

                        {/* Bio */}
                        <FadeUp delay={0.2} className="mt-8">
                            <h3 className="text-lg font-bold text-[var(--foreground)] mb-4">About</h3>
                            <p className="text-[var(--muted-foreground)] leading-relaxed">{trainer.bio}</p>
                        </FadeUp>

                        {/* Certifications */}
                        <FadeUp delay={0.3} className="mt-8">
                            <h3 className="text-lg font-bold text-[var(--foreground)] mb-4 flex items-center gap-2">
                                <HiBadgeCheck className="w-5 h-5 text-[var(--secondary)]" />
                                Certifications
                            </h3>
                            <ul className="space-y-2">
                                {trainer.certifications.map((cert) => (
                                    <li key={cert} className="flex items-center gap-3 text-[var(--muted-foreground)]">
                                        <span className="w-2 h-2 bg-[var(--primary)] rounded-full flex-shrink-0" />
                                        {cert}
                                    </li>
                                ))}
                            </ul>
                        </FadeUp>
                    </div>
                </div>
            </section>

            {/* Achievements */}
            <section className="container-custom px-4 md:px-8 pb-16">
                <FadeUp>
                    <h2 className="heading-md text-[var(--foreground)] mb-8 flex items-center gap-3">
                        <HiStar className="w-8 h-8 text-[var(--secondary)]" />
                        Achievements
                    </h2>
                </FadeUp>
                <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {trainer.achievements.map((achievement) => (
                        <StaggerItem key={achievement}>
                            <div className="card-glass p-6 text-center h-full bg-[var(--card)] border border-[var(--border)]">
                                <p className="text-[var(--foreground)] font-medium">{achievement}</p>
                            </div>
                        </StaggerItem>
                    ))}
                </StaggerContainer>
            </section>

            {/* Gallery */}
            <section className="container-custom px-4 md:px-8 pb-20">
                <FadeUp>
                    <h2 className="heading-md text-[var(--foreground)] mb-8">Gallery</h2>
                </FadeUp>
                <StaggerContainer className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {trainer.gallery.map((img, index) => (
                        <StaggerItem key={index}>
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                className="relative aspect-video rounded-2xl overflow-hidden shadow-sm"
                            >
                                <Image
                                    src={img}
                                    alt={`${trainer.name} gallery photo ${index + 1}`}
                                    fill
                                    sizes="(max-width: 640px) 100vw, 33vw"
                                    className="object-cover"
                                />
                            </motion.div>
                        </StaggerItem>
                    ))}
                </StaggerContainer>
            </section>

            {/* Other Trainers */}
            <section className="container-custom px-4 md:px-8 pb-20">
                <FadeUp>
                    <h2 className="heading-md text-[var(--foreground)] mb-8">Other Trainers</h2>
                </FadeUp>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {trainers
                        .filter((t) => t.id !== trainer.id)
                        .slice(0, 3)
                        .map((t) => (
                            <Link key={t.id} href={`/trainers/${t.id}`}>
                                <motion.div
                                    whileHover={{ y: -5 }}
                                    className="relative aspect-[3/4] rounded-2xl overflow-hidden group shadow-md"
                                >
                                    <Image
                                        src={t.image}
                                        alt={t.name}
                                        fill
                                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                                    <div className="absolute bottom-4 left-4">
                                        <p className="text-white font-bold text-sm">{t.name}</p>
                                        <p className="text-[var(--primary)] text-xs">{t.role}</p>
                                    </div>
                                </motion.div>
                            </Link>
                        ))}
                </div>
            </section>
        </div>
    );
}
