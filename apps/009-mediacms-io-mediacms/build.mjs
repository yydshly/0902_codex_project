import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath, pathToFileURL } from 'node:url';

export const UPSTREAM_REPOSITORY = 'https://github.com/mediacms-io/mediacms';
export const UPSTREAM_COMMIT = 'd146be7c3c6828075dfc83719c37819f1b6fbef7';

const appDirectory = path.dirname(fileURLToPath(import.meta.url));
const sourceDirectory = path.join(appDirectory, 'src');
const outputDirectory = path.join(appDirectory, 'dist');

const source = (id, label, file, lines = '') => ({
  id,
  label,
  url: `${UPSTREAM_REPOSITORY}/blob/${UPSTREAM_COMMIT}/${file}${lines}`,
});

const evidence = {
  repository: UPSTREAM_REPOSITORY,
  release: 'v8.4.0',
  commit: UPSTREAM_COMMIT,
  commitShort: UPSTREAM_COMMIT.slice(0, 7),
  capturedAt: '2026-09-04',
  conclusion: 'MediaCMS 不是视频组件，而是一套可自托管的媒体库管理、转码、权限与播放平台。只有当团队确实需要掌控自己的媒体资产链路时，它的研究和采用价值才会显著上升。',
  flows: [
    {
      id: 'upload',
      label: '上传与入库',
      summary: '客户端分片上传，服务端合并文件、识别媒体类型并创建媒体记录。',
      nodes: ['creator', 'react', 'nginx', 'django', 'storage', 'postgres'],
      steps: ['分片上传', '合并原文件', '识别媒体类型', '写入元数据'],
    },
    {
      id: 'process',
      label: '异步处理',
      summary: 'Django 将耗时任务交给 Celery；FFmpeg 转码，Bento4 生成 HLS，Whisper 可选生成字幕。',
      nodes: ['django', 'redis', 'celery', 'ffmpeg', 'bento', 'whisper', 'storage', 'postgres'],
      steps: ['任务入队', '多规格转码', 'HLS 切片', '字幕与状态回写'],
    },
    {
      id: 'playback',
      label: '鉴权与播放',
      summary: '访问请求经过 Nginx 与 Django 权限判断，再由 video.js 播放 HLS 或文件。',
      nodes: ['viewer', 'react', 'nginx', 'django', 'redis', 'storage'],
      steps: ['请求媒体', '校验可见性与权限', '读取 HLS/文件', '浏览器播放'],
    },
  ],
  constraints: [
    '默认是多进程、多服务、CPU 与磁盘密集型系统，不是轻量视频组件。',
    '源码大量依赖本地或共享 POSIX 文件路径，对象存储不是简单更换配置。',
    'README 建议按原文件约 3 倍估算存储，以容纳原件、转码版本与 HLS。',
    'AGPL-3.0 涉及网络服务修改版的源码提供义务，商用前应由法务结合部署方式确认。',
    '安全策略只支持最新稳定版本，生产使用需要持续跟进升级。',
  ],
  extensions: [
    { rank: 1, title: '对象存储与 CDN', value: '基础设施优先', detail: '抽象本地路径依赖，支持直传、生命周期、分发与跨区容灾。' },
    { rank: 2, title: '弹性转码后端', value: '性能优先', detail: '把 Celery 任务扩展为 GPU、外部转码服务、幂等重试和可观测队列。' },
    { rank: 3, title: 'AI 媒体知识层', value: '产品增量', detail: '字幕、说话人、章节、摘要、OCR、审核、向量检索与视频问答。' },
    { rank: 4, title: '企业治理', value: '规模化前提', detail: 'OIDC/SCIM、审计、保留策略、水印、DRM 与细粒度租户隔离。' },
  ],
  sources: [
    source('readme', '产品能力、组件与存储估算', 'README.md'),
    source('changelog', 'v8.4.0 版本记录', 'CHANGELOG.md'),
    source('media-model', '媒体生命周期、文件路径与搜索向量', 'files/models/media.py'),
    source('encoding-model', '编码配置与结果模型', 'files/models/encoding.py'),
    source('tasks', 'Celery、FFmpeg、HLS 与 Whisper 任务', 'files/tasks.py'),
    source('uploader', '分片上传、合并与媒体创建', 'uploader/views.py'),
    source('media-auth', 'Nginx auth_request 权限判断', 'files/views/media_auth.py'),
    source('settings', 'Django、Redis、Celery 与本地媒体目录', 'cms/settings.py'),
    source('developers', '开发者与扩容说明', 'docs/developers_docs.md'),
    source('admins', '管理员配置与部署说明', 'docs/admins_docs.md'),
    source('permissions', '直接授权与分类组权限', 'docs/media_permissions.md'),
    source('security', '最新稳定版安全支持策略', 'SECURITY.md'),
  ],
};

function copyTree(sourcePath, destinationPath) {
  const stat = fs.lstatSync(sourcePath);
  if (stat.isSymbolicLink()) throw new Error(`拒绝复制符号链接：${sourcePath}`);
  if (stat.isDirectory()) {
    fs.mkdirSync(destinationPath, { recursive: true });
    for (const entry of fs.readdirSync(sourcePath, { withFileTypes: true })) {
      copyTree(path.join(sourcePath, entry.name), path.join(destinationPath, entry.name));
    }
    return;
  }
  fs.mkdirSync(path.dirname(destinationPath), { recursive: true });
  fs.copyFileSync(sourcePath, destinationPath);
}

export function build() {
  if (!fs.existsSync(sourceDirectory)) throw new Error('缺少 src/ 静态应用目录');
  if (path.relative(appDirectory, outputDirectory) !== 'dist') {
    throw new Error(`拒绝清理意外输出目录：${outputDirectory}`);
  }
  fs.rmSync(outputDirectory, { recursive: true, force: true });
  copyTree(sourceDirectory, outputDirectory);
  fs.mkdirSync(path.join(outputDirectory, 'upstream'), { recursive: true });
  fs.writeFileSync(path.join(outputDirectory, 'upstream', 'evidence.json'), `${JSON.stringify(evidence, null, 2)}\n`, 'utf8');
  fs.writeFileSync(
    path.join(outputDirectory, 'upstream', 'RIGHTS-NOTICE.txt'),
    [
      `Upstream repository: ${UPSTREAM_REPOSITORY}`,
      `Pinned release: ${evidence.release}`,
      `Pinned research commit: ${UPSTREAM_COMMIT}`,
      'Upstream license: GNU Affero General Public License v3.0 (AGPL-3.0).',
      'This atlas contains original analysis, an original architecture diagram, and links to source evidence.',
      'It does not redistribute the MediaCMS source tree, containers, media, or third-party branding assets.',
      '',
    ].join('\n'),
    'utf8',
  );
  console.log('MediaCMS Decision Atlas 已构建：3 条关键链路 / 5 项约束 / 12 条固定版本证据。');
}

const isMain = Boolean(process.argv[1]) && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url;
if (isMain) {
  try {
    build();
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
