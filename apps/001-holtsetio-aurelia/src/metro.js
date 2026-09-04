import "./metro.css";
import { MetroPulseScene, STATIONS } from "./metro/scene.js";

const params = new URLSearchParams(location.search);
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches || params.get("motion") === "reduce";
const forceFallback = params.get("fallback") === "1";
document.body.dataset.motion = reducedMotion ? "reduce" : "full";

const elements = {
  stage: document.querySelector("#metro-stage"),
  loading: document.querySelector("#metro-loading"),
  loadingLabel: document.querySelector("#loading-label"),
  error: document.querySelector("#metro-error"),
  errorMessage: document.querySelector("#metro-error-message"),
  scenarios: [...document.querySelectorAll(".scenario-tabs [data-scenario]")],
  inject: document.querySelector("#inject-trigger"),
  injectTarget: document.querySelector("#inject-target"),
  demand: document.querySelector("#demand-factor"),
  demandValue: document.querySelector("#demand-value"),
  recovery: document.querySelector("#recovery-factor"),
  recoveryValue: document.querySelector("#recovery-factor-value"),
  structure: document.querySelector("#structure-toggle"),
  reset: document.querySelector("#metro-reset"),
  flow: document.querySelector("#flow-value"),
  saturation: document.querySelector("#saturation-value"),
  delay: document.querySelector("#delay-value"),
  recoveryMetric: document.querySelector("#recovery-value"),
  stations: document.querySelector("#station-count"),
  constraints: document.querySelector("#constraint-count"),
  packets: document.querySelector("#packet-count"),
  events: document.querySelector("#event-count"),
  status: document.querySelector("#metro-status"),
  tooltip: document.querySelector("#station-tooltip"),
  tooltipCode: document.querySelector("#station-code"),
  tooltipName: document.querySelector("#station-name"),
  tooltipLoad: document.querySelector("#station-load"),
  diagnostic: document.querySelector("#diagnostic-sample"),
  diagnosticOutput: document.querySelector("#diagnostic-output"),
};

const SCENARIO_UI = {
  commute: { label: "晚高峰", focus: "中央环", demand: 1, recovery: 0.58, flow: 4820, saturation: 62, delayed: 2, eta: "04:20" },
  event: { label: "活动散场", focus: "剧场", demand: 1.18, recovery: 0.46, flow: 6380, saturation: 78, delayed: 4, eta: "07:10" },
  closure: { label: "中央封站", focus: "中央环", demand: 1.08, recovery: 0.36, flow: 5740, saturation: 86, delayed: 6, eta: "11:40" },
};

let scene;
let sceneReady = false;
let frameHandle;
let pointerGesture;
let currentScenario = Object.hasOwn(SCENARIO_UI, params.get("scenario")) ? params.get("scenario") : "commute";
let selectedStation = STATIONS.find((station) => station.name === SCENARIO_UI[currentScenario].focus) ?? STATIONS[2];
let currentPhase = "ingress";
const DRAG_THRESHOLD = 8;

function isInteractiveTarget(target) {
  return target instanceof Element && Boolean(target.closest("button, input, a, summary, details"));
}

function writeText(element, value) {
  const text = String(value);
  if (element.textContent !== text) element.textContent = text;
}

function setPhase(phase) {
  if (currentPhase === phase) return;
  currentPhase = phase;
  document.body.dataset.phase = phase;
  document.querySelectorAll(".causal-panel li").forEach((item) => {
    if (item.dataset.phase === phase) item.setAttribute("aria-current", "step");
    else item.removeAttribute("aria-current");
  });
}

function formatDuration(seconds) {
  if (!Number.isFinite(seconds) || seconds <= 0) return "00:00";
  const rounded = Math.min(99 * 60 + 59, Math.round(seconds));
  return `${String(Math.floor(rounded / 60)).padStart(2, "0")}:${String(rounded % 60).padStart(2, "0")}`;
}

