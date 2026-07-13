import Image from "next/image";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import Reveal from "@/components/ui/Reveal";
import { images } from "@/config/site";
import { links } from "@/lib/links";

/** Full-width call-to-action banner with the banner image behind. */
export default function CTABanner() {
  return (
    <section className="py-16 md:py-20">
      <div className="container-x">
        <Reveal className="relative isolate overflow-hidden rounded-[2.5rem] bg-brand-700 px-6 py-14 text-center shadow-2xl shadow-brand-900/20 sm:px-12 md:py-20">
          <Image
            src={images.banner}
            alt=""
            fill
            sizes="(max-width: 1280px) 100vw, 1280px"
            className="object-cover opacity-25"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-r from-brand-800/80 to-brand-600/70"
          />

          <div className="relative mx-auto max-w-2xl">
            <h2 className="text-3xl font-black text-white sm:text-4xl md:text-5xl">
              Taste Pakistan&apos;s Finest, Delivered Fresh
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-base text-white/90 sm:text-lg">
              They&apos;re in season now and they won&apos;t last long. Order
              your box of premium Pakistani mangoes today.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button
                href={links.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                size="lg"
                className="bg-white text-brand-700 hover:bg-cream"
              >
                <Icon name="whatsapp" size={20} /> Order on WhatsApp
              </Button>
              <Button
                href={links.tel}
                size="lg"
                variant="secondary"
                className="!bg-white/15 backdrop-blur hover:!bg-white/25"
              >
                <Icon name="phone" size={20} /> Call Us Now
              </Button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
