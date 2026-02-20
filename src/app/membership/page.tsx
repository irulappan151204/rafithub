"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { FadeUp, StaggerContainer, StaggerItem } from "@/components/ScrollAnimations";
import { HiCheck, HiStar, HiX } from "react-icons/hi";

const membershipPlans = [
    {
        name: "Monthly",
        description: "Perfect for beginners starting their fitness journey",
        price: 2000,
        period: "month",
        features: [
            { name: "Full access to gym facilities", included: true },
            { name: "Access to cardio area", included: true },
            { name: "Access to strength training area", included: true },
            { name: "Basic fitness assessment", included: true },
            { name: "Personalized workout plan", included: false },
            { name: "Free personal training session", included: false },
            { name: "Access to group classes", included: false },
            { name: "Nutrition consultation", included: false },
        ],
        popular: false,
    },
    {
        name: "3-Month",
        description: "All Monthly plan features plus personalized guidance",
        price: 5500,
        period: "3 months",
        features: [
            { name: "All Monthly plan features", included: true },
            { name: "Personalized workout plan", included: true },
            { name: "1 free personal training session", included: true },
            { name: "Access to group classes", included: true },
            { name: "Monthly fitness assessment", included: true },
            { name: "2 free personal training sessions", included: false },
            { name: "Nutrition consultation", included: false },
            { name: "Body composition analysis", included: false },
        ],
        popular: true,
    },
    {
        name: "6-Month",
        description: "Comprehensive fitness experience with premium perks",
        price: 7500,
        period: "6 months",
        features: [
            { name: "All 3-Month plan features", included: true },
            { name: "2 free personal training sessions", included: true },
            { name: "Nutrition consultation", included: true },
            { name: "Body composition analysis", included: true },
            { name: "Priority class booking", included: true },
            { name: "4 free personal training sessions", included: false },
            { name: "Quarterly nutrition consultation", included: false },
            { name: "Exclusive member events", included: false },
        ],
        popular: false,
    },
    {
        name: "Annual",
        description: "The ultimate fitness commitment with maximum value",
        price: 10000,
        period: "year",
        features: [
            { name: "All 6-Month plan features", included: true },
            { name: "4 free personal training sessions", included: true },
            { name: "Quarterly nutrition consultation", included: true },
            { name: "Exclusive member events", included: true },
            { name: "Priority class booking", included: true },
            { name: "Body composition analysis", included: true },
            { name: "VIP locker access", included: true },
            { name: "Guest passes (4/year)", included: true },
        ],
        popular: false,
    },

];

const personalTrainingPlans = [
    {
        name: "Basic Training",
        price12: 6000,
        price24: 12000,
        features: [
            "Personalized workout plans",
            "Progress tracking",
            "Form correction",
            "Basic nutrition guidance",
        ],
        popular: false,
    },
    {
        name: "Advanced Training",
        price12: 8000,
        price24: 16000,
        specializations: ["Personal Training", "Injury Rehabilitation", "Sports Fitness"],
        features: [
            "Advanced nutrition planning",
            "Regular assessments",
            "Specialized programs",
            "Flexible scheduling",
        ],
        popular: true,
    },
    {
        name: "Elite Training",
        price12: 10000,
        price24: 20000,
        features: [
            "Certified Professional Training",
            "Specialized programs",
            "Competition preparation",
            "Advanced performance tracking",
            "Priority scheduling",
            "VIP amenities access",
        ],
        popular: false,
    },
];

const faqs = [
    {
        question: "Can I cancel my membership anytime?",
        answer: "Yes, you can cancel your membership at any time with no cancellation fees. We believe in flexibility and want you to feel free to come and go as your lifestyle changes.",
    },
    {
        question: "Is there a trial period?",
        answer: "Absolutely! We offer a free 3-day trial for all new members. Experience everything Rafithub has to offer before committing.",
    },
    {
        question: "Can I freeze my membership?",
        answer: "Yes, 6-Month and Annual members can freeze their membership for up to 3 months. 3-Month members can freeze for 1 month.",
    },
    {
        question: "Are there family discounts?",
        answer: "Yes! We offer 15% off for family plans when two or more family members join together. Contact us for more details.",
    },
    {
        question: "What's included in personal training?",
        answer: "Personal training sessions include one-on-one coaching, customized workout plans, progress tracking, and nutritional guidance from certified trainers.",
    },
];

