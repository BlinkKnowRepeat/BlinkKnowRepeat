// Editorial content for Blink, Know, Repeat.
// Every news item below was checked on 23 Nov 2026 against the linked sources. `level` says how strong the
// sourcing is: "primary" = the organisation's own release/data, "secondary" = reported by a third party and
// not independently confirmed here. Explainers teach a concept and make no claim about current events.
// Add a post: append an object, give it a unique slug and sources. Nothing else needs to change.
// Sources: list them once in `sources`; each is numbered by position ([1], [2], ...). Cite a claim by ending the
// sentence with its marker, e.g. "Gold fell. [1]" or "[1,3]" (allowed in blink, body[].p and caveat). Full rules: lib/sources.ts.

export type Topic = 'india' | 'world' | 'technology' | 'science' | 'economy';
export type Source = { title: string; url: string; note: string };
export type Branch = { label: string; detail: string; leaves: string[] };
export type Post = {
  slug: string;
  topic: Topic;
  kind: 'News' | 'Explainer';
  scope: 'India' | 'World';
  date: string; // ISO, UTC
  minutes: number;
  level: 'primary' | 'secondary' | 'concept';
  title: string;
  dek: string;
  blink: string[];
  why: string;
  body: { h: string; p: string }[];
  caveat?: string;
  sources: Source[];
  map: { center: string; branches: Branch[] };
  related: string[];
  keywords: string[];
  thumb: { motif: 'gold' | 'chip' | 'rupee' | 'globe' | 'rocket' | 'wifi' | 'sky' | 'basket'; a: string; b: string };
  interactive?: { type: 'bars' | 'steps'; title: string; items: { label: string; value?: number; text: string }[]; unit?: string };
  local?: Partial<Record<'hi' | 'gu' | 'mr', { title: string; dek: string; blink: string[] }>>;
  articleHref?: string; // deeper interactive article already in the multilingual library
};

export const levelLabel = { primary: 'Primary source', secondary: 'Reported by third parties', concept: 'Concept explainer' } as const;

