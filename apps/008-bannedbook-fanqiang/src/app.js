const states = [
  {
    id: 'empty',
    label: '无节点',
    code: 'STATE / 00',
    status: 'EMPTY',
    title: '没有节点，代理服务不会启动',
    activeSteps: [],
    currentStep: null,
    decision: '提示用户导入节点',
    copy: '控制逻辑已经存在，但没有可用代理档案，数据面不会启动。本地缓存仍然可以继续阅读。',
    facts: ['本地 5888 端口未监听', '不会把空节点误报成普通网络故障', '已有文章仍可离线打开'],
  },
  {
    id: 'testing',
    label: '正在测速',
    code: 'STATE / 01',
    status: 'TESTING',
    title: '应用正在比较候选节点',
    activeSteps: [0, 1, 2, 3],
    currentStep: 3,
    decision: '执行 URL 测试并比较延迟',
    copy: '这是 FQNews2 的控制面在做选择：读取已保存档案、测试可用性，再从成功结果中挑选延迟最低者。',
    facts: ['测速只是某一时刻的网络结果', '失败节点当前会进入删除路径', '成熟实现应增加失败计数和冷却时间'],
  },
  {
    id: 'connected',
    label: '正常工作',
    code: 'STATE / 02',
    status: 'CONNECTED',
    title: 'RSS 请求已通过本地代理',
    activeSteps: [0, 1, 2, 3, 4, 5, 6, 7],
    currentStep: 7,
    decision: '使用最低延迟可用节点',
    copy: 'FQNews2 选择节点并生成配置，sing-box 监听 127.0.0.1:5888。OkHttp 只连接这个本地端口，远端协议、加密和转发由内核完成。',
    facts: ['应用负责选择，内核负责连接', '代理范围仅限 FQNews2 自己的请求', '成功抓取的文章会进入缓存'],
  },
  {
    id: 'failed',
    label: '节点失败',
    code: 'STATE / 03',
    status: 'DEGRADED',
    title: '当前节点不可用，需要重新选择',
    activeSteps: [0, 1, 2, 3],
    currentStep: 3,
    decision: '回到候选集合重新测试',
    copy: '现有代码具备重新测试和选择的基础，但删除失败节点过于激进。网络抖动、DNS 故障或测试站异常都可能造成误判。',
    facts: ['应区分瞬时失败和永久失效', '应加入退避、熔断与恢复探测', '切换原因需要进入可观测日志'],
  },
  {
    id: 'offline',
    label: '离线阅读',
    code: 'STATE / 04',
    status: 'OFFLINE',
    title: '网络不可用，但阅读仍可继续',
    activeSteps: [7],
    currentStep: 7,
    decision: '跳过网络，读取本地缓存',
    copy: 'FQNews2 的产品价值不止于“连上代理”。缓存让用户在节点或网络失效时仍能完成阅读任务。',
    facts: ['页面不会假装网络仍然可用', '保留最后一次成功同步的文章', '联网恢复后再测速和同步'],
  },
];

const flowSteps = [
  { label: '收到节点链接', owner: '输入', group: 'input', description: '用户或订阅提供' },
  { label: '解析节点格式', owner: '控制面', group: 'control', description: '转成统一档案' },
  { label: '保存代理档案', owner: '控制面', group: 'control', description: '进入候选列表' },
  { label: '测试可用性', owner: '控制面', group: 'control', description: '比较 URL 延迟' },
  { label: '选择并生成配置', owner: '控制面', group: 'control', description: '决定使用哪个节点' },
  { label: '启动 sing-box', owner: '数据面', group: 'data', description: '内核开始工作' },
  { label: '监听本地 :5888', owner: '数据面', group: 'data', description: '提供 mixed 代理' },
  { label: '抓取 RSS / 读缓存', owner: '业务层', group: 'business', description: 'OkHttp 完成内容任务' },
];

const stateTabs = document.querySelector('[data-state-tabs]');
const requestFlow = document.querySelector('[data-request-flow]');

function createFlowStep(step, index) {
  const item = document.createElement('article');
  item.className = `flow-step group-${step.group}`;
  item.dataset.step = String(index);

  const top = document.createElement('div');
  const number = document.createElement('span');
  number.textContent = String(index + 1).padStart(2, '0');
  const owner = document.createElement('b');
  owner.textContent = step.owner;
  top.append(number, owner);

  const title = document.createElement('strong');
  title.textContent = step.label;
  const description = document.createElement('small');
  description.textContent = step.description;
  item.append(top, title, description);
  return item;
}

