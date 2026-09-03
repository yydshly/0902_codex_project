import { ProceduralAudioEngine } from "./morph/audio-engine.js";
import { LivingIdentityScene } from "./identity/scene.js";
import "./identity.css";

const elements = {
  stage: document.querySelector("#identity-stage"),
  audioToggle: document.querySelector("#audio-toggle"),
  structureToggle: document.querySelector("#structure-toggle"),
  muteToggle: document.querySelector("#mute-toggle"),
  cohesion: document.querySelector("#cohesion"),
  cohesionValue: document.querySelector("#cohesion-value"),
  reset: document.querySelector("#identity-reset"),
  audioStatus: document.querySelector("#audio-status"),
  structureNote: document.querySelector("#structure-note"),
  loading: document.querySelector("#identity-loading"),
  loadingLabel: document.querySelector("#loading-label"),
  error: document.querySelector("#identity-error"),
  errorMessage: document.querySelector("#identity-error-message"),
  fps: document.querySelector("#render-fps"),
  nodes: document.querySelector("#node-count"),
  constraints: document.querySelector("#constraint-count"),
  solver: document.querySelector("#solver-rate"),
  bands: {
    low: { root: document.querySelector('[data-band="low"]'), output: document.querySelector("#low-value") },
    mid: { root: document.querySelector('[data-band="mid"]'), output: document.querySelector("#mid-value") },
    high: { root: document.querySelector('[data-band="high"]'), output: document.querySelector("#high-value") },
  },
};

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
document.body.dataset.motion = reducedMotion ? "reduced" : "full";
document.body.dataset.pointer = "idle";
let scene;
let frameHandle;
let frames = 0;
let sampleStarted = performance.now();

function updateAudioState({ state, detail, muted, playing }) {
  document.body.dataset.audio = state;
  elements.audioStatus.textContent = detail;
  elements.audioToggle.setAttribute("aria-pressed", String(playing));
  elements.audioToggle.querySelector(".control-symbol").textContent = playing ? "Ⅱ" : "▶";
  elements.audioToggle.querySelector("strong").textContent = playing ? "暂停声场" : state === "locked" ? "启动声场" : "继续声场";
  elements.audioToggle.querySelector("small").textContent = playing ? `${audio.tempo} BPM · 拓扑实时受力` : "解锁原创程序化音乐";
  elements.muteToggle.setAttribute("aria-pressed", String(muted));
  elements.muteToggle.querySelector(".control-symbol").textContent = muted ? "○" : "◖";
  elements.muteToggle.querySelector("small").textContent = muted ? "静音" : "有声";
}

function updateStructureState({ mode, progress = 0 }) {
  document.body.dataset.structure = mode;
  const expanded = mode === "deconstructed" || mode === "deconstructing";
  elements.structureToggle.setAttribute("aria-pressed", String(expanded));
  elements.structureToggle.querySelector("strong").textContent = expanded ? "召回字形" : "解构品牌";
  elements.structureToggle.querySelector("small").textContent = expanded ? "启动形状记忆" : "展开三维轨道";
  const percentage = Math.round(progress * 100);
  if (mode === "deconstructed") elements.structureNote.textContent = "ORBITAL：七个字母拓扑已展开；移动指针可扰动局部轨道节点。";
  else if (mode === "deconstructing") elements.structureNote.textContent = `TRANSITION：空间拓扑正在展开 ${percentage}%`;
  else if (mode === "recalling") elements.structureNote.textContent = `RECALL：记忆锚点正在重建字形 ${100 - percentage}%`;
  else elements.structureNote.textContent = "COHERENT：移动指针靠近字形，可拨动自由节点；离开后由记忆弹簧召回。";
}

const audio = new ProceduralAudioEngine(updateAudioState);
updateAudioState({
  state: "locked",
  detail: "音乐尚未启动；可以先解构品牌，观察形状记忆。",
  muted: false,
  playing: false,
});
updateStructureState({ mode: "coherent", progress: 0 });

