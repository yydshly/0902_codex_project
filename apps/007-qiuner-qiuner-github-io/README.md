# Qiuner Multiworld Capability Atlas

- 关联研究：[`research/007-qiuner-qiuner-github-io/`](../../research/007-qiuner-qiuner-github-io/)
- 在线地址：<https://yydshly.github.io/0902_codex_project/demos/007-qiuner-qiuner-github-io/>
- 真实 3D 产品实验：<https://yydshly.github.io/0902_codex_project/demos/007-qiuner-qiuner-github-io/product-lab/>
- 上游现场：<https://qiuner.github.io/>
- 验证目标：展示五个真实 World、3D 资产墙、共享 Runtime、原子 Portal、自适应画质和静态降级；再用当前仓库除本研究外的七个已验证项目证明这套架构如何转化为个人品牌系统。
- 不覆盖：不重新分发上游源码或媒体；不把上游解释为 npm 库、通用游戏引擎或已经完成的公开插件 SDK。

## 本地运行

```bash
npm run build
npm run check
npm run serve
```

默认地址为 `http://127.0.0.1:4207/`。可通过 `QIUNER_ATLAS_PORT` 修改端口。

## 展示内容

实时世界台通过 iframe 加载上游官方 GitHub Pages，并提供六个入口：

1. Cosmic：滚动驱动的宇宙作品叙事；
2. Archipelago：可驾驶小船的作品群岛；
3. Jianghu：DOM Sprite、移动和人物对话；
4. Linework：正交相机和几何边线房间；
5. Studio：彩色程序化工作室与多 Portal；
6. Asset Wall：按 World 浏览程序化 3D 资产和 Sprite。

页面同时展示 Content Kernel、World Contract、Shared Runtime、Atomic Portal、Adaptive Budget 和 Static First 六个能力层，提供场景适配判断、目标态差距和平台化扩展路线。

新增的“真实品牌系统”直接读取根目录 `catalog/projects.json`，将七个项目映射为五类能力证据：视觉计算、交互产品、Agent 工作流、数据系统和设计研究。用户可以按能力筛选、选择项目，并在页面内加载对应的真实 Demo。

页面还根据项目数量、验证状态和标签覆盖生成一份明确标注为模拟的个人品牌定位：`AI 产品与体验系统构建者`。其中的证据覆盖分表示现有目录的证明密度，不是能力等级；AI 产品团队、品牌与创意团队、开源与工具团队三种受众定位都是待真实经历验证的假设。

“3D 产品实验”是第二层验证：它不复制上游世界，而是在 `apps/009-ai-product-capability-lab/` 中用真实 Three.js 场景重新实现共享 renderer、单 RAF、raycast、引导式相机和 DOM / WebGL 分层。它说明研究结论可以进入自己的产品架构，也明确没有实现完整的多 World、Portal Transaction 和 Resource Scope。

本地预览时，`serve.mjs` 通过 `/__portfolio/<slug>/` 安全映射兄弟项目的已有 `dist/`；发布后则使用目录中登记的 GitHub Pages 地址。这样同一份数据同时支持本地验证和线上展示。

## 构建取证

`build.mjs` 会把上游仓库稀疏获取到根目录下被忽略的 `.codex-tmp/upstreams/qiuner-github-io/`，锁定 commit `85b20634da13a02bcc2e67b2f42fb50d4aba7b93`，然后从源码树生成 `dist/upstream/meta.json`。

它还会从仓库目录生成 `dist/brand/case.json`。项目名称、简介、状态、标签、上游与 Demo 链接保持真实；能力分组通过明确的标签规则派生，不写入虚构履历或成果。

发布产物不包含上游源码或媒体，只包含：

- 本 Demo 的原创 HTML、CSS 和 JavaScript；
- 从锁定源码计算出的文件数、模块数和路线数等事实元数据；
- 指向上游官方在线站点的 iframe；
- 说明上游权利状态的 `RIGHTS-NOTICE.txt`。
- `product-lab/` 下由我们原创的程序化 3D 场景、React 界面与真实浏览器封面。

根流程构建 007 时会先对 009 执行锁文件安装与生产构建，再把 `dist/client/` 复制到 007 的 `dist/product-lab/`。Vite 使用相对资源路径，因此该产物可以在 GitHub Pages 子路径直接加载。

## 已验证基线

- 五个 World Module、九条 Portal 路线；
- 23 个测试文件、73 个测试通过；
- Astro/TypeScript 诊断 0 错误、0 警告、0 hints；
- 生产构建生成首页与 3D 资产墙两页；
- 七个真实项目、七个可运行 Demo 和五类能力映射；
- 当前仓库未发现 `LICENSE` 文件，因此本 Demo 不复制或再分发其源码和媒体。
- 3D 产品实验生产构建、WebGL 降级、桌面交互和 Pages 相对资源路径已纳入 007 的检查。

## 第三方来源与权利

- 上游仓库：[`Qiuner/Qiuner.github.io`](https://github.com/Qiuner/Qiuner.github.io)，研究基线 `85b2063`。
- 上游运行站点：[`qiuner.github.io`](https://qiuner.github.io/)，由上游作者自行发布。
- 上游仓库在本研究基线未声明许可证；公开可读不等同于授权复制、修改或再分发。
- Astro、Three.js、Vue 等依赖的许可证由上游依赖链分别管理；本 Demo 没有打包这些依赖。
