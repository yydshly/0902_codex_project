import { ProceduralAudioEngine } from "./morph/audio-engine.js";
import { CuttlefishScene } from "./cuttlefish/scene.js";
import "./cuttlefish.css";

const elements = {
  stage: document.querySelector("#cuttlefish-stage"),
  runtime: document.querySelector("#runtime-label"),
  fps: document.querySelector("#fps-label"),
  status: document.querySelector("#stage-status"),
  audio: document.querySelector("#audio-toggle"),
  signal: document.querySelector("#signal-trigger"),
  ink: document.querySelector("#ink-trigger"),
  structure: document.querySelector("#structure-toggle"),
  view: document.querySelector("#view-cycle"),
  reset: document.querySelector("#view-reset"),
  loading: document.querySelector("#loading"),
  error: document.querySelector("#runtime-error"),
  errorMessage: document.querySelector("#error-message"),
};

const params = new URLSearchParams(location.search);
const reducedMotion = params.get("motion") === "reduce" || matchMedia("(prefers-reduced-motion: reduce)").matches;
const forcedFallback = params.get("fallback") === "1";
document.body.dataset.motion = reducedMotion ? "reduced" : "full";

let scene;
let frameHandle;
let frameCount = 0;
let sampleStart = performance.now();
let metricSample = 0;
let pointerDown = false;
let pointerOrigin = null;
let pointerTravel = 0;
let structureVisible = false;
let viewIndex = 0;
let eventTimer;
let behaviorTimer;

function setStatus(message) {
  elements.status.textContent = message;
}

function updateAudioState({ state, detail, muted, playing }) {
  document.body.dataset.audio = state;
  elements.audio.setAttribute("aria-pressed", String(playing));
  elements.audio.querySelector(":scope > span:first-child").textContent = playing ? "Ⅱ" : "▶";
  elements.audio.querySelector("strong").textContent = playing ? "暂停声场" : "声场";
  elements.audio.querySelector("small").textContent = muted ? "MUTED" : playing ? "LISTENING" : "SOUND";
  if (state !== "locked" && detail) setStatus(detail);
}

const audio = new ProceduralAudioEngine(updateAudioState);
audio.setTempo(84);
audio.setVolume(0.42);
updateAudioState({ state: "locked", detail: "", muted: false, playing: false });

function setEvent(name, duration, message) {
  window.clearTimeout(eventTimer);
  document.body.dataset.event = name;
  setStatus(message);
  eventTimer = window.setTimeout(() => {
    document.body.dataset.event = "idle";
    if (name === "poke") document.body.dataset.poke = "idle";
    setStatus("移动指针：眼睛先看见你，皮肤随后产生局部信号。");
  }, reducedMotion ? Math.min(duration, 700) : duration);
}

function triggerSignal() {
  scene?.triggerSignal(1.15);
  setEvent("signal", 2100, "色素细胞波沿鳍缘传播；两条捕食触腕解束，末端触腕棒与吸盘张开。");
}

function triggerInk() {
  scene?.triggerInk();
  document.body.dataset.behavior = "defense";
  setEvent("ink", 4100, "墨云扩散，英雄个体喷射上浮，远景群体散开后重新聚合。");
}

function setStructure(value) {
  structureVisible = value;
  document.body.dataset.structure = value ? "on" : "off";
  elements.structure.setAttribute("aria-pressed", String(value));
  elements.structure.querySelector("small").textContent = value ? "VERLET ON" : "ANATOMY";
  scene?.setStructure(value);
  setStatus(value ? "青色结构线展示真实触腕弹簧与鳍膜横向支撑。" : "结构层已收起，回到完整皮肤与深海光场。");
}

const views = [
  { name: "hero", label: "HERO", message: "英雄视角：稳定三分之四构图，观察鳍巡航与整体轮廓。" },
  { name: "profile", label: "PROFILE", message: "侧面视角：检查外套膜厚度、鳍根、眼位与腕足前后关系。" },
  { name: "close", label: "CLOSE", message: "近景视角：检查皮肤、吸盘、触腕棒与喷射阶段。" },
];

function setView(index) {
  viewIndex = (index + views.length) % views.length;
  const view = views[viewIndex];
  document.body.dataset.view = view.name;
  elements.view.querySelector("small").textContent = view.label;
  scene?.setView(view.name);
  setEvent("inspect", 1700, view.message);
}

function isControl(event) {
  return event.target instanceof Element && Boolean(event.target.closest("button, a, input, select, summary"));
}

