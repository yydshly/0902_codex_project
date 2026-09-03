import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { SKILLS, SKILL_SCENARIOS, UPSTREAM_COMMIT, WORKFLOW_SCENARIOS } from './src/data.js';

const appDirectory = path.dirname(fileURLToPath(import.meta.url));

function invariant(condition, message) {
  if (!condition) throw new Error(message);
}

for (const relativePath of [
  'src/index.html',
  'src/styles.css',
  'src/data.js',
  'src/app.js',
  'README.md',
  'docs/delivery-contract.md',
]) {
  invariant(fs.existsSync(path.join(appDirectory, relativePath)), `缺少应用文件：${relativePath}`);
}

const html = fs.readFileSync(path.join(appDirectory, 'src/index.html'), 'utf8');
const css = fs.readFileSync(path.join(appDirectory, 'src/styles.css'), 'utf8');

invariant(SKILLS.length === 22, `能力清单必须是 22 项，实际 ${SKILLS.length}`);
invariant(new Set(SKILLS.map((skill) => skill.name)).size === 22, 'Skill name 存在重复');
invariant(SKILLS.filter((skill) => skill.status === 'deprecated').length === 1, '必须且只能有一个退役兼容入口');
invariant(SKILLS.filter((skill) => skill.kind === 'plugin').length === 1, '必须且只能有一个插件型 Skill');
invariant(SKILLS.every((skill) => skill.source.includes(UPSTREAM_COMMIT)), '每个 Skill 来源必须固定到研究提交');
invariant(Object.keys(SKILL_SCENARIOS).length === 22, '每个 Skill 必须且只能有一个典型使用场景');
invariant(SKILLS.every((skill) => SKILL_SCENARIOS[skill.name]), '存在缺少典型场景的 Skill');
invariant(WORKFLOW_SCENARIOS.length === 3, '必须提供三类组合使用场景');
invariant(WORKFLOW_SCENARIOS[0].stages.length === 7, '默认内容创作闭环必须包含七个步骤');

for (const id of ['overview', 'scenarios', 'atlas', 'architecture', 'meaning', 'risks']) {
  invariant(html.includes(`id="${id}"`), `HTML 缺少主区域：${id}`);
}

for (const id of ['skill-search', 'level-filter', 'skill-grid', 'skill-dialog', 'theme-toggle', 'mobile-menu', 'scenario-tabs', 'flow-steps', 'run-flow', 'flow-outcomes']) {
  invariant(html.includes(`id="${id}"`), `HTML 缺少交互控件：${id}`);
}

invariant(html.includes(UPSTREAM_COMMIT.slice(0, 7)), '页面未显示固定上游 commit');
invariant(css.includes('@media (prefers-reduced-motion: reduce)'), '缺少 reduced-motion 适配');
invariant(!css.includes('linear-gradient') && !css.includes('radial-gradient'), '页面不应使用渐变');

console.log('Capability Atlas 检查通过：22 个 Skill 场景、3 类工作流、7 步默认闭环与固定来源。');
