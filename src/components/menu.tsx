import Link from "next/link";

export type MenuItem = {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
};

export const menuItems: MenuItem[] = [
  {
    label: "The Chain",
    href: "/the-chain",
    children: [
      { label: "The Consumer", href: "/the-chain#consumer" },
      { label: "Sourcing partners", href: "/the-chain#partners" },
      { label: "Quality & Certificates", href: "/the-chain#quality" },
      { label: "Our product range", href: "/the-chain#products" },
      { label: "Our logistics", href: "/the-chain#logistics" },
      { label: "Our clients", href: "/the-chain#clients" },
    ],
  },
  { label: "Order Now", href: "/products" },
  {
    label: "About RM Mangoes",
    href: "/about",
    children: [
      { label: "About us", href: "/about" },
      { label: "Our network", href: "/about#network" },
      { label: "History", href: "/about#history" },
      { label: "Mission", href: "/about#mission" },
      { label: "Jobs", href: "/about#jobs" },
    ],
  },
  { label: "Contact", href: "/contact" },
];

export function ArrowIcon() {
  return (
    <span className="ast-icon icon-arrow">
      <svg
        className="ast-arrow-svg"
        xmlns="http://www.w3.org/2000/svg"
        version="1.1"
        x="0px"
        y="0px"
        width="26px"
        height="16.043px"
        viewBox="57 35.171 26 16.043"
        xmlSpace="preserve"
      >
        <path d="M57.5,38.193l12.5,12.5l12.5-12.5l-2.5-2.5l-10,10l-10-10L57.5,38.193z"></path>
      </svg>
    </span>
  );
}

/** One nav <li>, replicating Astra's dropdown markup exactly. */
export function NavItem({ item }: { item: MenuItem }) {
  if (!item.children) {
    return (
      <li className="menu-item menu-item-type-post_type menu-item-object-page">
        <Link href={item.href} className="menu-link">
          {item.label}
        </Link>
      </li>
    );
  }
  return (
    <li className="menu-item menu-item-type-post_type menu-item-object-page menu-item-has-children">
      <Link aria-expanded="false" href={item.href} className="menu-link">
        {item.label}
        <span
          role="button"
          className="dropdown-menu-toggle ast-header-navigation-arrow"
          tabIndex={0}
          aria-expanded="false"
          aria-label="Menu Toggle"
          aria-haspopup="true"
        >
          <ArrowIcon />
        </span>
      </Link>
      <button className="ast-menu-toggle" aria-expanded="false" aria-label="Toggle Menu">
        <ArrowIcon />
      </button>
      <ul className="sub-menu">
        {item.children.map((child) => (
          <li key={child.href} className="menu-item menu-item-type-custom menu-item-object-custom">
            <Link href={child.href} className="menu-link">
              <ArrowIcon />
              {child.label}
            </Link>
          </li>
        ))}
      </ul>
    </li>
  );
}
