const TAU = Math.PI * 2;

export const INK_MODES = {
  dense: { label: "浓墨", rgb: [24, 20, 16], opacity: 0.76, water: 0.48, bristles: 11 },
  pale: { label: "淡墨", rgb: [64, 72, 68], opacity: 0.34, water: 0.82, bristles: 13 },
  cinnabar: { label: "朱砂", rgb: [163, 53, 39], opacity: 0.62, water: 0.58, bristles: 9 },
};

function clamp(value, min = 0, max = 1) {
  return Math.max(min, Math.min(max, value));
}

function seeded(index) {
  const value = Math.sin(index * 78.233 + 19.17) * 43758.5453;
  return value - Math.floor(value);
}

export class InkPainter {
  constructor({ width = 1536, height = 960, reducedMotion = false } = {}) {
    this.canvas = document.createElement("canvas");
    this.canvas.width = width;
    this.canvas.height = height;
    this.context = this.canvas.getContext("2d", { alpha: true, desynchronized: true });
    this.reducedMotion = reducedMotion;
    this.mode = "dense";
    this.pressureControl = 0.68;
    this.waterControl = 0.58;
    this.absorption = 0.62;
    this.strokeCount = 0;
    this.sampleCount = 0;
    this.wetMarks = [];
    this.active = false;
    this.lastPoint = null;
    this.lastSpeed = 0;
    this.lastPressure = 0;
    this.lastWidth = null;
    this.suppressSplatter = false;
    this.dryProgress = 1;
    this.diffusionAccumulator = 0;
    this.dirty = true;
    this.drawWelcomeMark();
  }

  setMode(mode) {
    if (INK_MODES[mode]) this.mode = mode;
  }

  setPressure(value) { this.pressureControl = clamp(Number(value)); }
  setWater(value) { this.waterControl = clamp(Number(value)); }
  setAbsorption(value) { this.absorption = clamp(Number(value)); }

  resolvePressure(rawPressure, pointerType = "mouse") {
    const hasRealPressure = pointerType !== "mouse" && Number(rawPressure) > 0;
    return clamp(hasRealPressure ? rawPressure : this.pressureControl, 0.08, 1);
  }

  begin(point, { pressure = 0.5, pointerType = "mouse", now = performance.now() } = {}) {
    this.active = true;
    this.strokeCount += 1;
    this.lastPoint = { ...point, now };
    this.lastPressure = this.resolvePressure(pressure, pointerType);
    this.lastSpeed = 0;
    this.lastWidth = null;
    this.depositDot(point, this.lastPressure);
    return this.snapshot();
  }

  move(point, { pressure = 0.5, pointerType = "mouse", now = performance.now() } = {}) {
    if (!this.active || !this.lastPoint) return this.snapshot();
    const dx = (point.x - this.lastPoint.x) * this.canvas.width;
    const dy = (point.y - this.lastPoint.y) * this.canvas.height;
    const distance = Math.hypot(dx, dy);
    if (distance < 0.35) return this.snapshot();
    const elapsed = Math.max(8, now - this.lastPoint.now) / 1000;
    const speed = clamp(distance / elapsed / 1800);
    const nextPressure = this.resolvePressure(pressure, pointerType);
    const pressureValue = clamp((this.lastPressure + nextPressure) * 0.5 + (1 - speed) * 0.08, 0.08, 1);
    this.depositSegment(this.lastPoint, point, pressureValue, speed);
    this.lastPoint = { ...point, now };
    this.lastPressure = nextPressure;
    this.lastSpeed = speed;
    return this.snapshot();
  }

  end() {
    this.active = false;
    this.lastPoint = null;
    this.lastWidth = null;
    return this.snapshot();
  }

  depositDot(point, pressure) {
    const mode = INK_MODES[this.mode];
    const x = point.x * this.canvas.width;
    const y = point.y * this.canvas.height;
    const radius = (7 + pressure * 35) * (0.88 + this.waterControl * 0.22);
    const [r, g, b] = mode.rgb;
    const gradient = this.context.createRadialGradient(x, y, 0, x, y, radius);
    gradient.addColorStop(0, `rgba(${r},${g},${b},${mode.opacity * 0.9})`);
    gradient.addColorStop(0.68, `rgba(${r},${g},${b},${mode.opacity * 0.52})`);
    gradient.addColorStop(1, `rgba(${r},${g},${b},0)`);
    this.context.fillStyle = gradient;
    this.context.beginPath();
    this.context.arc(x, y, radius, 0, TAU);
    this.context.fill();
    this.pushWetMark(x, y, radius, pressure, mode.rgb);
    this.sampleCount += 1;
    this.dirty = true;
  }

