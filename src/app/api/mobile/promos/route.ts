import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireStoreKey, isGuardResponse } from "@/lib/mobile/guard";
import { requireAdminUser, isAdminGuardResponse } from "@/lib/mobile/admin-guard";

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

// Admin-authenticated: creates a new promo code in the real promotions
// table (promo_codes) — not mobile_promos, which is just the app's cache
// pushed by the scheduled sync job.
export async function POST(request: Request) {
  const storeGuard = requireStoreKey(request);
  if (isGuardResponse(storeGuard)) return storeGuard;
  const adminGuard = await requireAdminUser(request);
  if (isAdminGuardResponse(adminGuard)) return adminGuard;

  let body: { code?: string; type?: "percent" | "fixed"; value?: number; max_uses?: number };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const code = String(body.code || "").trim().toUpperCase().replace(/\s+/g, "");
  const type = body.type === "fixed" ? "fixed" : body.type === "percent" ? "percent" : null;
  const value = Math.floor(Number(body.value));
  if (!code || code.length < 3 || code.length > 30 || !/^[A-Z0-9-]+$/.test(code)) {
    return NextResponse.json({ error: "Code must be 3-30 letters/numbers." }, { status: 400 });
  }
  if (!type || !Number.isFinite(value) || value <= 0 || (type === "percent" && value > 100)) {
    return NextResponse.json({ error: "Invalid discount type or value." }, { status: 400 });
  }
  const maxUses = body.max_uses ? Math.floor(Number(body.max_uses)) : null;
  if (maxUses !== null && (!Number.isFinite(maxUses) || maxUses <= 0)) {
    return NextResponse.json({ error: "Invalid max uses." }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { error } = await supabase.from("promo_codes").insert({ code, type, value, max_uses: maxUses });
  if (error) {
    const msg = error.code === "23505" ? "That code already exists." : "Could not create the code.";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
  return NextResponse.json({ ok: true });
}
