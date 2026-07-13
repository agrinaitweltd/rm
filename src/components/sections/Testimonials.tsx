import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import Icon from "@/components/ui/Icon";
import { testimonials } from "@/config/site";

/** Customer testimonials. */
export default function Testimonials() {
  return (
    <section
      id="testimonials"
      className="scroll-mt-24 bg-gradient-to-b from-white to-brand-50 py-16 md:py-24"
    >
      <div className="container-x">
        <SectionHeading
          eyebrow="Testimonials"
          title={
            <>
              Loved Across <span className="text-gradient">Scotland</span>
            </>
          }
          subtitle="Mango lovers from Glasgow to Aberdeen keep coming back for more."
          className="mb-12"
        />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {testimonials.map((t, i) => (
            <Reveal
              key={t.name}
              delay={i * 70}
              className="flex flex-col rounded-3xl border border-black/5 bg-white p-6 shadow-lg shadow-black/5"
            >
              <span className="mb-3 flex text-gold-400">
                {Array.from({ length: t.rating }).map((_, s) => (
                  <Icon key={s} name="star" size={18} />
                ))}
              </span>
              <p className="flex-1 text-sm leading-relaxed text-ink/80">
                “{t.quote}”
              </p>
              <div className="mt-5 border-t border-black/5 pt-4">
                <p className="text-sm font-bold text-ink">{t.name}</p>
                <p className="text-xs text-muted">{t.location}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
