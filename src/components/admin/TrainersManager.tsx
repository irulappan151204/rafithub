"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { deleteTrainerAction, upsertTrainerAction } from "@/server/actions/admin-cms";
import { ImageUploader } from "./ImageUploader";

interface TrainerRecord {
  id: string;
  slug: string;
  name: string;
  role: string;
  title: string;
  bio: string;
  experienceYears: number;
  experienceLabel: string | null;
  photoUrl: string;
  photoKey: string | null;
  accentColor: string | null;
  specialties: string[];
  certifications: string[];
  achievements: string[];
  isFeatured: boolean;
  isActive: boolean;
  sortOrder: number;
}

export function TrainersManager({ trainers }: { trainers: TrainerRecord[] }) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    slug: "",
    name: "",
    role: "",
    title: "",
    bio: "",
    experienceYears: 5,
    photoUrl: "/trainers/1.webp",
    photoKey: "",
    specialtiesText: "",
    certificationsText: "",
    achievementsText: "",
    isFeatured: false,
    sortOrder: trainers.length + 1,
  });

  function startEdit(t: TrainerRecord) {
    setEditingId(t.id);
    setForm({
      slug: t.slug,
      name: t.name,
      role: t.role,
      title: t.title,
      bio: t.bio,
      experienceYears: t.experienceYears,
      photoUrl: t.photoUrl,
      photoKey: t.photoKey ?? "",
      specialtiesText: t.specialties.join("\n"),
      certificationsText: t.certifications.join("\n"),
      achievementsText: t.achievements.join("\n"),
      isFeatured: t.isFeatured,
      sortOrder: t.sortOrder,
    });
  }

  function resetForm() {
    setEditingId(null);
    setForm({
      slug: "",
      name: "",
      role: "",
      title: "",
      bio: "",
      experienceYears: 5,
      photoUrl: "/trainers/1.webp",
      photoKey: "",
      specialtiesText: "",
      certificationsText: "",
      achievementsText: "",
      isFeatured: false,
      sortOrder: trainers.length + 1,
    });
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setStatus(null);
    try {
      await upsertTrainerAction({
        id: editingId ?? undefined,
        slug: form.slug,
        name: form.name,
        role: form.role,
        title: form.title,
        bio: form.bio,
        experienceYears: form.experienceYears,
        photoUrl: form.photoUrl,
        photoKey: form.photoKey,
        specialties: form.specialtiesText
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean),
        certifications: form.certificationsText
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean),
        achievements: form.achievementsText
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean),
        isFeatured: form.isFeatured,
        isActive: true,
        sortOrder: form.sortOrder,
      });
      setStatus(editingId ? "Trainer updated." : "Trainer added.");
      resetForm();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save trainer.");
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
          <h2 className="text-lg font-bold">{editingId ? "Edit Trainer" : "Add Trainer"}</h2>
          {editingId && (
            <button type="button" onClick={resetForm} className="text-xs underline">
              Cancel edit
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Full Name (e.g. Dr. Ranjith)"
            className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm"
            required
          />
          <input
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value.toLowerCase() })}
            placeholder="URL Slug (e.g. rajith)"
            className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm"
            required
          />
          <input
            type="number"
            min={0}
            value={form.experienceYears}
            onChange={(e) => setForm({ ...form, experienceYears: Number(e.target.value) })}
            placeholder="Years experience"
            className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm"
            required
          />
          <input
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            placeholder="Role (e.g. Founder & Head Coach)"
            className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm"
            required
          />
          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Title (e.g. Mr. India Champion)"
            className="md:col-span-2 rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm"
            required
          />
        </div>

        <textarea
          rows={3}
          value={form.bio}
          onChange={(e) => setForm({ ...form, bio: e.target.value })}
          placeholder="Trainer biography"
          className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm"
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <textarea
            rows={3}
            value={form.specialtiesText}
            onChange={(e) => setForm({ ...form, specialtiesText: e.target.value })}
            placeholder="Specialties (one per line)"
            className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-xs"
          />
          <textarea
            rows={3}
            value={form.certificationsText}
            onChange={(e) => setForm({ ...form, certificationsText: e.target.value })}
            placeholder="Certifications (one per line)"
            className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-xs"
          />
          <textarea
            rows={3}
            value={form.achievementsText}
            onChange={(e) => setForm({ ...form, achievementsText: e.target.value })}
            placeholder="Achievements (one per line)"
            className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-xs"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <ImageUploader
            folder="trainers"
            currentUrl={form.photoUrl}
            label="Upload trainer photo"
            onUploaded={({ url, key }) =>
              setForm((prev) => ({ ...prev, photoUrl: url, photoKey: key }))
            }
          />
          <div className="flex items-center gap-4">
            <label className="inline-flex items-center gap-2 text-xs font-medium">
              <input
                type="checkbox"
                checked={form.isFeatured}
                onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
              />
              Featured Coach
            </label>
            <button type="submit" className="btn-primary px-5 py-2.5 text-xs">
              {editingId ? "Save changes" : "Add trainer"}
            </button>
          </div>
        </div>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {trainers.map((t) => (
          <div
            key={t.id}
            className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 flex flex-col gap-3"
          >
            <div className="flex items-center gap-3">
              <div className="relative h-14 w-14 overflow-hidden rounded-xl border border-[var(--border)] shrink-0">
                <Image src={t.photoUrl} alt={t.name} fill sizes="56px" className="object-cover" />
              </div>
              <div className="min-w-0">
                <p className="font-bold truncate">{t.name}</p>
                <p className="text-xs text-[var(--primary)] truncate">{t.role}</p>
                <p className="text-[11px] text-[var(--muted-foreground)]">/trainers/{t.slug}</p>
              </div>
            </div>
            <p className="text-xs text-[var(--muted-foreground)] line-clamp-2">{t.bio}</p>
            <div className="mt-auto flex justify-between pt-2 border-t border-[var(--border)] text-xs">
              <button
                type="button"
                onClick={() => startEdit(t)}
                className="text-[var(--primary)] font-semibold hover:underline"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={async () => {
                  await deleteTrainerAction(t.id);
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
