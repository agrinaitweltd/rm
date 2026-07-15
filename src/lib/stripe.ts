import Stripe from "stripe";

// Server-only Stripe client. STRIPE_SECRET_KEY must never reach the browser.
const secretKey = process.env.STRIPE_SECRET_KEY;

if (!secretKey && process.env.NODE_ENV === "production") {
  // Surfaced in server logs, not to the client.
  console.error("[stripe] STRIPE_SECRET_KEY is not set");
}

export const stripe = new Stripe(secretKey || "", {
  // Pin to the version bundled with the installed SDK for predictable behaviour.
  apiVersion: "2026-06-24.dahlia",
  appInfo: { name: "RM Mangoes", url: "https://rmmangoes.co.uk" },
});

// Absolute base URL for building Stripe success/cancel redirects.
export function getBaseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "") ||
    "https://rmmangoes.co.uk"
  );
}
