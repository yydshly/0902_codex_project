const UPSTREAM_COMMIT = '34dc39cb5128776b594754624fa2202d5942a35b';

const state = {
  catalog: [],
  filtered: [],
  category: 'all',
  topic: 'all',
  query: '',
  lastTrigger: null,
};

const isFileProtocol = window.location.protocol === 'file:';
let cardImageObserver = null;

const elements = {
  categoryList: document.querySelector('#category-list'),
  catalogGrid: document.querySelector('#catalog-grid'),
  emptyState: document.querySelector('#empty-state'),
  loadStatus: document.querySelector('#load-status'),
  resetFilters: document.querySelector('#reset-filters'),
  resultsCount: document.querySelector('#results-count'),
  searchInput: document.querySelector('#search-input'),
  taxonomyMap: document.querySelector('#taxonomy-map'),
  topicSelect: document.querySelector('#topic-select'),
  dialog: document.querySelector('#detail-dialog'),
  dialogImage: document.querySelector('#dialog-image'),
  dialogId: document.querySelector('#dialog-id'),
  dialogName: document.querySelector('#dialog-name'),
  dialogCategory: document.querySelector('#dialog-category'),
  dialogCategorySlug: document.querySelector('#dialog-category-slug'),
  dialogSubcategorySlug: document.querySelector('#dialog-subcategory-slug'),
  dialogDimensions: document.querySelector('#dialog-dimensions'),
  dialogHash: document.querySelector('#dialog-hash'),
  dialogSource: document.querySelector('#dialog-source'),
  protocolWarning: document.querySelector('#protocol-warning'),
};

function normalize(value) {
  return String(value).normalize('NFKC').toLocaleLowerCase('zh-CN').trim();
}

function categoryNumber(slug) {
  return slug.slice(0, 2);
}

function uniqueBy(items, key) {
  return [...new Map(items.map((item) => [item[key], item])).values()];
}

function countBy(items, key, value) {
  return items.filter((item) => item[key] === value).length;
}

function sourceUrl(item) {
  const encodedPath = item.image
    .split('/')
    .map((part) => encodeURIComponent(part))
    .join('/');
  return `https://github.com/nevertoday/350-layout-compositions/blob/${UPSTREAM_COMMIT}/${encodedPath}`;
}

function renderCategoryList() {
  const categories = uniqueBy(state.catalog, 'category_slug');
  const fragment = document.createDocumentFragment();
  const allButton = document.createElement('button');
  allButton.type = 'button';
  allButton.dataset.category = 'all';
  allButton.className = 'category-button is-active';
  allButton.setAttribute('aria-pressed', 'true');
  allButton.innerHTML = '<span>00</span><strong>全部分类</strong><em>350</em>';
  fragment.append(allButton);

  for (const item of categories) {
    const count = state.catalog.filter((entry) => entry.category_slug === item.category_slug).length;
    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.category = item.category_slug;
    button.className = 'category-button';
    button.setAttribute('aria-pressed', 'false');

    const index = document.createElement('span');
    index.textContent = categoryNumber(item.category_slug);
    const name = document.createElement('strong');
    name.textContent = item.category;
    const total = document.createElement('em');
    total.textContent = String(count);
    button.append(index, name, total);
    fragment.append(button);
  }

  elements.categoryList.replaceChildren(fragment);
}

function renderTaxonomyMap() {
  const categories = uniqueBy(state.catalog, 'category_slug');
  const fragment = document.createDocumentFragment();

  for (const category of categories) {
    const categoryItems = state.catalog.filter(
      (item) => item.category_slug === category.category_slug,
    );
    const topics = uniqueBy(categoryItems, 'subcategory_slug');
    const article = document.createElement('article');
    article.className = 'taxonomy-category';

    const heading = document.createElement('div');
    heading.className = 'taxonomy-category-heading';
    const index = document.createElement('span');
    index.textContent = categoryNumber(category.category_slug);
    const title = document.createElement('h3');
    title.textContent = category.category;
    const total = document.createElement('strong');
    total.textContent = `${categoryItems.length} 项`;
    heading.append(index, title, total);

    const topicList = document.createElement('div');
    topicList.className = 'taxonomy-topic-list';
    for (const topic of topics) {
      const button = document.createElement('button');
      button.type = 'button';
      button.dataset.category = category.category_slug;
      button.dataset.topic = topic.subcategory_slug;
      button.className = 'taxonomy-topic';
      button.setAttribute('aria-pressed', 'false');
      const topicName = document.createElement('span');
      topicName.textContent = topic.subcategory;
      const topicTotal = document.createElement('em');
      topicTotal.textContent = String(
        countBy(categoryItems, 'subcategory_slug', topic.subcategory_slug),
      );
      button.append(topicName, topicTotal);
      topicList.append(button);
    }

    article.append(heading, topicList);
    fragment.append(article);
  }

  elements.taxonomyMap.replaceChildren(fragment);
}

