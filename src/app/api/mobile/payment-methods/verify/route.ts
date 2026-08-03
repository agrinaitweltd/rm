import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { findOrCreateStripeCustomer } from "@/lib/stripe-customers";
import { requireStoreKey, isGuardResponse } from "@/lib/mobile/guard";

export const runtime = "nodejs";

// £0.99 card-verification charge: confirmed by the app via Stripe's
// PaymentSheet, which — because of setup_future_usage — also saves the card
// on the Stripe Customer for reuse on future orders.
const VERIFY_AMOUNT_PENCE = 99;

export async function POST(request: Request) {
  const guard = requireStoreKey(request);
  if (isGuardResponse(guard)) return guard;

  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: "Card payments aren't configured yet." }, { status: 503 });
  }

  let body: { email?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const email = String(body.email || "").trim().toLowerCase().slice(0, 200);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Please provide a valid email address." }, { status: 400 });
  }

  try {
    const customer = await findOrCreateStripeCustomer(email);
    const intent = await stripe.paymentIntents.create({
      amount: VERIFY_AMOUNT_PENCE,
      currency: "gbp",
      customer: customer.id,
      setup_future_usage: "off_session",
      automatic_payment_methods: { enabled: true },
      description: "RM Mangoes card verification",
    });
    return NextResponse.json({ clientSecret: intent.client_secret });
  } catch (err) {
    console.error("[mobile/payment-methods/verify] failed to create PaymentIntent:", err);
    return NextResponse.json({ error: "Sorry, we couldn't verify your card. Please try again." }, { status: 502 });
  }
}
