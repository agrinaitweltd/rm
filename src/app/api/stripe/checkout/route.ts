import { NextResponse } from "next/server";
import { stripe, getBaseUrl } from "@/lib/stripe";
import { productById } from "@/lib/site";

export const runtime = "nodejs";

type CheckoutItem = { id: string; quantity: number };

// Builds a Stripe Checkout Session from the cart. Prices are looked up from the
// server-side catalogue (src/lib/site.ts) — the amount the client sends is never
// trusted, so there is no duplicated pricing logic and no way to tamper totals.
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

  // Resolve each cart line against the authoritative catalogue.
  const lineItems: {
    quantity: number;
    price_data: {
      currency: string;
      unit_amount: number;
      product_data: { name: string; images?: string[] };
    };
  }[] = [];
  const baseUrl = getBaseUrl();

  for (const item of items) {
    const product = productById(String(item?.id));
    const quantity = Math.max(1, Math.min(99, Math.floor(Number(item?.quantity)) || 0));
    if (!product || quantity <= 0) {
      return NextResponse.json({ error: "One of the items is no longer available." }, { status: 400 });
    }
    lineItems.push({
      quantity,
      price_data: {
        currency: "gbp",
        unit_amount: product.amount, // pence, from the catalogue
        product_data: {
          name: product.title,
          images: [`${baseUrl}${product.image}`],
        },
      },
    });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      // Delivery + contact details collected by Stripe.
      billing_address_collection: "auto",
      shipping_address_collection: { allowed_countries: ["GB", "IE"] },
      phone_number_collection: { enabled: true },
      // Keep a compact record of what was ordered for the webhook/back-office.
      metadata: {
        cart: JSON.stringify(items.map((i) => ({ id: i.id, q: i.quantity }))),
      },
      success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/products?checkout=cancelled`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("[stripe/checkout] failed to create session:", err);
    return NextResponse.json(
      { error: "Sorry, we couldn't start checkout. Please try again." },
      { status: 502 }
    );
  }
}
