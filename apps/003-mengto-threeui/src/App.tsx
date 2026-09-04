import { Component, lazy, Suspense, useEffect, useRef, useState, type ComponentType, type CSSProperties, type ErrorInfo, type KeyboardEvent as ReactKeyboardEvent, type ReactNode } from "react";
import { CommunityCatalog } from "./CommunityCatalog";

type MixedCollectionProps = {
  variant?: string;
  mode?: "dark" | "light" | "auto";
  speed?: number;
  scale?: number;
  size?: number;
  particleAmount?: number;
  dropAmount?: number;
  length?: number;
  density?: number;
  opacity?: number;
  hue?: number;
  saturation?: number;
  brightness?: number;
};

const LiquidFormBackground = lazy(() =>
  import("@designcodeio/threeui/components/LiquidFormBackground").then((module) => ({ default: module.LiquidFormBackground })),
);
const ElementsCollection = lazy(() =>
  import("@designcodeio/threeui/components/ElementsCollection").then((module) => ({ default: module.ElementsCollection as ComponentType<MixedCollectionProps> })),
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
const SkeuomorphicToggleCollection = lazy(() =>
  import("@designcodeio/threeui/components/SkeuomorphicToggleCollection").then((module) => ({ default: module.SkeuomorphicToggleCollection })),
);
const KageLandingPage = lazy(() =>
  import("@designcodeio/threeui/components/KageLandingPage").then((module) => ({ default: module.KageLandingPage })),
);
const WarpFieldBackground = lazy(() =>
  import("@designcodeio/threeui/components/WarpFieldBackground").then((module) => ({ default: module.WarpFieldBackground })),
);
const LandscapeScene = lazy(() =>
  import("@designcodeio/threeui/components/LandscapeScene").then((module) => ({ default: module.LandscapeScene })),
);
const TextAnimationCollection = lazy(() =>
  import("@designcodeio/threeui/components/TextAnimationCollection").then((module) => ({ default: module.TextAnimationCollection })),
);
const RectangleButtons = lazy(() =>
  import("@designcodeio/threeui/components/RectangleButtons").then((module) => ({ default: module.RectangleButtons })),
);
const UplinkLoader = lazy(() =>
  import("@designcodeio/threeui/components/UplinkLoader").then((module) => ({ default: module.UplinkLoader })),
);
const BookshelfScene = lazy(() =>
  import("@designcodeio/threeui/components/BookshelfScene").then((module) => ({ default: module.BookshelfScene })),
);
const StructureFlowCollection = lazy(() =>
  import("@designcodeio/threeui/components/StructureFlowCollection").then((module) => ({ default: module.StructureFlowCollection as ComponentType<MixedCollectionProps> })),
);
const PortalFieldCollection = lazy(() =>
  import("@designcodeio/threeui/components/PortalFieldCollection").then((module) => ({ default: module.PortalFieldCollection as ComponentType<MixedCollectionProps> })),
);
const GalleryHeading = lazy(() =>
  import("@designcodeio/threeui/components/GalleryHeading").then((module) => ({ default: module.GalleryHeading })),
);
const DiagnosticsPanel = lazy(() =>
  import("@designcodeio/threeui/components/DiagnosticsPanel").then((module) => ({ default: module.DiagnosticsPanel })),
);
const WovenCloth = lazy(() =>
  import("@designcodeio/threeui/components/WovenCloth").then((module) => ({ default: module.WovenCloth })),
);
const JapaneseTowerLandscape = lazy(() =>
  import("@designcodeio/threeui/components/JapaneseTowerLandscape").then((module) => ({ default: module.JapaneseTowerLandscape })),
);
const EditorialIntroSection = lazy(() =>
  import("@designcodeio/threeui/components/EditorialIntroSection").then((module) => ({ default: module.EditorialIntroSection })),
);
const CharacterCarousel = lazy(() =>
  import("@designcodeio/threeui/components/CharacterCarousel").then((module) => ({ default: module.CharacterCarousel })),
);
const GlobeCollection = lazy(() =>
  import("@designcodeio/threeui/components/GlobeCollection").then((module) => ({ default: module.GlobeCollection })),
);
const LaserCollection = lazy(() =>
  import("@designcodeio/threeui/components/LaserCollection").then((module) => ({ default: module.LaserCollection })),
);
const GenerateButton = lazy(() =>
  import("@designcodeio/threeui/components/GenerateButton").then((module) => ({ default: module.GenerateButton })),
);
const NewsletterFooterSection = lazy(() =>
  import("@designcodeio/threeui/components/NewsletterFooterSection").then((module) => ({ default: module.NewsletterFooterSection })),
);
const CompleteShelfLandingPage = lazy(() =>
  import("@designcodeio/threeui/components/CompleteShelfLandingPage").then((module) => ({ default: module.CompleteShelfLandingPage })),
);
const PredictiveArcCanvas = lazy(() =>
  import("@designcodeio/threeui/components/PredictiveArcCanvas").then((module) => ({ default: module.PredictiveArcCanvas as ComponentType<MixedCollectionProps> })),
);
const ConstellationField = lazy(() =>
  import("@designcodeio/threeui/components/ConstellationField").then((module) => ({ default: module.ConstellationField as ComponentType<MixedCollectionProps> })),
);
const WireframeForms = lazy(() =>
  import("@designcodeio/threeui/components/WireframeForms").then((module) => ({ default: module.WireframeForms as ComponentType<MixedCollectionProps> })),
);
const LiquidMetalButton = lazy(() =>
  import("@designcodeio/threeui/components/LiquidMetalButton").then((module) => ({ default: module.LiquidMetalButton })),
);
const EngravedCertificate = lazy(() =>
  import("@designcodeio/threeui/components/EngravedCertificate").then((module) => ({ default: module.EngravedCertificate })),
);
const TempleNightScene = lazy(() =>
  import("@designcodeio/threeui/components/TempleNightScene").then((module) => ({ default: module.TempleNightScene })),
);
const BestsellersBookShowcase = lazy(() =>
  import("@designcodeio/threeui/components/BestsellersBookShowcase").then((module) => ({ default: module.BestsellersBookShowcase })),
);
const SylvaHero = lazy(() =>
  import("@designcodeio/threeui/components/SylvaHero").then((module) => ({ default: module.SylvaHero })),
);
const MengToSketchbookLandingPage = lazy(() =>
  import("@designcodeio/threeui/components/MengToSketchbookLandingPage").then((module) => ({ default: module.MengToSketchbookLandingPage })),
);
const SparkBadge = lazy(() =>
  import("@designcodeio/threeui/components/SparkBadge").then((module) => ({ default: module.SparkBadge })),
);
const TextPathStudies = lazy(() =>
  import("@designcodeio/threeui/components/TextPathStudies").then((module) => ({ default: module.TextPathStudies as ComponentType<MixedCollectionProps> })),
);
const ShaderButtons = lazy(() =>
  import("@designcodeio/threeui/components/ShaderButtons").then((module) => ({ default: module.ShaderButtons as ComponentType<MixedCollectionProps> })),
);
const Gallery = lazy(() =>
  import("@designcodeio/threeui/components/Gallery").then((module) => ({ default: module.Gallery as ComponentType<MixedCollectionProps> })),
);
const KoiStudies = lazy(() =>
  import("@designcodeio/threeui/components/KoiStudies").then((module) => ({ default: module.KoiStudies })),
);
const Sketchbook = lazy(() =>
  import("@designcodeio/threeui/components/Sketchbook").then((module) => ({ default: module.Sketchbook })),
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
  | "kage"
  | "warp"
  | "landscape"
  | "text-animation"
  | "rectangle-buttons"
  | "uplink"
  | "bookshelf"
  | "structure-flow"
  | "portal-field"
  | "gallery-heading"
  | "diagnostics"
  | "woven-cloth"
  | "japanese-tower"
  | "editorial-intro"
  | "character-carousel"
  | "globe"
  | "laser"
  | "generate-button"
  | "newsletter-footer"
  | "complete-shelf"
  | "predictive-arc"
  | "constellation"
  | "wireframe-forms"
  | "liquid-metal"
  | "engraved-certificate"
  | "temple-night"
  | "bestsellers-book-showcase"
  | "sylva-hero"
  | "meng-to-sketchbook-landing-page"
  | "spark-badge"
  | "globe-study"
  | "star-portal"
  | "gallery"
  | "sylva-living-world"
  | "koi-studies"
  | "sketchbook";

type DemoCategory = "图形与背景" | "按钮与控件" | "文字与品牌" | "数据与工具" | "整页与场景";
type DemoCategoryFilter = "all" | DemoCategory;

type DemoVariantOption = {
  value: string;
  label: string;
};

type DemoDefinition = {
  id: DemoId;
  index: string;
  title: string;
  runtime: string;
  category: DemoCategory;
  role: string;
  summary: string;
  principle: string;
  boundary: string;
  interaction: string;
  needsWebGL?: boolean;
  variantLabel?: string;
  defaultVariant?: string;
  variants?: readonly DemoVariantOption[];
};

const ELEMENTS_VARIANTS = [
  { value: "elemental-water", label: "Elemental water" },
  { value: "elemental-lightning", label: "Elemental lightning" },
  { value: "elemental-flame", label: "Elemental flame" },
  { value: "condensation", label: "Condensation" },
  { value: "generative-tree", label: "Generative tree" },
] as const;

const CIRCLE_BUTTON_VARIANTS = [
  { value: "play", label: "Play" },
  { value: "plus", label: "Plus" },
  { value: "mail", label: "Mail" },
] as const;

const CRT_VARIANTS = [
  { value: "terminal", label: "Terminal" },
  { value: "cinematic", label: "Cinematic" },
  { value: "blue-screen", label: "Blue screen" },
  { value: "nintendo", label: "Nintendo" },
] as const;

const DOCK_VARIANTS = [
  { value: "sable", label: "Sable" },
  { value: "modern", label: "Modern" },
  { value: "retro", label: "Retro" },
  { value: "glass", label: "Glass" },
] as const;

const BRAND_ORB_VALUES = [
  "claude", "openai", "codex", "cursor", "gemini", "figma", "framer", "react", "swift", "designcode", "aura", "dreamcut", "ui", "ux", "css", "ios", "neuform", "github", "x", "instagram", "threads", "linkedin", "email",
] as const;

const BRAND_ORB_VARIANTS = BRAND_ORB_VALUES.map((value) => ({
  value,
  label: value === "ui" || value === "ux" || value === "css" || value === "ios" ? value.toUpperCase() : `${value.charAt(0).toUpperCase()}${value.slice(1)}`,
})) satisfies readonly DemoVariantOption[];

const GAUGE_VARIANTS = [
  { value: "tachometer", label: "Tachometer" },
  { value: "speedometer", label: "Speedometer" },
  { value: "boost", label: "Boost" },
  { value: "power", label: "Power" },
] as const;

const TOGGLE_VARIANTS = [
  { value: "skeuomorphic-toggle", label: "Skeuomorphic" },
  { value: "modern", label: "Modern" },
  { value: "glass", label: "Glass" },
  { value: "shader", label: "Shader" },
] as const;

const WARP_VARIANTS = [
  { value: "streaks", label: "Streaks" },
  { value: "letters", label: "Letters" },
  { value: "keycaps", label: "Keycaps" },
  { value: "hyperspace", label: "Hyperspace" },
] as const;

const LANDSCAPE_VARIANTS = [
  { value: "sunrise", label: "Sunrise" },
  { value: "noon", label: "Noon" },
  { value: "sunset", label: "Sunset" },
  { value: "night", label: "Night" },
  { value: "rain", label: "Rain" },
  { value: "storm", label: "Storm" },
  { value: "snow", label: "Snow" },
] as const;

const TEXT_ANIMATION_VARIANTS = [
  { value: "article-headings", label: "Article headings" },
  { value: "threeui-intro", label: "ThreeUI intro" },
  { value: "particle-wordmark", label: "Particle wordmark" },
  { value: "audio-wordmark", label: "Audio wordmark" },
] as const;

const RECTANGLE_BUTTON_VARIANTS = [
  { value: "dark-pill", label: "Dark pill" },
  { value: "launch-button", label: "Launch" },
  { value: "dot-border-button", label: "Dot border" },
  { value: "floating-dots-cta", label: "Floating dots" },
  { value: "sliding-text-cta", label: "Sliding text" },
  { value: "gradient-beam-cta", label: "Gradient beam" },
  { value: "gradient-pill-button", label: "Gradient pill" },
  { value: "generate-button", label: "Generate" },
  { value: "glassmorphism-cta", label: "Glassmorphism" },
  { value: "spinning-border-button", label: "Spinning border" },
  { value: "gradient-cta", label: "Gradient CTA" },
  { value: "lumen-cta", label: "Lumen primary" },
  { value: "lumen-cta-ghost", label: "Lumen ghost" },
  { value: "trochil-signal", label: "Trochil signal" },
  { value: "attune-thermal", label: "Attune thermal" },
  { value: "tideform-outline", label: "Tideform outline" },
  { value: "understory-arrow-pill", label: "Understory" },
  { value: "meridian-keycap-primary", label: "Meridian primary" },
  { value: "meridian-keycap-secondary", label: "Meridian secondary" },
  { value: "halvorsen-arrow-pill", label: "Halvorsen" },
  { value: "aster-glass-access", label: "Aster access" },
  { value: "aster-glass-arrow", label: "Aster arrow" },
] as const;

const STRUCTURE_FLOW_VARIANTS = [
  { value: "structure-flow", label: "Structure flow" },
  { value: "emerald-horizon", label: "Emerald horizon" },
  { value: "orbital-sphere", label: "Orbital sphere" },
  { value: "dot-matrix", label: "Dot matrix" },
  { value: "expanse-field", label: "Expanse field" },
  { value: "logic-core", label: "Logic core" },
  { value: "dimensional-field", label: "Dimensional field" },
  { value: "data-field", label: "Data field" },
  { value: "topology-field", label: "Topology field" },
  { value: "nebula", label: "Nebula" },
  { value: "fluid-field", label: "Fluid field" },
  { value: "ember-storm", label: "Ember storm" },
  { value: "flux-vortex", label: "Flux vortex" },
] as const;

const PORTAL_FIELD_VARIANTS = [
  { value: "portal-field", label: "Portal field" },
  { value: "flow-field", label: "Flow field" },
  { value: "cloud-field", label: "Cloud field" },
  { value: "bell-field", label: "Bell field" },
  { value: "stream-convergence", label: "Stream convergence" },
] as const;

const GALLERY_HEADING_VARIANTS = [
  { value: "rising-diagonal", label: "Rising diagonal" },
  { value: "falling-diagonal", label: "Falling diagonal" },
  { value: "horizontal-sweep", label: "Horizontal sweep" },
  { value: "vertical-loop", label: "Vertical loop" },
] as const;

const DIAGNOSTICS_VARIANTS = [
  { value: "layers", label: "Layered planes" },
  { value: "nodes", label: "Node cubes" },
  { value: "flow", label: "Flowing mesh" },
] as const;

const WOVEN_CLOTH_VARIANTS = [
  { value: "woven-cloth", label: "Woven cloth" },
  { value: "iridescent", label: "Iridescent" },
  { value: "atelier", label: "Atelier" },
  { value: "washi", label: "Washi" },
] as const;

const JAPANESE_TOWER_VARIANTS = [
  { value: "japan", label: "Japan" },
  { value: "china", label: "China" },
  { value: "vietnam", label: "Vietnam" },
  { value: "thailand", label: "Thailand" },
  { value: "cambodia", label: "Cambodia" },
  { value: "turkey", label: "Turkey" },
] as const;

const CHARACTER_CAROUSEL_VARIANTS = [
  { value: "filmstrip", label: "Filmstrip" },
  { value: "wave", label: "Wave" },
] as const;

const GLOBE_VARIANTS = [
  { value: "energy-orb", label: "Energy orb" },
] as const;

const LASER_VARIANTS = [
  { value: "matrix-field", label: "Matrix field" },
  { value: "atmospheric-blade", label: "Atmospheric blade" },
  { value: "vanishing-array", label: "Vanishing array" },
  { value: "prism-aperture", label: "Prism aperture" },
  { value: "halftone-relay", label: "Halftone relay" },
] as const;

const PREDICTIVE_ARC_VARIANTS = [
  { value: "predictive", label: "Predictive arc" },
  { value: "data-pixel", label: "Data pixel" },
  { value: "signal-particles", label: "Signal particles" },
  { value: "override-grid", label: "Override grid" },
  { value: "ribbon-field", label: "Ribbon field" },
  { value: "void-field", label: "Void field" },
  { value: "halftone-flow", label: "Halftone flow" },
  { value: "amber-halftone", label: "Amber halftone" },
] as const;

const CONSTELLATION_VARIANTS = [
  { value: "constellation-field", label: "Constellation" },
  { value: "particle-drift", label: "Particle drift" },
  { value: "particle-network", label: "Particle network" },
  { value: "gateway-flow", label: "Gateway flow" },
  { value: "connectivity-graph", label: "Connectivity graph" },
  { value: "interface-lines", label: "Interface lines" },
  { value: "defense-lines", label: "Defense lines" },
  { value: "topo-field", label: "Topo field" },
] as const;

const WIREFRAME_VARIANTS = [
  { value: "cube", label: "Cube" },
  { value: "cylinders", label: "Cylinders" },
  { value: "sphere", label: "Sphere" },
] as const;

const LIQUID_METAL_VARIANTS = [
  { value: "pill", label: "Pill action" },
  { value: "circle", label: "Circle add" },
  { value: "play", label: "Play control" },
] as const;

const TEXT_PATH_STUDY_VARIANTS = [
  { value: "globe-study", label: "Globe study" },
  { value: "outline-typeflow", label: "Outline typeflow" },
  { value: "morphing-glyph-cloud", label: "Morphing glyph cloud" },
  { value: "cloth-study", label: "Cloth study" },
  { value: "ripple-study", label: "Ripple study" },
  { value: "ball-study", label: "Ball study" },
] as const;

const SHADER_BUTTON_VARIANTS = [
  { value: "star-portal", label: "Star portal" },
  { value: "ignition-button", label: "Ignition button" },
  { value: "induction-button", label: "Induction button" },
  { value: "plasma-button", label: "Plasma button" },
  { value: "tactile-button", label: "Tactile button" },
  { value: "thinking-button", label: "Thinking button" },
] as const;

type WarpVariant = (typeof WARP_VARIANTS)[number]["value"];
type ElementsVariant = (typeof ELEMENTS_VARIANTS)[number]["value"];
type CircleButtonVariant = (typeof CIRCLE_BUTTON_VARIANTS)[number]["value"];
type CrtVariant = (typeof CRT_VARIANTS)[number]["value"];
type DockVariant = (typeof DOCK_VARIANTS)[number]["value"];
type BrandOrbVariant = (typeof BRAND_ORB_VALUES)[number];
type GaugeVariant = (typeof GAUGE_VARIANTS)[number]["value"];
type ToggleVariant = (typeof TOGGLE_VARIANTS)[number]["value"];
type LandscapeVariant = (typeof LANDSCAPE_VARIANTS)[number]["value"];
type TextAnimationVariant = (typeof TEXT_ANIMATION_VARIANTS)[number]["value"];
type RectangleButtonVariant = (typeof RECTANGLE_BUTTON_VARIANTS)[number]["value"];
type StructureFlowVariant = (typeof STRUCTURE_FLOW_VARIANTS)[number]["value"];
type PortalFieldVariant = (typeof PORTAL_FIELD_VARIANTS)[number]["value"];
type GalleryHeadingVariant = (typeof GALLERY_HEADING_VARIANTS)[number]["value"];
type DiagnosticsVariant = (typeof DIAGNOSTICS_VARIANTS)[number]["value"];
type WovenClothVariant = (typeof WOVEN_CLOTH_VARIANTS)[number]["value"];
type JapaneseTowerVariant = (typeof JAPANESE_TOWER_VARIANTS)[number]["value"];
type CharacterCarouselVariant = (typeof CHARACTER_CAROUSEL_VARIANTS)[number]["value"];
type GlobeVariant = (typeof GLOBE_VARIANTS)[number]["value"];
type LaserVariant = (typeof LASER_VARIANTS)[number]["value"];
type PredictiveArcVariant = (typeof PREDICTIVE_ARC_VARIANTS)[number]["value"];
type ConstellationVariant = (typeof CONSTELLATION_VARIANTS)[number]["value"];
type WireframeVariant = (typeof WIREFRAME_VARIANTS)[number]["value"];
type LiquidMetalVariant = (typeof LIQUID_METAL_VARIANTS)[number]["value"];
type TextPathStudyVariant = (typeof TEXT_PATH_STUDY_VARIANTS)[number]["value"];
type ShaderButtonVariant = (typeof SHADER_BUTTON_VARIANTS)[number]["value"];

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
    title: "Elements Lab",
    runtime: "Canvas collection",
    category: "图形与背景",
    role: "元素视觉集合",
    summary: "水、闪电、火焰、凝结与生成树五种自然机制被统一为可选择的视觉集合。",
    principle: "集合入口根据 variant 分派 Canvas、DOM 或 iframe renderer；宿主只维护统一选择、调色和生命周期接口。",
    boundary: "五种实现的内部成本并不相同；统一 API 方便选型，但仍需逐变体验证性能、可读区和暂停行为。",
    interaction: "切换五种自然机制，比较同一视觉槽位内的实现跨度",
    variantLabel: "元素机制",
    defaultVariant: "condensation",
    variants: ELEMENTS_VARIANTS,
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
    title: "Circle Controls",
    runtime: "DOM + CSS",
    category: "按钮与控件",
    role: "界面微交互",
    summary: "Play、Plus、Mail 三种真实 button 语义、SVG 图标和 CSS 光泽构成无需 Canvas 的拟物控件。",
    principle: "DOM 承担交互和语义，CSS 渐变、阴影、滤镜与伪元素构成材质；浏览器合成器处理过渡。",
    boundary: "最适合真实 UI 控件，但复杂粒子、空间变形与大规模像素模拟不属于它的优势。",
    interaction: "切换操作语义并点击按钮，验证真实 DOM 事件回传",
    variantLabel: "操作语义",
    defaultVariant: "play",
    variants: CIRCLE_BUTTON_VARIANTS,
  },
  {
    id: "crt",
    index: "05",
    title: "CRT Collection",
    runtime: "Canvas 2D",
    category: "图形与背景",
    role: "复古显示模拟",
    summary: "Terminal、Cinematic、Blue Screen 与 Nintendo 四种扫描线、噪声和偏色配方被封装为同一背景集合。",
    principle: "Canvas renderer 读取 variant 配方，把运动、亮度、透明度和色彩参数合成为逐帧显示效果。",
    boundary: "风格辨识度强，但内容可读性和闪烁强度需要按真实页面场景重新校准。",
    interaction: "切换四种屏幕配方，再调整速度与色相",
    variantLabel: "屏幕配方",
    defaultVariant: "cinematic",
    variants: CRT_VARIANTS,
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
    summary: "Sable、Modern、Retro 与 Glass 四种顶部 Dock 将真实交互区域、邻近放大和不同材质组合。",
    principle: "指针距离驱动每个项目的尺寸与弹簧状态，Canvas/CSS 层提供材质，DOM 继续负责可点击结构。",
    boundary: "强交互组件需要验证触摸、键盘、视口边缘以及宿主导航逻辑。",
    interaction: "切换四种材质并移动指针，观察邻近响应",
    variantLabel: "Dock 材质",
    defaultVariant: "glass",
    variants: DOCK_VARIANTS,
  },
  {
    id: "brand",
    index: "10",
    title: "Brand Orbs",
    runtime: "Canvas iframe",
    category: "文字与品牌",
    role: "品牌资产",
    summary: "同一颗动态材质球可以切换为 Codex、Figma、React 等 23 种品牌变体。",
    principle: "组件把品牌模式写入 Canvas 原作的 srcDoc；公共外壳通过 postMessage 控制速度和暂停，并为 iframe 提供无障碍标题。",
    boundary: "品牌标识的视觉复用必须同时遵守对应商标规范，MIT 代码许可不等于商标授权。",
    interaction: "选择任意品牌球体；舞台始终只挂载一个 iframe renderer",
    variantLabel: "品牌资产",
    defaultVariant: "codex",
    variants: BRAND_ORB_VARIANTS,
  },
  {
    id: "gauges",
    index: "11",
    title: "Performance Gauges",
    runtime: "Sandboxed iframe",
    category: "数据与工具",
    role: "仪表可视化",
    summary: "速度表、转速表、增压与功率四套仪表通过统一外壳成为可选变体。",
    principle: "组件从完整来源中锁定目标节点，保留原动画逻辑，再用隔离容器完成裁剪、缩放和主题变换。",
    boundary: "示意仪表不是业务图表库；接入真实数据仍需定义数据模型、单位、范围和状态语义。",
    interaction: "切换四种仪表，比较不同数据语义的视觉骨架",
    variantLabel: "仪表类型",
    defaultVariant: "tachometer",
    variants: GAUGE_VARIANTS,
  },
  {
    id: "toggle",
    index: "12",
    title: "Skeuo Toggles",
    runtime: "Sandboxed iframe",
    category: "按钮与控件",
    role: "材质开关",
    summary: "玻璃、现代、shader 与拟物开关把孤立作品收敛成统一参数接口。",
    principle: "Neuform 包装器为原始 HTML 选择目标、注入聚焦样式并映射主题和调色参数。",
    boundary: "视觉控件不自动具备业务状态；生产使用时仍要连接表单值、校验和持久化。",
    interaction: "切换四种材质并操作开关，验证 onChange 回传",
    variantLabel: "开关材质",
    defaultVariant: "glass",
    variants: TOGGLE_VARIANTS,
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
  {
    id: "warp",
    index: "14",
    title: "Warp Field",
    runtime: "Three.js r128",
    category: "图形与背景",
    role: "高速空间场",
    summary: "四种空间穿梭语言把线段、字母、键帽与超空间运动收进同一套实时参数。",
    principle: "Three.js r128 生成 Lines、Meshes 与透视相机；每帧推进 Z 轴、回收越界对象，并按 variant 改变密度、速度与形态。",
    boundary: "运动量很高，适合开场和转场；正文安全区、眩晕风险与低端 GPU 预算必须由宿主管理。",
    interaction: "切换形态，再调速度与色相比较同一 renderer 的表达跨度",
    needsWebGL: true,
    variantLabel: "空间形态",
    defaultVariant: "streaks",
    variants: WARP_VARIANTS,
  },
  {
    id: "landscape",
    index: "15",
    title: "Landscape",
    runtime: "Three.js r149 iframe",
    category: "整页与场景",
    role: "时间与天气场景",
    summary: "同一程序化地景可在日出、正午、日落、夜晚、雨、风暴与雪之间切换。",
    principle: "React 把 variant 转为 time 与 weather 查询参数；本地 HTML 子文档用 Three.js r149 重建天空、地形、植被和天气粒子。",
    boundary: "场景文件约 2.43 MB，且 iframe 内部状态与宿主隔离；适合作为空间氛围，不应承载唯一业务信息。",
    interaction: "切换时间和天气，观察同一场景系统的状态组合",
    variantLabel: "环境状态",
    defaultVariant: "sunrise",
    variants: LANDSCAPE_VARIANTS,
  },
  {
    id: "text-animation",
    index: "16",
    title: "Text Animation",
    runtime: "DOM + iframe",
    category: "文字与品牌",
    role: "标题与字标动效",
    summary: "解码标题、品牌开场、粒子字标和音频字标共用一个集合入口。",
    principle: "集合组件按 variant 懒加载 DOM 解码器或独立 iframe 作品；宿主以统一入口选择完全不同的文字 renderer。",
    boundary: "文字成为视觉素材时仍要保留可读标题；音频式视觉不代表组件自动获得声音输入或播放控制。",
    interaction: "切换四种文字机制，比较 DOM 标题与独立字标作品",
    variantLabel: "文字机制",
    defaultVariant: "article-headings",
    variants: TEXT_ANIMATION_VARIANTS,
  },
  {
    id: "rectangle-buttons",
    index: "17",
    title: "Rectangle CTA",
    runtime: "DOM + iframe",
    category: "按钮与控件",
    role: "CTA 视觉家族",
    summary: "一个统一入口覆盖 22 种矩形 CTA，从原生 CSS 胶囊到隔离 shader 作品。",
    principle: "RectangleButtons 按 variant 路由到原生 DOM/CSS、Lumen CTA 或 Neuform iframe；组件集合承担命名与分发。",
    boundary: "同一入口不等于同一业务 API：部分变体只是视觉包装，生产接线仍需核对 button 语义、事件和 disabled 状态。",
    interaction: "在 22 种具名 CTA 中切换，并检查焦点与真实 button 语义",
    variantLabel: "CTA 变体",
    defaultVariant: "aster-glass-arrow",
    variants: RECTANGLE_BUTTON_VARIANTS,
  },
  {
    id: "uplink",
    index: "18",
    title: "Uplink Loader",
    runtime: "Canvas srcDoc iframe",
    category: "数据与工具",
    role: "过程状态反馈",
    summary: "完整上传进度场景被封装成独立加载器，补足结果之外的等待与过程反馈。",
    principle: "组件把自包含 HTML 写入 sandbox iframe，内部 Canvas 与计时逻辑独立运行，React 只跟踪子文档加载状态。",
    boundary: "当前动画是演示进度，不接受真实 progress 数值；生产使用前必须建立进度、取消、失败和重试接口。",
    interaction: "观察加载循环；把它视为状态视觉，不要误读为真实任务进度",
  },
  {
    id: "bookshelf",
    index: "19",
    title: "Bookshelf",
    runtime: "Three.js r165",
    category: "整页与场景",
    role: "可交互 3D 物体",
    summary: "可旋转、选择和翻页的三维书架把复杂物体、灯光、相机控制与 DOM 状态桥接在一个组件内。",
    principle: "Three.js r165 创建几何体、材质、环境与 OrbitControls；隐藏 DOM 控件作为状态源，Canvas 负责空间交互。",
    boundary: "这是高成本复合组件，独立 chunk 约 794 kB gzip；键盘路径、触摸手势、选中反馈、资源释放与独立 Three.js 版本都要纳入预算。",
    interaction: "拖拽旋转书架，点击书脊并尝试组件的键盘路径",
    needsWebGL: true,
  },
  {
    id: "structure-flow",
    index: "20",
    title: "Structure Flow",
    runtime: "Mixed renderer collection",
    category: "图形与背景",
    role: "系统结构背景",
    summary: "十三种结构、数据与能量场被收进同一集合，适合比较抽象系统叙事的不同视觉语法。",
    principle: "集合按 variant 分发到 Three.js、Canvas 或隔离 iframe renderer；宿主仍使用同一组 speed、opacity 与色彩参数。",
    boundary: "不同 variant 的实现和成本并不一致；生产选择应按页面角色和运行时预算，而不是只看同一集合名称。",
    interaction: "切换结构形态，比较网络、矩阵、拓扑与能量场对同一内容角色的影响",
    variantLabel: "结构形态",
    defaultVariant: "structure-flow",
    variants: STRUCTURE_FLOW_VARIANTS,
  },
  {
    id: "portal-field",
    index: "21",
    title: "Portal Field",
    runtime: "Canvas + iframe collection",
    category: "图形与背景",
    role: "空间深度背景",
    summary: "传送门、流场、云团、钟形粒子与汇聚线提供五种进入、聚焦和转场语言。",
    principle: "集合将多个粒子与线场 renderer 统一为 variant；宿主调节密度、长度、速度和色彩，具体绘制仍由各子实现承担。",
    boundary: "高密度运动容易与正文争夺注意力；适合短时强调、章节转场和局部空间提示，不宜覆盖长阅读。",
    interaction: "切换空间场，再调能量与速度观察密度和聚焦感",
    variantLabel: "空间场",
    defaultVariant: "portal-field",
    variants: PORTAL_FIELD_VARIANTS,
  },
  {
    id: "gallery-heading",
    index: "22",
    title: "Gallery Heading",
    runtime: "Sandboxed DOM / Canvas",
    category: "文字与品牌",
    role: "编辑式大标题",
    summary: "四种方向性排版把标题、图像色块与运动轴组合成可切换的编辑式章节开场。",
    principle: "组件根据 variant 注入不同 headline、字体轴、色盘和运动配置，在隔离子文档中保留原作品布局。",
    boundary: "默认标题内容来自示例作品；接入真实页面前需建立内容槽位、换行规则和本地化压力测试。",
    interaction: "比较斜向、横扫和纵向标题，观察排版方向怎样改变叙事节奏",
    variantLabel: "排版方向",
    defaultVariant: "rising-diagonal",
    variants: GALLERY_HEADING_VARIANTS,
  },
  {
    id: "diagnostics",
    index: "23",
    title: "Diagnostics",
    runtime: "Canvas UI iframe",
    category: "数据与工具",
    role: "诊断信息面板",
    summary: "层叠平面、节点方块和流动网格三种诊断视图补足数据展示与系统状态界面。",
    principle: "包装器从完整作品中裁取目标面板，注入聚焦尺寸与主题参数，再将内部 Canvas UI 放入隔离 iframe。",
    boundary: "这些是视觉诊断面板，没有公开真实数据输入模型；业务使用仍需重建数据、单位、状态和辅助文本接口。",
    interaction: "切换三种诊断视图，区分视觉状态表达与真实数据绑定",
    variantLabel: "诊断视图",
    defaultVariant: "layers",
    variants: DIAGNOSTICS_VARIANTS,
  },
  {
    id: "woven-cloth",
    index: "24",
    title: "Woven Cloth",
    runtime: "Shader iframe collection",
    category: "图形与背景",
    role: "材质与表面",
    summary: "织物、虹彩、工坊和和纸四种材质研究把光泽、纤维与表面深度转成品牌背景。",
    principle: "集合在隔离 renderer 中切换材质配方，宿主通过 hue、saturation 与 brightness 做品牌化调节。",
    boundary: "材质感依赖运动和屏幕表现；适合品牌氛围与局部特写，必须为低动效和低性能设备准备静态替代。",
    interaction: "切换四种表面，并用色相观察同一材质的品牌适配空间",
    variantLabel: "材质",
    defaultVariant: "woven-cloth",
    variants: WOVEN_CLOTH_VARIANTS,
  },
  {
    id: "japanese-tower",
    index: "25",
    title: "Tower Landscape",
    runtime: "Three.js r149 iframe",
    category: "整页与场景",
    role: "地域建筑环境",
    summary: "同一程序化地景可切换日本、中国、越南、泰国、柬埔寨与土耳其建筑轮廓。",
    principle: "React 将 country 写入本地 HTML 查询参数；子文档用 Three.js 生成地形、植被、天空和各地域建筑形态。",
    boundary: "这是风格化环境原型，不是准确建筑史模型；文化语境、真实性和本地化内容需要独立审核。",
    interaction: "切换六个地域，比较同一环境系统如何承载不同建筑轮廓",
    variantLabel: "地域",
    defaultVariant: "japan",
    variants: JAPANESE_TOWER_VARIANTS,
  },
  {
    id: "editorial-intro",
    index: "26",
    title: "Editorial Intro",
    runtime: "Semantic DOM + CSS",
    category: "文字与品牌",
    role: "内容章节开场",
    summary: "完整标题、说明和装置图形组成可读的编辑式章节开场，补足视觉背景之外的内容结构。",
    principle: "React 输出原生 section、heading 与 paragraph；CSS 网格、SVG/Data URL 图形和层叠材质共同完成构图。",
    boundary: "当前文案是固定示例内容；进入生成系统前，需要暴露标题、正文、标签和图形槽位。",
    interaction: "检查标题语义和内容层级，观察视觉结构如何服务正文",
  },
  {
    id: "character-carousel",
    index: "27",
    title: "Character Carousel",
    runtime: "Canvas srcDoc iframe",
    category: "文字与品牌",
    role: "人物与作品浏览",
    summary: "Filmstrip 与 Wave 两种人物序列把连续角色展示封装成作品集、团队与 IP 浏览器。",
    principle: "组件将两个自包含 Canvas 原作写入 sandbox iframe，并通过 postMessage 控制速度、尺度和暂停。",
    boundary: "当前人物素材与交互来自示例作品；真实内容需要资产输入、替代文本、选中状态和详情跳转协议。",
    interaction: "切换胶片与波浪布局，比较同一内容集合的浏览节奏",
    variantLabel: "浏览方式",
    defaultVariant: "filmstrip",
    variants: CHARACTER_CAROUSEL_VARIANTS,
  },
  {
    id: "globe",
    index: "28",
    title: "Energy Globe",
    runtime: "Raw WebGL + Canvas 2D",
    category: "数据与工具",
    role: "全球数据视觉",
    summary: "发光球体、烟雾 shader 与二维星场组成全球网络、覆盖范围和系统状态的视觉锚点。",
    principle: "Raw WebGL 片元着色器绘制能量球和烟雾，叠加 Canvas 2D 星点；ResizeObserver 与 IntersectionObserver 管理尺寸和暂停。",
    boundary: "这是全球数据的视觉隐喻，不包含经纬度、区域选择或真实数据映射；业务使用要另建语义图层。",
    interaction: "调节能量、速度和色相，观察球体尺度、烟雾与星场",
    needsWebGL: true,
    variantLabel: "球体形态",
    defaultVariant: "energy-orb",
    variants: GLOBE_VARIANTS,
  },
  {
    id: "laser",
    index: "29",
    title: "Laser Focus",
    runtime: "Canvas + iframe collection",
    category: "图形与背景",
    role: "视觉聚焦与转场",
    summary: "矩阵场、光刃、消失阵列、棱镜光阑和半调中继提供五种聚焦、揭示与章节切换语言。",
    principle: "集合按 variant 路由到不同 Canvas 或隔离 renderer，并把速度、长度、密度和颜色映射成统一控制。",
    boundary: "强光和高对比运动不应覆盖正文或持续常驻；需要限制闪烁、持续时间与并发实例。",
    interaction: "切换五种光场，比较聚焦、揭示和空间推进的视觉差异",
    variantLabel: "光场",
    defaultVariant: "matrix-field",
    variants: LASER_VARIANTS,
  },
  {
    id: "generate-button",
    index: "30",
    title: "Generate Action",
    runtime: "Sandboxed DOM / Canvas",
    category: "按钮与控件",
    role: "AI 生成动作视觉",
    summary: "生成按钮提供明确的 AI 操作视觉候选，用于探索等待、能量聚集和主操作强调。",
    principle: "Neuform 包装器从独立作品中裁取按钮目标，并通过主题与色彩参数建立统一展示接口。",
    boundary: "当前公共组件只暴露外观参数，没有 onClick、loading、success 或 error API；只能作为视觉候选，不能直接承担业务提交。",
    interaction: "观察生成动作的视觉反馈，并与原生 Circle Control 的业务事件能力对比",
  },
  {
    id: "newsletter-footer",
    index: "31",
    title: "Newsletter Footer",
    runtime: "Semantic DOM + CSS",
    category: "整页与场景",
    role: "转化页尾模块",
    summary: "品牌声明、邮件表单、超大字标和法律链接组合成完整页尾，展示真实网页收口结构。",
    principle: "原生 footer、form、input、button 和 links 承担语义与交互，CSS 负责排版、边界和材质。",
    boundary: "提交仅更新本地成功状态，不会发送邮件；生产接入仍需校验、隐私同意、后端和错误恢复。",
    interaction: "输入邮箱并提交，验证原生表单的本地成功反馈",
  },
  {
    id: "complete-shelf",
    index: "32",
    title: "Complete Shelf",
    runtime: "Sandboxed page iframe",
    category: "整页与场景",
    role: "产品陈列整页",
    summary: "完整书架落地页将产品目录、编辑排版和三维陈列组织成可滚动的完成态页面。",
    principle: "React 管理 iframe 生命周期和页面排版定制；同源本地 HTML 在沙箱中保留自己的结构、样式和脚本。",
    boundary: "整页资产约 0.90 MB，内容与路由仍在 iframe 内；它适合迁移参考，不等于可直接接入商品、搜索或结算数据。",
    interaction: "在沙箱内滚动，观察产品目录、内容节奏和完整页面结构",
  },
  {
    id: "predictive-arc",
    index: "33",
    title: "Predictive Arc",
    runtime: "Canvas + iframe collection",
    category: "数据与工具",
    role: "预测与决策视觉",
    summary: "八种弧线、像素、信号与半调场把趋势、置信区间、风险和下一步动作转成可导演的视觉语言。",
    principle: "集合按 variant 在原生 Canvas、Raw WebGL 与隔离作品间分发；宿主用 speed、density、opacity 和颜色建立统一配置面。",
    boundary: "它表达的是预测感，不会计算预测结果；真实产品仍需绑定数据尺度、置信度、异常状态与辅助文本。",
    interaction: "切换八种决策视觉，比较同一数据角色怎样从分析转向行动",
    variantLabel: "决策视觉",
    defaultVariant: "predictive",
    variants: PREDICTIVE_ARC_VARIANTS,
  },
  {
    id: "constellation",
    index: "34",
    title: "Constellation Network",
    runtime: "Canvas iframe collection",
    category: "数据与工具",
    role: "关系与系统网络",
    summary: "星座、节点网络、连接图、接口线和防御轨迹提供八种关系图谱与系统拓扑表达。",
    principle: "Neuform 批量适配器从不同原作中选取画布区域，再把密度、尺寸、线宽、速度和主题映射成公共 props。",
    boundary: "当前节点与连线是程序化视觉，不接受真实图数据；业务接入需要节点标识、选择、缩放、搜索和无障碍摘要。",
    interaction: "切换网络形态，观察密度和线宽怎样改变系统复杂度感知",
    variantLabel: "网络形态",
    defaultVariant: "constellation-field",
    variants: CONSTELLATION_VARIANTS,
  },
  {
    id: "wireframe-forms",
    index: "35",
    title: "Wireframe Forms",
    runtime: "Canvas iframe collection",
    category: "图形与背景",
    role: "结构原型与数字孪生",
    summary: "立方体、柱体和球体三种线框研究适合产品结构、数字孪生、工程封面和技术章节的空间底座。",
    principle: "隔离画布保留原作的透视与线框运动，集合用 variant 切换几何配方，并由宿主统一控制尺度、密度和颜色。",
    boundary: "它是抽象几何表达，不包含 CAD 模型、部件语义或三维选择；真实工程数据需要新的几何输入协议。",
    interaction: "切换三种几何体，比较结构密度和尺度对技术叙事的影响",
    variantLabel: "原型几何",
    defaultVariant: "cube",
    variants: WIREFRAME_VARIANTS,
  },
  {
    id: "liquid-metal",
    index: "36",
    title: "Liquid Metal CTA",
    runtime: "Sandboxed Canvas button",
    category: "按钮与控件",
    role: "高质感关键行动",
    summary: "胶囊、圆形添加和播放三种液态金属按钮展示高完成度主操作如何保留真实业务回调。",
    principle: "自包含 Canvas 按钮运行在 sandbox iframe；postMessage 同步文字、尺寸和点击事件，React 外壳把激活回传给宿主。",
    boundary: "事件可接，但 disabled、loading、success、error 和表单语义仍需宿主补齐；高光材质也需要目标设备性能验证。",
    interaction: "切换三种行动形态并点击按钮，验证 iframe 到宿主的真实事件桥",
    variantLabel: "行动形态",
    defaultVariant: "pill",
    variants: LIQUID_METAL_VARIANTS,
  },
  {
    id: "engraved-certificate",
    index: "37",
    title: "Engraved Certificate",
    runtime: "Sandboxed DOM / Canvas",
    category: "文字与品牌",
    role: "可信凭证与完成证明",
    summary: "雕刻式凭证把身份、达成结果与纪念性版式组合成课程证书、会员权益或生成任务完成页。",
    principle: "Neuform Craft 适配器裁取完整作品的目标区域，通过隔离 iframe 保留字体、纹理与装饰，同时开放主题色映射。",
    boundary: "这是凭证视觉，不包含姓名、编号、签名、校验链接或防伪逻辑；可信性必须来自业务数据和验证系统。",
    interaction: "调节色相观察品牌适配，并区分视觉可信感与真实凭证能力",
  },
  {
    id: "temple-night",
    index: "38",
    title: "Temple Night",
    runtime: "Three.js r149",
    category: "整页与场景",
    role: "沉浸式品牌世界",
    summary: "月夜、山体、寺院灯光与空间雾组成可交互的叙事世界，适合目的地、文化内容和沉浸式产品首屏。",
    principle: "Three.js 场景由宿主 Canvas 直接渲染，ResizeObserver 负责尺寸，IntersectionObserver 管理离屏暂停，指针驱动视角响应。",
    boundary: "这是单一风格化夜景，没有路线、内容槽位、CMS 或业务导航；文化真实性与语义覆盖层仍需独立设计。",
    interaction: "移动指针观察山体与寺院视差，并检查离屏暂停与 WebGL fallback",
    needsWebGL: true,
  },
  {
    id: "bestsellers-book-showcase",
    index: "39",
    title: "Bestsellers Showcase",
    runtime: "Sandboxed page iframe",
    category: "整页与场景",
    role: "出版与商品叙事",
    summary: "书封、目录、编辑文案和滚动节奏组成完整出版产品页，补足单个 3D 物件之外的销售叙事。",
    principle: "包内完整 HTML 由 LandingPageFrame 放入同源 sandbox iframe；React 宿主管理生命周期与可选排版定制。",
    boundary: "页面包含示例书目与内嵌媒体，但没有真实库存、购物车或结算；生产迁移需要重建内容与交易模型。",
    interaction: "在页面内滚动，检查书目叙事、菜单与商品结构",
  },
  {
    id: "sylva-hero",
    index: "40",
    title: "Sylva Hero",
    runtime: "Three.js page iframe",
    category: "整页与场景",
    role: "可持续品牌首屏",
    summary: "品牌导航、主标题、内容卡片与实时植物世界共同组成完成态绿色产品首屏。",
    principle: "同源 HTML 在 iframe 中运行 Three.js 场景与 DOM 内容；宿主可定制字体和主色，同时保留原作的页面结构。",
    boundary: "视觉世界可以复用，品牌主张、行动路径、内容真实性与环境性能仍要由目标产品负责。",
    interaction: "移动指针并在子页面中滚动，观察场景与内容如何共同构成 Hero",
  },
  {
    id: "meng-to-sketchbook-landing-page",
    index: "41",
    title: "Sketchbook Landing",
    runtime: "Sandboxed page iframe",
    category: "整页与场景",
    role: "作品集与个人叙事",
    summary: "纸张、手绘城市、翻页和人物介绍组成完整作品集落地页，展示艺术资产怎样成为内容导航。",
    principle: "完整 HTML、字体与图片从包内复制为同源资产；iframe 独立处理翻页、缩放和滚动，React 只管理挂载。",
    boundary: "示例作品和个人信息不可直接替换为任意创作者数据；生成系统需要新的作品、作者和项目 schema。",
    interaction: "翻动手绘册并在页面内滚动，检查作品集的阅读与交互节奏",
  },
  {
    id: "spark-badge",
    index: "42",
    title: "Spark Badge",
    runtime: "Canvas srcDoc iframe",
    category: "图形与背景",
    role: "认证与成就微场景",
    summary: "雨幕中的发光徽章把身份、成就与环境氛围压缩为一个可嵌入的视觉模块。",
    principle: "SparkBadge 通过 sandbox iframe 加载自包含 Canvas 文档，IntersectionObserver 控制离屏暂停；宿主资产修复了 1.2.0 源页遗漏的 URLSearchParams 初始化。",
    boundary: "上游原始 HTML 会因 `params` 未定义而黑屏，说明 iframe onLoad / ready 不能代替像素检查；修复后仍不提供真实签名、编号或验证。",
    interaction: "观察雨幕与徽章高光，并检查离屏暂停和恢复",
  },
  {
    id: "globe-study",
    index: "43",
    title: "Text Path Studies",
    runtime: "Canvas iframe collection",
    category: "图形与背景",
    role: "路径文字与形态实验",
    summary: "球体、轮廓字流、字形云、织物、涟漪与球形六种研究把文字轨迹转成空间表面。",
    principle: "集合按 variant 选择不同的自包含 Canvas 文档，并把 mode、scale、opacity 与颜色参数映射为统一接口。",
    boundary: "文字多作为图形粒子而非稳定语义内容；标题、替代文本和阅读顺序必须由宿主另外提供。",
    interaction: "切换六种路径研究，比较文字作为球面、流场与材质时的表达差异",
    variantLabel: "路径研究",
    defaultVariant: "globe-study",
    variants: TEXT_PATH_STUDY_VARIANTS,
  },
  {
    id: "star-portal",
    index: "44",
    title: "Shader Buttons",
    runtime: "Sandboxed shader collection",
    category: "按钮与控件",
    role: "高强调动作视觉",
    summary: "Star Portal、Ignition、Induction、Plasma、Tactile 与 Thinking 六种按钮探索生成、启动和等待动作的材质语言。",
    principle: "ShaderButtons 通过 lazy variant 路由到六个 Neuform 隔离作品，公共外壳统一主题、色相和亮度。",
    boundary: "这些公开入口主要提供视觉表面，不能默认视为有完整 click、disabled、loading 和提交语义的业务按钮。",
    interaction: "切换六种动作视觉，并与可回传事件的 Circle / Liquid Metal 控件比较",
    variantLabel: "按钮配方",
    defaultVariant: "star-portal",
    variants: SHADER_BUTTON_VARIANTS,
  },
  {
    id: "gallery",
    index: "45",
    title: "Cylindrical Gallery",
    runtime: "Three.js r149",
    category: "整页与场景",
    role: "作品与商品陈列",
    summary: "多张图像沿圆柱连续排布和旋转，形成适合作品集、产品目录与媒体入口的空间画廊。",
    principle: "Three.js 复用一段圆柱几何与多张内嵌纹理，逐帧旋转 Group；ResizeObserver 与 IntersectionObserver 管理尺寸和暂停。",
    boundary: "当前图片固定在包内，且没有选择、详情或可访问列表；真实画廊需要内容数据与 DOM 导航并行。",
    interaction: "调节速度与能量，观察圆柱陈列的节奏和可读区",
    needsWebGL: true,
  },
  {
    id: "sylva-living-world",
    index: "46",
    title: "Sylva Living World",
    runtime: "Three.js source iframe",
    category: "整页与场景",
    role: "自然环境适配探测",
    summary: "该入口从同包 authored source 提取蕨类、花朵、花粉和蝴蝶环境，适合作为网页的自然氛围增强层；本舞台同时验证失效恢复与加载预算。",
    principle: "浏览器探测确认 1.2.0 的公开 React 适配器只剩雾层后，宿主直接加载同包 authored HTML 的 scene-only 模式，并用轻量参考框适配保持单 iframe、可见性卸载与 1600×880 cover。",
    boundary: "这是有条件可用：当前使用的是包内原作的宿主级恢复路径，而不是公开适配器。生产接入仍应修复上游 DOM 抽取，并继续验证目标设备帧时间。",
    interaction: "查看直接同源适配后的真实 Sylva 环境层；这里同时治理“假 ready”和无贡献包装成本",
    needsWebGL: true,
  },
  {
    id: "koi-studies",
    index: "47",
    title: "Koi Studies",
    runtime: "Media-rich iframe",
    category: "整页与场景",
    role: "文化视觉卡片组",
    summary: "三张锦鲤研究卡以堆叠、半调与运动媒体组成强叙事的作品浏览场景。",
    principle: "KoiStudies 用 sandbox iframe 承载自包含媒体页面；宿主仅管理可见边界与加载状态，原作交互留在子文档。",
    boundary: "内嵌 HTML 约 16.8 MB，是明确的高成本资产；真实上线必须做媒体拆分、格式选择、预加载和网络降级。",
    interaction: "在卡片组内操作并观察堆叠关系，同时留意首次媒体解码成本",
  },
  {
    id: "sketchbook",
    index: "48",
    title: "Interactive Sketchbook",
    runtime: "Canvas / DOM srcDoc iframe",
    category: "整页与场景",
    role: "可嵌入作品册组件",
    summary: "独立 Sketchbook 把手绘翻页、缩放镜和城市图像从完整落地页中抽成可嵌入的作品册能力。",
    principle: "组件运行时生成 srcDoc，并以 assetBaseUrl 指向同源字体与图片；交互脚本在 sandbox 内独立处理翻页和指针。",
    boundary: "它证明完整交互可被封装，但内容仍是固定资产；要成为通用作品册必须开放页面列表、标题与替代文本。",
    interaction: "翻页、拖动并比较独立组件与完整 Sketchbook Landing 的封装粒度",
  },
];

const DEMO_CATEGORY_FILTERS: readonly { value: DemoCategoryFilter; label: string }[] = [
  { value: "all", label: "全部" },
  { value: "图形与背景", label: "图形" },
  { value: "按钮与控件", label: "控件" },
  { value: "文字与品牌", label: "文字" },
  { value: "数据与工具", label: "数据" },
  { value: "整页与场景", label: "场景" },
];

const DEMO_SEARCH_INDEX = new Map(DEMOS.map((demo) => {
  const variantTerms = demo.variants?.flatMap((variant) => [variant.label, variant.value]) ?? [];
  const terms = [demo.title, demo.role, demo.runtime, demo.category, demo.summary, demo.principle, demo.boundary, demo.interaction, ...variantTerms];
  return [demo.id, terms.join(" ").toLocaleLowerCase("zh-CN")];
}));

function matchesDemoSearch(demo: DemoDefinition, query: string) {
  if (!query) return true;
  return DEMO_SEARCH_INDEX.get(demo.id)?.includes(query) ?? false;
}

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
  { step: "02", name: "Kage Planner", owner: "生成与编排", detail: "叙事 · 信息架构 · 版式 · 动效节奏", output: "PageSpec 页面蓝图" },
  { step: "03", name: "ThreeUI Registry", owner: "视觉资产层", detail: "effect id · variant · props · runtime · fallback", output: "可运行组件" },
  { step: "04", name: "Browser Quality Gate", owner: "质量验收", detail: "可读性 · 响应式 · 性能 · 降级 · 回归", output: "可交付页面" },
] as const;

