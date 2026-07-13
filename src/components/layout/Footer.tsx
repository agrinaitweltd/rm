import Link from "next/link";
import { contact, kavo, navLinks, site } from "@/config/site";
import { links } from "@/lib/links";
import Icon from "@/components/ui/Icon";
import Logo from "@/components/ui/Logo";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-ink text-white">
      <div className="container-x py-14 md:py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5">
              <Logo className="h-10 w-10" />
              <span className="text-xl font-extrabold tracking-tight">
                RM <span className="text-brand-400">Mangoes</span>
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/70">
              {site.tagline} Premium Pakistani mangoes, freshly imported and
              delivered across Scotland.
            </p>
          </div>

          {/* Explore */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-brand-400">
              Explore
            </h3>
            <ul className="mt-4 space-y-2.5">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/70 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-brand-400">
              Get in Touch
            </h3>
            <ul className="mt-4 space-y-3">
              <li>
                <a
                  href={links.mailto}
                  className="inline-flex items-center gap-3 text-sm text-white/70 transition-colors hover:text-white"
                >
                  <Icon name="mail" size={18} className="text-brand-400" />
                  {contact.email}
                </a>
              </li>
              <li>
                <a
                  href={links.tel}
                  className="inline-flex items-center gap-3 text-sm text-white/70 transition-colors hover:text-white"
                >
                  <Icon name="phone" size={18} className="text-brand-400" />
                  {contact.phoneDisplay}
                </a>
              </li>
              <li>
                <a
                  href={links.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 text-sm text-white/70 transition-colors hover:text-white"
                >
                  <Icon name="whatsapp" size={18} className="text-brand-400" />
                  WhatsApp
                </a>
              </li>
            </ul>
          </div>

          {/* Social / CTA */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-brand-400">
              Follow Us
            </h3>
            <a
              href={links.tiktok}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-3 rounded-full bg-white/10 px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-white/20"
              aria-label={`RM Mangoes on TikTok (${contact.tiktokHandle})`}
            >
              <Icon name="tiktok" size={20} />
              {contact.tiktokHandle}
            </a>
            <a
              href={links.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 flex items-center justify-center gap-2 rounded-full bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-brand-700 hover:-translate-y-0.5"
            >
              <Icon name="whatsapp" size={18} /> Order on WhatsApp
            </a>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-center text-sm text-white/60 sm:flex-row sm:text-left">
          <p>
            © {year} {site.name}. All rights reserved.
          </p>
          <p>
            Made &amp; Designed by{" "}
            <a
              href={kavo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-brand-400 transition-colors hover:text-brand-300"
            >
              {kavo.name}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
