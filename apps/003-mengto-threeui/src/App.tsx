import { Component, lazy, Suspense, useEffect, useRef, useState, type CSSProperties, type ErrorInfo, type ReactNode } from "react";
import { CommunityCatalog } from "./CommunityCatalog";

const LiquidFormBackground = lazy(() =>
  import("@designcodeio/threeui/components/LiquidFormBackground").then((module) => ({ default: module.LiquidFormBackground })),
);
const CondensationBackground = lazy(() =>
  import("@designcodeio/threeui/components/CondensationBackground").then((module) => ({ default: module.CondensationBackground })),
);
const OrbitalSphereBackground = lazy(() =>
  import("@designcodeio/threeui/components/OrbitalSphereBackground").then((module) => ({ default: module.OrbitalSphereBackground })),
);
const CircleButtons = lazy(() =>
  import("@designcodeio/threeui/components/CircleButtons").then((module) => ({ default: module.CircleButtons })),
);
const CrtBackground = lazy(() =>
  import("@designcodeio/threeui/components/CrtBackground").then((module) => ({ default: module.CrtBackground })),
);
const TypographyVortexCanvas = lazy(() =>
  import("@designcodeio/threeui/components/TypographyVortexCanvas").then((module) => ({ default: module.TypographyVortexCanvas })),
);
const GenerativeTree = lazy(() =>
  import("@designcodeio/threeui/components/GenerativeTree").then((module) => ({ default: module.GenerativeTree })),
);
const SemanticBloom = lazy(() =>
  import("@designcodeio/threeui/components/SemanticBloom").then((module) => ({ default: module.SemanticBloom })),
);
const AnimatedTopDock = lazy(() =>
  import("@designcodeio/threeui/components/AnimatedTopDock").then((module) => ({ default: module.AnimatedTopDock })),
);
const BrandOrbs = lazy(() =>
  import("@designcodeio/threeui/components/BrandOrbs").then((module) => ({ default: module.BrandOrbs })),
);
const PerformanceGauges = lazy(() =>
  import("@designcodeio/threeui/components/PerformanceGauges").then((module) => ({ default: module.PerformanceGauges })),
);
const SkeuomorphicToggle = lazy(() =>
  import("@designcodeio/threeui/components/SkeuomorphicToggle").then((module) => ({ default: module.SkeuomorphicToggle })),
);
const KageLandingPage = lazy(() =>
  import("@designcodeio/threeui/components/KageLandingPage").then((module) => ({ default: module.KageLandingPage })),
);

type DemoId =
  | "liquid"
  | "condensation"
  | "orbital"
  | "controls"
  | "crt"
  | "vortex"
  | "tree"
  | "bloom"
  | "dock"
  | "brand"
  | "gauges"
  | "toggle"
  | "kage";

type DemoDefinition = {
  id: DemoId;
  index: string;
  title: string;
  runtime: string;
  category: string;
  role: string;
  summary: string;
  principle: string;
  boundary: string;
  interaction: string;
  needsWebGL?: boolean;
};

const DEMOS: readonly DemoDefinition[] = [
  {
    id: "liquid",
    index: "01",
    title: "Liquid Form",
    runtime: "Raw WebGL",
    category: "图形与背景",
    role: "着色器形体",
    summary: "全屏片元着色器把时间、指针与噪声场组合成连续液态金属表面。",
    principle: "CPU 编译 GLSL、更新 uniform；GPU 对画布像素并行计算颜色。没有场景树，也不依赖 Three.js 抽象。",
    boundary: "视觉效率高，但 shader 调试、兼容性与资源释放都由组件自己负责。",
    interaction: "移动指针，观察 shader 的连续响应",
    needsWebGL: true,
  },
  {
    id: "condensation",
    index: "02",
    title: "Condensation",
    runtime: "Canvas 2D",
    category: "图形与背景",
    role: "程序化模拟",
    summary: "水滴在二维画布中生长、下落、合并并形成涟漪，展示非 WebGL 的实时绘制。",
    principle: "JavaScript 在 CPU 上维护水滴状态，requestAnimationFrame 推进模拟，Canvas 2D 完成精灵缓存与合成。",
    boundary: "适合中等数量的二维对象；规模继续增长时，主线程成本会比 GPU 并行方案更明显。",
    interaction: "提高能量，观察水滴数量和合并节奏",
  },
  {
    id: "orbital",
    index: "03",
    title: "Orbital Sphere",
    runtime: "Three.js r128",
    category: "图形与背景",
    role: "三维场景抽象",
    summary: "点云、轨道线和发光节点组成旋转球体，展示 Three.js 场景图与粒子系统。",
    principle: "Three.js 管理 Scene、Camera、BufferGeometry、Material 与 WebGLRenderer，最终仍通过 WebGL 交给 GPU。",
    boundary: "抽象层更易组织复杂场景，但需要管理版本、几何体、材质、像素比和 GPU 生命周期。",
    interaction: "调整能量，观察点尺寸、轨道和光晕",
    needsWebGL: true,
  },
  {
    id: "controls",
    index: "04",
    title: "Circle Control",
    runtime: "DOM + CSS",
    category: "按钮与控件",
    role: "界面微交互",
    summary: "真实 button 语义、SVG 图标和 CSS 光泽构成无需 Canvas 的拟物控件。",
    principle: "DOM 承担交互和语义，CSS 渐变、阴影、滤镜与伪元素构成材质；浏览器合成器处理过渡。",
    boundary: "最适合真实 UI 控件，但复杂粒子、空间变形与大规模像素模拟不属于它的优势。",
    interaction: "点击中央按钮，验证真实 DOM 交互",
  },
  {
    id: "crt",
    index: "05",
    title: "CRT Cinema",
    runtime: "Canvas 2D",
    category: "图形与背景",
    role: "复古显示模拟",
    summary: "扫描线、噪声、偏色与字符内容被封装为可调节的 CRT 视觉背景。",
    principle: "Canvas renderer 读取 variant 配方，把运动、亮度、透明度和色彩参数合成为逐帧显示效果。",
    boundary: "风格辨识度强，但内容可读性和闪烁强度需要按真实页面场景重新校准。",
    interaction: "调整速度与色相，改变屏幕信号质感",
  },
  {
    id: "vortex",
    index: "06",
    title: "Type Vortex",
    runtime: "Canvas 2D",
    category: "文字与品牌",
    role: "文字粒子系统",
    summary: "短语沿环形轨迹卷入中心，文字同时成为信息和运动素材。",
    principle: "组件在 Canvas 中布置字形与粒子，时间推进环增长、吸入与消散，再由参数控制密度和节奏。",
    boundary: "它适合品牌时刻和章节过渡，不适合承载必须稳定阅读的正文。",
    interaction: "提高能量，观察文字环密度与吸入范围",
  },
  {
    id: "tree",
    index: "07",
    title: "Generative Tree",
    runtime: "Canvas iframe",
    category: "图形与背景",
    role: "程序化生长",
    summary: "一棵树由递归分枝和粒子逐步生长，整个原作被收进不依赖外网的 Canvas 沙箱。",
    principle: "组件把完整 HTML 写入 srcDoc，移除统计脚本，并通过 postMessage 控制生长速度、暂停、粒子量和显示滤镜。",
    boundary: "递归形态适合叙事转场和自然主题；真实业务仍需控制生长时长、遮挡和低功耗降级。",
    interaction: "等待枝干生长，调节能量改变尺度和粒子数量",
  },
  {
    id: "bloom",
    index: "08",
    title: "Semantic Bloom",
    runtime: "Canvas iframe",
    category: "文字与品牌",
    role: "语义字形",
    summary: "可编辑文本在放射式构图中成为视觉主体，证明素材不一定来自位图。",
    principle: "组件改写完整 HTML 源码，将语义文本与 Canvas 粒子保留在 srcDoc 中，再通过 postMessage 更新文字、尺寸和暂停状态。",
    boundary: "可编辑文字仍在子文档内；宿主若要读取语义、焦点或选区，需要额外的 iframe 通信设计。",
    interaction: "调整能量，观察字形尺度和层次",
  },
  {
    id: "dock",
    index: "09",
    title: "Animated Dock",
    runtime: "DOM + Canvas",
    category: "按钮与控件",
    role: "导航交互",
    summary: "顶部 Dock 将真实交互区域与玻璃质感、邻近放大和细粒度动效组合。",
    principle: "指针距离驱动每个项目的尺寸与弹簧状态，Canvas/CSS 层提供材质，DOM 继续负责可点击结构。",
    boundary: "强交互组件需要验证触摸、键盘、视口边缘以及宿主导航逻辑。",
    interaction: "把指针移到顶部 Dock，观察邻近响应",
  },
  {
    id: "brand",
    index: "10",
    title: "Brand Orb",
    runtime: "Canvas iframe",
    category: "文字与品牌",
    role: "品牌资产",
    summary: "同一颗动态材质球可以切换为 Codex、Figma、React 等 23 种品牌变体。",
    principle: "组件把品牌模式写入 Canvas 原作的 srcDoc；公共外壳通过 postMessage 控制速度和暂停，并为 iframe 提供无障碍标题。",
    boundary: "品牌标识的视觉复用必须同时遵守对应商标规范，MIT 代码许可不等于商标授权。",
    interaction: "同时展示 Codex、Figma、React；索引可查看全部 23 种",
  },
  {
    id: "gauges",
    index: "11",
    title: "Performance Gauge",
    runtime: "Sandboxed iframe",
    category: "数据与工具",
    role: "仪表可视化",
    summary: "速度表、转速表、增压与功率四套仪表通过统一外壳成为可选变体。",
    principle: "组件从完整来源中锁定目标节点，保留原动画逻辑，再用隔离容器完成裁剪、缩放和主题变换。",
    boundary: "示意仪表不是业务图表库；接入真实数据仍需定义数据模型、单位、范围和状态语义。",
    interaction: "当前展示 tachometer；索引列出其余仪表变体",
  },
  {
    id: "toggle",
    index: "12",
    title: "Skeuo Toggle",
    runtime: "Sandboxed iframe",
    category: "按钮与控件",
    role: "材质开关",
    summary: "玻璃、现代、shader 与拟物开关把孤立作品收敛成统一参数接口。",
    principle: "Neuform 包装器为原始 HTML 选择目标、注入聚焦样式并映射主题和调色参数。",
    boundary: "视觉控件不自动具备业务状态；生产使用时仍要连接表单值、校验和持久化。",
    interaction: "观察完整作品如何被裁成一个可复用控件",
  },
  {
    id: "kage",
    index: "13",
    title: "Kage Landing Page",
    runtime: "Sandboxed iframe",
    category: "整页与场景",
    role: "完整网页作品",
    summary: "Kage 不是单个背景，而是一整个带排版、媒体、滚动与交互叙事的网页模板。",
    principle: "React 只管理 iframe 生命周期和字体/颜色定制，完整 HTML、CSS、JS 与媒体仍在沙盒内部独立运行。",
    boundary: "这是可复用的完成态作品，不是从任意业务需求自动生成新网页的引擎。",
    interaction: "首次启动约 5–10 秒；出现首屏后可在画面内滚动",
  },
];

