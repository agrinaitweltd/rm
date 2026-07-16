import type { Metadata, Viewport } from "next";
import Script from "next/script";
import Header from "@/components/Header";
import MobileNav from "@/components/MobileNav";
import Footer from "@/components/Footer";
import CookieConsent from "@/components/CookieConsent";
import SiteBehaviors from "@/components/SiteBehaviors";
import Analytics from "@/components/Analytics";
import { CartProvider } from "@/components/cart/CartProvider";
import CartWidget from "@/components/cart/CartWidget";
import SiteChrome from "@/components/SiteChrome";
import RecaptchaLoader from "@/components/RecaptchaLoader";
import { site } from "@/lib/site";

// Ported stylesheets from the original theme, in the original cascade order.
import "@/styles/01-base-inline.css";
import "@/styles/02-astra-theme.css";
import "@/styles/03-astra-theme-inline.css";
import "@/styles/04-wp-inline.css";
import "@/styles/05-astra-addon.css";
import "@/styles/06-astra-addon-inline.css";
import "@/styles/07-elementor-frontend.css";
import "@/styles/08-widget-heading.css";
import "@/styles/09-elementor-kit.css";
import "@/styles/10-widget-icon-box.css";
import "@/styles/11-widget-icon-list.css";
import "@/styles/12-widget-image.css";
import "@/styles/13-shapes.css";
import "@/styles/14-page-home.css";
import "@/styles/15-page-products.css";
import "@/styles/16-page-about.css";
import "@/styles/17-page-contact.css";
import "@/styles/19-custom-inline.css";
import "@/styles/20-page-footer.css";
import "@/styles/21-jet-unfold.css";
import "@/styles/23-swiper.css";
import "@/styles/24-widget-nested-carousel.css";
import "@/styles/25-widget-nested-tabs.css";
import "@/styles/26-widget-nested-accordion.css";
import "@/styles/27-widget-loop.css";
import "@/styles/28-page-chain.css";
import "@/styles/29-uael-extract.css";
import "@/styles/30-jet-team-member.css";
import "@/styles/31-animations.css";
import "@/styles/22-rm-custom.css";
import "@/styles/32-cart.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "RM Mangoes — Premium Pakistani Mangoes | Scotland",
    template: "%s | RM Mangoes",
  },
  description:
    "RM Mangoes imports premium Pakistani mangoes directly from Pakistan and delivers throughout Scotland. From Pakistani farms to Scottish doorsteps.",
  keywords: ["Pakistani mangoes", "mango delivery", "Scotland", "premium mangoes", "mango box", "fresh fruit delivery"],
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: site.url,
    siteName: site.name,
    title: "RM Mangoes — Premium Pakistani Mangoes",
    description: "From Pakistani Farms to Scottish Doorsteps. Order your box of premium Pakistani mangoes.",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "RM Mangoes" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "RM Mangoes — Premium Pakistani Mangoes",
    description: "From Pakistani Farms to Scottish Doorsteps.",
    images: ["/og.png"],
  },
  icons: { icon: "/icon-fav.png" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

const bodyClass =
  "page wp-custom-logo wp-embed-responsive ast-page-builder-template ast-no-sidebar astra-4.13.3 ast-single-post " +
  "ast-inherit-site-logo-transparent ast-hfb-header ast-full-width-layout ast-sticky-main-shrink ast-sticky-header-shrink " +
  "ast-inherit-site-logo-sticky ast-primary-sticky-enabled elementor-default elementor-kit-5 elementor-page astra-addon-4.13.5";

// Config globals expected by the Astra theme scripts (values ported from the original site).
const astraGlobal = {
  break_point: "921",
  isRtl: "",
  is_scroll_to_id: "1",
  is_scroll_to_top: "",
  is_header_footer_builder_active: "1",
  responsive_cart_click: "flyout",
  is_dark_palette: "",
  revealEffectEnable: "",
  edit_post_url: "",
  ajax_url: "",
  infinite_count: "2",
  infinite_total: "0",
  pagination: "number",
  infinite_scroll_event: "scroll",
  no_more_post_message: "No more posts to show.",
  grid_layout: { desktop: 3, tablet: 1, mobile: 1 },
  site_url: "",
  blogArchiveTitleLayout: "layout-2",
  blogArchiveTitleOn: "1",
  show_comments: "Show Comments",
  enableHistoryPushState: "1",
  masonryEnabled: "",
  blogMasonryBreakPoint: "0",
};

const astraAddonGlobal = {
  is_elementor_active: "1",
  sticky_active: "1",
  svgIconClose:
    '<span class="ast-icon icon-close"><svg viewBox="0 0 512 512" aria-hidden="true" role="img" version="1.1" xmlns="http://www.w3.org/2000/svg" width="18px" height="18px"><path d="M71.029 71.029c9.373-9.372 24.569-9.372 33.942 0L256 222.059l151.029-151.03c9.373-9.372 24.569-9.372 33.942 0 9.372 9.373 9.372 24.569 0 33.942L289.941 256l151.03 151.029c9.372 9.373 9.372 24.569 0 33.942-9.373 9.372-24.569 9.372-33.942 0L256 289.941l-151.029 151.03c-9.373 9.372-24.569 9.372-33.942 0-9.372-9.373-9.372-24.569 0-33.942L222.059 256 71.029 104.971c-9.372-9.373-9.372-24.569 0-33.942z" /></svg></span>',
  hf_account_show_menu_on: "hover",
  hf_account_action_type: "link",
  hf_account_logout_action: "link",
  header_main_stick: "1",
  header_above_stick: "0",
  header_below_stick: "0",
  stick_header_meta: "",
  header_main_stick_meta: "",
  header_above_stick_meta: "",
  header_below_stick_meta: "",
  sticky_header_on_devices: "both",
  sticky_header_style: "none",
  sticky_hide_on_scroll: "0",
  break_point: "921",
  tablet_break_point: "921",
  mobile_break_point: "544",
  header_main_shrink: "1",
  header_animation_effect: "none",
  header_logo_width: "",
  responsive_header_logo_width: {
    desktop: 70,
    tablet: "",
    mobile: 50,
    "desktop-svg-height": 52,
    "mobile-svg-height": 50,
  },
  stick_origin_position: "",
  site_layout: "ast-full-width-layout",
  site_content_width: "1270",
  site_layout_padded_width: "1200",
  site_layout_box_width: "1200",
  header_builder_active: "1",
  component_limit: "10",
  is_header_builder_active: "1",
};

const astraConfig = `var astra = ${JSON.stringify(astraGlobal)};\nvar astraAddon = ${JSON.stringify(astraAddonGlobal)};`;

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: site.name,
  url: site.url,
  logo: `${site.url}/logo-2.png`,
  slogan: site.slogan,
  email: site.email,
  telephone: site.phoneDisplay,
  sameAs: [site.tiktok],
  areaServed: ["Scotland"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB">
      <head>
        <link
          rel="preload"
          href="/fonts/FilsonPro-Book.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/FilsonPro-Black.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </head>
      {/* Astra's script adjusts body classes (ast-desktop, breakpoints) before hydration */}
      <body className={bodyClass} suppressHydrationWarning>
        <Script id="astra-config" strategy="beforeInteractive">
          {astraConfig}
        </Script>
        <Script src="/js/astra-frontend.min.js" strategy="beforeInteractive" />
        <Script src="/js/astra-addon.min.js" strategy="beforeInteractive" />
        <Script src="/js/swiper.min.js" strategy="beforeInteractive" />
        <a className="skip-link screen-reader-text" href="#content" title="Skip to content">
          Skip to content
        </a>
        <CartProvider>
          <SiteChrome
            header={<Header />}
            mobileNav={<MobileNav />}
            footer={<Footer />}
            cart={<CartWidget />}
          >
            {children}
          </SiteChrome>
        </CartProvider>
        <SiteBehaviors />
        <RecaptchaLoader />
        <CookieConsent />
        <Analytics />
      </body>
    </html>
  );
}
