"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { loadStripe, type StripeElementsOptions } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  AddressElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { useCart, formatGBP } from "@/components/cart/CartProvider";
import { DELIVERY_FEE_PENCE } from "@/lib/site";

// Publishable key is public by design; the secret key never leaves the server.
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "");

// Payment Element appearance tuned to the site's dark brand look.
const appearance: StripeElementsOptions["appearance"] = {
  theme: "night",
  variables: {
    colorPrimary: "#7aa82d",
    colorBackground: "#000000",
    colorText: "#f4f4f4",
    colorDanger: "#ff8d8d",
    borderRadius: "10px",
    fontFamily: "Helvetica, Arial, sans-serif",
    fontSizeBase: "15px",
  },
  rules: {
    ".Input": { border: "1px solid rgba(255, 255, 255, 0.18)" },
    ".Input:focus": {
      border: "1px solid #7aa82d",
      boxShadow: "0 0 0 3px rgba(122, 168, 45, 0.25)",
    },
    ".Label": { color: "#7aa82d" },
  },
};

function PayForm({ amount }: { amount: number }) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;
    setError("");

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address for your receipt.");
      return;
    }

    setSubmitting(true);
    const { error: confirmError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout/success`,
        receipt_email: email,
      },
      // Card payments complete without leaving the page; bank redirects
      // (if ever enabled) come back to the success page.
      redirect: "if_required",
    });

    if (confirmError) {
      // Card declined, validation problem, etc. Cart stays exactly as it was.
      setError(confirmError.message || "Payment failed. Please try again.");
      setSubmitting(false);
      return;
    }

    router.push("/checkout/success");
  }

  return (
    <form className="rm-pay-form" onSubmit={handleSubmit}>
      <label className="rm-pay-email">
        Email (for your receipt) *
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
          maxLength={200}
        />
      </label>

      <h3 className="rm-pay-section-title">Delivery address</h3>
      <AddressElement
        options={{
          mode: "shipping",
          allowedCountries: ["GB", "IE"],
          fields: { phone: "always" },
          validation: { phone: { required: "always" } },
        }}
      />

      <h3 className="rm-pay-section-title">Payment</h3>
      <PaymentElement />

      {error && (
        <p className="rm-pay-error" role="alert">
          {error}
        </p>
      )}

      <button type="submit" className="rm-pay-button" disabled={!stripe || submitting}>
        {submitting ? "Processing…" : `Pay Now — ${formatGBP(amount)}`}
      </button>
      <p className="rm-pay-note">Payments are processed securely by Stripe. Your card details never touch our servers.</p>
    </form>
  );
}

export default function CheckoutClient() {
  const { lines, totalPence, productFor } = useCart();
  const [clientSecret, setClientSecret] = useState("");
  const [amount, setAmount] = useState(0);
  const [loadError, setLoadError] = useState("");
  const [hydrated, setHydrated] = useState(false);
  const requested = useRef(false);

  useEffect(() => setHydrated(true), []);

  // Create the PaymentIntent once the (localStorage-hydrated) cart is known.
  useEffect(() => {
    if (!hydrated || lines.length === 0 || requested.current) return;
    requested.current = true;
    fetch("/api/stripe/payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: lines }),
    })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (res.ok && data.clientSecret) {
          setClientSecret(data.clientSecret);
          setAmount(data.amount);
        } else {
          setLoadError(data.error || "Sorry, we couldn't start checkout. Please try again.");
        }
      })
      .catch(() => setLoadError("Sorry, we couldn't start checkout. Please check your connection."));
  }, [hydrated, lines]);

  const options = useMemo<StripeElementsOptions | null>(
    () => (clientSecret ? { clientSecret, appearance } : null),
    [clientSecret]
  );

  if (!hydrated) {
    return <p className="rm-pay-loading">Loading your cart…</p>;
  }

  if (lines.length === 0) {
    return (
      <div className="rm-checkout-status">
        <div className="rm-checkout-card">
          <div className="rm-soon-emoji" aria-hidden="true">🥭</div>
          <h1>Your cart is empty</h1>
          <p>Add a box of premium Pakistani mangoes and come back.</p>
          <Link href="/products" className="rm-checkout-cta">
            Browse mangoes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="rm-checkout-layout">
      {/* Order summary */}
      <aside className="rm-checkout-summary">
        <h2>Order Summary</h2>
        <p className="rm-checkout-business">RM Mangoes — King Of Mangoes</p>
        <ul>
          {lines.map((line) => {
            const p = productFor(line.id);
            if (!p) return null;
            return (
              <li key={line.id}>
                <img src={p.image} alt="" />
                <span className="rm-checkout-summary-title">
                  {p.title} <em>× {line.quantity}</em>
                </span>
                <span className="rm-checkout-summary-price">{formatGBP(p.amount * line.quantity)}</span>
              </li>
            );
          })}
        </ul>
        <div className="rm-checkout-summary-sub">
          <span>Subtotal</span>
          <span>{formatGBP(totalPence)}</span>
        </div>
        <div className="rm-checkout-summary-sub">
          <span>Delivery</span>
          <span>{formatGBP(DELIVERY_FEE_PENCE)}</span>
        </div>
        <div className="rm-checkout-summary-total">
          <span>Total</span>
          <span>{formatGBP(totalPence + DELIVERY_FEE_PENCE)}</span>
        </div>
        <Link href="/products" className="rm-checkout-edit">
          Edit cart
        </Link>
      </aside>

      {/* Payment */}
      <section className="rm-checkout-payment">
        {loadError ? (
          <p className="rm-pay-error" role="alert">
            {loadError}
          </p>
        ) : options ? (
          <Elements stripe={stripePromise} options={options}>
            <PayForm amount={amount} />
          </Elements>
        ) : (
          <p className="rm-pay-loading">Preparing secure payment…</p>
        )}
      </section>
    </div>
  );
}
