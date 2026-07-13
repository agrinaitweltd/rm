type Props = { className?: string };

/** RM Mangoes mark — a stylised mango with leaf, in brand colours. */
export default function Logo({ className }: Props) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={className}
      role="img"
      aria-label="RM Mangoes logo"
    >
      <defs>
        <linearGradient id="rm-mango" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fbbf24" />
          <stop offset="0.55" stopColor="#f97316" />
          <stop offset="1" stopColor="#ea580c" />
        </linearGradient>
      </defs>
      <path
        d="M38 16c-3-4.5-8.5-6-14-4C16 14 10 21 10 28.5 10 34.4 14.3 39 20.4 39.6 29 40.4 39.5 34 41 25.5 41.7 21.2 40.6 18.6 38 16Z"
        fill="url(#rm-mango)"
      />
      <path
        d="M34 14c2-2.4 5.2-3.2 8-2.4-.4 2.8-1.9 5.2-4.4 6.5"
        fill="none"
        stroke="#6e9a3b"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}
