import "./clothesline.css";
import { WindlineScene } from "./clothesline/scene.js";

const params = new URLSearchParams(location.search);
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches || params.get("motion") === "reduce";
const forceFallback = params.get("fallback") === "1";
document.body.dataset.motion = reducedMotion ? "reduce" : "full";

const elements = {
  stage: document.querySelector("#wind-stage"),
  loading: document.querySelector("#wind-loading"),
  loadingLabel: document.querySelector("#loading-label"),
  error: document.querySelector("#wind-error"),
  errorMessage: document.querySelector("#wind-error-message"),
  presets: [...document.querySelectorAll("[data-wind-preset]")],
  gust: document.querySelector("#gust-trigger"),
  strength: document.querySelector("#wind-strength"),
  strengthValue: document.querySelector("#wind-strength-value"),
  load: document.querySelector("#load-factor"),
  loadValue: document.querySelector("#load-factor-value"),
  damping: document.querySelector("#damping-factor"),
  dampingValue: document.querySelector("#damping-factor-value"),
  structure: document.querySelector("#structure-toggle"),
  reset: document.querySelector("#wind-reset"),
  speed: document.querySelector("#wind-speed-value"),
  bearing: document.querySelector("#wind-bearing-value"),
  loadMetric: document.querySelector("#wind-load-value"),
  delay: document.querySelector("#wind-delay-value"),
  nodes: document.querySelector("#node-count"),
  constraints: document.querySelector("#constraint-count"),
  solver: document.querySelector("#solver-rate"),
  gustCount: document.querySelector("#gust-count"),
  status: document.querySelector("#wind-status"),
  diagnostic: document.querySelector("#diagnostic-sample"),
  diagnosticOutput: document.querySelector("#diagnostic-output"),
};

const PRESETS = {
  breeze: { label: "微风", strength: 0.34, load: 1, damping: 0.64, angle: 0.39 },
  cross: { label: "横风", strength: 0.58, load: 1.08, damping: 0.52, angle: -0.08 },
  squall: { label: "阵风", strength: 0.88, load: 1.22, damping: 0.43, angle: 0.68 },
};

let scene;
let sceneReady = false;
let frameHandle;
let pointerGesture;
let currentPreset = Object.hasOwn(PRESETS, params.get("preset")) ? params.get("preset") : "breeze";
const DRAG_THRESHOLD = 9;

function isInteractiveTarget(target) {
  return target instanceof Element && Boolean(target.closest("button, input, a, summary, details"));
}

function setPhase(phase) {
  document.body.dataset.phase = phase;
}

function setControlValues({ strength, load, damping }) {
  elements.strength.value = String(strength);
  elements.load.value = String(load);
  elements.damping.value = String(damping);
  elements.strengthValue.textContent = `${Math.round(strength * 100)}%`;
  elements.loadValue.textContent = `${Math.round(load * 100)}%`;
  elements.dampingValue.textContent = `${Math.round(damping * 100)}%`;
}

function setPreset(name, announce = true) {
  const preset = PRESETS[name];
  if (!preset) return;
  currentPreset = name;
  document.body.dataset.preset = name;
  elements.presets.forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.windPreset === name)));
  setControlValues(preset);
  elements.speed.textContent = String(Math.round(7 + preset.strength * 48));
  elements.bearing.textContent = `${String(Math.round(((preset.angle * 180 / Math.PI) + 360) % 360)).padStart(3, "0")}°`;
  elements.loadMetric.textContent = (3.08 * preset.load).toFixed(1);
  elements.delay.textContent = String(Math.round(148 + preset.load * 82 + (1 - preset.damping) * 54));
  scene?.setWindStrength(preset.strength);
  scene?.setLoadFactor(preset.load);
  scene?.setDampingFactor(preset.damping);
  scene?.setWindAngle(preset.angle);
  if (announce) elements.status.textContent = `${preset.label}预设已应用：风力、负重、阻尼和方向同时改变。`;
}

function markCustom() {
  currentPreset = "custom";
  document.body.dataset.preset = "custom";
  elements.presets.forEach((button) => button.setAttribute("aria-pressed", "false"));
}

function updateMetrics(metrics) {
  setPhase(metrics.phase);
  elements.speed.textContent = String(Math.round(metrics.windKph));
  elements.bearing.textContent = `${String(Math.round(metrics.angleDegrees)).padStart(3, "0")}°`;
  elements.loadMetric.textContent = metrics.loadKg.toFixed(1);
  elements.delay.textContent = String(Math.round(metrics.delayMs));
  elements.gustCount.textContent = String(metrics.gusts);
  document.body.dataset.frameMs = metrics.frameMilliseconds.toFixed(2);
  document.body.dataset.gusts = String(metrics.gusts);
  document.body.dataset.windAngle = metrics.angleDegrees.toFixed(1);
  document.body.dataset.cameraYaw = metrics.cameraYawDegrees.toFixed(2);
  document.body.dataset.cameraPitch = metrics.cameraPitchDegrees.toFixed(2);
}

