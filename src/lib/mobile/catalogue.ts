import { products, categories, site, type Product } from "@/lib/site";
import type { MobileProduct, MobileProductVariant, MobileCategory } from "./types";

const photoUrl = (image: string) => `${site.url}${image}`;

function toVariant(p: Product, stock: Record<string, number>, updatedAt: Record<string, string>): MobileProductVariant {
  return {
    id: p.id,
    label: p.subtitle || p.title,
    price: p.price,
    amount: p.amount,
    old_price: p.oldPrice || null,
    stock: stock[p.id] ?? 0,
    barcode: p.barcode || null,
  };
}

// Groups variantGroup siblings into one catalogue entry (same shape the
// website's shop grid uses), so the app doesn't have to re-derive grouping.
export function buildCatalogue(
  stock: Record<string, number>,
  updatedAt: Record<string, string>
): MobileProduct[] {
  const groups = new Map<string, Product[]>();
  for (const p of products) {
    const key = p.variantGroup || p.id;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(p);
  }

  const out: MobileProduct[] = [];
  for (const group of groups.values()) {
    const sorted = [...group].sort((a, b) => a.amount - b.amount);
    const anchor = sorted[0];
    const isGroup = sorted.length > 1;
    out.push({
      id: anchor.id,
      title: anchor.title,
      subtitle: isGroup ? null : anchor.subtitle || null,
      description: anchor.order,
      price: anchor.price,
      old_price: anchor.oldPrice || null,
      amount: anchor.amount,
      photos: [photoUrl(anchor.image)],
      category: anchor.category,
      stock: stock[anchor.id] ?? 0,
      barcode: anchor.barcode || null,
      variants: isGroup ? sorted.map((p) => toVariant(p, stock, updatedAt)) : null,
      promo: anchor.promotion || null,
      updated_at: updatedAt[anchor.id] || new Date(0).toISOString(),
    });
  }
  return out;
}

export function buildCategoryCounts(): MobileCategory[] {
  return categories.map((c) => ({
    key: c.key,
    label: c.label,
    productCount: products.filter((p) => p.category === c.key).length,
  }));
}
