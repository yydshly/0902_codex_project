# ThreeUI

> ThreeUI 的核心价值不是发明一套新图形引擎，而是把已经完成的创意视觉实现整理成可预览、可调参、可安装、可复制源码的 React 视觉资产。

![ThreeUI Runtime Atlas 以 PageSpec 智能选型为主入口，并公开 48 个实时案例、162 个可运行配置与 43 个父能力的验证状态](assets/cover.webp)

## 我们对这个库的最终理解

ThreeUI 的上游本质是“高质量创意视觉素材 + React 适配与分发系统”。素材是起点，真正值得复用的是把 WebGL、Canvas、Three.js、DOM/CSS 和完整 HTML 作品统一成可发现、可调参、可按需加载、可复制源码的资产协议。它不是页面生成器，也不会替我们完成内容理解、信息架构、视觉取舍和质量验收。

| 问题 | 收束后的判断 |
| --- | --- |
| 它有什么能力？ | 提供多运行时视觉组件、具名变体、参数控制、静态资产、源码与安装路径；本研究以 48 个案例验证 162 个配置，并为 43 / 43 个 Community 父能力建立现场路径。 |
| 底层原理是什么？ | Catalog 描述能力，React host 管 props 与生命周期，renderer 在 DOM / CPU / GPU / iframe 中执行，npm / 源码 / Skill / CLI 负责交付。 |
| 适合什么场景？ | Hero 与品牌氛围、章节转场、空间陈列、编辑排版、关键 CTA、系统/数据视觉和难拆分的整页参考；核心内容、状态与操作应继续由宿主 DOM 持有。 |
| 能怎样扩展？ | 为每项能力补充页面角色、内容安全区、性能成本、fallback、事件与实测 verdict，再由 Planner 根据 PageSpec 选择，而不是继续堆同质效果。 |
| 对我们有什么意义？ | 它可以成为优秀网页生成系统的 renderer registry；我们的核心价值则是 `Brief → PageSpec → 选择/编排 → 浏览器验收`，即把素材变成有目标、可降级、可验证的网页。 |

实际系统位置是：

```text
业务 Brief → Kage Planner → PageSpec → ThreeUI Registry → 宿主 DOM + 视觉 renderer → Browser Quality Gate
```

因此，“把它作为网页底座”并不等于直接套用一个效果：上层仍要拥有语义内容、版式、交互、数据、SEO 与无障碍；ThreeUI 只在被 PageSpec 选中的槽位中提供视觉增强，并受设备预算、单实例、降级和浏览器验收约束。

## 项目信息

