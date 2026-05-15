"use client";

import React from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { HiArrowRight, HiLightningBolt, HiPlay, HiSparkles } from "react-icons/hi";
import { useRef } from "react";
import { useDeviceType } from "@/hooks/useDeviceType";
import { blurRevealVariants, Magnetic, TiltCard } from "./PremiumMotion";

// ──────────────────────────────────────────────
// Desktop Hero Media — Static Image with srcSet
// ──────────────────────────────────────────────
function DesktopHeroMedia() {
    return (
        <picture>
            <source
                srcSet="
                    /assets/hero/hero-desktop-sm.webp 1024w,
                    /assets/hero/hero-desktop-md.webp 1440w,
                    /assets/hero/hero-desktop-lg.webp 1920w
                "
                sizes="100vw"
                type="image/webp"
            />
            <img
                src="/assets/hero/hero-desktop.jpg"
                srcSet="
                    /assets/hero/hero-desktop-sm.webp 1024w,
                    /assets/hero/hero-desktop-md.webp 1440w,
                    /assets/hero/hero-desktop-lg.webp 1920w
                "
                sizes="100vw"
                alt="Rafithub gym interior with premium equipment"
                fetchPriority="high"
                width={1920}
                height={1080}
                className="hero-desktop-image"
            />
        </picture>
    );
}

// ──────────────────────────────────────────────
// Mobile Hero Media — Static Image with WebP + JPG
// ──────────────────────────────────────────────
function MobileHeroMedia() {
    return (
        <picture>
            <source
                srcSet="/assets/hero/hero-mobile.webp"
                type="image/webp"
            />
            <img
                src="/assets/hero/hero-mobile.jpg"
                alt="Rafithub gym - intense training session"
                fetchPriority="high"
                width={768}
                height={1024}
                className="hero-mobile-image"
            />
        </picture>
    );
}

