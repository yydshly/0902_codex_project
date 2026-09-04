# ThreeUI 能力与扩展地图

## 一句话架构

ThreeUI 将创意实现封装为四个相互衔接的层：可检索目录负责描述，React host 负责参数与生命周期，renderer 负责实际绘制，npm / 源码 / CLI / Skill 负责交付。

```text
需求或浏览意图
     ↓
Catalog metadata ── id / tags / variants / controls / assets
     ↓
React host ─────── props / refs / effects / observers / fallback
     ↓
Renderer ───────── DOM+CSS | Canvas 2D | Raw WebGL | Three.js | HTML iframe
     ↓
Browser runtime ── layout / compositor | CPU | GPU | network
     ↓
Distribution ───── npm package | copied source | static assets | Pro CLI | SKILL.md
```

本研究在上游四层之外增加了一条产品化调用链：

```text
Natural-language Brief
        ↓ local adapter（可替换为真实 Kage Planner）
kage.pagespec/0.1 ── content / device / budget / three visual slots
        ↓
ThreeUI Registry ─── role / runtime / measured cost / fallback / verdict
        ↓
Host DOM + one active renderer
        ↓
Browser Quality Gate ── responsive / accessibility / fallback / regression
```

这条链路说明“素材可以作为底座”的准确含义：ThreeUI 提供候选 renderer，上层 PageSpec 决定页面目标和槽位，宿主 DOM 保留内容与业务，浏览器门禁负责判断组合结果是否真的可交付。

## 代表能力拆解

