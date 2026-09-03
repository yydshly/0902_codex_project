# ThreeUI 能力展台设计契约

## 目标锁定

| 字段 | 决策 |
| --- | --- |
| Entry mode | Brief-led，新建研究与演示子项目 |
| Request revision | 8：用户要求用“我们正在研究的优秀网页生成系统”中的实际任务展示能力；本轮把通用页面案例重构为一条可操作链路：Brief 映射 → 首屏候选 → 品牌适配 → 交互接线 → 浏览器质量门禁 → Kage 模板迁移，并让选择、回调、DOM 检查与能力协议产生真实状态变化 |
| Target user and context | 希望判断 ThreeUI 能力、原理与可复用价值的中文技术研究者和前端开发者 |
| Desired first impression | 先看到真实组件在 Hero、品牌系统、业务控制、数据模块与整页嵌入中的实际表现，再看到它适合怎样扩展、哪里会受限 |
| Visual ambition | Immersive |
| Experience architecture | Hybrid Workspace：上部为可切换的实时舞台，下部为原理和应用说明 |
| Visual constraints | 深色编辑式界面；视觉效果是主角；文字高对比；不伪造 ThreeUI 截图或运行能力 |
| Information constraints | 明确区分 Raw WebGL、Canvas 2D、Three.js、DOM/CSS 与完整 HTML 沙箱；说明它不是生成引擎 |
| Operation constraints | 支持键盘和指针切换案例；参数控件必须有标签和当前值；不依赖登录、后端或 Pro 权限 |
| State constraints | 默认、切换中、所选案例、reduced-motion、渲染能力不足五类状态均需有可理解反馈 |
| Environment constraints | React + Vite 静态输出；兼容 `/0902_codex_project/demos/003-mengto-threeui/`；依赖固定为 `@designcodeio/threeui@1.2.0` |
| Primary journey | 打开展台 → 进入“我们的生成链路” → 选择项目 Brief 并得到首屏候选 → 应用品牌视觉 preset → 触发生成 CTA 的宿主回调 → 运行真实 DOM 质量检查 → 查看 Kage 模板迁移边界与能力协议 → 再浏览完整能力索引、底层原理与系统意义 |
| User-defined phases | 获取库；展示能力与效果；说明原理；登记为新子项目 |
| Required artifacts | 研究 README、能力地图、完整 Community 能力索引、多类别真实 Web Demo、五类实际使用探测、可操作扩展实验、四幕概念产品组合演示、页面内“对我们的意义”与集成蓝图、Demo README、桌面与手机证据、封面、目录登记 |
| Autonomy authorization | 用户已明确要求新建并实现；范围内文件、依赖、构建和浏览器验证可直接执行 |
| User-decision boundary | 购买或接入 Pro、对外部署、引入后端或外部账号 |
| Observable completion criteria | 保留既有 13 例、43/163 索引与四幕概念案例；新增至少 5 个真实使用场景，逐项运行真实 ThreeUI 组件并显示 PASS/LIMITED/CONDITIONAL 结论；至少完成内容压力、运行时降级、参数 preset、宿主回调与单实例调度五种实际扩展探测；键盘、1440/1024/390px、reduced-motion、无 WebGL、构建与目录校验通过 |

## 体验架构

- **Scene base：** ThreeUI 提供的 WebGL、Canvas 2D、Three.js 与 DOM/CSS 组件。
- **Scene persistence：** 当前所选效果在首个主舞台中持续可见；进入长文说明后可自然离开视口。
- **Foreground control model：** 顶部导航、运行时选择器、参数控制和案例说明覆盖在舞台边缘，不遮住视觉中心。
- **State-to-scene mapping：** 选择不同运行时会更换真实 renderer，并同步技术标签、说明和可调参数。
- **Mobile transformation：** 舞台、选择器和说明纵向排列；控制区域不使用依赖 hover 的隐藏面板。
- **Fallback：** 每个演示均有 DOM 标题和原理说明；动画关闭或图形能力不足时，研究内容与导航仍然完整。

### 概念产品演示

