import type { APIRoute } from 'astro';
import { bindings } from '../../lib/bindings';
import { locales } from '../../lib/locales';

export const prerender = false;
const json = (body: object, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });

// Stores the address and consent time. Without an email provider nothing is sent, and the reply says so.
export const POST: APIRoute = async ({ request, url }) => {
  if (request.headers.get('origin') !== url.origin) return json({ message: 'Request not allowed.' }, 403);
  if (!(request.headers.get('content-type') ?? '').includes('application/json')) return json({ message: 'Unsupported request.' }, 415);
  let body: { email?: unknown; website?: unknown; locale?: unknown };
  try { body = await request.json(); } catch { return json({ message: 'Invalid request.' }, 400); }
  if (typeof body.website === 'string' && body.website) return json({ message: 'Thanks.' }); // honeypot: pretend success
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return json({ message: 'Please enter a valid email address.' }, 400);
  const locale = locales.find(l => l.key === body.locale)?.key ?? 'en';
  if (!bindings.DB) return json({ message: 'Subscriptions are not available right now.' }, 503);
  try {
    await bindings.DB.prepare(`INSERT INTO newsletter_subscribers (email, locale, consent_text, consented_at) VALUES (?1, ?2, ?3, ?4)
      ON CONFLICT(email) DO NOTHING`).bind(email, locale, 'Daily Insights email; see Privacy Policy', new Date().toISOString()).run();
  } catch (error) {
    console.error('subscribe failed', String(error).slice(0, 200));
    return json({ message: 'Subscriptions are not available right now.' }, 503);
  }
  return json({ message: 'Email address saved. The newsletter has not started yet.' });
};
