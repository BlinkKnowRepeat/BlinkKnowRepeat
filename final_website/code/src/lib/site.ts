// Site-wide publication identity and navigation.
export const brand = 'Blink, Know, Repeat';
export const publicContactEmail = 'blinkknowrepeat@gmail.com';
export const tagline = 'Understand the world. One blink at a time.';
export const youtube = {
  handle: '@BlinkKnowRepeat',
  channel: 'https://www.youtube.com/@BlinkKnowRepeat',
  premiere: '8VrFrskyNAc',
};

export const socialPlatforms = [
  { name: 'Instagram', icon: 'instagram', setting: 'INSTAGRAM_URL', host: 'instagram.com' },
  { name: 'X', icon: 'x', setting: 'X_URL', host: 'x.com' },
  { name: 'LinkedIn', icon: 'linkedin', setting: 'LINKEDIN_URL', host: 'linkedin.com' },
] as const;

export function socialUrl(value: string | undefined, host: string) {
  if (!value || !URL.canParse(value)) return;
  const url = new URL(value);
  if (url.protocol !== 'https:' || url.hostname.replace(/^www\./, '') !== host || url.pathname === '/' || url.username || url.password) return;
  return url.href;
}

import { sections } from './sections';
export const mainNav = [
  { key: 'news', href: 'news/', en: 'News' },
  ...sections.map(item => ({ key: `section-${item.slug}`, href: `sections/${item.slug}/`, en: item.nav, exclusive: !!item.exclusive })),
  { key: 'research', href: 'research/', en: 'Research & Reports' },
  { key: 'events', href: 'events/', en: 'Events' },
] as { key: string; href: string; en: string; exclusive?: boolean }[];

export const utilityNav = [
  { key: 'approach', href: 'approach/', en: 'Our approach' },
  { key: 'about', href: 'about/', en: 'About' },
  { key: 'contact', href: 'contact/', en: 'Contact' },
] as const;

