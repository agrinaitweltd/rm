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
  { id: "medium-1", title: "Medium Box", price: "£13", amount: 1300, image: "/mango-box-medium.png", category: "mangoes", order: "a Medium Box of mangoes (£13)", barcode: "200000000042" },
  { id: "medium-2", title: "2 Medium Boxes", price: "£25", amount: 2500, image: "/mango-box-2-medium.png", category: "mangoes", order: "2 Medium Boxes of mangoes (£25)", barcode: "200000000059" },
  { id: "large-1", title: "Large Box", price: "£24", oldPrice: "£30", promotion: "20% Off Today", amount: 2400, image: "/mango-box-large.png", category: "mangoes", order: "a Large Box of mangoes at 20% off (£24)", barcode: "200000000066" },
  { id: "guava-large", title: "Large Guava", price: "£1", amount: 100, image: "/guava-large.png", icon: "/icon-guava.svg", category: "fruit", order: "a Large Guava (£1)", barcode: "200000000073" },
  { id: "cherries-1kg", title: "Cherries", subtitle: "1kg", price: "£5", amount: 500, image: "/cherries-large.png", icon: "/icon-cherries.svg", category: "fruit", variantGroup: "cherries", order: "Cherries, 1kg (£5)", barcode: "200000000080" },
  { id: "cherries-box", title: "Cherries", subtitle: "Box", price: "£35", amount: 3500, image: "/cherries-large.png", icon: "/icon-cherries.svg", category: "fruit", variantGroup: "cherries", order: "Cherries Box (£35)", barcode: "200000000592" },
  { id: "karela-large", title: "Large Box of Karela", price: "£9", amount: 900, image: "/karela-large.png", icon: "/icon-karela.svg", category: "veg", order: "a Large Box of Karela (£9)", barcode: "200000000097" },
  { id: "watermelon-each", title: "Watermelon", subtitle: "Each", price: "£2", amount: 200, image: "/watermelon-large.png", icon: "/icon-watermelon.svg", category: "fruit", variantGroup: "watermelon", order: "a Watermelon (£2)", barcode: "200000000103" },
  { id: "watermelon-3", title: "Watermelon", subtitle: "3", price: "£5", amount: 500, image: "/watermelon-large.png", icon: "/icon-watermelon.svg", category: "fruit", variantGroup: "watermelon", order: "3 Watermelons (£5)", barcode: "200000000110" },
  { id: "red-grapes-bunch", title: "Red Grapes", subtitle: "Bunch", price: "£1.50", amount: 150, image: "/kishmish-small-grapes.png", icon: "/icon-grapes-red.svg", category: "fruit", variantGroup: "red-grapes", order: "Red Grapes Bunch (£1.50)", barcode: "200000000707" },
  { id: "red-grapes-box", title: "Red Grapes", subtitle: "Box", price: "£6", amount: 600, image: "/kishmish-small-grapes.png", icon: "/icon-grapes-red.svg", category: "fruit", variantGroup: "red-grapes", order: "Red Grapes Box (£6)", barcode: "200000000714" },
  { id: "lychee-large-box", title: "Lychee Large Box", price: "£13", amount: 1300, image: "/lychee-large-box.png", category: "fruit", order: "a Large Box of Lychee (£13)", barcode: "200000000127" },
  { id: "dragon-fruit", title: "Dragon Fruit", price: "£3.50", amount: 350, image: "/dragon-fruit.png", category: "fruit", order: "Dragon Fruit (£3.50)", barcode: "200000000134" },

  // Added per the extended fruit & veg price list.
  { id: "peach-each", title: "Peach", subtitle: "Each", price: "£0.30", amount: 30, image: "/peach-flat-250g.png", icon: "/icon-fruit-generic.svg", category: "fruit", variantGroup: "peach", order: "a Peach (£0.30)", barcode: "200000000141" },
  { id: "peach-box", title: "Peach", subtitle: "Box", price: "£7", amount: 700, image: "/peach-flat-250g.png", icon: "/icon-fruit-generic.svg", category: "fruit", variantGroup: "peach", order: "Peach Box (£7)", barcode: "200000000158" },
  { id: "plum-each", title: "Plum", subtitle: "Each", price: "£0.30", amount: 30, image: "/plum.png", icon: "/icon-fruit-generic.svg", category: "fruit", variantGroup: "plum", order: "a Plum (£0.30)", barcode: "200000000165" },
  { id: "plum-box", title: "Plum", subtitle: "Box", price: "£7", amount: 700, image: "/plum.png", icon: "/icon-fruit-generic.svg", category: "fruit", variantGroup: "plum", order: "Plum Box (£7)", barcode: "200000000172" },
  { id: "nectarine-each", title: "Nectarine", subtitle: "Each", price: "£0.30", amount: 30, image: "/nectarine.png", icon: "/icon-fruit-generic.svg", category: "fruit", variantGroup: "nectarine", order: "a Nectarine (£0.30)", barcode: "200000000721" },
  { id: "nectarine-box", title: "Nectarine", subtitle: "Box", price: "£7", amount: 700, image: "/nectarine.png", icon: "/icon-fruit-generic.svg", category: "fruit", variantGroup: "nectarine", order: "Nectarine Box (£7)", barcode: "200000000738" },
  { id: "melon-each", title: "Melon", subtitle: "Each", price: "£1", amount: 100, image: "/melon-yellow.png", icon: "/icon-melon.svg", category: "fruit", variantGroup: "melon", order: "a Melon (£1)", barcode: "200000000745" },
  { id: "melon-2", title: "Melon", subtitle: "2", price: "£1.50", amount: 150, image: "/melon-yellow.png", icon: "/icon-melon.svg", category: "fruit", variantGroup: "melon", order: "2 Melons (£1.50)", barcode: "200000000752" },
  { id: "black-grapes-bunch", title: "Black Grapes", subtitle: "Bunch", price: "£1.50", amount: 150, image: "/grapes-xl-bunch.png", icon: "/icon-grapes-black.svg", category: "fruit", variantGroup: "black-grapes", order: "Black Grapes Bunch (£1.50)", barcode: "200000000769" },
  { id: "black-grapes-box", title: "Black Grapes", subtitle: "Box", price: "£6", amount: 600, image: "/grapes-xl-bunch.png", icon: "/icon-grapes-black.svg", category: "fruit", variantGroup: "black-grapes", order: "Black Grapes Box (£6)", barcode: "200000000776" },
  { id: "white-grapes-bunch", title: "White Grapes", subtitle: "Bunch", price: "£1.50", amount: 150, image: "/white-grapes.png", icon: "/icon-fruit-generic.svg", category: "fruit", variantGroup: "white-grapes", order: "White Grapes Bunch (£1.50)", barcode: "200000000783" },
  { id: "white-grapes-box", title: "White Grapes", subtitle: "Box", price: "£6", amount: 600, image: "/white-grapes.png", icon: "/icon-fruit-generic.svg", category: "fruit", variantGroup: "white-grapes", order: "White Grapes Box (£6)", barcode: "200000000790" },
  { id: "pomegranate", title: "Pomegranate", price: "£1.50", amount: 150, image: "/pomegranate.png", icon: "/icon-fruit-generic.svg", category: "fruit", order: "a Pomegranate (£1.50)", barcode: "200000000189" },
  { id: "premium-punjabi-gur", title: "Premium Punjabi Gur", price: "£3", amount: 300, image: "/gur.png", category: "others", order: "Premium Punjabi Gur (£3)", barcode: "200000000394" },
  { id: "bananas-bunch", title: "Bananas Bunch", price: "£1.50", amount: 150, image: "/bananas-bunch.png", icon: "/icon-fruit-generic.svg", category: "fruit", order: "a Bananas Bunch (£1.50)", barcode: "200000000202" },

  { id: "tomato-box", title: "Tomato Box", price: "£6", amount: 600, image: "/tomato-box.png", icon: "/icon-veg-generic.svg", category: "veg", order: "a Tomato Box (£6)", barcode: "200000000219" },
  { id: "pineapple-large", title: "Honey Glow Pineapple", price: "£3", amount: 300, image: "/pineapple-large.png", icon: "/icon-pineapple.svg", category: "fruit", order: "a Honey Glow Pineapple (£3)", barcode: "200000000226" },
  { id: "golden-pear-each", title: "Pura Vida Golden Pear", subtitle: "Each", price: "£1", amount: 100, image: "/golden-pear.png", icon: "/icon-pear.svg", category: "fruit", variantGroup: "golden-pear", order: "a Pura Vida Golden Pear (£1)", barcode: "200000000233" },
  { id: "golden-pear-box12", title: "Pura Vida Golden Pear", subtitle: "Box of 12", price: "£10", amount: 1000, image: "/golden-pear.png", icon: "/icon-pear.svg", category: "fruit", variantGroup: "golden-pear", order: "Pura Vida Golden Pear, Box of 12 (£10)", barcode: "200000000806" },
  { id: "coconut-water", title: "Coconut Jelly", subtitle: "(Coconut Water)", price: "£2.50", amount: 250, image: "/coconut-water.png", icon: "/icon-veg-generic.svg", category: "veg", order: "a Coconut Jelly (£2.50)", barcode: "200000000240" },
  { id: "coriander-bunch", title: "Coriander Bunch", price: "£0.50", amount: 50, image: "/coriander-bunch.png", icon: "/icon-veg-generic.svg", category: "veg", order: "a Coriander Bunch (£0.50)", barcode: "200000000257" },
  { id: "garlic-bunch", title: "Garlic Bunch", price: "£1", amount: 100, image: "/garlic-bunch.png", icon: "/icon-veg-generic.svg", category: "veg", order: "a Garlic Bunch (£1)", barcode: "200000000264" },
  { id: "mushrooms-box", title: "Mushrooms", subtitle: "Box", price: "£8", amount: 800, image: "/mushrooms-3kg.png", icon: "/icon-mushroom.svg", category: "veg", variantGroup: "mushrooms", order: "Mushrooms Box (£8)", barcode: "200000000271" },
  { id: "mushrooms-2-boxes", title: "Mushrooms", subtitle: "2 Boxes", price: "£15", amount: 1500, image: "/mushrooms-3kg.png", icon: "/icon-mushroom.svg", category: "veg", variantGroup: "mushrooms", order: "2 Mushroom Boxes (£15)", barcode: "200000000813" },
  { id: "lauki-bottle-gourd", title: "Lauki (Bottle Gourd)", price: "£1.50", amount: 150, image: "/lauki-bottle-gourd.png", icon: "/icon-veg-generic.svg", category: "veg", order: "a Lauki / Bottle Gourd (£1.50)", barcode: "200000000288" },
  { id: "green-red-pepper-box", title: "Green & Red Pepper", subtitle: "Box", price: "£8", amount: 800, image: "/pepper-mix.png", icon: "/icon-veg-generic.svg", category: "veg", variantGroup: "green-red-pepper", order: "Green & Red Pepper Box (£8)", barcode: "200000000295" },
  { id: "green-red-pepper-2-boxes", title: "Green & Red Pepper", subtitle: "2 Boxes", price: "£15", amount: 1500, image: "/pepper-mix.png", icon: "/icon-veg-generic.svg", category: "veg", variantGroup: "green-red-pepper", order: "2 Green & Red Pepper Boxes (£15)", barcode: "200000000820" },
  { id: "mint-bunch", title: "Mints", price: "£1", amount: 100, image: "/mint-bunch.png", icon: "/icon-veg-generic.svg", category: "veg", order: "a Mint Bunch (£1)", barcode: "200000000301" },
  { id: "lettuce-each", title: "Lettuce", subtitle: "Each", price: "£1", amount: 100, image: "/lettuce-4-large.png", icon: "/icon-veg-generic.svg", category: "veg", variantGroup: "lettuce", order: "a Lettuce (£1)", barcode: "200000000318" },
  { id: "lettuce-2", title: "Lettuce", subtitle: "2", price: "£1.50", amount: 150, image: "/lettuce-4-large.png", icon: "/icon-veg-generic.svg", category: "veg", variantGroup: "lettuce", order: "2 Lettuces (£1.50)", barcode: "200000000837" },
  { id: "spring-onion-bunch", title: "Spring Onion Bunch", price: "£1", amount: 100, image: "/spring-onion-bunch.png", icon: "/icon-veg-generic.svg", category: "veg", order: "a Spring Onion Bunch (£1)", barcode: "200000000325" },
  { id: "chilli-bird-eye", title: "Bird's Eye Chilli Box", price: "£9", amount: 900, image: "/chilli-bird-eye.png", icon: "/icon-veg-generic.svg", category: "veg", order: "Bird's Eye Chilli Box (£9)", barcode: "200000000332" },
  { id: "chilli-bullet-box", title: "Chilli Box", price: "£5", amount: 500, image: "/chilli-bullet-box.png", icon: "/icon-veg-generic.svg", category: "veg", order: "a Chilli Box (£5)", barcode: "200000000349" },
  { id: "mooli-white", title: "White Mooli", price: "£1.50", amount: 150, image: "/mooli-white.png", icon: "/icon-veg-generic.svg", category: "veg", order: "a White Mooli (£1.50)", barcode: "200000000356" },
  { id: "aubergine-large-box", title: "Large Box of Aubergine", price: "£9", amount: 900, image: "/aubergine-large-box.png", icon: "/icon-veg-generic.svg", category: "veg", order: "a Large Box of Aubergine (£9)", barcode: "200000000363" },
  { id: "okra-kg", title: "Okra", subtitle: "1kg", price: "£5", amount: 500, image: "/okra.png", icon: "/icon-veg-generic.svg", category: "veg", variantGroup: "okra", order: "Okra, 1kg (£5)", barcode: "200000000844" },
  { id: "okra-box", title: "Okra", subtitle: "Box", price: "£10", amount: 1000, image: "/okra.png", icon: "/icon-veg-generic.svg", category: "veg", variantGroup: "okra", order: "Okra Box (£10)", barcode: "200000000851" },
  { id: "okra-2-boxes", title: "Okra", subtitle: "2 Boxes", price: "£18", amount: 1800, image: "/okra.png", icon: "/icon-veg-generic.svg", category: "veg", variantGroup: "okra", order: "2 Okra Boxes (£18)", barcode: "200000000868" },
  { id: "spinach-each", title: "Spinach", subtitle: "Each", price: "£1", amount: 100, image: "/spinach.png", icon: "/icon-veg-generic.svg", category: "veg", variantGroup: "spinach", order: "Spinach (£1)", barcode: "200000000370" },
  { id: "spinach-2", title: "Spinach", subtitle: "2", price: "£1.50", amount: 150, image: "/spinach.png", icon: "/icon-veg-generic.svg", category: "veg", variantGroup: "spinach", order: "2 Spinach (£1.50)", barcode: "200000000875" },
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

  { id: "big-orange-each", title: "Big Orange", subtitle: "Each", price: "£0.20", amount: 20, image: "/big-orange.png", icon: "/icon-fruit-generic.svg", category: "fruit", variantGroup: "big-orange", order: "a Big Orange (£0.20)", barcode: "200000000882" },
  { id: "big-orange-box", title: "Big Orange", subtitle: "Box", price: "£10", amount: 1000, image: "/big-orange.png", icon: "/icon-fruit-generic.svg", category: "fruit", variantGroup: "big-orange", order: "Big Orange Box (£10)", barcode: "200000000899" },
  { id: "big-orange-2-boxes", title: "Big Orange", subtitle: "2 Boxes", price: "£19", amount: 1900, image: "/big-orange.png", icon: "/icon-fruit-generic.svg", category: "fruit", variantGroup: "big-orange", order: "2 Big Orange Boxes (£19)", barcode: "200000000905" },
  { id: "red-onion-10kg", title: "Red Onion", subtitle: "10kg Box", price: "£7", amount: 700, image: "/red-onion.png", icon: "/icon-veg-generic.svg", category: "veg", variantGroup: "red-onion", order: "Red Onion, 10kg Box (£7)", barcode: "200000000912" },
  { id: "red-onion-2-boxes", title: "Red Onion", subtitle: "2 × 10kg Boxes", price: "£13", amount: 1300, image: "/red-onion.png", icon: "/icon-veg-generic.svg", category: "veg", variantGroup: "red-onion", order: "2 Red Onion 10kg Boxes (£13)", barcode: "200000000929" },
  { id: "bombay-onion-each", title: "Bombay Onion", subtitle: "Each", price: "£2", amount: 200, image: "/bombay-onion.png", icon: "/icon-veg-generic.svg", category: "veg", variantGroup: "bombay-onion", order: "a Bombay Onion (£2)", barcode: "200000000936" },
  { id: "bombay-onion-2", title: "Bombay Onion", subtitle: "2", price: "£3", amount: 300, image: "/bombay-onion.png", icon: "/icon-veg-generic.svg", category: "veg", variantGroup: "bombay-onion", order: "2 Bombay Onions (£3)", barcode: "200000000943" },

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
