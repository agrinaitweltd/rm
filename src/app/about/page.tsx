import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import { ShapeBottom, Heading, Text, Button, Image, IconBoxTitle, SwiperArrows } from "@/components/elementor";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About RM Mangoes",
  description:
    "RM Mangoes is a family business importing premium Pakistani mangoes directly from trusted growers in Pakistan and delivering throughout Scotland and Ireland.",
  alternates: { canonical: "/about" },
};

const values = [
  {
    cardId: "235c5d0",
    imageId: "5789fdd",
    headingId: "dd3b755",
    unfoldId: "32508ea",
    icon: "/5.svg",
    title: "Trust",
    paragraphs: [
      "We believe that trust is the key foundation for building relationships.",
      "From the growers we work with in Pakistan to every customer we deliver to in Scotland and Ireland, we strive to be completely transparent and to offer real value to everyone.",
    ],
  },
  {
    cardId: "1ea7178",
    imageId: "a722240",
    headingId: "d4a7ccd",
    unfoldId: "05cc96e",
    icon: "/connect.svg",
    title: "Connect",
    paragraphs: [
      "Bringing people, cultures and flavours together energises us. Our mangoes connect Pakistani orchards with families across Scotland and Ireland. We listen to our customers and growers alike — we are in this together. So, let’s make lasting memories together.",
    ],
  },
  {
    cardId: "32f1576",
    imageId: "238fdf2",
    headingId: "c47d97a",
    unfoldId: "47a3bb4",
    icon: "/full_commitment.svg",
    title: "Full commitment & dedication",
    paragraphs: [
      "At RM Mangoes, we do everything with 100% commitment and dedication. Exceeding your expectations is our goal — in everything we do. We go all out to get the freshest boxes to your door, without cutting corners.",
    ],
  },
  {
    cardId: "08b6cfa",
    imageId: "1b22171",
    headingId: "92ed450",
    unfoldId: "3f93c76",
    icon: "/inspire.svg",
    title: "Inspire",
    paragraphs: [
      "We want to inspire you and take you into the colourful world of Pakistani mangoes and all their possibilities. We are keen, think in creative solutions and know our public.",
    ],
  },
  {
    cardId: "dfd664d",
    imageId: "e07bfd6",
    headingId: "fae5278",
    unfoldId: "d21e9b9",
    icon: "/specialism.svg",
    title: "Specialism",
    paragraphs: [
      "We value depth over breadth. We focus on one thing and do it brilliantly: premium Pakistani mangoes. We develop and share knowledge, day in, day out, and adapt to every season on our way to your doorstep.",
    ],
  },
];

// Our network cards (desktop carousel slide ids from the original template)
const partnerCards = [
  {
    slideId: "6eeea0d",
    imageId: "e5b895b",
    headingId: "0ac2b90",
    textId: "fc97182",
    buttonId: "1d82fc5",
    image: "/partner-growers.png",
    heading: "Sourcing",
    text: "Pakistan orchards",
    button: { text: "our mangoes", href: "/products" },
  },
  {
    slideId: "a4480cf",
    imageId: "aaf7ea5",
    headingId: "6b5f34c",
    textId: "a84600d",
    buttonId: "4138847",
    image: "/partner-quality.png",
    heading: "Quality",
    text: "Hand inspected",
    button: { text: "our promise", href: "/the-chain#quality" },
  },
  {
    slideId: "bb55f43",
    imageId: "2925d56",
    headingId: "a130a0c",
    textId: "6aecaad",
    image: "/partner-airfreight.png",
    heading: "Air Freight",
    text: "Pakistan | UK",
  },
  {
    slideId: "2584441",
    imageId: "25211d8",
    headingId: "afb52d6",
    buttonId: "49ef434",
    image: "/partner-delivery-scotland.png",
    heading: "Delivery Scotland",
    button: { text: "contact us", href: "/contact" },
  },
  {
    slideId: "78a3e0b",
    imageId: "9e66801",
    headingId: "1e91fdf",
    textId: "fb249cf",
    buttonId: "5402b26",
    image: "/partner-delivery-ireland.png",
    heading: "Delivery Ireland",
    text: "Coming to your doorstep",
    button: { text: "contact us", href: "/contact" },
  },
];

