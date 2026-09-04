import "./weatherproof.css";
import { RainMembraneScene } from "./rain/scene.js";
import catalog from "./data/weatherproof-demo.json";

const { meta: dataMeta, metrics: evidenceMetrics, scenarios, products } = catalog;

const params = new URLSearchParams(location.search);
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches || params.get("motion") === "reduce";
const forceFallback = params.get("fallback") === "1";
const sceneHost = document.querySelector("#rain-experience");
const scenarioButtons = [...document.querySelectorAll("[data-scenario-option]")];
const productCards = [...document.querySelectorAll("[data-product-card]")];
const productButtons = [...document.querySelectorAll("[data-select-product]")];
const evidenceButtons = [...document.querySelectorAll("[data-evidence-metric]")];
const evidenceCanvas = document.querySelector("#evidence-chart");
const dialog = document.querySelector("#consult-dialog");
const form = document.querySelector("#consult-form");
const formView = document.querySelector("#consult-form-view");
const successView = document.querySelector("#consult-success");
const eventCount = document.querySelector("#event-count");
const lastEvent = document.querySelector("#last-event");
const events = [];
let scene;
let sceneReady = false;
let frameHandle;
let pointerGesture;
let activeEvidenceMetric = "tension";

document.body.dataset.motion = reducedMotion ? "reduce" : "full";
document.body.dataset.catalog = dataMeta.datasetId;

function modelLabel(product) {
  return product.code.replace("AF / ", "");
}

function hydrateCatalog() {
  document.querySelector("#dataset-id").textContent = dataMeta.datasetId;
  document.querySelector("#dataset-method").textContent = dataMeta.method;
  document.querySelector("#dataset-disclaimer").textContent = dataMeta.disclaimer;

  scenarioButtons.forEach((button) => {
    const weather = scenarios[button.dataset.scenarioOption]?.weather;
    if (!weather) return;
    button.querySelector("[data-scenario-reading]").textContent = `${weather.rainMmH} mm/h · ${weather.windMs} m/s`;
  });

  productCards.forEach((card) => {
    const product = products[card.dataset.productCard];
    if (!product) return;
    card.querySelector("[data-card-code]").textContent = `AF / ${String(product.profile.ribs).padStart(2, "0")}`;
    card.querySelector("[data-card-name]").textContent = product.name;
    card.querySelector("[data-card-model]").textContent = modelLabel(product);
    card.querySelector("[data-card-use]").textContent = product.pim.collection;
    Object.entries(product.scores).forEach(([score, value]) => {
      card.querySelector(`[data-card-score="${score}"]`).textContent = value;
    });
    card.querySelector("[data-card-price]").textContent = `¥${product.pim.demoPriceCny}`;
  });

  document.querySelectorAll("[data-compare-product]").forEach((cell) => {
    const product = products[cell.dataset.compareProduct];
    const field = cell.dataset.compareField;
    if (!product) return;
    cell.textContent = field === "price" ? `¥${product.pim.demoPriceCny}` : product[field];
  });
}

