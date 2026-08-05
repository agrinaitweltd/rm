import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { productById, DELIVERY_FEE_PENCE } from "@/lib/site";
import { priceCart, assertStock, OrderError, type CheckoutItem } from "@/lib/order-pricing";
import { sendOrderConfirmationEmails } from "@/lib/order-emails";
import { stripe } from "@/lib/stripe";
import { findOrCreateStripeCustomer } from "@/lib/stripe-customers";
import { requireStoreKey, isGuardResponse } from "@/lib/mobile/guard";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const STATUSES = ["Pending", "Confirmed", "Packing", "Dispatched", "Delivered", "Cancelled"];
const DEFAULT_PAGE_SIZE = 25;
const MAX_PAGE_SIZE = 100;

// The store API key is only ever handed to the merchant's own admin app, so
// gating "admin only" data is inherent to possessing the key at all — there's
// no separate customer identity in this single-vendor API.
export async function GET(request: Request) {
  const guard = requireStoreKey(request);
  if (isGuardResponse(guard)) return guard;

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const from = searchParams.get("from"); // ISO date
  const to = searchParams.get("to"); // ISO date
  const page = Math.max(1, Math.floor(Number(searchParams.get("page")) || 1));
  const pageSize = Math.min(
    MAX_PAGE_SIZE,
    Math.max(1, Math.floor(Number(searchParams.get("pageSize")) || DEFAULT_PAGE_SIZE))
  );

  if (status && !STATUSES.includes(status)) {
    return NextResponse.json({ error: "Invalid status filter." }, { status: 400 });
  }

  const supabase = createAdminClient();
  let query = supabase
    .from("orders")
    .select(
      `id, created_at, total, currency, payment_status, order_status, payment_method,
       cash_tendered, change_due, delivery_name, delivery_phone, delivery_address,
       delivery_city, delivery_county, delivery_postcode, delivery_country,
       customer:customers ( full_name, email, phone ),
       items:order_items ( product_name, quantity, unit_price, total_price )`,
      { count: "exact" }
    )
    .order("created_at", { ascending: false });

  if (status) query = query.eq("order_status", status);
  if (from) query = query.gte("created_at", from);
  if (to) query = query.lte("created_at", to);

  const start = (page - 1) * pageSize;
  query = query.range(start, start + pageSize - 1);

  const { data, error, count } = await query;
  if (error) {
    return NextResponse.json({ error: "Could not load orders." }, { status: 500 });
  }

  return NextResponse.json({
    orders: data || [],
    pagination: {
      page,
      pageSize,
      total: count ?? 0,
      totalPages: Math.max(1, Math.ceil((count ?? 0) / pageSize)),
    },
  });
}

type ShippingAddress = {
  line1: string;
  line2?: string;
  city?: string;
  county?: string;
  postal_code?: string;
  country?: string;
};

