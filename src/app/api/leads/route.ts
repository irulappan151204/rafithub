import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { leadCreateSchema } from "@/lib/validators/cms";
import { checkRateLimit, getClientIp } from "@/lib/ratelimit";
import { sendNewLeadNotification } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request.headers);
    const rl = await checkRateLimit({
      namespace: "leads",
      identifier: ip,
      limit: 10,
      windowSeconds: 600,
    });
    if (!rl.success) {
      return NextResponse.json(
        { error: "Too many requests. Please wait a few minutes or contact us on WhatsApp." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const parsed = leadCreateSchema.safeParse(body);

    if (!parsed.success) {
      const firstIssue = parsed.error.issues[0]?.message ?? "Invalid enquiry details";
      return NextResponse.json({ error: firstIssue }, { status: 400 });
    }

    // Honeypot triggered — pretend success without storing
    if (parsed.data.website && parsed.data.website.length > 0) {
      return NextResponse.json({ ok: true }, { status: 201 });
    }

    const lead = await prisma.lead.create({
      data: {
        name: parsed.data.name,
        phone: parsed.data.phone,
        email: parsed.data.email || null,
        interest: parsed.data.interest || null,
        message: parsed.data.message || null,
        source: parsed.data.source,
        consentGiven: parsed.data.consentGiven,
        calculator: parsed.data.calculator ?? undefined,
      },
      select: {
        id: true,
        name: true,
        status: true,
        createdAt: true,
      },
    });

    void sendNewLeadNotification({
      name: parsed.data.name,
      phone: parsed.data.phone,
      email: parsed.data.email || null,
      interest: parsed.data.interest || null,
      source: parsed.data.source,
    });

    return NextResponse.json({ ok: true, lead }, { status: 201 });
  } catch (error) {
    console.error("Failed to create lead:", error);
    return NextResponse.json(
      { error: "Unable to save your enquiry right now. Please try WhatsApp or call us." },
      { status: 500 }
    );
  }
}
