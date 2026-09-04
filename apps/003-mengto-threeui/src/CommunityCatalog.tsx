import { useMemo, useState } from "react";
import {
  COMMUNITY_CATEGORIES,
  COMMUNITY_COMPONENTS,
  COMMUNITY_VARIANT_COUNT,
  catalogTitle,
  type CommunityCategory,
} from "./community-catalog";

type CategoryFilter = "all" | CommunityCategory;

type CoverageStatus = "live" | "partial";

type LiveCoverage = {
  status: CoverageStatus;
  demoId: string;
  note: string;
};

const COMMUNITY_LIVE_COVERAGE: Readonly<Record<string, LiveCoverage>> = {
  "kage-landing-page": { status: "live", demoId: "kage", note: "独立整页案例已接入" },
  "complete-shelf-landing-page": { status: "live", demoId: "complete-shelf", note: "独立整页案例已接入" },
  "bestsellers-book-showcase": { status: "live", demoId: "bestsellers-book-showcase", note: "同源完整出版页已接入" },
  "sylva-hero": { status: "live", demoId: "sylva-hero", note: "1 / 1 具名品牌首屏已接入" },
  "meng-to-sketchbook-landing-page": { status: "live", demoId: "meng-to-sketchbook-landing-page", note: "同源作品集整页已接入" },
  "predictive-arc": { status: "live", demoId: "predictive-arc", note: "8 / 8 具名变体可切换" },
  "liquid-form": { status: "live", demoId: "liquid", note: "单例组件已接入" },
  crt: { status: "live", demoId: "crt", note: "4 / 4 屏幕变体可切换" },
  "energy-orb": { status: "live", demoId: "globe", note: "1 / 1 具名变体已接入" },
  "spark-badge": { status: "live", demoId: "spark-badge", note: "1 / 1 徽章微场景已接入" },
  elements: { status: "live", demoId: "condensation", note: "5 / 5 元素变体可切换；Generative Tree 另有独立深挖案例" },
  "typography-vortex": { status: "live", demoId: "vortex", note: "单例组件已接入" },
  "semantic-bloom": { status: "live", demoId: "bloom", note: "单例组件已接入" },
  "globe-study": { status: "live", demoId: "globe-study", note: "6 / 6 路径研究可切换" },
  "gallery-heading": { status: "live", demoId: "gallery-heading", note: "4 / 4 具名变体可切换" },
  "star-portal": { status: "live", demoId: "star-portal", note: "6 / 6 shader 按钮可切换" },
  "rectangle-buttons": { status: "live", demoId: "rectangle-buttons", note: "22 / 22 具名变体可切换" },
  "circle-buttons": { status: "live", demoId: "controls", note: "3 / 3 操作变体可切换并回传 click" },
  "liquid-metal-button": { status: "live", demoId: "liquid-metal", note: "3 / 3 行动形态可切换" },
  "character-carousel": { status: "live", demoId: "character-carousel", note: "2 / 2 具名变体可切换" },
  gallery: { status: "live", demoId: "gallery", note: "单例空间画廊已接入" },
  "sylva-living-world": { status: "live", demoId: "sylva-living-world", note: "1 / 1；发现假 ready，并以同包 scene-only 路径恢复" },
  "temple-night": { status: "live", demoId: "temple-night", note: "1 / 1 沉浸场景已接入" },
  landscape: { status: "live", demoId: "landscape", note: "7 / 7 环境状态可切换" },
  "japanese-tower": { status: "live", demoId: "japanese-tower", note: "6 / 6 地域变体可切换" },
  bookshelf: { status: "live", demoId: "bookshelf", note: "单例 3D 组件已接入" },
  "structure-flow": { status: "live", demoId: "structure-flow", note: "13 / 13 具名变体可切换" },
  "warp-field": { status: "live", demoId: "warp", note: "4 / 4 具名变体可切换" },
  "engraved-certificate": { status: "live", demoId: "engraved-certificate", note: "单例凭证视觉已接入" },
  "woven-cloth": { status: "live", demoId: "woven-cloth", note: "4 / 4 具名变体可切换" },
  "performance-gauges": { status: "live", demoId: "gauges", note: "4 / 4 仪表变体可切换" },
  "uplink-loader": { status: "live", demoId: "uplink", note: "单例加载器已接入" },
  "koi-studies": { status: "live", demoId: "koi-studies", note: "高成本媒体卡片组已接入" },
  "article-headings": { status: "live", demoId: "text-animation", note: "基础标题与 3 个具名字标均可切换" },
  "animated-top-dock": { status: "live", demoId: "dock", note: "4 / 4 Dock 材质可切换" },
  sketchbook: { status: "live", demoId: "sketchbook", note: "同源交互作品册已接入" },
  "constellation-field": { status: "live", demoId: "constellation", note: "8 / 8 具名变体可切换" },
  "portal-field": { status: "live", demoId: "portal-field", note: "5 / 5 具名变体可切换" },
  "diagnostics-panel": { status: "live", demoId: "diagnostics", note: "3 / 3 诊断视图可切换" },
  "skeuomorphic-toggle": { status: "live", demoId: "toggle", note: "4 / 4 材质变体可切换并回传 onChange" },
  "matrix-field": { status: "live", demoId: "laser", note: "目录 4 个变体与扩展光阑均已接入" },
  "wireframe-forms": { status: "live", demoId: "wireframe-forms", note: "3 / 3 几何形态可切换" },
  "brand-orbs": { status: "live", demoId: "brand", note: "23 / 23 品牌变体可切换；单实例运行" },
};

