const flowTabs = [...document.querySelectorAll('[role="tab"][data-flow]')];
const flowPanel = document.querySelector('#flow-panel');
const flowLabel = document.querySelector('#flow-label');
const flowTitle = document.querySelector('#flow-title');
const flowSummary = document.querySelector('#flow-summary');
const flowSteps = document.querySelector('#flow-steps');
const nodes = [...document.querySelectorAll('[data-node]')];
const compactNav = document.querySelector('.compact-nav');
let flowData = [];

const fallbackFlows = [
  { id: 'upload', label: '上传与入库', title: '文件进入系统，媒体记录随之建立。', summary: '客户端分片上传，服务端合并文件、识别媒体类型并创建媒体记录。', nodes: ['creator', 'react', 'nginx', 'django', 'storage', 'postgres'], steps: ['分片上传', '合并原文件', '识别媒体类型', '写入元数据'] },
  { id: 'process', label: '异步处理', title: '耗时工作离开请求线程，进入任务队列。', summary: 'Django 将任务交给 Celery；FFmpeg 转码，Bento4 生成 HLS，Whisper 可选生成字幕。', nodes: ['django', 'redis', 'celery', 'ffmpeg', 'bento', 'whisper', 'storage', 'postgres'], steps: ['任务入队', '多规格转码', 'HLS 切片', '字幕与状态回写'] },
  { id: 'playback', label: '鉴权与播放', title: '先判断谁能看，再交付实际媒体。', summary: '访问请求经过 Nginx 与 Django 权限判断，再由 video.js 播放 HLS 或文件。', nodes: ['viewer', 'react', 'nginx', 'django', 'redis', 'storage'], steps: ['请求媒体', '校验可见性与权限', '读取 HLS/文件', '浏览器播放'] },
];

function renderFlow(flowId, moveFocus = false) {
  const flow = flowData.find((item) => item.id === flowId) || fallbackFlows.find((item) => item.id === flowId);
  if (!flow) return;
  const activeTab = flowTabs.find((tab) => tab.dataset.flow === flow.id);
  flowTabs.forEach((tab) => {
    const isActive = tab === activeTab;
    tab.setAttribute('aria-selected', String(isActive));
    tab.tabIndex = isActive ? 0 : -1;
  });
  nodes.forEach((node) => node.classList.toggle('active', flow.nodes.includes(node.dataset.node)));
  flowPanel.setAttribute('aria-labelledby', activeTab.id);
  flowLabel.textContent = `当前链路 · ${flow.label}`;
  flowTitle.textContent = flow.title || fallbackFlows.find((item) => item.id === flow.id)?.title || flow.label;
  flowSummary.textContent = flow.summary;
  flowSteps.replaceChildren(...flow.steps.map((step) => {
    const item = document.createElement('li');
    item.textContent = step;
    return item;
  }));
  if (moveFocus) activeTab.focus();
}

flowTabs.forEach((tab, index) => {
  tab.addEventListener('click', () => renderFlow(tab.dataset.flow));
  tab.addEventListener('keydown', (event) => {
    let nextIndex = index;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') nextIndex = (index + 1) % flowTabs.length;
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') nextIndex = (index - 1 + flowTabs.length) % flowTabs.length;
    else if (event.key === 'Home') nextIndex = 0;
    else if (event.key === 'End') nextIndex = flowTabs.length - 1;
    else return;
    event.preventDefault();
    renderFlow(flowTabs[nextIndex].dataset.flow, true);
  });
});

const checkerForm = document.querySelector('#checker-form');
const checkerResult = document.querySelector('#checker-result');
const resultLabel = document.querySelector('#result-label');
const resultTitle = document.querySelector('#result-title');
const resultCopy = document.querySelector('#result-copy');
const scorePositive = document.querySelector('#score-positive');
const scoreNegative = document.querySelector('#score-negative');

