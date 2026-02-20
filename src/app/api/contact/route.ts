import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { z } from 'zod';

const resend = new Resend(process.env.RESEND_API_KEY);

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  subject: z.string().min(5),
  message: z.string().min(10),
  company: z.string().optional(), // Honeypot
});

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, subject, message, company } = contactSchema.parse(body);

    // Honeypot check
    if (company) {
      return NextResponse.json({ success: true }); // Silent success
    }

    const contactEmail = process.env.CONTACT_EMAIL;

    if (!contactEmail) {
      console.error("CONTACT_EMAIL is not defined in environment variables.");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    if (!process.env.RESEND_API_KEY) {
      console.error("RESEND_API_KEY is not defined in environment variables.");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    try {
      const data = await resend.emails.send({
        from: 'Rafithub Contact <onboarding@resend.dev>', // Default Resend testing domain
        to: contactEmail,
        replyTo: email,
        subject: `New Contact Form Submission: ${escapeHtml(subject)}`,
        html: `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>New Contact Submission</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #0a0a0a; font-family: 'Arial', sans-serif; color: #ffffff;">
            <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
                <!-- Header -->
                <div style="text-align: center; margin-bottom: 40px;">
                    <h1 style="margin: 0; font-size: 32px; font-weight: bold; letter-spacing: 2px;">
                        RAFI<span style="color: #D4AF37;">THUB</span>
                    </h1>
                    <p style="margin: 10px 0 0; color: #888888; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Premium Fitness Experience</p>
                </div>

                <!-- Card Content -->
                <div style="background-color: #1a1a1a; border: 1px solid #333333; border-radius: 12px; padding: 30px; box-shadow: 0 4px 20px rgba(0,0,0,0.5);">
                    <div style="border-bottom: 1px solid #333333; padding-bottom: 20px; margin-bottom: 25px;">
                        <h2 style="margin: 0; color: #D4AF37; font-size: 20px;">New Inquiry Received</h2>
                        <p style="margin: 5px 0 0; color: #cccccc; font-size: 14px;">You have a new message from the contact form.</p>
                    </div>

                    <!-- Info Grid -->
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 10px 0; color: #888888; font-size: 12px; text-transform: uppercase; width: 30%;">Name</td>
                            <td style="padding: 10px 0; color: #ffffff; font-weight: bold; border-bottom: 1px solid #333333;">${escapeHtml(name)}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px 0; color: #888888; font-size: 12px; text-transform: uppercase;">Email</td>
                            <td style="padding: 10px 0; color: #ffffff; font-weight: bold; border-bottom: 1px solid #333333;">
                                <a href="mailto:${escapeHtml(email)}" style="color: #D4AF37; text-decoration: none;">${escapeHtml(email)}</a>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 10px 0; color: #888888; font-size: 12px; text-transform: uppercase;">Phone</td>
                            <td style="padding: 10px 0; color: #ffffff; font-weight: bold; border-bottom: 1px solid #333333;">${escapeHtml(phone || 'Not provided')}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px 0; color: #888888; font-size: 12px; text-transform: uppercase;">Subject</td>
                            <td style="padding: 10px 0; color: #ffffff; font-weight: bold; border-bottom: 1px solid #333333;">${escapeHtml(subject)}</td>
                        </tr>
                    </table>

                    <!-- Message Body -->
                    <div style="margin-top: 30px;">
                        <p style="color: #888888; font-size: 12px; text-transform: uppercase; margin-bottom: 10px;">Message</p>
                        <div style="background-color: #0a0a0a; border-left: 2px solid #D4AF37; padding: 15px; border-radius: 4px; color: #dddddd; line-height: 1.6;">
                            ${escapeHtml(message).replace(/\n/g, '<br>')}
                        </div>
                    </div>
                </div>

                <!-- Footer -->
                <div style="text-align: center; margin-top: 40px; border-top: 1px solid #333333; padding-top: 20px;">
                    <p style="color: #666666; font-size: 12px; line-height: 1.5;">
                        This email was sent from the Rafithub website contact form.<br>
                        &copy; ${new Date().getFullYear()} Rafithub. All rights reserved.
                    </p>
                </div>
            </div>
        </body>
        </html>
        `,
      });

      return NextResponse.json({ success: true, data });
    } catch (emailError) {
      console.error("Resend API Error:", emailError);
      return NextResponse.json(
        { error: "Failed to send email via provider" },
        { status: 500 }
      );
    }

  } catch (error) {
    if (error instanceof z.ZodError) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return NextResponse.json({ error: "Invalid form data", details: (error as any).errors }, { status: 400 });
    }
    console.error("Unknown API Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