// Creates a customer order from the app. Cash orders are finalized
// immediately (same pipeline as the website's cash checkout). Card orders
// return a Stripe PaymentIntent client secret for the app to confirm with
// the Stripe SDK — the order itself is written by the existing webhook once
// payment succeeds, exactly as it already is for the website, so card orders
// never diverge into a second code path.
export async function POST(request: Request) {
  const guard = requireStoreKey(request);
  if (isGuardResponse(guard)) return guard;

  let body: {
    items?: CheckoutItem[];
    promoCode?: string;
    paymentMethod?: "cash" | "card";
    email?: string;
    name?: string;
    phone?: string;
    address?: ShippingAddress;
    cashTendered?: number;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const paymentMethod = body.paymentMethod === "card" ? "card" : "cash";

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

  if (paymentMethod === "card") {
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({ error: "Card payments aren't configured yet." }, { status: 503 });
    }
    const cardEmail = String(body.email || "").trim().toLowerCase().slice(0, 200);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cardEmail)) {
      return NextResponse.json({ error: "Please provide a valid email address." }, { status: 400 });
    }
    try {
      const customer = await findOrCreateStripeCustomer(cardEmail);
      const intent = await stripe.paymentIntents.create({
        amount: total,
        currency: "gbp",
        customer: customer.id,
        payment_method_types: ["card"],
        description: `RM Mangoes order (app) — ${summary.join(", ")}`,
        metadata: {
          cart: JSON.stringify(cart),
          ...(discount > 0 ? { promo: promoCode.toUpperCase(), discount: String(discount) } : {}),
        },
      });
      return NextResponse.json({
        paymentMethod: "card",
        clientSecret: intent.client_secret,
        amount: total,
        discount,
        promoLabel,
      });
    } catch (err) {
      console.error("[mobile/orders] failed to create PaymentIntent:", err);
      return NextResponse.json({ error: "Sorry, we couldn't start checkout. Please try again." }, { status: 502 });
    }
  }

  // ── cash on delivery — finalize immediately ────────────────────────────────
  const email = String(body.email || "").trim().toLowerCase().slice(0, 200);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Please provide a valid email address." }, { status: 400 });
  }
  const name = String(body.name || "").trim().slice(0, 200);
  const phone = String(body.phone || "").trim().slice(0, 50);
  const addr = body.address;
  if (!name || !phone || !addr?.line1 || !addr?.postal_code) {
    return NextResponse.json({ error: "Please complete the delivery address." }, { status: 400 });
  }

  const cashTendered = Math.round(Number(body.cashTendered) * 100);
  if (!Number.isFinite(cashTendered) || cashTendered < total) {
    return NextResponse.json(
      { error: `Please provide at least ${(total / 100).toFixed(2)} in cash so the driver can bring the right change.` },
      { status: 400 }
    );
  }
  const changeDue = cashTendered - total;

  const supabase = createAdminClient();

  const { data: customer, error: customerErr } = await supabase
    .from("customers")
    .upsert({ full_name: name, email, phone }, { onConflict: "email", ignoreDuplicates: false })
    .select("id")
    .single();

  let customerId = customer?.id as string | undefined;
  if (!customerId) {
    const { data: found } = await supabase.from("customers").select("id").eq("email", email).maybeSingle();
    if (!found) {
      console.error("[mobile/orders] could not resolve customer:", customerErr);
      return NextResponse.json({ error: "Sorry, we couldn't place your order. Please try again." }, { status: 500 });
    }
    customerId = found.id;
  }

  const { data: order, error: orderErr } = await supabase
    .from("orders")
    .insert({
      customer_id: customerId,
      stripe_session_id: null,
      stripe_payment_intent: null,
      total,
      currency: "gbp",
      payment_status: "cash_on_delivery",
      order_status: "Pending",
      payment_method: "cash",
      cash_tendered: cashTendered,
      change_due: changeDue,
      delivery_name: name,
      delivery_phone: phone,
      delivery_address: [addr.line1, addr.line2].filter(Boolean).join(", ") || null,
      delivery_city: addr.city ?? null,
      delivery_county: addr.county ?? null,
      delivery_postcode: addr.postal_code ?? null,
      delivery_country: addr.country ?? "GB",
    })
    .select("id")
    .single();

  if (orderErr || !order) {
    console.error("[mobile/orders] could not create order:", orderErr);
    return NextResponse.json({ error: "Sorry, we couldn't place your order. Please try again." }, { status: 500 });
  }

  const items = cart
    .map((line) => {
      const product = productById(line.id);
      if (!product) return null;
      return {
        order_id: order.id,
        product_name: product.title,
        quantity: line.q,
        unit_price: product.amount,
        total_price: product.amount * line.q,
      };
    })
    .filter((i): i is NonNullable<typeof i> => i !== null);

  items.push({
    order_id: order.id,
    product_name: "Delivery",
    quantity: 1,
    unit_price: DELIVERY_FEE_PENCE,
    total_price: DELIVERY_FEE_PENCE,
  });

  if (discount > 0) {
    items.push({
      order_id: order.id,
      product_name: `Promo code ${promoCode.toUpperCase()}`,
      quantity: 1,
      unit_price: -discount,
      total_price: -discount,
    });
    const { error: promoErr } = await supabase.rpc("increment_promo_use", { promo_code: promoCode });
    if (promoErr) console.error("[mobile/orders] promo use increment failed:", promoErr.message);
  }

  const { error: itemsErr } = await supabase.from("order_items").insert(items);
  if (itemsErr) console.error("[mobile/orders] failed to insert order items:", itemsErr);

  for (const line of cart) {
    const { data: ok, error: stockErr } = await supabase.rpc("decrement_stock", { pid: line.id, qty: line.q });
    if (stockErr || ok === false) {
      console.error(`[mobile/orders] stock decrement failed for ${line.id} x${line.q}:`, stockErr?.message || "insufficient stock");
    }
  }

  try {
    await sendOrderConfirmationEmails({
      items,
      total,
      customer: {
        name,
        email,
        phone,
        address: [addr.line1, addr.line2, addr.city, addr.county, addr.postal_code, addr.country]
          .filter(Boolean)
          .join(", "),
      },
      reference: order.id,
      paymentMethod: "cash",
      cashTendered,
      changeDue,
      orderId: order.id,
    });
  } catch (err) {
    console.error("[mobile/orders] order emails failed:", err);
  }

  return NextResponse.json({ paymentMethod: "cash", orderId: order.id, total, cashTendered, changeDue });
}
