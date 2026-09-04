import "./rain.css";
import { RainHarpAudio } from "./rain/audio.js";
import { RainMembraneScene } from "./rain/scene.js";

const params = new URLSearchParams(location.search);
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches || params.get("motion") === "reduce";
const forceFallback = params.get("fallback") === "1";
const embedMode = params.get("embed") === "1";
document.body.dataset.motion = reducedMotion ? "reduce" : "full";
document.body.dataset.embed = String(embedMode);
const elements = {
  stage: document.querySelector("#rain-stage"),
  loading: document.querySelector("#rain-loading"),
  loadingLabel: document.querySelector("#loading-label"),
  error: document.querySelector("#rain-error"),
  errorMessage: document.querySelector("#rain-error-message"),
  modeButtons: [...document.querySelectorAll("[data-rain-mode]")],
  intensity: document.querySelector("#rain-intensity"),
  intensityValue: document.querySelector("#intensity-value"),
  manualDrop: document.querySelector("#manual-drop"),
  drain: document.querySelector("#drain-water"),
  structure: document.querySelector("#structure-toggle"),
  audio: document.querySelector("#audio-toggle"),
  reset: document.querySelector("#view-reset"),
  rainfall: document.querySelector("#rainfall-value"),
  wetness: document.querySelector("#wetness-value"),
  tension: document.querySelector("#tension-value"),
  frequency: document.querySelector("#frequency-value"),
  vertices: document.querySelector("#vertex-count"),
  springs: document.querySelector("#spring-count"),
  solver: document.querySelector("#solver-rate"),
  impacts: document.querySelector("#impact-count"),
  status: document.querySelector("#rain-status"),
  diagnostic: document.querySelector("#diagnostic-sample"),
  diagnosticOutput: document.querySelector("#diagnostic-output"),
  causalSteps: [...document.querySelectorAll(".causal-panel li[data-phase]")],
};

const MODES = {
  drizzle: { value: 0.18, label: "微雨" },
  rain: { value: 0.42, label: "中雨" },
  storm: { value: 0.9, label: "暴雨" },
};

let scene;
let sceneReady = false;
let frameHandle;
let lastAudioUpdate = 0;
let lastParentUpdate = 0;
let currentMode = Object.hasOwn(MODES, params.get("mode")) ? params.get("mode") : "rain";
let pointerGesture;
let manualImpactCount = 0;
let renderedPhase = "";
const DRAG_THRESHOLD = 7;

function isInteractiveTarget(target) {
  return target instanceof Element && Boolean(target.closest("button, input, a, summary, details"));
}

function writeCameraState(state, cameraState = scene?.getCameraState()) {
  document.body.dataset.camera = state;
  if (!cameraState) return;
  document.body.dataset.cameraYaw = cameraState.yaw.toFixed(3);
  document.body.dataset.cameraPitch = cameraState.pitch.toFixed(3);
}

function updateAudioState(state, message) {
  document.body.dataset.audio = state;
  const playing = state === "playing";
  elements.audio.setAttribute("aria-pressed", String(playing));
  elements.audio.querySelector(".control-symbol").textContent = playing ? "Ⅱ" : "♪";
  elements.audio.querySelector("strong").textContent = playing ? "暂停雨琴" : state === "paused" ? "继续雨琴" : "启动雨琴";
  elements.audio.querySelector("small").textContent = message;
}

function renderCausalPhase(phase) {
  if (!phase || phase === renderedPhase) return;
  renderedPhase = phase;
  document.body.dataset.phase = phase;
  elements.causalSteps.forEach((step) => {
    if (step.dataset.phase === phase) step.setAttribute("aria-current", "step");
    else step.removeAttribute("aria-current");
  });
}

function renderText(element, value) {
  if (element.textContent !== value) element.textContent = value;
}

function renderBodyState(name, value) {
  if (document.body.dataset[name] !== value) document.body.dataset[name] = value;
}

const audio = new RainHarpAudio(updateAudioState);

function setMode(mode) {
  const preset = MODES[mode];
  if (!preset) return;
  currentMode = mode;
  document.body.dataset.mode = mode;
  elements.modeButtons.forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.rainMode === mode)));
  elements.intensity.value = String(preset.value);
  elements.intensityValue.textContent = `${Math.round(preset.value * 100)}%`;
  scene?.setIntensity(preset.value);
  elements.status.textContent = `${preset.label}模式：雨滴密度、积水速度和风向扰动已同步改变。`;
}

