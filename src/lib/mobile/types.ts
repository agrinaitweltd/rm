export type MobileProductVariant = {
  id: string;
  label: string;
  price: string;
  amount: number;
  old_price: string | null;
  stock: number;
  barcode: string | null;
};

export type MobileProduct = {
  id: string;
  title: string;
  subtitle: string | null;
  description: string;
  price: string;
  old_price: string | null;
  amount: number;
  photos: string[];
  category: string;
  stock: number;
  barcode: string | null;
  variants: MobileProductVariant[] | null;
  promo: string | null;
  updated_at: string;
};

export type MobileCategory = {
  key: string;
  label: string;
  productCount: number;
};

export type MobileStoreInfo = {
  name: string;
  logo: string;
  currency: string;
  deliveryFee: number;
  version: string;
};

export type MobileSettings = {
  email: string;
  phone: string;
  whatsapp: string;
  deliveryFee: number;
  currency: string;
};

export type StoreApiKeyRow = {
  id: string;
  label: string;
  key_hash: string;
  key_prefix: string;
  created_at: string;
  last_used_at: string | null;
  revoked_at: string | null;
};