requestFlow.replaceChildren(...flowSteps.map(createFlowStep));

function selectState(state, moveFocus = false) {
  stateTabs.querySelectorAll('button').forEach((button) => {
    const active = button.dataset.state === state.id;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-selected', String(active));
    button.tabIndex = active ? 0 : -1;
    if (active && moveFocus) button.focus();
  });

  const status = document.querySelector('[data-runtime-status]');
  document.querySelector('[data-runtime-code]').textContent = state.code;
  document.querySelector('[data-runtime-title]').textContent = state.title;
  document.querySelector('[data-runtime-decision]').textContent = state.decision;
  status.textContent = state.status;
  status.dataset.status = state.id;
  document.querySelector('[data-runtime-copy]').textContent = state.copy;
  document.querySelector('[data-runtime-facts]').replaceChildren(
    ...state.facts.map((fact) => {
      const item = document.createElement('li');
      item.textContent = fact;
      return item;
    }),
  );

  requestFlow.querySelectorAll('.flow-step').forEach((step, index) => {
    const active = state.activeSteps.includes(index);
    step.classList.toggle('is-active', active);
    step.classList.toggle('is-current', state.currentStep === index);
    step.classList.toggle('is-bypassed', state.id === 'offline' && index < 7);
  });
}

states.forEach((state) => {
  const button = document.createElement('button');
  button.type = 'button';
  button.dataset.state = state.id;
  button.setAttribute('role', 'tab');
  button.setAttribute('aria-selected', String(state.id === 'connected'));
  button.tabIndex = state.id === 'connected' ? 0 : -1;
  button.classList.toggle('is-active', state.id === 'connected');

  const statusDot = document.createElement('span');
  statusDot.setAttribute('aria-hidden', 'true');
  const label = document.createElement('strong');
  label.textContent = state.label;
  button.append(statusDot, label);
  button.addEventListener('click', () => selectState(state));
  stateTabs.append(button);
});

stateTabs.addEventListener('keydown', (event) => {
  if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
  event.preventDefault();
  const activeIndex = states.findIndex((state) => stateTabs.querySelector(`[data-state="${state.id}"]`)?.classList.contains('is-active'));
  let nextIndex = activeIndex;
  if (event.key === 'ArrowLeft') nextIndex = (activeIndex - 1 + states.length) % states.length;
  if (event.key === 'ArrowRight') nextIndex = (activeIndex + 1) % states.length;
  if (event.key === 'Home') nextIndex = 0;
  if (event.key === 'End') nextIndex = states.length - 1;
  selectState(states[nextIndex], true);
});

selectState(states.find((state) => state.id === 'connected'));

const compactNav = document.querySelector('.compact-nav');
const compactNavSummary = compactNav?.querySelector('summary');

compactNav?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => compactNav.removeAttribute('open'));
});

compactNav?.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape' || !compactNav.open) return;
  event.preventDefault();
  compactNav.removeAttribute('open');
  compactNavSummary?.focus();
});

document.addEventListener('click', (event) => {
  if (compactNav?.open && !compactNav.contains(event.target)) compactNav.removeAttribute('open');
});

fetch('./upstream/evidence.json')
  .then((response) => {
    if (!response.ok) throw new Error(`evidence ${response.status}`);
    return response.json();
  })
  .then((evidence) => {
    document.querySelectorAll('[data-meta="commit"]').forEach((node) => {
      node.textContent = evidence.commitShort;
    });
    document.querySelector('[data-meta="status"]').textContent =
      `已固定 ${evidence.commitShort} · ${evidence.capturedAt} · ${evidence.sources.length} 条源码入口`;
    document.querySelector('[data-evidence-list]').replaceChildren(
      ...evidence.sources.map((source, index) => {
        const link = document.createElement('a');
        link.href = source.url;
        link.target = '_blank';
        link.rel = 'noreferrer';
        const number = document.createElement('span');
        number.textContent = String(index + 1).padStart(2, '0');
        const label = document.createElement('strong');
        label.textContent = source.label;
        const type = document.createElement('small');
        type.textContent = '查看源码 ↗';
        link.append(number, label, type);
        return link;
      }),
    );
  })
  .catch((error) => {
    document.querySelector('[data-meta="status"]').textContent = '证据快照读取失败，请重新构建页面。';
    console.error('[fanqiang-atlas] Failed to load evidence:', error);
  });
