const AudioContextClass = window.AudioContext ?? window.webkitAudioContext;

export class CurtainSoundscape {
  constructor(onState = () => {}) {
    this.onState = onState;
    this.context = null;
    this.enabled = false;
    this.muted = false;
    this.nodes = [];
    this.state = { wind: 0.28, openness: 0.5, sun: 0.55, pan: 0 };
  }

  get supported() { return Boolean(AudioContextClass); }

  createNoiseBuffer(seconds = 4) {
    const length = Math.max(1, Math.floor(this.context.sampleRate * seconds));
    const buffer = this.context.createBuffer(1, length, this.context.sampleRate);
    const data = buffer.getChannelData(0);
    let brown = 0;
    for (let index = 0; index < length; index += 1) {
      const white = Math.random() * 2 - 1;
      brown = (brown + 0.018 * white) / 1.018;
      data[index] = brown * 3.2;
    }
    return buffer;
  }

  async enable() {
    if (!this.supported) {
      this.onState("unsupported");
      return false;
    }
    if (!this.context) this.buildGraph();
    if (this.context.state === "suspended") await this.context.resume();
    this.enabled = true;
    this.muted = false;
    this.apply(true);
    this.onState("playing");
    return true;
  }

  buildGraph() {
    this.context = new AudioContextClass({ latencyHint: "interactive" });
    const now = this.context.currentTime;
    this.master = this.context.createGain();
    this.master.gain.setValueAtTime(0.0001, now);
    this.master.connect(this.context.destination);

    this.panner = this.context.createStereoPanner?.() ?? this.context.createGain();
    this.panner.connect(this.master);

    this.windSource = this.context.createBufferSource();
    this.windSource.buffer = this.createNoiseBuffer(5);
    this.windSource.loop = true;
    this.windFilter = this.context.createBiquadFilter();
    this.windFilter.type = "lowpass";
    this.windGain = this.context.createGain();
    this.windSource.connect(this.windFilter).connect(this.windGain).connect(this.panner);

    this.leafSource = this.context.createBufferSource();
    this.leafSource.buffer = this.createNoiseBuffer(3);
    this.leafSource.loop = true;
    this.leafFilter = this.context.createBiquadFilter();
    this.leafFilter.type = "bandpass";
    this.leafFilter.Q.value = 0.72;
    this.leafGain = this.context.createGain();
    this.leafSource.connect(this.leafFilter).connect(this.leafGain).connect(this.panner);

    this.roomGain = this.context.createGain();
    this.roomGain.connect(this.master);
    this.roomOscillators = [174, 261.6].map((frequency, index) => {
      const oscillator = this.context.createOscillator();
      const gain = this.context.createGain();
      oscillator.type = index ? "sine" : "triangle";
      oscillator.frequency.value = frequency;
      gain.gain.value = index ? 0.018 : 0.012;
      oscillator.connect(gain).connect(this.roomGain);
      oscillator.start(now);
      this.nodes.push(oscillator, gain);
      return oscillator;
    });

    this.windSource.start(now);
    this.leafSource.start(now);
    this.nodes.push(this.windSource, this.windFilter, this.windGain, this.leafSource, this.leafFilter, this.leafGain, this.roomGain, this.panner, this.master);
  }

  setState(next) {
    Object.assign(this.state, next);
    if (this.context) this.apply();
  }

  apply(immediate = false) {
    const { wind, openness, sun, pan } = this.state;
    const now = this.context.currentTime;
    const ramp = immediate ? 0.05 : 0.22;
    const targetMaster = this.enabled && !this.muted ? 0.34 : 0.0001;
    this.master.gain.cancelScheduledValues(now);
    this.master.gain.setTargetAtTime(targetMaster, now, ramp);
    this.windGain.gain.setTargetAtTime(0.035 + wind * 0.19, now, 0.16);
    this.windFilter.frequency.setTargetAtTime(420 + wind * 1480 + openness * 360, now, 0.18);
    this.leafGain.gain.setTargetAtTime(0.008 + wind * openness * 0.075, now, 0.14);
    this.leafFilter.frequency.setTargetAtTime(1850 + wind * 2300 + sun * 520, now, 0.2);
    this.roomGain.gain.setTargetAtTime(0.28 + (1 - openness) * 0.5, now, 0.32);
    if (this.panner.pan) this.panner.pan.setTargetAtTime(Math.max(-0.9, Math.min(0.9, pan)), now, 0.12);
  }

  async toggle() {
    if (!this.enabled) return this.enable();
    this.muted = !this.muted;
    this.apply();
    this.onState(this.muted ? "muted" : "playing");
    return !this.muted;
  }

  async handleVisibility(hidden) {
    if (!this.context || !this.enabled) return;
    if (hidden) await this.context.suspend();
    else if (!this.muted) await this.context.resume();
  }

  destroy() {
    this.nodes.forEach((node) => { try { node.stop?.(); } catch {} try { node.disconnect?.(); } catch {} });
    this.nodes.length = 0;
    this.context?.close?.();
    this.context = null;
  }
}
