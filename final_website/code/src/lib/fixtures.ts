import type { Locale } from './locales';

export type Story = {
  id: string;
  locale: Locale['key'];
  type: 'explainer' | 'lesson' | 'brief' | 'video';
  topic: 'world' | 'technology' | 'ai' | 'science' | 'economy';
  title: string;
  summary: string;
  significance: string;
  body: { heading: string; text: string }[];
  minutes: number;
  demo: boolean;
  updated: string;
  published: string;
  sources: { title: string; url: string }[];
  originalLocale?: Locale['key'];
  attribution?: 'ai-assisted';
  media?: { youtubeId: string; transcript: string; captions: boolean };
};

const published = '2026-11-22T08:00:00.000Z';
const wifi = { id: 'wifi-packet', type: 'explainer', topic: 'technology', minutes: 4, demo: true, published, updated: published,
  sources: [{ title: 'IETF RFC 8200: Internet Protocol, Version 6', url: 'https://www.rfc-editor.org/rfc/rfc8200' }] } as const;

type WifiCopy = Pick<Story, 'locale' | 'title' | 'summary' | 'significance' | 'body'>;
const wifiCopies: WifiCopy[] = [
  { locale: 'en', title: 'What happens when you tap send?', summary: 'Follow one tiny packet from your phone, through your router, and out into the internet.',
    significance: 'Knowing where the wireless link ends helps you distinguish a home Wi-Fi problem from a problem farther along the internet route.',
    body: [
      { heading: 'Your phone prepares the data', text: 'When you send a message, the app turns what you typed into data. Network software packages data for delivery. A packet carries part of that data alongside information the network uses to move it toward its destination.' },
      { heading: 'Wi-Fi is the first hop', text: 'Your phone uses radio waves to reach your Wi-Fi access point. In many homes, the access point and router share one box. The wireless hop ends at the access point, while the router forwards the packet toward your internet provider.' },
      { heading: 'The network takes it from there', text: 'Routers forward packets along the network. A message may go to a service before the recipient receives it. The diagram simplifies the trip and leaves out encryption, retransmissions, and other details that vary by app.' },
    ] },
  { locale: 'hi', title: 'भेजें दबाते ही क्या होता है?', summary: 'देखें कि डेटा का एक छोटा पैकेट आपके फ़ोन से राउटर होते हुए इंटरनेट तक कैसे पहुँचता है।',
    significance: 'वायरलेस कड़ी कहाँ खत्म होती है, यह समझने से आप घर के वाई-फ़ाई की समस्या और इंटरनेट के आगे के रास्ते की समस्या में फ़र्क कर सकते हैं।',
    body: [
      { heading: 'फ़ोन डेटा तैयार करता है', text: 'संदेश भेजने पर ऐप आपके लिखे शब्दों को डेटा में बदलता है। नेटवर्क सॉफ़्टवेयर उसे भेजने के लिए तैयार करता है। पैकेट में डेटा के एक हिस्से के साथ वह जानकारी भी होती है जिसकी मदद से नेटवर्क उसे मंज़िल की ओर बढ़ाता है।' },
      { heading: 'पहला पड़ाव वाई-फ़ाई है', text: 'फ़ोन रेडियो तरंगों से आपके वाई-फ़ाई एक्सेस पॉइंट तक पहुँचता है। कई घरों में एक्सेस पॉइंट और राउटर एक ही डिब्बे में होते हैं। वायरलेस कड़ी एक्सेस पॉइंट पर खत्म होती है और राउटर पैकेट को इंटरनेट सेवा प्रदाता की ओर भेजता है।' },
      { heading: 'आगे का सफ़र नेटवर्क पर', text: 'राउटर पैकेट को नेटवर्क में आगे बढ़ाते हैं। पाने वाले तक पहुँचने से पहले संदेश किसी सेवा के पास जा सकता है। चित्र में रास्ते को सरल रखा गया है। एन्क्रिप्शन और दोबारा भेजने जैसे विवरण ऐप पर निर्भर करते हैं।' },
    ] },
  { locale: 'gu', title: 'મોકલો દબાવતાં શું થાય છે?', summary: 'ડેટાનું નાનું પૅકેટ તમારા ફોનથી રાઉટર મારફતે ઇન્ટરનેટ સુધી કેવી રીતે પહોંચે છે તે જુઓ.',
    significance: 'વાયરલેસ જોડાણ ક્યાં પૂરું થાય છે તે સમજવાથી ઘરનાં વાઇ-ફાઇની ખામી અને ઇન્ટરનેટના આગળના માર્ગની ખામી વચ્ચેનો ભેદ સમજાય છે.',
    body: [
      { heading: 'ફોન ડેટા તૈયાર કરે છે', text: 'તમે સંદેશ મોકલો ત્યારે ઍપ લખાણને ડેટામાં ફેરવે છે. નેટવર્ક સૉફ્ટવેર ડેટાને મોકલવા માટે તૈયાર કરે છે. પૅકેટમાં ડેટાનો એક ભાગ અને તેને ગંતવ્ય તરફ મોકલવા માટેની માહિતી હોય છે.' },
      { heading: 'વાઇ-ફાઇ પહેલું પગલું છે', text: 'ફોન રેડિયો તરંગોથી વાઇ-ફાઇ ઍક્સેસ પૉઇન્ટ સુધી પહોંચે છે. ઘણાં ઘરોમાં ઍક્સેસ પૉઇન્ટ અને રાઉટર એક જ ઉપકરણમાં હોય છે. વાયરલેસ કડી ઍક્સેસ પૉઇન્ટ પર પૂરી થાય છે અને રાઉટર પૅકેટને ઇન્ટરનેટ સેવા પ્રદાતા તરફ મોકલે છે.' },
      { heading: 'આગળનું કામ નેટવર્ક કરે છે', text: 'રાઉટરો પૅકેટને નેટવર્કમાં આગળ મોકલે છે. મેળવનારને મળે તે પહેલાં સંદેશ કોઈ સેવા સુધી જઈ શકે છે. ચિત્ર પ્રવાસને સરળ બનાવે છે. એન્ક્રિપ્શન અને ફરી મોકલવાની પ્રક્રિયા જેવી વિગતો ઍપ પ્રમાણે બદલાય છે.' },
    ] },
  { locale: 'mr', title: 'पाठवा दाबल्यावर काय होतं?', summary: 'डेटाचे छोटे पॅकेट तुमच्या फोनमधून राउटरमार्गे इंटरनेटपर्यंत कसे जाते ते पाहा.',
    significance: 'बिनतारी जोडणी कुठे संपते हे कळल्यावर घरच्या वाय-फायमधला दोष आणि इंटरनेटच्या पुढच्या मार्गातला दोष वेगळे ओळखता येतात.',
    body: [
      { heading: 'फोन डेटा तयार करतो', text: 'संदेश पाठवल्यावर ॲप तुमचा मजकूर डेटामध्ये रूपांतरित करते. नेटवर्क सॉफ्टवेअर तो पाठवण्यासाठी तयार करते. पॅकेटमध्ये डेटाचा काही भाग आणि तो गंतव्याकडे पाठवण्यासाठी लागणारी माहिती असते.' },
      { heading: 'वाय-फाय हा पहिला टप्पा', text: 'फोन रेडिओ लहरींमधून वाय-फाय ॲक्सेस पॉइंटपर्यंत पोहोचतो. अनेक घरांमध्ये ॲक्सेस पॉइंट आणि राउटर एकाच उपकरणात असतात. बिनतारी टप्पा ॲक्सेस पॉइंटवर संपतो आणि राउटर पॅकेट इंटरनेट सेवा पुरवठादाराकडे पाठवतो.' },
      { heading: 'पुढचा प्रवास नेटवर्कमधून', text: 'राउटर पॅकेट नेटवर्कमध्ये पुढे पाठवतात. संदेश प्राप्तकर्त्यापर्यंत येण्याआधी एखाद्या सेवेकडे जाऊ शकतो. चित्रात प्रवास सोपा करून दाखवला आहे. कूटलेखन आणि पुन्हा पाठवण्यासारखे तपशील ॲपनुसार बदलतात.' },
    ] },
];

