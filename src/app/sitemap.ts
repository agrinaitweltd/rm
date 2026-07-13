import type { MetadataRoute } from "next";
import { navLinks, site } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return navLinks.map((link) => ({
    url: `${site.url}${link.href === "/" ? "" : link.href}`,
    lastModified: now,
    changeFrequency: link.href === "/" ? "weekly" : "monthly",
    priority: link.href === "/" ? 1 : 0.8,
  }));
}
