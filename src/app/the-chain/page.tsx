import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import { site } from "@/lib/site";
import { ShapeTop, Heading, Text, Button, Image, IconBoxTitle, SwiperArrows } from "@/components/elementor";

export const metadata: Metadata = {
  title: "The Chain — From Pakistani Farms to Your Doorstep",
  description:
    "Follow the RM Mangoes chain: our customers, trusted growers in Pakistan, quality control, our mango varieties, temperature-controlled logistics and delivery across Scotland and Ireland.",
  alternates: { canonical: "/the-chain" },
};

const MapPin = ({ left, top, label }: { left: string; top: string; label: string }) => (
  <span className="rm-hotspot" style={{ left, top }}>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14.8 20.4">
      <path
        strokeWidth={0}
        d="m7.4,0C3.3,0,0,3.3,0,7.4s7.4,13,7.4,13c0,0,7.4-8.9,7.4-13S11.5,0,7.4,0Z"
      ></path>
      <circle fill="#fff" strokeWidth={0} cx="7.4" cy="7.3" r="5"></circle>
      <path
        strokeWidth={0}
        d="m6.34,4.45c0-.24.08-.44.25-.61s.38-.25.61-.25.45.08.62.25.26.38.26.61-.09.45-.26.62-.38.25-.62.25-.44-.08-.61-.25-.25-.38-.25-.62Zm.12,1.53h1.5v4.86h-1.5v-4.86Z"
      ></path>
    </svg>
    <span className="rm-hotspot-tooltip">{label}</span>
  </span>
);

const TabIcon = ({ color }: { color: string }) => (
  <span className="e-n-tab-icon">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
      <path
        fill={color}
        strokeWidth={0}
        d="m10,3c3.86,0,7,3.14,7,7s-3.14,7-7,7-7-3.14-7-7,3.14-7,7-7m0-3C4.48,0,0,4.48,0,10s4.48,10,10,10,10-4.48,10-10S15.52,0,10,0h0Z"
      ></path>
    </svg>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
      <circle fill={color} strokeWidth={0} cx="10" cy="10" r="8.5"></circle>
      <path
        fill={color}
        strokeWidth={0}
        d="m10,3c3.86,0,7,3.14,7,7s-3.14,7-7,7-7-3.14-7-7,3.14-7,7-7m0-3C4.48,0,0,4.48,0,10s4.48,10,10,10,10-4.48,10-10S15.52,0,10,0h0Z"
      ></path>
    </svg>
  </span>
);

/* ---------- data ---------- */

const consumerSlides = [
  { slideId: "dd2fc98", imageId: "aa37b70", src: "/consumer-1.png" },
  { slideId: "20e3e88", imageId: "89e674c", src: "/consumer-2.png" },
  { slideId: "276967b", imageId: "2f19571", src: "/consumer-3.png" },
  { slideId: "4f381f0", imageId: "d6bf594", src: "/consumer-4.png" },
];

const varieties = [
  { id: "66f5692", imageId: "87f2460", headingId: "47dff6d", boxed: false, icon: "/assortiment-sindhri.png", name: "sindhri" },
  { id: "6667e8e", imageId: "2080a40", headingId: "158858a", boxed: true, icon: "/assortiment-chaunsa.png", name: "chaunsa" },
  { id: "fe3d799", imageId: "ea6f660", headingId: "cc7ef5b", boxed: true, icon: "/assortiment-anwar-ratol.png", name: "anwar ratol" },
  { id: "4f5f6ed", imageId: "177d812", headingId: "a76ffdf", boxed: true, icon: "/assortiment-langra.png", name: "langra" },
  { id: "50d3ad2", imageId: "9f10b52", headingId: "b52ac21", boxed: true, icon: "/assortiment-dusehri.png", name: "dusehri" },
];

const stats = [
  { id: "fe8bb24", title: "TEMPERATURE CONTROLLED", icon: "warehouse" },
  { id: "8a6a11b", title: "HAND-PACKED BOXES", icon: "pallets" },
  { id: "785a85f", title: "DOOR-TO-DOOR DELIVERY", icon: "box" },
];