const NEXT_MOVES = [
  ["P0", "进入生产级验收", "43 个父能力都已有实时运行路径；下一步按真实页面角色和目标设备继续记录帧时间、资源预算、内容压力、fallback 与业务事件 verdict。"],
  ["P1", "替换为真实 Kage Planner", "Brief → PageSpec → 可编辑成品的 adapter 已跑通；下一步用模型或服务替换本地关键词编译器，并保留同一 schema、视觉槽位与质量门禁。"],
  ["P2", "自动重跑浏览器门禁", "把长文案、移动端、reduced-motion、无 WebGL、资源失败和帧时间探测变成每次组件升级后的回归任务。"],
] as const;

type SelectorBriefId = "ai-product" | "creative-studio" | "research-platform" | "sustainable-brand";
type SelectorDevice = "mobile" | "desktop";
type SelectorBudget = "light" | "balanced" | "cinematic";
type SelectorLayer = "anchor" | "system" | "action";
type RegistryCost = 1 | 2 | 3;

type SelectorProfile = {
  label: string;
  short: string;
  kicker: string;
  title: string;
  body: string;
  cta: string;
  intent: string;
};

type SelectorPageCopy = {
  systemKicker: string;
  systemTitle: string;
  systemBody: string;
  features: readonly [string, string, string];
  actionKicker: string;
  actionTitle: string;
  actionBody: string;
  proof: string;
};

