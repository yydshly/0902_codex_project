import "./atlas.css";

document.documentElement.dataset.enhanced = "true";

const directionNames = {
  "01": "01 声场雕塑",
  "02": "02 活体品牌",
  "03": "03 可演奏空间",
  "04": "04 引力织体",
  "05": "05 数据生命网络",
  "06": "06 记忆合金",
  "07": "07 声学黑洞",
  "08": "08 拓扑气候",
  "09": "09 晶体语法",
  "10": "10 群体字形",
};

const directionCards = [...document.querySelectorAll(".plan-card")];
const directionFilters = [...document.querySelectorAll("[data-status-filter]")];
const directionCount = document.querySelector("#direction-count");
const directionEmpty = document.querySelector("#direction-empty");
const moduleCards = [...document.querySelectorAll(".module-card")];
const moduleFilters = [...document.querySelectorAll("[data-module-filter]")];
const moduleCount = document.querySelector("#module-count");
const moduleEmpty = document.querySelector("#module-empty");
const observationCards = [...document.querySelectorAll(".observation-card")];
const observationFilters = [...document.querySelectorAll("[data-observation-filter]")];
const observationCount = document.querySelector("#observation-count");
const inspector = document.querySelector(".case-inspector");
const inspectorFields = {
  index: document.querySelector("#inspector-index"),
  title: document.querySelector("#inspector-title"),
  signal: document.querySelector("#inspector-signal"),
  model: document.querySelector("#inspector-model"),
  variables: document.querySelector("#inspector-variables"),
  products: document.querySelector("#inspector-products"),
  directions: document.querySelector("#inspector-directions"),
};

function setPressed(buttons, activeButton) {
  buttons.forEach((button) => button.setAttribute("aria-pressed", String(button === activeButton)));
}

function applyDirectionFilter(filter, activeButton) {
  let visible = 0;
  directionCards.forEach((card) => {
    const filtered = filter !== "all" && card.dataset.status !== filter;
    card.dataset.filtered = String(filtered);
    if (!filtered) visible += 1;
  });
  setPressed(directionFilters, activeButton);
  directionCount.textContent = String(visible).padStart(2, "0");
  directionEmpty.hidden = visible !== 0;
}

directionFilters.forEach((button) => {
  button.addEventListener("click", () => applyDirectionFilter(button.dataset.statusFilter, button));
});

function applyModuleFilter(filter, activeButton) {
  let visible = 0;
  moduleCards.forEach((card) => {
    const types = card.dataset.type.split(",");
    const filtered = filter !== "all" && !types.includes(filter);
    card.dataset.filtered = String(filtered);
    if (!filtered) visible += 1;
  });
  setPressed(moduleFilters, activeButton);
  moduleCount.textContent = String(visible).padStart(2, "0");
  moduleEmpty.hidden = visible !== 0;
}

moduleFilters.forEach((button) => {
  button.addEventListener("click", () => applyModuleFilter(button.dataset.moduleFilter, button));
});

function parseList(value) {
  return value.split(",").map((item) => item.trim()).filter(Boolean);
}

function setRelated(selector, attribute, values) {
  document.querySelectorAll(selector).forEach((element) => {
    element.classList.toggle("is-related", values.includes(element.dataset[attribute]));
  });
}

function clearSelection({ updateHash = true } = {}) {
  observationCards.forEach((card) => {
    card.classList.remove("is-selected");
    card.querySelector(".case-open").setAttribute("aria-pressed", "false");
  });
  directionCards.forEach((card) => card.classList.remove("is-related"));
  moduleCards.forEach((card) => card.classList.remove("is-related"));
  document.querySelectorAll(".tech-card").forEach((card) => card.classList.remove("is-related"));
  inspector.classList.remove("is-active");
  inspectorFields.index.textContent = "SELECT AN OBSERVATION";
  inspectorFields.title.textContent = "选择一个现实观察";
  inspectorFields.signal.textContent = "我们会从生活现象中提取可计算的因果关系，并把它连接到现有方向、技术层和交互模块。";
  inspectorFields.model.textContent = "锚点 / 节点 / 约束 / 场 / 冲击 / 记忆";
  inspectorFields.variables.textContent = "连续参数 + 离散事件 + 时间状态";
  inspectorFields.products.textContent = "品牌、空间、城市、环境与公共体验";
  inspectorFields.directions.textContent = "选择后显示对应方向";
  if (updateHash && location.hash.startsWith("#case-")) history.replaceState(null, "", `${location.pathname}${location.search}`);
}

