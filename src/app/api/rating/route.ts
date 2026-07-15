import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

// Stores a post-payment site rating (1-10 stars, optional comment).
// Insert-only via the service role; the table has no public policies.
export async function POST(request: Request) {
  let body: { stars?: number; comment?: string; paymentIntent?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const stars = Math.floor(Number(body.stars));
  if (!Number.isFinite(stars) || stars < 1 || stars > 10) {
    return NextResponse.json({ error: "Please pick between 1 and 10 stars." }, { status: 400 });
  }
  const comment = String(body.comment || "").trim().slice(0, 1000) || null;
  const paymentIntent = String(body.paymentIntent || "").slice(0, 100) || null;

  try {
    const supabase = createAdminClient();
    const { error } = await supabase
      .from("ratings")
      .insert({ stars, comment, stripe_payment_intent: paymentIntent });
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[rating] insert failed:", err);
    return NextResponse.json({ error: "Sorry, we couldn't save your rating." }, { status: 500 });
  }
}
