// Procedural Web Audio API sound generator for typing switches and game effects
// Zero external assets required, zero network latency

class SoundManager {
  private ctx: AudioContext | null = null;
  private soundEnabled: boolean = true;
  private volume: number = 0.4;
  private switchType: 'mechanical' | 'thock' | 'tactile' | 'silent' = 'mechanical';

  constructor() {
    // AudioContext will be initialized on first user interaction to comply with browser autoplay policies
  }

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setSoundEnabled(enabled: boolean) {
    this.soundEnabled = enabled;
  }

  public isEnabled(): boolean {
    return this.soundEnabled;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
  }

  public setSwitchType(type: 'mechanical' | 'thock' | 'tactile' | 'silent') {
    this.switchType = type;
  }

  // Play keystroke click
  public playKeyClick(isSpace: boolean = false) {
    if (!this.soundEnabled || typeof window === 'undefined') return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      // Pitch variation for natural typing feel
      const jitter = (Math.random() - 0.5) * 80;

      if (this.switchType === 'thock') {
        // Deep thocky switch sound
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(isSpace ? 110 + jitter : 180 + jitter, now);
        osc.frequency.exponentialRampToValueAtTime(50, now + 0.04);
        
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800, now);

        gain.gain.setValueAtTime(this.volume * 0.7, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.05);
      } else if (this.switchType === 'tactile') {
        // Crisp tactile click
        osc.type = 'sine';
        osc.frequency.setValueAtTime(isSpace ? 280 + jitter : 420 + jitter, now);
        osc.frequency.exponentialRampToValueAtTime(100, now + 0.035);

        gain.gain.setValueAtTime(this.volume * 0.6, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.04);
      } else {
        // Classic high-frequency mechanical switch
        // Dual component: short noise burst + click tone
        osc.type = 'square';
        osc.frequency.setValueAtTime(isSpace ? 350 + jitter : 750 + jitter, now);
        osc.frequency.exponentialRampToValueAtTime(180, now + 0.025);

        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(isSpace ? 800 : 1500, now);
        filter.Q.setValueAtTime(2.5, now);

        gain.gain.setValueAtTime(this.volume * 0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.035);
      }
    } catch {
      // Audio autoplay policy fallback
    }
  }

  // Play error feedback sound
  public playError() {
    if (!this.soundEnabled || typeof window === 'undefined') return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.linearRampToValueAtTime(110, now + 0.12);

      gain.gain.setValueAtTime(this.volume * 0.45, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.15);
    } catch {
      // Ignore audio error
    }
  }

  // Play success chime / level complete
  public playSuccess() {
    if (!this.soundEnabled || typeof window === 'undefined') return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 arpeggio
      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const now = this.ctx.currentTime + idx * 0.07;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(this.volume * 0.5, now + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.3);
      });
    } catch {
      // Ignore
    }
  }

  // Word blast in Falling Words game
  public playBlast() {
    if (!this.soundEnabled || typeof window === 'undefined') return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(1200, now + 0.08);

      gain.gain.setValueAtTime(this.volume * 0.6, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.11);
    } catch {
      // Ignore
    }
  }
}

export const soundManager = new SoundManager();