  depositSegment(from, to, pressure, speed) {
    const mode = INK_MODES[this.mode];
    const water = clamp((this.waterControl + mode.water) * 0.5);
    const x0 = from.x * this.canvas.width;
    const y0 = from.y * this.canvas.height;
    const x1 = to.x * this.canvas.width;
    const y1 = to.y * this.canvas.height;
    const dx = x1 - x0;
    const dy = y1 - y0;
    const distance = Math.max(0.001, Math.hypot(dx, dy));
    const nx = -dy / distance;
    const ny = dx / distance;
    const width = (10 + pressure * 82) * (1 - speed * 0.42) * (0.86 + water * 0.18);
    const bristleCount = mode.bristles;
    const [r, g, b] = mode.rgb;
    const dryBrush = clamp(speed * 0.72 + (1 - water) * 0.5 - pressure * 0.18);
    this.context.lineCap = "round";
    this.context.lineJoin = "round";

    // Join changing widths as one continuous body. Fibre streaks remain a
    // secondary surface detail instead of exposing every sampled segment.
    const fromWidth = this.lastWidth ?? width * 0.72;
    this.context.fillStyle = `rgb(${r},${g},${b})`;
    this.context.beginPath();
    this.context.moveTo(x0 + nx * fromWidth * 0.42, y0 + ny * fromWidth * 0.42);
    this.context.lineTo(x1 + nx * width * 0.42, y1 + ny * width * 0.42);
    this.context.lineTo(x1 - nx * width * 0.42, y1 - ny * width * 0.42);
    this.context.lineTo(x0 - nx * fromWidth * 0.42, y0 - ny * fromWidth * 0.42);
    this.context.closePath();
    this.context.fill();
    this.context.beginPath();
    this.context.arc(x1, y1, width * 0.42, 0, TAU);
    this.context.fill();

    this.context.lineCap = "butt";
    for (let index = 0; index < bristleCount; index += 1) {
      const across = bristleCount === 1 ? 0 : index / (bristleCount - 1) * 2 - 1;
      const noise = (seeded(this.sampleCount * 19 + index * 7) - 0.5) * width * 0.1;
      const offset = across * width * 0.34 + noise;
      const skip = seeded(this.sampleCount * 31 + index * 11) < dryBrush * (0.18 + Math.abs(across) * 0.42);
      if (skip) continue;
      const edgeFade = 1 - Math.abs(across) * 0.34;
      const alpha = mode.opacity * edgeFade * (0.18 + water * 0.12) * (1 - dryBrush * 0.34);
      this.context.strokeStyle = `rgba(${r},${g},${b},${alpha})`;
      this.context.lineWidth = Math.max(0.65, width / bristleCount * (0.52 + seeded(index + this.sampleCount) * 0.48));
      this.context.beginPath();
      this.context.moveTo(x0 + nx * offset, y0 + ny * offset);
      this.context.quadraticCurveTo(
        (x0 + x1) * 0.5 + nx * offset * (0.96 + seeded(index * 13 + this.sampleCount) * 0.09),
        (y0 + y1) * 0.5 + ny * offset * (0.96 + seeded(index * 17 + this.sampleCount) * 0.09),
        x1 + nx * offset,
        y1 + ny * offset,
      );
      this.context.stroke();
    }

    const substeps = Math.max(1, Math.min(8, Math.ceil(distance / 22)));
    for (let step = 0; step <= substeps; step += 1) {
      const t = step / substeps;
      const x = x0 + dx * t;
      const y = y0 + dy * t;
      if (seeded(this.sampleCount * 47 + step) > 0.24 + water * 0.64) continue;
      this.pushWetMark(x, y, width * (0.16 + seeded(step + this.sampleCount) * 0.12), pressure, mode.rgb);
    }

    const expressiveImpact = speed > 0.58 || pressure > 0.95;
    if (!this.suppressSplatter && expressiveImpact && this.sampleCount % 5 === 0) this.depositSplatter(x1, y1, nx, ny, width, speed, pressure, mode.rgb);
    this.lastWidth = width;
    this.sampleCount += 1;
    this.dirty = true;
  }

  depositSplatter(x, y, nx, ny, width, speed, pressure, rgb) {
    const count = this.reducedMotion ? 1 : Math.min(6, 1 + Math.floor(speed * 4 + pressure));
    const [r, g, b] = rgb;
    for (let index = 0; index < count; index += 1) {
      const spread = (seeded(this.sampleCount * 59 + index * 13) - 0.5) * width * 2.8;
      const travel = (0.4 + seeded(this.sampleCount * 67 + index) * 2.4) * width;
      const px = x + nx * spread + (seeded(index * 71 + this.sampleCount) - 0.46) * travel;
      const py = y + ny * spread + (seeded(index * 73 + this.sampleCount) - 0.42) * travel;
      const radius = 0.8 + seeded(index * 79 + this.sampleCount) * (2.5 + pressure * 3.5);
      this.context.fillStyle = `rgba(${r},${g},${b},${0.2 + seeded(index) * 0.45})`;
      this.context.beginPath();
      this.context.arc(px, py, radius, 0, TAU);
      this.context.fill();
    }
  }

  pushWetMark(x, y, radius, pressure, rgb) {
    const cap = this.canvas.width < 1000 ? 180 : 320;
    if (this.wetMarks.length >= cap) this.wetMarks.splice(0, this.wetMarks.length - cap + 1);
    this.wetMarks.push({
      x,
      y,
      radius,
      pressure,
      rgb,
      age: 0,
      life: 1.8 + this.waterControl * 5.2 - this.absorption * 1.35,
      lastBand: 0,
    });
  }

