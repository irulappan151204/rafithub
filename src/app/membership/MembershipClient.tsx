"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { FadeUp, StaggerContainer, StaggerItem } from "@/components/ScrollAnimations";
import PageHero from "@/components/PageHero";
import { LeadCaptureForm } from "@/components/LeadCaptureForm";
import { HiCheck, HiStar, HiX } from "react-icons/hi";
import { formatINR } from "@/lib/format";

export interface PublicPlanItem {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: "GYM_MEMBERSHIP" | "PERSONAL_TRAINING";
  price: number;
  secondaryPrice: number | null;
  periodLabel: string;
  isPopular: boolean;
  specialties: string[];
  features: Array<{ name: string; included: boolean }>;
}

interface MembershipClientProps {
  gymPlans: PublicPlanItem[];
  ptPlans: PublicPlanItem[];
  faqs: Array<{ id: string; question: string; answer: string }>;
  whatsappUrl: string;
  trialDays: number;
  checkoutMode: "ENQUIRY" | "RAZORPAY";
}

export default function MembershipClient({
  gymPlans,
  ptPlans,
  faqs,
  whatsappUrl,
  trialDays,
  checkoutMode,
}: MembershipClientProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<string>("");

  function handleSelectPlan(planTitle: string) {
    setSelectedPlan(planTitle);
    const el = document.getElementById("join-enquiry");
    el?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div className="min-h-screen bg-[var(--background)] transition-colors duration-300">
      <PageHero
        eyebrow="Membership Plans"
        title={
          <>
            Choose the Perfect <span className="text-gradient-gold">Plan</span>
          </>
        }
        description="Choose the perfect membership plan that fits your fitness goals and budget."
        imageSrc="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&q=80"
        stats={[
          {
            value: gymPlans[0] ? formatINR(gymPlans[0].price) : "₹2,000",
            label: "Starts At",
          },
          { value: String(gymPlans.length || 4), label: "Memberships" },
          { value: `${trialDays}-Day`, label: "Trial" },
          { value: "PT", label: "Add-ons" },
        ]}
      />

      {/* Membership Plans */}
      <section className="container-custom px-4 md:px-8 pb-20">
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {gymPlans.map((plan) => (
            <StaggerItem key={plan.id}>
              <motion.div
                whileHover={{ y: -10 }}
                className={`relative h-full ${plan.isPopular ? "lg:-mt-4 lg:mb-4" : ""}`}
              >
                {plan.isPopular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                    <div className="bg-[var(--secondary)] text-[var(--secondary-foreground)] px-4 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                      <HiStar className="w-4 h-4" />
                      Best Value
                    </div>
                  </div>
                )}

                <div
                  className={`h-full p-6 rounded-3xl border transition-all duration-300 flex flex-col ${
                    plan.isPopular
                      ? "bg-gradient-to-b from-[var(--primary)]/10 to-[var(--card)] border-[var(--primary)]/50 hover:border-[var(--primary)] shadow-lg"
                      : "bg-[var(--card)] border-[var(--border)] hover:border-[var(--primary)]/30"
                  }`}
                >
                  <h3
                    className={`font-display text-2xl tracking-wide mb-2 ${
                      plan.isPopular ? "text-[var(--primary)]" : "text-[var(--foreground)]"
                    }`}
                  >
                    {plan.name}
                  </h3>

                  <div className="mb-6">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold text-[var(--foreground)] tabular-nums">
                        {formatINR(plan.price)}
                      </span>
                      <span className="text-[var(--muted-foreground)]">/{plan.periodLabel}</span>
                    </div>
                  </div>

                  <ul className="space-y-2 mb-6 flex-1">
                    {plan.features.map((feature) => (
                      <li key={feature.name} className="flex items-start gap-2">
                        {feature.included ? (
                          <HiCheck className="w-4 h-4 flex-shrink-0 mt-0.5 text-[var(--primary)]" />
                        ) : (
                          <HiX className="w-4 h-4 flex-shrink-0 mt-0.5 text-[var(--muted-foreground)]/50" />
                        )}
                        <span
                          className={
                            feature.included
                              ? "text-[var(--muted-foreground)] text-sm"
                              : "text-[var(--muted-foreground)]/50 text-sm"
                          }
                        >
                          {feature.name}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <div className="space-y-2 mt-auto">
                    <button
                      type="button"
                      onClick={() =>
                        handleSelectPlan(`${plan.name} Plan (${formatINR(plan.price)})`)
                      }
                      className={`w-full py-3 rounded-xl font-bold transition-all duration-300 ${
                        plan.isPopular
                          ? "btn-primary"
                          : "border border-[var(--border)] text-[var(--foreground)] hover:border-[var(--primary)] hover:text-[var(--primary)]"
                      }`}
                    >
                      {checkoutMode === "RAZORPAY" ? "Get Started" : "Enquire Now"}
                    </button>
                    <a
                      href={`${whatsappUrl}?text=${encodeURIComponent(`Hi, I'm interested in the ${plan.name} plan at ${formatINR(plan.price)}/${plan.periodLabel}.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-center text-xs text-[var(--muted-foreground)] hover:text-[var(--primary)] py-1"
                    >
                      Ask on WhatsApp
                    </a>
                  </div>
                </div>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* Personal Training Plans */}
      {ptPlans.length > 0 && (
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
            {ptPlans.map((plan) => (
              <StaggerItem key={plan.id}>
                <motion.div
                  whileHover={{ y: -10 }}
                  className={`relative h-full ${plan.isPopular ? "lg:-mt-4 lg:mb-4" : ""}`}
                >
                  {plan.isPopular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                      <div className="bg-[var(--secondary)] text-[var(--secondary-foreground)] px-4 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                        <HiStar className="w-4 h-4" />
                        Most Popular
                      </div>
                    </div>
                  )}

                  <div
                    className={`h-full p-8 rounded-3xl border transition-all duration-300 flex flex-col ${
                      plan.isPopular
                        ? "bg-gradient-to-b from-[var(--secondary)]/10 to-[var(--card)] border-[var(--secondary)]/50 hover:border-[var(--secondary)]"
                        : "bg-[var(--card)] border-[var(--border)] hover:border-[var(--primary)]/30"
                    }`}
                  >
                    <h3
                      className={`font-display text-2xl tracking-wide mb-4 ${
                        plan.isPopular ? "text-[var(--secondary)]" : "text-[var(--foreground)]"
                      }`}
                    >
                      {plan.name}
                    </h3>

                    <div className="space-y-2 mb-6">
                      <div className="flex justify-between items-center bg-[var(--muted)]/50 rounded-lg px-4 py-2">
                        <span className="text-[var(--muted-foreground)] text-sm">12 sessions</span>
                        <span className="text-[var(--foreground)] font-bold tabular-nums">
                          {formatINR(plan.price)}/month
                        </span>
                      </div>
                      {plan.secondaryPrice && (
                        <div className="flex justify-between items-center bg-[var(--muted)]/50 rounded-lg px-4 py-2">
                          <span className="text-[var(--muted-foreground)] text-sm">24 sessions</span>
                          <span className="text-[var(--foreground)] font-bold tabular-nums">
                            {formatINR(plan.secondaryPrice)}/month
                          </span>
                        </div>
                      )}
                    </div>

                    {plan.specialties.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {plan.specialties.map((spec) => (
                          <span
                            key={spec}
                            className="text-xs px-3 py-1 bg-[var(--secondary)]/10 border border-[var(--secondary)]/30 rounded-full text-[var(--secondary)]"
                          >
                            {spec}
                          </span>
                        ))}
                      </div>
                    )}

                    <ul className="space-y-2 mb-6 flex-1">
                      {plan.features.map((feature) => (
                        <li key={feature.name} className="flex items-start gap-2">
                          <HiCheck className="w-4 h-4 flex-shrink-0 mt-0.5 text-[var(--primary)]" />
                          <span className="text-[var(--muted-foreground)] text-sm">
                            {feature.name}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <button
                      type="button"
                      onClick={() => handleSelectPlan(`${plan.name} (Personal Training)`)}
                      className={`w-full py-4 rounded-xl font-bold transition-all duration-300 ${
                        plan.isPopular
                          ? "bg-[var(--secondary)] text-[var(--secondary-foreground)] hover:bg-[var(--secondary)]/90"
                          : "border border-[var(--border)] text-[var(--foreground)] hover:border-[var(--primary)] hover:text-[var(--primary)]"
                      }`}
                    >
                      Enquire Now
                    </button>
                  </div>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </section>
      )}

      {/* Join Enquiry Form */}
      <section id="join-enquiry" className="container-custom px-4 md:px-8 pb-20">
        <div className="max-w-3xl mx-auto">
          <LeadCaptureForm
            key={selectedPlan || "default"}
            source="membership"
            defaultInterest={selectedPlan || "7-Day Free Trial"}
            title={selectedPlan ? `Enquire about ${selectedPlan}` : "Start Your Membership"}
            submitLabel="Request membership callback"
          />
        </div>
      </section>

      {/* FAQ Section */}
      {faqs.length > 0 && (
        <section className="container-custom px-4 md:px-8 pb-20">
          <FadeUp className="text-center mb-12">
            <h2 className="heading-md text-[var(--foreground)]">
              Frequently Asked <span className="text-[var(--primary)]">Questions</span>
            </h2>
          </FadeUp>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <FadeUp key={faq.id} delay={index * 0.08}>
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
      )}

      {/* Bottom CTA */}
      <section className="container-custom px-4 md:px-8 pb-20">
        <FadeUp>
          <div className="bg-gradient-to-r from-[var(--primary)]/10 to-[var(--secondary)]/10 border border-[var(--border)] rounded-3xl p-8 md:p-12 text-center">
            <h3 className="heading-md text-[var(--foreground)] mb-4">
              Your Transformation Starts Today
            </h3>
            <p className="text-[var(--muted-foreground)] max-w-2xl mx-auto mb-6">
              Join thousands who&apos;ve already achieved their fitness goals with Rafithub.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/contact"
                className="btn-primary inline-flex items-center justify-center transition-transform hover:scale-105 active:scale-95"
              >
                Start Your Journey
              </Link>
              <Link
                href="/trainers"
                className="btn-outline inline-flex items-center justify-center transition-transform hover:scale-105 active:scale-95"
              >
                Meet Our Trainers
              </Link>
            </div>
          </div>
        </FadeUp>
      </section>
    </div>
  );
}
