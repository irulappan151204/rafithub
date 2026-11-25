"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function StickyMobileBar({ trialDays = 7 }: { trialDays?: number }) {
  const pathname = usePathname();

  if (pathname.startsWith("/admin") || pathname.startsWith("/login")) {
    return null;
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--border)] bg-[var(--glass)] px-3 py-2.5 backdrop-blur-xl lg:hidden">
      <div className="mx-auto flex max-w-md items-center gap-2.5">
        <Link
          href="/contact"
          className="flex-1 rounded-xl border border-[var(--border)] bg-[var(--card)] py-2.5 text-center text-xs font-bold text-[var(--foreground)]"
        >
          {trialDays}-Day Free Trial
        </Link>
        <Link
          href="/membership"
          className="btn-primary flex-1 py-2.5 text-center text-xs"
        >
          Join Now
        </Link>
      </div>
    </div>
  );
}
