import { ARCHITECTURE_LAYERS, CATEGORY_META, LEVEL_META, SKILLS, SKILL_SCENARIOS, WORKFLOW_SCENARIOS } from './data.js';

const state = { category: 'all', level: 'all', query: '' };

const grid = document.querySelector('#skill-grid');
const count = document.querySelector('#result-count');
const empty = document.querySelector('#empty-state');
const search = document.querySelector('#skill-search');
const levelFilter = document.querySelector('#level-filter');
const resetFilters = document.querySelector('#reset-filters');
const detailDialog = document.querySelector('#skill-dialog');
const mobileDialog = document.querySelector('#mobile-nav');

function visibleSkills() {
  const query = state.query.trim().toLocaleLowerCase('zh-CN');
  return SKILLS.filter((item) => {
    const categoryMatch = state.category === 'all' || item.category === state.category;
    const levelMatch = state.level === 'all' || item.level === state.level;
    const haystack = [item.name, item.title, item.summary, item.mechanism, item.input, item.output, item.boundary, item.value, ...item.deps].join(' ').toLocaleLowerCase('zh-CN');
    return categoryMatch && levelMatch && (!query || haystack.includes(query));
  });
}

function statusLabel(item) {
  if (item.status === 'experimental') return 'EXPERIMENTAL';
  if (item.status === 'deprecated') return 'DEPRECATED';
  if (item.kind === 'plugin') return 'PLUGIN';
  return '';
}

function renderSkills() {
  const results = visibleSkills();
  count.textContent = `显示 ${results.length} / ${SKILLS.length} 项`;
  grid.hidden = results.length === 0;
  empty.hidden = results.length !== 0;
  grid.replaceChildren(...results.map((item) => {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'skill-card';
    card.dataset.skill = item.name;
    card.dataset.status = item.status;
    card.setAttribute('aria-label', `查看 ${item.title} 详情`);
    const status = statusLabel(item);
    card.innerHTML = `
      <div class="skill-card-head">
        <span class="category-mark">${CATEGORY_META[item.category].mark} / ${CATEGORY_META[item.category].label}</span>
        <span class="level-mark" title="${LEVEL_META[item.level].label}">${LEVEL_META[item.level].code}</span>
      </div>
      <div><h3>${item.title}</h3><p class="skill-name">${item.name}</p></div>
      <p class="skill-card-summary">${item.summary}</p>
      <p class="skill-card-scene"><span>USE WHEN / 典型场景</span>${SKILL_SCENARIOS[item.name]}</p>
      <div class="card-footer"><span class="kind-label">${LEVEL_META[item.level].label}</span>${status ? `<span class="status-mark">${status}</span>` : ''}<span class="card-arrow" aria-hidden="true">↗</span></div>`;
    card.addEventListener('click', () => openSkill(item));
    return card;
  }));
}

function openSkill(item) {
  document.querySelector('#dialog-kicker').textContent = `${CATEGORY_META[item.category].label} · ${LEVEL_META[item.level].code} / ${LEVEL_META[item.level].label}`;
  document.querySelector('#dialog-title').textContent = item.title;
  document.querySelector('#dialog-summary').textContent = `${item.name}｜${item.summary}`;
  document.querySelector('#dialog-scenario').textContent = SKILL_SCENARIOS[item.name];
  document.querySelector('#dialog-input').textContent = item.input;
  document.querySelector('#dialog-output').textContent = item.output;
  document.querySelector('#dialog-mechanism').textContent = item.mechanism;
  document.querySelector('#dialog-deps').textContent = item.deps.join('；');
  document.querySelector('#dialog-boundary').textContent = item.boundary;
  document.querySelector('#dialog-value').textContent = item.value;
  document.querySelector('#dialog-source').href = item.source;
  detailDialog.showModal();
}

document.querySelectorAll('[data-category]').forEach((button) => {
  button.addEventListener('click', () => {
    state.category = button.dataset.category;
    document.querySelectorAll('[data-category]').forEach((candidate) => candidate.setAttribute('aria-pressed', String(candidate === button)));
    renderSkills();
  });
});

