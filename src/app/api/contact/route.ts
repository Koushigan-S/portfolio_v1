import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

// Simple in-memory rate limiter (per IP, resets on server restart)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 3; // Max 3 submissions per window
const WINDOW_MS = 60 * 60 * 1000; // 1 hour

function getRateLimit(ip: string) {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || entry.resetAt < now) {
    const newEntry = { count: 1, resetAt: now + WINDOW_MS };
    rateLimitMap.set(ip, newEntry);
    return { allowed: true, remaining: RATE_LIMIT - 1 };
  }

  if (entry.count >= RATE_LIMIT) {
    return { allowed: false, remaining: 0 };
  }

  entry.count++;
  return { allowed: true, remaining: RATE_LIMIT - entry.count };
}

// Basic spam detection
function isSpam(name: string, email: string, message: string) {
  const spamKeywords = ['casino', 'crypto', 'bitcoin', 'earn money', 'click here', 'free money'];
  const content = `${name} ${email} ${message}`.toLowerCase();
  return spamKeywords.some((kw) => content.includes(kw));
}

export async function POST(req: NextRequest) {
  try {
    // Get IP for rate limiting
    const forwarded = req.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : 'unknown';

    // Rate limiting
    const { allowed } = getRateLimit(ip);
    if (!allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again in an hour.' },
        { status: 429 }
      );
    }

    // Parse body
    const body = await req.json();
    const { name, email, message } = body;

    // Validation
    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }

    if (name.trim().length < 2 || name.trim().length > 100) {
      return NextResponse.json({ error: 'Invalid name.' }, { status: 400 });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 });
    }

    if (message.trim().length < 10 || message.trim().length > 2000) {
      return NextResponse.json(
        { error: 'Message must be between 10 and 2000 characters.' },
        { status: 400 }
      );
    }

    // Spam check
    if (isSpam(name, email, message)) {
      return NextResponse.json({ error: 'Message flagged as spam.' }, { status: 400 });
    }

    const toEmail = process.env.CONTACT_TO_EMAIL ?? process.env.RESEND_FROM_EMAIL;
    const fromEmail = process.env.RESEND_FROM_EMAIL ?? 'onboarding@resend.dev';

    if (!toEmail) {
      console.error('CONTACT_TO_EMAIL not set');
      return NextResponse.json({ error: 'Server configuration error.' }, { status: 500 });
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error('RESEND_API_KEY is not set');
      return NextResponse.json({ error: 'Server configuration error.' }, { status: 500 });
    }
    const resend = new Resend(apiKey);

    // Send via Resend
    const { error } = await resend.emails.send({
      from: `Portfolio Contact <${fromEmail}>`,
      to: [toEmail],
      replyTo: email.trim(),
      subject: `New message from ${name.trim()} — Portfolio`,
      html: `
        <div style="font-family: -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #0a0a0f; color: #f0f0f8; border-radius: 16px;">
          <h2 style="color: #818cf8; margin-top: 0;">New Portfolio Message</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #9898b0; width: 80px;">Name:</td>
              <td style="padding: 8px 0; color: #f0f0f8; font-weight: 600;">${name.trim()}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #9898b0;">Email:</td>
              <td style="padding: 8px 0;"><a href="mailto:${email.trim()}" style="color: #6366f1;">${email.trim()}</a></td>
            </tr>
          </table>
          <hr style="border: 1px solid #1e1e30; margin: 24px 0;" />
          <h3 style="color: #9898b0; font-size: 14px; text-transform: uppercase; letter-spacing: 0.1em;">Message</h3>
          <p style="color: #f0f0f8; line-height: 1.7; white-space: pre-wrap;">${message.trim()}</p>
          <hr style="border: 1px solid #1e1e30; margin: 24px 0;" />
          <p style="color: #5a5a6e; font-size: 12px;">Sent from your portfolio contact form</p>
        </div>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json(
        { error: 'Failed to send message. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Contact API error:', err);
    return NextResponse.json(
      { error: 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}
