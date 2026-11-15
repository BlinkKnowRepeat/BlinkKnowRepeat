import React, { useState } from 'react';
import { ParticleCanvas } from './components/ParticleCanvas';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { DailyDropCountdown } from './components/DailyDropCountdown';
import { PremierePlayer } from './components/PremierePlayer';
import { ThreeLensesSection } from './components/ThreeLensesSection';
import { EpisodeRadar } from './components/EpisodeRadar';
import { ContactSection } from './components/ContactSection';
import { AudioVisualizerHUD } from './components/AudioVisualizerHUD';
import { Footer } from './components/Footer';
import { SubscribeModal } from './components/SubscribeModal';
import { Episode } from './types';

export default function App() {
  const [subscribeModalOpen, setSubscribeModalOpen] = useState(false);

  const scrollToPremiere = () => {
    const el = document.getElementById('premiere');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handlePlayEpisode = (_ep: Episode) => {
    scrollToPremiere();
  };

  return (
    <div className="relative min-h-screen bg-[#070d18] text-[#f5f1e8] selection:bg-[#d9fa22] selection:text-black">
      {/* Dynamic Interactive Multi-Layer Particle & Energy Network */}
      <ParticleCanvas />

      {/* Floating Header */}
      <Navbar onOpenSubscribe={() => setSubscribeModalOpen(true)} />

      {/* Main Content Flow */}
      <main className="relative z-10">
        <Hero
          onOpenSubscribe={() => setSubscribeModalOpen(true)}
          onScrollToPremiere={scrollToPremiere}
        />

        <DailyDropCountdown />

        <PremierePlayer onOpenSubscribe={() => setSubscribeModalOpen(true)} />

        <ThreeLensesSection />

        <EpisodeRadar onPlayEpisode={handlePlayEpisode} />

        <ContactSection onOpenSubscribe={() => setSubscribeModalOpen(true)} />
      </main>

      {/* Ambient Audio Visualizer & Equalizer HUD */}
      <AudioVisualizerHUD />

      {/* Footer */}
      <Footer />

      {/* Subscriber Modal */}
      <SubscribeModal
        isOpen={subscribeModalOpen}
        onClose={() => setSubscribeModalOpen(false)}
      />
    </div>
  );
}
