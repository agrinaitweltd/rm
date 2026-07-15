"use client";

import { useState } from "react";

export type AdminPromo = {
  id: string;
  code: string;
  type: "percent" | "fixed";
  value: number;
  starts_at: string | null;
  expires_at: string | null;
  max_uses: number | null;
  uses: number;
  active: boolean;
};

const describe = (p: AdminPromo) =>
  p.type === "percent" ? `${p.value}% off` : `£${(p.value / 100).toFixed(2)} off`;

const shortDate = (iso: string | null) =>
  iso ? new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "—";

export default function PromoPanel({ initial }: { initial: AdminPromo[] }) {
  const [promos, setPromos] = useState(initial);
  const [code, setCode] = useState("");
  const [type, setType] = useState<"percent" | "fixed">("percent");
  const [value, setValue] = useState("");
  const [startsAt, setStartsAt] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [maxUses, setMaxUses] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function create(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/admin/promo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          type,
          // fixed amounts are entered in pounds, stored in pence
          value: type === "fixed" ? Math.round(Number(value) * 100) : Number(value),
          startsAt: startsAt || undefined,
          expiresAt: expiresAt || undefined,
          maxUses: maxUses ? Number(maxUses) : undefined,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Could not create the code.");
      } else {
        window.location.reload();
        return;
      }
    } catch {
      setError("Could not create the code.");
    }
    setBusy(false);
  }

  async function toggle(promo: AdminPromo) {
    const res = await fetch("/api/admin/promo", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: promo.id, active: !promo.active }),
    });
    if (res.ok) {
      setPromos((prev) => prev.map((p) => (p.id === promo.id ? { ...p, active: !p.active } : p)));
    }
  }

  async function remove(promo: AdminPromo) {
    const res = await fetch("/api/admin/promo", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: promo.id, delete: true }),
    });
    if (res.ok) {
      setPromos((prev) => prev.filter((p) => p.id !== promo.id));
    }
  }

  return (
    <section className="rm-admin-stock rm-admin-promo">
      <h2>Promo codes</h2>
      <p className="rm-admin-stock-hint">
        Customers enter these at checkout. Percentage or fixed £ discounts apply to the item subtotal
        (never the £5 delivery).
      </p>

      <form className="rm-admin-promo-form" onSubmit={create}>
        <input
          type="text"
          placeholder="CODE e.g. MANGO10"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          maxLength={30}
          required
        />
        <select value={type} onChange={(e) => setType(e.target.value as "percent" | "fixed")}>
          <option value="percent">% off</option>
          <option value="fixed">£ off</option>
        </select>
        <input
          type="number"
          placeholder={type === "percent" ? "e.g. 10 (%)" : "e.g. 5 (£)"}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          min={type === "percent" ? 1 : 0.5}
          max={type === "percent" ? 100 : 1000}
          step={type === "percent" ? 1 : 0.5}
          required
        />
        <label>
          Starts
          <input type="date" value={startsAt} onChange={(e) => setStartsAt(e.target.value)} />
        </label>
        <label>
          Expires
          <input type="date" value={expiresAt} onChange={(e) => setExpiresAt(e.target.value)} />
        </label>
        <input
          type="number"
          placeholder="Max uses (optional)"
          value={maxUses}
          onChange={(e) => setMaxUses(e.target.value)}
          min={1}
        />
        <button type="submit" disabled={busy}>
          {busy ? "Creating…" : "Create code"}
        </button>
      </form>
      {error && <p className="rm-admin-error">{error}</p>}

      {promos.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Code</th>
              <th>Discount</th>
              <th>Window</th>
              <th>Uses</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {promos.map((p) => (
              <tr key={p.id}>
                <td className="rm-admin-mono">{p.code}</td>
                <td>{describe(p)}</td>
                <td>
                  {shortDate(p.starts_at)} → {shortDate(p.expires_at)}
                </td>
                <td>
                  {p.uses}
                  {p.max_uses ? ` / ${p.max_uses}` : ""}
                </td>
                <td>{p.active ? "Active" : "Off"}</td>
                <td>
                  <button type="button" onClick={() => toggle(p)}>
                    {p.active ? "Disable" : "Enable"}
                  </button>{" "}
                  <button type="button" className="rm-admin-promo-delete" onClick={() => remove(p)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