const ARCHITECTURE = [
  ["Catalog", "元数据描述组件、变体、参数、运行时与资产"],
  ["React host", "挂载 renderer，把参数映射为 props，并控制生命周期"],
  ["Runtime", "DOM/CSS、Canvas 2D、Raw WebGL、Three.js 或 iframe 执行"],
  ["Distribution", "npm、完整源码、SKILL.md 与 Pro CLI/MCP 负责交付"],
] as const;

const MEANING_POINTS = [
  ["NOW / 立即价值", "得到可用性分级", "不是笼统说“这些效果都能用”，而是知道哪些可直接接业务、哪些需要 iframe 治理、哪些当前只能做展示。"],
  ["METHOD / 方法价值", "把探测写进资产协议", "页面角色、参数、实例、fallback、成本和 verdict 可以与组件 id 一起进入 registry，成为下一次选型的真实证据。"],
  ["BOUNDARY / 分工价值", "区分视觉完成与业务完成", "能渲染一个仪表不代表能绑定数据；能嵌入整页不代表拥有路由、SEO、焦点和内容模型。"],
  ["MOAT / 长期价值", "让生成系统基于证据选择", "真正的壁垒是根据内容、设备、预算和历史探测结果选对能力，并自动运行同样的质量门禁。"],
] as const;

const GENERATION_PIPELINE = [
  { step: "01", name: "Brief", owner: "业务输入", detail: "受众 · 内容 · 品牌 · 设备预算", output: "目标与约束" },
  { step: "02", name: "Kage Planner", owner: "生成与编排", detail: "叙事 · 信息架构 · 版式 · 动效节奏", output: "页面蓝图" },
  { step: "03", name: "ThreeUI Registry", owner: "视觉资产层", detail: "effect id · variant · props · runtime · fallback", output: "可运行组件" },
  { step: "04", name: "Browser Quality Gate", owner: "质量验收", detail: "可读性 · 响应式 · 性能 · 降级 · 回归", output: "可交付页面" },
] as const;

const NEXT_MOVES = [
  ["P0", "扩大实际探测矩阵", "把当前 5 个场景的 schema、fallback、实例数和 verdict 扩到其余 13 个代表组件，而不是只补截图。"],
  ["P1", "接入 Kage 选择器", "让页面规划器输出视觉槽位与约束，再由 registry 按已验证 verdict、runtime 和预算返回候选组件。"],
  ["P2", "自动重跑浏览器门禁", "把长文案、移动端、reduced-motion、无 WebGL、资源失败和帧时间探测变成每次组件升级后的回归任务。"],
] as const;

type ProductSceneId = "signal" | "system" | "identity" | "proof";

const PRODUCT_SCENES = [
  {
    id: "signal" as ProductSceneId,
    index: "01",
    tab: "建立信号",
    kicker: "GENERATIVE WEB SYSTEM",
    title: ["Build sites that", "feel directed."],
    body: "KAGE STUDIO 把品牌 brief 转成一套可解释的页面决策：先确定感受、内容层级和节奏，再调用视觉能力。",
    metrics: [["04", "decision layers"], ["13", "validated renderers"]],
    proof: ["Brief-aware", "Human-directed", "Browser-verified"],
    components: "LiquidFormBackground + CircleButtons",
  },
  {
    id: "system" as ProductSceneId,
    index: "02",
    tab: "组织系统",
    kicker: "FROM INTENT TO STRUCTURE",
    title: ["One brief.", "A system of decisions."],
    body: "内容结构、版式、动效和设备预算围绕同一个目标协同。ThreeUI 在这里提供可选择的 renderer，而不是替代页面判断。",
    metrics: [["43", "catalog parents"], ["163", "named variants"]],
    proof: ["Narrative", "Composition", "Runtime budget"],
    components: "OrbitalSphereBackground",
  },
  {
    id: "identity" as ProductSceneId,
    index: "03",
    tab: "适配身份",
    kicker: "ONE SYSTEM · MANY IDENTITIES",
    title: ["Adapt the expression,", "keep the intent."],
    body: "同一套信息架构可以根据品牌、内容和场景选择不同视觉变体；变化的是表达，不变的是阅读目标与质量约束。",
    metrics: [["23", "brand orb modes"], ["05", "runtime families"]],
    proof: ["Codex", "Figma", "React"],
    components: "BrandOrbs × 3",
  },
  {
    id: "proof" as ProductSceneId,
    index: "04",
    tab: "交付证明",
    kicker: "SHIP WITH PROOF",
    title: ["Not a lucky screenshot.", "A verified experience."],
    body: "完成态不止是好看：非空首帧、内容安全区、响应式、动效偏好、资源失败和性能预算都进入浏览器门禁。",
    metrics: [["03", "viewport gates"], ["06", "quality checks"]],
    proof: ["Readable", "Responsive", "Recoverable"],
    components: "SemanticBloom",
  },
] as const;

type UsageScenarioId = "hero" | "brand" | "action" | "data" | "page";
type ProbeVerdict = "PASS" | "LIMITED" | "CONDITIONAL";
type BrandProbeVariant = "codex" | "figma" | "react";
type GaugeProbeVariant = "tachometer" | "speedometer" | "boost" | "power";
type ActionProbeVariant = "play" | "plus" | "mail";
type BriefPreset = "ai-product" | "creative-studio" | "research-platform";

type BriefProfile = {
  label: string;
  mark: string;
  kicker: string;
  title: string;
  body: string;
  primary: string;
  secondary: string;
};

type AuditSnapshot = {
  runs: number;
  overflow: boolean;
  headingCount: number;
  controlCount: number;
  visualCount: number;
};

const BRIEF_PROFILES: Record<BriefPreset, BriefProfile> = {
  "ai-product": {
    label: "AI 产品发布",
    mark: "KAGE / GENERATION 01",
    kicker: "AI PRODUCT · LAUNCH SYSTEM",
    title: "Turn a clear brief into a site with presence.",
    body: "把产品定位、信息层级与视觉角色先写进 brief，再把 ThreeUI renderer 作为可替换的增强层接入。",
    primary: "生成首屏候选",
    secondary: "查看能力协议 →",
  },
  "creative-studio": {
    label: "创意工作室",
    mark: "KAGE / STUDIO 02",
    kicker: "CREATIVE STUDIO · NEW BUSINESS",
    title: "A digital studio should feel authored, not assembled.",
    body: "内容保持可读、可索引，实时材质只负责建立气质与节奏；同一结构可以切换视觉方向而不推翻页面。",
    primary: "生成提案页面",
    secondary: "查看工作方法 →",
  },
  "research-platform": {
    label: "研究型产品",
    mark: "KAGE / RESEARCH 03",
    kicker: "RESEARCH PLATFORM · EVIDENCE FIRST",
    title: "Make the evidence as compelling as the idea.",
    body: "把研究结论、交互证据和能力边界组织成可浏览产品，而不是把技术报告藏在静态文档里。",
    primary: "生成研究展台",
    secondary: "查看验证结果 →",
  },
};

