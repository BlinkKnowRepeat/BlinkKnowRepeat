import type { APIRoute } from 'astro';
import { bindings } from '../../../lib/bindings';
import { authFor } from '../../../lib/auth';

export const ALL: APIRoute = async ({ request }) => {
  const auth = authFor(bindings);
  if (!auth) return new Response('Google sign-in will be available after setup.', { status: 503, headers: { 'Cache-Control': 'private, no-store' } });
  const response = await auth.handler(request);
  response.headers.set('Cache-Control', 'private, no-store');
  response.headers.set('X-Robots-Tag', 'noindex');
  return response;
};
