import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireStoreKey, isGuardResponse } from "@/lib/mobile/guard";
import { findAuthUserByEmail } from "@/lib/mobile/otp";

export const runtime = "nodejs";

// A verified-OTP row counts as proof of email ownership for this long —
// matches how long a user is expected to take between verifying the code
// and finishing the rest of the signup form.
const VERIFICATION_VALID_MINUTES = 30;

export async function POST(request: Request) {
  const guard = requireStoreKey(request);
  if (isGuardResponse(guard)) return guard;

  let body: { email?: string; password?: string; full_name?: string; phone?: string; country?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const email = String(body.email || "").trim().toLowerCase().slice(0, 200);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Please provide a valid email address." }, { status: 400 });
  }
  if (!body.password || body.password.length < 6) {
    return NextResponse.json({ error: "Password must be at least 6 characters." }, { status: 400 });
  }
  const fullName = String(body.full_name || "").trim().slice(0, 200);
  if (!fullName) {
    return NextResponse.json({ error: "Please provide your name." }, { status: 400 });
  }

  const supabase = createAdminClient();

  const since = new Date(Date.now() - VERIFICATION_VALID_MINUTES * 60_000).toISOString();
  const { data: verified, error: verifiedErr } = await supabase
    .from("otp_codes")
    .select("id")
    .eq("email", email)
    .eq("purpose", "signup")
    .not("consumed_at", "is", null)
    .gte("consumed_at", since)
    .order("consumed_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (verifiedErr) {
    console.error("[mobile/signup/complete] verification lookup failed:", verifiedErr);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
  if (!verified) {
    return NextResponse.json({ error: "Please verify your email again." }, { status: 400 });
  }

  const existing = await findAuthUserByEmail(supabase, email);
  if (existing) {
    if (existing.email_confirmed_at) {
      return NextResponse.json(
        { error: "An account with this email already exists. Try signing in instead." },
        { status: 400 }
      );
    }
    // Unconfirmed leftover from an abandoned old-style signup — clear it so
    // createUser below doesn't collide on the unique email constraint.
    const { error: deleteErr } = await supabase.auth.admin.deleteUser(existing.id);
    if (deleteErr) {
      console.error("[mobile/signup/complete] failed to clear stale unconfirmed user:", deleteErr);
      return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
    }
  }

  const { error: createErr } = await supabase.auth.admin.createUser({
    email,
    password: body.password,
    phone: body.phone || undefined,
    email_confirm: true,
    user_metadata: { full_name: fullName, country: body.country || null },
  });
  if (createErr) {
    console.error("[mobile/signup/complete] failed to create user:", createErr);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
