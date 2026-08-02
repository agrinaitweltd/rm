import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireStoreKey, isGuardResponse } from "@/lib/mobile/guard";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Currently-valid promo codes only — expired/inactive/exhausted codes are
// filtered out server-side so the app never offers a code that would fail at
// checkout anyway.
export async function GET(request: Request) {
  const guard = requireStoreKey(request);
  if (isGuardResponse(guard)) return guard;

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("promo_codes")
    .select("code, type, value, starts_at, expires_at, max_uses, uses, active")
    .eq("active", true);
  if (error) {
    return NextResponse.json({ error: "Could not load promo codes." }, { status: 500 });
  }

  const now = Date.now();
  const promos = (data || []).filter((p) => {
    if (p.starts_at && new Date(p.starts_at).getTime() > now) return false;
    if (p.expires_at && new Date(p.expires_at).getTime() < now) return false;
    if (p.max_uses !== null && p.uses >= p.max_uses) return false;
    return true;
  });

  return NextResponse.json({ promos });
}
