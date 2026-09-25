"use client";

import React from "react";
import dynamic from "next/dynamic";
import { motion, useReducedMotion, useScroll, useTransform, useSpring } from "framer-motion";
import Link from "next/link";
import { HiArrowRight, HiPlay } from "react-icons/hi";
import { useRef } from "react";
import { useDeviceType } from "@/hooks/useDeviceType";
import { blurRevealVariants, Magnetic, TiltCard } from "./PremiumMotion";
import FitnessCalculator from "./FitnessCalculator";

// Three.js particles — dynamically loaded, no SSR
const HeroParticles = dynamic(() => import("./HeroParticles"), { ssr: false });

// ──────────────────────────────────────────────
// Desktop Hero Media
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
// Mobile Hero Media
// ──────────────────────────────────────────────
function MobileHeroMedia() {
    return (
        <picture>
            <source srcSet="/assets/hero/hero-mobile.webp" type="image/webp" />
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

    // Scroll-driven values for multi-layer parallax
    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ["start start", "end start"],
    });

    // Layer 1 — background image (slowest, deepest)
    const mediaY = useTransform(scrollYProgress, [0, 1], [0, shouldReduceMotion ? 0 : 180]);
    // Layer 2 — mid-depth decorative blobs
    const blobY = useTransform(scrollYProgress, [0, 1], [0, shouldReduceMotion ? 0 : 100]);
    // Layer 3 — hero text content
    const contentY = useTransform(scrollYProgress, [0, 1], [0, shouldReduceMotion ? 0 : -70]);
    // Layer 4 — calculator panel (fastest, closest)
    const panelY = useTransform(scrollYProgress, [0, 1], [0, shouldReduceMotion ? 0 : -130]);
    // Opacity fade — content fades as you scroll down
    const contentOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);

    // Spring-smooth the parallax for extra organic feel
    const mediaYSpring = useSpring(mediaY, { stiffness: 60, damping: 20 });
    const panelYSpring = useSpring(panelY, { stiffness: 80, damping: 22 });
    const contentYSpring = useSpring(contentY, { stiffness: 80, damping: 22 });
    const blobYSpring = useSpring(blobY, { stiffness: 50, damping: 18 });

    return (
        <section
            ref={heroRef}
            className="relative isolate flex min-h-screen items-center overflow-hidden bg-gym-black"
        >
            {/* ── Layer 0: Background image (deepest parallax) ── */}
            <motion.div
                className="absolute inset-0 z-0"
                style={{ y: shouldReduceMotion ? 0 : mediaYSpring }}
            >
                {isMobile ? <MobileHeroMedia /> : <DesktopHeroMedia />}

                {/* Colour gradient overlays */}
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/55 to-black/15" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-black/50" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_32%,rgba(0,240,138,0.22),transparent_30rem)]" />

                {/* Static grid overlay */}
                <div
                    className="absolute inset-0 opacity-25"
                    style={{
                        backgroundImage:
                            "linear-gradient(rgba(255,255,255,0.12) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.12) 1px,transparent 1px)",
                        backgroundSize: "50px 50px",
                    }}
                />
            </motion.div>

            {/* ── Layer 1: Three.js particle canvas ── */}
            <HeroParticles />

            {/* ── Layer 2: Mid-depth floating blobs (parallax) ── */}
            <motion.div
                className="pointer-events-none absolute inset-0 z-[2]"
                style={{ y: shouldReduceMotion ? 0 : blobYSpring }}
                aria-hidden="true"
            >
                <div className="absolute top-1/4 right-12 w-40 h-40 rounded-full bg-[var(--primary)]/18 blur-3xl" />
                <div className="absolute top-1/3 right-1/3 w-24 h-24 rounded-full bg-[var(--cyan)]/12 blur-2xl" />
                <div className="absolute bottom-1/3 right-1/4 w-56 h-56 rounded-full bg-[var(--secondary)]/10 blur-3xl" />
            </motion.div>

            {/* ── Layer 3: Content ── */}
            <motion.div
                className="container-custom relative z-10 px-4 md:px-8"
                style={{
                    y: shouldReduceMotion ? 0 : contentYSpring,
                    opacity: shouldReduceMotion ? 1 : contentOpacity,
                }}
            >
                <div className="grid items-center gap-12 pt-24 lg:grid-cols-[minmax(0,1fr)_440px]">

                    {/* Left — text + stats */}
                    <motion.div
                        className="mx-auto max-w-[19rem] sm:mx-0 sm:max-w-4xl"
                        variants={{
                            visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
                        }}
                        initial="hidden"
                        animate="visible"
                    >
                        {/* Pre-title */}
                        <motion.div variants={blurRevealVariants} className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-0.5 bg-[var(--primary)]" />
                            <span className="text-[var(--primary)] font-medium tracking-wider uppercase text-sm float-badge">
                                Welcome to Rafithub
                            </span>
                        </motion.div>

                        {/* Heading */}
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

                        {/* Sub-heading */}
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

                    {/* ── Layer 4: Calculator panel (closest parallax layer) ── */}
                    <motion.div
                        className="hidden lg:flex flex-col"
                        style={{ y: shouldReduceMotion ? 0 : panelYSpring }}
                        initial={{ opacity: 0, x: 50, rotateY: -10 }}
                        animate={{ opacity: 1, x: 0, rotateY: 0 }}
                        transition={{ delay: 0.5, type: "spring", stiffness: 110, damping: 22 }}
                    >
                        <TiltCard className="card-glass p-5 max-h-[82vh] overflow-y-auto scrollbar-hide" depth={6}>
                            <FitnessCalculator />
                        </TiltCard>
                    </motion.div>
                </div>
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.8 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
            >
                <motion.div
                    animate={shouldReduceMotion ? undefined : { y: [0, 10, 0] }}
                    transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                    className="flex flex-col items-center gap-2"
                >
                    <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
                        <motion.div
                            animate={shouldReduceMotion ? undefined : { y: [0, 10, 0], opacity: [1, 0.3, 1] }}
                            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                            className="w-1.5 h-2.5 bg-[var(--primary)] rounded-full"
                        />
                    </div>
                    <span className="text-[10px] text-white/40 uppercase tracking-widest">Scroll</span>
                </motion.div>
            </motion.div>
        </section>
    );
}

export default React.memo(Hero);
