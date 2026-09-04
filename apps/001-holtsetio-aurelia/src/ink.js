import "./ink.css";
import { FallbackInkScene, LivingInkScene } from "./ink/scene.js";
import { INK_MODES } from "./ink/painter.js";

const params = new URLSearchParams(location.search);
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches || params.get("motion") === "reduce";
const forceFallback = params.get("fallback") === "1";
document.body.dataset.motion = reducedMotion ? "reduce" : "full";

const elements = {
  stage: document.querySelector("#ink-stage"),
  loading: document.querySelector("#ink-loading"),
  loadingLabel: document.querySelector("#loading-label"),
  loadingBar: document.querySelector("#ink-loading span i"),
  error: document.querySelector("#ink-error"),
  errorMessage: document.querySelector("#ink-error-message"),
  modes: [...document.querySelectorAll(".ink-modes [data-ink]")],
  demo: document.querySelector("#demo-trigger"),
  clear: document.querySelector("#clear-trigger"),
  structure: document.querySelector("#structure-toggle"),
  pressure: document.querySelector("#pressure-control"),
  pressureValue: document.querySelector("#pressure-value"),
  water: document.querySelector("#water-control"),
  waterValue: document.querySelector("#water-value"),
  absorption: document.querySelector("#absorption-control"),
  absorptionValue: document.querySelector("#absorption-value"),
  pressureMetric: document.querySelector("#pressure-metric"),
  speedMetric: document.querySelector("#speed-metric"),
  wetMetric: document.querySelector("#wet-metric"),
  strokeMetric: document.querySelector("#stroke-metric"),
  status: document.querySelector("#ink-status"),
  vertices: document.querySelector("#vertex-count"),
  springs: document.querySelector("#spring-count"),
  particles: document.querySelector("#particle-count"),
  diagnostic: document.querySelector("#diagnostic-sample"),
  diagnosticOutput: document.querySelector("#diagnostic-output"),
};

let scene;
let sceneReady = false;
let fallbackActive = false;
let activePointerId = null;
let frameHandle = 0;
let frameInFlight = false;
let currentMode = Object.hasOwn(INK_MODES, params.get("ink")) ? params.get("ink") : "dense";

function writeText(element, value) {
  const text = String(value);
  if (element.textContent !== text) element.textContent = text;
}

function finishLoading() {
  window.setTimeout(() => { elements.loading.hidden = true; }, reducedMotion ? 0 : 440);
}

function isInteractiveTarget(target) {
  return target instanceof Element && Boolean(target.closest("button, input, a, summary, details"));
}

function setPhase(phase) {
  if (document.body.dataset.phase === phase) return;
  document.body.dataset.phase = phase;
  document.querySelectorAll(".causal-strip li").forEach((item) => {
    if (item.dataset.phase === phase) item.setAttribute("aria-current", "step");
    else item.removeAttribute("aria-current");
  });
  const messages = {
    contact: "笔锋已经触纸：当前力度决定接触面积。",
    drag: "鬃毛正在分锋：速度越快，墨迹越容易出现飞白与飞墨。",
    diffuse: "水分沿纸纤维扩散；含水量与吸收率共同决定湿边寿命。",
    remember: "水分已经收敛，动作以墨色、边缘和停顿永久留在纸上。",
  };
  writeText(elements.status, messages[phase] ?? messages.remember);
}

function updateMetrics(metrics) {
  writeText(elements.pressureMetric, Math.round((metrics.pressure || Number(elements.pressure.value)) * 100));
  writeText(elements.speedMetric, ((metrics.speed || 0) * 1.8).toFixed(1));
  writeText(elements.wetMetric, metrics.wetCount);
  writeText(elements.strokeMetric, metrics.strokeCount);
  document.body.dataset.phase = metrics.phase;
  document.body.dataset.strokeCount = String(metrics.strokeCount);
  document.body.dataset.wetMarks = String(metrics.wetCount);
  document.body.dataset.brushPressure = Number(metrics.pressure || 0).toFixed(3);
  document.body.dataset.brushSpeed = Number(metrics.speed || 0).toFixed(3);
  document.body.dataset.frameMs = Number(metrics.frameMilliseconds || 0).toFixed(2);
  document.body.dataset.activeSplats = String(metrics.activeSplats || 0);
}

