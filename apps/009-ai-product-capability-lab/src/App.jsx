import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  Check,
  Cube,
  Database,
  FlowArrow,
  MonitorPlay,
  Palette,
  Sparkle,
  X,
} from "@phosphor-icons/react";

const CapabilityWorld = lazy(() => import("./CapabilityWorld.jsx").then((module) => ({ default: module.CapabilityWorld })));

const SOURCE_REPOSITORY = "https://github.com/Qiuner/Qiuner.github.io";
const RESEARCH_ATLAS = "https://yydshly.github.io/0902_codex_project/demos/007-qiuner-qiuner-github-io/#architecture";

const spaces = [
  {
    id: "agent",
    index: "01",
    name: "Agent 工作流",
    eyebrow: "AI ORCHESTRATION",
    subtitle: "模型协作与工具链",
    description: "把感知、规划、工具调用、交付和反馈组织为可观察、可复用的工作流。",
    accent: "#1677ff",
    icon: FlowArrow,
    projects: [
      { name: "Yichen Skills", type: "个人工作流能力库", outcome: "把研究、内容、浏览器和交付方法沉淀为可路由、可验收的 Agent 技能。", stats: ["22 项工作流", "自然语言协议", "证据验收"] },
      { name: "0902 Research Atlas", type: "研究与原型流水线", outcome: "把源码取证、结构化结论、可运行 Demo 和发布验证组织成持续工作流。", stats: ["源码研究", "原型验证", "Pages 发布"] },
    ],
  },
  {
    id: "vision",
    index: "02",
    name: "视觉计算",
    eyebrow: "SPATIAL COMPUTING",
    subtitle: "3D 场景与实时体验",
    description: "用实时渲染、交互镜头和空间叙事，把抽象能力变成可以探索的产品体验。",
    accent: "#56b7ff",
    icon: MonitorPlay,
    projects: [
      { name: "Aurelia", type: "WebGPU 程序化生命实验", outcome: "从 GPU 软体、动态材料和交互反馈出发，验证视觉计算如何转化为产品体验。", stats: ["WebGPU Compute", "程序化软体", "音频响应"] },
      { name: "ThreeUI", type: "实时视觉 Registry", outcome: "把 Three.js、Canvas 和 Shader 效果整理成可检索、可运行、可编排的视觉能力库。", stats: ["48 个案例", "162 个配置", "43 类能力"] },
    ],
  },
  {
    id: "data",
    index: "03",
    name: "数据系统",
    eyebrow: "DATA PRODUCTS",
    subtitle: "指标、关系与决策界面",
    description: "从复杂数据结构中提炼清晰的决策界面，让指标、关系与异常变得可读。",
    accent: "#2f81ff",
    icon: Database,
    projects: [
      { name: "Neko Master", type: "实时流量事实系统", outcome: "把网关累计快照转化为可追踪、可聚合、可持久化的流量事实。", stats: ["差分采集", "热数据合并", "存储扩展"] },
      { name: "Lieflat Charts", type: "数据表达工作流", outcome: "依据数据形状和业务问题选择图表，让结论先于装饰抵达用户。", stats: ["64 种图表", "12 套报告", "选型规则"] },
    ],
  },
  {
    id: "research",
    index: "04",
    name: "设计研究",
    eyebrow: "DESIGN RESEARCH",
    subtitle: "案例拆解与方向验证",
    description: "通过案例拆解、视觉实验与快速原型，把模糊机会转化为可验证的产品方向。",
    accent: "#c28b51",
    icon: Palette,
    projects: [
      { name: "350 Layout Compositions", type: "布局研究档案", outcome: "用大规模版式练习建立结构、节奏与视觉判断力。", stats: ["350 个构图", "模式归纳", "视觉索引"] },
      { name: "Qiuner Reference", type: "3D 架构研究", outcome: "把共享渲染运行时、空间节点和详情层转化为个人能力世界。", stats: ["共享 Renderer", "World 模块", "DOM/WebGL 分层"] },
    ],
  },
];

