"use client";

import { useState } from "react";
import { products } from "@/lib/site";

type Props = { initial: Record<string, number> };

function StockRow({ id, title, price, initial }: { id: string; title: string; price: string; initial: number }) {
  const [value, setValue] = useState(String(initial));
  const [saving, setSaving] = useState(false);
  const [state, setState] = useState<"idle" | "saved" | "error">("idle");

  async function save() {
    setSaving(true);
    setState("idle");
    try {
      const res = await fetch("/api/admin/stock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: id, stock: Number(value) }),
      });
      setState(res.ok ? "saved" : "error");
      if (res.ok) setTimeout(() => setState("idle"), 1500);
    } catch {
      setState("error");
    }
    setSaving(false);
  }

  const soldOut = Number(value) <= 0;
  return (
    <tr>
      <td>
        {title} <span className="rm-admin-stock-price">{price}</span>
        {soldOut && <span className="rm-admin-stock-out">SOLD OUT</span>}
      </td>
      <td>
        <input
          type="number"
          min={0}
          max={100000}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={saving}
        />
      </td>
      <td>
        <button type="button" onClick={save} disabled={saving}>
          {saving ? "Saving…" : "Save"}
        </button>
        {state === "saved" && <span className="rm-admin-saved">✓</span>}
        {state === "error" && <span className="rm-admin-stock-err">failed</span>}
      </td>
    </tr>
  );
}

export default function StockPanel({ initial }: Props) {
  return (
    <section className="rm-admin-stock">
      <h2>Stock</h2>
      <p className="rm-admin-stock-hint">
        Stock drops automatically when an order is paid. Set a box to 0 to show it as sold out on the shop.
      </p>
      <table>
        <thead>
          <tr>
            <th>Product</th>
            <th>In stock</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <StockRow key={p.id} id={p.id} title={p.title} price={p.price} initial={initial[p.id] ?? 0} />
          ))}
        </tbody>
      </table>
    </section>
  );
}
