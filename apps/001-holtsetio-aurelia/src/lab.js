import * as THREE from "three/webgpu";

import "./styles.css";
import "./lab.css";

const profiles = Object.freeze({
  eco: {
    name: "轻量",
    instanceCount: 1,
    stepsPerSecond: 120,
    pixelRatio: 1,
    planktonDensity: 0.008,
    bloomStrength: 0.28,
  },
  balanced: {
    name: "均衡",
    instanceCount: 3,
    stepsPerSecond: 240,
    pixelRatio: 1.25,
    planktonDensity: 0.014,
    bloomStrength: 0.36,
  },
  full: {
    name: "完整",
    instanceCount: 10,
    stepsPerSecond: 360,
    pixelRatio: 1.6,
    planktonDensity: 0.02,
    bloomStrength: 0.4,
  },
});

const requestedProfile = new URLSearchParams(window.location.search).get("profile");
const profileKey = Object.hasOwn(profiles, requestedProfile) ? requestedProfile : "balanced";
const profile = profiles[profileKey];

globalThis.__AURELIA_LAB_CONFIG__ = profile;
document.body.dataset.profile = profileKey;

const elements = {
  container: document.querySelector("#container"),
  runtimeLabel: document.querySelector("#runtime-label"),
  fpsLabel: document.querySelector("#fps-label"),
  loading: document.querySelector("#lab-loading"),
  loadingLabel: document.querySelector("#loading-label"),
  loadingProgress: document.querySelector("#loading-progress"),
  error: document.querySelector("#lab-error"),
  errorMessage: document.querySelector("#lab-error-message"),
  instances: document.querySelector("#metric-instances"),
  vertices: document.querySelector("#metric-vertices"),
  springs: document.querySelector("#metric-springs"),
  hz: document.querySelector("#metric-hz"),
  performanceFps: document.querySelector("#performance-fps"),
  performanceNote: document.querySelector("#performance-note"),
  modeExplanation: document.querySelector("#mode-explanation"),
  damping: document.querySelector("#damping"),
  dampingValue: document.querySelector("#damping-value"),
  bloom: document.querySelector("#bloom"),
  bloomValue: document.querySelector("#bloom-value"),
  simulation: document.querySelector('[data-action="simulation"]'),
};

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const numberFormat = new Intl.NumberFormat("zh-CN");
let app;
let conf;
let renderer;
let frameHandle;
let frameCount = 0;
let sampleStarted = performance.now();
let activeMode = "life";

document.querySelectorAll("[data-profile]").forEach((link) => {
  const isActive = link.dataset.profile === profileKey;
  if (isActive) link.setAttribute("aria-current", "page");
  link.addEventListener("click", () => {
    document.body.classList.add("is-switching-profile");
    elements.runtimeLabel.textContent = "重建 GPU 缓冲";
  });
});

function updateLoading(progress, delay = 70) {
  const normalized = Math.min(Math.max(progress, 0), 1);
  const stages = [
    [0.1, "建立场景与镜头"],
    [0.3, "分配物理缓冲"],
    [0.5, `生成 ${profile.instanceCount} 个实例`],
    [0.7, "烘焙弹簧邻接"],
    [0.9, "连接环境与光效"],
    [1, "完成实验管线"],
  ];
  elements.loadingLabel.textContent = stages.find(([threshold]) => normalized <= threshold)?.[1] ?? "完成";
  elements.loadingProgress.style.width = `${normalized * 100}%`;
  return new Promise((resolve) => window.setTimeout(resolve, delay));
}

function hideUpstreamPanels() {
  const panels = new Set([
    conf?.gui?.element,
    app?.info?.pane?.element,
    ...document.querySelectorAll(".tp-dfwv"),
  ]);
  panels.forEach((panel) => {
    if (!panel) return;
    const host = panel.parentElement === document.body ? panel : panel.parentElement;
    host.hidden = true;
    host.setAttribute("aria-hidden", "true");
  });
}

function showError(message) {
  hideUpstreamPanels();
  elements.loading.hidden = true;
  elements.error.hidden = false;
  elements.errorMessage.textContent = message;
  elements.runtimeLabel.textContent = "WebGPU 不可用";
  document.body.dataset.runtime = "unsupported";
  document.querySelectorAll("button, input").forEach((control) => { control.disabled = true; });
}

function createRenderer() {
  const instance = new THREE.WebGPURenderer({ antialias: true });
  instance.setPixelRatio(Math.min(window.devicePixelRatio, profile.pixelRatio));
  instance.setSize(window.innerWidth, window.innerHeight);
  instance.outputColorSpace = THREE.SRGBColorSpace;
  return instance;
}

function formatMetric(value) {
  if (value >= 1000) return `${(value / 1000).toFixed(value >= 10000 ? 1 : 2)}K`;
  return numberFormat.format(value);
}

function updateMetrics() {
  elements.instances.textContent = numberFormat.format(app.bridge.medusae.length);
  elements.vertices.textContent = formatMetric(app.physics.vertexCount);
  elements.springs.textContent = formatMetric(app.physics.springCount);
  elements.hz.textContent = `${profile.stepsPerSecond} Hz`;
}

function pulseMedusae() {
  app?.bridge.medusae.forEach((medusa, index) => {
    medusa.charge = Math.max(medusa.charge, 1 - index * 0.04);
  });
}

