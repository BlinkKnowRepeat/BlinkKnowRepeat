import { handle } from '@astrojs/cloudflare/handler';
import type { Bindings } from './lib/bindings';
import { localizePublicHtml } from './lib/localize-html';
import { locales } from './lib/locales';
import { discover, runOne } from './lib/pipeline';

const policy = [
  "default-src 'self'", "script-src 'self'", "style-src 'self' 'unsafe-inline'", "img-src 'self' data:",
  "font-src 'self'", "frame-src https://www.youtube-nocookie.com", "object-src 'none'",
  "base-uri 'none'", "frame-ancestors 'none'", "form-action 'self'",
].join('; ');

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const siteOrigin = env.SITE_URL && URL.canParse(env.SITE_URL) ? new URL(env.SITE_URL).origin : undefined;
    const authenticated = url.pathname.startsWith('/admin') || url.pathname.startsWith('/api/auth') || /\/account\/?$/.test(url.pathname);
    const cacheablePath = /^\/[a-z]+(?:\/(?:article\/[a-z0-9-]+|latest|world|technology|ai|science|economy|explain|watch|learn))?\/?$/.test(url.pathname);
    const canCache = url.origin === siteOrigin && url.protocol === 'https:' && request.method === 'GET'
      && !authenticated && !url.search && !request.headers.has('Cookie') && cacheablePath;
    let cacheKey: Request | undefined;
    const cache = canCache ? await caches.open('bkr-public') : undefined;
    if (cache) {
      const version = await env.DB.prepare('SELECT coalesce(sum(version),0) AS total FROM public_state').first<number>('total');
      const key = new URL(url);
      key.searchParams.set('_edition', 'i18n-' + String(version ?? 0));
      cacheKey = new Request(key);
      const cached = await cache.match(cacheKey);
      if (cached) {
        const response = new Response(cached.body, cached);
        response.headers.set('Cache-Control', 'no-cache');
        return response;
      }
    }
    const rendered = await handle(request, env, ctx);
    const locale = locales.find(item => item.key === url.pathname.split('/')[1]);
    const localized = locale && request.method !== 'HEAD' ? await localizePublicHtml(rendered, locale) : rendered;
    const response = new Response(localized.body, localized);
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    if (!import.meta.env.DEV) response.headers.set('Content-Security-Policy', policy);
    if (authenticated || response.headers.has('Set-Cookie') || url.pathname === '/') response.headers.set('Cache-Control', 'private, no-store');
    if (authenticated) response.headers.set('X-Robots-Tag', 'noindex');
    if (cache && cacheKey && response.ok && !response.headers.has('Set-Cookie')) {
      const copy = response.clone();
      copy.headers.set('Cache-Control', 'public, max-age=60');
      ctx.waitUntil(cache.put(cacheKey, copy));
    }
    if (cacheablePath && !authenticated && !response.headers.has('Set-Cookie')) response.headers.set('Cache-Control', 'no-cache');
    return response;
  },
  async scheduled(_controller, env) {
    if (env.AUTOMATION_PAUSED !== 'false') return;
    if (await env.DB.prepare("SELECT value FROM settings WHERE key='operator-pause'").first<string>('value') === 'true') return;
    if (env.SOURCE_FEED_URL && env.OPENAI_API_KEY && env.OPENAI_MODEL) try {
      await discover(env);
      await env.DB.prepare("INSERT OR REPLACE INTO settings(key,value) VALUES('last-check',?),('source-status','ok')").bind(new Date().toISOString()).run();
    } catch {
      await env.DB.prepare("INSERT OR REPLACE INTO settings(key,value) VALUES('source-status','Source check failed. Verify the configured feed.')").run();
    }
    for (let count = 0; count < 8; count++) {
      if (!(await runOne(env))) break;
    }
  },
} satisfies ExportedHandler<Bindings>;