function demo(id: string, topic: Story['topic'], type: Story['type'], title: string, summary: string, significance: string, body: Story['body'], minutes = 3): Story {
  return { id, topic, type, title, summary, significance, body, minutes, locale: 'en', originalLocale: 'en', published, updated: published, sources: [], demo: true, attribution: 'ai-assisted' };
}

export const fixtures: Story[] = [
  ...wifiCopies.map(copy => ({ ...wifi, ...copy, attribution: 'ai-assisted' as const, originalLocale: 'en' as const, sources: [...wifi.sources] })),
  demo('why-the-sky-is-blue', 'science', 'explainer', 'Why is the sky blue?', 'Follow sunlight through the atmosphere to see where the blue comes from.',
    'Scattering explains why the same Sun can make the sky look blue at noon and orange near sunset.',
    [{ heading: 'Sunlight meets air', text: 'Sunlight contains a range of visible wavelengths. Small molecules in the atmosphere scatter shorter visible wavelengths more strongly than longer ones.' }, { heading: 'At sunset', text: 'When the Sun is low, its direct light passes through more atmosphere. More blue light is scattered out of the direct path, leaving proportionally more red and orange light.' }]),
  demo('reading-an-inflation-number', 'economy', 'explainer', 'What does an inflation number tell you?', 'Learn how an index can rise even while some prices fall.',
    'An overall index describes the change in a weighted basket. A household that buys a different mix may experience different price changes.',
    [{ heading: 'Build a pretend basket', text: 'Suppose bread and bus fares have equal weight and start at an index of 100. If bread rises to 110 while bus fares fall to 96, the average is 103. In this simplified example the index rises 3%.' }, { heading: 'Check the comparison period', text: 'A monthly change measures a different interval from a yearly change. Before comparing two numbers, check their time periods and what each index covers.' }]),
  demo('generative-ai-basics', 'ai', 'lesson', 'How does a language model continue a sentence?', 'Start with tokens and see how a model builds an answer one step at a time.',
    'A plausible continuation can still be incorrect. Check factual claims against evidence.',
    [{ heading: 'Find the units', text: 'A tokenizer converts text into units that can be whole words, pieces of words, or other symbols. The mapping depends on the tokenizer.' }, { heading: 'Predict the next token', text: 'A language model uses the tokens already available to score possible continuations. Generating a response repeats that process, adding a token at a time.' }], 5),
  demo('reading-a-map', 'world', 'lesson', 'What does a map projection change?', 'Compare what a flat map can preserve when it depicts a round Earth.',
    'A projection suitable for comparing areas can look very different from a projection chosen for navigation.',
    [{ heading: 'Flatten a curved surface', text: 'Draw a grid on an orange peel and try to lay it flat. The gaps and stretching show why any flat representation must distort some properties of the sphere.' }, { heading: 'Ask what the map preserves', text: 'An equal-area projection preserves area ratios. Other projections preserve local angles or particular distances. Read the legend and map title before measuring or comparing.' }], 5),
];

