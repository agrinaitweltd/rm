import Link from "next/link";
import { site } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="site-footer" id="colophon" itemType="https://schema.org/WPFooter" itemScope itemID="#colophon">
      <div
        className="site-primary-footer-wrap ast-builder-grid-row-container site-footer-focus-item ast-builder-grid-row-4-lheavy ast-builder-grid-row-tablet-full ast-builder-grid-row-mobile-full ast-footer-row-stack ast-footer-row-tablet-stack ast-footer-row-mobile-stack"
        data-section="section-primary-footer-builder"
      >
        <div className="ast-builder-grid-row-container-inner">
          <div className="ast-builder-footer-grid-columns site-primary-footer-inner-wrap ast-builder-grid-row">
            <div className="site-footer-primary-section-1 site-footer-section site-footer-section-1">
              <aside
                className="footer-widget-area widget-area site-footer-focus-item footer-widget-area-inner"
                data-section="sidebar-widgets-footer-widget-1"
                aria-label="Footer Widget 1"
                role="region"
              >
                <section id="text-3" className="widget widget_text">
                  <h3 className="widget-title">About RM Mangoes</h3>
                  <div className="textwidget">
                    <p>
                      RM Mangoes imports premium Pakistani mangoes directly from Pakistan. We deliver fresh, hand-picked
                      mango boxes to doorsteps throughout Scotland and Ireland — from Pakistani farms to Scottish &amp;
                      Irish doorsteps.
                    </p>
                  </div>
                </section>
              </aside>
            </div>
            <div className="site-footer-primary-section-2 site-footer-section site-footer-section-2">
              <aside
                className="footer-widget-area widget-area site-footer-focus-item footer-widget-area-inner"
                data-section="sidebar-widgets-footer-widget-4"
                aria-label="Footer Widget 4"
                role="region"
              >
                <section id="text-8" className="widget widget_text">
                  <h3 className="widget-title">Contact</h3>
                  <div className="textwidget">
                    <p>
                      Delivering throughout
                      <br />
                      Scotland &amp; Ireland
                    </p>
                    <p>
                      T: <a href={`tel:${site.phoneTel}`}>{site.phoneDisplay}</a>
                      <br />
                      W: <a href={site.whatsapp} target="_blank" rel="noopener">WhatsApp us</a>
                      <br />
                      E: <a href={`mailto:${site.email}`}>{site.email}</a>
                    </p>
                  </div>
                </section>
              </aside>
            </div>
            <div className="site-footer-primary-section-3 site-footer-section site-footer-section-3">
              <aside
                className="footer-widget-area widget-area site-footer-focus-item footer-widget-area-inner"
                data-section="sidebar-widgets-footer-widget-2"
                aria-label="Footer Widget 2"
                role="region"
              >
                <section id="nav_menu-3" className="widget widget_nav_menu">
                  <h3 className="widget-title">Service</h3>
                  <nav className="menu-service-footer-menu-container" aria-label="Service">
                    <ul id="menu-service-footer-menu" className="menu">
                      <li className="menu-item menu-item-type-custom menu-item-object-custom">
                        <Link href="/contact" className="menu-link">Contact our team</Link>
                      </li>
                      <li className="menu-item menu-item-type-custom menu-item-object-custom">
                        <Link href="/products" className="menu-link">Our mangoes</Link>
                      </li>
                      <li className="menu-item menu-item-type-custom menu-item-object-custom">
                        <Link href="/about" className="menu-link">About us</Link>
                      </li>
                    </ul>
                  </nav>
                </section>
              </aside>
            </div>
            <div className="site-footer-primary-section-4 site-footer-section site-footer-section-4">
              <aside
                role="region"
                className="footer-widget-area widget-area site-footer-focus-item footer-widget-area-inner"
                data-section="sidebar-widgets-footer-widget-5"
              >
                <section id="elementor-library-8" className="widget widget_elementor-library">
                  <h3 className="widget-title">Follow us</h3>
                  <div data-elementor-type="container" data-elementor-id="12111" className="elementor elementor-12111">
                    <div
                      className="elementor-element elementor-element-fa92b97 e-con-full e-flex e-con e-parent"
                      data-id="fa92b97"
                      data-element_type="container"
                    >
                      <div
                        className="elementor-element elementor-element-9778743 elementor-widget__width-initial elementor-view-default elementor-widget elementor-widget-icon"
                        data-id="9778743"
                        data-element_type="widget"
                        data-widget_type="icon.default"
                      >
                        <div className="elementor-widget-container">
                          <div className="elementor-icon-wrapper">
                            <a className="elementor-icon" href={site.tiktok} target="_blank" rel="noopener" aria-label={`TikTok ${site.tiktokHandle}`}>
                              {/* TikTok */}
                              <svg xmlns="http://www.w3.org/2000/svg" height="512pt" viewBox="0 0 512 512" width="512pt" fillRule="evenodd">
                                <path fillRule="evenodd" d="M256 0C114.637 0 0 114.637 0 256s114.637 256 256 256 256-114.637 256-256S397.363 0 256 0zm121.9 224.688a94.474 94.474 0 0 1-54.75-17.531v79.874c0 39.887-32.332 72.219-72.219 72.219-39.883 0-72.215-32.332-72.215-72.219 0-39.883 32.332-72.215 72.215-72.215 3.34 0 6.62.242 9.84.668v40.156a32.72 32.72 0 0 0-9.84-1.523c-18.13 0-32.914 14.789-32.914 32.914 0 18.13 14.785 32.918 32.914 32.918 18.13 0 32.918-14.789 32.918-32.918V119.25h39.301c0 1.762.156 3.488.418 5.184a55.05 55.05 0 0 0 24.36 36.12 54.665 54.665 0 0 0 29.972 8.966zm0 0" />
                              </svg>
                            </a>
                          </div>
                        </div>
                      </div>
                      <div
                        className="elementor-element elementor-element-2787349 elementor-widget__width-initial elementor-view-default elementor-widget elementor-widget-icon"
                        data-id="2787349"
                        data-element_type="widget"
                        data-widget_type="icon.default"
                      >
                        <div className="elementor-widget-container">
                          <div className="elementor-icon-wrapper">
                            <a className="elementor-icon" href={site.whatsapp} target="_blank" rel="noopener" aria-label="WhatsApp">
                              {/* WhatsApp */}
                              <svg xmlns="http://www.w3.org/2000/svg" height="512pt" viewBox="0 0 512 512" width="512pt" fillRule="evenodd">
                                <path fillRule="evenodd" d="M256 0C114.637 0 0 114.637 0 256c0 45.727 12.004 90.18 34.813 129.328L1.109 496.062a15.998 15.998 0 0 0 19.687 19.622l115.766-32.985C174.156 504.406 214.699 512 256 512c141.363 0 256-114.637 256-256S397.363 0 256 0zm128.941 350.902c-5.984 16.485-30.09 30.196-48.132 32.516-12.286 1.586-27.688 2.86-80.371-17.281-59.782-24.797-121.31-88.078-125.848-92.594-4.379-4.512-24.36-27.309-24.36-52.09 0-24.785 12.66-36.863 17.782-42.066 4.21-4.278 11.156-6.235 17.797-6.235 2.148 0 4.082.11 5.82.196 5.11.218 7.672.523 11.04 8.578 4.19 10.05 14.398 34.836 15.612 37.398 1.239 2.567 2.477 6.043 0.735 9.844-1.633 3.93-3.07 5.672-5.633 8.617-2.566 2.946-5 5.196-7.566 8.36-2.348 2.754-5 5.703-2.043 10.8 2.953 4.985 13.16 21.62 28.187 34.973 19.391 17.235 35.114 22.742 40.735 25.086 4.187 1.734 9.18 1.324 12.242-1.93 3.887-4.19 8.684-11.128 13.57-17.96 3.477-4.903 7.868-5.512 12.473-3.777 4.692 1.628 29.559 13.906 34.664 16.44 5.106 2.552 8.469 3.767 9.707 5.919 1.219 2.148 1.219 12.254-4.55 25.984zm0 0" />
                              </svg>
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </aside>
            </div>
          </div>
        </div>
      </div>
      <div
        className="site-below-footer-wrap ast-builder-grid-row-container site-footer-focus-item ast-builder-grid-row-full ast-builder-grid-row-tablet-full ast-builder-grid-row-mobile-full ast-footer-row-inline ast-footer-row-tablet-inline ast-footer-row-mobile-stack"
        data-section="section-below-footer-builder"
      >
        <div className="ast-builder-grid-row-container-inner">
          <div className="ast-builder-footer-grid-columns site-below-footer-inner-wrap ast-builder-grid-row">
            <div className="site-footer-below-section-1 site-footer-section site-footer-section-1">
              <div
                className="ast-builder-layout-element ast-flex site-footer-focus-item ast-footer-copyright"
                data-section="section-footer-builder"
              >
                <div className="ast-footer-copyright">
                  <p>
                    Copyright © {new Date().getFullYear()} RM Mangoes. Made &amp; Designed By{" "}
                    <a href={site.madeByUrl} target="_blank" rel="noopener">
                      {site.madeBy}
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