type UsageScenario = {
  id: UsageScenarioId;
  index: string;
  tab: string;
  role: string;
  component: string;
  runtime: string;
  verdict: ProbeVerdict;
  conclusion: string;
  observations: readonly string[];
  extensions: readonly string[];
  coupling: string;
  cost: string;
};

const USAGE_SCENARIOS: readonly UsageScenario[] = [
  {
    id: "hero",
    index: "01",
    tab: "Brief → Hero",
    role: "页面目标 → 首屏候选",
    component: "LiquidForm + DOM",
    runtime: "Raw WebGL + DOM",
    verdict: "PASS",
    conclusion: "Brief 可以确定内容和视觉角色，再把 ThreeUI 参数映射为首屏候选；核心信息始终留在 DOM。",
    observations: ["三个项目 brief 会真实替换标题、正文与 CTA", "Calm / Kinetic 会改变 renderer 参数", "长文案与关闭 WebGL 后核心首屏仍可操作"],
    extensions: ["自然语言 brief → 结构化页面角色", "品牌 token → validated props", "候选截图、评分与版本记录"],
    coupling: "低：React props + DOM overlay",
    cost: "组件 7.63 kB gzip；WebGL runtime 运行成本另计",
  },
  {
    id: "brand",
    index: "02",
    tab: "品牌适配",
    role: "品牌 Token → 视觉 preset",
    component: "BrandOrbs",
    runtime: "Canvas srcDoc iframe",
    verdict: "CONDITIONAL",
    conclusion: "生成器可以预览并应用身份 preset，但现成品牌变体只能证明映射方式，真实项目必须换成自有资产。",
    observations: ["variant prop 即时预览 Codex / Figma / React", "Apply 会把所选 preset 写回宿主状态", "iframe 内部 Canvas 与宿主状态保持隔离"],
    extensions: ["自有品牌资产 registry", "品牌许可、来源与使用范围字段", "poster 与低功耗 preset"],
    coupling: "中：参数可控，渲染隔离",
    cost: "Brand Orbs chunk 42.07 kB gzip + Canvas iframe",
  },
  {
    id: "action",
    index: "03",
    tab: "CTA 接线",
    role: "生成 CTA → 宿主事件",
    component: "CircleButtons",
    runtime: "原生 button + CSS/SVG",
    verdict: "PASS",
    conclusion: "生成页面不能只有画面；标准 button 与 onClick 让生成的主操作真正进入宿主工作流。",
    observations: ["onClick 回调真实更新生成系统交接计数", "variant、disabled、type 与 ariaLabel 均有公开 API", "关闭视觉增强后原生 fallback 仍可触发"],
    extensions: ["接入生成、发布与回滚状态", "设计 token preset", "统一 analytics 与 quality-gate 事件"],
    coupling: "低：标准 React 事件",
    cost: "组件 0.81 kB gzip，无持续渲染循环",
  },
  {
    id: "data",
    index: "04",
    tab: "质量门禁",
    role: "页面候选 → 浏览器验收",
    component: "HostAudit + Gauges",
    runtime: "DOM audit + sandbox iframe",
    verdict: "PASS",
    conclusion: "真正的质量结论来自宿主对当前 DOM 的检查；ThreeUI Gauge 只作为交付氛围，不能伪装成检测数据源。",
    observations: ["运行按钮会读取当前舞台的溢出、标题、控件与视觉实例", "检查结果以可访问 DOM 状态输出", "Gauge 只展示 visual preset，公开 API 仍没有 value 输入"],
    extensions: ["接入 Playwright 多视口检查", "加入性能、对比度与 reduced-motion 预算", "将验收结果写入候选版本记录"],
    coupling: "中：宿主检查可用，Gauge 数据 API 受限",
    cost: "原生 DOM 检查 + 11.85 kB gzip Gauge",
  },
  {
    id: "page",
    index: "05",
    tab: "模板迁移",
    role: "Kage 模板 → 品牌化页面",
    component: "KageLandingPage",
    runtime: "URL sandbox iframe",
    verdict: "CONDITIONAL",
    conclusion: "Kage 可以作为高完成度页面基座，但要进入生成系统，仍需结构化内容槽位、资产治理和 iframe 到原生组件的迁移。",
    observations: ["真实页面保留滚动、媒体与 4 个 Canvas", "宿主可改 heading/body 字体与 primaryColor", "业务路由、SEO、焦点和跨 iframe 状态需要额外桥接"],
    extensions: ["结构化内容槽位与消息协议", "根路径/资源/CDN 自托管", "从 iframe 逐段迁移为原生组件"],
    coupling: "高：资产路径 + iframe bridge",
    cost: "本地页面与媒体约 3.52 MB",
  },
] as const;

type StageHealth = "loading" | "ready" | "slow" | "failed";

type StageErrorBoundaryProps = {
  children: ReactNode;
  onRetry: () => void;
};

type StageErrorBoundaryState = {
  error: string | null;
};

class StageErrorBoundary extends Component<StageErrorBoundaryProps, StageErrorBoundaryState> {
  state: StageErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): StageErrorBoundaryState {
    return { error: error.message || "Renderer 初始化失败" };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("ThreeUI renderer failed", error, info.componentStack);
  }

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <div className="render-fallback render-error" role="alert">
        <span>Renderer error</span>
        <strong>这个案例没有成功启动</strong>
        <p>{this.state.error}</p>
        <button type="button" onClick={this.props.onRetry}>重新加载案例</button>
      </div>
    );
  }
}

function supportsWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl") || canvas.getContext("webgl2"));
  } catch {
    return false;
  }
}

function KageStage({ headingFont = "Georgia", bodyFont = "Arial", primaryColor = "#c8ff5a" }: {
  headingFont?: string;
  bodyFont?: string;
  primaryColor?: string;
} = {}) {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const frame = host.current?.querySelector("iframe");
    const target = new URL("landing-pages/kage.html", document.baseURI).href;
    if (frame && frame.src !== target) frame.src = target;
  }, []);

  return (
    <div className="kage-stage" ref={host}>
      <KageLandingPage headingFont={headingFont} bodyFont={bodyFont} primaryColor={primaryColor} />
    </div>
  );
}

function BrandShowcase({ speed, reducedMotion }: { speed: number; reducedMotion: boolean }) {
  return (
    <div className="brand-showcase" aria-label="三个品牌动态球体变体">
      <div className="brand-orb-cell">
        <BrandOrbs variant="codex" size="medium" mode="dark" speed={speed} paused={reducedMotion} aria-label="Codex 品牌动态球体" />
        <span>CODEX</span>
      </div>
      <div className="brand-orb-cell">
        <BrandOrbs variant="figma" size="medium" mode="dark" speed={speed} paused={reducedMotion} aria-label="Figma 品牌动态球体" />
        <span>FIGMA</span>
      </div>
      <div className="brand-orb-cell">
        <BrandOrbs variant="react" size="medium" mode="dark" speed={speed} paused={reducedMotion} aria-label="React 品牌动态球体" />
        <span>REACT</span>
      </div>
    </div>
  );
}

function ProductBrandField({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <div className="product-brand-field" aria-label="产品身份适配效果">
      <div><BrandOrbs variant="codex" size="medium" mode="dark" speed={0.85} paused={reducedMotion} aria-label="Codex 动态品牌球" /><span>CODEX</span></div>
      <div><BrandOrbs variant="figma" size="medium" mode="dark" speed={0.85} paused={reducedMotion} aria-label="Figma 动态品牌球" /><span>FIGMA</span></div>
      <div><BrandOrbs variant="react" size="medium" mode="dark" speed={0.85} paused={reducedMotion} aria-label="React 动态品牌球" /><span>REACT</span></div>
    </div>
  );
}

