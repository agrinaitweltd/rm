import { isAdminAuthed } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { renderReceiptPng } from "@/lib/receipt";

export const runtime = "nodejs";

export async function GET(_request: Request, { params }: { params: Promise<{ orderId: string }> }) {
  const authed = await isAdminAuthed();
  if (!authed) return new Response("Unauthorized", { status: 401 });

  const { orderId } = await params;
  const supabase = createAdminClient();
  const { data: order, error } = await supabase
    .from("orders")
    .select(
      `id, created_at, total, payment_method, cash_tendered, change_due,
       delivery_name, delivery_phone, delivery_address, delivery_city,
       delivery_county, delivery_postcode, delivery_country,
       customer:customers ( full_name, phone ),
       items:order_items ( product_name, quantity, total_price )`
    )
    .eq("id", orderId)
    .single();

  if (error || !order) return new Response("Order not found", { status: 404 });

  const customer = order.customer as unknown as { full_name: string | null; phone: string | null } | null;
  const address = [
    order.delivery_address,
    order.delivery_city,
    order.delivery_county,
    order.delivery_postcode,
    order.delivery_country,
  ]
    .filter(Boolean)
    .join(", ");

  const png = await renderReceiptPng({
    orderId: order.id,
    createdAt: order.created_at,
    items: order.items,
    total: order.total,
    customer: {
      name: customer?.full_name || order.delivery_name || "",
      phone: customer?.phone || order.delivery_phone || "",
      address,
    },
    paymentMethod: order.payment_method === "cash" ? "cash" : "card",
    cashTendered: order.cash_tendered,
    changeDue: order.change_due,
  });

  const buf = await png.arrayBuffer();
  return new Response(buf, {
    headers: {
      "Content-Type": "image/png",
      "Content-Disposition": `attachment; filename="rm-mangoes-order-${order.id.slice(0, 8)}.png"`,
    },
  });
}
