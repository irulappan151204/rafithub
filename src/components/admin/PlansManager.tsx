"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { deletePlanAction, upsertPlanAction } from "@/server/actions/admin-cms";
import { formatINR } from "@/lib/format";

interface PlanItem {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: "GYM_MEMBERSHIP" | "PERSONAL_TRAINING";
  durationDays: number;
  periodLabel: string;
  price: number;
  secondaryPrice: number | null;
  ptSessionsIncluded: number;
  isPopular: boolean;
  showOnHome: boolean;
  sortOrder: number;
  features: Array<{ name: string; included: boolean }>;
}

export function PlansManager({ plans }: { plans: PlanItem[] }) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    slug: "",
    name: "",
    description: "",
    category: "GYM_MEMBERSHIP" as "GYM_MEMBERSHIP" | "PERSONAL_TRAINING",
    durationDays: 30,
    periodLabel: "month",
    price: 2000,
    secondaryPrice: "",
    ptSessionsIncluded: 0,
    isPopular: false,
    showOnHome: false,
    sortOrder: plans.length + 1,
    featuresText: "Full access to gym facilities",
  });

  function startEdit(p: PlanItem) {
    setEditingId(p.id);
    setForm({
      slug: p.slug,
      name: p.name,
      description: p.description,
      category: p.category,
      durationDays: p.durationDays,
      periodLabel: p.periodLabel,
      price: p.price,
      secondaryPrice: p.secondaryPrice ? String(p.secondaryPrice) : "",
      ptSessionsIncluded: p.ptSessionsIncluded,
      isPopular: p.isPopular,
      showOnHome: p.showOnHome,
      sortOrder: p.sortOrder,
      featuresText: p.features.map((f) => `${f.included ? "+" : "-"} ${f.name}`).join("\n"),
    });
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setStatus(null);
    try {
      const features = form.featuresText
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => {
          if (line.startsWith("-")) {
            return { name: line.slice(1).trim(), included: false };
          }
          return { name: line.replace(/^\+\s*/, ""), included: true };
        });

      await upsertPlanAction({
        id: editingId ?? undefined,
        slug: form.slug,
        name: form.name,
        description: form.description,
        category: form.category,
        durationDays: form.durationDays,
        periodLabel: form.periodLabel,
        price: form.price,
        secondaryPrice: form.secondaryPrice ? Number(form.secondaryPrice) : null,
        ptSessionsIncluded: form.ptSessionsIncluded,
        isPopular: form.isPopular,
        showOnHome: form.showOnHome,
        isActive: true,
        sortOrder: form.sortOrder,
        features,
      });

      setStatus(editingId ? "Plan updated." : "Plan created.");
      setEditingId(null);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save plan.");
    }
  }

  return (
    <div className="space-y-8">
      {status && (
        <div className="rounded-xl border border-[var(--primary)]/30 bg-[var(--primary)]/10 px-4 py-3 text-sm text-[var(--primary)]">
          {status}
        </div>
      )}
      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 space-y-4"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">{editingId ? "Edit Plan" : "Add Membership / PT Plan"}</h2>
          {editingId && (
            <button type="button" onClick={() => setEditingId(null)} className="text-xs underline">
              Cancel edit
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Plan Name (e.g. Quarterly)"
            className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm"
            required
          />
          <input
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value.toLowerCase() })}
            placeholder="Slug (e.g. 3-month)"
            className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm"
            required
          />
          <select
            value={form.category}
            onChange={(e) =>
              setForm({
                ...form,
                category: e.target.value as "GYM_MEMBERSHIP" | "PERSONAL_TRAINING",
              })
            }
            className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm"
          >
            <option value="GYM_MEMBERSHIP">Gym Membership</option>
            <option value="PERSONAL_TRAINING">Personal Training</option>
          </select>

          <input
            type="number"
            min={0}
            value={form.price}
            onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
            placeholder="Price (INR)"
            className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm"
            required
          />
          <input
            type="number"
            min={1}
            value={form.durationDays}
            onChange={(e) => setForm({ ...form, durationDays: Number(e.target.value) })}
            placeholder="Duration Days"
            className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm"
            required
          />
          <input
            value={form.periodLabel}
            onChange={(e) => setForm({ ...form, periodLabel: e.target.value })}
            placeholder="Period label (e.g. 3 months)"
            className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm"
            required
          />
        </div>

        <input
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Short description"
          className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm"
          required
        />

        <textarea
          rows={4}
          value={form.featuresText}
          onChange={(e) => setForm({ ...form, featuresText: e.target.value })}
          placeholder="Features (one per line; prefix with '-' for excluded)"
          className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-xs"
        />

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-4 text-xs font-medium">
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.isPopular}
                onChange={(e) => setForm({ ...form, isPopular: e.target.checked })}
              />
              Popular Badge
            </label>
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.showOnHome}
                onChange={(e) => setForm({ ...form, showOnHome: e.target.checked })}
              />
              Show on Home
            </label>
          </div>
          <button type="submit" className="btn-primary px-5 py-2.5 text-xs">
            {editingId ? "Save changes" : "Add plan"}
          </button>
        </div>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {plans.map((p) => (
          <div
            key={p.id}
            className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold">{p.name}</span>
              <span className="font-display text-2xl text-[var(--primary)] tabular-nums">
                {formatINR(p.price)}
              </span>
            </div>
            <p className="text-xs text-[var(--muted-foreground)]">
              {p.category} · {p.durationDays} days · /{p.periodLabel}
            </p>
            <p className="text-xs text-[var(--muted-foreground)]">{p.description}</p>
            <div className="flex justify-between pt-3 border-t border-[var(--border)] text-xs">
              <button
                type="button"
                onClick={() => startEdit(p)}
                className="text-[var(--primary)] font-semibold hover:underline"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={async () => {
                  await deletePlanAction(p.id);
                  router.refresh();
                }}
                className="text-red-400 hover:underline"
              >
                Deactivate
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