function ProductSceneVisual({ id, reducedMotion, webglAvailable, onAdvance }: {
  id: ProductSceneId;
  reducedMotion: boolean;
  webglAvailable: boolean;
  onAdvance: () => void;
}) {
  if (!webglAvailable && (id === "signal" || id === "system")) {
    return <div className={`product-static-visual is-${id}`} aria-hidden="true"><i /><i /><i /></div>;
  }

  if (id === "signal") {
    return (
      <>
        <LiquidFormBackground speed={reducedMotion ? 0 : 0.72} morph={1.12} noiseScale={1.08} mouseAmount={0.18} metal={1.08} tintHue={188} tintAmount={0.32} />
        <div className="product-action-orb">
          <CircleButtons variant="play" mode="dark" hue={22} saturation={1.18} brightness={1.08} ariaLabel="进入产品叙事下一幕" onClick={onAdvance} />
          <span>ENTER THE SYSTEM</span>
        </div>
      </>
    );
  }

  if (id === "system") {
    return <OrbitalSphereBackground speed={reducedMotion ? 0 : 0.58} particleSize={0.015} particleOpacity={0.9} orbitOpacity={0.3} haloOpacity={0.32} scale={1.03} hue={-18} />;
  }

  if (id === "identity") return <ProductBrandField reducedMotion={reducedMotion} />;

  if (reducedMotion) return <div className="product-static-visual is-proof" aria-hidden="true"><i /><i /><i /></div>;
  return <SemanticBloom text="SHIP WITH PROOF" mode="dark" size={0.92} opacity={0.74} />;
}

function ProductCompositionDemo({ reducedMotion }: { reducedMotion: boolean }) {
  const [sceneId, setSceneId] = useState<ProductSceneId>("signal");
  const [playing, setPlaying] = useState(false);
  const [renderRevision, setRenderRevision] = useState(0);
  const [visible, setVisible] = useState(false);
  const [webglAvailable] = useState(supportsWebGL);
  const host = useRef<HTMLDivElement>(null);
  const sceneIndex = PRODUCT_SCENES.findIndex((scene) => scene.id === sceneId);
  const scene = PRODUCT_SCENES[sceneIndex] ?? PRODUCT_SCENES[0];

  useEffect(() => {
    const element = host.current;
    if (!element || typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return undefined;
    }
    const observer = new IntersectionObserver(([entry]) => setVisible(entry?.isIntersecting ?? false), { threshold: 0.14 });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (reducedMotion) setPlaying(false);
  }, [reducedMotion]);

  useEffect(() => {
    if (!playing || reducedMotion || !visible) return undefined;
    if (sceneIndex === PRODUCT_SCENES.length - 1) {
      setPlaying(false);
      return undefined;
    }
    const timer = window.setTimeout(() => setSceneId(PRODUCT_SCENES[sceneIndex + 1].id), 6500);
    return () => window.clearTimeout(timer);
  }, [playing, reducedMotion, sceneIndex, visible]);

  const selectScene = (id: ProductSceneId) => {
    setSceneId(id);
    setPlaying(false);
  };

  const moveScene = (offset: number) => {
    const nextIndex = Math.min(PRODUCT_SCENES.length - 1, Math.max(0, sceneIndex + offset));
    selectScene(PRODUCT_SCENES[nextIndex].id);
  };

  const playStory = () => {
    if (reducedMotion) return;
    if (sceneIndex === PRODUCT_SCENES.length - 1) setSceneId(PRODUCT_SCENES[0].id);
    setPlaying(true);
  };

  return (
    <section className="product-composition" id="product-demo" aria-labelledby="product-demo-title">
      <div className="product-section-heading">
        <div><p>02 / COMPOSED PRODUCT OUTCOME</p><h2 id="product-demo-title">组合演示只是一个案例。<br /><em>真实价值要回到使用探测。</em></h2></div>
        <p>下面是一段明确标注为概念演示的生成式网页产品页。四幕共享同一个产品目标和界面外壳，实际组合 5 种 ThreeUI 能力；视觉服务内容，而不是把内容让位给特效。</p>
      </div>

      <div className="product-frame" ref={host} data-product-scene={scene.id}>
        <header className="product-nav">
          <a href="#product-demo" aria-label="返回 Kage Studio 概念产品演示开头"><span>K</span><strong>KAGE STUDIO</strong></a>
          <div><span>CONCEPT PRODUCT DEMO</span><i /> FOUR-SCENE STORY</div>
          <button type="button" disabled={reducedMotion} aria-pressed={playing} onClick={playing ? () => setPlaying(false) : playStory}>{reducedMotion ? "MOTION OFF" : playing ? "PAUSE STORY" : sceneIndex === PRODUCT_SCENES.length - 1 ? "REPLAY STORY" : "PLAY STORY"}</button>
        </header>

        <div className="product-stage" id="product-demo-stage" role="tabpanel" aria-labelledby={`product-tab-${scene.id}`} aria-live="polite">
          <StageErrorBoundary key={`${scene.id}-${renderRevision}`} onRetry={() => setRenderRevision((revision) => revision + 1)}>
            <Suspense fallback={<div className="product-loading" role="status"><i /> Loading product renderer</div>}>
              {visible ? (
                <ProductSceneVisual id={scene.id} reducedMotion={reducedMotion} webglAvailable={webglAvailable} onAdvance={() => moveScene(1)} />
              ) : (
                <div aria-hidden="true" className={`product-static-visual is-${scene.id}`} />
              )}
            </Suspense>
          </StageErrorBoundary>
          <div className="product-stage-shade" aria-hidden="true" />
          <div className="product-scene-copy">
            <span>{scene.index} / {scene.kicker}</span>
            <h3>{scene.title[0]}<br /><em>{scene.title[1]}</em></h3>
            <p>{scene.body}</p>
            <div className="product-scene-actions">
              <button type="button" onClick={() => sceneIndex === PRODUCT_SCENES.length - 1 ? selectScene("signal") : moveScene(1)}>{sceneIndex === PRODUCT_SCENES.length - 1 ? "回到开场" : "进入下一幕"} <ArrowIcon /></button>
              <span>USES · {scene.components}</span>
            </div>
          </div>
          <dl className="product-metrics">
            {scene.metrics.map(([value, label]) => <div key={label}><dt>{value}</dt><dd>{label}</dd></div>)}
          </dl>
          <ul className="product-proof-list">{scene.proof.map((item) => <li key={item}><i />{item}</li>)}</ul>
        </div>

        <div className="product-director">
          <div className="product-scene-tabs" role="tablist" aria-label="选择产品叙事场景">
            {PRODUCT_SCENES.map((item, index) => (
              <button className="product-scene-tab" key={item.id} id={`product-tab-${item.id}`} type="button" role="tab" aria-selected={item.id === scene.id} aria-controls="product-demo-stage" tabIndex={item.id === scene.id ? 0 : -1} onClick={() => selectScene(item.id)} onKeyDown={(event) => {
                if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
                event.preventDefault();
                const offset = event.key === "ArrowRight" ? 1 : -1;
                const next = PRODUCT_SCENES[(index + offset + PRODUCT_SCENES.length) % PRODUCT_SCENES.length];
                selectScene(next.id);
                window.requestAnimationFrame(() => document.getElementById(`product-tab-${next.id}`)?.focus());
              }}><span>{item.index}</span><strong>{item.tab}</strong></button>
            ))}
          </div>
          <div className="product-director-controls">
            <button type="button" disabled={sceneIndex === 0} onClick={() => moveScene(-1)} aria-label="上一幕">←</button>
            <div className="product-progress" style={{ "--product-progress": `${((sceneIndex + 1) / PRODUCT_SCENES.length) * 100}%` } as CSSProperties}><i /></div>
            <button type="button" disabled={sceneIndex === PRODUCT_SCENES.length - 1} onClick={() => moveScene(1)} aria-label="下一幕">→</button>
          </div>
        </div>
      </div>
    </section>
  );
}

function UsageFallbackVisual({ id }: { id: UsageScenarioId }) {
  return <div className={`usage-fallback-visual is-${id}`} aria-hidden="true"><i /><i /><i /></div>;
}

