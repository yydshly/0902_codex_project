# ThreeUI Runtime Atlas

- 关联研究：[`research/003-mengto-threeui/`](../../research/003-mengto-threeui/)
- 在线地址：<https://yydshly.github.io/0902_codex_project/demos/003-mengto-threeui/>
- 验证目标：先把真实组件接进我们正在研究的优秀网页生成链路——Brief 映射、首屏候选、品牌适配、CTA 接线、浏览器质量门禁与 Kage 模板迁移；再用 48 个实时案例覆盖从视觉层到预测决策、关系网络、内容结构、关键行动、可信凭证和完整场景的能力广度，并提供机器报告中 43 个 Community 父条目、163 个具名变体的完整覆盖地图。
- 原理层：用 Raw WebGL、Canvas 2D、Three.js、DOM/CSS/SVG 与 sandboxed iframe 解释多种效果如何被统一包装成 React 资产。
- 不覆盖：ThreeUI Pro、103 个公开入口的逐一生产性能背书、全部移动 GPU，以及从业务需求自动生成完整网站。当前 48 个案例提供 162 个可运行配置；43 个目录父条目都有现场路径，但 `LIVE` 只表示登记能力可运行，不等同于生产性能或业务接线认证。

## 最终定位

ThreeUI 是可复用视觉实现的资产库与交付系统，不是页面生成器。这个 Demo 将它进一步整理为带 `role / runtime / cost / fallback / verdict` 的 Registry，并用 `kage.pagespec/0.1` 证明上层可以根据 Brief、设备与预算选择三种页面角色，生成一份可编辑、可全屏检查、可导出 JSON 的三段网页。

```text
Brief → Planner / PageSpec → ThreeUI Registry → Host DOM + Renderer → Browser Quality Gate
```

对我们的直接意义是减少从零复刻高质量视觉的成本；更重要的长期意义是建立“何时选、怎样组合、如何降级、用什么证据验收”的生成系统能力。产品内容、信息架构、业务状态、SEO 与无障碍仍由上层和宿主 DOM 负责。

## 本地运行

```bash
npm ci
npm run dev:local
```

固定访问地址为 <http://127.0.0.1:47311/>。生产构建完成后，也可以用相同地址预览构建产物：

```bash
npm run build
npm run preview:local
```

## 发布

生产构建使用相对 `base: "./"`，因此可在 GitHub Pages 的子路径中加载脚本、分块和同源静态资产。仓库根目录的 `.github/workflows/pages.yml` 会在 `main` 推送后执行完整 `npm run verify`，把聚合后的 `dist/` 发布到 Pages。

```bash
# 在仓库根目录
npm run verify
```

公开地址：<https://yydshly.github.io/0902_codex_project/demos/003-mengto-threeui/>

发布验收至少覆盖：页面与关键同源资产 HTTP 200、标题/description/canonical 正确、`#selector` 可从首屏进入、生成与 Live Lab 主路径可操作、无 Vite overlay 或应用级 console error，以及窄屏无横向溢出。

## 展示内容

实时舞台按需加载以下 48 个案例：

