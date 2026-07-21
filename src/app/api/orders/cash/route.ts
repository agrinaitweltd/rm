import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { productById, DELIVERY_FEE_PENCE } from "@/lib/site";
import { priceCart, assertStock, OrderError, type CheckoutItem } from "@/lib/order-pricing";
import { sendOrderConfirmationEmails } from "@/lib/order-emails";

export const runtime = "nodejs";

type ShippingAddress = {
  line1: string;
  line2?: string;
  city?: string;
  county?: string;
  postal_code?: string;
  country?: string;
};

// Cash-on-delivery checkout: no Stripe involved. Priced and stock-checked the
// same way as the card path (shared lib/order-pricing), then written straight
// to Supabase and stock decremented immediately — there's no webhook to wait
// for since nothing was actually charged yet.
export async function POST(request: Request) {
  let body: {
    items?: CheckoutItem[];
    promoCode?: string;
    email?: string;
    name?: string;
    phone?: string;
    address?: ShippingAddress;
    cashTendered?: number; // pounds, as typed by the customer
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const email = String(body.email || "").trim().slice(0, 200);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }
  const name = String(body.name || "").trim().slice(0, 200);
  const phone = String(body.phone || "").trim().slice(0, 50);
  const addr = body.address;
  if (!name || !phone || !addr?.line1 || !addr?.postal_code) {
    return NextResponse.json({ error: "Please complete your delivery address." }, { status: 400 });
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
  const { cart, discount, promoCode, total } = priced;

  // Cash tendered is entered in pounds on the checkout page; validate in pence.
  const cashTendered = Math.round(Number(body.cashTendered) * 100);
  if (!Number.isFinite(cashTendered) || cashTendered < total) {
    return NextResponse.json(
      { error: `Please enter at least ${(total / 100).toFixed(2)} in cash so the driver can bring the right change.` },
      { status: 400 }
    );
  }
  const changeDue = cashTendered - total;

  const supabase = createAdminClient();

  // ── customer (create if new, by email) ────────────────────────────────────
  const { data: customer, error: customerErr } = await supabase
    .from("customers")
    .upsert({ full_name: name, email, phone }, { onConflict: "email", ignoreDuplicates: false })
    .select("id")
    .single();

  let customerId = customer?.id as string | undefined;
  if (!customerId) {
    const { data: found } = await supabase.from("customers").select("id").eq("email", email).maybeSingle();
    if (!found) {
      console.error("[orders/cash] could not resolve customer:", customerErr);
      return NextResponse.json({ error: "Sorry, we couldn't place your order. Please try again." }, { status: 500 });
    }
    customerId = found.id;
  }

  // ── order ─────────────────────────────────────────────────────────────────
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
    console.error("[orders/cash] could not create order:", orderErr);
    return NextResponse.json({ error: "Sorry, we couldn't place your order. Please try again." }, { status: 500 });
  }

  // ── order items ───────────────────────────────────────────────────────────
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
    if (promoErr) console.error("[orders/cash] promo use increment failed:", promoErr.message);
  }

  const { error: itemsErr } = await supabase.from("order_items").insert(items);
  if (itemsErr) console.error("[orders/cash] failed to insert order items:", itemsErr);

  // Sync stock immediately — there's no webhook for a cash order.
  for (const line of cart) {
    const { data: ok, error: stockErr } = await supabase.rpc("decrement_stock", { pid: line.id, qty: line.q });
    if (stockErr || ok === false) {
      console.error(`[orders/cash] stock decrement failed for ${line.id} x${line.q}:`, stockErr?.message || "insufficient stock");
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
    });
  } catch (err) {
    console.error("[orders/cash] order emails failed:", err);
  }

  return NextResponse.json({ orderId: order.id, total, cashTendered, changeDue });
}
