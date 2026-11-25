import { NextRequest, NextResponse } from "next/server";
import { AuthorizationError, requireStaff } from "@/lib/auth/server";
import {
  getRealtimeServer,
  isRealtimeConfigured,
  recentAttendanceLiveQuery,
  recentLeadsLiveQuery,
} from "@/lib/realtime";

export async function POST(request: NextRequest) {
  try {
    await requireStaff({ permission: "dashboard:view" });

    if (!isRealtimeConfigured()) {
      return NextResponse.json(
        { error: "Neon Realtime is not configured. Run `neon deploy` first." },
        { status: 503 }
      );
    }

    const body = (await request.json().catch(() => ({}))) as { channel?: string };
    const channel = body.channel === "attendance" ? "attendance" : "leads";

    const realtime = getRealtimeServer();
    const sealed =
      channel === "attendance"
        ? await realtime.seal({ query: recentAttendanceLiveQuery() })
        : await realtime.seal({ query: recentLeadsLiveQuery() });

    return NextResponse.json(sealed, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    if (error instanceof AuthorizationError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("Realtime seal error:", error);
    return NextResponse.json({ error: "Unable to create live subscription" }, { status: 500 });
  }
}
