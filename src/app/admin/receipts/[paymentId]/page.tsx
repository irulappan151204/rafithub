import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireStaff } from "@/lib/auth/server";
import { formatDateIN, formatINR } from "@/lib/format";
import { PrintReceiptButton } from "@/components/admin/PrintReceiptButton";

export const dynamic = "force-dynamic";

export default async function AdminReceiptPage({
  params,
}: {
  params: { paymentId: string };
}) {
  await requireStaff({ permission: "payments:read" });

  const [payment, settings] = await Promise.all([
    prisma.payment.findUnique({
      where: { id: params.paymentId },
      include: {
        member: true,
        membership: { include: { plan: true } },
        collectedBy: { select: { name: true, email: true } },
      },
    }),
    prisma.siteSettings.findUnique({ where: { id: "default" } }),
  ]);

  if (!payment || payment.deletedAt) {
    notFound();
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between gap-3 print:hidden">
        <Link href="/admin/payments" className="btn-outline px-4 py-2 text-xs">
          Back to payments
        </Link>
        <PrintReceiptButton />
      </div>

      <article className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8 space-y-6 print:border-zinc-300 print:bg-white print:text-black">
        <header className="flex flex-wrap items-start justify-between gap-4 border-b border-[var(--border)] pb-6 print:border-zinc-300">
          <div>
            <p className="font-display text-3xl tracking-wider">
              {(settings?.gymName ?? "RAFITHUB").toUpperCase()}
            </p>
            <p className="text-xs text-[var(--muted-foreground)] print:text-zinc-600 mt-1 max-w-xs">
              {settings?.address ?? "47B, P.P. Chavadi, Kochadai, Madurai - 625016"}
            </p>
            <p className="text-xs text-[var(--muted-foreground)] print:text-zinc-600">
              {settings?.phoneDisplay ?? "+91 76039 03131"} · {settings?.email ?? "support@rafithub.com"}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs uppercase tracking-widest text-[var(--primary)] print:text-black font-semibold">
              Payment Receipt
            </p>
            <p className="font-mono text-base font-bold mt-1">{payment.receiptNo}</p>
            <p className="text-xs text-[var(--muted-foreground)] print:text-zinc-600 mt-0.5">
              Date: {formatDateIN(payment.paidAt)}
            </p>
          </div>
        </header>

        <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-xs uppercase tracking-wider text-[var(--muted-foreground)] print:text-zinc-500">
              Received From
            </p>
            <p className="font-bold mt-1">{payment.member.name}</p>
            <p className="text-xs text-[var(--muted-foreground)] print:text-zinc-600">
              Member ID: {payment.member.memberCode}
            </p>
            <p className="text-xs text-[var(--muted-foreground)] print:text-zinc-600">
              Phone: {payment.member.phone}
            </p>
          </div>
          <div className="sm:text-right">
            <p className="text-xs uppercase tracking-wider text-[var(--muted-foreground)] print:text-zinc-500">
              Payment Details
            </p>
            <p className="font-semibold mt-1">Method: {payment.method}</p>
            <p className="text-xs text-[var(--muted-foreground)] print:text-zinc-600">
              Status: {payment.status}
            </p>
            <p className="text-xs text-[var(--muted-foreground)] print:text-zinc-600">
              Collected by: {payment.collectedBy?.name ?? "Front Desk"}
            </p>
          </div>
        </section>

        <section className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-4 print:border-zinc-300 print:bg-zinc-50">
          <div className="flex items-center justify-between text-sm">
            <div>
              <p className="font-semibold">
                {payment.membership?.plan.name ?? "Gym Membership Payment"}
              </p>
              {payment.membership && (
                <p className="text-xs text-[var(--muted-foreground)] print:text-zinc-600">
                  Validity: {formatDateIN(payment.membership.startDate)} –{" "}
                  {formatDateIN(payment.membership.endDate)}
                </p>
              )}
              {payment.notes && (
                <p className="text-xs text-[var(--muted-foreground)] print:text-zinc-600 mt-1">
                  Note: {payment.notes}
                </p>
              )}
            </div>
            <p className="font-display text-3xl text-[var(--primary)] print:text-black tabular-nums">
              {formatINR(payment.amount)}
            </p>
          </div>
        </section>

        <footer className="pt-4 border-t border-[var(--border)] print:border-zinc-300 flex flex-wrap justify-between gap-2 text-[11px] text-[var(--muted-foreground)] print:text-zinc-500">
          <span>Thank you for training with {settings?.gymName ?? "Rafithub"}!</span>
          <span>https://www.rafithub.com</span>
        </footer>
      </article>
    </div>
  );
}
