import type { APIRoute } from 'astro';
import { bindings, siteOrigin } from '../../lib/bindings';
import { catalog } from '../../lib/catalog';
import { postsByDate } from '../../lib/posts';
import { dictionaryFor, translateCopy } from '../../lib/i18n';
import { localize } from '../../lib/view';
import { locales } from '../../lib/locales';
import { xml, xmlHeaders } from '../../lib/xml';

export const GET: APIRoute = async ({ params, url }) => {
  const locale = locales.find(row => row.key === params.locale);
  if (!locale) return new Response(null, { status: 404 });
  const dictionary = await dictionaryFor(locale.key);
  const tr = (value: string) => translateCopy(dictionary, value);
  const origin = siteOrigin(bindings.SITE_URL, url.origin);
  const content = await catalog(bindings.DB, { locale: locale.key, realOnly: true, limit: 30 });
  const postNodes = postsByDate.map(p => { const v = localize(p, locale.key); const link = new URL(`/${locale.key}/post/${p.slug}/`, origin).href; return `<item><title>${xml(tr(v.title))}</title><description>${xml(tr(v.dek))}</description><link>${xml(link)}</link><guid>${xml(link)}</guid><pubDate>${new Date(p.date).toUTCString()}</pubDate><category>${xml(p.topic)}</category></item>`; });
  const nodes = content.map(item => {
    const link = new URL(`/${locale.key}/article/${item.id}/`, origin).href;
    return `<item><title>${xml(item.title)}</title><description>${xml(item.summary)}</description><link>${xml(link)}</link><guid>${xml(link)}</guid><pubDate>${new Date(item.published).toUTCString()}</pubDate></item>`;
  });
  const link = new URL(`/${locale.key}/`, origin).href;
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Blink, Know, Repeat · ${xml(locale.name)}</title><link>${xml(link)}</link><description>Blink, Know, Repeat · ${xml(locale.name)}</description><language>${xml(locale.tag)}</language>${[...postNodes, ...nodes].join('')}</channel></rss>`, { headers: { ...xmlHeaders, 'Content-Type': 'application/rss+xml; charset=utf-8' } });
};