function setMode(mode, announce = true) {
  if (!INK_MODES[mode]) return;
  currentMode = mode;
  document.body.dataset.ink = mode;
  elements.modes.forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.ink === mode)));
  scene?.setMode(mode);
  if (announce) {
    const copy = mode === "dense"
      ? "浓墨：高覆盖、清晰锋面，适合观察压力带来的宽度变化。"
      : mode === "pale"
        ? "淡墨：含水更高、边缘更松，适合观察纤维扩散。"
        : "朱砂：颜色变了，但压力、速度和时间记忆仍使用同一机制。";
    writeText(elements.status, copy);
  }
}

function applyTools() {
  const pressure = Number(elements.pressure.value);
  const water = Number(elements.water.value);
  const absorption = Number(elements.absorption.value);
  writeText(elements.pressureValue, `${Math.round(pressure * 100)}%`);
  writeText(elements.waterValue, `${Math.round(water * 100)}%`);
  writeText(elements.absorptionValue, `${Math.round(absorption * 100)}%`);
  if (!document.body.dataset.drawing || document.body.dataset.drawing === "false") writeText(elements.pressureMetric, Math.round(pressure * 100));
  scene?.setPressure(pressure);
  scene?.setWater(water);
  scene?.setAbsorption(absorption);
  document.body.dataset.water = water.toFixed(2);
  document.body.dataset.absorption = absorption.toFixed(2);
}

function onPointerDown(event) {
  if (!sceneReady || activePointerId !== null || isInteractiveTarget(event.target) || event.button > 0) return;
  const accepted = scene.beginStroke(event.clientX, event.clientY, event.pressure, event.pointerType);
  if (!accepted) return;
  activePointerId = event.pointerId;
  document.body.dataset.drawing = "true";
  elements.stage.setPointerCapture?.(event.pointerId);
  setPhase("contact");
  event.preventDefault();
}

function onPointerMove(event) {
  if (!sceneReady || event.pointerId !== activePointerId) return;
  scene.moveStroke(event.clientX, event.clientY, event.pressure, event.pointerType);
  setPhase("drag");
  event.preventDefault();
}

