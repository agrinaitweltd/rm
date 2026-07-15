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
};

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

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

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    // Resend not configured yet — tell the visitor how to reach us instead.
    return NextResponse.json(
      {
        error: `Our enquiry form isn't connected yet. Please email ${site.email} or WhatsApp ${site.phoneDisplay}.`,
      },
      { status: 503 }
    );
  }

  const resend = new Resend(apiKey);
  const to = process.env.WHOLESALE_TO_EMAIL || site.email;
  const from = process.env.WHOLESALE_FROM_EMAIL || "RM Mangoes <onboarding@resend.dev>";

  const html = `
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
    html,
  });

  if (error) {
    return NextResponse.json(
      { error: `Sorry, something went wrong sending your enquiry. Please email ${site.email} instead.` },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
