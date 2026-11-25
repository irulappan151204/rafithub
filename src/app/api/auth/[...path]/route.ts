import { handleAuthProxyRequest } from "@neon/auth/server";
import { NextResponse, type NextRequest } from "next/server";
import { getAuthBaseUrl, getCookieSecret } from "@/lib/auth/server";
import { checkRateLimit, getClientIp } from "@/lib/ratelimit";

type RouteContext = {
  params: { path: string[] };
};

async function handler(request: NextRequest, context: RouteContext) {
  const path = (context.params.path ?? []).join("/");

  if (request.method === "POST" && path.startsWith("sign-in")) {
    const ip = getClientIp(request.headers);
    const rl = await checkRateLimit({
      namespace: "auth-login",
      identifier: ip,
      limit: 12,
      windowSeconds: 300,
    });
    if (!rl.success) {
      return NextResponse.json(
        { message: "Too many login attempts. Please wait 5 minutes and try again." },
        { status: 429 }
      );
    }
  }

  return handleAuthProxyRequest({
    request,
    path,
    baseUrl: getAuthBaseUrl(),
    cookieSecret: getCookieSecret(),
    sameSite: "lax",
  });
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const DELETE = handler;
export const PATCH = handler;