const StatIcon = ({ name }: { name: string }) => {
  if (name === "warehouse")
    return (
      <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 70.8 45.5" xmlSpace="preserve">
        <g>
          <g>
            <path fill="#ACCA38" d="M35.4,0L0,16.6v28.7h9.7V23.6H31v21.8h39.8V17.2L35.4,0z"></path>
            <rect x="39.8" y="23.5" fill="#868686" width="21.3" height="3.7"></rect>
            <rect x="39.8" y="30.8" fill="#868686" width="21.3" height="3.7"></rect>
            <rect x="39.8" y="38.1" fill="#868686" width="21.3" height="3.7"></rect>
            <rect x="39.8" y="27.1" fill="#9C9B9B" width="21.3" height="3.7"></rect>
            <rect x="9.6" y="23.5" fill="#868686" width="21.3" height="3.7"></rect>
            <rect x="9.6" y="30.8" fill="#868686" width="21.3" height="3.7"></rect>
            <rect x="9.6" y="27.1" fill="#9C9B9B" width="21.3" height="3.7"></rect>
            <rect x="39.8" y="34.4" fill="#9C9B9B" width="21.3" height="3.7"></rect>
            <rect x="39.8" y="41.8" fill="#9C9B9B" width="21.3" height="3.7"></rect>
          </g>
        </g>
      </svg>
    );
  if (name === "pallets")
    return (
      <svg xmlns="http://www.w3.org/2000/svg" data-name="Laag 1" viewBox="0 0 21.2 13.05">
        <g fill="#7e4e24">
          <path d="m.55,0v2.74h20.65V0H.55Zm10.5.72h4.23v1.3h-4.23V.72Zm-.72,1.3h-4.23V.72h4.23v1.3ZM1.27.72h4.11v1.3H1.27V.72Zm19.22,1.3h-4.49V.72h4.49v1.3Z"></path>
          <path d="m.55,8.22v2.74h20.65v-2.74H.55Zm10.5.72h4.23v1.3h-4.23v-1.3Zm-.72,1.3h-4.23v-1.3h4.23v1.3Zm-9.06-1.3h4.11v1.3H1.27v-1.3Zm19.22,1.3h-4.49v-1.3h4.49v1.3Z"></path>
          <path d="m0,2.09v2.74h20.65v-2.74H0Zm10.5.72h4.23v1.3h-4.23v-1.3Zm-.72,1.3h-4.23v-1.3h4.23v1.3ZM.72,2.81h4.11v1.3H.72v-1.3Zm19.22,1.3h-4.49v-1.3h4.49v1.3Z"></path>
          <path d="m0,10.31v2.74h20.65v-2.74H0Zm10.5.72h4.23v1.3h-4.23v-1.3Zm-.72,1.3h-4.23v-1.3h4.23v1.3ZM.72,11.03h4.11v1.3H.72v-1.3Zm19.22,1.3h-4.49v-1.3h4.49v1.3Z"></path>
          <path d="m.55,4.11v2.74h20.65v-2.74H.55Zm10.5.72h4.23v1.3h-4.23v-1.3Zm-.72,1.3h-4.23v-1.3h4.23v1.3ZM1.27,4.83h4.11v1.3H1.27v-1.3Zm19.22,1.3h-4.49v-1.3h4.49v1.3Z"></path>
          <path d="m.17,6.2v2.74h20.65v-2.74H.17Zm10.5.72h4.23v1.3h-4.23v-1.3Zm-.72,1.3h-4.23v-1.3h4.23v1.3ZM.89,6.92h4.11v1.3H.89v-1.3Zm19.22,1.3h-4.49v-1.3h4.49v1.3Z"></path>
        </g>
      </svg>
    );
  return (
    <svg xmlns="http://www.w3.org/2000/svg" data-name="Laag 1" viewBox="0 0 66 47.8">
      <polygon fill="#ea580c" strokeWidth={0} points="41.2 47.8 15.4 39.4 15.4 8.6 41.2 17 41.2 47.8"></polygon>
      <polygon fill="#da306c" strokeWidth={0} points="41.2 17.2 15.4 8.8 39.6 0 66 8.6 41.2 17.2"></polygon>
      <polygon fill="#f6a200" strokeWidth={0} points="66 39.4 41.2 47.8 41.2 17.1 66 8.6 66 39.4"></polygon>
      <path fill="#f6a200" strokeWidth={0} d="m26.8,4.7c3.9,1.4,15.1,5.4,24.8,8.9l5-1.7c-13.1-4.7-20.6-7.4-24.9-8.9l-4.9,1.7Z"></path>
      <rect fill="#6d2f71" strokeWidth={0} y="16.7" width="21.5" height="3.3"></rect>
      <rect fill="#6d2f71" strokeWidth={0} x="4.6" y="24" width="21.5" height="3.3"></rect>
      <rect fill="#6d2f71" strokeWidth={0} x="1.3" y="31.3" width="21.5" height="3.3"></rect>
      <polygon fill="#da306c" strokeWidth={0} points="53.6 38.2 45.8 40.8 45.8 34.3 53.6 31.7 53.6 38.2"></polygon>
    </svg>
  );
};

