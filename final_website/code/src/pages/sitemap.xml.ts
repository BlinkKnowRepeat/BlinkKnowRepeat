import type { APIRoute } from 'astro';
import { bindings, siteOrigin } from '../lib/bindings';
import type { Story } from '../lib/fixtures';
import { xml, xmlHeaders } from '../lib/xml';
import { locales } from '../lib/locales';
import { posts } from '../lib/posts';

export const GET: APIRoute = async ({ url }) => {
  const origin = siteOrigin(bindings.SITE_URL, url.origin);
  let content: Pick<Story, 'locale' | 'id' | 'updated'>[] = [];
  if (bindings.DB) try {
    content = (await bindings.DB.prepare(`SELECT c.id,v.locale,v.updated_at AS updated FROM versions v
      JOIN content c ON c.id=v.content_id AND c.revision=v.revision
      WHERE c.demo=0 AND v.state='published' ORDER BY c.id,v.locale LIMIT 5000`).all<(typeof content)[number]>()).results;
  } catch (error) {
    if (!String(error).includes('no such table')) throw error;
  }
  const byId = Map.groupBy(content, item => item.id);
  const nodes = content.map(item => {
    const link = new URL(`/${item.locale}/article/${item.id}/`, origin).href;
    const alternatives = (byId.get(item.id) ?? []).map(edition => {
      const locale = locales.find(row => row.key === edition.locale);
      return `<xhtml:link rel="alternate" hreflang="${xml(locale?.tag ?? edition.locale)}" href="${xml(new URL(`/${edition.locale}/article/${edition.id}/`, origin).href)}"/>`;
    }).join('');
    return `<url><loc>${xml(link)}</loc><lastmod>${xml(item.updated)}</lastmod>${alternatives}</url>`;
  });
  const fixed = ['', 'news/', 'research/', 'events/', 'approach/', 'about/', 'contact/', 'privacy/', 'terms/', 'third-party/'].map(path => `<url><loc>${xml(new URL(`/en/${path}`, origin).href)}</loc></url>`);
  const postUrls = posts.flatMap(p => (['en', ...Object.keys(p.local ?? {})]).map(k => `<url><loc>${xml(new URL(`/${k}/post/${p.slug}/`, origin).href)}</loc><lastmod>${xml(p.date)}</lastmod></url>`));
  nodes.push(...fixed, ...postUrls);
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${nodes.join('')}</urlset>`, { headers: xmlHeaders });
};
