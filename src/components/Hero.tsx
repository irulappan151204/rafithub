"use client";

import React, { useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { HiArrowRight, HiLocationMarker, HiPlay, HiShieldCheck } from "react-icons/hi";
import { useDeviceType } from "@/hooks/useDeviceType";
import { splitHeroHeadline } from "@/lib/hero-text";
import { blurRevealVariants, Magnetic, TiltCard } from "./PremiumMotion";
import { HeroDeck, type HeroDeckTab } from "./HeroDeck";

// Three.js particles — dynamically loaded on desktop only
const HeroParticles = dynamic(() => import("./HeroParticles"), { ssr: false });

const DEFAULT_HERO_URLS = new Set([
  "",
  "/assets/hero/hero-desktop-lg.webp",
  "/assets/hero/hero-desktop.jpg",
]);

function HeroMedia({ heroImageUrl }: { heroImageUrl?: string }) {
  const customUrl = heroImageUrl?.trim() ?? "";
  if (customUrl && !DEFAULT_HERO_URLS.has(customUrl)) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={customUrl}
        alt="Rafithub gym floor and athletic training equipment"
        fetchPriority="high"
        className="absolute inset-0 h-full w-full object-cover object-center"
      />
    );
  }

  return (
    <picture>
      <source media="(max-width: 768px)" srcSet="/assets/hero/hero-mobile.webp" type="image/webp" />
      <source
        media="(min-width: 769px)"
        srcSet="
          /assets/hero/hero-desktop-sm.webp 1024w,
          /assets/hero/hero-desktop-md.webp 1440w,
          /assets/hero/hero-desktop-lg.webp 1920w
        "
        sizes="100vw"
        type="image/webp"
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/assets/hero/hero-desktop.jpg"
        alt="Rafithub gym interior with premium strength and conditioning equipment"
        fetchPriority="high"
        width={1920}
        height={1080}
        className="absolute inset-0 h-full w-full object-cover object-center"
      />
    </picture>
  );
}

interface HeroProps {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  stats?: Array<{ number: string; label: string }>;
  heroImageUrl?: string;
  trialDays?: number;
}