function UsageScenarioVisual({
  id,
  enhanced,
  stressCopy,
  briefPreset,
  heroPreset,
  brandVariant,
  brandApplied,
  actionVariant,
  gaugeVariant,
  pagePreset,
  actionCount,
  auditSnapshot,
  onAction,
  onBrandApply,
  onAudit,
}: {
  id: UsageScenarioId;
  enhanced: boolean;
  stressCopy: boolean;
  briefPreset: BriefPreset;
  heroPreset: "calm" | "kinetic";
  brandVariant: BrandProbeVariant;
  brandApplied: BrandProbeVariant | null;
  actionVariant: ActionProbeVariant;
  gaugeVariant: GaugeProbeVariant;
  pagePreset: "acid" | "editorial";
  actionCount: number;
  auditSnapshot: AuditSnapshot | null;
  onAction: () => void;
  onBrandApply: () => void;
  onAudit: () => void;
}) {
  if (id === "hero") {
    const brief = BRIEF_PROFILES[briefPreset];
    return (
      <div className={`usage-preview usage-hero-preview${stressCopy ? " is-stress" : ""}`}>
        <div className="usage-render-slot">
          {enhanced ? <LiquidFormBackground speed={heroPreset === "kinetic" ? 1.25 : 0.42} morph={heroPreset === "kinetic" ? 1.28 : 0.72} noiseScale={heroPreset === "kinetic" ? 1.32 : 0.92} mouseAmount={0.2} metal={1.08} tintHue={heroPreset === "kinetic" ? 272 : 184} tintAmount={0.34} /> : <UsageFallbackVisual id={id} />}
        </div>
        <nav aria-label="生成候选页导航"><strong>{brief.mark}</strong><span>Brief&nbsp;&nbsp; System&nbsp;&nbsp; Proof</span></nav>
        <div className="usage-hero-content">
          <span>{brief.kicker}</span>
          <h3>{stressCopy ? `${brief.title} This deliberately extended headline checks whether a generated candidate still protects its content-safe area.` : brief.title}</h3>
          <p>{stressCopy ? `${brief.body} 这是刻意扩展的双语正文压力测试：内容、两个操作与可访问语义都必须留在安全区。` : brief.body}</p>
          <div><button type="button">{brief.primary}</button><button type="button">{brief.secondary}</button></div>
        </div>
        <small>BRIEF MAPPED · DOM FIRST · WEBGL OPTIONAL</small>
      </div>
    );
  }

  if (id === "brand") {
    const brandLabel = brandVariant === "codex" ? "Codex signal" : brandVariant === "figma" ? "Figma craft" : "React system";
    return (
      <div className="usage-preview usage-brand-preview">
        <div className="usage-brand-copy"><span>BRAND ADAPTATION</span><h3>Apply an identity.<br />Keep the page logic.</h3><p>生成器把品牌 token 映射为视觉 preset；宿主仍然拥有内容、权限和业务动作。这里用公开变体证明“预览 → 应用”的接入方式。</p><button type="button" onClick={onBrandApply}>APPLY {brandLabel}</button><output aria-live="polite">{brandApplied ? `宿主已应用 ${brandApplied.toUpperCase()} preset` : "等待把所选 preset 写回候选页"}</output></div>
        <div className="usage-brand-object">
          <div className="usage-render-slot">{enhanced ? <BrandOrbs variant={brandVariant} size="medium" mode="dark" speed={0.82} paused={!enhanced} aria-label={`${brandVariant} 品牌动态球`} /> : <UsageFallbackVisual id={id} />}</div>
          <span>{brandLabel.toUpperCase()}</span><small>PREVIEWED VARIANT / {brandApplied === brandVariant ? "APPLIED" : "UNCOMMITTED"}</small>
        </div>
      </div>
    );
  }

  if (id === "action") {
    return (
      <div className="usage-preview usage-action-preview">
        <div className="usage-action-card">
          <span>GENERATION HANDOFF</span><h3>Make the generated CTA<br />do real work.</h3><p>点击视觉按钮后，外层 React 会接收标准 onClick，并把候选页面送入下一步；这证明效果组件没有切断业务事件。</p>
          <div className="usage-action-row">
            <div><small>HANDOFF EVENTS</small><strong data-action-count>{actionCount.toString().padStart(2, "0")}</strong></div>
            <div className="usage-render-slot">
              {enhanced ? <CircleButtons variant={actionVariant} mode="dark" hue={92} saturation={1.1} brightness={1.08} ariaLabel="把生成候选送入浏览器验收" onClick={onAction} /> : <button className="usage-native-fallback" type="button" onClick={onAction}>SEND</button>}
            </div>
          </div>
          <output aria-live="polite">{actionCount === 0 ? "等待真实 click callback" : `宿主已收到 ${actionCount} 次交接事件`}</output>
        </div>
      </div>
    );
  }

  if (id === "data") {
    const auditPassed = Boolean(auditSnapshot && !auditSnapshot.overflow && auditSnapshot.headingCount > 0 && auditSnapshot.controlCount > 0);
    return (
      <div className="usage-preview usage-data-preview">
        <header><div><span>BROWSER QUALITY GATE / CANDIDATE 03</span><h3>Can this generated page ship?</h3></div><strong data-audit-status={auditSnapshot ? auditPassed ? "pass" : "review" : "pending"}>{auditSnapshot ? auditPassed ? "PASS" : "REVIEW" : "PENDING"}</strong></header>
        <div className="usage-data-grid">
          <div className="usage-gauge-frame"><div className="usage-render-slot">{enhanced ? <PerformanceGauges variant={gaugeVariant} mode="dark" hue={-8} saturation={1.08} brightness={1.02} /> : <UsageFallbackVisual id={id} />}</div><small>VISUAL INDICATOR ONLY · {gaugeVariant.toUpperCase()}</small></div>
          <div className="usage-audit-panel">
            <dl>
              <div><dt>{auditSnapshot ? auditSnapshot.overflow ? "FAIL" : "PASS" : "—"}</dt><dd>水平布局无溢出</dd></div>
              <div><dt>{auditSnapshot?.headingCount ?? "—"}</dt><dd>当前舞台语义标题</dd></div>
              <div><dt>{auditSnapshot?.controlCount ?? "—"}</dt><dd>可操作控件</dd></div>
              <div><dt>{auditSnapshot?.visualCount ?? "—"}</dt><dd>Canvas / iframe 实例</dd></div>
            </dl>
            <button type="button" onClick={onAudit}>RUN CURRENT DOM AUDIT</button>
            <output aria-live="polite">{auditSnapshot ? `第 ${auditSnapshot.runs} 次检查已完成 · ${auditPassed ? "可以进入下一门禁" : "需要修复"}` : "等待读取当前候选页的真实 DOM"}</output>
          </div>
        </div>
        <p className="usage-data-warning"><strong>REAL BOUNDARY</strong> 检查结果来自宿主 DOM；右侧 ThreeUI Gauge 只提供交付氛围，其公开 API 没有 value 输入，不能冒充质量数据源。</p>
      </div>
    );
  }

  return (
    <div className="usage-preview usage-page-preview">
      <div className="usage-page-toolbar"><span>GENERATED TEMPLATE / KAGE SANDBOX</span><strong>{pagePreset === "acid" ? "Acid launch" : "Editorial mono"}</strong></div>
      <div className="usage-render-slot">{enhanced ? <KageStage headingFont={pagePreset === "acid" ? "Georgia" : "Arial"} bodyFont="Arial" primaryColor={pagePreset === "acid" ? "#c8ff5a" : "#f3eee4"} /> : <UsageFallbackVisual id={id} />}</div>
      <div className="usage-page-caption"><span>REAL URL IFRAME</span><p>Kage 负责提供高完成度页面基座；生成系统还要接管结构化内容、路由、SEO、数据、焦点和发布。</p></div>
    </div>
  );
}

