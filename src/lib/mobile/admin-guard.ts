import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

// On top of requireStoreKey (every device ships the same bootstrap store
// key, so it no longer implies admin) — verifies the caller's Supabase
// session token belongs to a user with profiles.role === 'admin'.
export async function requireAdminUser(request: Request): Promise<{ userId: string } | NextResponse> {
  const token = request.headers.get("x-user-token");
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createAdminClient();
  const { data: userData, error: userErr } = await supabase.auth.getUser(token);
  if (userErr || !userData.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: profile, error: profileErr } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userData.user.id)
    .maybeSingle();
  if (profileErr || profile?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return { userId: userData.user.id };
}

export function isAdminGuardResponse(v: unknown): v is NextResponse {
  return v instanceof NextResponse;
}
