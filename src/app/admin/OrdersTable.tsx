"use client";

import { useState } from "react";

const STATUSES = ["Pending", "Confirmed", "Packing", "Dispatched", "Delivered", "Cancelled"];

export type AdminOrderItem = {
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
};

export type AdminOrder = {
  id: string;
  created_at: string;
  total: number;
  currency: string;
  payment_status: string | null;
  order_status: string;
  delivery_name: string | null;
  delivery_phone: string | null;
  delivery_address: string | null;
  delivery_city: string | null;
  delivery_county: string | null;
  delivery_postcode: string | null;
  delivery_country: string | null;
  stripe_session_id: string | null;
  stripe_payment_intent: string | null;
  payment_method: string | null;
  cash_tendered: number | null;
  change_due: number | null;
  customer: { full_name: string | null; email: string | null; phone: string | null } | null;
  items: AdminOrderItem[];
};

const gbp = (pence: number, currency = "gbp") =>
  new Intl.NumberFormat("en-GB", { style: "currency", currency: currency.toUpperCase() }).format(pence / 100);

const when = (iso: string) =>
  new Date(iso).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" });

function StatusSelect({ order }: { order: AdminOrder }) {
  const [status, setStatus] = useState(order.order_status);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function change(next: string) {
    const prev = status;
    setStatus(next);
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch("/api/admin/order-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: order.id, status: next }),
      });
      if (!res.ok) throw new Error();
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
    } catch {
      setStatus(prev); // revert on failure
    }
    setSaving(false);
  }

  return (
    <span className="rm-admin-status">
      <select value={status} disabled={saving} onChange={(e) => change(e.target.value)}>
        {STATUSES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
      {saved && <span className="rm-admin-saved">✓</span>}
    </span>
  );
}

export default function OrdersTable({ orders }: { orders: AdminOrder[] }) {
  if (orders.length === 0) {
    return <p className="rm-admin-empty">No orders yet.</p>;
  }

  return (
    <div className="rm-admin-orders">
      {orders.map((o) => {
        const addr = [
          o.delivery_address,
          o.delivery_city,
          o.delivery_county,
          o.delivery_postcode,
          o.delivery_country,
        ]
          .filter(Boolean)
          .join(", ");
        return (
          <article key={o.id} className="rm-admin-order">
            <header className="rm-admin-order-head">
              <div>
                <span className="rm-admin-order-date">{when(o.created_at)}</span>
                <span className="rm-admin-order-total">{gbp(o.total, o.currency)}</span>
              </div>
              <StatusSelect order={o} />
            </header>

            <div className="rm-admin-order-grid">
              <div>
                <h4>Customer</h4>
                <p>{o.customer?.full_name || o.delivery_name || "—"}</p>
                <p>{o.customer?.email || "—"}</p>
                <p>{o.customer?.phone || o.delivery_phone || "—"}</p>
              </div>
              <div>
                <h4>Delivery</h4>
                <p>{o.delivery_name || "—"}</p>
                <p>{addr || "—"}</p>
                <p>{o.delivery_phone || "—"}</p>
              </div>
              <div>
                <h4>Payment</h4>
                {o.payment_method === "cash" ? (
                  <>
                    <p className="rm-admin-cash-badge">Cash on Delivery</p>
                    <p>Bringing: {gbp(o.cash_tendered || 0, o.currency)}</p>
                    <p>Change due: {gbp(o.change_due || 0, o.currency)}</p>
                  </>
                ) : (
                  <>
                    <p>Status: {o.payment_status || "—"}</p>
                    <p className="rm-admin-mono">{o.stripe_payment_intent || "—"}</p>
                  </>
                )}
              </div>
            </div>

            <div className="rm-admin-items">
              <h4>Products</h4>
              <table>
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Qty</th>
                    <th>Unit</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {o.items.map((it, i) => (
                    <tr key={i}>
                      <td>{it.product_name}</td>
                      <td>{it.quantity}</td>
                      <td>{gbp(it.unit_price, o.currency)}</td>
                      <td>{gbp(it.total_price, o.currency)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>
        );
      })}
    </div>
  );
}
