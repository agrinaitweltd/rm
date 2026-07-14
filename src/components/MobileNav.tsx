import { menuItems, NavItem } from "@/components/menu";

export default function MobileNav() {
  return (
    <div id="ast-mobile-popup-wrapper">
      <div id="ast-mobile-popup" className="ast-mobile-popup-drawer content-align-flex-start ast-mobile-popup-right">
        <div className="ast-mobile-popup-overlay"></div>
        <div className="ast-mobile-popup-inner">
          <div className="ast-mobile-popup-header">
            <button id="menu-toggle-close" className="menu-toggle-close" aria-label="Close menu">
              <span className="ast-svg-iconset">
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
            </button>
          </div>
          <div className="ast-mobile-popup-content">
            <div className="ast-builder-menu-mobile ast-builder-menu ast-builder-menu-mobile-focus-item ast-builder-layout-element site-header-focus-item" data-section="section-header-mobile-menu">
              <div className="ast-main-header-bar-alignment">
                <div className="main-header-bar-navigation">
                  <nav
                    className="site-navigation ast-flex-grow-1 navigation-accessibility site-header-focus-item"
                    id="ast-mobile-site-navigation"
                    aria-label="Site Navigation"
                    itemType="https://schema.org/SiteNavigationElement"
                    itemScope
                  >
                    <div className="main-navigation">
                      <ul
                        id="ast-hf-mobile-menu"
                        className="main-header-menu ast-nav-menu ast-flex submenu-with-border astra-menu-animation-fade stack-on-mobile"
                      >
                        {menuItems.map((item) => (
                          <NavItem key={item.href} item={item} />
                        ))}
                      </ul>
                    </div>
                  </nav>
                </div>
              </div>
            </div>
          </div>
          <div className="ast-desktop-popup-content"></div>
        </div>
      </div>
    </div>
  );
}
