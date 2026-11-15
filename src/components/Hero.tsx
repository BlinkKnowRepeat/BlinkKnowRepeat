import React, { useState, useEffect } from 'react';
import { Play, Zap, ArrowRight, ShieldCheck, Clock, Flame, Sparkles } from 'lucide-react';
import { playClickSound, playZapSound } from '../utils/sound';

interface HeroProps {
  onOpenSubscribe: () => void;
  onScrollToPremiere: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenSubscribe, onScrollToPremiere }) => {
  const dynamicQuestions = [
    "Why does your toaster need Wi-Fi?",
    "How did phone chips become a national security issue?",
    "Why does a CEO need 47 slides to explain a 'simpler strategy'?",
    "What happened? Who benefits? Why it matters."
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(65);

  useEffect(() => {
    const currentFullText = dynamicQuestions[currentIndex];

    const timer = setTimeout(() => {
      if (!isDeleting) {
        setDisplayedText(currentFullText.slice(0, displayedText.length + 1));
        if (displayedText.length + 1 === currentFullText.length) {
          // Pause at end of sentence
          setTimeout(() => setIsDeleting(true), 2400);
        }
      } else {
        setDisplayedText(currentFullText.slice(0, displayedText.length - 1));
        if (displayedText.length === 0) {
          setIsDeleting(false);
          setCurrentIndex((prev) => (prev + 1) % dynamicQuestions.length);
        }
      }
    }, isDeleting ? 30 : typingSpeed);

    return () => clearTimeout(timer);
  }, [displayedText, isDeleting, currentIndex, typingSpeed]);

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
      {/* Background radial accent glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#d9fa22]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0e1a32]/80 border border-[#1e345e] shadow-[0_0_20px_rgba(217,250,34,0.15)] mb-8 backdrop-blur-md">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#d9fa22] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#d9fa22]"></span>
            </span>
            <span className="text-xs font-mono font-semibold uppercase tracking-widest text-[#d9fa22]">
              ⚡ Blink, Know, Repeat
            </span>
            <span className="text-xs text-[#889bb8] hidden sm:inline">• Daily @ 7 PM</span>
          </div>

          {/* Dynamic Headline */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold font-['Syne',sans-serif] tracking-tight text-white leading-[1.1] min-h-[140px] sm:min-h-[160px] md:min-h-[180px] flex items-center justify-center">
            <span>
              <span className="text-white">
                {displayedText}
              </span>
              <span className="inline-block w-1.5 h-9 sm:h-12 md:h-14 bg-[#d9fa22] ml-1.5 animate-pulse align-middle" />
            </span>
          </h1>

          {/* Core Subtitle / Description */}
          <p className="mt-6 text-lg sm:text-xl md:text-2xl text-[#b3c3db] font-light max-w-3xl leading-relaxed">
            Shorts and deep dives on <span className="text-white font-semibold">AI, tech, business,</span> and{' '}
            <span className="text-white font-semibold">world affairs</span>. We explain what happened, who benefits, and why it matters in a single blink.
          </p>

          {/* CTA Button Group */}
          <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <button
              onClick={() => {
                playZapSound();
                onScrollToPremiere();
              }}
              className="w-full sm:w-auto group relative inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-[#d9fa22] text-[#070d18] font-black text-base tracking-wide shadow-[0_0_30px_rgba(217,250,34,0.4)] hover:shadow-[0_0_50px_rgba(217,250,34,0.7)] hover:bg-white transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0 cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full bg-[#070d18] flex items-center justify-center text-[#d9fa22] group-hover:bg-[#d9fa22] group-hover:text-[#070d18] transition-colors">
                <Play className="w-4 h-4 fill-current ml-0.5" />
              </div>
              <span>Watch Premiere (30s)</span>
            </button>

            <button
              onClick={() => {
                playClickSound();
                onOpenSubscribe();
              }}
              className="w-full sm:w-auto group inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-[#0e1a32]/80 border border-[#1e345e] hover:border-[#d9fa22]/60 text-white font-bold text-base hover:bg-[#142344] transition-all duration-300 transform hover:-translate-y-1 backdrop-blur-md cursor-pointer"
            >
              <Zap className="w-5 h-5 text-[#d9fa22] group-hover:scale-110 transition-transform" />
              <span>Join Founding 1,000</span>
              <ArrowRight className="w-4 h-4 text-[#889bb8] group-hover:text-[#d9fa22] group-hover:translate-x-1 transition-all" />
            </button>
          </div>

          {/* Social Proof & Value Metric Badges */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl">
            <div className="p-4 rounded-2xl bg-[#0a1426]/70 border border-[#16294d] flex flex-col items-center justify-center text-center hover:border-[#d9fa22]/40 transition-colors">
              <Clock className="w-5 h-5 text-[#d9fa22] mb-1.5" />
              <div className="text-xl font-bold font-['Syne',sans-serif] text-white">30 Seconds</div>
              <div className="text-xs text-[#889bb8] font-mono uppercase">Compressed Intel</div>
            </div>

            <div className="p-4 rounded-2xl bg-[#0a1426]/70 border border-[#16294d] flex flex-col items-center justify-center text-center hover:border-[#d9fa22]/40 transition-colors">
              <Flame className="w-5 h-5 text-[#d9fa22] mb-1.5" />
              <div className="text-xl font-bold font-['Syne',sans-serif] text-white">Daily 7 PM</div>
              <div className="text-xs text-[#889bb8] font-mono uppercase">Uninterrupted Cadence</div>
            </div>

            <div className="p-4 rounded-2xl bg-[#0a1426]/70 border border-[#16294d] flex flex-col items-center justify-center text-center hover:border-[#d9fa22]/40 transition-colors">
              <Sparkles className="w-5 h-5 text-[#d9fa22] mb-1.5" />
              <div className="text-xl font-bold font-['Syne',sans-serif] text-white">Founding 1K</div>
              <div className="text-xs text-[#889bb8] font-mono uppercase">Day-One Circle</div>
            </div>

            <div className="p-4 rounded-2xl bg-[#0a1426]/70 border border-[#16294d] flex flex-col items-center justify-center text-center hover:border-[#d9fa22]/40 transition-colors">
              <ShieldCheck className="w-5 h-5 text-[#d9fa22] mb-1.5" />
              <div className="text-xl font-bold font-['Syne',sans-serif] text-white">Zero BS</div>
              <div className="text-xs text-[#889bb8] font-mono uppercase">No Sponsored Scripts</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
