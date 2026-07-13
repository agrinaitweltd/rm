# RM Mangoes 🥭

Premium Pakistani mangoes, delivered across Scotland.
**From Pakistani Farms to Scottish Doorsteps.**

A modern, production-ready marketing site built with **Next.js (App Router) +
React + TypeScript + Tailwind CSS v4**, optimised for deployment on **Vercel**.

---

## Tech stack

| Area        | Choice                                   |
| ----------- | ---------------------------------------- |
| Framework   | Next.js 16 (App Router, Turbopack)       |
| Language    | TypeScript (strict)                      |
| UI          | React 19                                 |
| Styling     | Tailwind CSS v4 (CSS-first `@theme`)     |
| Fonts       | Poppins + Mulish via `next/font` (self-hosted, no external requests) |
| Images      | `next/image` (AVIF/WebP, lazy-loaded)    |
| Deploy      | Vercel (zero config)                     |

---

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
```

Other scripts:

```bash
npm run build      # production build
npm run start      # run the production build locally
npm run lint       # ESLint
npm run typecheck  # TypeScript, no emit
```

---

## Project structure

```
public/
  images/            # ← all editable images live here (see below)
  icon-512.png       # PWA icon
src/
  app/
    layout.tsx       # root layout, metadata, fonts, global chrome
    page.tsx         # home
    about/           # About page
    products/        # Products & pricing
    gallery/         # Gallery
    contact/         # Contact & order form
    api/contact/     # order-form endpoint (ready for email integration)
    robots.ts        # /robots.txt
    sitemap.ts       # /sitemap.xml
    manifest.ts      # /manifest.webmanifest
    icon.svg         # favicon
  components/
    layout/          # Navbar, Footer
    sections/        # Hero, Pricing, Gallery, Testimonials, FAQ, …
    ui/              # Button, Icon, Reveal, SectionHeading, …
    CookieConsent.tsx
    WhatsAppButton.tsx
  config/
    site.ts          # ← single source of truth for all content
  lib/
    links.ts         # tel:/mailto:/WhatsApp/TikTok links
```

---

## Editing content

Almost everything is driven from **`src/config/site.ts`** — company details,
contact info, navigation, products & pricing, features, testimonials, FAQs and
image paths. Update it in one place and it flows through the whole site.

### Images

All editable images live in **`public/images/`** and are referenced by path
from `src/config/site.ts` (never hard-coded in components).

To swap an image, just drop a replacement file with the **same filename** into
`public/images/` — no code changes required:

```
public/images/hero.jpg        public/images/gallery-1.jpg … gallery-6.jpg
public/images/about.jpg       public/images/product.jpg
public/images/banner.jpg      public/images/og.jpg   (social share image)
```

The files currently in the folder are branded placeholders — replace them with
real photography when ready.

---

## Contact form / email integration

The order form posts to `POST /api/contact`, which validates the submission and
(currently) logs it server-side. To start receiving orders by email, add an
email provider and complete the marked `TODO` in
`src/app/api/contact/route.ts`, then set the environment variables from
`.env.example` (e.g. `RESEND_API_KEY`, `ORDER_INBOX`).

Until then, customers can order instantly via the floating **WhatsApp** button,
**click-to-call** and **email** links throughout the site.

---

## Deploying to Vercel

1. Push this repository to GitHub.
2. In Vercel, **Add New → Project** and import the repo.
3. Framework preset is auto-detected as **Next.js** — no configuration needed.
4. (Optional) add any environment variables from `.env.example`.
5. Deploy.

`npm run build`, `npm run lint` and `npm run typecheck` all pass cleanly.

---

## SEO & performance

- Per-page metadata, Open Graph & Twitter cards, canonical URLs
- `robots.txt`, `sitemap.xml`, web manifest, favicon
- Structured data (LocalBusiness + Product JSON-LD)
- Optimised, lazy-loaded images (AVIF/WebP)
- Self-hosted fonts, no render-blocking external requests
- Fully responsive, no horizontal scroll, `prefers-reduced-motion` support

---

Made &amp; Designed by [Kavo Technologies](https://www.kavotech.uk).
