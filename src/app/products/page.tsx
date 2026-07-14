import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import { site, products } from "@/lib/site";

export const metadata: Metadata = {
  title: "Our Mangoes — Premium Pakistani Mango Boxes & Prices",
  description:
    "Order premium Pakistani mangoes delivered throughout Scotland and Ireland. Small box £7, medium box £18, large box £30 — with multi-box bundles available.",
  alternates: { canonical: "/products" },
};

// Elementor element ids from the original template, one set per product card.
const cardIds = [
  { id: "7181f31", imageId: "bff7b29", headingId: "4f882f0", subId: "b5a1aa3" },
  { id: "ecfcae6", imageId: "0d56ec3", headingId: "76fc612", subId: "03011fe" },
  { id: "62c8657", imageId: "af84dda", headingId: "24e92bd", subId: "e076092" },
  { id: "1901114", imageId: "19536e6", headingId: "f8798df", subId: "c5cab64" },
  { id: "107f310", imageId: "d913f8e", headingId: "071b279", subId: "894abaa" },
  { id: "1634c8e", imageId: "9815cf7", headingId: "6af9dd2", subId: "f446d35" },
];

const productsJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  itemListElement: products.map((p, i) => ({
    "@type": "Product",
    position: i + 1,
    name: `Premium Pakistani Mangoes — ${p.title}`,
    image: `${site.url}${p.image}`,
    offers: {
      "@type": "Offer",
      price: p.price.replace("£", ""),
      priceCurrency: "GBP",
      availability: "https://schema.org/InStock",
    },
  })),
};

export default function ProductsPage() {
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
                <h1 className="elementor-heading-title elementor-size-default">Premium Pakistani Mangoes</h1>
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
                    We import our mangoes directly from trusted growers in Pakistan and deliver them fresh to doorsteps
                    throughout Scotland and Ireland. Choose the box size that suits you — or save with one of our
                    multi-box bundles below.
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
          {products.map((product, i) => {
            const ids = cardIds[i];
            return (
              <a
                key={ids.id}
                className={`elementor-element elementor-element-${ids.id} e-con-full e-flex e-con e-child elementor-invisible`}
                data-id={ids.id}
                data-element_type="container"
                data-settings={`{"_animation":"zoomIn","_animation_delay":${(i % 3) * 150}}`}
                href={site.whatsappOrder(product.order)}
                target="_blank"
                rel="noopener"
              >
                <div
                  className={`elementor-element elementor-element-${ids.imageId} e-transform elementor-widget-tablet__width-initial elementor-widget elementor-widget-image`}
                  data-id={ids.imageId}
                  data-element_type="widget"
                  data-settings='{"_transform_scale_effect_hover":{"unit":"px","size":1.1,"sizes":[]}}'
                  data-widget_type="image.default"
                >
                  <div className="elementor-widget-container">
                    <img
                      decoding="async"
                      src={product.image}
                      title={product.title}
                      alt={`Premium Pakistani Mangoes — ${product.title}`}
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
              </a>
            );
          })}
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
          <div
            className="elementor-element elementor-element-9c38f20 elementor-align-center elementor-mobile-align-center elementor-widget elementor-widget-button"
            data-id="9c38f20"
            data-element_type="widget"
            data-widget_type="button.default"
          >
            <div className="elementor-widget-container">
              <div className="elementor-button-wrapper">
                <a
                  className="elementor-button elementor-button-link elementor-size-lg"
                  href={site.whatsappOrder("a box")}
                  target="_blank"
                  rel="noopener"
                >
                  <span className="elementor-button-content-wrapper">
                    <span className="elementor-button-text">Order via WhatsApp</span>
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
