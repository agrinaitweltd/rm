export const site = {
  name: "RM Mangoes",
  slogan: "From Pakistani Farms to Scottish & Irish Doorsteps",
  url: "https://rmmangoes.co.uk",
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

export const products = [
  { title: "Small Box", price: "£7", image: "/mango-box-small.png", order: "a Small Box (£7)" },
  { title: "2 Small Boxes", price: "£13", image: "/mango-box-small.png", order: "2 Small Boxes (£13)" },
  { title: "3 Small Boxes", price: "£20", image: "/mango-box-small.png", order: "3 Small Boxes (£20)" },
  { title: "Medium Box", price: "£18", image: "/mango-box-medium.png", order: "a Medium Box (£18)" },
  { title: "2 Medium Boxes", price: "£35", image: "/mango-box-medium.png", order: "2 Medium Boxes (£35)" },
  { title: "Large Box", price: "£30", image: "/mango-box-large.png", order: "a Large Box (£30)" },
];