search.addEventListener('input', () => { state.query = search.value; renderSkills(); });
levelFilter.addEventListener('change', () => { state.level = levelFilter.value; renderSkills(); });
resetFilters.addEventListener('click', () => {
  state.category = 'all'; state.level = 'all'; state.query = '';
  search.value = ''; levelFilter.value = 'all';
  document.querySelectorAll('[data-category]').forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.category === 'all')));
  renderSkills(); search.focus();
});

document.querySelector('[data-close-dialog]').addEventListener('click', () => detailDialog.close());
detailDialog.addEventListener('click', (event) => {
  if (event.target === detailDialog) detailDialog.close();
});

const themeButton = document.querySelector('#theme-toggle');
const savedTheme = localStorage.getItem('yichen-atlas-theme');
if (savedTheme === 'light' || savedTheme === 'dark') document.documentElement.dataset.theme = savedTheme;

function syncThemeButton() {
  const isDark = document.documentElement.dataset.theme === 'dark';
  themeButton.setAttribute('aria-label', isDark ? '切换到浅色主题' : '切换到深色主题');
  themeButton.querySelector('.theme-symbol').textContent = isDark ? '◐' : '◑';
}

themeButton.addEventListener('click', () => {
  const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = next;
  localStorage.setItem('yichen-atlas-theme', next);
  syncThemeButton();
});
syncThemeButton();

document.querySelector('#mobile-menu').addEventListener('click', () => mobileDialog.showModal());
document.querySelector('[data-close-mobile]').addEventListener('click', () => mobileDialog.close());
mobileDialog.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => mobileDialog.close()));
mobileDialog.addEventListener('click', (event) => {
  if (event.target === mobileDialog) mobileDialog.close();
});

const scenarioTabs = document.querySelector('#scenario-tabs');
const flowSteps = document.querySelector('#flow-steps');
const runFlowButton = document.querySelector('#run-flow');
const resetFlowButton = document.querySelector('#reset-flow');
const flowState = {
  scenarioId: WORKFLOW_SCENARIOS[0].id,
  activeStep: 0,
  completedStep: -1,
  running: false,
  timer: null,
};

function activeScenario() {
  return WORKFLOW_SCENARIOS.find((scenario) => scenario.id === flowState.scenarioId) ?? WORKFLOW_SCENARIOS[0];
}

function stopFlow() {
  if (flowState.timer) window.clearInterval(flowState.timer);
  flowState.timer = null;
  flowState.running = false;
}

function stageState(index) {
  if (index <= flowState.completedStep) return 'complete';
  if (index === flowState.activeStep) return 'active';
  return 'queued';
}

