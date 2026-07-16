"use client";

import { useState } from "react";
import AddToCartButton from "@/components/cart/AddToCartButton";
import ProductImg from "@/components/cart/ProductImg";
import { site, products, categories, type ProductCategory } from "@/lib/site";

// Elementor element ids from the original template, cycled per card so every
// card keeps the theme's three colour palettes.
const cardIds = [
  { id: "7181f31", imageId: "bff7b29", headingId: "4f882f0", subId: "b5a1aa3" },
  { id: "ecfcae6", imageId: "0d56ec3", headingId: "76fc612", subId: "03011fe" },
  { id: "62c8657", imageId: "af84dda", headingId: "24e92bd", subId: "e076092" },
  { id: "1901114", imageId: "19536e6", headingId: "f8798df", subId: "c5cab64" },
  { id: "107f310", imageId: "d913f8e", headingId: "071b279", subId: "894abaa" },
  { id: "1634c8e", imageId: "9815cf7", headingId: "6af9dd2", subId: "f446d35" },
];

type Filter = "all" | ProductCategory;

// Category-filtered product grid. Cards reuse the theme's Elementor card
// markup; filtering re-triggers a CSS fade so switches feel intentional.
export default function ProductGrid({ stock }: { stock: Record<string, number> }) {
  const [filter, setFilter] = useState<Filter>("all");
  const visible = filter === "all" ? products : products.filter((p) => p.category === filter);

  const countFor = (f: Filter) =>
    f === "all" ? products.length : products.filter((p) => p.category === f).length;

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

      {visible.map((product, i) => {
        const ids = cardIds[i % cardIds.length];
        return (
          <div
            // filter in the key restarts the fade animation on every switch
            key={`${filter}-${product.id}`}
            className={`elementor-element elementor-element-${ids.id} e-con-full e-flex e-con e-child rm-shop-card`}
            data-id={ids.id}
            data-element_type="container"
            style={{ animationDelay: `${(i % 6) * 60}ms` }}
          >
            <div
              className={`elementor-element elementor-element-${ids.imageId} e-transform elementor-widget-tablet__width-initial elementor-widget elementor-widget-image`}
              data-id={ids.imageId}
              data-element_type="widget"
              data-settings='{"_transform_scale_effect_hover":{"unit":"px","size":1.1,"sizes":[]}}'
              data-widget_type="image.default"
            >
              <div className="elementor-widget-container">
                <ProductImg
                  src={product.image}
                  fallback={product.icon}
                  title={product.title}
                  alt={`${product.title} — fresh delivery across Scotland by RM Mangoes`}
                  loading="lazy"
                />
              </div>
            </div>
            <div
              className={`elementor-element elementor-element-${ids.headingId} elementor-widget elementor-widget-heading`}
              data-id={ids.headingId}
              data-element_type="widget"
              data-widget_type="heading.default"
            >
              <div className="elementor-widget-container">
                <h3 className="elementor-heading-title elementor-size-default">{product.title}</h3>
              </div>
            </div>
            <div
              className={`elementor-element elementor-element-${ids.subId} elementor-widget elementor-widget-heading`}
              data-id={ids.subId}
              data-element_type="widget"
              data-widget_type="heading.default"
            >
              <div className="elementor-widget-container">
                <p className="elementor-heading-title elementor-size-default">{product.price}</p>
              </div>
            </div>
            <AddToCartButton id={product.id} soldOut={(stock[product.id] ?? 1) <= 0} />
            <a
              className="rm-card-whatsapp"
              href={site.whatsappOrder(product.order)}
              target="_blank"
              rel="noopener"
            >
              or order on WhatsApp
            </a>
          </div>
        );
      })}
    </>
  );
}
