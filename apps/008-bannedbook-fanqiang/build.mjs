import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath, pathToFileURL } from 'node:url';

export const UPSTREAM_REPOSITORY = 'https://github.com/bannedbook/fanqiang';
export const UPSTREAM_COMMIT = '6b09e61cd77c00020c24676f926d7374afd5dd04';

const appDirectory = path.dirname(fileURLToPath(import.meta.url));
const sourceDirectory = path.join(appDirectory, 'src');
const outputDirectory = path.join(appDirectory, 'dist');

const evidence = {
  repository: UPSTREAM_REPOSITORY,
  commit: UPSTREAM_COMMIT,
  commitShort: UPSTREAM_COMMIT.slice(0, 7),
  capturedAt: '2026-09-04',
  conclusion: 'fanqiang 是项目集合与分发入口；ChromeGo、FQNews2 是并列产品，协议能力主要由上游内核提供。',
  products: [
    {
      id: 'chromego',
      name: 'ChromeGo',
      kind: 'Windows 浏览器代理工具箱',
      orchestration: 'CMD 启动器 + Chrome 代理参数 + 多个独立内核',
      scope: '浏览器/桌面启动层',
      ownsProtocols: false,
    },
    {
      id: 'fqnews2',
      name: 'FQNews2',
      kind: 'Android RSS 新闻应用',
      orchestration: 'Feeder 业务层 + 节点管理 + sing-box/libcore + OkHttp',
      scope: '应用内请求链路',
      ownsProtocols: false,
    },
  ],
  fqnews2Flow: [
    '导入/解析节点',
    '保存代理档案',
    'URL 延迟测试',
    '选择最低延迟可用节点',
    '生成 sing-box 配置',
    '启动 127.0.0.1:5888 mixed 代理',
    'OkHttp 通过本地代理抓取 RSS',
    '缓存与离线阅读',
  ],
  boundaries: [
    '不是新的代理协议集合',
    '不是统一协议内核',
    'ChromeGo 不是 Clash 的同类控制面',
    'FQNews2 当前不是系统级 Android VPN',
    '源码存在能力不等于发布包已携带全部插件',
  ],
  risks: [
    'FQNews2 的默认 HTTP 客户端可关闭证书与主机名校验',
    '节点测速失败路径会删除节点，恢复策略偏激进',
    'ChromeGo 更新脚本存在跳过 TLS 校验与覆盖配置的供应链风险',
    'FQNews2 源码快照缺失 libcore.aar 与部分 Go replace 依赖，难以直接复现构建',
    'APK 内记录的源码 revision 与 fanqiang 历史无法一一对应，发布溯源较弱',
  ],
  priority: [
    { rank: 1, subject: '底层内核', value: '高', why: '协议、加密、路由、DNS、TUN 与转发能力真正发生处' },
    { rank: 2, subject: 'FQNews2 集成路径', value: '中高', why: '展示代理如何嵌入真实业务应用并自动选路' },
    { rank: 3, subject: '可靠性与控制面', value: '中高', why: '健康检测、熔断、切换、观测与可信更新可沉淀为平台能力' },
    { rank: 4, subject: 'ChromeGo 封装', value: '中', why: '适合研究低门槛分发与多工具编排' },
    { rank: 5, subject: 'fanqiang 仓库本体', value: '低', why: '主要价值在集合、打包与传播，不是技术内核创新' },
  ],
  sources: [
    {
      id: 'node-importer',
      label: '节点导入、测速与最低延迟选择',
      url: `${UPSTREAM_REPOSITORY}/blob/${UPSTREAM_COMMIT}/fqnews2/app/src/fqnews/java/app/NodeImporter.kt#L34-L138`,
    },
    {
      id: 'formats',
      label: '节点格式解析入口',
      url: `${UPSTREAM_REPOSITORY}/blob/${UPSTREAM_COMMIT}/fqnews2/app/src/main/java/io/nekohasekai/sagernet/ktx/Formats.kt#L107-L202`,
    },
    {
      id: 'proxy-types',
      label: '代理实体支持的类型枚举',
      url: `${UPSTREAM_REPOSITORY}/blob/${UPSTREAM_COMMIT}/fqnews2/app/src/main/java/io/nekohasekai/sagernet/database/ProxyEntity.kt#L71-L91`,
    },
    {
      id: 'config-builder',
      label: 'sing-box 配置生成与本地 mixed 入站',
      url: `${UPSTREAM_REPOSITORY}/blob/${UPSTREAM_COMMIT}/fqnews2/app/src/main/java/io/nekohasekai/sagernet/fmt/ConfigBuilder.kt#L330-L498`,
    },
    {
      id: 'box-instance',
      label: 'libcore 实例启动与插件边界',
      url: `${UPSTREAM_REPOSITORY}/blob/${UPSTREAM_COMMIT}/fqnews2/app/src/main/java/io/nekohasekai/sagernet/bg/proto/BoxInstance.kt#L108-L256`,
    },
    {
      id: 'rss-client',
      label: 'RSS 请求通过 127.0.0.1:5888',
      url: `${UPSTREAM_REPOSITORY}/blob/${UPSTREAM_COMMIT}/fqnews2/app/src/main/java/com/nononsenseapps/jsonfeed/JsonFeedParser.kt#L17-L40`,
    },
    {
      id: 'proxy-service',
      label: '应用仅连接 ProxyService',
      url: `${UPSTREAM_REPOSITORY}/blob/${UPSTREAM_COMMIT}/fqnews2/app/src/main/java/io/nekohasekai/sagernet/bg/SagerConnection.kt#L23-L28`,
    },
    {
      id: 'tun-boundary',
      label: 'openTun 的 VPN 路径未启用',
      url: `${UPSTREAM_REPOSITORY}/blob/${UPSTREAM_COMMIT}/fqnews2/app/src/main/java/moe/matsuri/nb4a/NativeInterface.kt#L29-L34`,
    },
    {
      id: 'tls-risk',
      label: '可跳过证书与主机名校验',
      url: `${UPSTREAM_REPOSITORY}/blob/${UPSTREAM_COMMIT}/fqnews2/app/src/main/java/com/nononsenseapps/jsonfeed/OkHttpBuilderExtensions.kt#L12-L36`,
    },
    {
      id: 'build-aar',
      label: '源码构建引用本地 libcore.aar',
      url: `${UPSTREAM_REPOSITORY}/blob/${UPSTREAM_COMMIT}/fqnews2/app/build.gradle.kts#L269`,
    },
    {
      id: 'go-replace',
      label: 'Go 模块依赖缺失的兄弟目录',
      url: `${UPSTREAM_REPOSITORY}/blob/${UPSTREAM_COMMIT}/fqnews2/libcore/go.mod#L96-L125`,
    },
  ],
};

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

