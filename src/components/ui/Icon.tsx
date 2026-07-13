import type { SVGProps } from "react";

export type IconName =
  | "sun"
  | "plane"
  | "truck"
  | "leaf"
  | "box"
  | "heart"
  | "phone"
  | "mail"
  | "whatsapp"
  | "tiktok"
  | "star"
  | "check"
  | "menu"
  | "close"
  | "arrow"
  | "chevron"
  | "mango";

type Props = SVGProps<SVGSVGElement> & {
  name: IconName;
  /** Convenience size (sets width & height). */
  size?: number;
};

/**
 * Lightweight inline-SVG icon set. Icons inherit `currentColor` so they can be
 * coloured with text utilities. Brand icons (WhatsApp, TikTok) use their own
 * glyph paths and also inherit colour.
 */
const paths: Record<IconName, React.ReactNode> = {
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </>
  ),
  plane: <path d="M17.8 19.2 16 11l3.5-3.5a2.12 2.12 0 0 0-3-3L13 8 4.8 6.2a1 1 0 0 0-.9 1.6L8 12l-2 2-2-.5a1 1 0 0 0-.9 1.6L6 18l1.9 2.9a1 1 0 0 0 1.6-.1L11 18l4-4 .8 3.9a1 1 0 0 0 1.6.9L20 17l-.2-.2Z" />,
  truck: (
    <>
      <path d="M14 4H2v11h12V4Z" />
      <path d="M14 8h5l3 3v4h-8V8Z" />
      <circle cx="6.5" cy="17.5" r="1.8" />
      <circle cx="17.5" cy="17.5" r="1.8" />
    </>
  ),
  leaf: (
    <>
      <path d="M4 20c8 2 15-4 15-14 0 0-9-2-13 3-2.6 3.2-2 8-2 11Z" />
      <path d="M4 20c2-6 5-8 10-10" />
    </>
  ),
  box: (
    <>
      <path d="M3 8 12 3l9 5-9 5-9-5Z" />
      <path d="M3 8v8l9 5 9-5V8" />
      <path d="M12 13v8" />
    </>
  ),
  heart: <path d="M12 20s-7-4.4-9.3-8.6A5 5 0 0 1 12 6a5 5 0 0 1 9.3 5.4C19 15.6 12 20 12 20Z" />,
  phone: <path d="M6.6 2.5A2 2 0 0 0 4 3.9L3 5.4A3 3 0 0 0 2.8 8a20 20 0 0 0 13.2 13.2 3 3 0 0 0 2.6-.2l1.5-1a2 2 0 0 0 .4-2.6l-2-2a2 2 0 0 0-2.3-.5l-1.5.7-4.6-4.6.7-1.5a2 2 0 0 0-.5-2.3l-2-2Z" />,
  mail: (
    <>
      <rect x="2.5" y="4.5" width="19" height="15" rx="2.5" />
      <path d="m3 6 9 7 9-7" />
    </>
  ),
  whatsapp: (
    <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm5.4 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .1-1.7-.1-.4-.1-.9-.3-1.6-.6a10 10 0 0 1-4.1-3.6c-.3-.4-.9-1.3-.9-2.5s.6-1.8.9-2c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.7 1.7c.1.2 0 .4-.1.5l-.3.4c-.2.2-.3.3-.1.6.5.9 1.1 1.5 1.9 2 .3.2.5.1.7-.1l.6-.7c.2-.2.3-.2.6-.1l1.6.8c.2.1.4.2.5.3 0 .2 0 .8-.2 1.3Z" />
  ),
  tiktok: (
    <path d="M16.5 2h-3v13.2a2.7 2.7 0 1 1-2.7-2.7c.2 0 .5 0 .7.1V9.5a5.9 5.9 0 1 0 5 5.8V8.9a7 7 0 0 0 4 1.3V7.1a4 4 0 0 1-4-4Z" />
  ),
  star: <path d="m12 2.5 2.9 6 6.6.8-4.9 4.5 1.3 6.5L12 17.9 6.1 20.8l1.3-6.5-4.9-4.5 6.6-.8Z" />,
  check: <path d="m4 12 5 5L20 6" />,
  menu: <path d="M3 6h18M3 12h18M3 18h18" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  chevron: <path d="m6 9 6 6 6-6" />,
  mango: (
    <>
      <path d="M18.5 6.8C16.8 4.6 13.8 4 11 5 7 6.4 4 10.4 4 14.3c0 3 2.2 5.2 5.2 5.5 4.2.4 9-2.7 10.2-7 .6-2.2.4-4.2-.9-6Z" />
      <path d="M17 5c1.2-1.2 3-1.6 4.5-1.2-.2 1.6-1 3-2.4 3.7" />
    </>
  ),
};

/** Icons drawn as strokes vs. filled shapes. */
const filled = new Set<IconName>([
  "whatsapp",
  "tiktok",
  "star",
  "heart",
  "mango",
]);

export default function Icon({ name, size = 24, ...props }: Props) {
  const isFilled = filled.has(name);
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill={isFilled ? "currentColor" : "none"}
      stroke={isFilled ? "none" : "currentColor"}
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {paths[name]}
    </svg>
  );
}