function renderScenarioTabs() {
  scenarioTabs.replaceChildren(...WORKFLOW_SCENARIOS.map((scenario, index) => {
    const tab = document.createElement('button');
    const selected = scenario.id === flowState.scenarioId;
    tab.type = 'button';
    tab.className = 'scenario-tab';
    tab.id = `scenario-tab-${scenario.id}`;
    tab.dataset.scenario = scenario.id;
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-selected', String(selected));
    tab.setAttribute('aria-controls', 'step-inspector');
    tab.tabIndex = selected ? 0 : -1;
    tab.innerHTML = `<small>USE CASE 0${index + 1}</small>${scenario.label}`;
    tab.addEventListener('click', () => selectScenario(scenario.id));
    tab.addEventListener('keydown', (event) => {
      if (!['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      const current = WORKFLOW_SCENARIOS.findIndex((candidate) => candidate.id === scenario.id);
      let next = current;
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (current + 1) % WORKFLOW_SCENARIOS.length;
      if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (current - 1 + WORKFLOW_SCENARIOS.length) % WORKFLOW_SCENARIOS.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = WORKFLOW_SCENARIOS.length - 1;
      selectScenario(WORKFLOW_SCENARIOS[next].id, true);
    });
    return tab;
  }));
}

function selectScenario(scenarioId, moveFocus = false) {
  stopFlow();
  flowState.scenarioId = scenarioId;
  flowState.activeStep = 0;
  flowState.completedStep = -1;
  renderScenarioTabs();
  renderFlow();
  if (moveFocus) document.querySelector(`#scenario-tab-${scenarioId}`)?.focus();
}

function selectFlowStep(index) {
  stopFlow();
  flowState.activeStep = index;
  renderFlow();
}

function renderFlow() {
  const scenario = activeScenario();
  const stage = scenario.stages[flowState.activeStep] ?? scenario.stages[0];
  const scenarioIndex = WORKFLOW_SCENARIOS.findIndex((candidate) => candidate.id === scenario.id) + 1;
  const isComplete = flowState.completedStep === scenario.stages.length - 1;

  document.querySelector('#case-kicker').textContent = `USE CASE 0${scenarioIndex} / ${scenario.label}`;
  document.querySelector('#case-title').textContent = scenario.title;
  document.querySelector('#case-summary').textContent = scenario.summary;
  document.querySelector('#case-brief').textContent = scenario.brief;
  document.querySelector('#case-note').textContent = scenario.note;

  const progressValue = flowState.completedStep + 1;
  const progress = document.querySelector('#flow-progress');
  progress.max = scenario.stages.length;
  progress.value = progressValue;
  progress.textContent = `${progressValue} / ${scenario.stages.length}`;
  document.querySelector('#flow-fraction').textContent = `${progressValue} / ${scenario.stages.length}`;
  document.querySelector('#flow-status').textContent = isComplete
    ? '模拟流程完成 · 交付物已形成'
    : flowState.running
      ? `Agent 正在驱动第 ${flowState.activeStep + 1} 步`
      : `预览第 ${flowState.activeStep + 1} 步 · 可手动选择或播放`;

  runFlowButton.disabled = flowState.running;
  runFlowButton.innerHTML = flowState.running
    ? '正在驱动… <span aria-hidden="true">●</span>'
    : isComplete
      ? '重新播放 <span aria-hidden="true">↺</span>'
      : '播放完整流程 <span aria-hidden="true">▶</span>';

  flowSteps.replaceChildren(...scenario.stages.map((candidate, index) => {
    const button = document.createElement('button');
    const state = stageState(index);
    button.type = 'button';
    button.className = 'flow-step';
    button.dataset.state = state;
    button.setAttribute('aria-current', index === flowState.activeStep ? 'step' : 'false');
    button.setAttribute('aria-label', `第 ${index + 1} 步：${candidate.title}，${state === 'complete' ? '已完成' : state === 'active' ? '当前' : '等待'}`);
    button.innerHTML = `<span class="flow-step-index">${String(index + 1).padStart(2, '0')}</span><span><strong>${candidate.title}</strong><small>${candidate.phase}</small></span><i class="flow-step-state" aria-hidden="true"></i>`;
    button.addEventListener('click', () => selectFlowStep(index));
    return button;
  }));

  const currentState = stageState(flowState.activeStep);
  document.querySelector('#step-phase').textContent = `STEP ${String(flowState.activeStep + 1).padStart(2, '0')} / ${stage.phase}`;
  document.querySelector('#step-title').textContent = stage.title;
  document.querySelector('#step-state').textContent = currentState === 'complete' ? 'COMPLETE' : flowState.running ? 'RUNNING' : 'PREVIEW';
  document.querySelector('#step-state').dataset.state = currentState === 'complete' ? 'complete' : flowState.running ? 'active' : 'preview';
  document.querySelector('#step-decision').textContent = stage.decision;
  document.querySelector('#step-input').textContent = stage.input;
  document.querySelector('#step-operation').textContent = stage.operation;
  document.querySelector('#step-handoff').textContent = stage.handoff;
  document.querySelector('#step-guard').textContent = stage.guard;
  document.querySelector('#step-effect').textContent = stage.effect;
  document.querySelector('#step-sample').textContent = stage.sample;

  const skills = document.querySelector('#step-skills');
  skills.replaceChildren(...stage.skills.map((skillName) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'skill-chip';
    button.textContent = skillName;
    button.setAttribute('aria-label', `查看 ${skillName} 能力详情`);
    button.addEventListener('click', () => {
      const skillItem = SKILLS.find((candidate) => candidate.name === skillName);
      if (skillItem) openSkill(skillItem);
    });
    return button;
  }));

  const outcomes = document.querySelector('#flow-outcomes');
  outcomes.replaceChildren(...scenario.outcomes.map((outcome) => {
    const ready = flowState.completedStep >= outcome.unlockAt;
    const item = document.createElement('article');
    item.className = 'outcome-item';
    item.dataset.state = ready ? 'ready' : 'queued';
    item.innerHTML = `<span>${ready ? '✓ READY / 已形成' : '○ QUEUED / 待形成'}</span><h4>${outcome.title}</h4><p>${outcome.detail}</p>`;
    return item;
  }));

  const meaning = document.querySelector('#flow-meaning');
  meaning.replaceChildren(...scenario.meaning.map((label) => {
    const item = document.createElement('span');
    item.className = 'meaning-tag';
    item.textContent = label;
    return item;
  }));
}

runFlowButton.addEventListener('click', () => {
  stopFlow();
  const scenario = activeScenario();
  flowState.activeStep = 0;
  flowState.completedStep = -1;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    flowState.activeStep = scenario.stages.length - 1;
    flowState.completedStep = scenario.stages.length - 1;
    renderFlow();
    return;
  }

  flowState.running = true;
  renderFlow();
  flowState.timer = window.setInterval(() => {
    flowState.completedStep = flowState.activeStep;
    if (flowState.activeStep >= scenario.stages.length - 1) {
      stopFlow();
    } else {
      flowState.activeStep += 1;
    }
    renderFlow();
  }, 850);
});