export function build() {
  if (!fs.existsSync(sourceDirectory)) throw new Error('缺少 src/ 静态应用目录');
  if (path.relative(appDirectory, outputDirectory) !== 'dist') {
    throw new Error(`拒绝清理意外输出目录：${outputDirectory}`);
  }

  fs.rmSync(outputDirectory, { recursive: true, force: true });
  copyTree(sourceDirectory, outputDirectory);
  fs.mkdirSync(path.join(outputDirectory, 'upstream'), { recursive: true });
  fs.writeFileSync(
    path.join(outputDirectory, 'upstream', 'evidence.json'),
    `${JSON.stringify(evidence, null, 2)}\n`,
    'utf8',
  );
  fs.writeFileSync(
    path.join(outputDirectory, 'upstream', 'RIGHTS-NOTICE.txt'),
    [
      `Upstream repository: ${UPSTREAM_REPOSITORY}`,
      `Pinned research commit: ${UPSTREAM_COMMIT}`,
      'This capability atlas contains original analysis and links to source evidence.',
      'It does not redistribute upstream executables, APKs, node lists, configs, or source files.',
      '',
    ].join('\n'),
    'utf8',
  );
  console.log('fanqiang Capability Atlas 已构建：2 个产品分支 / 8 步 FQNews2 请求链 / 11 条源码证据。');
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
