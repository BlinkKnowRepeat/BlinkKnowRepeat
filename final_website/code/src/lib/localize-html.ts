import { decodeHTML } from 'entities';
import type { Locale } from './locales';
import { copyKey, dictionaryFor, translateCopy } from './i18n';

const attributes = [
  'aria-label', 'aria-roledescription', 'title', 'placeholder', 'alt', 'data-pause', 'data-play',
  'data-save-text', 'data-unsave-text', 'data-save-label', 'data-remove-label', 'data-stop',
  'data-listen-label', 'data-copied', 'data-copy', 'data-label', 'data-unavailable', 'data-resume',
];

export async function localizePublicHtml(response: Response, locale: Locale): Promise<Response> {
  if (locale.key === 'en' || !response.body || !response.headers.get('Content-Type')?.startsWith('text/html')) return response;
  const dictionary = await dictionaryFor(locale.key);
  if (Object.keys(dictionary).length === 0) return response;

  const translate = (value: string) => translateCopy(dictionary, value);
  let skip = 0;
  let pending = '';

  return new HTMLRewriter()
    .on('script, style, code, pre, [translate="no"]', {
      element(element) {
        skip++;
        element.onEndTag(() => { skip--; });
      },
    })
    .on('[lang="en"]:not([translate="no"])', {
      element(element) {
        element.setAttribute('lang', locale.tag);
        if (element.hasAttribute('dir')) element.setAttribute('dir', locale.dir);
      },
    })
    .on('meta[name="description"], meta[property="og:title"], meta[property="og:description"], meta[property="og:site_name"]', {
      element(element) {
        const value = element.getAttribute('content');
        if (value) element.setAttribute('content', translate(value));
      },
    })
    .on(attributes.map(attribute => `[${attribute}]`).join(','), {
      element(element) {
        for (const attribute of attributes) {
          const value = element.getAttribute(attribute);
          if (value) {
            const next = translate(value);
            if (next !== value) element.setAttribute(attribute, next);
          }
        }
      },
    })
    .on('html', {
      text(chunk) {
        if (skip) return;
        const raw = pending + chunk.text;
        if (!chunk.lastInTextNode) {
          pending = raw;
          chunk.remove();
          return;
        }
        pending = '';
        const decoded = decodeHTML(raw);
        const key = copyKey(decoded);
        const next = translate(decoded);
        if (next === decoded || next === key) {
          // The tokenizer splits at streaming boundaries. Restore the already escaped source
          // verbatim when a multi-chunk text node has no replacement.
          if (raw !== chunk.text) chunk.replace(raw, { html: true });
          return;
        }
        chunk.replace((decoded.match(/^\s+/u)?.[0] ?? '') + next + (decoded.match(/\s+$/u)?.[0] ?? ''));
      },
    })
    .transform(response);
}
