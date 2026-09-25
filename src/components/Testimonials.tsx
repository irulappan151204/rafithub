"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { FadeUp } from "./ScrollAnimations";
import { HiChevronLeft, HiChevronRight, HiStar } from "react-icons/hi";

const testimonials = [
    {
        name: "Jessica Martinez",
        role: "Lost 45 lbs in 6 months",
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
        content:
            "Rafithub completely transformed my life. The trainers are incredibly supportive, and the community keeps me motivated every single day. I've never felt stronger or more confident!",
        rating: 5,
    },
    {
        name: "Michael Thompson",
        role: "Gained 20 lbs of muscle",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
        content:
            "The personal training program here is world-class. My coach understood my goals and created a plan that delivered results beyond my expectations. Best investment I've ever made!",
        rating: 5,
    },
    {
        name: "Amanda Foster",
        role: "Marathon runner",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
        content:
            "From couch potato to marathon runner in just one year. The cardio programs and nutrition guidance at Rafithub made this incredible journey possible. Forever grateful!",
        rating: 5,
    },
    {
        name: "David Park",
        role: "Business Executive",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        content:
            "As a busy professional, the 24/7 access and efficient training programs fit perfectly into my hectic schedule. I've improved my health without sacrificing my career.",
        rating: 5,
    },
    {
        name: "Sarah Johnson",
        role: "Fitness Enthusiast",
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
        content:
            "The variety of classes and equipment available is amazing. Whether I want to lift heavy or do yoga, Rafithub has it all. The atmosphere is electric and addictive!",
        rating: 5,
    },
];

