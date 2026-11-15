import React, { useState } from 'react';
import { Mail, Heart, Youtube, Instagram, ExternalLink, Zap, ArrowRight, Check } from 'lucide-react';
import { playClickSound, playZapSound } from '../utils/sound';
import confetti from 'canvas-confetti';

interface ContactSectionProps {
  onOpenSubscribe: () => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ onOpenSubscribe }) => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    playZapSound();
    setSubmitted(true);
    try {
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.5 }, colors: ['#d9fa22', '#ffffff', '#1a3b6e'] });
    } catch {}
  };

  return (
    <section id="contact" className="py-24 relative overflow-hidden bg-[#060b14]">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#d9fa22]/8 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0e1a32] border border-[#1e345e] text-xs font-mono text-[#d9fa22] mb-4">
            <Zap className="w-3.5 h-3.5 fill-current" /> JOIN THE CHANNEL
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-['Syne',sans-serif] text-white leading-tight">
            Be Here From Day One
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#889bb8]">
            Help us reach our founding 1,000 subscribers. Subscribe on YouTube or drop your email for the daily 7 PM intel dispatch.
          </p>
        </div>

        {/* Two columns: Subscribe + Contact */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">

          {/* Subscribe Card */}
          <div className="p-8 rounded-3xl bg-[#0a1222] border border-[#1e345e] flex flex-col gap-6">
            <div>
              <div className="text-xs font-mono text-[#d9fa22] uppercase tracking-wider mb-2">Step 1 — YouTube</div>
              <h3 className="text-2xl font-bold font-['Syne',sans-serif] text-white">Subscribe on YouTube</h3>
              <p className="mt-2 text-sm text-[#889bb8]">Hit subscribe and join the founding cohort on our day-one launch.</p>
            </div>
            <a
              href="https://www.youtube.com/@BlinkKnowRepeat?sub_confirmation=1"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => playZapSound()}
              className="w-full py-4 rounded-2xl bg-[#ff0000] hover:bg-[#e60000] text-white font-extrabold text-sm flex items-center justify-center gap-3 shadow-[0_0_25px_rgba(255,0,0,0.3)] transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              Subscribe on YouTube
              <ExternalLink className="w-4 h-4 ml-auto opacity-70" />
            </a>

            <div className="relative flex items-center gap-3">
              <div className="flex-1 border-t border-[#1e345e]" />
              <span className="text-xs font-mono text-[#889bb8]">OR EMAIL DISPATCH</span>
              <div className="flex-1 border-t border-[#1e345e]" />
            </div>

            {!submitted ? (
              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#070d18] border border-[#1e345e] focus:border-[#d9fa22] text-white placeholder-[#4b6080] text-sm outline-none transition-colors"
                />
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#d9fa22] text-[#070d18] font-black text-sm shadow-[0_0_20px_rgba(217,250,34,0.3)] hover:bg-white transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Get Daily 7 PM Drops</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <div className="p-4 rounded-2xl bg-[#070d18] border border-[#d9fa22]/40 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#d9fa22]/20 border border-[#d9fa22] flex items-center justify-center shrink-0">
                  <Check className="w-4 h-4 text-[#d9fa22]" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white">You're in!</div>
                  <div className="text-xs text-[#889bb8]">Daily 7 PM drops will hit your inbox.</div>
                </div>
              </div>
            )}
          </div>

          {/* Links Card */}
          <div className="p-8 rounded-3xl bg-[#0a1222] border border-[#1e345e] flex flex-col gap-6">
            <div>
              <div className="text-xs font-mono text-[#d9fa22] uppercase tracking-wider mb-2">Step 2 — Connect</div>
              <h3 className="text-2xl font-bold font-['Syne',sans-serif] text-white">Official Links</h3>
              <p className="mt-2 text-sm text-[#889bb8]">Follow us everywhere and reach out directly.</p>
            </div>

            <div className="flex flex-col gap-3">
              <a
                href="https://google.com"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => playClickSound()}
                className="flex items-center gap-4 p-4 rounded-2xl bg-[#070d18] border border-[#162747] hover:border-[#d9fa22]/50 transition-all group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#f09433] via-[#e6683c] to-[#bc1888] flex items-center justify-center shrink-0">
                  <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5">
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" fill="none" stroke="white" strokeWidth="2"/>
                    <circle cx="12" cy="12" r="3.5" fill="none" stroke="white" strokeWidth="2"/>
                    <circle cx="17.5" cy="6.5" r="1" fill="white"/>
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-white group-hover:text-[#d9fa22] transition-colors">Instagram</div>
                  <div className="text-xs text-[#889bb8] truncate">@BlinkKnowRepeat</div>
                </div>
                <ExternalLink className="w-4 h-4 text-[#889bb8] group-hover:text-[#d9fa22] transition-colors shrink-0" />
              </a>

              <a
                href="https://www.patreon.com/cw/BlinkKnowRepeat"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => playClickSound()}
                className="flex items-center gap-4 p-4 rounded-2xl bg-[#070d18] border border-[#162747] hover:border-[#d9fa22]/50 transition-all group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-[#ff424d] flex items-center justify-center shrink-0">
                  <Heart className="w-5 h-5 fill-white text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-white group-hover:text-[#d9fa22] transition-colors">Patreon</div>
                  <div className="text-xs text-[#889bb8] truncate">patreon.com/cw/BlinkKnowRepeat</div>
                </div>
                <ExternalLink className="w-4 h-4 text-[#889bb8] group-hover:text-[#d9fa22] transition-colors shrink-0" />
              </a>

              <a
                href="mailto:blinkknowrepeat@gmail.com"
                onClick={() => playClickSound()}
                className="flex items-center gap-4 p-4 rounded-2xl bg-[#070d18] border border-[#162747] hover:border-[#d9fa22]/50 transition-all group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-[#0e1a32] border border-[#1e345e] flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-[#d9fa22]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-white group-hover:text-[#d9fa22] transition-colors">Email Us</div>
                  <div className="text-xs text-[#889bb8] truncate">blinkknowrepeat@gmail.com</div>
                </div>
                <ExternalLink className="w-4 h-4 text-[#889bb8] group-hover:text-[#d9fa22] transition-colors shrink-0" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Subscribe Banner */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-[#0e1a32] to-[#0a1426] border border-[#d9fa22]/30 shadow-[0_0_40px_rgba(217,250,34,0.1)] flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img src="./assets/logo.png" alt="Logo" className="w-12 h-12 object-contain drop-shadow-[0_0_10px_rgba(217,250,34,0.4)]" />
            <div>
              <div className="text-lg font-black font-['Syne',sans-serif] text-white">
                Founding 1,000 — <span className="text-[#d9fa22]">428 of 1,000 Claimed</span>
              </div>
              <div className="text-sm text-[#889bb8]">Hit subscribe before the founding window closes.</div>
            </div>
          </div>
          <button
            onClick={() => { playZapSound(); onOpenSubscribe(); }}
            className="shrink-0 px-8 py-3.5 rounded-xl bg-[#d9fa22] text-[#070d18] font-black text-sm shadow-[0_0_25px_rgba(217,250,34,0.4)] hover:bg-white hover:shadow-[0_0_35px_rgba(217,250,34,0.6)] transition-all transform hover:-translate-y-0.5 cursor-pointer flex items-center gap-2"
          >
            <Zap className="w-4 h-4 fill-current" />
            Claim Your Spot
          </button>
        </div>

      </div>
    </section>
  );
};
