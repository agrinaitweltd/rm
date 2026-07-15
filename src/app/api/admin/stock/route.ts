import { NextResponse } from "next/server";
import { isAdminAuthed } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { productById } from "@/lib/site";

export const runtime = "nodejs";

// Admin sets an absolute stock level for one product.
export async function POST(request: Request) {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { productId?: string; stock?: number };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const productId = String(body.productId || "");
  const stock = Math.floor(Number(body.stock));
  if (!productById(productId) || !Number.isFinite(stock) || stock < 0 || stock > 100000) {
    return NextResponse.json({ error: "Invalid product or stock value." }, { status: 400 });
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
