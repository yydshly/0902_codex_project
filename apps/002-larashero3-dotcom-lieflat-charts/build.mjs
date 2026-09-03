import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { spawnSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

export const UPSTREAM_COMMIT = '4eef5ce00d0907a03b8eff42578b5a04942915e9';
export const UPSTREAM_REPOSITORY = 'https://github.com/larashero3-dotcom/lieflat-charts';

export const UPSTREAM_FILES = [
  'LICENSE',
  'THIRD_PARTY_NOTICES.md',
  'README.md',
  'SKILL.md',
  'catalog.md',
  'report-catalog.md',
  'examples/lenny-2026-survey.html',
  'examples/reports/r04-financial-report.zh.html',
  'templates/basics-gallery.html',
  'templates/big-circular.html',
  'templates/big-force.html',
  'templates/big-threads.html',
  'templates/color/basics-palm.html',
  'templates/color/basics-porcelain.html',
  'templates/color/basics-wire.html',
  'templates/color/big-circular-palm.html',
  'templates/color/big-circular-porcelain.html',
  'templates/color/big-force-palm.html',
  'templates/color/big-force-porcelain.html',
  'templates/color/big-threads-palm.html',
  'templates/color/big-threads-porcelain.html',
  'templates/color/glance-palm.html',
  'templates/color/glance-porcelain.html',
  'templates/color/glance-wire.html',
  'templates/color/lupi-palm.html',
  'templates/color/lupi-porcelain.html',
  'templates/color/lupi-wire.html',
  'templates/color/maps-palm.html',
  'templates/color/maps-porcelain.html',
  'templates/color/maps-wire.html',
  'templates/glance-gallery.html',
  'templates/lupi-gallery.html',
  'templates/maps-gallery.html',
  'templates/reports/index.html',
  'templates/reports/report-01.en.html',
  'templates/reports/report-01.zh.html',
  'templates/reports/report-02.en.html',
  'templates/reports/report-02.zh.html',
  'templates/reports/report-03.en.html',
  'templates/reports/report-03.zh.html',
  'templates/reports/report-04.en.html',
  'templates/reports/report-04.zh.html',
  'templates/reports/report-05.en.html',
  'templates/reports/report-05.zh.html',
  'templates/reports/report-06.en.html',
  'templates/reports/report-06.zh.html',
  'templates/reports/report-07.en.html',
  'templates/reports/report-07.zh.html',
  'templates/reports/report-08.en.html',
  'templates/reports/report-08.zh.html',
  'templates/reports/report-09.en.html',
  'templates/reports/report-09.zh.html',
  'templates/reports/report-10.en.html',
  'templates/reports/report-10.zh.html',
  'templates/reports/report-11.en.html',
  'templates/reports/report-11.zh.html',
  'templates/reports/report-12.en.html',
  'templates/reports/report-12.zh.html',
  ...['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
    .map((number) => `docs/assets/reports/report-${number}.png`),
  ...['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
    .map((number) => `docs/assets/reports/en/report-${number}.png`),
];

const appDirectory = path.dirname(fileURLToPath(import.meta.url));
const sourceDirectory = path.join(appDirectory, 'src');
const outputDirectory = path.join(appDirectory, 'dist');
const upstreamOutput = path.join(outputDirectory, 'upstream');
const localClone = path.resolve(appDirectory, '../../.codex-tmp/upstreams/lieflat-charts');
const rawBase = `https://raw.githubusercontent.com/larashero3-dotcom/lieflat-charts/${UPSTREAM_COMMIT}`;

function safeDestination(root, relativePath) {
  const destination = path.resolve(root, ...relativePath.split('/'));
  const relative = path.relative(root, destination);
  if (relative.startsWith('..') || path.isAbsolute(relative)) {
    throw new Error(`路径超出目标目录：${relativePath}`);
  }
  return destination;
}

function copyTree(source, destination) {
  const stat = fs.lstatSync(source);
  if (stat.isSymbolicLink()) throw new Error(`拒绝复制符号链接：${source}`);
  if (stat.isDirectory()) {
    fs.mkdirSync(destination, { recursive: true });
    for (const entry of fs.readdirSync(source, { withFileTypes: true })) {
      copyTree(path.join(source, entry.name), path.join(destination, entry.name));
    }
    return;
  }
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.copyFileSync(source, destination);
}

function localCloneStatus() {
  if (!fs.existsSync(localClone)) return { available: false };
  const result = spawnSync('git', ['-C', localClone, 'rev-parse', 'HEAD'], {
    encoding: 'utf8',
    windowsHide: true,
  });
  if (result.status !== 0) {
    throw new Error(`无法读取本地上游 clone：${result.stderr || result.error?.message || 'unknown error'}`);
  }
  const commit = result.stdout.trim();
  if (commit !== UPSTREAM_COMMIT) {
    throw new Error(`本地上游版本不匹配：需要 ${UPSTREAM_COMMIT}，实际 ${commit}`);
  }
  return { available: true, commit };
}

async function download(relativePath, destination) {
  const response = await fetch(`${rawBase}/${relativePath}`, {
    headers: { 'User-Agent': '0902-codex-project-capability-atlas' },
  });
  if (!response.ok) {
    throw new Error(`获取上游文件失败 (${response.status})：${relativePath}`);
  }
  const bytes = Buffer.from(await response.arrayBuffer());
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.writeFileSync(destination, bytes);
}

async function mapWithLimit(items, limit, worker) {
  let cursor = 0;
  async function run() {
    while (cursor < items.length) {
      const index = cursor;
      cursor += 1;
      await worker(items[index]);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, run));
}

export async function build() {
  if (!fs.existsSync(sourceDirectory)) throw new Error('缺少 src/ 静态应用目录');
  fs.rmSync(outputDirectory, { recursive: true, force: true });
  copyTree(sourceDirectory, outputDirectory);
  fs.mkdirSync(upstreamOutput, { recursive: true });

  const clone = localCloneStatus();
  await mapWithLimit(UPSTREAM_FILES, 8, async (relativePath) => {
    const destination = safeDestination(upstreamOutput, relativePath);
    if (clone.available) {
      const source = safeDestination(localClone, relativePath);
      if (!fs.existsSync(source)) throw new Error(`本地上游缺少文件：${relativePath}`);
      fs.mkdirSync(path.dirname(destination), { recursive: true });
      fs.copyFileSync(source, destination);
    } else {
      await download(relativePath, destination);
    }
  });

  fs.writeFileSync(
    path.join(upstreamOutput, 'UPSTREAM_VERSION.json'),
    `${JSON.stringify({
      repository: UPSTREAM_REPOSITORY,
      commit: UPSTREAM_COMMIT,
      fetchedAt: new Date().toISOString(),
      source: clone.available ? 'local-clone' : 'github-raw',
      fileCount: UPSTREAM_FILES.length,
    }, null, 2)}\n`,
    'utf8',
  );

  console.log(`Lieflat Charts 能力展厅已构建：${UPSTREAM_FILES.length} 个固定上游文件（${clone.available ? '本地 clone' : 'GitHub Raw'}）。`);
}

const isMain = Boolean(process.argv[1]) && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url;
if (isMain) {
  try {
    await build();
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
