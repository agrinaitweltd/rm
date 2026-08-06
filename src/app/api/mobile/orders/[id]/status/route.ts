import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireStoreKey, isGuardResponse } from "@/lib/mobile/guard";
import { dispatchWebhookEvent } from "@/lib/mobile/webhooks";

export const runtime = "nodejs";

const STATUSES = ["Pending", "Confirmed", "Packing", "Dispatched", "Delivered", "Cancelled"];

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const guard = requireStoreKey(request);
  if (isGuardResponse(guard)) return guard;

  const { id } = await params;
  let body: { status?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const status = String(body.status || "");
  if (!STATUSES.includes(status)) {
    return NextResponse.json({ error: "Invalid status." }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { data: previous } = await supabase.from("orders").select("order_status").eq("id", id).maybeSingle();

  const { data, error } = await supabase
    .from("orders")
    .update({ order_status: status })
    .eq("id", id)
    .select("id")
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: "Update failed." }, { status: 500 });
  }
  if (!data) {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }

  await dispatchWebhookEvent("order.status_changed", {
    orderId: id,
    previousStatus: previous?.order_status ?? null,
    status,
  });

  return NextResponse.json({ ok: true });
}
