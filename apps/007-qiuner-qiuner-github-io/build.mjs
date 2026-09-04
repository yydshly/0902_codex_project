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
  'qiuner-github-io',
);
const sourceDirectory = path.join(appDirectory, 'src');
const outputDirectory = path.join(appDirectory, 'dist');
const upstreamOutput = path.join(outputDirectory, 'upstream');
const brandOutput = path.join(outputDirectory, 'brand');
const catalogPath = path.join(repositoryRoot, 'catalog', 'projects.json');
const productLabDirectory = path.join(repositoryRoot, 'apps', '009-ai-product-capability-lab');
const productLabSource = path.join(productLabDirectory, 'dist', 'client');
const productLabOutput = path.join(outputDirectory, 'product-lab');

const UPSTREAM_REPOSITORY = 'https://github.com/Qiuner/Qiuner.github.io.git';
const UPSTREAM_COMMIT = '85b20634da13a02bcc2e67b2f42fb50d4aba7b93';
const REQUIRED_PATTERNS = [
  '/README.md',
  '/README.zh-CN.md',
  '/package.json',
  '/CONTEXT.zh-CN.md',
  '/src/content/',
  '/src/runtime/',
  '/src/worlds/',
  '/tests/',
  '/docs/ARCHITECTURE.zh-CN.md',
  '/docs/MIGRATION-DEBT.md',
  '/.github/workflows/deploy.yml',
];

const BRAND_CAPABILITIES = [
  {
    id: 'visual-compute',
    label: '视觉计算',
    signal: 'WebGL · WebGPU · Shader',
    tags: ['three.js', 'webgpu', 'webgl', 'compute', 'shaders', 'canvas', 'procedural'],
  },
  {
    id: 'interactive-product',
    label: '交互产品',
    signal: 'Realtime · UI · Audio',
    tags: ['ui-components', 'audio-reactive', 'realtime'],
  },
  {
    id: 'agent-workflow',
    label: 'Agent 工作流',
    signal: 'Skills · Automation · Safety',
    tags: ['agent-skills', 'workflow-automation', 'content-ops', 'safety'],
  },
  {
    id: 'data-systems',
    label: '数据系统',
    signal: 'Observability · Dataset · Storage',
    tags: ['data-visualization', 'observability', 'network', 'sqlite', 'clickhouse', 'dataset'],
  },
  {
    id: 'design-research',
    label: '设计研究',
    signal: 'System · Layout · Taxonomy',
    tags: ['design-system', 'visual-design', 'layout', 'composition', 'taxonomy', 'static-gallery'],
  },
];

function runGit(arguments_, cwd = repositoryRoot) {
  return execFileSync('git', arguments_, {
    cwd,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'inherit'],
  }).trim();
}

function runNpm(arguments_, cwd) {
  const npmCli = process.env.npm_execpath;
  const executable = npmCli ? process.execPath : (process.platform === 'win32' ? 'npm.cmd' : 'npm');
  const spawnArguments = npmCli ? [npmCli, ...arguments_] : arguments_;
  execFileSync(executable, spawnArguments, {
    cwd,
    env: process.env,
    stdio: 'inherit',
  });
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
  if (!stat.isFile()) throw new Error(`只支持复制普通文件或目录：${source}`);
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.copyFileSync(source, destination);
}

function buildProductLab() {
  for (const filename of ['package.json', 'package-lock.json']) {
    const required = path.join(productLabDirectory, filename);
    if (!fs.existsSync(required)) throw new Error(`3D 产品实验室缺少 ${filename}`);
  }
  runNpm(['ci'], productLabDirectory);
  runNpm(['run', 'verify'], productLabDirectory);
  if (!fs.existsSync(path.join(productLabSource, 'index.html'))) {
    throw new Error('3D 产品实验室没有生成 dist/client/index.html');
  }
  requireInside(outputDirectory, productLabOutput);
  copyTree(productLabSource, productLabOutput);
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
    '-C', upstreamDirectory,
    'sparse-checkout', 'set',
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

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const target = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(target) : [target];
  });
}

function countMatches(text, pattern) {
  return [...text.matchAll(pattern)].length;
}