| 案例 | 实际底层 | CPU 职责 | GPU / 浏览器职责 | 参数入口 | 清理与暂停 | 典型用途 |
| --- | --- | --- | --- | --- | --- | --- |
| Liquid Form | Raw WebGL + GLSL | 编译/链接 shader，更新 time、mouse、morph 等 uniform | 在全屏四边形上并行计算每个像素 | speed、morph、noiseScale、metal、tint | 离屏停止 rAF；删除 buffer/shader/program | 抽象 Hero、品牌背景、材质研究 |
| Condensation | Canvas 2D | 维护水滴状态、碰撞合并、精灵缓存与涟漪 | Canvas raster / compositor | speed、dropAmount、opacity | 离屏停止 rAF；清空数组和缓存 | 天气、水汽、二维程序动画 |
| Orbital Sphere | Three.js r128 | 生成点集和轨道、更新 group / halo、管理 scene | WebGL 绘制 Points、Lines、Meshes | size、opacity、scale、hue、speed | dispose geometry/material/renderer | 数据地球、网络拓扑、科技视觉 |
| Circle Buttons | React DOM + CSS + SVG | 事件和 props 状态 | 布局、绘制、滤镜、合成与 transition | variant、mode、hue、saturation、brightness | 由 React/DOM 生命周期处理 | 可访问微交互、CTA、控制器 |
| Generative Tree | Canvas 2D + srcDoc iframe | 递归生成枝干、推进生长和粒子状态 | 隔离子文档内的 Canvas raster / compositor | speed、size、particleAmount、opacity、色彩滤镜 | IntersectionObserver、visibility 与 postMessage 暂停 | 自然主题 Hero、章节转场、程序化形态 |
| 完整页面类 | HTML 资产 + iframe / URL | React 外壳和参数桥接 | iframe 内独立执行原实现 | 字体、颜色、排版或 sourceUrl | iframe 生命周期；需额外通信治理 | 高保真整页展示、难拆分遗产作品 |
| Warp Field | Three.js r128 | 回收对象、推进 Z 轴、按 variant 改变密度与形态 | 绘制线、字母、键帽和超空间粒子 | 4 variants、speed、hue | React 卸载 renderer；宿主负责 WebGL fallback | 高速 Hero、开场、章节转场 |
| Landscape | Three.js r149 + URL iframe | 将 variant 映射为 time / weather 查询参数 | 子文档绘制天空、地形、植被与天气粒子 | 7 个环境状态 | iframe 生命周期；本地 HTML 资产 | 空间氛围、天气或时间叙事 |
| Text Animation | DOM + iframe collection | 集合路由到标题解码器或独立字标作品 | DOM layout / iframe Canvas 与 compositor | 4 个文字机制 | React 与 iframe 生命周期 | 编辑标题、品牌开场、字标实验 |
| Rectangle CTA | DOM + iframe collection | 集合路由、事件与 button 状态 | CSS 合成或隔离子文档渲染 | 22 个 CTA variant | React / iframe 生命周期 | 产品 CTA、发布动作、品牌按钮候选 |
| Uplink Loader | Canvas srcDoc iframe | 维护演示计时与加载状态 | 子文档 Canvas 绘制 | 当前无真实 progress API | iframe 生命周期 | 等待、过程与上传状态氛围 |
| Bookshelf | Three.js r165 | 场景、相机、书卷选择和 DOM 状态桥接 | 3D 几何、材质、灯光、OrbitControls | 指针、键盘、选择按钮 | 需处理 GPU 资源和独立 Three.js 版本 | 作品集、空间化内容浏览、3D 产品物体 |
| Structure Flow | Mixed collection | 统一结构、矩阵、拓扑与数据场参数 | Canvas、Three.js 或 iframe 子 renderer | 13 variants、speed、opacity、色彩 | React 卸载当前 variant | 系统叙事、数据背景、技术品牌 Hero |
| Portal Field | Canvas + iframe collection | 统一空间场密度、长度与速度 | 粒子、线场与浏览器合成 | 5 variants、speed、density、hue | React / iframe 生命周期 | 进入动画、章节转场、聚焦提示 |
| Gallery Heading | Sandboxed DOM / Canvas | 选择标题、字体轴、色盘和运动方向 | 子文档排版、Canvas 与 compositor | 4 个排版方向 | iframe 生命周期 | 编辑式章节开场、作品集标题 |
| Diagnostics | Canvas UI iframe | 从完整作品裁取诊断目标并注入主题 | 子文档 Canvas UI | 3 个诊断视图、外观参数 | iframe 生命周期 | 系统状态、诊断氛围、工具界面 |
| Woven Cloth | Shader iframe collection | 选择织物配方并映射品牌色 | 子文档 shader / compositor | 4 个材质、hue、saturation、brightness | iframe 生命周期 | 材质品牌背景、产品特写 |
| Tower Landscape | Three.js r149 + URL iframe | 将 country 映射为同源查询参数 | 子文档绘制地形、天空与建筑形态 | 6 个地域 | iframe 生命周期；本地 HTML | 文化场景原型、地域化环境叙事 |
| Editorial Intro | Semantic DOM + CSS | 输出 section、heading、正文与装置图形 | 布局、SVG/Data URL、合成与 CSS animation | 当前固定内容 | React 生命周期；reduced-motion 停动画 | 内容开场、特性说明、章节引导 |
| Character Carousel | Canvas srcDoc iframe | 路由 filmstrip / wave，桥接速度、尺度与暂停 | 子文档 Canvas 和合成器 | 2 variants、speed、scale、色彩 | IntersectionObserver + postMessage | 团队、角色、作品与 IP 浏览 |
| Energy Globe | Raw WebGL + Canvas 2D | 编译 shader、维护星点、更新 uniform | WebGL 能量球 + Canvas 星场 | speed、scale、smoke、glow、stars、色彩 | Resize/Intersection observer + GPU dispose | 全球网络、覆盖范围、系统视觉锚点 |
| Laser Focus | Canvas + iframe collection | 统一选择五种光场并映射长度、密度与色彩 | Canvas 或隔离 renderer | 5 variants、speed、size、length、density | React / iframe 生命周期 | 章节揭示、聚焦、产品发布转场 |
| Generate Action | Sandboxed DOM / Canvas | 裁取独立生成按钮并注入外观参数 | 子文档布局与合成 | mode、hue、saturation、brightness | iframe 生命周期 | AI 主操作视觉候选 |
| Newsletter Footer | Semantic DOM + CSS | 管理原生表单和本地 success 状态 | 布局、材质与过渡 | email submit | React state；reduced-motion 停动画 | 转化页尾、订阅与品牌收口 |
| Complete Shelf | Sandboxed page iframe | 管理排版定制与同源页面资产 | 子文档独立执行完整页面 | 字体、颜色、排版 | iframe 生命周期；本地 HTML | 产品陈列、目录页、迁移参考 |
| Predictive Arc | Canvas + iframe collection | 在八种预测、像素、信号与半调配方间路由 | Canvas、Raw WebGL 或隔离 renderer | 8 variants、speed、density、色彩 | React / renderer 生命周期 | 趋势、风险、置信度与决策视觉 |
| Constellation Network | Canvas iframe collection | 统一网络形态、密度、线宽与主题 | 隔离子文档中的节点和连线绘制 | 8 variants、density、strokeWidth、hue | iframe 生命周期 | 关系图谱、系统网络与安全态势 |
| Wireframe Forms | Canvas iframe collection | 选择几何配方并映射尺度与密度 | 隔离 Canvas 的线框透视与运动 | cube、cylinders、sphere | iframe 生命周期 | 结构原型、数字孪生、工程封面 |
| Liquid Metal CTA | Sandboxed Canvas + postMessage | 同步文字/尺寸并接收 activate 消息 | iframe 内 Canvas 材质与真实 button | 3 variants、diameter、strokeWidth、text | IntersectionObserver + message cleanup | 高质感关键行动与媒体控制 |
| Engraved Certificate | Sandboxed DOM / Canvas | 裁取凭证作品并注入主题 | 子文档字体、纹理和装饰绘制 | hue、saturation、brightness | iframe 生命周期 | 证书、会员权益、完成证明 |
| Temple Night | Three.js r149 | 管理场景、指针、尺寸、可见性和资源释放 | Canvas 绘制月夜、山体、寺院与雾 | 指针交互 | Resize/Intersection observer + dispose | 目的地、文化内容、沉浸式首屏 |
| Bestsellers Showcase | Sandboxed page iframe | 宿主管理同源资产和页面生命周期 | 子文档执行书籍陈列、排版与切换 | 字体、主色、页面内部导航 | iframe 生命周期；本地 HTML | 出版、课程、产品系列陈列 |
| Sylva Hero | Three.js page iframe | 宿主管理页面容器与同源静态资源 | 子文档绘制自然环境并合成语义内容 | 字体、主色、页面内部交互 | iframe 生命周期；本地 HTML/字体/图片 | 目的品牌、可持续项目、叙事 Hero |
| Sketchbook Landing | Sandboxed page iframe | 宿主管理同源页面与作品册资源 | 子文档执行纸张排版、图像和交互 | 页面内部导航与缩放 | iframe 生命周期；本地资产 | 创作者作品集、案例页、个人站 |
| Spark Badge | Canvas source iframe | 子文档维护雨幕、发光与徽章状态 | Canvas raster / compositor | 当前公共 API 以 source URL 为主 | IntersectionObserver + iframe load | 认证、成就、会员凭证微场景 |
| Text Path Studies | Canvas iframe collection | 六种研究分别计算球体、轮廓、字形云、织物和字符场 | Canvas raster / compositor | 6 variants、scale、opacity、色彩 | iframe 生命周期；慢首帧预热 | 编辑实验、数据球、动态排版背景 |
| Shader Buttons | Shader iframe collection | 六种适配器裁取目标按钮与背景并传递主题参数 | Canvas、WebGL 与浏览器合成 | 6 variants、mode、hue、brightness | iframe 生命周期 | 发布、生成、确认等关键行动候选 |
| Cylindrical Gallery | Three.js r149 | 创建圆柱几何、纹理与逐帧旋转 | WebGL 绘制空间图集 | speed、scale、色彩 | Resize/Intersection observer + dispose | 作品集、商品、媒体空间陈列 |
| Sylva Living World | Three.js source iframe | 宿主绕过失效抽取适配器，直接加载同包 scene-only 源页，并按 1600×880 参考画布缩放 | 子文档绘制苔藓拱门、花粉与蝴蝶 | 当前为宿主恢复路径 | 单 iframe；可见性卸载；固定画布 cover | 自然品牌环境层、Hero 空间增强 |
| Koi Studies | Media-rich iframe | 子文档管理卡片顺序、手势和媒体解码 | Canvas/视频/合成器展示锦鲤研究 | 页面内部拖动与点击 | iframe 生命周期；约 16.8 MB 单页 | 文化叙事、展览、强视觉卡片组 |
| Interactive Sketchbook | Canvas / DOM iframe | 子文档管理页码、缩放、拖动和作品册状态 | Canvas、图像与 DOM 合成 | 翻页、放大、拖动 | iframe 生命周期；同源作品资源 | 创作过程、旅行记录、案例档案 |