function drawEvidenceChart() {
  if (!evidenceCanvas) return;
  const metric = evidenceMetrics[activeEvidenceMetric];
  const context = evidenceCanvas.getContext("2d");
  const width = Math.max(320, Math.round(evidenceCanvas.clientWidth || 720));
  const height = Math.max(260, Math.round(evidenceCanvas.clientHeight || 340));
  const pixelRatio = Math.min(devicePixelRatio || 1, 2);
  evidenceCanvas.width = Math.round(width * pixelRatio);
  evidenceCanvas.height = Math.round(height * pixelRatio);
  context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  context.clearRect(0, 0, width, height);

  const bounds = { left: 48, top: 28, right: width - 18, bottom: height - 38 };
  const selectedProduct = products[document.body.dataset.product];
  const points = selectedProduct.test.curves[activeEvidenceMetric];
  const xMin = points[0][0];
  const xMax = points.at(-1)[0];
  const toX = (value) => bounds.left + (value - xMin) / (xMax - xMin) * (bounds.right - bounds.left);
  const toY = (value) => bounds.bottom - (value - metric.yMin) / (metric.yMax - metric.yMin) * (bounds.bottom - bounds.top);

  context.font = "10px Consolas, monospace";
  context.textBaseline = "middle";
  for (let tick = 0; tick <= 4; tick += 1) {
    const ratio = tick / 4;
    const y = bounds.top + ratio * (bounds.bottom - bounds.top);
    const value = Math.round(metric.yMax - ratio * (metric.yMax - metric.yMin));
    context.strokeStyle = "rgba(213, 235, 224, 0.12)";
    context.lineWidth = 1;
    context.beginPath();
    context.moveTo(bounds.left, y);
    context.lineTo(bounds.right, y);
    context.stroke();
    context.fillStyle = "rgba(156, 169, 163, 0.72)";
    context.textAlign = "right";
    context.fillText(`${value}${metric.yUnit}`, bounds.left - 8, y);
  }

  points.forEach(([value], index) => {
    const x = toX(value);
    context.strokeStyle = "rgba(213, 235, 224, 0.07)";
    context.beginPath();
    context.moveTo(x, bounds.top);
    context.lineTo(x, bounds.bottom);
    context.stroke();
    context.fillStyle = "rgba(156, 169, 163, 0.72)";
    context.textAlign = index === 0 ? "left" : index === points.length - 1 ? "right" : "center";
    context.fillText(`${value}${metric.xUnit}`, x, bounds.bottom + 18);
  });

  Object.entries(products).forEach(([productId, product]) => {
    const curve = product.test.curves[activeEvidenceMetric];
    const selected = productId === document.body.dataset.product;
    context.globalAlpha = selected ? 1 : 0.23;
    context.strokeStyle = product.profile.glowColor;
    context.lineWidth = selected ? 3 : 1.25;
    context.lineJoin = "round";
    context.lineCap = "round";
    context.beginPath();
    curve.forEach(([xValue, yValue], index) => {
      const x = toX(xValue);
      const y = toY(yValue);
      if (index === 0) context.moveTo(x, y);
      else context.lineTo(x, y);
    });
    context.stroke();
    if (selected) {
      curve.forEach(([xValue, yValue]) => {
        context.fillStyle = product.profile.glowColor;
        context.beginPath();
        context.arc(toX(xValue), toY(yValue), 3.5, 0, Math.PI * 2);
        context.fill();
      });
    }
  });
  context.globalAlpha = 1;
}

