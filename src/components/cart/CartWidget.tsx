"use client";

import { useRouter } from "next/navigation";
import { useCart, formatGBP } from "./CartProvider";
import { DELIVERY_FEE_PENCE } from "@/lib/site";

// Floating cart button + slide-in drawer, rendered site-wide from the layout.
// Styling lives in styles/32-cart.css and reuses the brand palette/fonts.
export default function CartWidget() {
  const { lines, open, setOpen, itemCount, totalPence, setQuantity, removeItem, productFor } = useCart();
  const router = useRouter();

  // The on-site /checkout page (Stripe Payment Element) takes it from here.
  // The cart is only cleared after a successful payment.
  function handleCheckout() {
    setOpen(false);
    router.push("/checkout");
  }

  return (
    <>
      <button
        type="button"
        className="rm-cart-fab"
        aria-label={`Open cart, ${itemCount} item${itemCount === 1 ? "" : "s"}`}
        onClick={() => setOpen(true)}
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M3 3h2l.4 2M7 13h10l3-8H6.4M7 13L5.4 5M7 13l-2 4h12"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="9" cy="20" r="1.6" fill="currentColor" />
          <circle cx="17" cy="20" r="1.6" fill="currentColor" />
        </svg>
        {itemCount > 0 && <span className="rm-cart-fab-badge">{itemCount}</span>}
      </button>

      {open && <div className="rm-cart-overlay" onClick={() => setOpen(false)} aria-hidden="true" />}

      <aside
        className={`rm-cart-drawer${open ? " is-open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        aria-hidden={!open}
      >
        <div className="rm-cart-header">
          <h3>Your Cart</h3>
          <button type="button" className="rm-cart-close" onClick={() => setOpen(false)} aria-label="Close cart">
            &times;
          </button>
        </div>

        <div className="rm-cart-body">
          {lines.length === 0 ? (
            <p className="rm-cart-empty">Your cart is empty.</p>
          ) : (
            <ul className="rm-cart-lines">
              {lines.map((line) => {
                const p = productFor(line.id);
                if (!p) return null;
                return (
                  <li key={line.id} className="rm-cart-line">
                    <img src={p.image} alt="" className="rm-cart-line-img" />
                    <div className="rm-cart-line-info">
                      <span className="rm-cart-line-title">{p.title}</span>
                      <span className="rm-cart-line-price">{p.price}</span>
                    </div>
                    <div className="rm-cart-qty">
                      <button
                        type="button"
                        aria-label={`Decrease ${p.title}`}
                        onClick={() => setQuantity(line.id, line.quantity - 1)}
                      >
                        &minus;
                      </button>
                      <span>{line.quantity}</span>
                      <button
                        type="button"
                        aria-label={`Increase ${p.title}`}
                        onClick={() => setQuantity(line.id, line.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                    <button
                      type="button"
                      className="rm-cart-remove"
                      aria-label={`Remove ${p.title}`}
                      onClick={() => removeItem(line.id)}
                    >
                      Remove
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {lines.length > 0 && (
          <div className="rm-cart-footer">
            <div className="rm-cart-subtotal">
              <span>Subtotal</span>
              <span>{formatGBP(totalPence)}</span>
            </div>
            <div className="rm-cart-subtotal">
              <span>Delivery</span>
              <span>{formatGBP(DELIVERY_FEE_PENCE)}</span>
            </div>
            <div className="rm-cart-total">
              <span>Total</span>
              <span>{formatGBP(totalPence + DELIVERY_FEE_PENCE)}</span>
            </div>
            <button type="button" className="rm-cart-checkout" onClick={handleCheckout}>
              Checkout
            </button>
            <p className="rm-cart-note">Secure payment by Stripe. Delivery details collected at checkout.</p>
          </div>
        )}
      </aside>
    </>
  );
}
