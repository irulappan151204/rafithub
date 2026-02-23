"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { HiArrowRight, HiPlay } from "react-icons/hi";
import { useDeviceType } from "@/hooks/useDeviceType";

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

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gym-black">
            {/* Background Media with Overlay */}
            <div className="absolute inset-0 z-0">
                {/* Conditional Media: Desktop Image / Mobile Video */}
                {isMobile ? <MobileHeroMedia /> : <DesktopHeroMedia />}

                {/* Gradient Overlays — fixed for consistent dark look */}
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40" />

                {/* Animated Grid Pattern */}
                <div className="absolute inset-0 opacity-30">
                    <div
                        className="w-full h-full"
                        style={{
                            backgroundImage:
                                "linear-gradient(color-mix(in srgb, white 15%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in srgb, white 15%, transparent) 1px, transparent 1px)",
                            backgroundSize: "50px 50px",
                        }}
                    />
                </div>
            </div>

            {/* Content */}
            <div className="container-custom px-4 md:px-8 relative z-10">
                <div className="max-w-4xl">
                    {/* Pre-title */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="flex items-center gap-3 mb-6"
                    >
                        <div className="w-12 h-0.5 bg-[var(--primary)]" />
                        <span className="text-[var(--primary)] font-medium tracking-wider uppercase text-sm">
                            Welcome to Rafithub
                        </span>
                    </motion.div>

                    {/* Main Heading */}
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="heading-xl text-white mb-4"
                    >
                        Transform Your
                        <br />
                        <span className="text-gradient-green">Body & Mind</span>
                    </motion.h1>

                    {/* Subheading */}
                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="text-xl md:text-2xl text-white/80 max-w-2xl mb-10 leading-relaxed font-medium"
                    >
                        Experience world-class training, cutting-edge equipment, and
                        personalized programs designed to help you achieve your ultimate
                        fitness goals.
                    </motion.p>

                    {/* CTA Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                        className="flex flex-wrap gap-4"
                    >
                        <Link href="/membership">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="btn-primary flex items-center gap-2 group"
                            >
                                Join Now
                                <HiArrowRight className="group-hover:translate-x-1 transition-transform" />
                            </motion.button>
                        </Link>

                        <Link href="/classes">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-8 py-4 border-2 border-white text-white font-bold rounded-lg transition-all duration-300 ease-out hover:bg-white hover:text-black active:scale-95 flex items-center gap-2"
                            >
                                <HiPlay className="w-5 h-5" />
                                Book a Trial
                            </motion.button>
                        </Link>
                    </motion.div>

                    {/* Stats */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.8 }}
                        className="flex flex-wrap gap-8 md:gap-16 mt-16 pt-8 border-t border-[var(--border)]"
                    >
                        {[
                            { number: "15+", label: "Years Experience" },
                            { number: "50+", label: "Expert Trainers" },
                            { number: "10K+", label: "Happy Members" },
                            { number: "100+", label: "Weekly Classes" },
                        ].map((stat, index) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
                                className="text-center"
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
                </div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
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