function renderEvidence() {
  const productId = document.body.dataset.product;
  const product = products[productId];
  const metric = evidenceMetrics[activeEvidenceMetric];
  if (!product || !metric) return;
  const { pim, test } = product;
  document.body.dataset.activeEvidenceMetric = activeEvidenceMetric;
  document.body.dataset.testBatch = test.batchId;
  document.querySelector("#evidence-batch").textContent = test.batchId;
  document.querySelector("#evidence-product-code").textContent = product.code;
  document.querySelector("#evidence-product-name").textContent = product.name;
  document.querySelector("#evidence-sku").textContent = pim.sku;
  document.querySelector("#evidence-price").textContent = `¥${pim.demoPriceCny}`;
  document.querySelector("#evidence-weight").textContent = `${pim.weightG} g`;
  document.querySelector("#evidence-stock").textContent = `${pim.availability.total} 件`;
  document.querySelector("#evidence-tension").textContent = `${test.summary.tension30Pct}%`;
  document.querySelector("#evidence-wind").textContent = `${test.summary.deflection17Mm} mm`;
  document.querySelector("#evidence-colorway").textContent = pim.colorway;
  document.querySelector("#evidence-stock-id").textContent = pim.availability.snapshotId;
  document.querySelector("#data-pim-source").textContent = pim.sku;
  document.querySelector("#data-lab-source").textContent = test.batchId;
  document.querySelector("#data-stock-source").textContent = pim.availability.snapshotId;
  document.querySelector("#data-stock-values").textContent = `合成总量 ${pim.availability.total} · 四区域快照`;
  document.querySelector("#curve-title").textContent = metric.label;
  document.querySelector("#curve-description").textContent = `三种数字样机的${metric.label}合成对照曲线；当前选中 ${modelLabel(product)}。`;
  document.querySelector("#evidence-x-heading").textContent = `${metric.xLabel} / ${metric.xUnit}`;
  document.querySelector("#evidence-y-heading").textContent = `${metric.yLabel} / ${metric.yUnit}`;
  evidenceButtons.forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.evidenceMetric === activeEvidenceMetric)));

  const legend = document.querySelector("#curve-legend");
  legend.replaceChildren(...Object.entries(products).map(([candidateId, candidate]) => {
    const item = document.createElement("li");
    const name = document.createElement("strong");
    const state = document.createElement("span");
    name.textContent = modelLabel(candidate);
    state.textContent = candidateId === productId ? "当前样机" : `${metric.summaryLabel} ${candidate.test.summary[metric.summaryKey]}${metric.yUnit}`;
    item.classList.toggle("is-current", candidateId === productId);
    item.append(name, state);
    return item;
  }));

  const tableBody = document.querySelector("#evidence-table tbody");
  tableBody.replaceChildren(...test.curves[activeEvidenceMetric].map(([xValue, yValue]) => {
    const row = document.createElement("tr");
    const xCell = document.createElement("td");
    const yCell = document.createElement("td");
    xCell.textContent = `${xValue} ${metric.xUnit}`;
    yCell.textContent = `${yValue} ${metric.yUnit}`;
    row.append(xCell, yCell);
    return row;
  }));
  evidenceCanvas.setAttribute("aria-label", `${modelLabel(product)}：${metric.label}，六个合成采样点`);
  drawEvidenceChart();
}

function renderScenarioEvidence(scenario) {
  const { weather } = scenario;
  document.querySelector("#data-weather-source").textContent = weather.sourceId;
  document.querySelector("#data-weather-values").textContent = `${weather.rainMmH} mm/h · ${weather.windMs} m/s · ${weather.temperatureC}°C`;
}

function track(type, detail = {}) {
  const entry = { type, detail, at: new Date().toISOString() };
  events.push(entry);
  window.__WEATHERPROOF_EVENTS__ = events;
  eventCount.textContent = String(events.length).padStart(2, "0");
  lastEvent.textContent = `${type} · ${Object.values(detail).join(" / ") || "weatherproof_home"}`;
}

function selectProduct(productId, source = "manual") {
  const product = products[productId];
  if (!product) return;
  document.body.dataset.product = productId;
  document.body.dataset.sceneProduct = product.profile.id;
  document.body.dataset.sceneRibs = String(product.profile.ribs);
  document.body.dataset.sceneRetention = product.profile.waterRetention.toFixed(2);
  productCards.forEach((card) => card.classList.toggle("is-selected", card.dataset.productCard === productId));
  productButtons.forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.selectProduct === productId)));
  document.querySelector("#recommendation-code").textContent = product.code;
  document.querySelector("#recommendation-name").textContent = product.name;
  document.querySelector("#recommendation-summary").textContent = product.summary;
  document.querySelector("#live-product").textContent = product.code.replace("AF / ", "");
  document.querySelector("#live-material").textContent = product.material;
  document.querySelector("#live-frame").textContent = `${product.profile.ribs} 骨`;
  document.querySelector("#twin-material").textContent = product.material;
  document.querySelector("#twin-structure").textContent = product.structure;
  document.querySelector("#twin-response").textContent = product.response;
  document.querySelector("#twin-tension").textContent = `${Math.round(product.profile.baseTension * 100)} / 100`;
  const recommendedProduct = scenarios[document.body.dataset.scenario]?.product;
  document.querySelector("#match-state-label").textContent = productId === recommendedProduct ? "当前推荐" : "正在查看";
  document.querySelector("#recommendation-reasons").replaceChildren(...product.reasons.map((reason) => {
    const item = document.createElement("li");
    item.textContent = reason;
    return item;
  }));
  if (sceneReady) {
    const applied = scene.setProductProfile(product.profile);
    document.body.dataset.sceneProduct = applied.id;
    if (source === "manual") scene.addImpact(-0.48, 0.22, 0.94, true);
  }
  renderEvidence();
  if (source === "manual") track("product_selected", { product: productId });
}

