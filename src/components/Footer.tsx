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
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em">
                                <path
                                  fill="currentColor"
                                  d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"
                                />
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
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em">
                                <path
                                  fill="currentColor"
                                  d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"
                                />
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