1. Liquid Form
2. Elements Lab（5 种自然机制）
3. Orbital Sphere
4. Circle Controls（3 种操作语义）
5. CRT Collection（4 种屏幕配方）
6. Typography Vortex
7. Generative Tree
8. Semantic Bloom
9. Animated Top Dock（4 种材质）
10. Brand Orbs（23 种品牌资产）
11. Performance Gauges（4 种仪表）
12. Skeuomorphic Toggles（4 种材质）
13. Kage Landing Page
14. Warp Field（4 种空间形态）
15. Landscape（7 种时间 / 天气状态）
16. Text Animation（4 种文字机制）
17. Rectangle CTA（22 种按钮变体）
18. Uplink Loader
19. Bookshelf
20. Structure Flow（13 种结构与数据场）
21. Portal Field（5 种空间场）
22. Gallery Heading（4 种编辑式排版）
23. Diagnostics（3 种诊断视图）
24. Woven Cloth（4 种材质）
25. Tower Landscape（6 种地域建筑环境）
26. Editorial Intro（语义内容开场）
27. Character Carousel（2 种人物 / 作品浏览方式）
28. Energy Globe（Raw WebGL + Canvas 全球视觉）
29. Laser Focus（5 种聚焦与转场光场）
30. Generate Action（AI 生成动作视觉候选）
31. Newsletter Footer（原生表单与转化页尾）
32. Complete Shelf（完整产品陈列页）
33. Predictive Arc（8 种预测与决策视觉）
34. Constellation Network（8 种关系网络形态）
35. Wireframe Forms（3 种结构原型）
36. Liquid Metal CTA（3 种可回传宿主事件的行动形态）
37. Engraved Certificate（可信凭证视觉）
38. Temple Night（直接运行的 Three.js 沉浸夜景）
39. Bestsellers Showcase（同源完整出版陈列页）
40. Sylva Hero（带真实场景、内容与导航的品牌首屏）
41. Sketchbook Landing（同源作品集整页）
42. Spark Badge（雨幕发光凭证微场景）
43. Text Path Studies（6 种路径文字与形态研究）
44. Shader Buttons（6 种材质化行动按钮）
45. Cylindrical Gallery（Three.js 圆柱作品陈列）
46. Sylva Living World（经宿主恢复的真实自然环境层）
47. Koi Studies（高成本媒体卡片组）
48. Interactive Sketchbook（可缩放、翻页的交互作品册）

本地固定包的 `lib-dist/package-components` 实际包含 103 个公开组件入口。103 个入口包含集合组件和便捷子入口，不等于 103 种互不重复的能力；43 是目录父条目，163 是具名变体，48 是本页实际挂载的案例。48 个案例已映射 43 / 43 个父条目，覆盖地图为 `43 LIVE / 0 PARTIAL / 0 INDEX`。Live Lab 支持按标题、网页角色、运行时、说明和变体检索，再与“全部 / 图形 / 控件 / 文字 / 数据 / 场景”叠加筛选；方向键只在当前命中集合内循环。

完整索引来自固定上游基线的 `community-sync-report.json`，支持关键词搜索、五类筛选、43 项展开、变体/控制键查看和 `LIVE / PARTIAL / INDEX` 覆盖识别。有实时证据的父条目可从卡片直接回跳到对应案例；默认只渲染前 12 张卡片以控制首屏长度，点击“展开全部”后显示 43/43。

## 我们的实际生成用例

`#use-cases` 是本研究的主要价值验证。它把真实 ThreeUI renderer 放进 `Brief → Candidate → Brand → Events → Browser Gate → Template` 工作流，并同时显示运行时实例、公开 API、宿主耦合、已知成本、浏览器观察和有边界的 verdict：

| 实际任务 | 真实组件 | 实际操作 | 探测结论 |
| --- | --- | --- | --- |
| Brief → Hero | Liquid Form + DOM | 选择 AI 产品、创意工作室或研究型产品 brief；切换 Calm/Kinetic、长文案和 fallback | `PASS`：内容、CTA 和 renderer 参数由结构化 brief 同步映射，核心语义不进入 Canvas |
| 品牌适配 | Brand Orbs | 预览 Codex/Figma/React variant，并点击 Apply 写回宿主状态 | `CONDITIONAL`：证明 preset 映射和应用协议；真实项目必须使用自有品牌资产并治理商标 |
| CTA 接线 | Circle Buttons | 切换 play/plus/mail，点击把生成候选送入浏览器验收 | `PASS`：原生 button、ARIA 和 `onClick` 可进入生成、发布或回滚流程 |
| 质量门禁 | Host DOM Audit + Performance Gauges | 读取当前舞台溢出、语义标题、控件和视觉实例 | `PASS`：真实结果来自宿主 DOM；Gauge 只是氛围，其无 value API 的边界仍公开 |
| 模板迁移 | Kage Landing Page | 切换宿主字体与主题 preset | `CONDITIONAL`：能高保真迁移基座，但内容槽位、路由、SEO、数据和焦点仍需治理 |