function setSelected({ station, pressure = 0.62 }) {
  selectedStation = station;
  writeText(elements.injectTarget, `${station.name} · +1,200`);
  document.body.dataset.selectedStation = station.id;
  document.body.dataset.selectedPressure = Number(pressure).toFixed(3);
}

function showHover(data) {
  if (!data) {
    elements.tooltip.hidden = true;
    document.body.dataset.hoverStation = "none";
    return;
  }
  elements.tooltip.hidden = false;
  elements.tooltip.style.left = `${Math.max(8, Math.min(innerWidth - 150, data.x))}px`;
  elements.tooltip.style.top = `${Math.max(76, Math.min(innerHeight - 96, data.y))}px`;
  writeText(elements.tooltipCode, data.station.code);
  writeText(elements.tooltipName, data.station.name);
  writeText(elements.tooltipLoad, `${Math.round(data.pressure * 100)}%`);
  document.body.dataset.hoverStation = data.station.id;
}

function setScenario(name, announce = true, trigger = true) {
  const config = SCENARIO_UI[name];
  if (!config) return;
  currentScenario = name;
  document.body.dataset.scenario = name;
  elements.scenarios.forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.scenario === name)));
  elements.demand.value = String(config.demand);
  elements.recovery.value = String(config.recovery);
  writeText(elements.demandValue, `${Math.round(config.demand * 100)}%`);
  writeText(elements.recoveryValue, `${Math.round(config.recovery * 100)}%`);
  writeText(elements.flow, config.flow.toLocaleString("en-US"));
  writeText(elements.saturation, `${config.saturation}%`);
  writeText(elements.delay, config.delayed);
  writeText(elements.recoveryMetric, config.eta);
  selectedStation = STATIONS.find((station) => station.name === config.focus) ?? STATIONS[2];
  setSelected({ station: selectedStation, pressure: config.saturation / 100 });
  if (sceneReady) scene.setScenario(name, trigger);
  if (announce) {
    const message = name === "commute"
      ? "晚高峰已载入：居住区输入增加，中央环与市集承担主要换乘压力。"
      : name === "event"
        ? "活动散场已载入：剧场出现短时脉冲，压力会先传向西站和中央环。"
        : "中央封站已载入：中央环可用容量降至 42%，回压会迫使邻线重新分配。";
    elements.status.textContent = `${message} 数据为构造演示。`;
  }
}

function updateMetrics(metrics) {
  setPhase(metrics.phase);
  writeText(elements.flow, Math.round(metrics.flow).toLocaleString("en-US"));
  writeText(elements.saturation, `${Math.round(metrics.saturation * 100)}%`);
  writeText(elements.delay, metrics.delayed);
  writeText(elements.recoveryMetric, formatDuration(metrics.recoverySeconds));
  writeText(elements.events, metrics.eventCount);
  document.body.dataset.bottleneck = metrics.bottleneck.id;
  document.body.dataset.bottleneckPressure = metrics.bottleneckPressure.toFixed(3);
  document.body.dataset.selectedPressure = metrics.selectedPressure.toFixed(3);
  document.body.dataset.pressureVector = metrics.pressures.map((value) => value.toFixed(3)).join(",");
  document.body.dataset.frameMs = metrics.frameMilliseconds.toFixed(2);
  document.body.dataset.cameraYaw = metrics.cameraYawDegrees.toFixed(2);
  document.body.dataset.cameraPitch = metrics.cameraPitchDegrees.toFixed(2);
  if (!elements.tooltip.hidden && document.body.dataset.hoverStation === metrics.bottleneck.id) {
    writeText(elements.tooltipLoad, `${Math.round(metrics.bottleneckPressure * 100)}%`);
  }
}

function injectSelected() {
  if (sceneReady) {
    const station = scene.injectCrowd(undefined, 0.82, true);
    selectedStation = station;
    elements.status.textContent = `${station.name}新增 1,200 人次脉冲：观察节点抬升、相邻站回压和线路流速下降。`;
  } else {
    const current = Number.parseInt(elements.saturation.textContent, 10) || 62;
    writeText(elements.saturation, `${Math.min(99, current + 8)}%`);
    writeText(elements.delay, Math.min(9, Number(elements.delay.textContent) + 1));
    setPhase("pressure");
    elements.status.textContent = `${selectedStation.name}合成客流已增加；WebGPU 不可用，因此只更新可读指标。`;
  }
}

