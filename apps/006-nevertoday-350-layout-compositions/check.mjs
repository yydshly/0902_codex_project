import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const appDirectory = path.dirname(fileURLToPath(import.meta.url));
const outputDirectory = path.join(appDirectory, 'dist');

if (!fs.existsSync(path.join(appDirectory, 'serve.mjs'))) {
  throw new Error('缺少本地 HTTP 预览服务器 serve.mjs。');
}

const packageManifest = JSON.parse(
  fs.readFileSync(path.join(appDirectory, 'package.json'), 'utf8'),
);
if (!packageManifest.scripts?.preview?.includes('node serve.mjs')) {
  throw new Error('package.json 缺少 canonical npm run preview 入口。');
}

function requireFile(relativePath) {
  const target = path.join(outputDirectory, relativePath);
  if (!fs.existsSync(target) || !fs.statSync(target).isFile()) {
    throw new Error(`缺少构建产物：${relativePath}`);
  }
  return target;
}

for (const relativePath of [
  'index.html',
  'styles.css',
  'app.js',
  'upstream/catalog.json',
  'upstream/catalog.csv',
  'upstream/meta.json',
  'upstream/UPSTREAM-LICENSE.txt',
]) {
  requireFile(relativePath);
}

const catalog = JSON.parse(fs.readFileSync(requireFile('upstream/catalog.json'), 'utf8'));
const metadata = JSON.parse(fs.readFileSync(requireFile('upstream/meta.json'), 'utf8'));
const thumbnails = fs
  .readdirSync(path.join(outputDirectory, 'upstream', 'thumbs'))
  .filter((filename) => filename.endsWith('.jpg'));
const ids = new Set(catalog.map((item) => item.id));
const names = new Set(catalog.map((item) => item.name));
const categories = new Set(catalog.map((item) => item.category_slug));
const subcategories = new Set(catalog.map((item) => item.subcategory_slug));

if (
  catalog.length !== 350 ||
  ids.size !== 350 ||
  names.size !== 350 ||
  thumbnails.length !== 350 ||
  categories.size !== 8 ||
  subcategories.size !== 33
) {
  throw new Error('目录、名称、分类或缩略图数量不符合 350 / 8 / 33 契约。');
}

if (metadata.semanticStatus !== 'upstream-labels-unverified') {
  throw new Error('Demo 必须保留上游标签尚未语义校验的声明。');
}

if (metadata.displayMode !== 'full-catalog-grouped') {
  throw new Error('Demo 必须声明 350 项全量分组展示模式。');
}

const csv = fs.readFileSync(requireFile('upstream/catalog.csv'), 'utf8').replace(/^\uFEFF/, '');
if (!csv.startsWith('id,') || csv.length < 10_000) {
  throw new Error('CSV 机器目录缺失、表头异常或内容不完整。');
}

const html = fs.readFileSync(requireFile('index.html'), 'utf8');
for (const marker of [
  'taxonomy-map',
  'catalog-grid',
  'protocol-warning',
  'search-input',
  'detail-dialog',
  'quality-boundary',
  'image-case',
  'case-studio',
  'article-input',
  'article-analyze',
  'article-analysis-status',
  'layout-decisions',
  'repo-carousel-next',
  'repo-panel-poster',
  'repo-panel-deck',
]) {
  if (!html.includes(`id="${marker}"`)) {
    throw new Error(`页面缺少关键表面：${marker}`);
  }
}

for (const caseMarker of [
  '案例对象 · 350 Layout Compositions',
  '不是一张图片',
  '系统不是“挑一张好看的图”',
  '文章拆解、规则匹配和网页渲染是本 Demo 新增',
  '汇总网页',
  '社媒轮播',
  '单页知识图',
  'PPT 提纲',
  '原仓库只提供候选版式知识',
]) {
  if (!html.includes(caseMarker)) {
    throw new Error(`单图研究应用案例缺少关键说明：${caseMarker}`);
  }
}

for (const visualMarker of [
  'class="selfcase-visual-hook"',
  'class="capability-ownership"',
  'class="repository-contact-sheet"',
  'class="generated-report-taxonomy"',
  'class="generated-category-bars"',
  'class="carousel-cover-posters"',
  'class="knowledge-category-map"',
  'class="deck-slide-opening"',
]) {
  if (!html.includes(visualMarker)) {
    throw new Error(`真实视觉演示缺少关键构图：${visualMarker}`);
  }
}

if (html.includes('id="load-more"')) {
  throw new Error('全量展示模式不能保留“加载更多”入口。');
}

const appSource = fs.readFileSync(requireFile('app.js'), 'utf8');
for (const marker of [
  'renderTaxonomyMap',
  'catalog-category-group',
  'catalog-topic-group',
  'IntersectionObserver',
  'image.dataset.src',
  'activateDemo',
  'renderCarousel',
  'analyzeRepositoryArticle',
  'scoreArticleSignals',
  'signalRules',
]) {
  if (!appSource.includes(marker)) {
    throw new Error(`全量分组逻辑缺少标记：${marker}`);
  }
}

const styles = fs.readFileSync(requireFile('styles.css'), 'utf8');
if (styles.includes('content-visibility')) {
  throw new Error('长页面不能重新引入会导致滚动定位漂移的 content-visibility。');
}
if (!styles.includes('.empty-state[hidden]')) {
  throw new Error('空结果组件必须保留显式 hidden 样式。');
}
for (const marker of [
  '.repository-packet',
  '.layout-decision-grid',
  '.selfcase-visual-hook',
  '.capability-ownership',
  '.repository-contact-sheet',
  '.generated-report-browser',
  '.generated-category-bars',
  '.carousel-cover-posters',
  '.knowledge-poster-output',
  '.knowledge-category-map',
  '.deck-slide-grid',
]) {
  if (!styles.includes(marker)) {
    throw new Error(`主题关联演示缺少样式：${marker}`);
  }
}

console.log('检查通过：真实海报、数据图形、六种轮播构图、知识图、PPT 预览、文章分析、四种输出与 350 / 8 / 33 全量目录完整。');
