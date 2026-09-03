const AudioContextClass = window.AudioContext ?? window.webkitAudioContext;

export class ProceduralAudioEngine {
  constructor(onStateChange = () => {}) {
    this.onStateChange = onStateChange;
    this.supported = Boolean(AudioContextClass);
    this.context = null;
    this.input = null;
    this.master = null;
    this.analyser = null;
    this.frequencyData = null;
    this.noiseBuffer = null;
    this.timer = null;
    this.nextStepTime = 0;
    this.step = 0;
    this.tempo = 108;
    this.volume = 0.55;
    this.muted = false;
    this.playing = false;
    this.resumeAfterVisibility = false;
    this.voices = new Set();
    this.bands = { low: 0, mid: 0, high: 0 };
    this.handleVisibility = this.handleVisibility.bind(this);
    document.addEventListener("visibilitychange", this.handleVisibility);
  }

  emit(state, detail) {
    this.onStateChange({ state, detail, muted: this.muted, playing: this.playing });
  }

  ensureContext() {
    if (!this.supported) return false;
    if (this.context) return true;

    this.context = new AudioContextClass({ latencyHint: "interactive" });
    this.input = this.context.createGain();
    this.master = this.context.createGain();
    this.master.gain.value = this.volume;

    const compressor = this.context.createDynamicsCompressor();
    compressor.threshold.value = -18;
    compressor.knee.value = 18;
    compressor.ratio.value = 5;
    compressor.attack.value = 0.008;
    compressor.release.value = 0.22;

    this.analyser = this.context.createAnalyser();
    this.analyser.fftSize = 512;
    this.analyser.smoothingTimeConstant = 0.78;
    this.frequencyData = new Uint8Array(this.analyser.frequencyBinCount);

    this.input.connect(this.analyser);
    this.analyser.connect(this.master);
    this.master.connect(compressor);
    compressor.connect(this.context.destination);
    this.noiseBuffer = this.createNoiseBuffer();
    return true;
  }

  createNoiseBuffer() {
    const length = Math.floor(this.context.sampleRate * 0.35);
    const buffer = this.context.createBuffer(1, length, this.context.sampleRate);
    const channel = buffer.getChannelData(0);
    let last = 0;
    for (let index = 0; index < length; index += 1) {
      const white = Math.random() * 2 - 1;
      last = last * 0.42 + white * 0.58;
      channel[index] = white * 0.72 + last * 0.28;
    }
    return buffer;
  }

  track(node) {
    if (this.voices.size >= 24) return false;
    this.voices.add(node);
    node.addEventListener("ended", () => this.voices.delete(node), { once: true });
    return true;
  }

  scheduleTone({ time, frequency, duration, gain, type = "sine", cutoff = 1600 }) {
    if (this.voices.size >= 24) return;
    const oscillator = this.context.createOscillator();
    if (!this.track(oscillator)) return;
    const filter = this.context.createBiquadFilter();
    const envelope = this.context.createGain();

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, time);
    oscillator.detune.setValueAtTime(type === "sine" ? -4 : 4, time);
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(cutoff, time);
    filter.Q.value = 0.7;
    envelope.gain.setValueAtTime(0.0001, time);
    envelope.gain.exponentialRampToValueAtTime(gain, time + 0.018);
    envelope.gain.exponentialRampToValueAtTime(0.0001, time + duration);

