import { ImageResponse } from "next/og";

export type ReceiptData = {
  orderId: string;
  createdAt: string;
  items: { product_name: string; quantity: number; total_price: number }[];
  total: number;
  customer: { name: string; phone: string; address: string };
  paymentMethod: "card" | "cash";
  cashTendered?: number | null;
  changeDue?: number | null;
};

const gbp = (pence: number) => `£${(pence / 100).toFixed(2)}`;

const GOLD = "#f6a200";
const DIM = "#8a8a82";
const LINE = "rgba(255,255,255,0.1)";

// Renders a printable order receipt / delivery slip as a PNG. Used both as an
// admin download and as an email attachment, so it takes plain data rather
// than reaching into Supabase itself.
export async function renderReceiptPng(data: ReceiptData): Promise<Response> {
  const orderRef = data.orderId.replace(/-/g, "").slice(0, 8).toUpperCase();
  const date = new Date(data.createdAt).toLocaleString("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#0a0a0a",
          color: "#f2f2ee",
          padding: "60px 64px",
          fontFamily: "Helvetica, Arial, sans-serif",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            paddingBottom: 26,
            marginBottom: 30,
            borderBottom: `3px solid ${GOLD}`,
          }}
        >
          <div style={{ display: "flex", fontSize: 46, fontWeight: 700, letterSpacing: 3, color: GOLD }}>
            RM MANGOES
          </div>
          <div style={{ display: "flex", fontSize: 15, color: DIM, letterSpacing: 4, marginTop: 6 }}>
            FRESH PAKISTANI PRODUCE
          </div>
          <div style={{ display: "flex", fontSize: 20, fontWeight: 600, marginTop: 22, letterSpacing: 1 }}>
            DELIVERY RECEIPT
          </div>
        </div>

        {/* Order ref / date */}
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 26 }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 13, color: DIM, letterSpacing: 2 }}>ORDER</span>
            <span style={{ fontSize: 24, fontWeight: 700, marginTop: 4 }}>#{orderRef}</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
            <span style={{ fontSize: 13, color: DIM, letterSpacing: 2 }}>DATE</span>
            <span style={{ fontSize: 24, fontWeight: 700, marginTop: 4 }}>{date}</span>
          </div>
        </div>

        {/* Customer + payment */}
        <div style={{ display: "flex", gap: 24, marginBottom: 30 }}>
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              border: `1px solid ${LINE}`,
              borderRadius: 10,
              padding: "20px 22px",
            }}
          >
            <span style={{ display: "flex", fontSize: 13, color: GOLD, letterSpacing: 2, marginBottom: 10 }}>
              DELIVER TO
            </span>
            <span style={{ display: "flex", fontSize: 21, fontWeight: 700 }}>{data.customer.name || "—"}</span>
            <span style={{ display: "flex", fontSize: 16, color: "#d6d6d0", marginTop: 8 }}>
              {data.customer.address || "—"}
            </span>
            <span style={{ display: "flex", fontSize: 16, color: "#d6d6d0", marginTop: 6 }}>
              {data.customer.phone || "—"}
            </span>
          </div>
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              border: `1px solid ${LINE}`,
              borderRadius: 10,
              padding: "20px 22px",
            }}
          >
            <span style={{ display: "flex", fontSize: 13, color: GOLD, letterSpacing: 2, marginBottom: 10 }}>
              PAYMENT
            </span>
            {data.paymentMethod === "cash" ? (
              <>
                <span style={{ display: "flex", fontSize: 21, fontWeight: 700, color: GOLD }}>
                  CASH ON DELIVERY
                </span>
                <span style={{ display: "flex", fontSize: 16, marginTop: 8, color: "#d6d6d0" }}>
                  Collect: {gbp(data.cashTendered ?? data.total)}
                </span>
                <span style={{ display: "flex", fontSize: 16, marginTop: 6, color: "#d6d6d0" }}>
                  Change due: {gbp(data.changeDue ?? 0)}
                </span>
              </>
            ) : (
              <span style={{ display: "flex", fontSize: 21, fontWeight: 700, color: "#8fca63" }}>PAID BY CARD</span>
            )}
          </div>
        </div>

        {/* Items */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 13,
              color: DIM,
              letterSpacing: 1,
              paddingBottom: 12,
              borderBottom: `1px solid ${LINE}`,
            }}
          >
            <span style={{ display: "flex", width: 36 }} />
            <span style={{ display: "flex", flex: 1 }}>ITEM</span>
            <span style={{ display: "flex", width: 70, justifyContent: "flex-end" }}>QTY</span>
            <span style={{ display: "flex", width: 110, justifyContent: "flex-end" }}>TOTAL</span>
          </div>
          {data.items.map((it, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                fontSize: 18,
                padding: "15px 0",
                borderBottom: `1px solid rgba(255,255,255,0.06)`,
              }}
            >
              <span style={{ display: "flex", width: 36 }}>
                <span style={{ display: "flex", width: 20, height: 20, border: `2px solid ${GOLD}`, borderRadius: 4 }} />
              </span>
              <span style={{ display: "flex", flex: 1 }}>{it.product_name}</span>
              <span style={{ display: "flex", width: 70, justifyContent: "flex-end", color: "#d6d6d0" }}>
                ×{it.quantity}
              </span>
              <span style={{ display: "flex", width: 110, justifyContent: "flex-end", fontWeight: 600 }}>
                {gbp(it.total_price)}
              </span>
            </div>
          ))}
        </div>

        {/* Total */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 30,
            paddingTop: 26,
            borderTop: `3px solid ${GOLD}`,
          }}
        >
          <span style={{ display: "flex", fontSize: 20, letterSpacing: 2, color: DIM }}>TOTAL</span>
          <span style={{ display: "flex", fontSize: 42, fontWeight: 800, color: GOLD }}>{gbp(data.total)}</span>
        </div>

        {/* Footer */}
        <div style={{ display: "flex", justifyContent: "center", marginTop: 34, fontSize: 14, color: "#5f5f58" }}>
          rmmangoes.co.uk · +44 0788080890
        </div>
      </div>
    ),
    { width: 900, height: 1360 }
  );
}
