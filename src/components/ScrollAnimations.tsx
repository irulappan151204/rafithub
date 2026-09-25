"use client";

import { motion, useInView, useReducedMotion, Variants } from "framer-motion";
import { useRef, ReactNode } from "react";
import { cardRevealVariants, premiumSpring } from "./PremiumMotion";

interface ScrollAnimationProps {
    children: ReactNode;
    className?: string;
    delay?: number;
    duration?: number;
    once?: boolean;
}

// All variants use only opacity + transform (y / x / scale).
// filter:blur() is intentionally removed — animating it forces browser
// repaint on every frame (not compositor-only), which is a primary cause
// of scroll jank on mid-range devices. GPU-composited opacity+transform
// is the correct approach for smooth 60fps scroll reveals.
const fadeUpVariants: Variants = {
    hidden: { opacity: 0, y: 32 },
    visible: { opacity: 1, y: 0 },
};

const fadeInVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
};

const scaleInVariants: Variants = {
    hidden: { opacity: 0, scale: 0.93 },
    visible: { opacity: 1, scale: 1 },
};

const slideLeftVariants: Variants = {
    hidden: { opacity: 0, x: 48 },
    visible: { opacity: 1, x: 0 },
};

const slideRightVariants: Variants = {
    hidden: { opacity: 0, x: -48 },
    visible: { opacity: 1, x: 0 },
};

function ScrollReveal({
    children,
    className = "",
    delay = 0,
    duration = 0.6,
    once = true,
    variants,
}: ScrollAnimationProps & { variants: Variants }) {
    const ref = useRef(null);
    const shouldReduceMotion = useReducedMotion();
    const isInView = useInView(ref, { once, margin: "-80px" });

    return (
        <motion.div
            ref={ref}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={variants}
            transition={shouldReduceMotion ? { duration: 0 } : { ...premiumSpring, delay, duration }}
            className={className}
            // will-change ensures the element is promoted to its own GPU layer
            // so transform + opacity animations never trigger a repaint.
            style={{ willChange: "transform, opacity" }}
        >
            {children}
        </motion.div>
    );
}

export function FadeUp({
    children,
    className = "",
    delay = 0,
    duration = 0.6,
    once = true,
}: ScrollAnimationProps) {
    return (
        <ScrollReveal
            className={className}
            delay={delay}
            duration={duration}
            once={once}
            variants={fadeUpVariants}
        >
            {children}
        </ScrollReveal>
    );
}

export function FadeIn({
    children,
    className = "",
    delay = 0,
    duration = 0.6,
    once = true,
}: ScrollAnimationProps) {
    return (
        <ScrollReveal
            className={className}
            delay={delay}
            duration={duration}
            once={once}
            variants={fadeInVariants}
        >
            {children}
        </ScrollReveal>
    );
}

export function ScaleIn({
    children,
    className = "",
    delay = 0,
    duration = 0.5,
    once = true,
}: ScrollAnimationProps) {
    return (
        <ScrollReveal
            className={className}
            delay={delay}
            duration={duration}
            once={once}
            variants={scaleInVariants}
        >
            {children}
        </ScrollReveal>
    );
}

export function SlideLeft({
    children,
    className = "",
    delay = 0,
    duration = 0.6,
    once = true,
}: ScrollAnimationProps) {
    return (
        <ScrollReveal
            className={className}
            delay={delay}
            duration={duration}
            once={once}
            variants={slideLeftVariants}
        >
            {children}
        </ScrollReveal>
    );
}

export function SlideRight({
    children,
    className = "",
    delay = 0,
    duration = 0.6,
    once = true,
}: ScrollAnimationProps) {
    return (
        <ScrollReveal
            className={className}
            delay={delay}
            duration={duration}
            once={once}
            variants={slideRightVariants}
        >
            {children}
        </ScrollReveal>
    );
}

// ─── Stagger Container ────────────────────────────────────────────────────────

interface StaggerContainerProps {
    children: ReactNode;
    className?: string;
    stagger?: number;
}

export function StaggerContainer({
    children,
    className = "",
    stagger = 0.08,
}: StaggerContainerProps) {
    const ref = useRef(null);
    const shouldReduceMotion = useReducedMotion();
    const isInView = useInView(ref, { once: true, margin: "-80px" });

    return (
        <motion.div
            ref={ref}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={{
                visible: {
                    transition: {
                        staggerChildren: shouldReduceMotion ? 0 : stagger,
                        delayChildren: shouldReduceMotion ? 0 : 0.04,
                    },
                },
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

export function StaggerItem({
    children,
    className = "",
}: {
    children: ReactNode;
    className?: string;
}) {
    return (
        <motion.div
            variants={cardRevealVariants}
            className={className}
            style={{ willChange: "transform, opacity" }}
        >
            {children}
        </motion.div>
    );
}

// ─── Counter (re-export for external use if needed) ───────────────────────────

interface CounterProps {
    target: number;
    suffix?: string;
    prefix?: string;
    className?: string;
}

export function Counter({
    target,
    suffix = "",
    prefix = "",
    className = "",
}: CounterProps) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    return (
        <span ref={ref} className={className}>
            {prefix}
            {isInView ? target.toLocaleString() : "0"}
            {suffix}
        </span>
    );
}
