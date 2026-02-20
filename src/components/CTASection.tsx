"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FadeUp } from "./ScrollAnimations";
import { HiArrowRight } from "react-icons/hi";

export default function CTASection() {
    return (
        <section className="relative py-32 overflow-hidden">
            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-fixed"
                style={{
                    backgroundImage:
                        "url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&q=80')",
                }}
            />
            {/* Theme-aware Background Overlay - Increased opacity for better text contrast */}
            <div className="absolute inset-0 bg-[var(--background)]/90 transition-colors duration-300" />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--background)] via-[var(--background)]/95 to-[var(--background)]/90 transition-colors duration-300" />

            {/* Content */}
            <div className="container-custom px-4 md:px-8 relative z-10">
                <div className="max-w-3xl mx-auto text-center">
                    <FadeUp>
                        <span className="text-[var(--primary)] font-medium uppercase tracking-wider text-sm">
                            Ready to Transform?
                        </span>
                    </FadeUp>

                    <FadeUp delay={0.1}>
                        <h2 className="heading-xl text-[var(--foreground)] mt-4 mb-6">
                            Start Your
                            <br />
                            <span className="text-gradient-gold">Fitness Journey</span>
                            <br />
                            Today
                        </h2>
                    </FadeUp>

                    <FadeUp delay={0.2}>
                        <p className="text-xl text-[var(--foreground)]/80 mb-10 font-medium">
                            Join thousands of members who have already transformed their lives.
                            Your first week is on us.
                        </p>
                    </FadeUp>

                    <FadeUp delay={0.3}>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Link href="/membership">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="btn-primary text-lg flex items-center gap-2 group"
                                >
                                    Join Now - Free Trial
                                    <HiArrowRight className="group-hover:translate-x-1 transition-transform" />
                                </motion.button>
                            </Link>

                            <Link href="/contact">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="btn-outline text-lg"
                                >
                                    Contact Us
                                </motion.button>
                            </Link>
                        </div>
                    </FadeUp>

                    {/* Trust Indicators - Updated for better contrast */}
                    <FadeUp delay={0.4}>
                        <div className="mt-12 flex flex-wrap justify-center gap-6 text-[var(--foreground)]/80 text-sm font-medium">
                            <span className="flex items-center gap-2">
                                <svg
                                    className="w-5 h-5 text-[var(--primary)]"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                No Long-Term Contracts
                            </span>
                            <span className="flex items-center gap-2">
                                <svg
                                    className="w-5 h-5 text-[var(--primary)]"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                Cancel Anytime
                            </span>
                        </div>
                    </FadeUp>
                </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute bottom-0 left-0 right-0">
                <svg
                    viewBox="0 0 1440 120"
                    fill="none"
                    className="w-full fill-[var(--background)] transition-colors duration-300"
                    preserveAspectRatio="none"
                >
                    <path
                        d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
                    />
                </svg>
            </div>
        </section>
    );
}
