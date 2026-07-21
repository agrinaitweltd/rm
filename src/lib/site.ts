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
  // Optional small line shown under the title (e.g. an alternate/former name).
  subtitle?: string;
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
  { id: "cherries-large", title: "Cherries — 2kg Box", price: "£12", amount: 1200, image: "/cherries-large.png", icon: "/icon-cherries.svg", category: "fruit", order: "Cherries 2kg Box (£12)" },
  { id: "karela-large", title: "Large Box of Karela", price: "£9", amount: 900, image: "/karela-large.png", icon: "/icon-karela.svg", category: "veg", order: "a Large Box of Karela (£9)" },
  { id: "watermelon-large", title: "Watermelon", price: "£6", amount: 600, image: "/watermelon-large.png", icon: "/icon-watermelon.svg", category: "fruit", order: "a Watermelon (£6)" },
  { id: "kishmish-small-grapes", title: "Red Grapes", price: "£3.50", amount: 350, image: "/kishmish-small-grapes.png", category: "fruit", order: "Red Grapes (£3.50)" },
  { id: "lychee-large-box", title: "Lychee Large Box", price: "£13", amount: 1300, image: "/lychee-large-box.png", category: "fruit", order: "a Large Box of Lychee (£13)" },
  { id: "jackfruit-peeled-200g", title: "Jackfruit Cut and Peeled 200g", price: "£3.50", amount: 350, image: "/jackfruit-peeled-200g.png", category: "fruit", order: "Jackfruit Cut and Peeled 200g (£3.50)" },
  { id: "dragon-fruit", title: "Dragon Fruit", price: "£3.50", amount: 350, image: "/dragon-fruit.png", category: "fruit", order: "Dragon Fruit (£3.50)" },

  // Added per the extended fruit & veg price list.
  { id: "peach-flat-250g", title: "Flat Peaches — 250g Pack", price: "£2", amount: 200, image: "/peach-flat-250g.png", icon: "/icon-fruit-generic.svg", category: "fruit", order: "Flat Peaches 250g Pack (£2)" },
  { id: "melon-yellow", title: "Yellow Melon", price: "£3", amount: 300, image: "/melon-yellow.png", icon: "/icon-fruit-generic.svg", category: "fruit", order: "a Yellow Melon (£3)" },
  { id: "melon-galia", title: "Galia Melon", price: "£2.50", amount: 250, image: "/melon-galia.png", icon: "/icon-fruit-generic.svg", category: "fruit", order: "a Galia Melon (£2.50)" },
  { id: "grapes-xl-bunch", title: "Black Grapes", price: "£7.50", amount: 750, image: "/grapes-xl-bunch.png", icon: "/icon-fruit-generic.svg", category: "fruit", order: "Black Grapes (£7.50)" },
  { id: "pomegranate", title: "Pomegranate", price: "£1.50", amount: 150, image: "/pomegranate.png", icon: "/icon-fruit-generic.svg", category: "fruit", order: "a Pomegranate (£1.50)" },
  { id: "large-1-20off", title: "Large Box — 20% Off", price: "£24", amount: 2400, image: "/mango-box-large.png", category: "mangoes", order: "a Large Box of mangoes at 20% off (£24)" },
  { id: "bananas-bunch", title: "Bananas Bunch", price: "£1.50", amount: 150, image: "/bananas-bunch.png", icon: "/icon-fruit-generic.svg", category: "fruit", order: "a Bananas Bunch (£1.50)" },

  { id: "tomato-box", title: "Tomato Box", price: "£6", amount: 600, image: "/tomato-box.png", icon: "/icon-veg-generic.svg", category: "veg", order: "a Tomato Box (£6)" },
  { id: "pineapple-large", title: "Honey Glow Pineapple", price: "£3", amount: 300, image: "/pineapple-large.png", icon: "/icon-pineapple.svg", category: "fruit", order: "a Honey Glow Pineapple (£3)" },
  { id: "golden-pear", title: "Pura Vida Golden Pear", price: "£1", amount: 100, image: "/golden-pear.png", icon: "/icon-pear.svg", category: "fruit", order: "a Pura Vida Golden Pear (£1)" },
  { id: "coconut-water", title: "Coconut Jelly", subtitle: "(Coconut Water)", price: "£2.50", amount: 250, image: "/coconut-water.png", icon: "/icon-veg-generic.svg", category: "veg", order: "a Coconut Jelly (£2.50)" },
  { id: "coriander-bunch", title: "Coriander Bunch", price: "£0.50", amount: 50, image: "/coriander-bunch.png", icon: "/icon-veg-generic.svg", category: "veg", order: "a Coriander Bunch (£0.50)" },
  { id: "garlic-bunch", title: "Garlic Bunch", price: "£1", amount: 100, image: "/garlic-bunch.png", icon: "/icon-veg-generic.svg", category: "veg", order: "a Garlic Bunch (£1)" },
  { id: "mushrooms-3kg", title: "Mushrooms — 3kg Crate", price: "£9", amount: 900, image: "/mushrooms-3kg.png", icon: "/icon-veg-generic.svg", category: "veg", order: "Mushrooms 3kg Crate (£9)" },
  { id: "lauki-bottle-gourd", title: "Lauki (Bottle Gourd)", price: "£1.50", amount: 150, image: "/lauki-bottle-gourd.png", icon: "/icon-veg-generic.svg", category: "veg", order: "a Lauki / Bottle Gourd (£1.50)" },
  { id: "pepper-mix", title: "Mix Pepper", price: "£2", amount: 200, image: "/pepper-mix.png", icon: "/icon-veg-generic.svg", category: "veg", order: "Mix Pepper (£2)" },
  { id: "mint-bunch", title: "Mints", price: "£1.50", amount: 150, image: "/mint-bunch.png", icon: "/icon-veg-generic.svg", category: "veg", order: "a Mint Bunch (£1.50)" },
  { id: "lettuce-4-large", title: "Large Lettuce", price: "£1", amount: 100, image: "/lettuce-4-large.png", icon: "/icon-veg-generic.svg", category: "veg", order: "a Large Lettuce (£1)" },
  { id: "spring-onion-bunch", title: "Spring Onion Bunch", price: "£1", amount: 100, image: "/spring-onion-bunch.png", icon: "/icon-veg-generic.svg", category: "veg", order: "a Spring Onion Bunch (£1)" },
  { id: "chilli-bird-eye", title: "Bird's Eye Chilli", price: "£16", amount: 1600, image: "/chilli-bird-eye.png", icon: "/icon-veg-generic.svg", category: "veg", order: "Bird's Eye Chilli (£16)" },
  { id: "chilli-bullet-box", title: "Bullet Chilli Box", price: "£8", amount: 800, image: "/chilli-bullet-box.png", icon: "/icon-veg-generic.svg", category: "veg", order: "a Bullet Chilli Box (£8)" },
];

// Server-side lookup for authoritative pricing (used by the checkout API).
export const productById = (id: string): Product | undefined =>
  products.find((p) => p.id === id);

// Flat delivery charge per order, in pence. Applied on top of the item total
// by the payment API and shown as its own line in the cart and checkout.
export const DELIVERY_FEE_PENCE = 500;
