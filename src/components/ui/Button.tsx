import Link from "next/link";
import type { AnchorHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "outline" | "ghost";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold " +
  "transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 select-none " +
  "active:scale-[0.97] whitespace-nowrap";

const variants: Record<Variant, string> = {
  primary:
    "bg-brand-600 text-white shadow-lg shadow-brand-600/25 hover:bg-brand-700 hover:shadow-xl hover:shadow-brand-600/30 hover:-translate-y-0.5",
  secondary:
    "bg-ink text-white hover:bg-black hover:-translate-y-0.5 shadow-lg shadow-black/10",
  outline:
    "border-2 border-brand-600 text-brand-700 hover:bg-brand-600 hover:text-white",
  ghost: "text-ink hover:text-brand-700 hover:bg-brand-50",
};

const sizes: Record<Size, string> = {
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3.5 text-base",
};

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  variant?: Variant;
  size?: Size;
  children: ReactNode;
};

/**
 * Unified call-to-action link. Internal routes use next/link; external and
 * protocol links (tel:, mailto:, https:) render as plain anchors.
 */
export default function Button({
  href,
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: Props) {
  const cls = `${base} ${variants[variant]} ${sizes[size]} ${className}`.trim();
  const isInternal = href.startsWith("/") && !href.startsWith("//");

  if (isInternal) {
    return (
      <Link href={href} className={cls} {...props}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} className={cls} {...props}>
      {children}
    </a>
  );
}
