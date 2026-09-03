import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { UPSTREAM_COMMIT, UPSTREAM_FILES } from './build.mjs';

const appDirectory = path.dirname(fileURLToPath(import.meta.url));

function invariant(condition, message) {
  if (!condition) throw new Error(message);
}

for (const relativePath of [
  'src/index.html',
  'src/styles.css',
  'src/app.js',
  'README.md',
  'docs/delivery-contract.md',
  'docs/browser-validation.md',
  'docs/capability-matrix.md',
  'docs/local-proxy-compatibility.md',
]) {
  invariant(fs.existsSync(path.join(appDirectory, relativePath)), `缺少应用文件：${relativePath}`);
}

const html = fs.readFileSync(path.join(appDirectory, 'src/index.html'), 'utf8');
const script = fs.readFileSync(path.join(appDirectory, 'src/app.js'), 'utf8');

const views = ['overview', 'domains', 'countries', 'proxies', 'devices', 'rules', 'health', 'pipeline', 'settings'];
for (const view of views) {
  invariant(html.includes(`data-view=\"${view}\"`), `HTML 缺少能力视图：${view}`);
  invariant(html.includes(`id=\"panel-${view}\"`), `HTML 缺少能力面板：${view}`);
}

const actions = ['toggle-live', 'toggle-theme', 'toggle-offline', 'simulate-reset', 'time-range', 'manual-refresh'];
for (const action of actions) {
  invariant(html.includes(`id=\"${action}\"`), `HTML 缺少交互控制：${action}`);
}

invariant(script.includes(UPSTREAM_COMMIT), 'Demo 未显示固定上游 commit');
invariant(UPSTREAM_FILES.length >= 10, '上游证据文件覆盖不足');
invariant(new Set(UPSTREAM_FILES).size === UPSTREAM_FILES.length, '上游证据文件存在重复');
invariant(!html.includes('neko-master-overview-light.png'), 'Demo 不应复制上游截图');

console.log(`能力实验室检查通过：${views.length} 个视图、${actions.length} 个核心控制、${UPSTREAM_FILES.length} 个上游证据文件。`);
