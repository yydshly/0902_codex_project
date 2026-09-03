const SCALE = [0, 3, 5, 7, 10, 12, 15];

export class RainHarpAudio {
  constructor(onState = () => {}) {
    this.onState = onState;
    this.context = null;
    this.started = false;
    this.muted = false;
    this.intensity = 0.42;
    this.wetness = 0;
    this.tension = 0.78;
    this.lastPluckAt = 0;
  }

  get supported() {
    return Boolean(window.AudioContext || window.webkitAudioContext);
  }

  async start() {
    if (!this.supported) {
      this.onState("unsupported", "当前浏览器不支持 Web Audio");
      return false;
    }
    if (!this.context) this.createGraph();
    await this.context.resume();
    this.started = true;
    this.master.gain.setTargetAtTime(this.muted ? 0 : 0.52, this.context.currentTime, 0.08);
    this.onState(this.muted ? "muted" : "playing", this.muted ? "声场已静音" : "雨琴已启动");
    return true;
  }

  createGraph() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    this.context = new AudioContext();
    const now = this.context.currentTime;

    this.master = this.context.createGain();
    this.master.gain.value = 0;
    this.master.connect(this.context.destination);

    this.compressor = this.context.createDynamicsCompressor();
    this.compressor.threshold.value = -18;
    this.compressor.knee.value = 16;
    this.compressor.ratio.value = 4;
    this.compressor.attack.value = 0.01;
    this.compressor.release.value = 0.34;
    this.compressor.connect(this.master);

    const buffer = this.context.createBuffer(1, this.context.sampleRate * 3, this.context.sampleRate);
    const data = buffer.getChannelData(0);
    let smooth = 0;
    for (let index = 0; index < data.length; index += 1) {
      smooth = smooth * 0.965 + (Math.random() * 2 - 1) * 0.035;
      data[index] = smooth * 0.8 + (Math.random() * 2 - 1) * 0.12;
    }
    this.rainSource = this.context.createBufferSource();
    this.rainSource.buffer = buffer;
    this.rainSource.loop = true;
    this.rainFilter = this.context.createBiquadFilter();
    this.rainFilter.type = "bandpass";
    this.rainFilter.frequency.value = 2400;
    this.rainFilter.Q.value = 0.46;
    this.rainGain = this.context.createGain();
    this.rainGain.gain.value = 0.035;
    this.rainSource.connect(this.rainFilter).connect(this.rainGain).connect(this.compressor);
    this.rainSource.start(now);

    this.bodyGain = this.context.createGain();
    this.bodyGain.gain.value = 0.018;
    this.bodyFilter = this.context.createBiquadFilter();
    this.bodyFilter.type = "lowpass";
    this.bodyFilter.frequency.value = 620;
    this.bodyGain.connect(this.bodyFilter).connect(this.compressor);
    this.oscillators = [0, 7, 12].map((semitone, index) => {
      const oscillator = this.context.createOscillator();
      const gain = this.context.createGain();
      oscillator.type = index === 0 ? "sine" : "triangle";
      oscillator.frequency.value = 82.4 * 2 ** (semitone / 12);
      gain.gain.value = index === 0 ? 0.66 : 0.15;
      oscillator.connect(gain).connect(this.bodyGain);
      oscillator.start(now);
      return { oscillator, gain, semitone };
    });
    this.setState({ intensity: this.intensity, wetness: this.wetness, tension: this.tension });
  }

  async toggle() {
    if (!this.started) return this.start();
    if (this.context.state === "running") {
      await this.context.suspend();
      this.onState("paused", "雨琴已暂停");
      return false;
    }
    await this.context.resume();
    this.onState(this.muted ? "muted" : "playing", this.muted ? "声场已静音" : "雨琴继续演奏");
    return true;
  }

  setMuted(muted) {
    this.muted = Boolean(muted);
    if (this.master && this.context) {
      this.master.gain.setTargetAtTime(this.muted ? 0 : 0.52, this.context.currentTime, 0.05);
    }
    this.onState(this.muted ? "muted" : this.started ? "playing" : "locked", this.muted ? "声场已静音" : "声音输出已恢复");
  }

  setState({ intensity, wetness, tension }) {
    this.intensity = intensity;
    this.wetness = wetness;
    this.tension = tension;
    if (!this.context) return;
    const now = this.context.currentTime;
    const fundamental = 92 + tension * 76 - wetness * 38;
    this.rainGain.gain.setTargetAtTime(0.018 + intensity * 0.075, now, 0.2);
    this.rainFilter.frequency.setTargetAtTime(1450 + intensity * 3100, now, 0.24);
    this.bodyGain.gain.setTargetAtTime(0.012 + wetness * 0.022, now, 0.3);
    this.bodyFilter.frequency.setTargetAtTime(720 - wetness * 310, now, 0.3);
    this.oscillators.forEach(({ oscillator, semitone }) => {
      oscillator.frequency.setTargetAtTime(fundamental * 2 ** (semitone / 12), now, 0.18);
    });
  }

  impact(strength, x = 0) {
    if (!this.context || this.context.state !== "running" || this.muted) return;
    const now = this.context.currentTime;
    if (now - this.lastPluckAt < 0.045) return;
    this.lastPluckAt = now;
    const degree = SCALE[Math.abs(Math.round((x + 5) * 0.72)) % SCALE.length];
    const base = 178 + this.tension * 122 - this.wetness * 58;
    const frequency = base * 2 ** (degree / 12);
    const oscillator = this.context.createOscillator();
    const filter = this.context.createBiquadFilter();
    const gain = this.context.createGain();
    const panner = this.context.createStereoPanner?.();
    oscillator.type = "triangle";
    oscillator.frequency.setValueAtTime(frequency, now);
    oscillator.frequency.exponentialRampToValueAtTime(Math.max(48, frequency * 0.72), now + 0.7);
    filter.type = "bandpass";
    filter.frequency.value = frequency * 1.7;
    filter.Q.value = 2.8;
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.035 + strength * 0.075, now + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.48 + this.wetness * 0.34);
    oscillator.connect(filter).connect(gain);
    if (panner) {
      panner.pan.value = Math.max(-0.85, Math.min(0.85, x / 5));
      gain.connect(panner).connect(this.compressor);
    } else {
      gain.connect(this.compressor);
    }
    oscillator.start(now);
    oscillator.stop(now + 1.05);
  }

  destroy() {
    this.rainSource?.stop();
    this.oscillators?.forEach(({ oscillator }) => oscillator.stop());
    this.context?.close();
  }
}
