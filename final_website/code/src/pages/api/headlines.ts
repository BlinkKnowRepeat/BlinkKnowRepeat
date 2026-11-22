import type { APIRoute } from 'astro';
import { bindings } from '../../lib/bindings';
import { headlineEtag, headlineInterval, latestHeadlines, slideshowFeed } from '../../lib/headlines';
import { locales } from '../../lib/locales';

export const GET: APIRoute = async ({ request, url }) => {
  const locale = locales.find(item => item.key === (url.searchParams.get('locale') ?? 'en'));
  if (!locale) return new Response(null, { status: 400 });

  const body = JSON.stringify(url.searchParams.get('window') === 'day'
    ? await slideshowFeed(bindings.DB, locale) : await latestHeadlines(bindings.DB, locale));
  const etag = await headlineEtag(body);
  const headers = { ETag: etag, 'Cache-Control': `public, max-age=${headlineInterval / 1_000}, must-revalidate`, 'Content-Type': 'application/json; charset=utf-8' };
  if (request.headers.get('If-None-Match') === etag) return new Response(null, { status: 304, headers });
  return new Response(body, { headers });
};
