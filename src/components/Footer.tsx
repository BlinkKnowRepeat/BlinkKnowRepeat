import React from 'react';
import { BrandLogo } from './BrandLogo';
import { Heart, Globe, Mail, ArrowUp, Zap } from 'lucide-react';
import { InstagramIcon, YoutubeIcon, PatreonIcon } from './BrandIcons';
import { playClickSound, playZapSound } from '../utils/sound';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    playZapSound();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-[#040810] border-t border-[#162747] pt-16 pb-12 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-[#162747]">
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-4">
            <BrandLogo size="md" />
            <p className="text-sm text-[#889bb8] max-w-sm leading-relaxed mt-4">
              Shorts and deep dives on AI, tech, business, and world affairs. We explain what happened, who benefits, and why it matters. Daily @ 7 PM.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0a1222] border border-[#1e345e] text-xs font-mono text-[#d9fa22]">
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>Target: Founding 1,000 Subscribers</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-3">
            <div className="text-xs font-mono text-white font-bold uppercase tracking-wider">
              Navigation
            </div>
            <ul className="space-y-2 text-sm text-[#889bb8]">
              <li>
                <a href="#premiere" onClick={() => playClickSound()} className="hover:text-[#d9fa22] transition-colors">
                  Channel Premiere (30s)
                </a>
              </li>
              <li>
                <a href="#formula" onClick={() => playClickSound()} className="hover:text-[#d9fa22] transition-colors">
                  The 3 Lenses Framework
                </a>
              </li>
              <li>
                <a href="#episodes" onClick={() => playClickSound()} className="hover:text-[#d9fa22] transition-colors">
                  Episode Radar & Archive
                </a>
              </li>
              <li>
                <a href="#founding" onClick={() => playClickSound()} className="hover:text-[#d9fa22] transition-colors">
                  Founding 1,000 Cohort
                </a>
              </li>
              <li>
                <a href="#patreon" onClick={() => playClickSound()} className="hover:text-[#d9fa22] transition-colors">
                  Patreon Support
                </a>
              </li>
            </ul>
          </div>

          {/* Official Channel Links */}
          <div className="md:col-span-4 space-y-3">
            <div className="text-xs font-mono text-white font-bold uppercase tracking-wider">
              Official Links & Dispatch
            </div>
            <ul className="space-y-2.5 text-sm text-[#889bb8]">
              <li>
                <a
                  href="https://www.patreon.com/cw/BlinkKnowRepeat"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => playClickSound()}
                  className="flex items-center gap-2.5 hover:text-[#d9fa22] transition-colors"
                >
                  <Heart className="w-4 h-4 text-[#d9fa22]" />
                  <span>Patreon: patreon.com/cw/BlinkKnowRepeat</span>
                </a>
              </li>
              <li>
                <a
                  href="https://google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => playClickSound()}
                  className="flex items-center gap-2.5 hover:text-[#d9fa22] transition-colors"
                >
                  <InstagramIcon className="w-4 h-4 text-[#d9fa22]" />
                  <span>Instagram Official</span>
                </a>
              </li>
              <li>
                <a
                  href="https://google.com/?zx=1794746986026"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => playClickSound()}
                  className="flex items-center gap-2.5 hover:text-[#d9fa22] transition-colors"
                >
                  <Globe className="w-4 h-4 text-[#d9fa22]" />
                  <span>Official Website Portal</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:blinkknowrepeat@gmail.com"
                  onClick={() => playClickSound()}
                  className="flex items-center gap-2.5 hover:text-[#d9fa22] transition-colors font-mono text-xs"
                >
                  <Mail className="w-4 h-4 text-[#d9fa22]" />
                  <span>blinkknowrepeat@gmail.com</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#889bb8]">
          <div>
            © 2026 Blink, Know, Repeat. All rights reserved.
          </div>

          <div className="flex items-center gap-4">
            <span className="text-[#4b6080]">Built with React & Vite for GitHub Static Hosting</span>
            <button
              onClick={scrollToTop}
              className="p-2.5 rounded-xl bg-[#0a1222] border border-[#1e345e] hover:border-[#d9fa22] text-[#d9fa22] hover:text-white transition-all shadow-md cursor-pointer flex items-center gap-1.5"
              aria-label="Back to top"
            >
              <span>TOP</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
