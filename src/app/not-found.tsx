import Link from "next/link";
import PageShell from "@/components/PageShell";

export default function NotFound() {
  return (
    <PageShell postId={5298}>
      <div
        className="elementor-element elementor-element-d6049e6 e-flex e-con-boxed e-con e-parent"
        data-id="d6049e6"
        data-element_type="container"
      >
        <div className="e-con-inner">
          <div
            className="elementor-element elementor-element-a94310a e-con-full e-flex e-con e-child"
            data-id="a94310a"
            data-element_type="container"
          >
            <div
              className="elementor-element elementor-element-9664a1d elementor-widget elementor-widget-heading"
              data-id="9664a1d"
              data-element_type="widget"
              data-widget_type="heading.default"
            >
              <div className="elementor-widget-container">
                <h1 className="elementor-heading-title elementor-size-default">Page not found</h1>
              </div>
            </div>
            <div
              className="elementor-element elementor-element-205af03 elementor-widget elementor-widget-text-editor"
              data-id="205af03"
              data-element_type="widget"
              data-widget_type="text-editor.default"
            >
              <div className="elementor-widget-container">
                <p>
                  <strong>Sorry, we couldn&rsquo;t find that page.</strong>
                </p>
                <p>
                  Head back to the <Link href="/">home page</Link> or browse{" "}
                  <Link href="/products">our mangoes</Link>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
