"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  createGalleryItemAction,
  deleteFaqAction,
  deleteGalleryItemAction,
  deleteTestimonialAction,
  updateSiteSettingsAction,
  upsertFaqAction,
  upsertTestimonialAction,
} from "@/server/actions/admin-cms";
import { ImageUploader } from "./ImageUploader";

interface CmsEditorProps {
  settings: {
    gymName: string;
    tagline: string;
    description: string;
    address: string;
    landmark: string | null;
    phone: string;
    phoneDisplay: string;
    email: string;
    whatsappUrl: string;
    mapUrl: string;
    mapEmbedUrl: string;
    heroEyebrow: string;
    heroTitle: string;
    heroSubtitle: string;
    heroImageUrl: string | null;
    heroImageKey: string | null;
    trialDays: number;
    checkoutMode: "ENQUIRY" | "RAZORPAY";
    workingHours: Array<{ days: string; hours: string }>;
    socialLinks: Array<{ platform: string; href: string; label: string; color?: string }>;
    stats: Array<{ number: string; value: number; suffix: string; label: string }>;
  };
  galleryItems: Array<{
    id: string;
    imageUrl: string;
    caption: string;
    category: string;
    size: string;
  }>;
  testimonials: Array<{
    id: string;
    name: string;
    result: string;
    quote: string;
    photoUrl: string | null;
    rating: number;
    isApproved: boolean;
  }>;
  faqs: Array<{
    id: string;
    question: string;
    answer: string;
    category: string;
    sortOrder: number;
  }>;
}

