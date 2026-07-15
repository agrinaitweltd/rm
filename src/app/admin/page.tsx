import type { Metadata } from "next";
import { isAdminAuthed } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";
import AdminLogin from "./AdminLogin";
import OrdersTable, { type AdminOrder } from "./OrdersTable";
import StockPanel from "./StockPanel";
import PromoPanel, { type AdminPromo } from "./PromoPanel";
import LogoutButton from "./LogoutButton";
import "./admin.css";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

// Always read fresh data.
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const authed = await isAdminAuthed();
  if (!authed) {
    return <AdminLogin />;
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("orders")
    .select(
      `id, created_at, total, currency, payment_status, order_status,
       delivery_name, delivery_phone, delivery_address, delivery_city,
       delivery_county, delivery_postcode, delivery_country,
       stripe_session_id, stripe_payment_intent,
       customer:customers ( full_name, email, phone ),
       items:order_items ( product_name, quantity, unit_price, total_price )`
    )
    .order("created_at", { ascending: false })
    .limit(500);

  const orders = (data || []) as unknown as AdminOrder[];

  const { data: stockRows } = await supabase.from("product_stock").select("product_id, stock");
  const stock = Object.fromEntries((stockRows || []).map((r) => [r.product_id, r.stock]));

  const { data: promoRows } = await supabase
    .from("promo_codes")
    .select("id, code, type, value, starts_at, expires_at, max_uses, uses, active")
    .order("created_at", { ascending: false })
    .limit(100);

  const { data: ratingRows } = await supabase
    .from("ratings")
    .select("stars, comment, created_at")
    .order("created_at", { ascending: false })
    .limit(200);
  const ratings = ratingRows || [];
  const avgRating = ratings.length
    ? (ratings.reduce((s, r) => s + r.stars, 0) / ratings.length).toFixed(1)
    : null;

  return (
    <div className="rm-admin">
      <header className="rm-admin-topbar">
        <h1>RM Mangoes Admin</h1>
        <div className="rm-admin-topbar-right">
          {avgRating && (
            <span className="rm-admin-rating-avg" title={`${ratings.length} rating(s)`}>
              ★ {avgRating}/10 ({ratings.length})
            </span>
          )}
          <LogoutButton />
        </div>
      </header>
      <StockPanel initial={stock} />
      <PromoPanel initial={(promoRows || []) as AdminPromo[]} />
      <h2 className="rm-admin-orders-title">Orders</h2>
      {error ? (
        <p className="rm-admin-error">Could not load orders: {error.message}</p>
      ) : (
        <OrdersTable orders={orders} />
      )}
    </div>
  );
}
