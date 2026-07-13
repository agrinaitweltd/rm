import Image from "next/image";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import { images } from "@/config/site";

type Props = { withHeading?: boolean };

/** Masonry-style image gallery of the mangoes. */
export default function Gallery({ withHeading = true }: Props) {
  return (
    <section id="gallery" className="scroll-mt-24 py-16 md:py-24">
      <div className="container-x">
        {withHeading && (
          <SectionHeading
            eyebrow="Gallery"
            title={
              <>
                A Taste of <span className="text-gradient">Perfection</span>
              </>
            }
            subtitle="From orchard to box — a closer look at the premium Pakistani mangoes we deliver across Scotland."
            className="mb-12"
          />
        )}

        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
          {images.gallery.map((src, i) => (
            <Reveal
              key={src}
              delay={(i % 3) * 80}
              className={`group relative overflow-hidden rounded-2xl ring-1 ring-black/5 ${
                i % 5 === 0 ? "row-span-2 aspect-[3/4]" : "aspect-square"
              }`}
            >
              <Image
                src={src}
                alt={`Premium Pakistani mangoes ${i + 1}`}
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brand-900/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