function finishPointer(event) {
  if (event.pointerId !== activePointerId) return;
  scene.endStroke();
  elements.stage.releasePointerCapture?.(event.pointerId);
  activePointerId = null;
  document.body.dataset.drawing = "false";
  setPhase(scene.painter.wetMarks.length ? "diffuse" : "remember");
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

async function activateFallback(reason) {
  fallbackActive = true;
  document.querySelectorAll("#ink-stage > canvas:not(.fallback-ink-canvas)").forEach((canvas) => canvas.remove());
  scene?.destroy?.();
  scene = new FallbackInkScene(elements.stage, { reducedMotion, onMetrics: updateMetrics, onPhase: setPhase });
  await scene.init();
  setMode(currentMode, false);
  applyTools();
  elements.error.hidden = false;
  writeText(elements.errorMessage, reason ? `原因：${reason}` : "当前环境未启用 WebGPU。2D 墨层仍保留压力、速度、扩散和清纸。 ");
  elements.structure.disabled = true;
  elements.diagnostic.disabled = false;
  document.body.dataset.runtime = "fallback";
  sceneReady = true;
  finishLoading();
  const stats = scene.getStats();
  writeText(elements.vertices, stats.vertices);
  writeText(elements.springs, stats.springs);
  writeText(elements.particles, stats.particles);
  writeText(elements.status, "已进入 2D 宣纸模式：可以继续落笔，但 Aurelia GPU 笔锋节点没有运行。");
}

async function init() {
  try {
    if (forceFallback || !("gpu" in navigator)) {
      await activateFallback(forceFallback ? "URL 强制降级验证" : "浏览器没有暴露 WebGPU");
      return;
    }
    scene = new LivingInkScene(elements.stage, { reducedMotion, onMetrics: updateMetrics, onPhase: setPhase });
    await scene.init((progress, label) => {
      writeText(elements.loadingLabel, label);
      elements.loadingBar.style.width = `${Math.round(progress * 100)}%`;
    });
    setMode(currentMode, false);
    applyTools();
    const stats = scene.getStats();
    writeText(elements.vertices, stats.vertices);
    writeText(elements.springs, stats.springs);
    writeText(elements.particles, stats.particles);
    document.body.dataset.runtime = "ready";
    document.body.dataset.vertexCount = String(stats.vertices);
    document.body.dataset.springCount = String(stats.springs);
    document.body.dataset.splatPool = String(stats.particles);
    sceneReady = true;
    finishLoading();
    writeText(elements.status, "宣纸已经展开。按住纸面，让第一笔从压力变成形状。");
  } catch (error) {
    console.warn("Living Ink WebGPU enhancement unavailable", error);
    await activateFallback(error instanceof Error ? error.message : String(error));
  }
}

elements.modes.forEach((button) => button.addEventListener("click", () => setMode(button.dataset.ink)));
[elements.pressure, elements.water, elements.absorption].forEach((input) => input.addEventListener("input", applyTools));
elements.demo.addEventListener("click", () => {
  if (!sceneReady) return;
  scene.startDemo();
  setPhase("contact");
  writeText(elements.status, "示范笔势开始：力度在中段增加，速度变化会留下宽窄与飞白。你可以随时按住纸面接管。 ");
});
elements.clear.addEventListener("click", () => {
  if (!sceneReady) return;
  scene.clear();
  document.body.dataset.drawing = "false";
  setPhase("remember");
  writeText(elements.status, "纸面已清空；参数与墨法保留，可以重新书写。 ");
});
elements.structure.addEventListener("click", () => {
  if (!sceneReady || fallbackActive) return;
  const visible = scene.toggleStructure();
  elements.structure.setAttribute("aria-pressed", String(visible));
  document.body.dataset.structure = visible ? "on" : "off";
  writeText(elements.status, visible ? "结构透视已打开：朱砂节点与弹簧显示笔锋如何被固定锚牵引。" : "结构透视已关闭：只保留自然笔锋与纸面痕迹。");
});
elements.diagnostic.addEventListener("click", async () => {
  if (!sceneReady) return;
  elements.diagnostic.disabled = true;
  writeText(elements.diagnosticOutput, "采样中…");
  try {
    const sample = await scene.sampleDiagnostics();
    if (sample.fallback) writeText(elements.diagnosticOutput, `2D fallback · wet ${sample.wetCount}`);
    else writeText(elements.diagnosticOutput, `${sample.finite ? "FINITE" : "INVALID"} · ${sample.count} nodes · z ${sample.minZ.toFixed(3)}..${sample.maxZ.toFixed(3)} · ${sample.frameMilliseconds.toFixed(1)}ms`);
    document.body.dataset.diagnosticFinite = String(sample.finite ?? true);
  } catch (error) {
    writeText(elements.diagnosticOutput, `采样失败：${error.message}`);
  } finally {
    elements.diagnostic.disabled = false;
  }
});

elements.stage.addEventListener("pointerdown", onPointerDown);
elements.stage.addEventListener("pointermove", onPointerMove);
elements.stage.addEventListener("pointerup", finishPointer);
elements.stage.addEventListener("pointercancel", finishPointer);
elements.stage.addEventListener("lostpointercapture", (event) => {
  if (event.pointerId === activePointerId) finishPointer(event);
});
elements.stage.addEventListener("keydown", (event) => {
  if (isInteractiveTarget(event.target) || !sceneReady) return;
  if (event.key === "d" || event.key === "D" || event.key === "Enter" || event.key === " ") { event.preventDefault(); elements.demo.click(); }
  if (event.key === "c" || event.key === "C" || event.key === "0") { event.preventDefault(); elements.clear.click(); }
  if (event.key === "s" || event.key === "S") { event.preventDefault(); elements.structure.click(); }
  if (["1", "2", "3"].includes(event.key)) { event.preventDefault(); setMode(["dense", "pale", "cinnabar"][Number(event.key) - 1]); }
});

addEventListener("resize", () => scene?.resize());
addEventListener("beforeunload", () => {
  cancelAnimationFrame(frameHandle);
  scene?.destroy();
});

globalThis.__INK_DEBUG__ = {
  get scene() { return scene; },
  get painter() { return scene?.painter; },
  get fallback() { return fallbackActive; },
};

applyTools();
setMode(currentMode, false);
requestAnimationFrame(animate);
init();
