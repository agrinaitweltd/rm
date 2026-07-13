import type { Metadata } from "next";
import Image from "next/image";
import PageHeader from "@/components/ui/PageHeader";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import Icon from "@/components/ui/Icon";
import Marquee from "@/components/sections/Marquee";
import WhyChoose from "@/components/sections/WhyChoose";
import CTABanner from "@/components/sections/CTABanner";
import { images } from "@/config/site";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "RM Mangoes brings premium, sun-ripened Pakistani mangoes from trusted farms straight to doorsteps across Scotland.",
  alternates: { canonical: "/about" },
};

const values = [
  {
    icon: "leaf" as const,
    title: "Quality First",
    text: "Only premium-grade mangoes make the cut. Every box is checked before it ships.",
  },
  {
    icon: "truck" as const,
    title: "Freshness Guaranteed",
    text: "A tight cold chain keeps our mangoes at their sweet, ripe best from farm to door.",
  },
  {
    icon: "heart" as const,
    title: "Family Passion",
    text: "We share the mangoes we grew up loving with mango lovers all across Scotland.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About"
        title={
          <>
            Bringing Pakistan&apos;s Finest Mangoes to{" "}
            <span className="text-gradient">Scotland</span>
          </>
        }
        subtitle="From Pakistani Farms to Scottish Doorsteps — a simple promise, delivered with real care."
      />

      {/* Story */}
      <section className="py-16 md:py-20">
        <div className="container-x grid items-center gap-10 lg:grid-cols-2">
          <Reveal className="relative">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[2rem] shadow-2xl shadow-brand-900/15 ring-1 ring-black/5">
              <Image
                src={images.about}
                alt="Premium Pakistani mangoes ready for delivery"
                fill
                sizes="(max-width: 1024px) 90vw, 45vw"
                className="object-cover"
              />
            </div>
          </Reveal>

          <Reveal delay={100}>
            <span className="inline-flex items-center gap-2 rounded-full bg-brand-100 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-brand-700">
              Our Story
            </span>
            <h2 className="mt-4 text-3xl font-black text-ink sm:text-4xl">
              A love for real Pakistani mangoes
            </h2>
            <div className="mt-4 space-y-4 text-base leading-relaxed text-muted">
              <p>
                RM Mangoes was born from a simple frustration — you just
                couldn&apos;t find properly sweet, authentic Pakistani mangoes in
                Scotland. So we decided to bring them ourselves.
              </p>
              <p>
                We work directly with trusted farms in Pakistan to source
                sun-ripened, hand-picked fruit at the peak of the season. Each
                batch is carefully packed and moved quickly through our cold
                chain so it arrives fresh, fragrant and full of flavour.
              </p>
              <p>
                Today we deliver those same mangoes across Scotland — from
                Glasgow to Aberdeen — one premium box at a time.
              </p>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-4">
              {[
                { n: "1", l: "Premium product" },
                { n: "100%", l: "Pakistani grown" },
                { n: "Scotland", l: "Wide delivery" },
              ].map((s) => (
                <div key={s.l} className="rounded-2xl bg-cream p-4 text-center">
                  <p className="text-xl font-black text-brand-700">{s.n}</p>
                  <p className="mt-1 text-xs font-medium text-muted">{s.l}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <Marquee />

      {/* Values */}
      <section className="bg-white py-16 md:py-24">
        <div className="container-x">
          <SectionHeading
            eyebrow="What We Stand For"
            title={
              <>
                Our <span className="text-gradient">Values</span>
              </>
            }
            className="mb-12"
          />
          <div className="grid gap-5 md:grid-cols-3">
            {values.map((v, i) => (
              <Reveal
                key={v.title}
                delay={i * 80}
                className="rounded-3xl border border-black/5 bg-cream p-7"
              >
                <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-600 text-white">
                  <Icon name={v.icon} size={26} />
                </span>
                <h3 className="mt-5 text-lg font-bold text-ink">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {v.text}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <WhyChoose />
      <CTABanner />
    </>
  );
}
