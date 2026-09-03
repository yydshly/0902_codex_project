# Qiuner.github.io

> 它不是一个可以直接安装的 UI 库，而是一套“单份内容、多套世界、统一生命周期”的互动作品集参考实现。

[![Qiuner Multiworld Atlas 首屏以一个作品集、五个世界为主标题，右侧轨道结构强调五个 World 共用一个 Runtime](assets/cover.png)](https://yydshly.github.io/0902_codex_project/demos/007-qiuner-qiuner-github-io/)

*核心演示图：用同一内容、五种世界和统一运行时概括多世界互动作品集的产品与架构思想。*

## 项目信息

| 字段 | 内容 |
| --- | --- |
| 研究编号 | `007` |
| 上游仓库 | [`Qiuner/Qiuner.github.io`](https://github.com/Qiuner/Qiuner.github.io) |
| 研究基线 | commit [`85b2063`](https://github.com/Qiuner/Qiuner.github.io/tree/85b20634da13a02bcc2e67b2f42fb50d4aba7b93) |
| 上游现场 | [`qiuner.github.io`](https://qiuner.github.io/) |
| 上游许可证 | 未发现 `LICENSE`；不得默认复制、修改或再分发 |
| 研究状态 | `validated` |
| 首次研究 | 2026-09-03 |
| 最近更新 | 2026-09-03 |
| 标签 | `astro`, `three.js`, `webgl`, `multi-world`, `interactive-portfolio`, `runtime` |

## 核心结论

- **已验证：** Content Kernel 把人物、项目、集合、链接和媒体集中在一份 TypeScript 数据中，各 World Binding 只保存表现角色和空间映射。
- **已验证：** Registry 延迟导入 Cosmic、Archipelago、Jianghu、Linework、Studio 五个 World Module。
- **已验证：** Shared Runtime 独占 WebGLRenderer、RAF、输入监听、质量控制、URL 历史和 World Session 切换。
- **已验证：** Portal Journey 使用 `AbortController + generation` 取消过期旅程，只有目标 Session 安装成功后才提交 URL 和所有权。
- **已验证：** Resource Scope 集中回收帧任务、事件、UI 和 GPU 资源；安装失败与正常退出共用清理路径。
- **已验证：** Astro 先输出可读 HTML，再加载 WebGL 增强；Jianghu 使用 DOM 场景，说明 World 协议并不等于 Three.js。
- **实测：** 23 个测试文件、73 个测试全部通过；生产构建 0 错误、0 警告、0 hints，生成 2 个静态页面。
- **边界：** 文档中的双世界实时转场、构建期预算门禁、context-lost 静态回退和完整资产管线尚未全部由当前代码兑现。
- **评价：** 适合作为多主题品牌空间、数字展厅和互动叙事的架构参考，不适合作为业务后台，也不应在许可证缺失时直接整库依赖。
- **落地样例：** 当前 Demo 已把仓库 001–006 的六个真实项目作为 Content Kernel，生成五类能力视角、项目证据卡和六个可运行 Demo，验证“个人品牌系统”不必依赖虚构案例。

## 能力地图

| 能力层 | 已实现能力 | 价值 | 当前边界 |
| --- | --- | --- | --- |
| Content Kernel | 稳定 ID、项目/集合查询、引用校验 | 同一内容被多个世界解释 | URL、时效指标和全部媒体关系未完全强校验 |
| World Module | `manifest + install(scope)`、动态 import | 新世界不必修改已有世界实现 | 仍是站内接口，不是公开 SDK |
| Runtime | 单 Renderer、单 RAF、输入、Resize、显隐 | 避免多个世界争夺全局资源 | Runtime 与 DOM 宿主仍有项目级耦合 |
| Session / Resource | 安装回滚、终止信号、幂等清理 | 限制监听器与 GPU 泄漏 | 缺真实浏览器 GPU 长跑证据 |
| Portal | 预加载、截图、取消、回滚、History | 跨世界切换接近事务语义 | `live-dual` 未真正执行双场景合成 |
| Quality | 启动信号 + 帧时间迟滞升降档 | 在移动端和弱设备上主动降级 | 预算数字未构建期强制执行 |
| Static Host | Astro HTML、语义链接、WebGL 失败壳 | 内容不依赖 Canvas 才能访问 | 各世界内部无障碍程度仍不一致 |
| Asset Wall | 程序化模型、Sprite 和源码引用浏览 | 形成世界资产库存 | 尚未成为独立资产包或生成管线 |

## 底层原理

```text
                    ┌→ Astro 静态 HTML → SEO / 可读降级
Portfolio 数据内核 ┤
                    └→ World Binding → World Module
                                         ↓
URL / Portal → Registry → World Session → Shared Runtime
                                         ↓
                    Renderer / RAF / Input / Quality / Resource Scope
```

世界作者只负责：创建场景或 DOM、发布一个 Render View、注册帧任务和交互、声明资源释放。Runtime 负责决定这些任务何时运行、哪个世界拥有输入、URL 何时改变以及退出时怎样回收。

Portal 的当前实际提交路径是：

```text
来源 World 保持活跃
  → preparing 动画
  → 捕获来源截图
  → 加载并安装目标 Session
  → 提交 URL / focus / activeSession
  → 销毁来源 Session
  → arriving 动画结束
```

若安装失败或取消，目标 Scope 被中止并释放，来源 World 和原 URL 被保留。高、平衡档当前都使用截图转场；低档使用静态 CSS 转场。

## 使用场景

适合：

- 个人或工作室作品集；
- 产品发布、品牌 Campaign、数字展厅；
- 博物馆、互动纪录片和探索式学习；
- 游戏化招聘和企业文化空间；
- 同一组内容需要地图、房间、时间线等多种表达。

不适合：

- ERP、CRM、审批和管理后台；
- 高频表格、交易和数据查询；
- 极端弱网与低功耗优先的公共服务；
- 需要直接安装成熟 SDK 的产品团队。

## 可扩展方向

1. 将 Manifest 资产存在性、传输量和 GPU 预算变成构建失败条件。
2. 增加真实浏览器 E2E、移动端性能、视觉回归、context lost 和 GPU 泄漏测试。
3. 将 `runtime-core`、宿主 Adapter、World 模板和 contract harness 抽成独立包。
4. 通过依赖注入把 Content Kernel 与 Binding 交给 WorldScope，消除世界对站点数据模块的直接导入。
5. 接入 CMS、多语言、导览、埋点、语义深链接和静态 2D 模式。
6. 引入 glTF/Draco、KTX2、LOD、真正双世界合成、可选 WebGPU 和 Worker 渲染。

## 对我们的意义

最有价值的是“体验操作系统”思路：内容是稳定事实，World 是可替换解释，Runtime 是唯一所有者。未来即使由 AI 快速生成多个视觉世界，也应该让生成结果安装进受控协议，而不是各自创建全局状态、渲染循环和导航。

建议吸收四个原语：Content Kernel、World Contract、Resource Scope、Portal Transaction。视觉场景可以重做，所有权与失败恢复模型值得保留。

当前仓库中的真实落地方式是：以 `catalog/projects.json` 为事实源，用项目标签推导视觉计算、交互产品、Agent 工作流、数据系统和设计研究五类能力，再把研究摘要、验证状态、上游仓库与可运行 Demo 组合成证据面板。新增项目后重新构建，个人品牌样例会随目录更新，而不需要重复维护一份作品集数据。

在此基础上，Demo 进一步生成一份“证据驱动模拟”：当前项目组合指向 `AI 产品与体验系统构建者`，核心表达是“把复杂技术拆成可理解、可运行、可验证的产品体验”。证据覆盖分只计算项目数量与验证密度；目标受众、服务方向和价值主张全部标记为模拟，不能替代真实履历、客户反馈与量化结果。

## 验证记录

2026-09-03 在锁定基线上执行：

```text
npm test      → 23 files / 73 tests passed
npm run build → Astro check: 0 errors / 0 warnings / 0 hints
                static build: 2 pages
npm audit     → 2 high transitive findings in build/tooling dependencies
```

`fast-uri` 来自 `@astrojs/check → language server → ajv`；`nanoid` 来自 `vite → postcss`。它们主要位于构建与开发链路，但正式采用前仍应升级并重新审计。

## Demo

- 本地源码：[`apps/007-qiuner-qiuner-github-io/`](../../apps/007-qiuner-qiuner-github-io/)
- 计划地址：<https://yydshly.github.io/0902_codex_project/demos/007-qiuner-qiuner-github-io/>
- 展示方式：原创能力解释页 + 上游官方 GitHub Pages 实时 iframe + 当前仓库六个真实项目构成的个人品牌证据台。
- 权利边界：不复制上游源码或媒体到发布产物；构建期稀疏 clone 仅用于锁定基线和生成事实元数据。

## 主要证据

- [`README.zh-CN.md`](https://github.com/Qiuner/Qiuner.github.io/blob/85b20634da13a02bcc2e67b2f42fb50d4aba7b93/README.zh-CN.md)
- [`docs/ARCHITECTURE.zh-CN.md`](https://github.com/Qiuner/Qiuner.github.io/blob/85b20634da13a02bcc2e67b2f42fb50d4aba7b93/docs/ARCHITECTURE.zh-CN.md)
- [`src/content/portfolio.ts`](https://github.com/Qiuner/Qiuner.github.io/blob/85b20634da13a02bcc2e67b2f42fb50d4aba7b93/src/content/portfolio.ts)
- [`src/runtime/experience-runtime.ts`](https://github.com/Qiuner/Qiuner.github.io/blob/85b20634da13a02bcc2e67b2f42fb50d4aba7b93/src/runtime/experience-runtime.ts)
- [`src/runtime/world-session.ts`](https://github.com/Qiuner/Qiuner.github.io/blob/85b20634da13a02bcc2e67b2f42fb50d4aba7b93/src/runtime/world-session.ts)
- [`src/runtime/portal-director.ts`](https://github.com/Qiuner/Qiuner.github.io/blob/85b20634da13a02bcc2e67b2f42fb50d4aba7b93/src/runtime/portal-director.ts)
- [`src/runtime/quality-budget.ts`](https://github.com/Qiuner/Qiuner.github.io/blob/85b20634da13a02bcc2e67b2f42fb50d4aba7b93/src/runtime/quality-budget.ts)
- [`src/worlds/registry.ts`](https://github.com/Qiuner/Qiuner.github.io/blob/85b20634da13a02bcc2e67b2f42fb50d4aba7b93/src/worlds/registry.ts)
