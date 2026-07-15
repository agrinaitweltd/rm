"use client";

import { useCart } from "./CartProvider";

// Sits inside each product card. Adds the box to the cart without following the
// card's WhatsApp link (the WhatsApp order option is kept as a separate link).
export default function AddToCartButton({ id }: { id: string }) {
  const { addItem } = useCart();
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
