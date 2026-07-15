"use client";

import { useCart } from "./CartProvider";

// Sits inside each product card. Adds the box to the cart without following the
// card's WhatsApp link (the WhatsApp order option is kept as a separate link).
// soldOut comes from live stock; the payment API re-checks it server-side.
export default function AddToCartButton({ id, soldOut = false }: { id: string; soldOut?: boolean }) {
  const { addItem } = useCart();
  if (soldOut) {
    return (
      <button type="button" className="rm-add-to-cart rm-sold-out" disabled aria-label="Sold out">
        <span className="elementor-button-text">Sold Out</span>
      </button>
    );
  }
  return (
    <button
      type="button"
      className="rm-add-to-cart"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        addItem(id);
      }}
      aria-label="Add to cart"
    >
      <span className="elementor-button-text">Add to Cart</span>
    </button>
  );
}
