"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { FadeUp, StaggerContainer, StaggerItem } from "./ScrollAnimations";
import { HiArrowRight } from "react-icons/hi";
import { TiltCard } from "./PremiumMotion";

export interface GalleryPreviewItem {
    src: string;
    alt: string;
    size: string;
}

export default function GalleryPreview({ items = [] }: { items?: GalleryPreviewItem[] }) {
    const galleryImages = items;
    if (galleryImages.length === 0) {
        return null;
    }
    return (
        <section className="section-padding premium-section bg-[var(--background)] transition-colors duration-300">
            {/* Background elements to smooth transitions */}
            <div className="absolute inset-0 bg-gradient-to-b from-[var(--card)] to-[var(--background)] opacity-50 pointer-events-none" />

            <div className="container-custom relative z-10">
                {/* Section Header */}
                <FadeUp className="text-center mb-16">
                    <span className="section-kicker text-[var(--secondary)] float-badge">
                        Our Facilities
                    </span>
                    <h2 className="heading-lg text-[var(--foreground)] mt-4">
                        Step Inside <span className="text-gradient-green">Rafithub</span>
                    </h2>
                    <p className="text-[var(--muted-foreground)] max-w-2xl mx-auto mt-4">
                        Experience our world-class facilities designed to inspire and
                        elevate your workout experience.
                    </p>
                </FadeUp>

                {/* Gallery Grid */}
                <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[200px]">
                    {galleryImages.map((image, index) => (
                        <StaggerItem
                            key={index}
                            className={`${image.size === "large"
                                ? "col-span-2 row-span-1"
                                : image.size === "tall"
                                    ? "col-span-1 row-span-2"
                                    : "col-span-1 row-span-1"
                                }`}
                        >
                            <Link href="/gallery" className="block h-full w-full" aria-label={`View ${image.alt} in gallery`}>
                                <TiltCard className="group h-full w-full cursor-pointer border border-[var(--border)]" depth={7}>
                                <Image
                                    src={image.src}
                                    alt={image.alt}
                                    fill
                                    sizes={
                                        image.size === "large"
                                            ? "(max-width: 768px) 100vw, 50vw"
                                            : image.size === "tall"
                                            ? "(max-width: 768px) 50vw, 25vw"
                                            : "(max-width: 768px) 50vw, 25vw"
                                    }
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                {/* Overlay - Always dark to ensure white icon visibility */}
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        whileHover={{ scale: 1 }}
                                        className="w-12 h-12 bg-[var(--primary)] rounded-full flex items-center justify-center"
                                    >
                                        <svg
                                            className="w-6 h-6 text-[var(--primary-foreground)]"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7"
                                            />
                                        </svg>
                                    </motion.div>
                                </div>
                                {/* Caption */}
                                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[var(--background)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <p className="text-[var(--foreground)] text-sm font-medium">{image.alt}</p>
                                </div>
                            </TiltCard>
                            </Link>
                        </StaggerItem>
                    ))}
                </StaggerContainer>

                {/* CTA with added spacing */}
                <FadeUp delay={0.3} className="text-center mt-12 mb-16 md:mb-24">
                    <Link href="/gallery">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="btn-primary inline-flex items-center gap-2 group"
                        >
                            View Full Gallery
                            <HiArrowRight className="group-hover:translate-x-1 transition-transform" />
                        </motion.button>
                    </Link>
                </FadeUp>
            </div>
        </section>
    );
}
