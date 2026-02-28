import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: NextRequest) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    const body = await req.json();
    const { name, email, message } = body as {
      name?: string;
      email?: string;
      message?: string;
    };

    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        { error: "A valid email address is required." },
        { status: 400 }
      );
    }

    const fromEmail =
      process.env.LEADS_FROM_EMAIL || "noreply@ripxg.com";
    const toEmail = process.env.LEADS_TO_EMAIL || "jeff@ripxg.com";
    const subject = `New lead from ripXG: ${name || email}`;

    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
        <h2 style="color: #6c28c5; margin-bottom: 24px;">New lead from ripXG.com</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #e9d5ff; font-weight: bold; color: #4f1ca0; width: 100px;">Name</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #e9d5ff; color: #374151;">${name || "<em>not provided</em>"}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #e9d5ff; font-weight: bold; color: #4f1ca0;">Email</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #e9d5ff; color: #374151;">
              <a href="mailto:${email}" style="color: #6c28c5;">${email}</a>
            </td>
          </tr>
          <tr>
            <td style="padding: 10px 0; font-weight: bold; color: #4f1ca0; vertical-align: top;">Message</td>
            <td style="padding: 10px 0; color: #374151; white-space: pre-wrap;">${message || "<em>not provided</em>"}</td>
          </tr>
        </table>
        <hr style="border: none; border-top: 2px solid #e9d5ff; margin: 24px 0;" />
        <p style="color: #9ca3af; font-size: 13px;">Submitted via ripXG.com/get-started</p>
      </div>
    `;

    await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      subject,
      html,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[leads] error:", err);
    return NextResponse.json(
      { error: "Failed to send. Please try again." },
      { status: 500 }
    );
  }
}
