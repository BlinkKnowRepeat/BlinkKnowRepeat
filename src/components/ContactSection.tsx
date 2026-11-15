import React, { useState } from 'react';
import { Mail, Heart, ExternalLink, Zap, ArrowRight, Check } from 'lucide-react';
import { playClickSound, playZapSound } from '../utils/sound';
import { YoutubeIcon } from './BrandIcons';
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
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0e1a32] border border-[#1e345e] text-xs font-mono text-[#d9fa22] mb-4">
            <Zap className="w-3.5 h-3.5 fill-current" /> STAY CONNECTED
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-['Syne',sans-serif] text-white leading-tight">
            Never Miss a Single Blink
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#889bb8]">
            Daily 30-second intel drops at 7:00 PM. Subscribe on YouTube or sign up for direct dispatches.
          </p>
        </div>

        {/* Two columns: Subscribe + Contact Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Subscribe Card */}
          <div className="p-8 rounded-3xl bg-[#0a1222] border border-[#1e345e] flex flex-col justify-between gap-6 shadow-xl hover:border-[#d9fa22]/30 transition-colors">
            <div>
              <div className="text-xs font-mono text-[#d9fa22] uppercase tracking-wider mb-2">Primary Channel</div>
              <h3 className="text-2xl font-bold font-['Syne',sans-serif] text-white">Subscribe on YouTube</h3>
              <p className="mt-2 text-sm text-[#889bb8]">Daily shorts and deep dives explaining what happened, who benefits, and why it matters.</p>
            </div>

            <a
              href="https://www.youtube.com/@BlinkKnowRepeat?sub_confirmation=1"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => playZapSound()}
              className="w-full py-4 rounded-2xl bg-[#ff0000] hover:bg-[#e60000] text-white font-extrabold text-sm flex items-center justify-center gap-3 shadow-[0_0_25px_rgba(255,0,0,0.3)] transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <YoutubeIcon className="w-5 h-5 fill-current" />
              <span>Subscribe on YouTube</span>
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
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#070d18] border border-[#1e345e] focus:border-[#d9fa22] text-white placeholder-[#4b6080] text-sm outline-none transition-colors"
                />
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#d9fa22] text-[#070d18] font-black text-sm shadow-[0_0_20px_rgba(217,250,34,0.3)] hover:bg-white transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Get 7 PM Drops</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <div className="p-4 rounded-2xl bg-[#070d18] border border-[#d9fa22]/40 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#d9fa22]/20 border border-[#d9fa22] flex items-center justify-center shrink-0">
                  <Check className="w-4 h-4 text-[#d9fa22]" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white">You're Subscribed!</div>
                  <div className="text-xs text-[#889bb8]">Daily 7 PM drops will hit your inbox.</div>
                </div>
              </div>
            )}
          </div>

          {/* Links Card */}
          <div className="p-8 rounded-3xl bg-[#0a1222] border border-[#1e345e] flex flex-col justify-between gap-6 shadow-xl hover:border-[#d9fa22]/30 transition-colors">
            <div>
              <div className="text-xs font-mono text-[#d9fa22] uppercase tracking-wider mb-2">Connect Directly</div>
              <h3 className="text-2xl font-bold font-['Syne',sans-serif] text-white">Official Links</h3>
              <p className="mt-2 text-sm text-[#889bb8]">Follow us across platforms or send tips and inquiries.</p>
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
                  <div className="text-xs text-[#889bb8] truncate">Follow for daily quick reels</div>
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
                  <div className="text-xs text-[#889bb8] truncate">Support independent reporting</div>
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
                  <div className="text-sm font-bold text-white group-hover:text-[#d9fa22] transition-colors">Say Hello / Inquiries</div>
                  <div className="text-xs text-[#889bb8] truncate">blinkknowrepeat@gmail.com</div>
                </div>
                <ExternalLink className="w-4 h-4 text-[#889bb8] group-hover:text-[#d9fa22] transition-colors shrink-0" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
