import { getPost } from './posts';
// Editorial sections shown as navigation tabs. Each post belongs to one section only, and only News posts are listed (explainers have their own section on the homepage). `exclusive` marks desks reported only by this portal.
export interface Section {
  slug: string; nav: string; title: string; focus: string;
  icon: string; posts: string[]; exclusive?: boolean;
}
export const sections: Section[] = [
  { slug: 'tech-power', icon: 'technology', posts: ['us-ai-chip-rule-remote-access', 'chip-licences-southeast-asia-brazil', 'india-approves-12-chip-projects', 'gaganyaan-g1-launch-timing'], nav: 'Tech & Power', title: 'Tech & Power',
    focus: 'Semiconductors, cloud infrastructure, undersea cables, export bans, and digital sovereignty.' },
  { slug: 'ai-capital', icon: 'ai', posts: ['nvidia-q3-fy27-record-revenue'], nav: 'AI & Capital', title: 'AI & Capital', exclusive: true,
    focus: 'AI economics, compute costs, energy demand, labor shifts, and business viability.' },
  { slug: 'corporate-decoded', icon: 'briefcase', posts: ['discovery-plus-price-rise-decoded', 'streaming-bundle-costs-add-up', 'union-pacific-norfolk-southern-review-timeline', 'equitable-corebridge-all-stock-merger'], nav: 'Corporate Decoded', title: 'Corporate Decoded',
    focus: 'Executive strategy, pricing psychology, enshittification, mergers, and corporate spin.' },
  { slug: 'everyday-systems', icon: 'home', posts: ['surveillance-pricing-rules-widen', 'memory-shortage-raises-device-prices', 'right-to-repair-spreads-across-states'], nav: 'Everyday Systems', title: 'Everyday Systems',
    focus: 'Smart appliances, dynamic pricing, supply quirks, and everyday tech annoyances.' },
  { slug: 'global-shifts', icon: 'world', posts: ['cop31-antalya-talks-deadlocked', 'gold-falls-from-january-record', 'rbi-policy-corridor-explained'], nav: 'Global Shifts', title: 'Global Shifts', exclusive: true,
    focus: 'Trade routes, energy transitions, demographics, currency shifts, and macro supply chains.' },
];

// Fail loudly if a post is filed under two sections, or an explainer is filed under any section.
const filed = new Map<string, string>();
for (const section of sections) for (const slug of section.posts) {
  const post = getPost(slug);
  if (!post) throw new Error(`Section "${section.slug}" lists unknown post "${slug}".`);
  if (post.kind !== 'News') throw new Error(`Section "${section.slug}" lists explainer "${slug}". Sections carry news only.`);
  if (filed.has(slug)) throw new Error(`Post "${slug}" is in both "${filed.get(slug)}" and "${section.slug}". Use one section per post.`);
  filed.set(slug, section.slug);
}