export function CmsEditor({ settings, galleryItems, testimonials, faqs }: CmsEditorProps) {
  const router = useRouter();
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Site settings form state
  const [form, setForm] = useState({
    gymName: settings.gymName,
    tagline: settings.tagline,
    description: settings.description,
    address: settings.address,
    landmark: settings.landmark ?? "",
    phone: settings.phone,
    phoneDisplay: settings.phoneDisplay,
    email: settings.email,
    whatsappUrl: settings.whatsappUrl,
    mapUrl: settings.mapUrl,
    mapEmbedUrl: settings.mapEmbedUrl,
    heroEyebrow: settings.heroEyebrow,
    heroTitle: settings.heroTitle,
    heroSubtitle: settings.heroSubtitle,
    heroImageUrl: settings.heroImageUrl ?? "",
    heroImageKey: settings.heroImageKey ?? "",
    trialDays: settings.trialDays,
    checkoutMode: settings.checkoutMode,
    workingHours: settings.workingHours,
    socialLinks: settings.socialLinks,
    stats: settings.stats,
  });

  // Gallery add state
  const [galleryForm, setGalleryForm] = useState({
    imageUrl: "",
    imageKey: "",
    caption: "",
    category: "Facility",
    size: "small" as "small" | "large" | "tall",
  });

  // Testimonial add state
  const [testimonialForm, setTestimonialForm] = useState({
    name: "",
    result: "",
    quote: "",
    photoUrl: "",
    photoKey: "",
    rating: 5,
  });

  // FAQ add state
  const [faqForm, setFaqForm] = useState({
    question: "",
    answer: "",
    category: "General",
    sortOrder: faqs.length + 1,
  });

  async function handleSaveSettings(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setErrorMessage(null);
    setStatusMessage(null);
    try {
      await updateSiteSettingsAction(form);
      setStatusMessage("Changes saved and published to the public website.");
      router.refresh();
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Could not save settings.");
    } finally {
      setSaving(false);
    }
  }

  async function handleAddGallery(event: FormEvent) {
    event.preventDefault();
    setErrorMessage(null);
    try {
      await createGalleryItemAction({ ...galleryForm, isActive: true, sortOrder: galleryItems.length });
      setGalleryForm({ imageUrl: "", imageKey: "", caption: "", category: "Facility", size: "small" });
      setStatusMessage("Gallery photo added.");
      router.refresh();
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Could not add gallery item.");
    }
  }

  async function handleAddTestimonial(event: FormEvent) {
    event.preventDefault();
    setErrorMessage(null);
    try {
      await upsertTestimonialAction({
        ...testimonialForm,
        isApproved: true,
        sortOrder: testimonials.length,
      });
      setTestimonialForm({ name: "", result: "", quote: "", photoUrl: "", photoKey: "", rating: 5 });
      setStatusMessage("Testimonial added.");
      router.refresh();
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Could not save testimonial.");
    }
  }

  async function handleAddFaq(event: FormEvent) {
    event.preventDefault();
    setErrorMessage(null);
    try {
      await upsertFaqAction({ ...faqForm, isActive: true });
      setFaqForm({ question: "", answer: "", category: "General", sortOrder: faqs.length + 2 });
      setStatusMessage("FAQ added.");
      router.refresh();
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Could not save FAQ.");
    }
  }

  return (
    <div className="space-y-10">
      {statusMessage && (
        <div
          role="status"
          className="rounded-xl border border-[var(--primary)]/30 bg-[var(--primary)]/10 px-4 py-3 text-sm text-[var(--primary)]"
        >
          {statusMessage}
        </div>
      )}
      {errorMessage && (
        <div
          role="alert"
          className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400"
        >
          {errorMessage}
        </div>
      )}

      {/* 1. General, Hero, Contact, Hours & Stats */}
      <form
        onSubmit={handleSaveSettings}
        className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 space-y-6"
      >
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border)] pb-4">
          <div>
            <h2 className="text-lg font-bold">Site Settings, Hero, Hours &amp; Contact</h2>
            <p className="text-xs text-[var(--muted-foreground)]">
              Updating here immediately revalidates the public pages and structured data.
            </p>
          </div>
          <button type="submit" disabled={saving} className="btn-primary px-5 py-2.5 text-xs">
            {saving ? "Saving..." : "Save changes"}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium mb-1">Gym Name</label>
            <input
              value={form.gymName}
              onChange={(e) => setForm({ ...form, gymName: e.target.value })}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Tagline</label>
            <input
              value={form.tagline}
              onChange={(e) => setForm({ ...form, tagline: e.target.value })}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm"
              required
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-medium mb-1">About / Description</label>
            <textarea
              rows={2}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium mb-1">Phone (raw, e.g. +917603903131)</label>
            <input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Phone Display</label>
            <input
              value={form.phoneDisplay}
              onChange={(e) => setForm({ ...form, phoneDisplay: e.target.value })}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Contact Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">WhatsApp Link</label>
            <input
              type="url"
              value={form.whatsappUrl}
              onChange={(e) => setForm({ ...form, whatsappUrl: e.target.value })}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Address</label>
            <input
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Landmark</label>
            <input
              value={form.landmark}
              onChange={(e) => setForm({ ...form, landmark: e.target.value })}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Free Trial Days</label>
            <input
              type="number"
              min={1}
              max={30}
              value={form.trialDays}
              onChange={(e) => setForm({ ...form, trialDays: Number(e.target.value) })}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Membership Page Mode</label>
            <select
              value={form.checkoutMode}
              onChange={(e) =>
                setForm({ ...form, checkoutMode: e.target.value as "ENQUIRY" | "RAZORPAY" })
              }
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm"
            >
              <option value="ENQUIRY">Enquiry / Join Form</option>
              <option value="RAZORPAY">Razorpay Online Checkout</option>
            </select>
          </div>
        </div>

        {/* Hero Section */}
        <div className="border-t border-[var(--border)] pt-5 space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--primary)]">
            Hero Section
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium mb-1">Hero Eyebrow</label>
              <input
                value={form.heroEyebrow}
                onChange={(e) => setForm({ ...form, heroEyebrow: e.target.value })}
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Hero Title</label>
              <input
                value={form.heroTitle}
                onChange={(e) => setForm({ ...form, heroTitle: e.target.value })}
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium mb-1">Hero Subtitle</label>
              <textarea
                rows={2}
                value={form.heroSubtitle}
                onChange={(e) => setForm({ ...form, heroSubtitle: e.target.value })}
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm"
              />
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="block text-xs font-medium">Hero Image (Neon Object Storage)</label>
              <ImageUploader
                folder="hero"
                currentUrl={form.heroImageUrl}
                label="Upload hero image"
                onUploaded={({ url, key }) =>
                  setForm((prev) => ({ ...prev, heroImageUrl: url, heroImageKey: key }))
                }
              />
              <input
                value={form.heroImageUrl}
                onChange={(e) => setForm({ ...form, heroImageUrl: e.target.value })}
                placeholder="/assets/hero/hero-desktop-lg.webp"
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-xs"
              />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="border-t border-[var(--border)] pt-5 space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--primary)]">
            Homepage &amp; Hero Stats
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {form.stats.map((stat, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-3 space-y-2"
              >
                <input
                  value={stat.number}
                  onChange={(e) => {
                    const next = [...form.stats];
                    next[idx] = { ...stat, number: e.target.value };
                    setForm({ ...form, stats: next });
                  }}
                  placeholder="10K+"
                  className="w-full rounded-lg border border-[var(--border)] bg-[var(--card)] px-2.5 py-1.5 text-sm font-bold"
                />
                <input
                  value={stat.label}
                  onChange={(e) => {
                    const next = [...form.stats];
                    next[idx] = { ...stat, label: e.target.value };
                    setForm({ ...form, stats: next });
                  }}
                  placeholder="Happy Members"
                  className="w-full rounded-lg border border-[var(--border)] bg-[var(--card)] px-2.5 py-1.5 text-xs"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Working Hours */}
        <div className="border-t border-[var(--border)] pt-5 space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--primary)]">
            Working Hours
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {form.workingHours.map((item, idx) => (
              <div
                key={idx}
                className="grid grid-cols-2 gap-2 rounded-xl border border-[var(--border)] bg-[var(--background)] p-3"
              >
                <input
                  value={item.days}
                  onChange={(e) => {
                    const next = [...form.workingHours];
                    next[idx] = { ...item, days: e.target.value };
                    setForm({ ...form, workingHours: next });
                  }}
                  className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-2.5 py-1.5 text-xs"
                />
                <input
                  value={item.hours}
                  onChange={(e) => {
                    const next = [...form.workingHours];
                    next[idx] = { ...item, hours: e.target.value };
                    setForm({ ...form, workingHours: next });
                  }}
                  className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-2.5 py-1.5 text-xs"
                />
              </div>
            ))}
          </div>
        </div>
      </form>

      {/* 2. Gallery Manager (Neon Object Storage) */}
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 space-y-5">
        <h2 className="text-lg font-bold">Gallery Photos (Neon Object Storage)</h2>
        <form onSubmit={handleAddGallery} className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
          <div className="md:col-span-2 space-y-2">
            <ImageUploader
              folder="gallery"
              currentUrl={galleryForm.imageUrl}
              label="Upload gallery photo"
              onUploaded={({ url, key }) =>
                setGalleryForm((prev) => ({ ...prev, imageUrl: url, imageKey: key }))
              }
            />
            <input
              value={galleryForm.imageUrl}
              onChange={(e) => setGalleryForm({ ...galleryForm, imageUrl: e.target.value })}
              placeholder="Or paste image URL"
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-xs"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Caption</label>
            <input
              value={galleryForm.caption}
              onChange={(e) => setGalleryForm({ ...galleryForm, caption: e.target.value })}
              placeholder="Strength floor"
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm"
              required
            />
          </div>
          <div className="flex gap-2">
            <select
              value={galleryForm.category}
              onChange={(e) => setGalleryForm({ ...galleryForm, category: e.target.value })}
              className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-xs"
            >
              <option value="Facility">Facility</option>
              <option value="Classes">Classes</option>
              <option value="Training">Training</option>
            </select>
            <button type="submit" className="btn-primary px-4 py-2 text-xs shrink-0">
              Add photo
            </button>
          </div>
        </form>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {galleryItems.map((item) => (
            <div
              key={item.id}
              className="rounded-xl border border-[var(--border)] bg-[var(--background)] overflow-hidden"
            >
              <div className="relative aspect-square">
                <Image
                  src={item.imageUrl}
                  alt={item.caption}
                  fill
                  sizes="200px"
                  className="object-cover"
                />
              </div>
              <div className="p-2.5 flex items-center justify-between gap-2 text-xs">
                <span className="truncate font-medium">{item.caption}</span>
                <button
                  type="button"
                  onClick={async () => {
                    await deleteGalleryItemAction(item.id);
                    router.refresh();
                  }}
                  className="text-red-400 hover:underline shrink-0"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Testimonials Manager */}
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 space-y-5">
        <h2 className="text-lg font-bold">Member Testimonials</h2>
        <form onSubmit={handleAddTestimonial} className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input
            value={testimonialForm.name}
            onChange={(e) => setTestimonialForm({ ...testimonialForm, name: e.target.value })}
            placeholder="Member name"
            className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm"
            required
          />
          <input
            value={testimonialForm.result}
            onChange={(e) => setTestimonialForm({ ...testimonialForm, result: e.target.value })}
            placeholder="Result (e.g. Lost 12 kg in 4 months)"
            className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm"
            required
          />
          <ImageUploader
            folder="members"
            currentUrl={testimonialForm.photoUrl}
            label="Upload member photo (optional)"
            onUploaded={({ url, key }) =>
              setTestimonialForm((prev) => ({ ...prev, photoUrl: url, photoKey: key }))
            }
          />
          <textarea
            rows={2}
            value={testimonialForm.quote}
            onChange={(e) => setTestimonialForm({ ...testimonialForm, quote: e.target.value })}
            placeholder="Real member quote..."
            className="md:col-span-2 rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm"
            required
          />
          <button type="submit" className="btn-primary px-4 py-2 text-xs h-fit self-end">
            Add testimonial
          </button>
        </form>

        <div className="divide-y divide-[var(--border)]">
          {testimonials.map((t) => (
            <div key={t.id} className="py-3 flex items-start justify-between gap-4 text-sm">
              <div>
                <p className="font-semibold">
                  {t.name}{" "}
                  <span className="text-xs font-normal text-[var(--primary)]">({t.result})</span>
                </p>
                <p className="text-xs text-[var(--muted-foreground)] mt-1">{t.quote}</p>
              </div>
              <button
                type="button"
                onClick={async () => {
                  await deleteTestimonialAction(t.id);
                  router.refresh();
                }}
                className="text-xs text-red-400 hover:underline shrink-0"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 4. FAQs Manager */}
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 space-y-5">
        <h2 className="text-lg font-bold">FAQs</h2>
        <form onSubmit={handleAddFaq} className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <input
            value={faqForm.question}
            onChange={(e) => setFaqForm({ ...faqForm, question: e.target.value })}
            placeholder="Question"
            className="md:col-span-2 rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm"
            required
          />
          <select
            value={faqForm.category}
            onChange={(e) => setFaqForm({ ...faqForm, category: e.target.value })}
            className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm"
          >
            <option value="General">General</option>
            <option value="Membership">Membership</option>
            <option value="Contact">Contact</option>
          </select>
          <button type="submit" className="btn-primary px-4 py-2 text-xs">
            Add FAQ
          </button>
          <textarea
            rows={2}
            value={faqForm.answer}
            onChange={(e) => setFaqForm({ ...faqForm, answer: e.target.value })}
            placeholder="Answer"
            className="md:col-span-4 rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm"
            required
          />
        </form>

        <div className="divide-y divide-[var(--border)]">
          {faqs.map((faq) => (
            <div key={faq.id} className="py-3 flex items-start justify-between gap-4 text-sm">
              <div>
                <p className="font-semibold">
                  {faq.question}{" "}
                  <span className="text-[11px] text-[var(--muted-foreground)]">
                    [{faq.category}]
                  </span>
                </p>
                <p className="text-xs text-[var(--muted-foreground)] mt-1">{faq.answer}</p>
              </div>
              <button
                type="button"
                onClick={async () => {
                  await deleteFaqAction(faq.id);
                  router.refresh();
                }}
                className="text-xs text-red-400 hover:underline shrink-0"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