右侧“当前生成能力协议”把 workflow、brief、场景角色、组件、runtime、preset、appliedBrand、fallback、实例计数、audit 和 verdict 输出为实时 JSON。扩展方向通过可见状态落地：内容安全区压力、品牌 Apply、参数 preset、静态 fallback、宿主 callback、真实 DOM audit、iframe 依赖与单实例离屏调度都已实际运行。

## Registry 自动选型原型

`#selector` 把“ThreeUI 可以作为视觉基座”推进成一条可执行链路。它不是多放一组效果卡片，而是让用户输入约束后，由结构化 registry 返回可解释的三层网页组合：

```text
自然语言 Brief + 视觉方向 + 设备优先级 + 性能预算
                         ↓
本地 Planner adapter：关键词提取 / preset / 固定模板
                         ↓
PageSpec：内容 / 受众 / 目标 / 三层视觉槽位 / fallback
                         ↓
可编辑三段式网页 ⇄ 单项检查 → JSON / Live Lab
```

- 自然语言 Brief 会提取品牌、受众和行动目标，并与 AI 产品、创意工作室、研究型产品、自然品牌四种视觉方向共同生成 `kage.pagespec/0.1`。
- PageSpec 摘要、三段宿主 DOM、视觉 slot 与机器 JSON 读取同一份状态；编辑 Hero、系统层或行动层内容时可实时预览，保存只增加内容修订号，不重新选择 renderer。
- Brief 草稿与已应用 PageSpec 明确分离；输入变化先显示 dirty 状态，只有点击编译才创建新 revision。复制 JSON 提供成功或失败恢复反馈。
- 两种设备优先级和轻量 / 均衡 / 沉浸三档预算会真实改变候选；例如创意工作室在移动端选择 Gallery Heading，在桌面沉浸档选择 Sketchbook。
- 每次结果显示按层匹配分、选择理由、runtime、已知成本、fallback 和被预算排除的重型候选，并输出机器可读 JSON。
- 默认“组合成品”把三项推荐分别放进 Hero、系统说明与行动收束；页面内导航和滚动位置会同步当前段。
- “全屏体验”把同一个生成结果提升为独立产品前景层，而不是放大截图：背景滚动被锁定，焦点进入前景层，三段页面保持可滚动，按钮或 `Escape` 退出后焦点回到触发点。
- “集成透视”在成品内部同步当前页面角色、组件 id、runtime、实测成本、fallback 和选择理由，并直接标出 `HOST DOM / PRODUCT CONTENT` 与 `THREEUI / VISUAL LAYER` 的边界。
- Hero 新增 43 个已验证父能力、单活动 renderer 与 DOM fallback 三项工程证据；它们来自当前研究记录，不伪造客户、转化率或业务数据。
- “单项检查”保留独立组件、理由、runtime、成本和 fallback 视图；点击推荐卡会直接进入对应单项。
- 三个页面槽位任意时刻只激活一个真实 ThreeUI renderer，其余两段显示静态待机层；候选支持方向键循环，页面操作可回到相同能力的 Live Lab。
- 评分明确来自固定的本地规则与 1.2.0 探测数据，不冒充 AI 推理、真实用户效果或生产性能遥测。

## 组合成品演示

`#product-demo` 保留为次级组合案例：以概念产品 **KAGE STUDIO** 为同一个目标，组合成一段四幕产品叙事。它证明“可以形成一致体验”，但实际可用性结论以前面的场景探测台为准：

