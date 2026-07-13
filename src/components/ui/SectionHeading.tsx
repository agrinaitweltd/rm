import Reveal from "./Reveal";

type Props = {
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  align?: "center" | "left";
  className?: string;
};

/** Consistent section header: eyebrow label, heading and optional subtitle. */
export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  className = "",
}: Props) {
  const alignment = align === "center" ? "text-center mx-auto" : "text-left";
  return (
    <Reveal className={`max-w-2xl ${alignment} ${className}`.trim()}>
      {eyebrow && (
        <span className="inline-flex items-center gap-2 rounded-full bg-brand-100 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-brand-700">
          {eyebrow}
        </span>
      )}
      <h2 className="mt-4 text-3xl sm:text-4xl md:text-[2.75rem] text-ink">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-base sm:text-lg leading-relaxed text-muted">
          {subtitle}
        </p>
      )}
    </Reveal>
  );
}
