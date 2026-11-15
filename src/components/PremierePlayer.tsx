import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize2, RotateCcw, Sparkles, CheckCircle2 } from 'lucide-react';
import { playClickSound, playZapSound } from '../utils/sound';

interface PremierePlayerProps {
  onOpenSubscribe: () => void;
}

export const PremierePlayer: React.FC<PremierePlayerProps> = ({ onOpenSubscribe }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(30);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [activeChapter, setActiveChapter] = useState(0);

  const chapters = [
    { time: 0, title: 'Intro', desc: 'The Blink Manifesto' },
    { time: 5, title: 'Tech', desc: 'A Toaster. With Wi-Fi.' },
    { time: 10, title: 'AI', desc: 'Confident. But Correct?' },
    { time: 15, title: 'Global', desc: 'Tiny Chips. Big Stakes.' },
    { time: 22, title: 'Method', desc: 'What? Who? Why?' },
    { time: 27, title: 'Outro', desc: 'Subscribe for More' }
  ];

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      if (video.duration) setDuration(video.duration);

      // determine active chapter
      let currentIdx = 0;
      for (let i = chapters.length - 1; i >= 0; i--) {
        if (video.currentTime >= chapters[i].time) {
          currentIdx = i;
          break;
        }
      }
      setActiveChapter(currentIdx);
    };

    const onEnded = () => {
      setIsPlaying(false);
    };

    video.addEventListener('timeupdate', onTimeUpdate);
    video.addEventListener('ended', onEnded);

    return () => {
      video.removeEventListener('timeupdate', onTimeUpdate);
      video.removeEventListener('ended', onEnded);
    };
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    playZapSound();
    if (video.paused) {
      video.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;
    const seekTime = parseFloat(e.target.value);
    video.currentTime = seekTime;
    setCurrentTime(seekTime);
  };

  const seekToChapter = (time: number, idx: number) => {
    const video = videoRef.current;
    if (!video) return;
    playClickSound();
    video.currentTime = time;
    setCurrentTime(time);
    setActiveChapter(idx);
    if (!isPlaying) {
      video.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    playClickSound();
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const toggleSpeed = () => {
    const video = videoRef.current;
    if (!video) return;
    playClickSound();
    const speeds = [1, 1.25, 1.5, 2];
    const nextIdx = (speeds.indexOf(playbackSpeed) + 1) % speeds.length;
    const newSpeed = speeds[nextIdx];
    video.playbackRate = newSpeed;
    setPlaybackSpeed(newSpeed);
  };

  const toggleFullscreen = () => {
    const container = containerRef.current;
    if (!container) return;
    playClickSound();
    if (!document.fullscreenElement) {
      container.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = Math.floor(secs % 60);
    return `${mins}:${remainingSecs < 10 ? '0' : ''}${remainingSecs}`;
  };

  return (
    <section id="premiere" className="py-20 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0e1a32] border border-[#1e345e] text-xs font-mono text-[#d9fa22] mb-3">
            <Sparkles className="w-3.5 h-3.5" /> OFFICIAL CHANNEL PREMIERE
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-['Syne',sans-serif] text-white">
            30 Seconds to Rewire How You See Tech
          </h2>
          <p className="mt-3 text-base sm:text-lg text-[#889bb8]">
            Watch the premiere teaser below. Every drop is crafted with zero filler, relentless pacing, and source-checked clarity.
          </p>
        </div>

        {/* Video Player Shell */}
        <div
          ref={containerRef}
          className="relative rounded-3xl overflow-hidden border border-[#1e345e] bg-[#0a1222] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.9)] group"
          onMouseEnter={() => setShowControls(true)}
          onMouseLeave={() => isPlaying && setShowControls(false)}
        >
          {/* Ambient dynamic backglow behind video frame */}
          <div
            className={`absolute -inset-2 bg-[#d9fa22]/15 blur-2xl transition-opacity duration-700 pointer-events-none -z-10 ${
              isPlaying ? 'opacity-100' : 'opacity-40'
            }`}
          />

          {/* HTML5 Video */}
          <div className="relative aspect-video bg-black flex items-center justify-center cursor-pointer" onClick={togglePlay}>
            <video
              ref={videoRef}
              src="./assets/premiere.mp4"
              poster="./assets/toast-wifi.png"
              playsInline
              preload="metadata"
              className="w-full h-full object-contain"
            />

            {/* Central Big Play Button when paused */}
            {!isPlaying && (
              <div className="absolute inset-0 bg-black/45 backdrop-blur-[2px] flex flex-col items-center justify-center transition-all">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    togglePlay();
                  }}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#d9fa22] text-[#070d18] flex items-center justify-center shadow-[0_0_40px_rgba(217,250,34,0.7)] hover:scale-110 active:scale-95 transition-all duration-300"
                  aria-label="Play Premiere Video"
                >
                  <Play className="w-9 h-9 sm:w-10 sm:h-10 fill-current ml-1" />
                </button>
                <div className="mt-4 px-4 py-1.5 rounded-full bg-[#070d18]/80 border border-[#1e345e] text-xs font-mono text-[#f5f1e8]">
                  Click to Play • 30s High-Def Audio & Video
                </div>
              </div>
            )}
          </div>

          {/* Player Controls Bar */}
          <div
            className={`p-4 bg-gradient-to-t from-[#070d18] via-[#0a1426] to-transparent border-t border-[#1a2b4c]/60 transition-opacity duration-300 ${
              showControls || !isPlaying ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {/* Progress Slider */}
            <div className="relative mb-3 flex items-center">
              <input
                type="range"
                min="0"
                max={duration || 30}
                step="0.1"
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-1.5 bg-[#162747] rounded-lg appearance-none cursor-pointer accent-[#d9fa22]"
              />
            </div>

            {/* Controls Cluster */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
              <div className="flex items-center gap-3">
                <button
                  onClick={togglePlay}
                  className="p-2 rounded-xl bg-[#0e1a32] border border-[#1e345e] hover:border-[#d9fa22] text-white hover:text-[#d9fa22] transition-colors"
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                </button>

                <button
                  onClick={toggleMute}
                  className="p-2 rounded-xl bg-[#0e1a32] border border-[#1e345e] hover:border-[#d9fa22] text-white hover:text-[#d9fa22] transition-colors"
                  aria-label="Toggle Audio"
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-[#d9fa22]" />}
                </button>

                <span className="font-mono text-xs text-[#889bb8]">
                  <span className="text-white font-semibold">{formatTime(currentTime)}</span> / {formatTime(duration)}
                </span>
              </div>

              {/* Center Chapter Title */}
              <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-[#0e1a32] border border-[#1e345e] text-xs font-mono">
                <span className="text-[#d9fa22] font-semibold">{chapters[activeChapter]?.title}:</span>
                <span className="text-[#b3c3db]">{chapters[activeChapter]?.desc}</span>
              </div>

              {/* Right Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleSpeed}
                  className="px-2.5 py-1 rounded-lg bg-[#0e1a32] border border-[#1e345e] hover:border-[#d9fa22] text-xs font-mono text-[#d9fa22] hover:text-white transition-colors"
                  title="Playback Speed"
                >
                  {playbackSpeed}x
                </button>

                <button
                  onClick={() => {
                    const video = videoRef.current;
                    if (video) {
                      video.currentTime = 0;
                      video.play().then(() => setIsPlaying(true)).catch(() => {});
                    }
                  }}
                  className="p-2 rounded-xl bg-[#0e1a32] border border-[#1e345e] text-white hover:text-[#d9fa22] transition-colors"
                  title="Replay from start"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                <button
                  onClick={toggleFullscreen}
                  className="p-2 rounded-xl bg-[#0e1a32] border border-[#1e345e] text-white hover:text-[#d9fa22] transition-colors"
                  title="Fullscreen"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    playClickSound();
                    onOpenSubscribe();
                  }}
                  className="ml-2 px-4 py-1.5 rounded-xl bg-[#d9fa22] text-[#070d18] font-bold text-xs hover:bg-white transition-colors shadow-[0_0_15px_rgba(217,250,34,0.3)]"
                >
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Chapter Bar Below Video */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {chapters.map((ch, idx) => {
            const isActive = activeChapter === idx;
            return (
              <button
                key={ch.time}
                onClick={() => seekToChapter(ch.time, idx)}
                className={`p-3 rounded-2xl text-left transition-all duration-200 border cursor-pointer ${
                  isActive
                    ? 'bg-[#0e1a32] border-[#d9fa22] shadow-[0_0_15px_rgba(217,250,34,0.2)]'
                    : 'bg-[#0a1222]/80 border-[#162747] hover:border-[#1e3b6e]'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] font-mono mb-1">
                  <span className={isActive ? 'text-[#d9fa22] font-bold' : 'text-[#889bb8]'}>
                    00:{ch.time < 10 ? '0' : ''}{ch.time}
                  </span>
                  {isActive && <CheckCircle2 className="w-3 h-3 text-[#d9fa22]" />}
                </div>
                <div className="text-xs font-bold text-white truncate">{ch.title}</div>
                <div className="text-[11px] text-[#889bb8] truncate">{ch.desc}</div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
