import "./curtain.css";
import { CurtainScene, FallbackCurtainScene } from "./curtain/scene.js";
import { CurtainSoundscape } from "./curtain/audio.js";

const params = new URLSearchParams(location.search);
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches || params.get("motion") === "reduce";
const forceFallback = params.get("fallback") === "1";
document.body.dataset.motion = reducedMotion ? "reduce" : "full";

const elements = {
  stage: document.querySelector("#curtain-stage"),
  loading: document.querySelector("#curtain-loading"),
  loadingLabel: document.querySelector("#loading-label"),
  loadingBar: document.querySelector("#curtain-loading span i"),
  error: document.querySelector("#curtain-error"),
  errorMessage: document.querySelector("#curtain-error-message"),
  presets: [...document.querySelectorAll("[data-preset]")],
  audio: document.querySelector("#audio-toggle"),
  wind: document.querySelector("#wind-control"),
  windValue: document.querySelector("#wind-value"),
  open: document.querySelector("#open-control"),
  openValue: document.querySelector("#open-value"),
  transmission: document.querySelector("#transmission-control"),
  transmissionValue: document.querySelector("#transmission-value"),
  sun: document.querySelector("#sun-control"),
  sunValue: document.querySelector("#sun-value"),
  structure: document.querySelector("#structure-toggle"),
  reset: document.querySelector("#reset-trigger"),
  status: document.querySelector("#curtain-status"),
  sunTime: document.querySelector("#sun-time"),
  sunOrbit: document.querySelector("#sun-orbit"),
  windMetric: document.querySelector("#wind-metric"),
  openMetric: document.querySelector("#open-metric"),
  shadowMetric: document.querySelector("#shadow-metric"),
  fieldMetric: document.querySelector("#field-metric"),
  vertices: document.querySelector("#vertex-count"),
  springs: document.querySelector("#spring-count"),
  diagnosticNodes: document.querySelector("#diagnostic-nodes"),
  diagnosticSprings: document.querySelector("#diagnostic-springs"),
  diagnostic: document.querySelector("#diagnostic-sample"),
  diagnosticOutput: document.querySelector("#diagnostic-output"),
};

let scene;
let sceneReady = false;
let frameInFlight = false;
let frameHandle = 0;
let activeGesture = null;
let currentPreset = "noon";

function writeText(element, value) {
  const next = String(value);
  if (element.textContent !== next) element.textContent = next;
}

function formatTime(normalized) {
  const hours = 6.5 + Number(normalized) * 12;
  const hour = Math.floor(hours);
  const minute = Math.round((hours - hour) * 60 / 5) * 5;
  const safeHour = minute === 60 ? hour + 1 : hour;
  return `${String(safeHour).padStart(2, "0")}:${String(minute === 60 ? 0 : minute).padStart(2, "0")}`;
}

function isInteractive(target) { return target instanceof Element && Boolean(target.closest("button, input, a, summary, details")); }

function finishLoading() {
  setTimeout(() => { elements.loading.hidden = true; }, reducedMotion ? 0 : 520);
}

function setPhase(phase) {
  if (!phase) return;
  document.body.dataset.phase = phase;
  const copy = {
    still: "风、帘、影与声音已经回到低幅呼吸。靠近帘面可再次扰动它。",
    near: "距离先形成局部气流：不必点击，帘布已经绕开你的靠近。",
    wake: "拖动方向进入布料约束；褶皱、树影和左右声像正在共同迁移。",
    settle: "输入已经离开，惯性沿帘布衰减，树影慢慢重新汇拢。",
  };
  writeText(elements.status, copy[phase] ?? copy.still);
}

const soundscape = new CurtainSoundscape((state) => {
  document.body.dataset.audio = state;
  const playing = state === "playing";
  elements.audio.setAttribute("aria-pressed", String(playing));
  const strong = elements.audio.querySelector("strong");
  const icon = elements.audio.querySelector(".control-icon");
  writeText(strong, state === "unsupported" ? "声音不可用" : playing ? "声场已开启" : state === "muted" ? "声场已静音" : "开启声场");
  writeText(icon, playing ? "◉" : "◌");
});