function showFallback(message) {
  document.body.dataset.runtime = "unsupported";
  elements.loading.classList.add("is-complete");
  elements.error.hidden = false;
  elements.errorMessage.textContent = message;
  elements.stations.textContent = String(STATIONS.length);
  elements.constraints.textContent = "STATIC";
  elements.packets.textContent = "—";
  elements.structure.disabled = true;
  elements.diagnostic.disabled = true;
  elements.diagnosticOutput.textContent = "WebGPU 未运行";
}

function installControls() {
  elements.scenarios.forEach((button) => button.addEventListener("click", () => setScenario(button.dataset.scenario, true, true)));
  elements.inject.addEventListener("click", injectSelected);
  elements.demand.addEventListener("input", () => {
    const value = Number(elements.demand.value);
    writeText(elements.demandValue, `${Math.round(value * 100)}%`);
    scene?.setDemandFactor(value);
    elements.scenarios.forEach((button) => button.setAttribute("aria-pressed", "false"));
    elements.status.textContent = `需求倍率调整为 ${Math.round(value * 100)}%；瓶颈高度和延迟将随容量余量变化。`;
  });
  elements.recovery.addEventListener("input", () => {
    const value = Number(elements.recovery.value);
    writeText(elements.recoveryValue, `${Math.round(value * 100)}%`);
    scene?.setRecoveryFactor(value);
    elements.scenarios.forEach((button) => button.setAttribute("aria-pressed", "false"));
    elements.status.textContent = `恢复能力调整为 ${Math.round(value * 100)}%；数值越高，积压衰减越快。`;
  });
  elements.structure.addEventListener("click", () => {
    if (!sceneReady) return;
    const visible = scene.toggleStructure();
    document.body.dataset.structure = visible ? "on" : "off";
    elements.structure.setAttribute("aria-pressed", String(visible));
    elements.status.textContent = visible
      ? "结构透视已开启：细线显示隐藏容量锚、自由站点和跨线弹簧约束。"
      : "结构透视已关闭：回到运营网络视图。";
  });
  elements.reset.addEventListener("click", () => {
    scene?.reset();
    setScenario("commute", false, false);
    setPhase("ingress");
    document.body.dataset.structure = "off";
    elements.structure.setAttribute("aria-pressed", "false");
    scene?.toggleStructure(false);
    elements.status.textContent = "网络、客流事件和 3D 视角已复位；晚高峰合成基线重新建立。";
  });
  elements.diagnostic.addEventListener("click", async () => {
    if (!sceneReady) return;
    elements.diagnostic.disabled = true;
    elements.diagnosticOutput.textContent = "读取 GPU 缓冲…";
    try {
      const sample = await scene.sampleDiagnostics();
      elements.diagnosticOutput.textContent = `${sample.finite ? "有限" : "异常"} · ${sample.count} 站 · 最大位移 ${sample.maxDisplacement.toFixed(3)} · 峰值压力 ${Math.round(sample.maxPressure * 100)}% · ${sample.frameMilliseconds.toFixed(1)} ms`;
      document.body.dataset.diagnosticFinite = String(sample.finite);
      document.body.dataset.maxDisplacement = sample.maxDisplacement.toFixed(4);
    } finally {
      elements.diagnostic.disabled = false;
    }
  });

  elements.stage.addEventListener("pointerdown", (event) => {
    if (isInteractiveTarget(event.target) || !sceneReady) return;
    pointerGesture = { id: event.pointerId, startX: event.clientX, startY: event.clientY, dragged: false };
    elements.stage.setPointerCapture?.(event.pointerId);
    document.body.dataset.dragging = "true";
    document.body.dataset.pointerPhase = "press";
    scene.beginOrbit();
  });
  elements.stage.addEventListener("pointermove", (event) => {
    if (pointerGesture?.id === event.pointerId) {
      const distance = Math.hypot(event.clientX - pointerGesture.startX, event.clientY - pointerGesture.startY);
      pointerGesture.dragged ||= distance >= DRAG_THRESHOLD;
      if (pointerGesture.dragged) {
        document.body.dataset.pointerPhase = "drag";
        showHover(null);
        scene.dragOrbit(pointerGesture.startX, pointerGesture.startY, event.clientX, event.clientY);
      }
      return;
    }
    if (!isInteractiveTarget(event.target)) {
      document.body.dataset.pointerPhase = "hover";
      scene?.hoverAt(event.clientX, event.clientY);
    }
  });
  const endGesture = (event, cancelled = false) => {
    if (pointerGesture?.id !== event.pointerId) return;
    if (elements.stage.hasPointerCapture?.(event.pointerId)) elements.stage.releasePointerCapture(event.pointerId);
    const gesture = pointerGesture;
    pointerGesture = undefined;
    document.body.dataset.dragging = "false";
    document.body.dataset.pointerPhase = "release";
    if (!cancelled && !gesture.dragged) {
      const station = scene.selectAt(event.clientX, event.clientY);
      if (station) elements.status.textContent = `${station.name}新增 1,200 人次脉冲：局部压力开始沿换乘关系传播。`;
    } else if (!cancelled) {
      elements.status.textContent = "3D 观察角度已保留；轻点任一站点可注入客流，0 可回到英雄视角。";
    }
  };
  elements.stage.addEventListener("pointerup", (event) => endGesture(event));
  elements.stage.addEventListener("pointercancel", (event) => endGesture(event, true));
  elements.stage.addEventListener("pointerleave", () => { if (!pointerGesture) showHover(null); }, { passive: true });
  elements.stage.addEventListener("wheel", (event) => {
    if (isInteractiveTarget(event.target) || !sceneReady) return;
    event.preventDefault();
    scene.zoom(event.deltaY);
  }, { passive: false });

  elements.stage.addEventListener("keydown", (event) => {
    if (event.target !== elements.stage) return;
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      const station = scene?.selectNext(event.key === "ArrowRight" ? 1 : -1);
      if (station) elements.status.textContent = `已选择 ${station.name}；按 Enter 或空格注入客流。`;
      return;
    }
    if (event.key === "ArrowUp" || event.key === "ArrowDown") {
      event.preventDefault();
      scene?.beginOrbit();
      scene?.dragOrbit(0, 0, 0, event.key === "ArrowUp" ? -90 : 90);
      return;
    }
    if (event.key === "0") {
      event.preventDefault();
      elements.reset.click();
      return;
    }
    if (["Enter", " "].includes(event.key)) {
      event.preventDefault();
      injectSelected();
    }
  });
}

async function bootstrap() {
  installControls();
  setScenario(currentScenario, false, false);
  if (!navigator.gpu || forceFallback) {
    showFallback(forceFallback
      ? "正在预览无 WebGPU 降级状态：GPU 物理增强停用，构造数据、因果链、预设和导航保持可读。"
      : "当前浏览器没有暴露 WebGPU。请使用最新版 Chrome/Edge，并通过 localhost 或 HTTPS 访问。");
    return;
  }

  try {
    scene = new MetroPulseScene(elements.stage, { reducedMotion, onMetrics: updateMetrics, onHover: showHover, onSelect: setSelected });
    await scene.init((progress, label) => {
      elements.loadingLabel.textContent = label;
      elements.loading.style.setProperty("--progress", progress.toFixed(2));
    });
    const stats = scene.getStats();
    writeText(elements.stations, stats.stations);
    writeText(elements.constraints, stats.constraints);
    writeText(elements.packets, stats.packets);
    document.body.dataset.gpuVertices = String(stats.vertices);
    document.body.dataset.solverRate = String(stats.solverRate);
    document.body.dataset.runtime = "ready";
    sceneReady = true;
    globalThis.__AURELIA_METRO__ = scene;
    setScenario(currentScenario, false, false);
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
