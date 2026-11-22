import { locales } from './locales';
import { uiFor } from './site';
import { bindings, siteOrigin } from './bindings';
export function pageCtx(Astro: { params: Record<string, string | undefined>; url: URL }) {
  const found = locales.find(l => l.key === Astro.params.locale);
  const locale = found ?? locales[0];
  return { locale, unknown: !found, ui: uiFor(locale.key), base: `/${locale.key}/`, origin: siteOrigin(bindings.SITE_URL, Astro.url.origin) };
}
