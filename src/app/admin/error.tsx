"use client";

import Link from "next/link";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="rounded-2xl border border-red-500/30 bg-[var(--card)] p-8 text-center space-y-4 max-w-lg mx-auto my-12">
      <h1 className="text-xl font-bold">Admin View Error</h1>
      <p className="text-xs text-[var(--muted-foreground)]">
        {error.message || "Could not load this admin section."}
      </p>
      <div className="flex justify-center gap-3">
        <button type="button" onClick={reset} className="btn-primary px-4 py-2 text-xs">
          Retry
        </button>
        <Link href="/admin" className="btn-outline px-4 py-2 text-xs">
          Dashboard
        </Link>
      </div>
    </div>
  );
}
