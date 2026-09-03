const worlds = [
  {
    id: 'cosmic',
    title: 'Cosmic',
    label: '宇宙世界',
    renderer: 'Three.js / Perspective',
    description: '把滚动章节、开源项目和个人经历组织成一条穿过星系的叙事路线。',
    features: ['滚动驱动镜头', '项目集合导航', '多世界选择器'],
  },
  {
    id: 'archipelago',
    title: 'Archipelago',
    label: '群岛世界',
    renderer: 'Three.js + Vue HUD',
    description: '驾驶小船探索由作品生成的岛屿，并通过海上地标进入其他世界。',
    features: ['航行与移动端控制', '程序化海洋与岛屿', '三个 Portal 目标'],
  },
  {
    id: 'jianghu',
    title: 'Jianghu',
    label: '江湖世界',
    renderer: 'DOM / Sprite Scene',
    description: '用像素客栈和人物对话表现经历，证明 World 协议不等于 Three.js。',
    features: ['WASD / 触控移动', '角色接近与对话', 'DOM 生命周期适配'],
  },
  {
    id: 'linework',
    title: 'Linework',
    label: '线稿世界',
    renderer: 'Three.js / Orthographic',
    description: '在只有空间、光与线的白色房间中，通过可点击物件重新解释作品。',
    features: ['程序化房间', '几何边线后期', '展品命中检测'],
  },
  {
    id: 'studio',
    title: 'Studio',
    label: '工作室世界',
    renderer: 'Three.js / Perspective',
    description: '以彩色工作室承载项目展品、照片、灯光和多个可切换的世界入口。',
    features: ['昼夜与灯光', '项目展品面板', '三个动态 Portal'],
  },
  {
    id: 'assets',
    title: 'Asset Wall',
    label: '3D 资产墙',
    renderer: 'Multi-preview Gallery',
    description: '按世界筛选和预览程序化模型、场景零件、角色 Sprite 与源码位置。',
    features: ['按 World 筛选', '独立资产预览', '源码引用索引'],
  },
];

const scenarios = {
  brand: {
    verdict: 'STRONG FIT',
    title: '把经历变成可探索的品牌空间',
    copy: '当目标是建立记忆点，而不是最快完成任务时，多世界叙事能让作品、人物与价值观形成空间关系。',
    points: ['个人作品集', '工作室官网', '产品发布与品牌 Campaign'],
  },
  exhibition: {
    verdict: 'STRONG FIT',
    title: '让同一批展品拥有多种策展语言',
    copy: 'Content Kernel 保留展品事实，World Binding 可以把它们组织成地图、房间、时间线或角色网络。',
    points: ['数字博物馆', '企业文化展厅', '游戏化招聘体验'],
  },
  learning: {
    verdict: 'CONDITIONAL',
    title: '适合探索式学习，不替代清晰文档',
    copy: '空间路线和角色对话适合建立情境，但必须保留静态内容、进度提示与可访问的退出路径。',
    points: ['互动纪录片', '故事化课程', '复杂系统导览'],
  },
  dashboard: {
    verdict: 'POOR FIT',
    title: '高频业务操作不需要一座宇宙',
    copy: '表单、审批、数据查询和交易流程更需要密度、速度与可预测性；3D Runtime 会成为额外成本。',
    points: ['管理后台', 'ERP / CRM', '实时业务仪表盘'],
  },
};

const worldTabs = document.querySelector('[data-world-tabs]');
const liveFrame = document.querySelector('[data-live-frame]');
const loading = document.querySelector('[data-frame-loading]');
const liveUrl = document.querySelector('[data-live-url]');
const openLive = document.querySelector('[data-open-live]');

function worldUrl(world) {
  return world.id === 'assets'
    ? 'https://qiuner.github.io/3d-assets/'
    : `https://qiuner.github.io/?world=${world.id}`;
}

function selectWorld(world, index, forceReload = false) {
  const url = worldUrl(world);
  worldTabs.querySelectorAll('button').forEach((button) => {
    const active = button.dataset.world === world.id;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-selected', String(active));
  });
  document.querySelector('[data-world-index]').textContent =
    `${String(index + 1).padStart(2, '0')} / ${String(worlds.length).padStart(2, '0')}`;
  document.querySelector('[data-world-title]').textContent = world.title;
  document.querySelector('[data-world-description]').textContent = world.description;
  document.querySelector('[data-world-renderer]').textContent = world.renderer;
  document.querySelector('[data-world-features]').replaceChildren(
    ...world.features.map((feature) => {
      const item = document.createElement('li');
      item.textContent = feature;
      return item;
    }),
  );
  liveUrl.textContent = url.replace('https://', '');
  openLive.href = url;
  liveFrame.title = `Qiuner ${world.title} 实时展示`;
  loading.classList.remove('is-hidden');
  if (forceReload || liveFrame.src !== url) liveFrame.src = url;
}

