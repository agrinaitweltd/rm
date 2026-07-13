import Icon from "@/components/ui/Icon";

const items = [
  "Freshly Imported",
  "Sun-Ripened",
  "Delivered Across Scotland",
  "Premium Grade",
  "Hand-Picked",
  "From Pakistani Farms",
];

/** Infinite scrolling brand strip. Duplicated once for a seamless loop. */
export default function Marquee() {
  return (
    <div className="overflow-hidden border-y border-brand-700/20 bg-brand-600 py-4 text-white">
      <div className="flex w-max motion-safe:animate-marquee">
        {[0, 1].map((group) => (
          <ul
            key={group}
            className="flex shrink-0 items-center"
            aria-hidden={group === 1}
          >
            {items.map((item) => (
              <li
                key={item}
                className="flex items-center gap-3 px-6 text-sm font-bold uppercase tracking-wider sm:text-base"
              >
                <Icon name="mango" size={18} className="text-gold-300" />
                {item}
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
