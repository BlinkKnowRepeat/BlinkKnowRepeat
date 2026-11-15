import React, { useState } from 'react';
import { EPISODES_DATA } from '../data/episodes';
import { Episode } from '../types';
import { Play, Sparkles, X, ArrowUpRight, Share2, Check, Clock } from 'lucide-react';
import { playClickSound, playZapSound } from '../utils/sound';

interface EpisodeRadarProps {
  onPlayEpisode: (ep: Episode) => void;
}

export const EpisodeRadar: React.FC<EpisodeRadarProps> = ({ onPlayEpisode }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(null);
  const [copied, setCopied] = useState(false);

  const categories = ['ALL', 'TECH', 'AI', 'BUSINESS', 'WORLD AFFAIRS'];

  const filteredEpisodes = selectedCategory === 'ALL'
    ? EPISODES_DATA
    : EPISODES_DATA.filter((ep) => ep.category === selectedCategory);

  const handleShare = (ep: Episode) => {
    playClickSound();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`Check out: "${ep.title}" on Blink, Know, Repeat!`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <section id="episodes" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0e1a32] border border-[#1e345e] text-xs font-mono text-[#d9fa22] mb-3">
              <Sparkles className="w-3.5 h-3.5" /> DAILY ARCHIVE & INVESTIGATIONS
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-['Syne',sans-serif] text-white">
              The Intel Radar
            </h2>
            <p className="mt-2 text-base text-[#889bb8] max-w-xl">
              Each drop answers one burning question in 30 seconds. Explore recent breakdowns and upcoming investigations.
            </p>
          </div>

          {/* Filter Pills with Generous Padding */}
          <div className="flex flex-wrap items-center gap-2.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  playClickSound();
                  setSelectedCategory(cat);
                }}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold font-mono transition-all duration-200 cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#d9fa22] text-[#070d18] shadow-[0_0_20px_rgba(217,250,34,0.4)]'
                    : 'bg-[#0e1a32] text-[#889bb8] hover:text-white border border-[#1e345e]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEpisodes.map((ep) => (
            <div
              key={ep.id}
              className="group relative rounded-3xl overflow-hidden bg-[#0a1222] border border-[#162747] hover:border-[#d9fa22]/50 transition-all duration-300 shadow-xl flex flex-col hover:-translate-y-1"
            >
              {/* Thumbnail Container */}
              <div
                className="relative aspect-video bg-black overflow-hidden cursor-pointer"
                onClick={() => {
                  playZapSound();
                  setSelectedEpisode(ep);
                }}
              >
                <img
                  src={ep.thumbnail}
                  alt={ep.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a1222] via-transparent to-transparent opacity-80" />

                {/* Duration Badge with Good Padding */}
                <div className="absolute bottom-3 right-3 px-3 py-1.5 rounded-xl bg-[#070d18]/90 border border-[#1e345e] text-xs font-mono text-[#d9fa22] flex items-center gap-1.5 font-bold">
                  <Clock className="w-3.5 h-3.5" />
                  {ep.duration}
                </div>

                {/* Category Badge with Good Padding */}
                <div className="absolute top-3 left-3 px-3.5 py-1.5 rounded-xl bg-[#070d18]/90 border border-[#1e345e] text-[11px] font-mono text-[#f5f1e8] font-bold uppercase">
                  {ep.category}
                </div>

                {/* Play Hover Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-[#d9fa22] text-[#070d18] flex items-center justify-center shadow-[0_0_25px_#d9fa22]">
                    <Play className="w-6 h-6 fill-current ml-0.5" />
                  </div>
                </div>
              </div>

              {/* Card Body with Generous Padding */}
              <div className="p-7 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold font-['Syne',sans-serif] text-white group-hover:text-[#d9fa22] transition-colors leading-snug">
                    {ep.title}
                  </h3>
                  <p className="mt-2.5 text-sm text-[#889bb8] line-clamp-2 leading-relaxed">
                    {ep.subtitle}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#162747] flex items-center justify-between">
                  <div className="flex flex-wrap gap-2">
                    {ep.tags.slice(0, 2).map((t) => (
                      <span key={t} className="text-[11px] font-mono text-[#889bb8] px-3 py-1 rounded-lg bg-[#070d18] border border-[#1e345e]/60">
                        #{t}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={() => {
                      playClickSound();
                      setSelectedEpisode(ep);
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0e1a32] border border-[#1e345e] hover:border-[#d9fa22] text-xs font-bold text-[#d9fa22] hover:text-white transition-all cursor-pointer"
                  >
                    <span>View Intel</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Breakdown Drawer / Modal */}
        {selectedEpisode && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <div className="relative w-full max-w-3xl rounded-3xl bg-[#0a1222] border-2 border-[#1e345e] shadow-[0_0_60px_rgba(0,0,0,0.95)] overflow-hidden max-h-[90vh] flex flex-col">
              {/* Modal Header */}
              <div className="relative aspect-video sm:aspect-[21/9] bg-black">
                <img
                  src={selectedEpisode.thumbnail}
                  alt={selectedEpisode.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a1222] via-[#0a1222]/50 to-transparent" />

                <button
                  onClick={() => setSelectedEpisode(null)}
                  className="absolute top-4 right-4 p-2.5 rounded-full bg-[#070d18]/85 text-[#889bb8] hover:text-white border border-[#1e345e] transition-colors cursor-pointer"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="absolute bottom-5 left-6 right-6">
                  <div className="inline-block px-3 py-1.5 rounded-lg bg-[#d9fa22] text-[#070d18] text-xs font-mono font-bold mb-2 uppercase">
                    {selectedEpisode.category}
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black font-['Syne',sans-serif] text-white">
                    {selectedEpisode.title}
                  </h3>
                </div>
              </div>

              {/* Modal Body with Generous Padding */}
              <div className="p-7 sm:p-8 overflow-y-auto space-y-6">
                <div>
                  <div className="text-xs font-mono text-[#d9fa22] uppercase tracking-wider mb-1.5 font-bold">
                    The Hook
                  </div>
                  <p className="text-base sm:text-lg text-white font-medium italic leading-relaxed">
                    "{selectedEpisode.hook}"
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-5 rounded-2xl bg-[#070d18] border border-[#162747]">
                    <div className="text-xs font-mono text-[#d9fa22] font-bold mb-2">
                      01. WHAT HAPPENED
                    </div>
                    <p className="text-xs sm:text-sm text-[#b3c3db] leading-relaxed">
                      {selectedEpisode.whatHappened}
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-[#070d18] border border-[#162747]">
                    <div className="text-xs font-mono text-[#d9fa22] font-bold mb-2">
                      02. WHO BENEFITS
                    </div>
                    <p className="text-xs sm:text-sm text-[#b3c3db] leading-relaxed">
                      {selectedEpisode.whoBenefits}
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-[#070d18] border border-[#162747]">
                    <div className="text-xs font-mono text-[#d9fa22] font-bold mb-2">
                      03. WHY IT MATTERS
                    </div>
                    <p className="text-xs sm:text-sm text-[#b3c3db] leading-relaxed">
                      {selectedEpisode.whyItMatters}
                    </p>
                  </div>
                </div>

                {/* Tags & Action row with generous button padding */}
                <div className="pt-4 border-t border-[#162747] flex flex-wrap items-center justify-between gap-4">
                  <div className="flex flex-wrap gap-2">
                    {selectedEpisode.tags.map((t) => (
                      <span key={t} className="text-xs font-mono text-[#889bb8] px-3 py-1.5 rounded-lg bg-[#070d18] border border-[#1e345e]">
                        #{t}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleShare(selectedEpisode)}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0e1a32] border border-[#1e345e] hover:border-[#d9fa22] text-xs font-bold text-white transition-colors cursor-pointer"
                    >
                      {copied ? <Check className="w-4 h-4 text-[#d9fa22]" /> : <Share2 className="w-4 h-4" />}
                      <span>{copied ? 'Copied!' : 'Share Intel'}</span>
                    </button>

                    <button
                      onClick={() => {
                        onPlayEpisode(selectedEpisode);
                        setSelectedEpisode(null);
                      }}
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#d9fa22] text-[#070d18] text-xs font-black shadow-[0_0_20px_rgba(217,250,34,0.4)] hover:bg-white transition-colors cursor-pointer"
                    >
                      <Play className="w-4 h-4 fill-current ml-0.5" />
                      <span>Watch Teaser</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
