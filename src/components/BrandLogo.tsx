import React, { useState } from 'react';
import { playZapSound } from '../utils/sound';

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  size = 'md',
  showText = true
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const sizeMap = {
    sm: { img: 'w-7 h-7', text: 'text-base', sub: 'text-[9px]' },
    md: { img: 'w-9 h-9', text: 'text-lg', sub: 'text-[9px]' },
    lg: { img: 'w-12 h-12', text: 'text-xl', sub: 'text-[10px]' },
    xl: { img: 'w-20 h-20', text: 'text-3xl', sub: 'text-xs' },
  };

  const s = sizeMap[size];

  return (
    <div
      className={`inline-flex items-center gap-2.5 cursor-pointer group shrink-0 select-none ${className}`}
      onMouseEnter={() => { setIsHovered(true); playZapSound(); }}
      onMouseLeave={() => setIsHovered(false)}
      role="banner"
    >
      {/* Logo graphic */}
      <div className={`relative ${s.img} flex items-center justify-center shrink-0`}>
        <div className={`absolute inset-0 rounded-full transition-all duration-500 ${isHovered ? 'bg-[#d9fa22]/30 blur-lg scale-125' : 'bg-[#d9fa22]/10 blur-sm scale-90'}`} />
        <img
          src="./assets/logo.png"
          alt="Blink, Know, Repeat"
          className={`relative z-10 w-full h-full object-contain drop-shadow-[0_0_10px_rgba(217,250,34,0.35)] transition-transform duration-300 ${isHovered ? 'scale-110' : 'scale-100'}`}
        />
      </div>

      {showText && (
        <div className="flex flex-col justify-center">
          <div
            className={`${s.text} font-black font-['Syne',sans-serif] tracking-tight whitespace-nowrap text-white flex items-center gap-1.5 leading-tight`}
          >
            <span>Blink, Know,</span>
            <span className="text-[#d9fa22] drop-shadow-[0_0_8px_rgba(217,250,34,0.5)] transition-colors duration-300 group-hover:text-white">
              Repeat
            </span>
          </div>
          <span className={`${s.sub} font-mono tracking-widest text-[#889bb8] uppercase whitespace-nowrap hidden sm:block`}>
            The Why Behind The Headline
          </span>
        </div>
      )}
    </div>
  );
};