function pointerToScene(event, strength) {
  const rect = elements.stage.getBoundingClientRect();
  const x = (event.clientX - rect.left) / rect.width * 2 - 1;
  const y = -((event.clientY - rect.top) / rect.height * 2 - 1);
  elements.stage.style.setProperty("--pointer-x", `${x * 12}px`);
  elements.stage.style.setProperty("--pointer-y", `${-y * 8}px`);
  scene?.setPointer(x, y, strength);
  document.body.dataset.pointer = `${x.toFixed(2)},${y.toFixed(2)}`;
  if (document.body.dataset.event === "idle") {
    document.body.dataset.behavior = "observe";
    window.clearTimeout(behaviorTimer);
    behaviorTimer = window.setTimeout(() => {
      if (document.body.dataset.event === "idle") document.body.dataset.behavior = "glide";
    }, 720);
  }
  return { x, y };
}

function installControls() {
  elements.audio.addEventListener("click", async () => {
    await audio.toggle();
    if (!audio.supported) elements.audio.disabled = true;
  });
  elements.signal.addEventListener("click", triggerSignal);
  elements.ink.addEventListener("click", triggerInk);
  elements.structure.addEventListener("click", () => setStructure(!structureVisible));
  elements.view.addEventListener("click", () => setView(viewIndex + 1));
  elements.reset.addEventListener("click", () => {
    scene?.reset();
    viewIndex = 0;
    document.body.dataset.view = "hero";
    elements.view.querySelector("small").textContent = "HERO";
    setStructure(false);
    document.body.dataset.event = "idle";
    document.body.dataset.behavior = "glide";
    setStatus("视角、触腕能量与群体位置开始回到深潜状态。");
  });

  elements.stage.addEventListener("pointerdown", (event) => {
    if (isControl(event)) return;
    pointerDown = true;
    pointerOrigin = { x: event.clientX, y: event.clientY };
    pointerTravel = 0;
    elements.stage.classList.add("is-dragging");
    scene?.setInspecting(true);
    pointerToScene(event, 0.8);
  });
  elements.stage.addEventListener("pointermove", (event) => {
    if (!pointerDown && isControl(event)) return;
    if (pointerDown && pointerOrigin) {
      pointerTravel = Math.max(pointerTravel, Math.hypot(event.clientX - pointerOrigin.x, event.clientY - pointerOrigin.y));
    }
    pointerToScene(event, pointerDown ? 1 : 0.34);
  }, { passive: true });
  elements.stage.addEventListener("pointerup", (event) => {
    if (!pointerDown) return;
    pointerDown = false;
    elements.stage.classList.remove("is-dragging");
    scene?.setInspecting(false);
    pointerToScene(event, 0.22);
    if (pointerTravel > 12) setEvent("inspect", 1050, "视角随拖动转向；生命体仍在原空间持续巡游。");
  });
  elements.stage.addEventListener("pointercancel", () => {
    pointerDown = false;
    elements.stage.classList.remove("is-dragging");
    scene?.setInspecting(false);
  });
  elements.stage.addEventListener("click", (event) => {
    if (isControl(event) || pointerTravel > 12) return;
    const { x, y } = pointerToScene(event, 1.25);
    const result = scene?.poke(x, y);
    document.body.dataset.poke = result?.hit ? "body" : "water";
    document.body.dataset.behavior = "startle";
    setEvent(
      "poke",
      1900,
      result?.hit
        ? "局部触碰被感知：皮肤闪变，外套膜收缩喷射，腕足延迟甩开。"
        : "水体压力波掠过：乌贼转向并短促喷射避让。",
    );
  });

  addEventListener("keydown", (event) => {
    if (event.target instanceof HTMLButtonElement || event.target instanceof HTMLAnchorElement) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      triggerSignal();
    }
    if (event.key.toLowerCase() === "i") triggerInk();
    if (event.key.toLowerCase() === "p") {
      const result = scene?.poke(0, 0);
      document.body.dataset.poke = result?.hit ? "body" : "water";
      document.body.dataset.behavior = "startle";
      setEvent("poke", 1900, "中心压力波触发皮肤闪变、收缩喷射和腕足甩动。");
    }
    if (event.key.toLowerCase() === "s") setStructure(!structureVisible);
    if (event.key.toLowerCase() === "v") setView(viewIndex + 1);
    if (event.key.toLowerCase() === "m") audio.toggle();
    if (event.key === "0") elements.reset.click();
    if (event.key === "Escape") elements.reset.click();
  });
}

