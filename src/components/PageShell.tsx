/**
 * Replicates the Astra theme's page scaffolding
 * (#content > .ast-container > #primary > main > article > .entry-content)
 * so the ported theme CSS applies exactly as on the original site.
 */
export default function PageShell({
  postId,
  children,
}: {
  postId: number;
  children: React.ReactNode;
}) {
  return (
    <div id="content" className="site-content">
      <div className="ast-container">
        <div id="primary" className="content-area primary">
          <main id="main" className="site-main">
            <article
              className={`post-${postId} page type-page status-publish ast-article-single`}
              id={`post-${postId}`}
              itemType="https://schema.org/CreativeWork"
              itemScope
            >
              <header className="entry-header ast-no-title ast-header-without-markup"></header>
              <div className="entry-content clear" itemProp="text">
                <div
                  data-elementor-type="wp-page"
                  data-elementor-id={postId}
                  className={`elementor elementor-${postId}`}
                  data-elementor-post-type="page"
                >
                  {children}
                </div>
              </div>
            </article>
          </main>
        </div>
      </div>
    </div>
  );
}
