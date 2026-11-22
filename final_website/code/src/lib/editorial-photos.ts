export type EditorialPhoto = {
  file: string;
  alt: string;
  credit: string;
  source: string;
  caption?: string;
  license?: { label: string; url: string };
  position?: string;
};

export const mumbaiPhoto: EditorialPhoto = {
  file: '/editorial/mumbai.webp',
  alt: 'People gathered along Marine Drive beside the Arabian Sea in Mumbai',
  credit: 'Zoshua Colah',
  source: 'https://unsplash.com/photos/city-skyline-and-water-under-a-cloudy-sky-m6ZynNNWhvw',
};

const phone: EditorialPhoto = {
  file: '/editorial/phone.webp',
  alt: 'Hands holding a smartphone',
  credit: 'Nathan Dumlao',
  source: 'https://unsplash.com/photos/person-holding-black-smartphone-on-white-paper-y440_q4e-0E',
};
const sunset: EditorialPhoto = {
  file: '/editorial/sunset.webp',
  alt: 'Orange and blue clouds at sunset over Delhi',
  credit: 'Dewang Gupta',
  source: 'https://unsplash.com/photos/blue-and-orange-cloudy-sky-during-sunset-Et9LYhnBC28',
};
const market: EditorialPhoto = {
  file: '/editorial/market.webp',
  alt: 'Fresh vegetables arranged on a market stall',
  credit: 'Nina Weishaupt',
  source: 'https://unsplash.com/photos/fresh-vegetables-and-produce-displayed-at-a-market-nwpPqHpFge4',
};
const nvidia: EditorialPhoto = {
  file: '/editorial/nvidia.webp',
  alt: 'Two NVIDIA Titan X graphics cards side by side',
  caption: 'NVIDIA Titan X cards, shown for illustration',
  credit: 'Back2Gaming',
  source: 'https://unsplash.com/photos/two-nvidia-titan-x-graphics-cards-side-by-side-hyiNFISCPm8',
};
const atlas: EditorialPhoto = {
  file: '/editorial/atlas.webp',
  alt: 'A close-up of a printed map',
  credit: 'Daria Nepriakhina',
  source: 'https://unsplash.com/photos/a-close-up-of-a-map-of-the-world-pZA4eNKBz20',
};

const chipRule: EditorialPhoto = {
  file: '/editorial/chip-rule.webp',
  alt: 'Blue light paths glowing over a computer circuit board',
  credit: 'Luke Jones',
  source: 'https://unsplash.com/photos/tBvF46kmwBw',
};
const portPhoto: EditorialPhoto = {
  file: '/editorial/port.webp',
  alt: 'Container ship and cranes at a busy shipping port',
  credit: 'Haris Illahi',
  source: 'https://unsplash.com/photos/ip0yX8W1veE',
};
const waferPhoto: EditorialPhoto = {
  file: '/editorial/wafer.webp',
  alt: 'A silicon wafer beside semiconductor test equipment',
  credit: 'L N',
  source: 'https://unsplash.com/photos/rQP6zTJ85Qk',
};
const tvApps: EditorialPhoto = {
  file: '/editorial/tv-apps.webp',
  alt: 'A television showing a grid of streaming app icons',
  credit: 'Nicolas J Leclercq',
  source: 'https://unsplash.com/photos/qDLLP0yP7FU',
};
const smartTv: EditorialPhoto = {
  file: '/editorial/smart-tv.webp',
  alt: 'A hand holding a smartphone in front of a smart TV with streaming apps',
  credit: 'Jakub Żerdzicki',
  source: 'https://unsplash.com/photos/9iH9TNBpAkw',
};
const freight: EditorialPhoto = {
  file: '/editorial/freight.webp',
  alt: 'A tank car on a freight train crossing a bridge',
  credit: 'Robin Jonathan Deutsch',
  source: 'https://unsplash.com/photos/c5zFw1FiapE',
};
const glassOffice: EditorialPhoto = {
  file: '/editorial/glass-office.webp',
  alt: 'The glass facade of a modern office building',
  credit: 'Fabian Kleiser',
  source: 'https://unsplash.com/photos/V5vF94h52r0',
};
const priceSigns: EditorialPhoto = {
  file: '/editorial/price-signs.webp',
  alt: 'A shop window covered in handwritten price signs',
  credit: 'Mirna Wabi-Sabi',
  source: 'https://unsplash.com/photos/YdHEHUzI_no',
};
const memoryModule: EditorialPhoto = {
  file: '/editorial/memory.webp',
  alt: 'A close-up of a laptop memory module',
  credit: 'OMAR SABRA',
  source: 'https://unsplash.com/photos/g5vkrp5N6S8',
};
const repairPhoto: EditorialPhoto = {
  file: '/editorial/repair.webp',
  alt: 'Gloved hands repairing a disassembled smartphone',
  credit: 'Vitalijus',
  source: 'https://unsplash.com/photos/6E3oMj688Nk',
};

