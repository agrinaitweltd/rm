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
import ProductImg from "@/components/cart/ProductImg";
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
      {/* Scotland-only delivery: UK addresses only. */}
      <AddressElement
        options={{
          mode: "shipping",
          allowedCountries: ["GB"],
          fields: { phone: "always" },
          validation: { phone: { required: "always" } },
        }}
      />

      <h3 className="rm-pay-section-title">Payment</h3>
      {/* Wallets are explicit: Apple Pay shows in Safari on Apple devices with
          a Wallet card; Google Pay in Chrome with a saved card. */}
      <PaymentElement options={{ wallets: { applePay: "auto", googlePay: "auto" } }} />

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
  const [discount, setDiscount] = useState(0);
  const [promoLabel, setPromoLabel] = useState("");
  const [appliedPromo, setAppliedPromo] = useState("");
  const [promoInput, setPromoInput] = useState("");
  const [promoBusy, setPromoBusy] = useState(false);
  const [promoError, setPromoError] = useState("");
  const [loadError, setLoadError] = useState("");
  const [hydrated, setHydrated] = useState(false);
  const requested = useRef(false);

  useEffect(() => setHydrated(true), []);

  // Creates (or re-creates, when a promo is applied) the PaymentIntent.
  async function createIntent(promoCode?: string) {
    const res = await fetch("/api/stripe/payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: lines, ...(promoCode ? { promoCode } : {}) }),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok && data.clientSecret) {
      setClientSecret(data.clientSecret);
      setAmount(data.amount);
      setDiscount(data.discount || 0);
      setPromoLabel(data.promoLabel || "");
      return { ok: true as const };
    }
    return { ok: false as const, error: data.error || "Sorry, we couldn't start checkout. Please try again." };
  }

  // Create the PaymentIntent once the (localStorage-hydrated) cart is known.
  useEffect(() => {
    if (!hydrated || lines.length === 0 || requested.current) return;
    requested.current = true;
    createIntent().then((r) => {
      if (!r.ok) setLoadError(r.error);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated, lines]);

  async function applyPromo() {
    const code = promoInput.trim();
    if (!code || promoBusy) return;
    setPromoBusy(true);
    setPromoError("");
    const r = await createIntent(code);
    if (r.ok) {
      setAppliedPromo(code.toUpperCase());
      setPromoInput("");
    } else {
      setPromoError(r.error);
    }
    setPromoBusy(false);
  }

  async function removePromo() {
    if (promoBusy) return;
    setPromoBusy(true);
    setPromoError("");
    const r = await createIntent();
    if (r.ok) setAppliedPromo("");
    setPromoBusy(false);
  }

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
                <ProductImg src={p.image} fallback={p.icon} alt="" />
                <span className="rm-checkout-summary-title">
                  {p.title} <em>× {line.quantity}</em>
                </span>
                <span className="rm-checkout-summary-price">{formatGBP(p.amount * line.quantity)}</span>
              </li>
            );
          })}
        </ul>
        {/* Promo code */}
        <div className="rm-checkout-promo">
          {appliedPromo ? (
            <p className="rm-checkout-promo-applied">
              <span>
                Code <strong>{appliedPromo}</strong> applied{promoLabel ? ` — ${promoLabel}` : ""}
              </span>
              <button type="button" onClick={removePromo} disabled={promoBusy}>
                Remove
              </button>
            </p>
          ) : (
            <div className="rm-checkout-promo-row">
              <input
                type="text"
                placeholder="Promo code"
                value={promoInput}
                maxLength={50}
                onChange={(e) => setPromoInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), applyPromo())}
                disabled={promoBusy}
              />
              <button type="button" onClick={applyPromo} disabled={promoBusy || !promoInput.trim()}>
                {promoBusy ? "…" : "Apply"}
              </button>
            </div>
          )}
          {promoError && (
            <p className="rm-pay-error" role="alert">
              {promoError}
            </p>
          )}
        </div>

        <div className="rm-checkout-summary-sub">
          <span>Subtotal</span>
          <span>{formatGBP(totalPence)}</span>
        </div>
        {discount > 0 && (
          <div className="rm-checkout-summary-sub rm-checkout-summary-discount">
            <span>Discount{appliedPromo ? ` (${appliedPromo})` : ""}</span>
            <span>-{formatGBP(discount)}</span>
          </div>
        )}
        <div className="rm-checkout-summary-sub">
          <span>Delivery</span>
          <span>{formatGBP(DELIVERY_FEE_PENCE)}</span>
        </div>
        <div className="rm-checkout-summary-total">
          <span>Total</span>
          {/* Server-computed amount (it owns the discount + delivery maths). */}
          <span>{formatGBP(clientSecret ? amount : totalPence + DELIVERY_FEE_PENCE)}</span>
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
          <Elements key={clientSecret} stripe={stripePromise} options={options}>
            <PayForm amount={amount} />
          </Elements>
        ) : (
          <p className="rm-pay-loading">Preparing secure payment…</p>
        )}
      </section>
    </div>
  );
}
