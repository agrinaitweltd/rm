import { createBrowserClient } from "@supabase/ssr";

// Browser Supabase client (official SSR approach). Uses only public keys.
// RLS denies anon access to the order tables, so this client cannot read PII —
// it exists to satisfy the standard SSR setup and future public reads.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );
}
