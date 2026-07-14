import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with RM Mangoes. Call or WhatsApp +44 0788080890, or email info@rmmangoes.co.uk. Delivering premium Pakistani mangoes throughout Scotland and Ireland.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <PageShell postId={6274}>
      {/* Contact details */}
      <div
        className="elementor-element elementor-element-b23117b e-flex e-con-boxed e-con e-parent"
        data-id="b23117b"
        data-element_type="container"
      >
        <div className="e-con-inner">
          <div
            className="elementor-element elementor-element-4007056 e-con-full e-flex e-con e-child"
            data-id="4007056"
            data-element_type="container"
          >
            <div
              className="elementor-element elementor-element-0790abe elementor-hidden-desktop elementor-hidden-tablet elementor-view-default elementor-position-block-start elementor-mobile-position-block-start elementor-widget elementor-widget-icon-box"
              data-id="0790abe"
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
                      <span>Contact</span>
                    </h1>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="elementor-element elementor-element-dd9bfd3 elementor-position-inline-start elementor-hidden-mobile elementor-view-default elementor-mobile-position-block-start elementor-widget elementor-widget-icon-box"
              data-id="dd9bfd3"
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
                      <span>Contact</span>
                    </h1>
                  </div>
                </div>
              </div>
            </div>
          <div
            className="elementor-element elementor-element-3cc7548 e-con-full e-flex e-con e-child"
            data-id="3cc7548"
            data-element_type="container"
          >
            <div
              className="elementor-element elementor-element-82777aa elementor-widget__width-initial elementor-widget-tablet__width-initial elementor-widget-mobile__width-inherit elementor-widget elementor-widget-text-editor elementor-invisible"
              data-id="82777aa"
              data-element_type="widget"
              data-settings='{"_animation":"fadeInUp"}'
              data-widget_type="text-editor.default"
            >
              <div className="elementor-widget-container">
                <p>
                  RM Mangoes
                  <br />
                  Delivering throughout
                  <br />
                  Scotland &amp; Ireland
                </p>
              </div>
            </div>
            <div
              className="elementor-element elementor-element-340d89c elementor-widget__width-initial elementor-widget-mobile__width-inherit elementor-icon-list--layout-traditional elementor-list-item-link-full_width elementor-widget elementor-widget-icon-list elementor-invisible"
              data-id="340d89c"
              data-element_type="widget"
              data-settings='{"_animation":"fadeInUp","_animation_delay":150}'
              data-widget_type="icon-list.default"
            >
              <div className="elementor-widget-container">
                <ul className="elementor-icon-list-items">
                  <li className="elementor-icon-list-item">
                    <a href={`tel:${site.phoneTel}`}>
                      <span className="elementor-icon-list-text">T {site.phoneDisplay}</span>
                    </a>
                  </li>
                  <li className="elementor-icon-list-item">
                    <a href={site.whatsapp} target="_blank" rel="noopener">
                      <span className="elementor-icon-list-text">WhatsApp {site.phoneDisplay}</span>
                    </a>
                  </li>
                  <li className="elementor-icon-list-item">
                    <a href={`mailto:${site.email}`}>
                      <span className="elementor-icon-list-text">E {site.email}</span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div
              className="elementor-element elementor-element-654824b elementor-widget__width-initial elementor-widget-tablet__width-initial elementor-widget-mobile__width-inherit elementor-widget elementor-widget-text-editor elementor-invisible"
              data-id="654824b"
              data-element_type="widget"
              data-settings='{"_animation":"fadeInUp","_animation_delay":300}'
              data-widget_type="text-editor.default"
            >
              <div className="elementor-widget-container">
                <p>
                  TikTok{" "}
                  <a href={site.tiktok} target="_blank" rel="noopener">
                    {site.tiktokHandle}
                  </a>
                </p>
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>

      {/* Quote band */}
      <div
        className="elementor-element elementor-element-7de2776 e-flex e-con-boxed e-con e-parent"
        data-id="7de2776"
        data-element_type="container"
        id="team"
      >
        <div className="e-con-inner">
          <div
            className="elementor-element elementor-element-b9a630c elementor-widget elementor-widget-image elementor-invisible"
            data-id="b9a630c"
            data-element_type="widget"
            data-settings='{"_animation":"zoomIn"}'
            data-widget_type="image.default"
          >
            <div className="elementor-widget-container">
              <img decoding="async" loading="lazy" width={187} height={127} src="/rm-contact-bubbles.png" alt="" />
            </div>
          </div>
          <div
            className="elementor-element elementor-element-3b182bc elementor-widget__width-initial elementor-widget-mobile__width-inherit elementor-widget elementor-widget-heading elementor-invisible"
            data-id="3b182bc"
            data-element_type="widget"
            data-settings='{"_animation":"fadeInUp","_animation_delay":150}'
            data-widget_type="heading.default"
          >
            <div className="elementor-widget-container">
              <p className="elementor-heading-title elementor-size-default">&lsquo;Part of the new conversation&rsquo;</p>
            </div>
          </div>
        </div>
      </div>

      {/* Our team */}
      <div
        className="elementor-element elementor-element-bd79b6d e-flex e-con-boxed e-con e-parent"
        data-id="bd79b6d"
        data-element_type="container"
      >
        <div className="e-con-inner">
          <div className="elementor-shape elementor-shape-top" aria-hidden="true" data-negative="false">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 10" preserveAspectRatio="none">
              <path className="elementor-shape-fill" d="M350,10L340,0h20L350,10z"></path>
            </svg>
          </div>
          <div
            className="elementor-element elementor-element-9eb7238 e-con-full dienst-accordion e-flex e-con e-child"
            data-id="9eb7238"
            data-element_type="container"
          >
            <div
              className="elementor-element elementor-element-d3a545e elementor-widget__width-initial elementor-widget elementor-widget-n-accordion elementor-invisible"
              data-id="d3a545e"
              data-element_type="widget"
              data-settings='{"_animation":"fadeInUp"}'
              data-widget_type="nested-accordion.default"
            >
              <div className="elementor-widget-container">
                <div className="e-n-accordion" aria-label="Accordion. Open links with Enter or Space, close with Escape, and navigate with Arrow Keys">
                  <details id="e-n-accordion-item-2210" className="e-n-accordion-item" open>
                    <summary
                      className="e-n-accordion-item-title"
                      data-accordion-index={1}
                      tabIndex={0}
                      aria-expanded="true"
                      aria-controls="e-n-accordion-item-2210"
                    >
                      <span className="e-n-accordion-item-title-header">
                        <h2 className="e-n-accordion-item-title-text">Our team</h2>
                      </span>
                      <span className="e-n-accordion-item-title-icon">
                        <span className="e-opened">
                          <svg xmlns="http://www.w3.org/2000/svg" id="pijl_d" viewBox="0 0 15.71 15.67">
                            <polygon strokeWidth={0} points="0 0 15.71 0 7.84 15.67 0 0"></polygon>
                          </svg>
                        </span>
                        <span className="e-closed">
                          <svg xmlns="http://www.w3.org/2000/svg" id="pijl" data-name="Laag 1" viewBox="0 0 15.67 15.71">
                            <polygon strokeWidth={0} points="0 15.71 0 0 15.67 7.87 0 15.71"></polygon>
                          </svg>
                        </span>
                      </span>
                    </summary>
                    <div
                      role="region"
                      aria-labelledby="e-n-accordion-item-2210"
                      className="elementor-element elementor-element-535d403 e-con-full e-flex e-con e-child"
                      data-id="535d403"
                      data-element_type="container"
                    >
                      <div
                        className="elementor-element elementor-element-061a810 elementor-grid-4 elementor-grid-tablet-2 elementor-grid-mobile-1 elementor-widget elementor-widget-loop-grid"
                        data-id="061a810"
                        data-element_type="widget"
                        data-widget_type="loop-grid.post"
                      >
                        <div className="elementor-widget-container">
                          <div className="elementor-loop-container elementor-grid" role="list">
                            <style
                              id="loop-7156"
                              dangerouslySetInnerHTML={{
                                __html:
                                  '.elementor-7156 .elementor-element.elementor-element-bd91fe4{--display:flex;}.elementor-7156 .elementor-element.elementor-element-39fab7e .jet-team-member__cover:before{background-color:#4F8D36E6;border-radius:50% 50% 50% 50%;}.elementor-7156 .elementor-element.elementor-element-39fab7e .jet-team-member__inner{border-radius:50% 50% 50% 50%;}.elementor-7156 .elementor-element.elementor-element-39fab7e .jet-team-member__image{border-radius:50% 50% 50% 50%;}.elementor-7156 .elementor-element.elementor-element-39fab7e .jet-team-member__figure{border-radius:50% 50% 50% 50%;}.elementor-7156 .elementor-element.elementor-element-39fab7e .jet-team-member__name .jet-team-member__name-first{color:var( --e-global-color-641d433 );font-family:"Avenir-Black", Sans-serif;font-size:2rem;line-height:1em;word-spacing:0em;}.elementor-7156 .elementor-element.elementor-element-39fab7e .jet-team-member__name .jet-team-member__name-last{color:var( --e-global-color-641d433 );font-size:2rem;}.elementor-7156 .elementor-element.elementor-element-39fab7e .jet-team-member__name{padding:20px 10px 0px 10px;margin:0px 0px 0px 0px;text-align:center;}.elementor-7156 .elementor-element.elementor-element-39fab7e .jet-team-member__position{color:var( --e-global-color-641d433 );font-family:"Avenir-Black", Sans-serif;font-size:1.6rem;margin:0px 0px -20px 0px;align-self:center;text-align:center;}.elementor-7156 .elementor-element.elementor-element-39fab7e .jet-team-member__desc{color:var( --e-global-color-641d433 );font-size:1.6rem;padding:15px 0px 0px 0px;align-self:center;text-align:center;}.elementor-7156 .elementor-element.elementor-element-39fab7e .jet-team-member__socials{align-self:center;}.elementor-7156 .elementor-element.elementor-element-39fab7e .jet-team-member__button-container{justify-content:center;}.elementor-7156 .elementor-element.elementor-element-39fab7e  .jet-team-member__button{font-size:1.3rem;}.elementor-7156 .elementor-element.elementor-element-39fab7e .jet-team-member__button{padding:0px 40px 25px 40px;}.elementor-7156 .elementor-element.elementor-element-39fab7e .jet-team-member__cover{justify-content:center;}@media(min-width:768px){.elementor-7156 .elementor-element.elementor-element-bd91fe4{--content-width:100%;}}',
                              }}
                            />
                            <div
                              data-elementor-type="loop-item"
                              data-elementor-id="7156"
                              className="elementor elementor-7156 e-loop-item ast-article-single"
                            >
                              <div
                                role="region"
                                aria-labelledby="e-n-accordion-item-2210"
                                className="elementor-element elementor-element-bd91fe4 e-flex e-con-boxed e-con e-parent"
                                data-id="bd91fe4"
                                data-element_type="container"
                              >
                                <div className="e-con-inner">
                                  <div
                                    className="elementor-element elementor-element-39fab7e elementor-widget elementor-widget-jet-team-member"
                                    data-id="39fab7e"
                                    data-element_type="widget"
                                    id="contact-links"
                                    data-widget_type="jet-team-member.default"
                                  >
                                    <div className="elementor-widget-container">
                                      <div className="elementor-jet-team-member jet-elements">
                                        <div className="jet-team-member jet-team-member--cover-hover">
                                          <div className="jet-team-member__inner">
                                            <div className="jet-team-member__image">
                                              <div className="jet-team-member__cover">
                                                <p className="jet-team-member__name">
                                                  <span className="jet-team-member__name-first">Mani Javid</span>
                                                </p>
                                                <div className="jet-team-member__position">
                                                  <span>Founder &amp; Director</span>
                                                </div>
                                                <p className="jet-team-member__desc">
                                                  <a href={`tel:${site.phoneTel}`}>{site.phoneDisplay}</a>
                                                  <br />
                                                  <a href={`mailto:${site.email}`}>{site.email}</a>
                                                </p>
                                              </div>
                                              <figure className="jet-team-member__figure">
                                                <img
                                                  decoding="async"
                                                  width={600}
                                                  height={600}
                                                  src="/mani.png"
                                                  className="jet-team-member__img-tag"
                                                  alt="Mani Javid"
                                                />
                                              </figure>
                                            </div>
                                            <div className="jet-team-member__content">
                                              <div className="jet-team-member__socials"></div>
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
                    </div>
                  </details>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
