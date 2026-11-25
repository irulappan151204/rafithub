import { redirect } from "next/navigation";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { getCurrentStaffSession } from "@/lib/auth/server";
import { AdminShell } from "@/components/admin/AdminShell";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin Console",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const staff = await getCurrentStaffSession();
  if (!staff) {
    redirect("/login");
  }

  return (
    <AdminShell
      user={{
        id: staff.user.id,
        name: staff.user.name,
        email: staff.user.email,
        role: staff.user.role,
      }}
    >
      {children}
    </AdminShell>
  );
}