function renderTopicOptions() {
  const source = state.category === 'all'
    ? state.catalog
    : state.catalog.filter((item) => item.category_slug === state.category);
  const topics = uniqueBy(source, 'subcategory_slug');
  const fragment = document.createDocumentFragment();
  const all = document.createElement('option');
  all.value = 'all';
  all.textContent = `全部主题（${topics.length}）`;
  fragment.append(all);

  for (const topic of topics) {
    const option = document.createElement('option');
    option.value = topic.subcategory_slug;
    option.textContent = `${topic.subcategory}（${countBy(source, 'subcategory_slug', topic.subcategory_slug)}）`;
    fragment.append(option);
  }

  elements.topicSelect.replaceChildren(fragment);
  elements.topicSelect.value = state.topic;
}

function makeCard(item) {
  const article = document.createElement('article');
  article.className = 'catalog-card';

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'card-button';
  button.setAttribute('aria-label', `查看上游目录条目 ${item.id} ${item.name}`);

  const imageWrap = document.createElement('span');
  imageWrap.className = 'card-image-wrap';
  const image = document.createElement('img');
  image.dataset.src = `./upstream/thumbs/${item.id}.jpg`;
  image.alt = `上游编号 ${item.id} 的教学海报；目录标注为${item.name}，图片语义尚未独立校验`;
  image.loading = 'lazy';
  image.width = 480;
  image.height = 640;
  imageWrap.append(image);

  const caption = document.createElement('span');
  caption.className = 'card-caption';
  const meta = document.createElement('span');
  meta.className = 'card-meta';
  meta.textContent = `${item.id} · ${item.category}`;
  const title = document.createElement('strong');
  title.textContent = item.name;
  const topic = document.createElement('span');
  topic.className = 'card-topic';
  topic.textContent = item.subcategory;
  caption.append(meta, title, topic);
  button.append(imageWrap, caption);
  button.addEventListener('click', () => openDetail(item, button));
  article.append(button);
  return article;
}

function observeCardImages() {
  cardImageObserver?.disconnect();
  const images = [...elements.catalogGrid.querySelectorAll('img[data-src]')];

  if (!('IntersectionObserver' in window)) {
    images.forEach((image) => {
      image.src = image.dataset.src;
      delete image.dataset.src;
    });
    return;
  }

  cardImageObserver = new IntersectionObserver((entries, observer) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      const image = entry.target;
      image.src = image.dataset.src;
      delete image.dataset.src;
      observer.unobserve(image);
    }
  }, { rootMargin: '1200px 0px' });

  images.forEach((image) => cardImageObserver.observe(image));
}

function filterCatalog() {
  const query = normalize(state.query);
  state.filtered = state.catalog.filter((item) => {
    const categoryMatches = state.category === 'all' || item.category_slug === state.category;
    const topicMatches = state.topic === 'all' || item.subcategory_slug === state.topic;
    const haystack = normalize([
      item.id,
      item.name,
      item.category,
      item.subcategory,
      item.category_slug,
      item.subcategory_slug,
    ].join(' '));
    return categoryMatches && topicMatches && (!query || haystack.includes(query));
  });
}

