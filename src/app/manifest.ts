import type { MetadataRoute } from "next";
import { site } from "@/config/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${site.name} — Premium Pakistani Mangoes`,
    short_name: site.name,
    description: site.description,
    start_url: "/",
    display: "standalone",
    background_color: "#fffaf3",
    theme_color: "#ea580c",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
