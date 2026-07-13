"use client";

import { useEffect, useState } from "react";
import { links } from "@/lib/links";
import Icon from "@/components/ui/Icon";

/** Floating WhatsApp order button, bottom-right on every page. */
export default function WhatsAppButton() {
  const [mounted, setMounted] = useState(false);

  // Fade/scale in shortly after load for a polished entrance.
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 600);
    return () => clearTimeout(t);
  }, []);

  return (
    <a
      href={links.whatsapp}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Order via WhatsApp"
      className={`fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl shadow-black/20 transition-all duration-500 hover:scale-110 sm:bottom-6 sm:right-6 ${
        mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      }`}
    >
      <span className="absolute inset-0 rounded-full bg-[#25D366] motion-safe:animate-ping opacity-40" />
      <Icon name="whatsapp" size={30} className="relative" />
    </a>
  );
}
