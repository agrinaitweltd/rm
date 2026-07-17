export const site = {
  name: "RM Mangoes",
  slogan: "From Pakistani Farms to Scottish Doorsteps",
  tagline: "King Of Mangoes",
  url: "https://rmmangoes.co.uk",
  // Add your Google Analytics 4 Measurement ID (e.g. "G-XXXXXXXXXX") to
  // enable analytics — or set NEXT_PUBLIC_GA_ID in the environment.
  gaId: process.env.NEXT_PUBLIC_GA_ID || "",
  email: "info@rmmangoes.co.uk",
  phoneDisplay: "+44 0788080890",
  phoneTel: "+44788080890",
  whatsapp: "https://wa.me/44788080890",
  whatsappOrder: (box: string) =>
    `https://wa.me/44788080890?text=${encodeURIComponent(
      `Hi RM Mangoes, I'd like to order ${box}.`
    )}`,
  tiktok: "https://www.tiktok.com/@rm_mangoes",
  tiktokHandle: "@rm_mangoes",
  madeBy: "Kavo Technologies",
  madeByUrl: "https://www.kavotech.uk",
};

// Each price option has its own image file in public/ — replace freely.
// `id` is a stable key used by the cart and Stripe; `amount` is the price in
// pence and is the single source of truth the server uses to build Stripe line
// items (client-sent prices are never trusted). `price` stays the display
// string so the existing UI is untouched.
export type ProductCategory = "mangoes" | "fruit" | "veg";

export const categories: { key: ProductCategory; label: string }[] = [
  { key: "mangoes", label: "Packed Mangoes" },
  { key: "fruit", label: "Fresh Fruit" },
  { key: "veg", label: "Vegetables" },
];

export type Product = {
  id: string;
  title: string;
  price: string;
  amount: number; // pence
  image: string;
  // Flat SVG mark shown on The Chain page and used as an automatic fallback
  // wherever the photo (image) hasn't been uploaded yet.
  icon?: string;
  category: ProductCategory;
  order: string;
};

export const products: Product[] = [
  { id: "small-1", title: "Small Box", price: "£7", amount: 700, image: "/mango-box-small.png", category: "mangoes", order: "a Small Box of mangoes (£7)" },
  { id: "small-2", title: "2 Small Boxes", price: "£13", amount: 1300, image: "/mango-box-2-small.png", category: "mangoes", order: "2 Small Boxes of mangoes (£13)" },
  { id: "small-3", title: "3 Small Boxes", price: "£20", amount: 2000, image: "/mango-box-3-small.png", category: "mangoes", order: "3 Small Boxes of mangoes (£20)" },
  { id: "medium-1", title: "Medium Box", price: "£18", amount: 1800, image: "/mango-box-medium.png", category: "mangoes", order: "a Medium Box of mangoes (£18)" },
  { id: "medium-2", title: "2 Medium Boxes", price: "£35", amount: 3500, image: "/mango-box-2-medium.png", category: "mangoes", order: "2 Medium Boxes of mangoes (£35)" },
  { id: "large-1", title: "Large Box", price: "£30", amount: 3000, image: "/mango-box-large.png", category: "mangoes", order: "a Large Box of mangoes (£30)" },
  { id: "guava-large", title: "Large Guava", price: "£1", amount: 100, image: "/guava-large.png", icon: "/icon-guava.svg", category: "fruit", order: "a Large Guava (£1)" },
  { id: "apricot-250g", title: "Apricots 250g", price: "£2.50", amount: 250, image: "/apricot-250g.png", icon: "/icon-apricot.svg", category: "fruit", order: "Apricots 250g (£2.50)" },
  { id: "cherries-large", title: "Large Box of Cherries", price: "£12", amount: 1200, image: "/cherries-large.png", icon: "/icon-cherries.svg", category: "fruit", order: "a Large Box of Cherries (£12)" },
  { id: "karela-large", title: "Large Box of Karela", price: "£8", amount: 800, image: "/karela-large.png", icon: "/icon-karela.svg", category: "veg", order: "a Large Box of Karela (£8)" },
  { id: "jamun", title: "Jamun", price: "£12", amount: 1200, image: "/jamun.png", icon: "/icon-jamun.svg", category: "fruit", order: "Jamun (£12)" },
  { id: "watermelon-large", title: "Large Watermelon", price: "£5.50", amount: 550, image: "/watermelon-large.png", icon: "/icon-watermelon.svg", category: "fruit", order: "a Large Watermelon (£5.50)" },
  { id: "khubani-large-apricot", title: "Khubani - Pakistani Large Box Apricot", price: "£10", amount: 1000, image: "/khubani-large-apricot.png", category: "fruit", order: "Khubani - Pakistani Large Box Apricot (£10)" },
  { id: "kishmish-small-grapes", title: "Kishmish - Pakistani Small Grapes", price: "£3.50", amount: 350, image: "/kishmish-small-grapes.png", category: "fruit", order: "Kishmish - Pakistani Small Grapes (£3.50)" },
  { id: "lychee-large-box", title: "Lychee Large Box", price: "£15", amount: 1500, image: "/lychee-large-box.png", category: "fruit", order: "a Large Box of Lychee (£15)" },
  { id: "jackfruit-peeled-200g", title: "Jackfruit Cut and Peeled 200g", price: "£3.50", amount: 350, image: "/jackfruit-peeled-200g.png", category: "fruit", order: "Jackfruit Cut and Peeled 200g (£3.50)" },
  { id: "dragon-fruit", title: "Dragon Fruit", price: "£3.50", amount: 350, image: "/dragon-fruit.png", category: "fruit", order: "Dragon Fruit (£3.50)" },
];

// Server-side lookup for authoritative pricing (used by the checkout API).
export const productById = (id: string): Product | undefined =>
  products.find((p) => p.id === id);

// Flat delivery charge per order, in pence. Applied on top of the item total
// by the payment API and shown as its own line in the cart and checkout.
export const DELIVERY_FEE_PENCE = 500;
