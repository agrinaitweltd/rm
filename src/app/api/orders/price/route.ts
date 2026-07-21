import { NextResponse } from "next/server";
import { priceCart, assertStock, OrderError, type CheckoutItem } from "@/lib/order-pricing";

export const runtime = "nodejs";

// Server-authoritative price preview for the cash-on-delivery form — same
// pricing/promo/stock logic as the card PaymentIntent route, but without
// creating anything in Stripe (there's nothing to charge for a cash order).
export async function POST(request: Request) {
  let body: { items?: CheckoutItem[]; promoCode?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  try {
    const priced = await priceCart(body.items || [], body.promoCode);
    await assertStock(priced.cart);
    return NextResponse.json({
      amount: priced.total,
      discount: priced.discount,
      promoLabel: priced.promoLabel,
    });
  } catch (err) {
    if (err instanceof OrderError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    throw err;
  }
}
