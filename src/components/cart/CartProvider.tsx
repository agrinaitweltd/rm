"use client";

import { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
import { products, type Product } from "@/lib/site";

export type CartLine = { id: string; quantity: number };

type CartContextValue = {
  lines: CartLine[];
  open: boolean;
  itemCount: number;
  totalPence: number;
  setOpen: (open: boolean) => void;
  addItem: (id: string, quantity?: number) => void;
  setQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clear: () => void;
  productFor: (id: string) => Product | undefined;
  // Product most recently added, so a global "Added to cart" confirmation
  // (View Cart / Continue Shopping) can be shown without the drawer itself
  // popping open — addItem no longer opens the drawer automatically.
  lastAdded: Product | null;
  dismissLastAdded: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "rm-cart";

// Only ids present in the catalogue are ever kept — a stale localStorage entry
// for a removed product is quietly dropped.
function readStored(): CartLine[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CartLine[];
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((l) => l && typeof l.id === "string" && products.some((p) => p.id === l.id))
      .map((l) => ({ id: l.id, quantity: Math.max(1, Math.min(99, Math.floor(l.quantity) || 1)) }));
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [open, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [lastAdded, setLastAdded] = useState<Product | null>(null);

  // Load persisted cart after mount (avoids SSR/client mismatch).
  useEffect(() => {
    setLines(readStored());
    setHydrated(true);
  }, []);

  // Persist on every change once hydrated.
  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      /* storage full or blocked — cart still works in-memory */
    }
  }, [lines, hydrated]);

  const productFor = useCallback((id: string) => products.find((p) => p.id === id), []);

  const addItem = useCallback((id: string, quantity = 1) => {
    const product = products.find((p) => p.id === id);
    if (!product) return;
    const qty = Math.max(1, Math.min(99, Math.floor(quantity) || 1));
    setLines((prev) => {
      const existing = prev.find((l) => l.id === id);
      if (existing) {
        return prev.map((l) => (l.id === id ? { ...l, quantity: Math.min(99, l.quantity + qty) } : l));
      }
      return [...prev, { id, quantity: qty }];
    });
    // The confirmation modal (View Cart / Continue Shopping) handles the
    // "what next" moment now — the drawer no longer force-opens on add.
    setLastAdded(product);
  }, []);

  const dismissLastAdded = useCallback(() => setLastAdded(null), []);

  const setQuantity = useCallback((id: string, quantity: number) => {
    const q = Math.max(0, Math.min(99, Math.floor(quantity) || 0));
    setLines((prev) =>
      q <= 0 ? prev.filter((l) => l.id !== id) : prev.map((l) => (l.id === id ? { ...l, quantity: q } : l))
    );
  }, []);

  const removeItem = useCallback((id: string) => {
    setLines((prev) => prev.filter((l) => l.id !== id));
  }, []);

  // Clears state AND storage synchronously. On a hard page load a child's
  // clear() effect runs before this provider's hydration effect (child effects
  // fire first in React), so removing the key here prevents hydration from
  // restoring the just-cleared cart.
  const clear = useCallback(() => {
    setLines([]);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  const itemCount = useMemo(() => lines.reduce((n, l) => n + l.quantity, 0), [lines]);

  const totalPence = useMemo(
    () =>
      lines.reduce((sum, l) => {
        const p = products.find((pr) => pr.id === l.id);
        return sum + (p ? p.amount * l.quantity : 0);
      }, 0),
    [lines]
  );

  const value: CartContextValue = {
    lines,
    open,
    itemCount,
    totalPence,
    setOpen,
    addItem,
    setQuantity,
    removeItem,
    clear,
    productFor,
    lastAdded,
    dismissLastAdded,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

export const formatGBP = (pence: number) =>
  new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(pence / 100);
