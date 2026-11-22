// One way to cite sources across the site.
//
// 1. Every post lists its sources once, in `post.sources`. Their position gives each source its number: [1], [2], ...
// 2. A claim cites its source by ending with a marker in the text: "... in September 2025. [1]" or "[1,3]" for several.
//    Markers are allowed in `blink`, `body[].p` and `caveat`. Only cite a source that actually supports the claim.
// 3. Pages render markers as links to the numbered entry and print every source with its publisher and note.
// 4. `validateSources` runs when posts load, so a marker pointing at a missing source fails loudly instead of misleading readers.
import type { Post } from './posts';

type Segment = { text: string } | { cite: number[] };

const MARKER = /\s?\[(\d+(?:\s*,\s*\d+)*)\]/g;

export const sourceId = (n: number, prefix = '') => `${prefix}src-${n}`;
export const sourceHost = (url: string) => { try { return new URL(url).hostname.replace(/^www\./, ''); } catch { return ''; } };

export function parseCitations(text: string): Segment[] {
  const out: Segment[] = [];
  let last = 0;
  for (const m of text.matchAll(MARKER)) {
    if (m.index > last) out.push({ text: text.slice(last, m.index) });
    out.push({ cite: m[1].split(',').map(n => Number(n.trim())) });
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push({ text: text.slice(last) });
  return out;
}

export const citedIn = (text: string) => parseCitations(text).flatMap(part => 'cite' in part ? part.cite : []);

export function validateSources(post: Pick<Post, 'slug' | 'blink' | 'body' | 'caveat' | 'sources'>): string[] {
  const problems: string[] = [];
  const count = post.sources.length;
  const texts = [...post.blink, ...post.body.map(part => part.p), ...(post.caveat ? [post.caveat] : [])];
  for (const n of texts.flatMap(citedIn)) if (n < 1 || n > count) problems.push(`${post.slug}: citation [${n}] has no source (post lists ${count}).`);
  const seen = new Set<string>();
  post.sources.forEach((source, i) => {
    if (!/^https:\/\//.test(source.url)) problems.push(`${post.slug}: source [${i + 1}] must use https.`);
    if (seen.has(source.url)) problems.push(`${post.slug}: source [${i + 1}] repeats an earlier URL.`);
    seen.add(source.url);
    if (!source.title || !source.note) problems.push(`${post.slug}: source [${i + 1}] needs a title and a note.`);
  });
  return problems;
}
