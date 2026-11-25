import "server-only";

import { createRealtime, rawSql } from "@neon/realtime/server";

function getDatabaseName(): string {
  const url = process.env.DATABASE_URL;
  if (!url) return "neondb";
  try {
    const pathname = new URL(url).pathname.replace(/^\/+/, "");
    return pathname || "neondb";
  } catch {
    return "neondb";
  }
}

export function isRealtimeConfigured(): boolean {
  return Boolean(process.env.NEON_REALTIME_SECRET && process.env.NEON_REALTIME_URL);
}

let cachedRealtime: ReturnType<typeof createRealtime> | null = null;

export function getRealtimeServer() {
  const secret = process.env.NEON_REALTIME_SECRET;
  if (!secret) {
    throw new Error("NEON_REALTIME_SECRET is not set. Run `neon deploy` to provision Realtime.");
  }
  if (!cachedRealtime) {
    cachedRealtime = createRealtime({
      secret,
      db: getDatabaseName(),
    });
  }
  return cachedRealtime;
}

export interface LiveLeadRow {
  id: string;
  name: string;
  phone: string;
  interest: string | null;
  source: string;
  status: string;
  createdAt: Date;
}

export interface LiveAttendanceRow {
  id: string;
  memberId: string;
  checkInAt: Date;
  method: string;
  memberName: string;
  memberCode: string;
}

export function recentLeadsLiveQuery() {
  return rawSql<LiveLeadRow>(
    `SELECT id, name, phone, interest, source, status, "createdAt"
     FROM "Lead"
     ORDER BY "createdAt" DESC
     LIMIT 15`
  );
}

export function recentAttendanceLiveQuery() {
  return rawSql<LiveAttendanceRow>(
    `SELECT a.id, a."memberId", a."checkInAt", a.method, m.name AS "memberName", m."memberCode"
     FROM "Attendance" a
     INNER JOIN "Member" m ON m.id = a."memberId"
     ORDER BY a."checkInAt" DESC
     LIMIT 15`
  );
}
