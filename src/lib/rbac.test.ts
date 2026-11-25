import { describe, expect, it } from "vitest";
import { hasAnyRole, hasPermission } from "./rbac";

describe("RBAC permissions", () => {
  it("grants OWNER full access including owner settings and staff management", () => {
    expect(hasPermission("OWNER", "settings:owner")).toBe(true);
    expect(hasPermission("OWNER", "staff:manage")).toBe(true);
    expect(hasPermission("OWNER", "cms:manage")).toBe(true);
  });

  it("blocks ADMIN from owner-only settings and staff management", () => {
    expect(hasPermission("ADMIN", "cms:manage")).toBe(true);
    expect(hasPermission("ADMIN", "settings:owner")).toBe(false);
    expect(hasPermission("ADMIN", "staff:manage")).toBe(false);
  });

  it("blocks RECEPTIONIST from deletes, reports, and health notes", () => {
    expect(hasPermission("RECEPTIONIST", "members:write")).toBe(true);
    expect(hasPermission("RECEPTIONIST", "payments:write")).toBe(true);
    expect(hasPermission("RECEPTIONIST", "members:delete")).toBe(false);
    expect(hasPermission("RECEPTIONIST", "reports:view")).toBe(false);
    expect(hasPermission("RECEPTIONIST", "members:health_notes")).toBe(false);
  });

  it("grants TRAINER read-only payments and health notes access", () => {
    expect(hasPermission("TRAINER", "payments:read")).toBe(true);
    expect(hasPermission("TRAINER", "payments:write")).toBe(false);
    expect(hasPermission("TRAINER", "members:health_notes")).toBe(true);
    expect(hasAnyRole("TRAINER", ["OWNER", "ADMIN"])).toBe(false);
  });
});
