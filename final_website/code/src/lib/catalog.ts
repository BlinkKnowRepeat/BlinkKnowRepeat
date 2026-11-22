import { and, desc, eq, inArray, sql, type SQL } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/d1';
import { content, versions } from './schema';
import { fixtures, type Story } from './fixtures';

export function searchText(value: string): string {
  return value.normalize('NFKC').toLowerCase().replace(/[\p{P}\p{Z}\s]+/gu, ' ').trim();
}

type Filters = {
  locale?: Story['locale']; id?: string; topic?: Story['topic']; type?: Story['type'] | Story['type'][];
  query?: string; limit?: number; offset?: number; realOnly?: boolean; preferred?: Story['locale']; order?: 'published' | 'updated';
  from?: string; to?: string;
};

export async function catalog(db: D1Database | undefined, filters: Filters = {}): Promise<Story[]> {
  const { locale, id, topic, type, query = '', offset = 0, limit = 10, realOnly, preferred, order = 'updated', from, to } = filters;
  const types = Array.isArray(type) ? type : type ? [type] : [];
  const tokens = searchText(query).split(' ').filter(Boolean).slice(0, 8);
  const fallback = () => fixtures.filter(row =>
    (!locale || row.locale === locale) && (!id || row.id === id) && (!topic || row.topic === topic)
    && (!types.length || types.includes(row.type)) && (!realOnly || !row.demo)
    && (!from || row.published.slice(0, 10) >= from) && (!to || row.published.slice(0, 10) <= to)
    && tokens.every(token => searchText(row.title + ' ' + row.summary + ' ' + row.body.map(part => part.text).join(' ')).includes(token)),
  ).sort((a, b) => Number(b.locale === preferred) - Number(a.locale === preferred)
    || b[order].localeCompare(a[order]) || a.id.localeCompare(b.id)).slice(offset, offset + limit);
  if (!db) return fallback();
  const clauses: SQL[] = [eq(versions.state, 'published'), eq(content.revision, versions.revision)];
  if (locale) clauses.push(eq(versions.locale, locale));
  if (id) clauses.push(eq(content.id, id));
  if (types.length) clauses.push(inArray(content.type, types));
  if (topic) clauses.push(eq(content.topic, topic));
  if (realOnly) clauses.push(eq(content.demo, false));
  for (const token of tokens) clauses.push(sql`instr(${versions.searchText}, ${token}) > 0`);
  const published = sql`coalesce(${versions.published}, ${versions.updated})`;
  if (from) clauses.push(sql`substr(${published}, 1, 10) >= ${from}`);
  if (to) clauses.push(sql`substr(${published}, 1, 10) <= ${to}`);
  const dateOrder = desc(order === 'published' ? published : versions.updated);
  try {
    const rows = await drizzle(db).select().from(versions).innerJoin(content, eq(content.id, versions.contentId))
      .where(and(...clauses))
      .orderBy(...(preferred ? [desc(sql`${versions.locale} = ${preferred}`)] : []), dateOrder, content.id, versions.locale)
      .limit(limit).offset(offset);
    return rows.map(({ content: item, versions: version }) => ({
      id: item.id, attribution: item.demo || version.method.startsWith('AI-assisted') ? 'ai-assisted' : undefined, originalLocale: item.originalLocale, type: item.type, topic: item.topic, demo: item.demo,
      locale: version.locale, title: version.title, summary: version.summary, significance: version.significance,
      body: version.body, minutes: version.minutes, sources: version.sources, updated: version.updated,
      published: version.published ?? version.updated, media: version.media ?? undefined,
    }));
  } catch (error) {
    if (String(error instanceof Error ? error.cause ?? error.message : error).includes('no such table')) return fallback();
    throw error;
  }
}
