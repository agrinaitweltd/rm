import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { stripe } from "@/lib/stripe";
import { requireStoreKey, isGuardResponse } from "@/lib/mobile/guard";
import { requireAdminUser, isAdminGuardResponse } from "@/lib/mobile/admin-guard";

export const runtime = "nodejs";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const storeGuard = requireStoreKey(request);
  if (isGuardResponse(storeGuard)) return storeGuard;
  const adminGuard = await requireAdminUser(request);
  if (isAdminGuardResponse(adminGuard)) return adminGuard;

  const { id } = await params;
  let body: { amount?: number };
  try {
    body = request.headers.get("content-length") === "0" ? {} : await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { data: order, error: orderErr } = await supabase
    .from("orders")
    .select("id, total, payment_method, payment_status, stripe_payment_intent")
    .eq("id", id)
    .maybeSingle();

  if (orderErr) {
    return NextResponse.json({ error: "Could not look up the order." }, { status: 500 });
  }
  if (!order) {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }
  if (order.payment_method !== "card" || !order.stripe_payment_intent) {
    return NextResponse.json({ error: "This order wasn't paid by card." }, { status: 400 });
  }
  if (order.payment_status === "refunded") {
    return NextResponse.json({ error: "This order has already been refunded." }, { status: 400 });
  }
  if (order.payment_status !== "paid" && order.payment_status !== "partially_refunded") {
    return NextResponse.json({ error: "This order isn't eligible for a refund." }, { status: 400 });
  }

  const amount = body.amount != null ? Math.floor(Number(body.amount)) : order.total;
  if (!Number.isFinite(amount) || amount <= 0 || amount > order.total) {
    return NextResponse.json({ error: "Invalid refund amount." }, { status: 400 });
  }

  try {
    await stripe.refunds.create({
      payment_intent: order.stripe_payment_intent,
      amount,
    });
  } catch (err) {
    console.error("[mobile/orders/refund] Stripe refund failed:", err);
    return NextResponse.json({ error: "Refund failed. Please try again." }, { status: 502 });
  }

  const newStatus = amount >= order.total ? "refunded" : "partially_refunded";
  const { error: updateErr } = await supabase
    .from("orders")
    .update({ payment_status: newStatus })
    .eq("id", id);
  if (updateErr) {
    // The refund already happened on Stripe's side — this only affects our
    // own record of it, so surface it but don't imply the refund failed.
    console.error("[mobile/orders/refund] refund succeeded but status update failed:", updateErr);
  }

  return NextResponse.json({ ok: true });
}
