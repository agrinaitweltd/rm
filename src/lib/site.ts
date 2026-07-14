export const site = {
  name: "RM Mangoes",
  slogan: "From Pakistani Farms to Scottish & Irish Doorsteps",
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
      `Hi RM Mangoes, I'd like to order ${box} of premium Pakistani mangoes.`
    )}`,
  tiktok: "https://www.tiktok.com/@rm_mangoes",
  tiktokHandle: "@rm_mangoes",
  madeBy: "Kavo Technologies",
  madeByUrl: "https://www.kavotech.uk",
};

// Each price option has its own image file in public/ — replace freely.
export const products = [
  { title: "Small Box", price: "£7", image: "/mango-box-small.png", order: "a Small Box (£7)" },
  { title: "2 Small Boxes", price: "£13", image: "/mango-box-2-small.png", order: "2 Small Boxes (£13)" },
  { title: "3 Small Boxes", price: "£20", image: "/mango-box-3-small.png", order: "3 Small Boxes (£20)" },
  { title: "Medium Box", price: "£18", image: "/mango-box-medium.png", order: "a Medium Box (£18)" },
  { title: "2 Medium Boxes", price: "£35", image: "/mango-box-2-medium.png", order: "2 Medium Boxes (£35)" },
  { title: "Large Box", price: "£30", image: "/mango-box-large.png", order: "a Large Box (£30)" },
];
