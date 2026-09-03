import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { spawnSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

export const UPSTREAM_REPOSITORY = 'https://github.com/foru17/neko-master';
export const UPSTREAM_COMMIT = '6f72cfd0db69e2952713f24a648812407fef1e78';
export const UPSTREAM_TAG = 'v1.4.0';

export const UPSTREAM_FILES = [
  'LICENSE',
  'README.zh.md',
  'CHANGELOG.md',
  'AGENTS.md',
  'docs/architecture.md',
  'docs/agent/overview.md',
  'apps/collector/src/database/schema.ts',
  'apps/collector/src/modules/collector/gateway.collector.ts',
  'apps/collector/src/modules/collector/batch-buffer.ts',
  'apps/collector/src/modules/realtime/realtime.store.ts',
  'apps/collector/src/modules/websocket/websocket.server.ts',
  'apps/agent/internal/agent/runner.go',
  'apps/web/lib/api.ts',
  'apps/web/components/layout/navigation.tsx',
  'apps/web/app/[locale]/dashboard/components/content/index.tsx',
  'apps/web/components/features/domains/domain-top-grid.tsx',
  'apps/web/components/features/countries/world-traffic-map.tsx',
  'apps/web/components/features/proxies/interactive-proxy-stats.tsx',
  'apps/web/components/features/devices/interactive-device-stats.tsx',
  'apps/web/components/features/rules/interactive-rule-stats.tsx',
  'apps/web/components/features/health/backend-health-chart.tsx',
  'apps/web/components/features/backend/backend-config-dialog.tsx',
];

const appDirectory = path.dirname(fileURLToPath(import.meta.url));
const sourceDirectory = path.join(appDirectory, 'src');
const outputDirectory = path.join(appDirectory, 'dist');
const upstreamOutput = path.join(outputDirectory, 'upstream');
const localClone = path.resolve(appDirectory, '../../.codex-tmp/upstreams/neko-master');
const rawBase = `https://raw.githubusercontent.com/foru17/neko-master/${UPSTREAM_COMMIT}`;

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
    headers: { 'User-Agent': '0902-codex-project-neko-master-capability-lab' },
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
  const relativeOutput = path.relative(appDirectory, outputDirectory);
  if (relativeOutput !== 'dist') throw new Error(`拒绝清理意外输出目录：${outputDirectory}`);

  fs.rmSync(outputDirectory, { recursive: true, force: true });
  copyTree(sourceDirectory, outputDirectory);
  fs.mkdirSync(upstreamOutput, { recursive: true });

  const clone = localCloneStatus();
  await mapWithLimit(UPSTREAM_FILES, 6, async (relativePath) => {
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
      tag: UPSTREAM_TAG,
      fetchedAt: new Date().toISOString(),
      source: clone.available ? 'local-clone' : 'github-raw',
      fileCount: UPSTREAM_FILES.length,
    }, null, 2)}\n`,
    'utf8',
  );

  console.log(`Neko Master 能力实验室已构建：${UPSTREAM_FILES.length} 个固定上游证据文件（${clone.available ? '本地 clone' : 'GitHub Raw'}）。`);
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
