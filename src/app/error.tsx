"use client";

import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="min-h-[60vh] flex flex-col items-center justify-center px-6 text-center space-y-4">
      <h1 className="font-display text-4xl tracking-wide">Something went wrong</h1>
      <p className="text-sm text-[var(--muted-foreground)] max-w-md">
        {error.message || "We hit an unexpected error loading this page."}
      </p>
      <div className="flex gap-3">
        <button type="button" onClick={reset} className="btn-primary px-5 py-2 text-xs">
          Try again
        </button>
        <Link href="/" className="btn-outline px-5 py-2 text-xs">
          Return home
        </Link>
      </div>
    </main>
  );
}
