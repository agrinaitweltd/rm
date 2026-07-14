import Link from "next/link";
import { menuItems, NavItem } from "@/components/menu";

function SiteLogo() {
  return (
    <div className="site-branding ast-site-identity" itemType="https://schema.org/Organization" itemScope>
      <span className="site-logo-img">
        <Link href="/" className="custom-logo-link" rel="home">
          <img
            width={70}
            height={61}
            src="/logo-2-70x61.png"
            className="custom-logo"
            alt="RM Mangoes"
            decoding="async"
            srcSet="/logo-2-70x61.png 70w, /logo-2.png 189w"
            sizes="(max-width: 70px) 100vw, 70px"
          />
        </Link>
      </span>
    </div>
  );
}

export function MainMenu({ menuId }: { menuId: string }) {
  return (
    <ul id={menuId} className="main-header-menu ast-menu-shadow ast-nav-menu ast-flex submenu-with-border stack-on-mobile">
      {menuItems.map((item) => (
        <NavItem key={item.href} item={item} />
      ))}
    </ul>
  );
}

export default function Header() {
  return (
    <header
      className="site-header header-main-layout-1 ast-primary-menu-enabled ast-logo-title-inline ast-hide-custom-menu-mobile ast-builder-menu-toggle-link ast-mobile-header-inline"
      id="masthead"
      itemType="https://schema.org/WPHeader"
      itemScope
      itemID="#masthead"
    >
      <div id="ast-desktop-header" data-toggle-type="off-canvas">
        <div className="ast-main-header-wrap main-header-bar-wrap">
          <div
            className="ast-primary-header-bar ast-primary-header main-header-bar site-header-focus-item"
            data-section="section-primary-header-builder"
          >
            <div
              className="site-primary-header-wrap ast-builder-grid-row-container site-header-focus-item ast-container"
              data-section="section-primary-header-builder"
            >
              <div className="ast-builder-grid-row ast-builder-grid-row-has-sides ast-builder-grid-row-no-center">
                <div className="site-header-primary-section-left site-header-section ast-flex site-header-section-left">
                  <div className="ast-builder-layout-element ast-flex site-header-focus-item" data-section="title_tagline">
                    <SiteLogo />
                  </div>
                </div>
                <div className="site-header-primary-section-right site-header-section ast-flex ast-grid-right-section">
                  <div
                    className="ast-builder-menu-1 ast-builder-menu ast-flex ast-builder-menu-1-focus-item ast-builder-layout-element site-header-focus-item"
                    data-section="section-hb-menu-1"
                  >
                    <div className="ast-main-header-bar-alignment">
                      <div className="main-header-bar-navigation">
                        <nav
                          className="site-navigation ast-flex-grow-1 navigation-accessibility site-header-focus-item"
                          id="primary-site-navigation-desktop"
                          aria-label="Primary Site Navigation"
                          itemType="https://schema.org/SiteNavigationElement"
                          itemScope
                        >
                          <div className="main-navigation ast-inline-flex">
                            <MainMenu menuId="ast-hf-menu-1" />
                          </div>
                        </nav>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div id="ast-mobile-header" className="ast-mobile-header-wrap" data-type="off-canvas">
          <div className="ast-main-header-wrap main-header-bar-wrap">
            <div
              className="ast-primary-header-bar ast-primary-header main-header-bar site-primary-header-wrap site-header-focus-item ast-builder-grid-row-layout-default ast-builder-grid-row-tablet-layout-default ast-builder-grid-row-mobile-layout-default"
              data-section="section-primary-header-builder"
            >
              <div className="ast-builder-grid-row ast-builder-grid-row-has-sides ast-builder-grid-row-no-center">
                <div className="site-header-primary-section-left site-header-section ast-flex site-header-section-left">
                  <div className="ast-builder-layout-element ast-flex site-header-focus-item" data-section="title_tagline">
                    <SiteLogo />
                  </div>
                </div>
                <div className="site-header-primary-section-right site-header-section ast-flex ast-grid-right-section">
                  <div
                    className="ast-builder-layout-element ast-flex site-header-focus-item"
                    data-section="section-header-mobile-trigger"
                  >
                    <div className="ast-button-wrap">
                      <button
                        type="button"
                        className="menu-toggle main-header-menu-toggle ast-mobile-menu-trigger-fill"
                        aria-expanded="false"
                        aria-label="Main menu toggle"
                      >
                        <span className="mobile-menu-toggle-icon">
                          <span aria-hidden="true" className="ahfb-svg-iconset ast-inline-flex svg-baseline">
                            <svg
                              className="ast-mobile-svg ast-menu-svg"
                              fill="currentColor"
                              version="1.1"
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                            >
                              <path d="M3 13h18c0.552 0 1-0.448 1-1s-0.448-1-1-1h-18c-0.552 0-1 0.448-1 1s0.448 1 1 1zM3 7h18c0.552 0 1-0.448 1-1s-0.448-1-1-1h-18c-0.552 0-1 0.448-1 1s0.448 1 1 1zM3 19h18c0.552 0 1-0.448 1-1s-0.448-1-1-1h-18c-0.552 0-1 0.448-1 1s0.448 1 1 1z"></path>
                            </svg>
                          </span>
                          <span aria-hidden="true" className="ahfb-svg-iconset ast-inline-flex svg-baseline">
                            <svg
                              className="ast-mobile-svg ast-close-svg"
                              fill="currentColor"
                              version="1.1"
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                            >
                              <path d="M5.293 6.707l5.293 5.293-5.293 5.293c-0.391 0.391-0.391 1.024 0 1.414s1.024 0.391 1.414 0l5.293-5.293 5.293 5.293c0.391 0.391 1.024 0.391 1.414 0s0.391-1.024 0-1.414l-5.293-5.293 5.293-5.293c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0l-5.293 5.293-5.293-5.293c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414z"></path>
                            </svg>
                          </span>
                        </span>
                        <span className="mobile-menu-wrap">
                          <span className="mobile-menu">menu</span>
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    </header>
  );
}