- **Selected pattern：** Product case + cinematic product showcase，嵌在现有 Hybrid Workspace 中。
- **Product identity：** `KAGE STUDIO`，一个“从 brief 到可验证网页”的生成式设计系统概念页；所有产品文案明确为演示，不宣称真实后端能力。
- **Scene base：** Liquid Form、Circle Buttons、Orbital Sphere、Brand Orbs、Semantic Bloom 等真实 ThreeUI 组件，加可读 DOM 产品内容。
- **Scene persistence：** 组合舞台只在 `#product-demo` 区域持续存在；四幕切换时外壳、导航与进度保持，renderer 按幕替换。
- **Foreground control model：** 四个语义 tab、上一幕/下一幕、自动播放/暂停与真实 Circle button；不把控制藏在画布内。
- **State-to-scene mapping：** `signal → system → identity → proof`，分别承担建立主视觉、解释系统、展示适配、给出交付证明。
- **Mobile transformation：** 产品舞台从左右构图转为垂直内容；tab 保持 2×2/横向可达，不依赖 hover。
- **Fallback：** WebGL 不可用时保留产品标题、说明、指标和控制，并用 CSS 场景替代；reduced-motion 禁用自动播放和 renderer 速度。

### 实际使用探测台

- **Selected pattern：** Application probe workspace + production-hardening evidence；概念四幕保留为组合样本，但真实价值判断以探测台为主。
- **Usage scenarios：** Brief→Hero、品牌适配、CTA 接线、浏览器质量门禁与 Kage 模板迁移五类，分别覆盖 Raw WebGL、Canvas iframe、DOM/CSS callback、宿主 DOM audit 与完整 HTML iframe。
- **Probe controls：** 内容压力、静态降级、preset 切换、真实 click 回执和 renderer 选择；每项都必须改变可见结果，而不是只展示说明。
- **Evidence model：** 当前组件、宿主集成方式、实际观察、运行时成本和结论同时可见；结论只能是已验证 `PASS`、已观察限制 `LIMITED` 或带条件可用 `CONDITIONAL`。
- **Scene persistence：** 探测台只挂载当前所选场景，离开视口卸载 renderer；数据和整页 iframe 不与其他高成本场景并发。
- **Mobile transformation：** 左侧场景列表改为横向/双列可达控制，证据栏移到场景下方；所有业务操作保留。
- **Fallback：** 高成本视觉关闭、reduced-motion 或无 WebGL 时仍保留业务内容、操作和探测结论，明确视觉增强与基础产品 UI 的边界。

## 设计方向

| 决策 | 选定方向 | 可观察约束 | 验收标准 |
| --- | --- | --- | --- |
| 构图 | 以一个大尺寸实时舞台为视觉锚点，组件选择器贴近舞台 | 首屏只出现一个主要视觉焦点 | 用户首先看到当前效果，其次看到切换方式和技术标签 |
| 信息层级 | 规模 → 五类能力 → 代表效果 → 运行时 → 原理与边界 | 不用装饰卡片淹没原理 | 完整目录与底层路径在一次顺序浏览中可理解且不混淆 |
| 字体 | 中性无衬线正文 + 等宽技术标签 | 不下载第三方字体 | 中英文、数字和代码标签清晰无缺字 |
| 色彩与材质 | 黑曜石底色、暖白正文、荧光青/酸橙强调 | 强调色只用于状态和主操作 | 文本和控件在效果背景上保持清晰边界 |
| 动效 | ThreeUI 效果承担主要运动；界面转场克制 | reduced-motion 下取消界面位移并冻结/弱化非必要动画 | 不依赖动画传达选择和内容 |
| 意义表达 | 用“证据 → 系统位置 → 行动”解释价值，不写抽象宣传口号 | 明确区分可立即复用的组件、可沉淀的资产协议、不能由 ThreeUI 代替的生成智能 | 读者无需结合外部对话即可说出 ThreeUI 在 Kage 研究链路中的位置 |
| 集成蓝图 | 以四段式管线连接页面目标、Kage 编排、ThreeUI 资产和浏览器验收 | 每段都标明输入、输出与职责，ThreeUI 只能占其中一层 | 图示能说明“效果库不是生成器，但可以成为生成器的 renderer registry” |
| 成品组合 | 用一个有目标、有叙事、有状态的产品舞台组合能力 | 同一时刻只保留服务当前信息目标的视觉层；不把多个高成本效果无目的叠加 | 用户先看到完整产品信息层级，再能识别库组件怎样支撑该结果 |
| 产品节奏 | 四幕从氛围建立到交付证明，支持手动与自动导演 | 每幕驻留足够阅读；切换同步更新视觉、文案、指标和所用组件标签 | 自动播放可以完整走完，手动操作可随时接管且状态一致 |
| 使用场景 | 按真实页面职责组织探测，而不是按技术名称组织卡片 | 每个场景含业务内容、可执行操作、真实 renderer 与观察结论 | 用户能判断该能力在什么位置可直接用、需要怎样封装、何时不应使用 |
| 扩展实验 | 把扩展方向做成状态变化 | 内容压力、fallback、preset、回调与单实例调度均有可操作控件和可见结果 | 至少五种扩展方向被真实触发并记录，而非停留在路线图文字 |
| 证据表达 | 结果优先于宣传 | 每个场景显示 verdict、宿主耦合、运行时和已观察证据 | 页面不把“能渲染”误写成“适合生产”，限制与依赖同样醒目 |

