import { contact } from "@/config/site";

/** Pre-built contact action links, derived from central config. */
export const links = {
  tel: `tel:${contact.phoneDial}`,
  mailto: `mailto:${contact.email}`,
  whatsapp: `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(
    contact.whatsappMessage,
  )}`,
  tiktok: contact.tiktokUrl,
} as const;
