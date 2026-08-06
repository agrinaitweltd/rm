import { NextResponse } from "next/server";
import { isAdminAuthed } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { dispatchWebhookEvent } from "@/lib/mobile/webhooks";

export const runtime = "nodejs";

const ALLOWED = ["Pending", "Confirmed", "Packing", "Dispatched", "Delivered", "Cancelled"];

export async function POST(request: Request) {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { orderId?: string; status?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const { orderId, status } = body;
  if (!orderId || !status || !ALLOWED.includes(status)) {
    return NextResponse.json({ error: "Invalid order or status." }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { data: previous } = await supabase.from("orders").select("order_status").eq("id", orderId).maybeSingle();

  const { error } = await supabase.from("orders").update({ order_status: status }).eq("id", orderId);
  if (error) {
    return NextResponse.json({ error: "Update failed." }, { status: 500 });
  }

  await dispatchWebhookEvent("order.status_changed", {
    orderId,
    previousStatus: previous?.order_status ?? null,
    status,
  });

  return NextResponse.json({ ok: true });
}
