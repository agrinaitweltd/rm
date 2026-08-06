import type { createAdminClient } from "@/lib/supabase/admin";
import { dispatchWebhookEvent } from "@/lib/mobile/webhooks";

type AdminClient = ReturnType<typeof createAdminClient>;

// product_stock has no per-product threshold column — a flat default applies
// to the whole catalogue, which is what "low stock" means until a per-item
// threshold is added.
const LOW_STOCK_THRESHOLD = 5;

// Wraps the existing decrement_stock RPC (used verbatim across the three
// order-creation paths) with a stock.low webhook fire when the resulting
// level is at/under the threshold. Never throws — mirrors the "best effort,
// order write already succeeded" pattern the RPC call sites already use.
export async function decrementStockAndNotify(supabase: AdminClient, productId: string, qty: number) {
  const { data: ok, error } = await supabase.rpc("decrement_stock", { pid: productId, qty });
  if (error || ok === false) {
    return { ok: false as const, error };
  }

  const { data: row } = await supabase
    .from("product_stock")
    .select("stock")
    .eq("product_id", productId)
    .maybeSingle();
  if (row && row.stock <= LOW_STOCK_THRESHOLD) {
    await dispatchWebhookEvent("stock.low", { productId, stock: row.stock, threshold: LOW_STOCK_THRESHOLD });
  }

  return { ok: true as const, error: null };
}

// Wraps the existing increment_promo_use RPC with a promo.redeemed webhook.
export async function incrementPromoUseAndNotify(
  supabase: AdminClient,
  promoCode: string,
  data: { orderId: string; discount: number }
) {
  const { error } = await supabase.rpc("increment_promo_use", { promo_code: promoCode });
  if (!error) {
    await dispatchWebhookEvent("promo.redeemed", { code: promoCode.toUpperCase(), ...data });
  }
  return { error };
}