type RegistryEntry = {
  id: DemoId;
  variant?: string;
  layers: readonly SelectorLayer[];
  affinities: readonly SelectorBriefId[];
  devices: readonly SelectorDevice[];
  cost: RegistryCost;
  measuredCost: string;
  fallback: string;
  use: string;
  priority: Partial<Record<SelectorBriefId, number>>;
};

type RankedRegistryEntry = {
  entry: RegistryEntry;
  layer: SelectorLayer;
  score: number;
  reason: string;
};

type SelectorPageContent = {
  hero: { kicker: string; title: string; body: string; cta: string };
  system: { kicker: string; title: string; body: string; features: readonly [string, string, string] };
  action: { kicker: string; title: string; body: string; proof: string };
};

type SelectorPageSpec = {
  schema: "kage.pagespec/0.1";
  source: string;
  brand: string;
  audience: string;
  goal: string;
  direction: string;
  device: SelectorDevice;
  budget: SelectorBudget;
  revision: number;
  contentRevision: number;
  content: SelectorPageContent;
  slots: readonly {
    layer: SelectorLayer;
    role: string;
    component: DemoId;
    variant: string | null;
    score: number;
    runtime: string;
    measuredCost: string;
    fallback: string;
  }[];
};

type SelectorPlan = {
  brief: SelectorBriefId;
  device: SelectorDevice;
  budget: SelectorBudget;
  revision: number;
  picks: readonly RankedRegistryEntry[];
  excluded: readonly RegistryEntry[];
  spec: SelectorPageSpec;
};