worlds.forEach((world, index) => {
  const button = document.createElement('button');
  button.type = 'button';
  button.dataset.world = world.id;
  button.setAttribute('role', 'tab');
  button.setAttribute('aria-selected', String(index === 0));
  button.classList.toggle('is-active', index === 0);
  button.innerHTML = `<span>${String(index + 1).padStart(2, '0')}</span><strong>${world.title}</strong><small>${world.label}</small>`;
  button.addEventListener('click', () => selectWorld(world, index));
  worldTabs.append(button);
});

selectWorld(worlds[0], 0);
liveFrame.addEventListener('load', () => loading.classList.add('is-hidden'));
document.querySelector('[data-reload]').addEventListener('click', () => {
  const selected = worlds.findIndex((world) => worldUrl(world) === openLive.href);
  const index = selected >= 0 ? selected : 0;
  selectWorld(worlds[index], index, true);
});

document.querySelectorAll('[data-scenario]').forEach((button) => {
  button.addEventListener('click', () => {
    const scenario = scenarios[button.dataset.scenario];
    document.querySelectorAll('[data-scenario]').forEach((candidate) => {
      candidate.classList.toggle('is-active', candidate === button);
    });
    document.querySelector('[data-scenario-verdict]').textContent = scenario.verdict;
    document.querySelector('[data-scenario-title]').textContent = scenario.title;
    document.querySelector('[data-scenario-copy]').textContent = scenario.copy;
    document.querySelector('[data-scenario-points]').replaceChildren(
      ...scenario.points.map((point) => {
        const item = document.createElement('li');
        item.textContent = point;
        return item;
      }),
    );
  });
});
document.querySelector('[data-scenario="brand"]').click();

function formatNumber(value) {
  return new Intl.NumberFormat('zh-CN').format(value);
}

fetch('./upstream/meta.json')
  .then((response) => {
    if (!response.ok) throw new Error(`metadata ${response.status}`);
    return response.json();
  })
  .then((metadata) => {
    const values = {
      commit: metadata.commitShort,
      worlds: metadata.counts.worlds,
      portals: metadata.counts.portalRoutes,
      tests: metadata.verified.testCases,
      runtime: metadata.counts.runtimeModules,
      modules: formatNumber(metadata.counts.sourceModules),
      lines: formatNumber(metadata.counts.sourceLines),
      files: formatNumber(metadata.counts.trackedFiles),
      assets: formatNumber(metadata.counts.publicAssets),
      stack: `${metadata.stack.astro} / ${metadata.stack.three}`,
      license: metadata.license === 'not-declared' ? '未声明' : metadata.license,
      status: `已核对 ${metadata.commitShort} · ${metadata.capturedAt}`,
    };
    Object.entries(values).forEach(([key, value]) => {
      document.querySelectorAll(`[data-meta="${key}"]`).forEach((node) => {
        node.textContent = String(value);
      });
    });
  })
  .catch((error) => {
    document.querySelector('[data-meta="status"]').textContent = '证据元数据读取失败';
    console.error('[qiuner-atlas] Failed to load verified metadata:', error);
  });

const brandFilters = document.querySelector('[data-brand-filters]');
const brandProjects = document.querySelector('[data-brand-projects]');
const brandFilterSummary = document.querySelector('[data-brand-filter-summary]');
const proofLoad = document.querySelector('[data-proof-load]');
const proofSource = document.querySelector('[data-proof-source]');
const proofLive = document.querySelector('[data-brand-live]');
const proofFrame = document.querySelector('[data-proof-frame]');
const proofLoading = document.querySelector('[data-proof-loading]');
const proofOpen = document.querySelector('[data-proof-open]');
let brandData;
let activeBrandFilter = 'all';
let selectedBrandProject;

