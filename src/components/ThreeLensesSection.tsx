import React, { useState } from 'react';
import { Target, DollarSign, AlertTriangle, Layers, Cpu, Sparkles, ShieldAlert, ArrowRight } from 'lucide-react';
import { playClickSound, playZapSound } from '../utils/sound';

export const ThreeLensesSection: React.FC = () => {
  const [activeCase, setActiveCase] = useState(0);

  const cases = [
    {
      id: 'toaster',
      badge: 'TECH & IOT',
      title: 'Why Does Your Toaster Need Wi-Fi?',
      icon: <Sparkles className="w-5 h-5 text-[#d9fa22]" />,
      summary: 'Smart appliances exist because one-time hardware sales died.',
      whatHappened:
        'A $30 appliance now embeds a $1 Espressif Wi-Fi chip requiring companion accounts, background telemetry pinging AWS servers, and mandatory firmware updates.',
      whoBenefits:
        'Manufacturers build recurring telemetry valuation, telemetry brokers trade household schedules, and cloud platforms bill per-device MQTT connection hours.',
      whyItMatters:
        'When the company pivots or cancels AWS support, your functional toaster turns into an e-waste brick with unpatched CVEs on your home LAN.'
    },
    {
      id: 'chips',
      badge: 'WORLD AFFAIRS',
      title: 'Tiny Chips. Big Stakes.',
      icon: <Cpu className="w-5 h-5 text-[#d9fa22]" />,
      summary: '90% of global advanced compute flows through a 100-mile strait.',
      whatHappened:
        'Sub-3nm microchips require EUV lithography machines manufactured exclusively by ASML and operated primarily by TSMC in Hsinchu.',
      whoBenefits:
        'Defense conglomerates, sovereign semiconductor subsidies, and cloud hyperscalers who monopolize the high-NA wafer purchase allocations.',
      whyItMatters:
        'A single geopolitical tremor, earthquake, or naval blockade halts global car manufacturing, smartphone shipments, and server rollouts for 18 months.'
    },
    {
      id: 'slides',
      badge: 'BUSINESS',
      title: 'The 47-Slide "Simpler Strategy" Paradox',
      icon: <Layers className="w-5 h-5 text-[#d9fa22]" />,
      summary: 'Corporate restructuring isn’t about simplicity; it is about hedge fund theatre.',
      whatHappened:
        'Executive teams bring in MBB consulting partners to present a 47-slide "transformation matrix" right before announcing 15% workforce reductions.',
      whoBenefits:
        'Consulting billable rates, C-suite restructuring bonuses tied to short-term free-cash-flow bumps, and slide-deck narrative spinning.',
      whyItMatters:
        'Institutional memory and engineering talent get hollowed out while product complexity silently doubles beneath buzzwords.'
    },
    {
      id: 'ai-epistemology',
      badge: 'AI & TRUTH',
      title: 'Confident. But Correct?',
      icon: <ShieldAlert className="w-5 h-5 text-[#d9fa22]" />,
      summary: 'A fluent answer still needs a source.',
      whatHappened:
        'Modern generative models optimize next-token likelihood, generating linguistically flawless citations for papers and court cases that never happened.',
      whoBenefits:
        'Enterprise AI vendors selling automated tier-1 workflows while passing all legal and factual indemnification risk down to employees.',
      whyItMatters:
        'The marginal cost of creating synthetic authoritative text is zero. Truth is now an expensive luxury good requiring manual human verification.'
    }
  ];

  const current = cases[activeCase];

  return (
    <section id="formula" className="py-24 relative overflow-hidden bg-[#060b14]">
      {/* Decorative cyber grid line */}
      <div className="absolute inset-0 cyber-grid opacity-30 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0e1a32] border border-[#1e345e] text-xs font-mono text-[#d9fa22] mb-3">
            THE BLINK, KNOW, REPEAT FORMULA
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-['Syne',sans-serif] text-white">
            The 3 Lenses Behind Every Headline
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#889bb8]">
            We refuse to repeat corporate PR or Twitter ragebait. Every drop passes through our rigorous three-step investigative framework.
          </p>
        </div>

        {/* 3 Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {/* Pillar 1 */}
          <div className="relative p-7 sm:p-8 rounded-3xl bg-[#0a1222] border border-[#162747] hover:border-[#d9fa22]/50 transition-all duration-300 group shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-[#0e1a32] border border-[#1e345e] flex items-center justify-center text-[#d9fa22] mb-6 group-hover:scale-110 transition-transform">
              <Target className="w-6 h-6" />
            </div>
            <div className="text-xs font-mono text-[#d9fa22] tracking-widest uppercase mb-1">
              Step 01 • Blink
            </div>
            <h3 className="text-2xl font-bold font-['Syne',sans-serif] text-white mb-3">
              What Happened?
            </h3>
            <p className="text-sm text-[#889bb8] leading-relaxed">
              We slice through the jargon, promotional hype, and buzzword bingo. In 10 seconds flat, you get the pure, objective ground-truth of the event.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="relative p-7 sm:p-8 rounded-3xl bg-[#0a1222] border border-[#162747] hover:border-[#d9fa22]/50 transition-all duration-300 group shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-[#0e1a32] border border-[#1e345e] flex items-center justify-center text-[#d9fa22] mb-6 group-hover:scale-110 transition-transform">
              <DollarSign className="w-6 h-6" />
            </div>
            <div className="text-xs font-mono text-[#d9fa22] tracking-widest uppercase mb-1">
              Step 02 • Know
            </div>
            <h3 className="text-2xl font-bold font-['Syne',sans-serif] text-white mb-3">
              Who Benefits?
            </h3>
            <p className="text-sm text-[#889bb8] leading-relaxed">
              Follow the capital flows, the patent monopolies, the venture debt, and the regulatory moats. Nothing in global technology occurs in a vacuum.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="relative p-7 sm:p-8 rounded-3xl bg-[#0a1222] border border-[#162747] hover:border-[#d9fa22]/50 transition-all duration-300 group shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-[#0e1a32] border border-[#1e345e] flex items-center justify-center text-[#d9fa22] mb-6 group-hover:scale-110 transition-transform">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="text-xs font-mono text-[#d9fa22] tracking-widest uppercase mb-1">
              Step 03 • Repeat
            </div>
            <h3 className="text-2xl font-bold font-['Syne',sans-serif] text-white mb-3">
              Why It Matters?
            </h3>
            <p className="text-sm text-[#889bb8] leading-relaxed">
              What does this mean for your digital privacy, your career, your personal balance sheet, and our shared civilization? Actionable signal.
            </p>
          </div>
        </div>

        {/* Interactive Case Study Simulator */}
        <div className="relative p-7 sm:p-10 rounded-3xl bg-[#0a1222]/95 border border-[#1e345e] shadow-2xl overflow-hidden">
          {/* Animated Scanning Laser Line passing across case study */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#d9fa22] to-transparent animate-pulse opacity-75" />

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-[#162747]">
            <div>
              <div className="text-xs font-mono text-[#889bb8] uppercase tracking-wider">
                Interactive Case Dissection
              </div>
              <h4 className="text-xl sm:text-2xl font-extrabold font-['Syne',sans-serif] text-white mt-1">
                See the Framework in Real-Time
              </h4>
            </div>

            {/* Case selector buttons with generous padding */}
            <div className="flex flex-wrap gap-2.5">
              {cases.map((c, idx) => (
                <button
                  key={c.id}
                  onClick={() => {
                    playClickSound();
                    setActiveCase(idx);
                  }}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold font-mono transition-all duration-200 cursor-pointer ${
                    activeCase === idx
                      ? 'bg-[#d9fa22] text-[#070d18] shadow-[0_0_20px_rgba(217,250,34,0.4)]'
                      : 'bg-[#0e1a32] text-[#889bb8] hover:text-white border border-[#1e345e]'
                  }`}
                >
                  {c.badge}
                </button>
              ))}
            </div>
          </div>

          {/* Current Case Detail */}
          <div className="mt-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2.5 rounded-xl bg-[#0e1a32] border border-[#1e345e]">
                {current.icon}
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold font-['Syne',sans-serif] text-white">
                {current.title}
              </h3>
            </div>
            <p className="text-base text-[#d9fa22] font-semibold mb-8">
              "{current.summary}"
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-[#070d18] border border-[#162747] hover:border-[#d9fa22]/40 transition-colors">
                <div className="text-xs font-mono font-bold text-[#d9fa22] mb-2.5 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#d9fa22] animate-ping" />
                  WHAT HAPPENED?
                </div>
                <p className="text-sm text-[#b3c3db] leading-relaxed">
                  {current.whatHappened}
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#070d18] border border-[#162747] hover:border-[#d9fa22]/40 transition-colors">
                <div className="text-xs font-mono font-bold text-[#d9fa22] mb-2.5 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#d9fa22] animate-ping" />
                  WHO BENEFITS?
                </div>
                <p className="text-sm text-[#b3c3db] leading-relaxed">
                  {current.whoBenefits}
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#070d18] border border-[#162747] hover:border-[#d9fa22]/40 transition-colors">
                <div className="text-xs font-mono font-bold text-[#d9fa22] mb-2.5 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#d9fa22] animate-ping" />
                  WHY IT MATTERS?
                </div>
                <p className="text-sm text-[#b3c3db] leading-relaxed">
                  {current.whyItMatters}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
