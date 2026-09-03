import * as THREE from "three/webgpu";
import App from "@aurelia-upstream/app.js";
import { conf } from "@aurelia-upstream/conf.js";

import "./styles.css";

THREE.ColorManagement.enabled = true;

const elements = {
  container: document.querySelector("#container"),
  veil: document.querySelector("#veil"),
  progressBar: document.querySelector("#progress-bar"),
  progress: document.querySelector("#progress"),
  loadingLabel: document.querySelector("#loading-label"),
  error: document.querySelector("#error"),
  runtimeLabel: document.querySelector("#runtime-label"),
  fpsLabel: document.querySelector("#fps-label"),
  tourCaption: document.querySelector("#tour-caption"),
  tourButton: document.querySelector('[data-action="tour"]'),
  simulationButton: document.querySelector('[data-action="simulation"]'),
  springsButton: document.querySelector('[data-action="springs"]'),
};

const loadingStages = [
  [0.1, "建立场景与镜头"],
  [0.3, "创建 GPU 物理缓冲"],
  [0.5, "编译程序化材质"],
  [0.6, "生成十只水母拓扑"],
  [0.7, "烘焙弹簧邻接关系"],
  [0.9, "连接雾、浮游物与光柱"],
  [1, "合成 MRT 与 Bloom"],
];

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let app;
let renderer;
let frameHandle;
let tourRun = 0;
let fpsFrameCount = 0;
let fpsSampleStarted = performance.now();

function loadingMessage(progress) {
  return loadingStages.find(([threshold]) => progress <= threshold)?.[1] ?? "完成";
}

function updateLoadingProgress(progress, delay = 80) {
  const normalized = Math.min(Math.max(progress, 0), 1);
  elements.progress.style.width = `${normalized * 100}%`;
  elements.loadingLabel.textContent = loadingMessage(normalized);
  return new Promise((resolve) => window.setTimeout(resolve, delay));
}

function showError(title, message) {
  hideUpstreamPanels();
  elements.veil.classList.add("has-error");
  elements.progressBar.hidden = true;
  elements.loadingLabel.hidden = true;
  elements.error.hidden = false;
  elements.error.innerHTML = `
    <strong>${title}</strong>
    <p>${message}</p>
    <p>说明内容仍可阅读；完整动态效果需要支持 WebGPU 的安全上下文浏览器。</p>
    <button class="error-dismiss" type="button">查看静态能力说明</button>
  `;
  elements.error.querySelector(".error-dismiss").addEventListener("click", () => {
    elements.veil.hidden = true;
  });
  elements.runtimeLabel.textContent = "WebGPU 不可用";
  document.body.dataset.runtime = title.includes("初始化失败") ? "error" : "unsupported";
}

