import type { Role } from "@prisma/client";

export type Permission =
  | "dashboard:view"
  | "cms:manage"
  | "plans:manage"
  | "trainers:manage"
  | "classes:manage"
  | "members:read"
  | "members:write"
  | "members:delete"
  | "members:health_notes"
  | "payments:read"
  | "payments:write"
  | "payments:delete"
  | "attendance:manage"
  | "leads:manage"
  | "reports:view"
  | "staff:manage"
  | "settings:owner"
  | "upload:media";

const ROLE_PERMISSIONS: Record<Role, ReadonlySet<Permission>> = {
  OWNER: new Set<Permission>([
    "dashboard:view",
    "cms:manage",
    "plans:manage",
    "trainers:manage",
    "classes:manage",
    "members:read",
    "members:write",
    "members:delete",
    "members:health_notes",
    "payments:read",
    "payments:write",
    "payments:delete",
    "attendance:manage",
    "leads:manage",
    "reports:view",
    "staff:manage",
    "settings:owner",
    "upload:media",
  ]),
  ADMIN: new Set<Permission>([
    "dashboard:view",
    "cms:manage",
    "plans:manage",
    "trainers:manage",
    "classes:manage",
    "members:read",
    "members:write",
    "members:delete",
    "members:health_notes",
    "payments:read",
    "payments:write",
    "payments:delete",
    "attendance:manage",
    "leads:manage",
    "reports:view",
    "upload:media",
  ]),
  RECEPTIONIST: new Set<Permission>([
    "dashboard:view",
    "members:read",
    "members:write",
    "payments:read",
    "payments:write",
    "attendance:manage",
    "leads:manage",
    "upload:media",
  ]),
  TRAINER: new Set<Permission>([
    "dashboard:view",
    "members:read",
    "members:health_notes",
    "payments:read",
    "classes:manage",
    "attendance:manage",
  ]),
};

export function hasPermission(role: Role, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.has(permission) ?? false;
}

export function hasAnyRole(role: Role, allowedRoles: readonly Role[]): boolean {
  return allowedRoles.includes(role);
}
