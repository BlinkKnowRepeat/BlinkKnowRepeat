import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Radio, Sparkles } from 'lucide-react';
import { ambientAudio } from '../utils/audioEngine';
import { playClickSound } from '../utils/sound';

export const AudioVisualizerHUD: React.FC = () => {
  const [audioState, setAudioState] = useState<{ isPlaying: boolean; isMuted: boolean; volume: number }>({
    isPlaying: false,
    isMuted: false,
    volume: 0
  });

  useEffect(() => {
    const unsubscribe = ambientAudio.subscribe((state) => {
      setAudioState(state);
    });
    return unsubscribe;
  }, []);

  const handleToggle = () => {
    playClickSound();
    ambientAudio.toggleMute();
  };

  const isActuallyPlaying = audioState.isPlaying && !audioState.isMuted;

  return (
    <aside aria-label="Audio and broadcast status HUD" className="fixed bottom-5 left-5 z-40 select-none">
      <div
        onClick={handleToggle}
        className="group flex items-center gap-3.5 px-4 py-2.5 rounded-2xl bg-[#0a1426]/90 border border-[#1e345e] hover:border-[#d9fa22]/60 shadow-[0_10px_30px_rgba(0,0,0,0.8)] backdrop-blur-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-0.5"
        title={isActuallyPlaying ? 'Click to fade out ambient soundtrack' : 'Click to fade in ambient soundtrack'}
      >
        {/* Equalizer Bars Animation */}
        <div className="flex items-end gap-1 h-4 w-5">
          <span
            className={`w-1 bg-[#d9fa22] rounded-full transition-all duration-150 ${
              isActuallyPlaying ? 'animate-[bounce_0.8s_ease-in-out_infinite] h-full' : 'h-1.5 opacity-40'
            }`}
          />
          <span
            className={`w-1 bg-[#d9fa22] rounded-full transition-all duration-150 ${
              isActuallyPlaying ? 'animate-[bounce_0.6s_ease-in-out_infinite_0.2s] h-3/4' : 'h-1.5 opacity-40'
            }`}
          />
          <span
            className={`w-1 bg-[#d9fa22] rounded-full transition-all duration-150 ${
              isActuallyPlaying ? 'animate-[bounce_0.9s_ease-in-out_infinite_0.4s] h-full' : 'h-1.5 opacity-40'
            }`}
          />
          <span
            className={`w-1 bg-[#d9fa22] rounded-full transition-all duration-150 ${
              isActuallyPlaying ? 'animate-[bounce_0.7s_ease-in-out_infinite_0.1s] h-1/2' : 'h-1.5 opacity-40'
            }`}
          />
        </div>

        {/* Text Details */}
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold tracking-wider uppercase text-[#d9fa22]">
            <Radio className={`w-3 h-3 ${isActuallyPlaying ? 'animate-pulse text-[#d9fa22]' : 'text-[#889bb8]'}`} />
            <span>{isActuallyPlaying ? 'BKR SOUNDTRACK: ON' : 'SOUNDTRACK: MUTED'}</span>
          </div>
          <span className="text-[9px] font-mono text-[#889bb8] tracking-widest hidden sm:inline">
            {isActuallyPlaying ? 'SMOOTH FADE AUTO-LOOP' : 'CLICK TO FADE IN'}
          </span>
        </div>

        {/* Mini Volume Icon */}
        <div className="p-1 rounded-lg bg-[#0e1a32] text-[#889bb8] group-hover:text-[#d9fa22] transition-colors">
          {isActuallyPlaying ? <Volume2 className="w-3.5 h-3.5 text-[#d9fa22]" /> : <VolumeX className="w-3.5 h-3.5" />}
        </div>
      </div>
    </aside>
  );
};