export default function MembershipPage() {
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    return (
        <div className="min-h-screen bg-[var(--background)] pt-24 transition-colors duration-300">
            {/* Hero */}
            <section className="py-16 px-4 md:px-8 text-center">
                <FadeUp>
                    <span className="text-[var(--primary)] font-medium uppercase tracking-wider text-sm">
                        Membership Plans
                    </span>
                    <h1 className="heading-lg text-[var(--foreground)] mt-4">
                        Choose the Perfect <span className="text-gradient-gold">Plan</span>
                    </h1>
                    <p className="text-[var(--muted-foreground)] max-w-2xl mx-auto mt-4">
                        Choose the perfect membership plan that fits your fitness goals and budget.
                    </p>
                </FadeUp>
            </section>

            {/* Membership Plans */}
            <section className="container-custom px-4 md:px-8 pb-20">
                <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {membershipPlans.map((plan) => (
                        <StaggerItem key={plan.name}>
                            <motion.div
                                whileHover={{ y: -10 }}
                                className={`relative h-full ${plan.popular ? "lg:-mt-4 lg:mb-4" : ""}`}
                            >
                                {plan.popular && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                                        <div className="bg-[var(--secondary)] text-[var(--secondary-foreground)] px-4 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                                            <HiStar className="w-4 h-4" />
                                            Best Value
                                        </div>
                                    </div>
                                )}

                                <div
                                    className={`h-full p-6 rounded-3xl border transition-all duration-300 ${plan.popular
                                        ? "bg-gradient-to-b from-[var(--primary)]/10 to-[var(--card)] border-[var(--primary)]/50 hover:border-[var(--primary)] shadow-lg"
                                        : "bg-[var(--card)] border-[var(--border)] hover:border-[var(--primary)]/30"
                                        }`}
                                >
                                    <h3
                                        className={`font-display text-2xl tracking-wide mb-2 ${plan.popular ? "text-[var(--primary)]" : "text-[var(--foreground)]"
                                            }`}
                                    >
                                        {plan.name}
                                    </h3>

                                    <div className="mb-6">
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-4xl font-bold text-[var(--foreground)]">
                                                ₹{plan.price.toLocaleString("en-IN")}
                                            </span>
                                            <span className="text-[var(--muted-foreground)]">/{plan.period}</span>
                                        </div>
                                    </div>

                                    <ul className="space-y-2 mb-6">
                                        {plan.features.map((feature) => (
                                            <li key={feature.name} className="flex items-start gap-2">
                                                {feature.included ? (
                                                    <HiCheck className="w-4 h-4 flex-shrink-0 mt-0.5 text-[var(--primary)]" />
                                                ) : (
                                                    <HiX className="w-4 h-4 flex-shrink-0 mt-0.5 text-[var(--muted-foreground)]/50" />
                                                )}
                                                <span
                                                    className={
                                                        feature.included ? "text-[var(--muted-foreground)] text-sm" : "text-[var(--muted-foreground)]/50 text-sm"
                                                    }
                                                >
                                                    {feature.name}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>

                                    <Link href="/contact">
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className={`w-full py-3 rounded-xl font-bold transition-all duration-300 ${plan.popular
                                                ? "btn-primary"
                                                : "border border-[var(--border)] text-[var(--foreground)] hover:border-[var(--primary)] hover:text-[var(--primary)]"
                                                }`}
                                        >
                                            Choose Plan
                                        </motion.button>
                                    </Link>
                                </div>
                            </motion.div>
                        </StaggerItem>
                    ))}
                </StaggerContainer>
            </section>

            {/* Personal Training Plans */}
            <section className="container-custom px-4 md:px-8 pb-20">
                <FadeUp className="text-center mb-12">
                    <span className="text-[var(--secondary)] font-medium uppercase tracking-wider text-sm">
                        Personal Training
                    </span>
                    <h2 className="heading-md text-[var(--foreground)] mt-4">
                        Personal Training <span className="text-[var(--primary)]">Plans</span>
                    </h2>
                    <p className="text-[var(--muted-foreground)] max-w-2xl mx-auto mt-4">
                        Take your fitness journey to the next level with personalized training.
                    </p>
                </FadeUp>

                <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {personalTrainingPlans.map((plan) => (
                        <StaggerItem key={plan.name}>
                            <motion.div
                                whileHover={{ y: -10 }}
                                className={`relative h-full ${plan.popular ? "lg:-mt-4 lg:mb-4" : ""}`}
                            >
                                {plan.popular && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                                        <div className="bg-[var(--secondary)] text-[var(--secondary-foreground)] px-4 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                                            <HiStar className="w-4 h-4" />
                                            Most Popular
                                        </div>
                                    </div>
                                )}

                                <div
                                    className={`h-full p-8 rounded-3xl border transition-all duration-300 ${plan.popular
                                        ? "bg-gradient-to-b from-[var(--secondary)]/10 to-[var(--card)] border-[var(--secondary)]/50 hover:border-[var(--secondary)]"
                                        : "bg-[var(--card)] border-[var(--border)] hover:border-[var(--primary)]/30"
                                        }`}
                                >
                                    <h3
                                        className={`font-display text-2xl tracking-wide mb-4 ${plan.popular ? "text-[var(--secondary)]" : "text-[var(--foreground)]"
                                            }`}
                                    >
                                        {plan.name}
                                    </h3>

                                    {/* Pricing Options */}
                                    <div className="space-y-2 mb-6">
                                        <div className="flex justify-between items-center bg-[var(--muted)]/50 rounded-lg px-4 py-2">
                                            <span className="text-[var(--muted-foreground)] text-sm">12 sessions</span>
                                            <span className="text-[var(--foreground)] font-bold">₹{plan.price12.toLocaleString("en-IN")}/month</span>
                                        </div>
                                        <div className="flex justify-between items-center bg-[var(--muted)]/50 rounded-lg px-4 py-2">
                                            <span className="text-[var(--muted-foreground)] text-sm">24 sessions</span>
                                            <span className="text-[var(--foreground)] font-bold">₹{plan.price24.toLocaleString("en-IN")}/month</span>
                                        </div>
                                    </div>

                                    {/* Specializations */}
                                    {plan.specializations && (
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {plan.specializations.map((spec) => (
                                                <span
                                                    key={spec}
                                                    className="text-xs px-3 py-1 bg-[var(--secondary)]/10 border border-[var(--secondary)]/30 rounded-full text-[var(--secondary)]"
                                                >
                                                    {spec}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    <ul className="space-y-2 mb-6">
                                        {plan.features.map((feature) => (
                                            <li key={feature} className="flex items-start gap-2">
                                                <HiCheck className="w-4 h-4 flex-shrink-0 mt-0.5 text-[var(--primary)]" />
                                                <span className="text-[var(--muted-foreground)] text-sm">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    <Link href="/contact">
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className={`w-full py-4 rounded-xl font-bold transition-all duration-300 ${plan.popular
                                                ? "bg-[var(--secondary)] text-[var(--secondary-foreground)] hover:bg-[var(--secondary)]/90"
                                                : "border border-[var(--border)] text-[var(--foreground)] hover:border-[var(--primary)] hover:text-[var(--primary)]"
                                                }`}
                                        >
                                            Choose Plan
                                        </motion.button>
                                    </Link>
                                </div>
                            </motion.div>
                        </StaggerItem>
                    ))}
                </StaggerContainer>
            </section>

            {/* FAQ Section */}
            <section className="container-custom px-4 md:px-8 pb-20">
                <FadeUp className="text-center mb-12">
                    <h2 className="heading-md text-[var(--foreground)]">
                        Frequently Asked <span className="text-[var(--primary)]">Questions</span>
                    </h2>
                </FadeUp>

                <div className="max-w-3xl mx-auto space-y-4">
                    {faqs.map((faq, index) => (
                        <FadeUp key={index} delay={index * 0.1}>
                            <div className="card-glass overflow-hidden bg-[var(--card)]/80">
                                <button
                                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                                    className="w-full p-6 text-left flex items-center justify-between"
                                >
                                    <span className="text-[var(--foreground)] font-medium">{faq.question}</span>
                                    <motion.span
                                        animate={{ rotate: openFaq === index ? 45 : 0 }}
                                        className="text-[var(--primary)] text-2xl"
                                    >
                                        +
                                    </motion.span>
                                </button>
                                <motion.div
                                    initial={false}
                                    animate={{
                                        height: openFaq === index ? "auto" : 0,
                                        opacity: openFaq === index ? 1 : 0,
                                    }}
                                    className="overflow-hidden"
                                >
                                    <p className="px-6 pb-6 text-[var(--muted-foreground)]">{faq.answer}</p>
                                </motion.div>
                            </div>
                        </FadeUp>
                    ))}
                </div>
            </section>

            {/* Premium CTA */}
            <section className="container-custom px-4 md:px-8 pb-20">
                <FadeUp>
                    <div className="bg-gradient-to-r from-[var(--primary)]/10 to-[var(--secondary)]/10 border border-[var(--border)] rounded-3xl p-8 md:p-12 text-center">
                        <h3 className="heading-md text-[var(--foreground)] mb-4">Your Transformation Starts Today</h3>
                        <p className="text-[var(--muted-foreground)] max-w-2xl mx-auto mb-6">
                            Join thousands who&apos;ve already achieved their fitness goals with Rafithub.
                            Expert trainers, world-class equipment, and a community that pushes you to greatness.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Link href="/contact">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="btn-primary"
                                >
                                    Start Your Journey
                                </motion.button>
                            </Link>
                            <Link href="/trainers">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="btn-outline"
                                >
                                    Meet Our Trainers
                                </motion.button>
                            </Link>
                        </div>
                    </div>
                </FadeUp>
            </section>
        </div>
    );
}
