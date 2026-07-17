import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { Resend } from "resend";
import { stripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { productById, site, DELIVERY_FEE_PENCE } from "@/lib/site";

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

  if (event.type === "payment_intent.payment_failed") {
    // Best-effort courtesy email (e.g. insufficient funds) — never fail the
    // webhook over it, and no order is recorded for failed payments.
    try {
      await sendPaymentFailedEmail(event.data.object as Stripe.PaymentIntent);
    } catch (err) {
      console.error("[stripe/webhook] failed-payment email error:", err);
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

  // Flat delivery charge as its own line so the admin view adds up to the total.
  items.push({
    order_id: order.id,
    product_name: "Delivery",
    quantity: 1,
    unit_price: DELIVERY_FEE_PENCE,
    total_price: DELIVERY_FEE_PENCE,
  });

  // Promo discount as a negative line, and count the use.
  const promoCode = intent.metadata?.promo || "";
  const promoDiscount = Math.floor(Number(intent.metadata?.discount)) || 0;
  if (promoCode && promoDiscount > 0) {
    items.push({
      order_id: order.id,
      product_name: `Promo code ${promoCode}`,
      quantity: 1,
      unit_price: -promoDiscount,
      total_price: -promoDiscount,
    });
    const { error: promoErr } = await supabase.rpc("increment_promo_use", {
      promo_code: promoCode,
    });
    if (promoErr) console.error("[stripe/webhook] promo use increment failed:", promoErr.message);
  }

  if (items.length > 0) {
    const { error: itemsErr } = await supabase.from("order_items").insert(items);
    if (itemsErr) throw itemsErr;
  }

  // Sync stock with the sale. Atomic (never below zero); a failure here is
  // logged but doesn't fail the webhook — the order itself is already stored.
  for (const line of cart) {
    const qty = Math.max(1, Math.floor(line.q) || 1);
    const { data: ok, error: stockErr } = await supabase.rpc("decrement_stock", {
      pid: line.id,
      qty,
    });
    if (stockErr || ok === false) {
      console.error(`[stripe/webhook] stock decrement failed for ${line.id} x${qty}:`, stockErr?.message || "insufficient stock");
    }
  }

  // Order emails are best-effort: a mail hiccup must not 500 the webhook,
  // or Stripe would retry and we'd re-check idempotency for nothing.
  try {
    await sendOrderEmails(intent, items, {
      name: deliveryName,
      email: resolvedEmail,
      phone,
      address: [addr?.line1, addr?.line2, addr?.city, addr?.state, addr?.postal_code, addr?.country]
        .filter(Boolean)
        .join(", "),
    });
  } catch (err) {
    console.error("[stripe/webhook] order emails failed:", err);
  }
}

async function sendPaymentFailedEmail(intent: Stripe.PaymentIntent) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;

  const email =
    intent.receipt_email || intent.last_payment_error?.payment_method?.billing_details?.email || "";
  const name = intent.shipping?.name || "";
  const reason = intent.last_payment_error?.message || "Your card was declined.";
  const resend = new Resend(apiKey);
  const from = process.env.WHOLESALE_FROM_EMAIL || `RM Mangoes <no-reply@rmmangoes.co.uk>`;
  const adminTo = process.env.WHOLESALE_TO_EMAIL || site.email;
  const amount = `£${(intent.amount / 100).toFixed(2)}`;

  // Let the admin know an attempt failed (useful for follow-up).
  await resend.emails.send({
    from,
    to: adminTo,
    subject: `Failed payment attempt ${amount}${name ? ` — ${name}` : ""}`,
    html: `
      <div style="font-family:Helvetica,Arial,sans-serif;color:#1e1e1e">
        <h2 style="color:#c0392b">Failed payment — RM Mangoes</h2>
        <p><strong>Amount:</strong> ${amount}<br/>
        <strong>Customer:</strong> ${esc(name) || "—"} ${esc(email) || ""}<br/>
        <strong>Reason:</strong> ${esc(reason)}<br/>
        <strong>Stripe payment:</strong> ${esc(intent.id)}</p>
      </div>`,
  });

  if (!email) return;
  await resend.emails.send({
    from,
    to: email,
    subject: "Your payment didn't go through — RM Mangoes",
    html: `
      <div style="font-family:Helvetica,Arial,sans-serif;max-width:560px;margin:0 auto;color:#1e1e1e">
        <h2 style="color:#4f8d36">Almost there${name ? `, ${esc(name.split(" ")[0])}` : ""}!</h2>
        <p>Unfortunately your payment of <strong>${amount}</strong> didn't go through:</p>
        <p style="background:#fdf2f0;border-left:4px solid #c0392b;padding:12px 16px">${esc(reason)}</p>
        <p>You haven't been charged, and your cart is saved. You can try again with the same or a different card:</p>
        <p><a href="${site.url}/checkout" style="color:#4f8d36;font-weight:bold">Return to checkout →</a></p>
        <p>Need a hand? Reach us any time:</p>
        <p>
          Phone: <a href="tel:${site.phoneTel}">${site.phoneDisplay}</a><br/>
          WhatsApp: <a href="${site.whatsapp}">message us</a><br/>
          Email: <a href="mailto:${site.email}">${site.email}</a>
        </p>
        <p style="color:#f6a200;font-weight:bold">RM Mangoes — Fresh Pakistani Produce</p>
      </div>`,
  });
}

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const gbp = (pence: number) => `£${(pence / 100).toFixed(2)}`;

async function sendOrderEmails(
  intent: Stripe.PaymentIntent,
  items: { product_name: string; quantity: number; total_price: number }[],
  customer: { name: string; email: string; phone: string; address: string }
) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;
  const resend = new Resend(apiKey);
  const from = process.env.WHOLESALE_FROM_EMAIL || `RM Mangoes <no-reply@rmmangoes.co.uk>`;
  const adminTo = process.env.WHOLESALE_TO_EMAIL || site.email;
  const total = intent.amount_received || intent.amount;

  const rows = items
    .map(
      (i) =>
        `<tr><td style="padding:6px 12px 6px 0">${esc(i.product_name)}</td><td style="padding:6px 12px">×${i.quantity}</td><td style="padding:6px 0" align="right">${gbp(i.total_price)}</td></tr>`
    )
    .join("");
  const itemsTable = `
    <table style="border-collapse:collapse;width:100%;max-width:420px;font-size:15px">${rows}
      <tr><td colspan="2" style="padding:10px 12px 0 0;border-top:1px solid #ddd"><strong>Total</strong></td>
      <td style="padding:10px 0 0;border-top:1px solid #ddd" align="right"><strong>${gbp(total)}</strong></td></tr>
    </table>`;

  // Admin notification.
  await resend.emails.send({
    from,
    to: adminTo,
    replyTo: customer.email,
    subject: `New order ${gbp(total)} — ${customer.name || customer.email}`,
    html: `
      <div style="font-family:Helvetica,Arial,sans-serif;color:#1e1e1e">
        <h2 style="color:#4f8d36">New order — RM Mangoes</h2>
        ${itemsTable}
        <h3 style="margin-top:20px">Delivery</h3>
        <p>${esc(customer.name) || "—"}<br/>${esc(customer.address) || "—"}<br/>${esc(customer.phone) || "—"}<br/>${esc(customer.email)}</p>
        <p style="color:#8b8b8b;font-size:13px">Stripe payment: ${esc(intent.id)}</p>
      </div>`,
  });

  // Customer confirmation (skip if we never got a usable email).
  if (!customer.email || customer.email.startsWith("unknown@")) return;
  await resend.emails.send({
    from,
    to: customer.email,
    subject: "Your order is confirmed — RM Mangoes",
    html: `
      <div style="font-family:Helvetica,Arial,sans-serif;max-width:560px;margin:0 auto;color:#1e1e1e">
        <h2 style="color:#4f8d36">Thank you for your order${customer.name ? `, ${esc(customer.name.split(" ")[0])}` : ""}!</h2>
        <p>Your payment was successful and your order is being prepared.</p>
        ${itemsTable}
        <h3 style="margin-top:20px">Delivering to</h3>
        <p>${esc(customer.name)}<br/>${esc(customer.address)}</p>
        <p>Questions? Reach us any time:</p>
        <p>
          Phone: <a href="tel:${site.phoneTel}">${site.phoneDisplay}</a><br/>
          WhatsApp: <a href="${site.whatsapp}">message us</a><br/>
          Email: <a href="mailto:${site.email}">${site.email}</a>
        </p>
        <p style="color:#f6a200;font-weight:bold">RM Mangoes — Fresh Pakistani Produce</p>
      </div>`,
  });
}
