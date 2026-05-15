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

const fadeUpVariants: Variants = {
    hidden: { opacity: 0, y: 34, filter: "blur(12px)" },
    visible: { opacity: 1, y: 0, filter: "blur(0px)" },
};

const fadeInVariants: Variants = {
    hidden: { opacity: 0, filter: "blur(10px)" },
    visible: { opacity: 1, filter: "blur(0px)" },
};

const scaleInVariants: Variants = {
    hidden: { opacity: 0, scale: 0.94, filter: "blur(10px)" },
    visible: { opacity: 1, scale: 1, filter: "blur(0px)" },
};

const slideLeftVariants: Variants = {
    hidden: { opacity: 0, x: 56, filter: "blur(10px)" },
    visible: { opacity: 1, x: 0, filter: "blur(0px)" },
};

const slideRightVariants: Variants = {
    hidden: { opacity: 0, x: -56, filter: "blur(10px)" },
    visible: { opacity: 1, x: 0, filter: "blur(0px)" },
};

function ScrollReveal({
    children,
    className,
    delay,
    duration,
    once,
    variants,
}: ScrollAnimationProps & { variants: Variants }) {
    const ref = useRef(null);
    const shouldReduceMotion = useReducedMotion();
    const isInView = useInView(ref, { once, margin: "-100px" });

    return (
        <motion.div
            ref={ref}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={variants}
            transition={shouldReduceMotion ? { duration: 0 } : { ...premiumSpring, delay, duration }}
            className={className}
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

// Stagger Container
interface StaggerContainerProps {
    children: ReactNode;
    className?: string;
    stagger?: number;
}

export function StaggerContainer({
    children,
    className = "",
    stagger = 0.1,
}: StaggerContainerProps) {
    const ref = useRef(null);
    const shouldReduceMotion = useReducedMotion();
    const isInView = useInView(ref, { once: true, margin: "-100px" });

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
        <motion.div variants={cardRevealVariants} className={className}>
            {children}
        </motion.div>
    );
}

// Counter Animation
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
        <motion.span
            ref={ref}
            className={className}
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        >
            {prefix}
            <motion.span
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            >
                {isInView && (
                    <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <CounterNumber target={target} />
                    </motion.span>
                )}
            </motion.span>
            {suffix}
        </motion.span>
    );
}

function CounterNumber({
    target,
}: {
    target: number;
}) {
    return (
        <span>{target.toLocaleString()}</span>
    );
}