function selectScenario(scenarioId, source = "manual") {
  const scenario = scenarios[scenarioId];
  if (!scenario) return;
  document.body.dataset.scenario = scenarioId;
  scenarioButtons.forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.scenarioOption === scenarioId)));
  productCards.forEach((card) => card.classList.toggle("is-recommended", card.dataset.productCard === scenario.product));
  document.querySelector("#scenario-code").textContent = scenario.code;
  document.querySelector("#deep-lab-link").href = `./rain.html?mode=${scenario.labMode}`;
  document.querySelector("#scene-status-label").textContent = scenario.sceneLabel;
  renderScenarioEvidence(scenario);
  selectProduct(scenario.product, "recommendation");
  if (sceneReady) {
    scene.setIntensity(scenario.intensity);
    scene.addImpact(0.55, -0.22, scenarioId === "storm" ? 1.2 : 0.92, true);
  }
  if (source === "manual") track("scenario_selected", { scenario: scenarioId, recommendation: scenario.product });
}

function openDialog(event) {
  event?.preventDefault();
  formView.hidden = false;
  successView.hidden = true;
  form.reset();
  dialog.showModal();
  track("conversion_opened", { product: document.body.dataset.product });
}

function installBusinessControls() {
  scenarioButtons.forEach((button) => button.addEventListener("click", () => selectScenario(button.dataset.scenarioOption)));
  productButtons.forEach((button) => button.addEventListener("click", () => selectProduct(button.dataset.selectProduct)));
  document.querySelectorAll(".open-consult").forEach((link) => link.addEventListener("click", openDialog));
  document.querySelector("#dialog-close").addEventListener("click", () => dialog.close());
  document.querySelector("#success-close").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    track("conversion_submitted", { product: document.body.dataset.product, interest: data.get("interest") });
    formView.hidden = true;
    successView.hidden = false;
    successView.focus();
  });
}

function installEvidenceControls() {
  evidenceButtons.forEach((button) => button.addEventListener("click", () => {
    const nextMetric = button.dataset.evidenceMetric;
    if (!evidenceMetrics[nextMetric] || nextMetric === activeEvidenceMetric) return;
    activeEvidenceMetric = nextMetric;
    renderEvidence();
    track("evidence_metric_selected", { metric: nextMetric, product: document.body.dataset.product });
  }));
  const evidenceResizeObserver = new ResizeObserver(() => drawEvidenceChart());
  evidenceResizeObserver.observe(evidenceCanvas);
}

