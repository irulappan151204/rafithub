"use client";

import { useState, type ChangeEvent } from "react";
import Image from "next/image";

interface ImageUploaderProps {
  folder: "hero" | "trainers" | "gallery" | "classes" | "members" | "seo";
  currentUrl?: string | null;
  label?: string;
  visibility?: "public" | "private";
  onUploaded: (result: { url: string; key: string; bucket: string }) => void;
}

export function ImageUploader({
  folder,
  currentUrl,
  label = "Upload image",
  visibility = "public",
  onUploaded,
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentUrl ?? null);

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);
      formData.append("visibility", visibility);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const payload = await res.json();
      if (!res.ok) {
        throw new Error(payload.error || "Image upload failed");
      }

      setPreviewUrl(payload.url);
      onUploaded(payload);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-3">
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2 text-xs font-semibold hover:border-[var(--primary)]">
          <span>{uploading ? "Uploading to Neon Storage..." : label}</span>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            onChange={handleFileChange}
            disabled={uploading}
            className="sr-only"
          />
        </label>
        {previewUrl && (
          <div className="relative h-12 w-16 overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--muted)]">
            <Image
              src={previewUrl}
              alt="Uploaded preview"
              fill
              sizes="64px"
              className="object-cover"
            />
          </div>
        )}
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
