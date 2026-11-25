import { prisma } from "@/lib/db";
import { requireStaff } from "@/lib/auth/server";
import { AttendanceDesk } from "@/components/admin/AttendanceDesk";

export const dynamic = "force-dynamic";

function startOfTodayIST(): Date {
  const istDateStr = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(
    new Date()
  );
  return new Date(`${istDateStr}T00:00:00+05:30`);
}

export default async function AdminAttendancePage() {
  await requireStaff({ permission: "attendance:manage" });
  const todayStart = startOfTodayIST();

  const [members, todayLogs] = await Promise.all([
    prisma.member.findMany({
      where: { deletedAt: null },
      orderBy: [{ status: "asc" }, { name: "asc" }],
      take: 250,
      include: {
        memberships: {
          orderBy: { endDate: "desc" },
          take: 1,
          include: { plan: { select: { name: true } } },
        },
      },
    }),
    prisma.attendance.findMany({
      where: { checkInAt: { gte: todayStart } },
      orderBy: { checkInAt: "desc" },
      include: {
        member: { select: { id: true, name: true, memberCode: true, status: true } },
      },
    }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Attendance Desk</h1>
        <p className="text-sm text-[var(--muted-foreground)] mt-1">
          Fast check-in by search or QR code, with automatic blocks for expired or frozen members.
        </p>
      </div>

      <AttendanceDesk
        members={members.map((m) => ({
          id: m.id,
          memberCode: m.memberCode,
          name: m.name,
          phone: m.phone,
          status: m.status,
          planName: m.memberships[0]?.plan.name ?? null,
          endDate: m.memberships[0]?.endDate.toISOString() ?? null,
        }))}
        todayLogs={todayLogs.map((a) => ({
          id: a.id,
          memberId: a.member.id,
          memberCode: a.member.memberCode,
          memberName: a.member.name,
          memberStatus: a.member.status,
          checkInAt: a.checkInAt.toISOString(),
          checkOutAt: a.checkOutAt ? a.checkOutAt.toISOString() : null,
          method: a.method,
        }))}
      />
    </div>
  );
}
