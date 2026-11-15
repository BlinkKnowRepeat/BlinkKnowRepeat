import React, { useState, useEffect } from 'react';
import { BrandLogo } from './BrandLogo';
import { Volume2, VolumeX, Menu, X, Zap, Radio } from 'lucide-react';
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

    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };

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
    { label: 'Contact', href: '#contact' }
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#070d18]/90 backdrop-blur-md border-b border-[#1a2b4c]/60 py-3 shadow-2xl'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a
            href="#"
            onClick={() => playClickSound()}
            className="flex items-center outline-none"
          >
            <BrandLogo size="md" />
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => playClickSound()}
                className="text-sm font-medium text-[#b3c3db] hover:text-[#d9fa22] transition-colors duration-200 tracking-wide"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right Action Cluster */}
          <div className="hidden sm:flex items-center gap-4">
            {/* Live Drop Schedule Pill */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0e1a32] border border-[#1e345e] text-xs font-mono text-[#889bb8]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#d9fa22] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#d9fa22]"></span>
              </span>
              <span>DAILY 7 PM</span>
            </div>

            {/* Sound Toggle */}
            <button
              onClick={handleSoundToggle}
              title={muted ? 'Unmute UI sounds' : 'Mute UI sounds'}
              className="p-2 rounded-xl bg-[#0e1a32] border border-[#1e345e] hover:border-[#d9fa22]/50 text-[#b3c3db] hover:text-[#d9fa22] transition-all"
              aria-label="Toggle Sound"
            >
              {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-[#d9fa22]" />}
            </button>

            {/* Subscribe Action Button */}
            <button
              onClick={() => {
                playClickSound();
                onOpenSubscribe();
              }}
              className="group relative inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-[#d9fa22] text-[#070d18] font-bold text-sm tracking-wide shadow-[0_0_20px_rgba(217,250,34,0.3)] hover:shadow-[0_0_30px_rgba(217,250,34,0.6)] hover:bg-white transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              <YoutubeIcon className="w-4 h-4 fill-current" />
              <span>Subscribe</span>
              <span className="text-[11px] font-mono px-1.5 py-0.5 bg-[#070d18] text-[#d9fa22] group-hover:bg-[#d9fa22] group-hover:text-[#070d18] rounded transition-colors">
                1K Goal
              </span>
            </button>
          </div>

          {/* Mobile Menu & Audio Trigger */}
          <div className="flex items-center gap-2 sm:hidden">
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
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-[#070d18]/98 border-b border-[#1a2b4c] px-4 pt-4 pb-6 space-y-3 mt-2 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center justify-between py-2 border-b border-[#1e345e]/50 text-xs font-mono text-[#d9fa22]">
            <span className="flex items-center gap-2">
              <Radio className="w-3.5 h-3.5 animate-pulse" /> NEXT DROP: TODAY 7 PM
            </span>
            <span className="text-[#889bb8]">#BKR1000</span>
          </div>

          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => {
                playClickSound();
                setMobileMenuOpen(false);
              }}
              className="block py-2 text-base font-medium text-[#d0dbe9] hover:text-[#d9fa22] transition-colors"
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
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#d9fa22] text-[#070d18] font-bold text-sm shadow-[0_0_20px_rgba(217,250,34,0.4)]"
          >
            <Zap className="w-4 h-4 fill-current" />
            Join Founding 1,000 Subscribers
          </button>
        </div>
      )}
    </header>
  );
};
