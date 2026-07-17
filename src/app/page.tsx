import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import QuoteBand from "@/components/QuoteBand";
import HeroBackgroundVideo from "@/components/HeroBackgroundVideo";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "RM Mangoes — Premium Pakistani Mangoes, Fruit & Veg | Scotland",
  description:
    "We import the very finest Pakistani mangoes, fresh fruit and vegetables and deliver them to doorsteps throughout Scotland. From Pakistani farms to Scottish doorsteps.",
  alternates: { canonical: "/" },
};

const quickLinks = [
  {
    id: "e4bde13",
    imageId: "db0f371",
    headingId: "a45f8d3",
    textId: "576a505",
    href: "/products",
    icon: "/icon-mangoes.png",
    title: "Our produce",
    text: "Discover our mango boxes, fresh fruit & veg",
  },
  {
    id: "16e345c",
    imageId: "80897f8",
    headingId: "ab1d227",
    textId: "fec333a",
    href: "/about",
    icon: "/icon-story.png",
    title: "Our story",
    text: "Learn more about RM Mangoes",
  },
  {
    id: "b8dcb5d",
    imageId: "2ef0d2d",
    headingId: "d30cca8",
    textId: "be548a8",
    href: "/contact",
    icon: "/Team.png",
    title: "Contact us",
    text: "Get in touch with our team directly",
  },
  {
    id: "10bb0ef",
    imageId: "1d55256",
    headingId: "7d53dce",
    textId: "d61f936",
    href: site.whatsapp,
    external: true,
    icon: "/icon-whatsapp.png",
    title: "Order on WhatsApp",
    text: "Message us to order your mango box",
  },
];

