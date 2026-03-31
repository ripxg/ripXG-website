import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: NextRequest) {
  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const body = await req.json();
    const { name, email, useCases } = body as {
      name?: string;
      email?: string;
      useCases?: string[];
    };

    if (!email || !isValidEmail(email)) {
      return NextResponse.json({ error: 'A valid email address is required.' }, { status: 400 });
    }

    const useCasesHtml = useCases && useCases.length > 0
      ? useCases.map((uc) => `<li>${uc}</li>`).join('')
      : '<li><em>none selected</em></li>';

    await resend.emails.send({
      from: 'ripXG <onboarding@resend.dev>',
      to: 'jeff@ripxg.com',
      replyTo: email,
      subject: `New lead from ripXG: ${name || email}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;">
          <h2 style="color:#6c28c5;">New lead from ripXG.com</h2>
          <p><strong>Name:</strong> ${name || '<em>not provided</em>'}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          <p><strong>Interested in:</strong></p>
          <ul>${useCasesHtml}</ul>
          <hr/>
          <p style="color:#9ca3af;font-size:13px;">Submitted via ripXG.com/get-started</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[leads] error:', err);
    return NextResponse.json({ error: 'Failed to send. Please try again.' }, { status: 500 });
  }
}