const SELECTOR_PROFILES: Record<SelectorBriefId, SelectorProfile> = {
  "ai-product": {
    label: "AI 产品发布",
    short: "AI PRODUCT",
    kicker: "INTELLIGENT PRODUCT · HUMAN-DIRECTED",
    title: "Turn intent into a site with presence.",
    body: "把复杂能力讲清楚，用克制但有辨识度的视觉建立信任，并把用户带向一个明确行动。",
    cta: "生成首屏候选",
    intent: "科技可信、结构清晰、行动明确",
  },
  "creative-studio": {
    label: "创意工作室",
    short: "CREATIVE",
    kicker: "INDEPENDENT STUDIO · SELECTED WORK",
    title: "Make the work feel unmistakably authored.",
    body: "用编辑式节奏和作品优先的视觉系统形成记忆点，同时保留清晰的服务入口与联系路径。",
    cta: "查看精选案例",
    intent: "编辑感、作品优先、强识别度",
  },
  "research-platform": {
    label: "研究型产品",
    short: "RESEARCH",
    kicker: "EVIDENCE PLATFORM · SYSTEM VIEW",
    title: "Make the evidence as compelling as the idea.",
    body: "把复杂关系、判断依据和验证状态变成可浏览的产品界面，而不是静态报告。",
    cta: "打开研究图谱",
    intent: "证据优先、关系可见、状态可信",
  },
  "sustainable-brand": {
    label: "自然品牌",
    short: "NATURE",
    kicker: "REGENERATIVE BRAND · LIVING SYSTEM",
    title: "A quieter interface can still feel alive.",
    body: "用自然材质和克制运动建立生命感，核心信息与行动仍保持轻量、可读和可降级。",
    cta: "探索品牌故事",
    intent: "自然、克制、具有生命感",
  },
};

const SELECTOR_PAGE_COPY: Record<SelectorBriefId, SelectorPageCopy> = {
  "ai-product": {
    systemKicker: "FROM MODEL TO PRODUCT",
    systemTitle: "Complex capability, arranged into a clear decision system.",
    systemBody: "模型、工作流与证据被组织成可理解的产品层级；视觉负责建立秩序，不替代解释。",
    features: ["Explain the model", "Show the workflow", "Prove the outcome"],
    actionKicker: "READY FOR A REAL WORKFLOW",
    actionTitle: "Turn informed attention into one clear next step.",
    actionBody: "主操作保持原生、可聚焦、可接线；视觉组件负责增强行动辨识度。",
    proof: "DOM FIRST · WEBGL OPTIONAL · ACTION WIRED",
  },
  "creative-studio": {
    systemKicker: "SELECTED WORK / AUTHORED SYSTEM",
    systemTitle: "A portfolio needs rhythm before it needs more effects.",
    systemBody: "项目、观点与服务被编排为有作者感的阅读节奏，让作品成为证据而不是装饰。",
    features: ["Selected projects", "Working principles", "Start a conversation"],
    actionKicker: "THE NEXT COLLABORATION",
    actionTitle: "Make the contact moment feel as considered as the work.",
    actionBody: "用清晰的合作入口收束表达，并保留移动端、键盘和静态降级路径。",
    proof: "AUTHORED · RESPONSIVE · CONTACTABLE",
  },
  "research-platform": {
    systemKicker: "EVIDENCE / RELATION / DECISION",
    systemTitle: "Let every conclusion reveal the system behind it.",
    systemBody: "关系、预测与验证状态进入同一个可浏览结构，读者能够从判断回到证据。",
    features: ["Trace relationships", "Compare signals", "Audit decisions"],
    actionKicker: "FROM FINDING TO SHARED PROOF",
    actionTitle: "A result becomes useful when the next action is explicit.",
    actionBody: "把研究发现连接到检查、分享与后续实验，而不是停在一张漂亮的可视化上。",
    proof: "TRACEABLE · EXPLAINABLE · REVIEWABLE",
  },
  "sustainable-brand": {
    systemKicker: "MATERIAL / ORIGIN / PRACTICE",
    systemTitle: "A living identity should reveal what it is made of.",
    systemBody: "材质、来源与实践被组织成安静的证据层；自然氛围不遮挡产品信息。",
    features: ["Material origins", "Regenerative practice", "Measured impact"],
    actionKicker: "STAY CLOSE TO THE PROCESS",
    actionTitle: "Invite people into the story without breaking the calm.",
    actionBody: "以克制的订阅或探索入口结束页面，让行动成为叙事的一部分。",
    proof: "LOW-NOISE · MATERIAL-AWARE · RECOVERABLE",
  },
};

const SELECTOR_SAMPLE_BRIEFS: Record<SelectorBriefId, string> = {
  "ai-product": "为「NOVA Copilot」生成一页面向独立开发团队的 AI 产品发布页，重点解释自动化工作流，并推动用户申请试用。",
  "creative-studio": "为「Field Notes Studio」设计一页作品优先的创意工作室主页，面向品牌负责人，目标是展示代表项目并获得合作咨询。",
  "research-platform": "为「Signal Atlas」生成一页面向研究团队的证据平台，重点呈现关系、判断依据与验证状态，并邀请用户查看研究图谱。",
  "sustainable-brand": "为「Moss & Matter」设计一页自然材料品牌主页，面向重视来源的消费者，目标是解释材料实践并建立订阅关系。",
};

const SELECTOR_LAYER_LABELS: Record<SelectorLayer, { index: string; label: string; role: string }> = {
  anchor: { index: "01", label: "SCENE ANCHOR", role: "主视觉锚点" },
  system: { index: "02", label: "SYSTEM LAYER", role: "结构与身份" },
  action: { index: "03", label: "ACTION LAYER", role: "行动与证明" },
};

const SELECTOR_BUDGETS: Record<SelectorBudget, { label: string; cap: RegistryCost; description: string }> = {
  light: { label: "轻量", cap: 1, description: "优先 DOM / 小型 Canvas" },
  balanced: { label: "均衡", cap: 2, description: "允许单一中型 renderer" },
  cinematic: { label: "沉浸", cap: 3, description: "开放重型场景与媒体" },
};

const SELECTOR_REGISTRY: readonly RegistryEntry[] = [
  { id: "liquid", layers: ["anchor"], affinities: ["ai-product", "creative-studio"], devices: ["mobile", "desktop"], cost: 2, measuredCost: "3.22 kB gzip + WebGL", fallback: "CSS gradient + DOM copy", use: "连续材质适合建立产品发布的第一视觉信号", priority: { "ai-product": 24, "creative-studio": 8 } },
  { id: "orbital", layers: ["anchor"], affinities: ["ai-product", "research-platform"], devices: ["mobile", "desktop"], cost: 2, measuredCost: "1.76 kB gzip + Canvas", fallback: "静态轨道构图", use: "球体与轨道可表达系统、模型和协同关系", priority: { "ai-product": 12, "research-platform": 16 } },
  { id: "bloom", layers: ["anchor", "action"], affinities: ["ai-product", "research-platform", "sustainable-brand"], devices: ["mobile", "desktop"], cost: 1, measuredCost: "5.97 kB gzip", fallback: "排版式状态徽章", use: "语义文字与柔和生长形态兼顾表达和轻量预算", priority: { "ai-product": 12, "research-platform": 14, "sustainable-brand": 18 } },
  { id: "gallery-heading", variant: "rising-diagonal", layers: ["anchor", "system"], affinities: ["creative-studio"], devices: ["mobile", "desktop"], cost: 1, measuredCost: "集合入口按需加载", fallback: "静态编辑标题", use: "标题本身承担作品集的节奏和品牌识别", priority: { "creative-studio": 24 } },
  { id: "sketchbook", layers: ["anchor", "system"], affinities: ["creative-studio"], devices: ["desktop"], cost: 3, measuredCost: "15.34 kB gzip + 8.61 MB assets", fallback: "静态作品列表", use: "手绘作品册适合高叙事密度的创作者档案", priority: { "creative-studio": 31 } },
  { id: "gallery", layers: ["anchor"], affinities: ["creative-studio"], devices: ["desktop"], cost: 3, measuredCost: "1,131.99 kB gzip", fallback: "响应式图片网格", use: "空间画廊提供强沉浸作品浏览，但只适合高预算页面", priority: { "creative-studio": 25 } },
  { id: "koi-studies", layers: ["anchor"], affinities: ["creative-studio"], devices: ["desktop"], cost: 3, measuredCost: "约 16.8 MB media HTML", fallback: "压缩封面卡片", use: "文化叙事强，但媒体成本必须经过独立预算", priority: { "creative-studio": 19 } },
  { id: "sylva-living-world", layers: ["anchor"], affinities: ["sustainable-brand"], devices: ["mobile", "desktop"], cost: 3, measuredCost: "约 1.45 MB source assets + WebGL", fallback: "植物静帧 + CSS pollen", use: "真实自然环境能形成最强品牌氛围", priority: { "sustainable-brand": 32 } },
  { id: "sylva-hero", layers: ["anchor"], affinities: ["sustainable-brand"], devices: ["desktop"], cost: 3, measuredCost: "完整同源页面 iframe", fallback: "语义 Hero + 品牌静帧", use: "完整自然品牌首屏适合作为结构迁移参考", priority: { "sustainable-brand": 26 } },
  { id: "woven-cloth", variant: "woven-cloth", layers: ["system"], affinities: ["sustainable-brand", "creative-studio"], devices: ["mobile", "desktop"], cost: 2, measuredCost: "约 14.5 kB gzip", fallback: "CSS 织物纹理", use: "材质层能在不改信息架构的前提下强化触感", priority: { "sustainable-brand": 24, "creative-studio": 12 } },
  { id: "editorial-intro", layers: ["system"], affinities: ["sustainable-brand", "creative-studio", "research-platform"], devices: ["mobile", "desktop"], cost: 1, measuredCost: "DOM / CSS section", fallback: "语义标题和导语", use: "编辑式开场为内容建立低成本层级", priority: { "sustainable-brand": 19, "creative-studio": 18, "research-platform": 10 } },
  { id: "brand", variant: "codex", layers: ["system"], affinities: ["ai-product", "creative-studio"], devices: ["mobile", "desktop"], cost: 2, measuredCost: "42.07 kB gzip + Canvas iframe", fallback: "静态品牌标记", use: "品牌 preset 证明视觉身份可以被参数化选择", priority: { "ai-product": 12, "creative-studio": 21 } },
  { id: "constellation", variant: "constellation-field", layers: ["anchor", "system"], affinities: ["research-platform", "ai-product"], devices: ["mobile", "desktop"], cost: 2, measuredCost: "0.29 kB entry + Canvas runtime", fallback: "SVG 节点关系图", use: "网络结构适合表达系统关系和可观察状态", priority: { "research-platform": 30, "ai-product": 17 } },
  { id: "predictive-arc", variant: "predictive", layers: ["anchor", "system"], affinities: ["research-platform", "ai-product"], devices: ["mobile", "desktop"], cost: 1, measuredCost: "2.48 kB gzip", fallback: "静态预测弧线", use: "低成本信号层可以表达趋势、预测和置信度", priority: { "research-platform": 22, "ai-product": 8 } },
  { id: "diagnostics", variant: "layers", layers: ["system", "action"], affinities: ["research-platform"], devices: ["desktop"], cost: 2, measuredCost: "70.73 kB gzip", fallback: "DOM 状态表", use: "诊断界面把验证和运行状态带入前景", priority: { "research-platform": 20 } },
  { id: "rectangle-buttons", variant: "aster-glass-arrow", layers: ["action"], affinities: ["ai-product", "creative-studio", "research-platform", "sustainable-brand"], devices: ["mobile", "desktop"], cost: 1, measuredCost: "5.46 kB gzip", fallback: "原生 button", use: "轻量 CTA 家族适合承接真实业务动作", priority: { "ai-product": 20, "creative-studio": 14, "research-platform": 12, "sustainable-brand": 14 } },
  { id: "controls", variant: "play", layers: ["action"], affinities: ["ai-product", "creative-studio"], devices: ["mobile", "desktop"], cost: 1, measuredCost: "0.80 kB gzip entry", fallback: "原生圆形 button", use: "真实 onClick 让视觉行动可以回传宿主", priority: { "ai-product": 18, "creative-studio": 13 } },
  { id: "generate-button", layers: ["action"], affinities: ["ai-product", "creative-studio"], devices: ["desktop"], cost: 3, measuredCost: "121.09 kB gzip shared", fallback: "标准生成按钮 + loading", use: "生成动作辨识度最高，但应由预算决定是否启用", priority: { "ai-product": 30, "creative-studio": 12 } },
  { id: "newsletter-footer", layers: ["action"], affinities: ["ai-product", "creative-studio", "research-platform", "sustainable-brand"], devices: ["mobile", "desktop"], cost: 1, measuredCost: "16.45 kB gzip shared", fallback: "原生 email 表单", use: "语义表单为叙事页面提供明确的转化出口", priority: { "ai-product": 10, "creative-studio": 16, "research-platform": 8, "sustainable-brand": 20 } },
  { id: "engraved-certificate", layers: ["action"], affinities: ["creative-studio", "research-platform"], devices: ["mobile", "desktop"], cost: 2, measuredCost: "36.73 kB gzip", fallback: "DOM 凭证卡", use: "凭证视觉适合把成果和可信证明放到收束位置", priority: { "creative-studio": 17, "research-platform": 18 } },
];

