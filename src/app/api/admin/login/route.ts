import { NextResponse } from "next/server";
import { ADMIN_COOKIE, makeSessionToken, verifyPassword } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

const MAX_ATTEMPTS = 8;
const WINDOW_MINUTES = 15;

export async function POST(request: Request) {
  if (!process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Admin is not configured." }, { status: 503 });
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const supabase = createAdminClient();
  const since = new Date(Date.now() - WINDOW_MINUTES * 60_000).toISOString();

  // Fails open on a DB hiccup — an outage here shouldn't lock the owner out.
  try {
    const { count } = await supabase
      .from("admin_login_attempts")
      .select("id", { count: "exact", head: true })
      .eq("ip", ip)
      .gte("created_at", since);
    if ((count ?? 0) >= MAX_ATTEMPTS) {
      return NextResponse.json(
        { error: `Too many attempts. Please try again in ${WINDOW_MINUTES} minutes.` },
        { status: 429 }
      );
    }
  } catch (err) {
    console.error("[admin/login] rate-limit check failed:", err);
  }

  let body: { password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (!verifyPassword(body.password || "")) {
    const { error } = await supabase.from("admin_login_attempts").insert({ ip });
    if (error) console.error("[admin/login] failed to record attempt:", error.message);
    return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, makeSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12, // 12 hours
  });
  return res;
}
