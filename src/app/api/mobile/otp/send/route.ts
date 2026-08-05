import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireStoreKey, isGuardResponse } from "@/lib/mobile/guard";
import { OTP_EXPIRY_MINUTES, findAuthUserByEmail, generateOtp, hashOtp, sendOtpEmail } from "@/lib/mobile/otp";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const guard = requireStoreKey(request);
  if (isGuardResponse(guard)) return guard;

  let body: { email?: string; purpose?: "signup" | "reset"; full_name?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const email = String(body.email || "").trim().toLowerCase().slice(0, 200);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Please provide a valid email address." }, { status: 400 });
  }
  const purpose = body.purpose === "reset" ? "reset" : body.purpose === "signup" ? "signup" : null;
  if (!purpose) {
    return NextResponse.json({ error: "Invalid purpose." }, { status: 400 });
  }

  const supabase = createAdminClient();
  // No auth.users row exists yet at signup time — account creation now
  // happens later, in /api/mobile/signup/complete, once the code is verified.
  let userId: string | null = null;

  if (purpose === "reset") {
    const existing = await findAuthUserByEmail(supabase, email);
    if (!existing) {
      // Never reveal whether an email is registered.
      return NextResponse.json({ ok: true });
    }
    userId = existing.id;
  }

  const code = generateOtp();
  const codeHash = await hashOtp(code);
  const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60_000).toISOString();

  const { error: insertErr } = await supabase.from("otp_codes").insert({
    email,
    code_hash: codeHash,
    purpose,
    user_id: userId,
    expires_at: expiresAt,
  });
  if (insertErr) {
    console.error("[mobile/otp/send] failed to store OTP:", insertErr);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }

  try {
    await sendOtpEmail(email, code, purpose);
  } catch (err) {
    console.error("[mobile/otp/send] failed to send OTP email:", err);
    return NextResponse.json({ error: "Couldn't send the verification email. Please try again." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