## 为什么它不是单纯的组件库

普通组件库重点是 API 稳定和产品 UI 一致性；ThreeUI 还承担视觉作品目录、实时参数面板、源码查看、变体组织、Community/Pro 发布边界和 Agent/CLI 交付。因此更接近一个小型视觉资产平台。

但上游本身没有形成页面生成闭环：目录中的组件不会理解业务目标，不会自动决定信息架构，也不会判断多个强效果是否在视觉上冲突。本 Demo 的 Brief → PageSpec → Registry 只是在这一缺口上建立了确定性前端原型，并没有把能力归因给 ThreeUI。

## 生产集成决策树

```text
需要的是可点击业务控件？ ── 是 → 优先 DOM/CSS
          │ 否
          ↓
二维对象数量和逻辑中等？ ──── 是 → Canvas 2D
          │ 否
          ↓
只是全屏像素/材质计算？ ────── 是 → Raw WebGL shader
          │ 否
          ↓
需要相机、三维物体和场景图？ ── 是 → Three.js
          │ 否
          ↓
原作品难以安全拆分？ ────────── 是 → iframe，但显式接受资产与通信成本
```

## 面向优秀网页生成系统的接口与已实现原型

系统分工应保持清楚：

| 层 | 负责回答 | 输入 | 输出 |
| --- | --- | --- | --- |
| Brief | 为什么做、给谁看、有哪些约束 | 业务目标、受众、内容、品牌、设备预算 | 可执行目标与限制 |
| Kage Planner | 页面应该怎样讲和怎样组织 | 目标、内容与视觉策略 | 信息架构、版式、视觉槽位、动效节奏 |
| ThreeUI Registry | 每个槽位有哪些可靠视觉能力可选 | 页面角色、内容安全区、运行时与预算约束 | 组件 id、变体、validated props、fallback |
| Browser Quality Gate | 组合结果是否真的可交付 | 可运行页面与验收标准 | 可读性、响应式、性能、降级和回归证据 |