function inferBriefBrand(source: string, fallback: string) {
  const quoted = source.match(/[「“\"]([^」”\"]{2,28})[」”\"]/)?.[1]?.trim();
  if (quoted) return quoted;
  const named = source.match(/(?:为|给)\s*([A-Za-z0-9\u4e00-\u9fff·& _-]{2,24}?)(?:打造|设计|生成|制作)/)?.[1]?.trim();
  return named || fallback;
}

function inferBriefAudience(source: string, brief: SelectorBriefId) {
  if (/研究团队|研究者|分析师/.test(source) && /品牌负责人|品牌团队|市场团队/.test(source)) {
    return "研究团队与品牌负责人";
  }
  const rules: readonly [RegExp, string][] = [
    [/独立开发|开发团队|工程团队/, "独立开发与工程团队"],
    [/品牌负责人|品牌团队|市场团队/, "品牌与市场负责人"],
    [/研究团队|研究者|分析师/, "研究团队与分析师"],
    [/消费者|用户社区|生活方式/, "重视来源与体验的消费者"],
    [/创作者|设计师|艺术家/, "创作者与设计决策者"],
  ];
  return rules.find(([pattern]) => pattern.test(source))?.[1] ?? ({
    "ai-product": "需要理解复杂能力的产品用户",
    "creative-studio": "寻找合作对象的品牌负责人",
    "research-platform": "需要验证判断的研究者",
    "sustainable-brand": "重视来源与实践的消费者",
  } satisfies Record<SelectorBriefId, string>)[brief];
}

function inferBriefGoal(source: string, brief: SelectorBriefId) {
  const rules: readonly [RegExp, string][] = [
    [/申请试用|开始试用|体验产品/, "推动合格用户申请试用"],
    [/合作咨询|预约咨询|取得联系/, "获得明确的合作咨询"],
    [/订阅|邮件|保持联系/, "建立可持续的订阅关系"],
    [/研究图谱|查看研究|比较证据/, "引导读者进入研究与证据浏览"],
    [/展示.*项目|代表项目|作品/, "让访客理解并浏览核心作品"],
  ];
  return rules.find(([pattern]) => pattern.test(source))?.[1] ?? ({
    "ai-product": "把产品能力转化为一次明确行动",
    "creative-studio": "用作品证明能力并开启合作",
    "research-platform": "让结论可追踪并可继续验证",
    "sustainable-brand": "解释品牌实践并建立长期关系",
  } satisfies Record<SelectorBriefId, string>)[brief];
}

function compilePageSpec(sourceBrief: string, brief: SelectorBriefId, device: SelectorDevice, budget: SelectorBudget, revision: number, picks: readonly RankedRegistryEntry[]): SelectorPageSpec {
  const profile = SELECTOR_PROFILES[brief];
  const template = SELECTOR_PAGE_COPY[brief];
  const source = sourceBrief.trim() || SELECTOR_SAMPLE_BRIEFS[brief];
  const brand = inferBriefBrand(source, profile.label);
  const audience = inferBriefAudience(source, brief);
  const goal = inferBriefGoal(source, brief);
  const heroTitles: Record<SelectorBriefId, string> = {
    "ai-product": `${brand}，把复杂工作变成清晰进展。`,
    "creative-studio": `${brand}，让每一个作品都有作者感。`,
    "research-platform": `${brand}，让证据成为可浏览的系统。`,
    "sustainable-brand": `${brand}，让自然价值被看见。`,
  };
  const systemTitles: Record<SelectorBriefId, string> = {
    "ai-product": "从模型到结果，每一步都可以被理解。",
    "creative-studio": "先建立作品节奏，再增加视觉表达。",
    "research-platform": "每个结论，都能回到证据与关系。",
    "sustainable-brand": "一套真实身份，应该说明它从哪里来。",
  };
  const actionTitles: Record<SelectorBriefId, string> = {
    "ai-product": "把理解转化为一次明确的试用行动。",
    "creative-studio": "让联系时刻与作品本身一样经过设计。",
    "research-platform": "让一次发现进入下一轮共同验证。",
    "sustainable-brand": "让人进入故事，也能继续参与实践。",
  };
  const cta: Record<SelectorBriefId, string> = {
    "ai-product": source.includes("试用") ? "申请产品试用" : profile.cta,
    "creative-studio": source.includes("咨询") ? "发起合作咨询" : profile.cta,
    "research-platform": source.includes("图谱") ? "查看研究图谱" : profile.cta,
    "sustainable-brand": source.includes("订阅") ? "订阅材料通讯" : profile.cta,
  };
  return {
    schema: "kage.pagespec/0.1",
    source,
    brand,
    audience,
    goal,
    direction: profile.intent,
    device,
    budget,
    revision,
    contentRevision: 0,
    content: {
      hero: { kicker: `${brand.toUpperCase()} · ${profile.kicker}`, title: heroTitles[brief], body: `${brand} 面向${audience}。${profile.body}`, cta: cta[brief] },
      system: { kicker: template.systemKicker, title: systemTitles[brief], body: `${template.systemBody} 当前目标：${goal}。`, features: template.features },
      action: { kicker: template.actionKicker, title: actionTitles[brief], body: template.actionBody, proof: template.proof },
    },
    slots: picks.map((choice) => {
      const demo = DEMOS.find((item) => item.id === choice.entry.id) ?? DEMOS[0];
      return {
        layer: choice.layer,
        role: SELECTOR_LAYER_LABELS[choice.layer].role,
        component: choice.entry.id,
        variant: choice.entry.variant ?? null,
        score: choice.score,
        runtime: demo.runtime,
        measuredCost: choice.entry.measuredCost,
        fallback: choice.entry.fallback,
      };
    }),
  };
}

function createSelectorPlan(brief: SelectorBriefId, device: SelectorDevice, budget: SelectorBudget, revision: number, sourceBrief = SELECTOR_SAMPLE_BRIEFS[brief]): SelectorPlan {
  const cap = SELECTOR_BUDGETS[budget].cap;
  const used = new Set<DemoId>();
  const picks = (["anchor", "system", "action"] as const).map((layer) => {
    const ranked = SELECTOR_REGISTRY
      .filter((entry) => entry.layers.includes(layer) && entry.cost <= cap && !used.has(entry.id))
      .map((entry) => {
        const affinity = entry.affinities.includes(brief);
        const deviceMatch = entry.devices.includes(device);
        const score = Math.min(99, 28 + (affinity ? 24 : 4) + (deviceMatch ? 10 : -6) + (entry.priority[brief] ?? 0) + (cap - entry.cost) * 3);
        return {
          entry,
          layer,
          score,
          reason: `${affinity ? SELECTOR_PROFILES[brief].intent : "补足组合层级"}；${entry.use}${deviceMatch ? "。" : "，当前设备需采用保守加载。"}`,
        };
      })
      .sort((a, b) => b.score - a.score);
    const chosen = ranked[0];
    if (!chosen) throw new Error(`No registry candidate for ${layer}/${budget}`);
    used.add(chosen.entry.id);
    return chosen;
  });
  const excluded = SELECTOR_REGISTRY
    .filter((entry) => entry.affinities.includes(brief) && entry.cost > cap)
    .sort((a, b) => (b.priority[brief] ?? 0) - (a.priority[brief] ?? 0));
  const spec = compilePageSpec(sourceBrief, brief, device, budget, revision, picks);
  return { brief, device, budget, revision, picks, excluded, spec };
}

type ProductSceneId = "signal" | "system" | "identity" | "proof";

const PRODUCT_SCENES = [
  {
    id: "signal" as ProductSceneId,
    index: "01",
    tab: "建立信号",
    kicker: "GENERATIVE WEB SYSTEM",
    title: ["Build sites that", "feel directed."],
    body: "KAGE STUDIO 把品牌 brief 转成一套可解释的页面决策：先确定感受、内容层级和节奏，再调用视觉能力。",
    metrics: [["04", "decision layers"], ["48", "validated renderers"]],
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
    extensions: ["真实 Planner 服务 → kage.pagespec/0.1", "品牌 token → validated props", "目标设备帧时间 → renderer budget"],
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

type StageHealth = "loading" | "ready" | "slow" | "paused" | "failed";

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

function CompleteShelfStage() {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const frame = host.current?.querySelector("iframe");
    const target = new URL("landing-pages/complete-shelf-v2.html", document.baseURI).href;
    if (frame && frame.src !== target) frame.src = target;
  }, []);

  return (
    <div className="collection-stage complete-shelf-stage" ref={host}>
      <CompleteShelfLandingPage headingFont="Georgia" bodyFont="Arial" primaryColor="#c8ff5a" />
    </div>
  );
}

function LocalFrameStage({ sourcePath, className, children }: { sourcePath: string; className: string; children: ReactNode }) {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const frame = host.current?.querySelector("iframe");
    const target = new URL(sourcePath, document.baseURI).href;
    if (frame && frame.src !== target) frame.src = target;
  }, [sourcePath]);

  return <div className={`collection-stage ${className}`} ref={host}>{children}</div>;
}

function ReferenceFrameStage({
  sourcePath,
  className,
  referenceWidth,
  referenceHeight,
  fit = "contain",
  title,
}: {
  sourcePath: string;
  className: string;
  referenceWidth: number;
  referenceHeight: number;
  fit?: "contain" | "cover";
  title: string;
}) {
  const host = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [documentVisible, setDocumentVisible] = useState(() => !document.hidden);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const root = host.current;
    if (!root || typeof IntersectionObserver === "undefined") return undefined;
    const observer = new IntersectionObserver(([entry]) => setIsVisible(entry?.isIntersecting ?? true));
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const update = () => setDocumentVisible(!document.hidden);
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);

  const shouldRender = isVisible && documentVisible;

  useEffect(() => {
    const root = host.current;
    const frame = root?.querySelector("iframe");
    if (!root || !frame) return undefined;

    const fitReferenceFrame = () => {
      const bounds = root.getBoundingClientRect();
      const ratios = [bounds.width / referenceWidth, bounds.height / referenceHeight];
      const scale = fit === "cover" ? Math.max(...ratios) : Math.min(...ratios);
      frame.style.position = "absolute";
      frame.style.left = "50%";
      frame.style.top = "50%";
      frame.style.width = `${referenceWidth}px`;
      frame.style.height = `${referenceHeight}px`;
      frame.style.maxWidth = "none";
      frame.style.maxHeight = "none";
      frame.style.transform = `translate(-50%, -50%) scale(${scale})`;
      frame.style.transformOrigin = "center";
    };

    fitReferenceFrame();
    const observer = new ResizeObserver(fitReferenceFrame);
    observer.observe(root);

    return () => observer.disconnect();
  }, [fit, referenceHeight, referenceWidth, shouldRender]);

  useEffect(() => setLoaded(false), [shouldRender, sourcePath]);

  return (
    <div
      className={`collection-stage ${className}`}
      ref={host}
      role="img"
      aria-label={title}
      data-state={loaded ? "ready" : "loading"}
    >
      {shouldRender ? (
        <iframe
          title={title}
          src={new URL(sourcePath, document.baseURI).href}
          sandbox="allow-scripts"
          loading="eager"
          onLoad={() => setLoaded(true)}
          style={{ border: 0, background: "#4a4d44" }}
        />
      ) : null}
    </div>
  );
}