// Hand-edited labels take precedence. The public copy dictionaries cover the remaining editions.
type Ui = Record<string, string>;
export const ui: Record<string, Ui> = {
  en: { news: 'News', india: 'India', world: 'World', research: 'Research & Reports', events: 'Events', approach: 'Our approach', about: 'About', contact: 'Contact', saved: 'Saved', listen: 'Listen', stop: 'Stop', print: 'Print', save: 'Save', unsave: 'Remove', share: 'Share', copy: 'Copy link', copied: 'Link copied', sources: 'Sources', why: 'Why it matters', blink: 'In a blink', map: 'Mind map', related: 'Related reading', explore: 'Try it', latest: 'Latest', keyword: 'Keyword', from: 'From', to: 'To', topic: 'Topic', allTopics: 'All topics', apply: 'Filter', reset: 'Reset', results: 'stories', none: 'No stories match these filters.', pause: 'Pause', play: 'Play', prev: 'Previous', next: 'Next', theme: 'Switch theme', language: 'Language', subscribe: 'Subscribe', insights: 'Daily Insights', email: 'Email address', read: 'Read story', published: 'Published', checked: 'Checked', level: 'Source level', translated: 'Machine-translated summary. Read the English story for full detail.' },
  hi: { news: 'समाचार', india: 'भारत', world: 'दुनिया', research: 'शोध और रिपोर्ट', events: 'कार्यक्रम', approach: 'हमारा तरीका', about: 'हमारे बारे में', contact: 'संपर्क', saved: 'सहेजे गए', listen: 'सुनें', stop: 'रोकें', print: 'प्रिंट', save: 'सहेजें', unsave: 'हटाएँ', share: 'साझा करें', copy: 'लिंक कॉपी करें', copied: 'लिंक कॉपी हुआ', sources: 'स्रोत', why: 'यह क्यों मायने रखता है', blink: 'एक झलक में', map: 'माइंड मैप', related: 'संबंधित', explore: 'आज़माएँ', latest: 'नवीनतम', keyword: 'कीवर्ड', from: 'से', to: 'तक', topic: 'विषय', allTopics: 'सभी विषय', apply: 'फ़िल्टर', reset: 'रीसेट', results: 'खबरें', none: 'इन फ़िल्टर से कोई खबर नहीं मिली।', pause: 'रोकें', play: 'चलाएँ', prev: 'पिछला', next: 'अगला', theme: 'थीम बदलें', language: 'भाषा', subscribe: 'सदस्यता लें', insights: 'दैनिक अंतर्दृष्टि', email: 'ईमेल पता', read: 'खबर पढ़ें', published: 'प्रकाशित', checked: 'जाँचा गया', level: 'स्रोत स्तर', translated: 'मशीन-अनुवादित सार. पूरी जानकारी के लिए अंग्रेज़ी खबर पढ़ें।' },
  gu: { news: 'સમાચાર', india: 'ભારત', world: 'વિશ્વ', research: 'સંશોધન અને અહેવાલ', events: 'કાર્યક્રમો', approach: 'અમારો અભિગમ', about: 'અમારા વિશે', contact: 'સંપર્ક', saved: 'સાચવેલા', listen: 'સાંભળો', stop: 'બંધ', print: 'પ્રિન્ટ', save: 'સાચવો', unsave: 'દૂર કરો', share: 'શેર કરો', copy: 'લિંક કૉપિ', copied: 'લિંક કૉપિ થઈ', sources: 'સ્રોતો', why: 'આ કેમ મહત્વનું છે', blink: 'એક ઝલકમાં', map: 'માઇન્ડ મૅપ', related: 'સંબંધિત', explore: 'અજમાવો', latest: 'તાજેતરનું', keyword: 'કીવર્ડ', from: 'થી', to: 'સુધી', topic: 'વિષય', allTopics: 'બધા વિષયો', apply: 'ફિલ્ટર', reset: 'રીસેટ', results: 'સમાચાર', none: 'આ ફિલ્ટરથી કોઈ સમાચાર મળ્યા નથી.', pause: 'થોભો', play: 'ચલાવો', prev: 'પાછળ', next: 'આગળ', theme: 'થીમ બદલો', language: 'ભાષા', subscribe: 'સબ્સ્ક્રાઇબ', insights: 'દૈનિક આંતરદૃષ્ટિ', email: 'ઇમેઇલ સરનામું', read: 'સમાચાર વાંચો', published: 'પ્રકાશિત', checked: 'ચકાસેલ', level: 'સ્રોત સ્તર', translated: 'મશીન-અનુવાદિત સારાંશ. સંપૂર્ણ વિગત માટે અંગ્રેજી સમાચાર વાંચો.' },
  mr: { news: 'बातम्या', india: 'भारत', world: 'जग', research: 'संशोधन आणि अहवाल', events: 'कार्यक्रम', approach: 'आमचा दृष्टिकोन', about: 'आमच्याबद्दल', contact: 'संपर्क', saved: 'जतन केलेले', listen: 'ऐका', stop: 'थांबवा', print: 'प्रिंट', save: 'जतन करा', unsave: 'काढा', share: 'शेअर करा', copy: 'लिंक कॉपी', copied: 'लिंक कॉपी झाली', sources: 'स्रोत', why: 'हे का महत्त्वाचे आहे', blink: 'एका झलकेत', map: 'माइंड मॅप', related: 'संबंधित', explore: 'करून पाहा', latest: 'ताजे', keyword: 'कीवर्ड', from: 'पासून', to: 'पर्यंत', topic: 'विषय', allTopics: 'सर्व विषय', apply: 'फिल्टर', reset: 'रीसेट', results: 'बातम्या', none: 'या फिल्टरसाठी बातम्या सापडल्या नाहीत.', pause: 'थांबा', play: 'सुरू करा', prev: 'मागील', next: 'पुढील', theme: 'थीम बदला', language: 'भाषा', subscribe: 'सदस्यता घ्या', insights: 'दैनिक अंतर्दृष्टी', email: 'ईमेल पत्ता', read: 'बातमी वाचा', published: 'प्रकाशित', checked: 'तपासले', level: 'स्रोत पातळी', translated: 'मशीन-अनुवादित सारांश. संपूर्ण माहितीसाठी इंग्रजी बातमी वाचा.' },
};
export const uiFor = (key: string): Ui => ({ ...ui.en, ...(ui[key] ?? {}) });
