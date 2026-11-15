// Ambient Audio Engine for Blink, Know, Repeat
// Features smooth volume ramping (fade-in / fade-out), auto-ducking during video playback, and equalizer hooks.

class AmbientAudioEngine {
  private audio: HTMLAudioElement | null = null;
  private targetVolume: number = 0.35;
  private currentVolume: number = 0;
  private fadeInterval: number | null = null;
  private isUserMuted: boolean = false;
  private hasStarted: boolean = false;
  private listeners: Array<(state: { isPlaying: boolean; isMuted: boolean; volume: number }) => void> = [];

  constructor() {
    if (typeof window !== 'undefined') {
      const storedMute = localStorage.getItem('bkr_bgm_muted');
      this.isUserMuted = storedMute === 'true';

      // Initialize audio
      this.audio = new Audio('./assets/soundtrack.mp3');
      this.audio.loop = true;
      this.audio.volume = 0;
      this.audio.preload = 'auto';

      // Setup interaction trigger for browsers blocking autoplay
      const startOnInteraction = () => {
        if (!this.hasStarted && !this.isUserMuted) {
          this.playWithFadeIn(2500);
        }
        window.removeEventListener('click', startOnInteraction);
        window.removeEventListener('scroll', startOnInteraction);
        window.removeEventListener('touchstart', startOnInteraction);
        window.removeEventListener('keydown', startOnInteraction);
      };

      window.addEventListener('click', startOnInteraction, { passive: true });
      window.addEventListener('scroll', startOnInteraction, { passive: true });
      window.addEventListener('touchstart', startOnInteraction, { passive: true });
      window.addEventListener('keydown', startOnInteraction, { passive: true });

      // Attempt immediate autoplay
      setTimeout(() => {
        if (!this.isUserMuted) {
          this.playWithFadeIn(2500);
        }
      }, 500);
    }
  }

  public subscribe(callback: (state: { isPlaying: boolean; isMuted: boolean; volume: number }) => void) {
    this.listeners.push(callback);
    callback(this.getState());
    return () => {
      this.listeners = this.listeners.filter((cb) => cb !== callback);
    };
  }

  private notify() {
    const state = this.getState();
    this.listeners.forEach((cb) => cb(state));
  }

  public getState() {
    const isPlaying = this.audio ? !this.audio.paused && this.audio.volume > 0.01 : false;
    return {
      isPlaying,
      isMuted: this.isUserMuted,
      volume: this.currentVolume
    };
  }

  public playWithFadeIn(durationMs: number = 2500) {
    if (!this.audio) return;
    if (this.isUserMuted) return;

    this.hasStarted = true;
    this.clearFade();

    this.audio.play().then(() => {
      const startTime = performance.now();
      const startVol = this.audio!.volume;
      const target = this.targetVolume;

      const step = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(1, elapsed / durationMs);
        // Smooth ease-in-out curve
        const easeProgress = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;
        const nextVol = startVol + (target - startVol) * easeProgress;

        if (this.audio) {
          this.audio.volume = Math.max(0, Math.min(1, nextVol));
          this.currentVolume = this.audio.volume;
        }

        if (progress < 1 && this.audio && !this.audio.paused) {
          this.fadeInterval = requestAnimationFrame(step);
        } else {
          this.fadeInterval = null;
          this.notify();
        }
      };

      this.fadeInterval = requestAnimationFrame(step);
      this.notify();
    }).catch(() => {
      // Autoplay prevented by browser, waiting for user gesture
    });
  }

  public pauseWithFadeOut(durationMs: number = 1800) {
    if (!this.audio || this.audio.paused) return;
    this.clearFade();

    const startTime = performance.now();
    const startVol = this.audio.volume;

    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / durationMs);
      const easeProgress = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;
      const nextVol = Math.max(0, startVol * (1 - easeProgress));

      if (this.audio) {
        this.audio.volume = nextVol;
        this.currentVolume = nextVol;
      }

      if (progress < 1 && this.audio) {
        this.fadeInterval = requestAnimationFrame(step);
      } else {
        if (this.audio) {
          this.audio.pause();
          this.audio.volume = 0;
          this.currentVolume = 0;
        }
        this.fadeInterval = null;
        this.notify();
      }
    };

    this.fadeInterval = requestAnimationFrame(step);
    this.notify();
  }

  public duck(duckTarget: number = 0.05, durationMs: number = 1000) {
    if (!this.audio || this.audio.paused) return;
    this.clearFade();

    const startTime = performance.now();
    const startVol = this.audio.volume;

    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / durationMs);
      const nextVol = startVol + (duckTarget - startVol) * progress;

      if (this.audio) {
        this.audio.volume = Math.max(0, nextVol);
        this.currentVolume = this.audio.volume;
      }

      if (progress < 1) {
        this.fadeInterval = requestAnimationFrame(step);
      } else {
        this.fadeInterval = null;
      }
    };

    this.fadeInterval = requestAnimationFrame(step);
  }

  public unduck(durationMs: number = 1500) {
    if (!this.audio || this.isUserMuted) return;
    this.clearFade();

    const startTime = performance.now();
    const startVol = this.audio.volume;
    const target = this.targetVolume;

    if (this.audio.paused) {
      this.audio.play().catch(() => {});
    }

    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / durationMs);
      const nextVol = startVol + (target - startVol) * progress;

      if (this.audio) {
        this.audio.volume = Math.min(1, nextVol);
        this.currentVolume = this.audio.volume;
      }

      if (progress < 1) {
        this.fadeInterval = requestAnimationFrame(step);
      } else {
        this.fadeInterval = null;
        this.notify();
      }
    };

    this.fadeInterval = requestAnimationFrame(step);
  }

  public toggleMute(): boolean {
    this.isUserMuted = !this.isUserMuted;
    if (typeof window !== 'undefined') {
      localStorage.setItem('bkr_bgm_muted', this.isUserMuted ? 'true' : 'false');
    }

    if (this.isUserMuted) {
      this.pauseWithFadeOut(1500);
    } else {
      this.playWithFadeIn(2000);
    }

    return this.isUserMuted;
  }

  private clearFade() {
    if (this.fadeInterval !== null) {
      cancelAnimationFrame(this.fadeInterval);
      this.fadeInterval = null;
    }
  }
}

export const ambientAudio = new AmbientAudioEngine();
