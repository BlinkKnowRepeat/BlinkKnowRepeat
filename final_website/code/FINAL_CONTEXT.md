# Implementation record

The runnable local application is in `/home/linux/Documents/Youtube/final_website/code`. Its brief is `/home/linux/Documents/Youtube/final_website/website_prompt.md`. The root logo PNG is the supplied image. The local browser uses a 160px WebP derivative and an original network diagram. No production release was requested or published.

The following records the build, verification, and remaining integrations.

## Runtime and content

- Node 22.23.5 for checks. Astro 7.4.13, Astro Cloudflare adapter 14.4.9, Tailwind 4.3.5, Wrangler 4.166.0, Drizzle 0.45.4, Better Auth 1.7.27, Zod 4.6.7, TypeScript 5.9.3, and Playwright 1.65.1. The lockfile pins esbuild 0.28.2 for Vite.
- Public routes are `/:locale/`, the nine publication sections, `/:locale/search/`, `/:locale/article/:id/`, `/:locale/languages/`, `/:locale/account/`, and the English information and policy pages linked in the footer. The Worker also serves the per-locale RSS feeds, XML sitemap, robots file, conditional update cursor, and published storyboard JSON. `/admin/` and `/api/auth/*` are uncached. Stable assets are static. The HTML routes use server rendering, including informational pages.
- The 23 locale keys are in `src/lib/locales.ts`. Kashmiri, Sindhi, and Urdu use Arabic script and RTL. Meitei uses Meetei Mayek, Punjabi uses Gurmukhi, and Santali uses Ol Chiki. The other selected script variants are listed in the registry. The 22 shared interface strings are validated for every locale at render time. Homepage, article, and interaction copy has broader coverage in English, Hindi, Gujarati, and Marathi. Policies are authored in English and other paths show a missing-version state. Indic text is a draft localization awaiting native review.
- The base seed has five canonical educational entries and eight published locale editions. It includes three explainers and two short lessons. The packet article has four substantive editions. There are zero verified current-news stories, channel videos, attributed authors or reviewers, and paid items in the seed. Fixture timestamps are part of the demo. The network description links to RFC 8200 for IPv6 background. Demo pages are noindex and omitted from the sitemap and feeds.
- The isolated editorial test published a sixth educational article with two additional editions, then corrected the original and made the prior translations stale. Its isolated database contains six canonical records and eleven total version rows, including historical revisions. The main source directory retains the base seed only.
- Source assets are `logo.png`, `public/logo.webp`, `public/packet.svg`, `public/packet.png`, and the self-hosted Noto subsets and licenses in `public/fonts`. Build output is `dist/`. Competing starter routes and drafts encountered during initial setup were preserved under the local ignored `.wrangler/concurrent-starter/` directory.

## Verification

- `npm run types` generated Worker types. `npm run migrate` applied both D1 migrations. `npm run seed` wrote the base fixtures.
- `npm run check` and `npm run build` passed. `npm test` passed in production preview. Chromium checked desktop and mobile widths (1366 and 390 CSS pixels), white page backgrounds, keyboard controls and focus, all 23 homepage dictionaries, four packet editions, RTL and unavailable article state, Hindi substring search, no-JavaScript reading, anonymous admin rejection, disabled Google configuration, ETag, demo indexing, and storyboard JSON.
- `npm run test:editorial` was exercised through its script against a separate loopback development database. It passed cross-origin rejection, parallel enqueue and approval, draft privacy, staged publication, correction, stale translations, cursor advancement, and invalid-claim rejection. An expired lease was then forced in local D1 and reclaimed by the Worker. The previously invalid claim still failed.
- Better Auth OAuth initiation succeeded with local placeholder values. It generated the official Google destination, expected scope set, callback URI, and state cookie. No provider callback, Google account, or token exchange was exercised.
- The content export/restore rehearsal used separate local D1 state directories. The repeated portable JSON exports matched byte for byte. Wrangler also produced a database SQL export. The portable export omits users, sessions, and other private authentication and operational data.
- `wrangler deploy --dry-run` passed without a remote release. `npm audit --omit=dev` reported zero vulnerabilities at the time of the run.
- Browser checks verified layout and behavior in a local lab. No Lighthouse score, field Core Web Vitals, external-provider latency, or production edge-cache hit ratio was measured. Edge cache version keys were implemented and local cursor changes were exercised.

