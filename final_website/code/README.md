# Blink, Know, Repeat

A local-first multilingual publication and learning library. The demo edition uses the supplied logo, original educational examples, and a keyboard-operable network explainer.

## Run locally

Use Node 22.23.4 or later. The repository pins 22.23.5 in `.nvmrc`.

```sh
npm ci
npm run migrate
npm run seed
npm run dev -- --host 127.0.0.1 --port 4321
```

Open <http://127.0.0.1:4321/en/>. The database stays under `.wrangler/`. The seed is idempotent and only targets local D1.

## Verify and preview

```sh
npm run types
npm run check
npm run build
npm run preview -- --host 127.0.0.1 --port 4391
npm test
npm run preview -- stop
```

The smoke test uses Google Chrome at `/usr/bin/google-chrome` by default. Set `BKR_BROWSER` for another Chrome or Chromium binary and `BKR_TEST_ORIGIN` for another preview URL.

## Local editorial fixture

Copy `.env.example` to `.dev.vars`, set `FIXTURE_EDITOR=true`, then restart Astro development on loopback. Open `/admin/`. Queue the educational fixture, advance through its stages, review the evidence and draft, then publish its English and Hindi editions. The invalid fixture deliberately introduces an unsupported number. It stops at validation and remains private. Both jobs are identified by fixed keys, so repeats do not make duplicate stories.

The fixture identity is gated by Astro's development build and a loopback request. Use the production preview to check the anonymous 403 and OAuth-disabled state. Keep development bound to loopback.

## Back up local content

```sh
node scripts/content-backup.mjs export exports/content.json
npx wrangler d1 export DB --local --output exports/database.sql
```

The JSON file includes all article versions, linked source references, evidence, glossary, and public correction records. It omits OAuth credentials, accounts, sessions, jobs, and usage logs. Use the SQL export for database-level backup and restrict access to it.

To verify or restore into a fresh local D1 state directory, apply migrations with `--persist-to /path/to/isolated-state`. Then run `node scripts/content-backup.mjs restore exports/content.json /path/to/isolated-state`. A production restore should first be rehearsed against a separate database. Keep the migration files with the backup.

See [architecture](ARCHITECTURE.md), [production setup](SETUP_REQUIRED.md), and the [implementation record](FINAL_CONTEXT.md).

Editorial regression checks can be run with `npm run test:editorial` against a fresh isolated development server on port 4392 with the fixture editor enabled.
