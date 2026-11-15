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

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-24 h-24'
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    playZapSound();
  };

  return (
    <div
      className={`inline-flex items-center gap-3 cursor-pointer group ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setIsHovered(false)}
      role="banner"
    >
      <div className={`relative ${sizeClasses[size]} flex items-center justify-center shrink-0`}>
        {/* Glow halo behind logo on hover */}
        <div
          className={`absolute inset-0 rounded-full transition-all duration-500 ${
            isHovered
              ? 'bg-[#d9fa22]/30 blur-xl scale-125'
              : 'bg-[#d9fa22]/10 blur-md scale-95'
          }`}
        />

        {/* High-res Logo Graphic */}
        <img
          src="./assets/logo.png"
          alt="Blink, Know, Repeat Logo"
          className={`relative z-10 w-full h-full object-contain transition-transform duration-300 drop-shadow-[0_0_12px_rgba(217,250,34,0.4)] ${
            isHovered ? 'scale-110 rotate-1' : 'scale-100'
          }`}
        />

        {/* Electric spark indicator */}
        <div
          className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#d9fa22] shadow-[0_0_8px_#d9fa22] transition-opacity duration-300 ${
            isHovered ? 'opacity-100 animate-ping' : 'opacity-0'
          }`}
        />
      </div>

      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 font-['Syne',sans-serif] font-extrabold tracking-tight text-white text-lg md:text-xl leading-none">
            <span>Blink,</span>
            <span className="text-[#f5f1e8]">Know,</span>
            <span className="text-[#d9fa22] transition-colors duration-300 group-hover:text-white drop-shadow-[0_0_10px_rgba(217,250,34,0.5)]">
              Repeat
            </span>
          </div>
          <span className="text-[10px] font-mono tracking-widest text-[#889bb8] uppercase mt-1">
            The Why Behind The Headline
          </span>
        </div>
      )}
    </div>
  );
};
