import "server-only";

import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";

export async function recordAuditLog(params: {
  userId?: string | null;
  action: string;
  entity: string;
  entityId: string;
  diff?: Record<string, unknown>;
}) {
  try {
    await prisma.auditLog.create({
      data: {
        userId: params.userId ?? null,
        action: params.action,
        entity: params.entity,
        entityId: params.entityId,
        diff: params.diff ? (params.diff as Prisma.InputJsonValue) : undefined,
      },
    });
  } catch (error) {
    console.error("Failed to record audit log:", error);
  }
}
