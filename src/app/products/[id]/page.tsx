import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageShell from "@/components/PageShell";
import ProductDetail from "./ProductDetail";
import { products, productById } from "@/lib/site";
import { getStock } from "@/lib/stock";

export const revalidate = 60;

export function generateStaticParams() {
  return products.map((p) => ({ id: p.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = productById(id);
  if (!product) return {};
  return {
    title: product.title,
    description: `${product.title} — ${product.price}. Fresh produce delivered across Scotland by RM Mangoes.`,
    alternates: { canonical: `/products/${product.id}` },
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = productById(id);
  if (!product) notFound();

  const stock = await getStock();
  const inCategory = products.filter((p) => p.category === product.category);
  const index = inCategory.findIndex((p) => p.id === product.id);
  const prev = inCategory[(index - 1 + inCategory.length) % inCategory.length];
  const next = inCategory[(index + 1) % inCategory.length];

  return (
    <PageShell postId={6799}>
      <ProductDetail
        product={product}
        soldOut={(stock[product.id] ?? 1) <= 0}
        prevId={prev.id}
        nextId={next.id}
      />
    </PageShell>
  );
}
