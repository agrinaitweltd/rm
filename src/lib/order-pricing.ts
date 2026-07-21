import { createAdminClient } from "@/lib/supabase/admin";
import { productById, DELIVERY_FEE_PENCE } from "@/lib/site";

export type CheckoutItem = { id: string; quantity: number };
export type CartLine = { id: string; q: number };

export type PricedOrder = {
  cart: CartLine[];
  summary: string[];
  subtotal: number;
  discount: number;
  promoLabel: string;
  promoCode: string;
  total: number; // subtotal - discount + delivery
};

export class OrderError extends Error {
  status: number;
  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
  }
}

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

// Server-authoritative pricing shared by the card (PaymentIntent) and cash
// (pay-on-delivery) checkout paths, so the two flows can never drift apart on
// pricing, promo validation or the minimum-charge floor.
export async function priceCart(items: CheckoutItem[], promoCodeRaw?: string): Promise<PricedOrder> {
  if (!Array.isArray(items) || items.length === 0) {
    throw new OrderError("Your cart is empty.");
  }

  // Merge duplicate lines first — the stock check must see the summed
  // quantity per product, not each line in isolation.
  const merged = new Map<string, number>();
  for (const item of items) {
    const id = String(item?.id);
    const quantity = Math.max(1, Math.min(99, Math.floor(Number(item?.quantity)) || 0));
    if (!productById(id) || quantity <= 0) {
      throw new OrderError("One of the items is no longer available.");
    }
    merged.set(id, Math.min(99, (merged.get(id) || 0) + quantity));
  }

  let subtotal = 0;
  const cart: CartLine[] = [];
  const summary: string[] = [];
  for (const [id, quantity] of merged) {
    const product = productById(id)!;
    subtotal += product.amount * quantity;
    cart.push({ id, q: quantity });
    summary.push(`${quantity}x ${product.title}`);
  }

  let total = subtotal + DELIVERY_FEE_PENCE;

  const promoCode = String(promoCodeRaw || "").trim().slice(0, 50);
  let discount = 0;
  let promoLabel = "";
  if (promoCode) {
    try {
      const promo = await promoDiscount(promoCode, total);
      if (!promo) {
        throw new OrderError("That promo code isn't valid or has expired.");
      }
      discount = Math.min(promo.discount, total - 30);
      promoLabel = promo.label;
      total -= discount;
    } catch (err) {
      if (err instanceof OrderError) throw err;
      console.error("[order-pricing] promo check failed:", err);
      throw new OrderError("We couldn't check that promo code. Please try again.", 502);
    }
  }

  return { cart, summary, subtotal, discount, promoLabel, promoCode, total };
}

// Rejects (409) if any line exceeds available stock. Fails open on an
// infrastructure blip — a lookup outage shouldn't block every sale.
export async function assertStock(cart: CartLine[]): Promise<void> {
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
        throw new OrderError(
          available <= 0
            ? `Sorry, ${title} is sold out.`
            : `Sorry, only ${available} of ${title} left in stock.`,
          409
        );
      }
    }
  } catch (err) {
    if (err instanceof OrderError) throw err;
    console.error("[order-pricing] stock check failed:", err);
  }
}
