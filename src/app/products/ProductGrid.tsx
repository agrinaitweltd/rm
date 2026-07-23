"use client";

import Link from "next/link";
import { useState } from "react";
import AddToCartButton from "@/components/cart/AddToCartButton";
import ProductImg from "@/components/cart/ProductImg";
import { products, categories, type Product, type ProductCategory } from "@/lib/site";

type Filter = "all" | ProductCategory;

const byPrice = (a: Product, b: Product) => a.amount - b.amount;

function Card({ product, index, filter, soldOut }: { product: Product; index: number; filter: Filter; soldOut: boolean }) {
  return (
    <Link
      // filter in the key restarts the fade animation on every switch
      key={`${filter}-${product.id}`}
      href={`/products/${product.id}`}
      className="rm-shop-card"
      style={{ animationDelay: `${(index % 6) * 50}ms` }}
    >
      {soldOut && <span className="rm-shop-card-soldout">Sold Out</span>}
      <div className="rm-shop-card-img">
        {product.promotion && (
          <span className="rm-sale-badge" aria-label={product.promotion}>
            <strong>20%</strong>
            <span>OFF</span>
          </span>
        )}
        <ProductImg
          src={product.image}
          fallback={product.icon}
          title={product.title}
          alt={`${product.title} — fresh delivery across Scotland by RM Mangoes`}
          loading="lazy"
        />
      </div>
      <div className="rm-shop-card-body">
        <h3 className="rm-shop-card-title">{product.title}</h3>
        {product.subtitle && <p className="rm-shop-card-subtitle">{product.subtitle}</p>}
        <p className="rm-shop-card-price">
          {product.oldPrice && <del>{product.oldPrice}</del>}
          <strong>{product.price}</strong>
        </p>
        <AddToCartButton id={product.id} soldOut={soldOut} />
      </div>
    </Link>
  );
}

// Category-filtered product grid. "All Produce" groups the range under a
// heading per category; every group is sorted cheapest-first.
export default function ProductGrid({ stock }: { stock: Record<string, number> }) {
  const [filter, setFilter] = useState<Filter>("all");

  const countFor = (f: Filter) =>
    f === "all" ? products.length : products.filter((p) => p.category === f).length;

  const total = countFor(filter);
  const soldOut = (p: Product) => (stock[p.id] ?? 1) <= 0;

  return (
    <>
      <div className="rm-shop-tabs" role="tablist" aria-label="Product categories">
        {([{ key: "all" as const, label: "All Produce" }, ...categories]).map((c) => (
          <button
            key={c.key}
            type="button"
            role="tab"
            aria-selected={filter === c.key}
            className={`rm-shop-tab${filter === c.key ? " is-active" : ""}`}
            onClick={() => setFilter(c.key)}
          >
            {c.label}
            <span className="rm-shop-tab-count">{countFor(c.key)}</span>
          </button>
        ))}
      </div>
      <p className="rm-shop-showing" role="status">
        Showing {total} {total === 1 ? "product" : "products"}
        {filter !== "all" ? ` in ${categories.find((c) => c.key === filter)?.label}` : ""}
      </p>

      {filter === "all"
        ? categories.map((cat) => {
            const group = products.filter((p) => p.category === cat.key).sort(byPrice);
            if (group.length === 0) return null;
            return (
              <div key={cat.key} className="rm-shop-group">
                <h2 className="rm-shop-group-title">
                  {cat.label}
                  <span>{group.length}</span>
                </h2>
                <div className="rm-shop-group-cards">
                  {group.map((product, i) => (
                    <Card key={`all-${product.id}`} product={product} index={i} filter={filter} soldOut={soldOut(product)} />
                  ))}
                </div>
              </div>
            );
          })
        : (
            <div className="rm-shop-group-cards rm-shop-group-cards-flat">
              {[...products.filter((p) => p.category === filter)].sort(byPrice).map((product, i) => (
                <Card key={`${filter}-${product.id}`} product={product} index={i} filter={filter} soldOut={soldOut(product)} />
              ))}
            </div>
          )}
    </>
  );
}
