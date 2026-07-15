import { createClient } from "@supabase/supabase-js";

// Service-role Supabase client for trusted server code ONLY (Stripe webhook,
// admin dashboard). Bypasses RLS, so it must never be imported into client
// components. Accepts either the legacy service_role JWT or a new sb_secret_ key.
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error("Supabase admin client requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY");
  }
  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
