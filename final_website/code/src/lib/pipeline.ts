import { articleSchema, openAI, retrieveOfficialFeed, type ArticleDraft, type Evidence } from './providers';
import type { Bindings } from './bindings';
import { searchText } from './catalog';

type Job = { id: string; kind: 'fixture' | 'draft'; content_id: string; stage: string; payload: string; attempts: number; lease_token: string };
type Payload = { evidence?: Evidence; reject?: boolean; article?: ArticleDraft };
const stamp = () => new Date().toISOString();
const fixture: Evidence = { title: 'How a packet moves through a network', excerpt: 'Educational fixture. A phone sends data over a wireless link to an access point. A router then forwards a packet toward its destination.', topic: 'technology' };
const original: ArticleDraft = { title: 'A packet’s trip beyond the router', summary: 'Follow a simplified example from a phone to the wider network.', significance: 'The first wireless connection and later network links can fail independently.',
  body: [{ heading: 'Leave the home network', text: 'The phone sends data over Wi-Fi to an access point. A router forwards a packet toward its destination. This fixture leaves out several steps so you can follow the route.' }] };
const hindi: ArticleDraft = { title: 'राउटर के आगे एक पैकेट का सफ़र', summary: 'एक सरल उदाहरण में फ़ोन से बड़े नेटवर्क तक का रास्ता देखें।', significance: 'पहली वायरलेस कड़ी और आगे के नेटवर्क में अलग-अलग दिक्कत हो सकती है।',
  body: [{ heading: 'घर के नेटवर्क से आगे', text: 'फ़ोन वाई-फ़ाई से एक्सेस पॉइंट को डेटा भेजता है। राउटर पैकेट को उसकी मंज़िल की ओर बढ़ाता है। रास्ता समझने के लिए इस उदाहरण में कुछ चरण छोड़ दिए गए हैं।' }] };

export async function enqueueFixture(db: D1Database, reject = false) {
  const id = reject ? 'fixture-invalid' : 'fixture-network-trip';
  const now = stamp();
  await db.prepare("INSERT OR IGNORE INTO jobs(id,kind,content_id,state,stage,payload,created_at,updated_at) VALUES(?,'fixture',?,'queued','discover',?,?,?)")
    .bind(id, id, JSON.stringify({ reject }), now, now).run();
}

async function claim(db: D1Database, fixturesOnly: boolean) {
  const now = Date.now();
  await db.prepare("UPDATE jobs SET state='failed',error='Lease expired after final attempt.',lease_token=NULL,lease_until=NULL,updated_at=? WHERE state='running' AND lease_until<=? AND attempts>=3 AND (?=0 OR kind='fixture')").bind(stamp(), now, Number(fixturesOnly)).run();
  return await db.prepare(`UPDATE jobs SET state='running',lease_token=?,lease_until=?,attempts=attempts+1,updated_at=? WHERE id=(
    SELECT id FROM jobs WHERE ((state='queued' AND next_at<=?) OR (state='running' AND lease_until<=? AND attempts<3)) AND (?=0 OR kind='fixture')
    ORDER BY created_at,id LIMIT 1) RETURNING id,kind,content_id,stage,payload,attempts,lease_token`)
    .bind(crypto.randomUUID(), now + 90_000, stamp(), now, now, Number(fixturesOnly)).first<Job>();
}

function recordVersion(db: D1Database, job: Job, locale: string, article: ArticleDraft, evidence: Evidence, now: string) {
  const sources = evidence.sourceUrl ? [{ title: evidence.title, url: evidence.sourceUrl }] : [];
  return db.prepare(`INSERT OR IGNORE INTO versions(content_id,locale,revision,slug,title,summary,significance,body,minutes,state,method,sources,search_text,updated_at)
    SELECT ?,?,1,?,?,?,?,?,3,'needs-review',?,?,?,? FROM jobs WHERE id=? AND lease_token=?`)
    .bind(job.content_id, locale, job.content_id, article.title, article.summary, article.significance, JSON.stringify(article.body),
      job.kind === 'fixture' ? 'educational-fixture' : 'AI-assisted draft', JSON.stringify(sources),
      searchText([article.title, article.summary, ...article.body.flatMap(part => [part.heading, part.text])].join(' ')),
      now, job.id, job.lease_token);
}