function Hero({
  eyebrow = "Welcome to Rafithub",
  title = "Transform Your Body & Mind",
  subtitle = "Experience world-class coaching, competition-grade equipment, and personalized transformation programs in Madurai.",
  stats,
  heroImageUrl,
  trialDays = 7,
}: HeroProps) {
  const { isMobile } = useDeviceType();
  const heroRef = useRef<HTMLElement | null>(null);
  const shouldReduceMotion = useReducedMotion();
  const [deckTab, setDeckTab] = useState<HeroDeckTab>("calculator");

  const headline = splitHeroHeadline(title);
  const displayStats =
    stats && stats.length > 0
      ? stats
      : [
          { number: "15+", label: "Years Experience" },
          { number: "6+", label: "Expert Trainers" },
          { number: "10K+", label: "Happy Members" },
          { number: "100+", label: "Weekly Classes" },
        ];

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const mediaY = useTransform(scrollYProgress, [0, 1], [0, shouldReduceMotion ? 0 : 140]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, shouldReduceMotion ? 0 : -55]);
  const panelY = useTransform(scrollYProgress, [0, 1], [0, shouldReduceMotion ? 0 : -85]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.72], [1, 0]);

  const mediaYSpring = useSpring(mediaY, { stiffness: 60, damping: 20 });
  const contentYSpring = useSpring(contentY, { stiffness: 80, damping: 22 });
  const panelYSpring = useSpring(panelY, { stiffness: 80, damping: 22 });

  function handleQuickTrialClick() {
    setDeckTab("trial");
    const el = document.getElementById("hero-deck");
    if (el) {
      el.scrollIntoView({ behavior: shouldReduceMotion ? "auto" : "smooth", block: "nearest" });
    }
  }

  return (
    <section
      ref={heroRef}
      className="relative isolate flex min-h-screen items-center overflow-x-clip bg-[#050706] pb-14 pt-24 md:pt-28 lg:pb-16"
    >
      {/* Layer 0: Parallax Gym Photography + Obsidian Scrims */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{ y: shouldReduceMotion ? 0 : mediaYSpring }}
      >
        <HeroMedia heroImageUrl={heroImageUrl} />

        {/* High-contrast cinematic gradients */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#050706] via-[#050706]/75 to-[#050706]/35" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050706] via-[#050706]/35 to-[#050706]/65" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_24%_32%,rgba(0,240,138,0.16),transparent_36rem)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_28%,rgba(248,214,93,0.10),transparent_32rem)]" />

        {/* Subtle precision grid texture */}
        <div
          className="absolute inset-0 opacity-[0.16]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.1) 1px,transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />
      </motion.div>

      {/* Layer 1: Desktop Three.js particle atmosphere */}
      {!isMobile && <HeroParticles />}

      {/* Layer 2: Foreground Kinetic Split Layout */}
      <motion.div
        className="container-custom relative z-10 px-4 md:px-8"
        style={{
          y: shouldReduceMotion ? 0 : contentYSpring,
          opacity: shouldReduceMotion ? 1 : contentOpacity,
        }}
      >
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.12fr)_430px] xl:grid-cols-[minmax(0,1.15fr)_450px]">
          {/* Left Editorial Spotlight Column */}
          <motion.div
            className="space-y-6"
            variants={{
              visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
            }}
            initial="hidden"
            animate="visible"
          >
            {/* Telemetry & Authority Pills */}
            <motion.div variants={blurRevealVariants} className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-2 rounded-full border border-[var(--primary)]/35 bg-[var(--primary)]/12 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--primary)] backdrop-blur-md">
                <span className="h-2 w-2 rounded-full bg-[var(--primary)] animate-pulse" />
                {eyebrow}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.06] px-3 py-1.5 text-xs font-medium text-white/85 backdrop-blur-md">
                <HiLocationMarker className="h-3.5 w-3.5 text-[var(--primary)]" aria-hidden="true" />
                Kochadai, Madurai
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--secondary)]/30 bg-[var(--secondary)]/10 px-3 py-1.5 text-xs font-semibold text-[var(--secondary)] backdrop-blur-md">
                <HiShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                Dr. Ranjith · Mr. India
              </span>
            </motion.div>

            {/* Sculpted Editorial Heading */}
            <motion.h1
              variants={blurRevealVariants}
              className="font-display text-[3.1rem] uppercase leading-[0.94] tracking-tight text-white sm:text-6xl md:text-7xl xl:text-[5.5rem]"
            >
              {headline.lead && <span className="block">{headline.lead}</span>}
              <span className="block text-gradient-green">{headline.accent}</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={blurRevealVariants}
              className="max-w-xl text-base font-medium leading-relaxed text-white/80 sm:text-lg md:text-xl"
            >
              {subtitle}
            </motion.p>

            {/* Primary & Interactive Trial CTAs */}
            <motion.div
              variants={blurRevealVariants}
              className="flex flex-col gap-3 pt-1 sm:flex-row sm:flex-wrap sm:items-center"
            >
              <Link href="/membership" className="w-full sm:w-auto">
                <Magnetic>
                  <motion.button
                    whileTap={{ scale: 0.96 }}
                    className="btn-primary flex w-full items-center justify-center gap-2 group sm:w-auto"
                  >
                    <span>Join Now</span>
                    <HiArrowRight className="transition-transform group-hover:translate-x-1" />
                  </motion.button>
                </Magnetic>
              </Link>

              <Magnetic>
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.96 }}
                  onClick={handleQuickTrialClick}
                  className="btn-outline flex w-full items-center justify-center gap-2 border-white/30 bg-white/10 text-white hover:border-[var(--primary)] hover:bg-[var(--primary)] hover:text-black sm:w-auto"
                >
                  <HiPlay className="h-5 w-5" aria-hidden="true" />
                  <span>Book {trialDays}-Day Trial</span>
                </motion.button>
              </Magnetic>

              <Link
                href="/classes"
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-semibold text-white/80 transition-colors hover:text-[var(--primary)] sm:justify-start"
              >
                <span>Explore Classes</span>
                <HiArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </motion.div>

            {/* Bento Metric Strip */}
            <motion.div
              variants={blurRevealVariants}
              className="grid grid-cols-2 gap-3 border-t border-white/15 pt-6 sm:grid-cols-4"
            >
              {displayStats.slice(0, 4).map((stat) => (
                <div
                  key={stat.label}
                  className="group rounded-2xl border border-white/12 bg-white/[0.04] px-3.5 py-3.5 backdrop-blur-md transition-colors hover:border-[var(--primary)]/45 hover:bg-white/[0.07]"
                >
                  <div className="font-display text-3xl md:text-4xl text-[var(--primary)] tabular-nums">
                    {stat.number}
                  </div>
                  <div className="mt-0.5 text-[11px] font-medium uppercase tracking-wider text-white/65">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Spotlight Deck (Visible on Desktop AND Accessible Below Fold on Mobile/Tablet) */}
          <motion.div
            className="w-full"
            style={{ y: !isMobile && !shouldReduceMotion ? panelYSpring : 0 }}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, type: "spring", stiffness: 120, damping: 22 }}
          >
            {isMobile ? (
              <div className="card-glass p-4">
                <HeroDeck activeTab={deckTab} onTabChange={setDeckTab} trialDays={trialDays} />
              </div>
            ) : (
              <TiltCard className="card-glass p-5" depth={5}>
                <HeroDeck activeTab={deckTab} onTabChange={setDeckTab} trialDays={trialDays} />
              </TiltCard>
            )}
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

export default React.memo(Hero);