| 幕 | 产品任务 | 真实 ThreeUI 能力 |
| --- | --- | --- |
| Signal | 建立第一眼品牌信号与进入动作 | Liquid Form + Circle Buttons |
| System | 把“生成”解释为可组织的设计系统 | Orbital Sphere |
| Identity | 证明同一系统可以适配不同品牌表达 | 3 × Brand Orbs |
| Proof | 用交付与验证信息收束叙事 | Semantic Bloom |

产品标题、说明、指标、证明项和控制器均为可读 DOM；ThreeUI 只承担视觉表达层。四个语义 tab、方向键、上一幕/下一幕与播放/暂停共享同一个 director 状态，手动操作会接管自动播放。产品名称与数据均明确属于概念演示，不代表已有真实生成后端。

产品舞台离开视口时卸载活动 renderer，只保留轻量 CSS 占位；进入视口才按当前幕加载。`prefers-reduced-motion` 会禁用自动播放并冻结非必要运动；WebGL 不可用时 Signal 与 System 使用静态 CSS 场景，核心产品信息与完整四幕导航仍然保留。

## 对当前研究的意义

页面末尾新增“对我们的意义”与集成蓝图，明确把 ThreeUI 放进当前 Kage / 优秀网页生成研究的正确位置：

```text
Brief → Kage Planner → ThreeUI Registry → Browser Quality Gate
目标约束    页面编排          视觉资产选择        可读性/性能/降级验收
```

- **短期：** 直接用真实 Community renderer 验证视觉方向，减少从零重写 shader、Canvas 或 iframe 迁移代码。
- **中期：** 复用其目录、参数、运行时、资产、许可和验证绑定方式，建立机器可读的效果协议。
- **长期：** 把“选什么、何时用、怎样限制、如何验收”沉淀为生成系统能力；效果数量本身不是壁垒。
- **边界：** Kage 仍负责需求理解、叙事、信息架构和组合，ThreeUI 只负责可调用视觉资产层。

## 构建与验证

```bash
npm audit --omit=dev
npm run build
```

2026-09-04 补全验证结果：