const fullCoverageCount = Object.values(COMMUNITY_LIVE_COVERAGE).filter((item) => item.status === "live").length;
const partialCoverageCount = Object.values(COMMUNITY_LIVE_COVERAGE).filter((item) => item.status === "partial").length;
const indexedOnlyCount = COMMUNITY_COMPONENTS.length - fullCoverageCount - partialCoverageCount;

const categoryEntries = Object.entries(COMMUNITY_CATEGORIES) as Array<[CommunityCategory, string]>;

export function CommunityCatalog({ onOpenDemo }: { onOpenDemo?: (demoId: string) => void }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [showAll, setShowAll] = useState(false);
  const normalizedQuery = query.trim().toLocaleLowerCase();

  const filtered = useMemo(() => COMMUNITY_COMPONENTS.filter((item) => {
    if (category !== "all" && item.category !== category) return false;
    if (!normalizedQuery) return true;
    const haystack = [item.id, ...item.variants, ...item.controls].join(" ").toLocaleLowerCase();
    return haystack.includes(normalizedQuery);
  }), [category, normalizedQuery]);

  const visible = showAll || normalizedQuery || category !== "all" ? filtered : filtered.slice(0, 12);

  return (
    <section className="community-index" id="catalog" aria-labelledby="catalog-title">
      <div className="catalog-heading">
        <div>
          <p>01 / COMPLETE COMMUNITY INDEX</p>
          <h2 id="catalog-title">实时案例完成运行闭环。<br /><em>这里给出完整能力面。</em></h2>
        </div>
        <p>以下 43 项同时承担能力索引与覆盖地图：LIVE 表示该父条目的登记能力已接入运行路径，PARTIAL 表示只接入代表样本，INDEX 表示仅有元数据。上方 48 个实时案例已映射全部 43 个父条目。</p>
      </div>

      <dl className="catalog-stats">
        <div><dt>{String(COMMUNITY_COMPONENTS.length).padStart(2, "0")}</dt><dd>父条目 / parents</dd></div>
        <div><dt>{COMMUNITY_VARIANT_COUNT}</dt><dd>具名变体 / variants</dd></div>
        <div><dt>{Object.keys(COMMUNITY_LIVE_COVERAGE).length}</dt><dd>有实时证据 / linked</dd></div>
        <div><dt>{indexedOnlyCount}</dt><dd>仅元数据 / index only</dd></div>
      </dl>

      <div className="catalog-tools">
        <label className="catalog-search">
          <span>搜索 id、变体或参数</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} type="search" placeholder="例如 particle / button / hue" />
        </label>
        <div className="catalog-filters" aria-label="筛选能力类别">
          <button type="button" className={category === "all" ? "is-active" : ""} aria-pressed={category === "all"} onClick={() => setCategory("all")}>全部 <span>{COMMUNITY_COMPONENTS.length}</span></button>
          {categoryEntries.map(([key, label]) => {
            const count = COMMUNITY_COMPONENTS.filter((item) => item.category === key).length;
            return <button key={key} type="button" className={category === key ? "is-active" : ""} aria-pressed={category === key} onClick={() => setCategory(key)}>{label} <span>{count}</span></button>;
          })}
        </div>
      </div>

      <div className="catalog-results" aria-live="polite">
        <p>COVERAGE MAP · SHOWING <strong>{visible.length}</strong> / {filtered.length} · {fullCoverageCount} LIVE · {partialCoverageCount} PARTIAL · {indexedOnlyCount} INDEX</p>
        {visible.length ? (
          <div className="catalog-grid">
            {visible.map((item) => {
              const coverage = COMMUNITY_LIVE_COVERAGE[item.id];
              const coverageStatus = coverage?.status ?? "index";
              const coverageLabel = coverageStatus === "live" ? "LIVE" : coverageStatus === "partial" ? "PARTIAL" : "INDEX";
              return (
              <details className="catalog-card" key={item.id} data-component={item.id} data-coverage={coverageStatus}>
                <summary>
                  <span className="catalog-card-index">{String(COMMUNITY_COMPONENTS.indexOf(item) + 1).padStart(2, "0")}</span>
                  <span className="catalog-card-title"><small>{COMMUNITY_CATEGORIES[item.category]} <b className={`catalog-coverage-badge is-${coverageStatus}`}>{coverageLabel}</b></small><strong>{catalogTitle(item.id)}</strong><code>{item.id}</code></span>
                  <span className="catalog-card-count"><b>{item.variants.length || 1}</b>{item.variants.length ? "variants" : "singleton"}</span>
                  <span className="catalog-card-plus" aria-hidden="true">＋</span>
                </summary>
                <div className="catalog-card-detail">
                  <div><span>VARIANTS</span><p>{item.variants.length ? item.variants.join(" · ") : "独立单例组件，无具名变体"}</p></div>
                  <div><span>CONTROLS</span><p>{item.controls.length ? item.controls.join(" · ") : "该报告未登记公共控制键"}</p></div>
                  <div className="catalog-coverage-detail"><span>RUNTIME COVERAGE</span><p>{coverage?.note ?? "当前只有能力与参数元数据，尚未接入实时舞台。"}</p>{coverage && onOpenDemo ? <button type="button" onClick={() => onOpenDemo(coverage.demoId)}>运行对应案例 <span>↗</span></button> : null}</div>
                </div>
              </details>
              );
            })}
          </div>
        ) : (
          <div className="catalog-empty"><strong>没有匹配项</strong><p>尝试搜索 WebGL、particle、button、hue，或切回“全部”。</p></div>
        )}
      </div>

      {!showAll && !normalizedQuery && category === "all" ? (
        <button className="show-all-button" type="button" onClick={() => setShowAll(true)}>展开全部 43 个父条目 <span>↓</span></button>
      ) : null}
    </section>
  );
}