function updateMetrics(metrics) {
  const time = formatTime(metrics.sun);
  writeText(elements.sunTime, time);
  writeText(elements.sunValue, time);
  writeText(elements.windMetric, Math.round(metrics.windKph));
  writeText(elements.openMetric, Math.round(metrics.openness * 100));
  writeText(elements.shadowMetric, Math.round(metrics.shadowDensity * 100));
  writeText(elements.fieldMetric, Math.round(metrics.pointerStrength * 100));
  elements.sunOrbit.style.left = `${8 + metrics.sun * 84}%`;
  document.body.dataset.phase = metrics.phase;
  document.body.dataset.wind = metrics.wind.toFixed(3);
  document.body.dataset.open = metrics.openness.toFixed(3);
  document.body.dataset.transmission = metrics.transmission.toFixed(3);
  document.body.dataset.sun = metrics.sun.toFixed(3);
  document.body.dataset.pointerStrength = metrics.pointerStrength.toFixed(3);
  document.body.dataset.canopyMotion = Number(metrics.canopyMotion ?? 0).toFixed(4);
  document.body.dataset.frameMs = metrics.frameMilliseconds.toFixed(2);
  soundscape.setState({ wind: metrics.wind, openness: metrics.openness, sun: metrics.sun, pan: metrics.pan });
}

function applyControls({ clearPreset = true } = {}) {
  const wind = Number(elements.wind.value);
  const openness = Number(elements.open.value);
  const transmission = Number(elements.transmission.value);
  const sun = Number(elements.sun.value);
  scene?.setWind(wind);
  scene?.setOpen(openness);
  scene?.setTransmission(transmission);
  scene?.setSun(sun);
  writeText(elements.windValue, `${Math.round(wind * 100)}%`);
  writeText(elements.openValue, `${Math.round(openness * 100)}%`);
  writeText(elements.transmissionValue, `${Math.round(transmission * 100)}%`);
  writeText(elements.sunValue, formatTime(sun));
  if (clearPreset) {
    currentPreset = "custom";
    document.body.dataset.preset = currentPreset;
    elements.presets.forEach((button) => button.setAttribute("aria-pressed", "false"));
  }
}

function selectPreset(name, announce = true) {
  const preset = scene?.setPreset(name);
  if (!preset) return;
  currentPreset = name;
  document.body.dataset.preset = name;
  elements.presets.forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.preset === name)));
  elements.wind.value = preset.wind;
  elements.open.value = preset.openness;
  elements.transmission.value = preset.transmission;
  elements.sun.value = preset.sun;
  applyControls({ clearPreset: false });
  if (announce) writeText(elements.status, name === "dawn" ? "晨雾：帘布微合，低风与偏暖侧光让影子更长。" : name === "dusk" ? "薄暮：日光降低，叶影变软，室内共鸣占比增加。" : "午后：帘布打开，树影和风声拥有最清楚的层次。 ");
}

async function activateFallback(reason) {
  scene?.destroy?.();
  document.querySelectorAll("#curtain-stage > canvas").forEach((canvas) => canvas.remove());
  scene = new FallbackCurtainScene(elements.stage, { reducedMotion, onMetrics: updateMetrics, onPhase: setPhase });
  await scene.init();
  elements.error.hidden = false;
  writeText(elements.errorMessage, reason ? `原因：${reason}。环境控制与声场仍可使用。` : "GPU 帘布未运行，但光影和环境控制仍可使用。 ");
  elements.structure.disabled = true;
  document.body.dataset.runtime = "fallback";
  sceneReady = true;
  applyControls({ clearPreset: false });
  finishLoading();
}

async function init() {
  try {
    if (forceFallback || !("gpu" in navigator)) {
      await activateFallback(forceFallback ? "URL 强制降级验证" : "浏览器没有暴露 WebGPU");
      return;
    }
    scene = new CurtainScene(elements.stage, { reducedMotion, onMetrics: updateMetrics, onPhase: setPhase });
    await scene.init((progress, label) => {
      writeText(elements.loadingLabel, label);
      elements.loadingBar.style.width = `${Math.round(progress * 100)}%`;
    });
    const stats = scene.getStats();
    writeText(elements.vertices, stats.labels.vertices);
    writeText(elements.springs, stats.labels.springs);
    writeText(elements.diagnosticNodes, stats.labels.vertices);
    writeText(elements.diagnosticSprings, stats.labels.springs);
    document.body.dataset.vertexCount = String(stats.vertices);
    document.body.dataset.springCount = String(stats.springs);
    document.body.dataset.solverRate = String(stats.solverRate);
    document.body.dataset.runtime = "ready";
    sceneReady = true;
    selectPreset(params.get("preset") || "noon", false);
    scene.lastInteraction = -99;
    setPhase("still");
    finishLoading();
  } catch (error) {
    console.warn("Veil of Light WebGPU enhancement unavailable", error);
    await activateFallback(error instanceof Error ? error.message : String(error));
  }
}

function animate(now) {
  frameHandle = requestAnimationFrame(animate);
  if (!sceneReady || frameInFlight) return;
  frameInFlight = true;
  scene.update(now / 1000).catch((error) => {
    console.error(error);
    writeText(elements.status, `运行中断：${error.message}`);
  }).finally(() => { frameInFlight = false; });
}

