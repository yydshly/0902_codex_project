import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { UPSTREAM_FILES } from './build.mjs';
import { exhibits, groups } from './src/exhibits.js';

const appDirectory = path.dirname(fileURLToPath(import.meta.url));

function invariant(condition, message) {
  if (!condition) throw new Error(message);
}

const groupIds = new Set(groups.map((group) => group.id));
for (const group of groups) {
  invariant(group.label?.zh && group.label?.en, `分类缺少中英名称：${group.id}`);
}
const ids = new Set();
const referencedPaths = new Set();

for (const exhibit of exhibits) {
  invariant(!ids.has(exhibit.id), `重复展品 id：${exhibit.id}`);
  ids.add(exhibit.id);
  invariant(groupIds.has(exhibit.group), `未知展品分类：${exhibit.group}`);
  invariant(typeof exhibit.code === 'string' || (exhibit.code?.zh && exhibit.code?.en), `展品缺少有效编号：${exhibit.id}`);
  for (const language of ['zh', 'en']) {
    const copy = exhibit.copy?.[language];
    invariant(copy?.title && copy.subtitle && copy.description, `展品缺少 ${language} 标题或说明：${exhibit.id}`);
    invariant(Array.isArray(copy.tags) && copy.tags.length > 0, `展品缺少 ${language} 标签：${exhibit.id}`);
  }
  invariant(Boolean(exhibit.path) !== Boolean(exhibit.pathZh || exhibit.pathEn), `展品路径形式冲突：${exhibit.id}`);
  if (!exhibit.path) invariant(exhibit.pathZh && exhibit.pathEn, `双语展品缺少中英路径：${exhibit.id}`);
  const paths = [exhibit.path, exhibit.pathZh, exhibit.pathEn].filter(Boolean);
  invariant(paths.length > 0, `展品缺少上游路径：${exhibit.id}`);
  for (const relativePath of paths) referencedPaths.add(relativePath);
}

const htmlFiles = UPSTREAM_FILES.filter((relativePath) => relativePath.endsWith('.html'));
for (const relativePath of referencedPaths) {
  invariant(UPSTREAM_FILES.includes(relativePath), `展品引用未纳入构建：${relativePath}`);
}
for (const relativePath of htmlFiles) {
  invariant(referencedPaths.has(relativePath), `上游 HTML 没有展厅入口：${relativePath}`);
}

invariant(exhibits.filter((item) => item.group === 'report' && item.id !== 'report-index').length === 12, '报告模板必须正好 12 套');
invariant(exhibits.filter((item) => item.group === 'chart').length === 7, '核心图型入口必须覆盖 4 个 gallery 与 3 张大图');
invariant(exhibits.filter((item) => item.group === 'theme').length === 18, '彩色样张入口必须正好 18 个');

for (const relativePath of ['src/index.html', 'src/styles.css', 'src/app.js', 'src/exhibits.js']) {
  invariant(fs.existsSync(path.join(appDirectory, relativePath)), `缺少应用文件：${relativePath}`);
}

const indexSource = fs.readFileSync(path.join(appDirectory, 'src/index.html'), 'utf8');
const appSource = fs.readFileSync(path.join(appDirectory, 'src/app.js'), 'utf8');
for (const marker of [
  'id="architecture-map"',
  'class="architecture-agent"',
  'class="architecture-core"',
  'class="architecture-runtime-delivery"',
  'id="architecture-map-caption"',
]) {
  invariant(indexSource.includes(marker), `架构与能力总图缺少结构：${marker}`);
}
invariant(!indexSource.includes('class="pipeline section-shell"'), '旧五步生产线仍与架构总图重复');

for (const key of [
  'archInputTitle',
  'archAgentTitle',
  'archCoreTitle',
  'archRuntimeTitle',
  'archOutputTitle',
  'archBoundaryBody',
  'archReadingBody',
]) {
  const matches = appSource.match(new RegExp(`\\b${key}:`, 'g')) ?? [];
  invariant(matches.length === 2, `架构总图必须提供中英双语文案：${key}`);
}
invariant(appSource.includes("cap2Title: '59 种常规图模板'"), '中文能力统计必须把常规图标为 59 种');
invariant(appSource.includes("cap3Meta: '2 种地图 + 3 种关系大图'"), '中文能力统计必须说明剩余 5 种专项图');

console.log(`展厅清单通过：${exhibits.length} 个入口覆盖 ${htmlFiles.length} 个上游 HTML。`);
