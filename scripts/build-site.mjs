import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { pathToFileURL } from 'node:url';

import { loadCatalog, REPOSITORY_ROOT, resolveRepositoryPath } from './validate-catalog.mjs';

const SITE_DIRECTORY = path.join(REPOSITORY_ROOT, 'site');
const DIST_DIRECTORY = path.join(REPOSITORY_ROOT, 'dist');

function destinationPath(relativePath) {
  const resolved = path.resolve(DIST_DIRECTORY, ...relativePath.split('/'));
  const relative = path.relative(DIST_DIRECTORY, resolved);
  if (relative.startsWith('..') || path.isAbsolute(relative)) {
    throw new Error(`发布路径超出 dist：${JSON.stringify(relativePath)}`);
  }
  return resolved;
}

function copyTree(source, destination) {
  const stat = fs.lstatSync(source);
  if (stat.isSymbolicLink()) {
    throw new Error(`拒绝复制符号链接：${path.relative(REPOSITORY_ROOT, source)}`);
  }

  if (stat.isDirectory()) {
    fs.mkdirSync(destination, { recursive: true });
    const entries = fs.readdirSync(source, { withFileTypes: true })
      .sort((left, right) => left.name.localeCompare(right.name, 'en'));
    for (const entry of entries) {
      copyTree(path.join(source, entry.name), path.join(destination, entry.name));
    }
    return;
  }

  if (!stat.isFile()) {
    throw new Error(`只支持复制普通文件或目录：${path.relative(REPOSITORY_ROOT, source)}`);
  }

  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.copyFileSync(source, destination);
}

function assertSiteSource() {
  if (!fs.existsSync(SITE_DIRECTORY) || !fs.statSync(SITE_DIRECTORY).isDirectory()) {
    throw new Error('缺少 site/ 静态门户目录');
  }
  if (!fs.existsSync(path.join(SITE_DIRECTORY, 'index.html'))) {
    throw new Error('site/ 必须包含 index.html');
  }
}

function assertDirectory(relativePath, label) {
  const absolutePath = resolveRepositoryPath(relativePath);
  if (!fs.existsSync(absolutePath) || !fs.lstatSync(absolutePath).isDirectory()) {
    throw new Error(`${label} 缺少已构建产物目录 ${relativePath}；请先运行 npm run build:apps`);
  }
  return absolutePath;
}

function build() {
  const catalog = loadCatalog({ checkFiles: true });
  assertSiteSource();

  fs.rmSync(DIST_DIRECTORY, { recursive: true, force: true });
  fs.mkdirSync(DIST_DIRECTORY, { recursive: true });
  copyTree(SITE_DIRECTORY, DIST_DIRECTORY);

  const publishedSources = new Map();
  const copyPublishedFile = (sourceRelativePath, destinationRelativePath, label) => {
    const existing = publishedSources.get(destinationRelativePath);
    if (existing && existing !== sourceRelativePath) {
      throw new Error(`${label} 与 ${existing} 的发布目标冲突：${destinationRelativePath}`);
    }
    publishedSources.set(destinationRelativePath, sourceRelativePath);
    copyTree(resolveRepositoryPath(sourceRelativePath), destinationPath(destinationRelativePath));
  };

  copyPublishedFile('catalog/projects.json', 'catalog/projects.json', '项目目录');
  copyPublishedFile('catalog/projects.schema.json', 'catalog/projects.schema.json', '目录 Schema');

  let coverCount = 0;
  let demoCount = 0;
  for (const project of catalog.projects) {
    if (project.cover) {
      copyPublishedFile(project.cover.path, project.cover.path, `项目 ${project.id} 封面`);
      coverCount += 1;
    }

    if (project.demo?.status === 'published') {
      const existing = publishedSources.get(project.demo.publicPath);
      if (existing && existing !== project.demo.buildOutput) {
        throw new Error(`项目 ${project.id} Demo 发布目标冲突：${project.demo.publicPath}`);
      }
      publishedSources.set(project.demo.publicPath, project.demo.buildOutput);
      copyTree(
        assertDirectory(project.demo.buildOutput, `项目 ${project.id}`),
        destinationPath(project.demo.publicPath),
      );
      demoCount += 1;
    }
  }

  fs.writeFileSync(path.join(DIST_DIRECTORY, '.nojekyll'), '', 'utf8');
  console.log(`站点构建完成：${catalog.projects.length} 个项目，${coverCount} 张封面，${demoCount} 个本地 Demo。`);
}

function isMainModule() {
  return Boolean(process.argv[1]) && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url;
}

if (isMainModule()) {
  try {
    build();
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
