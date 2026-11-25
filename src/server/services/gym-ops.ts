const MS_PER_DAY = 24 * 60 * 60 * 1000;

export function calculateMembershipEndDate(startDate: Date, durationDays: number): Date {
  return new Date(startDate.getTime() + durationDays * MS_PER_DAY);
}

/**
 * Extends from `currentEndDate` if still in the future, otherwise starts from `now`.
 */
export function calculateRenewalEndDate(
  currentEndDate: Date | null | undefined,
  durationDays: number,
  now = new Date()
): { startDate: Date; endDate: Date } {
  const base = currentEndDate && currentEndDate.getTime() > now.getTime() ? currentEndDate : now;
  return {
    startDate: base,
    endDate: calculateMembershipEndDate(base, durationDays),
  };
}

export function calculateFreezeExtensionDays(freezeStart: Date, freezeEnd: Date): number {
  const diff = freezeEnd.getTime() - freezeStart.getTime();
  if (diff <= 0) return 0;
  return Math.ceil(diff / MS_PER_DAY);
}

export function extendEndDateByDays(endDate: Date, days: number): Date {
  if (days <= 0) return endDate;
  return new Date(endDate.getTime() + days * MS_PER_DAY);
}

export function computeOutstandingDue(
  planPrice: number,
  discount: number,
  totalPaid: number
): number {
  const netPayable = Math.max(0, planPrice - Math.max(0, discount));
  return Math.max(0, netPayable - Math.max(0, totalPaid));
}

export function formatMemberCode(seq: number): string {
  return `RH-${String(Math.max(1, seq)).padStart(4, "0")}`;
}

export function formatReceiptNumber(date: Date, seq: number): string {
  const ist = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
  }).format(date);
  const ym = ist.replace("-", "");
  return `RH-${ym}-${String(Math.max(1, seq)).padStart(4, "0")}`;
}

export function buildWhatsAppReminderUrl(phone: string, memberName: string, expiryFormatted: string): string {
  const digits = phone.replace(/[^\d]/g, "");
  const normalized = digits.length === 10 ? `91${digits}` : digits;
  const msg = `Hi ${memberName}, your Rafithub membership is due for renewal on ${expiryFormatted}. Visit the front desk or reply here to renew!`;
  return `https://wa.me/${normalized}?text=${encodeURIComponent(msg)}`;
}