function showFallback(message) {
  document.body.dataset.runtime = "fallback";
  elements.runtime.textContent = "2D 墨光形态";
  elements.fps.textContent = "CSS MOTION";
  elements.loading.hidden = true;
  elements.error.hidden = false;
  elements.errorMessage.textContent = message;
  elements.view.disabled = true;
  elements.view.querySelector("small").textContent = "2D ONLY";
}

function updateMetrics(now) {
  frameCount += 1;
  const elapsed = now - sampleStart;
  if (now - metricSample >= 80) {
    const metrics = scene?.getMetrics();
    metricSample = now;
    if (metrics) {
      document.body.dataset.vertices = String(metrics.vertices);
      document.body.dataset.springs = String(metrics.springs);
      document.body.dataset.triangles = String(Math.round(metrics.triangles));
      document.body.dataset.suckers = String(metrics.suckers ?? 0);
      document.body.dataset.appendages = String(metrics.appendages ?? 0);
      document.body.dataset.signal = metrics.signal.toFixed(3);
      document.body.dataset.ink = metrics.ink.toFixed(3);
      document.body.dataset.pokeEnergy = metrics.poke.toFixed(3);
      document.body.dataset.behavior = metrics.behavior;
      document.body.dataset.locomotion = metrics.locomotion;
      document.body.dataset.escapeStage = metrics.escapeStage;
      document.body.dataset.view = metrics.view;
      if (metrics.camera) document.body.dataset.camera = `${metrics.camera.x.toFixed(2)},${metrics.camera.y.toFixed(2)},${metrics.camera.z.toFixed(2)}`;
      if (metrics.motion) {
        document.body.dataset.pose = `${metrics.motion.x.toFixed(2)},${metrics.motion.y.toFixed(2)},${metrics.motion.rotation.toFixed(2)},${metrics.motion.squeeze.toFixed(3)},${metrics.motion.thrust.toFixed(3)},${metrics.motion.fin.toFixed(3)}`;
        document.body.dataset.dynamics = `${metrics.motion.speed.toFixed(3)},${metrics.motion.alignment.toFixed(3)},${metrics.motion.radialScale.toFixed(3)},${metrics.motion.axialScale.toFixed(3)},${metrics.motion.wake.toFixed(3)}`;
        document.body.dataset.anatomyMotion = `${metrics.motion.escapePhase.toFixed(3)},${metrics.motion.deploy.toFixed(3)},${metrics.motion.yaw.toFixed(3)},${metrics.motion.pitch.toFixed(3)}`;
      }
    }
  }
  if (elapsed < 900) return;
  const fps = Math.round(frameCount * 1000 / elapsed);
  elements.fps.textContent = `${fps} FPS`;
  document.body.dataset.fps = String(fps);
  frameCount = 0;
  sampleStart = now;
}

function startLoop() {
  const started = performance.now();
  const animate = async (now) => {
    const time = (now - started) / 1000;
    if (scene) await scene.update(time, audio.getBands(), audio.playing);
    updateMetrics(now);
    frameHandle = requestAnimationFrame(animate);
  };
  frameHandle = requestAnimationFrame(animate);
}

async function bootstrap() {
  installControls();
  setStructure(false);
  if (forcedFallback || !navigator.gpu) {
    showFallback(forcedFallback ? "这是主动触发的能力降级路径。" : "当前浏览器没有暴露 WebGPU，请使用最新版 Chrome / Edge 与 localhost 或 HTTPS。");
    return;
  }
  scene = new CuttlefishScene(elements.stage, { reducedMotion });
  await scene.init();
  addEventListener("resize", () => scene?.resize(), { passive: true });
  document.body.dataset.runtime = "ready";
  elements.runtime.textContent = "WebGPU 生命体运行中";
  elements.loading.classList.add("is-complete");
  window.setTimeout(() => { elements.loading.hidden = true; }, 650);
  sampleStart = performance.now();
  frameCount = 0;
  startLoop();
}

addEventListener("pagehide", () => {
  if (frameHandle) cancelAnimationFrame(frameHandle);
  window.clearTimeout(behaviorTimer);
  scene?.dispose();
  audio.destroy();
}, { once: true });

bootstrap().catch((error) => {
  console.error(error);
  showFallback(error instanceof Error ? error.message : String(error));
});
