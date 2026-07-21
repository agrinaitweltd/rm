"use client";

import { useState } from "react";
import Link from "next/link";
import ProductImg from "@/components/cart/ProductImg";
import { useCart, formatGBP } from "@/components/cart/CartProvider";
import { categories, type Product } from "@/lib/site";

export default function ProductDetail({
  product,
  soldOut,
  prevId,
  nextId,
}: {
  product: Product;
  soldOut: boolean;
  prevId: string;
  nextId: string;
}) {
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const categoryLabel = categories.find((c) => c.key === product.category)?.label;

  const clamp = (n: number) => Math.max(1, Math.min(99, Math.floor(n) || 1));
  const bump = (delta: number) => setQty((q) => clamp(q + delta));
  const setQtyFromInput = (n: number) => setQty(clamp(n));

  return (
    <div className="rm-pdp">
      <nav className="rm-pdp-crumbs" aria-label="Breadcrumb">
        <Link href="/products">Order Now</Link>
        <span aria-hidden="true">/</span>
        <span>{categoryLabel}</span>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{product.title}</span>
      </nav>

      <div className="rm-pdp-layout">
        <div className="rm-pdp-gallery">
          <div className="rm-pdp-thumb">
            <ProductImg src={product.image} fallback={product.icon} alt="" />
          </div>
          <div className="rm-pdp-main">
            <ProductImg
              src={product.image}
              fallback={product.icon}
              alt={`${product.title} — fresh delivery across Scotland by RM Mangoes`}
            />
          </div>
        </div>

        <div className="rm-pdp-info">
          <div className="rm-pdp-info-top">
            <div>
              <span className="rm-pdp-category">{categoryLabel}</span>
              <h1>{product.title}</h1>
              {product.subtitle && <p className="rm-pdp-subtitle">{product.subtitle}</p>}
              <p className="rm-pdp-price">{product.price}</p>
            </div>
            <div className="rm-pdp-arrows">
              <Link href={`/products/${prevId}`} aria-label="Previous product">
                &larr;
              </Link>
              <Link href={`/products/${nextId}`} aria-label="Next product">
                &rarr;
              </Link>
            </div>
          </div>

          {soldOut ? (
            <p className="rm-pdp-soldout">Sold out — check back soon.</p>
          ) : (
            <>
              <div className="rm-pdp-qty-row">
                <span className="rm-pdp-qty-label">Quantity</span>
                <div className="rm-pdp-qty">
                  <button type="button" aria-label="Decrease quantity" onClick={() => bump(-1)}>
                    &minus;
                  </button>
                  <input
                    type="number"
                    min={1}
                    max={99}
                    value={qty}
                    onChange={(e) => setQtyFromInput(Number(e.target.value))}
                    aria-label="Quantity"
                  />
                  <button type="button" aria-label="Increase quantity" onClick={() => bump(1)}>
                    +
                  </button>
                </div>
              </div>

              <div className="rm-pdp-subtotal">
                <span>Subtotal</span>
                <span>{formatGBP(product.amount * qty)}</span>
              </div>

              <button
                type="button"
                className="rm-pdp-add"
                onClick={() => addItem(product.id, qty)}
              >
                Add to Cart
              </button>
            </>
          )}

        </div>
      </div>
    </div>
  );
}
