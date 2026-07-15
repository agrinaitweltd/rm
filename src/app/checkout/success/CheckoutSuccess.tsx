"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/components/cart/CartProvider";

// Payment succeeded — clear the cart (localStorage + state) and thank the buyer.
// Reaching this page only happens after Stripe redirects on a completed payment;
// a cancelled payment returns to /products with the cart untouched.
export default function CheckoutSuccess() {
  const { clear } = useCart();

  useEffect(() => {
    clear();
  }, [clear]);

  return (
    <div className="rm-checkout-status">
      <div className="rm-checkout-card">
        <div className="rm-soon-emoji" aria-hidden="true">
          🥭
        </div>
        <h1>Thank you for your order!</h1>
        <p>
          Your payment was successful and your order is confirmed. We&rsquo;ve emailed your receipt, and we&rsquo;ll be
          in touch about delivery.
        </p>
        <p>Fresh Pakistani mangoes are on their way to your door.</p>
        <Link href="/products" className="rm-checkout-cta">
          Back to shop
        </Link>
      </div>
    </div>
  );
}
