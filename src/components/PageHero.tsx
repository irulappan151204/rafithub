"use client";

import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import Image from "next/image";
import { ReactNode, useRef } from "react";
import { blurRevealVariants } from "./PremiumMotion";

interface PageHeroProps {
    eyebrow: string;
    title: ReactNode;
    description: string;
    imageSrc?: string;
    align?: "center" | "left";
    stats?: Array<{ value: string; label: string }>;
    actions?: ReactNode;
}

export default function PageHero({
    eyebrow,
    title,
    description,
    imageSrc,
    align = "center",
    stats = [],
    actions,
}: PageHeroProps) {
    const ref = useRef<HTMLElement | null>(null);
    const shouldReduceMotion = useReducedMotion();

    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"],
    });

    // Multi-layer parallax depths
    const mediaY = useTransform(scrollYProgress, [0, 1], [0, shouldReduceMotion ? 0 : 130]);
    const blobY = useTransform(scrollYProgress, [0, 1], [0, shouldReduceMotion ? 0 : 70]);
    const contentY = useTransform(scrollYProgress, [0, 1], [0, shouldReduceMotion ? 0 : -50]);
    const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

    // Spring smooth for organic feel
    const mediaYS = useSpring(mediaY, { stiffness: 55, damping: 20 });
    const blobYS = useSpring(blobY, { stiffness: 48, damping: 18 });
    const contentYS = useSpring(contentY, { stiffness: 75, damping: 22 });

    return (
        <section
            ref={ref}
            className={`premium-page-hero ${align === "left" ? "text-left" : "text-center"}`}
        >
            {/* ── Layer 0: Background image ── */}
            <motion.div
                className="premium-page-hero-media"
                style={{ y: shouldReduceMotion ? 0 : mediaYS }}
            >
                {imageSrc ? (
                    <Image
                        src={imageSrc}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="100vw"
                        priority
                        aria-hidden="true"
                        role="presentation"
                    />
                ) : null}
            </motion.div>

            {/* Overlays */}
            <div className="premium-page-hero-overlay" />
            <div className="kinetic-grid absolute inset-0 opacity-40" />

            {/* ── Layer 1: Floating blobs (mid parallax) ── */}
            <motion.div
                className="pointer-events-none absolute inset-0 z-[1]"
                style={{ y: shouldReduceMotion ? 0 : blobYS }}
                aria-hidden="true"
            >
                <div className="absolute top-1/3 left-1/4 w-48 h-48 rounded-full bg-[var(--primary)]/8 blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-32 h-32 rounded-full bg-[var(--secondary)]/8 blur-2xl" />
                <div className="absolute top-1/2 right-1/3 w-24 h-24 rounded-full bg-[var(--cyan)]/6 blur-2xl" />
            </motion.div>

            {/* ── Layer 2: Content (front parallax + fade) ── */}
            <motion.div
                className={`container-custom relative z-10 ${align === "left" ? "" : "mx-auto"}`}
                style={{
                    y: shouldReduceMotion ? 0 : contentYS,
                    opacity: shouldReduceMotion ? 1 : contentOpacity,
                }}
                variants={{
                    visible: {
                        transition: { staggerChildren: 0.09, delayChildren: 0.06 },
                    },
                }}
                initial="hidden"
                animate="visible"
            >
                <motion.span variants={blurRevealVariants} className="section-kicker">
                    {eyebrow}
                </motion.span>
                <motion.h1
                    variants={blurRevealVariants}
                    className={`heading-lg text-[var(--foreground)] mt-5 ${align === "left" ? "max-w-4xl" : "mx-auto max-w-4xl"}`}
                >
                    {title}
                </motion.h1>
                <motion.p
                    variants={blurRevealVariants}
                    className={`mt-5 text-lg md:text-xl leading-relaxed text-[var(--muted-foreground)] ${align === "left" ? "max-w-2xl" : "mx-auto max-w-3xl"}`}
                >
                    {description}
                </motion.p>

                {actions ? (
                    <motion.div
                        variants={blurRevealVariants}
                        className={`mt-9 flex flex-wrap gap-4 ${align === "left" ? "" : "justify-center"}`}
                    >
                        {actions}
                    </motion.div>
                ) : null}

                {stats.length > 0 ? (
                    <motion.div
                        variants={blurRevealVariants}
                        className={`mt-12 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4 ${align === "left" ? "" : "mx-auto"}`}
                    >
                        {stats.map((stat) => (
                            <motion.div
                                key={stat.label}
                                className="metric-tile"
                                whileHover={shouldReduceMotion ? undefined : { y: -4, scale: 1.03 }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            >
                                <div className="font-display text-3xl text-[var(--primary)]">{stat.value}</div>
                                <div className="text-xs uppercase tracking-[0.24em] text-[var(--muted-foreground)]">
                                    {stat.label}
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                ) : null}
            </motion.div>
        </section>
    );
}
