import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const appDirectory = path.dirname(fileURLToPath(import.meta.url));
const outputDirectory = path.join(appDirectory, 'dist');
const contractPath = path.join(appDirectory, 'docs', 'delivery-contract.md');

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
  'upstream/evidence.json',
  'upstream/RIGHTS-NOTICE.txt',
]) {
  requireFile(relativePath);
}

const html = fs.readFileSync(requireFile('index.html'), 'utf8');
const js = fs.readFileSync(requireFile('app.js'), 'utf8');
const evidence = JSON.parse(fs.readFileSync(requireFile('upstream/evidence.json'), 'utf8'));

if (evidence.commit !== '6b09e61cd77c00020c24676f926d7374afd5dd04') {
  throw new Error(`研究基线漂移：${evidence.commit}`);
}
if (evidence.products.length !== 2 || evidence.fqnews2Flow.length !== 8) {
  throw new Error('产品分层或 FQNews2 请求链不完整。');
}
if (evidence.sources.length < 10 || !evidence.sources.every((source) => source.url.includes(evidence.commit))) {
  throw new Error('源码证据必须至少 10 条且全部固定到研究提交。');
}
if (evidence.products.some((product) => product.ownsProtocols)) {
  throw new Error('能力归属错误：产品封装层不能声明拥有协议实现。');
}

for (const marker of [
  'architecture-map',
  'product-switcher',
  'request-simulator',
  'ownership-matrix',
  'boundary-board',
  'research-priority',
  'evidence-drawer',
]) {
  if (!html.includes(`id="${marker}"`)) throw new Error(`页面缺少关键表面：${marker}`);
}

for (const marker of ['quick-definitions', 'comparison-grid', 'plain-layers', 'compact-nav', 'evidence-legend']) {
  if (!html.includes(`class="${marker}`)) throw new Error(`页面缺少清晰度结构：${marker}`);
}

for (const statement of ['不是统一适配框架', '可配置节点与协议，不等于可以任意替换代理内核', '源码确认', '代码推断', '尚未验证']) {
  if (!html.includes(statement)) throw new Error(`页面缺少关键边界说明：${statement}`);
}

for (const state of ['empty', 'testing', 'connected', 'failed', 'offline']) {
  if (!js.includes(`id: '${state}'`)) throw new Error(`请求模拟器缺少状态：${state}`);
}

if (!js.includes("event.key !== 'Escape'") || !js.includes("compactNav.removeAttribute('open')")) {
  throw new Error('紧凑章节导航必须支持关闭和 Escape 焦点恢复。');
}

if (!js.includes("selectState(states.find((state) => state.id === 'connected'))")) {
  throw new Error('FQNews2 必须默认展示“正常工作”的完整成功链。');
}

if (!fs.existsSync(contractPath)) {
  throw new Error('缺少清晰度优化的交付契约。');
}

console.log('检查通过：首屏定义、四者同屏对照、FQNews2 白话分层与完整请求链、能力边界和研究优先级完整。');
