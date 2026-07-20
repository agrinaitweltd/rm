// Stock is world-readable by design (RLS allows SELECT only); sold-out state
// is enforced server-side at payment time regardless of what renders here.
export async function getStock(): Promise<Record<string, number>> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/product_stock?select=product_id,stock`,
      {
        headers: { apikey: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "" },
        next: { revalidate: 60 },
      }
    );
    if (!res.ok) return {};
    const rows = (await res.json()) as { product_id: string; stock: number }[];
    return Object.fromEntries(rows.map((r) => [r.product_id, r.stock]));
  } catch {
    return {}; // fail open — payment API still enforces stock
  }
}
