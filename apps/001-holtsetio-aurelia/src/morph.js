import { ProceduralAudioEngine } from "./morph/audio-engine.js";
import { MorphScene } from "./morph/scene.js";

import "./styles.css";
import "./morph.css";

const elements = {
  stage: document.querySelector("#morph-stage"),
  runtime: document.querySelector("#runtime-label"),
  fps: document.querySelector("#render-fps"),
  caption: document.querySelector("#form-caption"),
  mapping: document.querySelector("#form-mapping"),
  audioStatus: document.querySelector("#audio-status"),
  audioToggle: document.querySelector("#audio-toggle"),
  muteToggle: document.querySelector("#mute-toggle"),
  volume: document.querySelector("#volume"),
  volumeValue: document.querySelector("#volume-value"),
  tempo: document.querySelector("#tempo"),
  reset: document.querySelector("#view-reset"),
  loading: document.querySelector("#morph-loading"),
  error: document.querySelector("#morph-error"),
  errorMessage: document.querySelector("#morph-error-message"),
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
  elements.audioToggle.querySelector(".transport-icon").textContent = playing ? "Ⅱ" : "▶";
  elements.audioToggle.querySelector("strong").textContent = playing ? "暂停音乐" : state === "locked" ? "启动原创声场" : "继续音乐";
  elements.audioToggle.querySelector("small").textContent = playing ? `${audio.tempo} BPM · 程序化生成中` : "视觉保持自主呼吸";
  elements.muteToggle.setAttribute("aria-pressed", String(muted));
  elements.muteToggle.querySelector(".transport-icon").textContent = muted ? "○" : "◖";
  elements.muteToggle.querySelector("small").textContent = muted ? "静音" : "有声";
}

const audio = new ProceduralAudioEngine(updateAudioState);
updateAudioState({ state: "locked", detail: "音乐尚未启动；场景正以自主呼吸运行。", muted: false, playing: false });

function updateFormUi({ form, title, caption, mapping }) {
  document.body.dataset.form = form;
  elements.caption.textContent = caption;
  elements.mapping.textContent = mapping;
  document.querySelectorAll("[data-form]").forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.form === form));
  });
  elements.runtime.textContent = `${title}运行中`;
}

function installControls() {
  document.querySelectorAll("[data-form]").forEach((button) => {
    button.addEventListener("click", () => scene?.setForm(button.dataset.form));
  });
  elements.audioToggle.addEventListener("click", async () => {
    const started = await audio.toggle();
    if (!audio.supported) {
      elements.audioToggle.disabled = true;
      elements.muteToggle.disabled = true;
      elements.volume.disabled = true;
      elements.tempo.disabled = true;
      elements.audioStatus.textContent = "当前浏览器不支持 Web Audio；场景继续使用自主动画。";
    } else if (started) {
      document.body.classList.add("has-audio-energy");
    }
  });
  elements.muteToggle.addEventListener("click", () => audio.setMuted(!audio.muted));
  elements.volume.addEventListener("input", () => {
    const value = Number(elements.volume.value);
    audio.setVolume(value);
    elements.volumeValue.textContent = `${Math.round(value * 100)}%`;
  });
  elements.tempo.addEventListener("change", () => audio.setTempo(elements.tempo.value));
  elements.reset.addEventListener("click", () => scene?.resetView());
  elements.stage.addEventListener("pointermove", (event) => scene?.setPointer(event.clientX, event.clientY), { passive: true });
}

function showVisualError(message) {
  document.body.dataset.runtime = "unsupported";
  elements.runtime.textContent = "WebGPU 不可用";
  elements.loading.hidden = true;
  elements.error.hidden = false;
  elements.errorMessage.textContent = message;
  document.querySelectorAll("[data-form], #view-reset").forEach((control) => { control.disabled = true; });
}

function updateBandUi(bands) {
  Object.entries(elements.bands).forEach(([name, element]) => {
    const value = Math.min(Math.max(bands[name], 0), 1);
    element.root.style.setProperty("--band", value.toFixed(3));
    element.output.textContent = value.toFixed(2);
  });
}

function updateFps(now) {
  frames += 1;
  const elapsed = now - sampleStarted;
  if (elapsed < 900) return;
  elements.fps.textContent = `${Math.round(frames * 1000 / elapsed)} FPS`;
  frames = 0;
  sampleStarted = now;
}

function startLoop() {
  const startedAt = performance.now();
  const animate = async (now) => {
    const seconds = (now - startedAt) / 1000;
    const bands = audio.getBands();
    updateBandUi(bands);
    if (scene) {
      await scene.update(seconds, bands, audio.playing);
      updateFps(now);
    }
    frameHandle = requestAnimationFrame(animate);
  };
  frameHandle = requestAnimationFrame(animate);
}

async function bootstrap() {
  installControls();
  if (!navigator.gpu) {
    showVisualError("当前浏览器没有暴露 WebGPU。音乐控制仍可使用，但三维增强层需要最新版 Chrome/Edge 与 localhost 或 HTTPS。");
    startLoop();
    return;
  }

  scene = new MorphScene(elements.stage, {
    reducedMotion,
    onFormChange: updateFormUi,
    onTransitionChange: (active) => { document.body.dataset.transition = active ? "active" : "idle"; },
  });
  await scene.init();
  document.body.dataset.quality = scene.getStats().quality < 1 ? "reduced" : "full";
  window.addEventListener("resize", () => scene.resize(), { passive: true });
  document.body.dataset.runtime = "ready";
  elements.loading.classList.add("is-complete");
  window.setTimeout(() => { elements.loading.hidden = true; }, 600);
  frames = 0;
  sampleStarted = performance.now();
  startLoop();
}

window.addEventListener("pagehide", () => {
  if (frameHandle) cancelAnimationFrame(frameHandle);
  scene?.dispose();
  audio.destroy();
}, { once: true });

bootstrap().catch((error) => {
  console.error(error);
  showVisualError(error instanceof Error ? error.message : String(error));
});
