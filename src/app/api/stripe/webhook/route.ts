import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";

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

  if (event.type === "checkout.session.completed") {
    try {
      await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
    } catch (err) {
      // Return 500 so Stripe retries — we don't want to silently drop an order.
      console.error("[stripe/webhook] failed to persist order:", err);
      return NextResponse.json({ error: "Processing failed" }, { status: 500 });
    }
  }

  // Acknowledge all other event types so Stripe stops retrying them.
  return NextResponse.json({ received: true });
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const supabase = createAdminClient();

  // Idempotency: if this session was already recorded, do nothing (Stripe may
  // deliver the same event more than once).
  const { data: existing } = await supabase
    .from("orders")
    .select("id")
    .eq("stripe_session_id", session.id)
    .maybeSingle();
  if (existing) return;

  // Pull line items from Stripe (source of truth for what was paid).
  const lineItems = await stripe.checkout.sessions.listLineItems(session.id, { limit: 100 });

  const email =
    session.customer_details?.email || session.customer_email || "unknown@rmmangoes.co.uk";
  const fullName = session.customer_details?.name || "";
  const phone = session.customer_details?.phone || "";

  // Delivery address (shipping if collected, else billing).
  const ship =
    session.collected_information?.shipping_details?.address ||
    session.customer_details?.address ||
    null;
  const deliveryName =
    session.collected_information?.shipping_details?.name || fullName || "";

  // ── customer (create if new, by email) ────────────────────────────────────
  const { data: customer, error: customerErr } = await supabase
    .from("customers")
    .upsert(
      { full_name: fullName || deliveryName, email, phone },
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
      .eq("email", email)
      .maybeSingle();
    if (!found) throw customerErr || new Error("Could not resolve customer");
    customerId = found.id;
  }

  const paymentIntentId =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : session.payment_intent?.id || null;

  // ── order ─────────────────────────────────────────────────────────────────
  const { data: order, error: orderErr } = await supabase
    .from("orders")
    .insert({
      customer_id: customerId,
      stripe_session_id: session.id,
      stripe_payment_intent: paymentIntentId,
      total: session.amount_total ?? 0,
      currency: session.currency ?? "gbp",
      payment_status: session.payment_status ?? "unpaid",
      order_status: "Pending",
      delivery_name: deliveryName,
      delivery_phone: phone,
      delivery_address: [ship?.line1, ship?.line2].filter(Boolean).join(", ") || null,
      delivery_city: ship?.city ?? null,
      delivery_county: ship?.state ?? null,
      delivery_postcode: ship?.postal_code ?? null,
      delivery_country: ship?.country ?? null,
    })
    .select("id")
    .single();

  if (orderErr || !order) throw orderErr || new Error("Could not create order");

  // ── order items ───────────────────────────────────────────────────────────
  const items = lineItems.data.map((li) => {
    const quantity = li.quantity ?? 1;
    const totalPrice = li.amount_total ?? 0;
    return {
      order_id: order.id,
      product_name: li.description ?? "Mango box",
      quantity,
      unit_price: quantity > 0 ? Math.round(totalPrice / quantity) : totalPrice,
      total_price: totalPrice,
    };
  });

  if (items.length > 0) {
    const { error: itemsErr } = await supabase.from("order_items").insert(items);
    if (itemsErr) throw itemsErr;
  }
}
