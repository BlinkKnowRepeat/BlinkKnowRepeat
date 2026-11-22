import { env } from 'cloudflare:workers';

export interface Bindings extends Env {
  SITE_URL?: string;
  GOOGLE_CLIENT_ID?: string;
  GOOGLE_CLIENT_SECRET?: string;
  BETTER_AUTH_SECRET?: string;
  YOUTUBE_CHANNEL_URL?: string;
  YOUTUBE_VIDEO_ID?: string;
  YOUTUBE_TRANSCRIPT?: string;
  BRAND_OWNER_NAME?: string;
  CONTACT_EMAIL?: string;
  INSTAGRAM_URL?: string;
  X_URL?: string;
  LINKEDIN_URL?: string;
  SUPPORT_EMAIL?: string;
  OPENAI_API_KEY?: string;
  OPENAI_MODEL?: string;
  AI_DAILY_MAX_JOBS?: string;
  AI_DAILY_BUDGET_MICROUSD?: string;
  AI_JOB_RESERVE_MICROUSD?: string;
  SOURCE_FEED_URL?: string;
  FIXTURE_EDITOR?: string;
}
export const bindings: Bindings = env;

export function siteOrigin(configuredUrl: string | undefined, fallback: string): string {
  if (!configuredUrl || !URL.canParse(configuredUrl)) return fallback;
  const url = new URL(configuredUrl);
  return ['http:', 'https:'].includes(url.protocol) ? url.origin : fallback;
}