/* ---------- page ---------- */

export default function TheChainPage() {
  return (
    <PageShell postId={5719}>
      {/* Header */}
      <div
        className="elementor-element elementor-element-715b2fc e-flex e-con-boxed e-con e-parent"
        data-id="715b2fc"
        data-element_type="container"
      >
        <div className="e-con-inner">
          <div className="elementor-element elementor-element-2e21e8d e-con-full e-flex e-con e-child" data-id="2e21e8d" data-element_type="container">
            <IconBoxTitle mobileId="7584585" desktopId="58c01c0" title="The Chain" />
            <div className="elementor-element elementor-element-a00ad91 e-con-full e-flex e-con e-child" data-id="a00ad91" data-element_type="container">
              <Text id="bcc9bc8" cls="elementor-widget__width-initial elementor-widget-tablet__width-inherit" anim="fadeInUp">
                <p>
                  Our chain runs from mango orchards in Pakistan straight to doorsteps across Scotland and Ireland. We
                  keep it short, personal and fresh — because a great mango is a team effort. We grow together with our
                  partners by building trust and sharing our knowledge and inspiration.
                </p>
              </Text>
            </div>
          </div>
          <div className="elementor-element elementor-element-ab80e56 e-con-full e-flex e-con e-child" data-id="ab80e56" data-element_type="container">
            <Image id="51c29a1" cls="elementor-widget__width-inherit" src="/chain-icon.svg" width={77} height={79} />
          </div>
        </div>
      </div>

      {/* Band: consumer */}
      <div
        className="elementor-element elementor-element-6329e66 e-flex e-con-boxed e-con e-parent"
        data-id="6329e66"
        data-element_type="container"
        id="consumer"
      >
        <div className="e-con-inner">
          <Image id="10d658f" cls="" anim="zoomIn" src="/chain.svg" width={16} height={15} />
          <Heading
            anim="fadeInUp"
            id="68eaf23"
            cls="elementor-widget__width-initial elementor-widget-mobile__width-inherit"
            text={`'Let's share a part of our inspiration'`}
          />
        </div>
      </div>

      {/* The consumer */}
      <div
        className="elementor-element elementor-element-3528660 e-flex e-con-boxed e-con e-parent"
        data-id="3528660"
        data-element_type="container"
      >
        <div className="e-con-inner">
          <ShapeTop />
          <div className="elementor-element elementor-element-38761d4 e-con-full e-flex e-con e-child" data-id="38761d4" data-element_type="container">
            <Heading id="a899057" text="The consumer" anim="fadeInUp" />
            <Text id="c5971ca" anim="fadeInUp" delay={150}>
              <p>We believe everyone deserves to taste a real Pakistani mango. We have made delivering that experience our mission.</p>
            </Text>
            <Text id="a09c28b" anim="fadeInUp" delay={300}>
              <p>
                That starts with understanding you, the mango lover. We listen closely to our customers across Scotland
                and Ireland — which varieties you love, when you want them and how you enjoy them. That is how we keep
                improving every season, and how more people discover the king of fruits.
              </p>
            </Text>
            <Heading id="07b782c" tag="p" text="Want to know more about our mangoes?" />
            <Button id="2e50fca" text="Contact us" href="/contact" />
          </div>
          <div
            className="elementor-element elementor-element-b895b7b elementor-arrows-position-outside elementor-widget__width-initial elementor-widget-tablet__width-inherit elementor-widget-mobile__width-inherit elementor-widget elementor-widget-n-carousel"
            data-id="b895b7b"
            data-element_type="widget"
            data-settings='{"slides_to_show":"1","slides_to_show_tablet":"1","slides_to_scroll":"1","slides_to_show_mobile":"1","autoplay":"yes","autoplay_speed":5000,"pause_on_hover":"yes","pause_on_interaction":"yes","speed":500,"arrows":"yes","image_spacing_custom":{"unit":"px","size":0,"sizes":[]}}'
            data-widget_type="nested-carousel.default"
          >
            <div className="elementor-widget-container">
              <div className="e-n-carousel swiper" role="region" aria-roledescription="carousel" aria-label="Carousel" dir="ltr">
                <div className="swiper-wrapper" aria-live="off">
                  {consumerSlides.map((slide, i) => (
                    <div key={slide.slideId} className="swiper-slide" data-slide={i + 1} role="group" aria-roledescription="slide" aria-label={`${i + 1} of ${consumerSlides.length}`}>
                      <div className={`elementor-element elementor-element-${slide.slideId} e-con-full e-flex e-con e-child`} data-id={slide.slideId} data-element_type="container">
                        <Image id={slide.imageId} src={slide.src} width={1200} height={800} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <SwiperArrows />
            </div>
          </div>
        </div>
      </div>

      {/* Band: partners */}
      <div
        className="elementor-element elementor-element-17a9cc5 e-flex e-con-boxed e-con e-parent"
        data-id="17a9cc5"
        data-element_type="container"
        id="partners"
      >
        <div className="e-con-inner">
          <Image id="5ea96b0" cls="" anim="zoomIn" src="/sourcing.svg" width={84} height={99} />
          <Heading anim="fadeInUp" id="cc5f43d" tag="p" cls="elementor-widget__width-initial elementor-widget-mobile__width-inherit elementor-widget-tablet__width-initial" text={`'Be part of our`} />
          <Heading anim="fadeInUp" delay={150} id="c53f0e5" tag="p" cls="elementor-widget__width-initial elementor-widget-mobile__width-inherit" text={`meaningful relationships'`} />
          <Heading anim="fadeInUp" delay={300} id="3d76f9e" tag="p" cls="elementor-widget-mobile__width-initial" text={`Let's grow together`} />
        </div>
      </div>

      {/* Sourcing partners */}
      <div
        className="elementor-element elementor-element-981dec8 e-flex e-con-boxed e-con e-parent"
        data-id="981dec8"
        data-element_type="container"
      >
        <div className="e-con-inner">
          <ShapeTop />
          <Heading id="b5bc73c" text="Sourcing partners" anim="fadeInUp" />
          <div className="elementor-element elementor-element-cd4f0de e-con-full e-flex e-con e-child" data-id="cd4f0de" data-element_type="container">
            <Text id="f1a61f1" anim="fadeInUp" delay={150}>
              <p>We are proud of our long-standing partners in Pakistan. They are passionate, innovative growers who value quality as much as we do.</p>
            </Text>
            <Text id="2fac50d" anim="fadeInUp" delay={300}>
              <p>
                Partnerships with our growers are vital to us. We learn from each other and grow together — season after
                season, from the famous orchards of Sindh and Punjab to your doorstep.
              </p>
            </Text>
          </div>
          <div className="elementor-element elementor-element-8535612 e-con-full e-flex e-con e-child" data-id="8535612" data-element_type="container">
            <Heading id="2ee3771" tag="p" text="Would you like to know more about our growers?" />
            <Button id="e7fe557" text="Contact us" href="/contact" />
          </div>
        </div>
      </div>

      {/* Sourcing map */}
      <div
        className="elementor-element elementor-element-74d4411d e-flex e-con-boxed e-con e-parent"
        data-id="74d4411d"
        data-element_type="container"
      >
        <div className="e-con-inner">
          <Heading id="68546cf8" text="Sourcing map" anim="fadeInUp" />
          <div className="elementor-element elementor-element-6d0d2dd e-flex e-con-boxed e-con e-child" data-id="6d0d2dd" data-element_type="container">
            <div className="e-con-inner">
              <div
                className="elementor-element elementor-element-045ee29 e-n-tabs-mobile elementor-widget elementor-widget-n-tabs"
                data-id="045ee29"
                data-element_type="widget"
                data-widget_type="nested-tabs.default"
              >
                <div className="elementor-widget-container">
                  <div className="e-n-tabs" data-widget-number="4582953" aria-label="Tabs. Open items with Enter or Space, close with Escape and navigate using the Arrow keys.">
                    <div className="e-n-tabs-heading" role="tablist">
                      <button
                        id="e-n-tab-title-45829531"
                        className="e-n-tab-title"
                        aria-selected="true"
                        data-tab-index="1"
                        role="tab"
                        tabIndex={0}
                        aria-controls="e-n-tab-content-45829531"
                        style={{ "--n-tabs-title-order": 1 } as React.CSSProperties}
                      >
                        <TabIcon color="#ea580c" />
                        <span className="e-n-tab-title-text">our mangoes</span>
                      </button>
                      <button
                        id="e-n-tab-title-45829532"
                        className="e-n-tab-title"
                        aria-selected="false"
                        data-tab-index="2"
                        role="tab"
                        tabIndex={-1}
                        aria-controls="e-n-tab-content-45829532"
                        style={{ "--n-tabs-title-order": 2 } as React.CSSProperties}
                      >
                        <TabIcon color="#7aa82d" />
                        <span className="e-n-tab-title-text">our delivery area</span>
                      </button>
                    </div>
                    <div className="e-n-tabs-content">
                      <div
                        id="e-n-tab-content-45829531"
                        role="tabpanel"
                        aria-labelledby="e-n-tab-title-45829531"
                        data-tab-index="1"
                        className="e-active elementor-element elementor-element-1366f0f e-con-full e-flex e-con e-child"
                        data-id="1366f0f"
                        data-element_type="container"
                        style={{ "--n-tabs-title-order": 1 } as React.CSSProperties}
                      >
                        <div
                          className="elementor-element elementor-element-ee9793f elementor-widget__width-inherit elementor-widget elementor-widget-uael-hotspot"
                          data-id="ee9793f"
                          data-element_type="widget"
                          data-widget_type="uael-hotspot.default"
                        >
                          <div className="elementor-widget-container">
                            <div className="uael-hotspot uael-hotspot-tooltip-yes">
                              <img loading="lazy" decoding="async" width={1500} height={901} src="/sourcing-map.png" alt="World map showing where our mangoes come from" />
                              <MapPin left="66.5%" top="42%" label="Sindh & Punjab, Pakistan — where our mangoes grow" />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        id="e-n-tab-content-45829532"
                        role="tabpanel"
                        aria-labelledby="e-n-tab-title-45829532"
                        data-tab-index="2"
                        className="elementor-element elementor-element-1366f0e e-con-full e-flex e-con e-child"
                        data-id="1366f0e"
                        data-element_type="container"
                        style={{ "--n-tabs-title-order": 2 } as React.CSSProperties}
                      >
                        <div
                          className="elementor-element elementor-element-ee9793e elementor-widget__width-inherit elementor-widget elementor-widget-uael-hotspot"
                          data-id="ee9793e"
                          data-element_type="widget"
                          data-widget_type="uael-hotspot.default"
                        >
                          <div className="elementor-widget-container">
                            <div className="uael-hotspot uael-hotspot-tooltip-yes">
                              <img loading="lazy" decoding="async" width={1500} height={901} src="/sourcing-map.png" alt="World map showing our delivery area" />
                              <MapPin left="44.2%" top="18.5%" label="Scotland — doorstep delivery" />
                              <MapPin left="42.2%" top="22.5%" label="Ireland — doorstep delivery" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quality */}
      <div
        className="elementor-element elementor-element-462edb4 e-flex e-con-boxed e-con e-parent"
        data-id="462edb4"
        data-element_type="container"
        id="quality"
      >
        <div className="e-con-inner">
          <div className="elementor-element elementor-element-8915c7c e-con-full e-flex e-con e-child" data-id="8915c7c" data-element_type="container">
            <IconBoxTitle mobileId="3d8ac1e" desktopId="0dfbaf7" title="Quality & Certificates" />
            <div className="elementor-element elementor-element-fd2a219 e-con-full e-flex e-con e-child" data-id="fd2a219" data-element_type="container">
              <Text id="5c13f95" cls="elementor-widget__width-initial elementor-widget-tablet__width-inherit" anim="fadeInUp">
                <p>
                  Together with our growers, we set the highest standards of quality for all our mangoes. Every batch
                  is checked at the orchard, on arrival in the UK and again before packing — so you can be sure of
                  consistently premium fruit from RM Mangoes.
                </p>
              </Text>
            </div>
            <Heading id="6925c46" tag="h3" text="Our registrations:" anim="fadeInUp" />
            <div
              className="elementor-element elementor-element-24150e3 elementor-icon-list--layout-traditional elementor-list-item-link-full_width elementor-widget elementor-widget-icon-list elementor-invisible"
              data-id="24150e3"
              data-element_type="widget"
              data-settings='{"_animation":"fadeInUp","_animation_delay":200}'
              data-widget_type="icon-list.default"
            >
              <div className="elementor-widget-container">
                <ul className="elementor-icon-list-items">
                  {["Registered with HMRC", "Registered UK food business", "Fully insured deliveries"].map((text, i) => (
                    <li key={i} className="elementor-icon-list-item">
                      <span className="elementor-icon-list-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" data-name="Laag 1" viewBox="0 0 20 20">
                          <path fill="#619b26" strokeWidth={0} d="m10,3c3.86,0,7,3.14,7,7s-3.14,7-7,7-7-3.14-7-7,3.14-7,7-7M10,0C4.48,0,0,4.48,0,10s4.48,10,10,10,10-4.48,10-10S15.52,0,10,0h0Z"></path>
                          <circle fill="#619b26" strokeWidth={0} cx="10" cy="10" r="10"></circle>
                        </svg>
                      </span>
                      <span className="elementor-icon-list-text">{text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Band: products */}
      <div
        className="elementor-element elementor-element-d61f23c e-flex e-con-boxed e-con e-parent"
        data-id="d61f23c"
        data-element_type="container"
        id="products"
      >
        <div className="e-con-inner">
          <Image id="d1dd519" cls="" anim="zoomIn" src="/assortiment_1.svg" />
          <Heading anim="fadeInUp" id="61f6b2c" cls="elementor-widget__width-initial elementor-widget-mobile__width-inherit" text={`'Let's show you a part of our specialism'`} />
        </div>
      </div>

      {/* Product range */}
      <div
        className="elementor-element elementor-element-746c2dd e-flex e-con-boxed e-con e-parent"
        data-id="746c2dd"
        data-element_type="container"
      >
        <div className="e-con-inner">
          <ShapeTop />
          <div className="elementor-element elementor-element-c8ccd36 e-con-full e-flex e-con e-child" data-id="c8ccd36" data-element_type="container">
            <Heading id="3171c71" text="Our product range" anim="fadeInUp" />
            <Text id="17c051d">
              <p>
                We specialise in one thing and do it brilliantly: premium Pakistani mangoes. Throughout the season we
                bring you the best varieties at their peak — from honey-sweet Sindhri to aromatic Chaunsa.
              </p>
            </Text>
          </div>
          <div
            className="elementor-element elementor-element-e01af78 elementor-arrows-position-inside elementor-widget elementor-widget-n-carousel"
            data-id="e01af78"
            data-element_type="widget"
            data-settings='{"slides_to_show":"5","slides_to_show_tablet":"3","slides_to_show_mobile":"2","autoplay_speed":4000,"autoplay":"yes","pause_on_hover":"yes","pause_on_interaction":"yes","speed":500,"arrows":"yes","image_spacing_custom":{"unit":"px","size":10,"sizes":[]}}'
            data-widget_type="nested-carousel.default"
          >
            <div className="elementor-widget-container">
              <div className="e-n-carousel swiper" role="region" aria-roledescription="carousel" aria-label="Carousel" dir="ltr">
                <div className="swiper-wrapper" aria-live="off">
                  {varieties.map((v, i) => (
                    <div key={v.id} className="swiper-slide" data-slide={i + 1} role="group" aria-roledescription="slide" aria-label={`${i + 1} of ${varieties.length}`}>
                      {v.boxed ? (
                        <Link className={`elementor-element elementor-element-${v.id} e-flex e-con-boxed e-con e-child`} data-id={v.id} data-element_type="container" href="/products">
                          <div className="e-con-inner">
                            <Image id={v.imageId} src={v.icon} alt={v.name} hoverScale />
                            <Heading id={v.headingId} tag="h3" cls="" text={v.name} />
                          </div>
                        </Link>
                      ) : (
                        <Link className={`elementor-element elementor-element-${v.id} e-con-full e-flex e-con e-child`} data-id={v.id} data-element_type="container" href="/products">
                          <Image id={v.imageId} src={v.icon} alt={v.name} hoverScale />
                          <Heading id={v.headingId} tag="h3" cls="" text={v.name} />
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <SwiperArrows />
            </div>
          </div>
        </div>
      </div>

      {/* Band: logistics */}
      <div
        className="elementor-element elementor-element-afb9648 e-flex e-con-boxed e-con e-parent"
        data-id="afb9648"
        data-element_type="container"
        id="logistics"
      >
        <div className="e-con-inner">
          <Image id="0a01020" cls="" anim="zoomIn" src="/Logistic_2.svg" />
          <Heading anim="fadeInUp" id="f46608a" tag="p" cls="elementor-widget__width-initial elementor-widget-mobile__width-inherit" text={`'Part of a`} />
          <Heading anim="fadeInUp" delay={150} id="3d26bd2" tag="p" cls="elementor-widget__width-initial elementor-widget-mobile__width-inherit" text={`powerful connection'`} />
        </div>
      </div>

      {/* Logistics */}
      <div
        className="elementor-element elementor-element-48fc6ab e-flex e-con-boxed e-con e-parent"
        data-id="48fc6ab"
        data-element_type="container"
      >
        <div className="e-con-inner">
          <ShapeTop />
          <div className="elementor-element elementor-element-482e025 e-con-full e-flex e-con e-child" data-id="482e025" data-element_type="container">
            <Heading id="1ae0223" text="Our logistics" anim="fadeInUp" />
            <Text id="86aa2ba" anim="fadeInUp" delay={150}>
              <p>
                Every box travels in temperature-controlled conditions from Pakistan to our hub in Scotland. From there
                our own delivery network takes over, so your mangoes arrive fresh, fast and in perfect condition.
              </p>
            </Text>
            <Text id="ece14ce" anim="fadeInUp" delay={300}>
              <p>
                Because we manage the whole journey ourselves, we always know exactly where your order is and can
                respond quickly. Besides doorstep delivery, we also handle bulk orders for shops and restaurants.
              </p>
            </Text>
          </div>
          <div className="elementor-element elementor-element-82c647d e-con-full e-flex e-con e-child" data-id="82c647d" data-element_type="container">
            <Image id="7c61707" cls="elementor-widget__width-inherit elementor-widget-tablet__width-initial" anim="zoomIn" src="/rm-delivery-logo.png" alt="RM Delivery" />
          </div>
        </div>
      </div>

      {/* Services */}
      <div
        className="elementor-element elementor-element-ecd5d6e e-flex e-con-boxed e-con e-parent"
        data-id="ecd5d6e"
        data-element_type="container"
      >
        <div className="e-con-inner">
          <div className="elementor-element elementor-element-209b062 e-con-full e-flex e-con e-child" data-id="209b062" data-element_type="container">
            <Heading id="d479e3e" text="Services" anim="fadeInUp" />
            <div
              className="elementor-element elementor-element-94ae115 elementor-icon-list--layout-traditional elementor-list-item-link-full_width elementor-widget elementor-widget-icon-list"
              data-id="94ae115"
              data-element_type="widget"
              data-widget_type="icon-list.default"
            >
              <div className="elementor-widget-container">
                <ul className="elementor-icon-list-items">
                  {[
                    "Temperature-controlled transport",
                    "Careful hand-packing",
                    <>Door-to-door delivery<br key="br" />across Scotland &amp; Ireland</>,
                    "Bulk orders for shops & restaurants",
                    "Order updates via WhatsApp",
                  ].map((text, i) => (
                    <li key={i} className="elementor-icon-list-item">
                      <span className="elementor-icon-list-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" data-name="Laag 1" viewBox="0 0 20 20">
                          <path fill="#619b26" strokeWidth={0} d="m10,3c3.86,0,7,3.14,7,7s-3.14,7-7,7-7-3.14-7-7,3.14-7,7-7M10,0C4.48,0,0,4.48,0,10s4.48,10,10,10,10-4.48,10-10S15.52,0,10,0h0Z"></path>
                          <circle fill="#619b26" strokeWidth={0} cx="10" cy="10" r="10"></circle>
                        </svg>
                      </span>
                      <span className="elementor-icon-list-text">{text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <Button id="bd615fe" cls="elementor-mobile-align-justify" text="get in touch" href="/contact" />
          </div>
          <div className="elementor-element elementor-element-6559f95 e-con-full e-flex e-con e-child" data-id="6559f95" data-element_type="container"></div>
          <div className="elementor-element elementor-element-8fd0261 e-con-full e-flex e-con e-child" data-id="8fd0261" data-element_type="container">
            {stats.map((stat) => (
              <div
                key={stat.id}
                className={`elementor-element elementor-element-${stat.id} elementor-view-stacked elementor-position-inline-start elementor-widget__width-initial elementor-widget-mobile__width-initial elementor-tablet-position-block-start elementor-shape-circle elementor-mobile-position-block-start elementor-widget elementor-widget-icon-box elementor-invisible`}
                data-id={stat.id}
                data-element_type="widget"
                data-settings={`{"_animation":"zoomIn","_animation_delay":${stats.indexOf(stat) * 150}}`}
                data-widget_type="icon-box.default"
              >
                <div className="elementor-widget-container">
                  <div className="elementor-icon-box-wrapper">
                    <div className="elementor-icon-box-icon">
                      <span className="elementor-icon">
                        <StatIcon name={stat.icon} />
                      </span>
                    </div>
                    <div className="elementor-icon-box-content">
                      <p className="elementor-icon-box-title">
                        <span>{stat.title}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Band: clients */}
      <div
        className="elementor-element elementor-element-49b7770 e-flex e-con-boxed e-con e-parent"
        data-id="49b7770"
        data-element_type="container"
      >
        <div className="e-con-inner">
          <div
            className="elementor-element elementor-element-6af9cf2 elementor-invisible elementor-widget elementor-widget-image"
            data-id="6af9cf2"
            data-element_type="widget"
            data-settings='{"_animation":"fadeInRight","_animation_delay":400}'
            data-widget_type="image.default"
          >
            <div className="elementor-widget-container">
              <img loading="lazy" decoding="async" width={7} height={9} src="/retail_Hello.svg" alt="" />
            </div>
          </div>
          <div
            className="elementor-element elementor-element-f6ef43a elementor-invisible elementor-widget elementor-widget-image"
            data-id="f6ef43a"
            data-element_type="widget"
            data-settings='{"_animation":"fadeInRight","_animation_delay":800}'
            data-widget_type="image.default"
          >
            <div className="elementor-widget-container">
              <img loading="lazy" decoding="async" width={10} height={10} src="/retail_tekstballon_2.svg" alt="" />
            </div>
          </div>
          <div
            className="elementor-element elementor-element-00c03d3 elementor-invisible elementor-widget elementor-widget-image"
            data-id="00c03d3"
            data-element_type="widget"
            data-settings='{"_animation":"zoomIn"}'
            data-widget_type="image.default"
          >
            <div className="elementor-widget-container">
              <img loading="lazy" decoding="async" width={29} height={17} src="/Retail.svg" alt="" />
            </div>
          </div>
          <div
            className="elementor-element elementor-element-91d7f6c elementor-widget__width-initial elementor-widget-mobile__width-inherit elementor-widget elementor-widget-heading"
            data-id="91d7f6c"
            data-element_type="widget"
            data-widget_type="heading.default"
          >
            <div className="elementor-widget-container">
              <h2 className="elementor-heading-title elementor-size-default">
                &lsquo;Let us be a part of <br />
                your success&rsquo;
              </h2>
            </div>
          </div>
          <Heading anim="fadeInUp" delay={200} id="0c32e73" tag="p" cls="elementor-widget__width-initial elementor-widget-mobile__width-inherit" text="By sharing the king of fruits together" />
        </div>
      </div>

      {/* Divider before clients */}
      <div
        className="elementor-element elementor-element-34804aa e-con-full e-flex e-con e-parent"
        data-id="34804aa"
        data-element_type="container"
        id="clients"
      >
        <ShapeTop />
      </div>

      {/* Our clients */}
      <div
        className="elementor-element elementor-element-7ba0275 e-flex e-con-boxed e-con e-parent"
        data-id="7ba0275"
        data-element_type="container"
      >
        <div className="e-con-inner">
          <Heading id="25b4cef" text="Our clients" anim="fadeInUp" />
          <div className="elementor-element elementor-element-236eca9 e-con-full e-flex e-con e-child" data-id="236eca9" data-element_type="container">
            <Text id="51414ca" anim="fadeInUp" delay={150}>
              <p>
                Our customers are located across Scotland and Ireland — families, fruit lovers, local shops and
                restaurants who all share a taste for real Pakistani mangoes.
              </p>
            </Text>
            <Text id="6dcd8c7" anim="fadeInUp" delay={300}>
              <p>
                We&rsquo;re proud of everyone we deliver to. Quality, honest prices and friendly service are what our
                customers value us for, box after box, season after season.
              </p>
            </Text>
          </div>
          <div className="elementor-element elementor-element-41474d4 e-con-full e-flex e-con e-child" data-id="41474d4" data-element_type="container">
            <Text id="b6db9b8" cls="elementor-widget__width-inherit">
              <p>
                Combined with our knowledge of every season&rsquo;s harvest, we help more people enjoy the king of
                fruits. We are happy to tell you more.
              </p>
            </Text>
            <Heading id="483d4b7" tag="h3" text="Want to taste the difference?" />
            <div
              className="elementor-element elementor-element-5fbeae2 elementor-widget__width-initial elementor-widget elementor-widget-image"
              data-id="5fbeae2"
              data-element_type="widget"
              data-widget_type="image.default"
            >
              <div className="elementor-widget-container">
                <Link href="/products">
                  <img loading="lazy" decoding="async" width={841} height={595} src="/logo-2.png" alt="RM Mangoes" />
                </Link>
              </div>
            </div>
            <div
              className="elementor-element elementor-element-dd86e9e elementor-widget__width-initial elementor-widget elementor-widget-image"
              data-id="dd86e9e"
              data-element_type="widget"
              data-widget_type="image.default"
            >
              <div className="elementor-widget-container">
                <Link href="/products">
                  <img loading="lazy" decoding="async" width={961} height={590} src="/mango-box-medium.png" alt="Order a mango box" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
