"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { FadeUp } from "@/components/ScrollAnimations";
import PageHero from "@/components/PageHero";
import {
    GiWeightLiftingUp,
    GiRunningShoe,
    GiBoxingGlove,
    GiMeditation,
    GiMuscleUp,
    GiHeartBeats,
} from "react-icons/gi";
import { HiCheck, HiArrowRight } from "react-icons/hi";

const services = [
    {
        id: "strength",
        icon: GiWeightLiftingUp,
        title: "Strength Training",
        description: "Build muscle, increase strength, and transform your physique with our comprehensive weightlifting programs.",
        image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80",
        features: [
            "Personalized workout plans",
            "Form correction and coaching",
            "Progressive overload programming",
            "Recovery and nutrition guidance",
            "Access to premium equipment",
        ],
    },
    {
        id: "crossfit",
        icon: GiBoxingGlove,
        title: "CrossFit",
        description: "High-intensity functional training that combines cardio, strength, and agility for total body fitness.",
        image: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=800&q=80",
        features: [
            "Daily WODs (Workout of the Day)",
            "Olympic lifting coaching",
            "Gymnastics skills training",
            "Competition preparation",
            "Community-driven workouts",
        ],
    },
    {
        id: "cardio",
        icon: GiHeartBeats,
        title: "Cardio & HIIT",
        description: "Burn fat and boost endurance with our heart-pumping cardio and high-intensity interval training sessions.",
        image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80",
        features: [
            "30-45 minute intense sessions",
            "Heart rate zone training",
            "Calorie-torching workouts",
            "Variety of equipment options",
            "Group motivation",
        ],
    },
    {
        id: "personal",
        icon: GiMuscleUp,
        title: "Personal Training",
        description: "One-on-one coaching tailored to your goals with certified trainers who push you to new limits.",
        image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80",
        features: [
            "Custom training programs",
            "Dedicated trainer attention",
            "Flexible scheduling",
            "Progress tracking",
            "Nutritional guidance",
        ],
    },
    {
        id: "yoga",
        icon: GiMeditation,
        title: "Yoga & Flexibility",
        description: "Improve flexibility, balance, and mental clarity with our expert-led yoga and stretching classes.",
        image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80",
        features: [
            "Multiple yoga styles",
            "Beginner to advanced levels",
            "Meditation sessions",
            "Mobility work",
            "Stress reduction focus",
        ],
    },
    {
        id: "nutrition",
        icon: GiRunningShoe,
        title: "Nutrition Guidance",
        description: "Fuel your body right with personalized nutrition plans and expert dietary advice.",
        image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80",
        features: [
            "Personalized meal plans",
            "Macro tracking guidance",
            "Supplement recommendations",
            "Weekly check-ins",
            "Recipe suggestions",
        ],
    },
];

export default function ServicesPage() {
    return (
        <div className="min-h-screen bg-[var(--background)] transition-colors duration-300">
            <PageHero
                eyebrow="Our Services"
                title={<>Premium <span className="text-gradient-gold">Programs</span></>}
                description="Comprehensive fitness solutions designed to help you achieve your goals faster than ever."
                imageSrc="https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=1920&q=80"
                stats={[
                    { value: "6", label: "Services" },
                    { value: "1:1", label: "PT" },
                    { value: "HIIT", label: "Classes" },
                    { value: "Fuel", label: "Nutrition" },
                ]}
            />

            {/* Services */}
            <section className="container-custom px-4 md:px-8 pb-20">
                <div className="space-y-20">
                    {services.map((service, index) => (
                        <FadeUp key={service.id} delay={index * 0.1}>
                            <div
                                id={service.id}
                                className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
                            >
                                {/* Image */}
                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    className={`relative aspect-[4/3] rounded-3xl overflow-hidden ${index % 2 === 1 ? "lg:order-2" : ""
                                        }`}
                                >
                                    <Image
                                        src={service.image}
                                        alt={service.title}
                                        fill
                                        sizes="(max-width: 1024px) 100vw, 50vw"
                                        className="object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)]/60 to-transparent" />
                                </motion.div>

                                {/* Content */}
                                <div className={index % 2 === 1 ? "lg:order-1" : ""}>
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-14 h-14 bg-[var(--primary)]/10 rounded-xl flex items-center justify-center">
                                            <service.icon className="w-7 h-7 text-[var(--primary)]" />
                                        </div>
                                        <h2 className="heading-md text-[var(--foreground)]">{service.title}</h2>
                                    </div>

                                    <p className="text-[var(--muted-foreground)] text-lg mb-6">{service.description}</p>

                                    <ul className="space-y-3 mb-8">
                                        {service.features.map((feature) => (
                                            <li key={feature} className="flex items-center gap-3">
                                                <HiCheck className="w-5 h-5 text-[var(--primary)] flex-shrink-0" />
                                                <span className="text-[var(--foreground)]/80">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    <div className="flex gap-4">
                                        <Link href="/membership">
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                className="btn-primary flex items-center gap-2 group"
                                            >
                                                Get Started
                                                <HiArrowRight className="group-hover:translate-x-1 transition-transform" />
                                            </motion.button>
                                        </Link>
                                        <Link href="/contact">
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                className="btn-outline"
                                            >
                                                Learn More
                                            </motion.button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </FadeUp>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="container-custom px-4 md:px-8 pb-20">
                <FadeUp>
                    <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                        <Image
                            src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&q=80"
                            alt="Gym CTA"
                            fill
                            sizes="100vw"
                            className="object-cover"
                        />
                        {/* Always dark overlay for text contrast against image */}
                        <div className="absolute inset-0 bg-black/80" />
                        <div className="relative z-10 p-8 md:p-16 text-center">
                            {/* Always white text for visibility on dark overlay */}
                            <h3 className="heading-md text-white mb-4">Not Sure Where to Start?</h3>
                            <p className="text-gray-300 max-w-2xl mx-auto mb-8 font-medium">
                                Book a free consultation with one of our trainers and we&apos;ll help you find the perfect program for your goals.
                            </p>
                            <Link href="/contact">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="btn-secondary"
                                >
                                    Book Free Consultation
                                </motion.button>
                            </Link>
                        </div>
                    </div>
                </FadeUp>
            </section>
        </div>
    );
}
