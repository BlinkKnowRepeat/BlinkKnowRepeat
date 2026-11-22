import type { APIRoute } from 'astro';
import { bindings } from '../../lib/bindings';
import { locales } from '../../lib/locales';
import { updateVersion } from '../../lib/updates';

export const GET: APIRoute = async ({ request, url }) => {
  const locale = url.searchParams.get('locale') ?? 'en';
  if (!locales.some(item => item.key === locale)) return new Response(null, { status: 400 });
  const version = await updateVersion(bindings.DB, locale);
  const etag = `"${locale}-${version}"`;
  const headers = { ETag: etag, 'Cache-Control': 'public, max-age=0, must-revalidate' };
  if (request.headers.get('If-None-Match') === etag) return new Response(null, { status: 304, headers });
  return Response.json({ version }, { headers });
};
