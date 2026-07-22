import path from "path";
import { readFile } from "fs/promises";
import sharp from "sharp";
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

const INK = "#1a1a1a";
const DIM = "#6b6b6b";

// Small resized copy of the site logo, cached across invocations within the
// same server process so we don't re-decode a 1.5MB PNG on every receipt.
let logoDataUri: string | null | undefined;
async function getLogoDataUri(): Promise<string | null> {
  if (logoDataUri !== undefined) return logoDataUri;
  try {
    const src = await readFile(path.join(process.cwd(), "public", "logo-2.png"));
    const resized = await sharp(src).resize({ width: 260 }).png().toBuffer();
    logoDataUri = `data:image/png;base64,${resized.toString("base64")}`;
  } catch {
    logoDataUri = null;
  }
  return logoDataUri;
}

// A row of black bars whose widths are derived from the order id — a
// decorative "barcode" strip at the foot of the receipt, not a scannable one.
function BarcodeStrip({ seed }: { seed: string }) {
  const digits = seed.replace(/[^0-9a-f]/gi, "");
  const bars = Array.from({ length: 40 }, (_, i) => {
    const ch = digits.charCodeAt(i % digits.length) || 48;
    return 1 + (ch % 4);
  });
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 2, height: 60 }}>
      {bars.map((w, i) => (
        <div key={i} style={{ display: "flex", width: w, height: 60, background: INK }} />
      ))}
    </div>
  );
}

function DashedRule() {
  return <div style={{ display: "flex", width: "100%", borderTop: `2px dashed ${INK}` }} />;
}

export async function renderReceiptPng(data: ReceiptData): Promise<Response> {
  const orderRef = data.orderId.replace(/-/g, "").slice(0, 8).toUpperCase();
  const date = new Date(data.createdAt).toLocaleString("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  });
  const logo = await getLogoDataUri();

  const height = 980 + data.items.length * 40;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#ffffff",
          color: INK,
          padding: "40px 48px",
          fontFamily: "Helvetica, Arial, sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <DashedRule />
          <DashedRule />
        </div>

        {/* Logo + title */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "28px 0 20px" }}>
          {logo && <img src={logo} width={130} height={Math.round((130 * 1024) / 1536)} style={{ marginBottom: 14 }} />}
          <div style={{ display: "flex", fontSize: 40, fontWeight: 800, letterSpacing: 2 }}>RECEIPT</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 22 }}>
          <DashedRule />
          <DashedRule />
        </div>

        {/* Order meta */}
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 15, color: DIM, marginBottom: 22 }}>
          <span style={{ display: "flex" }}>Order #{orderRef}</span>
          <span style={{ display: "flex" }}>{date}</span>
        </div>

        {/* Deliver to */}
        <div style={{ display: "flex", flexDirection: "column", marginBottom: 22 }}>
          <span style={{ display: "flex", fontSize: 13, color: DIM, letterSpacing: 1, marginBottom: 6 }}>DELIVER TO</span>
          <span style={{ display: "flex", fontSize: 19, fontWeight: 700 }}>{data.customer.name || "—"}</span>
          <span style={{ display: "flex", fontSize: 15, color: "#333", marginTop: 4 }}>{data.customer.address || "—"}</span>
          <span style={{ display: "flex", fontSize: 15, color: "#333", marginTop: 2 }}>{data.customer.phone || "—"}</span>
        </div>

        <DashedRule />

        {/* Items */}
        <div style={{ display: "flex", flexDirection: "column", padding: "18px 0" }}>
          {data.items.map((it, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", fontSize: 17, padding: "7px 0" }}>
              <div style={{ display: "flex", width: 18, height: 18, border: `2px solid ${INK}`, marginRight: 14 }} />
              <span style={{ display: "flex", flex: 1 }}>
                {it.quantity}x {it.product_name}
              </span>
              <span style={{ display: "flex" }}>{gbp(it.total_price)}</span>
            </div>
          ))}
        </div>

        <DashedRule />

        {/* Total */}
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 21, fontWeight: 800, padding: "18px 0" }}>
          <span style={{ display: "flex", letterSpacing: 1 }}>TOTAL AMOUNT</span>
          <span style={{ display: "flex" }}>{gbp(data.total)}</span>
        </div>

        <DashedRule />

        {/* Payment */}
        <div style={{ display: "flex", flexDirection: "column", padding: "18px 0", fontSize: 18 }}>
          {data.paymentMethod === "cash" ? (
            <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
              <div style={{ display: "flex", width: "100%", justifyContent: "space-between", fontWeight: 700 }}>
                <span style={{ display: "flex" }}>CASH</span>
                <span style={{ display: "flex" }}>{gbp(data.cashTendered ?? data.total)}</span>
              </div>
              <div style={{ display: "flex", width: "100%", justifyContent: "space-between", fontWeight: 700, marginTop: 8 }}>
                <span style={{ display: "flex" }}>CHANGE</span>
                <span style={{ display: "flex" }}>{gbp(data.changeDue ?? 0)}</span>
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", width: "100%", justifyContent: "center", fontWeight: 700 }}>PAID BY CARD</div>
          )}
        </div>

        <DashedRule />

        {/* Thank you */}
        <div style={{ display: "flex", justifyContent: "center", padding: "30px 0 26px", fontSize: 34, fontWeight: 800, letterSpacing: 1 }}>
          THANK YOU
        </div>

        <DashedRule />

        {/* Barcode */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "26px 0 6px" }}>
          <BarcodeStrip seed={data.orderId} />
          <span style={{ display: "flex", fontSize: 13, color: DIM, marginTop: 10, letterSpacing: 2 }}>{orderRef}</span>
        </div>

        {/* Footer */}
        <div style={{ display: "flex", justifyContent: "center", paddingTop: 24, fontSize: 13, color: DIM }}>
          rmmangoes.co.uk · +44 0788080890
        </div>
      </div>
    ),
    { width: 640, height }
  );
}