- `npm audit`：上一轮成功审计为 0 个已知漏洞；本轮注册表请求超过 90 秒仍无输出，已停止等待并保留该网络边界。
- TypeScript 与 Vite 生产构建通过，240 个模块被转换。
- Chromium 151：页面 HTTP 200，无 Vite overlay；新增能力的独立干净会话没有应用 console error。
- 48/48 个 tab 均具有运行路径；新增 39–48 经肉眼和 DOM 双重验证达到非空稳定画面并显示“已就绪”，覆盖 Canvas、WebGL、原生 DOM、SVG、srcDoc iframe、URL iframe 和完整页面 iframe。
- 新增集合逐变体验证：Warp 4/4、Landscape 7/7、Text Animation 4/4、Rectangle CTA 22/22；共 37 个选择都能形成 DOM、Canvas 或 iframe 真实表面并进入“已就绪”。
- 第二轮集合逐变体验证：Structure Flow 13/13、Portal Field 5/5、Gallery Heading 4/4、Diagnostics 3/3、Woven Cloth 4/4、Tower Landscape 6/6；新增 35/35，累计 72 个选择均已就绪。
- 第三轮新增七种成品角色全部就绪；Character Carousel 2/2、Globe 1/1、Laser Focus 5/5 逐一运行，累计 80 个具名选择。Newsletter 表单提交后显示 `You're subscribed`，Complete Shelf 从同源本地 HTML 加载。
- 第四轮新增六种实际网页角色全部就绪；Predictive 8/8、Constellation 8/8、Wireframe 3/3、Liquid Metal 3/3 逐一运行，累计 102 个具名选择。Liquid Metal 的 iframe 点击通过 `postMessage` 写回宿主，Sylva 弱画面经视觉复核后替换为 Temple Night。
- 第五轮把 7 个代表接入集合补成完整选择面：Elements 5/5、CRT 4/4、Circle 3/3、Dock 4/4、Brand 23/23、Gauges 4/4、Toggle 4/4，共 47/47 稳定运行；其中新增 37 个此前缺失的具名变体路径，页面累计 142 个可运行配置。Circle `click` 与 Toggle `onChange` 均写回宿主。
- 第六轮新增 10 个原 INDEX 父能力案例；Text Path 6/6 与 Shader Buttons 6/6 逐项切换，连同 8 个单例形成 20 个新配置，累计 162 个运行配置。Spark 原页的 `params` 未定义黑屏与 Sylva 抽取入口“假 ready”均由像素复核发现并在宿主层修复。
- 第七轮没有增加同质案例：Live Lab 新增跨网页角色、运行时和变体的实时搜索，空结果提供可恢复状态；Sylva 改为直接同源 source iframe，移除不产生有效画面的 815.61 kB raw / 215.53 kB gzip 包装块。
- 第八轮新增 Registry 自动选型原型：默认 AI / 移动 / 均衡返回 Liquid Form、Constellation 与 Rectangle CTA；自然品牌 / 桌面 / 沉浸返回 Sylva Living World、Woven Cloth 与 Newsletter Footer；轻量预算会排除 Sylva、Sylva Hero 与 Woven Cloth。
- 第九轮把三项推荐从“一个预览 + 三张卡”编排为可滚动的完整网页。Hero / System / Action 分别运行所选能力，组合成品与单项检查可逆；自然品牌组合已实测为 Sylva Living World → Woven Cloth → Newsletter Footer。
- 第十轮把嵌套样机升级为可独立浏览的成品前景层，并增加集成透视。全屏打开/关闭、背景滚动锁、Escape、焦点恢复、Hero/System/Action 同步、业务跳转退出前景层均已实测；1280×900、1024×820、550×898 和 390×844 无横向溢出，仍保持 1 个活动 renderer 与 2 个待机层。
- 第十一轮把固定 brief 选择器升级为 `自然语言 Brief → PageSpec → 可编辑成品 → JSON`。真实输入 `Aurora Field` 被编译为研究团队与品牌负责人、订阅目标和 Constellation / Predictive Arc / Diagnostics 三层 slot；内容实时编辑后视觉选择不变，保存从 `R02.0` 进入 `R02.1`。普通浏览器剪贴板成功，受限无头环境显示可恢复的手动复制说明。
- 第十一轮矩阵覆盖 1280×900、1024×820、390×844，Planner input、PageSpec 和生成页均无横向溢出；全屏保持 1 个活动 renderer + 2 个 standby。`prefers-reduced-motion: reduce` 与 WebGL 禁用组合下出现可读 fallback，Brief、PageSpec、三段 DOM 和行动仍保留。
- 设备约束已验证为真实输入：创意工作室 / 沉浸在移动端选择 Gallery Heading，在桌面端选择 Sketchbook；研究型产品返回 Constellation、Predictive Arc 与 Diagnostics。候选 `ArrowLeft` 首尾循环、机器 JSON 和 Live Lab 回跳均通过。
- 自动选型工作区及三段生成网页在 1280×900、1024×768 与 390×844 下均无页面、局部或内部滚动区横向溢出；390px 页面导航高 44px、模式按钮高 58px。`prefers-reduced-motion` 保留单一活动 renderer 与完整内容；WebGL 人工拒绝时显示可读 fallback，三段 DOM、导航与行动入口仍在。
- 五类筛选数量为 13 / 7 / 8 / 6 / 14；数据筛选下从 Performance Gauge 按 `ArrowLeft` 会循环到 Constellation，焦点与选中状态同步。
- 新增 Uplink Loader 和 Bookshelf 均达到稳定画面；Bookshelf 暴露可聚焦容器和 7 个书卷选择按钮，键盘事件不会破坏渲染。
- 逐例像素与截图复核发现并修复了旧 Constellation 近黑空态和 Brand Orb 尺寸过小问题；第 7 项现为自包含 Generative Tree，第 10 项改为一个放大品牌实例配合 23 项选择器，避免三个 iframe 并发常驻。
- 完整索引从 12 项摘要展开到 43/43；覆盖统计实测为 43 LIVE / 0 PARTIAL / 0 INDEX；原 INDEX 条目的“运行对应案例”可重置实时筛选、选中对应项并回到 `#live`。
- 三条滑杆更新为 `35 / 1.4× / 284°`，Circle button 点击回执、tab 方向键切换通过。
- 1280×900、1024×768 与 390×844 精确视口通过；三种尺寸页面与舞台横向溢出均为 0，48 项导航在窄屏使用内部滚动区，分类按钮、覆盖徽章和 variant selector 保持可用。
- 新增意义区在 1440、1024 与 390px 下均无横向溢出或文字裁切；桌面键盘可进入“意义”锚点，四段管线在手机上转为纵向顺序。
- KAGE STUDIO 四幕均达到稳定成品画面；Signal/System/Identity/Proof 分别运行 1/1/3/1 个真实 ThreeUI 视觉实例，产品内容与视觉角色同步。
- 我们的生成链路 5/5 场景挂载成功：Brief/Hero 1 Canvas、Brand 1 iframe、CTA 1 原生 button、Quality Gate 1 iframe、Template 1 URL iframe；逐场景无布局溢出。
- 创意工作室 brief 会真实更新标题、正文和 CTA；长文案保留 2 个 CTA；关闭增强后 Canvas 从 1 变为 0。Figma preset 点击 Apply 后出现宿主回执，CTA 点击使交接计数从 `00` 变为 `01`。
- Quality Gate 从 `PENDING` 进入 `PASS`，真实读取当前 DOM 的水平溢出、语义标题、控件和视觉实例；Kage 切换到 Editorial preset 产生可见结果。Gauge 的无 value API 与上游 CDN 边界仍明确保留。
- 实际探测在 390px 下无页面/舞台横向溢出，场景 tab 最小高度约 98px；reduced-motion 与无 WebGL 均自动使用静态增强层，业务标题、控制与 verdict 仍可读取。
- 产品导演的 tab、ArrowRight、Circle button、上一幕/下一幕与 6.5 秒自动播放通过；自动播放可在约 20 秒后停在 Proof，随后显示 `REPLAY STORY`。
- 产品演示在 1440×900 与 390×844 下无横向或舞台溢出；手机四个场景 tab 为 2×2，最小高度 62px。reduced-motion 与无 WebGL 两种降级仍保留产品标题和完整控制。
- reduced-motion 会停止自动导览并冻结可控 renderer；WebGL 失败时显示文本降级界面。
- 故障注入验证：阻断 Kage 后状态从“仍在初始化”进入“重新加载”，恢复请求并点击后回到“已就绪”，页面预载器完成。

