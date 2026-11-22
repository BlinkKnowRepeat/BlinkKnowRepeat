# Setup required

Public reading, seed data, and fixture editorial work run locally without credentials. Provide the following values in order when preparing production.

1. **Production URL and owner.** Supply the HTTPS origin as `SITE_URL`, legal entity as `BRAND_OWNER_NAME`, working privacy/support/corrections contacts, jurisdiction, retention decisions, and the relevant production policies. The public legal pages in this checkout are development drafts.
2. **Cloudflare target and D1.** Use the intended account and create the `blink-content` database. Replace the local placeholder UUID in `wrangler.jsonc` with the assigned ID. Keep `DB` as the binding name. Apply `npx wrangler d1 migrations apply DB --remote` after selecting the intended account and environment. Keep educational fixtures out of a live news database unless you deliberately want to publish them as labeled educational demonstrations.
3. **Google identity.** Supply `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, and a random `BETTER_AUTH_SECRET` of at least 32 characters. Register the exact origin's `/api/auth/callback/google` redirect URI. Use `.dev.vars` for loopback tests and Cloudflare secret bindings for production credentials. A freshly authenticated account is a reader. An authorized operator must identify the user's exact stored ID and assign the initial administrator using a controlled database operation. Review the privacy draft against actual Google use before launch.
4. **News retrieval and drafts.** Confirm rights and trust for the selected feed, then supply `SOURCE_FEED_URL`. Current exact host allowlist covers `www.nasa.gov`, `science.nasa.gov`, `www.noaa.gov`, and `www.usgs.gov`. Supply `OPENAI_API_KEY`, `OPENAI_MODEL`, `AI_DAILY_MAX_JOBS`, `AI_JOB_RESERVE_MICROUSD`, and `AI_DAILY_BUDGET_MICROUSD`. A paid API account uses separate credentials and can incur separate charges from a chat subscription. Set the estimate from the selected model's rates and authorize a provider-side usage cap. Keep `AUTO_PUBLISH_MODE=draft_only` for live editorial review.
5. **Scheduler.** After testing credentials and validating a real source, add `"triggers": {"crons": ["*/10 * * * *"]}` to the production Wrangler config and set `AUTOMATION_PAUSED=false`. The administrative pause switch can suspend subsequent ticks. Test one staged invocation before relying on the schedule.
6. **Channel and captions.** The Watch page defaults to @BlinkKnowRepeat and its premiere. Use `YOUTUBE_CHANNEL_URL` and `YOUTUBE_VIDEO_ID` to feature a different video or channel there. Supply `YOUTUBE_TRANSCRIPT` to add an English transcript. The visitor chooses when to load the external player.
7. **Email and monetization.** Supply a sender, working contacts, and a privacy/retention policy before adding delivery and double opt-in. Select advertising locale eligibility, consent requirements, and approved identifiers before adding an ad provider. Payments remain disabled. Paid products, refund terms, a payment provider, and checkout require separate implementation and business verification.

## Cloudflare release

Build after entering the production bindings and vars. Run `npx wrangler deploy --dry-run` from the project root after the Astro build to validate packaging. Use the live deploy command only for a release you want published. After deployment, verify the actual URL, database binding, auth callback, anonymous and authenticated routes, cache behavior, and optional cron separately. Cloudflare's documented Workers Paid account minimum is USD 5/month. Domain, request and database usage, AI, email, and media are separate costs. [Cloudflare pricing](https://developers.cloudflare.com/workers/platform/pricing/) · [Cron Triggers](https://developers.cloudflare.com/workers/configuration/cron-triggers/)

## Integration status

| Capability | State |
| --- | --- |
| Astro / Workers / D1 | Implemented for local simulation, with Wrangler configuration |
| Public library, topics, Unicode search, language editions, policies | Implemented with labeled fixtures |
| Google OAuth | Implemented using Better Auth. Provider credentials and a real round trip are pending |
| Editorial jobs | Implemented with built-in fixtures, explicit review and revision-based corrections |
| Source fetch and OpenAI drafts | Implemented for an allowlisted RSS feed with limits. Live credentials, feed, and cost validation are pending |
| Real translation provider, terminology workflow, translation requests | Deferred. The fixture exercises stored locale versions and staleness |
| Video | Click-to-load component and transcript. Channel and video configuration are pending |
| Audio and storyboard | Local browser speech when an installed matching voice is available. Validated storyboard JSON for published editions |
| R2 uploads, hosted speech and video rendering | Deferred |
| Contact delivery, newsletter double opt-in | Deferred and disabled |
| Ads, analytics, external consent and checkout | Disabled. Provider activation and product-specific workflow are deferred |
| Account preferences, saved items, reading progress | Deferred. The anonymous language preference works |


## Before publishing (added in Release 2)

1. `BRAND_OWNER_NAME` — shown in the footer, Terms and Privacy. Without it the pages say "the operator of Blink, Know, Repeat".
2. `CONTACT_EMAIL` — optionally overrides the public address, which defaults to `blinkknowrepeat@gmail.com`.
3. Social profiles — fill `SOCIALS` in `src/lib/site.ts` with real https URLs (X, Instagram, Facebook, YouTube). Empty entries are hidden.
4. Legal review — have a lawyer check Terms (governing law is set to India) and Privacy (DPDP Act reference).
5. Email provider — set `EMAIL_PROVIDER`/`EMAIL_API_KEY`/`EMAIL_FROM` and add double opt-in before telling visitors to check their inbox. Subscribers are currently stored in `newsletter_subscribers` with status `pending`.
6. Google sign-in — `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `BETTER_AUTH_SECRET`. Bookmark sync across devices is not built; bookmarks are local.
7. Apply `npm run migrate` remotely (`wrangler d1 migrations apply DB --remote`) so migration 0003 exists in production.
8. Refresh the news in `src/lib/posts.ts` — the stories are dated 18–22 Nov 2026 and go stale.