function renderResults() {
  filterCatalog();
  const fragment = document.createDocumentFragment();
  const categories = uniqueBy(state.filtered, 'category_slug');

  for (const category of categories) {
    const categoryItems = state.filtered.filter(
      (item) => item.category_slug === category.category_slug,
    );
    const categorySection = document.createElement('section');
    categorySection.className = 'catalog-category-group';
    categorySection.dataset.category = category.category_slug;

    const categoryHeader = document.createElement('header');
    categoryHeader.className = 'catalog-category-header';
    const categoryIndex = document.createElement('span');
    categoryIndex.textContent = categoryNumber(category.category_slug);
    const categoryTitle = document.createElement('h3');
    categoryTitle.textContent = category.category;
    const categoryTotal = document.createElement('strong');
    categoryTotal.textContent = `${categoryItems.length} 项`;
    categoryHeader.append(categoryIndex, categoryTitle, categoryTotal);
    categorySection.append(categoryHeader);

    for (const topic of uniqueBy(categoryItems, 'subcategory_slug')) {
      const topicItems = categoryItems.filter(
        (item) => item.subcategory_slug === topic.subcategory_slug,
      );
      const topicSection = document.createElement('section');
      topicSection.className = 'catalog-topic-group';
      topicSection.id = `topic-${topic.subcategory_slug}`;

      const topicHeader = document.createElement('header');
      topicHeader.className = 'catalog-topic-header';
      const topicTitle = document.createElement('h4');
      topicTitle.textContent = topic.subcategory;
      const topicMeta = document.createElement('span');
      topicMeta.textContent = `${topicItems.length} 项 · ${topicItems[0].id}—${topicItems.at(-1).id}`;
      topicHeader.append(topicTitle, topicMeta);

      const grid = document.createElement('div');
      grid.className = 'catalog-grid';
      topicItems.forEach((item) => grid.append(makeCard(item)));
      topicSection.append(topicHeader, grid);
      categorySection.append(topicSection);
    }

    fragment.append(categorySection);
  }
  elements.catalogGrid.replaceChildren(fragment);
  observeCardImages();

  const topicCount = new Set(state.filtered.map((item) => item.subcategory_slug)).size;
  const categoryCount = new Set(state.filtered.map((item) => item.category_slug)).size;
  elements.resultsCount.textContent = `${state.filtered.length} / 350 项已在本页展示 · ${categoryCount} 类 · ${topicCount} 主题`;
  elements.emptyState.hidden = state.filtered.length !== 0;
}

function setCategory(category) {
  state.category = category;
  state.topic = 'all';
  for (const button of elements.categoryList.querySelectorAll('.category-button')) {
    const active = button.dataset.category === category;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-pressed', String(active));
  }
  for (const button of elements.taxonomyMap.querySelectorAll('.taxonomy-topic')) {
    button.classList.remove('is-active');
    button.setAttribute('aria-pressed', 'false');
  }
  renderTopicOptions();
  renderResults();
}

function setTopic(category, topic, { scroll = false } = {}) {
  setCategory(category);
  state.topic = topic;
  elements.topicSelect.value = topic;
  for (const button of elements.taxonomyMap.querySelectorAll('.taxonomy-topic')) {
    const active = button.dataset.category === category && button.dataset.topic === topic;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-pressed', String(active));
  }
  renderResults();
  if (scroll) {
    const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ? 'auto'
      : 'smooth';
    document.querySelector('#atlas').scrollIntoView({ behavior, block: 'start' });
  }
}

function openDetail(item, trigger) {
  state.lastTrigger = trigger;
  elements.dialogImage.src = `./upstream/thumbs/${item.id}.jpg`;
  elements.dialogImage.alt = `上游编号 ${item.id} 的教学海报；目录标注为${item.name}，图片语义尚未独立校验`;
  elements.dialogId.textContent = `ENTRY ${item.id}`;
  elements.dialogName.textContent = item.name;
  elements.dialogCategory.textContent = `${item.category} / ${item.subcategory}`;
  elements.dialogCategorySlug.textContent = item.category_slug;
  elements.dialogSubcategorySlug.textContent = item.subcategory_slug;
  elements.dialogDimensions.textContent = `${item.width} × ${item.height} px`;
  elements.dialogHash.textContent = `${item.sha256.slice(0, 16)}…`;
  elements.dialogSource.href = sourceUrl(item);
  elements.dialog.showModal();
}

function showLoadError(error, { log = true } = {}) {
  elements.loadStatus.className = 'load-status is-error';
  elements.loadStatus.replaceChildren();
  const title = document.createElement('strong');
  title.textContent = '目录加载失败。';
  const detail = document.createElement('span');
  detail.textContent = '能力说明仍可阅读，请刷新页面重试。';
  const retry = document.createElement('button');
  retry.type = 'button';
  retry.textContent = '重新加载';
  retry.addEventListener('click', loadCatalog);
  elements.loadStatus.append(title, detail, retry);
  elements.resultsCount.textContent = '上游 catalog 暂不可用';
  const taxonomyError = document.createElement('div');
  taxonomyError.className = 'taxonomy-loading is-error';
  taxonomyError.textContent = '完整分类目录暂不可用；能力说明与下载入口仍可阅读。';
  elements.taxonomyMap.replaceChildren(taxonomyError);
  if (log) console.error(error);
}