const editorialPhotos: Partial<Record<string, EditorialPhoto>> = {
  'wifi-packet': phone,
  'what-happens-when-you-tap-send': phone,
  'why-the-sky-is-blue': sunset,
  'reading-an-inflation-number': market,
  'generative-ai-basics': nvidia,
  'reading-a-map': atlas,
  'gold-falls-from-january-record': {
    file: '/editorial/gold.webp',
    alt: 'Gold bullion bars stacked on a dark surface',
    credit: 'Scottsdale Mint',
    source: 'https://unsplash.com/photos/several-gold-bars-stacked-on-a-dark-surface-tBTv7T9WFmM',
  },
  'nvidia-q3-fy27-record-revenue': nvidia,
  'us-ai-chip-rule-remote-access': chipRule,
  'chip-licences-southeast-asia-brazil': portPhoto,
  'india-approves-12-chip-projects': waferPhoto,
  'discovery-plus-price-rise-decoded': tvApps,
  'streaming-bundle-costs-add-up': smartTv,
  'surveillance-pricing-rules-widen': priceSigns,
  'memory-shortage-raises-device-prices': memoryModule,
  'right-to-repair-spreads-across-states': repairPhoto,
  'union-pacific-norfolk-southern-review-timeline': freight,
  'equitable-corebridge-all-stock-merger': glassOffice,
  'rbi-policy-corridor-explained': {
    file: '/editorial/rbi.webp',
    alt: 'The Reserve Bank of India building in Mumbai',
    caption: 'Reserve Bank of India, Mumbai (cropped)',
    credit: 'Anurag Vijay 03',
    source: 'https://commons.wikimedia.org/wiki/File:Reserve_Bank_Of_India_-_RBI_Mumbai.jpg',
    license: { label: 'CC BY-SA 4.0', url: 'https://creativecommons.org/licenses/by-sa/4.0/' },
  },
  'cop31-antalya-talks-deadlocked': {
    file: '/editorial/antalya.webp',
    alt: 'Boats in the harbour beside Antalya’s old town',
    caption: 'Antalya, Türkiye, photographed in 2022',
    credit: 'Igor Sporynin',
    source: 'https://unsplash.com/photos/a-harbor-filled-with-lots-of-boats-next-to-a-city-yqTO4f90Ufw',
  },
  'gaganyaan-g1-launch-timing': {
    file: '/editorial/gaganyaan.webp',
    alt: 'Close-up of the Gaganyaan TV-D1 test vehicle',
    caption: 'Gaganyaan TV-D1 test vehicle, 2023 (cropped)',
    credit: 'Indian Space Research Organisation',
    source: 'https://commons.wikimedia.org/wiki/File:Gaganyaan_vehicle_used_for_TVD1_mission.webp',
    license: { label: 'GODL–India', url: 'https://commons.wikimedia.org/wiki/Template:GODL-India' },
    position: 'center 36%',
  },
};

const topicPhotos: Record<'ai' | 'economy' | 'india' | 'science' | 'technology' | 'world', EditorialPhoto> = {
  ai: nvidia, economy: market, india: mumbaiPhoto, science: sunset, technology: phone, world: atlas,
};

export function photoFor(id: string, topic: keyof typeof topicPhotos): EditorialPhoto {
  return (Object.hasOwn(editorialPhotos, id) ? editorialPhotos[id] : undefined) ?? topicPhotos[topic];
}
