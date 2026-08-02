import { NextResponse } from "next/server";
import { isAdminAuthed } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

export async function GET() {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("mobile_devices")
    .select("id, device_name, platform, app_version, last_sync_at, created_at, disconnected_at")
    .order("last_sync_at", { ascending: false, nullsFirst: false });

  if (error) {
    return NextResponse.json({ error: "Could not load devices." }, { status: 500 });
  }

  return NextResponse.json({ devices: data || [] });
}