这意味着 ThreeUI 的直接价值是 renderer 供给，方法价值是资产协议；我们的差异化应建立在选择、编排和验收，而不是组件数量。

仅有 `id + props` 不足以让 Agent 安全选用高级视觉组件。建议扩展为：

```ts
type VisualCapability = {
  id: string;
  runtime: "dom" | "canvas2d" | "raw-webgl" | "three" | "iframe";
  roles: Array<"hero" | "background" | "cta" | "data" | "transition">;
  inputs: Record<string, ParameterSchema>;
  contentSafeArea: { x: number; y: number; width: number; height: number };
  motion: { canFreeze: boolean; reducedMotionPreset?: string };
  performance: {
    jsGzipKb: number;
    targetFrameMs: number;
    maxDpr: number;
    recommendedConcurrentInstances: number;
  };
  fallbacks: { poster?: string; domDescription: string };
  licenses: Array<{ subject: string; license: string; source: string }>;
};
```

生成系统随后可以执行：

1. 从内容目标和页面角色形成检索条件。
2. 根据设备、性能预算、动效偏好和许可证过滤候选组件。
3. 生成参数映射和内容安全区，而不是仅复制默认示例。
4. 组合页面，并限制同时活跃的 renderer 数量。
5. 在浏览器中验证对比度、遮挡、键盘、响应式、帧时间和降级。