    oscillator.connect(filter);
    filter.connect(envelope);
    envelope.connect(this.input);
    oscillator.start(time);
    oscillator.stop(time + duration + 0.04);
  }

  scheduleNoise(time, gain = 0.018) {
    if (this.voices.size >= 24) return;
    const source = this.context.createBufferSource();
    if (!this.track(source)) return;
    const filter = this.context.createBiquadFilter();
    const envelope = this.context.createGain();
    source.buffer = this.noiseBuffer;
    filter.type = "highpass";
    filter.frequency.setValueAtTime(4200, time);
    envelope.gain.setValueAtTime(gain, time);
    envelope.gain.exponentialRampToValueAtTime(0.0001, time + 0.055);
    source.connect(filter);
    filter.connect(envelope);
    envelope.connect(this.input);
    source.start(time);
    source.stop(time + 0.08);
  }

  scheduleStep(time, step) {
    const bassNotes = [55, 55, 65.41, 49, 55, 73.42, 65.41, 49];
    const melodyRatios = [1, 1.5, 1.25, 1.875, 1.125, 1.5, 1.25, 2];
    const beat = step % 8;

    if (step % 2 === 0) {
      this.scheduleTone({
        time,
        frequency: bassNotes[beat],
        duration: 0.34,
        gain: step % 8 === 0 ? 0.34 : 0.24,
        type: "sine",
        cutoff: 360,
      });
    }

    this.scheduleTone({
      time: time + 0.012,
      frequency: 220 * melodyRatios[beat],
      duration: step % 4 === 0 ? 0.62 : 0.28,
      gain: step % 2 === 0 ? 0.055 : 0.038,
      type: step % 3 === 0 ? "triangle" : "sine",
      cutoff: 1800 + beat * 170,
    });

    this.scheduleNoise(time + 0.005, step % 2 === 0 ? 0.038 : 0.062);
  }

  scheduler() {
    if (!this.playing || this.context.state !== "running") return;
    const stepDuration = 30 / this.tempo;
    while (this.nextStepTime < this.context.currentTime + 0.16) {
      this.scheduleStep(this.nextStepTime, this.step);
      this.nextStepTime += stepDuration;
      this.step += 1;
    }
  }

  async start() {
    if (!this.ensureContext()) {
      this.emit("unsupported", "浏览器没有可用的 AudioContext");
      return false;
    }
    await this.context.resume();
    this.playing = true;
    this.nextStepTime = this.context.currentTime + 0.04;
    this.timer ??= window.setInterval(() => this.scheduler(), 50);
    this.scheduler();
    this.emit(this.muted ? "muted" : "playing", `${this.tempo} BPM 原创程序化声场`);
    return true;
  }

  async pause() {
    if (!this.context || !this.playing) return;
    this.playing = false;
    window.clearInterval(this.timer);
    this.timer = null;
    await this.context.suspend();
    this.emit("paused", "音乐已暂停，视觉回到自主呼吸");
  }

  async toggle() {
    if (this.playing) {
      await this.pause();
      return false;
    }
    return this.start();
  }

  setMuted(muted) {
    this.muted = muted;
    if (this.master && this.context) {
      this.master.gain.setTargetAtTime(muted ? 0.0001 : this.volume, this.context.currentTime, 0.025);
    }
    this.emit(muted ? "muted" : this.playing ? "playing" : "paused", muted ? "输出已静音，频谱与视觉仍继续运行" : "声音输出已恢复");
  }

  setVolume(volume) {
    this.volume = Math.min(Math.max(volume, 0), 1);
    if (this.master && this.context && !this.muted) {
      this.master.gain.setTargetAtTime(Math.max(this.volume, 0.0001), this.context.currentTime, 0.025);
    }
  }

  setTempo(tempo) {
    this.tempo = Math.min(Math.max(Number(tempo), 72), 144);
    if (this.context && this.playing) this.nextStepTime = this.context.currentTime + 0.05;
    this.emit(this.muted ? "muted" : this.playing ? "playing" : "locked", `${this.tempo} BPM`);
  }

  averageBand(fromHz, toHz) {
    const binWidth = this.context.sampleRate / this.analyser.fftSize;
    const from = Math.max(0, Math.floor(fromHz / binWidth));
    const to = Math.min(this.frequencyData.length - 1, Math.ceil(toHz / binWidth));
    let total = 0;
    for (let index = from; index <= to; index += 1) total += this.frequencyData[index];
    return total / Math.max(to - from + 1, 1) / 255;
  }

  peakBand(fromHz, toHz) {
    const binWidth = this.context.sampleRate / this.analyser.fftSize;
    const from = Math.max(0, Math.floor(fromHz / binWidth));
    const to = Math.min(this.frequencyData.length - 1, Math.ceil(toHz / binWidth));
    let peak = 0;
    for (let index = from; index <= to; index += 1) peak = Math.max(peak, this.frequencyData[index]);
    return peak / 255;
  }

  getBands() {
    if (!this.analyser || !this.context || this.context.state !== "running") {
      this.bands.low *= 0.9;
      this.bands.mid *= 0.9;
      this.bands.high *= 0.86;
      return this.bands;
    }
    this.analyser.getByteFrequencyData(this.frequencyData);
    const targets = {
      low: this.averageBand(35, 180),
      mid: this.averageBand(180, 1800),
      high: Math.min(1, this.averageBand(1800, 7200) * 2.6 + this.peakBand(1800, 7200) * 0.42),
    };
    this.bands.low += (targets.low - this.bands.low) * 0.32;
    this.bands.mid += (targets.mid - this.bands.mid) * 0.28;
    this.bands.high += (targets.high - this.bands.high) * 0.38;
    return this.bands;
  }

  async handleVisibility() {
    if (!this.context) return;
    if (document.hidden && this.playing) {
      this.resumeAfterVisibility = true;
      await this.context.suspend();
      this.emit("background-suspended", "页面进入后台，音频已挂起");
      return;
    }
    if (!document.hidden && this.playing && this.resumeAfterVisibility) {
      this.resumeAfterVisibility = false;
      await this.context.resume();
      this.nextStepTime = this.context.currentTime + 0.05;
      this.emit(this.muted ? "muted" : "playing", "页面恢复，声场继续");
    }
  }

  async destroy() {
    document.removeEventListener("visibilitychange", this.handleVisibility);
    window.clearInterval(this.timer);
    this.timer = null;
    this.voices.forEach((voice) => {
      try { voice.stop(); } catch { /* already stopped */ }
    });
    this.voices.clear();
    if (this.context && this.context.state !== "closed") await this.context.close();
  }
}
