"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCart } from "@/components/cart/CartProvider";
import RatingPrompt from "./RatingPrompt";

// Landed here after stripe.confirmPayment — either directly (cards, no redirect)
// or via Stripe's return_url redirect, which appends ?redirect_status=….
// The cart is cleared only when the payment actually succeeded; a failed
// redirect keeps the cart intact and sends the customer back to checkout.
export default function CheckoutSuccess() {
  const { clear } = useCart();
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const status = new URLSearchParams(window.location.search).get("redirect_status");
    if (status && status !== "succeeded") {
      setFailed(true);
      return;
    }
    clear();
  }, [clear]);

  if (failed) {
    return (
      <div className="rm-checkout-status">
        <div className="rm-checkout-card">
          <img className="rm-status-mark" src="/icon-mango.svg" alt="" width={120} height={120} />
          <h1>Payment not completed</h1>
          <p>Your payment didn&rsquo;t go through — you have not been charged and your cart is untouched.</p>
          <Link href="/checkout" className="rm-checkout-cta">
            Try again
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="rm-checkout-status">
      <div className="rm-checkout-card">
        <img className="rm-status-mark" src="/icon-mango.svg" alt="" width={120} height={120} />
        <h1>Thank you for your order!</h1>
        <p>
          Your payment was successful and your order is confirmed. We&rsquo;ve emailed your receipt, and we&rsquo;ll be
          in touch about delivery.
        </p>
        <p>Fresh Pakistani produce is on its way to your door.</p>
        <RatingPrompt />
        <Link href="/products" className="rm-checkout-cta">
          Back to shop
        </Link>
      </div>
    </div>
  );
}