function directionText(direction) {
  const horizontal = direction.x >= 0 ? "向右" : "向左";
  const vertical = direction.y > 0.28 ? "并向上抬升" : direction.y < -0.28 ? "并向下压低" : "";
  return `${horizontal}${vertical}`;
}

function triggerGust(x = 0, y = 0.2, strength = 0.94) {
  if (sceneReady) scene.addGust(x, y, scene.windDirection, strength, 0.08, true);
  else {
    document.body.classList.remove("fallback-gust");
    requestAnimationFrame(() => document.body.classList.add("fallback-gust"));
  }
  setPhase("advect");
  elements.status.textContent = "局部阵风已释放：先看织物受力，再看绳索把扰动传向固定端。";
}

function showFallback(message) {
  document.body.dataset.runtime = "unsupported";
  elements.loading.classList.add("is-complete");
  elements.error.hidden = false;
  elements.errorMessage.textContent = message;
  elements.nodes.textContent = "STATIC";
  elements.constraints.textContent = "—";
  elements.solver.textContent = "—";
  elements.diagnostic.disabled = true;
  elements.structure.disabled = true;
  elements.diagnosticOutput.textContent = "WebGPU 未运行";
  setPhase("load");
}

function installControls() {
  elements.presets.forEach((button) => button.addEventListener("click", () => setPreset(button.dataset.windPreset)));
  elements.strength.addEventListener("input", () => {
    markCustom();
    const value = Number(elements.strength.value);
    elements.strengthValue.textContent = `${Math.round(value * 100)}%`;
    scene?.setWindStrength(value);
    elements.status.textContent = `常风强度调整为 ${Math.round(value * 100)}%。`;
  });
  elements.load.addEventListener("input", () => {
    markCustom();
    const value = Number(elements.load.value);
    elements.loadValue.textContent = `${Math.round(value * 100)}%`;
    scene?.setLoadFactor(value);
    setPhase("load");
    elements.status.textContent = `织物负重调整为 ${Math.round(value * 100)}%；观察绳索垂度与传播延迟。`;
  });
  elements.damping.addEventListener("input", () => {
    markCustom();
    const value = Number(elements.damping.value);
    elements.dampingValue.textContent = `${Math.round(value * 100)}%`;
    scene?.setDampingFactor(value);
    elements.status.textContent = `阻尼调整为 ${Math.round(value * 100)}%；数值越高，余振消退越快。`;
  });
  elements.gust.addEventListener("click", () => triggerGust(0.25, 0.15, 1.02));
  elements.structure.addEventListener("click", () => {
    if (!sceneReady) return;
    const visible = scene.toggleStructure();
    document.body.dataset.structure = visible ? "on" : "off";
    elements.structure.setAttribute("aria-pressed", String(visible));
    elements.status.textContent = visible
      ? "结构透视已开启：亮点是 GPU 节点，亮线是绳索、织物和夹点约束。"
      : "结构透视已关闭：回到织物材质视图。";
  });
  elements.reset.addEventListener("click", () => {
    scene?.reset();
    setPreset("breeze", false);
    setPhase("anchor");
    document.body.dataset.structure = "off";
    elements.structure.setAttribute("aria-pressed", "false");
    scene?.toggleStructure(false);
    elements.status.textContent = "已回到正视角和初始微风：固定端、负重与方向场重新建立。";
  });
  elements.diagnostic.addEventListener("click", async () => {
    if (!sceneReady) return;
    elements.diagnostic.disabled = true;
    elements.diagnosticOutput.textContent = "读取 GPU 缓冲…";
    try {
      const sample = await scene.sampleDiagnostics();
      elements.diagnosticOutput.textContent = `${sample.finite ? "有限" : "异常"} · 最大位移 ${sample.maxDisplacement.toFixed(3)} · 地面接触 ${sample.floorContacts} · ${sample.frameMilliseconds.toFixed(1)} ms`;
      document.body.dataset.diagnosticFinite = String(sample.finite);
      document.body.dataset.maxDisplacement = sample.maxDisplacement.toFixed(4);
      document.body.dataset.floorContacts = String(sample.floorContacts);
    } finally {
      elements.diagnostic.disabled = false;
    }
  });

  elements.stage.addEventListener("pointerdown", (event) => {
    if (isInteractiveTarget(event.target) || !sceneReady) return;
    pointerGesture = { id: event.pointerId, startX: event.clientX, startY: event.clientY, lastX: event.clientX, lastY: event.clientY, dragged: false };
    elements.stage.setPointerCapture?.(event.pointerId);
    document.body.dataset.dragging = "true";
    document.body.dataset.pointerPhase = "press";
    scene.beginPointer(event.clientX, event.clientY);
  });
  elements.stage.addEventListener("pointermove", (event) => {
    if (pointerGesture?.id === event.pointerId) {
      const distance = Math.hypot(event.clientX - pointerGesture.startX, event.clientY - pointerGesture.startY);
      const wasDragged = pointerGesture.dragged;
      pointerGesture.dragged ||= distance >= DRAG_THRESHOLD;
      pointerGesture.lastX = event.clientX;
      pointerGesture.lastY = event.clientY;
      const result = scene?.dragPointer(pointerGesture.startX, pointerGesture.startY, event.clientX, event.clientY);
      if (pointerGesture.dragged) {
        document.body.dataset.pointerPhase = "drag";
        if (!wasDragged && result) elements.status.textContent = `3D 视角正在环绕；阵风同时${directionText(result.direction)}，衣物沿同一方向受力。`;
      }
      return;
    }
    if (!isInteractiveTarget(event.target)) {
      document.body.dataset.pointerPhase = "hover";
      scene?.setPointer(event.clientX, event.clientY);
    }
  });
  const endGesture = (event, cancelled = false) => {
    if (pointerGesture?.id !== event.pointerId) return;
    if (elements.stage.hasPointerCapture?.(event.pointerId)) elements.stage.releasePointerCapture(event.pointerId);
    const gesture = pointerGesture;
    pointerGesture = undefined;
    document.body.dataset.dragging = "false";
    document.body.dataset.pointerPhase = "release";
    if (!cancelled) {
      const result = scene?.gustFromScreen(gesture.startX, gesture.startY, event.clientX, event.clientY, gesture.dragged ? 1.14 : 0.82);
      if (result) elements.status.textContent = gesture.dragged
        ? `3D 视角已保留；阵风${directionText(result.direction)}，并沿绳索传播，0 可回到正视角。`
        : "轻点阵风已命中局部织物：观察波前沿绳索向两端传播。";
    }
    scene?.clearPointer();
  };
  elements.stage.addEventListener("pointerup", (event) => endGesture(event));
  elements.stage.addEventListener("pointercancel", (event) => endGesture(event, true));
  elements.stage.addEventListener("pointerleave", () => {
    if (!pointerGesture) {
      document.body.dataset.pointerPhase = "idle";
      scene?.clearPointer();
    }
  }, { passive: true });
  elements.stage.addEventListener("lostpointercapture", () => {
    if (!pointerGesture) return;
    pointerGesture = undefined;
    document.body.dataset.dragging = "false";
    document.body.dataset.pointerPhase = "idle";
    scene?.clearPointer();
  });

  elements.stage.addEventListener("keydown", (event) => {
    if (event.target !== elements.stage) return;
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      const angle = scene?.nudgeWind(event.key === "ArrowLeft" ? 0.16 : -0.16);
      markCustom();
      elements.status.textContent = `常风方向已${event.key === "ArrowLeft" ? "逆时针" : "顺时针"}调整至 ${Math.round(((angle * 180 / Math.PI) + 360) % 360)}°。`;
      return;
    }
    if (event.key === "ArrowUp" || event.key === "ArrowDown") {
      event.preventDefault();
      const delta = event.key === "ArrowUp" ? 0.06 : -0.06;
      const next = Math.max(0.08, Math.min(1, Number(elements.strength.value) + delta));
      elements.strength.value = String(next);
      elements.strength.dispatchEvent(new Event("input", { bubbles: true }));
      return;
    }
    if (event.key === "0") {
      event.preventDefault();
      elements.reset.click();
      return;
    }
    if (["Enter", " "].includes(event.key)) {
      event.preventDefault();
      triggerGust(0.25, 0.15, 1.02);
    }
  });
}