function ProjectDemo({ project, accent }) {
  const [running, setRunning] = useState(false);
  const ProjectIcon = project.icon;

  useEffect(() => setRunning(false), [project.name]);

  return (
    <section className="demo-stage" aria-live="polite">
      <div className="demo-stage__topline">
        <span>能力样例</span>
        <span className={running ? "status status--live" : "status"}>{running ? "运行完成" : "待体验"}</span>
      </div>
      <div className="demo-stage__body">
        <ProjectIcon weight="duotone" />
        <p className="demo-stage__eyebrow">{project.type}</p>
        <h3>{project.name}</h3>
        <p>{project.outcome}</p>
        <div className="demo-stage__steps">
          {project.stats.map((item, index) => (
            <div key={item} className={running ? "demo-step demo-step--done" : "demo-step"}>
              <span style={{ borderColor: accent }}>{running ? <Check weight="bold" /> : index + 1}</span>
              {item}
            </div>
          ))}
        </div>
      </div>
      <button className="run-button" style={{ backgroundColor: accent }} onClick={() => setRunning(true)}>
        {running ? "再次运行" : "运行这个样例"}<ArrowRight weight="bold" />
      </button>
    </section>
  );
}

export function App() {
  const [activeId, setActiveId] = useState("agent");
  const [isLabOpen, setIsLabOpen] = useState(false);
  const [activeProjectIndex, setActiveProjectIndex] = useState(0);
  const [engine, setEngine] = useState(null);
  const [webglError, setWebglError] = useState(null);
  const returnFocusRef = useRef(null);
  const dialogRef = useRef(null);
  const [isDesktop, setIsDesktop] = useState(() => typeof window === "undefined" || window.matchMedia("(min-width: 1100px)").matches);

  const activeSpace = useMemo(() => spaces.find((space) => space.id === activeId) ?? spaces[0], [activeId]);
  const project = { ...activeSpace.projects[activeProjectIndex], icon: activeSpace.icon };
  const handleWorldReady = useCallback((info) => setEngine(info), []);
  const handleWorldError = useCallback((error) => setWebglError(error?.message || "WebGL 不可用"), []);

  function selectSpace(id) {
    setActiveId(id);
    setActiveProjectIndex(0);
  }

  function openLab() {
    returnFocusRef.current = document.activeElement;
    setIsLabOpen(true);
  }

  function closeLab() {
    setIsLabOpen(false);
    requestAnimationFrame(() => returnFocusRef.current?.focus?.());
  }

  useEffect(() => {
    if (!isLabOpen) return undefined;
    const focusableSelector = "button:not([disabled]), a[href], [tabindex]:not([tabindex='-1'])";
    const focusables = () => [...(dialogRef.current?.querySelectorAll(focusableSelector) ?? [])];
    const focusFrame = requestAnimationFrame(() => focusables()[0]?.focus());
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        closeLab();
        return;
      }
      if (event.key !== "Tab") return;
      const items = focusables();
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      cancelAnimationFrame(focusFrame);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isLabOpen]);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 1100px)");
    const update = () => setIsDesktop(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  if (!isDesktop) {
    return (
      <main className="desktop-gate">
        <span className="desktop-gate__mark"><Cube weight="duotone" /></span>
        <p>DESKTOP 3D EXPERIENCE</p>
        <h1>请在电脑浏览器中进入能力空间。</h1>
        <span>当前版本为桌面端 WebGL 原型。移动设备保留可读说明，不启动高负载 3D 场景。</span>
        <a href={RESEARCH_ATLAS}>先阅读架构研究 <ArrowRight weight="bold" /></a>
      </main>
    );
  }

  return (
    <main className="lab-shell">
      <a className="skip-link" href="#capability-panel">跳到当前能力说明</a>
      <Suspense fallback={<div className="world-loading" role="status">正在准备 WebGL 世界…</div>}>
        <CapabilityWorld
          spaces={spaces}
          activeId={activeId}
          onSelect={selectSpace}
          resetToken={0}
          onReady={handleWorldReady}
          onError={handleWorldError}
        />
      </Suspense>

      <header className="brand">
        <span className="brand__mark"><Cube weight="duotone" /></span>
        <div><strong>3D AI 产品与能力实验室</strong><small>PERSONAL CAPABILITY WORLD</small></div>
      </header>

      <a className="source-note" href={RESEARCH_ATLAS} target="_blank" rel="noreferrer">
        <span>QIUNER ARCHITECTURE STUDY</span>
        <strong>共享渲染器 · 空间节点 · 详情层 ↗</strong>
      </a>

      {webglError && (
        <section className="webgl-fallback" role="status">
          <strong>3D 场景暂不可用</strong>
          <p>{webglError}。仍可通过底部导航浏览全部能力与项目。</p>
        </section>
      )}

      <aside className="space-card" id="capability-panel" tabIndex={-1} style={{ "--accent": activeSpace.accent }}>
        <div className="space-card__meta"><span>{activeSpace.index} / 04</span><span>{activeSpace.eyebrow}</span></div>
        <h1>{activeSpace.name}</h1>
        <p>{activeSpace.description}</p>
        <div className="space-card__proofs">
          {activeSpace.projects.map((item) => <span key={item.name}><Check weight="bold" />{item.name}</span>)}
        </div>
        <button className="primary-action" style={{ backgroundColor: activeSpace.accent }} onClick={openLab}>
          进入项目区 <ArrowRight weight="bold" />
        </button>
        <a className="source-link" href={SOURCE_REPOSITORY} target="_blank" rel="noreferrer">查看 Qiuner 源库 <ArrowRight weight="bold" /></a>
        <small className="space-card__engine">{webglError ? "SEMANTIC FALLBACK ACTIVE" : engine ? `${engine.renderer} · ${engine.rooms} WORLDS` : "INITIALIZING RUNTIME"}</small>
      </aside>

      <nav className="space-nav" aria-label="能力空间导航">
        {spaces.map((space) => {
          const Icon = space.icon;
          const active = activeId === space.id;
          return (
            <button
              key={space.id}
              className={active ? "space-nav__item space-nav__item--active" : "space-nav__item"}
              style={{ "--accent": space.accent }}
              onClick={() => selectSpace(space.id)}
              aria-current={active ? "page" : undefined}
            >
              <span className="space-nav__index">{space.index}</span>
              <span className="space-nav__icon"><Icon weight={active ? "fill" : "duotone"} /></span>
              <span><strong>{space.name}</strong><small>{space.subtitle}</small></span>
            </button>
          );
        })}
      </nav>

      {isLabOpen && (
        <div className="modal-layer" onMouseDown={(event) => { if (event.target === event.currentTarget) closeLab(); }}>
          <div className="project-lab" ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="project-lab-title">
            <header className="project-lab__header">
              <div><span className="project-lab__eyebrow"><Sparkle weight="fill" /> {activeSpace.eyebrow}</span><h2 id="project-lab-title">{activeSpace.name} · 项目区</h2></div>
              <button className="icon-button" onClick={closeLab} aria-label="关闭项目区"><X weight="bold" /></button>
            </header>
            <div className="project-lab__content">
              <aside className="project-list">
                <p>选择真实样例</p>
                {activeSpace.projects.map((item, index) => (
                  <button
                    key={item.name}
                    className={index === activeProjectIndex ? "project-list__item project-list__item--active" : "project-list__item"}
                    onClick={() => setActiveProjectIndex(index)}
                    style={index === activeProjectIndex ? { borderColor: activeSpace.accent } : undefined}
                  >
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <div><strong>{item.name}</strong><small>{item.type}</small></div>
                    <ArrowRight />
                  </button>
                ))}
                <small className="data-note">项目名称与能力事实来自当前研究库；空间归类是本原型的演示映射，不代表上游官方定位。</small>
              </aside>
              <ProjectDemo project={project} accent={activeSpace.accent} />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