function setCustomIntensity(value) {
  currentMode = "custom";
  document.body.dataset.mode = "custom";
  elements.modeButtons.forEach((button) => button.setAttribute("aria-pressed", "false"));
  const normalized = Number(value);
  elements.intensityValue.textContent = `${Math.round(normalized * 100)}%`;
  scene?.setIntensity(normalized);
}

function showVisualError(message) {
  document.body.dataset.runtime = "unsupported";
  elements.loading.hidden = true;
  elements.error.hidden = false;
  elements.errorMessage.textContent = message;
  [...elements.modeButtons, elements.intensity, elements.manualDrop, elements.drain, elements.structure, elements.audio, elements.reset, elements.diagnostic].forEach((control) => { control.disabled = true; });
  if (embedMode && window.parent !== window) window.parent.postMessage({ source: "aurelia-rain", type: "rain:fallback" }, location.origin);
}

function updateMetrics(metrics) {
  renderText(elements.rainfall, String(Math.round(5 + metrics.intensity * 71)));
  renderText(elements.wetness, `${String(Math.round(metrics.wetness * 100)).padStart(2, "0")}%`);
  renderText(elements.tension, `${Math.round(metrics.tension * 100)}%`);
  renderText(elements.frequency, metrics.frequency.toFixed(1));
  renderText(elements.impacts, metrics.impacts >= 1000 ? `${(metrics.impacts / 1000).toFixed(1)}K` : String(metrics.impacts));
  renderCausalPhase(metrics.phase);
  renderBodyState("draining", String(metrics.draining));
  if (metrics.vfx) {
    renderBodyState("vfxActive", `${metrics.vfx.activeWaves}/${metrics.vfx.activeSplashes}`);
    renderBodyState("wetMaterial", `${metrics.vfx.runoffOpacity.toFixed(2)}/${metrics.vfx.membraneRoughness.toFixed(2)}`);
  }
  if (metrics.draining) renderText(elements.status, "排水通道已打开：质量下降，膜面张力与固有频率正在恢复。");
  const now = performance.now();
  if (embedMode && window.parent !== window && now - lastParentUpdate > 250) {
    window.parent.postMessage({
      source: "aurelia-rain",
      type: "rain:metrics",
      metrics: { wetness: metrics.wetness, tension: metrics.tension, intensity: metrics.intensity },
    }, location.origin);
    lastParentUpdate = now;
  }
  if (now - lastAudioUpdate > 120) {
    audio.setState(metrics);
    lastAudioUpdate = now;
  }
}

function installEmbedBridge() {
  if (!embedMode) return;
  window.addEventListener("message", (event) => {
    if (event.origin !== location.origin || event.source !== window.parent || event.data?.source !== "weatherproof") return;
    if (event.data.type === "rain:set-mode") setMode(event.data.mode);
    if (event.data.type === "rain:set-intensity") {
      const value = Math.min(1, Math.max(0.08, Number(event.data.value) || MODES.rain.value));
      elements.intensity.value = String(value);
      setCustomIntensity(value);
    }
    if (event.data.type === "rain:impact" && sceneReady) {
      const strength = Math.min(1.25, Math.max(0.35, Number(event.data.strength) || 0.9));
      scene.addImpact(0.55, -0.22, strength, true);
    }
    if (event.data.type === "rain:drain" && sceneReady) scene.drain();
    if (event.data.type === "rain:structure" && sceneReady) scene.setStructureVisible(Boolean(event.data.visible));
  });
}