function renderAudience(audience) {
  document.querySelectorAll('[data-audience-tabs] button').forEach((button) => {
    const active = button.dataset.audience === audience.id;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-selected', String(active));
  });
  document.querySelector('[data-audience-need]').textContent = audience.need;
  document.querySelector('[data-audience-proposition]').textContent = audience.proposition;
  document.querySelector('[data-audience-deliverables]').replaceChildren(
    ...audience.deliverables.map((deliverable) => {
      const chip = document.createElement('span');
      chip.textContent = deliverable;
      return chip;
    }),
  );
  document.querySelector('[data-audience-proof]').replaceChildren(
    ...audience.proofIds.map((projectId) => {
      const chip = document.createElement('span');
      const project = brandData.projects.find((candidate) => candidate.id === projectId);
      chip.textContent = project ? `${project.id} ${project.title}` : projectId;
      return chip;
    }),
  );
}

function renderBrandSimulation(simulation) {
  document.querySelector('[data-sim-label]').textContent = simulation.label;
  document.querySelector('[data-sim-role]').textContent = simulation.role;
  document.querySelector('[data-sim-headline]').textContent = simulation.headline;
  document.querySelector('[data-sim-disclaimer]').textContent = simulation.disclaimer;
  document.querySelector('[data-sim-differentiators]').replaceChildren(
    ...simulation.differentiators.map((item) => {
      const listItem = document.createElement('li');
      listItem.textContent = item;
      return listItem;
    }),
  );
  document.querySelector('[data-sim-coverage]').replaceChildren(
    ...simulation.evidenceCoverage.map((coverage) => {
      const item = document.createElement('div');
      item.className = 'coverage-item';
      const label = document.createElement('strong');
      label.textContent = coverage.label;
      const score = document.createElement('b');
      score.textContent = String(coverage.score);
      const detail = document.createElement('small');
      detail.textContent = `${coverage.projectCount} 项证据 · ${coverage.validatedCount} 项已验证`;
      const progress = document.createElement('progress');
      progress.max = 100;
      progress.value = coverage.score;
      progress.setAttribute('aria-label', `${coverage.label}证据覆盖 ${coverage.score}`);
      item.append(label, score, detail, progress);
      return item;
    }),
  );

  const audienceTabs = document.querySelector('[data-audience-tabs]');
  audienceTabs.replaceChildren(
    ...simulation.audiences.map((audience, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.dataset.audience = audience.id;
      button.setAttribute('role', 'tab');
      button.setAttribute('aria-selected', String(index === 0));
      button.classList.toggle('is-active', index === 0);
      button.textContent = audience.label;
      button.addEventListener('click', () => renderAudience(audience));
      return button;
    }),
  );
  renderAudience(simulation.audiences[0]);
  document.querySelector('[data-sim-gaps]').replaceChildren(
    ...simulation.nextGaps.map((gap) => {
      const item = document.createElement('li');
      item.textContent = gap;
      return item;
    }),
  );
}

function capabilityLabel(id) {
  return brandData.capabilities.find((capability) => capability.id === id)?.label || id;
}

function statusLabel(status) {
  return status === 'validated' ? '已验证' : status === 'studying' ? '研究中' : status;
}

function localDemoUrl(project) {
  const local = ['127.0.0.1', 'localhost'].includes(window.location.hostname);
  return local
    ? `/__portfolio/${encodeURIComponent(project.slug)}/`
    : project.demo.url;
}

function closeBrandDemo() {
  proofFrame.src = 'about:blank';
  proofLive.hidden = true;
  proofLoading.classList.remove('is-hidden');
}

function selectBrandProject(project) {
  selectedBrandProject = project;
  brandProjects.querySelectorAll('button').forEach((button) => {
    const active = button.dataset.project === project.id;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-pressed', String(active));
  });

  document.querySelector('[data-proof-index]').textContent = `${project.id} / ${statusLabel(project.status)}`;
  document.querySelector('[data-proof-title]').textContent = project.title;
  document.querySelector('[data-proof-summary]').textContent = project.summary;
  document.querySelector('[data-proof-capabilities]').replaceChildren(
    ...project.capabilities.map((capability) => {
      const chip = document.createElement('span');
      chip.textContent = capabilityLabel(capability);
      return chip;
    }),
  );
  document.querySelector('[data-proof-tags]').replaceChildren(
    ...project.tags.slice(0, 7).map((tag) => {
      const chip = document.createElement('span');
      chip.textContent = tag;
      return chip;
    }),
  );

  const hasDemo = project.demo?.status === 'published';
  proofLoad.disabled = !hasDemo;
  proofLoad.textContent = hasDemo ? '在这里运行 Demo' : '暂无可运行 Demo';
  proofSource.href = project.repository;
  proofSource.removeAttribute('aria-disabled');
  proofOpen.href = hasDemo ? project.demo.url : project.repository;
  closeBrandDemo();
}

