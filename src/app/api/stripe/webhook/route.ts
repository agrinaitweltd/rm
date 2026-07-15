import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { productById } from "@/lib/site";

// Stripe needs the raw, unparsed body to verify the signature, so this route
// must run on the Node.js runtime and read the body as text.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret || !process.env.STRIPE_SECRET_KEY) {
    console.error("[stripe/webhook] missing STRIPE_WEBHOOK_SECRET / STRIPE_SECRET_KEY");
    return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const rawBody = await request.text();

  let event: Stripe.Event;
  try {
    // Verifies signature + timestamp; throws on any mismatch.
    event = await stripe.webhooks.constructEventAsync(rawBody, signature, webhookSecret);
  } catch (err) {
    console.error("[stripe/webhook] signature verification failed:", (err as Error).message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "payment_intent.succeeded") {
    try {
      await handlePaymentSucceeded(event.data.object as Stripe.PaymentIntent);
    } catch (err) {
      // Return 500 so Stripe retries — we don't want to silently drop an order.
      console.error("[stripe/webhook] failed to persist order:", err);
      return NextResponse.json({ error: "Processing failed" }, { status: 500 });
    }
  }

  // Acknowledge all other event types so Stripe stops retrying them.
  return NextResponse.json({ received: true });
}

async function handlePaymentSucceeded(intent: Stripe.PaymentIntent) {
  const supabase = createAdminClient();

  // Idempotency: Stripe may deliver the same event more than once.
  const { data: existing } = await supabase
    .from("orders")
    .select("id")
    .eq("stripe_payment_intent", intent.id)
    .maybeSingle();
  if (existing) return;

  // Contact details: receipt_email is set at confirmation time by the checkout
  // page; shipping comes from the Address Element.
  const ship = intent.shipping;
  const resolvedEmail = intent.receipt_email || "unknown@rmmangoes.co.uk";
  const deliveryName = ship?.name || "";
  const phone = ship?.phone || "";

  // ── customer (create if new, by email) ────────────────────────────────────
  const { data: customer, error: customerErr } = await supabase
    .from("customers")
    .upsert(
      { full_name: deliveryName, email: resolvedEmail, phone },
      { onConflict: "email", ignoreDuplicates: false }
    )
    .select("id")
    .single();

  let customerId = customer?.id as string | undefined;
  if (!customerId) {
    // Fall back to a lookup in case the upsert raced with another delivery.
    const { data: found } = await supabase
      .from("customers")
      .select("id")
      .eq("email", resolvedEmail)
      .maybeSingle();
    if (!found) throw customerErr || new Error("Could not resolve customer");
    customerId = found.id;
  }

  // ── order ─────────────────────────────────────────────────────────────────
  const addr = ship?.address;
  const { data: order, error: orderErr } = await supabase
    .from("orders")
    .insert({
      customer_id: customerId,
      stripe_session_id: null,
      stripe_payment_intent: intent.id,
      total: intent.amount_received || intent.amount,
      currency: intent.currency ?? "gbp",
      payment_status: "paid",
      order_status: "Pending",
      delivery_name: deliveryName,
      delivery_phone: phone,
      delivery_address: [addr?.line1, addr?.line2].filter(Boolean).join(", ") || null,
      delivery_city: addr?.city ?? null,
      delivery_county: addr?.state ?? null,
      delivery_postcode: addr?.postal_code ?? null,
      delivery_country: addr?.country ?? null,
    })
    .select("id")
    .single();

  if (orderErr || !order) throw orderErr || new Error("Could not create order");

  // ── order items (from PI metadata, priced by the server catalogue) ────────
  let cart: { id: string; q: number }[] = [];
  try {
    cart = JSON.parse(intent.metadata?.cart || "[]");
  } catch {
    cart = [];
  }

  const items = cart
    .map((line) => {
      const product = productById(line.id);
      const quantity = Math.max(1, Math.floor(line.q) || 1);
      if (!product) return null;
      return {
        order_id: order.id,
        product_name: product.title,
        quantity,
        unit_price: product.amount,
        total_price: product.amount * quantity,
      };
    })
    .filter((i): i is NonNullable<typeof i> => i !== null);

  if (items.length > 0) {
    const { error: itemsErr } = await supabase.from("order_items").insert(items);
    if (itemsErr) throw itemsErr;
  }
}
