import Image from "next/image";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import Icon from "@/components/ui/Icon";
import Button from "@/components/ui/Button";
import { products, images } from "@/config/site";
import { links } from "@/lib/links";

type Props = {
  /** Show the section heading (hidden when embedded under another heading). */
  withHeading?: boolean;
};

/** Pricing cards for the single product line: Premium Pakistani Mangoes. */
export default function Pricing({ withHeading = true }: Props) {
  return (
    <section id="pricing" className="scroll-mt-24 py-16 md:py-24">
      <div className="container-x">
        {withHeading && (
          <SectionHeading
            eyebrow="Pricing"
            title={
              <>
                Choose Your <span className="text-gradient">Mango Box</span>
              </>
            }
            subtitle="One premium product, sold by the box. Bundle up and save — every box is filled with the same sun-ripened Pakistani mangoes."
            className="mb-12"
          />
        )}

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product, i) => (
            <Reveal
              key={product.id}
              delay={i * 70}
              className={`group relative flex flex-col overflow-hidden rounded-3xl border p-6 transition-all duration-300 hover:-translate-y-1 ${
                product.featured
                  ? "border-brand-600 bg-white shadow-2xl shadow-brand-600/15 ring-1 ring-brand-600/20"
                  : "border-black/5 bg-white shadow-lg shadow-black/5 hover:shadow-xl"
              }`}
            >
              {product.featured && (
                <span className="absolute right-5 top-5 rounded-full bg-brand-600 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-wider text-white">
                  Most Popular
                </span>
              )}

              <div className="relative mb-5 aspect-[16/10] w-full overflow-hidden rounded-2xl">
                <Image
                  src={images.product}
                  alt="Premium Pakistani mangoes"
                  fill
                  sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <h3 className="text-xl font-bold text-ink">{product.name}</h3>
              <p className="mt-1 text-sm text-muted">Premium Pakistani Mangoes</p>

              <div className="mt-4 flex items-end gap-2">
                <span className="text-4xl font-black text-brand-700">
                  £{product.price}
                </span>
                {product.note && (
                  <span className="mb-1.5 rounded-full bg-leaf-300/30 px-2.5 py-0.5 text-xs font-bold text-leaf-700">
                    {product.note}
                  </span>
                )}
              </div>

              <Button
                href={links.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                variant={product.featured ? "primary" : "outline"}
                className="mt-6 w-full"
              >
                <Icon name="whatsapp" size={18} />
                Order This Box
              </Button>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-10 flex flex-col items-center justify-center gap-3 text-center">
          <p className="text-sm text-muted">
            Not sure which box? Message us and we&apos;ll help you choose.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button href={links.tel} variant="secondary">
              <Icon name="phone" size={18} /> Call to Order
            </Button>
            <Button href="/contact" variant="ghost">
              Use the Order Form <Icon name="arrow" size={18} />
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
