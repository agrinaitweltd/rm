import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { productById } from "@/lib/site";
import { requireStoreKey, isGuardResponse } from "@/lib/mobile/guard";
import { requireAdminUser, isAdminGuardResponse } from "@/lib/mobile/admin-guard";

export const runtime = "nodejs";

// Writes to product_stock — the real table the storefront reads — not
// mobile_products, which is just the app's periodically-synced cache.
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const storeGuard = requireStoreKey(request);
  if (isGuardResponse(storeGuard)) return storeGuard;
  const adminGuard = await requireAdminUser(request);
  if (isAdminGuardResponse(adminGuard)) return adminGuard;

  const { id: productId } = await params;
  if (!productById(productId)) {
    return NextResponse.json({ error: "Product not found." }, { status: 404 });
  }

  let body: { stock?: number };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const stock = Math.floor(Number(body.stock));
  if (!Number.isFinite(stock) || stock < 0 || stock > 100000) {
    return NextResponse.json({ error: "Invalid stock value." }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("product_stock")
    .upsert({ product_id: productId, stock, updated_at: new Date().toISOString() });
  if (error) {
    return NextResponse.json({ error: "Update failed." }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
