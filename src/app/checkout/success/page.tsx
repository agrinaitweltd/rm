import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import CheckoutSuccess from "./CheckoutSuccess";

export const metadata: Metadata = {
  title: "Order Confirmed",
  description: "Thank you for your order with RM Mangoes.",
  robots: { index: false, follow: false },
};

export default function CheckoutSuccessPage() {
  return (
    <PageShell postId={6799}>
      <CheckoutSuccess />
    </PageShell>
  );
}
