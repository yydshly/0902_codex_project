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
]) {
  if (!html.includes(`id="${marker}"`)) {
    throw new Error(`页面缺少关键表面：${marker}`);
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

console.log('检查通过：350 项全量分组、8 类、33 主题、JSON/CSV 与关键交互表面完整。');
