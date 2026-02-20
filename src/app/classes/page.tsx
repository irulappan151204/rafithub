"use client";

import { motion } from "framer-motion";
import { FadeUp, StaggerContainer, StaggerItem } from "@/components/ScrollAnimations";
import { HiLightningBolt, HiHeart, HiFire, HiShieldCheck } from "react-icons/hi";

// New data structure for workout-based classes
const programs = [
    {
        id: 1,
        name: "Strength & Conditioning",
        focus: "Strength",
        description: "Build raw power and functional strength through compound movements and progressive overload techniques.",
        intensity: "Intermediate",
        icon: HiLightningBolt,
        color: "text-red-500",
        bgColor: "bg-red-500/10",
        borderColor: "border-red-500/20"
    },
    {
        id: 2,
        name: "HIIT Burn",
        focus: "High Intensity",
        description: "Maximize calorie burn and boost metabolism with short bursts of intense exercise followed by recovery periods.",
        intensity: "High",
        icon: HiFire,
        color: "text-orange-500",
        bgColor: "bg-orange-500/10",
        borderColor: "border-orange-500/20"
    },
    {
        id: 3,
        name: "Functional Training",
        focus: "Mobility & Strength",
        description: "Prepare your body for daily life with movements that mimic real-world activities. Improve balance and coordination.",
        intensity: "All Levels",
        icon: HiShieldCheck,
        color: "text-blue-500",
        bgColor: "bg-blue-500/10",
        borderColor: "border-blue-500/20"
    },
    {
        id: 4,
        name: "Core & Abs",
        focus: "Core Stability",
        description: "A targeted session meant to carve your midsection, improve posture, and build a rock-solid core foundation.",
        intensity: "Intermediate",
        icon: HiLightningBolt,
        color: "text-yellow-500",
        bgColor: "bg-yellow-500/10",
        borderColor: "border-yellow-500/20"
    },
    {
        id: 5,
        name: "Cardio Blast",
        focus: "Endurance",
        description: "Heart-pumping aerobic workout designed to increase stamina, lung capacity, and overall cardiovascular health.",
        intensity: "Intermediate",
        icon: HiHeart,
        color: "text-pink-500",
        bgColor: "bg-pink-500/10",
        borderColor: "border-pink-500/20"
    },
    {
        id: 6,
        name: "Mobility & Recovery",
        focus: "Flexibility",
        description: "Reduce risk of injury and improve range of motion with guided stretching and active recovery exercises.",
        intensity: "Low",
        icon: HiShieldCheck,
        color: "text-green-500",
        bgColor: "bg-green-500/10",
        borderColor: "border-green-500/20"
    },
    {
        id: 7,
        name: "JUNO – Music-Based Fitness",
        focus: "Rhythm • Cardio • Full Body",
        description: "A high-energy workout driven by music and rhythm. JUNO combines cardio movements, bodyweight exercises, and flow-based routines synced with powerful beats.",
        intensity: "Beginner to Intermediate",
        icon: HiFire,
        color: "text-purple-500",
        bgColor: "bg-purple-500/10",
        borderColor: "border-purple-500/20"
    },
    {
        id: 8,
        name: "Athletic Performance",
        focus: "Speed • Agility • Power",
        description: "Designed for sports performance and athletic conditioning. Includes plyometrics, agility drills, and explosive movements to improve speed and coordination.",
        intensity: "Advanced",
        icon: HiLightningBolt,
        color: "text-red-600",
        bgColor: "bg-red-600/10",
        borderColor: "border-red-600/20"
    },
    {
        id: 9,
        name: "Beginner Fitness Foundations",
        focus: "Basics • Technique • Confidence",
        description: "Perfect for newcomers. Covers fundamental movements, proper form, and gradual conditioning to build confidence and prevent injury.",
        intensity: "Beginner",
        icon: HiShieldCheck,
        color: "text-teal-500",
        bgColor: "bg-teal-500/10",
        borderColor: "border-teal-500/20"
    },
    {
        id: 10,
        name: "Stretch & Relax",
        focus: "Flexibility • Recovery • Stress Relief",
        description: "A calming session focused on deep stretching and relaxation techniques to reduce muscle tightness and promote recovery.",
        intensity: "Beginner",
        icon: HiHeart,
        color: "text-indigo-400",
        bgColor: "bg-indigo-400/10",
        borderColor: "border-indigo-400/20"
    },
];

export default function ClassesPage() {
    return (
        <div className="min-h-screen bg-[var(--background)] pt-24 transition-colors duration-300">
            {/* Hero */}
            <section className="py-16 px-4 md:px-8 text-center">
                <FadeUp>
                    <span className="text-[var(--primary)] font-medium uppercase tracking-wider text-sm">
                        Our Programs
                    </span>
                    <h1 className="heading-lg text-[var(--foreground)] mt-4">
                        World-Class <span className="text-gradient-gold">Workouts</span>
                    </h1>
                    <p className="text-[var(--muted-foreground)] max-w-2xl mx-auto mt-4">
                        Discover a variety of training styles designed to help you achieve specific fitness goals, from building muscle to improving endurance.
                    </p>
                </FadeUp>
            </section>

            {/* Programs Grid */}
            <section className="container-custom px-4 md:px-8 pb-20">
                <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {programs.map((program) => (
                        <StaggerItem key={program.id}>
                            <motion.div
                                whileHover={{ y: -5 }}
                                className={`h-full p-8 rounded-2xl border ${program.borderColor} ${program.bgColor} backdrop-blur-sm transition-all duration-300 hover:shadow-lg`}
                            >
                                <div className="flex justify-between items-start mb-6">
                                    <div className={`p-3 rounded-xl bg-[var(--background)] shadow-sm ${program.color}`}>
                                        <program.icon className="w-8 h-8" />
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${program.borderColor} ${program.color}`}>
                                        {program.intensity}
                                    </span>
                                </div>

                                <h3 className="text-2xl font-bold text-[var(--foreground)] mb-2">
                                    {program.name}
                                </h3>
                                <div className="text-sm font-medium text-[var(--muted-foreground)] uppercase tracking-wider mb-4">
                                    Focus: <span className={program.color}>{program.focus}</span>
                                </div>

                                <p className="text-[var(--muted-foreground)] leading-relaxed">
                                    {program.description}
                                </p>
                            </motion.div>
                        </StaggerItem>
                    ))}
                </StaggerContainer>
            </section>

            {/* CTA */}
            <section className="py-20 px-4 md:px-8">
                <div className="container-custom">
                    <FadeUp>
                        <div className="rounded-3xl p-12 text-center relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-r from-[var(--primary)] via-gym-gold to-[var(--primary)] opacity-10 group-hover:opacity-20 transition-opacity duration-500"></div>
                            {/* Dark overlay for text readability in light mode */}
                            <div className="absolute inset-0 bg-black/40"></div>

                            <div className="relative z-10">
                                <h2 className="heading-md text-white mb-6">
                                    Ready to Start Your Journey?
                                </h2>
                                <p className="text-gray-100 max-w-2xl mx-auto mb-8 text-lg">
                                    Join Rafithub today and get unlimited access to all our specialized workout programs.
                                </p>
                                <motion.a
                                    href="/contact"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="inline-block btn-primary shadow-xl shadow-[var(--primary)]/20"
                                >
                                    Start Free Trial
                                </motion.a>
                            </div>
                        </div>
                    </FadeUp>
                </div>
            </section>
        </div>
    );
}
