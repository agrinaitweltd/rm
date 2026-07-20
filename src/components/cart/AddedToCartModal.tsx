"use client";

import { useEffect, useRef } from "react";
import { useCart, formatGBP } from "./CartProvider";
import ProductImg from "./ProductImg";

// Fires after any addItem() call, anywhere on the site (grid quick-add,
// product detail page). Offers the two things a shopper actually wants next:
// carry on browsing, or go straight to checkout via the cart drawer.
export default function AddedToCartModal() {
  const { lastAdded, dismissLastAdded, setOpen } = useCart();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!lastAdded) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismissLastAdded();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lastAdded, dismissLastAdded]);

  if (!lastAdded) return null;

  return (
    <div className="rm-added-overlay" role="presentation" onClick={dismissLastAdded}>
      <div
        className="rm-added-modal"
        role="dialog"
        aria-modal="true"
        aria-label="Added to cart"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          ref={closeRef}
          type="button"
          className="rm-added-close"
          aria-label="Close"
          onClick={dismissLastAdded}
        >
          &times;
        </button>
        <div className="rm-added-check" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="22" height="22">
            <path
              d="M4 12.5l5 5L20 6.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h3>Added to your cart</h3>
        <div className="rm-added-product">
          <ProductImg src={lastAdded.image} fallback={lastAdded.icon} alt="" />
          <div>
            <span className="rm-added-title">{lastAdded.title}</span>
            <span className="rm-added-price">{formatGBP(lastAdded.amount)}</span>
          </div>
        </div>
        <div className="rm-added-actions">
          <button
            type="button"
            className="rm-added-view"
            onClick={() => {
              dismissLastAdded();
              setOpen(true);
            }}
          >
            View Cart
          </button>
          <button type="button" className="rm-added-continue" onClick={dismissLastAdded}>
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}