export const editorialCopy = {
  en: { demo: 'Educational demo', why: 'Why it matters', sources: 'Sources', correction: 'Suggest a correction', related: 'Related reading', diagram: 'Follow the packet', steps: ['Phone', 'Wi-Fi router', 'Internet'], next: 'Next step', reset: 'Start over', minutes: 'min read', original: 'Original article', translation: 'Translated edition', share: 'Copy link', copied: 'Link copied' },
  hi: { demo: 'शैक्षिक उदाहरण', why: 'यह क्यों मायने रखता है', sources: 'स्रोत', correction: 'सुधार सुझाएँ', related: 'संबंधित लेख', diagram: 'पैकेट का सफ़र देखें', steps: ['फ़ोन', 'वाई-फ़ाई राउटर', 'इंटरनेट'], next: 'अगला चरण', reset: 'फिर से शुरू करें', minutes: 'मिनट का पठन', original: 'मूल लेख', translation: 'अनूदित संस्करण', share: 'लिंक कॉपी करें', copied: 'लिंक कॉपी हुआ' },
  gu: { demo: 'શૈક્ષણિક ઉદાહરણ', why: 'આ કેમ મહત્વનું છે', sources: 'સ્રોતો', correction: 'સુધારો સૂચવો', related: 'સંબંધિત વાંચન', diagram: 'પૅકેટની સફર જુઓ', steps: ['ફોન', 'વાઇ-ફાઇ રાઉટર', 'ઇન્ટરનેટ'], next: 'આગળનું પગલું', reset: 'ફરી શરૂ કરો', minutes: 'મિનિટનું વાંચન', original: 'મૂળ લેખ', translation: 'અનુવાદિત આવૃત્તિ', share: 'લિંક કૉપી કરો', copied: 'લિંક કૉપી થઈ' },
  mr: { demo: 'शैक्षणिक उदाहरण', why: 'हे का महत्त्वाचे आहे', sources: 'स्रोत', correction: 'दुरुस्ती सुचवा', related: 'संबंधित लेख', diagram: 'पॅकेटचा प्रवास पाहा', steps: ['फोन', 'वाय-फाय राउटर', 'इंटरनेट'], next: 'पुढचा टप्पा', reset: 'पुन्हा सुरू करा', minutes: 'मिनिटांचे वाचन', original: 'मूळ लेख', translation: 'अनुवादित आवृत्ती', share: 'दुवा कॉपी करा', copied: 'दुवा कॉपी झाला' },
};