function UsageProbeLab({ reducedMotion }: { reducedMotion: boolean }) {
  const [activeId, setActiveId] = useState<UsageScenarioId>("hero");
  const [visualEnabled, setVisualEnabled] = useState(true);
  const [stressCopy, setStressCopy] = useState(false);
  const [briefPreset, setBriefPreset] = useState<BriefPreset>("ai-product");
  const [heroPreset, setHeroPreset] = useState<"calm" | "kinetic">("calm");
  const [brandVariant, setBrandVariant] = useState<BrandProbeVariant>("codex");
  const [brandApplied, setBrandApplied] = useState<BrandProbeVariant | null>(null);
  const [actionVariant, setActionVariant] = useState<ActionProbeVariant>("mail");
  const [gaugeVariant, setGaugeVariant] = useState<GaugeProbeVariant>("tachometer");
  const [pagePreset, setPagePreset] = useState<"acid" | "editorial">("acid");
  const [actionCount, setActionCount] = useState(0);
  const [auditSnapshot, setAuditSnapshot] = useState<AuditSnapshot | null>(null);
  const [visible, setVisible] = useState(false);
  const [renderRevision, setRenderRevision] = useState(0);
  const [telemetry, setTelemetry] = useState({ canvas: 0, iframe: 0, button: 0 });
  const [webglAvailable] = useState(supportsWebGL);
  const host = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const active = USAGE_SCENARIOS.find((item) => item.id === activeId) ?? USAGE_SCENARIOS[0];
  const enhanced = visualEnabled && !reducedMotion && (activeId !== "hero" || webglAvailable);

  useEffect(() => {
    const element = host.current;
    if (!element || typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return undefined;
    }
    const observer = new IntersectionObserver(([entry]) => setVisible(entry?.isIntersecting ?? false), { threshold: 0.08 });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const read = () => {
      const slot = stage.current?.querySelector(".usage-render-slot");
      setTelemetry({
        canvas: slot?.querySelectorAll("canvas").length ?? 0,
        iframe: slot?.querySelectorAll("iframe").length ?? 0,
        button: slot?.querySelectorAll("button").length ?? 0,
      });
    };
    read();
    const timer = window.setInterval(read, 350);
    return () => window.clearInterval(timer);
  }, [activeId, enhanced, visible, renderRevision]);

  const preset = activeId === "hero" ? `${briefPreset} / ${heroPreset}` : activeId === "brand" ? brandVariant : activeId === "action" ? actionVariant : activeId === "data" ? gaugeVariant : pagePreset;
  const manifest = {
    workflow: "brief → candidate → brand → events → browser-gate → template",
    role: active.role,
    component: active.component,
    runtime: active.runtime,
    preset,
    brief: activeId === "hero" ? BRIEF_PROFILES[briefPreset].label : undefined,
    appliedBrand: brandApplied,
    enhancement: enhanced && visible ? "live" : "fallback",
    observed: telemetry,
    audit: activeId === "data" ? auditSnapshot : undefined,
    verdict: active.verdict,
  };

  const runAudit = () => {
    const surface = stage.current;
    if (!surface) return;
    setAuditSnapshot((previous) => ({
      runs: (previous?.runs ?? 0) + 1,
      overflow: surface.scrollWidth > surface.clientWidth,
      headingCount: surface.querySelectorAll("h1, h2, h3").length,
      controlCount: surface.querySelectorAll("button, a, input, select, textarea").length,
      visualCount: surface.querySelectorAll("canvas, iframe").length,
    }));
  };

  const selectScenario = (id: UsageScenarioId) => {
    setActiveId(id);
    setStressCopy(false);
    setRenderRevision((revision) => revision + 1);
  };

  return (
    <section className="usage-lab" id="use-cases" aria-labelledby="use-cases-title">
      <div className="usage-heading">
        <div><p>01 / OUR GENERATION WORKFLOW</p><h2 id="use-cases-title">把视觉能力放进<br /><em>我们的真实工作流。</em></h2></div>
        <p>目标不是继续看素材，而是验证它如何进入“生成优秀网页效果”的链路：Brief 决定页面角色，ThreeUI 提供视觉候选，宿主接管品牌、事件、质量门禁与模板治理。</p>
      </div>

      <ol className="usage-workflow-map" aria-label="我们的页面生成链路">
        <li><span>01</span><strong>BRIEF</strong><small>页面目标</small></li>
        <li><span>02</span><strong>CANDIDATE</strong><small>视觉候选</small></li>
        <li><span>03</span><strong>BRAND</strong><small>身份适配</small></li>
        <li><span>04</span><strong>EVENTS</strong><small>业务接线</small></li>
        <li><span>05</span><strong>BROWSER GATE</strong><small>真实验收</small></li>
        <li><span>06</span><strong>TEMPLATE</strong><small>基座迁移</small></li>
      </ol>

      <div className="usage-shell" ref={host}>
        <div className="usage-scenario-tabs" role="tablist" aria-label="选择实际使用场景">
          {USAGE_SCENARIOS.map((item, index) => (
            <button className="usage-scenario-tab" key={item.id} id={`usage-tab-${item.id}`} type="button" role="tab" aria-selected={activeId === item.id} aria-controls="usage-stage" tabIndex={activeId === item.id ? 0 : -1} onClick={() => selectScenario(item.id)} onKeyDown={(event) => {
              if (event.key !== "ArrowUp" && event.key !== "ArrowDown" && event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
              event.preventDefault();
              const offset = event.key === "ArrowDown" || event.key === "ArrowRight" ? 1 : -1;
              const next = USAGE_SCENARIOS[(index + offset + USAGE_SCENARIOS.length) % USAGE_SCENARIOS.length];
              selectScenario(next.id);
              window.requestAnimationFrame(() => document.getElementById(`usage-tab-${next.id}`)?.focus());
            }}>
              <span>{item.index}</span><span><strong>{item.tab}</strong><small>{item.component}</small></span><em data-status={item.verdict.toLowerCase()}>{item.verdict}</em>
            </button>
          ))}
        </div>

        <div className="usage-workspace">
          <header className="usage-workspace-header"><div><span>USE CASE / {active.index}</span><strong>{active.role}</strong></div><div><small>{active.runtime}</small><i className={visible ? "is-live" : ""} />{visible ? "MOUNTED" : "PAUSED OFFSCREEN"}</div></header>
          <div className="usage-stage" id="usage-stage" ref={stage} role="tabpanel" aria-labelledby={`usage-tab-${active.id}`} data-usage={active.id} data-enhancement={enhanced ? "live" : "fallback"}>
            <StageErrorBoundary key={`${active.id}-${renderRevision}`} onRetry={() => setRenderRevision((revision) => revision + 1)}>
              <Suspense fallback={<div className="product-loading" role="status"><i /> Loading scenario renderer</div>}>
                {visible ? <UsageScenarioVisual id={active.id} enhanced={enhanced} stressCopy={stressCopy} briefPreset={briefPreset} heroPreset={heroPreset} brandVariant={brandVariant} brandApplied={brandApplied} actionVariant={actionVariant} gaugeVariant={gaugeVariant} pagePreset={pagePreset} actionCount={actionCount} auditSnapshot={auditSnapshot} onAction={() => setActionCount((count) => count + 1)} onBrandApply={() => setBrandApplied(brandVariant)} onAudit={runAudit} /> : <UsageFallbackVisual id={active.id} />}
              </Suspense>
            </StageErrorBoundary>
          </div>
          <div className="usage-probe-controls" aria-label="扩展探测控制">
            <div><span>VISUAL LAYER</span><button type="button" aria-pressed={enhanced} onClick={() => setVisualEnabled((enabled) => !enabled)}>{reducedMotion ? "MOTION FALLBACK" : visualEnabled ? "LIVE ENHANCEMENT" : "STATIC FALLBACK"}</button></div>
            {activeId === "hero" ? <><div><span>PROJECT BRIEF</span><select aria-label="项目 Brief" value={briefPreset} onChange={(event) => setBriefPreset(event.target.value as BriefPreset)}>{Object.entries(BRIEF_PROFILES).map(([value, profile]) => <option key={value} value={value}>{profile.label}</option>)}</select></div><div><span>VISUAL DIRECTION</span><select aria-label="Hero 渲染 preset" value={heroPreset} onChange={(event) => setHeroPreset(event.target.value as "calm" | "kinetic")}><option value="calm">Calm editorial</option><option value="kinetic">Kinetic launch</option></select></div><div><span>CONTENT SAFETY</span><button type="button" aria-pressed={stressCopy} onClick={() => setStressCopy((enabled) => !enabled)}>{stressCopy ? "LONG COPY ON" : "RUN LONG COPY"}</button></div></> : null}
            {activeId === "brand" ? <div><span>BRAND PRESET</span><select aria-label="品牌 preset" value={brandVariant} onChange={(event) => setBrandVariant(event.target.value as BrandProbeVariant)}><option value="codex">Codex</option><option value="figma">Figma</option><option value="react">React</option></select></div> : null}
            {activeId === "action" ? <div><span>ACTION VARIANT</span><select aria-label="业务按钮 variant" value={actionVariant} onChange={(event) => setActionVariant(event.target.value as ActionProbeVariant)}><option value="mail">Mail</option><option value="plus">Plus</option><option value="play">Play</option></select></div> : null}
            {activeId === "data" ? <div><span>GAUGE PRESET</span><select aria-label="仪表 preset" value={gaugeVariant} onChange={(event) => setGaugeVariant(event.target.value as GaugeProbeVariant)}><option value="tachometer">Tachometer</option><option value="speedometer">Speedometer</option><option value="boost">Boost</option><option value="power">Power</option></select></div> : null}
            {activeId === "page" ? <div><span>HOST THEME</span><select aria-label="整页宿主主题" value={pagePreset} onChange={(event) => setPagePreset(event.target.value as "acid" | "editorial")}><option value="acid">Acid launch</option><option value="editorial">Editorial mono</option></select></div> : null}
          </div>
        </div>

        <aside className="usage-report" aria-label="当前场景探测报告" data-verdict={active.verdict.toLowerCase()}>
          <div className="usage-verdict"><span>PROBE VERDICT</span><strong>{active.verdict}</strong></div>
          <h3>{active.component}</h3><p>{active.conclusion}</p>
          <dl><div><dt>宿主耦合</dt><dd>{active.coupling}</dd></div><div><dt>已知成本</dt><dd>{active.cost}</dd></div><div><dt>当前实例</dt><dd>{telemetry.canvas} canvas · {telemetry.iframe} iframe · {telemetry.button} button</dd></div></dl>
          <div className="usage-evidence"><span>ACTUAL OBSERVATIONS</span><ul>{active.observations.map((item) => <li key={item}><i />{item}</li>)}</ul></div>
          <div className="usage-extensions"><span>EXTENSION TARGETS</span><ul>{active.extensions.map((item) => <li key={item}>{item}</li>)}</ul></div>
          <details><summary>查看当前生成能力协议</summary><pre>{JSON.stringify(manifest, null, 2)}</pre></details>
        </aside>
      </div>
    </section>
  );
}

function DemoStage({ id, intensity, speed, hue, reducedMotion, onCssAction }: {
  id: DemoId;
  intensity: number;
  speed: number;
  hue: number;
  reducedMotion: boolean;
  onCssAction: () => void;
}) {
  const active = DEMOS.find((demo) => demo.id === id) ?? DEMOS[0];
  const [webglAvailable] = useState(supportsWebGL);

  if (active.needsWebGL && !webglAvailable) {
    return (
      <div className="render-fallback" role="status">
        <span>WebGL unavailable</span>
        <strong>研究内容仍然可读</strong>
        <p>当前浏览器无法创建 WebGL context。其余 Canvas、DOM、SVG 与 iframe 案例仍可继续体验。</p>
      </div>
    );
  }

  return (
    <Suspense fallback={(
      <div className="render-loading" role="status">
        <i />
        <span>正在加载独立 renderer</span>
        <small>重型案例首次打开可能需要数秒</small>
      </div>
    )}>
      {id === "liquid" ? <LiquidFormBackground speed={speed} morph={0.55 + intensity * 0.9} noiseScale={0.8 + intensity * 0.75} mouseAmount={0.12 + intensity * 0.25} metal={0.8 + intensity * 0.5} tintHue={hue} tintAmount={0.34} /> : null}
      {id === "condensation" ? <CondensationBackground speed={speed} dropAmount={0.45 + intensity * 1.15} opacity={0.72 + intensity * 0.26} /> : null}
      {id === "orbital" ? <OrbitalSphereBackground speed={speed} particleSize={0.009 + intensity * 0.012} particleOpacity={0.55 + intensity * 0.4} orbitOpacity={0.14 + intensity * 0.28} haloOpacity={0.1 + intensity * 0.32} scale={0.82 + intensity * 0.32} hue={hue - 220} /> : null}
      {id === "controls" ? (
        <div className="css-control-stage">
          <div className="css-control-copy" aria-hidden="true"><span>SEMANTIC CONTROL</span><strong>DOM is part of the visual system.</strong></div>
          <CircleButtons variant="play" mode="dark" hue={hue - 160} saturation={0.8 + intensity * 0.65} brightness={0.82 + intensity * 0.38} ariaLabel="触发 CSS 按钮交互" onClick={onCssAction} />
        </div>
      ) : null}
      {id === "crt" ? <CrtBackground variant="cinematic" speed={speed} typeSpeed={speed} motion={0.35 + intensity} brightness={0.8 + intensity * 0.35} opacity={1} hue={hue - 196} saturation={0.8 + intensity * 0.4} /> : null}
      {id === "vortex" ? <TypographyVortexCanvas mode="dark" phrase="THREEUI / VISUAL SYSTEM / " speed={speed} ringGrowth={0.7 + intensity * 0.8} opacity={0.8 + intensity * 0.2} dissolveRadius={0.8 + intensity * 0.5} particleAmount={0.65 + intensity * 0.75} /> : null}
      {id === "tree" ? <GenerativeTree speed={Math.max(0.35, speed * 1.7)} size={0.78 + intensity * 0.5} particleAmount={0.75 + intensity * 1.1} opacity={0.85 + intensity * 0.15} hue={hue - 196} saturation={1.1} brightness={0.95 + intensity * 0.35} /> : null}
      {id === "bloom" ? <SemanticBloom text="VISUAL SYSTEM" mode="dark" size={0.72 + intensity * 0.5} opacity={0.62 + intensity * 0.35} /> : null}
      {id === "dock" ? <AnimatedTopDock variant="glass" proximity={100 + intensity * 70} widthGrowth={12 + intensity * 14} heightGrowth={10 + intensity * 16} speed={speed} particles={14 + Math.round(intensity * 22)} /> : null}
      {id === "brand" ? <BrandShowcase speed={speed} reducedMotion={reducedMotion} /> : null}
      {id === "gauges" ? <PerformanceGauges variant="tachometer" mode="dark" hue={hue - 196} saturation={0.9 + intensity * 0.35} brightness={0.85 + intensity * 0.35} /> : null}
      {id === "toggle" ? <SkeuomorphicToggle variant="glass" mode="dark" speed={speed} size={0.8 + intensity * 0.45} opacity={0.78 + intensity * 0.22} hue={hue - 196} saturation={1.1} brightness={1.05} /> : null}
      {id === "kage" ? <KageStage /> : null}
    </Suspense>
  );
}

function ArrowIcon() {
  return <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4 10h11M11 6l4 4-4 4" /></svg>;
}

export function App() {
  const [activeId, setActiveId] = useState<DemoId>("liquid");
  const [intensity, setIntensity] = useState(0.72);
  const [speed, setSpeed] = useState(0.9);
  const [hue, setHue] = useState(196);
  const [touring, setTouring] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const [interactionOverride, setInteractionOverride] = useState<string | null>(null);
  const [stageHealth, setStageHealth] = useState<StageHealth>("loading");
  const [renderRevision, setRenderRevision] = useState(0);
  const active = DEMOS.find((demo) => demo.id === activeId) ?? DEMOS[0];

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      setReducedMotion(media.matches);
      if (media.matches) setTouring(false);
    };
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!touring) return undefined;
    const timer = window.setTimeout(() => {
      setActiveId((current) => {
        const currentIndex = DEMOS.findIndex((demo) => demo.id === current);
        return DEMOS[(currentIndex + 1) % DEMOS.length].id;
      });
    }, activeId === "kage" ? 12000 : 6500);
    return () => window.clearTimeout(timer);
  }, [activeId, touring]);

  useEffect(() => {
    const startedAt = performance.now();
    setStageHealth("loading");

    const timer = window.setInterval(() => {
      const stage = document.getElementById("live-stage");
      if (!stage) return;

      const elapsed = performance.now() - startedAt;
      const errorFallback = stage.querySelector(".render-error");
      const fallback = stage.querySelector(".render-fallback:not(.render-error)");
      const canvas = stage.querySelector("canvas");
      const iframe = stage.querySelector("iframe");
      const button = stage.querySelector(".css-control-stage button");

      if (errorFallback) {
        setStageHealth("failed");
        window.clearInterval(timer);
        return;
      }

      let ready = Boolean(fallback || button || (canvas && canvas.clientWidth > 80 && canvas.clientHeight > 80));

      if (!ready && iframe instanceof HTMLIFrameElement && iframe.clientWidth > 80 && iframe.clientHeight > 80) {
        if (activeId === "kage") {
          try {
            ready = Boolean(iframe.contentDocument?.querySelector("#pre.done"));
          } catch {
            ready = iframe.closest("[data-state='ready']") !== null && elapsed > 1200;
          }
        } else {
          ready = elapsed > 900;
        }
      }

      if (ready) {
        setStageHealth("ready");
        window.clearInterval(timer);
      } else if (elapsed > 18000) {
        setStageHealth("failed");
        window.clearInterval(timer);
      } else if (elapsed > 4000) {
        setStageHealth("slow");
      }
    }, 250);

    return () => window.clearInterval(timer);
  }, [activeId, renderRevision]);

  const retryActiveDemo = () => setRenderRevision((revision) => revision + 1);

  const selectDemo = (id: DemoId) => {
    setActiveId(id);
    setTouring(false);
    setInteractionOverride(null);
  };

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="返回 ThreeUI Runtime Atlas 顶部"><span className="brand-mark">3</span><span>THREEUI / RUNTIME ATLAS</span></a>
        <nav aria-label="页面导航"><a href="#use-cases">生成用例</a><a href="#live">效果</a><a href="#product-demo">组合</a><a href="#catalog">索引</a><a href="#principle">原理</a><a href="#boundary">边界</a><a href="#meaning">意义</a></nav>
        <a className="repo-link" href="https://github.com/MengTo/threeui" target="_blank" rel="noreferrer">GitHub <ArrowIcon /></a>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow"><span /> OPEN-SOURCE COMMUNITY · V1.2.0</p>
          <h1>四条渲染路径，<br /><em>百种视觉表达。</em></h1>
          <p className="hero-lede">这不是效果收藏页：先看 ThreeUI 如何进入我们的 Brief→候选页→品牌→事件→浏览器门禁→模板迁移链路；再看组合案例、13 个代表能力与 43 / 163 完整索引。</p>
          <dl className="hero-facts">
            <div><dt>43</dt><dd>Community 父条目</dd></div>
            <div><dt>163</dt><dd>具名变体</dd></div>
            <div><dt>13</dt><dd>本页实时案例</dd></div>
          </dl>
        </div>

        <div className="atlas" id="live" aria-label="ThreeUI 组件实时演示">
          <div className="atlas-toolbar">
            <div><span className="toolbar-kicker">LIVE {active.index} / {DEMOS.length}</span><strong>{active.title}</strong></div>
            <div className="toolbar-actions">
              {stageHealth === "failed" ? (
                <button className="stage-health is-failed" type="button" onClick={retryActiveDemo}>重新加载</button>
              ) : (
                <span className={`stage-health is-${stageHealth}`} role="status" aria-live="polite"><i /> {stageHealth === "ready" ? "已就绪" : stageHealth === "slow" ? "仍在初始化" : "正在加载"}</span>
              )}
              <button className={touring ? "tour-button is-active" : "tour-button"} type="button" aria-pressed={touring} disabled={reducedMotion} onClick={() => setTouring((value) => !value)}><span className="tour-dot" /> {reducedMotion ? "动效已暂停" : touring ? "停止导览" : "自动导览"}</button>
            </div>
          </div>

          <div className="render-window" id="live-stage" role="tabpanel" aria-labelledby={`tab-${active.id}`} data-demo={activeId}>
            <StageErrorBoundary key={`${activeId}-${renderRevision}`} onRetry={retryActiveDemo}>
              <DemoStage id={activeId} intensity={intensity} speed={reducedMotion ? 0 : speed} hue={hue} reducedMotion={reducedMotion} onCssAction={() => setInteractionOverride("已收到 click：这是可聚焦、可触发的真实 button")} />
            </StageErrorBoundary>
            <div className="render-grid" aria-hidden="true" />
            <div className="runtime-badge"><span>{active.index}</span>{active.runtime}{reducedMotion ? <span className="motion-status">PAUSED</span> : null}</div>
            <p className="interaction-note"><span>↗</span>{interactionOverride ?? active.interaction}</p>
          </div>

          <div className="atlas-console">
            <div className="demo-tabs" role="tablist" aria-label="选择实时能力案例">
              {DEMOS.map((demo) => (
                <button key={demo.id} id={`tab-${demo.id}`} role="tab" type="button" aria-selected={demo.id === activeId} aria-controls="live-stage" tabIndex={demo.id === activeId ? 0 : -1} onClick={() => selectDemo(demo.id)} onKeyDown={(event) => {
                  if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
                  event.preventDefault();
                  const position = DEMOS.findIndex((item) => item.id === demo.id);
                  const offset = event.key === "ArrowRight" ? 1 : -1;
                  const next = DEMOS[(position + offset + DEMOS.length) % DEMOS.length];
                  selectDemo(next.id);
                  window.requestAnimationFrame(() => document.getElementById(`tab-${next.id}`)?.focus());
                }}>
                  <span>{demo.index}</span><strong>{demo.title}</strong><small>{demo.category}</small>
                </button>
              ))}
            </div>

            <div className="console-meta">
              <div className="active-demo-copy"><span>{active.runtime} · {active.role}</span><p>{active.summary}</p></div>
              <div className="control-strip" aria-label="当前效果参数">
                <label><span>能量 <output>{Math.round(intensity * 100)}</output></span><input type="range" min="0" max="1" step="0.01" value={intensity} onChange={(event) => setIntensity(Number(event.target.value))} /></label>
                <label><span>速度 <output>{speed.toFixed(1)}×</output></span><input type="range" min="0.2" max="2" step="0.1" value={speed} onChange={(event) => setSpeed(Number(event.target.value))} /></label>
                <label><span>色相 <output>{hue}°</output></span><input type="range" min="0" max="360" step="1" value={hue} onChange={(event) => setHue(Number(event.target.value))} /></label>
              </div>
            </div>
          </div>
        </div>
      </section>

      <UsageProbeLab reducedMotion={reducedMotion} />

      <ProductCompositionDemo reducedMotion={reducedMotion} />

      <CommunityCatalog />

      <section className="principle" id="principle" aria-labelledby="principle-title">
        <div className="principle-intro"><p>03 / UNDER THE SURFACE</p><h2 id="principle-title">效果很多，底层仍可归纳为<br />一套统一包装方法。</h2></div>
        <div className="architecture-flow" aria-label="ThreeUI 四层架构">
          {ARCHITECTURE.map(([name, description], index) => <article key={name}><span>0{index + 1}</span><div><small>{name}</small><p>{description}</p></div></article>)}
        </div>
        <div className="principle-detail">
          <article><p className="detail-label">当前案例原理</p><h3>{active.runtime}</h3><p>{active.principle}</p></article>
          <article><p className="detail-label">React 生命周期</p><h3>Mount → Observe → Render → Dispose</h3><p>组件挂载时创建 renderer，尺寸观察负责适配，离屏状态控制暂停，卸载时释放动画和 GPU/Canvas 资源。</p></article>
          <article><p className="detail-label">完整网页兼容</p><h3>Sandboxed iframe</h3><p>无法直接改写的完整 HTML 作品会放入 iframe，通过属性、CSS 注入或 postMessage 与 React 外壳沟通，以保留原始实现。</p></article>
        </div>
      </section>

      <section className="boundary" id="boundary" aria-labelledby="boundary-title">
        <div className="boundary-copy"><p>04 / JUDGMENT</p><h2 id="boundary-title">视觉资产平台，<br />不是网页生成引擎。</h2><p>ThreeUI 擅长把已经完成的视觉作品变成可靠零件。它不会根据业务目标重新设计信息架构，也不会自动生产一个全新的完整体验。</p><a href="https://github.com/MengTo/threeui" target="_blank" rel="noreferrer">查看上游源码 <ArrowIcon /></a></div>
        <div className="boundary-matrix">
          <article><span>它擅长</span><strong>复用与交付</strong><p>预览、调参、源码、npm、Skills 与 MCP。</p></article>
          <article><span>它不负责</span><strong>理解与生成</strong><p>需求分析、内容结构、全新视觉策略和跨页面构建。</p></article>
          <article><span>当前案例边界</span><strong>{active.boundary}</strong><p>生产使用仍要在目标设备上测量包体、资源、帧率和降级行为。</p></article>
        </div>
      </section>

      <section className="meaning" id="meaning" aria-labelledby="meaning-title">
        <div className="meaning-intro">
          <div><p>05 / WHAT IT MEANS FOR US</p><h2 id="meaning-title">真正值得带走的，<br /><em>是经过探测的使用能力。</em></h2></div>
          <div className="meaning-thesis"><span>系统定位</span><strong>ThreeUI = 可调用的视觉资产层</strong><p>对你的 Kage / 优秀网页生成研究，它的意义是填上“高级效果怎样被发现、选择、配置和交付”这一层；页面为何这样设计，仍由生成与编排系统决定。</p></div>
        </div>

        <div className="meaning-grid">
          {MEANING_POINTS.map(([label, title, description], index) => (
            <article key={label}><span>0{index + 1}</span><small>{label}</small><h3>{title}</h3><p>{description}</p></article>
          ))}
        </div>

        <div className="integration-blueprint" aria-labelledby="pipeline-title">
          <div className="blueprint-heading"><p>INTEGRATION BLUEPRINT</p><h3 id="pipeline-title">放进我们的生成链路，它只占一层，<br />却是从“会生成”到“效果可复用”的关键接口。</h3></div>
          <ol className="generation-pipeline">
            {GENERATION_PIPELINE.map((item) => (
              <li key={item.step}>
                <span>{item.step}</span><small>{item.owner}</small><strong>{item.name}</strong><p>{item.detail}</p><em>OUT · {item.output}</em>
              </li>
            ))}
          </ol>
        </div>

        <div className="meaning-roadmap">
          <div><p>NEXT / ACTION ORDER</p><h3>我们不需要先重写 ThreeUI，<br />应该先把它变成可被系统调用的能力。</h3></div>
          <ol>
            {NEXT_MOVES.map(([priority, title, description]) => (
              <li key={priority}><span>{priority}</span><div><strong>{title}</strong><p>{description}</p></div></li>
            ))}
          </ol>
        </div>

        <blockquote><span>判断</span><p>短期收益是少写一批效果代码；长期收益是把“什么时候该用什么效果，以及怎样证明它真的可用”沉淀成我们的生成系统能力。</p></blockquote>
      </section>

      <footer><span>003 / MENGTO · THREEUI</span><p>基于 @designcodeio/threeui 1.2.0 的独立研究演示</p><a href="#top">返回顶部 ↑</a></footer>
    </main>
  );
}
