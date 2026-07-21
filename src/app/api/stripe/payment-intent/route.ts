import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { priceCart, assertStock, OrderError, type CheckoutItem } from "@/lib/order-pricing";

export const runtime = "nodejs";

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

  let body: { items?: CheckoutItem[]; promoCode?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  let priced;
  try {
    priced = await priceCart(body.items || [], body.promoCode);
    await assertStock(priced.cart);
  } catch (err) {
    if (err instanceof OrderError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    throw err;
  }

  const { cart, summary, discount, promoLabel, promoCode, total } = priced;

  try {
    const intent = await stripe.paymentIntents.create({
      amount: total,
      currency: "gbp",
      automatic_payment_methods: { enabled: true },
      description: `RM Mangoes order — ${summary.join(", ")}`,
      metadata: {
        cart: JSON.stringify(cart),
        ...(discount > 0 ? { promo: promoCode.toUpperCase(), discount: String(discount) } : {}),
      },
    });

    return NextResponse.json({
      clientSecret: intent.client_secret,
      amount: total,
      discount,
      promoLabel,
    });
  } catch (err) {
    console.error("[stripe/payment-intent] failed to create intent:", err);
    return NextResponse.json(
      { error: "Sorry, we couldn't start checkout. Please try again." },
      { status: 502 }
    );
  }
}
