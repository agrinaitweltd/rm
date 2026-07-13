import Image from "next/image";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import { images } from "@/config/site";
import { links } from "@/lib/links";

/** Homepage hero banner. */
export default function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-gradient-to-b from-brand-50 via-cream to-cream pt-[var(--header-h)]">
      {/* Decorative blurred blobs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-gold-400/30 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/3 -left-24 h-80 w-80 rounded-full bg-brand-300/30 blur-3xl"
      />

      <div className="container-x relative grid items-center gap-10 py-14 md:py-20 lg:grid-cols-2 lg:gap-8">
        {/* Copy */}
        <div className="max-w-xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white/70 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-brand-700 backdrop-blur reveal is-visible">
            <span className="h-2 w-2 rounded-full bg-leaf-500" />
            Freshly Imported · In Season
          </span>

          <h1 className="mt-5 text-4xl font-black leading-[1.02] text-ink sm:text-5xl md:text-6xl">
            Premium <span className="text-gradient">Pakistani Mangoes</span>
          </h1>

          <p className="mt-5 text-lg font-semibold text-ink/80 sm:text-xl">
            From Pakistani Farms to Scottish Doorsteps.
          </p>
          <p className="mt-3 max-w-md text-base leading-relaxed text-muted">
            Sun-ripened, hand-picked and freshly imported — the sweetest,
            juiciest mangoes delivered across Scotland. Order today while
            they&apos;re in season.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button href="/products" size="lg">
              Order Today
              <Icon name="arrow" size={20} />
            </Button>
            <Button
              href={links.whatsapp}
              variant="outline"
              size="lg"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icon name="whatsapp" size={20} />
              WhatsApp Us
            </Button>
          </div>

          <dl className="mt-10 grid max-w-md grid-cols-3 gap-4 border-t border-black/5 pt-6">
            {[
              { n: "100%", l: "Pakistani Grown" },
              { n: "Fresh", l: "In-Season Import" },
              { n: "Scotland", l: "Wide Delivery" },
            ].map((s) => (
              <div key={s.l}>
                <dt className="text-xl font-extrabold text-brand-700 sm:text-2xl">
                  {s.n}
                </dt>
                <dd className="mt-1 text-xs font-medium text-muted">{s.l}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Image */}
        <div className="relative">
          <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-[2rem] shadow-2xl shadow-brand-900/20 ring-1 ring-black/5 motion-safe:animate-float">
            <Image
              src={images.hero}
              alt="A box of premium ripe Pakistani mangoes"
              fill
              priority
              sizes="(max-width: 1024px) 90vw, 40vw"
              className="object-cover"
            />
          </div>

          {/* Floating price badge */}
          <div className="absolute -bottom-4 left-2 rounded-2xl bg-white px-5 py-3 shadow-xl shadow-black/10 ring-1 ring-black/5 sm:left-0">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">
              From only
            </p>
            <p className="text-2xl font-black text-brand-700">£7</p>
          </div>

          {/* Floating rating badge */}
          <div className="absolute -top-3 right-2 flex items-center gap-2 rounded-2xl bg-white px-4 py-2.5 shadow-xl shadow-black/10 ring-1 ring-black/5 sm:right-0">
            <span className="flex text-gold-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <Icon key={i} name="star" size={16} />
              ))}
            </span>
            <span className="text-xs font-bold text-ink">Loved in Scotland</span>
          </div>
        </div>
      </div>
    </section>
  );
}