### 已实现的 Registry Selector 原型

页面中的 `#selector` 已把上述接口做成一条可操作路径。当前 registry 子集记录 `layers / affinities / devices / cost / measuredCost / fallback / use / priority`；确定性规则先按预算过滤，再对意图、设备和成本进行评分，分别返回三种页面职责：

| 输出层 | 页面职责 | 当前原型提供的证据 |
| --- | --- | --- |
| Scene anchor | 建立首屏或场景主视觉 | 候选 id、variant、匹配分、真实 renderer 与 DOM 产品文案 |
| System layer | 建立结构、品牌或信息组织方式 | 选择理由、runtime、已知 gzip/资产成本与静态 fallback |
| Action layer | 承接行动、证明或转化 | 原生操作入口、Live Lab 回跳和机器可读 composition |

四类 brief、两种设备与三档预算形成可观察的不同组合。轻量档会排除高成本条目；创意工作室的移动沉浸方案选择 Gallery Heading，桌面沉浸方案选择 Sketchbook。结果还输出 `engine / revision / constraints / composition / excludedByBudget` JSON。

三层结果默认进入同一张三段式网页，而不是继续停留在三张推荐卡：Scene anchor、System layer 和 Action layer 分别驱动 Hero、系统说明和行动收束。核心标题、正文、特性与 CTA 由宿主 DOM 承担；ThreeUI 仅填充每段的视觉槽位。页面导航和内部滚动共同选择活动段，任意时刻只有活动段挂载真实 `DemoStage`，其余两段显示静态待机层。用户可切到“单项检查”查看独立组件，再返回同一个组合计划。

这个原型证明协议与页面编排可以一起执行，但评分、内容模板和组合规则仍是固定本地逻辑，不代表真实 Kage Planner、CMS 或跨项目质量模型。

## 实际使用探测矩阵

能力地图不能只记录“组件支持什么”，还必须记录“接进我们的网页生成链路以后发生什么”。Our Generation Workflow 以真实运行结果补上这一层：

| 页面角色 | 组件与 runtime | 宿主真正可控制 | 实际观察 | Verdict | 进入生产前的扩展 |
| --- | --- | --- | --- | --- | --- |
| Brief → Hero | Liquid Form / Raw WebGL + DOM | 三类 brief 内容、speed、morph、noise、tint、safe-area | 创意工作室 brief、长文案与 fallback 通过；Canvas 1→0、双 CTA 保留 | `PASS` | 自然语言到 schema、候选版本与评分 |
| 品牌适配 | Brand Orbs / Canvas iframe | 23 variant、size、mode、speed、paused、Apply 状态 | Figma preset 可见并写回宿主；宿主不能直接读内部 Canvas | `CONDITIONAL` | 自有品牌 registry、许可字段、iframe bridge |
| CTA 接线 | Circle Buttons / DOM+CSS | variant、ARIA、disabled、type、onClick | 原生 button 触发生成交接计数 00→01 | `PASS` | loading/success/error、发布与 analytics 包装 |
| 浏览器质量门禁 | Host DOM Audit + Performance Gauges | 溢出、标题、控件、实例；4 个 visual variant | DOM audit 从 PENDING→PASS；Gauge 没有 value API，只作氛围 | `PASS` | Playwright 多视口、性能、对比度、版本记录 |
| Kage 模板迁移 | Kage / URL iframe | heading/body 字体、primaryColor | Editorial preset 生效；完整页面与本地资产保留 | `CONDITIONAL` | 内容槽位、路由/SEO/焦点 bridge、原生迁移 |