async function bootstrap() {
  installControls();
  setPreset(currentPreset, false);
  if (!navigator.gpu || forceFallback) {
    showFallback(forceFallback
      ? "正在预览无 WebGPU 降级状态：GPU 物理增强停用，因果链、预设与导航保持可读。"
      : "当前浏览器没有暴露 WebGPU。请使用最新版 Chrome/Edge，并通过 localhost 或 HTTPS 访问。");
    return;
  }

  try {
    scene = new WindlineScene(elements.stage, {
      reducedMotion,
      onMetrics: updateMetrics,
      onGust: ({ manual }) => { if (manual) setPhase("advect"); },
    });
    await scene.init((progress, label) => {
      elements.loadingLabel.textContent = label;
      elements.loading.style.setProperty("--progress", progress.toFixed(2));
    });
    const stats = scene.getStats();
    elements.nodes.textContent = stats.labels.vertices;
    elements.constraints.textContent = stats.labels.springs;
    elements.solver.textContent = String(stats.solverRate);
    document.body.dataset.garmentNodes = stats.garments.map((item) => item.nodes).join("/");
    document.body.dataset.collisionPlane = String(stats.collisionPlane);
    setPreset(currentPreset, false);
    document.body.dataset.runtime = "ready";
    sceneReady = true;
    globalThis.__AURELIA_WINDLINE__ = scene;
    elements.loading.classList.add("is-complete");
    window.addEventListener("resize", () => scene?.resize(), { passive: true });

    const startedAt = performance.now();
    const animate = async (now) => {
      await scene?.update((now - startedAt) / 1000);
      frameHandle = requestAnimationFrame(animate);
    };
    frameHandle = requestAnimationFrame(animate);
  } catch (error) {
    console.error(error);
    sceneReady = false;
    scene = undefined;
    showFallback(`初始化失败：${error.message}`);
  }
}

bootstrap();

window.addEventListener("beforeunload", () => {
  sceneReady = false;
  cancelAnimationFrame(frameHandle);
  scene?.destroy();
});
