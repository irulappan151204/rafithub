"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  addClassScheduleAction,
  deleteClassScheduleAction,
  upsertGymClassAction,
} from "@/server/actions/admin-cms";

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

interface ClassesManagerProps {
  classes: Array<{
    id: string;
    slug: string;
    name: string;
    description: string;
    category: string;
    intensity: string;
    capacity: number;
    durationMin: number;
    trainerId: string | null;
    schedules: Array<{ id: string; dayOfWeek: number; startTime: string; endTime: string }>;
  }>;
  trainers: Array<{ id: string; name: string }>;
}

export function ClassesManager({ classes, trainers }: ClassesManagerProps) {
  const router = useRouter();
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    slug: "",
    name: "",
    description: "",
    category: "Strength",
    intensity: "All Levels",
    capacity: 20,
    durationMin: 45,
    trainerId: "",
  });

  const [scheduleInput, setScheduleInput] = useState<
    Record<string, { dayOfWeek: number; startTime: string; endTime: string }>
  >({});

  async function handleCreateClass(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setStatus(null);
    try {
      await upsertGymClassAction({
        ...form,
        trainerId: form.trainerId || null,
        isActive: true,
        sortOrder: classes.length + 1,
      });
      setForm({
        slug: "",
        name: "",
        description: "",
        category: "Strength",
        intensity: "All Levels",
        capacity: 20,
        durationMin: 45,
        trainerId: "",
      });
      setStatus("Class added.");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save class.");
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
        onSubmit={handleCreateClass}
        className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 space-y-4"
      >
        <h2 className="text-lg font-bold">Add Class / Program</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Class Name"
            className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm"
            required
          />
          <input
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value.toLowerCase() })}
            placeholder="Slug (e.g. hiit-burn)"
            className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm"
            required
          />
          <input
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            placeholder="Category (e.g. High Intensity)"
            className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm"
            required
          />
          <input
            value={form.intensity}
            onChange={(e) => setForm({ ...form, intensity: e.target.value })}
            placeholder="Intensity"
            className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm"
            required
          />
          <input
            type="number"
            min={10}
            value={form.durationMin}
            onChange={(e) => setForm({ ...form, durationMin: Number(e.target.value) })}
            placeholder="Duration (min)"
            className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm"
          />
          <select
            value={form.trainerId}
            onChange={(e) => setForm({ ...form, trainerId: e.target.value })}
            className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm"
          >
            <option value="">Unassigned trainer</option>
            {trainers.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>
        <textarea
          rows={2}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Class description"
          className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm"
          required
        />
        <button type="submit" className="btn-primary px-5 py-2.5 text-xs">
          Add class
        </button>
      </form>

      <div className="space-y-4">
        {classes.map((cls) => {
          const draft = scheduleInput[cls.id] ?? {
            dayOfWeek: 1,
            startTime: "06:00",
            endTime: "07:00",
          };
          return (
            <div
              key={cls.id}
              className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 space-y-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="font-bold text-base">{cls.name}</h3>
                  <p className="text-xs text-[var(--muted-foreground)]">
                    {cls.category} · {cls.intensity} · {cls.durationMin} min
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {cls.schedules.map((sch) => (
                  <span
                    key={sch.id}
                    className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--background)] px-3 py-1 text-xs"
                  >
                    <span>
                      {DAY_NAMES[sch.dayOfWeek]} {sch.startTime}–{sch.endTime}
                    </span>
                    <button
                      type="button"
                      onClick={async () => {
                        await deleteClassScheduleAction(sch.id);
                        router.refresh();
                      }}
                      className="text-red-400 hover:underline"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[var(--border)]">
                <select
                  value={draft.dayOfWeek}
                  onChange={(e) =>
                    setScheduleInput((prev) => ({
                      ...prev,
                      [cls.id]: { ...draft, dayOfWeek: Number(e.target.value) },
                    }))
                  }
                  className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-2.5 py-1.5 text-xs"
                >
                  {DAY_NAMES.map((d, idx) => (
                    <option key={d} value={idx}>
                      {d}
                    </option>
                  ))}
                </select>
                <input
                  type="time"
                  value={draft.startTime}
                  onChange={(e) =>
                    setScheduleInput((prev) => ({
                      ...prev,
                      [cls.id]: { ...draft, startTime: e.target.value },
                    }))
                  }
                  className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-2.5 py-1.5 text-xs"
                />
                <input
                  type="time"
                  value={draft.endTime}
                  onChange={(e) =>
                    setScheduleInput((prev) => ({
                      ...prev,
                      [cls.id]: { ...draft, endTime: e.target.value },
                    }))
                  }
                  className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-2.5 py-1.5 text-xs"
                />
                <button
                  type="button"
                  onClick={async () => {
                    await addClassScheduleAction({ classId: cls.id, ...draft });
                    router.refresh();
                  }}
                  className="btn-outline px-3 py-1.5 text-xs"
                >
                  Add slot
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