export default function Testimonials() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const shouldReduceMotion = useReducedMotion();

    const goToNext = useCallback(() => {
        if (isAnimating) return;
        setDirection(1);
        setCurrentIndex((prev) =>
            prev === testimonials.length - 1 ? 0 : prev + 1
        );
    }, [isAnimating]);

    const goToPrevious = useCallback(() => {
        if (isAnimating) return;
        setDirection(-1);
        setCurrentIndex((prev) =>
            prev === 0 ? testimonials.length - 1 : prev - 1
        );
    }, [isAnimating]);

    const goToSlide = useCallback(
        (index: number) => {
            if (isAnimating || index === currentIndex) return;
            setDirection(index > currentIndex ? 1 : -1);
            setCurrentIndex(index);
        },
        [isAnimating, currentIndex]
    );

    // Auto-advance — intentionally no currentIndex in deps so the timer is
    // NOT restarted on every manual navigation (WCAG 2.1 SC 2.2.2 compliance).
    // Also disabled for prefers-reduced-motion users.
    useEffect(() => {
        if (shouldReduceMotion) return;

        const timer = setInterval(() => {
            setDirection(1);
            setCurrentIndex((prev) =>
                prev === testimonials.length - 1 ? 0 : prev + 1
            );
        }, 6000);

        return () => clearInterval(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [shouldReduceMotion]);

    const current = testimonials[currentIndex];

    // For reduced-motion: crossfade only (no x slide)
    const slideVariants = shouldReduceMotion
        ? {
              enter: { opacity: 0 },
              center: { opacity: 1 },
              exit: { opacity: 0 },
          }
        : {
              enter: (dir: number) => ({
                  x: dir > 0 ? "40%" : "-40%",
                  opacity: 0,
              }),
              center: { x: "0%", opacity: 1 },
              exit: (dir: number) => ({
                  x: dir > 0 ? "-40%" : "40%",
                  opacity: 0,
              }),
          };

    return (
        <section className="section-padding bg-[var(--background)] relative overflow-hidden transition-colors duration-300">
            {/* Background glow */}
            <div className="absolute inset-0">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--secondary)]/5 rounded-full blur-3xl" />
            </div>

            <div className="container-custom relative z-10">
                {/* Section Header */}
                <FadeUp className="text-center mb-16">
                    <span className="text-[var(--primary)] font-medium uppercase tracking-wider text-sm">
                        Testimonials
                    </span>
                    <h2 className="heading-lg text-[var(--foreground)] mt-4">
                        Success <span className="text-gradient-gold">Stories</span>
                    </h2>
                    <p className="text-[var(--muted-foreground)] max-w-2xl mx-auto mt-4">
                        Real results from real members. Join the thousands who have
                        transformed their lives with Rafithub.
                    </p>
                </FadeUp>

                {/* Testimonial Slider */}
                <div className="relative max-w-4xl mx-auto">
                    {/* Navigation Buttons */}
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={goToPrevious}
                        aria-label="Previous testimonial"
                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-16 w-12 h-12 bg-[var(--card)] border border-[var(--border)] rounded-full flex items-center justify-center text-[var(--foreground)] hover:bg-[var(--primary)] hover:text-[var(--primary-foreground)] hover:border-[var(--primary)] transition-colors z-10 cursor-pointer shadow-md"
                    >
                        <HiChevronLeft className="w-6 h-6" />
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={goToNext}
                        aria-label="Next testimonial"
                        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-16 w-12 h-12 bg-[var(--card)] border border-[var(--border)] rounded-full flex items-center justify-center text-[var(--foreground)] hover:bg-[var(--primary)] hover:text-[var(--primary-foreground)] hover:border-[var(--primary)] transition-colors z-10 cursor-pointer shadow-md"
                    >
                        <HiChevronRight className="w-6 h-6" />
                    </motion.button>

                    {/* Testimonial Card */}
                    <div
                        className="relative overflow-hidden min-h-[360px] md:min-h-[320px] flex items-center"
                        aria-live="polite"
                        aria-atomic="true"
                    >
                        <AnimatePresence
                            initial={false}
                            custom={direction}
                            mode="popLayout"
                            onExitComplete={() => setIsAnimating(false)}
                        >
                            <motion.div
                                key={currentIndex}
                                custom={direction}
                                variants={slideVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={
                                    shouldReduceMotion
                                        ? { duration: 0.2 }
                                        : {
                                              x: { type: "tween", duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
                                              opacity: { duration: 0.35 },
                                          }
                                }
                                onAnimationStart={() => setIsAnimating(true)}
                                className="w-full"
                            >
                                <div className="card-glass p-8 md:p-12 text-center bg-[var(--card)] border border-[var(--border)] rounded-2xl shadow-lg">
                                    {/* Avatar */}
                                    <div className="relative w-20 h-20 mx-auto mb-6">
                                        <Image
                                            src={current.image}
                                            alt={current.name}
                                            fill
                                            sizes="80px"
                                            className="rounded-full object-cover border-2 border-[var(--primary)]"
                                        />
                                    </div>

                                    {/* Stars */}
                                    <div className="flex justify-center gap-1 mb-6" aria-label={`${current.rating} out of 5 stars`}>
                                        {[...Array(current.rating)].map((_, i) => (
                                            <HiStar
                                                key={i}
                                                className="w-5 h-5 text-[var(--secondary)]"
                                            />
                                        ))}
                                    </div>

                                    {/* Quote */}
                                    <p className="text-lg md:text-xl text-[var(--card-foreground)] italic leading-relaxed mb-8 max-w-3xl mx-auto">
                                        &ldquo;{current.content}&rdquo;
                                    </p>

                                    {/* Author */}
                                    <div>
                                        <h4 className="text-lg font-bold text-[var(--card-foreground)]">
                                            {current.name}
                                        </h4>
                                        <p className="text-[var(--primary)] text-sm font-medium">
                                            {current.role}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Dots */}
                    <div className="flex justify-center gap-2 mt-8" role="tablist" aria-label="Testimonial navigation">
                        {testimonials.map((_, index) => (
                            <button
                                key={index}
                                role="tab"
                                aria-selected={index === currentIndex}
                                onClick={() => goToSlide(index)}
                                aria-label={`Go to testimonial ${index + 1}${index === currentIndex ? " (current)" : ""}`}
                                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${index === currentIndex
                                    ? "w-8 bg-[var(--primary)]"
                                    : "w-2 bg-[var(--muted-foreground)]/30 hover:bg-[var(--muted-foreground)]/50"
                                    }`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
