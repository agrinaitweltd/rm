import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import CheckoutClient from "./CheckoutClient";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Secure checkout — RM Mangoes.",
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return (
    <PageShell postId={6799}>
      <div className="rm-checkout-page">
        <h1 className="rm-checkout-heading">Checkout</h1>
        <CheckoutClient />
      </div>
    </PageShell>
  );
}
