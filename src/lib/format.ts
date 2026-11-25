const IST_TIMEZONE = "Asia/Kolkata";

/**
 * Formats an integer/number amount in Indian Rupees (e.g. "₹2,000").
 */
export function formatINR(amount: number): string {
  return `₹${Math.round(amount).toLocaleString("en-IN")}`;
}

/**
 * Formats a Date or ISO string in DD/MM/YYYY under Asia/Kolkata timezone.
 */
export function formatDateIN(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: IST_TIMEZONE,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(d);
}

/**
 * Returns the canonical site URL without trailing slash.
 */
export function getSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.rafithub.com";
  return raw.replace(/\/+$/, "");
}
