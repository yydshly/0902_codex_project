import "./rain.css";
import { RainHarpAudio } from "./rain/audio.js";
import { RainMembraneScene } from "./rain/scene.js";

const params = new URLSearchParams(location.search);
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches || params.get("motion") === "reduce";
const forceFallback = params.get("fallback") === "1";
document.body.dataset.motion = reducedMotion ? "reduce" : "full";
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
};

const MODES = {
  drizzle: { value: 0.18, label: "微雨" },
  rain: { value: 0.42, label: "中雨" },
  storm: { value: 0.9, label: "暴雨" },
};

let scene;
let frameHandle;
let lastAudioUpdate = 0;
let currentMode = "rain";

function updateAudioState(state, message) {
  document.body.dataset.audio = state;
  const playing = state === "playing";
  elements.audio.setAttribute("aria-pressed", String(playing));
  elements.audio.querySelector(".control-symbol").textContent = playing ? "Ⅱ" : "♪";
  elements.audio.querySelector("strong").textContent = playing ? "暂停雨琴" : state === "paused" ? "继续雨琴" : "启动雨琴";
  elements.audio.querySelector("small").textContent = message;
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
}

function updateMetrics(metrics) {
  elements.rainfall.textContent = String(Math.round(5 + metrics.intensity * 71));
  elements.wetness.textContent = `${String(Math.round(metrics.wetness * 100)).padStart(2, "0")}%`;
  elements.tension.textContent = `${Math.round(metrics.tension * 100)}%`;
  elements.frequency.textContent = metrics.frequency.toFixed(1);
  elements.impacts.textContent = metrics.impacts >= 1000 ? `${(metrics.impacts / 1000).toFixed(1)}K` : String(metrics.impacts);
  document.body.dataset.phase = metrics.phase;
  document.body.dataset.draining = String(metrics.draining);
  if (metrics.draining) elements.status.textContent = "排水通道已打开：质量下降，膜面张力与固有频率正在恢复。";
  const now = performance.now();
  if (now - lastAudioUpdate > 120) {
    audio.setState(metrics);
    lastAudioUpdate = now;
  }
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
      elements.diagnosticOutput.textContent = `${sample.finite ? "FINITE" : "NON-FINITE"} · ${sample.count} nodes · max Δ ${sample.maxDisplacement.toFixed(3)}`;
    } catch (error) {
      elements.diagnosticOutput.textContent = `取样失败：${error.message}`;
    } finally {
      elements.diagnostic.disabled = false;
    }
  });

  elements.stage.addEventListener("pointermove", (event) => {
    if (event.target.closest("button, input, a, summary, details")) return;
    scene?.setPointer(event.clientX, event.clientY);
  }, { passive: true });
  elements.stage.addEventListener("pointerleave", () => scene?.clearPointer(), { passive: true });
  elements.stage.addEventListener("pointerdown", (event) => {
    if (event.target.closest("button, input, a, summary, details")) return;
    if (scene?.impactAtScreen(event.clientX, event.clientY, 1.06)) {
      elements.status.textContent = "手动命中：局部凹陷已经进入膜面，观察暖色波前向伞骨扩散。";
    }
  });
  elements.stage.addEventListener("keydown", (event) => {
    if (event.target !== elements.stage || !["Enter", " "].includes(event.key)) return;
    event.preventDefault();
    scene?.addImpact(0.45, 0.2, 1.08, true);
  });
}

async function bootstrap() {
  installControls();
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
        if (manual) document.body.dataset.phase = "impact";
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
    scene.setIntensity(MODES[currentMode].value);
    globalThis.__AURELIA_RAIN__ = scene;
    document.body.dataset.runtime = "ready";
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
    scene = undefined;
    showVisualError(`初始化失败：${error.message}`);
  }
}

bootstrap();

window.addEventListener("beforeunload", () => {
  cancelAnimationFrame(frameHandle);
  audio.destroy();
  scene?.destroy();
});
