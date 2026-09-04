import { ProceduralAudioEngine } from "./morph/audio-engine.js";
import { ArenaScene, CANDIDATE_COPY } from "./arena/scene.js";

import "./arena.css";

const elements = {
  stage: document.querySelector("#arena-stage"),
  runtime: document.querySelector("#runtime-label"),
  fps: document.querySelector("#fps-label"),
  caption: document.querySelector("#candidate-caption"),
  mapping: document.querySelector("#mapping-copy"),
  score: document.querySelector("#candidate-score"),
  rank: document.querySelector("#rank-label"),
  maturity: document.querySelector("#maturity-label"),
  status: document.querySelector("#arena-status"),
  audio: document.querySelector("#audio-toggle"),
  mute: document.querySelector("#mute-toggle"),
  pulse: document.querySelector("#pulse-trigger"),
  structure: document.querySelector("#structure-toggle"),
  reset: document.querySelector("#view-reset"),
  loading: document.querySelector("#arena-loading"),
  error: document.querySelector("#arena-error"),
  errorMessage: document.querySelector("#arena-error-message"),
};

const params = new URLSearchParams(location.search);
const reducedMotion = params.get("motion") === "reduce" || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const forcedFallback = params.get("fallback") === "1";
document.body.dataset.motion = reducedMotion ? "reduced" : "full";

let scene;
let activeCandidate = "manta";
let structureVisible = false;
let frameHandle;
let frameCount = 0;
let sampleStart = performance.now();
let pointerDown = false;

function setCandidateUi(candidate) {
  const copy = CANDIDATE_COPY[candidate];
  activeCandidate = candidate;
  document.body.dataset.candidate = candidate;
  elements.caption.textContent = copy.caption;
  elements.mapping.textContent = copy.mapping;
  elements.score.textContent = copy.total.toFixed(1);
  elements.rank.textContent = `CHALLENGER ${copy.rank}`;
  elements.maturity.textContent = copy.maturity;
  document.querySelectorAll("button[data-candidate]").forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.candidate === candidate));
  });
  Object.entries(copy.scores).forEach(([key, value]) => {
    document.querySelector(`[data-score="${key}"]`)?.style.setProperty("--score", (value / 10).toFixed(2));
    const output = document.querySelector(`[data-output="${key}"]`);
    if (output) output.textContent = value.toFixed(1);
  });
  elements.status.textContent = copy.instruction;
}

function updateAudioState({ state, detail, muted, playing }) {
  document.body.dataset.audio = state;
  elements.audio.setAttribute("aria-pressed", String(playing));
  elements.audio.querySelector(":scope > span:first-child").textContent = playing ? "Ⅱ" : "▶";
  elements.audio.querySelector("strong").textContent = playing ? "暂停声场" : state === "locked" ? "启动声场" : "继续声场";
  elements.audio.querySelector("small").textContent = playing ? `${audio.tempo} BPM · 频谱映射中` : "原创程序化音频";
  elements.mute.setAttribute("aria-pressed", String(muted));
  elements.mute.querySelector(":scope > span:first-child").textContent = muted ? "○" : "◖";
  elements.mute.querySelector("small").textContent = muted ? "已静音" : "有声";
  if (state !== "locked" && detail) elements.status.textContent = detail;
}

const audio = new ProceduralAudioEngine(updateAudioState);
updateAudioState({ state: "locked", detail: "", muted: false, playing: false });

function chooseCandidate(candidate) {
  if (!CANDIDATE_COPY[candidate]) return;
  setCandidateUi(candidate);
  scene?.setCandidate(candidate);
}

function setStructure(value) {
  structureVisible = value;
  document.body.dataset.structure = value ? "on" : "off";
  elements.structure.setAttribute("aria-pressed", String(value));
  elements.structure.querySelector("small").textContent = value ? "结构正在参与运动" : "显示真实构造";
  scene?.setStructure(value);
}

function triggerPulse(intensity = 1) {
  scene?.triggerPulse(intensity);
  document.body.dataset.event = "pulse";
  elements.status.textContent = CANDIDATE_COPY[activeCandidate].pulse;
  window.setTimeout(() => { document.body.dataset.event = "idle"; }, 420);
}

function pointerToScene(event, strength = 0) {
  const rect = elements.stage.getBoundingClientRect();
  const x = (event.clientX - rect.left) / rect.width * 2 - 1;
  const y = -((event.clientY - rect.top) / rect.height * 2 - 1);
  scene?.setPointer(x, y, strength);
  document.body.dataset.pointer = `${x.toFixed(2)},${y.toFixed(2)}`;
}