export default function HomePage() {
  return (
    <PageShell postId={5298}>
      {/* Hero with background video */}
      <div
        className="elementor-element elementor-element-12736e2 e-flex e-con-boxed e-con e-parent"
        data-id="12736e2"
        data-element_type="container"
      >
        <div className="e-con-inner">
          <HeroBackgroundVideo />
          <div
            className="elementor-element elementor-element-7df00b4 elementor-widget__width-initial elementor-widget elementor-widget-image elementor-invisible"
            data-id="7df00b4"
            data-element_type="widget"
            data-settings='{"_animation":"zoomIn"}'
            data-widget_type="image.default"
          >
            <div className="elementor-widget-container">
              <img
                decoding="async"
                fetchPriority="high"
                src="/rm-mangoes-hero-logo.png"
                title="RM Mangoes"
                alt="RM Mangoes — From Pakistani Farms to Scottish Doorsteps"
              />
            </div>
          </div>
          <div
            className="elementor-element rm-hero-tagline elementor-widget elementor-widget-heading elementor-invisible"
            data-settings='{"_animation":"fadeInUp","_animation_delay":250}'
            data-element_type="widget"
            data-widget_type="heading.default"
          >
            <div className="elementor-widget-container">
              <img
                className="rm-home-hero-mark"
                src="/logo4.png"
                alt=""
                width={492}
                height={492}
                decoding="async"
              />
              <h2 className="elementor-heading-title elementor-size-default">{site.tagline}</h2>
            </div>
          </div>
          <div
            className="elementor-element elementor-element-7aa4e51c elementor-align-center elementor-mobile-align-center elementor-widget elementor-widget-button elementor-invisible"
            data-id="7aa4e51c"
            data-element_type="widget"
            data-settings='{"_animation":"fadeInUp","_animation_delay":400}'
            data-widget_type="button.default"
          >
            <div className="elementor-widget-container">
              <div className="elementor-button-wrapper">
                <Link className="elementor-button elementor-button-link elementor-size-lg" href="/products">
                  <span className="elementor-button-content-wrapper">
                    <span className="elementor-button-text">Order Now</span>
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Intro */}
      <div
        className="elementor-element elementor-element-d6049e6 e-flex e-con-boxed e-con e-parent"
        data-id="d6049e6"
        data-element_type="container"
      >
        <div className="e-con-inner">
          <div
            className="elementor-element elementor-element-a94310a e-con-full e-flex e-con e-child"
            data-id="a94310a"
            data-element_type="container"
          >
            <div
              className="elementor-element elementor-element-9664a1d elementor-widget elementor-widget-heading elementor-invisible"
              data-id="9664a1d"
              data-element_type="widget"
              data-settings='{"_animation":"fadeInUp"}'
              data-widget_type="heading.default"
            >
              <div className="elementor-widget-container">
                <h1 className="elementor-heading-title elementor-size-default">Premium Pakistani produce importer</h1>
              </div>
            </div>
            <div
              className="elementor-element elementor-element-205af03 elementor-widget elementor-widget-text-editor elementor-invisible"
              data-id="205af03"
              data-element_type="widget"
              data-settings='{"_animation":"fadeInUp","_animation_delay":200}'
              data-widget_type="text-editor.default"
            >
              <div className="elementor-widget-container">
                <p>
                  <strong>
                    We are RM Mangoes. We import the very finest and freshest Pakistani mangoes, fruit and
                    vegetables, straight from the farms of Pakistan.
                  </strong>
                </p>
                <p>
                  Throughout the season we deliver premium mango boxes, seasonal fruit like lychee, cherries and
                  dragon fruit, and fresh vegetables to doorsteps across Scotland. Our relationships with growers in
                  Pakistan and our customers here are built for the long term — your produce partner today and in the
                  future.
                </p>
              </div>
            </div>
          </div>
          <div
            className="elementor-element elementor-element-8bdf647 e-con-full e-flex e-con e-child"
            data-id="8bdf647"
            data-element_type="container"
          >
            <div
              className="elementor-element elementor-element-a535741 elementor-widget elementor-widget-heading elementor-invisible"
              data-id="a535741"
              data-element_type="widget"
              data-settings='{"_animation":"fadeInLeft","_animation_delay":300}'
              data-widget_type="heading.default"
            >
              <div className="elementor-widget-container">
                <h2 className="elementor-heading-title elementor-size-default">Go directly to</h2>
              </div>
            </div>
            <div
              className="elementor-element elementor-element-33f5bc3 elementor-align-justify elementor-widget-tablet__width-inherit elementor-tablet-align-justify elementor-mobile-align-left elementor-widget__width-initial elementor-widget elementor-widget-button"
              data-id="33f5bc3"
              data-element_type="widget"
              data-widget_type="button.default"
            >
              <div className="elementor-widget-container">
                <div className="elementor-button-wrapper">
                  <Link className="elementor-button elementor-button-link elementor-size-sm" href="/products">
                    <span className="elementor-button-content-wrapper">
                      <span className="elementor-button-text">Our produce</span>
                    </span>
                  </Link>
                </div>
              </div>
            </div>
            <div
              className="elementor-element elementor-element-d086e88 elementor-align-justify elementor-widget__width-initial elementor-widget-tablet__width-inherit elementor-tablet-align-justify elementor-mobile-align-left elementor-widget-mobile__width-initial elementor-widget elementor-widget-button"
              data-id="d086e88"
              data-element_type="widget"
              data-widget_type="button.default"
            >
              <div className="elementor-widget-container">
                <div className="elementor-button-wrapper">
                  <Link className="elementor-button elementor-button-link elementor-size-sm" href="/about">
                    <span className="elementor-button-content-wrapper">
                      <span className="elementor-button-text">About us</span>
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quote band */}
      <QuoteBand quote={`'From Pakistani farms to Scottish doorsteps'`} />

      {/* Quick links */}
      <div
        className="elementor-element elementor-element-b2cff69 e-flex e-con-boxed e-con e-parent"
        data-id="b2cff69"
        data-element_type="container"
      >
        <div className="e-con-inner">
          <div className="elementor-shape elementor-shape-top" aria-hidden="true" data-negative="false">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 10" preserveAspectRatio="none">
              <path className="elementor-shape-fill" d="M350,10L340,0h20L350,10z"></path>
            </svg>
          </div>
          {quickLinks.map((card, i) =>
            card.external ? (
              <a
                key={card.id}
                className={`elementor-element elementor-element-${card.id} e-con-full e-flex e-con e-child elementor-invisible`}
                data-id={card.id}
                data-element_type="container"
                data-settings={`{"_animation":"zoomIn","_animation_delay":${i * 150}}`}
                href={card.href}
                target="_blank"
                rel="noopener"
              >
                <QuickLinkInner card={card} />
              </a>
            ) : (
              <Link
                key={card.id}
                className={`elementor-element elementor-element-${card.id} e-con-full e-flex e-con e-child elementor-invisible`}
                data-id={card.id}
                data-element_type="container"
                data-settings={`{"_animation":"zoomIn","_animation_delay":${i * 150}}`}
                href={card.href}
              >
                <QuickLinkInner card={card} />
              </Link>
            )
          )}
        </div>
      </div>
    </PageShell>
  );
}

function QuickLinkInner({ card }: { card: (typeof quickLinks)[number] }) {
  return (
    <>
      <div
        className={`elementor-element elementor-element-${card.imageId} e-transform elementor-widget elementor-widget-image`}
        data-id={card.imageId}
        data-element_type="widget"
        data-settings='{"_transform_scale_effect_hover":{"unit":"px","size":1.1,"sizes":[]}}'
        data-widget_type="image.default"
      >
        <div className="elementor-widget-container">
          <img decoding="async" width={142} height={142} src={card.icon} title={card.title} alt={card.title} loading="lazy" />
        </div>
      </div>
      <div
        className={`elementor-element elementor-element-${card.headingId} elementor-widget elementor-widget-heading`}
        data-id={card.headingId}
        data-element_type="widget"
        data-widget_type="heading.default"
      >
        <div className="elementor-widget-container">
          <h3 className="elementor-heading-title elementor-size-default">{card.title}</h3>
        </div>
      </div>
      <div
        className={`elementor-element elementor-element-${card.textId} elementor-widget-tablet__width-initial elementor-widget elementor-widget-text-editor`}
        data-id={card.textId}
        data-element_type="widget"
        data-widget_type="text-editor.default"
      >
        <div className="elementor-widget-container">
          <p>{card.text}</p>
        </div>
      </div>
    </>
  );
}
