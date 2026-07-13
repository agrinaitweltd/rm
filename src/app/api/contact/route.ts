import { NextResponse } from "next/server";

/**
 * Contact / order form endpoint.
 *
 * Validates the submission and returns a JSON result. Email delivery is not
 * wired up yet — drop an email provider (e.g. Resend, Nodemailer, or a
 * webhook) into the marked section below and set the relevant environment
 * variables (see README) to start receiving orders by email.
 */

export type ContactPayload = {
  name: string;
  phone: string;
  email: string;
  boxSize: string;
  quantity: string;
  message: string;
  /** Honeypot — must stay empty. */
  company?: string;
};

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let data: ContactPayload;
  try {
    data = (await request.json()) as ContactPayload;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // Silently accept spam bots that fill the honeypot.
  if (data.company) {
    return NextResponse.json({ ok: true });
  }

  const errors: string[] = [];
  if (!data.name?.trim()) errors.push("name");
  if (!data.phone?.trim()) errors.push("phone");
  if (!data.email?.trim() || !emailRe.test(data.email)) errors.push("email");
  if (!data.boxSize?.trim()) errors.push("boxSize");

  if (errors.length) {
    return NextResponse.json(
      { error: "Please check the highlighted fields.", fields: errors },
      { status: 422 },
    );
  }

  // ---------------------------------------------------------------------------
  // TODO: Email integration
  // Example with Resend:
  //   const resend = new Resend(process.env.RESEND_API_KEY);
  //   await resend.emails.send({
  //     from: "orders@rmmangoes.co.uk",
  //     to: process.env.ORDER_INBOX ?? "info@rmmangoes.co.uk",
  //     subject: `New mango order from ${data.name}`,
  //     text: `${data.name} (${data.phone}, ${data.email})\n` +
  //           `${data.quantity} x ${data.boxSize}\n\n${data.message}`,
  //   });
  // ---------------------------------------------------------------------------

  // Until email is wired up, log server-side so orders are not lost.
  console.info("[contact] new submission", {
    name: data.name,
    phone: data.phone,
    email: data.email,
    boxSize: data.boxSize,
    quantity: data.quantity,
  });

  return NextResponse.json({ ok: true });
}
