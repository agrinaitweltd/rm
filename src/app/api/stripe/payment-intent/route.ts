import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { productById, DELIVERY_FEE_PENCE } from "@/lib/site";

export const runtime = "nodejs";

type CheckoutItem = { id: string; quantity: number };

// Validates a promo code and returns the discount in pence on the given
// order total (items + delivery). Null means invalid/expired.
async function promoDiscount(
  code: string,
  subtotal: number
): Promise<{ discount: number; label: string } | null> {
  const supabase = createAdminClient();
  const { data: promo } = await supabase
    .from("promo_codes")
    .select("code, type, value, starts_at, expires_at, max_uses, uses, active")
    .ilike("code", code)
    .maybeSingle();
  if (!promo || !promo.active) return null;
  const now = Date.now();
  if (promo.starts_at && new Date(promo.starts_at).getTime() > now) return null;
  if (promo.expires_at && new Date(promo.expires_at).getTime() < now) return null;
  if (promo.max_uses !== null && promo.uses >= promo.max_uses) return null;

  const discount =
    promo.type === "percent"
      ? Math.floor((subtotal * promo.value) / 100)
      : Math.min(promo.value, subtotal);
  if (discount <= 0) return null;
  const label =
    promo.type === "percent" ? `${promo.value}% off` : `£${(promo.value / 100).toFixed(2)} off`;
  return { discount, label };
}

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

  const items = Array.isArray(body.items) ? body.items : [];
  if (items.length === 0) {
    return NextResponse.json({ error: "Your cart is empty." }, { status: 400 });
  }

  // Merge duplicate lines first — the stock check below must see the summed
  // quantity per product, not each line in isolation.
  const merged = new Map<string, number>();
  for (const item of items) {
    const id = String(item?.id);
    const quantity = Math.max(1, Math.min(99, Math.floor(Number(item?.quantity)) || 0));
    if (!productById(id) || quantity <= 0) {
      return NextResponse.json({ error: "One of the items is no longer available." }, { status: 400 });
    }
    merged.set(id, Math.min(99, (merged.get(id) || 0) + quantity));
  }

  let amount = 0;
  const cart: { id: string; q: number }[] = [];
  const summary: string[] = [];
  for (const [id, quantity] of merged) {
    const product = productById(id)!;
    amount += product.amount * quantity;
    cart.push({ id, q: quantity });
    summary.push(`${quantity}x ${product.title}`);
  }

  // Flat delivery charge on every order.
  amount += DELIVERY_FEE_PENCE;

  // Promo code (optional): the discount applies to the WHOLE order, delivery
  // included. Stripe won't charge less than 30p, so a big discount is capped
  // just above zero rather than failing the payment.
  const promoCode = String(body.promoCode || "").trim().slice(0, 50);
  let discount = 0;
  let promoLabel = "";
  if (promoCode) {
    try {
      const promo = await promoDiscount(promoCode, amount);
      if (!promo) {
        return NextResponse.json(
          { error: "That promo code isn't valid or has expired." },
          { status: 400 }
        );
      }
      discount = Math.min(promo.discount, amount - 30);
      promoLabel = promo.label;
      amount -= discount;
    } catch (err) {
      console.error("[stripe/payment-intent] promo check failed:", err);
      return NextResponse.json(
        { error: "We couldn't check that promo code. Please try again." },
        { status: 502 }
      );
    }
  }

  // Stock check — reject before taking payment rather than after.
  try {
    const supabase = createAdminClient();
    const { data: stockRows } = await supabase
      .from("product_stock")
      .select("product_id, stock")
      .in(
        "product_id",
        cart.map((c) => c.id)
      );
    for (const line of cart) {
      const row = stockRows?.find((r) => r.product_id === line.id);
      const available = row?.stock ?? 0;
      if (available < line.q) {
        const title = productById(line.id)?.title || "One of the items";
        return NextResponse.json(
          {
            error:
              available <= 0
                ? `Sorry, ${title} is sold out.`
                : `Sorry, only ${available} of ${title} left in stock.`,
          },
          { status: 409 }
        );
      }
    }
  } catch (err) {
    // If the stock lookup itself fails, let the order through rather than
    // blocking every sale on an infrastructure blip.
    console.error("[stripe/payment-intent] stock check failed:", err);
  }

  try {
    const intent = await stripe.paymentIntents.create({
      amount,
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
      amount,
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
