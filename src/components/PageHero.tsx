"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
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
    const mediaY = useTransform(scrollYProgress, [0, 1], [0, shouldReduceMotion ? 0 : 120]);
    const contentY = useTransform(scrollYProgress, [0, 1], [0, shouldReduceMotion ? 0 : -44]);

    return (
        <section
            ref={ref}
            className={`premium-page-hero ${align === "left" ? "text-left" : "text-center"}`}
        >
            <motion.div className="premium-page-hero-media" style={{ y: mediaY }}>
                {imageSrc ? (
                    <Image
                        src={imageSrc}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="100vw"
                        priority
                    />
                ) : null}
            </motion.div>
            <div className="premium-page-hero-overlay" />
            <div className="kinetic-grid absolute inset-0 opacity-40" />

            <motion.div
                className={`container-custom relative z-10 ${align === "left" ? "" : "mx-auto"}`}
                style={{ y: contentY }}
                variants={{
                    visible: {
                        transition: {
                            staggerChildren: 0.09,
                            delayChildren: 0.06,
                        },
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
                            <div key={stat.label} className="metric-tile">
                                <div className="font-display text-3xl text-[var(--primary)]">{stat.value}</div>
                                <div className="text-xs uppercase tracking-[0.24em] text-[var(--muted-foreground)]">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </motion.div>
                ) : null}
            </motion.div>
        </section>
    );
}
