import type { Post } from './posts';
// Prefer summaries already written in the target language. The rendered edition also localizes the remaining copy.
export function localize(post: Post, key: string) {
  const l = post.local?.[key as 'hi' | 'gu' | 'mr'];
  return l ? { title: l.title, dek: l.dek, blink: l.blink, translated: true } : { title: post.title, dek: post.dek, blink: post.blink, translated: false };
}
export function fmtDate(iso: string, tag: string, withTime = false) {
  if (!Intl.DateTimeFormat.supportedLocalesOf(tag).length) {
    const value = iso.slice(0, withTime ? 16 : 10).replace('T', ' ');
    return value + (withTime ? ' UTC' : '');
  }
  return new Intl.DateTimeFormat(tag, withTime ? { dateStyle: 'medium', timeStyle: 'short', hourCycle: 'h23', timeZone: 'UTC' } : { dateStyle: 'medium', timeZone: 'UTC' }).format(new Date(iso)) + (withTime ? ' UTC' : '');
}