页面中的实时能力协议将当前场景输出为 `workflow / brief / role / component / runtime / preset / appliedBrand / enhancement / observed / audit / verdict`。这正是上层生成系统可继续扩展的结构：Planner 不只选 effect id，还能基于页面角色、设备预算、fallback 与已验证 verdict 过滤候选项。

### 这次探测改变了什么判断

- 原生 DOM 组件可以直接进入业务状态；iframe visual 只能在其公开消息/API 边界内使用。
- “可换 variant”不等于“可绑定业务数据”。Performance Gauges 的视觉完成度高，但当前业务可用性最低。
- 完整页面 iframe 的价值是高保真迁移和参考，不是自由组合；资产、SEO、路由、焦点与通信成本必须单列。
- WebGL 作为 enhancement 可以成立，前提是必读 DOM、内容安全区、reduced-motion、能力 fallback 与离屏调度共同存在。

## 组合成品验证：KAGE STUDIO

本 Demo 进一步把上述接口落实为一个概念产品案例。四个场景共享产品身份、内容逻辑和 director 状态，不再按“一个组件一张卡”组织：

| 场景 | 页面角色 | Registry 选择 | 上层编排责任 |
| --- | --- | --- | --- |
| Signal | hero + CTA | Liquid Form + Circle Buttons | 决定品牌主张、内容安全区和进入动作 |
| System | explanation background | Orbital Sphere | 把结构视觉映射到“设计决策系统”，保持正文优先 |
| Identity | comparison | 3 × Brand Orbs | 让变体共同证明适配能力，控制实例数量 |
| Proof | outcome + evidence | Semantic Bloom | 用动效收束氛围，用 DOM 给出验证清单 |

实现上，产品文本、指标、证明项和控制均属于 DOM 层；ThreeUI renderer 是可替换的增强层。场景离开视口时卸载 renderer，返回后按当前状态重新挂载。reduced-motion 禁止自动导演，无 WebGL 时以 CSS 静态构图替代两个 GPU 场景。浏览器验证表明四幕均有稳定完成态画面，tab、方向键、Circle button 和自动播放共享同一状态，390px 无横向或舞台溢出。

这个案例提供的是“产品组合可以成立”的证据，不是新产品已经具备真实生成、发布或数据后端的声明。它也说明 ThreeUI 的边界：Registry 提供表达能力，最终成品仍取决于 Planner 的叙事与组合，以及 Quality Gate 的验证。

## 可扩展方向优先级

| 优先级 | 方向 | 为什么重要 | 最小可行实验 |
| --- | --- | --- | --- |
| P0 | 机器可读 runtime / performance / fallback 元数据 | 避免 Agent 只凭标题或截图选错效果 | 为现有 Community 条目补五个字段并做 schema 校验 |
| P0 | 统一静态 fallback 与 reduced-motion preset | 保障可访问性与低端设备 | 每个 WebGL 案例绑定 poster 和 freeze 参数 |
| P1 | 页面角色与内容安全区 | 让视觉组件能承载真实标题、CTA 和导航 | 为 Hero 类组件标注 safe area 并做长文本压力测试 |
| P1 | 视觉预算调度器 | 防止多个 renderer 同时抢占主线程/GPU | IntersectionObserver + 单实例激活队列 |
| P1 | 版本与资产治理 | 多 Three.js 版本、iframe 路径会放大维护成本 | 构建报告列出 runtime chunk、版本和静态资产 |
| P2 | 真实 Planner 与参数生成 | 承接 Kage / 网页生成工作流 | 用 Planner 替换当前确定性评分，并输出可追踪的 id + validated props JSON |
| P2 | 视觉回归与 GPU 实机矩阵 | 解决“在我的机器上很好看”问题 | 固定种子截图 + 三档移动 GPU 帧时间阈值 |

## 本 Demo 的工程取舍

