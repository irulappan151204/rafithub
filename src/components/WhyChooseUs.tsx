"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { FadeUp, StaggerContainer, StaggerItem } from "./ScrollAnimations";
import {
    HiUserGroup,
    HiClock,
    HiShieldCheck,
    HiSparkles,
    HiLightningBolt,
    HiHeart,
} from "react-icons/hi";

const features = [
    {
        icon: HiUserGroup,
        title: "Expert Trainers",
        description:
            "Certified professionals dedicated to your fitness journey with personalized guidance.",
    },
    {
        icon: HiClock,
        title: "24/7 Access",
        description:
            "Train on your schedule with round-the-clock access to all facilities and equipment.",
    },
    {
        icon: HiShieldCheck,
        title: "Safe Environment",
        description:
            "Clean, sanitized, and secure facilities with modern safety protocols.",
    },
    {
        icon: HiSparkles,
        title: "Premium Equipment",
        description:
            "State-of-the-art machines and free weights from world-leading brands.",
    },
    {
        icon: HiLightningBolt,
        title: "High Energy",
        description:
            "Electric atmosphere with motivating music and inspiring community.",
    },
    {
        icon: HiHeart,
        title: "Wellness Focus",
        description:
            "Holistic approach including nutrition counseling and recovery programs.",
    },
];

const stats = [
    { label: "Years of Excellence", value: 15 },
    { label: "Active Members", value: 10000 },
    { label: "Expert Trainers", value: 50 },
    { label: "Classes Weekly", value: 100 },
];

function AnimatedCounter({ target }: { target: number }) {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    useEffect(() => {
        if (isInView) {
            const duration = 2000;
            const steps = 60;
            const increment = target / steps;
            let current = 0;

            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    setCount(target);
                    clearInterval(timer);
                } else {
                    setCount(Math.floor(current));
                }
            }, duration / steps);

            return () => clearInterval(timer);
        }
    }, [isInView, target]);

    return <span ref={ref}>{count.toLocaleString()}</span>;
}

export default function WhyChooseUs() {
    return (
        <section className="section-padding bg-[var(--background)] relative overflow-hidden transition-colors duration-300">
            {/* Background Elements */}
            <div className="absolute inset-0">
                <div className="absolute top-0 left-0 w-96 h-96 bg-[var(--primary)]/5 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-[var(--secondary)]/5 rounded-full blur-3xl" />
            </div>

            <div className="container-custom relative z-10">
                {/* Section Header */}
                <FadeUp className="text-center mb-16">
                    <span className="text-[var(--primary)] font-medium uppercase tracking-wider text-sm">
                        Why Choose Us
                    </span>
                    <h2 className="heading-lg text-[var(--foreground)] mt-4">
                        The <span className="text-gradient-gold">Rafithub</span> Difference
                    </h2>
                    <p className="text-[var(--muted-foreground)] max-w-2xl mx-auto mt-4">
                        We&apos;re not just a gym – we&apos;re a community dedicated to
                        helping you become the best version of yourself.
                    </p>
                </FadeUp>

                {/* Features Grid */}
                <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
                    {features.map((feature) => (
                        <StaggerItem key={feature.title}>
                            <motion.div
                                whileHover={{ y: -8, scale: 1.02 }}
                                className="card-glass p-8 h-full group cursor-pointer bg-[var(--card)]/80"
                            >
                                <motion.div
                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                    className="w-14 h-14 bg-[var(--primary)]/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-[var(--primary)]/20 transition-colors"
                                >
                                    <feature.icon className="w-7 h-7 text-[var(--primary)]" />
                                </motion.div>
                                <h3 className="text-xl font-bold text-[var(--foreground)] mb-3">
                                    {feature.title}
                                </h3>
                                <p className="text-[var(--muted-foreground)] leading-relaxed">
                                    {feature.description}
                                </p>
                            </motion.div>
                        </StaggerItem>
                    ))}
                </StaggerContainer>

                {/* Stats Section */}
                <FadeUp delay={0.3}>
                    <div className="bg-gradient-to-r from-[var(--card)] to-[var(--muted)] border border-[var(--border)] rounded-3xl p-8 md:p-12">
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                            {stats.map((stat, index) => (
                                <motion.div
                                    key={stat.label}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="text-center"
                                >
                                    <div className="font-display text-5xl md:text-6xl text-[var(--primary)] mb-2">
                                        <AnimatedCounter target={stat.value} />
                                        {stat.value >= 1000 ? "+" : "+"}
                                    </div>
                                    <div className="text-[var(--muted-foreground)] uppercase tracking-wider text-sm">
                                        {stat.label}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </FadeUp>
            </div>
        </section>
    );
}