elements.presets.forEach((button) => button.addEventListener("click", () => selectPreset(button.dataset.preset)));
[elements.wind, elements.open, elements.transmission, elements.sun].forEach((input) => input.addEventListener("input", () => applyControls()));
elements.audio.addEventListener("click", () => soundscape.toggle());
elements.structure.addEventListener("click", () => {
  if (!sceneReady) return;
  const visible = scene.toggleStructure();
  elements.structure.setAttribute("aria-pressed", String(visible));
  document.body.dataset.structure = visible ? "on" : "off";
  writeText(elements.status, visible ? "结构透视：可见线是参与求解的 Aurelia 约束，不是装饰网格。" : "结构层已收起，回到布料、光与影的自然结果。 ");
});
elements.reset.addEventListener("click", () => { scene?.reset(); selectPreset("noon", false); setPhase("still"); });
elements.diagnostic.addEventListener("click", async () => {
  if (!sceneReady) return;
  elements.diagnostic.disabled = true;
  writeText(elements.diagnosticOutput, "采样中…");
  try {
    const sample = await scene.sampleDiagnostics();
    writeText(elements.diagnosticOutput, sample.fallback ? "2D fallback · controls active" : `${sample.finite ? "FINITE" : "INVALID"} · ${sample.count} nodes · max Δ ${sample.maxDisplacement.toFixed(3)} · ${sample.frameMilliseconds.toFixed(1)}ms`);
    document.body.dataset.diagnosticFinite = String(sample.finite);
  } catch (error) {
    writeText(elements.diagnosticOutput, `采样失败：${error.message}`);
  } finally {
    elements.diagnostic.disabled = false;
  }
});

elements.stage.addEventListener("pointerdown", (event) => {
  if (!sceneReady || isInteractive(event.target) || event.button > 0 || activeGesture) return;
  activeGesture = { id: event.pointerId, x: event.clientX, y: event.clientY, startX: event.clientX, startY: event.clientY, dragging: false };
  elements.stage.setPointerCapture?.(event.pointerId);
  scene.pointerMove(event.clientX, event.clientY);
  event.preventDefault();
});

elements.stage.addEventListener("pointermove", (event) => {
  if (!sceneReady || isInteractive(event.target)) return;
  if (activeGesture?.id === event.pointerId) {
    const dx = event.clientX - activeGesture.x;
    const dy = event.clientY - activeGesture.y;
    activeGesture.dragging ||= Math.hypot(event.clientX - activeGesture.startX, event.clientY - activeGesture.startY) > 6;
    activeGesture.x = event.clientX;
    activeGesture.y = event.clientY;
    scene.pointerMove(event.clientX, event.clientY, { dragging: activeGesture.dragging, dx, dy });
    event.preventDefault();
  } else {
    scene.pointerMove(event.clientX, event.clientY);
  }
});

function finishGesture(event) {
  if (!activeGesture || event.pointerId !== activeGesture.id) return;
  if (elements.stage.hasPointerCapture?.(event.pointerId)) elements.stage.releasePointerCapture(event.pointerId);
  activeGesture = null;
  scene.endDrag();
}
elements.stage.addEventListener("pointerup", finishGesture);
elements.stage.addEventListener("pointercancel", finishGesture);
elements.stage.addEventListener("pointerleave", () => { if (!activeGesture) scene?.pointerLeave(); });
elements.stage.addEventListener("lostpointercapture", () => { if (activeGesture) { activeGesture = null; scene?.endDrag(); } });

window.addEventListener("keydown", (event) => {
  if (event.target instanceof HTMLInputElement) return;
  if (event.key === "a" || event.key === "A") { event.preventDefault(); elements.audio.click(); }
  if (event.key === "s" || event.key === "S") { event.preventDefault(); elements.structure.click(); }
  if (event.key === "r" || event.key === "R" || event.key === "0") { event.preventDefault(); elements.reset.click(); }
  if (["1", "2", "3"].includes(event.key)) { event.preventDefault(); selectPreset(["dawn", "noon", "dusk"][Number(event.key) - 1]); }
});

document.addEventListener("visibilitychange", () => soundscape.handleVisibility(document.hidden));
window.addEventListener("resize", () => scene?.resize(), { passive: true });
window.addEventListener("beforeunload", () => { cancelAnimationFrame(frameHandle); soundscape.destroy(); scene?.destroy(); });

globalThis.__CURTAIN_DEBUG__ = {
  get scene() { return scene; },
  get state() { return { runtime: document.body.dataset.runtime, preset: currentPreset, audio: document.body.dataset.audio }; },
};

applyControls({ clearPreset: false });
init();
frameHandle = requestAnimationFrame(animate);
