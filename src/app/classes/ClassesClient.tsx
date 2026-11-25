"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FadeUp, StaggerContainer, StaggerItem } from "@/components/ScrollAnimations";
import PageHero from "@/components/PageHero";
import { HiLightningBolt, HiHeart, HiFire, HiShieldCheck } from "react-icons/hi";

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export interface PublicClassItem {
  id: string;
  name: string;
  category: string;
  description: string;
  intensity: string;
  durationMin: number;
  trainerName: string | null;
  schedules: Array<{ id: string; dayOfWeek: number; startTime: string; endTime: string }>;
}

const ICONS = [HiLightningBolt, HiFire, HiShieldCheck, HiHeart];

export default function ClassesClient({ classes }: { classes: PublicClassItem[] }) {
  return (
    <div className="min-h-screen bg-[var(--background)] transition-colors duration-300">
      <PageHero
        eyebrow="Our Programs"
        title={
          <>
            World-Class <span className="text-gradient-gold">Workouts</span>
          </>
        }
        description="Discover a variety of training styles designed to help you achieve specific fitness goals, from building muscle to improving endurance."
        imageSrc="https://images.unsplash.com/photo-1517963879433-6ad2b056d712?w=1920&q=80"
        stats={[
          { value: String(classes.length), label: "Programs" },
          { value: "100+", label: "Weekly Classes" },
          { value: "All", label: "Levels" },
          { value: "45m", label: "Avg Block" },
        ]}
      />

      <section className="container-custom px-4 md:px-8 pb-20">
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((program, idx) => {
            const Icon = ICONS[idx % ICONS.length];
            return (
              <StaggerItem key={program.id}>
                <motion.div
                  whileHover={{ y: -5 }}
                  className="h-full p-8 rounded-2xl border border-[var(--border)] bg-[var(--card)]/90 backdrop-blur-sm transition-all duration-300 hover:border-[var(--primary)]/50 hover:shadow-lg flex flex-col"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="p-3 rounded-xl bg-[var(--primary)]/10 text-[var(--primary)]">
                      <Icon className="w-8 h-8" />
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border border-[var(--primary)]/30 text-[var(--primary)]">
                      {program.intensity}
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold text-[var(--foreground)] mb-2">
                    {program.name}
                  </h3>
                  <div className="text-sm font-medium text-[var(--muted-foreground)] uppercase tracking-wider mb-3">
                    Focus: <span className="text-[var(--secondary)]">{program.category}</span>
                  </div>

                  <p className="text-[var(--muted-foreground)] leading-relaxed mb-4 flex-1">
                    {program.description}
                  </p>

                  {program.trainerName && (
                    <p className="text-xs text-[var(--muted-foreground)] mb-3">
                      Coach: <span className="font-semibold text-[var(--foreground)]">{program.trainerName}</span>
                    </p>
                  )}

                  {program.schedules.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-3 border-t border-[var(--border)]">
                      {program.schedules.map((sch) => (
                        <span
                          key={sch.id}
                          className="rounded-md bg-[var(--muted)] px-2 py-0.5 text-[11px] font-medium text-[var(--foreground)]"
                        >
                          {DAY_NAMES[sch.dayOfWeek]} {sch.startTime}
                        </span>
                      ))}
                    </div>
                  )}
                </motion.div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </section>

      <section className="py-20 px-4 md:px-8">
        <div className="container-custom">
          <FadeUp>
            <div className="rounded-3xl p-12 text-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-[var(--primary)] via-gym-gold to-[var(--primary)] opacity-10 group-hover:opacity-20 transition-opacity duration-500" />
              <div className="absolute inset-0 bg-black/40" />

              <div className="relative z-10">
                <h2 className="heading-md text-white mb-6">Ready to Start Your Journey?</h2>
                <p className="text-gray-100 max-w-2xl mx-auto mb-8 text-lg">
                  Join Rafithub today and get unlimited access to all our specialized workout
                  programs.
                </p>
                <Link
                  href="/contact"
                  className="inline-block btn-primary shadow-xl shadow-[var(--primary)]/20"
                >
                  Start Free Trial
                </Link>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>
    </div>
  );
}