  step(delta) {
    const safeDelta = Math.min(delta, 0.05);
    this.diffusionAccumulator += safeDelta;
    const interval = this.reducedMotion ? 0.16 : 0.075;
    let changed = false;
    this.wetMarks.forEach((mark) => { mark.age += safeDelta * (0.68 + this.absorption * 0.76); });
    if (this.diffusionAccumulator >= interval) {
      this.diffusionAccumulator = 0;
      this.wetMarks.forEach((mark, index) => {
        const progress = clamp(mark.age / Math.max(0.2, mark.life));
        const band = Math.floor(progress * 12);
        if (band <= mark.lastBand || progress >= 1) return;
        mark.lastBand = band;
        const [r, g, b] = mark.rgb;
        const feather = mark.radius * (0.55 + progress * (0.7 + this.waterControl * 1.35));
        const driftX = (seeded(index * 83 + band) - 0.5) * feather * 0.28;
        const driftY = (seeded(index * 89 + band) - 0.5) * feather * 0.28;
        const gradient = this.context.createRadialGradient(mark.x + driftX, mark.y + driftY, feather * 0.42, mark.x + driftX, mark.y + driftY, feather);
        gradient.addColorStop(0, `rgba(${r},${g},${b},${0.005 + this.waterControl * 0.008})`);
        gradient.addColorStop(0.72, `rgba(${r},${g},${b},${0.004 + this.waterControl * 0.006})`);
        gradient.addColorStop(1, `rgba(${r},${g},${b},0)`);
        this.context.fillStyle = gradient;
        this.context.beginPath();
        this.context.arc(mark.x + driftX, mark.y + driftY, feather, 0, TAU);
        this.context.fill();
        changed = true;
      });
    }
    this.wetMarks = this.wetMarks.filter((mark) => mark.age < mark.life);
    this.dryProgress = this.wetMarks.length === 0 ? 1 : 1 - this.wetMarks.reduce((sum, mark) => sum + clamp(1 - mark.age / mark.life), 0) / this.wetMarks.length;
    if (changed) this.dirty = true;
    return changed;
  }

  clear({ welcome = false } = {}) {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.wetMarks.length = 0;
    this.strokeCount = 0;
    this.sampleCount = 0;
    this.active = false;
    this.lastPoint = null;
    this.lastSpeed = 0;
    this.lastPressure = 0;
    this.lastWidth = null;
    this.dryProgress = 1;
    this.dirty = true;
    if (welcome) this.drawWelcomeMark();
  }

  drawWelcomeMark() {
    const priorMode = this.mode;
    const priorPressure = this.pressureControl;
    const priorWater = this.waterControl;
    this.mode = "dense";
    this.pressureControl = 0.62;
    this.waterControl = 0.52;
    this.suppressSplatter = true;
    const cubic = (start, controlA, controlB, end, steps = 34) => Array.from({ length: steps + 1 }, (_, index) => {
      const t = index / steps;
      const inverse = 1 - t;
      return [
        inverse ** 3 * start[0] + 3 * inverse ** 2 * t * controlA[0] + 3 * inverse * t ** 2 * controlB[0] + t ** 3 * end[0],
        inverse ** 3 * start[1] + 3 * inverse ** 2 * t * controlA[1] + 3 * inverse * t ** 2 * controlB[1] + t ** 3 * end[1],
      ];
    });
    const paths = [
      { points: cubic([0.24, 0.38], [0.34, 0.26], [0.59, 0.27], [0.75, 0.39]), pressure: (t) => 0.34 + Math.sin(t * Math.PI) * 0.58 },
      { points: cubic([0.55, 0.23], [0.53, 0.38], [0.50, 0.63], [0.45, 0.76]), pressure: (t) => 0.48 + Math.sin(Math.min(1, t * 1.15) * Math.PI) * 0.46 },
      { points: cubic([0.30, 0.58], [0.43, 0.47], [0.65, 0.52], [0.78, 0.68]), pressure: (t) => 0.28 + Math.sin(t * Math.PI) * 0.62 },
    ];
    paths.forEach(({ points, pressure }, pathIndex) => {
      this.begin({ x: points[0][0], y: points[0][1] }, { pressure: pressure(0), pointerType: "pen", now: pathIndex * 5000 });
      points.slice(1).forEach((point, index) => {
        const t = (index + 1) / (points.length - 1);
        this.move({ x: point[0], y: point[1] }, { pressure: pressure(t), pointerType: "pen", now: pathIndex * 5000 + (index + 1) * 34 });
      });
      this.end();
    });
    this.strokeCount = 0;
    this.suppressSplatter = false;
    this.mode = priorMode;
    this.pressureControl = priorPressure;
    this.waterControl = priorWater;
    this.dirty = true;
  }

  snapshot() {
    return {
      mode: this.mode,
      strokeCount: this.strokeCount,
      sampleCount: this.sampleCount,
      wetCount: this.wetMarks.length,
      dryProgress: this.dryProgress,
      speed: this.lastSpeed,
      pressure: this.lastPressure,
      active: this.active,
    };
  }
}
