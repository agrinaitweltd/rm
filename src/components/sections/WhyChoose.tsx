import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import Icon, { type IconName } from "@/components/ui/Icon";
import { features } from "@/config/site";

/** "Why Choose RM Mangoes" feature grid. */
export default function WhyChoose() {
  return (
    <section id="why" className="scroll-mt-24 bg-white py-16 md:py-24">
      <div className="container-x">
        <SectionHeading
          eyebrow="Why Choose Us"
          title={
            <>
              Why Choose <span className="text-gradient">RM Mangoes</span>
            </>
          }
          subtitle="We do one thing and we do it exceptionally well — bring Scotland the finest premium Pakistani mangoes."
          className="mb-12"
        />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <Reveal
              key={f.title}
              delay={i * 70}
              className="group rounded-3xl border border-black/5 bg-cream p-7 transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-xl hover:shadow-brand-600/10"
            >
              <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-100 text-brand-700 transition-colors group-hover:bg-brand-600 group-hover:text-white">
                <Icon name={f.icon as IconName} size={26} />
              </span>
              <h3 className="mt-5 text-lg font-bold text-ink">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {f.description}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
