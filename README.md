# RM Mangoes

Premium Pakistani mangoes, delivered throughout Scotland & Ireland.
**From Pakistani Farms to Scottish & Irish Doorsteps.**

Next.js + React + TypeScript (App Router). Faithful rebrand of the original
Olympic Fruit design — same layout, typography, colours and effects, with
RM Mangoes branding and content.

## Getting started

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build (Vercel-ready)
```

## Pages

| Route        | Purpose                                                              |
| ------------ | -------------------------------------------------------------------- |
| `/`          | Home — hero, intro, quick links                                       |
| `/products`  | Premium Pakistani Mangoes — boxes & prices                            |
| `/the-chain` | The chain — consumer, growers, quality, varieties, logistics, clients |
| `/about`     | About RM Mangoes — story, network, history, mission, values, jobs     |
| `/contact`   | Contact — phone, WhatsApp, email, TikTok, team                        |

The history timeline milestones (2023–2026) and the team profile are
placeholders — regenerate or replace `timeline-horizontal.png`,
`timeline-vertical.png` and `team-avatar.png` with the real story.

## Project layout

- `src/app/` — App Router pages, metadata, sitemap and robots.
- `src/components/` — Header, Footer, MobileNav, PageShell, QuoteBand,
  CookieConsent (GDPR popup) and SiteBehaviors (read-more toggles).
- `src/styles/` — the original theme CSS, ported in cascade order
  (`01-…` to `22-…`). `22-rm-custom.css` is the only new stylesheet.
- `src/lib/site.ts` — contact details, links and product data. **Edit
  prices or contact details here.**
- `public/` — every image lives flat in this folder (replace freely, keep
  the filenames). Fonts in `public/fonts`, theme scripts in `public/js`.

## Replacing images

Drop your own files over these placeholders (same names):

- `logo-2.png`, `logo-2-70x61.png` — header logo
- `rm-mangoes-hero-logo.png` — hero logo + slogan
- `mango-box-small.png`, `mango-box-medium.png`, `mango-box-large.png` — product photos
- `icon-mangoes.png`, `icon-story.png`, `icon-whatsapp.png`, `Team.png` — home quick-link icons
- `assortiment-*.png` — mango variety icons (The Chain)
- `hero-poster.png` — hero image (shown before/between video plays)
- `site-bgr.jpg`, `about-hero.jpg`, `products-hero.jpg`, `contact-hero.jpg` — background photos
- `og.png` — social sharing image

### Hero video

The home-page hero plays a local video: drop your footage into
**`public/hero.mp4`** (no code changes needed). The hero shows
`public/hero-poster.png` for 2 seconds, then plays the video, returns to
the poster when it ends, and repeats. If `hero.mp4` is missing, the
poster image simply stays.

## Deployment

Deploys to Vercel with zero configuration.
