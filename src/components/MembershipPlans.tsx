"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FadeUp, StaggerContainer, StaggerItem } from "./ScrollAnimations";
import { TiltCard } from "./PremiumMotion";
import { HiCheck, HiStar } from "react-icons/hi";

const plans = [
    {
        name: "Monthly",
        description: "Perfect for beginners starting their fitness journey",
        price: 2000,
        period: "month",
        features: [
            "Full access to gym facilities",
            "Access to cardio area",
            "Access to strength training area",
            "Basic fitness assessment",
            "Mobile app access",
        ],
        popular: false,
        color: "gray",
    },
    {
        name: "3-Month",
        description: "For dedicated fitness enthusiasts seeking more",
        price: 5500,
        period: "3 months",
        features: [
            "All Monthly plan features",
            "Personalized workout plan",
            "1 free PT session",
            "Access to group classes",
            "Monthly fitness assessment",
            "Guest passes (2/month)",
        ],
        popular: true,
        color: "green",
    },
    {
        name: "Annual",
        description: "The ultimate premium fitness experience",
        price: 10000,
        period: "year",
        features: [
            "All 6-Month features",
            "4 free PT sessions/year",
            "Quarterly nutrition consultation",
            "Exclusive member events",
            "Priority class booking",
            "VIP locker access",
            "Guest passes (4/year)",
        ],
        popular: false,
        color: "gold",
    },
];

export default function MembershipPlans() {
    return (
        <section className="section-padding premium-section bg-[var(--background)] transition-colors duration-300">
            {/* Background Elements */}
            <div className="absolute inset-0">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[var(--primary)]/5 rounded-full blur-3xl" />
            </div>

            <div className="container-custom relative z-10">
                {/* Section Header */}
                <FadeUp className="text-center mb-12">
                    <span className="section-kicker">
                        Membership Plans
                    </span>
                    <h2 className="heading-lg text-[var(--foreground)] mt-4">
                        Choose Your <span className="text-gradient-gold">Path</span>
                    </h2>
                    <p className="text-[var(--muted-foreground)] max-w-2xl mx-auto mt-4">
                        Flexible membership options designed to fit your lifestyle and
                        fitness goals.
                    </p>
                </FadeUp>

                {/* Plans Grid */}
                <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                    {plans.map((plan) => (
                        <StaggerItem key={plan.name}>
                            <TiltCard
                                className={`relative h-full ${plan.popular ? "lg:-mt-4 lg:mb-4" : ""
                                    }`}
                                depth={plan.popular ? 12 : 8}
                            >
                                {/* Popular Badge */}
                                {plan.popular && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                                        <div className="bg-[var(--secondary)] text-[var(--secondary-foreground)] px-4 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                                            <HiStar className="w-4 h-4" />
                                            Best Value
                                        </div>
                                    </div>
                                )}

                                {/* Card */}
                                <div
                                    className={`h-full rounded-3xl border p-8 transition-all duration-300 ${plan.popular
                                        ? "bg-gradient-to-b from-[var(--primary)]/10 to-[var(--card)] border-[var(--primary)]/50 hover:border-[var(--primary)] shadow-lg"
                                        : "bg-[var(--card)] border-[var(--border)] hover:border-[var(--primary)]/30"
                                        }`}
                                >
                                    {/* Plan Name */}
                                    <h3
                                        className={`font-display text-2xl tracking-wide mb-2 ${plan.color === "green"
                                            ? "text-[var(--primary)]"
                                            : plan.color === "gold"
                                                ? "text-[var(--secondary)]"
                                                : "text-[var(--foreground)]"
                                            }`}
                                    >
                                        {plan.name}
                                    </h3>
                                    <p className="text-[var(--muted-foreground)] text-sm mb-6">
                                        {plan.description}
                                    </p>

                                    {/* Price */}
                                    <div className="mb-8">
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-4xl font-bold text-[var(--foreground)]">
                                                ₹{plan.price.toLocaleString("en-IN")}
                                            </span>
                                            <span className="text-[var(--muted-foreground)]">
                                                /{plan.period}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Features */}
                                    <ul className="space-y-3 mb-8">
                                        {plan.features.map((feature) => (
                                            <li key={feature} className="flex items-start gap-3">
                                                <HiCheck
                                                    className={`w-5 h-5 flex-shrink-0 mt-0.5 ${plan.color === "green"
                                                        ? "text-[var(--primary)]"
                                                        : plan.color === "gold"
                                                            ? "text-[var(--secondary)]"
                                                            : "text-[var(--muted-foreground)]"
                                                        }`}
                                                />
                                                <span className="text-[var(--muted-foreground)] text-sm">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    {/* CTA Button */}
                                    <Link href="/membership">
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className={`w-full py-4 rounded-xl font-bold transition-all duration-300 ${plan.popular
                                                ? "btn-primary"
                                                : "btn-outline"
                                                }`}
                                        >
                                            Get Started
                                        </motion.button>
                                    </Link>
                                </div>
                            </TiltCard>
                        </StaggerItem>
                    ))}
                </StaggerContainer>
            </div>
        </section>
    );
}
