import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const appDirectory = path.dirname(fileURLToPath(import.meta.url));
const outputDirectory = path.join(appDirectory, 'dist');

function requireFile(relativePath) {
  const target = path.join(outputDirectory, relativePath);
  if (!fs.existsSync(target) || !fs.statSync(target).isFile()) throw new Error(`缺少构建产物：${relativePath}`);
  return target;
}

for (const relativePath of ['index.html', 'styles.css', 'app.js', 'assets/architecture.png', 'upstream/evidence.json', 'upstream/RIGHTS-NOTICE.txt']) {
  requireFile(relativePath);
}

const html = fs.readFileSync(requireFile('index.html'), 'utf8');
const css = fs.readFileSync(requireFile('styles.css'), 'utf8');
const js = fs.readFileSync(requireFile('app.js'), 'utf8');
const evidence = JSON.parse(fs.readFileSync(requireFile('upstream/evidence.json'), 'utf8'));

if (evidence.commit !== 'd146be7c3c6828075dfc83719c37819f1b6fbef7' || evidence.release !== 'v8.4.0') throw new Error('研究基线漂移。');
if (evidence.flows.length !== 3 || !evidence.flows.every((flow) => flow.steps.length === 4)) throw new Error('三条架构链路不完整。');
if (evidence.sources.length < 10 || !evidence.sources.every((item) => item.url.includes(evidence.commit))) throw new Error('源码证据必须固定到研究提交。');
if (evidence.constraints.length < 5 || evidence.extensions.length < 4) throw new Error('重量判断或扩展方向不完整。');

for (const id of ['hero', 'cost', 'architecture', 'fit', 'adoption-checker', 'extensions', 'evidence']) {
  if (!html.includes(`id="${id}"`)) throw new Error(`页面缺少关键表面：${id}`);
}
for (const text of ['不是视频组件', '约 3×', 'AGPL-3.0', '对象存储', '不适合']) {
  if (!html.includes(text)) throw new Error(`页面缺少关键结论：${text}`);
}
for (const state of ["'idle'", "'yes'", "'conditional'", "'no'"]) {
  if (!js.includes(state)) throw new Error(`评估器缺少状态：${state}`);
}
if (!js.includes("event.key === 'ArrowRight'") || !js.includes("event.key === 'Home'") || !js.includes("event.key === 'Escape'")) {
  throw new Error('架构页签或紧凑导航缺少键盘路径。');
}
if (!css.includes('prefers-reduced-motion') || !css.includes('@media (max-width: 640px)')) throw new Error('缺少动效降级或手机布局。');
if (!fs.existsSync(path.join(appDirectory, 'docs', 'delivery-contract.md'))) throw new Error('缺少交付契约。');

console.log('检查通过：定位、重量、三条架构链、适用边界、采用评估、扩展方向和固定版本证据完整。');
