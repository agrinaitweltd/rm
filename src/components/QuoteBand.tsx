/**
 * The coloured quote band used on the home page (mark + oversized quote).
 * Markup mirrors the original Elementor section (element ae43cae on the
 * home page) so the ported page CSS applies unchanged.
 */
export default function QuoteBand({
  quote,
  mark = "/infinite_opportunities.svg",
  sectionId = "ae43cae",
  imageId = "46275da",
  headingId = "fc13668",
}: {
  quote: string;
  mark?: string;
  sectionId?: string;
  imageId?: string;
  headingId?: string;
}) {
  return (
    <div
      className={`elementor-element elementor-element-${sectionId} e-flex e-con-boxed e-con e-parent`}
      data-id={sectionId}
      data-element_type="container"
    >
      <div className="e-con-inner">
        <div
          className={`elementor-element elementor-element-${imageId} elementor-widget elementor-widget-image elementor-invisible`}
          data-id={imageId}
          data-element_type="widget"
          data-settings='{"_animation":"zoomIn"}'
          data-widget_type="image.default"
        >
          <div className="elementor-widget-container">
            <img decoding="async" width={10} height={10} src={mark} className="attachment-full size-full" alt="" />
          </div>
        </div>
        <div
          className={`elementor-element elementor-element-${headingId} elementor-widget__width-initial elementor-widget-mobile__width-inherit elementor-widget elementor-widget-heading elementor-invisible`}
          data-id={headingId}
          data-element_type="widget"
          data-settings='{"_animation":"fadeInUp","_animation_delay":150}'
          data-widget_type="heading.default"
        >
          <div className="elementor-widget-container">
            <h2 className="elementor-heading-title elementor-size-default">{quote}</h2>
          </div>
        </div>
      </div>
    </div>
  );
}
