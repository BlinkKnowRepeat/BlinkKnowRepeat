import React, { useState, useEffect } from 'react';
import { BrandLogo } from './BrandLogo';
import { Volume2, VolumeX, Menu, X } from 'lucide-react';
import { YoutubeIcon } from './BrandIcons';
import { isSoundMuted, toggleSound, playClickSound, playToggleSound } from '../utils/sound';

interface NavbarProps {
  onOpenSubscribe: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSubscribe }) => {
  const [muted, setMuted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMuted(isSoundMuted());
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSoundToggle = () => {
    const newState = toggleSound();
    setMuted(newState);
    playToggleSound();
  };

  const navLinks = [
    { label: 'Premiere', href: '#premiere' },
    { label: 'The 3 Lenses', href: '#formula' },
    { label: 'Intel Radar', href: '#episodes' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#070d18]/95 backdrop-blur-md border-b border-[#1a2b4c]/60 py-3 shadow-2xl'
          : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">

          {/* Logo */}
          <a href="#" onClick={() => playClickSound()} className="outline-none shrink-0">
            <BrandLogo size="md" />
          </a>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => playClickSound()}
                className="text-sm font-semibold text-[#b3c3db] hover:text-[#d9fa22] transition-colors duration-200 tracking-wide whitespace-nowrap"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right Action Cluster */}
          <div className="hidden sm:flex items-center gap-3 shrink-0">
            {/* Live Drop Schedule Pill */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0e1a32] border border-[#1e345e] text-xs font-mono text-[#889bb8] whitespace-nowrap select-none">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#d9fa22] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#d9fa22]"></span>
              </span>
              <span>DAILY 7 PM</span>
            </div>

            {/* Sound Toggle */}
            <button
              onClick={handleSoundToggle}
              title={muted ? 'Unmute sounds' : 'Mute sounds'}
              className="p-2 rounded-xl bg-[#0e1a32] border border-[#1e345e] hover:border-[#d9fa22]/50 text-[#b3c3db] hover:text-[#d9fa22] transition-all cursor-pointer shrink-0"
              aria-label="Toggle Sound"
            >
              {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-[#d9fa22]" />}
            </button>

            {/* Clean Subscribe Button (NO wrapping 1K badge) */}
            <button
              onClick={() => {
                playClickSound();
                onOpenSubscribe();
              }}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-[#d9fa22] text-[#070d18] font-black text-sm tracking-wide shadow-[0_0_20px_rgba(217,250,34,0.35)] hover:shadow-[0_0_30px_rgba(217,250,34,0.6)] hover:bg-white transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer whitespace-nowrap shrink-0"
            >
              <YoutubeIcon className="w-4 h-4 fill-current shrink-0" />
              <span>Subscribe</span>
            </button>
          </div>

          {/* Mobile Menu & Audio Trigger */}
          <div className="flex items-center gap-2 md:hidden shrink-0">
            <button
              onClick={handleSoundToggle}
              className="p-2 rounded-lg bg-[#0e1a32] border border-[#1e345e] text-[#b3c3db]"
              aria-label="Toggle Sound"
            >
              {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-[#d9fa22]" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-[#0e1a32] border border-[#1e345e] text-white"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#070d18]/98 border-b border-[#1a2b4c] px-4 pt-4 pb-6 space-y-3 mt-2 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center justify-between py-2 border-b border-[#1e345e]/50 text-xs font-mono text-[#d9fa22]">
            <span>NEXT DROP: TODAY 7 PM</span>
            <span className="text-[#889bb8]">@BlinkKnowRepeat</span>
          </div>

          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => {
                playClickSound();
                setMobileMenuOpen(false);
              }}
              className="block py-2.5 text-base font-medium text-[#d0dbe9] hover:text-[#d9fa22] transition-colors border-b border-[#1e345e]/30"
            >
              {link.label}
            </a>
          ))}

          <button
            onClick={() => {
              playClickSound();
              setMobileMenuOpen(false);
              onOpenSubscribe();
            }}
            className="w-full flex items-center justify-center gap-2 py-3 mt-2 rounded-xl bg-[#d9fa22] text-[#070d18] font-black text-sm shadow-[0_0_20px_rgba(217,250,34,0.4)] cursor-pointer"
          >
            <YoutubeIcon className="w-4 h-4 fill-current" />
            <span>Subscribe on YouTube</span>
          </button>
        </div>
      )}
    </header>
  );
};
