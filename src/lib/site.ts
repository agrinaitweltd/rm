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
export type ProductCategory = "mangoes" | "fruit" | "veg" | "others" | "franchise";

export const categories: { key: ProductCategory; label: string }[] = [
  { key: "mangoes", label: "Packed Mangoes" },
  { key: "fruit", label: "Fresh Fruit" },
  { key: "veg", label: "Vegetables" },
  { key: "others", label: "Others" },
  { key: "franchise", label: "Mango Shakes Franchise" },
];

export type Product = {
  id: string;
  title: string;
  // Optional small line shown under the title (e.g. an alternate/former name).
  subtitle?: string;
  price: string;
  oldPrice?: string;
  promotion?: string;
  amount: number; // pence
  image: string;
  // Flat SVG mark shown on The Chain page and used as an automatic fallback
  // wherever the photo (image) hasn't been uploaded yet.
  icon?: string;
  category: ProductCategory;
  // Groups multiple size/pack SKUs (each with its own price, stock and
  // barcode) into a single card with a size selector, instead of showing
  // each tier as its own separate product tile.
  variantGroup?: string;
  order: string;
  // 12-digit UPC-A barcode printed on the physical box label. Uses the
  // GS1 "20"-prefix reserved for in-store/private use, so it's guaranteed
  // never to collide with a real retail product's registered barcode.
  barcode?: string;
};

