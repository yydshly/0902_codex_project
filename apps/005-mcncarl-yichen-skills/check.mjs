import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { ADOPTION_DECISIONS, SKILLS, SKILL_SCENARIOS, SKILL_TEMPLATE_TEXT, UPSTREAM_COMMIT, WORKFLOW_SCENARIOS } from './src/data.js';

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
invariant(Object.keys(ADOPTION_DECISIONS).length === 22, '22 个 Skill 必须各有一个采用决策');
invariant(SKILLS.every((skill) => ADOPTION_DECISIONS[skill.name]), '存在缺少采用决策的 Skill');
invariant(JSON.stringify(Object.values(ADOPTION_DECISIONS).reduce((counts, item) => ({ ...counts, [item.decision]: (counts[item.decision] || 0) + 1 }), {})) === JSON.stringify({ reference: 7, pilot: 5, rewrite: 6, hold: 4 }), '采用决策分组数量必须是 7/5/6/4');
invariant(SKILL_TEMPLATE_TEXT.includes('## 7. 失败与恢复'), 'Skill 设计模板必须覆盖七段结构');

for (const id of ['overview', 'scenarios', 'atlas', 'architecture', 'meaning', 'adoption', 'final-verdict', 'risks']) {
  invariant(html.includes(`id="${id}"`), `HTML 缺少主区域：${id}`);
}

for (const id of ['skill-search', 'level-filter', 'skill-grid', 'skill-dialog', 'theme-toggle', 'mobile-menu', 'scenario-tabs', 'flow-steps', 'run-flow', 'flow-outcomes', 'adoption-board', 'trial-form', 'trial-list', 'export-trials', 'copy-template']) {
  invariant(html.includes(`id="${id}"`), `HTML 缺少交互控件：${id}`);
}

invariant(html.includes(UPSTREAM_COMMIT.slice(0, 7)), '页面未显示固定上游 commit');
invariant(html.includes('无需试遍全部 22 个 Skill'), '页面必须明确按需使用与停止研究条件');
invariant((html.match(/class="on-demand-path"/g) || []).length === 1, '页面必须包含唯一的按需使用路径');
invariant(css.includes('@media (prefers-reduced-motion: reduce)'), '缺少 reduced-motion 适配');
invariant(!css.includes('linear-gradient') && !css.includes('radial-gradient'), '页面不应使用渐变');

console.log('Capability Atlas 检查通过：最终理解、22 项采用决策、真实试用台账、3 类工作流与固定来源。');
