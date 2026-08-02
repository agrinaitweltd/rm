import { NextResponse } from "next/server";
import { isAdminAuthed } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { generateApiKey, sha256Hex, keyPrefix } from "@/lib/mobile/crypto";

export const runtime = "nodejs";

// Current key status + connection summary for the Store Connection panel.
// Never returns the raw key — only what was stored (hash aside, which also
// never leaves the server).
export async function GET() {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createAdminClient();
  const { data: keyRow } = await supabase
    .from("store_api_keys")
    .select("id, label, key_prefix, created_at, last_used_at, revoked_at")
    .is("revoked_at", null)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  let connectedDevices = 0;
  let lastSync: string | null = null;
  if (keyRow) {
    const { count } = await supabase
      .from("mobile_devices")
      .select("id", { count: "exact", head: true })
      .eq("api_key_id", keyRow.id)
      .is("disconnected_at", null);
    connectedDevices = count ?? 0;

    const { data: lastDevice } = await supabase
      .from("mobile_devices")
      .select("last_sync_at")
      .eq("api_key_id", keyRow.id)
      .order("last_sync_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    lastSync = lastDevice?.last_sync_at ?? null;
  }

  return NextResponse.json({
    key: keyRow
      ? {
          id: keyRow.id,
          label: keyRow.label,
          keyPrefix: keyRow.key_prefix,
          createdAt: keyRow.created_at,
          lastUsedAt: keyRow.last_used_at,
        }
      : null,
    connectedDevices,
    lastSync,
  });
}

// action: "generate" (only when no active key exists) | "regenerate" (revoke
// current + issue a new one) | "revoke" (disable, no replacement).
export async function POST(request: Request) {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { action?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const action = body.action;
  if (!["generate", "regenerate", "revoke"].includes(action || "")) {
    return NextResponse.json({ error: "action must be generate, regenerate or revoke." }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { data: activeKey } = await supabase
    .from("store_api_keys")
    .select("id")
    .is("revoked_at", null)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (action === "generate" && activeKey) {
    return NextResponse.json(
      { error: "A key already exists. Use regenerate to replace it." },
      { status: 409 }
    );
  }

  if (action === "revoke") {
    if (!activeKey) {
      return NextResponse.json({ error: "No active key to revoke." }, { status: 404 });
    }
    const { error } = await supabase
      .from("store_api_keys")
      .update({ revoked_at: new Date().toISOString() })
      .eq("id", activeKey.id);
    if (error) return NextResponse.json({ error: "Revoke failed." }, { status: 500 });
    return NextResponse.json({ ok: true });
  }

  // generate / regenerate
  if (action === "regenerate" && activeKey) {
    const { error: revokeErr } = await supabase
      .from("store_api_keys")
      .update({ revoked_at: new Date().toISOString() })
      .eq("id", activeKey.id);
    if (revokeErr) return NextResponse.json({ error: "Could not rotate key." }, { status: 500 });
  }

  const rawKey = generateApiKey();
  const keyHash = await sha256Hex(rawKey);
  const { data: created, error: createErr } = await supabase
    .from("store_api_keys")
    .insert({ label: "Mobile App", key_hash: keyHash, key_prefix: keyPrefix(rawKey) })
    .select("id, label, key_prefix, created_at")
    .single();
  if (createErr || !created) {
    return NextResponse.json({ error: "Could not generate key." }, { status: 500 });
  }

  return NextResponse.json({
    rawKey,
    key: {
      id: created.id,
      label: created.label,
      keyPrefix: created.key_prefix,
      createdAt: created.created_at,
      lastUsedAt: null,
    },
  });
}
