import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireStoreKey, isGuardResponse } from "@/lib/mobile/guard";
import { buildCatalogue } from "@/lib/mobile/catalogue";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DEFAULT_PAGE_SIZE = 100;
const MAX_PAGE_SIZE = 200;

// Full product catalogue, mirroring the website's shop grid exactly (same
// variant grouping, same live stock), so the app never drifts from what's
// actually sellable. updated_at comes from product_stock — the one place a
// product's mutable state (stock) is timestamped — so the app can do simple
// "anything changed since I last synced?" checks.
export async function GET(request: Request) {
  const guard = requireStoreKey(request);
  if (isGuardResponse(guard)) return guard;

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, Math.floor(Number(searchParams.get("page")) || 1));
  const pageSize = Math.min(
    MAX_PAGE_SIZE,
    Math.max(1, Math.floor(Number(searchParams.get("pageSize")) || DEFAULT_PAGE_SIZE))
  );
  const category = searchParams.get("category");

  const supabase = createAdminClient();
  const { data: stockRows, error } = await supabase
    .from("product_stock")
    .select("product_id, stock, updated_at");
  if (error) {
    return NextResponse.json({ error: "Could not load stock." }, { status: 500 });
  }

  const stock: Record<string, number> = {};
  const updatedAt: Record<string, string> = {};
  for (const row of stockRows || []) {
    stock[row.product_id] = row.stock;
    updatedAt[row.product_id] = row.updated_at;
  }

  let items = buildCatalogue(stock, updatedAt);
  if (category) items = items.filter((p) => p.category === category);

  const total = items.length;
  const start = (page - 1) * pageSize;
  const paged = items.slice(start, start + pageSize);

  return NextResponse.json({
    products: paged,
    pagination: {
      page,
      pageSize,
      total,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
    },
  });
}
