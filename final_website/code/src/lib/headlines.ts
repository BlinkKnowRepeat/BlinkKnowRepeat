import { catalog } from './catalog';
import { photoFor } from './editorial-photos';
import { dictionaryFor, translateCopy } from './i18n';
import type { Story } from './fixtures';
import type { Locale } from './locales';
import { postsByDate } from './posts';
import { uiFor } from './site';
import { fmtDate, localize } from './view';

export type Headline = {
  href: string;
  title: string;
  summary: string;
  date: string;
  dateLabel: string;
  section: string;
  photo: string;
};

export const headlineInterval = 5_000;
// How many of the newest stories the homepage slideshow carries (static posts and published database stories, newest first).
const homeLimit = 10;

export function publishedNews(db: D1Database | undefined, locale: Locale, filters: {
  topic?: Story['topic']; query?: string; from?: string; to?: string; limit: number;
}) {
  return catalog(db, { ...filters, locale: locale.key, type: ['brief', 'explainer'], realOnly: true, order: 'published' });
}

export async function headlineEtag(body: string) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(body));
  const hash = Array.from(new Uint8Array(digest).slice(0, 12), byte => byte.toString(16).padStart(2, '0')).join('');
  return `"${hash}"`;
}

export type SlideshowFeed = { items: Headline[]; last24Hours: boolean };

// The fullscreen slideshow leads with the last 24 hours. When that window holds fewer than a full rotation,
// it tops up with the next newest stories so the show never loops over just one or two slides.
const slideshowMinimum = 6;
const slideshowMaximum = 12;

export async function slideshowFeed(db: D1Database | undefined, locale: Locale): Promise<SlideshowFeed> {
  const now = Date.now();
  const recent = await latestHeadlines(db, locale, { since: now - 86_400_000, until: now });
  if (recent.length >= slideshowMinimum) return { items: recent.slice(0, slideshowMaximum), last24Hours: true };
  const seen = new Set(recent.map(item => item.href));
  const earlier = (await latestHeadlines(db, locale, undefined, slideshowMaximum)).filter(item => !seen.has(item.href));
  return { items: [...recent, ...earlier].slice(0, slideshowMaximum), last24Hours: false };
}

export async function latestHeadlines(db: D1Database | undefined, locale: Locale, range?: { since: number; until: number }, count = homeLimit): Promise<Headline[]> {
  const dictionary = await dictionaryFor(locale.key);
  const t = (value: string) => translateCopy(dictionary, value);
  // News only. Explainers have their own section and never appear in the news slideshow.
  const published = await catalog(db, { locale: locale.key, type: ['brief'], realOnly: true, order: 'published', ...(range ? {
    from: new Date(range.since).toISOString().slice(0, 10), to: new Date(range.until).toISOString().slice(0, 10),
    limit: Number.MAX_SAFE_INTEGER,
  } : { limit: count }) });
  const ui = uiFor(locale.key);
  const desk = postsByDate.filter(post => post.kind === 'News').map(post => {
    const story = localize(post, locale.key);
    return {
      href: `/${locale.key}/post/${post.slug}/`, title: t(story.title), summary: t(story.dek), date: post.date,
      dateLabel: fmtDate(post.date, locale.tag), section: t(post.kind === 'Explainer' ? post.kind : post.scope === 'India' ? ui.india : ui.world),
      photo: photoFor(post.slug, post.topic).file,
    };
  });
  const items = [...desk, ...published.map(story => ({
    href: `/${locale.key}/article/${story.id}/`, title: story.title, summary: story.summary, date: story.published,
    dateLabel: fmtDate(story.published, locale.tag), section: t(ui.news), photo: photoFor(story.id, story.topic).file,
  }))].sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
  return range ? items.filter(item => {
    const date = Date.parse(item.date);
    return date >= range.since && date <= range.until;
  }) : items.slice(0, count);
}
