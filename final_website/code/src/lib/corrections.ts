import { searchText } from './catalog';

export async function correctPublishedOriginal(db: D1Database, id: string, summary: string, note: string, actor: string) {
  const current = await db.prepare(`SELECT c.revision,v.title,v.body FROM content c
    JOIN versions v ON v.content_id=c.id AND v.revision=c.revision AND v.locale=c.original_locale AND v.state='published'
    WHERE c.id=?`).bind(id).first<{ revision: number; title: string; body: string }>();
  if (!current) return false;
  const now = new Date().toISOString();
  const revision = current.revision + 1;
  const body = JSON.parse(current.body) as { heading: string; text: string }[];
  const indexed = searchText([current.title, summary, ...body.flatMap(part => [part.heading, part.text])].join(' '));
  const result = await db.batch([
    db.prepare(`INSERT INTO versions(content_id,locale,revision,slug,title,summary,significance,body,minutes,state,method,sources,media,search_text,published_at,updated_at)
      SELECT v.content_id,v.locale,?,v.slug,v.title,?,v.significance,v.body,v.minutes,'published',v.method,v.sources,v.media,?,v.published_at,?
      FROM content c JOIN versions v ON v.content_id=c.id AND v.revision=c.revision AND v.locale=c.original_locale AND v.state='published'
      WHERE c.id=? AND c.revision=?`).bind(revision, summary, indexed, now, id, current.revision),
    db.prepare(`INSERT INTO corrections(content_id,revision,note,actor,at)
      SELECT id,?,?,?,? FROM content WHERE id=? AND revision=?`).bind(revision, note, actor, now, id, current.revision),
    db.prepare(`INSERT INTO audit(actor,action,target,at) SELECT ?,'correction',id,? FROM content WHERE id=? AND revision=?`)
      .bind(actor, now, id, current.revision),
    db.prepare('UPDATE content SET revision=? WHERE id=? AND revision=?').bind(revision, id, current.revision),
  ]);
  return result[3].meta.changes > 0;
}