function updateBands(bands) {
  Object.entries(elements.bands).forEach(([name, item]) => {
    const value = Math.min(Math.max(bands[name], 0), 1);
    item.root.style.setProperty("--band", value.toFixed(3));
    item.output.textContent = value.toFixed(2);
  });
}

function updateFps(now) {
  frames += 1;
  const elapsed = now - sampleStarted;
  if (elapsed < 900) return;
  elements.fps.textContent = String(Math.round(frames * 1000 / elapsed));
  frames = 0;
  sampleStarted = now;
}

function showVisualError(error) {
  document.body.dataset.runtime = "unsupported";
  elements.loading.hidden = true;
  elements.error.hidden = false;
  elements.errorMessage.textContent = error;
  [elements.structureToggle, elements.cohesion, elements.reset].forEach((control) => { control.disabled = true; });
}

function installControls() {
  elements.audioToggle.addEventListener("click", async () => {
    const started = await audio.toggle();
    if (!audio.supported) {
      elements.audioToggle.disabled = true;
      elements.muteToggle.disabled = true;
      elements.audioStatus.textContent = "当前浏览器不支持 Web Audio；品牌说明仍然可读。";
    } else if (started) {
      scene?.signal("audio");
    }
  });
  elements.muteToggle.addEventListener("click", () => audio.setMuted(!audio.muted));
  elements.structureToggle.addEventListener("click", () => scene?.toggleStructure());
  elements.cohesion.addEventListener("input", () => {
    const value = Number(elements.cohesion.value);
    scene?.setCohesion(value);
    elements.cohesionValue.textContent = `${Math.round(value * 100)}%`;
  });
  elements.reset.addEventListener("click", () => scene?.recall(true));
  elements.stage.addEventListener("pointermove", (event) => {
    if (event.target.closest("a, button, input, label")) {
      scene?.clearPointer();
      document.body.dataset.pointer = "idle";
      return;
    }
    scene?.setPointer(event.clientX, event.clientY);
    document.body.dataset.pointer = "active";
  }, { passive: true });
  elements.stage.addEventListener("pointerleave", () => {
    scene?.clearPointer();
    document.body.dataset.pointer = "idle";
  }, { passive: true });
}

function startLoop() {
  const startedAt = performance.now();
  const animate = async (now) => {
    const elapsed = (now - startedAt) / 1000;
    const bands = audio.getBands();
    updateBands(bands);
    if (scene) {
      await scene.update(elapsed, bands, audio.playing);
      updateFps(now);
    }
    frameHandle = requestAnimationFrame(animate);
  };
  frameHandle = requestAnimationFrame(animate);
}

async function bootstrap() {
  installControls();
  if (!navigator.gpu) {
    showVisualError("当前浏览器没有暴露 WebGPU。请使用最新版 Chrome/Edge，并通过 localhost 或 HTTPS 访问；声音与语义界面仍可使用。");
    startLoop();
    return;
  }

  try {
    scene = new LivingIdentityScene(elements.stage, {
      reducedMotion,
      onStructureChange: updateStructureState,
    });
    await scene.init((progress, label) => {
      elements.loadingLabel.textContent = label;
      elements.loading.style.setProperty("--progress", progress.toFixed(2));
    });
    globalThis.__AURELIA_IDENTITY__ = scene;
    const stats = scene.getStats();
    elements.nodes.textContent = stats.labels.nodes;
    elements.constraints.textContent = stats.labels.springs;
    elements.solver.textContent = String(stats.solverRate);
    document.body.dataset.quality = stats.quality < 1 ? "reduced" : "full";
    document.body.dataset.runtime = "ready";
    elements.loading.classList.add("is-complete");
    sampleStarted = performance.now();
    window.addEventListener("resize", () => scene?.resize(), { passive: true });
  } catch (error) {
    console.error(error);
    scene = undefined;
    showVisualError(`初始化失败：${error.message}`);
  }
  startLoop();
}

bootstrap();

window.addEventListener("beforeunload", () => {
  cancelAnimationFrame(frameHandle);
  audio.destroy();
  scene?.destroy();
});
