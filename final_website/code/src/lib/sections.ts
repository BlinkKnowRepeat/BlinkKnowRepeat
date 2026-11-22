import { getPost } from './posts';
// Editorial sections shown as navigation tabs. Each post belongs to one section only, and only News posts are listed (explainers have their own section on the homepage). `exclusive` marks desks reported only by this portal.
export interface Section {
  slug: string; nav: string; title: string; focus: string; insightTitle: string; insight: string;
  angles: string[]; icon: string; posts: string[]; exclusive?: boolean;
}
export const sections: Section[] = [
  { slug: 'tech-power', icon: 'technology', posts: ['us-ai-chip-rule-remote-access', 'chip-licences-southeast-asia-brazil', 'india-approves-12-chip-projects', 'gaganyaan-g1-launch-timing'], nav: 'Tech & Power', title: 'Tech & Power',
    focus: 'Semiconductors, cloud infrastructure, undersea cables, export bans, and digital sovereignty.',
    insightTitle: 'Chokepoint & Leverage Insights',
    insight: 'Shows who holds the real leverage behind tech news and how hardware decisions turn into geopolitical weapons.',
    angles: ['How phone chips became a national security issue', 'The 3 companies that can quietly halt the global AI race'] },
  { slug: 'ai-capital', icon: 'ai', posts: ['nvidia-q3-fy27-record-revenue'], nav: 'AI & Capital', title: 'AI & Capital', exclusive: true,
    focus: 'AI economics, compute costs, energy demand, labor shifts, and business viability.',
    insightTitle: 'Follow-the-Money Insights',
    insight: 'Cuts through AI hype to reveal who is actually making money, who is burning cash, and which industries are being repriced.',
    angles: ['Why AI labs are buying nuclear power plants', 'The real unit economics behind "free" AI chatbots'] },
  { slug: 'corporate-decoded', icon: 'briefcase', posts: ['discovery-plus-price-rise-decoded', 'streaming-bundle-costs-add-up', 'union-pacific-norfolk-southern-review-timeline', 'equitable-corebridge-all-stock-merger'], nav: 'Corporate Decoded', title: 'Corporate Decoded',
    focus: 'Executive strategy, pricing psychology, enshittification, mergers, and corporate spin.',
    insightTitle: 'Incentive & Jargon Translation',
    insight: 'Translates 47-slide corporate buzzwords into plain English, exposing the hidden business model behind frustrating product changes.',
    angles: ['Why a CEO needs 47 slides to explain a "simpler strategy"', 'How "free" loyalty apps operate like unregulated banks'] },
  { slug: 'everyday-systems', icon: 'home', posts: ['surveillance-pricing-rules-widen', 'memory-shortage-raises-device-prices', 'right-to-repair-spreads-across-states'], nav: 'Everyday Systems', title: 'Everyday Systems',
    focus: 'Smart appliances, dynamic pricing, supply quirks, and everyday tech annoyances.',
    insightTitle: 'Micro-Economics & Design Insights',
    insight: 'Unpacks the weird incentives behind ordinary products, giving readers "I never thought of that" shareable facts.',
    angles: ['Why does your toaster need Wi-Fi?', 'Why printer ink costs more per liter than jet fuel'] },
  { slug: 'global-shifts', icon: 'world', posts: ['cop31-antalya-talks-deadlocked', 'gold-falls-from-january-record', 'rbi-policy-corridor-explained'], nav: 'Global Shifts', title: 'Global Shifts', exclusive: true,
    focus: 'Trade routes, energy transitions, demographics, currency shifts, and macro supply chains.',
    insightTitle: 'Macro-to-Personal Insights',
    insight: 'Connects distant world events directly to everyday consequences: prices, jobs, and what changes over the next 5 years.',
    angles: ['How one blocked shipping lane raises your grocery bill', 'The demographic cliff quietly rewiring global factories'] },
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
