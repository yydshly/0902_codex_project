export const COMMUNITY_CATEGORIES = {
  pages: "整页与场景",
  graphics: "图形与背景",
  typography: "文字与品牌",
  controls: "按钮与控件",
  data: "数据与工具",
} as const;

export type CommunityCategory = keyof typeof COMMUNITY_CATEGORIES;

export type CommunityEntry = {
  id: string;
  category: CommunityCategory;
  variants: readonly string[];
  controls: readonly string[];
};

export const COMMUNITY_COMPONENTS = [
  { id: "kage-landing-page", category: "pages", variants: [], controls: ["headingFont", "bodyFont", "headingWeight", "bodyWeight", "primaryColor", "headingSize", "bodySize", "headingLetterSpacing"] },
  { id: "complete-shelf-landing-page", category: "pages", variants: [], controls: ["headingFont", "bodyFont", "headingWeight", "bodyWeight", "primaryColor", "headingSize", "bodySize", "headingLetterSpacing"] },
  { id: "bestsellers-book-showcase", category: "pages", variants: [], controls: ["headingFont", "bodyFont", "headingWeight", "bodyWeight", "primaryColor", "headingSize", "bodySize", "headingLetterSpacing"] },
  { id: "sylva-hero", category: "pages", variants: ["living-green"], controls: ["headingFont", "bodyFont", "headingWeight", "bodyWeight", "primaryColor", "headingSize", "bodySize", "headingLetterSpacing"] },
  { id: "meng-to-sketchbook-landing-page", category: "pages", variants: [], controls: ["headingFont", "bodyFont", "headingWeight", "bodyWeight", "primaryColor", "headingSize", "bodySize", "headingLetterSpacing"] },
  { id: "predictive-arc", category: "graphics", variants: ["predictive", "data-pixel", "signal-particles", "override-grid", "ribbon-field", "void-field", "halftone-flow", "amber-halftone"], controls: ["mode", "speed", "hue", "saturation", "brightness"] },
  { id: "liquid-form", category: "graphics", variants: [], controls: ["speed", "morph", "noiseScale", "mouseAmount", "metal", "camera", "tintHue", "tintAmount"] },
  { id: "crt", category: "graphics", variants: ["terminal", "cinematic", "blue-screen", "nintendo"], controls: ["speed", "typeSpeed", "motion", "hue", "saturation", "brightness", "opacity"] },
  { id: "energy-orb", category: "graphics", variants: ["energy-orb"], controls: ["speed", "scale", "smokeScale", "smokeStrength", "smokeSpeed", "hue", "saturation", "glow", "starDensity", "starSpeed", "starSize", "brightness", "opacity"] },
  { id: "spark-badge", category: "graphics", variants: ["badge"], controls: ["speed", "particleAmount", "rainAmount", "turbulence", "spread"] },
  { id: "elements", category: "graphics", variants: ["elemental-water", "elemental-lightning", "elemental-flame", "condensation", "generative-tree"], controls: ["speed", "size", "particleAmount", "hue", "saturation", "brightness", "opacity"] },
  { id: "typography-vortex", category: "typography", variants: [], controls: ["mode", "speed", "ringGrowth", "opacity", "dissolveRadius", "particleAmount", "suctionDuration"] },
  { id: "semantic-bloom", category: "typography", variants: [], controls: ["mode", "text", "size", "opacity"] },
  { id: "globe-study", category: "graphics", variants: ["globe-study", "outline-typeflow", "morphing-glyph-cloud", "cloth-study", "ripple-study", "ball-study"], controls: ["mode", "scale", "opacity", "hue", "saturation", "brightness"] },
  { id: "gallery-heading", category: "typography", variants: ["rising-diagonal", "falling-diagonal", "horizontal-sweep", "vertical-loop"], controls: ["mode", "font", "weight", "headlineSize", "hue", "saturation", "brightness"] },
  { id: "star-portal", category: "controls", variants: ["star-portal", "ignition-button", "induction-button", "plasma-button", "tactile-button", "thinking-button"], controls: ["mode", "hue", "saturation", "brightness"] },
  { id: "rectangle-buttons", category: "controls", variants: ["dark-pill", "launch-button", "dot-border-button", "floating-dots-cta", "sliding-text-cta", "gradient-beam-cta", "gradient-pill-button", "generate-button", "glassmorphism-cta", "spinning-border-button", "gradient-cta", "lumen-cta", "lumen-cta-ghost", "trochil-signal", "attune-thermal", "tideform-outline", "understory-arrow-pill", "meridian-keycap-primary", "meridian-keycap-secondary", "halvorsen-arrow-pill", "aster-glass-access", "aster-glass-arrow"], controls: ["mode", "hue", "saturation", "brightness"] },
  { id: "circle-buttons", category: "controls", variants: ["play", "plus", "mail"], controls: ["mode", "hue", "saturation", "brightness"] },
  { id: "liquid-metal-button", category: "controls", variants: ["play-circle", "pill", "circle"], controls: [] },
  { id: "character-carousel", category: "typography", variants: ["character-filmstrip", "character-wave"], controls: ["speed", "scale", "opacity", "hue", "saturation", "brightness"] },
  { id: "gallery", category: "pages", variants: [], controls: ["speed", "scale", "opacity", "hue", "saturation", "brightness"] },
  { id: "sylva-living-world", category: "pages", variants: ["living-green"], controls: [] },
  { id: "temple-night", category: "pages", variants: ["temple-night"], controls: [] },
  { id: "landscape", category: "pages", variants: ["sunrise", "noon", "sunset", "night", "rain", "storm", "snow"], controls: [] },
  { id: "japanese-tower", category: "pages", variants: ["japan", "china", "vietnam", "thailand", "cambodia", "turkey"], controls: [] },
  { id: "bookshelf", category: "pages", variants: [], controls: [] },
  { id: "structure-flow", category: "graphics", variants: ["structure-flow", "emerald-horizon", "orbital-sphere", "dot-matrix", "expanse-field", "logic-core", "dimensional-field", "data-field", "topology-field", "nebula", "fluid-field", "ember-storm", "flux-vortex"], controls: ["speed", "pointSize", "opacity", "maskStart", "maskSolid"] },
  { id: "warp-field", category: "graphics", variants: ["streaks", "letters", "keycaps", "hyperspace"], controls: ["speed", "streakOpacity", "tileOpacity", "fov", "hue", "saturation", "brightness"] },
  { id: "engraved-certificate", category: "typography", variants: [], controls: ["hue", "saturation", "brightness"] },
  { id: "woven-cloth", category: "graphics", variants: ["woven-cloth", "iridescent", "atelier", "washi"], controls: ["hue", "saturation", "brightness"] },
  { id: "performance-gauges", category: "data", variants: ["tachometer", "speedometer", "boost", "power"], controls: ["hue", "saturation", "brightness"] },
  { id: "uplink-loader", category: "data", variants: [], controls: [] },
  { id: "koi-studies", category: "pages", variants: [], controls: [] },
  { id: "article-headings", category: "typography", variants: ["threeui-intro", "particle-wordmark", "audio-wordmark"], controls: ["mode", "duration", "stagger", "scrambleLength", "preserveChance", "tailChance"] },
  { id: "animated-top-dock", category: "controls", variants: ["sable", "modern", "retro", "glass"], controls: ["proximity", "spring", "damping", "widthGrowth", "heightGrowth", "drop"] },
  { id: "sketchbook", category: "pages", variants: [], controls: [] },
  { id: "constellation-field", category: "graphics", variants: ["constellation-field", "particle-drift", "particle-network", "gateway-flow", "connectivity-graph", "interface-lines", "defense-lines", "topo-field"], controls: ["mode", "speed", "size", "strokeWidth", "length", "density", "opacity", "hue", "saturation", "brightness"] },
  { id: "portal-field", category: "graphics", variants: ["portal-field", "cloud-field", "flow-field", "bell-field", "stream-convergence"], controls: ["speed", "size", "length", "density", "opacity", "hue", "saturation", "brightness"] },
  { id: "diagnostics-panel", category: "data", variants: ["layers", "nodes", "flow"], controls: ["mode", "speed", "size", "opacity", "hue", "saturation", "brightness"] },
  { id: "skeuomorphic-toggle", category: "controls", variants: ["skeuomorphic-toggle", "modern", "glass", "shader"], controls: ["mode", "speed", "size", "opacity", "hue", "saturation", "brightness"] },
  { id: "matrix-field", category: "graphics", variants: ["matrix-field", "atmospheric-blade", "vanishing-array", "halftone-relay"], controls: ["speed", "size", "length", "density", "opacity", "hue", "saturation", "brightness"] },
  { id: "wireframe-forms", category: "graphics", variants: ["cube", "cylinders", "sphere"], controls: ["mode", "speed", "size", "length", "density", "opacity", "hue", "saturation", "brightness"] },
  { id: "brand-orbs", category: "typography", variants: ["claude", "openai", "codex", "cursor", "gemini", "figma", "framer", "react", "swift", "designcode", "aura", "dreamcut", "ui", "ux", "css", "ios", "neuform", "github", "x", "instagram", "threads", "linkedin", "email"], controls: ["size", "mode", "speed"] },
] as const satisfies readonly CommunityEntry[];

const TITLE_CASE_EXCEPTIONS: Record<string, string> = {
  crt: "CRT",
  ui: "UI",
  kage: "Kage",
  meng: "Meng",
  threeui: "ThreeUI",
};

export function catalogTitle(id: string) {
  return id
    .split("-")
    .map((part) => TITLE_CASE_EXCEPTIONS[part] ?? `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join(" ");
}

export const COMMUNITY_VARIANT_COUNT = COMMUNITY_COMPONENTS.reduce((total, item) => total + item.variants.length, 0);
export const COMMUNITY_SINGLETON_COUNT = COMMUNITY_COMPONENTS.filter((item) => item.variants.length === 0).length;