function PartnerSlides() {
  return (
    <>
      {partnerCards.map((card, i) => (
        <div
          key={card.slideId}
          className="swiper-slide"
          data-slide={i + 1}
          role="group"
          aria-roledescription="slide"
          aria-label={`${i + 1} of ${partnerCards.length}`}
        >
          <div
            className={`elementor-element elementor-element-${card.slideId} e-con-full e-flex e-con e-child`}
            data-id={card.slideId}
            data-element_type="container"
          >
            <Image id={card.imageId} src={card.image} alt={card.heading} hoverScale />
            <Heading id={card.headingId} tag="p" cls="" text={card.heading} />
            {card.text && (
              <Text id={card.textId!} cls="elementor-widget-tablet__width-initial">
                <p>{card.text}</p>
              </Text>
            )}
            {card.button && (
              <Button id={card.buttonId!} cls="elementor-align-center" text={card.button.text} href={card.button.href} />
            )}
          </div>
        </div>
      ))}
    </>
  );
}

const arrowIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" id="pijl" data-name="Laag 1" viewBox="0 0 15.67 15.71">
    <polygon strokeWidth={0} points="0 15.71 0 0 15.67 7.87 0 15.71"></polygon>
  </svg>
);

export default function AboutPage() {
  return (
    <PageShell postId={5558}>
      {/* Intro with photo background */}
      <div
        className="elementor-element elementor-element-994b4b1 e-flex e-con-boxed e-con e-parent"
        data-id="994b4b1"
        data-element_type="container"
      >
        <div className="e-con-inner">
          <div
            className="elementor-element elementor-element-47e3004 e-con-full e-flex e-con e-child"
            data-id="47e3004"
            data-element_type="container"
          >
            <div
              className="elementor-element elementor-element-667f0f7 elementor-hidden-desktop elementor-hidden-tablet elementor-view-default elementor-position-block-start elementor-mobile-position-block-start elementor-widget elementor-widget-icon-box"
              data-id="667f0f7"
              data-element_type="widget"
              data-widget_type="icon-box.default"
            >
              <div className="elementor-widget-container">
                <div className="elementor-icon-box-wrapper">
                  <div className="elementor-icon-box-icon">
                    <span className="elementor-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" id="a" viewBox="0 0 15.71 15.67">
                        <polygon strokeWidth={0} points="0 0 15.71 0 7.84 15.67 0 0"></polygon>
                      </svg>
                    </span>
                  </div>
                  <div className="elementor-icon-box-content">
                    <h1 className="elementor-icon-box-title">
                      <span>About RM Mangoes</span>
                    </h1>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="elementor-element elementor-element-80ac094 elementor-position-inline-start elementor-hidden-mobile elementor-view-default elementor-mobile-position-block-start elementor-widget elementor-widget-icon-box"
              data-id="80ac094"
              data-element_type="widget"
              data-widget_type="icon-box.default"
            >
              <div className="elementor-widget-container">
                <div className="elementor-icon-box-wrapper">
                  <div className="elementor-icon-box-icon">
                    <span className="elementor-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" id="a" data-name="Laag 1" viewBox="0 0 15.67 15.71">
                        <polygon strokeWidth={0} points="0 15.71 0 0 15.67 7.87 0 15.71"></polygon>
                      </svg>
                    </span>
                  </div>
                  <div className="elementor-icon-box-content">
                    <h1 className="elementor-icon-box-title">
                      <span>About RM Mangoes</span>
                    </h1>
                  </div>
                </div>
              </div>
            </div>
          <div
            className="elementor-element elementor-element-66c1570 e-con-full e-flex e-con e-child"
            data-id="66c1570"
            data-element_type="container"
          >
            <div
              className="elementor-element elementor-element-e08fe80 elementor-widget__width-initial elementor-widget elementor-widget-text-editor elementor-invisible"
              data-id="e08fe80"
              data-element_type="widget"
              data-settings='{"_animation":"fadeInUp"}'
              data-widget_type="text-editor.default"
            >
              <div className="elementor-widget-container">
                <p>
                  RM Mangoes is a family business built on a simple idea: everyone deserves to taste a real Pakistani
                  mango. From our base in Scotland we take care of sourcing, importing, quality and delivery — so every
                  box arrives fresh and full of flavour.
                </p>
              </div>
            </div>
            <div
              className="elementor-element elementor-element-d52562a elementor-widget__width-initial elementor-widget-tablet__width-inherit elementor-widget elementor-widget-text-editor elementor-invisible"
              data-id="d52562a"
              data-element_type="widget"
              data-settings='{"_animation":"fadeInUp","_animation_delay":200}'
              data-widget_type="text-editor.default"
            >
              <div className="elementor-widget-container">
                <p>
                  We import our mangoes directly from Pakistan, working with trusted growers we know personally.
                  Throughout the season we deliver to doorsteps across Scotland and Ireland. Varieties like Sindhri,
                  Chaunsa and Anwar Ratol have a special place in our hearts. We can safely call ourselves specialists
                  in the king of fruits.
                </p>
              </div>
            </div>
          </div>
          <div
            className="elementor-element elementor-element-b251750 elementor-widget elementor-widget-button"
            data-id="b251750"
            data-element_type="widget"
            data-widget_type="button.default"
          >
            <div className="elementor-widget-container">
              <div className="elementor-button-wrapper">
                <Link className="elementor-button elementor-button-link elementor-size-sm" href="/contact">
                  <span className="elementor-button-content-wrapper">
                    <span className="elementor-button-text">Get in touch</span>
                  </span>
                </Link>
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>

      {/* Our network (original Fruitful Ventures section) */}
      <div
        className="elementor-element elementor-element-19fe91b e-flex e-con-boxed e-con e-parent"
        data-id="19fe91b"
        data-element_type="container"
        id="network"
      >
        <div className="e-con-inner">
          <ShapeBottom />
          <Image id="81a4337" cls="" anim="zoomIn" src="/rm-network.png" alt="The RM Mangoes network" width={1024} height={301} />
          <Text id="cb12385" cls="elementor-widget__width-initial elementor-widget-mobile__width-inherit" anim="fadeInUp">
            <p>
              RM Mangoes is more than a webshop — it is a small chain of trusted partners working as one team. Our
              growers in Pakistan, our air-freight partners and our own delivery network in Scotland and Ireland each
              take care of their step of the journey. Because every link is in trusted hands, we can focus on what
              matters most: bringing you the very best mangoes of the season.
            </p>
          </Text>
          <Button id="92d67d7" cls="elementor-align-center" text="See how our chain works" href="/the-chain" anim="fadeInUp" delay={200} />
          <div
            className="elementor-element elementor-element-5426b57 elementor-hidden-tablet elementor-hidden-mobile elementor-arrows-position-inside elementor-widget elementor-widget-n-carousel elementor-invisible"
            data-id="5426b57"
            data-element_type="widget"
            data-settings='{"slides_to_show":"5","image_spacing_custom":{"unit":"px","size":30,"sizes":[]},"slides_to_show_tablet":"3","slides_to_show_mobile":"1","speed":500,"arrows":"yes"}'
            data-widget_type="nested-carousel.default"
          >
            <div className="elementor-widget-container">
              <div className="e-n-carousel swiper" role="region" aria-roledescription="carousel" aria-label="Carousel" dir="ltr">
                <div className="swiper-wrapper" aria-live="polite">
                  <PartnerSlides />
                </div>
              </div>
              <SwiperArrows />
            </div>
          </div>
          <div
            className="elementor-element elementor-element-5c6cb60 elementor-widget-tablet__width-initial elementor-hidden-desktop elementor-arrows-position-inside elementor-widget elementor-widget-n-carousel"
            data-id="5c6cb60"
            data-element_type="widget"
            data-settings='{"slides_to_show":"4","image_spacing_custom":{"unit":"px","size":30,"sizes":[]},"slides_to_show_tablet":"3","slides_to_show_mobile":"1","autoplay":"yes","autoplay_speed":5000,"pause_on_hover":"yes","pause_on_interaction":"yes","speed":500,"arrows":"yes"}'
            data-widget_type="nested-carousel.default"
          >
            <div className="elementor-widget-container">
              <div className="e-n-carousel swiper" role="region" aria-roledescription="carousel" aria-label="Carousel" dir="ltr">
                <div className="swiper-wrapper" aria-live="off">
                  <PartnerSlides />
                </div>
              </div>
              <SwiperArrows />
            </div>
          </div>
        </div>
      </div>

      {/* History timeline */}
      <div
        className="elementor-element elementor-element-29569a2 e-flex e-con-boxed e-con e-parent"
        data-id="29569a2"
        data-element_type="container"
        id="history"
      >
        <div className="e-con-inner">
          <Image id="117b220" cls="elementor-hidden-mobile" anim="fadeIn" src="/timeline-horizontal.png" alt="RM Mangoes history timeline" />
          <Image
            id="d510240"
            cls="elementor-widget-tablet__width-initial elementor-hidden-desktop elementor-hidden-tablet"
            src="/timeline-vertical.png"
            alt="RM Mangoes history timeline"
          />
        </div>
      </div>

      {/* Quote band (static heart in place of the original lottie) */}
      <div
        className="elementor-element elementor-element-76d40da e-flex e-con-boxed e-con e-parent"
        data-id="76d40da"
        data-element_type="container"
        id="mission"
      >
        <div className="e-con-inner">
          <div
            className="elementor-element elementor-element-8961678 elementor-align-center elementor-widget elementor-widget-image elementor-invisible"
            data-id="8961678"
            data-element_type="widget"
            data-settings='{"_animation":"zoomIn"}'
            data-widget_type="image.default"
          >
            <div className="elementor-widget-container">
              <img decoding="async" src="/heart.png" alt="" />
            </div>
          </div>
          <div
            className="elementor-element elementor-element-0f537bc elementor-widget__width-initial elementor-widget-mobile__width-inherit elementor-widget elementor-widget-heading elementor-invisible"
            data-id="0f537bc"
            data-element_type="widget"
            data-settings='{"_animation":"fadeInUp","_animation_delay":150}'
            data-widget_type="heading.default"
          >
            <div className="elementor-widget-container">
              <h2 className="elementor-heading-title elementor-size-default">&lsquo;Part of something meaningful&rsquo;</h2>
            </div>
          </div>
        </div>
      </div>

      {/* Why we do what we do */}
      <div
        className="elementor-element elementor-element-3519f37 e-flex e-con-boxed e-con e-parent"
        data-id="3519f37"
        data-element_type="container"
      >
        <div className="e-con-inner">
          <div className="elementor-shape elementor-shape-top" aria-hidden="true" data-negative="false">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 10" preserveAspectRatio="none">
              <path className="elementor-shape-fill" d="M350,10L340,0h20L350,10z"></path>
            </svg>
          </div>
          <div
            className="elementor-element elementor-element-f71b096 elementor-widget__width-inherit elementor-widget elementor-widget-heading"
            data-id="f71b096"
            data-element_type="widget"
            data-widget_type="heading.default"
          >
            <div className="elementor-widget-container">
              <h2 className="elementor-heading-title elementor-size-default">Why we do what we do</h2>
            </div>
          </div>
          <div
            className="elementor-element elementor-element-fe9fc5d e-con-full e-flex e-con e-child"
            data-id="fe9fc5d"
            data-element_type="container"
          >
            <div
              className="elementor-element elementor-element-b38e755 elementor-widget elementor-widget-text-editor elementor-invisible"
              data-id="b38e755"
              data-element_type="widget"
              data-settings='{"_animation":"fadeInUp"}'
              data-widget_type="text-editor.default"
            >
              <div className="elementor-widget-container">
                <p>
                  We are people of today. We are passionate, pragmatic and like to work fast and efficiently. We do what
                  we say and say what we do. We build relationships based on trust and transparency.
                </p>
              </div>
            </div>
            <div
              className="elementor-element elementor-element-bcfdf42 elementor-widget elementor-widget-text-editor elementor-invisible"
              data-id="bcfdf42"
              data-element_type="widget"
              data-settings='{"_animation":"fadeInUp","_animation_delay":200}'
              data-widget_type="text-editor.default"
            >
              <div className="elementor-widget-container">
                <p>
                  But we are also people of tomorrow. We forge relationships for the long term — with our growers in
                  Pakistan and with every family we deliver to in Scotland and Ireland. In everything we do, we try to
                  do our part to bring people together around great fruit. And most of all, we have a passion for
                  mangoes.
                </p>
              </div>
            </div>
          </div>
          <div
            className="elementor-element elementor-element-5d65511 elementor-widget__width-initial elementor-widget-tablet__width-initial elementor-widget-mobile__width-inherit elementor-widget elementor-widget-heading elementor-invisible"
            data-id="5d65511"
            data-element_type="widget"
            data-settings='{"_animation":"fadeInUp","_animation_delay":300}'
            data-widget_type="heading.default"
          >
            <div className="elementor-widget-container">
              <h2 className="elementor-heading-title elementor-size-default">
                &lsquo;We bring the finest mangoes from Pakistani farms to Scottish and Irish doorsteps to create
                colorful and meaningful relationships for generations.&rsquo;
              </h2>
            </div>
          </div>
        </div>
      </div>

      {/* How do we do it — values */}
      <div
        className="elementor-element elementor-element-f422e01 e-flex e-con-boxed e-con e-parent"
        data-id="f422e01"
        data-element_type="container"
      >
        <div className="e-con-inner">
          <div
            className="elementor-element elementor-element-ca168fd elementor-widget__width-inherit elementor-widget elementor-widget-heading"
            data-id="ca168fd"
            data-element_type="widget"
            data-widget_type="heading.default"
          >
            <div className="elementor-widget-container">
              <p className="elementor-heading-title elementor-size-default">How do we do it</p>
            </div>
          </div>
          {values.map((value) => (
            <a
              key={value.cardId}
              className={`elementor-element elementor-element-${value.cardId} e-con-full e-flex e-con e-child elementor-invisible`}
              data-id={value.cardId}
              data-element_type="container"
              data-settings={`{"_animation":"zoomIn","_animation_delay":${values.indexOf(value) * 120}}`}
            >
              <div
                className={`elementor-element elementor-element-${value.imageId} elementor-widget elementor-widget-image`}
                data-id={value.imageId}
                data-element_type="widget"
                data-widget_type="image.default"
              >
                <div className="elementor-widget-container">
                  <img decoding="async" src={value.icon} title={value.title} alt={value.title} loading="lazy" />
                </div>
              </div>
              <div
                className={`elementor-element elementor-element-${value.headingId} elementor-widget elementor-widget-heading`}
                data-id={value.headingId}
                data-element_type="widget"
                data-widget_type="heading.default"
              >
                <div className="elementor-widget-container">
                  <h3 className="elementor-heading-title elementor-size-default">{value.title}</h3>
                </div>
              </div>
              <div
                className={`elementor-element elementor-element-${value.unfoldId} elementor-widget elementor-widget-jet-unfold`}
                data-id={value.unfoldId}
                data-element_type="widget"
                data-widget_type="jet-unfold.default"
              >
                <div className="elementor-widget-container">
                  <div className="jet-unfold">
                    <div className="jet-unfold__inner">
                      <div className="jet-unfold__mask" style={{ height: "80px" }}>
                        <div className="jet-unfold__content">
                          <div className="jet-unfold__content-inner elementor-text-editor elementor-clearfix">
                            {value.paragraphs.map((text, i) => (
                              <p key={i}>{text}</p>
                            ))}
                          </div>
                        </div>
                        <div className="jet-unfold__separator"></div>
                      </div>
                      <div className="jet-unfold__trigger">
                        <div
                          className="jet-unfold__button elementor-button elementor-size-md"
                          data-unfold-text="read more"
                          data-fold-text="hide"
                          tabIndex={0}
                          role="button"
                        >
                          <span className="jet-unfold__button-icon jet-tricks-icon">{arrowIcon}</span>
                          <span className="jet-unfold__button-text">read more</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Brand movie band */}
      <div
        className="elementor-element elementor-element-785e6af e-flex e-con-boxed e-con e-parent"
        data-id="785e6af"
        data-element_type="container"
      >
        <div className="e-con-inner">
          <Image id="5c0c68c" cls="" anim="zoomIn" src="/3.svg" width={24} height={23} />
          <Heading anim="fadeInUp" id="885fdf5" tag="p" cls="elementor-widget__width-initial elementor-widget-mobile__width-inherit" text={`'Be part of`} />
          <Heading anim="fadeInUp" delay={150} id="51467f6" cls="elementor-widget__width-initial elementor-widget-mobile__width-inherit" text={`the mango journey'`} />
          <Heading anim="fadeInUp" delay={300} id="26b7336" tag="p" cls="" text="We proudly present our story!" />
        </div>
      </div>

      {/* Brand movie video */}
      <div
        className="elementor-element elementor-element-97a5251 e-con-full e-flex e-con e-parent"
        data-id="97a5251"
        data-element_type="container"
        id="brandmovie"
      >
        <div
          className="elementor-element elementor-element-b720e49 elementor-widget-mobile__width-inherit uael-aspect-ratio-16_9 elementor-widget elementor-widget-uael-video elementor-invisible"
          data-id="b720e49"
          data-element_type="widget"
          data-settings='{"_animation":"zoomIn"}'
          data-widget_type="uael-video.default"
        >
          <div className="elementor-widget-container">
            <div className="uael-video__outer-wrap uael-video-type-vimeo" data-autoplay="0">
              <div className="uael-video-inner-wrap">
                <div
                  className="uael-video__play"
                  data-src="https://player.vimeo.com/video/857579952?loop=1&title=0&portrait=0&byline=0&muted=0&autopause=0"
                >
                  <img decoding="async" className="uael-video__thumb" src="/video-thumb.png" alt="" />
                  <div className="uael-video__play-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="72" height="72" aria-hidden="true">
                      <path
                        fill="currentColor"
                        d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm115.7 272l-176 101c-15.8 8.8-35.7-2.5-35.7-21V152c0-18.4 19.8-29.8 35.7-21l176 107c16.4 9.2 16.4 32.9 0 42z"
                      ></path>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Jobs band */}
      <div
        className="elementor-element elementor-element-b1ca1be e-flex e-con-boxed e-con e-parent"
        data-id="b1ca1be"
        data-element_type="container"
        id="jobs"
      >
        <div className="e-con-inner">
          <div
            className="elementor-element elementor-element-4693d91 elementor-align-center elementor-widget elementor-widget-image"
            data-id="4693d91"
            data-element_type="widget"
            data-widget_type="image.default"
          >
            <div className="elementor-widget-container">
              <img decoding="async" src="/Team.png" alt="" />
            </div>
          </div>
          <Heading anim="fadeInUp" id="1509635" cls="elementor-widget__width-initial elementor-widget-mobile__width-inherit" text={`'Want to be part of our team?'`} />
        </div>
      </div>

      {/* Working at RM Mangoes */}
      <div
        className="elementor-element elementor-element-03efca3 e-con-full e-flex e-con e-parent"
        data-id="03efca3"
        data-element_type="container"
      >
        <div className="elementor-element elementor-element-4642815 e-con-full e-flex e-con e-child" data-id="4642815" data-element_type="container">
          <IconBoxTitle mobileId="97d9f7a" desktopId="38e685d" title="Working at RM Mangoes" tag="h2" />
          <Text id="c9bd01c" cls="elementor-widget__width-initial elementor-widget-mobile__width-inherit">
            <p>
              We are ambitious and growing fast. During mango season we are always happy to hear from friendly,
              reliable people who want to join us.
              <br />
              No vacancies at the moment? Open applications are always welcome!
            </p>
          </Text>
          <Text id="292422c" cls="elementor-widget__width-initial elementor-widget-mobile__width-inherit">
            <p>&nbsp;</p>
            <p>
              Would you like to know more? Send an email to{" "}
              <a href={`mailto:${site.email}`} target="_blank" rel="noopener">
                <span style={{ color: "#ea580c" }}>{site.email}</span>
              </a>{" "}
              or call{" "}
              <span style={{ color: "#ea580c" }}>
                <a style={{ color: "#ea580c" }} href={`tel:${site.phoneTel}`} target="_blank" rel="noopener">
                  {site.phoneDisplay}
                </a>
              </span>
              .
            </p>
          </Text>
          <div
            className="elementor-element elementor-element-494e0a6 elementor-grid-3 elementor-grid-tablet-2 elementor-grid-mobile-1 elementor-widget elementor-widget-loop-grid"
            data-id="494e0a6"
            data-element_type="widget"
            data-widget_type="loop-grid.post"
          >
            <div className="elementor-widget-container">
              <div className="elementor-loop-container elementor-grid" role="list">
                <style
                  id="loop-9282"
                  dangerouslySetInnerHTML={{
                    __html:
                      '.elementor-9282 .elementor-element.elementor-element-ad25c9e{--display:flex;}.elementor-9282 .elementor-element.elementor-element-ad25c9e.e-con{--flex-grow:1;--flex-shrink:0;}.elementor-9282 .elementor-element.elementor-element-2ffe26b .elementor-button{background-color:var( --e-global-color-a75250b );font-family:"Avenir-Black", Sans-serif;text-transform:none;}.elementor-9282 .elementor-element.elementor-element-2ffe26b .elementor-button:hover, .elementor-9282 .elementor-element.elementor-element-2ffe26b .elementor-button:focus{background-color:var( --e-global-color-6e74cf7 );}@media(min-width:768px){.elementor-9282 .elementor-element.elementor-element-ad25c9e{--width:100%;}}@media(max-width:1024px) and (min-width:768px){.elementor-9282 .elementor-element.elementor-element-ad25c9e{--width:100%;}}@media(max-width:1024px){.elementor-9282 .elementor-element.elementor-element-ad25c9e.e-con{--flex-grow:1;--flex-shrink:0;}}@media(max-width:767px){.elementor-9282 .elementor-element.elementor-element-2ffe26b{width:100%;max-width:100%;}}',
                  }}
                />
                <div
                  data-elementor-type="loop-item"
                  data-elementor-id="9282"
                  className="elementor elementor-9282 e-loop-item ast-article-single"
                >
                  <div className="elementor-element elementor-element-ad25c9e e-con-full e-flex e-con e-parent" data-id="ad25c9e" data-element_type="container">
                    <div
                      className="elementor-element elementor-element-2ffe26b elementor-mobile-align-justify elementor-widget-mobile__width-inherit elementor-widget elementor-widget-button"
                      data-id="2ffe26b"
                      data-element_type="widget"
                      data-widget_type="button.default"
                    >
                      <div className="elementor-widget-container">
                        <div className="elementor-button-wrapper">
                          <a
                            className="elementor-button elementor-button-link elementor-size-sm"
                            href={`mailto:${site.email}?subject=${encodeURIComponent("Open application — RM Mangoes")}`}
                          >
                            <span className="elementor-button-content-wrapper">
                              <span className="elementor-button-text">Open application</span>
                            </span>
                          </a>
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
    </PageShell>
  );
}