function BrandShowcase({ variant, speed, reducedMotion }: { variant: BrandOrbVariant; speed: number; reducedMotion: boolean }) {
  const label = BRAND_ORB_VARIANTS.find((option) => option.value === variant)?.label ?? variant;
  return (
    <div className="brand-showcase is-single" aria-label={`${label} 品牌动态球体`}>
      <div className="brand-orb-cell">
        <BrandOrbs variant={variant} size="medium" mode="dark" speed={speed} paused={reducedMotion} aria-label={`${label} 品牌动态球体`} />
        <span>{label.toUpperCase()}</span>
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

function SelectorFallbackVisual({ brief }: { brief: SelectorBriefId }) {
  return <div className={`selector-static-visual is-${brief}`} aria-hidden="true"><i /><i /><i /></div>;
}

function GeneratedCompositionPage({
  plan,
  reducedMotion,
  visible,
  onInspect,
  onOpenDemo,
}: {
  plan: SelectorPlan;
  reducedMotion: boolean;
  visible: boolean;
  onInspect: (id: DemoId) => void;
  onOpenDemo: (id: string) => void;
}) {
  const [activeLayer, setActiveLayer] = useState<SelectorLayer>("anchor");
  const [renderRevision, setRenderRevision] = useState(0);
  const [viewMode, setViewMode] = useState<"experience" | "anatomy">("experience");
  const [expanded, setExpanded] = useState(false);
  const pageRoot = useRef<HTMLDivElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const fullscreenTrigger = useRef<HTMLButtonElement>(null);
  const closeFullscreenButton = useRef<HTMLButtonElement>(null);
  const sections = useRef<Partial<Record<SelectorLayer, HTMLElement | null>>>({});
  const profile = SELECTOR_PROFILES[plan.brief];
  const pageContent = plan.spec.content;

  useEffect(() => {
    const root = viewport.current;
    if (!root || typeof IntersectionObserver === "undefined") return undefined;
    const observer = new IntersectionObserver((entries) => {
      const current = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      const layer = current?.target.getAttribute("data-composition-layer") as SelectorLayer | null;
      if (layer) setActiveLayer(layer);
    }, { root, threshold: [0.35, 0.55, 0.75] });
    (Object.values(sections.current) as Array<HTMLElement | null | undefined>).forEach((section) => {
      if (section) observer.observe(section);
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!expanded) return undefined;
    const previousOverflow = document.body.style.overflow;
    const closeFullscreen = () => {
      setExpanded(false);
      window.requestAnimationFrame(() => fullscreenTrigger.current?.focus());
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeFullscreen();
        return;
      }
      if (event.key !== "Tab") return;
      const focusable = Array.from(pageRoot.current?.querySelectorAll<HTMLElement>("button:not([disabled]), [href], [tabindex]:not([tabindex='-1'])") ?? []);
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && (document.activeElement === first || !pageRoot.current?.contains(document.activeElement))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (document.activeElement === last || !pageRoot.current?.contains(document.activeElement))) {
        event.preventDefault();
        first.focus();
      }
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    window.requestAnimationFrame(() => closeFullscreenButton.current?.focus());
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [expanded]);

  const showLayer = (layer: SelectorLayer) => {
    setActiveLayer(layer);
    const root = viewport.current;
    const section = sections.current[layer];
    if (root && section) root.scrollTo({ top: section.offsetTop, behavior: reducedMotion ? "auto" : "smooth" });
  };

  const renderChoice = (choice: RankedRegistryEntry) => {
    const demo = DEMOS.find((item) => item.id === choice.entry.id) ?? DEMOS[0];
    const variant = choice.entry.variant ?? demo.defaultVariant ?? "";
    if (!visible || activeLayer !== choice.layer) {
      return <div className="generated-scene-standby"><SelectorFallbackVisual brief={plan.brief} /><span>STANDBY · SCROLL TO ACTIVATE</span></div>;
    }
    return (
      <StageErrorBoundary key={`${choice.entry.id}-${renderRevision}`} onRetry={() => setRenderRevision((revision) => revision + 1)}>
        <Suspense fallback={<div className="product-loading" role="status"><i /> Loading composition renderer</div>}>
          <DemoStage id={choice.entry.id} intensity={0.66} speed={reducedMotion ? 0 : 0.58} hue={plan.brief === "sustainable-brand" ? 98 : plan.brief === "creative-studio" ? 24 : 196} variant={variant} reducedMotion={reducedMotion} onCssAction={() => undefined} />
        </Suspense>
      </StageErrorBoundary>
    );
  };

  const anchor = plan.picks.find((choice) => choice.layer === "anchor") ?? plan.picks[0];
  const system = plan.picks.find((choice) => choice.layer === "system") ?? plan.picks[1];
  const action = plan.picks.find((choice) => choice.layer === "action") ?? plan.picks[2];
  const choiceTitle = (choice: RankedRegistryEntry) => DEMOS.find((item) => item.id === choice.entry.id)?.title ?? choice.entry.id;
  const activeChoice = plan.picks.find((choice) => choice.layer === activeLayer) ?? anchor;
  const activeDemo = DEMOS.find((item) => item.id === activeChoice.entry.id) ?? DEMOS[0];
  const activeLabel = SELECTOR_LAYER_LABELS[activeLayer];

  const toggleFullscreen = () => {
    if (expanded) {
      setExpanded(false);
      window.requestAnimationFrame(() => fullscreenTrigger.current?.focus());
      return;
    }
    setExpanded(true);
  };

  const inspectChoice = (id: DemoId) => {
    if (!expanded) {
      onInspect(id);
      return;
    }
    setExpanded(false);
    window.requestAnimationFrame(() => onInspect(id));
  };

  const openLiveDemo = (id: string) => {
    if (!expanded) {
      onOpenDemo(id);
      return;
    }
    setExpanded(false);
    window.requestAnimationFrame(() => onOpenDemo(id));
  };

  return (
    <div ref={pageRoot} className={`generated-page${expanded ? " is-expanded" : ""}${viewMode === "anatomy" ? " is-anatomy" : ""}`} data-brief={plan.brief} data-active-layer={activeLayer} role={expanded ? "dialog" : undefined} aria-modal={expanded || undefined} aria-label={expanded ? `${plan.spec.brand} 生成网页全屏预览` : undefined}>
      <div className="generated-browser-bar"><div className="generated-browser-dots" aria-hidden="true"><i /><i /><i /></div><span>preview.kage.local/{plan.spec.brand.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || plan.brief}</span><strong><i />1 ACTIVE RENDERER</strong></div>
      <nav className="generated-page-nav" aria-label="生成网页段落">
        <span><strong>{plan.spec.brand} / {profile.short}</strong><small>PAGESPEC R{String(plan.revision).padStart(2, "0")}.{plan.spec.contentRevision} · GENERATED EXPERIENCE</small></span>
        <div>{plan.picks.map((choice) => {
          const label = SELECTOR_LAYER_LABELS[choice.layer];
          return <button key={choice.layer} type="button" aria-pressed={activeLayer === choice.layer} onClick={() => showLayer(choice.layer)}>{label.index} {label.role}</button>;
        })}</div>
      </nav>
      <div className="generated-page-toolbar">
        <div className="generated-view-switch" role="group" aria-label="成品展示深度">
          <button type="button" aria-pressed={viewMode === "experience"} onClick={() => setViewMode("experience")}><span>01</span> 成品视图</button>
          <button type="button" aria-pressed={viewMode === "anatomy"} onClick={() => setViewMode("anatomy")}><span>02</span> 集成透视</button>
        </div>
        <p><span>OUTPUT</span><strong>{plan.spec.brand}</strong><small>{plan.device === "mobile" ? "MOBILE FIRST" : "DESKTOP FIRST"} · {SELECTOR_BUDGETS[plan.budget].label.toUpperCase()}</small></p>
        <button ref={expanded ? closeFullscreenButton : fullscreenTrigger} className="generated-expand-button" type="button" aria-pressed={expanded} onClick={toggleFullscreen}>{expanded ? "退出全屏 · ESC" : "全屏体验 ↗"}</button>
      </div>
      {viewMode === "anatomy" ? (
        <div className="generated-anatomy-strip" role="status" aria-live="polite">
          <header><span>INTEGRATION TRACE / ACTIVE</span><strong>{activeLabel.index} · {activeLabel.role}</strong></header>
          <dl>
            <div><dt>HOST ROLE</dt><dd>{activeLayer === "anchor" ? "首屏叙事与主行动" : activeLayer === "system" ? "能力说明与产品证据" : "转化行动与可信收束"}</dd></div>
            <div><dt>THREEUI SLOT</dt><dd>{activeDemo.title}<code>{activeChoice.entry.id}</code></dd></div>
            <div><dt>RUNTIME / COST</dt><dd>{activeDemo.runtime}<code>{activeChoice.entry.measuredCost}</code></dd></div>
            <div><dt>FALLBACK</dt><dd>{activeChoice.entry.fallback}</dd></div>
          </dl>
          <p>{activeChoice.reason}</p>
        </div>
      ) : null}
      <div className="generated-page-viewport" ref={viewport} tabIndex={0} aria-label="可滚动的三段式生成网页">
        <section className="generated-page-scene generated-hero-scene" data-composition-layer="anchor" data-scene-state={activeLayer === "anchor" ? "active" : "standby"} ref={(node) => { sections.current.anchor = node; }}>
          <div className="generated-scene-renderer" data-boundary="THREEUI / VISUAL LAYER" aria-hidden="true" inert>{renderChoice(anchor)}</div><div className="generated-scene-shade" aria-hidden="true" />
          <span className="generated-visual-boundary-label" aria-hidden="true">THREEUI / VISUAL LAYER</span>
          <div className="generated-hero-copy" data-boundary="HOST DOM / PRODUCT CONTENT"><span>{pageContent.hero.kicker}</span><h3>{pageContent.hero.title}</h3><p>{pageContent.hero.body}</p><div><button type="button" onClick={() => showLayer("system")}>{pageContent.hero.cta} <ArrowIcon /></button><small>USES · {choiceTitle(anchor)}</small></div></div>
          <div className="generated-proof-rail" aria-label="生成网页工程证据"><div><strong>43</strong><span>VALIDATED FAMILIES</span></div><div><strong>01</strong><span>ACTIVE RENDERER</span></div><div><strong>READY</strong><span>DOM FALLBACK</span></div></div>
          <aside><strong>{anchor.score}</strong><span>MATCH / 100</span><small>SCENE ANCHOR</small></aside>
        </section>

        <section className="generated-page-scene generated-system-scene" data-composition-layer="system" data-scene-state={activeLayer === "system" ? "active" : "standby"} ref={(node) => { sections.current.system = node; }}>
          <div className="generated-system-copy" data-boundary="HOST DOM / PRODUCT CONTENT"><span>{pageContent.system.kicker}</span><h3>{pageContent.system.title}</h3><p>{pageContent.system.body}</p><ol>{pageContent.system.features.map((feature, index) => <li key={feature}><span>0{index + 1}</span><strong>{feature}</strong></li>)}</ol><button type="button" onClick={() => showLayer("action")}>继续到行动层 <ArrowIcon /></button></div>
          <div className="generated-system-visual"><div className="generated-scene-renderer" data-boundary="THREEUI / VISUAL LAYER" aria-hidden="true" inert>{renderChoice(system)}</div><div className="generated-system-label"><span>SYSTEM LAYER · {system.score}</span><strong>{choiceTitle(system)}</strong><button type="button" onClick={() => inspectChoice(system.entry.id)}>单项检查</button></div></div>
        </section>

        <section className="generated-page-scene generated-action-scene" data-composition-layer="action" data-scene-state={activeLayer === "action" ? "active" : "standby"} ref={(node) => { sections.current.action = node; }}>
          <div className="generated-scene-shade" aria-hidden="true" />
          <div className="generated-action-copy" data-boundary="HOST DOM / PRODUCT CONTENT"><span>{pageContent.action.kicker}</span><h3>{pageContent.action.title}</h3><p>{pageContent.action.body}</p><button type="button" onClick={() => openLiveDemo(action.entry.id)}>{pageContent.hero.cta} <ArrowIcon /></button><small>DEMO CTA OPENS LIVE LAB · {choiceTitle(action)}</small></div>
          <div className="generated-action-visual"><div className="generated-scene-renderer" data-boundary="THREEUI / VISUAL LAYER" aria-hidden="true" inert>{renderChoice(action)}</div><div className="generated-system-label"><span>ACTION LAYER · {action.score}</span><strong>{choiceTitle(action)}</strong><button type="button" onClick={() => inspectChoice(action.entry.id)}>单项检查</button></div></div>
          <footer><strong>{pageContent.action.proof}</strong><span>THREEUI REGISTRY · BROWSER VERIFIED</span></footer>
        </section>
      </div>
      <div className="generated-page-status"><span>COMPOSITION POLICY</span><strong>{activeLabel.index} · {choiceTitle(activeChoice)}</strong><small>3 PAGE SLOTS · 1 LIVE RENDERER · DOM CONTENT PERSISTS</small></div>
    </div>
  );
}

function VisualRegistrySelector({ reducedMotion, onOpenDemo }: { reducedMotion: boolean; onOpenDemo: (id: string) => void }) {
  const [draftBrief, setDraftBrief] = useState<SelectorBriefId>("ai-product");
  const [draftSource, setDraftSource] = useState(SELECTOR_SAMPLE_BRIEFS["ai-product"]);
  const [draftDevice, setDraftDevice] = useState<SelectorDevice>("mobile");
  const [draftBudget, setDraftBudget] = useState<SelectorBudget>("balanced");
  const [plan, setPlan] = useState<SelectorPlan>(() => createSelectorPlan("ai-product", "mobile", "balanced", 1));
  const [previewId, setPreviewId] = useState<DemoId>(() => plan.picks[0].entry.id);
  const [visible, setVisible] = useState(false);
  const [renderRevision, setRenderRevision] = useState(0);
  const [outputMode, setOutputMode] = useState<"composition" | "inspect">("composition");
  const [editorOpen, setEditorOpen] = useState(false);
  const [editorDraft, setEditorDraft] = useState<SelectorPageContent>(() => plan.spec.content);
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">("idle");
  const host = useRef<HTMLDivElement>(null);
  const editorTitleInput = useRef<HTMLInputElement>(null);
  const editorTrigger = useRef<HTMLButtonElement>(null);
  const dirty = draftBrief !== plan.brief || draftDevice !== plan.device || draftBudget !== plan.budget || draftSource.trim() !== plan.spec.source;
  const displayPlan: SelectorPlan = editorOpen ? { ...plan, spec: { ...plan.spec, content: editorDraft } } : plan;
  const activeChoice = plan.picks.find((candidate) => candidate.entry.id === previewId) ?? plan.picks[0];
  const activeDemo = DEMOS.find((demo) => demo.id === activeChoice.entry.id) ?? DEMOS[0];
  const activeVariant = activeChoice.entry.variant ?? activeDemo.defaultVariant ?? "";
  const manifest = {
    engine: "local-deterministic-planner-adapter / threeui-1.2.0-probe-data",
    revision: `R${String(plan.revision).padStart(2, "0")}`,
    brief: plan.brief,
    pageSpec: displayPlan.spec,
    constraints: { device: plan.device, budget: plan.budget, maxCostLevel: SELECTOR_BUDGETS[plan.budget].cap },
    composition: plan.picks.map((candidate) => ({
      layer: candidate.layer,
      component: candidate.entry.id,
      variant: candidate.entry.variant ?? null,
      score: candidate.score,
      fallback: candidate.entry.fallback,
    })),
    pageComposition: {
      sections: ["hero", "system", "action"],
      mode: "single-active-renderer",
      activeVisualLimit: 1,
      semanticContent: "host-dom",
    },
    excludedByBudget: plan.excluded.map((entry) => entry.id),
  };

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

  const generatePlan = () => {
    const nextPlan = createSelectorPlan(draftBrief, draftDevice, draftBudget, plan.revision + 1, draftSource);
    setPlan(nextPlan);
    setDraftSource(nextPlan.spec.source);
    setEditorDraft(nextPlan.spec.content);
    setEditorOpen(false);
    setCopyState("idle");
    setPreviewId(nextPlan.picks[0].entry.id);
    setRenderRevision((revision) => revision + 1);
    setOutputMode("composition");
  };

  const selectBriefPreset = (nextBrief: SelectorBriefId) => {
    setDraftSource((current) => current.trim() === "" || current === plan.spec.source || Object.values(SELECTOR_SAMPLE_BRIEFS).includes(current) ? SELECTOR_SAMPLE_BRIEFS[nextBrief] : current);
    setDraftBrief(nextBrief);
    setCopyState("idle");
  };

  const openEditor = () => {
    setEditorDraft(plan.spec.content);
    setEditorOpen(true);
    setOutputMode("composition");
    setCopyState("idle");
    window.requestAnimationFrame(() => editorTitleInput.current?.focus());
  };

  const cancelEditor = () => {
    setEditorDraft(plan.spec.content);
    setEditorOpen(false);
    window.requestAnimationFrame(() => editorTrigger.current?.focus());
  };

  const saveEditor = () => {
    setPlan((current) => ({
      ...current,
      spec: { ...current.spec, content: editorDraft, contentRevision: current.spec.contentRevision + 1 },
    }));
    setEditorOpen(false);
    setCopyState("idle");
    window.requestAnimationFrame(() => editorTrigger.current?.focus());
  };

  const copyPageSpec = async () => {
    const value = JSON.stringify(displayPlan.spec, null, 2);
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(value);
      } else {
        const helper = document.createElement("textarea");
        try {
          helper.value = value;
          helper.setAttribute("readonly", "");
          helper.style.position = "fixed";
          helper.style.opacity = "0";
          document.body.appendChild(helper);
          helper.select();
          if (!document.execCommand("copy")) throw new Error("Clipboard unavailable");
        } finally {
          helper.remove();
        }
      }
      setCopyState("copied");
    } catch {
      setCopyState("failed");
    }
  };

  const selectCandidate = (id: DemoId) => {
    setPreviewId(id);
    setRenderRevision((revision) => revision + 1);
    setOutputMode("inspect");
  };

  const moveOutputMode = (event: ReactKeyboardEvent<HTMLButtonElement>) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const nextMode = event.key === "Home" ? "composition" : event.key === "End" ? "inspect" : outputMode === "composition" ? "inspect" : "composition";
    setOutputMode(nextMode);
    window.requestAnimationFrame(() => document.getElementById(`selector-mode-${nextMode}`)?.focus());
  };

  return (
    <section className="registry-selector" id="selector" aria-labelledby="selector-title">
      <div className="selector-heading">
        <div><p>PROTOTYPE / BRIEF → PAGESPEC → THREEUI</p><h2 id="selector-title">从一句真实需求，<br /><em>生成可解释网页。</em></h2></div>
        <p>输入自然语言 Brief，再用方向、设备和预算约束本地 Planner adapter。系统会编译 PageSpec、选择三层视觉、生成可编辑成品并导出 JSON；当前仍是确定性前端实现，不冒充远程 AI。</p>
      </div>

      <div className="selector-shell" ref={host} data-selector-state={dirty ? "dirty" : "ready"}>
        <aside className="selector-controls" aria-label="自动选型约束">
          <header><span>PLANNER INPUT</span><strong>01 / BRIEF TO SPEC</strong></header>

          <div className="selector-brief-input">
            <label htmlFor="selector-source-brief"><span>NATURAL LANGUAGE BRIEF</span><small>产品、受众、目标和期望行动</small></label>
            <textarea id="selector-source-brief" value={draftSource} maxLength={280} onChange={(event) => { setDraftSource(event.target.value); setCopyState("idle"); }} />
            <div><span>{draftSource.length} / 280</span><button type="button" onClick={() => { setDraftSource(SELECTOR_SAMPLE_BRIEFS[draftBrief]); setCopyState("idle"); }}>载入当前示例</button></div>
          </div>

          <fieldset className="selector-briefs">
            <legend>视觉方向 preset</legend>
            {Object.entries(SELECTOR_PROFILES).map(([id, item]) => (
              <button key={id} type="button" aria-pressed={draftBrief === id} onClick={() => selectBriefPreset(id as SelectorBriefId)}><span>{item.short}</span><strong>{item.label}</strong></button>
            ))}
          </fieldset>

          <fieldset className="selector-segmented">
            <legend>设备优先级</legend>
            <div>{(["mobile", "desktop"] as const).map((device) => <button key={device} type="button" aria-pressed={draftDevice === device} onClick={() => setDraftDevice(device)}>{device === "mobile" ? "移动优先" : "桌面优先"}</button>)}</div>
          </fieldset>

          <fieldset className="selector-budget">
            <legend>性能预算</legend>
            {Object.entries(SELECTOR_BUDGETS).map(([id, item]) => (
              <button key={id} type="button" aria-pressed={draftBudget === id} onClick={() => setDraftBudget(id as SelectorBudget)}><span>0{item.cap}</span><strong>{item.label}</strong><small>{item.description}</small></button>
            ))}
          </fieldset>

          <div className="selector-run-state" role="status" aria-live="polite"><i className={dirty ? "is-dirty" : ""} /><span>{dirty ? "输入或约束已修改，当前成品尚未更新" : `PageSpec 已编译 · R${String(plan.revision).padStart(2, "0")}.${plan.spec.contentRevision}`}</span></div>
          <button className="selector-generate" type="button" onClick={generatePlan}>{dirty ? "编译 PageSpec 并生成" : "重新编译当前 Brief"}<ArrowIcon /></button>
          <p className="selector-truth">LOCAL DETERMINISTIC ADAPTER<br />关键词提取 + preset + 固定模板，不调用远程模型。</p>
        </aside>

        <div className="selector-output">
          <header className="selector-output-header"><div><span>OUTPUT / COMPILED PAGESPEC</span><strong>{displayPlan.spec.brand} · {plan.device === "mobile" ? "移动优先" : "桌面优先"}</strong></div><div><small>BUDGET</small><strong>{SELECTOR_BUDGETS[plan.budget].label.toUpperCase()}</strong></div></header>

          <section className="selector-pagespec" aria-labelledby="selector-pagespec-title" data-editor-state={editorOpen ? "editing" : "saved"}>
            <header>
              <div><span>02 / PAGESPEC</span><h3 id="selector-pagespec-title">{displayPlan.spec.brand}</h3><small>{displayPlan.spec.schema} · R{String(displayPlan.spec.revision).padStart(2, "0")}.{displayPlan.spec.contentRevision}</small></div>
              <div>{!editorOpen ? <button ref={editorTrigger} type="button" aria-expanded="false" aria-controls="selector-pagespec-editor" onClick={openEditor}>编辑页面内容</button> : null}<button type="button" onClick={copyPageSpec}>{editorOpen ? "复制预览 JSON" : "复制 PageSpec JSON"}</button></div>
            </header>
            <p className="selector-pagespec-source"><span>SOURCE BRIEF</span>{displayPlan.spec.source}</p>
            <dl><div><dt>AUDIENCE</dt><dd>{displayPlan.spec.audience}</dd></div><div><dt>GOAL</dt><dd>{displayPlan.spec.goal}</dd></div><div><dt>DIRECTION</dt><dd>{displayPlan.spec.direction}</dd></div><div><dt>SLOTS</dt><dd>{displayPlan.spec.slots.map((slot) => slot.component).join(" · ")}</dd></div></dl>
            <div className="selector-copy-state" role="status" aria-live="polite" data-copy-state={copyState}>{copyState === "copied" ? "PageSpec JSON 已复制，可交给下游生成器。" : copyState === "failed" ? "浏览器拒绝剪贴板访问；可展开下方机器结果手动复制。" : editorOpen ? "正在预览未保存内容；保存后会生成新的内容修订号。" : "内容、视觉槽位与预算来自同一份 PageSpec。"}</div>
            {editorOpen ? (
              <div className="selector-pagespec-editor" id="selector-pagespec-editor">
                <header><span>CONTENT OVERRIDES</span><strong>编辑宿主 DOM，不重新选择 renderer</strong></header>
                <div>
                  <label><span>HERO TITLE</span><input ref={editorTitleInput} value={editorDraft.hero.title} maxLength={88} onChange={(event) => setEditorDraft((current) => ({ ...current, hero: { ...current.hero, title: event.target.value } }))} /></label>
                  <label className="is-wide"><span>HERO BODY</span><textarea value={editorDraft.hero.body} maxLength={240} onChange={(event) => setEditorDraft((current) => ({ ...current, hero: { ...current.hero, body: event.target.value } }))} /></label>
                  <label><span>HERO CTA</span><input value={editorDraft.hero.cta} maxLength={32} onChange={(event) => setEditorDraft((current) => ({ ...current, hero: { ...current.hero, cta: event.target.value } }))} /></label>
                  <label><span>SYSTEM TITLE</span><input value={editorDraft.system.title} maxLength={88} onChange={(event) => setEditorDraft((current) => ({ ...current, system: { ...current.system, title: event.target.value } }))} /></label>
                  <label><span>ACTION TITLE</span><input value={editorDraft.action.title} maxLength={88} onChange={(event) => setEditorDraft((current) => ({ ...current, action: { ...current.action, title: event.target.value } }))} /></label>
                </div>
                <footer><button type="button" onClick={cancelEditor}>取消改动</button><button type="button" onClick={saveEditor}>保存到 PageSpec</button></footer>
              </div>
            ) : null}
          </section>

          <div className="selector-candidates" role="tablist" aria-label="推荐视觉组合">
            {plan.picks.map((candidate, index) => {
              const demo = DEMOS.find((item) => item.id === candidate.entry.id) ?? DEMOS[0];
              const layer = SELECTOR_LAYER_LABELS[candidate.layer];
              const selected = candidate.entry.id === activeChoice.entry.id;
              return (
                <button key={`${candidate.layer}-${candidate.entry.id}`} id={`selector-candidate-${candidate.entry.id}`} type="button" role="tab" aria-selected={selected} aria-controls="selector-output-surface" tabIndex={selected ? 0 : -1} onClick={() => selectCandidate(candidate.entry.id)} onKeyDown={(event) => {
                  if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
                  event.preventDefault();
                  const offset = event.key === "ArrowRight" ? 1 : -1;
                  const next = plan.picks[(index + offset + plan.picks.length) % plan.picks.length];
                  selectCandidate(next.entry.id);
                  window.requestAnimationFrame(() => document.getElementById(`selector-candidate-${next.entry.id}`)?.focus());
                }}>
                  <span>{layer.index} / {layer.label}</span><em>{candidate.score}</em><strong>{demo.title}</strong><small>{layer.role} · 成本 L{candidate.entry.cost}</small>
                </button>
              );
            })}
          </div>

          <div className="selector-output-modes" role="tablist" aria-label="选择输出查看方式">
            <button id="selector-mode-composition" type="button" role="tab" aria-selected={outputMode === "composition"} aria-controls="selector-output-surface" tabIndex={outputMode === "composition" ? 0 : -1} onClick={() => setOutputMode("composition")} onKeyDown={moveOutputMode}><span>01</span><strong>组合成品</strong><small>真实三段网页</small></button>
            <button id="selector-mode-inspect" type="button" role="tab" aria-selected={outputMode === "inspect"} aria-controls="selector-output-surface" tabIndex={outputMode === "inspect" ? 0 : -1} onClick={() => setOutputMode("inspect")} onKeyDown={moveOutputMode}><span>02</span><strong>单项检查</strong><small>组件与成本</small></button>
          </div>

          <div id="selector-output-surface" className="selector-output-surface" role="tabpanel" aria-labelledby={outputMode === "composition" ? "selector-mode-composition" : "selector-mode-inspect"}>
            {outputMode === "composition" ? (
              <GeneratedCompositionPage key={`${plan.revision}-${plan.brief}-${plan.device}-${plan.budget}`} plan={displayPlan} reducedMotion={reducedMotion} visible={visible} onInspect={selectCandidate} onOpenDemo={onOpenDemo} />
            ) : (
              <div className="selector-preview-stage" id="selector-preview-stage" aria-labelledby={`selector-candidate-${activeChoice.entry.id}`} data-preview={activeChoice.entry.id}>
                <StageErrorBoundary key={`${activeChoice.entry.id}-${renderRevision}`} onRetry={() => setRenderRevision((revision) => revision + 1)}>
                  <Suspense fallback={<div className="product-loading" role="status"><i /> Loading selected renderer</div>}>
                    <div className="selector-preview-renderer" aria-hidden="true" inert>
                      {visible ? <DemoStage id={activeChoice.entry.id} intensity={0.66} speed={reducedMotion ? 0 : 0.58} hue={plan.brief === "sustainable-brand" ? 98 : plan.brief === "creative-studio" ? 24 : 196} variant={activeVariant} reducedMotion={reducedMotion} onCssAction={() => undefined} /> : <SelectorFallbackVisual brief={plan.brief} />}
                    </div>
                  </Suspense>
                </StageErrorBoundary>
                <div className="selector-preview-shade" aria-hidden="true" />
                <div className="selector-preview-copy">
                  <span>{displayPlan.spec.content.hero.kicker}</span><h3>{displayPlan.spec.content.hero.title}</h3><p>{displayPlan.spec.content.hero.body}</p>
                  <div><button type="button" onClick={() => onOpenDemo(activeChoice.entry.id)}>在 Live Lab 检查<ArrowIcon /></button><small>PREVIEWING · {activeDemo.title}</small></div>
                </div>
                <div className="selector-preview-score"><span>MATCH SCORE</span><strong>{activeChoice.score}</strong><small>/ 100</small></div>
              </div>
            )}
          </div>

          <div className="selector-evidence-grid">
            <article><span>WHY SELECTED</span><h3>{activeDemo.title}</h3><p>{activeChoice.reason}</p><dl><div><dt>运行时</dt><dd>{activeDemo.runtime}</dd></div><div><dt>已知成本</dt><dd>{activeChoice.entry.measuredCost}</dd></div><div><dt>Fallback</dt><dd>{activeChoice.entry.fallback}</dd></div></dl></article>
            <article className="selector-exclusions"><span>BUDGET FILTER</span><h3>{plan.excluded.length ? `已排除 ${plan.excluded.length} 个重型候选` : "当前方向没有超预算候选"}</h3>{plan.excluded.length ? <ul>{plan.excluded.slice(0, 4).map((entry) => { const demo = DEMOS.find((item) => item.id === entry.id) ?? DEMOS[0]; return <li key={entry.id}><strong>{demo.title}</strong><small>{entry.measuredCost}</small></li>; })}</ul> : <p>{plan.budget === "cinematic" ? "沉浸预算允许 Registry 比较完整页面、媒体和重型 WebGL；运行时仍只挂载当前预览。" : "当前视觉方向中的候选均在本次成本上限内；运行时仍只挂载当前预览。"}</p>}</article>
          </div>

          <details className="selector-manifest"><summary>查看本次机器可读选择结果</summary><pre>{JSON.stringify(manifest, null, 2)}</pre></details>
        </div>
      </div>
    </section>
  );
}

