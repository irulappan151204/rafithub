"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FadeUp, StaggerContainer, StaggerItem } from "./ScrollAnimations";
import { TiltCard } from "./PremiumMotion";
import {
    GiWeightLiftingUp,
    GiRunningShoe,
    GiBoxingGlove,
    GiMeditation,
    GiMuscleUp,
    GiHeartBeats,
} from "react-icons/gi";

const services = [
    {
        icon: GiWeightLiftingUp,
        title: "Strength Training",
        description:
            "Build muscle, increase strength, and transform your physique with our comprehensive weightlifting programs.",
        color: "gym-green",
        href: "/services#strength",
    },
    {
        icon: GiBoxingGlove,
        title: "CrossFit",
        description:
            "High-intensity functional training that combines cardio, strength, and agility for total body fitness.",
        color: "gym-gold",
        href: "/services#crossfit",
    },
    {
        icon: GiHeartBeats,
        title: "Cardio & HIIT",
        description:
            "Burn fat and boost endurance with our heart-pumping cardio and high-intensity interval training sessions.",
        color: "gym-green",
        href: "/services#cardio",
    },
    {
        icon: GiMuscleUp,
        title: "Personal Training",
        description:
            "One-on-one coaching tailored to your goals with certified trainers who push you to new limits.",
        color: "gym-gold",
        href: "/services#personal",
    },
    {
        icon: GiMeditation,
        title: "Yoga & Flexibility",
        description:
            "Improve flexibility, balance, and mental clarity with our expert-led yoga and stretching classes.",
        color: "gym-green",
        href: "/services#yoga",
    },
    {
        icon: GiRunningShoe,
        title: "Nutrition Guidance",
        description:
            "Fuel your body right with personalized nutrition plans and expert dietary advice.",
        color: "gym-gold",
        href: "/services#nutrition",
    },
];

export default function Services() {
    return (
        <section className="section-padding premium-section bg-[var(--background)] transition-colors duration-300">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-30 pointer-events-none">
                <div
                    className="w-full h-full"
                    style={{
                        backgroundImage:
                            "radial-gradient(circle at 2px 2px, var(--muted-foreground) 1px, transparent 0)",
                        backgroundSize: "40px 40px",
                        opacity: 0.1
                    }}
                />
            </div>

            <div className="container-custom relative z-10">
                {/* Section Header */}
                <FadeUp className="text-center mb-16">
                    <span className="section-kicker text-[var(--secondary)] float-badge">
                        Our Services
                    </span>
                    <h2 className="heading-lg text-[var(--foreground)] mt-4">
                        Train Like A <span className="text-gradient-green">Champion</span>
                    </h2>
                    <p className="text-[var(--muted-foreground)] max-w-2xl mx-auto mt-4">
                        From strength to flexibility, we offer a complete range of fitness
                        services designed to help you reach your peak performance.
                    </p>
                </FadeUp>

                {/* Services Grid */}
                <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.map((service) => (
                        <StaggerItem key={service.title}>
                            <Link href={service.href}>
                                <TiltCard className="card-glass group p-8" depth={10}>
                                        {/* Hover Glow Effect — opacity controlled by CSS class only, no inline override */}
                                        <div
                                            className={`absolute inset-0 transition-opacity duration-500 opacity-0 group-hover:opacity-[0.07] rounded-[inherit] pointer-events-none`}
                                            style={{
                                                backgroundColor: service.color === "gym-green" ? "var(--primary)" : "var(--secondary)",
                                            }}
                                        />

                                        <motion.div
                                            whileHover={{ scale: 1.1, rotate: 10 }}
                                            className={`mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--muted)] shadow-inner transition-colors duration-300 group-hover:bg-[var(--card)]`}
                                        >
                                            <service.icon
                                                className={`w-8 h-8 ${service.color === "gym-green"
                                                    ? "text-[var(--primary)]"
                                                    : "text-[var(--secondary)]"
                                                    }`}
                                            />
                                        </motion.div>

                                        {/* Content */}
                                        <h3 className="text-xl font-bold text-[var(--foreground)] mb-3 group-hover:text-[var(--primary)] transition-colors">
                                            {service.title}
                                        </h3>
                                        <p className="text-[var(--muted-foreground)] leading-relaxed mb-4">
                                            {service.description}
                                        </p>

                                        {/* Arrow */}
                                        <div className="flex items-center gap-2 text-[var(--muted-foreground)] group-hover:text-[var(--primary)] transition-colors">
                                            <span className="text-sm font-medium">Learn More</span>
                                            <motion.span
                                                initial={{ x: 0 }}
                                                whileHover={{ x: 5 }}
                                                className="text-lg"
                                            >
                                                →
                                            </motion.span>
                                        </div>

                                        {/* Corner Accent — opacity controlled by CSS class only, no inline override */}
                                        <div
                                            className={`absolute top-0 right-0 w-20 h-20 rounded-bl-full transition-opacity duration-500 opacity-0 group-hover:opacity-10 pointer-events-none`}
                                            style={{
                                                background: service.color === "gym-green" ? "var(--primary)" : "var(--secondary)",
                                            }}
                                        />
                                </TiltCard>
                            </Link>
                        </StaggerItem>
                    ))}
                </StaggerContainer>

                {/* CTA */}
                <FadeUp delay={0.3} className="text-center mt-12">
                    <Link href="/services">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="btn-outline"
                        >
                            View All Services
                        </motion.button>
                    </Link>
                </FadeUp>
            </div>
        </section>
    );
}
