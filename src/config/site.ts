/**
 * Central site configuration for RM Mangoes.
 *
 * Everything editable — company details, contact info, navigation, products,
 * pricing, testimonials, FAQs and image paths — lives here so content can be
 * updated in ONE place without touching component code.
 *
 * Images are referenced by path only (see `images` below). To swap an image,
 * drop a replacement file with the same name into /public/images — no code
 * changes required.
 */

export const site = {
  name: "RM Mangoes",
  legalName: "RM Mangoes",
  tagline: "From Pakistani Farms to Scottish Doorsteps.",
  shortDescription:
    "Premium Pakistani Mangoes delivered across Scotland.",
  description:
    "Fresh premium Pakistani mangoes delivered across Scotland. Small, medium and large boxes available with fast delivery.",
  url: "https://rmmangoes.co.uk",
  locale: "en_GB",
  region: "Scotland, United Kingdom",
} as const;

export const contact = {
  email: "info@rmmangoes.co.uk",
  /** Human-readable phone number. */
  phoneDisplay: "+44 0788080890",
  /** E.164-style number for tel: links. */
  phoneDial: "+447880808900",
  /** Digits only for wa.me links (no + or spaces). */
  whatsapp: "447880808900",
  whatsappMessage:
    "Hi RM Mangoes! I'd like to order some premium Pakistani mangoes.",
  tiktokHandle: "@rm_mangoes",
  tiktokUrl: "https://www.tiktok.com/@rm_mangoes",
} as const;

/** Primary navigation — kept intentionally minimal. */
export const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Products", href: "/products" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact", href: "/contact" },
] as const;

/**
 * All editable images. Replace the corresponding file in /public/images
 * (keeping the same filename) to update — no code change needed.
 */
export const images = {
  hero: "/images/hero.jpg",
  about: "/images/about.jpg",
  product: "/images/product.jpg",
  banner: "/images/banner.jpg",
  ogImage: "/images/og.jpg",
  gallery: [
    "/images/gallery-1.jpg",
    "/images/gallery-2.jpg",
    "/images/gallery-3.jpg",
    "/images/gallery-4.jpg",
    "/images/gallery-5.jpg",
    "/images/gallery-6.jpg",
  ],
} as const;

export type Product = {
  id: string;
  name: string;
  price: number;
  /** Optional per-unit note, e.g. "Save £1". */
  note?: string;
  /** Highlight the card as the recommended option. */
  featured?: boolean;
};

/** The single product line: Premium Pakistani Mangoes, sold by box size. */
export const products: Product[] = [
  { id: "small-1", name: "Small Box", price: 7 },
  { id: "small-2", name: "2 Small Boxes", price: 13, note: "Save £1" },
  { id: "small-3", name: "3 Small Boxes", price: 20, note: "Save £1" },
  { id: "medium-1", name: "Medium Box", price: 18, featured: true },
  { id: "medium-2", name: "2 Medium Boxes", price: 35, note: "Save £1" },
  { id: "large-1", name: "Large Box", price: 30 },
];

/** Box-size options offered in the contact / order form. */
export const boxSizes = products.map((p) => p.name);

export const features = [
  {
    icon: "sun",
    title: "Sun-Ripened on the Farm",
    description:
      "Hand-picked at peak ripeness from trusted Pakistani orchards for unmatched sweetness and aroma.",
  },
  {
    icon: "plane",
    title: "Freshly Imported",
    description:
      "Flown in season and moved quickly through our cold chain so every mango arrives fresh.",
  },
  {
    icon: "truck",
    title: "Delivered Across Scotland",
    description:
      "From Glasgow to Aberdeen and everywhere between — straight to your Scottish doorstep.",
  },
  {
    icon: "leaf",
    title: "Premium Grade Only",
    description:
      "We select only the finest grade fruit. If a box isn't up to standard, it never ships.",
  },
  {
    icon: "box",
    title: "Flexible Box Sizes",
    description:
      "Small, medium and large boxes — plus multi-box bundles that save you money.",
  },
  {
    icon: "heart",
    title: "Family-Run & Trusted",
    description:
      "A family passion for real Pakistani mangoes, shared with mango lovers all over Scotland.",
  },
] as const;

export const testimonials = [
  {
    name: "Ayesha K.",
    location: "Glasgow",
    quote:
      "The best mangoes I've had since visiting Pakistan. Sweet, juicy and delivered right to my door in Glasgow.",
    rating: 5,
  },
  {
    name: "David M.",
    location: "Edinburgh",
    quote:
      "Ordered a medium box for the family and it was gone in two days. Incredible flavour — already reordering.",
    rating: 5,
  },
  {
    name: "Sana R.",
    location: "Aberdeen",
    quote:
      "Finally, proper Pakistani mangoes in Scotland. Beautifully packed and every single one was perfect.",
    rating: 5,
  },
  {
    name: "Callum S.",
    location: "Dundee",
    quote:
      "Fast delivery and premium quality. You can taste the difference — these are the real deal.",
    rating: 5,
  },
] as const;

export const faqs = [
  {
    question: "Which mangoes do you sell?",
    answer:
      "We sell only premium Pakistani mangoes — freshly imported in season and hand-selected for sweetness, aroma and quality.",
  },
  {
    question: "Where do you deliver?",
    answer:
      "We deliver across the whole of Scotland, from Glasgow and Edinburgh to Aberdeen, Dundee and beyond.",
  },
  {
    question: "What box sizes are available?",
    answer:
      "Small boxes from £7, medium boxes from £18 and large boxes from £30. We also offer multi-box bundles that save you money.",
  },
  {
    question: "How fresh are the mangoes?",
    answer:
      "Our mangoes are freshly imported in season and moved quickly through our cold chain, so they arrive at their sweet, ripe best.",
  },
  {
    question: "How do I place an order?",
    answer:
      "Message us on WhatsApp, give us a call, or fill in the order form on our Contact page and we'll get straight back to you.",
  },
  {
    question: "Do you sell any other fruit?",
    answer:
      "No — we focus purely on premium Pakistani mangoes so we can guarantee the very best quality and value.",
  },
] as const;

export const kavo = {
  name: "Kavo Technologies",
  url: "https://www.kavotech.uk",
} as const;
