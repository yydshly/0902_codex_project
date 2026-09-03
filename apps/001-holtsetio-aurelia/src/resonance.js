import { ProceduralAudioEngine } from "./morph/audio-engine.js";
import { ResonantMatterScene } from "./resonance/scene.js";
import "./resonance.css";

const elements = {
  stage: document.querySelector("#resonance-stage"),
  audioToggle: document.querySelector("#audio-toggle"),
  muteToggle: document.querySelector("#mute-toggle"),
  impact: document.querySelector("#impact-trigger"),
  tension: document.querySelector("#tension"),
  tensionValue: document.querySelector("#tension-value"),
  reset: document.querySelector("#view-reset"),
  audioStatus: document.querySelector("#audio-status"),
  forceNote: document.querySelector("#force-note"),
  loading: document.querySelector("#resonance-loading"),
  loadingLabel: document.querySelector("#loading-label"),
  error: document.querySelector("#resonance-error"),
  errorMessage: document.querySelector("#resonance-error-message"),
  fps: document.querySelector("#render-fps"),
  vertices: document.querySelector("#vertex-count"),
  springs: document.querySelector("#spring-count"),
  solver: document.querySelector("#solver-rate"),
  bands: {
    low: { root: document.querySelector('[data-band="low"]'), output: document.querySelector("#low-value") },
    mid: { root: document.querySelector('[data-band="mid"]'), output: document.querySelector("#mid-value") },
    high: { root: document.querySelector('[data-band="high"]'), output: document.querySelector("#high-value") },
  },
};

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
document.body.dataset.motion = reducedMotion ? "reduced" : "full";
let scene;
let frameHandle;
let frames = 0;
let sampleStarted = performance.now();

function updateAudioState({ state, detail, muted, playing }) {
  document.body.dataset.audio = state;
  elements.audioStatus.textContent = detail;
  elements.audioToggle.setAttribute("aria-pressed", String(playing));
  elements.audioToggle.querySelector(".control-symbol").textContent = playing ? "Ⅱ" : "▶";
  elements.audioToggle.querySelector("strong").textContent = playing ? "暂停声场" : state === "locked" ? "启动声场" : "继续声场";
  elements.audioToggle.querySelector("small").textContent = playing ? `${audio.tempo} BPM · 锚点实时受力` : "解锁原创程序化音乐";
  elements.muteToggle.setAttribute("aria-pressed", String(muted));
  elements.muteToggle.querySelector(".control-symbol").textContent = muted ? "○" : "◖";
  elements.muteToggle.querySelector("small").textContent = muted ? "静音" : "有声";
  elements.forceNote.textContent = playing
    ? "实时状态：频谱首先改变锚点，形变再通过约束传向膜面中部。"
    : "自主状态：结构保持微弱呼吸，等待声音输入。";
}

const audio = new ProceduralAudioEngine(updateAudioState);
updateAudioState({
  state: "locked",
  detail: "音乐尚未启动；可以先施加一次结构冲击。",
  muted: false,
  playing: false,
});

function updateBands(bands) {
  Object.entries(elements.bands).forEach(([name, item]) => {
    const value = Math.min(Math.max(bands[name], 0), 1);
    item.root.style.setProperty("--band", value.toFixed(3));
    item.output.textContent = value.toFixed(2);
  });
}

function updateFps(now) {
  frames += 1;
  const elapsed = now - sampleStarted;
  if (elapsed < 900) return;
  elements.fps.textContent = String(Math.round(frames * 1000 / elapsed));
  frames = 0;
  sampleStarted = now;
}

function showVisualError(error) {
  document.body.dataset.runtime = "unsupported";
  elements.loading.hidden = true;
  elements.error.hidden = false;
  elements.errorMessage.textContent = error;
  [elements.impact, elements.tension, elements.reset].forEach((control) => { control.disabled = true; });
}

function installControls() {
  elements.audioToggle.addEventListener("click", async () => {
    const started = await audio.toggle();
    if (!audio.supported) {
      elements.audioToggle.disabled = true;
      elements.muteToggle.disabled = true;
      elements.audioStatus.textContent = "当前浏览器不支持 Web Audio；作品仍保留自主结构运动。";
    } else if (started) {
      scene?.pulse(0.72);
    }
  });
  elements.muteToggle.addEventListener("click", () => audio.setMuted(!audio.muted));
  elements.impact.addEventListener("click", () => scene?.pulse(1));
  elements.tension.addEventListener("input", () => {
    const value = Number(elements.tension.value);
    scene?.setTension(value);
    elements.tensionValue.textContent = `${Math.round(value * 100)}%`;
  });
  elements.reset.addEventListener("click", () => scene?.resetView());
  elements.stage.addEventListener("pointermove", (event) => scene?.setPointer(event.clientX, event.clientY), { passive: true });
}

function startLoop() {
  const startedAt = performance.now();
  const animate = async (now) => {
    const elapsed = (now - startedAt) / 1000;
    const bands = audio.getBands();
    updateBands(bands);
    if (scene) {
      await scene.update(elapsed, bands, audio.playing);
      updateFps(now);
    }
    frameHandle = requestAnimationFrame(animate);
  };
  frameHandle = requestAnimationFrame(animate);
}

async function bootstrap() {
  installControls();
  if (!navigator.gpu) {
    showVisualError("当前浏览器没有暴露 WebGPU。请使用最新版 Chrome/Edge，并通过 localhost 或 HTTPS 访问。");
    startLoop();
    return;
  }

  try {
    scene = new ResonantMatterScene(elements.stage, {
      reducedMotion,
      onImpactChange: (active) => { document.body.dataset.impact = active ? "active" : "idle"; },
    });
    await scene.init((progress, label) => {
      elements.loadingLabel.textContent = label;
      elements.loading.style.setProperty("--progress", progress.toFixed(2));
    });
    globalThis.__AURELIA_RESONANCE__ = scene;
    const stats = scene.getStats();
    elements.vertices.textContent = stats.labels.vertices;
    elements.springs.textContent = stats.labels.springs;
    elements.solver.textContent = String(stats.solverRate);
    document.body.dataset.quality = stats.quality < 1 ? "reduced" : "full";
    document.body.dataset.runtime = "ready";
    elements.loading.classList.add("is-complete");
    sampleStarted = performance.now();
    window.addEventListener("resize", () => scene?.resize(), { passive: true });
  } catch (error) {
    console.error(error);
    scene = undefined;
    showVisualError(`初始化失败：${error.message}`);
  }
  startLoop();
}

bootstrap();

window.addEventListener("beforeunload", () => {
  cancelAnimationFrame(frameHandle);
  audio.destroy();
  scene?.destroy();
});
