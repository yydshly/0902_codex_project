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

## 代表能力拆解

| 案例 | 实际底层 | CPU 职责 | GPU / 浏览器职责 | 参数入口 | 清理与暂停 | 典型用途 |
| --- | --- | --- | --- | --- | --- | --- |
| Liquid Form | Raw WebGL + GLSL | 编译/链接 shader，更新 time、mouse、morph 等 uniform | 在全屏四边形上并行计算每个像素 | speed、morph、noiseScale、metal、tint | 离屏停止 rAF；删除 buffer/shader/program | 抽象 Hero、品牌背景、材质研究 |
| Condensation | Canvas 2D | 维护水滴状态、碰撞合并、精灵缓存与涟漪 | Canvas raster / compositor | speed、dropAmount、opacity | 离屏停止 rAF；清空数组和缓存 | 天气、水汽、二维程序动画 |
| Orbital Sphere | Three.js r128 | 生成点集和轨道、更新 group / halo、管理 scene | WebGL 绘制 Points、Lines、Meshes | size、opacity、scale、hue、speed | dispose geometry/material/renderer | 数据地球、网络拓扑、科技视觉 |
| Circle Buttons | React DOM + CSS + SVG | 事件和 props 状态 | 布局、绘制、滤镜、合成与 transition | variant、mode、hue、saturation、brightness | 由 React/DOM 生命周期处理 | 可访问微交互、CTA、控制器 |
| Generative Tree | Canvas 2D + srcDoc iframe | 递归生成枝干、推进生长和粒子状态 | 隔离子文档内的 Canvas raster / compositor | speed、size、particleAmount、opacity、色彩滤镜 | IntersectionObserver、visibility 与 postMessage 暂停 | 自然主题 Hero、章节转场、程序化形态 |
| 完整页面类 | HTML 资产 + iframe / URL | React 外壳和参数桥接 | iframe 内独立执行原实现 | 字体、颜色、排版或 sourceUrl | iframe 生命周期；需额外通信治理 | 高保真整页展示、难拆分遗产作品 |

## 为什么它不是单纯的组件库

普通组件库重点是 API 稳定和产品 UI 一致性；ThreeUI 还承担视觉作品目录、实时参数面板、源码查看、变体组织、Community/Pro 发布边界和 Agent/CLI 交付。因此更接近一个小型视觉资产平台。

但它也没有形成真正的页面生成闭环：目录中的组件不会理解业务目标，不会自动决定信息架构，也不会判断多个强效果是否在视觉上冲突。

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

## 面向优秀网页生成系统的接口设想

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
| P2 | 自然语言检索与参数生成 | 承接 Kage / 网页生成工作流 | 将页面意图转为 id + validated props JSON |
| P2 | 视觉回归与 GPU 实机矩阵 | 解决“在我的机器上很好看”问题 | 固定种子截图 + 三档移动 GPU 帧时间阈值 |

## 本 Demo 的工程取舍

- Atlas 舞台只保留当前案例 renderer；产品舞台只在视口内挂载当前幕，离开视口即卸载，避免多个 GPU renderer 无目的常驻。
- Our Generation Workflow 同样只挂载当前使用场景，并实时报告 Canvas / iframe / button 实例、品牌应用与 DOM audit；它优先于概念组合案例承担可用性判断。
- 对 13 个组件使用独立 `React.lazy` 子路径；重型 Three.js、iframe 与品牌组件不进入首屏主块。
- 机器报告中的 43 个父条目和 163 个具名变体全部进入可搜索索引；实时舞台选择其中 13 个跨五类代表案例，明确区分“完整能力目录”和“代表性运行验证”。
- 参数面板只抽象能量、速度、色相三个跨案例概念，再映射为每个组件的真实 props。
- 在文字层解释 renderer，即使 Canvas 不可用也不丢失研究内容。
- WebGL 不可用时不给出空白画布；显示原因和可继续体验的替代项。
- 舞台显示加载、慢初始化、就绪和失败四态；失败后可重新挂载当前 renderer。故障注入已验证 Kage 从超时失败恢复到预载完成。
- reduced-motion 下停止自动导览并把实时组件速度设为 0。
- Kage 保留上游完整页面并在 iframe 中运行，本地复制其发布资产，避免把截图冒充整页能力。
- 曾近黑的 Constellation 代表样本已换成上游自包含 Generative Tree；Brand Orbs 同屏放大展示三个真实变体，避免“已挂载但肉眼像空白”。

## 已观察的成本

生产构建（Vite 7.3.6）输出：

| 文件角色 | Raw size | gzip |
| --- | ---: | ---: |
| 主应用 | 261.20 kB | 84.63 kB |
| Circle Buttons | 1.99 kB | 0.81 kB |
| Condensation | 3.42 kB | 1.75 kB |
| Liquid Form | 7.63 kB | 3.22 kB |
| Brand Orbs | 162.98 kB | 42.07 kB |
| Generative Tree | 24.43 kB | 7.82 kB |
| Skeuomorphic Toggle | 20.36 kB | 5.98 kB |
| 历史 Three.js 共享块 | 504.76 kB | 125.74 kB |
| 共享 CSS | 133.82 kB | 37.71 kB |
| Kage 页面与本地媒体资产 | 3,517.14 kB | 未统一压缩统计 |

这些数字说明按组件子路径只是第一步：对于包含独立 Three.js 版本的组件，还需要按需加载、缓存、实例数量和实际设备帧率共同决策。