## 覆盖清单

| 用户阶段 | 要求或产物 | 表面 / 状态 | 所需证据 | 阶段 | 状态 | 下一动作 |
| --- | --- | --- | --- | --- | --- | --- |
| 获取库 | 固定依赖和上游基线 | 工程 | `package.json`、lockfile、commit `68802d5` | 1 | pass | 无 |
| 展示效果 | 13 个跨五类真实 ThreeUI 案例 | 桌面默认与切换状态 | 13/13 tab 挂载；Canvas、WebGL、DOM、SVG、srcDoc 与 Kage URL iframe | 2–6 | pass | 无 |
| 说明原理 | 渲染栈、生命周期、沙箱与分发说明 | 无增强也可阅读 | 研究 README 与 `capability-map.md` | 3 | pass | 无 |
| 响应式 | 主旅程保持可用 | 1440、1024、390px | 1440 与 390 均 `scrollWidth === clientWidth`；手机截图 | 7 | pass | 无 |
| 键盘与可访问性 | 选择器、滑杆、链接可达 | 键盘、焦点、语义 | ArrowRight 从 Raw WebGL 切到 Canvas 2D；三条 range 和真实 button 通过 | 7 | pass | 无 |
| 动效边界 | reduced-motion 不隐藏信息 | reduced-motion | Chromium `reducedMotion: reduce` 下自动导览禁用且显示 `PAUSED` | 7–8 | pass | 无 |
| 能力降级 | 画布不是信息唯一载体 | Canvas/WebGL 不可用 | 模拟 WebGL context 失败，出现可读 fallback 并指引替代案例 | 8 | pass | 无 |
| 性能 | 多 renderer 不同时常驻 | 切换和离屏 | 每次只有一个活动组件；13 个组件独立 chunk；记录历史 Three.js 块和 Kage 资产成本 | 8 | pass | 在真实目标设备继续做帧时间预算 |
| 研究登记 | 新条目、封面和 Demo 发布信息 | 仓库 | `catalog:validate`、`catalog:check`、003 独立生产构建通过 | 9 | pass | 仓库全量构建待其他并行子项目释放文件锁后重跑 |
| 能力广度修订 | 不把四种 runtime 误写成完整效果集合 | 桌面能力总览 | 首屏明确 43 / 163 / 13；五类能力和完整索引入口可见 | 0–3 | pass | 无 |
| 完整索引 | 所有 Community 父条目与变体可浏览 | 搜索、分类、展开状态 | 默认 12 项摘要可展开至 43/43；163 变体；`brand` 搜索和按钮筛选通过 | 3–6 | pass | 无 |
| 多类别实效 | 原有四样本扩为多类别代表效果 | Live Lab 默认/切换/加载 | 13/13 个真实 npm 组件，覆盖五类；Kage 子文档含 4 canvas 和 2604 字符文本 | 4–8 | pass | 无 |
| 修订后跨表面 | 新增索引和选择器在窄屏仍可用 | 1440、1024、390px、键盘 | 1440 与 390 无横向溢出；13 个手机 tab 均为 176×66；ArrowRight 通过 | 7–9 | pass | 无 |
| 逐例可见性修复 | 13 个入口都不能停在空白、遮挡或永久加载 | 桌面逐 tab 稳定态 | 13/13 等待就绪并截图；旧 #7 近黑空态替换为可见生长树，#10 从微小单球改为三个放大品牌球；逐例稳定等待无应用错误或请求失败 | 1–6 | pass | 无 |
| 加载与恢复 | 重型组件切换时有明确 loading、超时与重试 | 慢加载、失败、快速切换 | 状态覆盖正在加载、仍在初始化、已就绪和重新加载；阻断 Kage 后故障注入验证 `slow → failed → ready`，预载完成 | 5–6 | pass | 无 |
| 外部依赖边界 | 公开演示不因第三方 CDN / 图片请求而呈现空白 | iframe、离线/请求失败 | 离线时 Tree、Bloom、Brand、Kage 无错误；Gauges/Toggle 的 CDN 增强失败但核心画面仍可见，说明中明确边界 | 6–8 | pass | 生产发布前自托管 Gauges/Toggle 的 Tailwind/GSAP 依赖 |
| 修复后跨表面 | 修复后的 13 例在桌面与 390px 均可选、可见、可返回 | 1440、390、键盘、reduced-motion、无 WebGL | 13/13 就绪；1440/390 无横向溢出；手机触控目标 176×66；键盘、reduced-motion、无 WebGL、生产构建通过 | 7–9 | pass | 无 |
| 对我们的意义 | 页面直接回答 ThreeUI 对当前网页生成研究的具体价值 | 桌面长文与移动阅读 | 四个判断均可见：立即验证、资产化方法、生成层分工、判断力壁垒；与 Kage 关系无歧义 | 3 | pass | 无 |
| 集成蓝图 | 将 ThreeUI 放进页面生成系统的真实链路 | 桌面图示、390px 纵向转换 | `Brief → Kage Planner → ThreeUI Registry → Browser Quality Gate` 四段输入/输出职责可读；附 P0/P1/P2 行动顺序 | 3–4 | pass | 无 |
| 意义区跨表面 | 新增长内容不破坏现有主旅程 | 1440、1024、390px、键盘/锚点 | 三尺寸 `scrollWidth === clientWidth`、管线文字裁切 0；桌面/平板键盘 Enter 到达 `#meaning`；手机保持 4 步纵向顺序 | 7 | pass | 无 |
| 修订文档一致性 | 展台、研究 README、能力地图对“意义”和行动建议口径一致 | 文档与构建产物 | 页面、Demo README、研究 README 与能力地图均说明 Brief/Kage/Registry/Quality Gate 分工；独立构建与目录检查通过 | 9 | pass | 无 |
| 最终产品组合 | 以同一产品目标组合多个库能力，不再只是孤立组件 | `#product-demo` 四幕稳定态 | Signal/System/Identity/Proof 4/4 均有完整产品标题、目的、指标与稳定视觉；Liquid、Circle、Orbital、3 × Brand、Bloom 共 7 个真实组件实例参与 | 2–5 | pass | 无 |
| 导演与控制 | 用户可手动、键盘或自动浏览完整叙事 | tab、上一幕/下一幕、播放/暂停/重置 | tab 选择、ArrowRight、Circle button 均同步场景；手动操作停止播放；自动播放约 20 秒停在 Proof 并切换为 `REPLAY STORY` | 4–6 | pass | 无 |
| 产品组合降级 | 高成本视觉不是理解产品的唯一载体 | reduced-motion、无 WebGL、加载 | 核心标题/说明/指标/证明均为 DOM；reduced-motion 显示 `MOTION OFF` 并禁用播放；无 WebGL 的 Signal/System 使用 CSS 静态场景且 System 标题保留 | 6–8 | pass | 无 |
| 产品组合跨表面 | 完成态产品效果在桌面/平板/手机均可体验 | 1440、1024、390px、键盘 | 1440 与 390 均 `scrollWidth === clientWidth`，产品舞台无溢出；390px 四个 tab 为 2×2、最小高度 62px，Identity 内容完整 | 7 | pass | 无 |
| 产品组合文档与工程 | 明确这是概念产品验证而非真实业务承诺 | README、能力地图、构建 | 页面标记 `CONCEPT PRODUCT / COMPOSITION DEMO`；Demo README、研究 README 与能力地图记录组合、边界、降级与成本；独立构建、依赖审计和目录检查通过 | 9 | pass | 无 |
| 实际场景探测 | 用我们的网页生成任务检验库能力，而非继续包装概念故事 | `#use-cases` 五个场景 | Brief/Hero 1 Canvas、Brand 1 iframe、CTA 1 原生 button、Quality Gate 1 iframe、Template 1 URL iframe；5/5 稳定挂载且逐项无舞台溢出 | 2–6 | pass | 无 |
| 可扩展方向实作 | 扩展建议必须产生可见、可测的状态变化 | 内容压力、fallback、preset、callback、调度 | 长文案保留 2 CTA；fallback 使 Canvas 1→0；Figma/Power/Editorial preset 可见；Action 计数 00→01；场景与离屏只保留当前 renderer，telemetry 同步 | 4–8 | pass | 无 |
| 使用结论边界 | 区分直接可用、需要适配和视觉组件自身的能力边界 | PASS/CONDITIONAL | 3 PASS / 2 CONDITIONAL 均附 API 与运行证据；Quality Gate 的 PASS 来自宿主 DOM audit，Gauge 无 value API、Brand 商标/iframe、Kage 资产/通信限制仍公开 | 3–8 | pass | 无 |
| 探测台跨表面 | 实际探测在宽屏与手机均可完成 | 1440、1024、390px、键盘、reduced-motion、无 WebGL | 三尺寸 `scrollWidth === clientWidth`；1024 长文案标题仍在舞台内且保留 2 CTA；390px tab 最小约 98px；方向键同步选中与焦点；两种 fallback 保留内容和控制 | 7–8 | pass | 无 |
| 探测文档与工程 | 研究结论与真实探测一致 | 页面、README、能力地图、构建 | 页面、Demo README、研究 README、能力地图均记录五场景、扩展实验、verdict 与边界；121 模块构建、0 vulnerability、6 项目录校验通过 | 9 | pass | 无 |
| 固定地址可用性修复 | `http://127.0.0.1:47311/#use-cases` 可直接打开并保留可复现启动方式 | 端口、HTTP、浏览器错误页与恢复页 | 基线为 47311 无监听、4 个标签均显示“无法访问此站点”；恢复后端口监听、HTTP 200、标题 `ThreeUI Runtime Atlas`、5 个场景、onClick 00→01、无横向溢出且 0 console error | 1–9 | pass | 无 |
| 我们的真实生成链路 | 场景不再是泛化营销/车载示例，而是优秀网页生成研究的五个实际任务 | `#use-cases` 默认态与五个 tab | 页面显示 6 步 Brief→Candidate→Brand→Events→Browser Gate→Template；五个 tab 分别运行 Liquid、Brand、Circle、Gauge/Kage 与宿主检查 | 2–5 | pass | 无 |
| Brief 到首屏候选 | 预设 brief 改变网页内容、CTA 与视觉方向，并保留长内容压力和增强层开关 | Hero 默认、brief 切换、long copy、fallback | 三个 brief 可选；创意工作室标题/正文/CTA 同步；长内容命中双语压力文本；fallback 后 0 Canvas、2 CTA、0 舞台溢出 | 3–8 | pass | 无 |
| 生成资产进入宿主 | 品牌应用与 CTA 接线都产生宿主可观察回执 | 品牌 preset、Apply、交互接线 callback | Figma Apply 后显示 `宿主已应用 FIGMA preset`；CTA 点击后 `HANDOFF EVENTS 00→01` 并显示交接回执 | 4–6 | pass | 无 |
| 浏览器质量门禁 | 质量页运行当前 DOM 的真实检查，而不是展示伪造仪表数值 | Quality Gate 初始、运行后、增强边界 | 实测 `PENDING→PASS`；输出无水平溢出、1 标题、1 控件、1 iframe；文案明确 Gauge 为 visual indicator only、结果来自宿主 DOM | 4–8 | pass | 无 |
| 我们的链路跨表面 | 新工作流在桌面、平板、390px 与键盘下保持可完成 | 1280/1024/390、tab 键盘、fallback | 三尺寸页面和舞台均无横向溢出；工作流为 6/3/2 列；tab 最小高 122/105/97px；ArrowRight 同步焦点与选择；390px Gate 高 970px 且可运行 | 7–8 | pass | 无 |
| 我们的链路文档与工程 | 页面、README、研究结论和能力协议口径一致 | 文档、TypeScript、生产构建 | Demo README、研究 README、能力地图与契约已同步；121 模块构建通过，`npm audit --omit=dev` 为 0，根目录 7 项 catalog 检查通过，最终浏览器 0 console error | 9 | pass | 无 |

