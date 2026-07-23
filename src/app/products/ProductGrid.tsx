"use client";

import Link from "next/link";
import { useState } from "react";
import AddToCartButton from "@/components/cart/AddToCartButton";
import ProductImg from "@/components/cart/ProductImg";
import { products, categories, type Product, type ProductCategory } from "@/lib/site";

type Filter = "all" | ProductCategory;

const byPrice = (a: Product, b: Product) => a.amount - b.amount;

// Collapses same-product size/pack tiers (Product.variantGroup) into a single
// visual card; anything without a variantGroup stays its own single-item group.
// Order of first appearance is preserved so price sorting upstream still holds.
function groupVariants(list: Product[]): Product[][] {
  const groups = new Map<string, Product[]>();
  for (const p of list) {
    const key = p.variantGroup || p.id;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(p);
  }
  return [...groups.values()];
}

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

// Same tile as Card, but for a group of size/pack variants sharing one photo
// and title — a dropdown swaps which SKU is priced, shown, and added to cart.
function VariantCard({
  variants,
  index,
  filter,
  stock,
}: {
  variants: Product[];
  index: number;
  filter: Filter;
  stock: Record<string, number>;
}) {
  const sorted = [...variants].sort(byPrice);
  const [selectedId, setSelectedId] = useState(sorted[0].id);
  const selected = sorted.find((v) => v.id === selectedId) || sorted[0];
  const soldOut = (stock[selected.id] ?? 1) <= 0;

  return (
    <div
      key={`${filter}-group-${selected.variantGroup}`}
      className="rm-shop-card"
      style={{ animationDelay: `${(index % 6) * 50}ms` }}
    >
      {soldOut && <span className="rm-shop-card-soldout">Sold Out</span>}
      <Link href={`/products/${selected.id}`} className="rm-shop-card-img">
        <ProductImg
          src={selected.image}
          fallback={selected.icon}
          title={selected.title}
          alt={`${selected.title} — fresh delivery across Scotland by RM Mangoes`}
          loading="lazy"
        />
      </Link>
      <div className="rm-shop-card-body">
        <Link href={`/products/${selected.id}`} className="rm-shop-card-title-link">
          <h3 className="rm-shop-card-title">{selected.title}</h3>
        </Link>
        <select
          className="rm-shop-card-variant-select"
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
          aria-label={`Choose a size for ${selected.title}`}
        >
          {sorted.map((v) => (
            <option key={v.id} value={v.id}>
              {v.subtitle || v.title}
            </option>
          ))}
        </select>
        <p className="rm-shop-card-price">
          <strong>{selected.price}</strong>
        </p>
        <AddToCartButton id={selected.id} soldOut={soldOut} />
      </div>
    </div>
  );
}

// Category-filtered product grid. "All Produce" groups the range under a
// heading per category; every group is sorted cheapest-first.
export default function ProductGrid({ stock }: { stock: Record<string, number> }) {
  const [filter, setFilter] = useState<Filter>("all");

  const countFor = (f: Filter) =>
    groupVariants(f === "all" ? products : products.filter((p) => p.category === f)).length;

  const total = countFor(filter);
  const soldOut = (p: Product) => (stock[p.id] ?? 1) <= 0;

  const renderGroup = (group: Product[], i: number, f: Filter) =>
    group.length > 1 ? (
      <VariantCard key={`${f}-group-${group[0].variantGroup}`} variants={group} index={i} filter={f} stock={stock} />
    ) : (
      <Card key={`${f}-${group[0].id}`} product={group[0]} index={i} filter={f} soldOut={soldOut(group[0])} />
    );

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
            const groups = groupVariants(products.filter((p) => p.category === cat.key).sort(byPrice));
            if (groups.length === 0) return null;
            return (
              <div key={cat.key} className="rm-shop-group">
                <h2 className="rm-shop-group-title">
                  {cat.label}
                  <span>{groups.length}</span>
                </h2>
                <div className="rm-shop-group-cards">
                  {groups.map((group, i) => renderGroup(group, i, filter))}
                </div>
              </div>
            );
          })
        : (
            <div className="rm-shop-group-cards rm-shop-group-cards-flat">
              {groupVariants([...products.filter((p) => p.category === filter)].sort(byPrice)).map((group, i) =>
                renderGroup(group, i, filter)
              )}
            </div>
          )}
    </>
  );
}
