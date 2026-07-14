/**
 * Small helpers that emit the exact Elementor markup patterns used across
 * the site, so the ported theme CSS applies unchanged.
 */
import Link from "next/link";

export const ShapeTop = () => (
  <div className="elementor-shape elementor-shape-top" aria-hidden="true" data-negative="false">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 10" preserveAspectRatio="none">
      <path className="elementor-shape-fill" d="M350,10L340,0h20L350,10z"></path>
    </svg>
  </div>
);

export const ShapeBottom = () => (
  <div className="elementor-shape elementor-shape-bottom" aria-hidden="true" data-negative="false">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 10" preserveAspectRatio="none">
      <path className="elementor-shape-fill" d="M350,10L340,0h20L350,10z"></path>
    </svg>
  </div>
);

export const Heading = ({
  id,
  text,
  tag = "h2",
  cls = "elementor-widget__width-inherit",
}: {
  id: string;
  text: string;
  tag?: "h1" | "h2" | "h3" | "p";
  cls?: string;
}) => {
  const Tag = tag;
  return (
    <div
      className={`elementor-element elementor-element-${id} ${cls} elementor-widget elementor-widget-heading`}
      data-id={id}
      data-element_type="widget"
      data-widget_type="heading.default"
    >
      <div className="elementor-widget-container">
        <Tag className="elementor-heading-title elementor-size-default">{text}</Tag>
      </div>
    </div>
  );
};

export const Text = ({ id, cls = "", children }: { id: string; cls?: string; children: React.ReactNode }) => (
  <div
    className={`elementor-element elementor-element-${id} ${cls} elementor-widget elementor-widget-text-editor`}
    data-id={id}
    data-element_type="widget"
    data-widget_type="text-editor.default"
  >
    <div className="elementor-widget-container">{children}</div>
  </div>
);

export const Button = ({
  id,
  text,
  href,
  external,
  cls = "",
}: {
  id: string;
  text: string;
  href: string;
  external?: boolean;
  cls?: string;
}) => (
  <div
    className={`elementor-element elementor-element-${id} ${cls} elementor-widget elementor-widget-button`}
    data-id={id}
    data-element_type="widget"
    data-widget_type="button.default"
  >
    <div className="elementor-widget-container">
      <div className="elementor-button-wrapper">
        {external ? (
          <a className="elementor-button elementor-button-link elementor-size-sm" href={href} target="_blank" rel="noopener">
            <span className="elementor-button-content-wrapper">
              <span className="elementor-button-text">{text}</span>
            </span>
          </a>
        ) : (
          <Link className="elementor-button elementor-button-link elementor-size-sm" href={href}>
            <span className="elementor-button-content-wrapper">
              <span className="elementor-button-text">{text}</span>
            </span>
          </Link>
        )}
      </div>
    </div>
  </div>
);

export const Image = ({
  id,
  src,
  cls = "",
  alt = "",
  width,
  height,
  hoverScale,
  href,
  external,
}: {
  id: string;
  src: string;
  cls?: string;
  alt?: string;
  width?: number;
  height?: number;
  hoverScale?: boolean;
  href?: string;
  external?: boolean;
}) => {
  const img = <img decoding="async" src={src} alt={alt} width={width} height={height} loading="lazy" />;
  return (
    <div
      className={`elementor-element elementor-element-${id}${hoverScale ? " e-transform" : ""} ${cls} elementor-widget elementor-widget-image`}
      data-id={id}
      data-element_type="widget"
      {...(hoverScale
        ? { "data-settings": '{"_transform_scale_effect_hover":{"unit":"px","size":1.1,"sizes":[]}}' }
        : {})}
      data-widget_type="image.default"
    >
      <div className="elementor-widget-container">
        {href ? (
          external ? (
            <a href={href} target="_blank" rel="noopener">
              {img}
            </a>
          ) : (
            <Link href={href}>{img}</Link>
          )
        ) : (
          img
        )}
      </div>
    </div>
  );
};

export const IconBoxTitle = ({
  mobileId,
  desktopId,
  title,
  tag = "h1",
}: {
  mobileId: string;
  desktopId: string;
  title: string;
  tag?: "h1" | "h2";
}) => {
  const Tag = tag;
  return (
    <>
      <div
        className={`elementor-element elementor-element-${mobileId} elementor-hidden-desktop elementor-hidden-tablet elementor-view-default elementor-position-block-start elementor-mobile-position-block-start elementor-widget elementor-widget-icon-box`}
        data-id={mobileId}
        data-element_type="widget"
        data-widget_type="icon-box.default"
      >
        <div className="elementor-widget-container">
          <div className="elementor-icon-box-wrapper">
            <div className="elementor-icon-box-icon">
              <span className="elementor-icon">
                <svg xmlns="http://www.w3.org/2000/svg" id="pijl_d" viewBox="0 0 15.71 15.67">
                  <polygon strokeWidth={0} points="0 0 15.71 0 7.84 15.67 0 0"></polygon>
                </svg>
              </span>
            </div>
            <div className="elementor-icon-box-content">
              <Tag className="elementor-icon-box-title">
                <span>{title}</span>
              </Tag>
            </div>
          </div>
        </div>
      </div>
      <div
        className={`elementor-element elementor-element-${desktopId} elementor-position-inline-start elementor-hidden-mobile elementor-view-default elementor-mobile-position-block-start elementor-widget elementor-widget-icon-box`}
        data-id={desktopId}
        data-element_type="widget"
        data-widget_type="icon-box.default"
      >
        <div className="elementor-widget-container">
          <div className="elementor-icon-box-wrapper">
            <div className="elementor-icon-box-icon">
              <span className="elementor-icon">
                <svg xmlns="http://www.w3.org/2000/svg" id="pijl" data-name="Laag 1" viewBox="0 0 15.67 15.71">
                  <polygon strokeWidth={0} points="0 15.71 0 0 15.67 7.87 0 15.71"></polygon>
                </svg>
              </span>
            </div>
            <div className="elementor-icon-box-content">
              <Tag className="elementor-icon-box-title">
                <span>{title}</span>
              </Tag>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export const SwiperArrows = () => (
  <>
    <div className="elementor-swiper-button elementor-swiper-button-prev" role="button" tabIndex={0} aria-label="Previous">
      <svg xmlns="http://www.w3.org/2000/svg" id="a" viewBox="0 0 15.67 15.71">
        <polygon strokeWidth={0} points="0 7.87 15.67 0 15.67 15.71 0 7.87"></polygon>
      </svg>
    </div>
    <div className="elementor-swiper-button elementor-swiper-button-next" role="button" tabIndex={0} aria-label="Next">
      <svg xmlns="http://www.w3.org/2000/svg" id="a" data-name="Laag 1" viewBox="0 0 15.67 15.71">
        <polygon strokeWidth={0} points="0 15.71 0 0 15.67 7.87 0 15.71"></polygon>
      </svg>
    </div>
  </>
);
