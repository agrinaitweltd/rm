import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { productById } from "@/lib/site";

export const runtime = "nodejs";

type CheckoutItem = { id: string; quantity: number };

// Creates a PaymentIntent for the on-site Payment Element checkout. The amount
// is computed from the server-side catalogue (src/lib/site.ts) — client-sent
// prices are never trusted. The cart contents travel in metadata so the
// webhook can build the order items after payment succeeds.
export async function POST(request: Request) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { error: "Payments aren't configured yet. Please try again shortly." },
      { status: 503 }
    );
  }

  let body: { items?: CheckoutItem[] };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const items = Array.isArray(body.items) ? body.items : [];
  if (items.length === 0) {
    return NextResponse.json({ error: "Your cart is empty." }, { status: 400 });
  }

  let amount = 0;
  const cart: { id: string; q: number }[] = [];
  const summary: string[] = [];
  for (const item of items) {
    const product = productById(String(item?.id));
    const quantity = Math.max(1, Math.min(99, Math.floor(Number(item?.quantity)) || 0));
    if (!product || quantity <= 0) {
      return NextResponse.json({ error: "One of the items is no longer available." }, { status: 400 });
    }
    amount += product.amount * quantity;
    cart.push({ id: product.id, q: quantity });
    summary.push(`${quantity}x ${product.title}`);
  }

  try {
    const intent = await stripe.paymentIntents.create({
      amount,
      currency: "gbp",
      automatic_payment_methods: { enabled: true },
      description: `RM Mangoes order — ${summary.join(", ")}`,
      metadata: { cart: JSON.stringify(cart) },
    });

    return NextResponse.json({ clientSecret: intent.client_secret, amount });
  } catch (err) {
    console.error("[stripe/payment-intent] failed to create intent:", err);
    return NextResponse.json(
      { error: "Sorry, we couldn't start checkout. Please try again." },
      { status: 502 }
    );
  }
}
