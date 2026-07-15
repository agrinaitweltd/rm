import { NextResponse } from "next/server";
import { isAdminAuthed } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

// Create a promo code.
export async function POST(request: Request) {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: {
    code?: string;
    type?: string;
    value?: number;
    startsAt?: string;
    expiresAt?: string;
    maxUses?: number;
  };
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
  const startsAt = body.startsAt ? new Date(body.startsAt) : null;
  const expiresAt = body.expiresAt ? new Date(body.expiresAt) : null;
  if ((startsAt && isNaN(+startsAt)) || (expiresAt && isNaN(+expiresAt))) {
    return NextResponse.json({ error: "Invalid date." }, { status: 400 });
  }
  if (startsAt && expiresAt && startsAt >= expiresAt) {
    return NextResponse.json({ error: "Expiry must be after the start date." }, { status: 400 });
  }
  const maxUses = body.maxUses ? Math.floor(Number(body.maxUses)) : null;
  if (maxUses !== null && (!Number.isFinite(maxUses) || maxUses <= 0)) {
    return NextResponse.json({ error: "Invalid max uses." }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { error } = await supabase.from("promo_codes").insert({
    code,
    type,
    value,
    starts_at: startsAt?.toISOString() ?? null,
    expires_at: expiresAt?.toISOString() ?? null,
    max_uses: maxUses,
  });
  if (error) {
    const msg = error.code === "23505" ? "That code already exists." : "Could not create the code.";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
  return NextResponse.json({ ok: true });
}

// Toggle a promo code on/off (or delete it).
export async function PUT(request: Request) {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { id?: string; active?: boolean; delete?: boolean };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  if (!body.id) {
    return NextResponse.json({ error: "Missing id." }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { error } = body.delete
    ? await supabase.from("promo_codes").delete().eq("id", body.id)
    : await supabase.from("promo_codes").update({ active: !!body.active }).eq("id", body.id);
  if (error) {
    return NextResponse.json({ error: "Update failed." }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
