import React, { useState } from 'react';
import { X, Mail, Heart, Check, ExternalLink, Zap, ArrowRight } from 'lucide-react';
import { YoutubeIcon } from './BrandIcons';
import { playClickSound, playSuccessSound, playZapSound } from '../utils/sound';
import confetti from 'canvas-confetti';

interface SubscribeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SubscribeModal: React.FC<SubscribeModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    playZapSound();
    setSubmitted(true);
    playSuccessSound();

    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.5 },
        colors: ['#d9fa22', '#ffffff', '#1a3b6e']
      });
    } catch (err) {
      console.error(err);
    }
  };

  const copyEmail = () => {
    playClickSound();
    if (navigator.clipboard) {
      navigator.clipboard.writeText('blinkknowrepeat@gmail.com');
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg rounded-3xl bg-[#0a1426] border-2 border-[#1e345e] shadow-[0_0_60px_rgba(0,0,0,0.9)] overflow-hidden">
        {/* Glow corner */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-[#d9fa22]/15 rounded-full blur-2xl pointer-events-none" />

        {/* Close button */}
        <button
          onClick={() => {
            playClickSound();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 rounded-full bg-[#070d18] text-[#889bb8] hover:text-white border border-[#1e345e] transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8">
          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-[#0e1a32] border border-[#d9fa22]/40 flex items-center justify-center text-[#d9fa22]">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            <div>
              <div className="text-xs font-mono text-[#d9fa22] uppercase tracking-wider">
                DAY-ONE ONBOARDING
              </div>
              <h3 className="text-2xl font-black font-['Syne',sans-serif] text-white">
                Join Founding 1,000
              </h3>
            </div>
          </div>

          <p className="text-sm text-[#889bb8] mb-6">
            Help us reach our first 1,000 subscribers. Hit subscribe on YouTube or enter your email to receive every 7 PM drop directly.
          </p>

          {!submitted ? (
            <div className="space-y-4">
              {/* YouTube Direct Action */}
              <a
                href="https://www.youtube.com/@BlinkKnowRepeat?sub_confirmation=1"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => playZapSound()}
                className="w-full py-4 px-6 rounded-2xl bg-[#ff0000] hover:bg-[#e60000] text-white font-extrabold text-sm tracking-wide flex items-center justify-center gap-3 shadow-[0_0_25px_rgba(255,0,0,0.4)] transition-all transform hover:-translate-y-0.5 cursor-pointer"
              >
                <YoutubeIcon className="w-5 h-5 fill-current" />
                <span>Subscribe on YouTube</span>
                <ExternalLink className="w-4 h-4 ml-auto" />
              </a>

              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-[#1e345e]"></div>
                <span className="flex-shrink mx-4 text-xs font-mono text-[#889bb8] uppercase">
                  Or Join Direct Email Dispatch
                </span>
                <div className="flex-grow border-t border-[#1e345e]"></div>
              </div>

              {/* Email Form */}
              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#070d18] border border-[#1e345e] focus:border-[#d9fa22] text-white placeholder-[#4b6080] text-sm outline-none transition-colors"
                />
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#d9fa22] text-[#070d18] font-black text-sm tracking-wide shadow-[0_0_20px_rgba(217,250,34,0.3)] hover:bg-white transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Claim Founding Spot & Daily Drops</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          ) : (
            <div className="p-6 rounded-2xl bg-[#070d18] border border-[#d9fa22]/50 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#d9fa22]/20 border border-[#d9fa22] text-[#d9fa22] flex items-center justify-center mx-auto">
                <Check className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold font-['Syne',sans-serif] text-white">
                You're in the Founding Circle!
              </h4>
              <p className="text-xs text-[#b3c3db]">
                Welcome aboard. You’ll receive our 7:00 PM intel drops and unredacted source documents.
              </p>
            </div>
          )}

          {/* Contact / Links Footer */}
          <div className="mt-6 pt-4 border-t border-[#162747] flex items-center justify-between text-xs font-mono text-[#889bb8]">
            <button
              onClick={copyEmail}
              className="hover:text-[#d9fa22] transition-colors flex items-center gap-1.5"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>{copiedEmail ? 'Email Copied!' : 'blinkknowrepeat@gmail.com'}</span>
            </button>

            <a
              href="https://www.patreon.com/cw/BlinkKnowRepeat"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#d9fa22] transition-colors flex items-center gap-1"
            >
              <Heart className="w-3.5 h-3.5" />
              <span>Patreon</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