resetFlowButton.addEventListener('click', () => {
  stopFlow();
  flowState.activeStep = 0;
  flowState.completedStep = -1;
  renderFlow();
  runFlowButton.focus();
});

renderScenarioTabs();
renderFlow();

const tabs = document.querySelector('#layer-tabs');
const panel = document.querySelector('#layer-panel');

function selectLayer(layerId, moveFocus = false) {
  const layer = ARCHITECTURE_LAYERS.find((candidate) => candidate.id === layerId) ?? ARCHITECTURE_LAYERS[0];
  tabs.querySelectorAll('[role="tab"]').forEach((tab) => {
    const active = tab.dataset.layer === layer.id;
    tab.setAttribute('aria-selected', String(active));
    tab.tabIndex = active ? 0 : -1;
    if (active && moveFocus) tab.focus();
  });
  panel.setAttribute('aria-labelledby', `layer-tab-${layer.id}`);
  panel.innerHTML = `<span class="layer-number">LAYER ${layer.index} / ${layer.name}</span><h3>${layer.title}</h3><p>${layer.body}</p><p class="layer-evidence">${layer.evidence}</p>`;
}

ARCHITECTURE_LAYERS.forEach((layer) => {
  const tab = document.createElement('button');
  tab.type = 'button';
  tab.className = 'layer-tab';
  tab.id = `layer-tab-${layer.id}`;
  tab.dataset.layer = layer.id;
  tab.setAttribute('role', 'tab');
  tab.setAttribute('aria-controls', 'layer-panel');
  tab.innerHTML = `<span class="layer-tab-index">${layer.index}</span><b>${layer.name}</b><span class="layer-tab-arrow" aria-hidden="true">→</span>`;
  tab.addEventListener('click', () => selectLayer(layer.id));
  tab.addEventListener('keydown', (event) => {
    if (!['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const index = ARCHITECTURE_LAYERS.findIndex((candidate) => candidate.id === layer.id);
    let next = index;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % ARCHITECTURE_LAYERS.length;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index - 1 + ARCHITECTURE_LAYERS.length) % ARCHITECTURE_LAYERS.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = ARCHITECTURE_LAYERS.length - 1;
    selectLayer(ARCHITECTURE_LAYERS[next].id, true);
  });
  tabs.append(tab);
});
selectLayer(ARCHITECTURE_LAYERS[0].id);

renderSkills();
