import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireStoreKey, isGuardResponse } from "@/lib/mobile/guard";
import { requireAdminUser, isAdminGuardResponse } from "@/lib/mobile/admin-guard";

export const runtime = "nodejs";

export async function PATCH(request: Request, { params }: { params: Promise<{ code: string }> }) {
  const storeGuard = requireStoreKey(request);
  if (isGuardResponse(storeGuard)) return storeGuard;
  const adminGuard = await requireAdminUser(request);
  if (isAdminGuardResponse(adminGuard)) return adminGuard;

  const { code } = await params;
  let body: { active?: boolean };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  if (typeof body.active !== "boolean") {
    return NextResponse.json({ error: "Missing active." }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("promo_codes")
    .update({ active: body.active })
    .eq("code", decodeURIComponent(code).toUpperCase());
  if (error) {
    return NextResponse.json({ error: "Update failed." }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request, { params }: { params: Promise<{ code: string }> }) {
  const storeGuard = requireStoreKey(request);
  if (isGuardResponse(storeGuard)) return storeGuard;
  const adminGuard = await requireAdminUser(request);
  if (isAdminGuardResponse(adminGuard)) return adminGuard;

  const { code } = await params;
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("promo_codes")
    .delete()
    .eq("code", decodeURIComponent(code).toUpperCase());
  if (error) {
    return NextResponse.json({ error: "Delete failed." }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