## 验证环境

- Windows，Chromium `151.0.7922.34`，Vite `7.3.6`。
- 视口：`1440×900`、`1024×768`、`390×844`。
- 能力路径：WebGL 正常、WebGL 人工拒绝、`prefers-reduced-motion: reduce`。
- 浏览器结果：HTTP 200，无错误 overlay 或应用 console error。Our Generation Workflow 5/5 场景稳定、3 PASS / 2 CONDITIONAL；brief、Brand Apply、CTA callback、DOM audit 与 Kage preset 已触发；1280/1024/390px、键盘和静态 fallback 通过。既有 reduced-motion、无 WebGL 与产品组合 4/4 证据未受本轮业务层重构影响。
- 依赖结果：`npm audit --audit-level=low` 为 0；`npm run build` 通过。

## 精炼记录

| 观察 | 修改 | 结果 |
| --- | --- | --- |
| `npm audit` 最初报告 Vite / esbuild Windows dev server advisory | 将 Vite 固定到 `7.3.6`，lockfile 升级 esbuild 到 `0.28.2` | 0 个已知漏洞 |
| runtime badge 的通用 span 规则会误伤 reduced-motion 状态标签 | 将选择器收紧为直接首个子 span | 编号和 `PAUSED` 标签职责分离 |
| `useMemo` 被用于一次性能力探测 | 按 React 检查改为 lazy state initializer | 语义更明确，探测结果跨案例保持稳定 |
| 第一次 Vite 启动参数被 PowerShell 剥离，浏览器得到 404 空白页 | 改用本地 Vite 可执行文件和显式 `--host= / --port=` | HTTP 200，完整运行态验证通过 |
| 总仓库构建尝试重装 001 时遇到其 dev server 持有 `esbuild.exe`；聚合目录同时被 002 占用 | 不终止并行任务，只运行 003 独立构建与只读目录检查 | 003 本身完整通过；跨项目全量构建明确延后 |
| 用户指出首版“只演示和描述了四种效果” | 把四个 runtime 样本降级为原理解释层；新增 9 个实时案例与 43/163 完整索引 | 首屏明确总量，13/13 案例、索引展开、搜索、分类和移动端均有浏览器证据 |
| 用户反馈“内部有的打不开” | 旧验证只检查 DOM/iframe 是否挂载，未要求每个案例达到非空稳定画面 | 重新开放逐例可见性、加载恢复与外部依赖三项覆盖；先抓真实画面再修改 |
| 基线逐例截图确认 #7 近黑、#10 仅 56×56 像素可见 | #7 改用同库自包含 Generative Tree；#10 并列三个真实 Brand Orbs，并由宿主放大 | 两项均达到清晰可辨稳定画面；#7 离线无错误，#10 像素熵由 0.2847 提升至 2.3474 |
| Kage 约需 5–10 秒完成预载，旧自动导览 6.5 秒会过早切走 | Kage 导览驻留延长到 12 秒；舞台增加四态健康探针、error boundary 与重新加载 | 故障注入中状态依次为“仍在初始化 → 重新加载 → 已就绪”，`#pre.done` 为 true |
| 完整索引卡片曾容易被误解成 43 个实时窗口 | 标题区明确“43 项为元数据索引，13 项 LIVE 才是已接入演示”，结果标签改为 `METADATA INDEX` | 能力总量与可运行范围在同一屏中有明确语义边界 |
| 用户继续追问“对我的意义” | 原页面只有能力、原理与边界，浏览器基线确认无 `#meaning`、无 registry 系统位置、导航无意义入口 | 新增四个价值判断、四段集成管线、三步行动顺序和判断结论；页面内即可独立理解 |
| 新增区需适配长中文与英文字段 | 1440/1024 保持横向管线，390px 转纵向并旋转连接符；导航新增语义锚点 | 三视口无横向溢出，管线文字节点裁切为 0，桌面/平板键盘 Enter 可进入 `#meaning`，无 console error |
| 用户指出研究仍缺少“以产品最终效果为目标”的组合 | 浏览器基线确认无 `#product-demo`、无产品场景、导航也没有成品入口 | 新增 KAGE STUDIO 四幕概念产品、统一 director 与 DOM 产品层；组件从孤立样本变为同一叙事的视觉角色 |
| 多个产品 renderer 若随页面常驻会破坏视觉预算 | 产品舞台使用 IntersectionObserver 管理可见性，离开视口后以轻量 CSS 占位并卸载当前 ThreeUI renderer | Atlas 首屏不再额外挂载产品 WebGL；进入产品区才加载当前幕，场景切换只保留当前视觉组合 |
| 四幕视觉复核需证明是完成态而非技术拼盘 | 分别检查 Signal、System、Identity、Proof 的 1440px 稳定截图，再检查 390px Identity 构图 | 四幕均形成一致的产品外壳、内容层级和导演控制；移动端纵向重排，无裁切或横向溢出 |
| 产品组合需覆盖控制和降级而非只看截图 | 浏览器自动化触发 tab、ArrowRight、Circle button、20 秒自动播放、390px、reduced-motion 与 WebGL 拒绝 | 选择和焦点同步；播放停在 Proof；手机最小 tab 高 62px；两种降级保留 DOM 标题与完整导航；0 console error / 0 request failure |
| 用户澄清概念成品不是“真实价值” | 基线确认页面只有 4 个概念产品场景，没有 `#use-cases`、使用 verdict 或可执行探测控件 | 新增五场景 Application Probe Lab，并把它放在概念组合之前；导航首项改为“场景探测” |
| 使用价值需要同时显示成功与限制 | 联合检查公开 `.d.ts` 和真实 runtime；Circle 暴露标准事件，Gauge 只有 visual variant/外观，Kage 只有有限排版定制 | 页面按证据给出 2 PASS / 2 CONDITIONAL / 1 LIMITED；不把高完成度视觉等同于业务组件 |
| 扩展方向原先只有路线图文字 | 把内容压力、preset、视觉层开关、callback 和实例调度做成真实控件；报告实时输出最小能力协议 | Hero 1→0 Canvas 且 2 CTA 保留；Action 00→01；Figma/Power/Editorial 均产生可见结果；telemetry 与 renderer 同步 |
| 首轮浏览器检查发现 Hero 长文案压近控制边界、Brand 放大 iframe 越界、整页截图时可见性观察范围过大 | 收紧长文案字号；将缩放 iframe 约束在 33.333% 尺寸的裁剪卡片内；IntersectionObserver 从长 section 改为实际 workspace | 五个桌面场景 `stageOverflow === false`；Brand 清晰放大且不遮内容；Kage 在探测台内完成真实页面预载 |
| 实际场景需要跨表面与失败路径证据 | 运行 1440 全场景、1024 长文案、390 Data、键盘、reduced-motion、无 WebGL，并保留六张最终证据 | 三尺寸无横向溢出；390px 仪表可见；方向键焦点同步；两种 fallback 无 Canvas 且核心 DOM/控制保留；0 应用 console error |
| 用户反馈整个界面打不开 | PowerShell 确认 47311 无监听，内置浏览器中 4 个相关标签均为“无法访问此站点”；README 还给出了不一致的 4173 手动端口 | 增加 `dev:local` / `preview:local` 固定脚本并统一 README；服务恢复为 HTTP 200，新标签加载真实页面，5 个场景完整，业务回调 00→01，构建通过 |
| 用户希望案例符合我们的网页生成场景 | 浏览器基线显示五个 tab 仍是“营销 Hero / 品牌身份 / 业务操作 / 运营仪表 / 整页嵌入”，各自能运行但没有形成 Brief 到浏览器验收的连续工作流 | 保留 renderer 并重写为六步生成链路；三类 brief、Figma Apply、CTA 交接、DOM Gate 与 Editorial Kage preset 均通过真实交互，1280/1024/390px、键盘、fallback、构建和文档同步完成 |