function applyObservationFilter(filter, activeButton) {
  let visible = 0;
  let selectedWasHidden = false;
  observationCards.forEach((card) => {
    const mechanisms = parseList(card.dataset.mechanism);
    const filtered = filter !== "all" && !mechanisms.includes(filter);
    card.dataset.filtered = String(filtered);
    if (!filtered) visible += 1;
    if (filtered && card.classList.contains("is-selected")) selectedWasHidden = true;
  });
  if (selectedWasHidden) clearSelection();
  setPressed(observationFilters, activeButton);
  observationCount.textContent = String(visible).padStart(2, "0");
}

observationFilters.forEach((button) => {
  button.addEventListener("click", () => applyObservationFilter(button.dataset.observationFilter, button));
});

function selectObservation(card, { updateHash = true, reveal = true } = {}) {
  const directions = parseList(card.dataset.directions);
  const technologies = parseList(card.dataset.tech);
  const modules = parseList(card.dataset.modules);
  observationCards.forEach((item) => {
    const selected = item === card;
    item.classList.toggle("is-selected", selected);
    item.querySelector(".case-open").setAttribute("aria-pressed", String(selected));
  });
  setRelated(".plan-card", "direction", directions);
  setRelated(".tech-card", "tech", technologies);
  setRelated(".module-card", "module", modules);
  inspector.classList.add("is-active");
  inspectorFields.index.textContent = card.querySelector("header span").textContent;
  inspectorFields.title.textContent = card.dataset.title;
  inspectorFields.signal.textContent = card.dataset.signal;
  inspectorFields.model.textContent = card.dataset.model;
  inspectorFields.variables.textContent = card.dataset.variables;
  inspectorFields.products.textContent = card.dataset.products;
  inspectorFields.directions.textContent = directions.map((direction) => directionNames[direction]).join(" / ");
  if (updateHash) history.replaceState(null, "", `#${card.id}`);
  if (reveal && matchMedia("(max-width: 1050px)").matches) {
    inspector.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
  }
}

observationCards.forEach((card) => {
  card.querySelector(".case-open").addEventListener("click", () => selectObservation(card));
});
document.querySelector("#inspector-reset").addEventListener("click", () => clearSelection());

function applyHashSelection() {
  if (!location.hash.startsWith("#case-")) return;
  const card = document.querySelector(location.hash);
  if (card?.classList.contains("observation-card")) selectObservation(card, { updateHash: false, reveal: false });
}

window.addEventListener("hashchange", applyHashSelection);
applyHashSelection();

const sectionLinks = [...document.querySelectorAll(".chapter-rail [data-section]")];
const sections = sectionLinks.map((link) => document.querySelector(`#${link.dataset.section}`)).filter(Boolean);
if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver((entries) => {
    const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    sectionLinks.forEach((link) => {
      const active = link.dataset.section === visible.target.id;
      link.classList.toggle("is-active", active);
      if (active) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
  }, { rootMargin: "-24% 0px -58%", threshold: [0, 0.12, 0.35] });
  sections.forEach((section) => sectionObserver.observe(section));
}

let scrollFrame = 0;
function updateScrollProgress() {
  scrollFrame = 0;
  const scrollable = document.documentElement.scrollHeight - innerHeight;
  const progress = scrollable > 0 ? Math.min(Math.max(scrollY / scrollable, 0), 1) : 0;
  document.documentElement.style.setProperty("--scroll-progress", progress.toFixed(4));
}
window.addEventListener("scroll", () => {
  if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScrollProgress);
}, { passive: true });
updateScrollProgress();