| 字段 | 内容 |
| --- | --- |
| 研究编号 | `003` |
| 上游仓库 | [`MengTo/threeui`](https://github.com/MengTo/threeui) |
| 研究基线 | commit [`68802d5`](https://github.com/MengTo/threeui/tree/68802d5428071ada5c20db8094b1649e6bb770ed)，npm `@designcodeio/threeui@1.2.0` |
| 上游许可证 | [MIT](https://github.com/MengTo/threeui/blob/68802d5428071ada5c20db8094b1649e6bb770ed/LICENSE)；字体、第三方运行时和远程预览另见上游声明 |
| 研究状态 | `validated` |
| 首次研究 | `2026-09-03` |
| 最近更新 | `2026-09-04` |
| 标签 | `react`, `three.js`, `webgl`, `canvas`, `ui-components`, `shaders`, `agent-skills` |

## 为什么值得研究

高质量网页视觉的难点往往不在“能不能写出一个 shader”，而在如何把实验变成团队可用的产品资产：如何发现、预览、配置、导入、复制源码、处理尺寸变化、暂停离屏渲染、释放资源，并在不同图形技术之间保持接近的使用体验。

ThreeUI 把这些问题同时放进一个组件目录和分发链路里。它因此更像“视觉零件仓库 + 交付系统”，而不是单一 UI 套件或网页生成器。

## 研究问题

- [x] Community 版包含哪些能力，是否只有 Three.js？
- [x] Raw WebGL、Canvas 2D、Three.js 与 DOM/CSS 组件的底层路径有何区别？
- [x] React 包装层如何处理参数、尺寸、动画与资源生命周期？
- [x] 它适合在哪些页面位置使用，生产集成的风险在哪里？
- [x] 它和我们研究的 Kage / 优秀网页生成方向是什么关系？

## 结论摘要

- **已验证：** npm 包暴露根入口、样式入口、按组件子路径和静态资产子路径；本地发布目录包含 103 个公开组件入口，Demo 以 48 个真实上游案例覆盖五类能力、成品网页角色与全部父能力，而不是临摹效果。
- **已验证：** 浏览器探针分别观察到 `webgl`、`2d`、`webgl2` context；切换到 DOM/CSS 案例后页面中没有 Canvas，中央控件仍是可聚焦、可点击的原生 `button`。
- **已验证：** 实时 renderer 在 React effect 中建立运行时，并用 `ResizeObserver`、`IntersectionObserver`、`requestAnimationFrame` 与清理函数管理尺寸、离屏暂停和释放；完整作品则保留在 iframe 沙箱中。
- **已验证：** 当前 48/48 项都有运行路径；本轮新增 10 项经肉眼与 DOM 双重检查达到稳定画面和“已就绪”。Text Path 6/6、Shader Buttons 6/6 与 8 个单例形成 20 个新增配置，页面累计 162 个可运行配置。
- **已验证：** 43 个父条目现按真实接入状态分为 43 `LIVE`、0 `PARTIAL`、0 `INDEX`；每个父条目都可从索引回跳对应案例。`LIVE` 只表示登记能力已有运行证据，不等于生产性能或业务接线认证。
- **已验证：** 像素复核发现两个 `iframe onLoad` 无法暴露的上游问题：Spark Badge 因 `params` 未定义黑屏，Sylva 抽取适配器 ready 后只有雾层。前者补齐查询参数初始化，后者使用同包 `scene-only` 资源和固定参考画布恢复。
- **已验证：** 48 项 Live Lab 已增加跨标题、网页角色、运行时、说明和 variant 的现场检索，并可与类别组合；优化前 1584 / 264px 的滚动查找不再是唯一入口。Sylva 则直接加载 authored source，生产构建移除原 215.53 kB gzip 失效包装块。
- **已验证：** 舞台具备加载、慢初始化、等待舞台可见、失败和重试反馈。首次离屏选择不再误报失败；阻断 Kage 资源仍会进入“重新加载”，解除阻断后可恢复并完成页面预载。
- **已验证：** 概念产品 KAGE STUDIO 把 7 个真实组件实例编排为 `signal → system → identity → proof` 四幕完成态产品叙事；这证明库能力可以服务同一页面目标，而不只是被逐项预览。
- **已验证：** Our Generation Workflow 把组件接进 Brief→Hero、品牌适配、CTA 接线、浏览器质量门禁和 Kage 模板迁移五个实际任务。当前为 3 项 `PASS`、2 项 `CONDITIONAL`；质量门禁通过是宿主 DOM 检查的结论，Gauge 本身没有数据 API 的限制仍然保留。
- **已验证：** Registry 自动选型把 brief、设备与性能预算映射为“主视觉锚点 / 结构与身份 / 行动与证明”三层组合，并将三项推荐真正编排成可滚动网页。组合成品与单项检查可逆；三段共享一个活动 renderer 预算，同时保留分数、理由、runtime、成本、fallback、预算淘汰项、机器 JSON 与 Live Lab 回跳。
- **已验证：** 自然语言 Brief 现在会被本地确定性 adapter 编译为 `kage.pagespec/0.1`，品牌、受众、目标、内容和三层 slot 共同驱动摘要、成品 DOM 与 JSON。内容可实时编辑并保存为独立 content revision，renderer 选择保持不变；Clipboard 成功与受限环境恢复、三视口、全屏单实例、reduced-motion 和无 WebGL 均已复核。
- **已验证：** Liquid Hero 的长文案压力、preset 和静态降级均通过；Circle Buttons 的真实 `onClick` 更新了宿主状态；Performance Gauges 则确认没有 `value/range/onChange`，不能直接承担业务图表。
- **已验证：** 当前上游 README 声称 50 个父组件、111 条路由和 164 个浏览结果，但同一基线的机器同步报告记录 43、104、163。Demo 因此明确以机器报告为目录口径，完整列出 43 个父条目、163 个具名变体和其中 13 个单例组件；103 个 npm 公开入口另行标注，避免把四种计数混为一谈。
- **推断：** ThreeUI 真正可复用的不是某个视觉风格，而是“目录元数据 → 参数化 React 壳 → 多运行时 renderer → npm/源码/Skill/CLI”的资产产品化方法。
- **评价：** 它很适合作为优秀网页生成系统的效果供应层，却不能替代页面级的内容理解、信息架构、审美判断、组合策略和质量评估。

## 能力地图

| 能力层 | ThreeUI 提供什么 | 本 Demo 的证明 | 适合场景 |
| --- | --- | --- | --- |
| 发现与理解 | 分类浏览、搜索、详情页、实时预览、参数说明、变体 | 43 项完整索引与 48 项实时舞台均可搜索；现场搜索可按页面角色、运行时和变体定位 | 技术选型、视觉探索、快速比较 |
| React 组件 | props 参数、CSS 包装、生命周期、类型声明 | 48 个案例从 npm 子路径按需加载 | Hero、背景、按钮、预测、网络、凭证、内容开场、转化页尾与整页作品 |
| 多渲染栈 | Raw WebGL、Canvas 2D、Three.js、DOM/CSS/SVG、iframe | 48 个跨五类案例逐一挂载实测 | 从轻量控件到 GPU 像素效果、三维场景、语义页面模块和整页叙事 |
| 分发与复用 | npm 包、完整 Community 源码、资产、来源说明；Pro 另有 CLI | 锁定 `1.2.0`、包构建和静态部署 | 团队组件库、Agent 工具箱、设计工程协作 |
| 工程边界 | 离屏暂停、响应式 resize、资源 dispose、资产路径与加载恢复 | 切换时只保留当前 renderer；无 WebGL 有 DOM fallback；失败案例可重试 | 生产集成前的可靠性基础 |

详细实现与扩展方向见 [`capability-map.md`](capability-map.md)。

## 底层原理

### 1. 目录层：先把视觉作品描述成数据

组件条目携带 id、变体、控制参数、技术标签、预览和源码入口。目录并不负责绘制，但它让“发现一个效果、理解它能调什么、把它带走”成为稳定流程。上游的 [`community-sync-report.json`](https://github.com/MengTo/threeui/blob/68802d5428071ada5c20db8094b1649e6bb770ed/public/community-sync-report.json) 还记录每个 Community 条目的变体与控制键，用于检查公开边界和同步完整性。

### 2. React 包装层：把命令式 renderer 变成声明式组件

实时图形通常依赖命令式资源：canvas context、shader program、buffer、scene、camera、animation frame。ThreeUI 的组件在挂载时创建它们，把最新 props 保存在 ref 中供渲染循环读取，并在卸载时取消帧循环、断开 observer、删除 WebGL 对象或调用 renderer `dispose()`。

共同生命周期可以归纳为：

```text
props / catalog metadata
          ↓
React component mounts
          ↓
create renderer → resize → frame loop
          ↑                     ↓
   props ref updates      visibility pause
          └──── unmount → cancel / dispose
```

![ThreeUI 原理区把 Catalog、React Host、Runtime、Distribution 连接为四层架构，并列出生命周期与 iframe 边界](assets/screenshots/runtime-architecture.png)

### 3. 渲染层：不是一条技术路线，而是四条

- **Raw WebGL：** [`LiquidFormBackground`](https://github.com/MengTo/threeui/blob/68802d5428071ada5c20db8094b1649e6bb770ed/src/shaders/liquid-form/LiquidFormBackground.tsx) 自己编译顶点/片元 shader、创建全屏四边形 buffer，并逐帧更新分辨率、时间、指针和材质 uniform。CPU 负责状态与命令，GPU 并行决定像素颜色。
- **Canvas 2D：** [`condensationRenderer`](https://github.com/MengTo/threeui/blob/68802d5428071ada5c20db8094b1649e6bb770ed/src/shaders/condensation/condensationRenderer.ts) 在 JavaScript 中维护水滴生长、下落、合并和涟漪；预渲染不同尺寸的水滴精灵到缓存 Canvas，再逐帧合成。
- **Three.js：** [`orbitalSphereRenderer`](https://github.com/MengTo/threeui/blob/68802d5428071ada5c20db8094b1649e6bb770ed/src/shaders/orbital-sphere/orbitalSphereRenderer.ts) 使用 Scene、PerspectiveCamera、BufferGeometry、Points、Line 和 Mesh 组织 15,000 个候选点及轨道。Three.js 简化场景管理，最终仍调用 WebGL。
- **DOM + CSS：** [`CircleButtons`](https://github.com/MengTo/threeui/blob/68802d5428071ada5c20db8094b1649e6bb770ed/src/shaders/circle-buttons/CircleButtons.tsx) 用真实按钮语义、SVG 和 CSS 渐变/阴影/滤镜形成质感；它保留键盘和可访问性语义，不需要 Canvas。

### 4. 分发层：组件、样式和资产分开交付

[`package.json`](https://github.com/MengTo/threeui/blob/68802d5428071ada5c20db8094b1649e6bb770ed/package.json) 通过 exports 同时暴露根入口、`style.css`、`components/*` 和 `assets/*`。本 Demo 对 48 个案例采用按组件子路径动态导入：主界面与各 renderer 分块构建，重型 Three.js 和 iframe 组件只在用户选择时下载和执行。

完整 HTML 作品需要把 `lib-dist/assets` 中的运行文件复制到应用 public 目录，或通过组件的 `sourceUrl` / `assetBaseUrl` 改写路径。这种方案保真度高，但引入 iframe、路径、跨域、通信和第三方素材边界。

## 与 Kage / 优秀网页生成研究的区别

两者位于同一条链路的不同层：

| 研究方向 | 主要回答的问题 | 主要产物 | ThreeUI 与它的关系 |
| --- | --- | --- | --- |
| Kage / 优秀网页生成 | 面对一个目标，怎样决定叙事、内容结构、版式、风格、动效和页面组合？ | 新页面、生成流程、审美与评估规则 | 决定“为什么这样设计、怎样组合成完整体验” |
| ThreeUI | 一个已经做好的视觉实验，怎样被发现、调参、复用和交付？ | 参数化组件、目录、源码、资产、安装链路 | 提供“可被选择和编排的高级视觉零件” |

因此，ThreeUI 不是 Kage 研究的替代品，而是可接入其中的能力层。理想组合是：生成系统先理解目标并制定页面结构，再从类似 ThreeUI 的目录中检索合适效果，生成参数和内容映射，最后用性能、可读性、可访问性规则验收成品。

## 实际使用场景与探测结论

真实价值不是“看见 renderer 已经挂载”，而是知道它进入我们的网页生成链路以后，内容、品牌、事件、浏览器验收与模板治理是否仍然成立。本研究把五项探测连成 `Brief → Candidate → Brand → Events → Browser Gate → Template`：

| 使用场景 | 运行探测 | 结果 | 有界结论 |
| --- | --- | --- | --- |
| Brief → Hero | Liquid Form + 可索引 DOM；选择三类项目 brief，切换 Calm/Kinetic、长文案与 fallback | 创意工作室 preset 更新标题/正文/CTA；1 Canvas；fallback 后 0 Canvas、2 CTA 保留 | `PASS`：结构化 brief 可以驱动内容与视觉参数，但必读内容不能进入 Canvas |
| 品牌适配 | Brand Orbs 在 Codex/Figma/React 间预览，并点击 Apply 写回宿主 | Figma preset 可见；回执更新为已应用；1 Canvas iframe | `CONDITIONAL`：协议成立；真实项目需换自有资产并处理商标与 iframe 边界 |
| CTA 接线 | Circle Buttons 切换 variant，并把生成候选送入浏览器验收 | 1 原生 button；交接计数 `00 → 01`；ARIA/onClick 可用 | `PASS`：视觉组件可以进入生成、发布或回滚的宿主状态 |
| 浏览器质量门禁 | 宿主读取当前舞台的水平溢出、语义标题、控件与视觉实例；Gauge 只作氛围 | `PENDING → PASS`；0 溢出、1 标题、1 控件、1 iframe | `PASS`：DOM 检查可用；Gauge 无 value API，不能冒充检测结果 |
| Kage 模板迁移 | Kage URL iframe 运行完整页面，切换宿主字体/主色 | 1 iframe；Editorial preset 生效；本地资产约 3.52 MB | `CONDITIONAL`：适合页面基座；内容槽位、路由、SEO、数据、焦点和资源需桥接 |

探测台还实时输出一份最小能力协议：`workflow + brief + role + component + runtime + preset + appliedBrand + enhancement + observed + audit + verdict`。这使“选用一个效果”从审美猜测升级为可查询、可运行、可验收的生成决策。

### Registry 自动选型原型

页面新增 `#selector`，把上面的能力协议用于一次真正的选型，而不是继续堆叠静态说明。用户可以先写一句自然语言 Brief，再选择四种视觉方向、移动/桌面优先和轻量/均衡/沉浸预算；本地 Planner adapter 提取品牌、受众和行动目标，按角色、适配度、设备、成本上限和固定优先级选择三层候选，并编译为 `kage.pagespec/0.1`。

已观察到的结果不是同一列表换标签：默认 AI 产品 / 移动 / 均衡返回 Liquid Form、Constellation Network 与 Rectangle CTA；自然品牌 / 桌面 / 沉浸返回 Sylva Living World、Woven Cloth 与 Newsletter Footer；自然品牌切回轻量预算后，Sylva、Sylva Hero 与 Woven Cloth 被明确排除。创意工作室 / 沉浸在移动端选择 Gallery Heading，在桌面端改选 Sketchbook；研究型产品返回 Constellation、Predictive Arc 与 Diagnostics。

选择完成后，PageSpec 摘要、视觉 slot、机器 JSON 与带浏览器外壳的三段页面读取同一份状态：Hero 使用 Scene anchor，系统说明使用 System layer，行动收束使用 Action layer。页面导航与内部滚动共同更新活动段；只有活动段挂载真实 `DemoStage`，另外两段使用静态待机层，因此“组合三个能力”不会变成三个 WebGL / Canvas / iframe 同时常驻。用户也可以编辑 Hero、System 与 Action 的宿主文案；改动实时进入成品，保存只增加 content revision，不会重跑视觉选择。复制控制会导出当前 PageSpec，并在剪贴板被拒绝时引导展开机器结果手动复制。

为了让这个结果从“工作台里的小样”进入接近交付判断的状态，本轮增加了两种成品深度。`全屏体验` 使用同一组 DOM 与 renderer 覆盖完整视口，锁定背景滚动、接管焦点并支持 `Escape` 恢复；`集成透视` 则把当前段的页面职责、ThreeUI 组件、runtime、实测成本、fallback 与选择理由放到成品旁，同时直接标出宿主内容层和 ThreeUI 视觉层。这样可以先以终端用户视角判断成品，再以工程视角判断如何接入，而不是在“好看”和“可用”之间来回猜测。

全屏 Hero 还显示三个有来源的工程事实：43 个已验证父能力、单活动 renderer、DOM fallback ready。它们不是虚构业务指标；真正的产品数据、埋点和后端状态仍属于宿主应用。点击 Live Lab 或单项检查会先退出全屏前景层，再进入目标路径，避免交互看似执行、结果却被遮住。

当前实现仍是确定性本地 Planner adapter，不是远程 AI。它的价值是把上层接口推进为可运行闭环：自然语言输入、PageSpec、候选分层、选择理由、内容修订、成本门禁、fallback、JSON、完整页面编排、单实例调度和 Live Lab 深入检查已经共用一条数据链。下一步可以用真实 Kage Planner 替换关键词提取与固定模板，而不需要推翻 PageSpec、页面或资产协议。

### 已实际触发的扩展方向

1. **内容安全区：** Hero 的长文案开关真实改变标题长度，并验证 CTA 与舞台边界。
2. **参数 preset：** Brief/Hero、Brand、CTA、Gauge 与 Kage 都有可切换的受控 preset。
3. **运行时降级：** 关闭增强、reduced-motion 和无 WebGL 都会卸载高成本 renderer，保留 DOM 产品层。
4. **宿主状态协议：** Brand Apply 与 Circle Buttons `onClick` 已进入外层 React 状态；同样的包装可扩展到 loading/success/error、发布与 analytics。
5. **视觉预算调度：** 探测台只挂载当前场景，离开整个 workspace 即卸载 renderer；实例数在报告中实时显示。
6. **iframe 生产治理：** Gauge 与 Kage 的 CDN、路径、通信和沙箱问题由运行态直接暴露，成为迁移任务而不是隐含风险。
7. **浏览器质量门禁：** 当前页面已经运行一次真实 DOM audit；下一步可以把同一协议接入 Playwright 多视口、性能与可访问性检查。

## 从素材库到产品组合验证

在实际场景探测之外，Demo 仍保留明确标注为概念产品的 **KAGE STUDIO**，用于验证多个 renderer 能否形成一致叙事。它是组合证据，不再承担生产可用性结论；真实价值以前一节的场景探测为准。

| 产品场景 | 叙事职责 | 组合能力 | 为什么这样用 |
| --- | --- | --- | --- |
| Signal | 第一眼建立品牌信号并给出进入动作 | Liquid Form + Circle Buttons | shader 负责氛围，原生 button 负责可操作入口 |
| System | 解释生成结果背后是有约束的系统 | Orbital Sphere | 有结构的轨道视觉对应“决策系统”，不替代正文 |
| Identity | 展示同一系统可形成不同品牌表达 | 3 × Brand Orbs | 多实例在同一信息目标下形成对照，而非效果堆叠 |
| Proof | 收束为可交付、可验证的结果 | Semantic Bloom | 动态文字成为证明氛围，交付清单仍由 DOM 承载 |

这次组合验证把结论推进了一步：ThreeUI 可以作为上层开发的视觉基座，但“成品感”并不来自组件数量。真正的上层价值来自内容层级、视觉选型、场景导演、状态映射、性能预算与降级验收。ThreeUI 提供 renderer；Kage / 生成层决定何时用、组合什么、让它服务哪条产品叙事。

演示支持四个语义 tab、方向键、上一幕/下一幕和自动播放，手动操作会立即接管导演状态。核心标题、说明、指标和证明项始终保留在 DOM；离开视口时卸载当前 renderer，reduced-motion 禁用自动播放，无 WebGL 时 Signal/System 切换为 CSS 静态场景。这些约束使它成为一段可评估的产品案例，而不只是最佳状态截图。

## 实验与验证

| 验证问题 | 方法 | 结果 | 证据 | 限制 |
| --- | --- | --- | --- | --- |
| npm 包能否独立使用 | 固定 `@designcodeio/threeui@1.2.0`，TypeScript + Vite 生产构建 | 通过；240 个模块转换完成 | [`apps/003-mengto-threeui/package.json`](../../apps/003-mengto-threeui/package.json) | 未覆盖 Pro 源码 |
| 能力广度是否完整可见 | 固定机器报告数据，展开、搜索和分类索引 | 43/43 父条目、163 个具名变体；`brand` 搜索为 1 项；按钮类为 6 项 | [完整索引截图](assets/screenshots/community-index.png) | 索引展示全部元数据，不逐一运行 163 个变体 |
| 多类别案例是否真实运行 | Chromium 切换 48 个 tab，并对新增 39–48 做肉眼与 DOM 双重检查 | 48/48 具有运行路径；新增十项全部达到非空稳定画面与“已就绪” | [生长树](assets/screenshots/generative-tree-live.png)、[品牌球](assets/screenshots/brand-orbs-live.png)、[Kage](assets/screenshots/kage-live.png) | 不等于 103 个入口的逐项生产性能背书 |
| 集合入口是否真的覆盖内部效果 | 逐一选择集合入口的 option，并记录 health、表面类型与溢出 | 前五轮累计 142；第六轮 Text Path 6/6、Shader Buttons 6/6 与 8 个单例新增 20，累计 162 个运行配置 | 浏览器 variant 探针与 [`design-contract.md`](design-contract.md) | 验证可运行与可见，不代替逐项帧时间、业务语义和实机审计 |
| 父能力覆盖是否可解释 | 展开 43 项索引并统计 coverage badge，再从原 INDEX 条目回跳 | 43 LIVE / 0 PARTIAL / 0 INDEX；回跳选中对应 tab 并返回 `#live` | 浏览器 DOM 探针 | LIVE 代表当前目录能力已接入，不等于生产性能认证 |
| 48 项是否仍可快速查找 | 操作全部和五类筛选，检查数量、内部滚动与筛选后方向键循环 | 五类为 13 / 7 / 8 / 6 / 14；筛选、焦点与选中状态同步 | 浏览器筛选与键盘探针 | 分类按页面当前研究语义，不替代上游 taxonomy |
| 四条底层路径是否可验证 | 记录 canvas context、DOM 控件和 iframe 子文档 | 观察到 `webgl`、`2d`、Three.js WebGL、零 Canvas DOM、srcDoc 与 URL iframe | 浏览器运行时探针 | 部分路径共享浏览器合成与 GPU |
| 交互是否生效 | 改动三条 range，触发 Circle button，方向键切换 tab | 输出更新为 `35 / 1.4× / 284°`；click 回执和键盘切换正确 | Demo 交互探针 | 未做完整辅助技术人工审计 |
| 响应式是否可用 | 1280×900、1024×768、390×844 | 精确 Chrome 视口通过；三种尺寸页面与舞台横向溢出均为 0，48 项导航使用内部滚动区 | [手机截图](assets/screenshots/runtime-atlas-mobile.png) | 仓库截图为早期版本；本轮精确尺寸证据来自本地实时 Chrome，未覆盖全部实机 GPU |
| 降级是否保留信息 | 模拟 `prefers-reduced-motion` 和 WebGL context 创建失败 | 自动导览禁用、标记 `PAUSED`；出现可读 fallback | [`design-contract.md`](design-contract.md) | 无 WebGL 为自动模拟 |
| 加载失败能否恢复 | 阻断 Kage 页面直到 18 秒超时，再解除阻断并触发重新加载 | `仍在初始化 → 重新加载 → 已就绪`；Kage preloader 完成 | 浏览器故障注入探针 | 当前自动重试需用户点击 |
| 多种能力能否构成完成态产品 | 逐幕检查 KAGE STUDIO 四个场景，测试 tab、方向键、Circle button、自动播放、手机与两种降级 | 4/4 稳定；7 个真实组件实例；自动播放约 20 秒停在 Proof；390px 无横向/舞台溢出；reduced-motion 与无 WebGL 仍保留 DOM 内容 | [`design-contract.md`](design-contract.md) 与组合演示浏览器探针 | 概念页验证前端表达，不宣称真实生成后端 |
| 我们的生成链路是否成立 | 逐项运行 Brief/Hero、Brand、CTA、Browser Gate、Template，检查 renderer、preset、状态回写、DOM audit 和 iframe | 5/5 挂载；3 PASS / 2 CONDITIONAL；每项无舞台布局溢出 | Our Generation Workflow 浏览器探针与 [`design-contract.md`](design-contract.md) | verdict 只覆盖本次组件、浏览器和固定版本 |
| 扩展方向是否能被执行 | 触发 brief 映射、长文案、视觉层开关、Brand Apply、CTA callback、DOM audit 与离屏调度 | 创意工作室内容生效；Hero fallback 后 0 Canvas、2 CTA；Brand Apply 回执；CTA `00 → 01`；Gate `PENDING → PASS` | 实时 manifest、telemetry 与浏览器交互证据 | 自动选型已完成本地规则原型，尚未接真实 Kage Planner 或后端 |
| 实际场景跨表面是否可用 | 1280、1024、390、键盘与静态 fallback | 三尺寸无横向溢出；五场景无舞台溢出；tab 方向键同步焦点；390px tab 最小约 97px；fallback 保留内容与控制 | Our Generation Workflow 浏览器矩阵 | Gauge 原作仍有 Tailwind CDN 警告；本轮未重跑真实移动 GPU |
| 48 个现场案例是否易于发现 | Live Search 单命中、多命中、类别叠加、空结果、Escape 与方向键 | `证书` 1 / 48；`button` 5 / 48 且首尾焦点循环；Sylva + 场景为 1 / 14；0 命中可恢复；1280/1024/390px finder 无溢出 | 第七轮真实浏览器矩阵与 [`design-contract.md`](design-contract.md) | 搜索提高发现效率，不代表命中案例自动达到生产资格 |
| Sylva 恢复路径是否消除重复成本 | 对比构建 chunk、桌面画面、390px、reduced-motion、单实例与健康状态 | 苔藓世界画面保持；390px ready、单 iframe、无溢出；240 模块构建不再包含 815.61 / 215.53 kB wrapper | 构建产物与真实浏览器探针 | authored HTML 约 1.45 MB，真实移动 GPU 帧时间仍未认证 |
| Registry 能否按真实约束返回组合 | 操作四类 brief、两种设备、三档预算，检查 dirty/ready、分层结果、排除项、键盘、JSON 与 Live 回跳 | 结果随意图、设备和预算变化；轻量档排除 3 个重型候选；ArrowLeft 首尾循环；Newsletter 从推荐区准确打开 Live Lab | `#selector` 浏览器交互与 [`design-contract.md`](design-contract.md) | 当前分数为固定本地规则，不代表 AI 判断或跨项目质量 |
| 自动选型能否跨表面降级 | 1280×900、1024×768、390×844、reduced-motion 和 WebGL 人工拒绝 | 三视口无页面/局部横向溢出；390px 控件最小 44px；reduced-motion 保留单一预览；无 WebGL 保留三项推荐、产品文案、操作和可读 fallback | 真实浏览器与独立 CDP 会话 | 未替代真实移动 GPU、帧时间和辅助技术人工验收 |
| 三项推荐能否成为一个真实页面 | 在组合成品中逐段触发 Hero / System / Action，再切到单项检查并返回；重复生成自然品牌方案 | 三段均展示独立 DOM 内容和对应真实组件；自然品牌为 Sylva → Woven → Newsletter；模式可逆且 plan 不丢失 | `#selector` 真实浏览器交互与 [`design-contract.md`](design-contract.md) | 页面内容为固定场景模板，尚未由真实 Planner 生成 |
| 组合页能否控制运行成本 | 逐段统计活动 renderer、待机层、Canvas/iframe；独立模拟 reduced-motion 和无 WebGL | 每段仅 1 个活动组件根、2 个待机层；Canvas/iframe 从不超过 1；无 WebGL 时 0 个视觉实例但三段 DOM、导航和 CTA 保留 | 真实浏览器与独立 CDP 会话 | 单实例策略不替代目标设备帧时间与内存测量 |
| 成品能否脱离工作台独立判断 | 打开全屏、切换三段、按钮和 Escape 退出，检查滚动锁、焦点与业务跳转 | 1280/1024/550/390px 均覆盖完整视口且无横向溢出；背景锁定；Escape 退出后焦点回到全屏按钮；Live/检查会先关闭前景层 | `#selector` CUA 视觉复核与独立 CDP 矩阵 | 仍是前端生成结果，不包含真实路由、账号或后端数据 |
| 成品能否解释真实集成边界 | 在成品/透视间切换，并分别激活 Hero、System、Action | strip 与活动段同步；显示 role、id、runtime、cost、fallback、reason；6 个 DOM/renderer 边界被标记 | `#selector` 真实浏览器交互 | 成本来自固定 1.2.0 探测记录，不是实时性能遥测 |
| 自然语言 Brief 能否形成可追踪 PageSpec | 输入 `Aurora Field` 研究产品需求，选择研究方向、桌面与均衡预算，再生成 | 提取品牌、`研究团队与品牌负责人`、订阅目标；生成 `R02.0` 和 Constellation / Predictive Arc / Diagnostics 三层 slot | `#selector` CUA 与独立 CDP 会话 | 当前提取器为确定性关键词规则，不等于通用语言理解 |
| PageSpec 能否真正驱动并编辑成品 | 修改 Hero 标题与 CTA，观察摘要、三段 DOM、slot、全屏与 JSON | 标题和两个主行动实时同步；slot id 保持不变；保存进入 `R02.1`，焦点回到编辑入口 | `#selector` 浏览器交互 | 本轮只开放关键宿主文案，不是完整可视化页面编辑器 |
| PageSpec 能否复制并跨表面保真 | 普通浏览器与受限无头剪贴板、1280/1024/390px、reduced-motion + 无 WebGL | 普通浏览器显示复制成功；受限环境给出手动复制路径；三视口无横向溢出；全屏 1 active + 2 standby；降级仍保留 spec、内容与行动 | CUA、独立 CDP 矩阵与 [`design-contract.md`](design-contract.md) | 未替代真实移动 GPU、系统剪贴板策略与辅助技术人工验收 |
| 断网时是否空白 | 阻断全部非本地 HTTP(S)，复测六个 iframe 代表案例 | Tree、Bloom、Brand、Kage 无错误；Gauges、Toggle 有上游 CDN 请求错误但核心画面仍可见 | 离线逐例截图与像素探针 | 后两项不是完全离线，生产仍应自托管依赖 |
| 依赖与构建安全 | `npm audit --audit-level=low`、`npm run build` | 上一轮成功审计为 0；本轮注册表请求超时无输出；构建通过 | Demo README 的构建记录 | 审计结果会随 advisory 和网络状态更新 |

当前发布构建共转换 240 个模块：主应用 356.77 kB raw / 113.60 kB gzip，共享 CSS 180.29 kB raw / 45.57 kB gzip。Sylva 直接使用同包 authored source 后不再生成原 815.61 kB raw / 215.53 kB gzip wrapper；Text Path 为 27.41 kB gzip、Sketchbook 为 15.34 kB gzip。Gallery 仍达到 1,131.99 kB gzip，Koi 页面另含约 16.8 MB 内嵌媒体 HTML。这些数据再次证明“可运行”不等于“适合默认首屏”，必须继续使用 lazy、单实例调度和页面预算。

浏览器控制台没有应用错误；逐例稳定等待没有网络失败。完整快速切换矩阵在离开 Performance Gauges 时记录 3 个未完成 Iconify 装饰图标请求被主动终止。Headless Chromium 还报告 WebGL `ReadPixels` stall；Gauges 与 Skeuomorphic Toggle 的上游 iframe 原作报告 Tailwind CDN / GSAP target 警告，Kage 报告同源脚本沙箱组合警告。断网测试证明前两项会丢失远程增强但不会变成空白，也说明完整 HTML 资产离生产级自托管和依赖治理仍有距离。

## 优点与局限

### 优点

- 一个目录覆盖多种浏览器渲染技术，避免团队把“高级视觉”误等同于 Three.js。
- Community 源码、npm、类型声明、资源许可证和按组件入口共同降低复用成本。
- 多数实时组件已经包含 resize、离屏暂停和资源释放，比直接复制 CodePen 更接近可集成状态。
- 参数模型天然适合设计工具、Agent 或配置面板调用。

### 局限

- 它主要管理视觉组件，不负责业务信息架构、内容策略和完整网站生成。
- 组件质量与性能不是天然一致；不同效果可能依赖 Raw WebGL、`three128`、`three165`、当前 peer `three` 或完整 HTML 资产。
- 当前两套 Three.js 共享生产块为 `443.15 / 506.56 kB`（gzip `113.54 / 126.43 kB`），Bookshelf 独立块达到 `1,538.00 kB`（gzip `793.73 kB`），Gallery 更达到 `1,503.44 kB`（gzip `1,131.99 kB`）。虽已懒加载，仍需按场景衡量网络和 GPU 成本。Landscape 与 Tower 本地页面各约 `2.43 MB`，Kage 本地页面及媒体资产约 `3.52 MB`，Koi 单页约 `16.8 MB`。
- 完整 HTML 组件的根路径、iframe 通信、CORS、远程媒体和第三方资产需要额外工程处理。
- README 与同步报告的目录数量不一致，自动化消费者应以机器报告和实际 exports 为准，并固定版本。
- 本研究未购买或验证 Pro，所有结论只覆盖公开 Community 包。

## 可扩展方向

1. **结构化能力协议：** 为每个效果补齐 runtime、cost、input、fallback、content-safety、a11y 与 asset-policy 字段，使 Agent 能可靠选择。
2. **预算化运行时：** 加入包体、首帧、CPU/GPU 时间、显存、DPR 上限和多效果并存预算，而不只显示 FPS。
3. **生成系统适配器：** 把自然语言目标映射到组件 id、变体和参数，再生成可审核的 React 组合代码。
4. **统一降级层：** 为 WebGL/Canvas 效果配套静态海报、低功耗模式、reduced-motion 方案与错误边界。
5. **内容感知组件：** 将标题长度、对比度安全区、交互热点和响应式构图作为参数约束，让效果更容易承载真实业务内容。
6. **版本隔离和依赖治理：** 收敛多 Three.js 版本，或为历史 renderer 明确独立 chunk / worker / iframe 边界。
7. **视觉回归与实机矩阵：** 为关键组件建立固定种子、截图差异、帧时间分位数和移动 GPU 验收。

## 对我们的意义

对你的 Kage / 优秀网页生成研究，ThreeUI 最重要的意义不是“又找到一批炫酷效果”，而是证明高级视觉可以成为生成系统中的结构化、可调用资产。

| 时间尺度 | 对你的具体价值 | 应该吸收什么 | 不应误解为什么 |
| --- | --- | --- | --- |
| 现在 | 用 5 个实际任务把能力分成直接可用、条件可用和受限，不再只按视觉吸引力判断 | Community renderer、公开 API、运行探测和 verdict | 直接把示例或概念组合当成完成的业务页面 |
| 下一阶段 | 建立统一效果注册表，让 Agent 能按真实探测结果查询和选择 | id、runtime、role、inputs、cost、fallback、license、observations、verdict | 收集越多效果，生成质量就自然越高 |
| 长期 | 把审美判断和工程验收转成系统能力 | 内容安全区、设备预算、组合约束、视觉回归和浏览器门禁 | ThreeUI 会自动理解品牌、内容或叙事目标 |

它在整体链路中的位置应当是：

```text
Brief / 业务目标
        ↓ 受众、内容、品牌、设备预算
Kage Planner / 生成与编排
        ↓ 叙事、信息架构、版式、视觉槽位
ThreeUI Registry / 视觉资产层
        ↓ effect id、variant、validated props、runtime、fallback
Browser Quality Gate / 质量验收
        ↓ 可读性、响应式、性能、降级、回归
可交付页面
```

因此行动顺序也很明确：

1. **P0 — 生产资格分级：** 43 个父条目已全部获得运行路径；下一步为每项补首帧、帧时间、移动 GPU、业务数据、a11y、离线与 fallback verdict，区分“可运行”和“可默认上线”。
2. **P1 — 替换为真实 Kage Planner：** 本地 adapter 已证明 Brief → PageSpec → 内容修订 → 三层成品与 JSON；下一步用模型或服务替换关键词提取和固定模板，同时保留同一 schema、视觉槽位、预算与质量门禁。
3. **P2 — 自动重跑浏览器门禁：** 在库升级后重复长文案、移动端、reduced-motion、WebGL 降级、资源失败和帧时间探测。

短期收益是少写一批效果代码；长期收益是把“什么时候该用什么效果，以及怎样证明它真的可用”变成我们的生成系统能力。

## 展示素材

### 封面

![ThreeUI Runtime Atlas 左侧说明视觉 Registry 定位、PageSpec 0.1、48 个实时案例、162 个配置与 43/43 父能力，右侧运行 Liquid Form](assets/cover.webp)

- **画面说明：** 自制 ThreeUI Runtime Atlas 当前发布首屏；左侧给出视觉 Registry 定位、PageSpec 主入口与 48 / 162 / 43/43 的验证状态，右侧直接运行 npm 包中的 Liquid Form 并显示能力检索入口。
- **研究意义：** 同一屏同时呈现系统位置、主操作、能力证据和当前 renderer，避免把视觉素材误解为完整网页生成能力。
- **来源与权利：** 展台代码自制；Liquid Form 来自 ThreeUI Community，MIT。
- **生成或截取日期：** `2026-09-04`

更多素材说明见 [`assets/README.md`](assets/README.md)。

## Web Demo

- 源码：[`apps/003-mengto-threeui/`](../../apps/003-mengto-threeui/)
- 在线地址：<https://yydshly.github.io/0902_codex_project/demos/003-mengto-threeui/>
- 验证边界：完整展示机器报告的 43 个 Community 父条目和 163 个具名变体元数据，并说明本地 npm 包的 103 个公开入口；48 个跨类别案例为 43 / 43 个父条目建立运行路径，提供 162 个可运行配置，并对网页生成链路的 5 个任务做 3 PASS / 2 CONDITIONAL 探测。自动选型覆盖自然语言 Brief、4 种视觉方向、2 种设备和 3 档预算，并输出可编辑、可复制的 `kage.pagespec/0.1`，但仍是本地确定性 adapter。不覆盖 Pro，也不等于通用 AI 规划或逐一验证 163 个变体的生产性能。

## 来源与相关链接

- [上游仓库](https://github.com/MengTo/threeui)
- [固定基线 README](https://github.com/MengTo/threeui/blob/68802d5428071ada5c20db8094b1649e6bb770ed/README.md)
- [npm 包定义与 exports](https://github.com/MengTo/threeui/blob/68802d5428071ada5c20db8094b1649e6bb770ed/package.json)
- [Community 同步报告](https://github.com/MengTo/threeui/blob/68802d5428071ada5c20db8094b1649e6bb770ed/public/community-sync-report.json)
- [第三方声明](https://github.com/MengTo/threeui/blob/68802d5428071ada5c20db8094b1649e6bb770ed/THIRD_PARTY_NOTICES.md)
- [资产许可证](https://github.com/MengTo/threeui/blob/68802d5428071ada5c20db8094b1649e6bb770ed/ASSET-LICENSES.md)

## 变更记录

- `2026-09-04`：收束最终理解并完成公开发布。研究首页增加本质、能力、原理、场景、扩展和项目意义的一屏结论；Web 首屏改为“视觉 Registry → PageSpec 主入口 → 证据 → 实时 renderer”，补充 skip link、canonical、Open Graph 与 Twitter 元数据，更新 1440×900 封面和根目录项目卡。提交 `e100b04` 已推送到 `origin/main`，GitHub Pages run `33855715630` 成功；公开页面、目录、封面与代表性同源素材 HTTP 200，公网 `Release Atlas → PageSpec R02.0`、48 个 Live tab、单活动 renderer、零横向溢出与零 console error 通过。
- `2026-09-04`：把固定 brief 选择器升级为 `自然语言 Brief → PageSpec → 可编辑成品 → JSON`。用 `Aurora Field` 真实需求验证品牌/受众/目标提取、三层 slot、内容实时预览与 `R02.1` 保存；普通浏览器复制成功，受限剪贴板有手动恢复。重跑 1280/1024/390px、全屏单实例、reduced-motion、无 WebGL 和 240 模块构建。
- `2026-09-04`：把 Registry 组合结果从工作台内嵌样机升级为全屏成品体验，并增加集成透视；当前页面角色、ThreeUI id、runtime、成本、fallback、选择理由与 DOM/renderer 边界可同步检查。完成焦点接管/恢复、Escape、背景滚动锁、业务跳转退出前景层、四种视口、reduced-motion、无 WebGL、单实例和 240 模块构建验证。
- `2026-09-04`：新增 Registry 自动选型原型，把四类项目 brief、两种设备与三档预算映射为三层视觉组合；结果包含分数、理由、runtime、成本、fallback、预算排除项与 JSON，并用单一真实 renderer 预览后回跳 Live Lab。完成设备差异、轻量预算、键盘、1280/1024/390px、reduced-motion、无 WebGL 与 240 模块构建验证。
- `2026-09-04`：从“继续补数量”转向生产价值优化。Live Lab 增加跨标题、网页角色、运行时、说明和 variant 的检索、命中数、空结果恢复与检索集合内方向键循环；Sylva 直接使用同包 scene-only authored source，保留单 iframe、可见性卸载和参考画布，移除 215.53 kB gzip 的失效 wrapper。
- `2026-09-04`：最后 10 个 `INDEX` 父能力进入 Live Lab，实时案例增至 48、运行配置增至 162、覆盖地图达到 43 LIVE / 0 PARTIAL / 0 INDEX。Text Path 6/6、Shader Buttons 6/6 与八个单例逐项通过；像素复核发现并修复 Spark `params` 黑屏与 Sylva “ready 但只剩雾层”；两份哈希相同的 Sketchbook 素材合并，减少约 8.61 MB 重复发布；重跑 1280/1024/390px 与 reduced-motion。
- `2026-09-04`：清零 7 个 `PARTIAL` 覆盖；Elements 5/5、CRT 4/4、Circle 3/3、Dock 4/4、Brand 23/23、Gauges 4/4、Toggle 4/4 全部现场可选，新增 37 条具名变体路径，累计 142 个运行配置。覆盖地图更新为 33 LIVE / 0 PARTIAL / 10 INDEX，并验证 Circle click、Toggle onChange、单 Brand iframe、三视口和 reduced-motion。
- `2026-09-04`：按 43 个父条目做覆盖差分，实时案例从 32 增至 38；新增 Predictive Arc、Constellation Network、Wireframe Forms、Liquid Metal CTA、Engraved Certificate 与 Temple Night，逐一运行 22 个新增变体；索引升级为 26 LIVE / 7 PARTIAL / 10 INDEX 覆盖地图并支持回跳。Sylva 子场景因当前舞台辨识度不足被真实视觉复核淘汰。
- `2026-09-04`：继续补全成品网页角色，实时案例从 25 增至 32；新增 Editorial Intro、Character Carousel、Energy Globe、Laser Focus、Generate Action、Newsletter Footer 与 Complete Shelf，逐一运行 8 个新增具名变体；验证页尾表单成功态、同源完整页面、三视口和扩容后的分类键盘闭环。
- `2026-09-04`：继续优化并补全，实时案例从 19 增至 25；新增 Structure Flow、Portal Field、Gallery Heading、Diagnostics、Woven Cloth 与 Tower Landscape，逐一验证 35 个新增变体；增加五类筛选和筛选内方向键循环，避免能力增多后查找路径失控。
- `2026-09-04`：继续补全实时能力，从 13 增至 19 项；新增 Warp Field、Landscape、Text Animation、Rectangle CTA、Uplink Loader 和 Bookshelf，以 variant selector 逐一验证 37 个集合变体，并公开 103 个 npm 入口口径与 Bookshelf / Landscape 成本。
- `2026-09-03`：建立研究条目，固定 npm 与源码基线，完成四运行时原理样本、浏览器验证和能力判断。
- `2026-09-03`：根据“只展示四种效果”的反馈扩展为 13 个实时案例、五类能力与 43/163 完整索引，并重跑桌面、移动、键盘、reduced-motion 与无 WebGL 验证。
- `2026-09-03`：根据“内部有的打不开”的反馈改为逐项稳定画面验收；用自包含 Generative Tree 替换近黑且依赖外网的 Constellation，放大并列展示三种 Brand Orb，加入加载/超时/重试状态，并完成在线、离线和故障恢复验证。
- `2026-09-03`：新增页面内“对我们的意义”、四段集成蓝图与 P0/P1/P2 行动顺序；明确 ThreeUI 是 Kage 生成层下游的视觉资产 registry，不是页面生成器本身，并通过 1440/1024/390px 与键盘锚点验证。
- `2026-09-03`：根据“应以产品最终效果为目标”的反馈新增 KAGE STUDIO 四幕组合演示；用 Liquid Form、Circle Buttons、Orbital Sphere、三种 Brand Orbs 与 Semantic Bloom 服务同一产品叙事，并完成导演控制、离屏卸载、移动端、reduced-motion 和无 WebGL 验证。
- `2026-09-03`：根据“真实价值应来自实际使用场景与可扩展探测”的澄清，新增五场景 Application Probe Lab；实际触发内容压力、参数 preset、静态 fallback、宿主 callback 与单实例调度，并把结果分为 2 PASS / 2 CONDITIONAL / 1 LIMITED，公开记录 Gauge 的数据 API 与 CDN 限制。
- `2026-09-03`：根据“用符合我们场景的实际用例展示”的要求，把通用五场景重构为 Brief→Candidate→Brand→Events→Browser Gate→Template 链路；新增三类 brief、品牌 Apply 回执、生成 CTA 交接和真实 DOM audit，并完成 1280/1024/390px、键盘与 fallback 验证。
