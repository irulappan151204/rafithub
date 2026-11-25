import "server-only";

import { cookies, headers } from "next/headers";
import { createAuthServer, extractNeonAuthCookies } from "@neon/auth/server";
import type { Role, User } from "@prisma/client";
import { createRemoteJWKSet, jwtVerify } from "jose";
import { prisma } from "@/lib/db";
import { hasPermission, type Permission } from "@/lib/rbac";

const FALLBACK_DEV_SECRET = "rafithub-dev-only-cookie-secret-change-in-production-32bytes";

export function getAuthBaseUrl(): string {
  return (
    process.env.NEON_AUTH_BASE_URL ??
    "https://ep-divine-forest-bigh84mv.neonauth.c-5.ap-southeast-1.aws.neon.tech/neondb/auth"
  );
}

export function getCookieSecret(): string {
  const secret = process.env.NEON_AUTH_COOKIE_SECRET ?? process.env.AUTH_SECRET;
  if (secret && secret.length >= 32) return secret;
  if (process.env.NODE_ENV === "production") {
    return FALLBACK_DEV_SECRET;
  }
  return FALLBACK_DEV_SECRET;
}

export const auth = createAuthServer({
  baseUrl: getAuthBaseUrl(),
  cookieSecret: getCookieSecret(),
  sessionDataTtl: 300,
  sameSite: "lax",
  context: () => {
    const cookieStore = cookies();
    const headerStore = headers();

    return {
      getCookies: () => extractNeonAuthCookies(headerStore.get("cookie") ?? ""),
      setCookie: (name, value, options) => {
        try {
          cookieStore.set(name, value, options);
        } catch {
          // Server Components cannot mutate cookies during render; Route Handlers & Actions can.
        }
      },
      getHeader: (name) => headerStore.get(name) ?? null,
      getOrigin: () => {
        const origin = headerStore.get("origin");
        if (origin) return origin;
        const referer = headerStore.get("referer");
        if (referer) {
          try {
            return new URL(referer).origin;
          } catch {
            // ignore invalid referer
          }
        }
        const host = headerStore.get("host");
        const proto = headerStore.get("x-forwarded-proto") ?? "http";
        return host ? `${proto}://${host}` : "";
      },
      getFramework: () => "nextjs",
    };
  },
});

let cachedJwks: ReturnType<typeof createRemoteJWKSet> | null = null;

export async function verifyNeonAuthToken(token: string): Promise<{ sub: string; email?: string } | null> {
  try {
    const baseUrl = getAuthBaseUrl();
    const jwksUrl = process.env.NEON_AUTH_JWKS_URL ?? `${baseUrl}/.well-known/jwks.json`;
    if (!cachedJwks) {
      cachedJwks = createRemoteJWKSet(new URL(jwksUrl));
    }
    const issuer = new URL(baseUrl).origin;
    const { payload } = await jwtVerify(token, cachedJwks, { issuer });
    if (!payload.sub) return null;
    return {
      sub: payload.sub,
      email: typeof payload.email === "string" ? payload.email : undefined,
    };
  } catch {
    return null;
  }
}

export interface StaffSession {
  user: User;
  neonUserId: string;
}

/**
 * Resolves the authenticated Neon Auth session and verifies the staff member
 * exists and is active in our PostgreSQL `User` table.
 */
export async function getCurrentStaffSession(): Promise<StaffSession | null> {
  try {
    const { data: session } = await auth.getSession();
    const neonUser = session?.user;
    if (!neonUser?.email) return null;

    const normalizedEmail = neonUser.email.toLowerCase();
    let staffUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    // If OWNER_EMAIL logs in via Neon Auth and hasn't been linked/seeded yet,
    // allow automatic OWNER linking ONLY when email strictly matches OWNER_EMAIL
    // and no active OWNER exists yet.
    const ownerEmail = process.env.OWNER_EMAIL?.toLowerCase();
    if (!staffUser && ownerEmail && normalizedEmail === ownerEmail) {
      const existingOwnerCount = await prisma.user.count({ where: { role: "OWNER" } });
      if (existingOwnerCount === 0) {
        staffUser = await prisma.user.create({
          data: {
            email: normalizedEmail,
            neonAuthUserId: neonUser.id,
            name: neonUser.name || "Rafithub Owner",
            role: "OWNER",
            active: true,
          },
        });
      }
    }

    if (!staffUser || !staffUser.active) {
      return null;
    }

    // Bind Neon Auth user id + update lastLoginAt on first/fresh login
    if (!staffUser.neonAuthUserId && neonUser.id) {
      staffUser = await prisma.user.update({
        where: { id: staffUser.id },
        data: { neonAuthUserId: neonUser.id, lastLoginAt: new Date() },
      });
    }

    return {
      user: staffUser,
      neonUserId: neonUser.id,
    };
  } catch {
    return null;
  }
}

export class AuthorizationError extends Error {
  status: number;
  constructor(message: string, status = 403) {
    super(message);
    this.status = status;
  }
}

/**
 * Server-side authorization guard for Server Actions and Route Handlers.
 */
export async function requireStaff(options?: {
  roles?: readonly Role[];
  permission?: Permission;
}): Promise<StaffSession> {
  const staff = await getCurrentStaffSession();
  if (!staff) {
    throw new AuthorizationError("Authentication required", 401);
  }
  if (options?.roles && !options.roles.includes(staff.user.role)) {
    throw new AuthorizationError("Insufficient role permissions", 403);
  }
  if (options?.permission && !hasPermission(staff.user.role, options.permission)) {
    throw new AuthorizationError("Missing required permission", 403);
  }
  return staff;
}