function installControls() {
  elements.modeButtons.forEach((button) => button.addEventListener("click", () => setMode(button.dataset.rainMode)));
  elements.intensity.addEventListener("input", () => setCustomIntensity(elements.intensity.value));
  elements.manualDrop.addEventListener("click", () => {
    scene?.addImpact(0.7, -0.35, 1.14, true);
    elements.status.textContent = "手动命中：局部凹陷已经进入膜面，观察暖色波前向伞骨扩散。";
  });
  elements.drain.addEventListener("click", () => scene?.drain());
  elements.structure.addEventListener("click", () => {
    const visible = elements.structure.getAttribute("aria-pressed") !== "true";
    elements.structure.setAttribute("aria-pressed", String(visible));
    document.body.dataset.structure = visible ? "on" : "off";
    elements.structure.querySelector("small").textContent = visible ? "GPU 约束可见" : "查看 GPU 约束";
    scene?.setStructureVisible(visible);
  });
  elements.audio.addEventListener("click", async () => {
    const playing = await audio.toggle();
    if (!audio.supported) elements.audio.disabled = true;
    else if (playing) scene?.addImpact(-0.85, 0.35, 0.96, true);
  });
  elements.reset.addEventListener("click", () => {
    scene?.reset();
    manualImpactCount = 0;
    document.body.dataset.manualImpacts = "0";
    writeCameraState("idle");
    setMode("rain");
    document.body.dataset.structure = "off";
    elements.structure.setAttribute("aria-pressed", "false");
    elements.status.textContent = "已复位：中雨、低积水、标准张力。";
  });
  elements.diagnostic.addEventListener("click", async () => {
    if (!scene) return;
    elements.diagnostic.disabled = true;
    elements.diagnosticOutput.textContent = "正在读取 position storage…";
    try {
      const sample = await scene.sampleDiagnostics();
      document.body.dataset.physicsFinite = String(sample.finite);
      document.body.dataset.maxDisplacement = sample.maxDisplacement.toFixed(4);
      document.body.dataset.frameMilliseconds = sample.frameMilliseconds.toFixed(2);
      document.body.dataset.drawCalls = sample.drawCallsPerFrame.toFixed(1);
      elements.diagnosticOutput.textContent = `${sample.finite ? "FINITE" : "NON-FINITE"} · ${sample.count} nodes · max Δ ${sample.maxDisplacement.toFixed(3)} · ${sample.frameMilliseconds.toFixed(1)}ms · ${sample.drawCallsPerFrame.toFixed(1)} avg draws/frame`;
    } catch (error) {
      elements.diagnosticOutput.textContent = `取样失败：${error.message}`;
    } finally {
      elements.diagnostic.disabled = false;
    }
  });

  elements.stage.addEventListener("pointerdown", (event) => {
    if (isInteractiveTarget(event.target) || event.button !== 0 || !event.isPrimary) return;
    event.preventDefault();
    pointerGesture = {
      id: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      lastX: event.clientX,
      lastY: event.clientY,
      dragged: false,
    };
    elements.stage.setPointerCapture?.(event.pointerId);
    elements.stage.focus({ preventScroll: true });
    scene?.setPointer(event.clientX, event.clientY);
    writeCameraState("idle");
  });
  elements.stage.addEventListener("pointermove", (event) => {
    if (pointerGesture?.id === event.pointerId) {
      event.preventDefault();
      const totalDistance = Math.hypot(event.clientX - pointerGesture.startX, event.clientY - pointerGesture.startY);
      if (!pointerGesture.dragged && totalDistance >= DRAG_THRESHOLD) {
        pointerGesture.dragged = true;
        const cameraState = scene?.rotateCamera(
          event.clientX - pointerGesture.startX,
          event.clientY - pointerGesture.startY,
        );
        writeCameraState("dragging", cameraState);
      } else if (pointerGesture.dragged) {
        const cameraState = scene?.rotateCamera(
          event.clientX - pointerGesture.lastX,
          event.clientY - pointerGesture.lastY,
        );
        writeCameraState("dragging", cameraState);
      }
      pointerGesture.lastX = event.clientX;
      pointerGesture.lastY = event.clientY;
      return;
    }
    if (!isInteractiveTarget(event.target)) scene?.setPointer(event.clientX, event.clientY);
  });

  const endPointerGesture = (event, cancelled = false) => {
    if (pointerGesture?.id !== event.pointerId) return;
    const dragged = pointerGesture.dragged;
    if (elements.stage.hasPointerCapture?.(event.pointerId)) elements.stage.releasePointerCapture(event.pointerId);
    pointerGesture = undefined;
    if (dragged) {
      const cameraState = scene?.endCameraDrag();
      writeCameraState("moved", cameraState);
      elements.status.textContent = "三维视角已旋转：继续拖动观察伞骨、膜面起伏与波的空间关系。";
    } else if (!cancelled && scene?.impactAtScreen(event.clientX, event.clientY, 1.06)) {
      writeCameraState("idle");
      elements.status.textContent = "手动命中：局部凹陷已经进入膜面，观察暖色波前向伞骨扩散。";
    } else {
      scene?.endCameraDrag();
      writeCameraState("idle");
    }
  };

  elements.stage.addEventListener("pointerup", (event) => endPointerGesture(event));
  elements.stage.addEventListener("pointercancel", (event) => endPointerGesture(event, true));
  elements.stage.addEventListener("pointerleave", () => {
    if (!pointerGesture) scene?.clearPointer();
  }, { passive: true });
  elements.stage.addEventListener("lostpointercapture", () => {
    if (!pointerGesture) return;
    scene?.endCameraDrag();
    pointerGesture = undefined;
    writeCameraState("idle");
  });
  elements.stage.addEventListener("keydown", (event) => {
    if (event.target !== elements.stage) return;
    const cameraKeys = {
      ArrowLeft: [-0.14, 0],
      ArrowRight: [0.14, 0],
      ArrowUp: [0, -0.08],
      ArrowDown: [0, 0.08],
    };
    if (cameraKeys[event.key]) {
      event.preventDefault();
      const cameraState = scene?.nudgeCamera(...cameraKeys[event.key]);
      writeCameraState("moved", cameraState);
      elements.status.textContent = "键盘视角已调整：方向键可继续环绕伞面。";
      return;
    }
    if (event.key === "0") {
      event.preventDefault();
      writeCameraState("idle", scene?.resetCamera());
      elements.status.textContent = "相机已回到初始观察角度。";
      return;
    }
    if (!["Enter", " "].includes(event.key)) return;
    event.preventDefault();
    scene?.addImpact(0.45, 0.2, 1.08, true);
    elements.status.textContent = "键盘命中：冲击已进入膜面。";
  });
}

