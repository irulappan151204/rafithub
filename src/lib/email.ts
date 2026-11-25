import "server-only";

import { Resend } from "resend";

let resendClient: Resend | null = null;

function getResend(): Resend | null {
  if (!process.env.RESEND_API_KEY) return null;
  if (!resendClient) {
    resendClient = new Resend(process.env.RESEND_API_KEY);
  }
  return resendClient;
}

const FROM_EMAIL = process.env.EMAIL_FROM ?? "Rafithub <noreply@rafithub.com>";

export async function sendEmailSafe(params: {
  to: string;
  subject: string;
  html: string;
}): Promise<boolean> {
  const resend = getResend();
  if (!resend) return false;
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: params.to,
      subject: params.subject,
      html: params.html,
    });
    return true;
  } catch (error) {
    console.error("Email delivery failed:", error);
    return false;
  }
}

export async function sendNewLeadNotification(lead: {
  name: string;
  phone: string;
  email?: string | null;
  interest?: string | null;
  source: string;
}) {
  const to = process.env.CONTACT_EMAIL ?? process.env.OWNER_EMAIL;
  if (!to) return false;
  return sendEmailSafe({
    to,
    subject: `New Rafithub Enquiry: ${lead.name}`,
    html: `<p><strong>Name:</strong> ${lead.name}</p>
<p><strong>Phone:</strong> ${lead.phone}</p>
<p><strong>Email:</strong> ${lead.email || "—"}</p>
<p><strong>Interest:</strong> ${lead.interest || "—"}</p>
<p><strong>Source:</strong> ${lead.source}</p>`,
  });
}

export async function sendPaymentReceiptEmail(params: {
  to: string;
  memberName: string;
  receiptNo: string;
  amountFormatted: string;
  method: string;
  paidAtFormatted: string;
}) {
  return sendEmailSafe({
    to: params.to,
    subject: `Rafithub Payment Receipt ${params.receiptNo}`,
    html: `<h2>Payment Receipt — Rafithub</h2>
<p>Hi ${params.memberName},</p>
<p>We received your payment of <strong>${params.amountFormatted}</strong> via ${params.method} on ${params.paidAtFormatted}.</p>
<p><strong>Receipt No:</strong> ${params.receiptNo}</p>
<p>Thank you for training with Rafithub, Kochadai, Madurai.</p>`,
  });
}

export async function sendExpiryReminderEmail(params: {
  to: string;
  memberName: string;
  planName: string;
  endDateFormatted: string;
  daysLeft: number;
}) {
  const whenText =
    params.daysLeft <= 0
      ? `expired on ${params.endDateFormatted}`
      : `expires in ${params.daysLeft} day(s) on ${params.endDateFormatted}`;
  return sendEmailSafe({
    to: params.to,
    subject: `Rafithub Membership Reminder (${params.planName})`,
    html: `<h2>Membership Renewal Reminder</h2>
<p>Hi ${params.memberName},</p>
<p>Your <strong>${params.planName}</strong> membership at Rafithub ${whenText}.</p>
<p>Visit the front desk or reply on WhatsApp (+91 76039 03131) to renew seamlessly.</p>`,
  });
}