async function reserve(env: Bindings, job: Job) {
  const cap = Number(env.AI_DAILY_MAX_JOBS);
  const budget = Number(env.AI_DAILY_BUDGET_MICROUSD);
  const reserve = Number(env.AI_JOB_RESERVE_MICROUSD);
  if (![cap, budget, reserve].every(value => Number.isSafeInteger(value) && value > 0)) throw new Error('Generation limits are missing.');
  const now = stamp();
  const day = now.slice(0, 10);
  const row = await env.DB.prepare(`INSERT INTO generation_usage(job_id,provider,model,locale,reserved_microusd,created_at)
    SELECT ?,'openai',?,'en',?,? FROM jobs WHERE id=? AND lease_token=?
    AND (SELECT count(*) FROM generation_usage WHERE created_at>=?) < ?
    AND (SELECT coalesce(sum(reserved_microusd),0) FROM generation_usage WHERE created_at>=?) + ? <= ? RETURNING id`)
    .bind(job.id, env.OPENAI_MODEL ?? '', reserve, now, job.id, job.lease_token, day, cap, day, reserve, budget).first<number>('id');
  if (!row) throw new Error('Daily generation limit reached or job lease lost.');
  return row;
}

function validateClaims(article: ArticleDraft, evidence: Evidence) {
  const text = [article.title, article.summary, article.significance, ...article.body.flatMap(part => [part.heading, part.text])].join(' ');
  const evidenceText = (evidence.title + ' ' + evidence.excerpt).normalize('NFKC').toLowerCase();
  if (/[<>]|https?:\/\//i.test(text) || [...text.matchAll(/[0-9]+(?:[.,][0-9]+)*(?:\s?%)?/g)].some(match => !evidenceText.includes(match[0]))) {
    throw new Error('Validation identified unsupported figures, markup or links.');
  }
}

export async function runOne(env: Bindings, fixturesOnly = false) {
  const db = env.DB;
  const job = await claim(db, fixturesOnly);
  if (!job) return false;
  const payload = JSON.parse(job.payload) as Payload;
  const now = stamp();
  const statements: D1PreparedStatement[] = [];
  let stage = job.stage;
  let state = 'queued';
  try {
    switch (stage) {
      case 'discover':
        if (job.kind === 'fixture') payload.evidence = fixture;
        stage = 'evidence';
        break;
      case 'evidence':
        if (!payload.evidence) throw new Error('Source evidence is missing.');
        stage = 'draft';
        break;
      case 'draft': {
        if (!payload.evidence) throw new Error('Source evidence is missing.');
        if (job.kind === 'fixture') payload.article = payload.reject ? { ...original, title: 'A packet can travel 789456 kilometres' } : original;
        else {
          const provider = openAI(env);
          if (!provider || fixturesOnly) throw new Error('The generation provider is disabled.');
          const usageId = await reserve(env, job);
          const generated = await provider.generate(payload.evidence);
          payload.article = generated.article;
          await db.prepare('UPDATE generation_usage SET input_tokens=?,output_tokens=? WHERE id=?').bind(generated.inputTokens ?? null, generated.outputTokens ?? null, usageId).run();
        }
        stage = 'validate';
        break;
      }
      case 'validate':
        if (!payload.evidence) throw new Error('Source evidence is missing.');
        payload.article = articleSchema.parse(payload.article);
        validateClaims(payload.article, payload.evidence);
        stage = 'translate';
        break;
      case 'translate': {
        if (!payload.article || !payload.evidence) throw new Error('Validated draft is missing.');
        statements.push(db.prepare(`INSERT OR IGNORE INTO content(id,original_locale,revision,type,topic,demo)
          SELECT ?,'en',1,'explainer',?,? FROM jobs WHERE id=? AND lease_token=?`)
          .bind(job.content_id, payload.evidence.topic, Number(job.kind === 'fixture'), job.id, job.lease_token));
        statements.push(recordVersion(db, job, 'en', payload.article, payload.evidence, now));
        if (job.kind === 'fixture') statements.push(recordVersion(db, job, 'hi', articleSchema.parse(hindi), payload.evidence, now));
        stage = 'review';
        state = 'review';
        break;
      }
      default: throw new Error('Unknown job stage.');
    }
    statements.push(db.prepare(`UPDATE jobs SET stage=?,state=?,payload=?,updated_at=?,attempts=0,lease_token=NULL,lease_until=NULL,error=NULL WHERE id=? AND lease_token=?`)
      .bind(stage, state, JSON.stringify(payload), now, job.id, job.lease_token));
    await db.batch(statements);
    if (state === 'review' && job.kind === 'fixture' && env.AUTO_PUBLISH_MODE === 'auto_publish_eligible') {
      await publish(db, job.id, 'fixture-auto-policy', true);
    }
  } catch (error) {
    const terminal = stage === 'validate' || job.attempts >= 3;
    const message = error instanceof Error ? error.message.slice(0, 350) : 'Unexpected pipeline failure.';
    await db.prepare('UPDATE jobs SET state=?,next_at=?,error=?,updated_at=?,lease_token=NULL,lease_until=NULL WHERE id=? AND lease_token=?')
      .bind(terminal ? 'failed' : 'queued', Date.now() + 15_000 * (2 ** job.attempts), message, stamp(), job.id, job.lease_token).run();
  }
  return true;
}

