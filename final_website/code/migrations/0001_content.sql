CREATE TABLE content (
  id TEXT PRIMARY KEY,
  original_locale TEXT NOT NULL,
  revision INTEGER NOT NULL DEFAULT 1 CHECK(revision > 0),
  type TEXT NOT NULL CHECK(type IN ('brief','explainer','lesson','video')),
  topic TEXT NOT NULL CHECK(topic IN ('world','technology','ai','science','economy')),
  demo INTEGER NOT NULL DEFAULT 0 CHECK(demo IN (0,1)),
  event_at TEXT,
  scheduled_at TEXT
);
CREATE TABLE versions (
  content_id TEXT NOT NULL REFERENCES content(id),
  locale TEXT NOT NULL,
  revision INTEGER NOT NULL,
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  significance TEXT NOT NULL,
  body TEXT NOT NULL CHECK(json_valid(body)),
  minutes INTEGER NOT NULL CHECK(minutes BETWEEN 1 AND 240),
  state TEXT NOT NULL CHECK(state IN ('queued','machine-draft','needs-review','approved','published','stale','failed')),
  method TEXT NOT NULL DEFAULT 'manual',
  sources TEXT NOT NULL DEFAULT '[]' CHECK(json_valid(sources)),
  media TEXT CHECK(media IS NULL OR json_valid(media)),
  search_text TEXT NOT NULL,
  published_at TEXT,
  updated_at TEXT NOT NULL,
  PRIMARY KEY(content_id, locale, revision),
  CHECK(state <> 'published' OR published_at IS NOT NULL)
);
CREATE INDEX public_versions ON versions(locale, state, updated_at DESC);
CREATE INDEX content_topic ON content(topic, type);
CREATE TABLE evidence (
  id TEXT PRIMARY KEY,
  url TEXT,
  publisher TEXT NOT NULL,
  retrieved_at TEXT NOT NULL,
  source_date TEXT,
  event_date TEXT,
  rights TEXT NOT NULL,
  provenance TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  dedupe_key TEXT NOT NULL UNIQUE
);
CREATE TABLE jobs (
  id TEXT PRIMARY KEY,
  kind TEXT NOT NULL CHECK(kind IN ('fixture','draft','translate')),
  content_id TEXT NOT NULL,
  state TEXT NOT NULL CHECK(state IN ('queued','running','review','done','failed')),
  stage TEXT NOT NULL,
  payload TEXT NOT NULL CHECK(json_valid(payload)),
  attempts INTEGER NOT NULL DEFAULT 0,
  next_at INTEGER NOT NULL DEFAULT 0,
  lease_until INTEGER,
  lease_token TEXT,
  error TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE INDEX runnable_jobs ON jobs(state, next_at, lease_until);
CREATE TABLE audit (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  actor TEXT NOT NULL,
  action TEXT NOT NULL,
  target TEXT NOT NULL,
  at TEXT NOT NULL
);
CREATE TABLE public_state (
  locale TEXT PRIMARY KEY,
  version INTEGER NOT NULL DEFAULT 0
);
CREATE TRIGGER version_published_insert AFTER INSERT ON versions WHEN NEW.state = 'published'
BEGIN
  INSERT INTO public_state(locale,version) VALUES(NEW.locale,1) ON CONFLICT(locale) DO UPDATE SET version=version+1;
END;
CREATE TRIGGER version_published_update AFTER UPDATE ON versions WHEN NEW.state = 'published' OR OLD.state = 'published'
BEGIN
  INSERT INTO public_state(locale,version) VALUES(NEW.locale,1) ON CONFLICT(locale) DO UPDATE SET version=version+1;
END;
CREATE TRIGGER version_published_delete AFTER DELETE ON versions WHEN OLD.state = 'published'
BEGIN
  INSERT INTO public_state(locale,version) VALUES(OLD.locale,1) ON CONFLICT(locale) DO UPDATE SET version=version+1;
END;
CREATE TRIGGER original_revision_changed AFTER UPDATE OF revision ON content WHEN NEW.revision > OLD.revision
BEGIN
  UPDATE versions SET state='stale' WHERE content_id=NEW.id AND revision<NEW.revision AND state NOT IN ('stale','failed');
END;
CREATE TABLE settings (key TEXT PRIMARY KEY, value TEXT NOT NULL);
CREATE TABLE glossary (locale TEXT NOT NULL, term TEXT NOT NULL, translation TEXT NOT NULL, PRIMARY KEY(locale,term));
CREATE TABLE generation_usage (
  id INTEGER PRIMARY KEY AUTOINCREMENT, job_id TEXT NOT NULL REFERENCES jobs(id), provider TEXT NOT NULL, model TEXT NOT NULL,
  locale TEXT NOT NULL, input_tokens INTEGER, output_tokens INTEGER, reserved_microusd INTEGER NOT NULL,
  created_at TEXT NOT NULL
);
CREATE TABLE corrections (
  id INTEGER PRIMARY KEY AUTOINCREMENT, content_id TEXT NOT NULL REFERENCES content(id), revision INTEGER NOT NULL,
  note TEXT NOT NULL, actor TEXT NOT NULL, at TEXT NOT NULL
);
