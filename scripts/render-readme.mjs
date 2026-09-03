import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { pathToFileURL } from 'node:url';

import { loadCatalog, REPOSITORY_ROOT } from './validate-catalog.mjs';

const README_PATH = path.join(REPOSITORY_ROOT, 'README.md');
const START_MARKER = '<!-- PROJECT_INDEX_START -->';
const END_MARKER = '<!-- PROJECT_INDEX_END -->';
const SHOWCASE_START_MARKER = '<!-- PROJECT_SHOWCASE_START -->';
const SHOWCASE_END_MARKER = '<!-- PROJECT_SHOWCASE_END -->';
const PAGES_BASE_URL = 'https://yydshly.github.io/0902_codex_project/';
const STATUS_LABELS = {
  planned: '待研究',
  studying: '研究中',
  validated: '已验证',
  archived: '已归档',
};

function escapeCell(value) {
  return String(value)
    .replace(/\\/g, '\\\\')
    .replace(/\|/g, '\\|')
    .replace(/[\r\n]+/g, ' ')
    .trim();
}

function escapeLinkLabel(value) {
  return escapeCell(value).replace(/([\[\]])/g, '\\$1');
}

function linkTarget(value) {
  return encodeURI(value).replace(/\(/g, '%28').replace(/\)/g, '%29');
}

function projectDemoUrl(project) {
  if (!project.demo || ['archived', 'planned', 'building'].includes(project.demo.status)) {
    return null;
  }

  if (project.demo.url) {
    return project.demo.url;
  }

  if (project.demo.publicPath) {
    return `${PAGES_BASE_URL}${project.demo.publicPath}/`;
  }

  return null;
}

function demoCell(project) {
  const url = projectDemoUrl(project);
  return url ? `[打开](${linkTarget(url)})` : '—';
}

export function renderProjectIndex(projects) {
  const header = [
    '| 编号 | 项目 | 一句话摘要 | 状态 | 标签 | 研究记录 | Web Demo | 最近更新 |',
    '| ---: | --- | --- | --- | --- | --- | --- | --- |',
  ];

  if (projects.length === 0) {
    return [...header, '| — | 还没有已登记的研究项目 | 首个项目将从 `001` 开始 | — | — | [如何新增](CONTRIBUTING.md) | — | — |'].join('\n');
  }

  const rows = projects.map((project) => {
    const title = `[${escapeLinkLabel(project.title)}](${linkTarget(project.repository)})`;
    const study = `[查看](./${linkTarget(project.studyPath)})`;
    const status = STATUS_LABELS[project.status] ?? escapeCell(project.status);
    const tags = project.tags.length > 0
      ? project.tags.map((tag) => `\`${escapeCell(tag).replace(/`/g, '\\`')}\``).join(' ')
      : '—';
    return `| \`${project.id}\` | ${title} | ${escapeCell(project.summary)} | ${status} | ${tags} | ${study} | ${demoCell(project)} | ${project.updatedAt} |`;
  });

  return [...header, ...rows].join('\n');
}

export function renderProjectShowcase(projects) {
  if (projects.length === 0) {
    return '还没有已登记的研究项目。';
  }

  return projects.map((project) => {
    if (!project.cover) {
      throw new Error(`项目 ${project.id} 缺少核心演示图 cover`);
    }

    const repository = linkTarget(project.repository);
    const study = `./${linkTarget(project.studyPath)}`;
    const demo = projectDemoUrl(project);
    const imageTarget = linkTarget(demo || study);
    const imagePath = `./${linkTarget(project.cover.path)}`;
    const caption = [project.cover.caption, project.cover.credit]
      .filter(Boolean)
      .map(escapeCell)
      .join(' · ');
    const links = [
      `[阅读研究](${study})`,
      demo ? `[打开 Demo](${linkTarget(demo)})` : null,
      `[查看上游](${repository})`,
    ].filter(Boolean).join(' · ');

    return [
      `### \`${project.id}\` · [${escapeLinkLabel(project.title)}](${repository})`,
      `[![${escapeLinkLabel(project.cover.alt)}](${imagePath})](${imageTarget})`,
      `*${caption}*`,
      escapeCell(project.summary),
      links,
    ].join('\n\n');
  }).join('\n\n---\n\n');
}

function countOccurrences(source, marker) {
  return source.split(marker).length - 1;
}

function replaceMarkedBlock(source, startMarker, endMarker, content) {
  const startCount = countOccurrences(source, startMarker);
  const endCount = countOccurrences(source, endMarker);
  if (startCount !== 1 || endCount !== 1) {
    throw new Error(`README.md 必须且只能包含一组 ${startMarker} / ${endMarker} 标记`);
  }

  const startIndex = source.indexOf(startMarker);
  const endIndex = source.indexOf(endMarker);
  if (endIndex < startIndex) {
    throw new Error('README.md 的项目索引结束标记位于开始标记之前');
  }

  const newline = source.includes('\r\n') ? '\r\n' : '\n';
  const rendered = content.replace(/\n/g, newline);
  const replacement = `${startMarker}${newline}${rendered}${newline}${endMarker}`;
  return `${source.slice(0, startIndex)}${replacement}${source.slice(endIndex + endMarker.length)}`;
}

export function updateReadme(source, projects) {
  const withIndex = replaceMarkedBlock(
    source,
    START_MARKER,
    END_MARKER,
    renderProjectIndex(projects),
  );
  return replaceMarkedBlock(
    withIndex,
    SHOWCASE_START_MARKER,
    SHOWCASE_END_MARKER,
    renderProjectShowcase(projects),
  );
}

function main() {
  const checkOnly = process.argv.includes('--check');
  const unknownArguments = process.argv.slice(2).filter((argument) => argument !== '--check');
  if (unknownArguments.length > 0) {
    throw new Error(`未知参数：${unknownArguments.join(' ')}`);
  }

  const catalog = loadCatalog({ checkFiles: true });
  const source = fs.readFileSync(README_PATH, 'utf8');
  const updated = updateReadme(source, catalog.projects);

  if (updated === source) {
    console.log(`README 项目索引已同步：${catalog.projects.length} 个项目。`);
    return;
  }

  if (checkOnly) {
    throw new Error('README 项目索引已过期；请运行 npm run catalog:render 后提交 README.md');
  }

  fs.writeFileSync(README_PATH, updated, 'utf8');
  console.log(`已更新 README 项目索引：${catalog.projects.length} 个项目。`);
}

function isMainModule() {
  return Boolean(process.argv[1]) && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url;
}

if (isMainModule()) {
  try {
    main();
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
