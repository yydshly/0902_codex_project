import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const appDirectory = path.dirname(fileURLToPath(import.meta.url));
const outputDirectory = path.join(appDirectory, 'dist');

function requireFile(relativePath) {
  const target = path.join(outputDirectory, relativePath);
  if (!fs.existsSync(target) || !fs.statSync(target).isFile()) {
    throw new Error(`缺少构建产物：${relativePath}`);
  }
  return target;
}

const indexPath = requireFile('index.html');
const appPath = requireFile('app.js');
requireFile('styles.css');
requireFile('upstream/RIGHTS-NOTICE.txt');
const productLabIndex = fs.readFileSync(requireFile('product-lab/index.html'), 'utf8');
requireFile('product-lab/og-cover.png');
const metadata = JSON.parse(fs.readFileSync(requireFile('upstream/meta.json'), 'utf8'));
const brandCase = JSON.parse(fs.readFileSync(requireFile('brand/case.json'), 'utf8'));
const html = fs.readFileSync(indexPath, 'utf8');
const app = fs.readFileSync(appPath, 'utf8');

if (metadata.commit !== '85b20634da13a02bcc2e67b2f42fb50d4aba7b93') {
  throw new Error(`研究基线漂移：${metadata.commit}`);
}
if (metadata.counts.worlds !== 5 || metadata.counts.portalRoutes !== 9) {
  throw new Error(
    `能力清单异常：${metadata.counts.worlds} Worlds / ${metadata.counts.portalRoutes} Portals`,
  );
}
if (metadata.counts.testFiles !== 23 || metadata.verified.testCases !== 73) {
  throw new Error('测试基线与已验证结果不一致。');
}
if (metadata.license !== 'not-declared') {
  throw new Error('上游许可证状态发生变化，请重新审核发布边界。');
}
if (brandCase.metrics.projects !== 7 || brandCase.metrics.publishedDemos !== 7) {
  throw new Error(
    `真实样例规模异常：${brandCase.metrics.projects} projects / ${brandCase.metrics.publishedDemos} demos`,
  );
}
if (brandCase.capabilities.length !== 5) {
  throw new Error(`能力映射异常：${brandCase.capabilities.length} capabilities`);
}
if (brandCase.simulation.evidenceCoverage.length !== 5 || brandCase.simulation.audiences.length !== 3) {
  throw new Error('个人品牌模拟必须包含五类证据覆盖和三种目标受众。');
}
for (const coverage of brandCase.simulation.evidenceCoverage) {
  if (coverage.score < 0 || coverage.score > 100) {
    throw new Error(`证据覆盖分越界：${coverage.id} / ${coverage.score}`);
  }
}
for (const project of brandCase.projects) {
  if (!project.capabilities.length) throw new Error(`样例项目 ${project.id} 没有能力映射。`);
  if (!project.demo?.url) throw new Error(`样例项目 ${project.id} 缺少 Demo 链接。`);
}
for (const world of ['cosmic', 'archipelago', 'jianghu', 'linework', 'studio']) {
  if (!app.includes(`id: '${world}'`)) throw new Error(`展示台缺少 World：${world}`);
}
for (const marker of [
  'data-world-tabs',
  'data-live-frame',
  'data-scenario-output',
  'data-brand-filters',
  'data-brand-projects',
  'data-proof-frame',
  'data-sim-coverage',
  'data-audience-tabs',
]) {
  if (!html.includes(marker)) throw new Error(`页面缺少关键节点：${marker}`);
}
if (!html.includes('./product-lab/')) throw new Error('研究展台缺少真实 3D 产品实验入口。');
if (!html.includes('rel="canonical"') || !html.includes('property="og:image"')) {
  throw new Error('研究展台缺少 canonical 或 Open Graph 发布元数据。');
}
if (!productLabIndex.includes('./assets/')) throw new Error('3D 产品实验室资源路径未适配 Pages 子路径。');
if (!productLabIndex.includes('Qiuner 架构落地')) throw new Error('3D 产品实验室缺少清晰的来源关系标题。');
if (!productLabIndex.includes('rel="canonical"') || !productLabIndex.includes('og-cover.png')) {
  throw new Error('3D 产品实验室缺少 canonical 或分享封面。');
}

console.log('检查通过：五世界、真实品牌样例、3D 产品实验、证据元数据与权利边界均已登记。');
