"use client";

import { useRef, useState } from "react";
import { products, productByBarcode } from "@/lib/site";

type Props = { initial: Record<string, number> };

function StockRow({
  id,
  title,
  price,
  barcode,
  initial,
  rowRef,
  highlighted,
}: {
  id: string;
  title: string;
  price: string;
  barcode?: string;
  initial: number;
  rowRef: (el: HTMLTableRowElement | null) => void;
  highlighted: boolean;
}) {
  const [value, setValue] = useState(String(initial));
  const [saving, setSaving] = useState(false);
  const [state, setState] = useState<"idle" | "saved" | "error">("idle");
  const inputRef = useRef<HTMLInputElement>(null);

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
    <tr ref={rowRef} className={highlighted ? "rm-admin-row-highlight" : undefined}>
      <td>
        {title} <span className="rm-admin-stock-price">{price}</span>
        {soldOut && <span className="rm-admin-stock-out">SOLD OUT</span>}
        {barcode && <span className="rm-admin-barcode">{barcode}</span>}
      </td>
      <td>
        <input
          ref={inputRef}
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
  const [scan, setScan] = useState("");
  const [scanError, setScanError] = useState("");
  const [foundId, setFoundId] = useState<string | null>(null);
  const rowRefs = useRef<Record<string, HTMLTableRowElement | null>>({});

  function handleScan() {
    const code = scan.trim();
    if (!code) return;
    const product = productByBarcode(code);
    if (!product) {
      setScanError(`No product matches barcode ${code}.`);
      setFoundId(null);
      return;
    }
    setScanError("");
    setFoundId(product.id);
    rowRefs.current[product.id]?.scrollIntoView({ behavior: "smooth", block: "center" });
    setScan("");
    setTimeout(() => setFoundId(null), 2500);
  }

  return (
    <section className="rm-admin-stock">
      <h2>Stock</h2>
      <p className="rm-admin-stock-hint">
        Stock drops automatically when an order is paid. Set a box to 0 to show it as sold out on the shop.
      </p>

      <div className="rm-admin-scan-row">
        <input
          type="text"
          placeholder="Scan or type a barcode…"
          value={scan}
          onChange={(e) => setScan(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleScan())}
          aria-label="Scan or type a product barcode"
        />
        <button type="button" onClick={handleScan}>
          Find
        </button>
      </div>
      {scanError && <p className="rm-admin-scan-error">{scanError}</p>}

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
            <StockRow
              key={p.id}
              id={p.id}
              title={p.title}
              price={p.price}
              barcode={p.barcode}
              initial={initial[p.id] ?? 0}
              rowRef={(el) => {
                rowRefs.current[p.id] = el;
              }}
              highlighted={foundId === p.id}
            />
          ))}
        </tbody>
      </table>
    </section>
  );
}
