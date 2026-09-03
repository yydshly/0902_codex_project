# 0902 Codex Project

> 一个持续研究优秀 GitHub 项目、沉淀可复用结论，并用小型 Web Demo 验证关键想法的总项目库。

[研究索引](#研究索引) · [核心演示图](#项目核心演示与架构图) · [研究规范](CONTRIBUTING.md) · [研究模板](research/_template/README.md) · [在线门户](https://yydshly.github.io/0902_codex_project/)

## 这个仓库记录什么

这里不是第三方源码的镜像集合。每个研究项目会围绕一个明确问题，记录上游版本、许可证、架构观察、关键实现、实验依据、适用边界和可复用经验；需要交互验证时，再增加一个独立 Web Demo。

根 README 保留摘要、入口、稳定索引和每个项目的一张核心图。完整研究、证据与逐图解释放在对应的 `research/` 子目录中，避免总览随着项目增加而失去可读性。

## 本次研究：Lieflat Charts

[Lieflat Charts](https://github.com/larashero3-dotcom/lieflat-charts) 不是新的运行时图表 SDK，而是一套面向 AI 助手的数据表达工作流：它把数据形状判断、图型选择、视觉约束、真实 HTML 模板和交付检查写成 Agent 可执行的规则。

本研究固定在上游 commit `4eef5ce`，梳理了 **64 种图表、12 套中英双语报告、4 种视觉系统**，并用六类真实业务任务解释什么时候选择什么效果。配套展厅支持完整中英切换，包含架构与能力总图，并可直接运行固定版本的 52 个原始 HTML 样张。

[阅读完整研究](./research/002-larashero3-dotcom-lieflat-charts/README.md) · [打开在线能力展厅](https://yydshly.github.io/0902_codex_project/demos/002-larashero3-dotcom-lieflat-charts/) · [查看上游源库](https://github.com/larashero3-dotcom/lieflat-charts)

## 研究索引

<!-- PROJECT_INDEX_START -->
| 编号 | 项目 | 一句话摘要 | 状态 | 标签 | 研究记录 | Web Demo | 最近更新 |
| ---: | --- | --- | --- | --- | --- | --- | --- |
| `001` | [Aurelia](https://github.com/holtsetio/aurelia/) | 从程序化水母出发，研究 GPU 软体与缓冲驱动表面，并扩展为真实弹簧驱动的声场雕塑与可解构、可召回的活体品牌拓扑。 | 已验证 | `three.js` `webgpu` `compute` `procedural` `soft-body` `web-audio` `audio-reactive` | [查看](./research/001-holtsetio-aurelia/README.md) | [打开](https://yydshly.github.io/0902_codex_project/demos/001-holtsetio-aurelia/) | 2026-09-03 |
| `002` | [Lieflat Charts](https://github.com/larashero3-dotcom/lieflat-charts) | 把数据形状判断、图型选型、编辑设计规则和真实 HTML 模板编码成 Agent 可执行的数据可视化工作流。 | 已验证 | `agent-skills` `data-visualization` `html` `svg` `design-system` | [查看](./research/002-larashero3-dotcom-lieflat-charts/README.md) | [打开](https://yydshly.github.io/0902_codex_project/demos/002-larashero3-dotcom-lieflat-charts/) | 2026-09-03 |
| `003` | [ThreeUI](https://github.com/MengTo/threeui) | 以 43 个 Community 父条目、163 个具名变体的完整索引和 13 个跨类别实时案例，研究 ThreeUI 如何把 WebGL、Canvas、DOM 与完整网页作品产品化为可预览、可调参、可分发的 React 视觉资产。 | 已验证 | `react` `three.js` `webgl` `canvas` `ui-components` `shaders` `agent-skills` | [查看](./research/003-mengto-threeui/README.md) | [打开](https://yydshly.github.io/0902_codex_project/demos/003-mengto-threeui/) | 2026-09-03 |
| `004` | [Neko Master](https://github.com/foru17/neko-master) | 研究代理网关如何把连接累计快照转换成实时、多维、可持久化的流量事实，并以合成数据验证差分、批量落库与热数据合并。 | 已验证 | `observability` `network` `realtime` `edge-agent` `sqlite` `clickhouse` | [查看](./research/004-foru17-neko-master/README.md) | [打开](https://yydshly.github.io/0902_codex_project/demos/004-foru17-neko-master/) | 2026-09-03 |
| `005` | [Yichen Skills](https://github.com/mcncarl/yichen-skills) | 研究一个个人工作流如何被拆成多 Skill 能力库，并以路由、执行器、权限闸门、数据契约和结果验证形成可复用的 Agent 工作协议。 | 已验证 | `agent-skills` `workflow-automation` `research` `content-ops` `local-first` `safety` | [查看](./research/005-mcncarl-yichen-skills/README.md) | [打开](https://yydshly.github.io/0902_codex_project/demos/005-mcncarl-yichen-skills/) | 2026-09-03 |
| `006` | [350 Layout Compositions](https://github.com/nevertoday/350-layout-compositions) | 把 350 张版式教学海报、8×33 分类和机器目录完整整理成网页档案，并揭示结构校验无法发现的语义映射错位。 | 已验证 | `layout` `composition` `visual-design` `taxonomy` `dataset` `static-gallery` | [查看](./research/006-nevertoday-350-layout-compositions/README.md) | [打开](https://yydshly.github.io/0902_codex_project/demos/006-nevertoday-350-layout-compositions/) | 2026-09-03 |
| `007` | [Qiuner.github.io](https://github.com/Qiuner/Qiuner.github.io) | 以五个实时 World、单一内容内核和共享 Runtime 拆解多世界作品集，并用六个真实研究项目演示如何构建可筛选、可验证、可运行的个人品牌证据系统。 | 已验证 | `astro` `three.js` `webgl` `multi-world` `interactive-portfolio` `runtime` | [查看](./research/007-qiuner-qiuner-github-io/README.md) | [打开](https://yydshly.github.io/0902_codex_project/demos/007-qiuner-qiuner-github-io/) | 2026-09-03 |
<!-- PROJECT_INDEX_END -->

## 项目核心演示与架构图

每个已登记项目必须提供一张能快速说明核心价值的图片：优先使用经过验证的真实 Demo 首屏或关键交互；没有单一最佳画面时，使用基于研究证据自制的架构图、能力总图或整体流程图。点击图片可进入在线 Demo 或完整研究。

<!-- PROJECT_SHOWCASE_START -->
### `001` · [Aurelia](https://github.com/holtsetio/aurelia/)

[![Aurelia Field Atlas 首屏以大型中文标题说明从现实因果到交互作品的方法，右侧轨道图配合十项方向、十二个现实原型和十三层技术研究统计](./research/001-holtsetio-aurelia/assets/cover.png)](https://yydshly.github.io/0902_codex_project/demos/001-holtsetio-aurelia/)

*用研究图谱概括 Aurelia 如何把现实观察抽象为物理语法、GPU 状态与可交互体验。 · 本研究 Demo 自制截图；方法与讲解层原创，上游 Aurelia 代码遵循 MIT License*

从程序化水母出发，研究 GPU 软体与缓冲驱动表面，并扩展为真实弹簧驱动的声场雕塑与可解构、可召回的活体品牌拓扑。

[阅读研究](./research/001-holtsetio-aurelia/README.md) · [打开 Demo](https://yydshly.github.io/0902_codex_project/demos/001-holtsetio-aurelia/) · [查看上游](https://github.com/holtsetio/aurelia/)

---

### `002` · [Lieflat Charts](https://github.com/larashero3-dotcom/lieflat-charts)

[![Lieflat Charts 架构与能力总图，从业务目的和已有数据，经 AI 助手、六层能力内核与浏览器渲染，输出 HTML 图表或报告](./research/002-larashero3-dotcom-lieflat-charts/assets/architecture-capability-map.png)](https://yydshly.github.io/0902_codex_project/demos/002-larashero3-dotcom-lieflat-charts/)

*一张图解释 Lieflat Charts 的输入、Agent 执行、规则与模板资产、底层渲染技术、六层能力和最终交付边界。 · 研究团队自制；不包含上游图表画面*

把数据形状判断、图型选型、编辑设计规则和真实 HTML 模板编码成 Agent 可执行的数据可视化工作流。

[阅读研究](./research/002-larashero3-dotcom-lieflat-charts/README.md) · [打开 Demo](https://yydshly.github.io/0902_codex_project/demos/002-larashero3-dotcom-lieflat-charts/) · [查看上游](https://github.com/larashero3-dotcom/lieflat-charts)

---

### `003` · [ThreeUI](https://github.com/MengTo/threeui)

[![ThreeUI Runtime Atlas 左侧标明 43 个父条目、163 个变体和 13 个实时案例，右侧运行 Raw WebGL 液态金属效果](./research/003-mengto-threeui/assets/cover.webp)](https://yydshly.github.io/0902_codex_project/demos/003-mengto-threeui/)

*ThreeUI Runtime Atlas 用完整能力索引、13 个实时案例与底层渲染路径解释组件库的广度、原理和边界。 · 自制展台；Liquid Form 来自 ThreeUI Community（MIT）*

以 43 个 Community 父条目、163 个具名变体的完整索引和 13 个跨类别实时案例，研究 ThreeUI 如何把 WebGL、Canvas、DOM 与完整网页作品产品化为可预览、可调参、可分发的 React 视觉资产。

[阅读研究](./research/003-mengto-threeui/README.md) · [打开 Demo](https://yydshly.github.io/0902_codex_project/demos/003-mengto-threeui/) · [查看上游](https://github.com/MengTo/threeui)

---

### `004` · [Neko Master](https://github.com/foru17/neko-master)

[![Neko Master 能力全景图串联数据接入、实时采集、存储扩展、动态分析，并标出可观察范围、能力边界和产品扩展方向](./apps/004-foru17-neko-master/docs/neko-master-capability-panorama.png)](https://yydshly.github.io/0902_codex_project/demos/004-foru17-neko-master/)

*一张图说明从代理网关累计快照到实时流量分析的完整链路，以及上游已有能力与仍需建设的治理层。 · 研究团队基于固定版本源码与合成数据自制；不包含真实用户或网络流量*

研究代理网关如何把连接累计快照转换成实时、多维、可持久化的流量事实，并以合成数据验证差分、批量落库与热数据合并。

[阅读研究](./research/004-foru17-neko-master/README.md) · [打开 Demo](https://yydshly.github.io/0902_codex_project/demos/004-foru17-neko-master/) · [查看上游](https://github.com/foru17/neko-master)

---

### `005` · [Yichen Skills](https://github.com/mcncarl/yichen-skills)

[![Yichen Skills 能力图谱首屏以二十二个 Skill 组成个人工作系统为主题，右侧列出宿主 Agent、自然语言协议、执行适配和证据验收四层结构](./research/005-mcncarl-yichen-skills/assets/cover.png)](https://yydshly.github.io/0902_codex_project/demos/005-mcncarl-yichen-skills/)

*核心演示图直接解释 Skill 库不是 Agent 本体，而是由宿主路由、协议、执行器和验收证据组成的工作系统。 · 本研究 Demo 自制截图；不包含账号、凭据、聊天内容或上游平台界面*

研究一个个人工作流如何被拆成多 Skill 能力库，并以路由、执行器、权限闸门、数据契约和结果验证形成可复用的 Agent 工作协议。

[阅读研究](./research/005-mcncarl-yichen-skills/README.md) · [打开 Demo](https://yydshly.github.io/0902_codex_project/demos/005-mcncarl-yichen-skills/) · [查看上游](https://github.com/mcncarl/yichen-skills)

---

### `006` · [350 Layout Compositions](https://github.com/nevertoday/350-layout-compositions)

[![能力图鉴首屏，左侧说明项目定位与 350、8、33 三个规模数字，右侧由三张教学海报组成拼贴](./research/006-nevertoday-350-layout-compositions/assets/cover.png)](https://yydshly.github.io/0902_codex_project/demos/006-nevertoday-350-layout-compositions/)

*全量网页档案将 350 项视觉知识、8×33 分类、静态生产管线和数据质量边界放进同一个可检索展示。 · 自制 Demo 截图；内嵌上游海报遵循 CC BY 4.0*

把 350 张版式教学海报、8×33 分类和机器目录完整整理成网页档案，并揭示结构校验无法发现的语义映射错位。

[阅读研究](./research/006-nevertoday-350-layout-compositions/README.md) · [打开 Demo](https://yydshly.github.io/0902_codex_project/demos/006-nevertoday-350-layout-compositions/) · [查看上游](https://github.com/nevertoday/350-layout-compositions)

---

### `007` · [Qiuner.github.io](https://github.com/Qiuner/Qiuner.github.io)

[![Qiuner Multiworld Atlas 首屏以一个作品集、五个世界为主标题，右侧轨道结构强调五个 World 共用一个 Runtime](./research/007-qiuner-qiuner-github-io/assets/cover.png)](https://yydshly.github.io/0902_codex_project/demos/007-qiuner-qiuner-github-io/)

*核心演示图用同一内容、五种世界和统一运行时概括多世界互动作品集的产品与架构思想。 · 本研究 Demo 自制截图；首屏未复制上游媒体，实时 World 仅在页面下方通过官方站点加载*

以五个实时 World、单一内容内核和共享 Runtime 拆解多世界作品集，并用六个真实研究项目演示如何构建可筛选、可验证、可运行的个人品牌证据系统。

[阅读研究](./research/007-qiuner-qiuner-github-io/README.md) · [打开 Demo](https://yydshly.github.io/0902_codex_project/demos/007-qiuner-qiuner-github-io/) · [查看上游](https://github.com/Qiuner/Qiuner.github.io)
<!-- PROJECT_SHOWCASE_END -->

研究编号使用三位数字：`001`、`002`、`003`……编号一经发布便不修改、不复用。目录清单 [`catalog/projects.json`](catalog/projects.json) 是顺序与元数据的唯一来源，上表由脚本同步生成。

研究状态统一使用：

- `planned`：已登记，尚未开始系统研究；
- `studying`：正在阅读、实验或补充证据；
- `validated`：当前结论已完成约定范围内的验证；
- `archived`：停止继续维护，但保留历史记录。

## 子项目与图片说明

每个研究项目放在 `research/<编号>-<owner>-<repository>/`，入口 README 至少包含：

- 上游仓库、研究基线与许可证；
- 为什么值得研究、研究问题与核心结论；
- 架构与关键实现观察；
- 实验方法、证据、优点与局限；
- 封面和关键截图的画面描述、研究意义、来源与权利说明。

每个项目都必须登记一张对外核心图。优先截取能直接证明能力的真实 Demo；如果项目没有代表性界面，就根据已验证源码和研究结论制作架构图、能力总图或整体流程图。图片通常放入条目的 `assets/`，封面建议命名为 `cover.webp`，其他截图放入 `assets/screenshots/`；仅有图片文件而没有替代文本、说明和来源记录的素材不进入对外索引。

## Web Demo 与 GitHub Pages

同一个仓库只维护一个 GitHub Pages 站点，并将多个 Web 项目聚合到独立子路径：

```text
https://yydshly.github.io/0902_codex_project/                       # 总入口
https://yydshly.github.io/0902_codex_project/demos/001-example/     # 子项目 Demo
https://yydshly.github.io/0902_codex_project/demos/002-example/     # 另一个 Demo
```

Web 源码放在 `apps/<编号>-<slug>/`。每个应用独立构建到自己的 `dist/`，根构建脚本再把已登记的产物汇总到最终 Pages 目录。完整约定见 [`apps/README.md`](apps/README.md)。

## 仓库结构

```text
.
├─ catalog/                    # 有序项目清单与字段约束
├─ research/                   # 研究记录
│  └─ _template/              # 新研究项目模板
├─ apps/                       # 可选的独立 Web Demo 源码
├─ site/                       # GitHub Pages 总入口
├─ scripts/                    # 清单校验、README 同步和站点聚合
├─ docs/                       # 总库设计与维护决策
├─ .github/workflows/         # GitHub Pages 自动部署
├─ CONTRIBUTING.md            # 新增项目流程
└─ README.md                  # 对外摘要与总索引
```

## 开始第一个研究项目

```powershell
Copy-Item -Recurse research/_template research/001-owner-repository
# 填写研究 README 与 catalog/projects.json 后：
npm run catalog:sync
npm run check
```

详细步骤、字段规则与发布检查见 [`CONTRIBUTING.md`](CONTRIBUTING.md)。

## 来源与许可证

第三方项目、代码片段、截图和其他素材继续受其各自许可证与权利声明约束。每个研究条目必须记录上游来源、研究基线和许可证，并区分事实、推断与个人评价。

本总库暂未选择统一开源许可证；在原创内容与第三方材料的授权边界明确前，请勿默认复制或再分发仓库内容。
