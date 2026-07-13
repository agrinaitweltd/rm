"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { navLinks, site } from "@/config/site";
import { links } from "@/lib/links";
import Icon from "@/components/ui/Icon";
import Logo from "@/components/ui/Logo";

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    // Read initial position after mount (rAF avoids a synchronous effect setState).
    const raf = requestAnimationFrame(onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Lock body scroll while the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled || open
          ? "bg-cream/90 backdrop-blur-md shadow-[0_2px_20px_rgba(0,0,0,0.06)]"
          : "bg-transparent"
      }`}
      style={{ height: "var(--header-h)" }}
    >
      <nav className="container-x flex h-full items-center justify-between gap-4">
        <Link
          href="/"
          className="flex items-center gap-2.5 shrink-0"
          aria-label={`${site.name} home`}
        >
          <Logo className="h-9 w-9" />
          <span className="text-lg font-extrabold tracking-tight text-ink font-[family-name:var(--font-heading)]">
            RM <span className="text-brand-600">Mangoes</span>
          </span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                    active
                      ? "text-brand-700"
                      : "text-ink/80 hover:text-brand-700"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="hidden items-center gap-3 md:flex">
          <a
            href={links.tel}
            className="inline-flex items-center gap-2 text-sm font-semibold text-ink/80 hover:text-brand-700 transition-colors"
          >
            <Icon name="phone" size={18} />
            <span className="hidden lg:inline">Call us</span>
          </a>
          <a
            href={links.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-600/25 transition-all hover:bg-brand-700 hover:-translate-y-0.5"
          >
            <Icon name="whatsapp" size={18} />
            Order Now
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full text-ink md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          <Icon name={open ? "close" : "menu"} size={26} />
        </button>
      </nav>

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden bg-cream/95 backdrop-blur-md transition-[max-height,opacity] duration-300 ${
          open ? "max-h-[70vh] opacity-100 border-t border-black/5" : "max-h-0 opacity-0"
        }`}
      >
        <ul className="container-x flex flex-col gap-1 py-4">
          {navLinks.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`block rounded-xl px-4 py-3 text-base font-semibold transition-colors ${
                    active
                      ? "bg-brand-50 text-brand-700"
                      : "text-ink hover:bg-brand-50"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
          <li className="mt-2 flex gap-3">
            <a
              href={links.tel}
              className="flex flex-1 items-center justify-center gap-2 rounded-full border-2 border-brand-600 px-4 py-3 text-sm font-semibold text-brand-700"
            >
              <Icon name="phone" size={18} /> Call
            </a>
            <a
              href={links.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-1 items-center justify-center gap-2 rounded-full bg-brand-600 px-4 py-3 text-sm font-semibold text-white"
            >
              <Icon name="whatsapp" size={18} /> WhatsApp
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
}
