import React from 'react';
import { Heart, ExternalLink, ShieldCheck, Check, Sparkles, Mail, MessageSquare } from 'lucide-react';
import { playClickSound, playZapSound } from '../utils/sound';

export const PatreonHub: React.FC = () => {
  const tiers = [
    {
      name: 'The Observer',
      price: '$3',
      cadence: '/ month',
      desc: 'Fuel our independent fact-checking and get day-early access.',
      popular: false,
      perks: [
        '24-Hour Early Drop Access',
        'Private Founding Discord Member Role',
        'Vote on Weekly Community Polls',
        'Ad-Free Direct Video Links'
      ],
      cta: 'Join Observer Tier'
    },
    {
      name: 'The Insider',
      price: '$7',
      cadence: '/ month',
      desc: 'Our flagship tier for deep thinkers who want the unredacted source documents.',
      popular: true,
      perks: [
        'All Observer Perks Included',
        'Uncut Research Dossiers & Citations',
        'Raw Script Notes & B-Roll Archives',
        'Monthly Live Behind-The-Scenes Briefing',
        'Topic Submission Priority'
      ],
      cta: 'Become an Insider'
    },
    {
      name: 'The Syndicate',
      price: '$15',
      cadence: '/ month',
      desc: 'Directly sponsor independent investigative media free from corporate influence.',
      popular: false,
      perks: [
        'All Insider Perks Included',
        'Executive Producer End-Screen Credit',
        'Quarterly 1-on-1 Topic Pitch Call',
        'Exclusive High-Res Channel Art & Wallpapers',
        'Permanent Hall of Fame Listing'
      ],
      cta: 'Join The Syndicate'
    }
  ];

  return (
    <section id="patreon" className="py-24 relative overflow-hidden bg-[#060b14]">
      {/* Background glow */}
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-[#d9fa22]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0e1a32] border border-[#1e345e] text-xs font-mono text-[#d9fa22] mb-3">
            <Heart className="w-3.5 h-3.5 fill-current" /> INDEPENDENT PATRON ALLIANCE
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-['Syne',sans-serif] text-white">
            Uncompromising Truth Needs Independent Fuel
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#889bb8]">
            When you call out Big Tech nonsense and corporate PR spin, you can't rely on Big Tech ad networks. Back us on Patreon to keep our investigations 100% unsponsored and fearless.
          </p>
        </div>

        {/* Tiers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          {tiers.map((t) => (
            <div
              key={t.name}
              className={`relative rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 ${
                t.popular
                  ? 'bg-[#0a1428] border-2 border-[#d9fa22] shadow-[0_0_35px_rgba(217,250,34,0.25)] scale-105 z-10'
                  : 'bg-[#0a1222] border border-[#162747] hover:border-[#1e3b6e]'
              }`}
            >
              {t.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#d9fa22] text-[#070d18] text-xs font-mono font-black uppercase tracking-wider shadow-[0_0_15px_#d9fa22]">
                  Most Popular
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold font-['Syne',sans-serif] text-white">
                    {t.name}
                  </h3>
                  {t.popular && <Sparkles className="w-5 h-5 text-[#d9fa22]" />}
                </div>

                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-4xl sm:text-5xl font-black font-['Syne',sans-serif] text-white">
                    {t.price}
                  </span>
                  <span className="text-xs font-mono text-[#889bb8]">{t.cadence}</span>
                </div>

                <p className="text-xs sm:text-sm text-[#889bb8] mb-6">
                  {t.desc}
                </p>

                <div className="border-t border-[#162747] pt-6 mb-8 space-y-3">
                  {t.perks.map((p) => (
                    <div key={p} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#b3c3db]">
                      <Check className="w-4 h-4 text-[#d9fa22] shrink-0 mt-0.5" />
                      <span>{p}</span>
                    </div>
                  ))}
                </div>
              </div>

              <a
                href="https://www.patreon.com/cw/BlinkKnowRepeat"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => playZapSound()}
                className={`w-full py-3.5 rounded-xl font-bold text-xs tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2 ${
                  t.popular
                    ? 'bg-[#d9fa22] text-[#070d18] hover:bg-white shadow-[0_0_20px_rgba(217,250,34,0.4)]'
                    : 'bg-[#0e1a32] text-white hover:bg-[#142344] border border-[#1e345e]'
                }`}
              >
                <span>{t.cta}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          ))}
        </div>

        {/* Direct Email Contact Box */}
        <div className="p-8 sm:p-10 rounded-3xl bg-[#0a1222] border border-[#1e345e] max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#0e1a32] border border-[#1e345e] flex items-center justify-center text-[#d9fa22] shrink-0">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-mono text-[#889bb8] uppercase">Direct Dispatch</div>
              <h4 className="text-lg sm:text-xl font-bold font-['Syne',sans-serif] text-white">
                Have a tip, story leak, or collaboration?
              </h4>
              <p className="text-xs sm:text-sm text-[#889bb8]">
                Say hello at <span className="text-[#d9fa22] font-mono">blinkknowrepeat@gmail.com</span>
              </p>
            </div>
          </div>

          <a
            href="mailto:blinkknowrepeat@gmail.com"
            onClick={() => playClickSound()}
            className="px-6 py-3 rounded-xl bg-[#0e1a32] hover:bg-[#d9fa22] text-[#d9fa22] hover:text-[#070d18] border border-[#1e345e] font-bold text-xs font-mono tracking-wider transition-all duration-200 shrink-0"
          >
            Say Hello &rarr;
          </a>
        </div>
      </div>
    </section>
  );
};