function renderBrandProjects() {
  const visibleProjects = brandData.projects.filter((project) =>
    activeBrandFilter === 'all' || project.capabilities.includes(activeBrandFilter),
  );
  const activeCapability = brandData.capabilities.find((capability) => capability.id === activeBrandFilter);
  brandFilterSummary.textContent = activeCapability
    ? `${visibleProjects.length} 个项目构成「${activeCapability.label}」的能力证据。`
    : `${visibleProjects.length} 个真实项目，共同构成一份可验证的能力档案。`;

  brandProjects.replaceChildren(
    ...visibleProjects.map((project) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'brand-project-card';
      button.dataset.project = project.id;
      button.setAttribute('aria-pressed', 'false');

      const index = document.createElement('span');
      index.textContent = `${project.id} / ${statusLabel(project.status)}`;
      const title = document.createElement('h4');
      title.textContent = project.title;
      const summary = document.createElement('p');
      summary.textContent = project.summary;
      const evidence = document.createElement('small');
      evidence.textContent = project.capabilities.map(capabilityLabel).join(' · ');
      button.append(index, title, summary, evidence);
      button.addEventListener('click', () => selectBrandProject(project));
      return button;
    }),
  );

  const nextSelection = visibleProjects.find((project) => project.id === selectedBrandProject?.id)
    || visibleProjects[0];
  if (nextSelection) selectBrandProject(nextSelection);
}

function renderBrandFilters() {
  const filters = [
    { id: 'all', label: '全部项目', signal: '完整证据链', projectCount: brandData.projects.length },
    ...brandData.capabilities,
  ];
  brandFilters.replaceChildren(
    ...filters.map((filter) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.classList.toggle('is-active', filter.id === activeBrandFilter);
      button.setAttribute('aria-pressed', String(filter.id === activeBrandFilter));
      const label = document.createElement('strong');
      label.textContent = filter.label;
      const signal = document.createElement('small');
      signal.textContent = filter.signal;
      const count = document.createElement('span');
      count.textContent = String(filter.projectCount).padStart(2, '0');
      button.append(label, signal, count);
      button.addEventListener('click', () => {
        activeBrandFilter = filter.id;
        brandFilters.querySelectorAll('button').forEach((candidate) => {
          const active = candidate === button;
          candidate.classList.toggle('is-active', active);
          candidate.setAttribute('aria-pressed', String(active));
        });
        renderBrandProjects();
      });
      return button;
    }),
  );
}

proofLoad.addEventListener('click', () => {
  if (!selectedBrandProject?.demo || selectedBrandProject.demo.status !== 'published') return;
  const url = localDemoUrl(selectedBrandProject);
  proofLive.hidden = false;
  proofLoading.classList.remove('is-hidden');
  proofFrame.title = `${selectedBrandProject.title} 真实 Demo`;
  proofFrame.src = url;
  document.querySelector('[data-proof-url]').textContent = url.replace(/^https?:\/\//, '');
  proofLive.scrollIntoView({ behavior: 'smooth', block: 'start' });
});
proofFrame.addEventListener('load', () => {
  if (proofFrame.src !== 'about:blank') proofLoading.classList.add('is-hidden');
});
document.querySelector('[data-proof-close]').addEventListener('click', () => {
  closeBrandDemo();
  proofLoad.focus();
});

fetch('./brand/case.json')
  .then((response) => {
    if (!response.ok) throw new Error(`brand case ${response.status}`);
    return response.json();
  })
  .then((data) => {
    brandData = data;
    document.querySelector('[data-brand-code]').textContent = data.profile.code;
    document.querySelector('[data-brand-title]').textContent = data.profile.title;
    document.querySelector('[data-brand-statement]').textContent = data.profile.statement;
    Object.entries(data.metrics).forEach(([key, value]) => {
      document.querySelector(`[data-brand-metric="${key}"]`).textContent = String(value).padStart(2, '0');
    });
    document.querySelector('[data-brand-source]').textContent = `${data.source} · ${data.generatedAt}`;
    renderBrandSimulation(data.simulation);
    renderBrandFilters();
    renderBrandProjects();
  })
  .catch((error) => {
    brandProjects.replaceChildren();
    const message = document.createElement('p');
    message.className = 'brand-loading';
    message.textContent = '真实项目目录读取失败，请重新构建展台。';
    brandProjects.append(message);
    brandFilterSummary.textContent = '无法生成能力映射。';
    console.error('[qiuner-atlas] Failed to load brand case:', error);
  });
