import type { Metadata, Viewport } from "next";
import { Poppins, Mulish } from "next/font/google";
import "./globals.css";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import CookieConsent from "@/components/CookieConsent";
import { site, images } from "@/config/site";

/* Fonts — Poppins stands in for the original Filson Pro (geometric, rounded)
   for headings; Mulish stands in for Avenir for body copy. */
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const mulish = Mulish({
  variable: "--font-mulish",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} | Premium Pakistani Mangoes Delivered Across Scotland`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  keywords: [
    "Pakistani mangoes",
    "mangoes Scotland",
    "buy mangoes Glasgow",
    "buy mangoes Edinburgh",
    "premium mangoes UK",
    "mango box delivery",
    "RM Mangoes",
  ],
  authors: [{ name: site.name }],
  creator: site.name,
  publisher: site.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: site.locale,
    url: site.url,
    siteName: site.name,
    title: `${site.name} | Premium Pakistani Mangoes Delivered Across Scotland`,
    description: site.description,
    images: [
      {
        url: images.ogImage,
        width: 1200,
        height: 630,
        alt: `${site.name} — Premium Pakistani Mangoes`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} | Premium Pakistani Mangoes`,
    description: site.description,
    images: [images.ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  category: "food",
};

export const viewport: Viewport = {
  themeColor: "#ea580c",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: site.name,
  description: site.description,
  image: `${site.url}${images.ogImage}`,
  url: site.url,
  telephone: "+447880808900",
  email: "info@rmmangoes.co.uk",
  areaServed: { "@type": "AdministrativeArea", name: "Scotland" },
  address: {
    "@type": "PostalAddress",
    addressRegion: "Scotland",
    addressCountry: "GB",
  },
  sameAs: ["https://www.tiktok.com/@rm_mangoes"],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en-GB"
      className={`${poppins.variable} ${mulish.variable} h-full`}
    >
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsAppButton />
        <CookieConsent />
      </body>
    </html>
  );
}
