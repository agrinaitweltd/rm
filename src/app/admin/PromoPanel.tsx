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
  iso ? new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : null;

// Effective state, considering the on/off switch, dates and the use budget.
function statusOf(p: AdminPromo): { label: string; tone: "on" | "off" | "warn" } {
  if (!p.active) return { label: "Off", tone: "off" };
  const now = Date.now();
  if (p.starts_at && new Date(p.starts_at).getTime() > now) return { label: "Scheduled", tone: "warn" };
  if (p.expires_at && new Date(p.expires_at).getTime() < now) return { label: "Expired", tone: "off" };
  if (p.max_uses !== null && p.uses >= p.max_uses) return { label: "Used up", tone: "off" };
  return { label: "Active", tone: "on" };
}

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
  const [created, setCreated] = useState("");

  async function create(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    setCreated("");
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
      if (res.ok && data.promo) {
        setPromos((prev) => [data.promo as AdminPromo, ...prev]);
        setCreated(data.promo.code);
        setCode("");
        setValue("");
        setStartsAt("");
        setExpiresAt("");
        setMaxUses("");
        setTimeout(() => setCreated(""), 4000);
      } else {
        setError(data.error || "Could not create the code.");
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
    if (!window.confirm(`Delete promo code ${promo.code}? Customers will no longer be able to use it.`)) return;
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
        Customers enter these at checkout. The discount applies to the whole order — delivery included.
        Leave dates empty for no time limit, and max uses empty for unlimited.
      </p>

      <form className="rm-admin-promo-form" onSubmit={create}>
        <label>
          Code
          <input
            type="text"
            placeholder="MANGO10"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            maxLength={30}
            required
          />
        </label>
        <label>
          Discount type
          <select value={type} onChange={(e) => setType(e.target.value as "percent" | "fixed")}>
            <option value="percent">Percentage (%)</option>
            <option value="fixed">Fixed amount (£)</option>
          </select>
        </label>
        <label>
          {type === "percent" ? "Percent off" : "Pounds off"}
          <input
            type="number"
            placeholder={type === "percent" ? "10" : "5.00"}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            min={type === "percent" ? 1 : 0.5}
            max={type === "percent" ? 100 : 1000}
            step={type === "percent" ? 1 : 0.5}
            required
          />
        </label>
        <label>
          Starts (optional)
          <input type="date" value={startsAt} onChange={(e) => setStartsAt(e.target.value)} />
        </label>
        <label>
          Expires (optional)
          <input type="date" value={expiresAt} onChange={(e) => setExpiresAt(e.target.value)} />
        </label>
        <label>
          Max uses (optional)
          <input
            type="number"
            placeholder="∞"
            value={maxUses}
            onChange={(e) => setMaxUses(e.target.value)}
            min={1}
          />
        </label>
        <button type="submit" disabled={busy}>
          {busy ? "Creating…" : "Create code"}
        </button>
      </form>
      {error && <p className="rm-admin-error">{error}</p>}
      {created && (
        <p className="rm-admin-promo-created" role="status">
          ✓ Code <strong>{created}</strong> created and active.
        </p>
      )}

      {promos.length === 0 ? (
        <p className="rm-admin-empty">No promo codes yet — create your first one above.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Code</th>
              <th>Discount</th>
              <th>Starts</th>
              <th>Expires</th>
              <th>Uses</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {promos.map((p) => {
              const s = statusOf(p);
              return (
                <tr key={p.id}>
                  <td className="rm-admin-mono rm-admin-promo-code">{p.code}</td>
                  <td>{describe(p)}</td>
                  <td>{shortDate(p.starts_at) || "—"}</td>
                  <td>{shortDate(p.expires_at) || "—"}</td>
                  <td>
                    {p.uses}
                    {p.max_uses ? ` / ${p.max_uses}` : ""}
                  </td>
                  <td>
                    <span className={`rm-admin-badge rm-admin-badge--${s.tone}`}>{s.label}</span>
                  </td>
                  <td className="rm-admin-promo-actions">
                    <button type="button" onClick={() => toggle(p)}>
                      {p.active ? "Disable" : "Enable"}
                    </button>
                    <button type="button" className="rm-admin-promo-delete" onClick={() => remove(p)}>
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </section>
  );
}
