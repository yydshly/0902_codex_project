(() => {
  "use strict";

  const ARCHIVE_REPOSITORY = "https://github.com/yydshly/0902_codex_project";
  const CATALOG_URL = "./catalog/projects.json";
  const FETCH_TIMEOUT_MS = 10000;

  const STATUS = Object.freeze({
    planned: { label: "待研究", tone: "planned", order: 10 },
    studying: { label: "研究中", tone: "active", order: 20 },
    validated: { label: "已验证", tone: "done", order: 30 },
    archived: { label: "已归档", tone: "archived", order: 40 },
  });

  const elements = {
    projectCount: document.querySelector("#project-count"),
    validatedCount: document.querySelector("#validated-count"),
    lastUpdated: document.querySelector("#last-updated"),
    filterBar: document.querySelector("#filter-bar"),
    filterOptions: document.querySelector("#filter-options"),
    resultSummary: document.querySelector("#result-summary"),
    catalogState: document.querySelector("#catalog-state"),
    projectList: document.querySelector("#project-list"),
  };

  const view = {
    projects: [],
    filter: "all",
    requestId: 0,
  };

  function asText(value, fallback = "") {
    return typeof value === "string" && value.trim() ? value.trim() : fallback;
  }

  function normalizeId(value) {
    const text = String(value ?? "").trim();
    if (/^\d{3}$/.test(text)) return text;
    if (/^\d{1,2}$/.test(text)) return text.padStart(3, "0");
    return text || "—";
  }

  function normalizeStatus(value) {
    return asText(value, "planned").toLowerCase();
  }

  function statusDetails(status) {
    const known = STATUS[status];
    if (known) return known;

    return {
      label: status.replace(/[-_]+/g, " ") || "未标注",
      tone: "unknown",
      order: 90,
    };
  }

  function normalizeProject(project) {
    const source = project && typeof project === "object" ? project : {};
    const tags = Array.isArray(source.tags)
      ? source.tags.map((tag) => asText(tag)).filter(Boolean)
      : [];

    return {
      id: normalizeId(source.id),
      title: asText(source.title, "未命名项目"),
      summary: asText(source.summary, "研究摘要尚待补充。"),
      status: normalizeStatus(source.status),
      repository: safeHttpUrl(source.repository),
      studyPath: asText(source.studyPath),
      updatedAt: asText(source.updatedAt),
      tags,
      cover: normalizeCover(source.cover),
      demo: source.demo && typeof source.demo === "object" ? source.demo : null,
    };
  }

  function normalizeCover(cover) {
    if (!cover || typeof cover !== "object") return null;

    const rawPath = asText(cover.path);
    if (safeHttpUrl(rawPath)) return null;

    const path = safeSiteUrl(rawPath);
    if (!path) return null;

    return {
      path,
      alt: asText(cover.alt, ""),
      caption: asText(cover.caption),
      credit: asText(cover.credit),
    };
  }

  function compareProjects(left, right) {
    const leftIsStable = /^\d{3}$/.test(left.id);
    const rightIsStable = /^\d{3}$/.test(right.id);

    if (leftIsStable && rightIsStable) return Number(left.id) - Number(right.id);
    if (leftIsStable !== rightIsStable) return leftIsStable ? -1 : 1;
    return left.id.localeCompare(right.id, "zh-CN", { numeric: true });
  }

  function safeHttpUrl(value) {
    const text = asText(value);
    if (!text) return "";

    try {
      const url = new URL(text);
      return url.protocol === "http:" || url.protocol === "https:" ? url.href : "";
    } catch {
      return "";
    }
  }

  function safeSiteUrl(value) {
    const text = asText(value);
    if (!text || text.includes("\\")) return "";

    const external = safeHttpUrl(text);
    if (external) return external;

    const relative = text.replace(/^(\.\/|\/)+/, "");
    const segments = relative.split("/");
    if (!relative || segments.some((segment) => segment === "..")) return "";

    try {
      const url = new URL(relative, document.baseURI);
      return url.protocol === "http:" || url.protocol === "https:" || url.protocol === "file:"
        ? url.href
        : "";
    } catch {
      return "";
    }
  }

  function studyUrl(path) {
    const direct = safeHttpUrl(path);
    if (direct) return direct;

    const text = asText(path).replace(/^(\.\/|\/)+/, "");
    const segments = text.split("/").filter((segment) => segment && segment !== ".");
    if (!segments.length || segments.some((segment) => segment === "..")) return "";

    return `${ARCHIVE_REPOSITORY}/blob/main/${segments.map(encodeURIComponent).join("/")}`;
  }

  function demoUrl(demo) {
    if (!demo) return "";
    const status = normalizeStatus(demo.status);
    if (!["published", "external"].includes(status)) return "";
    const publicPath = asText(demo.publicPath);
    return safeHttpUrl(demo.url)
      || safeSiteUrl(demo.url)
      || safeSiteUrl(publicPath ? `${publicPath.replace(/\/+$/, "")}/` : "");
  }

  function formatDate(value, fallback = "未标注") {
    const text = asText(value);
    if (!text) return fallback;

    const date = /^\d{4}-\d{2}-\d{2}$/.test(text)
      ? new Date(`${text}T00:00:00`)
      : new Date(text);
    if (Number.isNaN(date.getTime())) return text;

    return new Intl.DateTimeFormat("zh-CN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  }

  function createElement(tag, options = {}) {
    const node = document.createElement(tag);
    if (options.className) node.className = options.className;
    if (options.text !== undefined) node.textContent = options.text;
    return node;
  }

  function createLink(label, href, className, projectTitle, external = false) {
    const link = createElement("a", { className });
    link.href = href;
    link.append(document.createTextNode(label));

    if (external) {
      const marker = createElement("span", { text: " ↗" });
      marker.setAttribute("aria-hidden", "true");
      link.append(marker);
    }

    link.setAttribute("aria-label", `${label}：${projectTitle}`);
    return link;
  }

  function createProjectCard(project, index) {
    const item = createElement("li", { className: "project-item" });
    item.style.setProperty("--entry-delay", `${Math.min(index, 8) * 45}ms`);

    const article = createElement("article", { className: "project-card" });
    const number = createElement("div", { className: "project-number", text: project.id });
    number.setAttribute("aria-label", `项目编号 ${project.id}`);

    const body = createElement("div", { className: "project-body" });
    const topline = createElement("div", { className: "project-topline" });
    const heading = createElement("h3", { className: "project-title" });
    const researchHref = studyUrl(project.studyPath);
    const sourceHref = project.repository;
    const titleHref = researchHref || sourceHref;

    if (titleHref) {
      heading.append(createLink(project.title, titleHref, "", project.title));
    } else {
      heading.textContent = project.title;
    }

    const status = statusDetails(project.status);
    const badge = createElement("span", { className: "status-badge", text: status.label });
    badge.dataset.tone = status.tone;
    topline.append(heading, badge);

    const summary = createElement("p", { className: "project-summary", text: project.summary });
    body.append(topline, summary);

    if (project.tags.length) {
      const tagList = createElement("ul", { className: "project-tags" });
      tagList.setAttribute("aria-label", "项目标签");
      project.tags.forEach((tag) => tagList.append(createElement("li", { text: tag })));
      body.append(tagList);
    }

    if (project.updatedAt) {
      const meta = createElement("p", {
        className: "project-meta",
        text: `UPDATED / ${formatDate(project.updatedAt)}`,
      });
      body.append(meta);
    }

    const actions = createElement("div", { className: "project-actions" });
    if (researchHref) {
      actions.append(createLink("阅读研究", researchHref, "project-action", project.title));
    }

    const liveDemoUrl = demoUrl(project.demo);
    if (liveDemoUrl) {
      actions.append(createLink("打开 Demo", liveDemoUrl, "project-action", project.title, true));
    }

    if (sourceHref) {
      actions.append(createLink("查看源码", sourceHref, "project-action is-secondary", project.title, true));
    }

    if (actions.childElementCount) body.append(actions);

    article.append(number, body);

    if (project.cover) {
      article.classList.add("has-cover");
      const figure = createElement("figure", { className: "project-cover" });
      const image = document.createElement("img");
      image.src = project.cover.path;
      image.alt = project.cover.alt;
      image.loading = "lazy";
      image.decoding = "async";
      image.addEventListener("error", () => {
        figure.hidden = true;
        article.classList.remove("has-cover");
      }, { once: true });
      figure.append(image);

      const captionParts = [project.cover.caption, project.cover.credit].filter(Boolean);
      if (captionParts.length) {
        figure.append(createElement("figcaption", { text: captionParts.join(" · ") }));
      }

      article.append(figure);
    }

    item.append(article);
    return item;
  }

  function createFilterButton(value, label, count, selected) {
    const button = createElement("button", { className: "filter-button" });
    button.type = "button";
    button.dataset.filter = value;
    button.setAttribute("aria-pressed", String(selected));
    button.append(document.createTextNode(label));
    button.append(createElement("span", { className: "filter-count", text: String(count) }));
    return button;
  }

  function renderFilters() {
    const counts = new Map();
    view.projects.forEach((project) => {
      counts.set(project.status, (counts.get(project.status) || 0) + 1);
    });

    const statuses = [...counts.keys()].sort((left, right) => {
      const order = statusDetails(left).order - statusDetails(right).order;
      return order || left.localeCompare(right, "zh-CN");
    });

    const fragment = document.createDocumentFragment();
    fragment.append(createFilterButton("all", "全部", view.projects.length, view.filter === "all"));
    statuses.forEach((status) => {
      fragment.append(
        createFilterButton(
          status,
          statusDetails(status).label,
          counts.get(status),
          view.filter === status,
        ),
      );
    });

    elements.filterOptions.replaceChildren(fragment);
    elements.filterBar.hidden = false;
  }

  function renderProjects() {
    const filtered = view.filter === "all"
      ? view.projects
      : view.projects.filter((project) => project.status === view.filter);
    const fragment = document.createDocumentFragment();
    filtered.forEach((project, index) => fragment.append(createProjectCard(project, index)));
    elements.projectList.replaceChildren(fragment);
    elements.projectList.hidden = false;
    elements.resultSummary.textContent = `显示 ${filtered.length} / ${view.projects.length}`;
  }

  function setSummary(projects, updatedAt) {
    const latestProjectUpdate = projects
      .map((project) => project.updatedAt)
      .filter(Boolean)
      .sort()
      .at(-1);
    elements.projectCount.textContent = String(projects.length).padStart(2, "0");
    elements.validatedCount.textContent = String(
      projects.filter((project) => project.status === "validated").length,
    ).padStart(2, "0");
    elements.lastUpdated.textContent = formatDate(
      updatedAt || latestProjectUpdate,
      projects.length ? "未标注" : "等待收录",
    );
  }

  function showLoading() {
    elements.catalogState.className = "catalog-state is-loading";
    elements.catalogState.setAttribute("aria-busy", "true");
    elements.catalogState.replaceChildren(
      stateMarker("···"),
      stateCopy("LOADING CATALOG", "正在整理项目索引", "目录很快就好。", true),
    );
    elements.catalogState.hidden = false;
    elements.projectList.hidden = true;
    elements.filterBar.hidden = true;
  }

  function stateMarker(text) {
    const marker = createElement("div", { className: "state-marker", text });
    marker.setAttribute("aria-hidden", "true");
    return marker;
  }

  function stateCopy(kicker, title, message, loading = false) {
    const copy = createElement("div", { className: "state-copy" });
    copy.append(
      createElement("p", { className: "state-kicker", text: kicker }),
      createElement("h3", { text: title }),
      createElement("p", { text: message }),
    );

    if (loading) {
      const lines = createElement("div", { className: "loading-lines" });
      lines.setAttribute("aria-hidden", "true");
      lines.append(document.createElement("span"), document.createElement("span"));
      copy.append(lines);
    }

    return copy;
  }

  function showEmpty(updatedAt) {
    view.projects = [];
    setSummary([], updatedAt);
    elements.filterBar.hidden = true;
    elements.projectList.hidden = true;
    elements.catalogState.className = "catalog-state is-empty";
    elements.catalogState.setAttribute("aria-busy", "false");

    const copy = stateCopy(
      "CATALOG / 000",
      "第一份研究正在路上",
      "目录已经就位。首个项目入库后，会在这里按稳定编号出现。",
    );
    copy.append(createLink("查看仓库与收录说明", ARCHIVE_REPOSITORY, "text-link", "研究档案", true));
    elements.catalogState.replaceChildren(stateMarker("000"), copy);
    elements.catalogState.hidden = false;
  }

  function showError() {
    view.projects = [];
    elements.projectCount.textContent = "—";
    elements.validatedCount.textContent = "—";
    elements.lastUpdated.textContent = "读取失败";
    elements.filterBar.hidden = true;
    elements.projectList.hidden = true;
    elements.catalogState.className = "catalog-state is-error";
    elements.catalogState.setAttribute("aria-busy", "false");

    const copy = stateCopy(
      "CATALOG UNAVAILABLE",
      "暂时无法读取项目目录",
      "请稍后重试；研究文件仍可从 GitHub 仓库直接访问。",
    );
    const actions = createElement("div", { className: "state-actions" });
    const retry = createElement("button", { className: "retry-button", text: "重新读取" });
    retry.type = "button";
    retry.addEventListener("click", loadCatalog);
    actions.append(
      retry,
      createLink("打开 GitHub 仓库", ARCHIVE_REPOSITORY, "text-link", "研究档案", true),
    );
    copy.append(actions);
    elements.catalogState.replaceChildren(stateMarker("!"), copy);
    elements.catalogState.hidden = false;
  }

  function showProjects(projects, updatedAt) {
    view.projects = projects;
    view.filter = "all";
    setSummary(projects, updatedAt);
    elements.catalogState.setAttribute("aria-busy", "false");
    elements.catalogState.hidden = true;
    renderFilters();
    renderProjects();
  }

  async function loadCatalog() {
    const requestId = ++view.requestId;
    showLoading();

    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

    try {
      const response = await fetch(CATALOG_URL, {
        cache: "no-cache",
        headers: { Accept: "application/json" },
        signal: controller.signal,
      });

      if (!response.ok) throw new Error(`Catalog request failed with ${response.status}`);

      const catalog = await response.json();
      const records = Array.isArray(catalog) ? catalog : catalog?.projects;
      if (!Array.isArray(records)) throw new TypeError("Catalog projects must be an array");
      if (requestId !== view.requestId) return;

      const projects = records.map(normalizeProject).sort(compareProjects);
      if (!projects.length) {
        showEmpty(catalog?.updatedAt);
        return;
      }

      showProjects(projects, catalog?.updatedAt);
    } catch (error) {
      if (requestId !== view.requestId) return;
      console.error("Unable to load the project catalog.", error);
      showError();
    } finally {
      window.clearTimeout(timeout);
    }
  }

  elements.filterOptions.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-filter]");
    if (!button || !elements.filterOptions.contains(button)) return;

    view.filter = button.dataset.filter;
    elements.filterOptions.querySelectorAll("button[data-filter]").forEach((candidate) => {
      candidate.setAttribute("aria-pressed", String(candidate === button));
    });
    renderProjects();
  });

  loadCatalog();
})();
