import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import ProductGrid from "./ProductGrid";
import { site, products } from "@/lib/site";
import { getStock } from "@/lib/stock";

// Re-render at most once a minute so sold-out labels track admin stock edits.
export const revalidate = 60;

export const metadata: Metadata = {
  title: "Order Now — Premium Pakistani Mangoes & Fresh Fruit",
  description:
    "Order premium Pakistani mangoes and fresh fruit delivered throughout Scotland — mango boxes from £7, plus guava, apricots, cherries, karela, jamun, watermelon, khubani, kishmish, lychee, jackfruit and dragon fruit.",
  alternates: { canonical: "/products" },
};

const productsJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  itemListElement: products.map((p, i) => ({
    "@type": "Product",
    position: i + 1,
    name: p.id.startsWith("small") || p.id.startsWith("medium") || p.id.startsWith("large")
      ? `Premium Pakistani Mangoes — ${p.title}`
      : `${p.title} — RM Mangoes`,
    image: `${site.url}${p.image}`,
    offers: {
      "@type": "Offer",
      price: p.price.replace("£", ""),
      priceCurrency: "GBP",
      availability: "https://schema.org/InStock",
    },
  })),
};

export default async function ProductsPage() {
  const stock = await getStock();
  return (
    <PageShell postId={6799}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productsJsonLd) }} />

      {/* Page header */}
      <div
        className="elementor-element elementor-element-5b1dd83 e-flex e-con-boxed e-con e-parent"
        data-id="5b1dd83"
        data-element_type="container"
      >
        <div className="e-con-inner">
          <div
            className="elementor-element elementor-element-49f2e2e e-con-full e-flex e-con e-child"
            data-id="49f2e2e"
            data-element_type="container"
          >
            <div
              className="elementor-element elementor-element-a22ba7c elementor-widget__width-inherit elementor-widget elementor-widget-heading elementor-invisible"
              data-id="a22ba7c"
              data-element_type="widget"
              data-settings='{"_animation":"fadeInUp"}'
              data-widget_type="heading.default"
            >
              <div className="elementor-widget-container">
                <h1 className="elementor-heading-title elementor-size-default">Premium Pakistani Mangoes &amp; Fresh Produce</h1>
              </div>
            </div>
            <div
              className="elementor-element elementor-element-d070f68 e-con-full e-flex e-con e-child"
              data-id="d070f68"
              data-element_type="container"
            >
              <div
                className="elementor-element elementor-element-e62afd2 elementor-widget-tablet__width-inherit elementor-widget elementor-widget-text-editor elementor-invisible"
                data-id="e62afd2"
                data-element_type="widget"
                data-settings='{"_animation":"fadeInUp","_animation_delay":150}'
                data-widget_type="text-editor.default"
              >
                <div className="elementor-widget-container">
                  <p>
                    Pakistani mangoes are renowned worldwide for their sweetness, aroma and rich flavour. That&rsquo;s
                    what makes them the king of fruits, loved by young and old. At RM Mangoes, you&rsquo;ll find the
                    very best of the season.
                  </p>
                </div>
              </div>
            </div>
            <div
              className="elementor-element elementor-element-7777ab8 e-con-full e-flex e-con e-child"
              data-id="7777ab8"
              data-element_type="container"
            >
              <div
                className="elementor-element elementor-element-16fd266 elementor-widget__width-initial elementor-widget-tablet__width-inherit elementor-widget elementor-widget-text-editor elementor-invisible"
                data-id="16fd266"
                data-element_type="widget"
                data-settings='{"_animation":"fadeInUp","_animation_delay":300}'
                data-widget_type="text-editor.default"
              >
                <div className="elementor-widget-container">
                  <p>
                    We import directly from trusted growers in Pakistan and deliver fresh to doorsteps throughout
                    Scotland — mango boxes, seasonal fruit like lychee, cherries and dragon fruit, and fresh
                    vegetables. Pick a category below to browse, and save with our multi-box mango bundles.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="elementor-element elementor-element-6e1ae56 e-flex e-con-boxed e-con e-parent"
        data-id="6e1ae56"
        data-element_type="container"
      >
        <div className="e-con-inner"></div>
      </div>

      {/* Product cards */}
      <div
        className="elementor-element elementor-element-9e8beb7 e-flex e-con-boxed e-con e-parent"
        data-id="9e8beb7"
        data-element_type="container"
      >
        <div className="e-con-inner">
          <div className="elementor-shape elementor-shape-top" aria-hidden="true" data-negative="false">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 10" preserveAspectRatio="none">
              <path className="elementor-shape-fill" d="M350,10L340,0h20L350,10z"></path>
            </svg>
          </div>
          <ProductGrid stock={stock} />
        </div>
      </div>

      {/* Quote + order CTA */}
      <div
        className="elementor-element elementor-element-a641416 e-flex e-con-boxed e-con e-parent"
        data-id="a641416"
        data-element_type="container"
      >
        <div className="e-con-inner">
          <div className="elementor-shape elementor-shape-top" aria-hidden="true" data-negative="false">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 10" preserveAspectRatio="none">
              <path className="elementor-shape-fill" d="M350,10L340,0h20L350,10z"></path>
            </svg>
          </div>
          <div
            className="elementor-element elementor-element-cb46c55 elementor-widget__width-initial elementor-widget-mobile__width-inherit elementor-widget elementor-widget-heading elementor-invisible"
            data-id="cb46c55"
            data-element_type="widget"
            data-settings='{"_animation":"fadeInUp"}'
            data-widget_type="heading.default"
          >
            <div className="elementor-widget-container">
              <h2 className="elementor-heading-title elementor-size-default">
                &lsquo;Taste the king of fruits, delivered to your door&rsquo;
              </h2>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
