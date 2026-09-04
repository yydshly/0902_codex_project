# Project Summary Web / 项目总览网页交付契约

## R39 设计契约

```text
Entry mode: Brief-led implementation inside the existing Aurelia research app
Request revision: R39 / render the consolidated project summary as a dedicated web page
Target user and context: 需要快速理解项目全貌、已完成证据、真实能力与下一阶段决策的项目负责人和研究参与者
Desired first impression: 这是一项结构清晰、有证据边界的数字生命与动态物质研究，而不是一组散乱特效页面
Visual ambition: Editorial
Experience architecture: Editorial Flow
Visual constraints: 延续 Aurelia 的深色、半透明、网格和生物光感，但信息层级优先；不复制具体水母场景，不增加高成本 WebGL 背景
Information constraints: 同时覆盖 15 个入口、能力地图、原水母因果链、研究体系、缺口、价值与当前决策；明确“机制通过不等于作品成熟”
Operation constraints: 案例可按类型筛选；导航、案例入口、展开内容和返回顶部均可用键盘；禁用 JavaScript 仍显示完整正文和链接
State constraints: 默认、五种案例筛选、展开/收起、reduced-motion、无 JavaScript
Environment constraints: 复用现有 Vite 多入口；无新依赖和外部素材；桌面、平板、390px 手机；zh-CN
Primary journey: 打开总览 → 理解项目定位 → 浏览案例成熟度 → 查看能力与关键结论 → 识别缺口和当前阶段决策 → 进入具体演示或研究文档
User-defined phases: 用网页形式展示已有案例、能力和研究汇总
Required artifacts: summary.html、summary.css、summary.js、Vite 入口、项目 README 链接、本交付记录、浏览器与构建证据
Autonomy authorization: 用户明确要求“用网页的形式进行展示”，授权在当前 Aurelia 子项目内实现独立入口
User-decision boundary: 不修改现有演示逻辑、不部署外部站点、不改变项目战略结论
Observable completion criteria: 首屏能辨认项目定位和关键数量；15 个入口完整且状态诚实；筛选可操作并有结果计数；能力、研究、缺口和决策可读；桌面/平板/手机无横向溢出；键盘焦点、reduced-motion、无 JS 和 production build 通过
```

## 覆盖清单

| 用户阶段 | 要求或产物 | 表面 / 状态 | 证据 | 阶段 | 状态 | 下一步 |
| --- | --- | --- | --- | --- | --- | --- |
| 网页展示 | 独立总览入口与完整信息结构 | 默认桌面 | 浏览器截图、DOM | 1–3 | pass | 首屏定位、数量、总图和八章阅读流完整 |
| 网页展示 | 15 个案例与成熟度可筛选 | all / benchmark / tool / validated / business / paused | 浏览器交互、计数、链接 | 4–6 | pass | 全部 15 项存在；业务筛选得到 `01 / 天气产品官网`，单结果扩为两列 |
| 网页展示 | 能力、研究、缺口、价值和决策完整 | 页面全文 | DOM、锚点、无 JS | 3 / 6 | pass | 四层能力、九个内核、八条结论、四类缺口、五项价值和五项决策完整 |
| 网页展示 | 响应式与键盘可用 | 1280 / 768 / 390 / keyboard | 截图、溢出、焦点路径 | 7 | pass | 三档视口均为 0px 横向溢出；键盘首焦点为可见 skip link |
| 网页展示 | 低动态和无 JS 保义 | reduced-motion / JS disabled | 浏览器观察 | 8 | pass | reduce 将轨道动画降至 `0.01ms` 并关闭平滑滚动；无 JS 仍有 15 案例、8 个章节、35 个链接和完整决策 |
| 网页展示 | 工程入口和文档闭环 | Vite build / README / console | 构建、文件、日志 | 9 | pass | 16 入口 production build 通过；总览页无 console / page error；README 与相邻页面导航已接入 |

## 设计方向

| 决策 | 选择 | 可观察约束 | 验收标准 |
| --- | --- | --- | --- |
| 首屏 | 一句话定位 + 因果链轨道 + 四个真实统计 | 不使用泛化大标题或装饰性 3D | 首次扫描能回答“项目是什么、有什么、为什么重要” |
| 阅读流 | 总览 → 案例 → 能力 → 水母基准 → 研究 → 缺口 → 价值 → 决策 | 长文分成有明确编号的章节 | 桌面和手机均可通过锚点快速到达 |
| 案例表达 | 以状态而非视觉风格分组 | 状态标签、证明内容和当前判断同时出现 | 不把机制样例写成成熟产品 |
| 视觉语言 | 深墨背景、青蓝生物光、酸绿决策色、温暖业务色 | 高亮用于语义，不依赖颜色独自表达 | 文本、边界、选中态与焦点均可读 |
| 动效 | 首屏轨道和数字轻微建立，筛选有短过渡 | reduced-motion 关闭非必要运动 | 信息不因动画关闭而丢失 |

