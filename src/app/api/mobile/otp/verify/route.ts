import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireStoreKey, isGuardResponse } from "@/lib/mobile/guard";
import { MAX_OTP_ATTEMPTS, hashOtp } from "@/lib/mobile/otp";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const guard = requireStoreKey(request);
  if (isGuardResponse(guard)) return guard;

  let body: { email?: string; code?: string; purpose?: "signup" | "reset"; newPassword?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const email = String(body.email || "").trim().toLowerCase().slice(0, 200);
  const code = String(body.code || "").trim();
  const purpose = body.purpose === "reset" ? "reset" : body.purpose === "signup" ? "signup" : null;
  if (!email || !code || !purpose) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  if (purpose === "reset" && (!body.newPassword || body.newPassword.length < 6)) {
    return NextResponse.json({ error: "Password must be at least 6 characters." }, { status: 400 });
  }

  const supabase = createAdminClient();

  const { data: row, error: rowErr } = await supabase
    .from("otp_codes")
    .select("id, code_hash, user_id, attempts, expires_at, consumed_at")
    .eq("email", email)
    .eq("purpose", purpose)
    .is("consumed_at", null)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (rowErr) {
    console.error("[mobile/otp/verify] lookup failed:", rowErr);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
  if (!row) {
    return NextResponse.json({ error: "No pending code for this email. Request a new one." }, { status: 400 });
  }
  if (new Date(row.expires_at).getTime() < Date.now()) {
    return NextResponse.json({ error: "That code expired. Request a new one." }, { status: 400 });
  }
  if (row.attempts >= MAX_OTP_ATTEMPTS) {
    return NextResponse.json({ error: "Too many attempts. Request a new code." }, { status: 400 });
  }

  const submittedHash = await hashOtp(code);
  if (submittedHash !== row.code_hash) {
    await supabase
      .from("otp_codes")
      .update({ attempts: row.attempts + 1 })
      .eq("id", row.id);
    return NextResponse.json({ error: "Incorrect code." }, { status: 400 });
  }

  if (!row.user_id) {
    console.error("[mobile/otp/verify] matched OTP row has no user_id:", row.id);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }

  await supabase.from("otp_codes").update({ consumed_at: new Date().toISOString() }).eq("id", row.id);

  if (purpose === "signup") {
    const { data: userData, error: userErr } = await supabase.auth.admin.updateUserById(row.user_id, {
      email_confirm: true,
    });
    if (userErr) {
      console.error("[mobile/otp/verify] failed to confirm signup user:", userErr);
      return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
    }
    const { error: profileErr } = await supabase.from("profiles").upsert({
      id: row.user_id,
      full_name: userData.user?.user_metadata?.full_name ?? null,
      role: "customer",
    });
    if (profileErr) console.error("[mobile/otp/verify] failed to upsert profile:", profileErr);
  } else {
    const { error: pwErr } = await supabase.auth.admin.updateUserById(row.user_id, {
      password: body.newPassword,
    });
    if (pwErr) {
      console.error("[mobile/otp/verify] failed to update password:", pwErr);
      return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
    }
  }

  return NextResponse.json({ ok: true });
}
