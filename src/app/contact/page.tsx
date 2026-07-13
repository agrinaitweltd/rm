import type { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";
import ContactCTASection from "@/components/sections/ContactCTASection";
import FAQ from "@/components/sections/FAQ";

export const metadata: Metadata = {
  title: "Contact & Order",
  description:
    "Order premium Pakistani mangoes across Scotland. Contact RM Mangoes by WhatsApp, phone, email or our order form.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title={
          <>
            Get in Touch &amp; <span className="text-gradient">Order</span>
          </>
        }
        subtitle="Fresh premium Pakistani mangoes are just a message away. We'll get right back to you."
      />
      <ContactCTASection withHeading={false} />
      <FAQ />
    </>
  );
}