- Atlas 舞台只保留当前案例 renderer；产品舞台只在视口内挂载当前幕，离开视口即卸载，避免多个 GPU renderer 无目的常驻。
- Our Generation Workflow 同样只挂载当前使用场景，并实时报告 Canvas / iframe / button 实例、品牌应用与 DOM audit；它优先于概念组合案例承担可用性判断。
- 对可组件化案例使用独立 `React.lazy` 子路径；Sylva 的失效 wrapper 例外改为 authored source URL。重型 Three.js、iframe 与品牌组件不进入首屏主块。
- 固定 npm 包含 103 个公开组件入口；机器报告中的 43 个父条目和 163 个具名变体全部进入可搜索覆盖地图。实时舞台的 48 个案例映射 43 / 43 个父条目，当前为 43 LIVE / 0 PARTIAL / 0 INDEX；明确区分“公开入口”“父能力运行覆盖”和“生产资格验证”。
- 四个新增集合入口提供真实 variant selector；浏览器逐一运行 Warp 4/4、Landscape 7/7、Text Animation 4/4 与 Rectangle CTA 22/22，共 37 个具名变体均进入稳定 DOM、Canvas 或 iframe 表面。
- 第二轮六个集合继续逐一运行 Structure 13/13、Portal 5/5、Gallery 4/4、Diagnostics 3/3、Woven 4/4 与 Tower 6/6；累计 72 个具名 variant 已实测可见。
- 第三轮围绕成品网页角色新增七项：Character 2/2、Globe 1/1、Laser 5/5 逐一运行，累计 80 个具名 variant。五类筛选扩为 10 / 5 / 7 / 4 / 6；Newsletter 验证原生表单 success 状态，Complete Shelf 使用同源本地页面。
- 第四轮按父能力差分新增六项：Predictive 8/8、Constellation 8/8、Wireframe 3/3、Liquid Metal 3/3 逐一运行，累计 102 个具名 variant；Engraved 与 Temple Night 单例完成视觉复核。索引卡片可回跳对应实时案例。
- 第五轮补齐七个原代表集合：Elements 5/5、CRT 4/4、Circle 3/3、Dock 4/4、Brand 23/23、Gauges 4/4、Toggle 4/4，共 47/47 可选择；新增 37 个此前缺失的具名路径，累计 142 个运行配置。Circle 与 Toggle 保留宿主事件，Brand 改为单 iframe。
- 第六轮接通最后十个父条目：Text Path 6/6、Shader Buttons 6/6 与八个单例新增 20 个配置，累计 162 个运行配置。Spark `params` 黑屏和 Sylva “假 ready”由像素检查发现并在宿主层恢复；Text Path 健康状态增加首帧预热门槛。
- 第七轮把现场发现与成本治理纳入能力协议：48 项 Live Lab 可按标题、网页角色、运行时、说明与 variant 检索并与分类叠加；Sylva 直接使用 authored source，移除没有画面增益的 215.53 kB gzip wrapper，同时保留单实例和离屏卸载。
- 第八轮把 registry 协议变成自动选型工作区：draft 约束与已应用 plan 分离，四类 brief、两种设备和三档预算生成三层组合；当前预览复用 `DemoStage` 且只有一个 renderer，机器 JSON、预算排除、键盘切换和 Live 回跳都是真实状态。
- 第九轮把三层 registry 结果编排为 Hero / System / Action 完整网页，并增加组合成品 / 单项检查双模式。三段各有宿主 DOM 内容和真实视觉槽位，但通过活动段调度只运行一个 renderer；自然品牌沉浸组合实测为 Sylva → Woven → Newsletter。
- 参数面板只抽象能量、速度、色相三个跨案例概念，再映射为每个组件的真实 props。
- 在文字层解释 renderer，即使 Canvas 不可用也不丢失研究内容。
- WebGL 不可用时不给出空白画布；显示原因和可继续体验的替代项。
- 舞台显示加载、慢初始化、等待舞台可见、就绪和失败状态；首次离屏选择不会被误报为失败，真正失败后可重新挂载当前 renderer。
- reduced-motion 下停止自动导览并把实时组件速度设为 0。
- Kage 保留上游完整页面并在 iframe 中运行，本地复制其发布资产，避免把截图冒充整页能力。
- 曾近黑的 Constellation 代表样本已换成上游自包含 Generative Tree；Brand Orbs 使用一个放大实例和 23 项选择器，避免“已挂载但肉眼像空白”以及多 iframe 并发。

