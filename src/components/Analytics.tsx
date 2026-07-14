import Script from "next/script";
import { site } from "@/lib/site";

/**
 * Google Analytics 4. Renders nothing unless a Measurement ID is set.
 * Add your ID in src/lib/site.ts (`gaId`) or as NEXT_PUBLIC_GA_ID.
 */
export default function Analytics() {
  if (!site.gaId) return null;
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${site.gaId}`} strategy="afterInteractive" />
      <Script id="ga4" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${site.gaId}');
        `}
      </Script>
    </>
  );
}
