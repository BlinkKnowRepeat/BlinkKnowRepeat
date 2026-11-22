import { mkdirSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fixtures } from '../src/lib/fixtures.ts';

const quote = (value: string) => "'" + value.replaceAll("'", "''") + "'";
const inserts = fixtures.flatMap(story => [
  `INSERT OR IGNORE INTO content(id,original_locale,revision,type,topic,demo) VALUES(${quote(story.id)},'en',1,${quote(story.type)},${quote(story.topic)},1);`,
  `INSERT OR IGNORE INTO versions(content_id,locale,revision,slug,title,summary,significance,body,minutes,state,method,sources,search_text,published_at,updated_at) VALUES(${[
    quote(story.id), quote(story.locale), 1, quote(story.id), quote(story.title), quote(story.summary), quote(story.significance),
    quote(JSON.stringify(story.body)), story.minutes, "'published'", "'educational-fixture'", quote(JSON.stringify(story.sources)),
    quote([story.title, story.summary, ...story.body.flatMap(part => [part.heading, part.text])].join(' ').normalize('NFKC').toLowerCase().replace(/[\p{P}\p{Z}\s]+/gu, ' ').trim()),
    quote(story.published), quote(story.updated),
  ].join(',')});`,
]);
mkdirSync('.wrangler', { recursive: true });
writeFileSync('.wrangler/seed.sql', inserts.join('\n') + '\n');
const result = spawnSync('node_modules/.bin/wrangler', ['d1', 'execute', 'DB', '--local', '--file', '.wrangler/seed.sql'], { stdio: 'inherit' });
if (result.error) throw result.error;
process.exitCode = result.status ?? 1;
