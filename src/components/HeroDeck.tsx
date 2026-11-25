"use client";

import { HiCalculator, HiSparkles } from "react-icons/hi";
import FitnessCalculator from "./FitnessCalculator";
import { LeadCaptureForm } from "./LeadCaptureForm";

export type HeroDeckTab = "calculator" | "trial";

interface HeroDeckProps {
  activeTab: HeroDeckTab;
  onTabChange: (tab: HeroDeckTab) => void;
  trialDays?: number;
}

export function HeroDeck({ activeTab, onTabChange, trialDays = 7 }: HeroDeckProps) {
  return (
    <div id="hero-deck" className="w-full space-y-4">
      {/* Interactive Mode Switcher */}
      <div
        role="tablist"
        aria-label="Rafithub quick tools"
        className="grid grid-cols-2 gap-1.5 rounded-xl border border-[var(--border)] bg-[var(--surface-strong)] p-1"
      >
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "calculator"}
          onClick={() => onTabChange("calculator")}
          className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-bold transition-all ${
            activeTab === "calculator"
              ? "bg-[var(--primary)] text-[var(--primary-foreground)] shadow-sm"
              : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
          }`}
        >
          <HiCalculator className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span>Fitness Check</span>
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "trial"}
          onClick={() => onTabChange("trial")}
          className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-bold transition-all ${
            activeTab === "trial"
              ? "bg-[var(--primary)] text-[var(--primary-foreground)] shadow-sm"
              : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
          }`}
        >
          <HiSparkles className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{trialDays}-Day Free Trial</span>
        </button>
      </div>

      {/* Tab Body */}
      <div role="tabpanel">
        {activeTab === "calculator" ? (
          <FitnessCalculator />
        ) : (
          <LeadCaptureForm
            compact
            source="hero-trial-deck"
            defaultInterest={`${trialDays}-Day Free Trial`}
            title={`Claim Your ${trialDays}-Day Free Trial`}
            subtitle="Reserve your pass at Kochadai, Madurai. No upfront commitment."
            submitLabel={`Book ${trialDays}-Day Free Trial`}
          />
        )}
      </div>
    </div>
  );
}
