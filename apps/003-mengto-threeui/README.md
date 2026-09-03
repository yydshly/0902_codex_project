# ThreeUI Runtime Atlas

- 关联研究：[`research/003-mengto-threeui/`](../../research/003-mengto-threeui/)
- 在线地址：<https://yydshly.github.io/0902_codex_project/demos/003-mengto-threeui/>
- 验证目标：先把真实组件接进我们正在研究的优秀网页生成链路——Brief 映射、首屏候选、品牌适配、CTA 接线、浏览器质量门禁与 Kage 模板迁移；再用 13 个实时案例覆盖能力广度，并提供机器报告中 43 个 Community 父条目、163 个具名变体的完整索引。
- 原理层：用 Raw WebGL、Canvas 2D、Three.js、DOM/CSS/SVG 与 sandboxed iframe 解释多种效果如何被统一包装成 React 资产。
- 不覆盖：ThreeUI Pro、每个变体的逐一运行、全部移动 GPU 的生产性能，以及从业务需求自动生成完整网站。

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

## 展示内容

实时舞台按需加载以下 13 个案例：

1. Liquid Form
2. Condensation
3. Orbital Sphere
4. Circle Control
5. CRT Cinema
6. Typography Vortex
7. Generative Tree
8. Semantic Bloom
9. Animated Top Dock
10. Brand Orbs
11. Performance Gauges
12. Skeuomorphic Toggle
13. Kage Landing Page

完整索引来自固定上游基线的 `community-sync-report.json`，支持关键词搜索、五类筛选、43 项展开和变体/控制键查看。默认只渲染前 12 张卡片以控制首屏长度，点击“展开全部”后显示 43/43。

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

2026-09-03 验证结果：

- `npm audit`：0 个已知漏洞。
- TypeScript 与 Vite 生产构建通过，121 个模块被转换。
- Chromium 151：页面 HTTP 200，无 Vite overlay 或应用 console error。
- 13/13 个 tab 均达到非空稳定画面并显示“已就绪”；覆盖 Canvas、WebGL、原生 DOM、SVG、srcDoc iframe 和完整 Kage iframe。
- 逐例像素与截图复核发现并修复了旧 Constellation 近黑空态和 Brand Orb 尺寸过小问题；第 7 项现为自包含 Generative Tree，第 10 项同时展示 3 个放大品牌变体。
- 完整索引从 12 项摘要展开到 43/43；搜索 `brand` 返回 Brand Orbs；“按钮与控件”筛选返回 6 项。
- 三条滑杆更新为 `35 / 1.4× / 284°`，Circle button 点击回执、tab 方向键切换通过。
- 1440×900 与 390×844 均无横向溢出；手机 tab 实测约 176×66px。
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

构建保留按组件分块。主应用为 261.20 kB raw / 84.63 kB gzip，共享 CSS 为 133.82 kB raw / 37.71 kB gzip；最重的历史 Three.js 共享块约 504.76 kB raw / 125.74 kB gzip，已按需加载。Kage 的本地页面与媒体资产约 3.52 MB，发布前仍应评估网络、GPU 和实例并发成本。

## 实现说明

- `src/App.tsx` 的 13 个 `React.lazy` import 指向 `@designcodeio/threeui/components/*`，不是自制相似效果。
- Atlas、实际探测台与产品组合舞台都只挂载当前所选 renderer；后两者离开视口即卸载，避免多个 WebGL / iframe 场景无意义常驻。
- 三个公共滑杆将能量、速度、色相映射为各组件的真实 props。
- 舞台用加载探针和 React error boundary 提供加载、慢初始化、失败与重试状态；自动导览会为 Kage 保留 12 秒驻留时间。
- Brand Orbs 仍使用上游组件，只由宿主放大三个独立 iframe；完整 23 种变体保留在元数据索引中。
- Kage 使用上游 `KageLandingPage` 组件，并把包内原始页面及其 16 个依赖文件复制到 `public/landing-pages/`；运行时基于 `document.baseURI` 修正 iframe 路径，兼容子路径发布。
- 构建 `base` 为 `./`，可发布到 GitHub Pages 子路径。

## 第三方来源

- [`@designcodeio/threeui@1.2.0`](https://www.npmjs.com/package/@designcodeio/threeui)，Community 代码 MIT。
- [`react@19.2.0`](https://react.dev/) 与 [`three@0.149.0`](https://github.com/mrdoob/three.js)，MIT。
- ThreeUI 包还包含 `three128` / `three165` 兼容运行时。字体、静态素材与第三方代码按包内 `FONT-LICENSES.md`、`ASSET-LICENSES.md` 和 `THIRD_PARTY_NOTICES.md` 处理。
- Demo 没有复制远程缩略图、Pro 代码或 Beta 代码；只随 Kage 组件复制 npm 包已发布的本地 Community 资产。