async function bootstrap() {
  installControls();
  installEmbedBridge();
  setMode(currentMode);
  if (!navigator.gpu || forceFallback) {
    showVisualError(forceFallback
      ? "正在预览无 WebGPU 降级状态：物理增强停用，但作品概念和因果链保持可读。"
      : "当前浏览器没有暴露 WebGPU。请使用最新版 Chrome/Edge，并通过 localhost 或 HTTPS 访问。");
    return;
  }

  try {
    scene = new RainMembraneScene(elements.stage, {
      reducedMotion,
      onMetrics: updateMetrics,
      onImpact: ({ strength, x, manual }) => {
        audio.impact(strength, x);
        if (manual) {
          manualImpactCount += 1;
          document.body.dataset.manualImpacts = String(manualImpactCount);
          renderCausalPhase("impact");
        }
      },
    });
    await scene.init((progress, label) => {
      elements.loadingLabel.textContent = label;
      elements.loading.style.setProperty("--progress", progress.toFixed(2));
    });
    const stats = scene.getStats();
    elements.vertices.textContent = stats.labels.vertices;
    elements.springs.textContent = stats.labels.springs;
    elements.solver.textContent = String(stats.solverRate);
    document.body.dataset.frameProfile = stats.frame.profile;
    document.body.dataset.frameParts = `${stats.frame.ribs}/${stats.frame.stretchers}/${stats.frame.continuousHandle ? 1 : 0}`;
    document.body.dataset.frameTriangles = String(stats.frame.triangles);
    document.body.dataset.vfxPools = `${stats.vfx.waves}/${stats.vfx.splashes}/${stats.vfx.runoffPaths}/${stats.vfx.runoffDrops}`;
    scene.setIntensity(currentMode === "custom" ? Number(elements.intensity.value) : MODES[currentMode].value);
    globalThis.__AURELIA_RAIN__ = scene;
    document.body.dataset.runtime = "ready";
    sceneReady = true;
    document.body.dataset.manualImpacts = "0";
    writeCameraState("idle");
    elements.loading.classList.add("is-complete");
    if (embedMode && window.parent !== window) window.parent.postMessage({ source: "aurelia-rain", type: "rain:ready" }, location.origin);
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
    showVisualError(`初始化失败：${error.message}`);
  }
}

bootstrap();

window.addEventListener("beforeunload", () => {
  sceneReady = false;
  cancelAnimationFrame(frameHandle);
  audio.destroy();
  scene?.destroy();
});