// ──────────────────────────────────────────────
// Hero Section
// ──────────────────────────────────────────────
function Hero() {
    const { isMobile } = useDeviceType();
    const heroRef = useRef<HTMLElement | null>(null);
    const shouldReduceMotion = useReducedMotion();
    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ["start start", "end start"],
    });
    const mediaY = useTransform(scrollYProgress, [0, 1], [0, shouldReduceMotion ? 0 : 160]);
    const contentY = useTransform(scrollYProgress, [0, 1], [0, shouldReduceMotion ? 0 : -60]);
    const panelY = useTransform(scrollYProgress, [0, 1], [0, shouldReduceMotion ? 0 : -110]);

    const trainingPulse = [
        { label: "Peak Strength", value: "92%", tone: "primary" },
        { label: "HIIT Burn", value: "48m", tone: "secondary" },
        { label: "Coach Sync", value: "Live", tone: "cyan" },
    ];

    return (
        <section ref={heroRef} className="relative isolate flex min-h-screen items-center overflow-hidden bg-gym-black">
            {/* Background Media with Overlay */}
            <motion.div className="absolute inset-0 z-0" style={{ y: mediaY }}>
                {/* Conditional Media: Desktop Image / Mobile Video */}
                {isMobile ? <MobileHeroMedia /> : <DesktopHeroMedia />}

                {/* Gradient Overlays — fixed for consistent dark look */}
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-black/10" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/50" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_32%,rgba(0,240,138,0.22),transparent_30rem)]" />

                {/* Animated Grid Pattern */}
                <motion.div
                    className="absolute inset-0 opacity-30"
                    animate={shouldReduceMotion ? undefined : { backgroundPosition: ["0px 0px", "50px 50px"] }}
                    transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
                >
                    <div
                        className="w-full h-full"
                        style={{
                            backgroundImage:
                                "linear-gradient(color-mix(in srgb, white 15%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in srgb, white 15%, transparent) 1px, transparent 1px)",
                            backgroundSize: "50px 50px",
                        }}
                    />
                </motion.div>
            </motion.div>

            {/* Content */}
            <div className="container-custom relative z-10 px-4 md:px-8">
                <div className="grid items-center gap-12 pt-24 lg:grid-cols-[minmax(0,1fr)_420px]">
                    <motion.div
                        className="mx-auto max-w-[19rem] sm:mx-0 sm:max-w-4xl"
                        style={{ y: contentY }}
                        variants={{
                            visible: {
                                transition: {
                                    staggerChildren: 0.1,
                                    delayChildren: 0.1,
                                },
                            },
                        }}
                        initial="hidden"
                        animate="visible"
                    >
                    {/* Pre-title */}
                    <motion.div
                        variants={blurRevealVariants}
                        className="flex items-center gap-3 mb-6"
                    >
                        <div className="w-12 h-0.5 bg-[var(--primary)]" />
                        <span className="text-[var(--primary)] font-medium tracking-wider uppercase text-sm">
                            Welcome to Rafithub
                        </span>
                    </motion.div>

                    {/* Main Heading */}
                    <motion.h1
                        variants={blurRevealVariants}
                        className="mb-4 max-w-full text-[2.85rem] font-bold uppercase leading-none tracking-normal text-white sm:text-6xl md:text-7xl lg:text-8xl"
                    >
                        Transform
                        <br className="sm:hidden" />
                        <span className="sm:inline"> Your</span>
                        <br />
                        <span className="text-gradient-green">
                            Body <span className="sm:hidden">&</span>
                            <br className="sm:hidden" />
                            <span className="hidden sm:inline">& </span>Mind
                        </span>
                    </motion.h1>

                    {/* Subheading */}
                    <motion.p
                        variants={blurRevealVariants}
                        className="mb-10 max-w-full text-lg font-medium leading-relaxed text-white/80 sm:max-w-2xl sm:text-xl md:text-2xl"
                    >
                        Experience world-class training, cutting-edge equipment, and
                        personalized programs designed to help you achieve your ultimate
                        fitness goals.
                    </motion.p>

                    {/* CTA Buttons */}
                    <motion.div
                        variants={blurRevealVariants}
                        className="flex flex-col gap-4 sm:flex-row sm:flex-wrap"
                    >
                        <Link href="/membership">
                            <Magnetic>
                                <motion.button
                                    whileTap={{ scale: 0.95 }}
                                    className="btn-primary flex w-full items-center justify-center gap-2 group sm:w-auto"
                                >
                                    Join Now
                                    <HiArrowRight className="group-hover:translate-x-1 transition-transform" />
                                </motion.button>
                            </Magnetic>
                        </Link>

                        <Link href="/classes">
                            <Magnetic>
                                <motion.button
                                    whileTap={{ scale: 0.95 }}
                                    className="btn-outline flex w-full items-center justify-center gap-2 border-white/35 bg-white/10 text-white hover:border-white hover:bg-white hover:text-black sm:w-auto"
                                >
                                    <HiPlay className="w-5 h-5" />
                                    Book a Trial
                                </motion.button>
                            </Magnetic>
                        </Link>
                    </motion.div>

                    {/* Stats */}
                    <motion.div
                        variants={blurRevealVariants}
                        className="mt-16 grid max-w-full grid-cols-2 gap-4 border-t border-white/15 pt-8 md:max-w-3xl md:grid-cols-4"
                    >
                        {[
                            { number: "15+", label: "Years Experience" },
                            { number: "6+", label: "Expert Trainers" },
                            { number: "10K+", label: "Happy Members" },
                            { number: "100+", label: "Weekly Classes" },
                        ].map((stat, index) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
                                className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-center backdrop-blur-md"
                            >
                                <div className="font-display text-4xl md:text-5xl text-[var(--primary)] mb-1">
                                    {stat.number}
                                </div>
                                <div className="text-sm text-white/60 uppercase tracking-wider">
                                    {stat.label}
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                    </motion.div>

                    <motion.div
                        className="hidden lg:block"
                        style={{ y: panelY }}
                        initial={{ opacity: 0, x: 44, rotateY: -12, filter: "blur(18px)" }}
                        animate={{ opacity: 1, x: 0, rotateY: 0, filter: "blur(0px)" }}
                        transition={{ delay: 0.55, type: "spring", stiffness: 120, damping: 22 }}
                    >
                        <TiltCard className="card-glass p-5" depth={8}>
                            <div className="flex items-center justify-between border-b border-white/10 pb-4">
                                <div>
                                    <p className="text-xs uppercase tracking-[0.24em] text-[var(--primary)]">Live Floor</p>
                                    <h2 className="mt-1 text-2xl font-bold text-[var(--card-foreground)]">Today&apos;s Training Flow</h2>
                                </div>
                                <motion.div
                                    className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--primary)]/15 text-[var(--primary)]"
                                    animate={shouldReduceMotion ? undefined : { rotate: [0, 8, -8, 0], scale: [1, 1.05, 1] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                >
                                    <HiSparkles className="h-6 w-6" />
                                </motion.div>
                            </div>

                            <div className="mt-5 space-y-3">
                                {trainingPulse.map((item, index) => (
                                    <motion.div
                                        key={item.label}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.85 + index * 0.12 }}
                                        className="rounded-2xl border border-white/10 bg-white/[0.06] p-4"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <span
                                                    className={`h-3 w-3 rounded-full ${item.tone === "secondary"
                                                        ? "bg-[var(--secondary)]"
                                                        : item.tone === "cyan"
                                                            ? "bg-[var(--cyan)]"
                                                            : "bg-[var(--primary)]"
                                                        } shadow-[0_0_18px_currentColor]`}
                                                />
                                                <span className="font-semibold text-[var(--muted-foreground)]">{item.label}</span>
                                            </div>
                                            <span className="font-display text-2xl text-[var(--card-foreground)]">{item.value}</span>
                                        </div>
                                        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[var(--muted)]">
                                            <motion.div
                                                className={`h-full rounded-full ${item.tone === "secondary"
                                                    ? "bg-[var(--secondary)]"
                                                    : item.tone === "cyan"
                                                        ? "bg-[var(--cyan)]"
                                                        : "bg-[var(--primary)]"
                                                    }`}
                                                initial={{ width: "18%" }}
                                                animate={{ width: index === 0 ? "92%" : index === 1 ? "68%" : "76%" }}
                                                transition={{ delay: 1 + index * 0.1, duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
                                            />
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            <div className="mt-5 rounded-2xl bg-gradient-to-br from-[var(--primary)]/15 via-[var(--muted)]/60 to-[var(--secondary)]/12 p-4">
                                <div className="flex items-center gap-3 text-[var(--card-foreground)]">
                                    <HiLightningBolt className="h-5 w-5 text-[var(--secondary)]" />
                                    <span className="text-sm font-semibold">Coach-led strength block starts every 45 minutes.</span>
                                </div>
                            </div>
                        </TiltCard>
                    </motion.div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="absolute bottom-8 right-10 hidden xl:block"
            >
                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="flex flex-col items-center gap-2"
                >
                    <span className="text-xs text-white/50 uppercase tracking-wider">
                        Scroll
                    </span>
                    <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
                        <motion.div
                            animate={{ y: [0, 12, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className="w-1.5 h-3 bg-[var(--primary)] rounded-full mt-2"
                        />
                    </div>
                </motion.div>
            </motion.div>

            {/* Decorative Elements */}
            <div className="absolute top-1/4 right-10 w-32 h-32 bg-[var(--primary)]/20 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-[var(--secondary)]/10 rounded-full blur-3xl" />
        </section>
    );
}

export default React.memo(Hero);