function isForegroundControl(event) {
  return event.target instanceof Element && Boolean(event.target.closest("button, a, input, select, summary"));
}

function installControls() {
  document.querySelectorAll("button[data-candidate]").forEach((button) => {
    button.addEventListener("click", () => chooseCandidate(button.dataset.candidate));
  });
  elements.audio.addEventListener("click", async () => {
    await audio.toggle();
    if (!audio.supported) elements.audio.disabled = true;
  });
  elements.mute.addEventListener("click", () => audio.setMuted(!audio.muted));
  elements.pulse.addEventListener("click", () => triggerPulse(1));
  elements.structure.addEventListener("click", () => setStructure(!structureVisible));
  elements.reset.addEventListener("click", () => {
    scene?.reset();
    setStructure(false);
    elements.status.textContent = CANDIDATE_COPY[activeCandidate].instruction;
  });
  elements.stage.addEventListener("pointerdown", (event) => {
    if (isForegroundControl(event)) return;
    pointerDown = true;
    elements.stage.setPointerCapture?.(event.pointerId);
    pointerToScene(event, .35);
  });
  elements.stage.addEventListener("pointermove", (event) => {
    if (!pointerDown && isForegroundControl(event)) return;
    pointerToScene(event, pointerDown ? .9 : .18);
  }, { passive: true });
  elements.stage.addEventListener("pointerup", (event) => {
    if (!pointerDown) return;
    pointerDown = false;
    elements.stage.releasePointerCapture?.(event.pointerId);
    pointerToScene(event, .1);
  });
  elements.stage.addEventListener("pointercancel", () => { pointerDown = false; });
  window.addEventListener("keydown", (event) => {
    if (event.key === "1" || event.key === "2" || event.key === "3") chooseCandidate(["manta", "seed", "ferro"][Number(event.key) - 1]);
    if (event.key === "Enter" || event.key === " ") {
      if (event.target instanceof HTMLButtonElement || event.target instanceof HTMLAnchorElement) return;
      event.preventDefault();
      triggerPulse(1);
    }
    if (event.key.toLowerCase() === "s") setStructure(!structureVisible);
    if (event.key === "0") scene?.reset();
  });
}

function showFallback(message) {
  document.body.dataset.runtime = "fallback";
  elements.runtime.textContent = "2D 候选模式";
  elements.loading.hidden = true;
  elements.error.hidden = false;
  elements.errorMessage.textContent = message;
  elements.fps.textContent = "CSS MOTION";
}

function updateMetrics(now) {
  frameCount += 1;
  const elapsed = now - sampleStart;
  if (elapsed < 900) return;
  const fps = Math.round(frameCount * 1000 / elapsed);
  elements.fps.textContent = `${fps} FPS`;
  document.body.dataset.fps = String(fps);
  const metrics = scene?.getMetrics();
  if (metrics) {
    document.body.dataset.objects = String(metrics.objects);
    document.body.dataset.triangles = String(metrics.triangles);
    document.body.dataset.energy = metrics.energy.toFixed(3);
  }
  frameCount = 0;
  sampleStart = now;
}

function startLoop() {
  const started = performance.now();
  const animate = async (now) => {
    const time = (now - started) / 1000;
    const bands = audio.getBands();
    if (scene) await scene.update(time, bands, audio.playing);
    updateMetrics(now);
    frameHandle = requestAnimationFrame(animate);
  };
  frameHandle = requestAnimationFrame(animate);
}

async function bootstrap() {
  installControls();
  setCandidateUi("manta");
  setStructure(false);
  if (forcedFallback || !navigator.gpu) {
    showFallback(forcedFallback ? "这是主动触发的能力降级路径。" : "当前浏览器没有暴露 WebGPU。请使用最新版 Chrome / Edge 与 localhost 或 HTTPS。");
    return;
  }
  scene = new ArenaScene(elements.stage, { reducedMotion });
  await scene.init();
  window.addEventListener("resize", () => scene?.resize(), { passive: true });
  document.body.dataset.runtime = "ready";
  elements.runtime.textContent = "WebGPU 竞技场运行中";
  elements.loading.classList.add("is-complete");
  window.setTimeout(() => { elements.loading.hidden = true; }, 620);
  frameCount = 0;
  sampleStart = performance.now();
  startLoop();
}

window.addEventListener("pagehide", () => {
  if (frameHandle) cancelAnimationFrame(frameHandle);
  scene?.dispose();
  audio.destroy();
}, { once: true });

bootstrap().catch((error) => {
  console.error(error);
  showFallback(error instanceof Error ? error.message : String(error));
});
