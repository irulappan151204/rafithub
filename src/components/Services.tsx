"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FadeUp, StaggerContainer, StaggerItem } from "./ScrollAnimations";
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
        <section className="section-padding bg-[var(--background)] relative overflow-hidden transition-colors duration-300">
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
                    <span className="text-[var(--secondary)] font-medium uppercase tracking-wider text-sm">
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
                                <motion.div
                                    whileHover={{ y: -10 }}
                                    className="relative group h-full"
                                >
                                    {/* Card */}
                                    <div className="card-glass p-8 h-full relative overflow-hidden bg-[var(--card)]/80">
                                        {/* Hover Glow Effect */}
                                        <div
                                            className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                                            style={{
                                                backgroundColor: service.color === "gym-green" ? "var(--gym-green)" : "var(--gym-gold)",
                                                opacity: 0.05
                                            }}
                                        />

                                        {/* Icon */}
                                        <motion.div
                                            whileHover={{ scale: 1.1, rotate: 10 }}
                                            className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-colors duration-300`}
                                            style={{
                                                backgroundColor: service.color === "gym-green" ? "rgba(var(--gym-green-rgb), 0.1)" : "rgba(var(--gym-gold-rgb), 0.1)", // Fallback needed if rgb vars not set, but using opacity usually works better with direct colors
                                                background: service.color === "gym-green" ? "var(--primary)" : "var(--secondary)",
                                                opacity: 0.2
                                            }}
                                        >
                                            {/* Wrapper div for background opacity, actual icon separate */}
                                        </motion.div>
                                        {/* Re-doing Icon to avoid complexity with opacity */}
                                        <motion.div
                                            whileHover={{ scale: 1.1, rotate: 10 }}
                                            className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-colors duration-300 bg-[var(--muted)] group-hover:bg-[var(--card)] border border-[var(--border)]`}
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

                                        {/* Corner Accent */}
                                        <div
                                            className={`absolute top-0 right-0 w-20 h-20 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                                            style={{
                                                background: service.color === "gym-green" ? "var(--primary)" : "var(--secondary)",
                                                opacity: 0.1
                                            }}
                                        />
                                    </div>
                                </motion.div>
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
