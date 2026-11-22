export type Dictionary = Record<string, string>;
const editions = import.meta.glob<Dictionary>('../translations/*.json', { import: 'default' });

const unaltered = new Set(['Blink, Know, Repeat', 'Blink, Know, Repeat RSS', 'GODL–India', 'CC BY-SA 4.0', 'UTC', 'RSS', 'Instagram', 'LinkedIn', 'X', 'Google', 'YouTube', 'WhatsApp', 'Facebook']);

const edited: Partial<Record<string, Dictionary>> = {
  hi: {
    'Home': 'मुखपृष्ठ',
    'Latest news': 'ताज़ा ख़बरें',
    'See all news': 'सभी ख़बरें देखें',
    'Where things stand': 'अभी क्या स्थिति है',
    'Why it matters': 'यह क्यों मायने रखता है',
    'What we could not confirm.': 'जिन बातों की पुष्टि अभी नहीं हुई',
    'Stories': 'लेख',
  },
  gu: { 'Latest news': 'તાજા સમાચાર', 'See all news': 'બધા સમાચાર જુઓ' },
  mr: { 'Latest news': 'ताज्या बातम्या', 'See all news': 'सर्व बातम्या पाहा' },
  ur: { 'Latest news': 'تازہ ترین خبریں', 'See all news': 'تمام خبریں دیکھیں' },
};

export function copyKey(value: string) {
  return value.trim().replace(/\s+/gu, ' ');
}

export async function dictionaryFor(locale: string): Promise<Dictionary> {
  const generated = await editions[`../translations/${locale}.json`]?.();
  return edited[locale] ? { ...generated, ...edited[locale] } : generated ?? {};
}

export function translateCopy(dictionary: Dictionary, value: string): string {
  const key = copyKey(value);
  if (unaltered.has(key)) return value;
  const parts = key.split(' | ');
  if (parts.length > 1) {
    return parts.map(part => translateCopy(dictionary, part)).join(' | ');
  }
  return (Object.hasOwn(dictionary, key) ? dictionary[key] : undefined) ?? value;
}
