-- Newsletter consent records. Status stays 'pending' until an email provider and double opt-in are configured.
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE,
  locale TEXT NOT NULL DEFAULT 'en',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','confirmed','unsubscribed')),
  consent_text TEXT NOT NULL,
  consented_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_newsletter_status ON newsletter_subscribers(status);