export const posts: Post[] = [
  {
    slug: 'gold-falls-from-january-record',
    topic: 'economy', kind: 'News', scope: 'World', date: '2026-11-21T06:30:00Z', minutes: 4, level: 'secondary',
    title: 'Gold slides to a 14-month low as interest-rate fears grow',
    dek: 'Spot gold touched about $3,514 an ounce on 20 November, its lowest since September 2025 and far below January’s record. Higher real yields and a strong dollar are the reasons most analysts give.',
    blink: [
      'Spot gold touched $3,513.54 on 20 November, the lowest since September 2025. [1]',
      'The record was set on 28 January 2026 at $5,589.38, so gold sits roughly a third below its peak. [1]',
      'The main drivers are a rising 10-year real yield (2.66% on 9 Nov to 2.88% on 18 Nov) and a near-19-month-high dollar. [1,2]',
    ],
    why: 'Gold pays no interest. When inflation-adjusted yields on safe bonds rise, holding gold costs more in forgone income, so its price tends to fall. In India, gold also moves with the rupee and import duty, so the dollar price is only part of what you pay.',
    body: [
      { h: 'What happened', p: 'GoldSilver’s 20 November outlook reports spot gold touching $3,513.54, after ending October near $3,876. The same article puts the January 28 record at $5,589.38. [1] Different data vendors quote slightly different highs and lows, so treat each figure as approximate and check a live feed before trading or buying.' },
      { h: 'Why real yields matter', p: 'A real yield is a bond yield minus expected inflation. The 10-year real yield rose from 2.66% on 9 November to 2.88% on 18 November (FRED data cited by GoldSilver). [1,2] A higher number makes bonds more attractive relative to a bar of metal that earns nothing.' },
      { h: 'The Fed and the dollar', p: 'The article reports markets pricing about a 99% chance of a quarter-point US rate rise on 9 December (CME FedWatch) and the dollar near a 19-month high. [1,3] A stronger dollar makes gold more expensive for buyers using other currencies, which can weaken demand.' },
      { h: 'Who is still buying', p: 'The World Gold Council figures quoted say central banks bought 321 tonnes in the third quarter, up 42% on a year earlier, while jewellery demand fell 17% and bar-and-coin demand fell 19%. [1,4] Official buyers and household buyers are moving in different directions.' },
    ],
    caveat: 'These numbers come from one secondary article published 20 November. We could not confirm them on the World Gold Council price page, which showed no live price. Prices move every minute.',
    sources: [
      { title: 'GoldSilver: Gold Price Outlook, November 2026', url: 'https://goldsilver.com/industry-news/article/gold-price-outlook-november-2026/', note: 'Source of price, yield, Fed and central-bank figures' },
      { title: 'FRED: 10-Year Treasury Inflation-Indexed Security (DFII10)', url: 'https://fred.stlouisfed.org/series/DFII10', note: 'Official series behind the real-yield figures' },
      { title: 'CME FedWatch Tool', url: 'https://www.cmegroup.com/markets/interest-rates/cme-fedwatch-tool.html', note: 'Market-implied probability of rate moves' },
      { title: 'World Gold Council: Gold Prices & Demand Trends', url: 'https://www.gold.org/goldhub/data/gold-prices', note: 'Central-bank and demand data' },
    ],
    map: { center: 'Gold falls', branches: [
      { label: 'Real yields rise', detail: 'Safe bonds pay more after inflation. Gold, which pays nothing, looks less attractive.', leaves: ['10-yr real yield 2.66% → 2.88%', 'Fed hike expected 9 Dec'] },
      { label: 'Stronger dollar', detail: 'Gold is priced in dollars. When the dollar climbs, buyers in other currencies pay more.', leaves: ['Dollar near 19-month high', 'Rupee price also depends on import duty'] },
      { label: 'Buyers diverge', detail: 'Central banks keep adding while households buy less jewellery, bars and coins.', leaves: ['Central banks +321 t in Q3', 'Jewellery demand −17%'] },
      { label: 'Peak to now', detail: 'The record was set in late January; the price has since lost roughly a third.', leaves: ['Record $5,589.38 (28 Jan)', 'Low $3,513.54 (20 Nov)'] },
    ] },
    related: ['nvidia-q3-fy27-record-revenue', 'reading-an-inflation-number', 'rbi-policy-corridor-explained'],
    keywords: ['gold', 'bullion', 'fed', 'real yield', 'dollar', 'central banks', 'commodities'],
    thumb: { motif: 'gold', a: '#b8860b', b: '#f5d36b' },
    interactive: { type: 'bars', title: 'Tap a bar to see the price point', unit: '$/oz', items: [
      { label: 'Jan 28 record', value: 5589, text: 'Record high reported at $5,589.38 on 28 January 2026.' },
      { label: 'Oct 30 close', value: 3876, text: 'Gold ended October near $3,876, per Investing.com data cited by GoldSilver.' },
      { label: 'Nov 20 low', value: 3514, text: 'Spot touched $3,513.54 on 20 November, the lowest since September 2025.' },
    ] },
    local: {
      hi: { title: 'ब्याज दरों की चिंता से सोना 14 महीने के निचले स्तर पर', dek: '20 नवंबर को हाज़िर सोना लगभग $3,514 प्रति औंस तक गिरा, जो सितंबर 2025 के बाद सबसे कम है और जनवरी के रिकॉर्ड से बहुत नीचे है।', blink: ['सोना 20 नवंबर को $3,513.54 तक गिरा।', 'रिकॉर्ड 28 जनवरी 2026 को $5,589.38 था।', 'वास्तविक यील्ड बढ़ना और मज़बूत डॉलर मुख्य कारण बताए जा रहे हैं।'] },
      gu: { title: 'વ્યાજદરની ચિંતાથી સોનું 14 મહિનાના તળિયે', dek: '20 નવેમ્બરે હાજર સોનું આશરે $3,514 પ્રતિ ઔંસ સુધી ગગડ્યું, જે સપ્ટેમ્બર 2025 પછીનું સૌથી નીચું સ્તર છે.', blink: ['સોનું 20 નવેમ્બરે $3,513.54 સુધી ઘટ્યું.', 'રેકોર્ડ 28 જાન્યુઆરી 2026એ $5,589.38 હતો.', 'વાસ્તવિક યીલ્ડમાં વધારો અને મજબૂત ડૉલર મુખ્ય કારણ ગણાવાય છે.'] },
      mr: { title: 'व्याजदरांच्या चिंतेमुळे सोने 14 महिन्यांच्या नीचांकावर', dek: '20 नोव्हेंबरला हजर सोने सुमारे $3,514 प्रति औंसपर्यंत घसरले, जे सप्टेंबर 2025 नंतरचे सर्वात कमी आहे.', blink: ['सोने 20 नोव्हेंबरला $3,513.54 पर्यंत घसरले.', 'विक्रमी भाव 28 जानेवारी 2026 ला $5,589.38 होता.', 'वास्तविक यील्ड वाढ आणि मजबूत डॉलर ही मुख्य कारणे सांगितली जातात.'] },
    },
  },
  {
    slug: 'nvidia-q3-fy27-record-revenue',
    topic: 'technology', kind: 'News', scope: 'World', date: '2026-11-18T01:00:00Z', minutes: 4, level: 'primary',
    title: 'Nvidia reports $115.8 billion quarter and guides to $130 billion',
    dek: 'For the quarter ended 25 October 2026, Nvidia’s revenue was up 103% from a year earlier, driven by data-centre sales. It is not counting on any China data-centre revenue next quarter.',
    blink: [
      'Revenue: $115.8 billion, up 20% on the previous quarter and 103% on a year ago.',
      'Data Center revenue: $107.6 billion, up 110% year on year.',
      'Outlook for next quarter: $130.0 billion ±3%, with no China data-centre compute revenue assumed.',
    ],
    why: 'Nvidia’s chips train and run most large AI systems, so its results are a barometer for how much companies are spending on AI infrastructure, and for how long that spending might last.',
    body: [
      { h: 'The numbers', p: 'Nvidia announced results on 17 November 2026. Total revenue was $115.8 billion; GAAP gross margin was 74.8% and GAAP diluted earnings per share were $2.70 (non-GAAP $2.68). Net income was $65.3 billion on a GAAP basis.' },
      { h: 'What is selling', p: 'Data Center revenue was $107.6 billion. The company says Vera Rubin NVL72 systems have shipped and calls it the fastest product ramp in its history. Edge Computing revenue was $8.2 billion.' },
      { h: 'The outlook', p: 'For the fourth quarter, which has an extra week, Nvidia expects revenue of $130.0 billion plus or minus 3% and gross margins of 71.0% to 72.0%. It says it is not assuming any Data Center compute revenue from China.' },
      { h: 'Money back to shareholders', p: 'Nvidia returned $28.1 billion to shareholders in the quarter. The board added $150 billion to its buyback authorisation, about $227.3 billion remained at quarter end, and the next dividend is $0.25 per share payable 23 December 2026. Colette Kress is named interim CEO and CFO, and the release mentions an agreement to acquire Hugging Face.' },
    ],
    sources: [
      { title: 'NVIDIA: Financial Results for Third Quarter Fiscal 2027', url: 'https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-third-quarter-fiscal-2027', note: 'Primary: company press release, 17 Nov 2026' },
      { title: 'NVIDIA Investor Relations: release page', url: 'https://investor.nvidia.com/news/press-release-details/2026/NVIDIA-Announces-Financial-Results-for-Third-Quarter-Fiscal-2027/', note: 'Primary: same release on the investor site' },
      { title: 'SEC EDGAR: NVIDIA Form 8-K (q3fy27pr)', url: 'https://www.sec.gov/Archives/edgar/data/0001045810/000104581026000088/q3fy27pr.htm', note: 'Primary: regulatory filing' },
    ],
    map: { center: 'Nvidia Q3 FY27', branches: [
      { label: 'Revenue', detail: '$115.8B this quarter, 20% above the previous quarter and 103% above a year ago.', leaves: ['+20% QoQ', '+103% YoY'] },
      { label: 'Data Center', detail: 'The AI-chip business made up most of revenue.', leaves: ['$107.6B', 'Vera Rubin NVL72 shipping'] },
      { label: 'Outlook', detail: 'Next quarter includes an extra week; no China data-centre compute is assumed.', leaves: ['$130.0B ±3%', 'Gross margin 71–72%'] },
      { label: 'Shareholders', detail: 'Cash returned through buybacks and dividends.', leaves: ['$28.1B returned', '$0.25 dividend, 23 Dec'] },
    ] },
    related: ['what-happens-when-you-tap-send', 'gold-falls-from-january-record', 'rbi-policy-corridor-explained'],
    keywords: ['nvidia', 'ai', 'chips', 'earnings', 'data center', 'gpu', 'vera rubin', 'china'],
    thumb: { motif: 'chip', a: '#0f7a3d', b: '#8fd14f' },
    interactive: { type: 'bars', title: 'Tap a bar to compare the figures', unit: '$B', items: [
      { label: 'Total revenue', value: 115.8, text: 'Total revenue of $115.8 billion for the quarter ended 25 October 2026.' },
      { label: 'Data Center', value: 107.6, text: 'Data Center revenue of $107.6 billion, up 110% from a year ago.' },
      { label: 'Next-quarter guide', value: 130, text: 'Guidance for next quarter: $130.0 billion plus or minus 3%.' },
      { label: 'Net income', value: 65.3, text: 'GAAP net income of $65.3 billion.' },
    ] },
    local: {
      hi: { title: 'Nvidia की तिमाही आय $115.8 अरब, अगली तिमाही के लिए $130 अरब का अनुमान', dek: '25 अक्टूबर 2026 को समाप्त तिमाही में राजस्व सालाना आधार पर 103% बढ़ा। कंपनी अगली तिमाही में चीन से डेटा-सेंटर राजस्व नहीं मान रही।', blink: ['राजस्व $115.8 अरब, पिछली तिमाही से 20% और सालाना 103% अधिक।', 'डेटा सेंटर राजस्व $107.6 अरब।', 'अगली तिमाही का अनुमान $130.0 अरब ±3%।'] },
      gu: { title: 'Nvidiaની ત્રિમાસિક આવક $115.8 અબજ, આગામી ત્રિમાસિક માટે $130 અબજનો અંદાજ', dek: '25 ઑક્ટોબર 2026એ પૂરા થયેલા ત્રિમાસિકમાં આવક વાર્ષિક ધોરણે 103% વધી. કંપની ચીનમાંથી ડેટા-સેન્ટર આવક ગણતી નથી.', blink: ['આવક $115.8 અબજ, અગાઉના ત્રિમાસિક કરતાં 20% અને વાર્ષિક 103% વધુ.', 'ડેટા સેન્ટર આવક $107.6 અબજ.', 'આગામી ત્રિમાસિકનો અંદાજ $130.0 અબજ ±3%.'] },
      mr: { title: 'Nvidia ची तिमाही कमाई $115.8 अब्ज, पुढील तिमाहीसाठी $130 अब्जांचा अंदाज', dek: '25 ऑक्टोबर 2026 ला संपलेल्या तिमाहीत महसूल वार्षिक 103% वाढला. कंपनी चीनमधील डेटा-सेंटर महसूल गृहीत धरत नाही.', blink: ['महसूल $115.8 अब्ज, मागील तिमाहीपेक्षा 20% आणि वार्षिक 103% जास्त.', 'डेटा सेंटर महसूल $107.6 अब्ज.', 'पुढील तिमाहीचा अंदाज $130.0 अब्ज ±3%.'] },
    },
  },
  {
    slug: 'rbi-policy-corridor-explained',
    topic: 'economy', kind: 'News', scope: 'India', date: '2026-11-20T10:00:00Z', minutes: 4, level: 'secondary',
    title: 'India’s rate corridor, explained: what RBI’s own daily data shows',
    dek: 'The RBI’s 19 November money-market data shows the overnight rate at 5.56%, with the standing-deposit rate at 5.25% and the marginal-standing rate at 5.75%. That corridor points to a 5.50% policy repo rate. The next decision is reportedly due 4 December.',
    blink: [
      'RBI’s 19 Nov 2026 data: overnight weighted-average rate 5.56%, SDF 5.25%, MSF 5.75%.',
      'The corridor is the repo rate ±0.25 percentage point, which implies a 5.50% repo rate.',
      'Retail inflation for October was reported at 6.09%, above the 6% upper tolerance band; the next policy decision is reportedly 4 December.',
    ],
    why: 'The repo rate sets the cost of money in the economy. It feeds into home-loan and car-loan EMIs, fixed-deposit rates and, indirectly, the rupee and gold prices.',
    body: [
      { h: 'Reading the RBI’s daily table', p: 'Each working day the RBI publishes money-market operations. The one dated 19 November 2026 (press release 2026-2027/1527) shows the overnight weighted average rate at 5.56%, call money at 5.59% and triparty repo at 5.55%. It lists the Standing Deposit Facility at 5.25% and the Marginal Standing Facility at 5.75%.' },
      { h: 'Why the corridor tells you the repo rate', p: 'Under the RBI’s framework the SDF rate sits 25 basis points below the repo rate and the MSF rate 25 basis points above it. A corridor of 5.25%–5.75% therefore implies a policy repo rate of 5.50%. This is our inference from the framework; the RBI’s policy statement is the authoritative source for the decision itself.' },
      { h: 'What third-party reports add', p: 'News reports say the RBI raised the rate from 5.25% on 7 October, its first increase in 44 months, that October retail inflation was 6.09% (up from 5.54%), and that the next Monetary Policy Committee decision is due 4 December with a further 25 basis point rise widely expected. We have not confirmed these against RBI or MoSPI pages.' },
      { h: 'What it means for you', p: 'If the repo rate rises, floating-rate loans linked to it become costlier and new fixed-deposit rates tend to move up. Savers and borrowers feel it with a lag that depends on the bank and the loan contract.' },
    ],
    caveat: 'Only the corridor figures come from an RBI page we read directly. The October rate hike, the 6.09% inflation figure and the 4 December date are third-party reports and should be checked against the RBI and MoSPI sites.',
    sources: [
      { title: 'RBI: Money Market Operations as on November 19, 2026', url: 'https://www.rbi.org.in/scripts/BS_PressReleaseDisplay.aspx?prid=64005', note: 'Primary: corridor and overnight-rate data' },
      { title: 'RBI: Monetary policy statements', url: 'https://www.rbi.org.in/Scripts/BS_PressReleases.aspx', note: 'Where the official policy decisions are published' },
      { title: 'MoSPI: Consumer Price Index releases', url: 'https://mospi.gov.in/', note: 'Official source for retail inflation' },
    ],
    map: { center: 'RBI rate corridor', branches: [
      { label: 'The corridor', detail: 'SDF 5.25% below, MSF 5.75% above, repo in the middle.', leaves: ['SDF 5.25%', 'MSF 5.75%', 'Repo ≈ 5.50% (inferred)'] },
      { label: 'Market today', detail: 'The overnight rate trades inside the corridor.', leaves: ['WACR 5.56%', 'Call money 5.59%'] },
      { label: 'Inflation', detail: 'Reported October CPI is above the RBI’s tolerance band.', leaves: ['6.09% (reported)', 'Target 4% ±2'] },
      { label: 'Your wallet', detail: 'Loans and deposits reprice over time.', leaves: ['EMIs on floating loans', 'New FD rates'] },
    ] },
    related: ['reading-an-inflation-number', 'gold-falls-from-january-record', 'gaganyaan-g1-launch-timing'],
    keywords: ['rbi', 'repo rate', 'inflation', 'india', 'emi', 'mpc', 'interest rates', 'sdf', 'msf'],
    thumb: { motif: 'rupee', a: '#c2410c', b: '#fbbf24' },
    interactive: { type: 'bars', title: 'Tap a rate to see what it is', unit: '%', items: [
      { label: 'SDF', value: 5.25, text: 'Standing Deposit Facility: the rate banks earn parking surplus money with the RBI. Sits 0.25 below repo.' },
      { label: 'Repo (inferred)', value: 5.5, text: 'The policy rate implied by the corridor: halfway between SDF and MSF.' },
      { label: 'Overnight', value: 5.56, text: 'Weighted-average overnight market rate on 19 November.' },
      { label: 'MSF', value: 5.75, text: 'Marginal Standing Facility: emergency borrowing from the RBI. Sits 0.25 above repo.' },
    ] },
    local: {
      hi: { title: 'भारत का ब्याज-दर गलियारा: RBI के रोज़ के आँकड़े क्या बताते हैं', dek: 'RBI के 19 नवंबर के आँकड़ों में ओवरनाइट दर 5.56%, SDF 5.25% और MSF 5.75% है, जिससे रेपो दर 5.50% निकलती है।', blink: ['ओवरनाइट दर 5.56%, SDF 5.25%, MSF 5.75%।', 'गलियारा रेपो दर ±0.25 अंक है।', 'अक्टूबर की खुदरा महँगाई 6.09% बताई गई है।'] },
      gu: { title: 'ભારતનો વ્યાજદર કૉરિડોર: RBIના રોજિંદા આંકડા શું કહે છે', dek: 'RBIના 19 નવેમ્બરના આંકડામાં ઓવરનાઇટ દર 5.56%, SDF 5.25% અને MSF 5.75% છે, જે રેપો દર 5.50% સૂચવે છે.', blink: ['ઓવરનાઇટ દર 5.56%, SDF 5.25%, MSF 5.75%.', 'કૉરિડોર એટલે રેપો ±0.25 પોઇન્ટ.', 'ઑક્ટોબરનો છૂટક ફુગાવો 6.09% નોંધાયો છે.'] },
      mr: { title: 'भारताचा व्याजदर कॉरिडॉर: RBI च्या दैनंदिन आकडेवारीतून काय दिसते', dek: 'RBI च्या 19 नोव्हेंबरच्या आकडेवारीत ओव्हरनाइट दर 5.56%, SDF 5.25% आणि MSF 5.75% आहे; त्यावरून रेपो दर 5.50% निघतो.', blink: ['ओव्हरनाइट दर 5.56%, SDF 5.25%, MSF 5.75%.', 'कॉरिडॉर म्हणजे रेपो ±0.25 अंश.', 'ऑक्टोबरची किरकोळ महागाई 6.09% नोंदली गेली.'] },
    },
  },
  {
    slug: 'cop31-antalya-talks-deadlocked',
    topic: 'world', kind: 'News', scope: 'World', date: '2026-11-19T12:00:00Z', minutes: 4, level: 'primary',
    title: 'COP31 in Antalya: finance and fossil-fuel phase-out kept talks stuck',
    dek: 'The UN climate conference ran 9–20 November in Türkiye. UN News reported ministers deadlocked on climate finance, the pace of moving away from fossil fuels and what counts as a “just” transition. We could not confirm the final outcome.',
    blink: [
      'COP31 was scheduled for 9–20 November 2026 at the Antalya Expo Center, Türkiye.',
      'Murat Kurum is COP31 President; Australia’s Chris Bowen is President of Negotiations.',
      'By 18 November UN News described ministers as deadlocked on finance, fossil-fuel phase-out and “just transition”.',
    ],
    why: 'COP outcomes shape how much money flows to climate adaptation, how fast countries cut emissions and who pays. For India, climate finance and a fair transition from coal are central issues.',
    body: [
      { h: 'Who hosts and who leads', p: 'The UNFCCC lists Türkiye as host, with Murat Kurum as COP31 President. Under an arrangement accepted at COP30, Australia’s Chris Bowen is President of Negotiations. Pre-COP meetings were held in Fiji and Tuvalu.' },
      { h: 'The sticking points', p: 'UN News coverage dated 18 November describes ministers as deadlocked on three questions: how much climate finance wealthier countries provide, how quickly the world phases down fossil fuels, and how to define and deliver a just transition for workers and communities.' },
      { h: 'Why consensus is hard', p: 'Climate COP decisions are normally taken by consensus among nearly 200 parties. A single unresolved bracket in the draft text can hold up the whole package, which is why final days often run past the scheduled close.' },
      { h: 'What to watch', p: 'The final decision texts will be published on the UNFCCC website. Until you have read them, treat any summary of “what COP31 agreed” (including this one) as provisional.' },
    ],
    caveat: 'The conference was scheduled to close on 20 November. We found no confirmed final outcome at the time of writing, so this post covers the talks up to 18 November only.',
    sources: [
      { title: 'UNFCCC: About COP31', url: 'https://unfccc.int/cop31/about', note: 'Primary: host, dates, presidency' },
      { title: 'UN News: COP31 coverage', url: 'https://news.un.org/en/events/cop31', note: 'Primary: UN reporting, 18 Nov deadlock' },
      { title: 'UN News: COP31 opens in Antalya', url: 'https://news.un.org/en/story/2026/11/1168763', note: 'Primary: opening-day report' },
      { title: 'COP31 Türkiye official site', url: 'https://cop31.tr/', note: 'Host-country programme' },
    ],
    map: { center: 'COP31 Antalya', branches: [
      { label: 'The event', detail: 'UN climate conference at the Antalya Expo Center.', leaves: ['9–20 Nov 2026', 'Leaders’ summit 11–12 Nov'] },
      { label: 'Finance', detail: 'How much wealthier countries pay for adaptation and cuts.', leaves: ['Deadlocked (18 Nov)'] },
      { label: 'Fossil fuels', detail: 'The pace and wording of any phase-out language.', leaves: ['Deadlocked (18 Nov)'] },
      { label: 'Just transition', detail: 'Protecting workers and regions as industries change.', leaves: ['Definition disputed', 'Relevant to coal regions in India'] },
    ] },
    related: ['gaganyaan-g1-launch-timing', 'why-the-sky-is-blue', 'gold-falls-from-january-record'],
    keywords: ['cop31', 'climate', 'antalya', 'turkiye', 'unfccc', 'fossil fuels', 'climate finance', 'just transition'],
    thumb: { motif: 'globe', a: '#0e7490', b: '#67e8f9' },
    interactive: { type: 'steps', title: 'How a COP decision gets made', items: [
      { label: '1 · Draft', text: 'Negotiators write draft text. Unresolved choices appear in square brackets.' },
      { label: '2 · Negotiate', text: 'Parties trade positions in working groups and ministerial consultations.' },
      { label: '3 · Consensus', text: 'The presidency tries to find language nobody blocks. One objection can stop a decision.' },
      { label: '4 · Adopt', text: 'The final plenary adopts the decision texts, often after the scheduled closing time.' },
    ] },
    local: {
      hi: { title: 'COP31 अंताल्या: वित्त और जीवाश्म ईंधन पर वार्ता अटकी', dek: '9–20 नवंबर के सम्मेलन में UN News के अनुसार मंत्री जलवायु वित्त, जीवाश्म ईंधन घटाने की गति और “न्यायसंगत बदलाव” पर अटके थे। अंतिम नतीजा हम पुष्ट नहीं कर पाए।', blink: ['COP31 अंताल्या, तुर्किये में 9–20 नवंबर को हुआ।', 'मुरात कुरुम अध्यक्ष; क्रिस बोवेन वार्ता अध्यक्ष।', '18 नवंबर तक वित्त और जीवाश्म ईंधन पर गतिरोध।'] },
      gu: { title: 'COP31 અંતાલ્યા: નાણાં અને અશ્મિભૂત ઇંધણ પર વાટાઘાટો અટકી', dek: '9–20 નવેમ્બરની પરિષદમાં UN News મુજબ મંત્રીઓ આબોહવા નાણાં, અશ્મિભૂત ઇંધણ ઘટાડવાની ગતિ અને “ન્યાયી સંક્રમણ” પર અટક્યા હતા. અંતિમ પરિણામ અમે ચકાસી શક્યા નથી.', blink: ['COP31 અંતાલ્યા, તુર્કીયેમાં 9–20 નવેમ્બરે.', 'મુરાત કુરુમ પ્રમુખ; ક્રિસ બોવેન વાટાઘાટ પ્રમુખ.', '18 નવેમ્બર સુધી નાણાં અને અશ્મિભૂત ઇંધણ પર ગતિરોધ.'] },
      mr: { title: 'COP31 अंताल्या: वित्त आणि जीवाश्म इंधनावर चर्चा अडकली', dek: '9–20 नोव्हेंबरच्या परिषदेत UN News नुसार मंत्री हवामान वित्त, जीवाश्म इंधन कमी करण्याचा वेग आणि “न्याय्य संक्रमण” यावर अडकले होते. अंतिम निकाल आम्ही पडताळू शकलो नाही.', blink: ['COP31 अंताल्या, तुर्कियेत 9–20 नोव्हेंबरला.', 'मुरात कुरुम अध्यक्ष; ख्रिस बोवेन वाटाघाटी अध्यक्ष.', '18 नोव्हेंबरपर्यंत वित्त आणि जीवाश्म इंधनावर कोंडी.'] },
    },
  },
  {
    slug: 'gaganyaan-g1-launch-timing',
    topic: 'science', kind: 'News', scope: 'India', date: '2026-11-20T15:00:00Z', minutes: 3, level: 'secondary',
    title: 'Gaganyaan’s first uncrewed flight: still no confirmed date',
    dek: 'The government’s stated target is the fourth quarter of 2026, but a 20 November report says the G1 mission may not fly before February 2027 while extra safety checks continue.',
    blink: [
      'Official target: Q4 2026 (government statement in Parliament, 6 August 2026, as reported).',
      'A 20 November report says G1 may slip to February 2027 or later; ISRO has not confirmed a date.',
      'G1 is an uncrewed test flight on an LVM3 rocket ahead of India’s first crewed spaceflight.',
    ],
    why: 'Gaganyaan is India’s human-spaceflight programme. The uncrewed flight tests the rocket, crew module and recovery before astronauts fly, so schedule changes usually reflect safety work, not failure.',
    body: [
      { h: 'Where things stand', p: 'Launch trackers list the first uncrewed mission, G1, as targeting late 2026 with a date still to be announced. A report dated 20 November 2026 says additional technical checks, simulations and safety validation could push it to February 2027 at the earliest.' },
      { h: 'What has been tested', p: 'The crew module completed an air-drop test on 10 April 2026, according to the sources we checked. Drop tests rehearse the parachute sequence that slows the capsule before it lands in the sea.' },
      { h: 'Why delays are normal', p: 'Crewed programmes repeat tests until each system meets safety margins. A first uncrewed flight that slips by a few months is common in spaceflight and not, on its own, a sign of a deeper problem.' },
      { h: 'What to watch', p: 'The only authoritative announcement will come from ISRO. Treat any specific launch date from a tracker or news site as provisional until ISRO publishes it.' },
    ],
    caveat: 'Sources disagree and several are secondary. We did not read the Parliament statement directly. No launch date has been confirmed by ISRO as of 23 November 2026.',
    sources: [
      { title: 'ISRO: official website', url: 'https://www.isro.gov.in/', note: 'Authoritative source for any announced launch date' },
      { title: 'Wikipedia: Gaganyaan-1 (G1)', url: 'https://en.wikipedia.org/wiki/Gaganyaan-1', note: 'Mission overview and test history' },
      { title: 'Indian Masterminds: Gaganyaan delay report', url: 'https://indianmasterminds.com/news/gaganyaan-mission-delay-february-2027-252191/', note: 'Source of the February 2027 report (secondary)' },
      { title: 'Next Spaceflight: ISRO launches', url: 'https://nextspaceflight.com/launches/?f=agency_50', note: 'Third-party launch tracker' },
    ],
    map: { center: 'Gaganyaan G1', branches: [
      { label: 'Goal', detail: 'Uncrewed test flight before astronauts fly.', leaves: ['LVM3 rocket', 'Crew module recovery'] },
      { label: 'Schedule', detail: 'Official target Q4 2026; one report says February 2027 or later.', leaves: ['No ISRO date yet'] },
      { label: 'Done so far', detail: 'Parachute and recovery rehearsals.', leaves: ['Air-drop test, 10 Apr 2026'] },
      { label: 'Why it slips', detail: 'More simulations and safety validation.', leaves: ['Safety margins first'] },
    ] },
    related: ['cop31-antalya-talks-deadlocked', 'why-the-sky-is-blue', 'what-happens-when-you-tap-send'],
    keywords: ['isro', 'gaganyaan', 'space', 'india', 'lvm3', 'launch', 'astronaut'],
    thumb: { motif: 'rocket', a: '#4338ca', b: '#a5b4fc' },
    interactive: { type: 'steps', title: 'Walk through an uncrewed test flight', items: [
      { label: '1 · Lift-off', text: 'The LVM3 rocket carries the crew module and service module to space.' },
      { label: '2 · Orbit', text: 'Systems are checked in orbit with no crew aboard.' },
      { label: '3 · Re-entry', text: 'The crew module separates and re-enters, slowing under heat shield and parachutes.' },
      { label: '4 · Splashdown', text: 'The capsule lands in the sea and is recovered by ships.' },
    ] },
    local: {
      hi: { title: 'गगनयान की पहली मानव-रहित उड़ान: तारीख़ अभी तय नहीं', dek: 'सरकार का लक्ष्य 2026 की चौथी तिमाही है, पर 20 नवंबर की एक रिपोर्ट के अनुसार G1 फ़रवरी 2027 तक खिसक सकता है।', blink: ['आधिकारिक लक्ष्य: 2026 की चौथी तिमाही।', 'एक रिपोर्ट: फ़रवरी 2027 या बाद में। ISRO ने तारीख़ नहीं बताई।', 'G1 मानव-रहित परीक्षण उड़ान है।'] },
      gu: { title: 'ગગનયાનની પ્રથમ માનવરહિત ઉડાન: તારીખ હજી નક્કી નથી', dek: 'સરકારનો લક્ષ્યાંક 2026નું ચોથું ત્રિમાસિક છે, પરંતુ 20 નવેમ્બરના અહેવાલ મુજબ G1 ફેબ્રુઆરી 2027 સુધી ખસી શકે છે.', blink: ['સત્તાવાર લક્ષ્ય: 2026નું ચોથું ત્રિમાસિક.', 'એક અહેવાલ: ફેબ્રુઆરી 2027 કે પછી. ISROએ તારીખ જાહેર કરી નથી.', 'G1 માનવરહિત પરીક્ષણ ઉડાન છે.'] },
      mr: { title: 'गगनयानचे पहिले मानवरहित उड्डाण: तारीख अजून निश्चित नाही', dek: 'सरकारचे उद्दिष्ट 2026 ची चौथी तिमाही आहे, पण 20 नोव्हेंबरच्या एका वृत्तानुसार G1 फेब्रुवारी 2027 पर्यंत पुढे जाऊ शकते.', blink: ['अधिकृत उद्दिष्ट: 2026 ची चौथी तिमाही.', 'एक वृत्त: फेब्रुवारी 2027 किंवा नंतर. ISRO ने तारीख जाहीर केलेली नाही.', 'G1 ही मानवरहित चाचणी उड्डाण आहे.'] },
    },
  },
  {
    slug: 'what-happens-when-you-tap-send',
    topic: 'technology', kind: 'Explainer', scope: 'World', date: '2026-11-22T08:00:00Z', minutes: 4, level: 'concept',
    title: 'What happens when you tap send?',
    dek: 'Follow one tiny packet from your phone, through your router, and out into the internet. Open the full interactive version in English, Hindi, Gujarati or Marathi.',
    blink: [
      'Your message is split into packets that carry data plus delivery information.',
      'Wi-Fi is only the first hop: it ends at your access point.',
      'Routers pass the packet along; each router only decides the next step.',
    ],
    why: 'Knowing where the wireless link ends helps you tell a home Wi-Fi problem from a problem farther along the internet route.',
    body: [
      { h: 'Your phone prepares the data', p: 'The app turns what you typed into data. Network software packages it into packets, each carrying part of the data plus the addressing information routers use to move it toward the destination.' },
      { h: 'Wi-Fi is the first hop', p: 'Your phone uses radio waves to reach the access point. In many homes the access point and router share one box. The wireless hop ends there; the router then forwards the packet toward your internet provider.' },
      { h: 'The network takes it from there', p: 'Routers forward packets hop by hop. This is a simplified picture: it leaves out encryption, retransmission and the details that differ between apps.' },
    ],
    sources: [{ title: 'IETF RFC 8200: Internet Protocol, Version 6', url: 'https://www.rfc-editor.org/rfc/rfc8200', note: 'Primary specification for IPv6 packets' }],
    map: { center: 'One packet', branches: [
      { label: 'Phone', detail: 'The app creates data; software wraps it into packets.', leaves: ['Data + address'] },
      { label: 'Wi-Fi', detail: 'Radio waves carry it to the access point.', leaves: ['First hop only'] },
      { label: 'Router', detail: 'Forwards the packet to your provider.', leaves: ['Home gateway'] },
      { label: 'Internet', detail: 'Many routers pass it on until it arrives.', leaves: ['Hop by hop'] },
    ] },
    related: ['nvidia-q3-fy27-record-revenue', 'why-the-sky-is-blue', 'gaganyaan-g1-launch-timing'],
    keywords: ['wifi', 'packet', 'router', 'internet', 'networking', 'explainer'],
    thumb: { motif: 'wifi', a: '#1557b0', b: '#7dd3fc' },
    articleHref: 'article/wifi-packet',
    interactive: { type: 'steps', title: 'Step through the packet’s trip', items: [
      { label: 'Phone', text: 'The app creates data and the system wraps it in a packet.' },
      { label: 'Wi-Fi router', text: 'The packet crosses the wireless hop and reaches the router.' },
      { label: 'Internet', text: 'Routers forward it hop by hop toward the destination.' },
    ] },
    local: {
      hi: { title: 'भेजें दबाते ही क्या होता है?', dek: 'डेटा का एक छोटा पैकेट आपके फ़ोन से राउटर होते हुए इंटरनेट तक कैसे पहुँचता है, देखें।', blink: ['संदेश पैकेटों में बँटता है।', 'वाई-फ़ाई सिर्फ़ पहला पड़ाव है।', 'राउटर पैकेट को आगे बढ़ाते हैं।'] },
      gu: { title: 'મોકલો દબાવતાં શું થાય છે?', dek: 'ડેટાનું નાનું પૅકેટ ફોનથી રાઉટર મારફતે ઇન્ટરનેટ સુધી કેવી રીતે પહોંચે છે તે જુઓ.', blink: ['સંદેશ પૅકેટમાં વહેંચાય છે.', 'વાઇ-ફાઇ માત્ર પહેલું પગલું છે.', 'રાઉટર પૅકેટને આગળ મોકલે છે.'] },
      mr: { title: 'पाठवा दाबल्यावर काय होतं?', dek: 'डेटाचे छोटे पॅकेट फोनमधून राउटरमार्गे इंटरनेटपर्यंत कसे जाते ते पाहा.', blink: ['संदेश पॅकेटमध्ये विभागला जातो.', 'वाय-फाय हा फक्त पहिला टप्पा.', 'राउटर पॅकेट पुढे पाठवतात.'] },
    },
  },
  {
    slug: 'why-the-sky-is-blue',
    topic: 'science', kind: 'Explainer', scope: 'World', date: '2026-11-22T07:00:00Z', minutes: 3, level: 'concept',
    title: 'Why is the sky blue, and red at sunset?',
    dek: 'Air molecules scatter short (blue) wavelengths of sunlight far more than long (red) ones. That single idea explains both the noon sky and the sunset.',
    blink: [
      'Sunlight contains many colours; air scatters blue light much more strongly than red.',
      'Scattered blue light reaches your eyes from every direction, so the whole sky looks blue.',
      'At sunset light travels through more air, most blue is scattered away, and red and orange remain.',
    ],
    why: 'It is a clean example of how one physical rule (scattering depends on wavelength) explains very different everyday sights.',
    body: [
      { h: 'Sunlight meets air', p: 'Visible sunlight spans a range of wavelengths. Molecules in the atmosphere scatter shorter wavelengths more strongly than longer ones, a process called Rayleigh scattering.' },
      { h: 'Why not violet?', p: 'Violet scatters even more, but the Sun emits less of it, the upper atmosphere absorbs some, and our eyes are less sensitive to it. The mix we perceive looks blue.' },
      { h: 'At sunset', p: 'When the Sun is low, its direct light crosses a much longer path of air. More blue is scattered out of the direct beam, leaving proportionally more red and orange.' },
    ],
    sources: [{ title: 'Wikipedia: Rayleigh scattering', url: 'https://en.wikipedia.org/wiki/Rayleigh_scattering', note: 'Overview of the physics and the sky-colour explanation' }],
    map: { center: 'Sky colour', branches: [
      { label: 'Noon', detail: 'Short blue wavelengths are scattered in all directions.', leaves: ['Blue sky'] },
      { label: 'Sunset', detail: 'A long path through air removes more blue from the direct light.', leaves: ['Red and orange'] },
      { label: 'Why not violet', detail: 'Less violet from the Sun, some absorption, and weaker eye sensitivity.', leaves: ['Sky looks blue'] },
    ] },
    related: ['gaganyaan-g1-launch-timing', 'cop31-antalya-talks-deadlocked', 'what-happens-when-you-tap-send'],
    keywords: ['sky', 'rayleigh', 'scattering', 'light', 'sunset', 'physics', 'explainer'],
    thumb: { motif: 'sky', a: '#2563eb', b: '#fb923c' },
    interactive: { type: 'steps', title: 'Move the Sun across the sky', items: [
      { label: 'Noon', text: 'Short path through air: blue is scattered everywhere, so the sky looks blue.' },
      { label: 'Afternoon', text: 'A longer path: the Sun looks a little yellower as more blue scatters away.' },
      { label: 'Sunset', text: 'A very long path: most blue is gone from the direct beam, leaving red and orange.' },
    ] },
    local: {
      hi: { title: 'आसमान नीला क्यों है और शाम को लाल क्यों?', dek: 'हवा के अणु सूर्य के प्रकाश की नीली तरंगों को लाल से कहीं ज़्यादा बिखेरते हैं।', blink: ['हवा नीली रोशनी को ज़्यादा बिखेरती है।', 'इसलिए पूरा आसमान नीला दिखता है।', 'सूर्यास्त पर लंबा रास्ता तय करने से लाल-नारंगी बचता है।'] },
      gu: { title: 'આકાશ વાદળી કેમ છે અને સાંજે લાલ કેમ?', dek: 'હવાના અણુઓ સૂર્યપ્રકાશના વાદળી તરંગોને લાલ કરતાં ઘણા વધુ વેરે છે.', blink: ['હવા વાદળી પ્રકાશને વધુ વેરે છે.', 'તેથી આખું આકાશ વાદળી દેખાય છે.', 'સૂર્યાસ્તે લાંબા માર્ગથી લાલ-નારંગી રહે છે.'] },
      mr: { title: 'आकाश निळे का आणि सायंकाळी लाल का?', dek: 'हवेचे रेणू सूर्यप्रकाशातील निळ्या लहरी लाल लहरींपेक्षा खूप जास्त विखुरतात.', blink: ['हवा निळा प्रकाश जास्त विखुरते.', 'म्हणून संपूर्ण आकाश निळे दिसते.', 'सूर्यास्ताला लांब मार्गामुळे लाल-नारिंगी उरते.'] },
    },
  },
  {
    slug: 'reading-an-inflation-number',
    topic: 'economy', kind: 'Explainer', scope: 'India', date: '2026-11-21T08:00:00Z', minutes: 3, level: 'concept',
    title: 'How to read an inflation number (with an Indian example)',
    dek: 'Retail inflation is the change in the price of a weighted basket. It can rise even while some prices fall, and your own basket may differ from the official one.',
    blink: [
      'Inflation compares prices with the same month a year ago (or the previous month, if stated).',
      'It averages a weighted basket; food usually has a large weight in India’s CPI.',
      'The RBI’s medium-term target is 4% with a tolerance band of 2 percentage points either side.',
    ],
    why: 'When you see a headline like “inflation rose to 6%”, knowing what is measured helps you judge whether it describes your household and what the RBI might do next.',
    body: [
      { h: 'Build a pretend basket', p: 'Suppose bread and bus fares have equal weight and start at an index of 100. If bread rises to 110 while bus fares fall to 96, the average is 103, so this simplified index rises 3% even though one price fell.' },
      { h: 'Check the comparison period', p: 'A year-on-year change compares with the same month last year. A month-on-month change compares with the previous month. They are different measures and are not directly comparable.' },
      { h: 'Why it drives RBI decisions', p: 'India’s monetary policy framework targets consumer-price inflation of 4% with a tolerance band of 2% either side. When inflation sits above the band for long, the RBI may raise rates to cool demand.' },
    ],
    sources: [
      { title: 'MoSPI: Consumer Price Index', url: 'https://mospi.gov.in/', note: 'Official CPI releases' },
      { title: 'RBI: Monetary policy framework', url: 'https://www.rbi.org.in/', note: 'Inflation-targeting mandate' },
    ],
    map: { center: 'Inflation number', branches: [
      { label: 'Basket', detail: 'Many goods and services weighted by typical spending.', leaves: ['Food has a large weight'] },
      { label: 'Comparison', detail: 'Year-on-year and month-on-month differ.', leaves: ['Always check the period'] },
      { label: 'Target', detail: 'RBI aims for 4% with a ±2 point band.', leaves: ['Band: 2%–6%'] },
      { label: 'Your inflation', detail: 'Your own mix of spending may rise faster or slower.', leaves: ['Rent, fuel, school fees'] },
    ] },
    related: ['rbi-policy-corridor-explained', 'gold-falls-from-january-record', 'nvidia-q3-fy27-record-revenue'],
    keywords: ['inflation', 'cpi', 'rbi', 'basket', 'india', 'economy', 'explainer'],
    thumb: { motif: 'basket', a: '#047857', b: '#a7f3d0' },
    interactive: { type: 'bars', title: 'Tap an item to see how the index moves', unit: 'index', items: [
      { label: 'Start', value: 100, text: 'Both bread and bus fare start at 100, so the basket index is 100.' },
      { label: 'Bread', value: 110, text: 'Bread rises to 110 (+10%).' },
      { label: 'Bus fare', value: 96, text: 'Bus fare falls to 96 (−4%).' },
      { label: 'Basket', value: 103, text: 'The equal-weight average is 103: inflation of 3% even though one price fell.' },
    ] },
    local: {
      hi: { title: 'महँगाई का आँकड़ा कैसे पढ़ें (भारतीय उदाहरण के साथ)', dek: 'खुदरा महँगाई एक भारित टोकरी की कीमतों में बदलाव है। कुछ कीमतें घटने पर भी यह बढ़ सकती है।', blink: ['तुलना पिछले साल के उसी महीने से होती है।', 'खाद्य वस्तुओं का भार अधिक है।', 'RBI का लक्ष्य 4% है, ±2 अंक की सीमा के साथ।'] },
      gu: { title: 'ફુગાવાનો આંકડો કેવી રીતે વાંચવો (ભારતીય ઉદાહરણ સાથે)', dek: 'છૂટક ફુગાવો ભારિત ટોપલીના ભાવમાં ફેરફાર છે. કેટલાક ભાવ ઘટે તો પણ તે વધી શકે છે.', blink: ['સરખામણી ગયા વર્ષના એ જ મહિના સાથે થાય છે.', 'ખાદ્ય વસ્તુઓનું ભારણ વધુ છે.', 'RBIનો લક્ષ્યાંક 4% છે, ±2 પોઇન્ટની મર્યાદા સાથે.'] },
      mr: { title: 'महागाईचा आकडा कसा वाचावा (भारतीय उदाहरणासह)', dek: 'किरकोळ महागाई म्हणजे भारित टोपलीच्या किमतींतील बदल. काही किमती घटल्या तरी ती वाढू शकते.', blink: ['तुलना मागील वर्षाच्या त्याच महिन्याशी होते.', 'अन्नपदार्थांचे वजन जास्त आहे.', 'RBI चे लक्ष्य 4% आहे, ±2 अंशांच्या मर्यादेसह.'] },
    },
  },
  {
    slug: 'us-ai-chip-rule-remote-access',
    topic: 'technology', kind: 'News', scope: 'World', date: '2026-11-22T10:00:00Z', minutes: 4, level: 'secondary',
    title: 'US tightens AI chip rules, and the limits now follow chips overseas',
    dek: 'A US Commerce rule dated 16 November adds limits on how advanced AI chips can be used, and accessed remotely, once they are outside the United States.',
    blink: [
      'A Bureau of Industry and Security interim final rule dated 16 November 2026 tightens controls on advanced AI chips. [1]',
      'It covers where chips are used and who can reach them remotely, not only where they are shipped. [1]',
      'It replaces the AI Diffusion Rule’s country tiers with controls based on the destination. [1,3]',
    ],
    why: 'Chips are the physical limit on how much AI anyone can build. A government that controls who may use them, and from where, shapes who can compete.',
    body: [
      { h: 'What the rule does', p: 'Law-firm summaries say the rule adds use and remote-access limits for advanced chips located outside the United States, on top of the existing export and re-export controls. [1]' },
      { h: 'Two ways to get a licence', p: 'The rule creates two licensing pathways for covered chips: one based on the destination, and one based on remote use through a data centre. It replaces the earlier AI Diffusion Rule’s worldwide tier system with destination-based controls. [1,3]' },
      { h: 'Why remote access matters', p: 'A chip can be used without being shipped. A company can rent computing power in a data centre abroad, and the hardware never crosses another border. A rule on remote access is meant to close that route. This is our plain-language reading of the summaries, not a quotation from the rule.' },
      { h: 'How industry responded', p: 'The Semiconductor Industry Association said it looks forward to working with the administration on controls that are straightforward and effective. [2]' },
    ],
    caveat: 'We read law-firm and trade-group summaries, not the rule text. Sources differ on the effective date: one says on publication in the Federal Register, which a public-inspection notice scheduled for 19 November 2026. Check the Federal Register text before relying on any provision.',
    sources: [
      { title: 'Greenberg Traurig: BIS interim final rule targets remote access to advanced semiconductors', url: 'https://www.gtlaw.com/ar/insights/2026/11/bis-interim-final-rule-targets-remote-access-to-advanced-semiconductors-rescinds-ai-diffusion-rule', note: 'Law-firm summary of the rule' },
      { title: 'Semiconductor Industry Association: statement on the new export control rule', url: 'https://www.semiconductors.org/?p=32008', note: 'Industry reaction' },
      { title: 'KPMG: Commerce advanced semiconductor export controls', url: 'https://kpmg.com/us/en/taxnewsflash/news/2026/11/commerce-advanced-semiconductor-export-controls.html', note: 'Advisory-firm summary' },
    ],
    map: { center: 'AI chip rule', branches: [
      { label: 'What changed', detail: 'Controls now follow the chip after it has been exported.', leaves: ['Use limits', 'Remote-access limits'] },
      { label: 'Licences', detail: 'Two routes to permission for covered chips.', leaves: ['By destination', 'By remote data-centre use'] },
      { label: 'Old rule', detail: 'The AI Diffusion Rule’s country tiers are replaced.', leaves: ['Tiers removed', 'Destination-based controls'] },
      { label: 'Reaction', detail: 'The chip industry asks for clear, workable rules.', leaves: ['Industry statement', 'Check effective date'] },
    ] },
    related: ['chip-licences-southeast-asia-brazil', 'nvidia-q3-fy27-record-revenue'],
    keywords: ['chips', 'export controls', 'ai', 'bis', 'commerce', 'remote access', 'semiconductors'],
    thumb: { motif: 'chip', a: '#334e8f', b: '#8fb4ff' },
  },
  {
    slug: 'chip-licences-southeast-asia-brazil',
    topic: 'technology', kind: 'News', scope: 'World', date: '2026-11-22T11:00:00Z', minutes: 3, level: 'secondary',
    title: 'Chip licences will be needed for Indonesia, Malaysia, Singapore, Thailand and Brazil',
    dek: 'The US says the requirement is meant to stop advanced chips being diverted to China. Governments in Singapore, Thailand and Indonesia have responded.',
    blink: [
      'Exports of advanced US chips to Indonesia, Malaysia, Singapore, Thailand and Brazil will require a licence. [1]',
      'Commerce framed the step as a way to stop Nvidia AI chips being diverted to China. [1]',
      'Governments in Singapore, Thailand and Indonesia have publicly responded. [2]',
    ],
    why: 'Many data centres that serve global AI customers sit in Southeast Asia. A licence requirement changes how quickly those sites can get hardware, and so where AI computing gets built.',
    body: [
      { h: 'What is new', p: 'Reports on the November rule say shipments of covered advanced chips to five countries now need a US licence. [1,3]' },
      { h: 'The stated reason', p: 'The US framed the change as an anti-diversion measure: a way to stop chips bought in one country from ending up in China. We have not seen evidence about any specific shipment, and this post does not allege any. [1]' },
      { h: 'The regional response', p: 'Singapore, Thailand and Indonesia have each responded to the rule. We have only seen summaries of those responses, so we do not quote them here. [2]' },
      { h: 'What it means in practice', p: 'In our reading, companies building data centres in these countries may face longer waits and more paperwork for hardware. How much longer will depend on how quickly licences are processed, which the sources do not say.' },
    ],
    caveat: 'These are secondary reports. We have not read the rule text or the governments’ own statements.',
    sources: [
      { title: 'W.Media: US moves to stop chip diversion through Southeast Asia and Brazil', url: 'https://w.media/us-moves-to-stop-chip-diversion-through-southeast-asia-and-brazil/', note: 'Trade report on the licence requirement' },
      { title: 'W.Media: Singapore, Thailand, Indonesia respond to new US chip export rule', url: 'https://w.media/?p=45404', note: 'Trade report on regional responses' },
      { title: 'Greenberg Traurig: BIS interim final rule targets remote access to advanced semiconductors', url: 'https://www.gtlaw.com/ar/insights/2026/11/bis-interim-final-rule-targets-remote-access-to-advanced-semiconductors-rescinds-ai-diffusion-rule', note: 'Law-firm summary of the rule' },
    ],
    map: { center: 'Licences', branches: [
      { label: 'Five countries', detail: 'Covered chips now need a US licence to reach them.', leaves: ['Indonesia, Malaysia', 'Singapore, Thailand, Brazil'] },
      { label: 'Stated aim', detail: 'Stop advanced chips being diverted to China.', leaves: ['Anti-diversion', 'No specific shipment alleged here'] },
      { label: 'Responses', detail: 'Three governments have commented.', leaves: ['Singapore', 'Thailand, Indonesia'] },
    ] },
    related: ['us-ai-chip-rule-remote-access', 'nvidia-q3-fy27-record-revenue'],
    keywords: ['chips', 'southeast asia', 'brazil', 'export controls', 'singapore', 'malaysia', 'data centres'],
    thumb: { motif: 'globe', a: '#1b6aa5', b: '#7fd0e8' },
  },
  {
    slug: 'india-approves-12-chip-projects',
    topic: 'technology', kind: 'News', scope: 'India', date: '2026-11-22T12:00:00Z', minutes: 4, level: 'secondary',
    title: 'India has approved 12 chip projects worth about ₹1.64 lakh crore',
    dek: 'Reports from late June 2026 describe one silicon fab, one silicon carbide fab, a display fab and nine packaging units. The first fab is expected in 2028.',
    blink: [
      'India has approved 12 semiconductor projects with about ₹1.64 lakh crore in investment. [1]',
      'They include one silicon fab, one silicon carbide fab, one Micro LED display fab and nine packaging units. [1]',
      'The government says production has begun at Micron, Kaynes and CG Semi, and the first fab is expected to be commissioned in 2028. [1]',
    ],
    why: 'Chips sit inside phones, cars and data centres. Where they are made decides who can supply them in a shortage, and India is trying to become one of those places.',
    body: [
      { h: 'What was approved', p: 'The 12 projects include one silicon fab, one silicon carbide fab, one integrated gallium nitride Micro LED display fab and nine packaging units, with an investment pipeline of about ₹1.64 lakh crore. [1]' },
      { h: 'Where production stands', p: 'Per the government’s own count as reported, commercial production has already begun at Micron, Kaynes and CG Semi. The first semiconductor fab is expected to be commissioned in 2028. [1]' },
      { h: 'The next phase', p: 'The Cabinet has approved Semicon 2.0 with an outlay of about ₹1.28 lakh crore. Reports give slightly different figures; one cites ₹1,27,500 crore, so check the official text before quoting a number. [2]' },
      { h: 'Data centres are growing too', p: 'An Axis Capital estimate cited in coverage says installed data-centre capacity could rise from about 1.3 to 1.4 GW today to roughly 3 to 3.6 GW by 2030. [3]' },
    ],
    caveat: 'These figures come from news reports of government announcements around 28 June 2026, not from the Cabinet text. Reports differ on some outlay numbers.',
    sources: [
      { title: 'Orissa Post: India approves 12 chip manufacturing projects with Rs 1.64 lakh crore investment pipeline', url: 'https://www.orissapost.com/india-approves-12-chip-manufacturing-projects-with-rs-1-64-lakh-crore-investment-pipeline/amp/', note: 'News report on the approvals' },
      { title: 'Inc42: Cabinet approves ₹1.28 lakh crore Semicon 2.0', url: 'https://inc42.com/buzz/cabinet-approves-₹1-28-lakh-cr-semicon-2-0-to-boost-indias-chip-ecosystem/', note: 'Report on the next phase' },
      { title: 'Open Magazine: India’s $20 billion chip bet enters next phase as AI sparks data centre boom', url: 'https://openthemagazine.com/india/indias-20-billion-chip-bet-enters-next-phase-as-ai-sparks-data-centre-boom', note: 'Data-centre capacity estimate' },
    ],
    map: { center: 'India chips', branches: [
      { label: 'Approved', detail: 'Twelve projects, about ₹1.64 lakh crore.', leaves: ['1 silicon fab', '9 packaging units'] },
      { label: 'Producing', detail: 'Some plants already make chips.', leaves: ['Micron', 'Kaynes, CG Semi'] },
      { label: 'Next', detail: 'A second phase and a first fab.', leaves: ['Semicon 2.0', 'First fab: 2028'] },
    ] },
    related: ['us-ai-chip-rule-remote-access', 'nvidia-q3-fy27-record-revenue'],
    keywords: ['india', 'semiconductor', 'fab', 'micron', 'semicon 2.0', 'data centres'],
    thumb: { motif: 'chip', a: '#9a3412', b: '#fdba74' },
  },
  {
    slug: 'discovery-plus-price-rise-decoded',
    topic: 'economy', kind: 'News', scope: 'World', date: '2026-11-22T13:00:00Z', minutes: 3, level: 'secondary',
    title: 'Discovery+ is getting dearer: what the price rise tells you',
    dek: 'The US price rise was announced on 13 October, days after Skydance completed its takeover of the service’s parent. Existing customers see it on bills from 12 November.',
    blink: [
      'The ad-supported plan rises by $1 to $6.99 a month, and the ad-free plan by $2 to $11.99. [1]',
      'Existing customers got 30 days’ notice, with new charges on bills from 12 November 2026. [1]',
      'The rise came just days after Skydance completed its acquisition of the service’s parent operations. [1,2]',
    ],
    why: 'A price rise soon after a takeover is a common pattern: new owners look for revenue they can raise quickly. Knowing that helps you decide whether to keep paying.',
    body: [
      { h: 'The numbers', p: 'The ad-supported plan goes from $5.99 to $6.99, and the ad-free plan from $9.99 to $11.99, in the United States. [1]' },
      { h: 'The timing', p: 'The change was announced on 13 October 2026, days after Skydance completed its acquisition. Existing subscribers have 30 days’ notice, so the new charge shows on bills from 12 November. [1,2]' },
      { h: 'Decoding the wording', p: 'Companies often describe such changes as an adjustment to reflect value. Plainly, it means you pay more. This is our reading of the wording, not a statement from the company.' },
      { h: 'What you can do', p: 'Check your next bill, compare the ad-supported plan with the ad-free one, and cancel or pause if you watch it rarely. Most services let you rejoin later.' },
    ],
    caveat: 'Prices are for the United States. We have not confirmed the previous prices with the company; they follow from the reported increases.',
    sources: [
      { title: 'Android Headlines: Discovery+ subscribers will now pay more for streaming', url: 'https://www.androidheadlines.com/2026/10/discovery-plus-subscribers-will-now-pay-more-for-streaming.html', note: 'Report on the price rise and billing dates' },
      { title: 'Cord Cutters News: Skydance is raising the price of its Discovery+ streaming service', url: 'https://cordcuttersnews.com/?p=257869', note: 'Report linking the rise to the takeover' },
    ],
    map: { center: 'Discovery+ price rise', branches: [
      { label: 'New prices', detail: 'Both plans cost more in the US.', leaves: ['With ads: $6.99', 'Ad-free: $11.99'] },
      { label: 'Timing', detail: 'Soon after the takeover.', leaves: ['Announced 13 Oct', 'Bills from 12 Nov'] },
      { label: 'Your move', detail: 'Check, compare, decide.', leaves: ['Compare plans', 'Cancel or pause'] },
    ] },
    related: ['streaming-bundle-costs-add-up', 'nvidia-q3-fy27-record-revenue'],
    keywords: ['discovery+', 'streaming', 'price rise', 'skydance', 'subscription'],
    thumb: { motif: 'rupee', a: '#6d28d9', b: '#c4b5fd' },
  },
  {
    slug: 'streaming-bundle-costs-add-up',
    topic: 'economy', kind: 'News', scope: 'World', date: '2026-11-22T14:00:00Z', minutes: 3, level: 'secondary',
    title: 'A basket of seven streaming services now costs about $112 a month',
    dek: 'One roundup puts the monthly cost of seven services at $112.43 in June 2026, up from $99.93 eight months earlier. Disney+ ad-free reached $21.49 in September.',
    blink: [
      'A seven-service bundle rose from $99.93 to $112.43 a month between October 2025 and June 2026. [2]',
      'Disney+ ad-free reached $21.49 in September 2026, its sixth annual price rise. [1]',
      'Disney froze the price of three bundles, including its cheapest ad-supported Disney+ and Hulu bundle. [1]',
    ],
    why: 'Each rise is small, so it is easy to accept. Added together, they change what a household spends, and bundles are one way companies keep you subscribed.',
    body: [
      { h: 'The basket', p: 'A roundup that tracks seven services found the combined monthly cost rose by about 12.5% between October 2025 and June 2026, from $99.93 to $112.43. [2]' },
      { h: 'One service, six rises', p: 'The ad-free Disney+ plan reached $21.49 in September 2026. The report counts one price rise every year from 2021 to 2026. [1]' },
      { h: 'Why bundles are frozen', p: 'Disney held the price of three bundles, including its cheapest ad-supported Disney+ and Hulu bundle. In our reading, holding bundle prices while raising single plans nudges people toward bundles, which are harder to cancel one service at a time.' },
      { h: 'How to keep control', p: 'List what you pay each month, cancel services you have not opened for 30 days, and rotate services instead of keeping all of them.' },
    ],
    caveat: 'The basket figure comes from one trade roundup, and the services it includes may differ from yours. Prices are for the United States.',
    sources: [
      { title: 'TechSpot: Disney raises prices again, ad-free plan climbs', url: 'https://www.techspot.com/news/113976-disney-raises-prices-again-ad-free-plan-climbs.html', note: 'Disney+ prices and frozen bundles' },
      { title: 'Programming Insider: The $112 basket, how streaming’s quiet price round rewired viewer behavior in 2026', url: 'https://programminginsider.com/the-112-basket-how-streamings-quiet-price-round-rewired-viewer-behavior-in-2026/', note: 'Seven-service basket cost' },
    ],
    map: { center: 'Streaming costs', branches: [
      { label: 'The basket', detail: 'Seven services together cost more each month.', leaves: ['$99.93 in Oct 2025', '$112.43 in Jun 2026'] },
      { label: 'Disney+', detail: 'Yearly rises, with some bundles frozen.', leaves: ['Ad-free: $21.49', '3 bundles frozen'] },
      { label: 'Your control', detail: 'Track, cancel, rotate.', leaves: ['Monthly list', 'Pause unused services'] },
    ] },
    related: ['discovery-plus-price-rise-decoded', 'reading-an-inflation-number'],
    keywords: ['streaming', 'disney+', 'subscriptions', 'bundles', 'prices'],
    thumb: { motif: 'basket', a: '#047857', b: '#6ee7b7' },
  },
  {
    slug: 'union-pacific-norfolk-southern-review-timeline',
    topic: 'economy', kind: 'News', scope: 'World', date: '2026-11-22T15:00:00Z', minutes: 4, level: 'primary',
    title: 'The $85 billion railroad merger will not be decided before late 2027',
    dek: 'The Surface Transportation Board has set a review schedule for the Union Pacific and Norfolk Southern deal. Final briefs are due on 28 May 2027.',
    blink: [
      'The Board has begun reviewing the merits of the $85 billion Union Pacific and Norfolk Southern merger. [1]',
      'Final briefs are due on 28 May 2027, and a public hearing is expected before that. [1]',
      'A final decision is due within 90 days after the record closes, which puts it well into the second half of 2027. [1,2]',
    ],
    why: 'A merger is not final when it is announced. Regulators can take more than a year to decide, and the outcome affects prices and service for businesses that ship by rail.',
    body: [
      { h: 'Where the review stands', p: 'The Surface Transportation Board took the proceeding out of abeyance and began reviewing the merits. It stressed that this is not a ruling on the merits of the application. [1]' },
      { h: 'The key dates', p: 'Final briefs are due on 28 May 2027. The Board expects a public hearing before then, with details to come in a later decision. The date the record closes has not been set. [1]' },
      { h: 'When a decision could come', p: 'The Board will issue a final decision within 90 days after the record closes, provided the environmental review is finished. FreightWaves reports this points to the second half of 2027. [1,2]' },
      { h: 'Decoding “pending”', p: 'When a deal is “pending”, the companies have agreed but regulators have not. Nothing changes for customers until approval. This is our plain-language note.' },
    ],
    caveat: 'The schedule can change. Check the Board’s Union Pacific and Norfolk Southern resource page for current dates.',
    sources: [
      { title: 'Surface Transportation Board: press release PR 26-21', url: 'https://www.stb.gov/wp-content/uploads/PR-26-21.pdf', note: 'Primary: regulator’s procedural schedule' },
      { title: 'FreightWaves: Regulators set schedule for review of UP-NS merger', url: 'https://www.freightwaves.com/news/regulators-set-schedule-for-review-of-up-ns-merger', note: 'Trade report, updated 19 Aug 2026' },
    ],
    map: { center: 'UP and NS merger', branches: [
      { label: 'Review', detail: 'The Board is now examining the merits.', leaves: ['Out of abeyance', 'Not a ruling'] },
      { label: 'Dates', detail: 'A public hearing comes before final briefs.', leaves: ['Hearing: date to come', 'Final briefs: 28 May 2027'] },
      { label: 'Decision', detail: 'Within 90 days of the record closing.', leaves: ['Record close: not set', 'Likely late 2027'] },
    ] },
    related: ['discovery-plus-price-rise-decoded', 'rbi-policy-corridor-explained'],
    keywords: ['merger', 'union pacific', 'norfolk southern', 'railroad', 'regulators', 'stb'],
    thumb: { motif: 'globe', a: '#334155', b: '#94a3b8' },
  },
  {
    slug: 'equitable-corebridge-all-stock-merger',
    topic: 'economy', kind: 'News', scope: 'World', date: '2026-11-22T16:00:00Z', minutes: 3, level: 'secondary',
    title: 'What “all-stock” means in the Equitable and Corebridge merger',
    dek: 'The two insurers agreed an all-stock merger that is expected to close by the end of 2026. Corebridge’s chief executive is slated to lead the combined company.',
    blink: [
      'Equitable and Corebridge agreed an all-stock merger. [1,2]',
      'It is expected to close by the end of 2026. [2]',
      'Corebridge CEO Marc Costantini is slated to become CEO of the new company. [2]',
    ],
    why: 'How a deal is paid for tells you who carries the risk. In an all-stock deal, shareholders receive shares, not cash, so their value moves with the new company’s share price.',
    body: [
      { h: 'The deal in short', p: 'Equitable and Corebridge announced an all-stock merger. Shares of both companies rose after the surprise announcement. [1]' },
      { h: 'What “all-stock” means', p: 'Instead of paying cash, the buyer pays with its own shares. Neither company spends cash, but shareholders’ final value depends on how the combined company’s shares trade. This is a general explanation, not specific to these terms.' },
      { h: 'Who leads', p: 'Corebridge CEO Marc Costantini is slated to become CEO of the new company, and the deal is expected to close by the end of 2026. [2]' },
      { h: 'What to watch', p: 'Closing needs the usual approvals. Until then, the companies run separately.' },
    ],
    caveat: 'We have not read the merger agreement. The exchange ratio and other terms are not covered here.',
    sources: [
      { title: 'S&P Global Market Intelligence: Corebridge, Equitable stocks get a bump after surprise merger news', url: 'https://www.spglobal.com/market-intelligence/en/news-insights/articles/2026/3/corebridge-equitable-stocks-get-a-bump-after-surprise-merger-news-100100569', note: 'Market reaction, March 2026' },
      { title: 'Yahoo Finance: Equitable and Corebridge unveil transformational all-stock merger', url: 'https://finance.yahoo.com/markets/stocks/articles/equitable-corebridge-unveil-transformational-stock-220913738.html', note: 'Deal summary' },
    ],
    map: { center: 'All-stock merger', branches: [
      { label: 'The deal', detail: 'Two insurers combine using shares, not cash.', leaves: ['Equitable', 'Corebridge'] },
      { label: 'Timing', detail: 'Expected to finish this year.', leaves: ['Close by end 2026', 'Needs approvals'] },
      { label: 'Leadership', detail: 'Corebridge’s chief executive leads.', leaves: ['Marc Costantini', 'New CEO'] },
    ] },
    related: ['union-pacific-norfolk-southern-review-timeline', 'rbi-policy-corridor-explained'],
    keywords: ['merger', 'all-stock', 'equitable', 'corebridge', 'insurance', 'ceo'],
    thumb: { motif: 'rupee', a: '#0f766e', b: '#5eead4' },
  },
  {
    slug: 'surveillance-pricing-rules-widen',
    topic: 'economy', kind: 'News', scope: 'World', date: '2026-11-22T17:00:00Z', minutes: 4, level: 'secondary',
    title: 'Shops, prices and your data: the rules on personalised pricing are widening',
    dek: 'US regulators and states are acting on “surveillance pricing”. Retailers say algorithmic pricing is an old practice with new tools.',
    blink: [
      'The FTC moved in August to require retailers to disclose personalised pricing. [2]',
      'Maryland’s ban on surveillance pricing in food retail took effect on 1 October 2026. [3]',
      'New Jersey’s Fair Price Protection Act was signed on 23 July, and in-scope retailers have until 1 August 2027 to comply. [3]',
    ],
    why: 'If a shop can set a price from what it knows about you, two shoppers can pay different amounts for the same item. The new rules aim to make that visible.',
    body: [
      { h: 'Why people are worried', p: 'Coverage on 18 October says terms such as “dynamic pricing” and “surveillance pricing” are causing anxiety online. The National Retail Federation says algorithmic pricing is a new way of doing what retailers have done for years. [1]' },
      { h: 'What experts say about groceries', p: 'One expert noted that changing prices through the day, as airlines and ride apps do, is exceedingly rare in grocery and general merchandise today. [1]' },
      { h: 'What regulators are doing', p: 'The FTC moved in August to require disclosure of personalised pricing, and a Senate Judiciary subcommittee held a hearing on 4 August 2026. [2] At least 30 states have considered pricing bills this year. [3]' },
      { h: 'The company view', p: 'Instacart said it ended its pricing tests in December 2025 and disputes describing them as surveillance pricing. [1]' },
    ],
    caveat: 'This is US coverage. We have not read the bills or the FTC action ourselves, and rules differ by state.',
    sources: [
      { title: 'Boston Globe (AP): AI-assisted pricing tools make US consumers nervous', url: 'https://www.bostonglobe.com/2026/10/18/business/ai-assisted-pricing-tools-us-consumer/', note: 'News report, 18 Oct 2026' },
      { title: 'Fortune: FTC, retailers, personalised pricing and consumer surveillance', url: 'https://fortune.com/2026/08/24/ftc-retailers-personalized-pricing-consumer-surveillance/', note: 'Report on the FTC move, 24 Aug 2026' },
      { title: 'BakerHostetler: Personalised pricing prohibitions, New Jersey joins Maryland and Connecticut', url: 'https://www.bakerlaw.com/insights/personalized-pricing-prohibitions-new-jersey-joins-maryland-and-connecticut-in-regulating-consumer-data-in-retail-pricing-decisions/', note: 'Law-firm summary of state rules' },
    ],
    map: { center: 'Personalised pricing', branches: [
      { label: 'The worry', detail: 'Prices set from what a shop knows about you.', leaves: ['Dynamic pricing', 'Surveillance pricing'] },
      { label: 'Regulators', detail: 'Federal and state action in 2026.', leaves: ['FTC disclosure', 'Senate hearing, 4 Aug'] },
      { label: 'States', detail: 'New laws and many bills.', leaves: ['Maryland: 1 Oct 2026', 'New Jersey: Aug 2027'] },
    ] },
    related: ['reading-an-inflation-number', 'streaming-bundle-costs-add-up'],
    keywords: ['surveillance pricing', 'dynamic pricing', 'ftc', 'retail', 'privacy', 'maryland', 'new jersey'],
    thumb: { motif: 'basket', a: '#b45309', b: '#fcd34d' },
  },
  {
    slug: 'memory-shortage-raises-device-prices',
    topic: 'technology', kind: 'News', scope: 'World', date: '2026-11-22T18:00:00Z', minutes: 4, level: 'secondary',
    title: 'Why your next phone or laptop may cost more: AI is buying the memory',
    dek: 'Demand from AI data centres is competing with consumer devices for the same memory chips. Forecasts of the price effect differ widely.',
    blink: [
      'AI data centres and consumer devices compete for the same DRAM and NAND supply. [1]',
      'Samsung and SK Hynix together control more than 70% of the global DRAM market. [1]',
      'Forecasts of device price rises range from about 8% to 20%, so treat any single number with care. [1,3]',
    ],
    why: 'Memory is in every phone, laptop and car. When AI buyers pay more for it, makers either raise prices, cut specifications or sell fewer devices.',
    body: [
      { h: 'What is happening', p: 'Memory makers have limited output, and AI data-centre demand is taking a large share of it, which leaves less for consumer devices. [1]' },
      { h: 'Who makes it', p: 'Samsung Electronics and SK Hynix together control more than 70% of the global DRAM market. [1]' },
      { h: 'The forecasts disagree', p: 'One technology report puts the rise in PC and smartphone prices at about 8% in 2026. [3] Other analyst estimates quoted in coverage run from 10% to 20% by the end of 2026. Because they use different baselines, we do not pick one.' },
      { h: 'What it means for you', p: 'If you plan to buy a device, compare prices now and check whether memory or storage has been reduced to hold the price.' },
    ],
    caveat: 'Most forecasts we found date from late 2025 to mid 2026, and none gave November 2026 memory prices. Check a current price tracker before deciding.',
    sources: [
      { title: 'Digit: Why memory prices are rising in 2026 and why it affects every device you buy', url: 'https://www.digit.in/features/general/why-memory-prices-are-rising-in-2026-and-why-it-affects-every-device-you-buy.html', note: 'Explainer on the shortage' },
      { title: 'Bloomberg: The 2026 AI boom and the memory chip shortage', url: 'https://www.bloomberg.com/graphics/2026-ai-boom-memory-chip-shortage/', note: 'Graphics report on supply' },
      { title: 'TechSpot: Memory shortages raise PC and smartphone prices 8% in 2026', url: 'https://www.techspot.com/news/110679-memory-shortages-raise-pc-smartphone-prices-8-2026.html', note: 'Price forecast report' },
    ],
    map: { center: 'Memory squeeze', branches: [
      { label: 'Cause', detail: 'AI data centres and devices want the same chips.', leaves: ['DRAM and NAND', 'Limited output'] },
      { label: 'Suppliers', detail: 'Two firms dominate DRAM.', leaves: ['Samsung', 'SK Hynix'] },
      { label: 'Effect', detail: 'Higher prices, but forecasts vary.', leaves: ['About 8% to 20%', 'Check before buying'] },
    ] },
    related: ['nvidia-q3-fy27-record-revenue', 'us-ai-chip-rule-remote-access'],
    keywords: ['memory', 'dram', 'nand', 'laptops', 'smartphones', 'prices', 'ai'],
    thumb: { motif: 'chip', a: '#7c2d12', b: '#fdba74' },
  },
  {
    slug: 'right-to-repair-spreads-across-states',
    topic: 'technology', kind: 'News', scope: 'World', date: '2026-11-22T19:00:00Z', minutes: 4, level: 'secondary',
    title: 'Right to repair is spreading: 13 US states now have a law',
    dek: 'A July 2026 legal analysis counts 13 states with a right-to-repair statute. Texas’s law took effect on 1 September, and a farm-equipment case was settled.',
    blink: [
      'As of July 2026, 13 US states had enacted some form of right-to-repair law. [1]',
      'Texas’s law applies to electronics sold from 1 September 2026 that cost at least $50 wholesale. [1,2]',
      'The FTC’s case against Deere & Company was settled in July 2026, with Deere agreeing to open its repair ecosystem. [1]',
    ],
    why: 'If you can get parts, manuals and tools, a broken phone or tractor can be fixed instead of replaced. That affects what you spend and how long things last.',
    body: [
      { h: 'The state picture', p: 'A legal analysis dated 30 July 2026 counts 13 states with some form of right-to-repair statute. [1] PIRG reports 57 active bills in 22 states so far in 2026. [3]' },
      { h: 'Electronics', p: 'Texas’s law applies from 1 September 2026 to electronic devices and components sold to consumers that cost at least $50 wholesale. Connecticut’s took effect on 1 July 2026. [1,2]' },
      { h: 'Parts pairing', p: 'Washington requires manufacturers to stop using parts pairing to block repairs from 1 January 2026. Parts pairing is software that refuses a part unless the maker approves it. [1]' },
      { h: 'Farm equipment', p: 'The FTC’s monopolisation case against Deere & Company settled in July 2026. Deere agreed to open its repair ecosystem to farmers and independent technicians. [1]' },
    ],
    caveat: 'These laws are US state laws and do not apply in India. Details and exemptions vary by state.',
    sources: [
      { title: 'Faegre Drinker: Unlocking the right to repair, the expanding compliance landscape', url: 'https://faegredrinker.com/en/insights/publications/2026/7/unlocking-the-right-to-repair-the-expanding-compliance-landscape', note: 'Law-firm analysis, 30 Jul 2026' },
      { title: 'iFixit: Texas is fixin’ to fix repair', url: 'https://www.ifixit.com/News/111288/texas-is-fixin-to-fix-repair-right-to-repair-signed-into-law', note: 'Report on the Texas law' },
      { title: 'PIRG: States press ahead on right to repair', url: 'https://pirg.org/?p=26081', note: 'Advocacy group tracker of bills' },
    ],
    map: { center: 'Right to repair', branches: [
      { label: 'States', detail: 'A growing patchwork of laws.', leaves: ['13 states', '57 bills in 22 states'] },
      { label: 'Electronics', detail: 'New rules for phones and similar devices.', leaves: ['Texas: 1 Sep 2026', 'Connecticut: 1 Jul 2026'] },
      { label: 'Big cases', detail: 'A farm-equipment settlement.', leaves: ['FTC and Deere', 'Settled July 2026'] },
    ] },
    related: ['memory-shortage-raises-device-prices', 'reading-an-inflation-number'],
    keywords: ['right to repair', 'texas', 'deere', 'repair', 'electronics', 'ftc', 'parts pairing'],
    thumb: { motif: 'wifi', a: '#1e3a8a', b: '#93c5fd' },
  },
];

