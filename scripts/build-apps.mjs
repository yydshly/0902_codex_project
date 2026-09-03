import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { spawnSync } from 'node:child_process';

import { loadCatalog, resolveRepositoryPath } from './validate-catalog.mjs';

function runNpm(arguments_, workingDirectory, projectId) {
  const executable = process.platform === 'win32' ? 'npm.cmd' : 'npm';
  const result = spawnSync(executable, arguments_, {
    cwd: workingDirectory,
    env: process.env,
    stdio: 'inherit',
  });

  if (result.error) {
    throw new Error(`项目 ${projectId} 无法启动 npm ${arguments_.join(' ')}：${result.error.message}`);
  }
  if (result.status !== 0) {
    throw new Error(`项目 ${projectId} 的 npm ${arguments_.join(' ')} 失败（退出码 ${result.status ?? 'unknown'}）`);
  }
}

function requireFile(filePath, message) {
  if (!fs.existsSync(filePath) || !fs.lstatSync(filePath).isFile()) {
    throw new Error(message);
  }
}

function buildApps() {
  const catalog = loadCatalog({ checkFiles: true });
  const projects = catalog.projects.filter((project) => project.demo?.status === 'published');

  for (const project of projects) {
    const sourceDirectory = resolveRepositoryPath(project.demo.sourcePath);
    const packagePath = path.join(sourceDirectory, 'package.json');
    const lockPath = path.join(sourceDirectory, 'package-lock.json');
    requireFile(packagePath, `项目 ${project.id} 的本地 published Demo 缺少 ${project.demo.sourcePath}/package.json`);
    requireFile(lockPath, `项目 ${project.id} 的本地 published Demo 缺少 ${project.demo.sourcePath}/package-lock.json`);

    console.log(`构建项目 ${project.id}：${project.title}`);
    runNpm(['ci'], sourceDirectory, project.id);
    runNpm(['run', 'build'], sourceDirectory, project.id);

    const outputDirectory = resolveRepositoryPath(project.demo.buildOutput);
    if (!fs.existsSync(outputDirectory) || !fs.lstatSync(outputDirectory).isDirectory()) {
      throw new Error(`项目 ${project.id} 构建完成后未生成目录 ${project.demo.buildOutput}`);
    }
  }

  console.log(`Demo 构建完成：${projects.length} 个本地 published Demo。`);
}

try {
  buildApps();
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
