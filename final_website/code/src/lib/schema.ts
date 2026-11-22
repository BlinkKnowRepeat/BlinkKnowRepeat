import { integer, primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import type { Story } from './fixtures';

export const content = sqliteTable('content', {
  id: text().primaryKey(),
  originalLocale: text('original_locale').$type<NonNullable<Story['originalLocale']>>().notNull(),
  revision: integer().notNull(),
  type: text().$type<Story['type']>().notNull(),
  topic: text().$type<Story['topic']>().notNull(),
  demo: integer({ mode: 'boolean' }).notNull(),
});
export const versions = sqliteTable('versions', {
  contentId: text('content_id').notNull().references(() => content.id),
  locale: text().$type<Story['locale']>().notNull(),
  revision: integer().notNull(),
  slug: text().notNull(),
  title: text().notNull(),
  summary: text().notNull(),
  significance: text().notNull(),
  body: text({ mode: 'json' }).$type<Story['body']>().notNull(),
  minutes: integer().notNull(),
  state: text().notNull(),
  method: text().notNull(),
  sources: text({ mode: 'json' }).$type<Story['sources']>().notNull(),
  media: text({ mode: 'json' }).$type<NonNullable<Story['media']>>(),
  searchText: text('search_text').notNull(),
  published: text('published_at'),
  updated: text('updated_at').notNull(),
}, table => [primaryKey({ columns: [table.contentId, table.locale, table.revision] })]);