function buildMetadata() {
  const packageMetadata = JSON.parse(
    fs.readFileSync(path.join(upstreamDirectory, 'package.json'), 'utf8'),
  );
  const sourceFiles = walk(path.join(upstreamDirectory, 'src')).filter((file) =>
    /\.(?:astro|css|ts|vue)$/.test(file),
  );
  const runtimeFiles = walk(path.join(upstreamDirectory, 'src', 'runtime')).filter((file) =>
    file.endsWith('.ts'),
  );
  const testFiles = walk(path.join(upstreamDirectory, 'tests')).filter((file) =>
    file.endsWith('.test.ts'),
  );
  const worldDirectory = path.join(upstreamDirectory, 'src', 'worlds');
  const worldIds = fs.readdirSync(worldDirectory, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .filter((entry) => fs.existsSync(path.join(worldDirectory, entry.name, 'manifest.ts')))
    .map((entry) => entry.name)
    .sort();
  const portalSource = fs.readFileSync(
    path.join(worldDirectory, 'portals.config.ts'),
    'utf8',
  );
  const trackedFiles = runGit([
    '-C', upstreamDirectory, 'ls-tree', '-r', '--name-only', UPSTREAM_COMMIT,
  ]).split(/\r?\n/).filter(Boolean);
  const licenseNames = new Set(['license', 'license.md', 'license.txt', 'copying']);
  const hasLicense = trackedFiles.some((file) =>
    licenseNames.has(path.posix.basename(file).toLowerCase()),
  );
  const sourceLines = sourceFiles.reduce((total, file) => {
    return total + fs.readFileSync(file, 'utf8').split(/\r?\n/).length;
  }, 0);

  return {
    repository: UPSTREAM_REPOSITORY.replace(/\.git$/, ''),
    liveSite: 'https://qiuner.github.io/',
    commit: UPSTREAM_COMMIT,
    commitShort: UPSTREAM_COMMIT.slice(0, 7),
    capturedAt: '2026-09-03',
    license: hasLicense ? 'declared' : 'not-declared',
    stack: {
      astro: packageMetadata.dependencies.astro,
      three: packageMetadata.dependencies.three,
      vue: packageMetadata.dependencies.vue,
      typescript: packageMetadata.devDependencies.typescript,
    },
    counts: {
      worlds: worldIds.length,
      portalRoutes: countMatches(portalSource, /targetWorldId\s*:/g),
      runtimeModules: runtimeFiles.length,
      sourceModules: sourceFiles.length,
      sourceLines,
      testFiles: testFiles.length,
      trackedFiles: trackedFiles.length,
      publicAssets: trackedFiles.filter((file) => file.startsWith('public/')).length,
    },
    worldIds,
    verified: {
      testCases: 73,
      buildPages: 2,
      diagnostics: '0 errors / 0 warnings / 0 hints',
      note: '2026-09-03 在 Node 22.15.0 上实测；上游 CI 使用 Node 24。',
    },
    boundaries: [
      '不是 npm 包或公开插件 SDK',
      '当前 live-dual 仍使用截图覆盖层，不是双世界实时合成',
      'Manifest 预算尚未形成完整构建期强制门禁',
      '真实浏览器 GPU 泄漏与视觉回归覆盖仍不足',
    ],
  };
}

function buildBrandSample() {
  const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
  const projects = catalog.projects.filter((project) => project.id !== '007');
  const publishedProjects = projects.filter((project) => project.demo?.status === 'published');
  const validatedProjects = projects.filter((project) => project.status === 'validated');
  const uniqueTags = new Set(projects.flatMap((project) => project.tags));

  const caseProjects = projects.map((project) => {
    const capabilities = BRAND_CAPABILITIES
      .filter((capability) => capability.tags.some((tag) => project.tags.includes(tag)))
      .map((capability) => capability.id);

    return {
      id: project.id,
      slug: project.slug,
      title: project.title,
      summary: project.summary,
      status: project.status,
      tags: project.tags,
      capabilities,
      repository: project.repository,
      demo: project.demo
        ? {
            url: project.demo.url,
            status: project.demo.status,
          }
        : null,
    };
  });

  const evidenceCoverage = BRAND_CAPABILITIES.map((capability) => {
    const matchingProjects = caseProjects.filter((project) =>
      project.capabilities.includes(capability.id),
    );
    const validatedCount = matchingProjects.filter((project) => project.status === 'validated').length;
    return {
      id: capability.id,
      label: capability.label,
      score: Math.min(96, 50 + matchingProjects.length * 9 + validatedCount * 5),
      projectCount: matchingProjects.length,
      validatedCount,
    };
  });

  return {
    source: 'catalog/projects.json',
    generatedAt: catalog.updatedAt,
    profile: {
      code: '0902 / BUILD LOG',
      title: 'RESEARCH → PROTOTYPE → PROOF',
      statement: '持续拆解优秀开源项目，把架构理解转化为可运行 Demo 与可复用方法。',
    },
    metrics: {
      projects: projects.length,
      publishedDemos: publishedProjects.length,
      validated: validatedProjects.length,
      tags: uniqueTags.size,
    },
    capabilities: BRAND_CAPABILITIES.map(({ tags, ...capability }) => ({
      ...capability,
      projectCount: caseProjects.filter((project) => project.capabilities.includes(capability.id)).length,
    })),
    simulation: {
      label: 'SIMULATED POSITIONING / EVIDENCE-BASED',
      role: 'AI 产品与体验系统构建者',
      headline: '把复杂技术拆成可理解、可运行、可验证的产品体验。',
      disclaimer: '定位、受众与服务方向为项目证据推导；项目、状态与 Demo 为真实目录数据。',
      differentiators: [
        '研究不止于总结，而是继续转化为可运行 Demo',
        '横跨 Agent、数据系统、WebGL 与视觉设计',
        '同时展示实现成果、验证证据和能力边界',
      ],
      evidenceCoverage,
      audiences: [
        {
          id: 'ai-product',
          label: 'AI 产品团队',
          need: '需要把模型能力接入稳定、可观测、可复用的真实工作流。',
          proposition: '从 Agent 能力路由到数据闭环，把概念验证推进为可运行产品。',
          deliverables: ['Agent 能力架构', '工作流原型', '验证与观测方案'],
          proofIds: ['002', '004', '005'],
        },
        {
          id: 'brand-experience',
          label: '品牌与创意团队',
          need: '需要让技术能力变成用户能理解、能探索、能记住的数字体验。',
          proposition: '连接视觉计算、交互组件与信息设计，构建有证据的品牌体验。',
          deliverables: ['互动体验原型', '视觉系统', '内容与资产架构'],
          proofIds: ['001', '003', '006'],
        },
        {
          id: 'open-source',
          label: '开源与工具团队',
          need: '需要把复杂项目的能力、边界和采用路径解释清楚。',
          proposition: '通过源码研究、可运行案例和结构化文档降低理解与采用成本。',
          deliverables: ['技术能力审计', '示例与文档', '采用路线设计'],
          proofIds: ['003', '004', '005'],
        },
      ],
      nextGaps: [
        '补充真实姓名、经历与长期目标',
        '为代表项目补充职责、周期和量化结果',
        '用真实合作反馈替代模拟受众假设',
      ],
    },
    projects: caseProjects,
  };
}

function requireInside(parent, target) {
  const relative = path.relative(parent, target);
  if (relative.startsWith('..') || path.isAbsolute(relative)) {
    throw new Error(`路径越界：${target}`);
  }
}

function build() {
  ensureUpstream();
  const metadata = buildMetadata();
  const brandSample = buildBrandSample();

  requireInside(appDirectory, outputDirectory);
  fs.rmSync(outputDirectory, { recursive: true, force: true });
  fs.mkdirSync(upstreamOutput, { recursive: true });
  fs.mkdirSync(brandOutput, { recursive: true });

  for (const filename of ['index.html', 'styles.css', 'app.js']) {
    fs.copyFileSync(path.join(sourceDirectory, filename), path.join(outputDirectory, filename));
  }

  fs.writeFileSync(
    path.join(upstreamOutput, 'meta.json'),
    `${JSON.stringify(metadata, null, 2)}\n`,
    'utf8',
  );
  fs.writeFileSync(
    path.join(upstreamOutput, 'RIGHTS-NOTICE.txt'),
    [
      'Upstream repository: https://github.com/Qiuner/Qiuner.github.io',
      `Pinned commit: ${UPSTREAM_COMMIT}`,
      'License status at this baseline: no LICENSE file found.',
      'This demo does not redistribute upstream source code or media.',
      'The live viewport embeds the upstream GitHub Pages deployment.',
      '',
    ].join('\n'),
    'utf8',
  );
  fs.writeFileSync(
    path.join(brandOutput, 'case.json'),
    `${JSON.stringify(brandSample, null, 2)}\n`,
    'utf8',
  );

  buildProductLab();

  console.log(
    `构建完成：${metadata.counts.worlds} Worlds / ${metadata.counts.portalRoutes} Portal routes / ${brandSample.metrics.projects} 个真实样例项目 / 1 个真实 3D 产品原型。`,
  );
}

build();