function setMode(mode) {
  if (!app) return;
  activeMode = mode;
  document.body.dataset.mode = mode;
  document.querySelectorAll("[data-mode]").forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.mode === mode));
  });

  const descriptions = {
    life: "生命视图：观察解析主动画如何牵引 GPU 次级运动。",
    structure: "结构视图：直接显示钟口、口腕和触手背后的弹簧约束。",
    energy: "能量视图：charge 同时提高收缩速度、冷色偏移与选择性 Bloom。",
  };

  conf.showVerletSprings = mode === "structure";
  app.bloomPass.strength.value = mode === "structure" ? 0.12 : mode === "energy" ? 0.72 : Number(elements.bloom.value);
  if (mode === "energy") pulseMedusae();
  elements.modeExplanation.textContent = descriptions[mode];
}

function setSimulation(running) {
  conf.runSimulation = running;
  elements.simulation.setAttribute("aria-pressed", String(running));
  elements.simulation.textContent = running ? "暂停模拟" : "继续模拟";
}

function resetView() {
  if (!app) return;
  app.camera.position.set(0, 0, 15);
  app.controls.target.set(0, 0, 0);
  app.controls.update();
}

function installControls() {
  document.querySelectorAll("[data-mode]").forEach((button) => {
    button.addEventListener("click", () => setMode(button.dataset.mode));
  });
  elements.simulation.addEventListener("click", () => setSimulation(!conf.runSimulation));
  document.querySelector('[data-action="pulse"]').addEventListener("click", pulseMedusae);
  document.querySelector('[data-action="reset"]').addEventListener("click", resetView);

  elements.damping.addEventListener("input", () => {
    const value = Number(elements.damping.value);
    app.physics.uniforms.dampening.value = value;
    elements.dampingValue.textContent = value.toFixed(4);
  });
  elements.bloom.addEventListener("input", () => {
    const value = Number(elements.bloom.value);
    elements.bloomValue.textContent = value.toFixed(2);
    if (activeMode === "life") app.bloomPass.strength.value = value;
  });
}

function updatePerformance(now) {
  frameCount += 1;
  const elapsed = now - sampleStarted;
  if (elapsed < 1000) return;

  const fps = Math.round((frameCount * 1000) / elapsed);
  const frameTime = elapsed / frameCount;
  elements.fpsLabel.textContent = `${fps} FPS`;
  elements.performanceFps.textContent = `${fps} FPS · ${frameTime.toFixed(1)} ms`;
  elements.performanceNote.textContent = fps >= 50
    ? "当前档位余量较充足；仍需在目标设备复测。"
    : fps >= 30
      ? "当前档位可交互；移动设备建议继续观察温升与持续帧率。"
      : "当前负载偏高；可以切换更低档位比较真实工作集。";
  document.body.dataset.performance = fps >= 50 ? "good" : fps >= 30 ? "fair" : "heavy";
  frameCount = 0;
  sampleStarted = now;
}

function startRenderLoop() {
  const clock = new THREE.Clock();
  const animate = async (now) => {
    const delta = clock.getDelta();
    const elapsed = clock.getElapsedTime();
    await app.update(delta, elapsed);
    updatePerformance(now);
    frameHandle = requestAnimationFrame(animate);
  };
  frameHandle = requestAnimationFrame(animate);
}

function resize() {
  renderer?.setSize(window.innerWidth, window.innerHeight);
  app?.resize(window.innerWidth, window.innerHeight);
}

async function bootstrap() {
  if (!navigator.gpu) {
    showError("当前浏览器没有暴露 WebGPU。请使用最新版 Chrome 或 Edge，并通过 localhost 或 HTTPS 访问。");
    return;
  }

  const [{ default: App }, confModule] = await Promise.all([
    import("@aurelia-upstream/app.js"),
    import("@aurelia-upstream/conf.js"),
  ]);
  conf = confModule.conf;
  renderer = createRenderer();
  if (!renderer.backend?.isWebGPUBackend) {
    showError("当前设备没有可用的 WebGPU Compute 后端，因此不伪装为等价的 WebGL 效果。");
    return;
  }

  renderer.domElement.setAttribute("aria-hidden", "true");
  elements.container.prepend(renderer.domElement);
  app = new App(renderer);
  await app.init(updateLoading);
  hideUpstreamPanels();

  elements.bloom.value = String(profile.bloomStrength);
  elements.bloomValue.textContent = profile.bloomStrength.toFixed(2);
  app.bloomPass.strength.value = profile.bloomStrength;
  updateMetrics();
  installControls();
  window.addEventListener("resize", resize, { passive: true });

  if (reducedMotion.matches) setSimulation(false);
  elements.runtimeLabel.textContent = `${profile.name}档运行中`;
  document.body.dataset.runtime = "ready";
  elements.loading.classList.add("is-complete");
  window.setTimeout(() => { elements.loading.hidden = true; }, 600);
  startRenderLoop();
}

window.addEventListener("pagehide", () => {
  if (frameHandle) cancelAnimationFrame(frameHandle);
  renderer?.dispose();
  delete globalThis.__AURELIA_LAB_CONFIG__;
}, { once: true });

bootstrap().catch((error) => {
  console.error(error);
  showError(error instanceof Error ? error.message : String(error));
});