export const products: Product[] = [
  { id: "small-1", title: "Small Box", price: "£7", amount: 700, image: "/mango-box-small.png", category: "mangoes", order: "a Small Box of mangoes (£7)", barcode: "200000000011" },
  { id: "small-2", title: "2 Small Boxes", price: "£13", amount: 1300, image: "/mango-box-2-small.png", category: "mangoes", order: "2 Small Boxes of mangoes (£13)", barcode: "200000000028" },
  { id: "small-3", title: "3 Small Boxes", price: "£20", amount: 2000, image: "/mango-box-3-small.png", category: "mangoes", order: "3 Small Boxes of mangoes (£20)", barcode: "200000000035" },
  { id: "medium-1", title: "Medium Box", price: "£18", amount: 1800, image: "/mango-box-medium.png", category: "mangoes", order: "a Medium Box of mangoes (£18)", barcode: "200000000042" },
  { id: "medium-2", title: "2 Medium Boxes", price: "£35", amount: 3500, image: "/mango-box-2-medium.png", category: "mangoes", order: "2 Medium Boxes of mangoes (£35)", barcode: "200000000059" },
  { id: "large-1", title: "Large Box", price: "£24", oldPrice: "£30", promotion: "20% Off Today", amount: 2400, image: "/mango-box-large.png", category: "mangoes", order: "a Large Box of mangoes at 20% off (£24)", barcode: "200000000066" },
  { id: "guava-large", title: "Large Guava", price: "£1", amount: 100, image: "/guava-large.png", icon: "/icon-guava.svg", category: "fruit", order: "a Large Guava (£1)", barcode: "200000000073" },
  { id: "cherries-large", title: "Cherries — 2kg Box", price: "£12", amount: 1200, image: "/cherries-large.png", icon: "/icon-cherries.svg", category: "fruit", order: "Cherries 2kg Box (£12)", barcode: "200000000080" },
  { id: "karela-large", title: "Large Box of Karela", price: "£9", amount: 900, image: "/karela-large.png", icon: "/icon-karela.svg", category: "veg", order: "a Large Box of Karela (£9)", barcode: "200000000097" },
  { id: "watermelon-large", title: "Watermelon", price: "£6", amount: 600, image: "/watermelon-large.png", icon: "/icon-watermelon.svg", category: "fruit", order: "a Watermelon (£6)", barcode: "200000000103" },
  { id: "kishmish-small-grapes", title: "Red Grapes", price: "£3.50", amount: 350, image: "/kishmish-small-grapes.png", category: "fruit", order: "Red Grapes (£3.50)", barcode: "200000000110" },
  { id: "lychee-large-box", title: "Lychee Large Box", price: "£13", amount: 1300, image: "/lychee-large-box.png", category: "fruit", order: "a Large Box of Lychee (£13)", barcode: "200000000127" },
  { id: "dragon-fruit", title: "Dragon Fruit", price: "£3.50", amount: 350, image: "/dragon-fruit.png", category: "fruit", order: "Dragon Fruit (£3.50)", barcode: "200000000134" },

  // Added per the extended fruit & veg price list.
  { id: "peach-flat-250g", title: "Flat Peaches — 250g Pack", price: "£2", amount: 200, image: "/peach-flat-250g.png", icon: "/icon-fruit-generic.svg", category: "fruit", order: "Flat Peaches 250g Pack (£2)", barcode: "200000000141" },
  { id: "melon-yellow", title: "Yellow Melon", price: "£3", amount: 300, image: "/melon-yellow.png", icon: "/icon-fruit-generic.svg", category: "fruit", order: "a Yellow Melon (£3)", barcode: "200000000158" },
  { id: "melon-galia", title: "Galia Melon", price: "£2.50", amount: 250, image: "/melon-galia.png", icon: "/icon-fruit-generic.svg", category: "fruit", order: "a Galia Melon (£2.50)", barcode: "200000000165" },
  { id: "grapes-xl-bunch", title: "Black Grapes", price: "£3.50", amount: 350, image: "/grapes-xl-bunch.png", icon: "/icon-fruit-generic.svg", category: "fruit", order: "Black Grapes (£3.50)", barcode: "200000000172" },
  { id: "pomegranate", title: "Pomegranate", price: "£1.50", amount: 150, image: "/pomegranate.png", icon: "/icon-fruit-generic.svg", category: "fruit", order: "a Pomegranate (£1.50)", barcode: "200000000189" },
  { id: "premium-punjabi-gur", title: "Premium Punjabi Gur", price: "£3", amount: 300, image: "/gur.png", category: "others", order: "Premium Punjabi Gur (£3)", barcode: "200000000394" },
  { id: "bananas-bunch", title: "Bananas Bunch", price: "£1.50", amount: 150, image: "/bananas-bunch.png", icon: "/icon-fruit-generic.svg", category: "fruit", order: "a Bananas Bunch (£1.50)", barcode: "200000000202" },

  { id: "tomato-box", title: "Tomato Box", price: "£6", amount: 600, image: "/tomato-box.png", icon: "/icon-veg-generic.svg", category: "veg", order: "a Tomato Box (£6)", barcode: "200000000219" },
  { id: "pineapple-large", title: "Honey Glow Pineapple", price: "£3", amount: 300, image: "/pineapple-large.png", icon: "/icon-pineapple.svg", category: "fruit", order: "a Honey Glow Pineapple (£3)", barcode: "200000000226" },
  { id: "golden-pear", title: "Pura Vida Golden Pear", price: "£1", amount: 100, image: "/golden-pear.png", icon: "/icon-pear.svg", category: "fruit", order: "a Pura Vida Golden Pear (£1)", barcode: "200000000233" },
  { id: "coconut-water", title: "Coconut Jelly", subtitle: "(Coconut Water)", price: "£2.50", amount: 250, image: "/coconut-water.png", icon: "/icon-veg-generic.svg", category: "veg", order: "a Coconut Jelly (£2.50)", barcode: "200000000240" },
  { id: "coriander-bunch", title: "Coriander Bunch", price: "£0.50", amount: 50, image: "/coriander-bunch.png", icon: "/icon-veg-generic.svg", category: "veg", order: "a Coriander Bunch (£0.50)", barcode: "200000000257" },
  { id: "garlic-bunch", title: "Garlic Bunch", price: "£1", amount: 100, image: "/garlic-bunch.png", icon: "/icon-veg-generic.svg", category: "veg", order: "a Garlic Bunch (£1)", barcode: "200000000264" },
  { id: "mushrooms-3kg", title: "Mushrooms — 3kg Crate", price: "£9", amount: 900, image: "/mushrooms-3kg.png", icon: "/icon-veg-generic.svg", category: "veg", order: "Mushrooms 3kg Crate (£9)", barcode: "200000000271" },
  { id: "lauki-bottle-gourd", title: "Lauki (Bottle Gourd)", price: "£1.50", amount: 150, image: "/lauki-bottle-gourd.png", icon: "/icon-veg-generic.svg", category: "veg", order: "a Lauki / Bottle Gourd (£1.50)", barcode: "200000000288" },
  { id: "pepper-mix", title: "Mix Pepper", price: "£2", amount: 200, image: "/pepper-mix.png", icon: "/icon-veg-generic.svg", category: "veg", order: "Mix Pepper (£2)", barcode: "200000000295" },
  { id: "mint-bunch", title: "Mints", price: "£1.50", amount: 150, image: "/mint-bunch.png", icon: "/icon-veg-generic.svg", category: "veg", order: "a Mint Bunch (£1.50)", barcode: "200000000301" },
  { id: "lettuce-4-large", title: "Large Lettuce", price: "£1", amount: 100, image: "/lettuce-4-large.png", icon: "/icon-veg-generic.svg", category: "veg", order: "a Large Lettuce (£1)", barcode: "200000000318" },
  { id: "spring-onion-bunch", title: "Spring Onion Bunch", price: "£1", amount: 100, image: "/spring-onion-bunch.png", icon: "/icon-veg-generic.svg", category: "veg", order: "a Spring Onion Bunch (£1)", barcode: "200000000325" },
  { id: "chilli-bird-eye", title: "Bird's Eye Chilli", price: "£16", amount: 1600, image: "/chilli-bird-eye.png", icon: "/icon-veg-generic.svg", category: "veg", order: "Bird's Eye Chilli (£16)", barcode: "200000000332" },
  { id: "chilli-bullet-box", title: "Bullet Chilli Box", price: "£8", amount: 800, image: "/chilli-bullet-box.png", icon: "/icon-veg-generic.svg", category: "veg", order: "a Bullet Chilli Box (£8)", barcode: "200000000349" },
  { id: "mooli-white", title: "White Mooli", price: "£1.50", amount: 150, image: "/mooli-white.png", icon: "/icon-veg-generic.svg", category: "veg", order: "a White Mooli (£1.50)", barcode: "200000000356" },
  { id: "aubergine-large-box", title: "Large Box of Aubergine", price: "£9", amount: 900, image: "/aubergine-large-box.png", icon: "/icon-veg-generic.svg", category: "veg", order: "a Large Box of Aubergine (£9)", barcode: "200000000363" },
  // Price TBC — being confirmed; kept at £0 and marked out of stock so it can't be bought until then.
  { id: "spinach", title: "Spinach", price: "£0", amount: 0, image: "/spinach.png", icon: "/icon-veg-generic.svg", category: "veg", order: "Spinach (price TBC)", barcode: "200000000370" },
  { id: "ginger-large-box", title: "Large Box of Ginger", subtitle: "5kg", price: "£0", amount: 0, image: "/ginger-large-box.png", icon: "/icon-veg-generic.svg", category: "veg", order: "a Large Box of Ginger, 5kg (price TBC)", barcode: "200000000387" },

  // Household/pantry items — no photos uploaded yet, so these fall back to
  // the generic icon until real product shots are added.
  { id: "granulated-sugar", title: "Granulated Sugar", subtitle: "5kg", price: "£6", amount: 600, image: "/granulated-sugar.png", icon: "/icon-veg-generic.svg", category: "others", order: "Granulated Sugar, 5kg (£6)", barcode: "200000000400" },
  { id: "blue-roll", title: "Blue Roll", subtitle: "Each", price: "£2", amount: 200, image: "/blue-roll.png", icon: "/icon-veg-generic.svg", category: "others", variantGroup: "blue-roll", order: "Blue Roll (£2 each)", barcode: "200000000417" },
  { id: "blue-roll-pack6", title: "Blue Roll", subtitle: "Pack of 6", price: "£6.50", amount: 650, image: "/blue-roll.png", icon: "/icon-veg-generic.svg", category: "others", variantGroup: "blue-roll", order: "Blue Roll, Pack of 6 (£6.50)", barcode: "200000000424" },
  { id: "blue-roll-case50", title: "Blue Roll", subtitle: "50 Packs of 6", price: "£300", amount: 30000, image: "/blue-roll.png", icon: "/icon-veg-generic.svg", category: "others", variantGroup: "blue-roll", order: "Blue Roll, 50 Packs of 6 (£300)", barcode: "200000000431" },
  { id: "kitchen-towel-xl", title: "XL Kitchen Towel Roll", subtitle: "Each", price: "£1", amount: 100, image: "/kitchen-towel-xl.png", icon: "/icon-veg-generic.svg", category: "others", variantGroup: "kitchen-towel-xl", order: "XL Kitchen Towel Roll (£1 each)", barcode: "200000000448" },
  { id: "kitchen-towel-xl-pack6", title: "XL Kitchen Towel Roll", subtitle: "Pack of 6", price: "£5.50", amount: 550, image: "/kitchen-towel-xl.png", icon: "/icon-veg-generic.svg", category: "others", variantGroup: "kitchen-towel-xl", order: "XL Kitchen Towel Roll, Pack of 6 (£5.50)", barcode: "200000000455" },
  { id: "kitchen-towel-xl-case50", title: "XL Kitchen Towel Roll", subtitle: "50 Packs of 6", price: "£250", amount: 25000, image: "/kitchen-towel-xl.png", icon: "/icon-veg-generic.svg", category: "others", variantGroup: "kitchen-towel-xl", order: "XL Kitchen Towel Roll, 50 Packs of 6 (£250)", barcode: "200000000462" },
  { id: "garlic-paste-1kg", title: "Garlic Paste", subtitle: "1kg Tub", price: "£3", amount: 300, image: "/garlic-paste-1kg.png", icon: "/icon-veg-generic.svg", category: "others", order: "Garlic Paste, 1kg Tub (£3)", barcode: "200000000479" },
  { id: "ginger-paste-1kg", title: "Ginger Paste", subtitle: "1kg Tub", price: "£3", amount: 300, image: "/ginger-paste-1kg.png", icon: "/icon-veg-generic.svg", category: "others", order: "Ginger Paste, 1kg Tub (£3)", barcode: "200000000486" },

  // Mango Shakes Franchise kit — equipment and supplies sold to franchisees.
  { id: "mixing-bowls-lids", title: "Mixing Bowls with Lids", price: "£26", amount: 2600, image: "/mixing-bowls-lids.png", icon: "/icon-veg-generic.svg", category: "franchise", order: "Mixing Bowls with Lids (£26)", barcode: "200000000493" },
  { id: "collapsible-colander", title: "Collapsible Colander", price: "£19", amount: 1900, image: "/collapsible-colander.png", icon: "/icon-veg-generic.svg", category: "franchise", order: "Collapsible Colander (£19)", barcode: "200000000509" },
  { id: "knife-set-ceramic", title: "Ceramic-Coated Knife Set", price: "£20", amount: 2000, image: "/knife-set-ceramic.png", icon: "/icon-veg-generic.svg", category: "franchise", order: "Ceramic-Coated Knife Set (£20)", barcode: "200000000516" },
  { id: "straws-pack", title: "Straws", price: "£8", amount: 800, image: "/straws-pack.png", icon: "/icon-veg-generic.svg", category: "franchise", order: "Straws (£8)", barcode: "200000000523" },
  { id: "whipped-cream", title: "Whipped Cream", price: "£6", amount: 600, image: "/whipped-cream.png", icon: "/icon-veg-generic.svg", category: "franchise", order: "Whipped Cream (£6)", barcode: "200000000530" },
  { id: "franchise-sugar", title: "Sugar", subtitle: "5kg", price: "£6", amount: 600, image: "/granulated-sugar.png", icon: "/icon-veg-generic.svg", category: "franchise", order: "Sugar, 5kg (£6)", barcode: "200000000547" },
  { id: "cups-50", title: "Cups", subtitle: "Pack of 50", price: "£5", amount: 500, image: "/cups-50.png", icon: "/icon-veg-generic.svg", category: "franchise", order: "Cups, Pack of 50 (£5)", barcode: "200000000554" },
  { id: "lids-50", title: "Lids", subtitle: "Pack of 50", price: "£5", amount: 500, image: "/lids-50.png", icon: "/icon-veg-generic.svg", category: "franchise", order: "Lids, Pack of 50 (£5)", barcode: "200000000561" },
  { id: "mango-sauce", title: "Mango Sauce", price: "£10", amount: 1000, image: "/mango-sauce.png", icon: "/icon-veg-generic.svg", category: "franchise", order: "Mango Sauce (£10)", barcode: "200000000578" },
  { id: "blender", title: "Blender", price: "£80", amount: 8000, image: "/blender.png", icon: "/icon-veg-generic.svg", category: "franchise", order: "Blender (£80)", barcode: "200000000585" },
];

// Server-side lookup for authoritative pricing (used by the checkout API).
export const productById = (id: string): Product | undefined =>
  products.find((p) => p.id === id);

// Server-side lookup by scanned/typed barcode (used by the admin panel).
export const productByBarcode = (code: string): Product | undefined =>
  products.find((p) => p.barcode === code.trim());

// Flat delivery charge per order, in pence. Applied on top of the item total
// by the payment API and shown as its own line in the cart and checkout.
export const DELIVERY_FEE_PENCE = 500;