const messages = {
  idle: { label: '等待选择', title: '先勾选你的真实需求', copy: '我们会同时计算平台收益与引入成本，并对直播、DRM、轻量需求等硬边界优先提示。' },
  yes: { label: '建议进入技术验证', title: '需求与平台优势高度匹配', copy: '建议用真实媒体、权限角色和目标容量做一轮 PoC，同时验证升级、备份与恢复流程。' },
  conditional: { label: '条件采用', title: '有价值，但先处理关键缺口', copy: '保留 MediaCMS 作为候选底座；先验证存储、转码、许可证或特殊媒体能力，再决定是否进入生产。' },
  no: { label: '当前不建议采用', title: '完整平台的成本大于收益', copy: '优先选择播放器、对象存储、CDN 或专门的直播/DRM 服务；MediaCMS 可留作架构参考。' },
};

function renderDecision() {
  const checked = [...checkerForm.querySelectorAll('input:checked')];
  const positives = checked.filter((input) => input.name === 'needs');
  const risks = checked.filter((input) => input.name === 'risks');
  const positiveScore = positives.reduce((sum, input) => sum + Number(input.dataset.points), 0);
  const riskScore = risks.reduce((sum, input) => sum + Number(input.dataset.points), 0);
  const values = new Set(checked.map((input) => input.value));
  let state = 'idle';

  if (checked.length) {
    const lacksPlatformNeed = positiveScore < 3;
    const hardMismatch = values.has('live') || (values.has('simple') && !values.has('private'));
    if (hardMismatch && lacksPlatformNeed) state = 'no';
    else if (positiveScore >= 7 && riskScore <= 2) state = 'yes';
    else if (positiveScore >= 4 && positiveScore > riskScore) state = 'conditional';
    else if (positiveScore >= 3 && !hardMismatch) state = 'conditional';
    else state = 'no';
  }

  const message = messages[state];
  checkerResult.dataset.state = state;
  resultLabel.textContent = message.label;
  resultTitle.textContent = message.title;
  resultCopy.textContent = message.copy;
  scorePositive.textContent = `收益 ${positiveScore}`;
  scoreNegative.textContent = `成本 ${riskScore}`;
}

checkerForm.addEventListener('change', renderDecision);
checkerForm.addEventListener('reset', () => window.setTimeout(renderDecision, 0));

if (compactNav) {
  const summary = compactNav.querySelector('summary');
  compactNav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => compactNav.removeAttribute('open')));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && compactNav.open) {
      compactNav.removeAttribute('open');
      summary.focus();
    }
  });
}

function populateSources(evidence) {
  document.querySelectorAll('[data-meta="release"]').forEach((node) => { node.textContent = evidence.release; });
  document.querySelectorAll('[data-meta="commit"]').forEach((node) => { node.textContent = evidence.commitShort; });
  document.querySelectorAll('[data-meta="commit-full"]').forEach((node) => { node.textContent = evidence.commit; });
  const sourceList = document.querySelector('#source-list');
  sourceList.replaceChildren(...evidence.sources.map((source) => {
    const item = document.createElement('li');
    const anchor = document.createElement('a');
    anchor.href = source.url;
    anchor.target = '_blank';
    anchor.rel = 'noreferrer';
    anchor.textContent = source.label;
    item.append(anchor);
    return item;
  }));
  document.querySelector('#source-count').textContent = `${evidence.sources.length} 条`;
  document.querySelector('#evidence-status').textContent = `已加载 ${evidence.release} 固定提交证据 · ${evidence.capturedAt}`;
}

fetch('./upstream/evidence.json')
  .then((response) => {
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  })
  .then((evidence) => {
    flowData = evidence.flows;
    populateSources(evidence);
    renderFlow('upload');
  })
  .catch(() => {
    flowData = fallbackFlows;
    const status = document.querySelector('#evidence-status');
    status.textContent = '证据清单未加载；页面仍保留核心结论与官方仓库链接。';
    status.classList.add('is-error');
    renderFlow('upload');
  });
