import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const appDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(appDirectory, '..', '..');
const upstreamDirectory = path.join(
  repositoryRoot,
  '.codex-tmp',
  'upstreams',
  '350-layout-compositions',
);
const sourceDirectory = path.join(appDirectory, 'src');
const outputDirectory = path.join(appDirectory, 'dist');
const upstreamOutput = path.join(outputDirectory, 'upstream');
const thumbOutput = path.join(upstreamOutput, 'thumbs');

const UPSTREAM_REPOSITORY = 'https://github.com/nevertoday/350-layout-compositions.git';
const UPSTREAM_COMMIT = '34dc39cb5128776b594754624fa2202d5942a35b';
const REQUIRED_PATTERNS = [
  '/README.md',
  '/LICENSE',
  '/CONTRIBUTING.md',
  '/scripts/',
  '/docs/350/',
  '/v2/catalog.json',
  '/v2/catalog.csv',
  '/v2/thumbnails/',
];

function runGit(arguments_, cwd = repositoryRoot) {
  return execFileSync('git', arguments_, {
    cwd,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'inherit'],
  }).trim();
}

function ensureUpstream() {
  if (!fs.existsSync(path.join(upstreamDirectory, '.git'))) {
    fs.mkdirSync(path.dirname(upstreamDirectory), { recursive: true });
    runGit([
      'clone',
      '--filter=blob:none',
      '--no-checkout',
      UPSTREAM_REPOSITORY,
      upstreamDirectory,
    ]);
  }

  runGit(['-C', upstreamDirectory, 'sparse-checkout', 'init', '--no-cone']);
  runGit([
    '-C',
    upstreamDirectory,
    'sparse-checkout',
    'set',
    ...REQUIRED_PATTERNS,
  ]);

  try {
    runGit(['-C', upstreamDirectory, 'cat-file', '-e', `${UPSTREAM_COMMIT}^{commit}`]);
  } catch {
    runGit(['-C', upstreamDirectory, 'fetch', '--depth=1', 'origin', UPSTREAM_COMMIT]);
  }

  runGit(['-C', upstreamDirectory, 'checkout', '--detach', UPSTREAM_COMMIT]);
  const actualCommit = runGit(['-C', upstreamDirectory, 'rev-parse', 'HEAD']);
  if (actualCommit !== UPSTREAM_COMMIT) {
    throw new Error(`上游版本不一致：${actualCommit}`);
  }
}

function requireInside(parent, target) {
  const relative = path.relative(parent, target);
  if (relative.startsWith('..') || path.isAbsolute(relative)) {
    throw new Error(`路径越界：${target}`);
  }
}

function build() {
  ensureUpstream();

  const catalogPath = path.join(upstreamDirectory, 'v2', 'catalog.json');
  const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
  const categories = new Set(catalog.map((item) => item.category_slug));
  const subcategories = new Set(catalog.map((item) => item.subcategory_slug));

  if (catalog.length !== 350 || categories.size !== 8 || subcategories.size !== 33) {
    throw new Error(
      `上游目录结构异常：${catalog.length} 项 / ${categories.size} 类 / ${subcategories.size} 主题`,
    );
  }

  requireInside(appDirectory, outputDirectory);
  fs.rmSync(outputDirectory, { recursive: true, force: true });
  fs.mkdirSync(thumbOutput, { recursive: true });

  for (const filename of ['index.html', 'styles.css', 'app.js']) {
    fs.copyFileSync(path.join(sourceDirectory, filename), path.join(outputDirectory, filename));
  }

  fs.copyFileSync(catalogPath, path.join(upstreamOutput, 'catalog.json'));
  fs.copyFileSync(
    path.join(upstreamDirectory, 'v2', 'catalog.csv'),
    path.join(upstreamOutput, 'catalog.csv'),
  );
  fs.copyFileSync(
    path.join(upstreamDirectory, 'LICENSE'),
    path.join(upstreamOutput, 'UPSTREAM-LICENSE.txt'),
  );

  for (const item of catalog) {
    const source = path.join(upstreamDirectory, ...item.thumbnail.split('/'));
    if (!fs.existsSync(source)) {
      throw new Error(`缺少上游缩略图：${item.thumbnail}`);
    }
    fs.copyFileSync(source, path.join(thumbOutput, `${item.id}.jpg`));
  }

  const metadata = {
    repository: UPSTREAM_REPOSITORY.replace(/\.git$/, ''),
    commit: UPSTREAM_COMMIT,
    license: 'CC BY 4.0',
    catalogCount: catalog.length,
    categoryCount: categories.size,
    subcategoryCount: subcategories.size,
    displayMode: 'full-catalog-grouped',
    semanticStatus: 'upstream-labels-unverified',
    qualityIssue: 'https://github.com/nevertoday/350-layout-compositions/issues/1',
  };
  fs.writeFileSync(
    path.join(upstreamOutput, 'meta.json'),
    `${JSON.stringify(metadata, null, 2)}\n`,
    'utf8',
  );

  console.log(
    `构建完成：${catalog.length} 项 / ${categories.size} 类 / ${subcategories.size} 主题 / 350 张缩略图。`,
  );
}

build();
