import { describe, expect, it } from "vitest";
import {
  buildWhatsAppReminderUrl,
  calculateFreezeExtensionDays,
  calculateMembershipEndDate,
  calculateRenewalEndDate,
  computeOutstandingDue,
  extendEndDateByDays,
  formatMemberCode,
  formatReceiptNumber,
} from "./gym-ops";

describe("gym-ops calculations", () => {
  it("computes initial membership end date accurately", () => {
    const start = new Date("2026-01-01T00:00:00.000Z");
    const end = calculateMembershipEndDate(start, 30);
    expect(end.toISOString()).toBe("2026-01-31T00:00:00.000Z");
  });

  it("extends active renewals from currentEndDate and expired renewals from now", () => {
    const now = new Date("2026-03-10T00:00:00.000Z");
    const activeEnd = new Date("2026-03-20T00:00:00.000Z");
    const activeRenewal = calculateRenewalEndDate(activeEnd, 90, now);
    expect(activeRenewal.startDate.toISOString()).toBe("2026-03-20T00:00:00.000Z");
    expect(activeRenewal.endDate.toISOString()).toBe("2026-06-18T00:00:00.000Z");

    const expiredEnd = new Date("2026-02-01T00:00:00.000Z");
    const expiredRenewal = calculateRenewalEndDate(expiredEnd, 30, now);
    expect(expiredRenewal.startDate.toISOString()).toBe("2026-03-10T00:00:00.000Z");
    expect(expiredRenewal.endDate.toISOString()).toBe("2026-04-09T00:00:00.000Z");
  });

  it("computes freeze extension days and shifts end date", () => {
    const freezeStart = new Date("2026-04-01T00:00:00.000Z");
    const freezeEnd = new Date("2026-04-11T00:00:00.000Z");
    const days = calculateFreezeExtensionDays(freezeStart, freezeEnd);
    expect(days).toBe(10);
    const shifted = extendEndDateByDays(new Date("2026-05-01T00:00:00.000Z"), days);
    expect(shifted.toISOString()).toBe("2026-05-11T00:00:00.000Z");
  });

  it("computes outstanding dues with discount and partial payments", () => {
    expect(computeOutstandingDue(5500, 500, 2000)).toBe(3000);
    expect(computeOutstandingDue(2000, 0, 2500)).toBe(0);
  });

  it("formats member codes, receipt numbers, and WhatsApp reminder URLs", () => {
    expect(formatMemberCode(7)).toBe("RH-0007");
    expect(formatReceiptNumber(new Date("2026-11-25T10:00:00Z"), 12)).toBe("RH-202611-0012");
    expect(buildWhatsAppReminderUrl("9876543210", "Arjun", "30/11/2026")).toContain(
      "https://wa.me/919876543210?text="
    );
  });
});
