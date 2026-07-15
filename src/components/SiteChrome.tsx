"use client";

import { usePathname } from "next/navigation";

// Renders the marketing chrome (header, mobile nav, footer, cart) around page
// content — except on /admin, which is a standalone back-office screen. The
// public site structure is kept byte-for-byte identical to before.
export default function SiteChrome({
  header,
  mobileNav,
  footer,
  cart,
  children,
}: {
  header: React.ReactNode;
  mobileNav: React.ReactNode;
  footer: React.ReactNode;
  cart: React.ReactNode;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) {
    return <>{children}</>;
  }
  return (
    <>
      <div className="hfeed site" id="page">
        {header}
        {children}
        {mobileNav}
        {footer}
      </div>
      {cart}
    </>
  );
}