export async function publish(db: D1Database, jobId: string, actor: string, onlyFixtures = false) {
  const now = stamp();
  const sqlGuard = "EXISTS (SELECT 1 FROM jobs WHERE id=? AND state='review'" + (onlyFixtures ? " AND kind='fixture'" : '') + ')';
  const result = await db.batch([
    db.prepare(`INSERT INTO audit(actor,action,target,at) SELECT ?,'publish',?,? WHERE ${sqlGuard} AND EXISTS (SELECT 1 FROM versions WHERE state='needs-review' AND content_id=(SELECT content_id FROM jobs WHERE id=?))`)
      .bind(actor, jobId, now, jobId, jobId),
    db.prepare(`UPDATE versions SET state='published',published_at=?,updated_at=? WHERE state='needs-review' AND content_id=(SELECT content_id FROM jobs WHERE id=?) AND revision=(SELECT revision FROM content WHERE id=versions.content_id) AND ${sqlGuard}`)
      .bind(now, now, jobId, jobId),
    db.prepare(`UPDATE jobs SET state='done',stage='published',updated_at=? WHERE id=? AND ${sqlGuard} AND EXISTS (SELECT 1 FROM versions WHERE content_id=jobs.content_id AND published_at=? AND state='published')`)
      .bind(now, jobId, jobId, now),
  ]);
  return result[1].meta.changes > 0;
}

export async function discover(env: Bindings) {
  if (!env.SOURCE_FEED_URL || !openAI(env)) return;
  const db = env.DB;
  const etagQuery = db.prepare("SELECT value FROM settings WHERE key='source-etag' AND EXISTS (SELECT 1 FROM settings WHERE key='source-feed' AND value=?)").bind(env.SOURCE_FEED_URL);
  const etag = await etagQuery.first<string>('value');
  const feed = await retrieveOfficialFeed(env.SOURCE_FEED_URL, etag ?? undefined);
  if (!feed) return;
  const now = stamp();
  const statements: D1PreparedStatement[] = [];
  for (const item of feed.items) {
    const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(item.sourceUrl));
    const hash = [...new Uint8Array(digest)].map(byte => byte.toString(16).padStart(2, '0')).join('');
    const id = 'source-' + hash.slice(0, 32);
    const publisher = new URL(item.sourceUrl).hostname;
    statements.push(
      db.prepare('INSERT OR IGNORE INTO evidence(id,url,publisher,retrieved_at,source_date,rights,provenance,excerpt,dedupe_key) VALUES(?,?,?,?,?,?,?,?,?)')
        .bind(id, item.sourceUrl, publisher, now, item.sourceDate, 'Source evidence only; confirm reuse before publication.', 'Operator-configured RSS feed', item.excerpt, publisher + ':' + searchText(item.title)),
      db.prepare(`INSERT OR IGNORE INTO jobs(id,kind,content_id,state,stage,payload,created_at,updated_at)
        SELECT ?,'draft',?,'queued','discover',?,?,? FROM evidence WHERE id=?`)
        .bind(id, id, JSON.stringify({ evidence: item }), now, now, id),
    );
  }
  statements.push(
    db.prepare("INSERT OR REPLACE INTO settings(key,value) VALUES('source-feed',?)").bind(env.SOURCE_FEED_URL),
    db.prepare("INSERT OR REPLACE INTO settings(key,value) VALUES('source-etag',?)").bind(feed.etag),
  );
  await db.batch(statements);
}