async function loadCatalog() {
  elements.loadStatus.hidden = false;
  elements.loadStatus.className = 'load-status';
  try {
    const response = await fetch('./upstream/catalog.json');
    if (!response.ok) throw new Error(`catalog HTTP ${response.status}`);
    const catalog = await response.json();
    if (!Array.isArray(catalog) || catalog.length !== 350) {
      throw new Error(`catalog count ${catalog?.length ?? 'unknown'}`);
    }
    state.catalog = catalog;
    renderCategoryList();
    renderTaxonomyMap();
    renderTopicOptions();
    renderResults();
    document.querySelector('#stat-items').textContent = String(catalog.length);
    document.querySelector('#stat-categories').textContent = String(new Set(catalog.map((item) => item.category_slug)).size);
    document.querySelector('#stat-topics').textContent = String(new Set(catalog.map((item) => item.subcategory_slug)).size);
    elements.loadStatus.hidden = true;
  } catch (error) {
    showLoadError(error);
  }
}

elements.categoryList.addEventListener('click', (event) => {
  const button = event.target.closest('.category-button');
  if (button) setCategory(button.dataset.category);
});

elements.taxonomyMap.addEventListener('click', (event) => {
  const button = event.target.closest('.taxonomy-topic');
  if (button) setTopic(button.dataset.category, button.dataset.topic, { scroll: true });
});

elements.searchInput.addEventListener('input', (event) => {
  state.query = event.target.value;
  renderResults();
});

elements.topicSelect.addEventListener('change', (event) => {
  state.topic = event.target.value;
  renderResults();
});

elements.resetFilters.addEventListener('click', () => {
  state.query = '';
  elements.searchInput.value = '';
  setCategory('all');
  elements.searchInput.focus();
});

elements.dialog.addEventListener('close', () => {
  elements.dialogImage.src = '';
  state.lastTrigger?.focus();
});

elements.dialog.addEventListener('click', (event) => {
  if (event.target === elements.dialog) elements.dialog.close();
});

if (isFileProtocol) {
  document.body.classList.add('is-file-protocol');
  elements.protocolWarning.hidden = false;
  showLoadError(new Error('file:// preview is unsupported; use npm run preview'), { log: false });
} else {
  loadCatalog();
}

const demoRoot = document.querySelector('#case-studio');
const demoTabs = [...(demoRoot?.querySelectorAll('[data-demo-target]') || [])];
const demoPanels = [...(demoRoot?.querySelectorAll('[data-demo-panel]') || [])];
const carouselSlides = [...(demoRoot?.querySelectorAll('[data-carousel-slide]') || [])];
const carouselPrevious = document.querySelector('#repo-carousel-prev');
const carouselNext = document.querySelector('#repo-carousel-next');
const carouselStatus = document.querySelector('#repo-carousel-status');
const articleInput = document.querySelector('#article-input');
const articleAnalyze = document.querySelector('#article-analyze');
const articleAnalysisStatus = document.querySelector('#article-analysis-status');
const analysisSteps = [...document.querySelectorAll('[data-analysis-step]')];
const decisionCards = [...document.querySelectorAll('[data-signal-rule]')];
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

let carouselIndex = 0;
let analysisTimers = [];

const signalRules = {
  overview: /收录|仓库|项目|知识库|是什么/i,
  scale: /\d+|规模|分类|主题|条目/i,
  capability: /能力|知识压缩|分类导航|机器目录|静态生产/i,
  process: /通过|导入|生成|验证|流程|输入|输出|生产链路/i,
  boundary: /但|不能|边界|风险|错位|不等于|尚未/i,
  roadmap: /下一步|扩展|补充|建立|走向|路线/i,
};

const analysisLabels = {
  read: '正在读取仓库研究文章…',
  extract: '正在提取定义、数字、能力、流程、边界和路线图…',
  match: '正在将内容信号匹配到 350 项目录候选…',
  render: '生成完成 · 已得到 4 种汇总成品',
};

function clearAnalysisTimers() {
  analysisTimers.forEach((timer) => window.clearTimeout(timer));
  analysisTimers = [];
}