function installSceneControls() {
  const threshold = 7;
  sceneHost.addEventListener("pointerdown", (event) => {
    if (event.button !== 0 || !event.isPrimary) return;
    event.preventDefault();
    pointerGesture = { id: event.pointerId, startX: event.clientX, startY: event.clientY, lastX: event.clientX, lastY: event.clientY, dragged: false };
    sceneHost.setPointerCapture?.(event.pointerId);
    sceneHost.focus({ preventScroll: true });
    if (sceneReady) scene.setPointer(event.clientX, event.clientY);
  });
  sceneHost.addEventListener("pointermove", (event) => {
    if (!pointerGesture || pointerGesture.id !== event.pointerId) {
      if (sceneReady) scene.setPointer(event.clientX, event.clientY);
      return;
    }
    event.preventDefault();
    const distance = Math.hypot(event.clientX - pointerGesture.startX, event.clientY - pointerGesture.startY);
    if (!pointerGesture.dragged && distance >= threshold) {
      pointerGesture.dragged = true;
      if (sceneReady) scene.rotateCamera(event.clientX - pointerGesture.startX, event.clientY - pointerGesture.startY);
    } else if (pointerGesture.dragged) {
      if (sceneReady) scene.rotateCamera(event.clientX - pointerGesture.lastX, event.clientY - pointerGesture.lastY);
    }
    pointerGesture.lastX = event.clientX;
    pointerGesture.lastY = event.clientY;
  });
  const finishPointer = (event, cancelled = false) => {
    if (!pointerGesture || pointerGesture.id !== event.pointerId) return;
    const dragged = pointerGesture.dragged;
    if (sceneHost.hasPointerCapture?.(event.pointerId)) sceneHost.releasePointerCapture(event.pointerId);
    pointerGesture = undefined;
    if (dragged && sceneReady) scene.endCameraDrag();
    else if (!cancelled && sceneReady) scene.impactAtScreen(event.clientX, event.clientY, 1.05);
  };
  sceneHost.addEventListener("pointerup", (event) => finishPointer(event));
  sceneHost.addEventListener("pointercancel", (event) => finishPointer(event, true));
  sceneHost.addEventListener("pointerleave", () => { if (!pointerGesture && sceneReady) scene.clearPointer(); }, { passive: true });
  sceneHost.addEventListener("keydown", (event) => {
    const cameraKeys = { ArrowLeft: [-0.14, 0], ArrowRight: [0.14, 0], ArrowUp: [0, -0.08], ArrowDown: [0, 0.08] };
    if (cameraKeys[event.key]) {
      event.preventDefault();
      if (sceneReady) scene.nudgeCamera(...cameraKeys[event.key]);
    } else if (["Enter", " "].includes(event.key)) {
      event.preventDefault();
      if (sceneReady) scene.addImpact(0.4, 0.18, 1.08, true);
    }
  });
}

function renderMetrics(metrics) {
  document.querySelector("#live-water").textContent = `${Math.round(metrics.wetness * 100)}%`;
  document.querySelector("#live-tension").textContent = `${Math.round(metrics.tension * 100)}%`;
  document.body.dataset.sceneProduct = metrics.product.id;
  document.body.dataset.sceneRibs = String(metrics.product.ribs);
  document.body.dataset.sceneRetention = metrics.product.waterRetention.toFixed(2);
  document.body.dataset.frameMilliseconds = metrics.frameMilliseconds.toFixed(2);
}

async function bootstrapScene() {
  if (!navigator.gpu || forceFallback) {
    document.body.dataset.enhancement = "fallback";
    document.querySelector("#scene-status-label").textContent = "静态产品界面 / 物理增强不可用";
    return;
  }
  try {
    scene = new RainMembraneScene(sceneHost, { reducedMotion, onMetrics: renderMetrics });
    await scene.init();
    sceneReady = true;
    scene.setProductProfile(products[document.body.dataset.product].profile);
    scene.setIntensity(scenarios[document.body.dataset.scenario].intensity);
    document.body.dataset.enhancement = "ready";
    document.querySelector("#scene-status-label").textContent = scenarios[document.body.dataset.scenario].sceneLabel;
    const startedAt = performance.now();
    const animate = async (now) => {
      await scene?.update((now - startedAt) / 1000);
      frameHandle = requestAnimationFrame(animate);
    };
    frameHandle = requestAnimationFrame(animate);
    const resizeObserver = new ResizeObserver(() => scene?.resize());
    resizeObserver.observe(sceneHost);
  } catch (error) {
    console.error(error);
    sceneReady = false;
    scene = undefined;
    document.body.dataset.enhancement = "fallback";
    document.querySelector("#scene-status-label").textContent = "静态产品界面 / 物理增强初始化失败";
  }
}

hydrateCatalog();
installBusinessControls();
installEvidenceControls();
installSceneControls();
track("page_view", { page: "weatherproof_home" });
renderScenarioEvidence(scenarios.commute);
selectProduct("urban", "init");
bootstrapScene();

window.addEventListener("beforeunload", () => {
  sceneReady = false;
  cancelAnimationFrame(frameHandle);
  scene?.destroy();
});
