import { useMemo, useState } from "react";
import {
  COMMUNITY_CATEGORIES,
  COMMUNITY_COMPONENTS,
  COMMUNITY_SINGLETON_COUNT,
  COMMUNITY_VARIANT_COUNT,
  catalogTitle,
  type CommunityCategory,
} from "./community-catalog";

type CategoryFilter = "all" | CommunityCategory;

const categoryEntries = Object.entries(COMMUNITY_CATEGORIES) as Array<[CommunityCategory, string]>;

export function CommunityCatalog() {
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
          <h2 id="catalog-title">四个只是原理样本。<br /><em>这里才是完整能力面。</em></h2>
        </div>
        <p>以下 43 项是能力与参数索引：点击卡片会展开变体和控制项，并不代表 43 个效果都已嵌入本页。上方带 LIVE 编号的 13 项才是可直接运行的案例。数据固定自上游 `community-sync-report.json`。</p>
      </div>

      <dl className="catalog-stats">
        <div><dt>{String(COMMUNITY_COMPONENTS.length).padStart(2, "0")}</dt><dd>父条目 / parents</dd></div>
        <div><dt>{COMMUNITY_VARIANT_COUNT}</dt><dd>具名变体 / variants</dd></div>
        <div><dt>{COMMUNITY_SINGLETON_COUNT}</dt><dd>单例组件 / singletons</dd></div>
        <div><dt>05</dt><dd>能力类别 / families</dd></div>
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
        <p>METADATA INDEX · SHOWING <strong>{visible.length}</strong> / {filtered.length}</p>
        {visible.length ? (
          <div className="catalog-grid">
            {visible.map((item, index) => (
              <details className="catalog-card" key={item.id}>
                <summary>
                  <span className="catalog-card-index">{String(COMMUNITY_COMPONENTS.indexOf(item) + 1).padStart(2, "0")}</span>
                  <span className="catalog-card-title"><small>{COMMUNITY_CATEGORIES[item.category]}</small><strong>{catalogTitle(item.id)}</strong><code>{item.id}</code></span>
                  <span className="catalog-card-count"><b>{item.variants.length || 1}</b>{item.variants.length ? "variants" : "singleton"}</span>
                  <span className="catalog-card-plus" aria-hidden="true">＋</span>
                </summary>
                <div className="catalog-card-detail">
                  <div><span>VARIANTS</span><p>{item.variants.length ? item.variants.join(" · ") : "独立单例组件，无具名变体"}</p></div>
                  <div><span>CONTROLS</span><p>{item.controls.length ? item.controls.join(" · ") : "该报告未登记公共控制键"}</p></div>
                </div>
              </details>
            ))}
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
