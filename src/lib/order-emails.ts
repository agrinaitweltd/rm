import { Resend } from "resend";
import { site } from "@/lib/site";
import { renderReceiptPng } from "@/lib/receipt";

export const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export const gbp = (pence: number) => `£${(pence / 100).toFixed(2)}`;

type OrderItem = { product_name: string; quantity: number; total_price: number };
type Customer = { name: string; email: string; phone: string; address: string };

// Shared by the card webhook and the cash-on-delivery route so both payment
// paths send the same-looking confirmation, with cash-specific lines added
// only when relevant.
export async function sendOrderConfirmationEmails({
  items,
  total,
  customer,
  reference,
  paymentMethod,
  cashTendered,
  changeDue,
  orderId,
}: {
  items: OrderItem[];
  total: number;
  customer: Customer;
  reference: string;
  paymentMethod: "card" | "cash";
  cashTendered?: number | null;
  changeDue?: number | null;
  // Order row id — used to render the printable PNG receipt attached to the
  // admin notification. Optional only so older/edge callers don't break.
  orderId?: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;
  const resend = new Resend(apiKey);
  const from = process.env.WHOLESALE_FROM_EMAIL || `RM Mangoes <no-reply@rmmangoes.co.uk>`;
  const adminTo = process.env.WHOLESALE_TO_EMAIL || site.email;

  const rows = items
    .map(
      (i) =>
        `<tr><td style="padding:6px 12px 6px 0">${esc(i.product_name)}</td><td style="padding:6px 12px">×${i.quantity}</td><td style="padding:6px 0" align="right">${gbp(i.total_price)}</td></tr>`
    )
    .join("");
  const itemsTable = `
    <table style="border-collapse:collapse;width:100%;max-width:420px;font-size:15px">${rows}
      <tr><td colspan="2" style="padding:10px 12px 0 0;border-top:1px solid #ddd"><strong>Total</strong></td>
      <td style="padding:10px 0 0;border-top:1px solid #ddd" align="right"><strong>${gbp(total)}</strong></td></tr>
    </table>`;

  const cashNote =
    paymentMethod === "cash"
      ? `<h3 style="margin-top:20px;color:#c47f00">Cash on delivery</h3>
         <p>Customer will have <strong>${gbp(cashTendered || 0)}</strong> ready.<br/>
         Driver should bring <strong>${gbp(changeDue || 0)}</strong> change.</p>`
      : "";

  // Best-effort printable receipt PNG attached to the admin email. Never lets
  // a rendering hiccup block the actual order notification going out.
  let receiptAttachment: { filename: string; content: string }[] | undefined;
  if (orderId) {
    try {
      const png = await renderReceiptPng({
        orderId,
        createdAt: new Date().toISOString(),
        items,
        total,
        customer: { name: customer.name, phone: customer.phone, address: customer.address },
        paymentMethod,
        cashTendered,
        changeDue,
      });
      const buf = Buffer.from(await png.arrayBuffer());
      receiptAttachment = [
        { filename: `rm-mangoes-order-${orderId.slice(0, 8)}.png`, content: buf.toString("base64") },
      ];
    } catch (err) {
      console.error("[order-emails] receipt render failed:", err);
    }
  }

  // Admin notification.
  await resend.emails.send({
    from,
    to: adminTo,
    replyTo: customer.email,
    subject: `New ${paymentMethod === "cash" ? "cash " : ""}order ${gbp(total)} — ${customer.name || customer.email}`,
    html: `
      <div style="font-family:Helvetica,Arial,sans-serif;color:#1e1e1e">
        <h2 style="color:#4f8d36">New order — RM Mangoes</h2>
        ${itemsTable}
        ${cashNote}
        <h3 style="margin-top:20px">Delivery</h3>
        <p>${esc(customer.name) || "—"}<br/>${esc(customer.address) || "—"}<br/>${esc(customer.phone) || "—"}<br/>${esc(customer.email)}</p>
        <p style="color:#8b8b8b;font-size:13px">Reference: ${esc(reference)} · Payment: ${paymentMethod === "cash" ? "Cash on delivery" : "Card"}</p>
        ${receiptAttachment ? `<p style="color:#8b8b8b;font-size:13px">A printable receipt is attached (PNG).</p>` : ""}
      </div>`,
    attachments: receiptAttachment,
  });

  // Customer confirmation (skip if we never got a usable email).
  if (!customer.email || customer.email.startsWith("unknown@")) return;
  const customerCashNote =
    paymentMethod === "cash"
      ? `<h3 style="margin-top:20px">Paying by cash</h3>
         <p>Please have <strong>${gbp(cashTendered || 0)}</strong> ready for the driver — they'll bring
         <strong>${gbp(changeDue || 0)}</strong> change.</p>`
      : "";
  await resend.emails.send({
    from,
    to: customer.email,
    subject: "Your order is confirmed — RM Mangoes",
    html: `
      <div style="font-family:Helvetica,Arial,sans-serif;max-width:560px;margin:0 auto;color:#1e1e1e">
        <h2 style="color:#4f8d36">Thank you for your order${customer.name ? `, ${esc(customer.name.split(" ")[0])}` : ""}!</h2>
        <p>${paymentMethod === "cash" ? "Your order is confirmed and being prepared. Payment is due on delivery." : "Your payment was successful and your order is being prepared."}</p>
        ${itemsTable}
        ${customerCashNote}
        <h3 style="margin-top:20px">Delivering to</h3>
        <p>${esc(customer.name)}<br/>${esc(customer.address)}</p>
        <p>Questions? Reach us any time:</p>
        <p>
          Phone: <a href="tel:${site.phoneTel}">${site.phoneDisplay}</a><br/>
          WhatsApp: <a href="${site.whatsapp}">message us</a><br/>
          Email: <a href="mailto:${site.email}">${site.email}</a>
        </p>
        <p style="color:#f6a200;font-weight:bold">RM Mangoes — Fresh Pakistani Produce</p>
      </div>`,
  });
}