export const topicNames: Record<Topic, string> = { india: 'India', world: 'World', technology: 'Technology', science: 'Science', economy: 'Economy' };
export const postsByDate = [...posts].sort((a, b) => b.date.localeCompare(a.date));
import { validateSources } from './sources';
const sourceProblems = posts.flatMap(validateSources);
if (sourceProblems.length) throw new Error('Source problems:\n' + sourceProblems.join('\n'));

export const getPost = (slug: string) => posts.find(p => p.slug === slug);

export type Event = { date: string; title: string; text: string; url: string; source: string; status: 'confirmed' | 'reported' | 'unconfirmed' };
export const events: Event[] = [
  { date: '2026-11-20', title: 'COP31 closes in Antalya', text: 'Scheduled last day of the UN climate conference. Final decision texts are published by the UNFCCC.', url: 'https://unfccc.int/cop31/about', source: 'UNFCCC', status: 'confirmed' },
  { date: '2026-12-02', title: 'Nvidia dividend record date', text: 'Holders of record on this date receive the $0.25 per share dividend.', url: 'https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-third-quarter-fiscal-2027', source: 'NVIDIA press release', status: 'confirmed' },
  { date: '2026-12-04', title: 'RBI Monetary Policy Committee decision', text: 'Reported next decision date. Check the RBI calendar before relying on it.', url: 'https://www.rbi.org.in/', source: 'Third-party reports', status: 'reported' },
  { date: '2026-12-09', title: 'US Federal Reserve rate decision', text: 'Reported date of the meeting markets are watching; gold and the dollar are sensitive to it.', url: 'https://www.cmegroup.com/markets/interest-rates/cme-fedwatch-tool.html', source: 'CME FedWatch via GoldSilver', status: 'reported' },
  { date: '2026-12-23', title: 'Nvidia dividend payment date', text: 'Payment date for the $0.25 per share quarterly dividend.', url: 'https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-third-quarter-fiscal-2027', source: 'NVIDIA press release', status: 'confirmed' },
  { date: '2026-12-31', title: 'Gaganyaan G1 target window ends', text: 'The government’s stated Q4 2026 target ends today; a report suggests the flight may slip to February 2027.', url: 'https://www.isro.gov.in/', source: 'ISRO / third-party reports', status: 'unconfirmed' },
];
