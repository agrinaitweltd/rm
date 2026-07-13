import type { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";
import Gallery from "@/components/sections/Gallery";
import Testimonials from "@/components/sections/Testimonials";
import CTABanner from "@/components/sections/CTABanner";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "See our premium Pakistani mangoes — from orchard to box — delivered fresh across Scotland.",
  alternates: { canonical: "/gallery" },
};

export default function GalleryPage() {
  return (
    <>
      <PageHeader
        eyebrow="Gallery"
        title={
          <>
            Our <span className="text-gradient">Mangoes</span> in Pictures
          </>
        }
        subtitle="A closer look at the sun-ripened Pakistani mangoes we bring to Scottish doorsteps."
      />
      <Gallery withHeading={false} />
      <Testimonials />
      <CTABanner />
    </>
  );
}
