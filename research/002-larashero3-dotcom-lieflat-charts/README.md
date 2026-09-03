# Lieflat Charts

> 一套把“数据形状判断、图型选型、编辑设计规则、真实模板与交付检查”编码进 `SKILL.md` 的 Agent 数据可视化工作流；它不是新的运行时图表引擎。

## 项目信息

| 字段 | 内容 |
| --- | --- |
| 研究编号 | `002` |
| 上游仓库 | [larashero3-dotcom/lieflat-charts](https://github.com/larashero3-dotcom/lieflat-charts) |
| 研究基线 | [`4eef5ce00d0907a03b8eff42578b5a04942915e9`](https://github.com/larashero3-dotcom/lieflat-charts/tree/4eef5ce00d0907a03b8eff42578b5a04942915e9)（2026-08-19） |
| 上游许可证 | [PolyForm Noncommercial 1.0.0](https://github.com/larashero3-dotcom/lieflat-charts/blob/4eef5ce00d0907a03b8eff42578b5a04942915e9/LICENSE) |
| 研究状态 | `validated` |
| 首次研究 | `2026-09-03` |
| 最近更新 | `2026-09-03` |
| 标签 | `agent-skills, data-visualization, html, svg, design-system` |

## 快速入口

- [在线能力展厅](https://yydshly.github.io/0902_codex_project/demos/002-larashero3-dotcom-lieflat-charts/)：从六类真实业务任务进入，查看架构与能力总图，并运行固定版本的原始样张。
- [能力矩阵](notes/capability-matrix.md)：按图型、数据形状、视觉系统、报告模板和边界查阅已有能力。
- [展示应用源码](../../apps/002-larashero3-dotcom-lieflat-charts/)：零前端依赖的中英双语静态展厅。
- [上游源库](https://github.com/larashero3-dotcom/lieflat-charts)：原作者仓库；本研究固定在 `4eef5ce`，避免结论随上游变化漂移。

## 阅读索引

1. [先说结论](#先说结论)：这个库究竟是什么。
2. [一张图看懂](#一张图看懂)：输入、Agent、能力内核、渲染和交付的关系。
3. [已有能力](#已有能力)：64 种图、12 套报告、4 种视觉系统和交互能力。
4. [底层原理](#底层原理)：为什么它更像由 Agent 执行的弱编译器。
5. [使用场景](#使用场景)：什么时候值得用，什么时候不该用。
6. [实验与验证](#实验与验证)：哪些结论经过了目录、构建和浏览器检查。
7. [优点与局限](#优点与局限)：工程接口、依赖和许可证边界。
8. [对我们的意义](#对我们的意义)：可以复用的 Agent 工程模式。

## 先说结论

Lieflat Charts 的核心价值不是“又多了一套图表 API”，而是把一位数据设计师的判断过程外部化成 Agent 可执行的约束：先判断输出是单图还是整页报告，再按数据形状审计候选、锁定模板、应用统一视觉 token，最后检查数据诚实性和交付质量。

它位于 ECharts、Chart.js、SVG 等渲染技术的上层：底层引擎负责画，Lieflat Charts 负责告诉 Agent **为什么选这张、如何保持风格、哪些做法必须拒绝，以及怎样交付一份可直接发布的 HTML**。

## 一张图看懂

[![Lieflat Charts 架构与能力总图：业务目的和已有数据进入 AI 助手执行层，经规则、目录、模板和设计约束形成六层能力，再由 SVG、ECharts 和 Chart.js 输出 HTML 图表或报告](assets/architecture-capability-map.png)](https://yydshly.github.io/0902_codex_project/demos/002-larashero3-dotcom-lieflat-charts/#show=basics&lang=zh&use=commerce)

这张图同时说明了能力边界：这里的“调用”不是把数据直接传给 `render()`，而是 AI 阅读规则、审计候选、复制真实模板并改写内容；浏览器和底层绘图技术负责最终渲染。点击图片可进入完整中英双语展厅。

## 已有能力

| 能力层 | 当前能力 | 数量 / 形态 | 主要实现 |
| --- | --- | --- | --- |
| 图型词汇 | Glance 快读、Lupi 细读、Basics 基础编辑、地图、独立交互大图 | 64 种：22 + 20 + 17 + 2 + 3 | 手写 SVG、ECharts 6、Chart.js 4 |
| Agent 选型 | 从数据形状、阅读速度和使用场景召回候选，并规定优先级和拒绝条件 | `SKILL.md` + `catalog.md` | 文本规则、数据契约、决策树 |
| 视觉系统 | Mono 保底，Porcelain / Palm / Wire 三套彩色预设，可按品牌色建立 custom 色板 | 4 种内置模式 | `mono-tokens.js`、`color-presets.js` |
| 报告生成 | 调研、年报、月报、仪表盘、海报、简报、旅行记录等整页骨架 | 12 套，中英双版 | 单文件 HTML 报告模板 |
| 交互表达 | 入场与重播、hover 聚焦、拖拽、路径钉住、动态排序与滚动 | 3 张独立大图 + 多种动态图 | ECharts / SVG / DOM 事件 |
| 交付 | 从真实模板复制并替换数据、标题、旁注和来源 | 单文件 HTML 为主 | 浏览器直接运行，部分依赖 CDN |

完整分类、报告用途和技术边界见 [能力矩阵](notes/capability-matrix.md)。可运行的真实模板入口见 [Web 展厅](../../apps/002-larashero3-dotcom-lieflat-charts/README.md)。

## 底层原理

```text
用户数据与交付意图
        ↓
判断图表模式 / 报告模式
        ↓
识别数据形状与独立结论
        ↓
按 Lupi → Basics → Glance（或显式 Maps）审计候选
        ↓
在 catalog 锁定数据契约与真实模板
        ↓
复制模板骨架，替换数据 / 文案 / 来源
        ↓
应用 Mono 或单一彩色系统
        ↓
校验比例、单位、标签、动效、依赖与来源
        ↓
交付 HTML 图表页或完整报告
```

这套机制可以理解为一个由 Agent 执行的“弱编译器”：

1. `SKILL.md` 是控制面，定义模式判断、候选顺序、视觉硬规则和 QA。
2. `catalog.md` 与 `report-catalog.md` 是类型系统和路由表，描述每种图适合的数据形状、阅读速度与替代关系。
3. `mono-tokens.js` 与 `color-presets.js` 是设计 token 层，统一字体、灰阶、彩色角色、线宽和动效。
4. `templates/` 是可执行目标代码；Agent 不从空白画图，而是复制真实 SVG / Canvas / ECharts 骨架。
5. 浏览器是运行时，最终产物主要是可继续编辑和发布的单文件 HTML。

## 使用场景

适合：

- 研究、论文、白皮书、公众号长文和年报中的编辑式数据故事；
- 周报、经营快报、监控摘要和汇报中的快速比较图；
- 海报、社媒卡片、作品集和一次性专题页；
- 需要 Agent 从 CSV、表格或文章中提炼 1–6 个独立结论并直接生成 HTML；
- 中小规模、结构明确、需要保留真实单位或强调叙事的静态与轻交互数据。

不适合直接承担：

- 数据清洗、SQL 查询、指标口径治理和 BI 自助分析；
- 高频实时监控平台、海量点位渲染或产品内通用图表 SDK；
- 要求严格离线、严格 CSP、无外部字体或完全固定依赖版本的生产系统；
- 未取得额外许可的商业复用。

## 架构与关键实现

- [`SKILL.md`](https://github.com/larashero3-dotcom/lieflat-charts/blob/4eef5ce00d0907a03b8eff42578b5a04942915e9/SKILL.md)：六步工作流、Lupi / Basics / Glance 选型顺序、交互三问与拒绝规则。
- [`catalog.md`](https://github.com/larashero3-dotcom/lieflat-charts/blob/4eef5ce00d0907a03b8eff42578b5a04942915e9/catalog.md)：64 种图型的数据契约、适用范围、阅读速度和替代关系。
- [`report-catalog.md`](https://github.com/larashero3-dotcom/lieflat-charts/blob/4eef5ce00d0907a03b8eff42578b5a04942915e9/report-catalog.md)：12 套整页报告的场景、密度、版心和依赖。
- [`mono-tokens.js`](https://github.com/larashero3-dotcom/lieflat-charts/blob/4eef5ce00d0907a03b8eff42578b5a04942915e9/mono-tokens.js)：Mono 灰阶、排版、动画和辅助函数。
- [`color-presets.js`](https://github.com/larashero3-dotcom/lieflat-charts/blob/4eef5ce00d0907a03b8eff42578b5a04942915e9/color-presets.js)：Porcelain、Palm、Wire 的语义色彩角色。
- [`templates/big-threads.html`](https://github.com/larashero3-dotcom/lieflat-charts/blob/4eef5ce00d0907a03b8eff42578b5a04942915e9/templates/big-threads.html)：多段路径 hover、整束聚焦和点击钉住的代表实现。

## 实验与验证

| 验证问题 | 方法 | 结果 | 证据 | 限制 |
| --- | --- | --- | --- | --- |
| 上游版本是否可追溯 | `git clone --depth 1` + `git rev-parse HEAD` | 固定为 `4eef5ce00d0907a03b8eff42578b5a04942915e9` | 本地忽略目录 `.codex-tmp/upstreams/lieflat-charts` | clone 不进入版本库 |
| 图型总数与分类 | 读取固定版本 `catalog.md` | 64：Glance 22、Lupi 20、Basics 17、Maps 2、Big 3 | [能力矩阵](notes/capability-matrix.md) | README 的旧统计未同步，不采用 |
| 报告模板 | 读取 `report-catalog.md` 与模板目录 | 12 套，每套中英双版 | Web 展厅逐项入口 | 示例数据不代表真实业务正确性 |
| 原始能力能否集中浏览 | 构建展厅并加载固定 commit 的 52 个 HTML | 40 个入口全部可达；抽检 Glance、Lupi、Basics、Maps、Force、Threads、报告和案例通过 | [应用验证记录](../../apps/002-larashero3-dotcom-lieflat-charts/docs/delivery-contract.md) | ECharts、Chart.js、地图和字体可能需联网 |
| 架构和能力能否一图读懂 | 将输入、Agent 执行、六层能力、渲染和交付收束为一张响应式总图 | 中英双语完整；`1440×1000`、`768×1024`、`390×844` 无横向溢出 | [修订 8 验证记录](../../apps/002-larashero3-dotcom-lieflat-charts/docs/delivery-contract.md#修订-8--架构与能力总图) | 总图解释工作流，不代表存在自动数据接口 |

## 优点与局限

### 优点

- 把主观的“设计品味”变成可检查的选型顺序、数据契约和硬规则。
- 模板优先，降低 Agent 每次从零生成导致的视觉漂移和数据编码错误。
- 同时覆盖单图、交互大图和整页报告，能形成完整叙事而不只输出配置项。
- 明确写出“什么时候说不”，对断轴、滥用颜色、假交互等风险有约束。

### 局限

- 它不是 npm 包，没有稳定的运行时 API、组件接口或结构化 `ChartSpec`。
- 选择与改写主要由 Agent 理解 Markdown 规则后完成，自动化程度和可验证性有限。
- 模板多为大段单文件 HTML；彩色变体存在复制，后续维护成本较高。
- 部分模板依赖版本范围较宽的 CDN、在线字体与 GeoJSON，离线和供应链可复现性不足。
- 当前许可证限制商业用途；本研究与展厅按非商业研究用途提供，不构成法律意见。

## 对我们的意义

最值得复用的不是 64 张图的外观，而是下面这条工程模式：

> 专家规则 + 数据契约 + 设计 token + 可执行模板 + 自动 QA = 可审计的 Agent 专业能力。

现阶段把它保留为按需调用的能力知识库即可。只有未来出现真实业务数据、自动化接入或产品化需求时，再把选型规则结构化为 `ChartIntent` / JSON Schema，用原创模板验证“数据 → 选型 → HTML”的编译链，并测试选型准确性、数值保真、样式一致性和修改成本。上游模板的商业使用则应先单独取得许可。

## Web Demo

- 源码：[`apps/002-larashero3-dotcom-lieflat-charts/`](../../apps/002-larashero3-dotcom-lieflat-charts/)
- 在线地址：[Lieflat Charts 能力展厅](https://yydshly.github.io/0902_codex_project/demos/002-larashero3-dotcom-lieflat-charts/)
- 验证边界：展厅展示固定上游版本的原始 HTML 能力，不证明任意用户数据都能被自动、正确地转换。

## 来源与相关链接

- [上游 README](https://github.com/larashero3-dotcom/lieflat-charts/blob/4eef5ce00d0907a03b8eff42578b5a04942915e9/README.md)
- [上游图型目录](https://github.com/larashero3-dotcom/lieflat-charts/blob/4eef5ce00d0907a03b8eff42578b5a04942915e9/catalog.md)
- [上游报告目录](https://github.com/larashero3-dotcom/lieflat-charts/blob/4eef5ce00d0907a03b8eff42578b5a04942915e9/report-catalog.md)
- [上游许可证](https://github.com/larashero3-dotcom/lieflat-charts/blob/4eef5ce00d0907a03b8eff42578b5a04942915e9/LICENSE)

## 变更记录

- `2026-09-03`：完成约定研究范围；补齐业务场景调用、完整中英切换、架构与能力总图、响应式与浏览器验证，状态更新为 `validated`。
- `2026-09-03`：创建研究条目，固定上游版本，完成首轮能力总结并建立能力展厅。
