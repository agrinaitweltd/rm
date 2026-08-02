import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireStoreKey, isGuardResponse } from "@/lib/mobile/guard";

export const runtime = "nodejs";

// Registers (or re-registers) the calling app install against the API key it
// authenticated with. Upserted by (api_key_id, device_id), so re-registering
// on every app launch is cheap and idempotent — it just refreshes metadata
// and last_sync_at.
export async function POST(request: Request) {
  const guard = requireStoreKey(request);
  if (isGuardResponse(guard)) return guard;

  let body: { deviceId?: string; deviceName?: string; platform?: string; appVersion?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const deviceId = String(body.deviceId || "").trim().slice(0, 200);
  if (!deviceId) {
    return NextResponse.json({ error: "deviceId is required." }, { status: 400 });
  }
  const platform = String(body.platform || "").trim().slice(0, 20) || null;
  if (platform && !["ios", "android"].includes(platform)) {
    return NextResponse.json({ error: "platform must be 'ios' or 'android'." }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { error } = await supabase.from("mobile_devices").upsert(
    {
      api_key_id: guard.keyId,
      device_id: deviceId,
      device_name: String(body.deviceName || "").trim().slice(0, 200) || null,
      platform,
      app_version: String(body.appVersion || "").trim().slice(0, 40) || null,
      last_sync_at: new Date().toISOString(),
      disconnected_at: null,
    },
    { onConflict: "api_key_id,device_id" }
  );
  if (error) {
    return NextResponse.json({ error: "Could not register device." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
