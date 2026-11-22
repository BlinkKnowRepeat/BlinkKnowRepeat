import type { APIRoute } from 'astro';
import { z } from 'zod';
import { bindings } from '../../../lib/bindings';
import { catalog } from '../../../lib/catalog';
import { locales } from '../../../lib/locales';

const storyboard = z.object({
  format: z.literal(1),
  contentId: z.string().regex(/^[a-z0-9-]{1,80}$/),
  language: z.string(),
  title: z.string().min(1).max(180),
  educationalDemo: z.boolean(),
  scenes: z.array(z.object({ label: z.string().min(1).max(160), narration: z.string().min(1).max(2200) })).min(1).max(8),
});

export const GET: APIRoute = async ({ params }) => {
  const match = /^([a-z]{2,3})\/([a-z0-9-]{1,80})$/.exec(params.edition ?? '');
  const locale = locales.find(item => item.key === match?.[1]);
  if (!locale || !match) return new Response(null, { status: 404 });
  const [story] = await catalog(bindings.DB, { id: match[2], locale: locale.key, limit: 1 });
  if (!story) return new Response(null, { status: 404 });
  const exportData = storyboard.safeParse({
    format: 1, contentId: story.id, language: locale.tag, title: story.title, educationalDemo: story.demo,
    scenes: story.body.map(part => ({ label: part.heading, narration: part.text })),
  });
  if (!exportData.success) return new Response(null, { status: 422 });
  return Response.json(exportData.data, { headers: {
    'Content-Disposition': `attachment; filename="${story.id}-${locale.key}-storyboard.json"`,
    'X-Robots-Tag': 'noindex',
    'Cache-Control': 'no-cache',
  } });
};