离线阻断全部外网请求时，Generative Tree、Semantic Bloom、Brand Orbs 与 Kage 无错误完成；Performance Gauges 和 Skeuomorphic Toggle 的上游 HTML 仍会请求 Tailwind/GSAP CDN，但核心画面保持可见。在线逐例稳定等待没有请求失败；连续快速切换时，离开 Gauges 会终止 3 个尚未完成的 Iconify 装饰图标请求。相关 CDN、GSAP target 与 sandbox 警告仍属于生产集成前需要治理的上游边界。

构建保留按组件分块。当前发布构建的主应用为 356.77 kB raw / 113.60 kB gzip，共享 CSS 为 180.29 kB raw / 45.57 kB gzip；两套兼容 Three.js 共享块约为 113.54 与 126.43 kB gzip。Sylva 直接使用同包 authored source 后不再生成原 815.61 kB raw / 215.53 kB gzip wrapper；Text Path 为 27.41 kB gzip、Sketchbook 为 15.34 kB gzip。Gallery 仍是最大 JS 例外，达到 1,131.99 kB gzip，Koi 页面另有约 16.8 MB 的内嵌媒体 HTML。它们必须按页面角色、网络、GPU 与并发预算选择。

## 实现说明

- `src/App.tsx` 的案例优先按需指向 `@designcodeio/threeui/components/*`，不是自制相似效果；Sylva 这类已确认公开适配器失效的例外直接使用同包 authored source，并在页面中明确标记恢复边界。
- Atlas、实际探测台与产品组合舞台都只挂载当前所选 renderer；后两者离开视口即卸载，避免多个 WebGL / iframe 场景无意义常驻。
- Registry 使用结构化能力子集和确定性评分函数；本地 Planner adapter 把自然语言 Brief、preset、设备和预算编译为 `kage.pagespec/0.1`。draft 与 applied spec 分离，只有点击生成才创建新 revision；内容编辑只创建 content revision。摘要、三段宿主 DOM、slot 和 JSON 共享该 spec，段落活动状态保证组合区只运行一个 renderer。
- 三个公共滑杆将能量、速度、色相映射为各组件的真实 props。
- 舞台用加载探针和 React error boundary 提供加载、慢初始化、等待舞台可见、失败与重试状态；首次在离屏位置选择高成本组件不会再被误报为加载失败。自动导览会为 Kage 保留 12 秒驻留时间。
- Brand Orbs 仍使用上游组件，由统一 selector 暴露全部 23 种变体；舞台只放大并挂载当前一个 iframe，避免并发渲染三个品牌球。
- Kage 使用上游 `KageLandingPage` 组件，并把包内原始页面及其 16 个依赖文件复制到 `public/landing-pages/`；运行时基于 `document.baseURI` 修正 iframe 路径，兼容子路径发布。
- Landscape 使用上游 `LandscapeScene`，并把包内已发布的 `landscape.html` 放到本地 `public/`；七种 time / weather 查询参数不依赖外部页面。
- Tower Landscape 使用上游 `JapaneseTowerLandscape`，并把包内已发布的 `japanese-tower.html` 放到本地 `public/`；六种 country 查询参数均保持同源。
- Complete Shelf 使用上游 `CompleteShelfLandingPage`，并把包内已发布的 `complete-shelf-v2.html` 放到本地 `public/landing-pages/`；运行时基于 `document.baseURI` 修正 iframe 路径。
- Bestsellers、Sylva Hero 与 Sketchbook Landing 同样使用上游页面组件，再把包内 HTML、字体和图片改为同源路径；Sketchbook Landing 与 Interactive Sketchbook 共享同一套 8.61 MB 作品册资产，避免重复发布。
- Spark Badge 的包内源页遗漏 `URLSearchParams` 初始化，本地同源副本补齐后才从黑屏恢复；这说明 `iframe onLoad` 不能替代像素验收。
- Sylva Living World 的公开抽取适配器会“ready 但只剩雾层”；宿主因此直接加载同包 `scene-only` 资源，用 1600×880 参考画布 cover 缩放，并在离屏或文档隐藏时卸载 iframe。这样保留真实环境层，同时移除无贡献 wrapper 下载。
- Text Path 的部分首帧需约 5 秒生成；舞台健康探针增加最小视觉预热时间，避免在画面仍为空时提前宣告“已就绪”。
- 构建 `base` 为 `./`，可发布到 GitHub Pages 子路径。

## 第三方来源

- [`@designcodeio/threeui@1.2.0`](https://www.npmjs.com/package/@designcodeio/threeui)，Community 代码 MIT。
- [`react@19.2.0`](https://react.dev/) 与 [`three@0.149.0`](https://github.com/mrdoob/three.js)，MIT。
- ThreeUI 包还包含 `three128` / `three165` 兼容运行时。字体、静态素材与第三方代码按包内 `FONT-LICENSES.md`、`ASSET-LICENSES.md` 和 `THIRD_PARTY_NOTICES.md` 处理。
- Demo 没有复制远程缩略图、Pro 代码或 Beta 代码；只复制 npm 包已发布、且当前同源运行所需的 Community 静态资产。
