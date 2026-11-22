import { betterAuth } from 'better-auth';
import type { Bindings } from './bindings';

type Role = 'reader' | 'editor' | 'administrator';
export type Viewer = { id: string; name: string; role: Role };

export function authFor(env: Bindings) {
  const { SITE_URL: baseURL, GOOGLE_CLIENT_ID: clientId, GOOGLE_CLIENT_SECRET: clientSecret, BETTER_AUTH_SECRET: secret } = env;
  if (!baseURL || !URL.canParse(baseURL) || !clientId || !clientSecret || !secret || secret.length < 32 || !env.DB) return null;
  const url = new URL(baseURL);
  const local = url.protocol === 'http:' && ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname);
  if (baseURL.replace(/\/$/, '') !== url.origin || (!local && url.protocol !== 'https:')) return null;
  return betterAuth({
    appName: 'Blink, Know, Repeat',
    database: env.DB,
    baseURL: url.origin,
    secret,
    trustedOrigins: [url.origin],
    socialProviders: { google: { clientId, clientSecret, scope: ['openid', 'email', 'profile'] } },
    account: { accountLinking: { enabled: false }, encryptOAuthTokens: true },
    advanced: { useSecureCookies: !local, ipAddress: { ipAddressHeaders: ['cf-connecting-ip'] } },
    rateLimit: { enabled: true, storage: 'database', window: 60, max: 90, customRules: { '/sign-in/social': { window: 60, max: 8 } } },
    session: { expiresIn: 60 * 60 * 24 * 7 },
  });
}

export async function currentUser(request: Request, env: Bindings): Promise<Viewer | null> {
  const url = new URL(request.url);
  if (import.meta.env.DEV && env.FIXTURE_EDITOR === 'true' && ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname)) {
    return { id: 'local-fixture-editor', name: 'Local fixture editor (development only)', role: 'administrator' };
  }
  const auth = authFor(env);
  if (!auth) return null;
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return null;
  const { id, name } = session.user;
  const role = await env.DB.prepare('SELECT role FROM roles WHERE user_id=?').bind(id).first<Role>('role') ?? 'reader';
  return { id, name, role };
}

export function sameOrigin(request: Request, env: Bindings): boolean {
  return request.headers.get('Origin') === (env.SITE_URL ? new URL(env.SITE_URL).origin : new URL(request.url).origin);
}
