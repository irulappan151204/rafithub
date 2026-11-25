import { describe, expect, it } from "vitest";
import { formatDateIN, formatINR, getSiteUrl } from "./format";

describe("format helpers", () => {
  it("formats INR with Indian numbering separators", () => {
    expect(formatINR(2000)).toBe("₹2,000");
    expect(formatINR(100000)).toBe("₹1,00,000");
  });

  it("formats dates in DD/MM/YYYY in Asia/Kolkata timezone", () => {
    // 2026-01-15T20:00:00Z is 2026-01-16 01:30 IST
    expect(formatDateIN("2026-01-15T20:00:00.000Z")).toBe("16/01/2026");
  });

  it("returns default www.rafithub.com URL without trailing slash", () => {
    expect(getSiteUrl()).toBe("https://www.rafithub.com");
  });
});