## Operational limits

The public release is local. No production domain, cloud resources, provider accounts, charges, automated publication, or live email were activated. External RSS/OpenAI generation, real Google sign-in, and HTTPS edge-cache behavior need environment-specific verification. Live drafts require an editor, and the automatic publication rule covers only the known local educational fixture. Numeric/schema checks help reject discrepancies and require human corroboration. The budget reservation is a configured estimate tracked in microdollars. Frequency does not guarantee publication volume.

The first implementation leaves full browser-based draft editing, arbitrary revision rollback, publication scheduling controls, external translation provider and editorial glossary screens, localized policy review, account bookmarks and reading progress, email double opt-in, advertising/consent integrations, R2 uploads, hosted TTS, and checkout for subsequent work. A recorded local correction can update the original summary and stale older translations. Public storyboard JSON provides a structured text export.

See [SETUP_REQUIRED.md](SETUP_REQUIRED.md) for ordered owner setup and integration status. [Cloudflare adapter](https://docs.astro.build/en/guides/integrations-guide/cloudflare/) · [Google OAuth provider](https://better-auth.com/docs/authentication/google) · [D1 export and migrations](https://developers.cloudflare.com/d1/wrangler-commands/)


## Release 2 (23 Nov 2026): editorial redesign

The owner asked for changes that supersede parts of the original brief: light **and** dark themes (the brief required white-only), a slow left-to-right headline ticker and a dynamic latest-stories slideshow (the brief discouraged crawlers and carousels). These were built as requested.

**Fixed:** duplicated navigation and language names. One header nav (News, India, World, Research & Reports, Events, Our approach, About, Contact), one language menu (the current language is ticked, not repeated), no second "Language" link in the footer or the "Read in your language" block on the home page, no repeated stories on the home page. Sign-in is no longer in the header; it appears only on the Saved page, as an icon button.

**Added:**
- `src/lib/posts.ts`: 8 posts (5 news, 3 explainers; gold, Nvidia, RBI rate corridor, COP31, Gaganyaan G1, packet explainer, sky colour, inflation). Each has a sourcing level, "what we could not confirm", clickable sources, a mind map and an interactive demo. Hindi, Gujarati and Marathi titles, summaries and key points for every post, labelled machine-assisted.
- Pages: `/:locale/news/` (keyword, topic, date filters), `/post/:slug/`, `/saved/`, `/research/` (printable weekly brief), `/events/`, `/approach/` (page classification and how the site differs), `/contact/`, `/third-party/`. Policy pages rewritten (Terms, Privacy, Cookies, Third-party links, Editorial, AI & translations, Corrections, Accessibility, Refunds, Advertise, Disclosures).
- Share: WhatsApp, Facebook, X, Email, RSS, Instagram (copies the link and opens Instagram; Instagram has no web share URL), copy link. Local bookmarks, Listen (browser speech, hidden if unsupported, warns if no voice for the language), Print stylesheet with source URLs.
- Thumbnails are original SVG illustrations, each with the Blink, Know, Repeat logo. They are not photographs.
- Daily Insights form: `POST /api/subscribe` stores address, locale and consent time in D1 (`migrations/0003_newsletter.sql`), with same-origin check, honeypot and validation. It does not send email and says so.

**Sourcing, checked 23 Nov 2026:** Nvidia figures were read from the company's own release. RBI corridor figures were read from the RBI's 19 Nov money-market page; the October rate rise, 6.09% inflation and 4 Dec meeting date are third-party reports and are labelled. Gold figures come from one secondary article and are labelled; the World Gold Council page showed no price. COP31 covers the talks up to 18 Nov; no final outcome was confirmed. Gaganyaan has no confirmed date. Update these before relying on them.

**Verification run:** `astro check` 0 errors; `npm run build`; `npm test` (smoke) passed in production preview under the CSP; migration 0003 applied locally; custom browser checks: mind map, interactive demo, bookmarks persistence, theme persistence, filters (keyword/topic/date), slideshow, newsletter validation and API (success, duplicate, cross-origin 403, bad email 400, honeypot), print emulation, no horizontal overflow on 16 routes at 390/768/1366 px, zero console errors. `npm run test:editorial` was not re-run after this release.

**Not done / open:** social profile URLs (SOCIALS in `src/lib/site.ts`), contact email, owner name and legal review of Terms/Privacy, real email delivery, real Google credentials, translated policy pages (English only), reviewed translations, photographs, Lighthouse/field performance, a live data feed for prices.

## 23 November 2026 · Navigation and homepage redesign

The current header contains News, India, World, Research & Reports, Events, Our approach, About, and Contact, followed by the language picker. Mobile puts the same eight links in Menu. Saved stories and theme controls moved to the footer. The homepage now uses a static, photographed introduction, topic links, an explainer catalog, and a dated news list. The earlier ticker and rotating slideshow have no public entry point.

News, India, and World share the catalog. The geography links constrain story scope on the server, and keyword and date filters work without JavaScript. Research & Reports links the brief to primary documents. Events separates upcoming dates from past entries. Contact shows the current setup state when the public address is empty. The newsletter form records interest and reports that email delivery has yet to start.

The locally hosted photo files are resized WebP copies. Credits and links appear on the homepage or associated articles. [Marine Drive by Zoshua Colah](https://unsplash.com/photos/city-skyline-and-water-under-a-cloudy-sky-m6ZynNNWhvw) · [Phone by Nathan Dumlao](https://unsplash.com/photos/person-holding-black-smartphone-on-white-paper-y440_q4e-0E) · [Delhi sunset by Dewang Gupta](https://unsplash.com/photos/blue-and-orange-cloudy-sky-during-sunset-Et9LYhnBC28) · [Produce by Nina Weishaupt](https://unsplash.com/photos/fresh-vegetables-and-produce-displayed-at-a-market-nwpPqHpFge4)

The production-preview smoke suite checks 45 page and viewport combinations, exact navigation labels, working photographs, geography and keyword filtering without JavaScript, and existing reading functionality. Additional local checks covered five languages at 320, 390, 1161, and 1280 pixels, including RTL and dark mode. This revision is local.

## 23 November 2026 · Cookie choices, contact, and post covers

The first-visit banner offers Cookie Settings, Reject Non-Essential Cookies, and Accept All Cookies. The footer and Cookies page reopen the settings. A first-party consent cookie records the choices for up to 180 days. Without Preferences consent, the site skips persistent language, theme, and bookmark storage. Rejecting Preferences clears those saved values on this device. YouTube embeds require External media consent and a separate load action. The site uses no advertising or analytics cookies.

The public Contact address defaults to `blinkknowrepeat@gmail.com`. A valid `CONTACT_EMAIL` binding can override it.

Each published post and library article uses a topic-related cover with the supplied logo as a small upper-right overlay. Editorially selected photographs take priority over the topic fallback. Sources and license notices are displayed beneath photos. Archive or illustrative images have captions identifying their context where relevant. [Reserve Bank of India photo](https://commons.wikimedia.org/wiki/File:Reserve_Bank_Of_India_-_RBI_Mumbai.jpg) · [ISRO TV-D1 photo](https://commons.wikimedia.org/wiki/File:Gaganyaan_vehicle_used_for_TVD1_mission.webp)

Production-preview tests covered consent before storage, acceptance, rejection, withdrawal, all eight editorial covers, and the public email link. A separate local fixture with an intercepted YouTube request verified consent gating, click-to-load, and removal on withdrawal.
