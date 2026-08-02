import { NextResponse } from "next/server";
import { isAdminAuthed } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

// Disconnects a device — the key itself stays valid for any other install,
// but this device stops showing as active. It's soft-deleted (not removed)
// so it still shows in history.
export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("mobile_devices")
    .update({ disconnected_at: new Date().toISOString() })
    .eq("id", id)
    .select("id")
    .maybeSingle();

  if (error) return NextResponse.json({ error: "Disconnect failed." }, { status: 500 });
  if (!data) return NextResponse.json({ error: "Device not found." }, { status: 404 });

  return NextResponse.json({ ok: true });
}
