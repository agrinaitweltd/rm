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
    // 16px keeps iOS Safari from auto-zooming the Stripe iframe inputs.
    fontSizeBase: "16px",
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

const SCOTTISH_POSTCODE_AREAS = new Set([
  "AB",
  "DD",
  "DG",
  "EH",
  "FK",
  "G",
  "HS",
  "IV",
  "KA",
  "KW",
  "KY",
  "ML",
  "PA",
  "PH",
  "TD",
  "ZE",
]);

function isScottishPostcode(postcode: string) {
  const match = postcode.toUpperCase().replace(/\s+/g, "").match(/^[A-Z]{1,2}/);
  return match ? SCOTTISH_POSTCODE_AREAS.has(match[0]) : false;
}

type ShippingDetails = {
  name: string;
  phone?: string;
  address: {
    line1: string;
    line2?: string;
    city?: string;
    state?: string;
    postal_code?: string;
    country: string;
  };
};

function PayForm({ amount }: { amount: number }) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [postcode, setPostcode] = useState("");
  const [addressComplete, setAddressComplete] = useState(false);
  const [shippingDetails, setShippingDetails] = useState<ShippingDetails | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const postcodeError =
    addressComplete && postcode && !isScottishPostcode(postcode)
      ? "Sorry, we currently deliver around Scotland only."
      : "";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;
    setError("");

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address for your receipt.");
      return;
    }

    if (!addressComplete || !shippingDetails) {
      setError("Please complete your delivery address.");
      return;
    }

    if (postcodeError) {
      setError(postcodeError);
      return;
    }

    setSubmitting(true);
    const { error: confirmError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout/success`,
        receipt_email: email,
        shipping: shippingDetails,
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
        onChange={(event) => {
          const line1 = event.value.address.line1 || "";
          setAddressComplete(event.complete);
          setPostcode(event.value.address.postal_code || "");
          setShippingDetails(
            line1
              ? {
                  name: event.value.name || "RM Mangoes customer",
                  phone: event.value.phone || undefined,
                  address: {
                    line1,
                    line2: event.value.address.line2 || undefined,
                    city: event.value.address.city || undefined,
                    state: event.value.address.state || undefined,
                    postal_code: event.value.address.postal_code || undefined,
                    country: event.value.address.country || "GB",
                  },
                }
              : null
          );
          if (error === postcodeError) setError("");
        }}
      />
      {postcodeError && (
        <p className="rm-pay-error" role="alert">
          {postcodeError}
        </p>
      )}

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
        {submitting ? (
          <>
            <span className="rm-spinner" aria-hidden="true" /> Processing…
          </>
        ) : (
          `Pay Now — ${formatGBP(amount)}`
        )}
      </button>
      <div className="rm-pay-trust">
        <span>
          <svg width="11" height="13" viewBox="0 0 11 13" fill="none" aria-hidden="true">
            <rect x="0.5" y="5" width="10" height="7.5" rx="1.5" fill="currentColor" />
            <path d="M2.75 5V3.75a2.75 2.75 0 1 1 5.5 0V5" stroke="currentColor" strokeWidth="1.4" fill="none" />
          </svg>
          SSL encrypted
        </span>
        <span>Powered by Stripe</span>
        <span>Apple Pay &amp; Google Pay</span>
      </div>
      <p className="rm-pay-note">Your card details never touch our servers.</p>
    </form>
  );
}

// Cash-on-delivery form. Uses a standalone Elements instance for the address
// element only — no PaymentIntent/clientSecret is needed since nothing is
// charged through Stripe for a cash order.
function CashForm({
  amount,
  lines,
  promoCode,
}: {
  amount: number;
  lines: { id: string; quantity: number }[];
  promoCode: string;
}) {
  const router = useRouter();
  const { clear } = useCart();
  const [email, setEmail] = useState("");
  const [postcode, setPostcode] = useState("");
  const [addressComplete, setAddressComplete] = useState(false);
  const [shippingDetails, setShippingDetails] = useState<ShippingDetails | null>(null);
  const [cashAmount, setCashAmount] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const postcodeError =
    addressComplete && postcode && !isScottishPostcode(postcode)
      ? "Sorry, we currently deliver around Scotland only."
      : "";

  const cashPence = Math.round((Number(cashAmount) || 0) * 100);
  const changeDue = Math.max(0, cashPence - amount);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address for your receipt.");
      return;
    }
    if (!addressComplete || !shippingDetails) {
      setError("Please complete your delivery address.");
      return;
    }
    if (postcodeError) {
      setError(postcodeError);
      return;
    }
    if (!cashAmount || cashPence < amount) {
      setError(`Please enter at least ${formatGBP(amount)} so the driver knows how much change to bring.`);
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/orders/cash", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: lines,
          promoCode: promoCode || undefined,
          email,
          name: shippingDetails.name,
          phone: shippingDetails.phone,
          address: {
            line1: shippingDetails.address.line1,
            line2: shippingDetails.address.line2,
            city: shippingDetails.address.city,
            county: shippingDetails.address.state,
            postal_code: shippingDetails.address.postal_code,
            country: shippingDetails.address.country,
          },
          cashTendered: Number(cashAmount),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Sorry, we couldn't place your order. Please try again.");
        setSubmitting(false);
        return;
      }
      clear();
      router.push(
        `/checkout/success?method=cash&change=${data.changeDue}&tendered=${data.cashTendered}`
      );
    } catch {
      setError("Sorry, we couldn't place your order. Please check your connection and try again.");
      setSubmitting(false);
    }
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
          allowedCountries: ["GB"],
          fields: { phone: "always" },
          validation: { phone: { required: "always" } },
        }}
        onChange={(event) => {
          const line1 = event.value.address.line1 || "";
          setAddressComplete(event.complete);
          setPostcode(event.value.address.postal_code || "");
          setShippingDetails(
            line1
              ? {
                  name: event.value.name || "RM Mangoes customer",
                  phone: event.value.phone || undefined,
                  address: {
                    line1,
                    line2: event.value.address.line2 || undefined,
                    city: event.value.address.city || undefined,
                    state: event.value.address.state || undefined,
                    postal_code: event.value.address.postal_code || undefined,
                    country: event.value.address.country || "GB",
                  },
                }
              : null
          );
          if (error === postcodeError) setError("");
        }}
      />
      {postcodeError && (
        <p className="rm-pay-error" role="alert">
          {postcodeError}
        </p>
      )}

      <h3 className="rm-pay-section-title">Cash on delivery</h3>
      <label className="rm-pay-email">
        How much cash will you have ready? *
        <input
          type="number"
          min={0}
          step="0.01"
          inputMode="decimal"
          value={cashAmount}
          onChange={(e) => setCashAmount(e.target.value)}
          placeholder={`e.g. ${(amount / 100).toFixed(2)}`}
          required
        />
      </label>
      {cashAmount && cashPence >= amount && (
        <p className="rm-cash-change">
          Your driver will bring <strong>{formatGBP(changeDue)}</strong> change.
        </p>
      )}

      {error && (
        <p className="rm-pay-error" role="alert">
          {error}
        </p>
      )}

      <button type="submit" className="rm-pay-button" disabled={submitting}>
        {submitting ? (
          <>
            <span className="rm-spinner" aria-hidden="true" /> Placing order…
          </>
        ) : (
          `Place Order — ${formatGBP(amount)} on delivery`
        )}
      </button>
      <p className="rm-pay-note">Pay the driver in cash when your order arrives. Nothing is charged online.</p>
    </form>
  );
}

export default function CheckoutClient() {
  const { lines, totalPence, productFor } = useCart();
  const [paymentMethod, setPaymentMethod] = useState<"card" | "cash">("card");
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
  const requestedFor = useRef<string>("");

  useEffect(() => setHydrated(true), []);

  // Card: creates a real PaymentIntent. Cash: pure price preview, no Stripe
  // object created since nothing gets charged online.
  async function fetchPricing(method: "card" | "cash", promoCode?: string) {
    const url = method === "card" ? "/api/stripe/payment-intent" : "/api/orders/price";
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: lines, ...(promoCode ? { promoCode } : {}) }),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok && (method === "cash" || data.clientSecret)) {
      setClientSecret(method === "card" ? data.clientSecret : "");
      setAmount(data.amount);
      setDiscount(data.discount || 0);
      setPromoLabel(data.promoLabel || "");
      return { ok: true as const };
    }
    return { ok: false as const, error: data.error || "Sorry, we couldn't start checkout. Please try again." };
  }

  // (Re)fetch pricing whenever the hydrated cart or the payment method
  // changes — switching methods needs its own PaymentIntent, or none at all.
  useEffect(() => {
    if (!hydrated || lines.length === 0) return;
    const key = `${paymentMethod}`;
    if (requestedFor.current === key) return;
    requestedFor.current = key;
    setLoadError("");
    setClientSecret("");
    fetchPricing(paymentMethod, appliedPromo || undefined).then((r) => {
      if (!r.ok) setLoadError(r.error);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated, lines, paymentMethod]);

  async function applyPromo() {
    const code = promoInput.trim();
    if (!code || promoBusy) return;
    setPromoBusy(true);
    setPromoError("");
    const r = await fetchPricing(paymentMethod, code);
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
    const r = await fetchPricing(paymentMethod);
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
          <img className="rm-status-mark" src="/icon-mango.svg" alt="" width={120} height={120} />
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
          <span>{formatGBP(amount || totalPence + DELIVERY_FEE_PENCE)}</span>
        </div>
        <Link href="/products" className="rm-checkout-edit">
          Edit cart
        </Link>
      </aside>

      {/* Payment */}
      <section className="rm-checkout-payment">
        <div className="rm-pay-method-tabs" role="tablist" aria-label="Payment method">
          <button
            type="button"
            role="tab"
            aria-selected={paymentMethod === "card"}
            className={`rm-pay-method-tab${paymentMethod === "card" ? " is-active" : ""}`}
            onClick={() => setPaymentMethod("card")}
          >
            Pay Online
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={paymentMethod === "cash"}
            className={`rm-pay-method-tab${paymentMethod === "cash" ? " is-active" : ""}`}
            onClick={() => setPaymentMethod("cash")}
          >
            Cash on Delivery
          </button>
        </div>

        {loadError ? (
          <p className="rm-pay-error" role="alert">
            {loadError}
          </p>
        ) : paymentMethod === "card" ? (
          options ? (
            <Elements key={clientSecret} stripe={stripePromise} options={options}>
              <PayForm amount={amount} />
            </Elements>
          ) : (
            <p className="rm-pay-loading">
              <span className="rm-spinner" aria-hidden="true" /> Preparing secure payment…
            </p>
          )
        ) : amount > 0 ? (
          <Elements stripe={stripePromise} options={{ appearance }}>
            <CashForm amount={amount} lines={lines} promoCode={appliedPromo} />
          </Elements>
        ) : (
          <p className="rm-pay-loading">
            <span className="rm-spinner" aria-hidden="true" /> Preparing your order…
          </p>
        )}
      </section>
    </div>
  );
}