function hideUpstreamPanels() {
  const panels = new Set([
    conf.gui?.element,
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

function createRenderer() {
  const instance = new THREE.WebGPURenderer({ antialias: true });
  instance.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
  instance.setSize(window.innerWidth, window.innerHeight);
  instance.outputColorSpace = THREE.SRGBColorSpace;
  return instance;
}

function resize() {
  renderer?.setSize(window.innerWidth, window.innerHeight);
  app?.resize(window.innerWidth, window.innerHeight);
}

function setButtonCopy(button, pressed, activeCopy, inactiveCopy) {
  button.setAttribute("aria-pressed", String(pressed));
  button.querySelector("small").textContent = pressed ? activeCopy : inactiveCopy;
}

function setSimulation(running) {
  conf.runSimulation = running;
  setButtonCopy(elements.simulationButton, running, "运行中", "已暂停");
  elements.simulationButton.querySelector(".control-icon").textContent = running ? "Ⅱ" : "▶";
}

function setSprings(visible) {
  conf.showVerletSprings = visible;
  setButtonCopy(elements.springsButton, visible, "显示弹簧", "隐藏弹簧");
  document.body.classList.toggle("showing-structure", visible);
}

function pulseMedusae() {
  if (!app) return;
  app.bridge.medusae.forEach((medusa, index) => {
    medusa.charge = Math.max(medusa.charge, 1 - index * 0.035);
  });
  elements.tourCaption.textContent = "交互状态：charge 同时改变收缩速度、颜色与 Bloom 强度。";
}

function resetView() {
  if (!app) return;
  app.camera.position.set(0, 0, 15);
  app.controls.target.set(0, 0, 0);
  app.controls.update();
  elements.tourCaption.textContent = "自由观察：拖动旋转，滚轮缩放，移动指针触发局部反应。";
}

function wait(milliseconds, runId) {
  const duration = reducedMotion.matches ? Math.min(milliseconds, 450) : milliseconds;
  return new Promise((resolve) => {
    window.setTimeout(() => resolve(runId === tourRun), duration);
  });
}

function markCapability(name) {
  document.querySelectorAll("[data-capability]").forEach((item) => {
    item.classList.toggle("is-active", item.dataset.capability === name);
  });
}

async function runTour() {
  if (!app || elements.tourButton.disabled) return;
  const runId = ++tourRun;
  elements.tourButton.disabled = true;
  elements.tourButton.textContent = "导览进行中";
  setSimulation(true);
  resetView();

  markCapability("shape");
  elements.tourCaption.textContent = "第一幕：钟形体由相位、极角与方位角实时求值。";
  if (!(await wait(2600, runId))) return;

  markCapability("physics");
  setSprings(true);
  elements.tourCaption.textContent = "第二幕：显示 GPU 弹簧网络，固定根节点跟随主体，其余节点自然拖尾。";
  if (!(await wait(3200, runId))) return;

  markCapability("surface");
  setSprings(false);
  elements.tourCaption.textContent = "第三幕：渲染网格直接读取物理缓冲，把离散点重建为连续表面。";
  if (!(await wait(2600, runId))) return;

  markCapability("light");
  pulseMedusae();
  elements.tourCaption.textContent = "第四幕：同一个 charge 状态驱动速度、冷色偏移与选择性 Bloom。";
  await wait(3200, runId);

  markCapability("");
  elements.tourCaption.textContent = "导览完成。现在可以自由旋转、缩放或显示弹簧结构。";
  elements.tourButton.disabled = false;
  elements.tourButton.textContent = "重新播放导览";
}

function installControls() {
  document.querySelector('[data-action="simulation"]').addEventListener("click", () => {
    ++tourRun;
    elements.tourButton.disabled = false;
    elements.tourButton.textContent = "开始能力导览";
    setSimulation(!conf.runSimulation);
  });
  document.querySelector('[data-action="springs"]').addEventListener("click", () => {
    setSprings(!conf.showVerletSprings);
  });
  document.querySelector('[data-action="pulse"]').addEventListener("click", pulseMedusae);
  document.querySelector('[data-action="reset"]').addEventListener("click", resetView);
  elements.tourButton.addEventListener("click", runTour);

  elements.container.addEventListener("pointermove", (event) => {
    if (event.pointerType !== "mouse") app?.onMouseMove(event);
  });
}

function updateFps(now) {
  fpsFrameCount += 1;
  const elapsed = now - fpsSampleStarted;
  if (elapsed < 750) return;
  const fps = Math.round((fpsFrameCount * 1000) / elapsed);
  elements.fpsLabel.textContent = `${fps} FPS`;
  fpsFrameCount = 0;
  fpsSampleStarted = now;
}

function startRenderLoop() {
  const clock = new THREE.Clock();
  const animate = async (now) => {
    const delta = clock.getDelta();
    const elapsed = clock.getElapsedTime();
    await app.update(delta, elapsed);
    updateFps(now);
    frameHandle = requestAnimationFrame(animate);
  };
  frameHandle = requestAnimationFrame(animate);
}

async function bootstrap() {
  if (!navigator.gpu) {
    showError("当前浏览器未暴露 WebGPU", "请使用已启用 WebGPU 的最新版 Chrome、Edge 或其他兼容浏览器，并通过 HTTPS 或 localhost 访问。");
    return;
  }

  renderer = createRenderer();
  if (!renderer.backend?.isWebGPUBackend) {
    showError("无法初始化 WebGPU 后端", "设备或浏览器可能只允许 WebGL。本演示需要 Compute Shader，因此不启用视觉降级。 ");
    return;
  }

  renderer.domElement.setAttribute("aria-hidden", "true");
  elements.container.prepend(renderer.domElement);
  app = new App(renderer);
  await app.init(updateLoadingProgress);
  hideUpstreamPanels();
  installControls();
  window.addEventListener("resize", resize, { passive: true });

  if (reducedMotion.matches) setSimulation(false);
  elements.runtimeLabel.textContent = "WebGPU 运行中";
  document.body.dataset.runtime = "ready";
  elements.veil.classList.add("is-complete");
  window.setTimeout(() => { elements.veil.hidden = true; }, 700);
  startRenderLoop();
}

window.addEventListener("pagehide", () => {
  if (frameHandle) cancelAnimationFrame(frameHandle);
  renderer?.dispose();
}, { once: true });

bootstrap().catch((error) => {
  console.error(error);
  showError("演示初始化失败", error instanceof Error ? error.message : String(error));
});