function setAnalysisStep(index) {
  analysisSteps.forEach((step, stepIndex) => {
    step.classList.toggle('is-active', stepIndex === index);
    step.classList.toggle('is-complete', stepIndex < index || index === analysisSteps.length - 1);
  });
  if (articleAnalysisStatus) {
    const key = analysisSteps[index]?.dataset.analysisStep;
    articleAnalysisStatus.textContent = analysisLabels[key] || analysisLabels.render;
  }
}

function scoreArticleSignals() {
  const source = articleInput?.value.trim() || '';
  let matched = 0;
  decisionCards.forEach((card) => {
    const key = card.dataset.signalRule;
    const isMatched = Boolean(signalRules[key]?.test(source));
    const state = card.querySelector('[data-signal-match]');
    card.classList.toggle('is-matched', isMatched);
    card.classList.toggle('is-fallback', !isMatched);
    if (state) state.textContent = isMatched ? '已从文章命中' : '由汇总目标补位';
    if (isMatched) matched += 1;
  });
  return { matched, characters: [...source].length };
}

function completeArticleAnalysis() {
  const { matched, characters } = scoreArticleSignals();
  setAnalysisStep(analysisSteps.length - 1);
  if (articleAnalysisStatus) {
    articleAnalysisStatus.textContent = `生成完成 · 读取 ${characters} 字 · 命中 ${matched}/6 类内容信号 · 输出 4 种成品`;
  }
  if (articleAnalyze) {
    articleAnalyze.disabled = false;
    articleAnalyze.textContent = '重新分析并生成';
  }
}

function analyzeRepositoryArticle({ animate = true } = {}) {
  if (!analysisSteps.length) return;
  clearAnalysisTimers();
  decisionCards.forEach((card) => card.classList.remove('is-matched', 'is-fallback'));
  if (articleAnalyze) {
    articleAnalyze.disabled = animate;
    articleAnalyze.textContent = animate ? '正在分析…' : '分析文章并生成';
  }

  if (!animate || prefersReducedMotion.matches) {
    completeArticleAnalysis();
    return;
  }

  setAnalysisStep(0);
  [1, 2].forEach((stepIndex) => {
    analysisTimers.push(window.setTimeout(() => setAnalysisStep(stepIndex), stepIndex * 420));
  });
  analysisTimers.push(window.setTimeout(completeArticleAnalysis, 1260));
}

function renderCarousel() {
  carouselSlides.forEach((slide, index) => {
    slide.hidden = index !== carouselIndex;
  });
  if (carouselStatus) {
    carouselStatus.textContent = `${String(carouselIndex + 1).padStart(2, '0')} / ${String(carouselSlides.length).padStart(2, '0')}`;
  }
}

function activateDemo(target, { focus = false } = {}) {
  demoTabs.forEach((tab) => {
    const active = tab.dataset.demoTarget === target;
    tab.setAttribute('aria-selected', String(active));
    tab.tabIndex = active ? 0 : -1;
    if (active && focus) tab.focus();
  });
  demoPanels.forEach((panel) => {
    panel.hidden = panel.dataset.demoPanel !== target;
  });
}

demoTabs.forEach((tab, index) => {
  tab.addEventListener('click', () => activateDemo(tab.dataset.demoTarget));
  tab.addEventListener('keydown', (event) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    let nextIndex = index;
    if (event.key === 'ArrowLeft') nextIndex = (index - 1 + demoTabs.length) % demoTabs.length;
    if (event.key === 'ArrowRight') nextIndex = (index + 1) % demoTabs.length;
    if (event.key === 'Home') nextIndex = 0;
    if (event.key === 'End') nextIndex = demoTabs.length - 1;
    activateDemo(demoTabs[nextIndex].dataset.demoTarget, { focus: true });
  });
});

carouselPrevious?.addEventListener('click', () => {
  carouselIndex = (carouselIndex - 1 + carouselSlides.length) % carouselSlides.length;
  renderCarousel();
});

carouselNext?.addEventListener('click', () => {
  carouselIndex = (carouselIndex + 1) % carouselSlides.length;
  renderCarousel();
});

articleAnalyze?.addEventListener('click', () => analyzeRepositoryArticle());

prefersReducedMotion.addEventListener('change', () => {
  if (analysisTimers.length) analyzeRepositoryArticle({ animate: false });
});

if (demoTabs.length) activateDemo('report');
if (carouselSlides.length) renderCarousel();
if (analysisSteps.length) analyzeRepositoryArticle({ animate: false });
