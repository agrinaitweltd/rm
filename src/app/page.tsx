import Hero from "@/components/sections/Hero";
import Marquee from "@/components/sections/Marquee";
import WhyChoose from "@/components/sections/WhyChoose";
import Pricing from "@/components/sections/Pricing";
import Gallery from "@/components/sections/Gallery";
import Testimonials from "@/components/sections/Testimonials";
import FAQ from "@/components/sections/FAQ";
import CTABanner from "@/components/sections/CTABanner";
import ContactCTASection from "@/components/sections/ContactCTASection";

export default function Home() {
  return (
    <>
      <Hero />
      <Marquee />
      <WhyChoose />
      <Pricing />
      <CTABanner />
      <Gallery />
      <Testimonials />
      <FAQ />
      <ContactCTASection />
    </>
  );
}