## 已观察的成本

生产构建（Vite 7.3.6）输出：

| 文件角色 | Raw size | gzip |
| --- | ---: | ---: |
| 主应用 | 342.73 kB | 109.19 kB |
| Elements collection 入口 | 1.19 kB | 0.48 kB |
| Toggle collection 入口 | 1.52 kB | 0.59 kB |
| Circle Buttons | 1.99 kB | 0.81 kB |
| Condensation | 3.42 kB | 1.75 kB |
| Liquid Form | 7.63 kB | 3.22 kB |
| Brand Orbs | 162.98 kB | 42.08 kB |
| Generative Tree | 24.68 kB | 7.92 kB |
| Neuform Craft shared（含 Gauge / Toggle） | 151.11 kB | 36.64 kB |
| Warp Field | 11.04 kB | 4.24 kB |
| Uplink Loader | 16.62 kB | 5.71 kB |
| Rectangle CTA collection | 26.88 kB | 5.45 kB |
| Woven Cloth | 60.11 kB | 14.53 kB |
| Diagnostics Panel | 347.45 kB | 70.73 kB |
| Generate / Gallery shared isolated bundle | 505.50 kB | 121.09 kB |
| Energy Globe | 7.38 kB | 3.26 kB |
| Laser Variants | 13.03 kB | 4.53 kB |
| Section Elements（Intro / Footer） | 48.14 kB | 16.45 kB |
| Character Carousel | 538.44 kB | 391.02 kB |
| Complete Shelf wrapper | 9.04 kB | 3.28 kB |
| Predictive Arc | 8.01 kB | 2.48 kB |
| Constellation entry | 0.43 kB | 0.29 kB |
| Liquid Metal CTA | 44.75 kB | 16.53 kB |
| Engraved Certificate | 151.32 kB | 36.73 kB |
| Wireframe Forms | 347.45 kB | 70.73 kB |
| Temple Night 入口 | 62.57 kB | 22.47 kB |
| Text Path Studies | 84.81 kB | 27.41 kB |
| Shader Buttons 入口 | 1.42 kB | 0.44 kB |
| Interactive Sketchbook | 47.73 kB | 15.34 kB |
| Cylindrical Gallery | 1,503.44 kB | 1,131.99 kB |
| Three.js 兼容共享块 | 443.15 / 506.56 kB | 113.54 / 126.43 kB |
| Bookshelf | 1,538.00 kB | 793.73 kB |
| 共享 CSS | 165.98 kB | 43.25 kB |
| Landscape 本地 HTML | 2,428.24 kB | 未统一压缩统计 |
| Tower Landscape 本地 HTML | 2,427.10 kB | 未统一压缩统计 |
| Complete Shelf 本地 HTML | 900.30 kB | 未统一压缩统计 |
| Kage 页面与本地媒体资产 | 3,517.14 kB | 未统一压缩统计 |
| Bestsellers 自包含 HTML | 3,546.44 kB | 未统一压缩统计 |
| Sylva HTML + 本地资产 | 1,454.43 kB | 未统一压缩统计 |
| Sketchbook 页面资源（单套） | 8,607.35 kB | 未统一压缩统计 |
| Koi 自包含媒体 HTML | 16,844.02 kB | 未统一压缩统计 |

这些数字说明按组件子路径只是第一步：对于包含独立 Three.js 版本的组件，还需要按需加载、缓存、实例数量和实际设备帧率共同决策。本轮 Sylva 证明另一条规则：当公开 wrapper 的输出已经失效而 authored source 可以同源承载时，不应为了“使用组件入口”继续支付 815.61 kB raw / 215.53 kB gzip 的无贡献成本。
