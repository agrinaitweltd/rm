import type { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";
import Pricing from "@/components/sections/Pricing";
import WhyChoose from "@/components/sections/WhyChoose";
import FAQ from "@/components/sections/FAQ";
import CTABanner from "@/components/sections/CTABanner";
import { products, site } from "@/config/site";

export const metadata: Metadata = {
  title: "Products & Pricing",
  description:
    "Premium Pakistani mango boxes — small, medium and large, plus money-saving bundles. Delivered fresh across Scotland.",
  alternates: { canonical: "/products" },
};

// Product structured data for rich results.
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Premium Pakistani Mangoes",
  description:
    "Sun-ripened, hand-picked premium Pakistani mangoes, freshly imported and delivered across Scotland.",
  brand: { "@type": "Brand", name: site.name },
  offers: products.map((p) => ({
    "@type": "Offer",
    name: p.name,
    price: p.price.toFixed(2),
    priceCurrency: "GBP",
    availability: "https://schema.org/InStock",
  })),
};

export default function ProductsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageHeader
        eyebrow="Products"
        title={
          <>
            Premium <span className="text-gradient">Pakistani Mangoes</span>
          </>
        }
        subtitle="One product, done properly. Choose the box that suits you — the more you buy, the more you save."
      />
      <Pricing withHeading={false} />
      <WhyChoose />
      <FAQ />
      <CTABanner />
    </>
  );
}
