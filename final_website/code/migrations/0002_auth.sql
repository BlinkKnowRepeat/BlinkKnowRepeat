CREATE TABLE "user" (
  "id" TEXT PRIMARY KEY NOT NULL, "name" TEXT NOT NULL, "email" TEXT NOT NULL UNIQUE, "emailVerified" INTEGER NOT NULL,
  "image" TEXT, "createdAt" DATE NOT NULL, "updatedAt" DATE NOT NULL
);
CREATE TABLE "session" (
  "id" TEXT PRIMARY KEY NOT NULL, "expiresAt" DATE NOT NULL, "token" TEXT NOT NULL UNIQUE,
  "createdAt" DATE NOT NULL, "updatedAt" DATE NOT NULL, "ipAddress" TEXT, "userAgent" TEXT,
  "userId" TEXT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE
);
CREATE INDEX auth_sessions_by_user ON "session"("userId");
CREATE TABLE "account" (
  "id" TEXT PRIMARY KEY NOT NULL, "accountId" TEXT NOT NULL, "providerId" TEXT NOT NULL,
  "userId" TEXT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "accessToken" TEXT, "refreshToken" TEXT, "idToken" TEXT, "accessTokenExpiresAt" DATE, "refreshTokenExpiresAt" DATE,
  "scope" TEXT, "password" TEXT, "createdAt" DATE NOT NULL, "updatedAt" DATE NOT NULL,
  UNIQUE("providerId", "accountId")
);
CREATE INDEX auth_accounts_by_user ON "account"("userId");
CREATE TABLE "verification" (
  "id" TEXT PRIMARY KEY NOT NULL, "identifier" TEXT NOT NULL, "value" TEXT NOT NULL,
  "expiresAt" DATE NOT NULL, "createdAt" DATE NOT NULL, "updatedAt" DATE NOT NULL
);
CREATE INDEX auth_verification_identifier ON "verification"("identifier");
CREATE TABLE "rateLimit" (
  "id" TEXT PRIMARY KEY NOT NULL, "key" TEXT NOT NULL UNIQUE, "count" INTEGER NOT NULL, "lastRequest" INTEGER NOT NULL
);
CREATE TABLE roles (
  user_id TEXT PRIMARY KEY REFERENCES "user"("id") ON DELETE CASCADE,
  role TEXT NOT NULL CHECK(role IN ('reader','editor','administrator'))
);
CREATE TABLE bookmarks (
  user_id TEXT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  content_id TEXT NOT NULL REFERENCES content(id), saved_at TEXT NOT NULL,
  PRIMARY KEY(user_id,content_id)
);