## 浏览器与工程验证

- Canonical URL：`http://127.0.0.1:4173/summary.html`
- Start command：`npm run dev`，子项目目录 `apps/001-holtsetio-aurelia/`
- 1280×720：15 个案例、4 个顶栏入口、0px 横向溢出，控制台和页面错误均为空。
- 768×1024：主内容宽 730px、0px 横向溢出，首屏按单列 Editorial Flow 重排。
- 390×844：主内容与首屏正文宽 368px，标题和正文右边界为 379px，0px 横向溢出。
- 筛选：点击“业务纵切”后计数从 `15` 变为 `01`，唯一可见条目为“天气产品官网”，`aria-pressed=true`。
- 键盘：刷新后首次 Tab 落到“跳到项目总览”，焦点轮廓为 `solid`。
- reduced-motion：媒体条件命中，轨道动画时长为 `0.01ms`，页面滚动行为为 `auto`。
- JavaScript disabled：`data-enhanced` 不存在，但 15 个案例、8 个二级章节、35 个链接、noscript 说明和当前决策仍存在。
- 相邻入口：水母基准首页、方向总览和 Atlas 页脚均已接入“项目总览”；三页在 1280×720 与 390×844 都是 0px 横向溢出。
- Production build：Vite 100 modules / 16 HTML entries 构建通过；总览页 HTML 28.16kB（gzip 9.58kB）、CSS 26.22kB（gzip 5.90kB）、JS 1.62kB（gzip 0.78kB）。构建仍保留既有 Three WebGPU 大 chunk 提示，本页本身未引入 Three.js 或额外运行时依赖。

## R39 精炼记录

| 当前阶段 | 观察证据 | 问题 / 修订 | 相邻面 | 结果 | 决策 |
| --- | --- | --- | --- | --- | --- |
| 2 首屏层级 | 1280×720 首屏中项目定位和 ONE CAUSE 总图同时可见 | 无需增加 WebGL；保留 DOM / CSS 图形，让内容优先 | 顶栏、统计、首个 CTA | 首次扫描能识别定位、数量、基准和核心判断 | pass |
| 3 案例密度 | 单一状态筛选后，一张卡片只占三分之一而留下过多空白 | 根据可见数量为单结果扩为两列，不改变全部状态网格 | benchmark / business / paused / mobile | 单结果桌面宽 683 / 网格 1025px；手机仍为单列 | pass |
| 7 移动适配 | 普通 Chrome `--window-size=390` 实际按最小桌面宽度排版并裁图，形成假溢出 | 改用 Playwright 设备视口直接测量，不用错误截图判断 CSS | 768、390、reduced、no JS | 真实 390 视口为 0px 溢出，标题与正文均在 379px 右边界内 | pass |

R39 范围内没有 `continue`、`defer` 或 `blocked`；网页汇总交付闭合。

## R40 修订契约：从管理层总览到项目研究总账

```text
Entry mode: Revision-led refinement of the existing summary page
Request revision: R40 / 用户指出当前页面只有架构、缺少大量已经发生的案例与研究内容
Observed baseline: 当前页面能回答“项目是什么、有哪些类型、结论是什么”，但不能继续追溯“每个案例具体跑了什么规模、输入如何进入系统、哪些输出共享状态、证据在哪里、失败或边界是什么”；也缺少逐帧技术链、案例能力矩阵、R0–R40 演进和完整研究索引
Target user and context: 既需要五分钟看懂全局，也需要继续下钻核对事实、复盘决策和规划下一阶段的负责人、设计与技术参与者
Desired first impression: 上半页仍然清晰，下半页是一份有参数、有边界、有来源入口的研究总账
Visual ambition: Editorial research ledger
Experience architecture: Progressive disclosure — 总览先行，证据与技术向下展开；正文在无 JavaScript 时仍完整存在
Information constraints: 保留现有十五案例和战略结论；新增十五案例证据账、CPU→GPU→表面→反馈逐帧链、能力×案例矩阵、十方向与十二现实映射、R0–R40 演进、源码与研究文档索引
Operation constraints: 证据条目支持逐项和批量展开；矩阵在窄屏容器内滚动但页面本身不得横向溢出；所有状态文字不能只靠颜色表达
State constraints: 默认折叠/首项展开、全部展开、全部收起、已有案例筛选、reduced-motion、无 JavaScript
Environment constraints: 继续使用现有 Vite 多入口，无新增运行时依赖和外部素材，桌面/平板/390px 手机
Primary journey: 看总览 → 选案例 → 下钻事实账 → 理解逐帧架构与能力覆盖 → 核对研究方向和现实映射 → 回看演进与来源 → 形成下一步决策
Required artifacts: 修订后的 summary.html / summary.css / summary.js、本交付记录、浏览器与构建证据
User-decision boundary: 不改动十五个既有演示，不虚构生产数据，不把机制验证提升为成熟作品
Observable completion criteria: 十五案例均有参数/链路/证据/边界；技术管线与能力矩阵可读；十方向、十二观察和演进记录完整；桌面/平板/手机无页面横向溢出；展开控制、键盘、无 JS、reduced-motion 和 production build 通过
```

