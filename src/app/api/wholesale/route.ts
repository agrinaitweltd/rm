import { NextResponse } from "next/server";
import { Resend } from "resend";
import { site } from "@/lib/site";

export const runtime = "nodejs";

type WholesalePayload = {
  business?: string;
  name?: string;
  email?: string;
  phone?: string;
  quantity?: string;
  message?: string;
  recaptchaToken?: string;
};

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/**
 * reCAPTCHA v3 check.
 *
 * We only reject when Google gives a confident bot verdict (a valid token
 * with a low score) or the token is clearly forged/expired. If Google can't
 * score it — unregistered domain, network trouble, missing config — we let
 * the enquiry through: losing a real wholesale lead is worse than a stray
 * spam message.
 */
async function verifyRecaptcha(token: string): Promise<boolean> {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret || !token) return true;
  try {
    const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: token }),
    });
    const data = (await res.json()) as {
      success?: boolean;
      score?: number;
      "error-codes"?: string[];
    };

    if (data.success) return (data.score ?? 1) >= 0.5;

    // Forged, reused or expired token — that's a real bot signal.
    const codes = data["error-codes"] || [];
    if (codes.includes("invalid-input-response") || codes.includes("timeout-or-duplicate")) {
      return false;
    }

    // Anything else is a configuration/infrastructure problem on our side.
    console.warn("[recaptcha] could not score, allowing through:", codes.join(", "));
    return true;
  } catch {
    return true;
  }
}

export async function POST(request: Request) {
  let payload: WholesalePayload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const business = (payload.business || "").trim().slice(0, 200);
  const name = (payload.name || "").trim().slice(0, 200);
  const email = (payload.email || "").trim().slice(0, 200);
  const phone = (payload.phone || "").trim().slice(0, 50);
  const quantity = (payload.quantity || "").trim().slice(0, 200);
  const message = (payload.message || "").trim().slice(0, 5000);

  if (!business || !name || !email || !message) {
    return NextResponse.json(
      { error: "Please fill in your business name, your name, email and message." },
      { status: 400 }
    );
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  const human = await verifyRecaptcha(payload.recaptchaToken || "");
  if (!human) {
    return NextResponse.json(
      { error: "We couldn't verify you're human. Please try again." },
      { status: 400 }
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      {
        error: `Our enquiry form isn't connected yet. Please email ${site.email} or WhatsApp ${site.phoneDisplay}.`,
      },
      { status: 503 }
    );
  }

  const resend = new Resend(apiKey);
  const to = process.env.WHOLESALE_TO_EMAIL || site.email;
  const from = process.env.WHOLESALE_FROM_EMAIL || `RM Mangoes <no-reply@rmmangoes.co.uk>`;

  const adminHtml = `
    <h2>New wholesale enquiry — RM Mangoes</h2>
    <table cellpadding="6" style="border-collapse:collapse">
      <tr><td><strong>Business</strong></td><td>${esc(business)}</td></tr>
      <tr><td><strong>Contact name</strong></td><td>${esc(name)}</td></tr>
      <tr><td><strong>Email</strong></td><td>${esc(email)}</td></tr>
      <tr><td><strong>Phone</strong></td><td>${esc(phone) || "—"}</td></tr>
      <tr><td><strong>Estimated quantity</strong></td><td>${esc(quantity) || "—"}</td></tr>
    </table>
    <p><strong>Message</strong></p>
    <p>${esc(message).replace(/\n/g, "<br/>")}</p>
  `;

  const { error } = await resend.emails.send({
    from,
    to,
    replyTo: email,
    subject: `Wholesale enquiry from ${business}`,
    html: adminHtml,
  });

  if (error) {
    return NextResponse.json(
      { error: `Sorry, something went wrong sending your enquiry. Please email ${site.email} instead.` },
      { status: 502 }
    );
  }

  // Confirmation to the enquirer — best-effort, don't fail the request if it bounces.
  const confirmationHtml = `
    <div style="font-family:Helvetica,Arial,sans-serif;max-width:560px;margin:0 auto;color:#1e1e1e">
      <h2 style="color:#4f8d36">Thanks for your enquiry, ${esc(name)}!</h2>
      <p>We've received your wholesale enquiry for <strong>${esc(business)}</strong> and will get back to you as soon as possible.</p>
      <p style="background:#f4f9ee;border-left:4px solid #7aa82d;padding:12px 16px">
        <strong>Your message:</strong><br/>${esc(message).replace(/\n/g, "<br/>")}
      </p>
      <p>In the meantime you can reach us any time:</p>
      <p>
        📞 <a href="tel:${site.phoneTel}">${site.phoneDisplay}</a><br/>
        💬 <a href="${site.whatsapp}">WhatsApp us</a><br/>
        ✉️ <a href="mailto:${site.email}">${site.email}</a>
      </p>
      <p style="color:#f6a200;font-weight:bold">RM Mangoes — King Of Mangoes 🥭</p>
    </div>
  `;

  await resend.emails
    .send({
      from,
      to: email,
      subject: "We've received your enquiry — RM Mangoes",
      html: confirmationHtml,
    })
    .catch(() => {});

  return NextResponse.json({ ok: true });
}
