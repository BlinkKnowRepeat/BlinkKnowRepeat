import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { FOUNDING_MEMBERS_SAMPLE } from '../data/episodes';
import { Zap, ShieldCheck, Download, Award, CheckCircle2, Sparkles, Users, Send } from 'lucide-react';
import { playClickSound, playSuccessSound, playZapSound } from '../utils/sound';

interface FoundingMilestoneProps {
  onOpenSubscribe: () => void;
}

export const FoundingMilestone: React.FC<FoundingMilestoneProps> = ({ onOpenSubscribe }) => {
  const [handle, setHandle] = useState('');
  const [division, setDivision] = useState<'TECH' | 'AI' | 'BUSINESS' | 'WORLD AFFAIRS'>('TECH');
  const [mintedPass, setMintedPass] = useState<{
    handle: string;
    division: string;
    serial: string;
    date: string;
  } | null>(null);
  const [isMinting, setIsMinting] = useState(false);

  const goal = 1000;
  const currentCount = 428;
  const percentage = Math.round((currentCount / goal) * 100);

  const handleMint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!handle.trim()) return;

    playZapSound();
    setIsMinting(true);

    setTimeout(() => {
      const serialNum = `#BKR-0${currentCount + 1}`;
      setMintedPass({
        handle: handle.startsWith('@') ? handle : `@${handle}`,
        division,
        serial: serialNum,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      });
      setIsMinting(false);
      playSuccessSound();

      // Launch Confetti!
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#d9fa22', '#f5f1e8', '#1a3b6e', '#ffffff']
        });
      } catch (e) {
        console.error(e);
      }
    }, 600);
  };

  return (
    <section id="founding" className="py-24 relative overflow-hidden bg-[#070e1c]">
      {/* Background glow orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#d9fa22]/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0e1a32] border border-[#1e345e] text-xs font-mono text-[#d9fa22] mb-3">
            <Award className="w-3.5 h-3.5" /> FOUNDING COHORT ROADMAP
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-['Syne',sans-serif] text-white">
            Join the Founding 1,000
          </h2>
          <p className="mt-3 text-base sm:text-lg text-[#889bb8]">
            Be here from day one. When Blink, Know, Repeat reaches 1,000,000 subscribers, you’ll carry the badge of the first thousand who backed truth before it was cool.
          </p>
        </div>

        {/* Milestone Progress Bar */}
        <div className="p-8 rounded-3xl bg-[#0a1426] border border-[#1e345e] shadow-2xl mb-16 max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <div className="text-xs font-mono text-[#889bb8] uppercase">Current Cohort Size</div>
              <div className="text-3xl sm:text-4xl font-extrabold font-['Syne',sans-serif] text-white flex items-center gap-2">
                <span>{currentCount}</span>
                <span className="text-base text-[#889bb8] font-normal">/ {goal} Subscribers</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-[#070d18] border border-[#d9fa22]/40 text-xs font-mono text-[#d9fa22] font-bold">
                {percentage}% Claimed
              </span>
              <button
                onClick={() => {
                  playClickSound();
                  onOpenSubscribe();
                }}
                className="px-5 py-2 rounded-xl bg-[#d9fa22] text-[#070d18] text-xs font-black shadow-[0_0_15px_rgba(217,250,34,0.4)] hover:bg-white transition-colors"
              >
                Subscribe Now
              </button>
            </div>
          </div>

          {/* Progress Bar Track */}
          <div className="relative w-full h-4 bg-[#070d18] rounded-full overflow-hidden p-0.5 border border-[#162747]">
            <div
              className="h-full bg-gradient-to-r from-[#1a3b6e] via-[#d9fa22] to-[#e2fb3e] rounded-full transition-all duration-1000 relative shadow-[0_0_15px_#d9fa22]"
              style={{ width: `${percentage}%` }}
            >
              <div className="absolute top-0 right-0 bottom-0 w-2 bg-white animate-ping opacity-80" />
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between text-[11px] font-mono text-[#889bb8]">
            <span>Day 1 Launch</span>
            <span>Midpoint: 500 Subs</span>
            <span className="text-[#d9fa22] font-semibold">1,000 Capstone Lock</span>
          </div>
        </div>

        {/* Two-Column: Interactive Pass Generator & Perks */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Interactive Holographic Pass Generator */}
          <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-[#0a1222] border border-[#1e345e] shadow-xl">
            <div className="flex items-center gap-2 text-xs font-mono text-[#d9fa22] mb-2">
              <Sparkles className="w-4 h-4" /> MINT YOUR DAY-ONE CREDENTIAL
            </div>
            <h3 className="text-2xl font-bold font-['Syne',sans-serif] text-white mb-6">
              Generate Your Founding Member Pass
            </h3>

            {!mintedPass ? (
              <form onSubmit={handleMint} className="space-y-5">
                <div>
                  <label className="block text-xs font-mono text-[#889bb8] uppercase mb-2">
                    Your Handle or Channel Name
                  </label>
                  <input
                    type="text"
                    required
                    value={handle}
                    onChange={(e) => setHandle(e.target.value)}
                    placeholder="e.g. @curious_minds or your name"
                    className="w-full px-4 py-3 rounded-xl bg-[#070d18] border border-[#1e345e] focus:border-[#d9fa22] text-white placeholder-[#4b6080] outline-none text-sm transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-[#889bb8] uppercase mb-2">
                    Choose Your Primary Intel Division
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {(['TECH', 'AI', 'BUSINESS', 'WORLD AFFAIRS'] as const).map((div) => (
                      <button
                        type="button"
                        key={div}
                        onClick={() => {
                          playClickSound();
                          setDivision(div);
                        }}
                        className={`p-3 rounded-xl text-xs font-mono font-bold text-left transition-colors cursor-pointer border ${
                          division === div
                            ? 'bg-[#0e1a32] border-[#d9fa22] text-[#d9fa22]'
                            : 'bg-[#070d18] border-[#162747] text-[#889bb8] hover:text-white'
                        }`}
                      >
                        {div}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isMinting}
                  className="w-full py-3.5 rounded-xl bg-[#d9fa22] text-[#070d18] font-black text-sm tracking-wide shadow-[0_0_20px_rgba(217,250,34,0.4)] hover:bg-white transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Zap className="w-4 h-4 fill-current" />
                  {isMinting ? 'Forging Credential...' : 'Mint Official Day-One Pass'}
                </button>
              </form>
            ) : (
              <div className="space-y-6">
                {/* Generated Holographic Card */}
                <div className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#0c182e] via-[#08101e] to-[#040810] border-2 border-[#d9fa22] shadow-[0_0_40px_rgba(217,250,34,0.25)] overflow-hidden">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-[#d9fa22]/10 rounded-full blur-2xl pointer-events-none" />

                  <div className="flex items-center justify-between border-b border-[#1e345e] pb-4 mb-6">
                    <div className="flex items-center gap-3">
                      <img src="./assets/logo.png" alt="Logo" className="w-8 h-8 object-contain" />
                      <div className="font-['Syne',sans-serif] font-black text-sm text-white">
                        BLINK, KNOW, REPEAT
                      </div>
                    </div>
                    <div className="px-2.5 py-1 rounded bg-[#d9fa22] text-[#070d18] font-mono text-[11px] font-black">
                      FOUNDING 1,000
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="text-xs font-mono text-[#889bb8] uppercase">FOUNDER IDENTITY</div>
                    <div className="text-2xl font-bold font-['Syne',sans-serif] text-white">
                      {mintedPass.handle}
                    </div>
                    <div className="flex items-center gap-4 text-xs font-mono">
                      <div>
                        <span className="text-[#889bb8]">DIVISION: </span>
                        <span className="text-[#d9fa22] font-bold">{mintedPass.division}</span>
                      </div>
                      <div>
                        <span className="text-[#889bb8]">SERIAL: </span>
                        <span className="text-white font-bold">{mintedPass.serial}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 pt-4 border-t border-[#1e345e] flex items-center justify-between text-[11px] font-mono text-[#889bb8]">
                    <span>STATUS: VERIFIED DAY-ONE</span>
                    <span>ISSUED: {mintedPass.date}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      playClickSound();
                      setMintedPass(null);
                    }}
                    className="flex-1 py-3 rounded-xl bg-[#0e1a32] border border-[#1e345e] text-xs font-bold text-[#b3c3db] hover:text-white transition-colors"
                  >
                    Mint Another Pass
                  </button>

                  <button
                    onClick={() => {
                      playClickSound();
                      onOpenSubscribe();
                    }}
                    className="flex-1 py-3 rounded-xl bg-[#d9fa22] text-[#070d18] text-xs font-black shadow-[0_0_15px_rgba(217,250,34,0.4)] hover:bg-white transition-colors"
                  >
                    Confirm Subscription
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right: Founding Perks List & Recent Stream */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-3xl bg-[#0a1222] border border-[#162747]">
              <h4 className="text-lg font-bold font-['Syne',sans-serif] text-white mb-4 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#d9fa22]" /> Founding Subscriber Privileges
              </h4>
              <ul className="space-y-3.5 text-sm text-[#b3c3db]">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#d9fa22] shrink-0 mt-0.5" />
                  <span><strong>Permanent Day-One Badge:</strong> Immortalized in the Founding 1,000 registry.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#d9fa22] shrink-0 mt-0.5" />
                  <span><strong>Topic Governance:</strong> Direct voting power on which questions we investigate next.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#d9fa22] shrink-0 mt-0.5" />
                  <span><strong>Uncut Scripts & Sources:</strong> Full unredacted notes and database links for every drop.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#d9fa22] shrink-0 mt-0.5" />
                  <span><strong>Video End-Screen Credits:</strong> Your name listed in channel milestone specials.</span>
                </li>
              </ul>
            </div>

            {/* Live Founding Feed */}
            <div className="p-6 rounded-3xl bg-[#0a1222] border border-[#162747]">
              <div className="flex items-center justify-between text-xs font-mono text-[#889bb8] mb-3">
                <span className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-[#d9fa22]" /> RECENT FOUNDERS
                </span>
                <span className="text-[#d9fa22]">LIVE STREAM</span>
              </div>

              <div className="space-y-2">
                {FOUNDING_MEMBERS_SAMPLE.map((m) => (
                  <div
                    key={m.pass}
                    className="flex items-center justify-between p-2 rounded-xl bg-[#070d18] border border-[#162747] text-xs font-mono"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-[#d9fa22]">{m.pass}</span>
                      <span className="text-white font-medium">{m.handle}</span>
                    </div>
                    <span className="text-[#889bb8]">{m.division}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
