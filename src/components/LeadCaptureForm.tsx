"use client";

import { Suspense, useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";

interface LeadCaptureFormProps {
  source?: string;
  defaultInterest?: string;
  submitLabel?: string;
  title?: string;
  subtitle?: string;
  compact?: boolean;
}

function LeadCaptureFormInner({
  source = "website",
  defaultInterest = "",
  submitLabel = "Book free trial",
  title = "Book Your 7-Day Free Trial",
  subtitle = "Leave your details and our Madurai coaching team will call or message you shortly.",
  compact = false,
}: LeadCaptureFormProps) {
  const searchParams = useSearchParams();
  const bmiParam = searchParams.get("bmi");
  const caloriesParam = searchParams.get("calories");
  const goalParam = searchParams.get("goal");
  const calculatorPayload =
    bmiParam || caloriesParam || goalParam
      ? {
          bmi: bmiParam ? Number(bmiParam) : undefined,
          caloriesTarget: caloriesParam ? Number(caloriesParam) : undefined,
          goal: goalParam ?? undefined,
        }
      : undefined;

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [interest, setInterest] = useState(defaultInterest || "7-Day Free Trial");
  const [message, setMessage] = useState("");
  const [consentGiven, setConsentGiven] = useState(false);
  const [website, setWebsite] = useState(""); // honeypot
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          email,
          interest,
          message,
          source,
          consentGiven,
          website,
          calculator: calculatorPayload,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Could not submit your request.");
      }
      setSubmitted(true);
      setName("");
      setPhone("");
      setEmail("");
      setMessage("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not submit your request.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div
        role="status"
        className="rounded-2xl border border-[var(--primary)]/30 bg-[var(--primary)]/10 p-6 text-center space-y-3"
      >
        <h3 className="text-lg font-bold text-[var(--foreground)]">Enquiry received</h3>
        <p className="text-sm text-[var(--muted-foreground)]">
          Thank you! Our coaching desk in Kochadai will reach out on your phone or WhatsApp soon.
        </p>
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="btn-outline px-4 py-2 text-xs"
        >
          Send another enquiry
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={
        compact
          ? "space-y-3.5 text-left"
          : "card-glass p-6 md:p-8 bg-[var(--card)]/90 space-y-4 text-left"
      }
    >
      <div>
        <h3 className={compact ? "text-lg font-bold text-[var(--foreground)]" : "text-xl font-bold text-[var(--foreground)]"}>
          {title}
        </h3>
        <p className="mt-1 text-xs sm:text-sm text-[var(--muted-foreground)]">{subtitle}</p>
      </div>

      {/* Honeypot field */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        className="hidden"
        aria-hidden="true"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium mb-1">Full Name *</label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3.5 py-2.5 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1">Phone / WhatsApp *</label>
          <input
            required
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+91 98765 43210"
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3.5 py-2.5 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1">Email (optional)</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3.5 py-2.5 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1">Interested In</label>
          <select
            value={interest}
            onChange={(e) => setInterest(e.target.value)}
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3.5 py-2.5 text-sm"
          >
            <option value="7-Day Free Trial">7-Day Free Trial</option>
            <option value="Monthly Plan (₹2,000)">Monthly Plan (₹2,000)</option>
            <option value="3-Month Plan (₹5,500)">3-Month Plan (₹5,500)</option>
            <option value="6-Month Plan (₹7,500)">6-Month Plan (₹7,500)</option>
            <option value="Annual Plan (₹10,000)">Annual Plan (₹10,000)</option>
            <option value="Personal Training">Personal Training</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium mb-1">Fitness Goal / Message</label>
        <textarea
          rows={2}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Fat loss, strength gain, preferred timing..."
          className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3.5 py-2 text-sm"
        />
      </div>

      <label className="flex items-start gap-2.5 text-xs text-[var(--muted-foreground)] cursor-pointer">
        <input
          type="checkbox"
          required
          checked={consentGiven}
          onChange={(e) => setConsentGiven(e.target.checked)}
          className="mt-0.5"
        />
        <span>
          I consent to Rafithub contacting me by phone or WhatsApp regarding my fitness enquiry in
          accordance with the Privacy Policy.
        </span>
      </label>

      {error && (
        <p role="alert" className="text-xs text-red-400">
          {error}
        </p>
      )}

      <button type="submit" disabled={submitting} className="btn-primary w-full py-3 text-sm">
        {submitting ? "Sending..." : submitLabel}
      </button>
    </form>
  );
}

export function LeadCaptureForm(props: LeadCaptureFormProps) {
  return (
    <Suspense fallback={<div className="card-glass p-6 text-sm text-[var(--muted-foreground)]">Loading form...</div>}>
      <LeadCaptureFormInner {...props} />
    </Suspense>
  );
}
