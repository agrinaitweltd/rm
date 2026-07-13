type Props = {
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
};

/** Compact hero used at the top of interior pages. */
export default function PageHeader({ eyebrow, title, subtitle }: Props) {
  return (
    <section className="relative isolate overflow-hidden bg-gradient-to-b from-brand-50 to-cream pt-[calc(var(--header-h)+2.5rem)] pb-12 md:pb-16">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-20 right-0 h-72 w-72 rounded-full bg-gold-400/20 blur-3xl"
      />
      <div className="container-x relative text-center">
        {eyebrow && (
          <span className="inline-flex items-center gap-2 rounded-full bg-brand-100 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-brand-700">
            {eyebrow}
          </span>
        )}
        <h1 className="mx-auto mt-4 max-w-3xl text-4xl font-black text-ink sm:text-5xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