function DemoStage({ id, intensity, speed, hue, variant, reducedMotion, onCssAction }: {
  id: DemoId;
  intensity: number;
  speed: number;
  hue: number;
  variant: string;
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
      {id === "condensation" ? <ElementsCollection variant={variant as ElementsVariant} mode="dark" speed={speed} size={0.78 + intensity * 0.42} particleAmount={0.72 + intensity * 0.7} dropAmount={0.45 + intensity * 1.15} opacity={0.72 + intensity * 0.26} hue={hue - 196} saturation={0.86 + intensity * 0.38} brightness={0.82 + intensity * 0.36} /> : null}
      {id === "orbital" ? <OrbitalSphereBackground speed={speed} particleSize={0.009 + intensity * 0.012} particleOpacity={0.55 + intensity * 0.4} orbitOpacity={0.14 + intensity * 0.28} haloOpacity={0.1 + intensity * 0.32} scale={0.82 + intensity * 0.32} hue={hue - 220} /> : null}
      {id === "controls" ? (
        <div className="css-control-stage">
          <div className="css-control-copy" aria-hidden="true"><span>SEMANTIC CONTROL</span><strong>DOM is part of the visual system.</strong></div>
          <CircleButtons variant={variant as CircleButtonVariant} mode="dark" hue={hue - 160} saturation={0.8 + intensity * 0.65} brightness={0.82 + intensity * 0.38} ariaLabel={`触发 ${variant} 按钮交互`} onClick={onCssAction} />
        </div>
      ) : null}
      {id === "crt" ? <CrtBackground variant={variant as CrtVariant} speed={speed} typeSpeed={speed} motion={0.35 + intensity} brightness={0.8 + intensity * 0.35} opacity={1} hue={hue - 196} saturation={0.8 + intensity * 0.4} /> : null}
      {id === "vortex" ? <TypographyVortexCanvas mode="dark" phrase="THREEUI / VISUAL SYSTEM / " speed={speed} ringGrowth={0.7 + intensity * 0.8} opacity={0.8 + intensity * 0.2} dissolveRadius={0.8 + intensity * 0.5} particleAmount={0.65 + intensity * 0.75} /> : null}
      {id === "tree" ? <GenerativeTree speed={Math.max(0.35, speed * 1.7)} size={0.78 + intensity * 0.5} particleAmount={0.75 + intensity * 1.1} opacity={0.85 + intensity * 0.15} hue={hue - 196} saturation={1.1} brightness={0.95 + intensity * 0.35} /> : null}
      {id === "bloom" ? <SemanticBloom text="VISUAL SYSTEM" mode="dark" size={0.72 + intensity * 0.5} opacity={0.62 + intensity * 0.35} /> : null}
      {id === "dock" ? <AnimatedTopDock variant={variant as DockVariant} proximity={100 + intensity * 70} widthGrowth={12 + intensity * 14} heightGrowth={10 + intensity * 16} speed={speed} particles={14 + Math.round(intensity * 22)} /> : null}
      {id === "brand" ? <BrandShowcase variant={variant as BrandOrbVariant} speed={speed} reducedMotion={reducedMotion} /> : null}
      {id === "gauges" ? <PerformanceGauges variant={variant as GaugeVariant} mode="dark" hue={hue - 196} saturation={0.9 + intensity * 0.35} brightness={0.85 + intensity * 0.35} /> : null}
      {id === "toggle" ? <SkeuomorphicToggleCollection variant={variant as ToggleVariant} mode="dark" speed={speed} size={0.8 + intensity * 0.45} opacity={0.78 + intensity * 0.22} hue={hue - 196} saturation={1.1} brightness={1.05} onChange={onCssAction} label={`${variant} toggle`} /> : null}
      {id === "kage" ? <KageStage /> : null}
      {id === "warp" ? <WarpFieldBackground variant={variant as WarpVariant} speed={Math.max(0, speed * 15)} streakOpacity={0.28 + intensity * 0.52} tileOpacity={0.45 + intensity * 0.55} fov={62 + intensity * 28} hue={hue - 196} saturation={0.82 + intensity * 0.48} brightness={0.72 + intensity * 0.5} /> : null}
      {id === "landscape" ? <div className="collection-stage landscape-stage"><LandscapeScene sourceUrl={new URL("landscape.html", document.baseURI).href} variant={variant as LandscapeVariant} /></div> : null}
      {id === "text-animation" ? (
        <div className="collection-stage text-animation-stage">
          {variant === "article-headings" ? (
            <TextAnimationCollection variant="article-headings" mode="dark" duration={Math.round(760 / Math.max(speed, 0.2))} stagger={Math.round(160 / Math.max(speed, 0.2))} scrambleLength={Math.round(8 + intensity * 8)} preserveChance={0.2 + intensity * 0.24} tailChance={0.12 + intensity * 0.2} />
          ) : (
            <TextAnimationCollection variant={variant as Exclude<TextAnimationVariant, "article-headings">} mode="dark" hue={hue - 196} saturation={0.86 + intensity * 0.45} brightness={0.8 + intensity * 0.42} />
          )}
        </div>
      ) : null}
      {id === "rectangle-buttons" ? <div className="collection-stage rectangle-button-stage"><RectangleButtons variant={variant as RectangleButtonVariant} mode="dark" hue={hue - 196} saturation={0.85 + intensity * 0.5} brightness={0.84 + intensity * 0.38} /></div> : null}
      {id === "uplink" ? <div className="collection-stage uplink-stage"><UplinkLoader /></div> : null}
      {id === "bookshelf" ? <div className="collection-stage bookshelf-stage"><BookshelfScene /></div> : null}
      {id === "structure-flow" ? <div className="collection-stage structure-flow-stage"><StructureFlowCollection variant={variant as StructureFlowVariant} mode="dark" speed={speed} opacity={0.72 + intensity * 0.28} hue={hue - 196} saturation={0.85 + intensity * 0.45} brightness={0.78 + intensity * 0.45} /></div> : null}
      {id === "portal-field" ? <div className="collection-stage portal-field-stage"><PortalFieldCollection variant={variant as PortalFieldVariant} mode="dark" speed={speed} size={0.72 + intensity * 0.5} length={0.72 + intensity * 0.62} density={0.68 + intensity * 0.62} opacity={0.72 + intensity * 0.28} hue={hue - 196} saturation={0.85 + intensity * 0.45} brightness={0.78 + intensity * 0.45} /></div> : null}
      {id === "gallery-heading" ? <div className="collection-stage gallery-heading-stage"><GalleryHeading variant={variant as GalleryHeadingVariant} mode="dark" headlineSize={0.84 + intensity * 0.34} hue={hue - 196} saturation={0.88 + intensity * 0.35} brightness={0.88 + intensity * 0.3} /></div> : null}
      {id === "diagnostics" ? <div className="collection-stage diagnostics-stage"><DiagnosticsPanel variant={variant as DiagnosticsVariant} mode="dark" speed={speed} size={0.8 + intensity * 0.4} opacity={0.82 + intensity * 0.18} hue={hue - 196} saturation={0.9 + intensity * 0.35} brightness={0.9 + intensity * 0.25} /></div> : null}
      {id === "woven-cloth" ? <div className="collection-stage woven-cloth-stage"><WovenCloth variant={variant as WovenClothVariant} mode="dark" hue={hue - 196} saturation={0.8 + intensity * 0.48} brightness={0.78 + intensity * 0.42} /></div> : null}
      {id === "japanese-tower" ? <div className="collection-stage japanese-tower-stage"><JapaneseTowerLandscape sourceUrl={new URL("japanese-tower.html", document.baseURI).href} country={variant as JapaneseTowerVariant} /></div> : null}
      {id === "editorial-intro" ? <div className="collection-stage editorial-intro-stage"><EditorialIntroSection /></div> : null}
      {id === "character-carousel" ? <div className="collection-stage character-carousel-stage"><CharacterCarousel variant={variant as CharacterCarouselVariant} speed={speed} scale={0.84 + intensity * 0.38} opacity={0.82 + intensity * 0.18} hue={hue - 196} saturation={0.86 + intensity * 0.4} brightness={0.82 + intensity * 0.38} /></div> : null}
      {id === "globe" ? <div className="collection-stage globe-stage"><GlobeCollection variant={variant as GlobeVariant} speed={speed} scale={0.72 + intensity * 0.46} smokeStrength={0.65 + intensity * 0.65} glow={0.72 + intensity * 0.56} starDensity={0.65 + intensity * 0.7} hue={hue - 196} saturation={0.82 + intensity * 0.42} brightness={0.8 + intensity * 0.42} /></div> : null}
      {id === "laser" ? <div className="collection-stage laser-stage"><LaserCollection variant={variant as LaserVariant} speed={speed} size={0.74 + intensity * 0.5} length={0.7 + intensity * 0.65} density={0.68 + intensity * 0.7} opacity={0.76 + intensity * 0.24} hue={hue - 196} saturation={0.86 + intensity * 0.42} brightness={0.8 + intensity * 0.42} /></div> : null}
      {id === "generate-button" ? <div className="collection-stage generate-button-stage"><GenerateButton mode="dark" hue={hue - 196} saturation={0.84 + intensity * 0.44} brightness={0.82 + intensity * 0.36} /></div> : null}
      {id === "newsletter-footer" ? <div className="collection-stage newsletter-footer-stage"><NewsletterFooterSection /></div> : null}
      {id === "complete-shelf" ? <CompleteShelfStage /> : null}
      {id === "predictive-arc" ? <div className="collection-stage predictive-arc-stage"><PredictiveArcCanvas variant={variant as PredictiveArcVariant} mode="dark" speed={speed} size={0.78 + intensity * 0.4} length={0.72 + intensity * 0.54} density={0.68 + intensity * 0.62} opacity={0.76 + intensity * 0.24} hue={hue - 196} saturation={0.84 + intensity * 0.42} brightness={0.8 + intensity * 0.4} /></div> : null}
      {id === "constellation" ? <div className="collection-stage constellation-stage"><ConstellationField variant={variant as ConstellationVariant} mode="dark" speed={speed} size={0.76 + intensity * 0.46} length={0.7 + intensity * 0.6} density={0.66 + intensity * 0.7} opacity={0.76 + intensity * 0.24} hue={hue - 196} saturation={0.86 + intensity * 0.4} brightness={0.8 + intensity * 0.4} /></div> : null}
      {id === "wireframe-forms" ? <div className="collection-stage wireframe-stage"><WireframeForms variant={variant as WireframeVariant} mode="dark" speed={speed} size={0.8 + intensity * 0.4} length={0.78 + intensity * 0.5} density={0.72 + intensity * 0.5} opacity={0.8 + intensity * 0.2} hue={hue - 196} saturation={0.84 + intensity * 0.4} brightness={0.82 + intensity * 0.36} /></div> : null}
      {id === "liquid-metal" ? <div className="collection-stage liquid-metal-stage"><LiquidMetalButton variant={variant as LiquidMetalVariant} rendering={intensity > 0.45 ? "colored" : "monotone"} diameter={82 + Math.round(intensity * 36)} strokeWidth={2 + intensity * 3} text={variant === "pill" ? "Generate direction" : variant === "circle" ? "Add direction" : "Play concept"} embedded onClick={onCssAction} /></div> : null}
      {id === "engraved-certificate" ? <div className="collection-stage engraved-certificate-stage"><EngravedCertificate mode="dark" hue={hue - 196} saturation={0.84 + intensity * 0.4} brightness={0.82 + intensity * 0.36} /></div> : null}
      {id === "temple-night" ? <div className="collection-stage temple-night-stage"><TempleNightScene /></div> : null}
      {id === "bestsellers-book-showcase" ? <LocalFrameStage sourcePath="landing-pages/bestsellers-book-showcase.html" className="landing-page-stage bestsellers-stage"><BestsellersBookShowcase headingFont="Georgia" bodyFont="Arial" primaryColor="#c8ff5a" /></LocalFrameStage> : null}
      {id === "sylva-hero" ? <LocalFrameStage sourcePath="landing-pages/inner-green-3d.html" className="landing-page-stage sylva-hero-stage"><SylvaHero headingFont="Georgia" bodyFont="Arial" primaryColor="#d7ff91" /></LocalFrameStage> : null}
      {id === "meng-to-sketchbook-landing-page" ? <LocalFrameStage sourcePath="landing-pages/meng-to-sketchbook.html" className="landing-page-stage meng-sketchbook-page-stage"><MengToSketchbookLandingPage /></LocalFrameStage> : null}
      {id === "spark-badge" ? <div className="collection-stage spark-badge-stage"><SparkBadge sourceUrl={new URL("spark-badge.html", document.baseURI).href} /></div> : null}
      {id === "globe-study" ? <div className="collection-stage text-path-stage"><TextPathStudies variant={variant as TextPathStudyVariant} mode="dark" scale={0.78 + intensity * 0.42} opacity={0.78 + intensity * 0.22} hue={hue - 196} saturation={0.84 + intensity * 0.4} brightness={0.82 + intensity * 0.38} /></div> : null}
      {id === "star-portal" ? <div className="collection-stage shader-button-stage"><ShaderButtons variant={variant as ShaderButtonVariant} mode="dark" hue={hue - 196} saturation={0.86 + intensity * 0.42} brightness={0.82 + intensity * 0.38} /></div> : null}
      {id === "gallery" ? <div className="collection-stage gallery-stage"><Gallery speed={speed} scale={0.78 + intensity * 0.42} opacity={0.82 + intensity * 0.18} hue={hue - 196} saturation={0.86 + intensity * 0.36} brightness={0.86 + intensity * 0.3} /></div> : null}
      {id === "sylva-living-world" ? <ReferenceFrameStage sourcePath="landing-pages/inner-green-3d.html?threeuiView=scene&v=4" className="sylva-living-world-stage" referenceWidth={1600} referenceHeight={880} fit="cover" title="Sylva Living Green with ferns, flowers, pollen, and a butterfly" /> : null}
      {id === "koi-studies" ? <LocalFrameStage sourcePath="synthralos-halftone.html" className="koi-studies-stage"><KoiStudies /></LocalFrameStage> : null}
      {id === "sketchbook" ? <div className="collection-stage sketchbook-stage"><Sketchbook assetBaseUrl={new URL("sketchbook/", document.baseURI).href} /></div> : null}
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
  const [demoCategory, setDemoCategory] = useState<DemoCategoryFilter>("all");
  const [liveQuery, setLiveQuery] = useState("");
  const [demoVariants, setDemoVariants] = useState<Partial<Record<DemoId, string>>>(() => ({
    condensation: "condensation",
    controls: "play",
    crt: "cinematic",
    dock: "glass",
    brand: "codex",
    gauges: "tachometer",
    toggle: "glass",
    warp: "streaks",
    landscape: "sunrise",
    "text-animation": "article-headings",
    "rectangle-buttons": "aster-glass-arrow",
    "structure-flow": "structure-flow",
    "portal-field": "portal-field",
    "gallery-heading": "rising-diagonal",
    diagnostics: "layers",
    "woven-cloth": "woven-cloth",
    "japanese-tower": "japan",
    "character-carousel": "filmstrip",
    globe: "energy-orb",
    laser: "matrix-field",
    "predictive-arc": "predictive",
    constellation: "constellation-field",
    "wireframe-forms": "cube",
    "liquid-metal": "pill",
    "globe-study": "globe-study",
    "star-portal": "star-portal",
  }));
  const active = DEMOS.find((demo) => demo.id === activeId) ?? DEMOS[0];
  const normalizedLiveQuery = liveQuery.trim().toLocaleLowerCase("zh-CN");
  const categoryDemos = demoCategory === "all" ? DEMOS : DEMOS.filter((demo) => demo.category === demoCategory);
  const visibleDemos = normalizedLiveQuery
    ? categoryDemos.filter((demo) => matchesDemoSearch(demo, normalizedLiveQuery))
    : categoryDemos;
  const activeIsVisible = visibleDemos.some((demo) => demo.id === activeId);
  const activeVariant = demoVariants[activeId] ?? active.defaultVariant ?? "";
  const activeVariantLabel = active.variants?.find((option) => option.value === activeVariant)?.label;

  useEffect(() => {
    const targetId = decodeURIComponent(window.location.hash.slice(1));
    if (!targetId) return undefined;
    const scrollToTarget = () => document.getElementById(targetId)?.scrollIntoView({ behavior: "auto", block: "start" });
    const frame = window.requestAnimationFrame(scrollToTarget);
    const settleTimer = window.setTimeout(scrollToTarget, 320);
    const lateTimer = window.setTimeout(scrollToTarget, 1100);
    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(settleTimer);
      window.clearTimeout(lateTimer);
    };
  }, []);

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
    if (!touring || visibleDemos.length === 0) return undefined;
    const timer = window.setTimeout(() => {
      setActiveId((current) => {
        const currentIndex = visibleDemos.findIndex((demo) => demo.id === current);
        return visibleDemos[(currentIndex + 1) % visibleDemos.length].id;
      });
    }, activeId === "kage" ? 12000 : 6500);
    return () => window.clearTimeout(timer);
  }, [activeId, demoCategory, liveQuery, touring]);

  useEffect(() => {
    let visibleStartedAt = performance.now();
    setStageHealth("loading");

    const timer = window.setInterval(() => {
      const stage = document.getElementById("live-stage");
      if (!stage) return;

      const bounds = stage.getBoundingClientRect();
      const stageIsVisible = bounds.bottom > 0 && bounds.top < window.innerHeight;
      if (!stageIsVisible) {
        visibleStartedAt = performance.now();
        setStageHealth("paused");
        return;
      }

      const elapsed = performance.now() - visibleStartedAt;
      const errorFallback = stage.querySelector(".render-error");
      const fallback = stage.querySelector(".render-fallback:not(.render-error)");
      const canvas = stage.querySelector("canvas");
      const iframe = stage.querySelector("iframe");
      const button = stage.querySelector(".css-control-stage button");
      const interactiveSurface = stage.querySelector<HTMLElement>("button, [role='switch']");
      const semanticSurface = stage.querySelector(".article-headings-component, .threeui-page-button-stage, .rectangle-button-stage button, .section-element");

      if (errorFallback) {
        setStageHealth("failed");
        window.clearInterval(timer);
        return;
      }

      const interactiveBounds = interactiveSurface?.getBoundingClientRect();
      const interactiveReady = Boolean(interactiveBounds && interactiveBounds.width > 24 && interactiveBounds.height > 20);
      let ready = Boolean(fallback || button || semanticSurface || interactiveReady || (canvas && canvas.clientWidth > 80 && canvas.clientHeight > 80));
      const minimumVisualWarmup = activeId === "globe-study"
        ? 5200
        : activeId === "sylva-living-world"
          ? 4800
          : activeId === "spark-badge"
            ? 1600
            : 0;

      if (!ready && iframe instanceof HTMLIFrameElement && iframe.clientWidth > 80 && iframe.clientHeight > 80) {
        if (activeId === "kage") {
          try {
            ready = Boolean(iframe.contentDocument?.querySelector("#pre.done"));
          } catch {
            ready = iframe.closest("[data-state='ready']") !== null && elapsed > 1200;
          }
        } else {
          const stateHost = iframe.closest<HTMLElement>("[data-state]");
          const componentState = stateHost?.dataset.state;
          ready = componentState ? componentState === "ready" : iframe.classList.contains("is-ready") || elapsed > 900;
        }
      }

      if (ready && elapsed < minimumVisualWarmup) ready = false;

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
  }, [activeId, activeVariant, renderRevision]);

  const retryActiveDemo = () => setRenderRevision((revision) => revision + 1);

  const selectDemo = (id: DemoId) => {
    setActiveId(id);
    setTouring(false);
    setInteractionOverride(null);
  };

  const selectDemoVariant = (value: string) => {
    setDemoVariants((current) => ({ ...current, [activeId]: value }));
    setInteractionOverride(null);
  };

  const selectDemoCategory = (category: DemoCategoryFilter) => {
    setDemoCategory(category);
    setTouring(false);
    setInteractionOverride(null);
    const nextCategoryDemos = category === "all" ? DEMOS : DEMOS.filter((demo) => demo.category === category);
    const nextVisibleDemos = normalizedLiveQuery
      ? nextCategoryDemos.filter((demo) => matchesDemoSearch(demo, normalizedLiveQuery))
      : nextCategoryDemos;
    if (!nextVisibleDemos.some((demo) => demo.id === activeId)) {
      const firstMatch = nextVisibleDemos[0];
      if (firstMatch) setActiveId(firstMatch.id);
    }
  };

  const updateLiveQuery = (query: string) => {
    const normalizedQuery = query.trim().toLocaleLowerCase("zh-CN");
    const nextVisibleDemos = normalizedQuery
      ? categoryDemos.filter((demo) => matchesDemoSearch(demo, normalizedQuery))
      : categoryDemos;
    setLiveQuery(query);
    setTouring(false);
    setInteractionOverride(null);
    if (!nextVisibleDemos.some((demo) => demo.id === activeId) && nextVisibleDemos[0]) setActiveId(nextVisibleDemos[0].id);
  };

  const openCatalogDemo = (demoId: string) => {
    const demo = DEMOS.find((item) => item.id === demoId);
    if (!demo) return;
    setDemoCategory("all");
    setLiveQuery("");
    selectDemo(demo.id);
    window.history.replaceState(null, "", "#live");
    window.requestAnimationFrame(() => document.getElementById("live")?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" }));
  };

  return (
    <main>
      <a className="skip-link" href="#selector">跳到智能选型</a>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="返回 ThreeUI Runtime Atlas 顶部"><span className="brand-mark">3</span><span>THREEUI / RUNTIME ATLAS</span></a>
        <nav aria-label="页面导航"><a href="#selector">智能选型</a><a href="#use-cases">实际探测</a><a href="#live">效果</a><a href="#product-demo">组合</a><a href="#catalog">索引</a><a href="#principle">原理</a><a href="#boundary">边界</a><a href="#meaning">意义</a></nav>
        <a className="repo-link" href="https://github.com/MengTo/threeui" target="_blank" rel="noreferrer">GitHub <ArrowIcon /></a>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow"><span /> OPEN-SOURCE COMMUNITY · V1.2.0</p>
          <h1>让优秀视觉，<br /><em>成为网页底座。</em></h1>
          <p className="hero-lede">ThreeUI 不是网页生成器，而是视觉 renderer 资产库。我们用 PageSpec 把业务 Brief、页面角色、性能预算与它的 103 个公开入口连接起来，并以 48 个实时案例验证 43 / 43 个父能力。</p>
          <div className="hero-actions" aria-label="首屏主要入口">
            <a className="hero-action is-primary" href="#selector">用 Brief 生成页面 <ArrowIcon /></a>
            <a className="hero-action" href="#live">查看 48 项能力</a>
          </div>
          <p className="hero-release"><span>RELEASE / 2026.09.04</span> PageSpec 0.1 · 162 个可运行配置 · 单活动 renderer · DOM fallback</p>
          <dl className="hero-facts">
            <div><dt>48</dt><dd>本页实时案例</dd></div>
            <div><dt>162</dt><dd>可运行配置</dd></div>
            <div><dt>43/43</dt><dd>父能力现场路径</dd></div>
          </dl>
        </div>

        <div className="atlas" id="live" aria-label="ThreeUI 组件实时演示">
          <div className="atlas-toolbar">
            <div><span className="toolbar-kicker">LIVE {active.index} / {DEMOS.length}</span><strong>{active.title}</strong></div>
            <div className="toolbar-actions">
              {stageHealth === "failed" ? (
                <button className="stage-health is-failed" type="button" onClick={retryActiveDemo}>重新加载</button>
              ) : (
                <span className={`stage-health is-${stageHealth}`} role="status" aria-live="polite"><i /> {stageHealth === "ready" ? "已就绪" : stageHealth === "slow" ? "仍在初始化" : stageHealth === "paused" ? "等待舞台可见" : "正在加载"}</span>
              )}
                <button className={touring ? "tour-button is-active" : "tour-button"} type="button" aria-pressed={touring} disabled={reducedMotion || visibleDemos.length === 0} onClick={() => setTouring((value) => !value)}><span className="tour-dot" /> {reducedMotion ? "动效已暂停" : visibleDemos.length === 0 ? "无可导览结果" : touring ? "停止导览" : "自动导览"}</button>
            </div>
          </div>

          <div className="render-window" id="live-stage" role="tabpanel" aria-labelledby={activeIsVisible ? `tab-${active.id}` : undefined} aria-label={activeIsVisible ? undefined : `${active.title} 实时演示`} data-demo={activeId}>
            <StageErrorBoundary key={`${activeId}-${activeVariant}-${renderRevision}`} onRetry={retryActiveDemo}>
              <DemoStage id={activeId} intensity={intensity} speed={reducedMotion ? 0 : speed} hue={hue} variant={activeVariant} reducedMotion={reducedMotion} onCssAction={() => window.setTimeout(() => setInteractionOverride(activeId === "liquid-metal" ? "已收到 postMessage：iframe 内的液态按钮已触发宿主事件" : activeId === "toggle" ? `已收到 onChange：${activeVariantLabel ?? activeVariant} 开关状态已回传宿主` : `已收到 click：${activeVariantLabel ?? activeVariant} 是可聚焦、可触发的真实 button`), 0)} />
            </StageErrorBoundary>
            <div className="render-grid" aria-hidden="true" />
            <div className="runtime-badge"><span>{active.index}</span>{active.runtime}{reducedMotion ? <span className="motion-status">PAUSED</span> : null}</div>
            <p className="interaction-note"><span>↗</span>{interactionOverride ?? `${activeVariantLabel ? `${activeVariantLabel} · ` : ""}${active.interaction}`}</p>
          </div>

          <div className="atlas-console">
            <div className="demo-finder">
              <label htmlFor="live-demo-search">
                <span>LIVE SEARCH</span>
                <input id="live-demo-search" type="search" value={liveQuery} onChange={(event) => updateLiveQuery(event.target.value)} onKeyDown={(event) => { if (event.key === "Escape") updateLiveQuery(""); }} placeholder="搜索案例、网页角色、运行时或变体" aria-describedby="live-demo-result-count" aria-controls="live-demo-results" />
              </label>
              <p id="live-demo-result-count" className="demo-finder-status" aria-live="polite"><strong>{visibleDemos.length}</strong><span> / {categoryDemos.length} 命中</span></p>
              {liveQuery ? <button className="demo-search-clear" type="button" onClick={() => updateLiveQuery("")}>清除</button> : null}
            </div>
            <div className="demo-category-filters" aria-label="按能力类别筛选实时案例">
              {DEMO_CATEGORY_FILTERS.map((filter) => {
                const count = filter.value === "all" ? DEMOS.length : DEMOS.filter((demo) => demo.category === filter.value).length;
                return <button key={filter.value} type="button" aria-pressed={demoCategory === filter.value} onClick={() => selectDemoCategory(filter.value)}><span>{filter.label}</span><small>{count}</small></button>;
              })}
            </div>
            {visibleDemos.length ? <div className="demo-tabs" id="live-demo-results" role="tablist" aria-label="选择实时能力案例">
              {visibleDemos.map((demo) => (
                <button key={demo.id} id={`tab-${demo.id}`} role="tab" type="button" aria-selected={demo.id === activeId} aria-controls="live-stage" tabIndex={demo.id === activeId ? 0 : -1} onClick={() => selectDemo(demo.id)} onKeyDown={(event) => {
                  if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
                  event.preventDefault();
                  const position = visibleDemos.findIndex((item) => item.id === demo.id);
                  const offset = event.key === "ArrowRight" ? 1 : -1;
                  const next = visibleDemos[(position + offset + visibleDemos.length) % visibleDemos.length];
                  selectDemo(next.id);
                  window.requestAnimationFrame(() => document.getElementById(`tab-${next.id}`)?.focus());
                }}>
                  <span>{demo.index}</span><strong>{demo.title}</strong><small>{demo.category}</small>
                </button>
              ))}
            </div> : <div className="demo-tabs-empty" id="live-demo-results" role="status"><span>NO MATCH</span><strong>没有找到符合条件的实时案例。</strong><p>换一个关键词，或清除检索以恢复当前类别。</p><button type="button" onClick={() => updateLiveQuery("")}>清除检索</button></div>}

            <div className="live-coverage-note" aria-label="实时能力覆盖说明">
              <strong>父能力运行闭环 / 43 OF 43</strong>
              <span>Landing pages · Studies · Controls · Gallery · Worlds</span>
              <small>48 个实时案例提供 162 个可运行配置，已为 43 / 43 个 Community 父条目建立现场路径；LIVE 表示登记能力可运行，不等同于全部生产性能与业务接线验收。</small>
            </div>

            <div className="console-meta">
              <div className="active-demo-copy"><span>{active.runtime} · {active.role}</span><p>{active.summary}</p></div>
              <div className={active.variants ? "control-strip has-variant" : "control-strip"} aria-label="当前效果参数">
                {active.variants ? <label className="variant-control"><span>{active.variantLabel ?? "变体"} <output>{activeVariantLabel}</output></span><select aria-label={`${active.title} ${active.variantLabel ?? "变体"}`} value={activeVariant} onChange={(event) => selectDemoVariant(event.target.value)}>{active.variants.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label> : null}
                <label><span>能量 <output>{Math.round(intensity * 100)}</output></span><input type="range" min="0" max="1" step="0.01" value={intensity} onChange={(event) => setIntensity(Number(event.target.value))} /></label>
                <label><span>速度 <output>{speed.toFixed(1)}×</output></span><input type="range" min="0.2" max="2" step="0.1" value={speed} onChange={(event) => setSpeed(Number(event.target.value))} /></label>
                <label><span>色相 <output>{hue}°</output></span><input type="range" min="0" max="360" step="1" value={hue} onChange={(event) => setHue(Number(event.target.value))} /></label>
              </div>
            </div>
          </div>
        </div>
      </section>

      <UsageProbeLab reducedMotion={reducedMotion} />

      <VisualRegistrySelector reducedMotion={reducedMotion} onOpenDemo={openCatalogDemo} />

      <ProductCompositionDemo reducedMotion={reducedMotion} />

      <CommunityCatalog onOpenDemo={openCatalogDemo} />

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
