import { DEFAULT_AUTH_SKIP_ROUTES, processAuthMiddleware } from "@neon/auth/server";
import { NextResponse, type NextRequest } from "next/server";

const FALLBACK_DEV_SECRET = "rafithub-dev-only-cookie-secret-change-in-production-32bytes";

function getBaseUrl() {
  return (
    process.env.NEON_AUTH_BASE_URL ??
    "https://ep-divine-forest-bigh84mv.neonauth.c-5.ap-southeast-1.aws.neon.tech/neondb/auth"
  );
}

function getSecret() {
  const secret = process.env.NEON_AUTH_COOKIE_SECRET ?? process.env.AUTH_SECRET;
  return secret && secret.length >= 32 ? secret : FALLBACK_DEV_SECRET;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminPage = pathname.startsWith("/admin");
  const isAdminApi = pathname.startsWith("/api/admin");

  if (!isAdminPage && !isAdminApi) {
    return NextResponse.next();
  }

  const result = await processAuthMiddleware({
    request,
    pathname,
    skipRoutes: [...DEFAULT_AUTH_SKIP_ROUTES, "/login"],
    loginUrl: "/login",
    baseUrl: getBaseUrl(),
    cookieSecret: getSecret(),
    sameSite: "lax",
  });

  if (result.action === "allow") {
    const headers = new Headers(request.headers);
    if (result.headers) {
      for (const [key, value] of Object.entries(result.headers)) {
        headers.set(key, value);
      }
    }
    const response = NextResponse.next({ request: { headers } });
    if (result.cookies) {
      for (const cookie of result.cookies) {
        response.headers.append("Set-Cookie", cookie);
      }
    }
    return response;
  }

  if (result.action === "redirect_oauth") {
    const oauthHeaders = new Headers();
    for (const cookie of result.cookies) {
      oauthHeaders.append("Set-Cookie", cookie);
    }
    return NextResponse.redirect(result.redirectUrl, { headers: oauthHeaders });
  }

  if (isAdminApi) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (result.cookies && result.cookies.length > 0) {
    const loginHeaders = new Headers();
    for (const cookie of result.cookies) {
      loginHeaders.append("Set-Cookie", cookie);
    }
    return NextResponse.redirect(result.redirectUrl, { headers: loginHeaders });
  }

  return NextResponse.redirect(result.redirectUrl);
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
