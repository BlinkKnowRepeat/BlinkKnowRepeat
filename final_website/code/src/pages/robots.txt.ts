import type { APIRoute } from 'astro';
import { bindings, siteOrigin } from '../lib/bindings';
export const GET: APIRoute = ({ url }) => new Response(`User-agent: *\nSitemap: ${new URL('/sitemap.xml', siteOrigin(bindings.SITE_URL, url.origin))}\n`, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
