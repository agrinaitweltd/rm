import { stripe } from "@/lib/stripe";

// Shared by the mobile order-creation route and the saved-payment-methods
// verify route so both attach orders/cards to the same Stripe Customer per
// email rather than leaving PaymentIntents anonymous.
export async function findOrCreateStripeCustomer(email: string) {
  const existing = await stripe.customers.list({ email, limit: 1 });
  if (existing.data[0]) return existing.data[0];
  return stripe.customers.create({ email });
}