## R40 覆盖清单

| 用户阶段 | 要求或产物 | 表面 / 状态 | 证据 | 阶段 | 状态 | 下一步 |
| --- | --- | --- | --- | --- | --- | --- |
| 内容下钻 | 十五案例证据账 | 默认、逐项展开、全部展开/收起 | DOM、键盘、浏览器观察 | 2–6 | pass | 15 项均包含结构规模、输入、同源输出、证据边界与演示 / 源码入口；批量展开为 15，收起为 0 |
| 技术理解 | 每帧运行链与源库事实 | CPU → Storage → Compute → Surface → Feedback | DOM、源码索引 | 3–6 | pass | 六阶段运行链、四项上游事实、九个内核候选均已展开 |
| 横向核对 | 能力 × 案例覆盖矩阵 | desktop / narrow container scroll | DOM、截图 | 3–7 | pass | 10 个主要案例 × 8 种能力；V / P / — 同时有文字语义，窄屏局部滚动且页面 0px 溢出 |
| 研究追溯 | 十方向、十二现实映射与下一实验 | 完整列表 | DOM、无 JS | 3–6 | pass | 10 个方向均有状态、机制和下一步；12 个现实观察均有现实行为、计算映射和研究归属 |
| 历史复盘 | R0–R40 演进和来源索引 | 时间线、源码/研究链接 | DOM、链接 | 3–6 | pass | 7 个阶段记录关键转折；7 组来源索引覆盖架构、扩展、图谱、案例、业务、旗舰和总账 |
| 交付闭环 | 响应式、键盘、低动态、无 JS、构建 | 1280 / 768 / 390 / keyboard / no JS / reduce / build | 浏览器、命令 | 7–9 | pass | 三档视口 0px 页面溢出、无 console/page error；键盘焦点、低动态、无 JS 内容与独立 CSS、production build 均通过 |

## R40 浏览器与工程验证

- 页面由 8 章扩为 11 章，DOM 中包含 15 个案例卡、15 个证据条目、10 个创意方向、12 个现实映射、10 行能力矩阵和 7 个演进阶段。
- 1280×720、768×1024、390×844 三档视口页面级横向溢出均为 `0px`；能力矩阵在平板与手机中保留自身横向滚动，不再撑宽页面。
- “展开全部”后 15 个证据条目全部打开且焦点回到第一项；“收起全部”后打开数为 0；原生 `details` 在无 JavaScript 时仍可逐项操作。
- 键盘首次 Tab 仍落到“跳到项目总览”，焦点轮廓为 `solid`；V / P / — 均有屏幕阅读器可读文字，而非只依赖颜色。
- `prefers-reduced-motion: reduce` 命中时轨道动画时长为 `0.01ms`、滚动行为为 `auto`、页面溢出为 0。
- JavaScript disabled 时仍存在 15 案例、15 证据条目、10 方向、12 映射、11 章节和关键技术边界；CSS 改为 HTML 独立加载，不依赖脚本执行。
- 全部验证视口的 console error 和 page error 为空。
- Production build：Vite 100 modules / 16 HTML entries 通过；`summary.html` 62.54kB（gzip 18.44kB）、summary CSS 38.41kB（gzip 7.69kB）、summary JS 1.95kB（gzip 0.90kB）。既有 Three WebGPU 大 chunk 提示仍在，本总账页未引入 Three.js。

## R40 精炼记录

| 当前阶段 | 观察证据 | 问题 / 修订 | 相邻面 | 结果 | 决策 |
| --- | --- | --- | --- | --- | --- |
| 2 内容完整性 | R39 只有案例摘要、四层能力和统计数字 | 保留总览，向下补十五案例事实账、运行链、矩阵、十方向、十二映射、时间线和来源索引 | 章节导航、首屏 CTA、研究图谱 | 从“结论页”变成“总览 + 可追溯证据” | pass |
| 6 证据操作 | 十五条同时展开会让默认页面过长 | 默认仅打开基准项，提供逐项原生 details 和全部展开 / 收起 | 键盘、无 JS | 默认可扫描，深读可一次展开；无脚本仍保义 | pass |
| 7 窄屏矩阵 | 初次浏览器测量中平板溢出 171px、手机 451px | 将矩阵约束为局部 inline-size / layout / paint containment，并让技术章节裁切外部溢出 | 768、390、reduced-motion | 页面均回到 0px 溢出，矩阵保留局部滚动 | pass |
| 8 无脚本 | CSS 原先通过 JavaScript import 注入 | 把 summary CSS 提升为 HTML 样式入口，脚本只负责增强交互 | dev / build / no JS | 无脚本时内容和视觉层级都保留 | pass |

R40 范围内没有 `continue`、`defer` 或 `blocked`；研究总账修订闭合。
