# ThreeUI 能力展台设计契约

## 目标锁定

| 字段 | 决策 |
| --- | --- |
| Entry mode | Revision-led：在已运行的研究子项目上继续补全真实网页角色 |
| Request revision | 20：用户要求整理对 ThreeUI 的最终理解、补充必要信息、完善 Web，并提交到远端 GitHub 完成公开部署。本轮保留既有 Registry、PageSpec、三层成品与 48 项 Live Lab，把研究样机收束为可独立阅读、可从首屏进入主旅程、具备发布元数据和线上验证证据的公共交付物。 |
| Target user and context | 希望判断 ThreeUI 能力、原理与可复用价值的中文技术研究者和前端开发者 |
| Desired first impression | 先看到真实组件在 Hero、品牌系统、业务控制、数据模块与整页嵌入中的实际表现，再看到它适合怎样扩展、哪里会受限 |
| Visual ambition | Immersive |
| Experience architecture | Hybrid Workspace：上部为可切换的实时舞台，下部为原理和应用说明 |
| Visual constraints | 深色编辑式界面；视觉效果是主角；文字高对比；不伪造 ThreeUI 截图或运行能力 |
| Information constraints | 明确区分 Raw WebGL、Canvas 2D、Three.js、DOM/CSS 与完整 HTML 沙箱；说明它不是生成引擎 |
| Operation constraints | 支持键盘和指针切换案例；参数控件必须有标签和当前值；不依赖登录、后端或 Pro 权限 |
| State constraints | 默认、切换中、所选案例、reduced-motion、渲染能力不足五类状态均需有可理解反馈 |
| Environment constraints | React + Vite 静态输出；兼容 `/0902_codex_project/demos/003-mengto-threeui/`；依赖固定为 `@designcodeio/threeui@1.2.0` |
| Primary journey | 从公开项目页进入 ThreeUI 展台 → 首屏理解“视觉 Registry 而非生成引擎”的定位 → 进入自然语言 Brief 主旅程 → 编译 PageSpec 并生成三层推荐 → 查看/编辑/全屏验证成品 → 按需进入实际探测、Live Lab、完整索引与原理边界 → 从研究文档复核证据与采用建议 |
| User-defined phases | 获取库；展示能力与效果；说明原理；登记为新子项目；把效果组合推进为真实 Brief 驱动的可编辑生成链路；整理最终理解；完善 Web；提交远端并公开部署 |
| Required artifacts | 研究 README、能力地图、完整 Community 能力索引、多类别真实 Web Demo、五类实际使用探测、可操作 Registry、自然语言 Brief 输入、本地 Planner adapter、结构化 PageSpec、可编辑全屏三段式产品输出、PageSpec JSON 导出、集成透视、单项检查、页面内最终结论与集成蓝图、Demo README、桌面与手机证据、更新后的封面与目录登记、SEO/分享元数据、Git 定向提交、GitHub Pages 工作流与公开 URL 验证 |
| Autonomy authorization | 用户已明确要求新建并实现；范围内文件、依赖、构建和浏览器验证可直接执行 |
| User-decision boundary | 购买或接入 Pro、引入真实 Planner/LLM 后端、绑定新域名或外部账号、替用户承诺未实测的生产性能 |
| Observable completion criteria | 保留 48 个实时案例、162 个配置、43 LIVE / 0 PARTIAL / 0 INDEX、PageSpec、三层成品、全屏、透视、编辑、导出和单实例行为。研究文档在首屏给出本质、能力、原理、场景、边界、扩展和“对我们的意义”的一致结论；Web 首屏提供主旅程与能力入口，数字口径与目录登记一致，并具备 canonical / Open Graph / Twitter 元数据。独立生产构建、根目录目录校验、Pages 子路径预览、公开 URL、关键交互、浏览器错误日志和 GitHub Actions 部署均通过；提交只包含 003 与必要的目录/封面文件。 |

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

### 实时能力补全

- **Baseline evidence：** 浏览器基线显示 `LIVE 13 / 13`；本地包目录实际有 103 个公开组件入口。当前页面已解释 43 个 Community 父条目与 163 个具名变体，但没有把环境场景、集合级变体、加载状态和第二种整页模板放到实时舞台。
- **Selected slice：** 新增 Warp Field、Landscape、Text Animation、Rectangle Buttons、Uplink Loader、Bookshelf 六个真实组件，分别补齐高速空间背景、天气/时间环境、标题与字标动效、22 种 CTA 家族、加载反馈和可交互 3D 物体。
- **Variant control：** Warp Field、Landscape、Text Animation 与 Rectangle Buttons 在共用控制区提供真实 `variant` 选择；选择后重新挂载当前 renderer，并同步交互提示与能力说明。
- **Runtime budget：** 仍保持单舞台单 renderer；所有新增入口继续 `React.lazy` 分块，完整页面放在 URL iframe 中，避免 19 个能力同时常驻。
- **Truth boundary：** 103 是 npm 公共入口数，包含集合组件和单变体便捷入口；43 是目录父条目，163 是具名变体，19 是本页经过实际挂载的代表案例。四个数字不得互相替代。
- **Fallback：** 新增 Warp Field 标记为需要 WebGL；其他案例继续依赖自身公开边界。所有案例即使渲染失败仍保留 DOM 名称、说明、重试与相邻能力入口。

### 第二轮能力补全与选择器优化

- **Baseline evidence：** 当前浏览器为 `LIVE 19 / 19`，Bookshelf 已就绪且 page/stage overflow 为 0；但 19 个 tab 在窄屏形成很长的二维列表，继续添加案例会显著增加查找成本。
- **Selected slice：** 新增 Structure Flow（13）、Portal Field（5）、Gallery Heading（4）、Diagnostics Panel（3）、Woven Cloth（4）与 Japanese Tower（6）六个集合入口，共新增 35 个可切换变体；分别补足系统结构、空间深度、编辑排版、诊断界面、材质表面和文化建筑环境。
- **Control model：** 在 25 项案例前加入“全部 + 五类”筛选器并显示数量。筛选会停止自动导览；若当前案例不属于新筛选，切到该类第一项；左右方向键只循环当前可见集合。
- **Runtime budget：** 新增组件继续按子路径懒加载；Japanese Tower 使用包内本地 `japanese-tower.html`；舞台保持单 renderer，不为“补全”同时挂载多个场景。
- **Truth boundary：** 本轮新增 35 个变体的“可运行”探测只证明稳定画面、选择器、状态和布局；不等于每个变体均通过实机帧时间、内容适配或业务语义验收。

### 第三轮成品网页角色补全

- **Baseline evidence：** 浏览器基线无 console error，五类筛选可用；但当前 25 项仍偏重背景、材质和场景，缺少内容开场、人物/作品浏览、生成动作、转化页尾和第二种产品陈列整页。
- **Selected slice：** 新增 Editorial Intro、Character Carousel、Energy Globe、Laser Focus、Generate Action、Newsletter Footer 与 Complete Shelf，覆盖从章节开场到页尾转化的七种成品网页角色。
- **Control model：** Character 暴露 filmstrip / wave，Laser 暴露五种光场，Globe 明确其单一 energy-orb 配方；所有选项沿用统一参数栏、分类筛选和筛选内方向键。
- **Runtime budget：** 七个入口继续按子路径 lazy；Complete Shelf 使用 900,296 bytes 同源 HTML；Character 与 Generate 的大块成本必须在构建中公开，舞台仍只挂载当前 renderer。
- **Truth boundary：** Generate Action 没有公开业务事件或 loading API，Globe 没有地理数据模型，Newsletter 只做本地 success，Complete Shelf 没有商品后端；页面必须把这些限制写在当前能力边界中。

### 第四轮父能力覆盖补全

- **Baseline evidence：** 浏览器基线为 `LIVE 28 / 32`，五类筛选显示 32 / 10 / 5 / 7 / 4 / 6，当前案例已就绪且页面可操作；覆盖映射复核后确认 32 个案例对应 27 / 43 个父条目，完整索引没有逐项说明是完整接入、部分接入还是仅有元数据。
- **Selected slice：** 新增 Predictive Arc、Constellation Network、Wireframe Forms、Liquid Metal CTA、Engraved Certificate 与 Temple Night，分别承担预测决策、关系网络、结构原型、关键行动、可信凭证和沉浸叙事六种实际网页角色。
- **Coverage model：** 43 个父条目必须显示 `LIVE`、`PARTIAL` 或 `INDEX`。`LIVE` 表示父条目的全部已登记具名变体在实时舞台可选，`PARTIAL` 表示只有代表变体已接入，`INDEX` 表示当前只有元数据；存在对应案例时提供“运行案例”回跳。
- **Variant control：** Predictive Arc 暴露 8 种预测/光场变体，Constellation 暴露 8 种网络/防御变体，Wireframe 暴露 3 种几何形态，Liquid Metal 暴露 3 种行动形态；Temple Night 的单一夜景配方与 Engraved 单例不伪造多余选项。
- **Runtime budget：** 六个入口继续按子路径 lazy；实时舞台仍只挂载当前 renderer。iframe 型能力的“已就绪”只证明稳定表面，不代表已经拥有业务数据、文案或事件协议。
- **Truth boundary：** 父条目覆盖数、实时案例数、公开组件入口数和具名变体数分别统计并在同屏解释；任何 `PARTIAL` 与 `INDEX` 项不得被描述为全量生产验收。

### 第五轮部分覆盖清零

- **Baseline evidence：** 真实浏览器基线为 38 个实时案例、102 个现场配置；覆盖地图为 `26 LIVE / 7 PARTIAL / 10 INDEX`。7 个 `PARTIAL` 条目都已有代表画面，但 selector 并未暴露其完整登记变体。
- **Selected slice：** 在既有案例内部补全 CRT 4、Elements 5、Circle Buttons 3、Animated Dock 4、Brand Orbs 23、Performance Gauges 4 与 Skeuomorphic Toggle 4 个变体，不新增同质 tab。
- **Control model：** 七个案例沿用统一 variant select；切换时重新挂载当前 renderer、同步变体标签与运行状态。Circle 与 Toggle 继续把真实业务事件回传给宿主。
- **Coverage model：** 完成后 33 个已有实时证据的父条目全部成为 `LIVE`，`PARTIAL` 为 0；剩余 10 个 `INDEX` 仍明确表示只完成元数据登记。
- **Runtime budget：** 同一时刻仍只挂载当前案例。Brand 从三个并发 iframe 改为一个选中品牌实例，补全选择面的同时减少常驻渲染器数量。
- **Truth boundary：** 全量变体可运行只表示 API、稳定表面和容器边界通过，不自动等同于商标授权、真实数据接线、持久化或目标设备性能背书。

### 第六轮父能力运行闭环

- **Baseline evidence：** 真实浏览器基线为 38 个实时案例、142 个现场配置；覆盖地图为 `33 LIVE / 0 PARTIAL / 10 INDEX`。最后 10 个父条目已有包级组件和目录元数据，但没有实时画面、变体选择或同源资产证据。
- **Selected slice：** 新增 Bestsellers Book Showcase、Sylva Hero、Meng To Sketchbook Landing Page、Spark Badge、Globe Study、Shader Buttons、Gallery、Sylva Living World、Koi Studies 与 Sketchbook 十个入口；其中 Globe Study 与 Shader Buttons 各暴露 6 个登记变体，共新增 20 个可运行配置。
- **Asset model：** Landing Pages 与 Sketchbook 只使用 `@designcodeio/threeui@1.2.0` 包内资产复制到 `public` 后的同源路径；不以第三方网络成功作为就绪条件。完整 HTML 继续由 sandboxed iframe 承载，React 宿主负责选择、状态、说明和恢复。
- **Coverage model：** 完成后 43 个 Community 父条目全部具有实时证据并标为 `LIVE`；`PARTIAL` 和 `INDEX` 均为 0。该结论表示目录登记面已建立运行路径，不表示 163 个具名变体都完成生产性能或业务接线验收。
- **Runtime budget：** 十个入口继续使用固定子路径 lazy import；舞台保持单实例。高成本整页、WebGL、Canvas 与 iframe 不并发常驻，切换即卸载；reduced-motion 关闭宿主自动导览并把可控 speed 传 0。
- **Visual acceptance：** 每个默认案例与 12 个集合变体都必须达到可辨识画面、健康状态 ready、非空表面和舞台无横向溢出；雾层、透明层或仅 DOM 挂载不能单独算通过。

### 第七轮生产价值优化

- **Baseline evidence：** 真实浏览器中 Live Lab 有 48 个 tab、没有搜索输入；当前宽度下列表 `scrollHeight=1584px`、可视高度仅 `264px`。Sylva 的生产构建同时下载约 `215.53 kB gzip` 的公开 React 适配器，再由宿主把其中 iframe 替换成同包 authored HTML，造成无结果增益的初始化与传输。
- **Selected slice：** 增加实时案例搜索和结果计数，检索字段覆盖标题、角色、运行时、类别、摘要与 variant；搜索与类别筛选组合生效。Sylva 改由 `ReferenceFrameStage` 直接创建 sandbox iframe，保留 1600×880 cover、同源 URL、加载状态和单实例约束。
- **Preserved invariants：** 48 个案例、162 个配置、43 / 43 LIVE、分类计数、方向键 roving focus、自动导览、reduced-motion、错误恢复与 authored source 画面均保持。
- **Acceptance：** 查询能缩短 48 项导航且无结果时不给出失效 tab；清空后恢复原集合。Sylva 仍为可辨识苔藓世界、ready、单 iframe、无舞台溢出；生产构建不再生成 `SylvaLivingWorldScene` chunk；1280、1024、390px 与键盘路径无回归。

### 第八轮 Registry 自动选型原型

- **Baseline evidence：** 真实页面已展示 48 个案例和 `ThreeUI Registry` 的概念，但浏览器基线没有 `#selector`，导航也没有选型入口；用户只能人工搜索组件，无法输入项目约束后得到组合建议。
- **Product loop：** 选择项目 brief → 选择设备与预算 → 生成三层视觉组合 → 查看总分、选中理由、运行时、成本级别、fallback 和被预算排除的候选 → 切换推荐卡片预览 → 在 Live Lab 打开对应真实案例。
- **Truth boundary：** 这是基于当前 1.2.0 探测数据的本地规则引擎原型，不宣称 AI 推理、后端生成或真实性能遥测；分数用于演示资产协议怎样驱动选择，不是跨项目通用质量分。
- **Scene base：** 当前选中候选使用真实 `DemoStage` renderer；产品文案、状态、理由和 fallback 始终使用可读 DOM。
- **Scene persistence：** 选型 workspace 进入视口才挂载当前一个 renderer，离开即卸载；不得与候选数量一起并发渲染。
- **State-to-scene mapping：** brief、设备或预算变化进入 dirty 状态；点击生成后更新组合与视觉；选择候选同步预览；reduced-motion 或无 WebGL 时保留完整建议与静态预览。
- **Mobile transformation：** 两栏 workspace 转为单列，控制和结果先于预览；候选卡与操作按钮保持至少 44px 可触达，不出现横向溢出。
- **Acceptance：** 四类 brief、三档预算与两种设备形成可观察的不同结果；至少一条轻量预算会排除重型候选；候选键盘切换、生成状态、Live 回跳、390px、reduced-motion、无 WebGL、构建与文档全部通过。

### 第九轮三层网页编排

- **Baseline evidence：** 真实浏览器中 Registry 已返回 Sylva Living World / Woven Cloth / Newsletter Footer 三层组合，但输出区只有候选卡、一个 `selector-preview-stage` 和单项理由；没有组合/检查模式，也没有一个页面同时表达三层推荐的实际结构。
- **Selected slice：** 在推荐卡下增加“组合成品 / 单项检查”双模式。组合模式生成一个带浏览器外壳的三段式网页：Scene anchor 负责 Hero，System layer 负责结构说明，Action layer 负责行动收束；每段保留 DOM 内容、所用组件、分数和检查入口。
- **Runtime policy：** 组合页面包含三个视觉槽位，但任意时刻只挂载当前页面段对应的一个真实 `DemoStage` renderer；其余段显示明确的静态待机层。页面内导航和滚动位置共同驱动活动段，避免把“组合”误写成三个 GPU/iframe 并发。
- **State mapping：** 重新生成后组合回到 Hero 并更新 revision；点击候选卡切换到单项检查；切回组合模式保留当前生成方案。三段导航可用鼠标和键盘触发，活动段、renderer 与状态标签同步。
- **Truth boundary：** 这是前端编排原型，不生成路由、CMS、后端、真实表单提交或生产代码；真实 ThreeUI renderer 只承担视觉层，核心标题、说明和 CTA 始终在宿主 DOM。
- **Mobile transformation：** 组合模式按钮、浏览器栏和三段导航在 390px 下保持可触达；页面段改为纵向构图，内部滚动不制造横向溢出。
- **Acceptance：** 组合/检查模式可逆；三段导航分别挂载三项真实候选且实例数始终为 1；重新生成更新整页内容；Live 回跳保持；1280/1024/390px、键盘、reduced-motion、无 WebGL、构建与文档通过。

### 第十轮成品深度与集成透视

- **Baseline evidence：** 真实浏览器在约 550×898 的应用表面中，生成页只有约 497px 宽并嵌在长工作台内；内部页面虽有三段内容，但用户必须在窄小窗口中滚动。浏览器栏只有实例状态，缺少全屏入口、产品证明带和组件/DOM/运行预算的现场映射，因而更像技术样机而非最终体验。
- **Selected slice：** 为同一组合增加可恢复的全屏产品模式；在页面内加入产品身份、证明指标和更完整的内容层级。增加“成品视图 / 集成透视”控制，透视态直接显示当前层的组件 id、页面职责、runtime、成本、fallback 以及宿主 DOM / ThreeUI renderer 边界。
- **Foreground behavior：** 全屏是生成页自身的前景状态，提供明确退出按钮并支持 Escape；进入时锁定背景滚动，退出后恢复触发按钮焦点。三段导航、透视控制和单项检查在全屏内保持可达。
- **Runtime policy：** 深化信息层不增加并发视觉实例；全屏、透视和产品证明带只改变宿主 DOM，仍保持一个活动 renderer 与两个静态待机层。
- **Mobile transformation：** 390px 全屏使用完整视口，工具栏和透视信息重排为紧凑栅格；不把 inspector 做成遮挡内容的悬浮侧栏，三段导航保持 44px 触控目标。
- **Truth boundary：** 产品内容和指标用于演示编排与运行约束，不宣称真实客户、转化率或生成后端；集成透视只显示已登记的固定探测证据。
- **Acceptance：** 550px 常规工作台和 1280 / 1024 / 390px 全屏均能完整浏览；全屏打开、Escape 关闭、焦点返回、成品/透视切换、三段导航、单实例、reduced-motion、无 WebGL、构建与文档全部通过。

### 第十一轮 Brief → PageSpec → 可编辑成品

- **Baseline evidence：** 当前 `#selector` 只有四个固定项目按钮、设备和预算；没有自然语言输入。生成结果的 Hero/System/Action 文案来自四份硬编码 profile，机器结果只记录选型，不包含可交给真实 Planner 或代码生成器的内容协议；成品也不能现场编辑或复制 PageSpec。
- **Selected slice：** 在左侧增加自然语言 Brief textarea 和可恢复示例；点击主操作后由显式标记为 local deterministic 的 Planner adapter 编译 PageSpec，并把同一 spec 传给 Registry 与三段成品。结果区增加 PageSpec 概览、内容编辑和复制 JSON。
- **PageSpec boundary：** PageSpec 记录 source、brand、audience、goal、direction、device、budget、revision、Hero/System/Action 内容和三个视觉 slot；当前 adapter 只做关键词、preset 和模板映射，不宣称 LLM 理解。接口保持可被后续真实 Kage Planner 替换。
- **Editing model：** 编辑只更新已生成 PageSpec 的内容字段和成品 DOM，不暗中重新评分或替换 ThreeUI 组件；修改输入 brief、preset、device 或 budget 进入 dirty 状态，只有再次生成才产生新 revision 和候选。
- **Control model：** 输入、生成、编辑、保存、取消和复制都提供标签与状态反馈；编辑区嵌在输出证据层，不遮挡成品舞台。复制失败必须显示恢复说明，而不是静默失败。
- **Mobile transformation：** 390px 下 textarea、PageSpec 摘要和编辑表单为单列，操作按钮至少 44px；长 Brief、长标题和中英文混排不制造页面或成品横向溢出。
- **Truth boundary：** 当前输出是确定性前端 adapter，不调用远程模型、不生成真实后端、路由或分析数据；导出的是 JSON 协议，不冒充已完成的生产代码仓库。
- **Acceptance：** 输入新的中文 Brief 后 revision、PageSpec 摘要、成品标题与选择结果同步；编辑至少 Hero 标题、正文、CTA、System 标题和 Action 标题后同一成品实时更新；取消恢复已生成内容；复制 JSON 有可见回执；四种视口、键盘、单实例、reduced-motion、无 WebGL、构建和文档通过。

### 第十二轮研究收束与公开发布

- **Baseline evidence：** 功能主旅程已经成立，但首屏仍以 Live Lab 为第一视觉结果，缺少直接进入 Brief → PageSpec 的明确行动；目录摘要、封面说明和更新时间仍停留在早期 13 案例口径；页面只有基础 description，没有公开 URL、社交分享和发布状态元数据。研究全文虽完整，却缺少一屏即可转述的最终判断。
- **Selected slice：** 首屏补充“用 Brief 生成页面”和“查看 48 项能力”两个明确入口，并用发布状态条公开 48 / 162、PageSpec 0.1、43 / 43 与单 renderer 约束；研究 README 增加最终理解表，能力地图同步从 PageSpec 到 Registry 的采用边界；修正已实现功能仍被列为未来扩展的问题。
- **Release model：** 更新项目目录摘要、日期、封面及 SEO / Open Graph / Twitter 元数据；独立构建后从根目录生成 Pages 产物，以仓库既有 GitHub Actions 部署到固定子路径。
- **Change boundary：** 定向暂存 003 应用、研究文档、目录记录与根 README；不吸收工作区内 005、006、009 等其他项目的未提交修改。
- **Truth boundary：** 公开页面不得把 48 个现场案例写成全部 163 个变体的生产认证，也不得把本地确定性 adapter 写成 AI 生成器；线上成功只证明静态交付、路由、资产与已测交互可用。
- **Acceptance：** 研究结论、Web 首屏、目录卡片与封面数字一致；目标应用生产构建、catalog validate/check、Pages 子路径 HTTP 和浏览器关键路径通过；远端提交可追踪，GitHub Pages workflow 成功，公开地址返回正确标题且无应用错误。

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
| 现场发现效率 | 让 48 个案例既可按类别浏览，也可按业务角色和运行时直接查找 | 搜索与类别叠加，实时显示命中数；无结果态可恢复 | 用户不需要在 1584px 高的内部列表中盲目滚动 |
| 适配器成本 | authored source 已能满足画面时不重复下载失效的组件外壳 | Sylva 保留同源、sandbox、参考尺寸与单 iframe，但移除无贡献 lazy chunk | 画面和交互边界不变，构建产物明确减少 |
| 自动选型工作区 | 左侧输入约束，中部输出推荐证据，右侧用一个真实 renderer 展示当前候选 | 结果先于装饰；每个分数都有选择理由、成本和 fallback；当前候选是唯一视觉焦点 | 用户无需阅读研究全文即可完成一次“约束 → 组合 → 预览 → 深入检查”闭环 |
| 推荐状态 | 把输入变化、重新生成、当前候选、淘汰项与能力边界做成明确状态 | 修改约束不会伪装成已重新计算；生成后显示新 revision 和结果变化 | 用户能区分当前配置、上一次结果和为什么某候选被排除 |
| 三层网页编排 | 推荐结果默认进入一个可滚动的三段式页面，而不是继续停留在组件卡 | 每段有明确页面职责、DOM 内容和对应真实 renderer；网页外壳与单项检查共享同一 plan | 用户能看见三个候选怎样分别服务 Hero、系统说明与行动收束 |
| 组合运行预算 | 三个页面槽位只激活当前段的 renderer | 页面内导航和可见性同步活动层；待机段不创建 Canvas/iframe | 任意段切换后组合区始终只有一个活动视觉实例 |
| 成品深度 | 嵌套工作台可展开为独立产品输出，并补充真实内容层级与证明信息 | 全屏状态保留同一 plan、三段导航和活动层，不复制 renderer | 用户可以先按最终网页阅读，再回到工作台继续选型与检查 |
| 集成透视 | 把“视觉底座怎样接入页面”做成可切换的现场证据 | 同时标出宿主 DOM、ThreeUI renderer、页面职责、runtime、cost 与 fallback | 用户无需阅读外部文档即可解释当前层由谁负责、怎样降级、为什么被选中 |
| Planner 输入 | 用一个明确的自然语言 Brief 作为生成链路起点，preset 只作为方向提示 | textarea 的值与已生成 source 分离；未提交变化有 dirty 状态 | 用户能区分“正在编辑的需求”和“当前成品使用的需求” |
| PageSpec 证据 | 把内容、目标、设备、预算与视觉槽位统一为可检查协议 | 摘要、编辑器、成品和 JSON 使用同一个 spec；复制有反馈 | 用户可以说明上层生成器与 ThreeUI Registry 的数据接口，而不是只看到视觉结果 |
| 可编辑成品 | 内容修改与视觉重选是两个独立操作 | 编辑只改变宿主 DOM 文案，当前三项 renderer、分数与成本不变 | 用户能现场验证 ThreeUI 是视觉底座，产品内容仍由上层拥有 |

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
| 我们的链路文档与工程 | 页面、README、研究结论和能力协议口径一致 | 文档、TypeScript、生产构建 | Demo README、研究 README、能力地图与契约已同步；153 模块构建与根目录 catalog 检查通过；上一轮 audit 为 0，本轮注册表请求超时无输出 | 9 | pass | 重新联网后可刷新依赖审计 |
| 公共导出与实时覆盖差异 | 页面准确解释 103 入口、43 父条目、163 变体与实时案例的口径 | 首屏、实时舞台、完整索引 | 本地 `lib-dist/package-components` 计数为 103；首屏标注 19 / 103 / 43 / 163 的不同含义，Live Lab 新增覆盖说明，索引文案同步为 19 项 | 0–3 | pass | 不把代表性运行验证解释成全量性能背书 |
| 六类缺口补全 | 新增 Warp Field、Landscape、Text Animation、Rectangle Buttons、Uplink Loader、Bookshelf | Live Lab 14–19 | 六个子路径从固定 npm 包 lazy import；浏览器逐项显示 `已就绪`，Canvas、DOM、iframe 与 3D 物体均有可辨识画面 | 4–6 | pass | Bookshelf 独立块约 794 kB gzip，Landscape 本地页约 2.43 MB |
| 集合变体实作 | 集合类能力不是固定截图，具名 variant 可现场切换 | Warp、Landscape、Text、Rectangle | 4 个 selector 改变真实 prop；浏览器逐项通过 Warp 4/4、Landscape 7/7、Text 4/4、Rectangle 22/22，共 37/37 稳定表面且 overflow 0 | 4–6 | pass | 可见性验证不等于每个变体已完成帧时间和业务 API 验收 |
| 补全后单实例与降级 | 新增能力不把多个高成本 renderer 同时常驻 | 切换、WebGL fallback、reduced-motion | Live Stage 始终只挂载当前组件；Warp 与 Bookshelf 复用既有 WebGL fallback；reduced-motion 禁用自动导览并把可控 speed 传 0 | 6–8 | pass | iframe 内部动画仍由各上游作品自行治理 |
| 补全后跨表面 | 19 项选择与新增控制在桌面、平板、手机可完成 | 1280、1024、390px、键盘 | 三视口 page/stage overflow 均 0；手机 tab 最小约 169×66px，variant select 可见；ArrowLeft 从 Bookshelf 同步焦点到 Uplink 并完成加载 | 7–8 | pass | 未替代真实移动 GPU 帧时间矩阵 |
| 补全文档与工程 | 页面、README、能力地图、构建数据一致 | 文档、TypeScript、生产构建 | 页面与三份文档记录 19 个实时案例和六个新增能力；Vite 153 模块构建通过；主包 87.63 kB gzip，Bookshelf 成本单列 | 9 | pass | 依赖审计与根目录检查见最终验证记录 |
| 第二轮六类能力缺口 | 新增 Structure Flow、Portal Field、Gallery Heading、Diagnostics Panel、Woven Cloth、Japanese Tower | Live Lab 20–25 | 六个固定包子路径 lazy import；浏览器默认态均显示 `已就绪`，Structure 为 Canvas，其余通过 iframe；Tower 为同源本地 URL | 2–6 | pass | 无 |
| 第二轮集合变体 | 35 个新增具名 variant 可现场切换 | 六个新增案例 | 浏览器逐项通过 Structure 13/13、Portal 5/5、Gallery 4/4、Diagnostics 3/3、Woven 4/4、Tower 6/6；每项 health ready、surface 非空、stage overflow 0 | 4–6 | pass | 可见性验证不等于实机帧时间和业务 API 背书 |
| 实时案例筛选 | 25 项仍可快速发现和键盘浏览 | 全部、五类筛选、左右方向键 | 全部 25；五类数量 9 / 4 / 5 / 3 / 4；图形首项 `ArrowLeft` 循环到最后一个可见案例，焦点与选中同步；数据末项 `ArrowRight` 同样闭环 | 3–5 | pass | 无 |
| 第二轮跨表面 | 筛选器、25 项和新增 variant 控制在三种宽度可用 | 1280、1024、390px、键盘 | 三视口 page/stage overflow 均 0；390px 筛选为 3 列、按钮高 46px、案例 tab 约 169×66px、variant select 宽约 223px；键盘在可见集合循环 | 7 | pass | 未替代真实移动 GPU 验证 |
| 第二轮成本与边界 | 新增大组件和 HTML 资产成本公开，不把可运行写成默认推荐 | 构建、页面边界、文档 | 176 模块构建通过；Woven / Diagnostics / Gallery 为 14.56 / 70.70 / 121.08 kB gzip；Tower HTML 约 2.43 MB；所有入口仍 lazy 且单舞台单 renderer | 8–9 | pass | 页面加载性能仍需目标设备帧时间预算 |
| 第二轮交付闭环 | 页面、Demo README、研究 README、能力地图和契约一致 | 文档、HTTP、构建、目录检查 | 页面与三份文档统一 25/103/43/163 和 72 个逐一运行 variant；HTTP 200、Vite overlay 0、browser error log 0、独立构建与 catalog check 通过 | 9 | pass | 无 |
| 第三轮成品角色补全 | 新增内容开场、作品浏览、全球数据、视觉聚焦、生成动作、转化页尾与产品陈列 | Live Lab 26–32 | 七个固定包子路径均为 lazy import；浏览器默认态 7/7 已就绪且有真实 DOM、Canvas 或 iframe 表面；Complete Shelf 为同源本地 URL | 2–6 | pass | 无 |
| 第三轮集合变体 | Character、Globe、Laser 的 8 个具名 variant 可现场切换 | Character 2、Globe 1、Laser 5 | Character 2/2、Globe 1/1、Laser 5/5 均已就绪，标题/Canvas 表面可辨且舞台 overflow 0；累计 80 | 4–6 | pass | 无 |
| 第三轮筛选与键盘 | 32 项仍可快速发现，分类计数和方向键范围准确 | 全部、五类、左右方向键 | 实测 32 / 10 / 5 / 7 / 4 / 6；控件类从首项 Circle `ArrowLeft` 循环到末项 Generate，焦点与选择同步 | 3–7 | pass | 无 |
| 第三轮跨表面 | 新增舞台、控件和 32 项导航在桌面、平板与手机可用 | 1280、1024、390px | 三视口页面/舞台 overflow 均 0；1024 Character wave 就绪；390 Newsletter 与 Complete Shelf 就绪，tab 约 169×66px、筛选 3 列 46px 高 | 7 | pass | 未替代真实移动 GPU 帧时间矩阵 |
| 第三轮成本与边界 | 新增整页资产和运行块成本公开 | 构建、页面边界、文档 | 192 模块构建通过；Character 391.02、Generate shared 121.09、Section 16.45、Laser 4.53、Globe 3.26 kB gzip；Complete Shelf HTML 900,296 bytes | 8–9 | pass | 高成本组件仍需目标设备帧时间与网络预算 |
| 第三轮交付闭环 | 页面、README、能力地图、契约与真实运行一致 | 文档、HTTP、构建、目录检查 | 页面与三份文档统一 32/103/43/163 和 80 个逐项运行 variant；HTTP 200、browser error 0、独立构建、diff check 与 catalog check 通过 | 9 | pass | 无 |
| 第四轮六类父能力缺口 | 新增预测、网络、线框、金属 CTA、凭证与沉浸世界 | Live Lab 33–38 | 六个固定 npm 子路径 lazy import；浏览器默认态 6/6 有稳定 DOM、Canvas 或 iframe 表面，当前状态为已就绪 | 2–6 | pass | 无；Sylva 弱画面已按视觉证据替换为 Temple Night |
| 第四轮集合变体 | 三组视觉集合与一组行动集合必须真实切换 | Predictive 8、Constellation 8、Wireframe 3、Liquid Metal 3 | 22/22 逐项切换均有非空表面、状态已就绪且舞台 overflow 0；Liquid Metal pill 延长至 2.6 秒确认内部 ready | 4–6 | pass | 无 |
| 父条目覆盖地图 | 43 项索引直接解释实时覆盖程度 | 完整索引默认、筛选、搜索、回跳 | 展开后 43 项为 26 LIVE / 7 PARTIAL / 10 INDEX；Predictive 回跳后 hash、筛选、选中与舞台同步 | 2–5 | pass | 无 |
| 第四轮筛选与键盘 | 38 项仍可发现且只在当前类别内循环 | 全部与五类筛选、左右键 | 实测 38 / 11 / 6 / 8 / 6 / 7；数据首项 Gauge `ArrowLeft` 循环到 Constellation，焦点和选中同步 | 3–7 | pass | 无 |
| 第四轮跨表面 | 新增案例与覆盖地图在桌面、平板和手机可用 | 1280、1024、390px | DevTools 精确度量三视口 page/stage overflow 均 0；390px Atlas 337px、Catalog 339px，标题、覆盖地图和 264px 内滚动导航无裁切 | 7 | pass | 未替代真实移动 GPU 帧时间矩阵 |
| 第四轮成本与边界 | 新增运行块成本、孤立 iframe 和直接 Three.js 风险公开 | 构建、当前边界、README | 211 模块构建通过；Predictive / Liquid / Engraved / Wireframe / Temple 为 2.48 / 16.52 / 36.73 / 70.74 / 132.57 kB gzip；四种统计口径分离 | 8–9 | pass | 高成本案例仍需目标设备预算 |
| 第四轮交付闭环 | 页面、README、能力地图、契约与实际运行一致 | 文档、HTTP、构建、diff、browser logs | 未完成项清零；HTTP 200、应用 console error 0、独立构建、根目录 catalog check 与 diff check 通过 | 9 | pass | 无 |
| 第五轮七组变体补齐 | 7 个 PARTIAL 集合的 47 个登记变体都能现场选择 | CRT、Elements、Circle、Dock、Brand、Gauges、Toggle | Elements 5/5、CRT 4/4、Circle 3/3、Dock 4/4、Brand 23/23、Gauges 4/4、Toggle 4/4 均 ready、表面非空且舞台溢出 0；37 个此前缺失选择路径补齐 | 4–6 | pass | 无 |
| 第五轮事件与单实例 | 扩大变体时不牺牲业务事件与 renderer 预算 | Circle、Toggle、Brand | Mail click 显示宿主回执；Shader Toggle onChange 后状态变为 off 并显示回执；Brand 23 项每次均只有 1 iframe | 5–8 | pass | 无 |
| 第五轮覆盖地图 | 已有实时证据的 33 个父条目全部成为 LIVE | 完整索引、回跳 | 展开 43 项后为 33 LIVE / 0 PARTIAL / 10 INDEX；Brand 回跳后 hash=`#live`、全部筛选、`tab-brand` 与舞台 ready 同步 | 2–5 | pass | 无 |
| 第五轮跨表面 | 新增长 selector 与单品牌舞台在三种宽度可用 | 1280、1024、390px、键盘、reduced-motion | 1280/1024/精确 390 的页面与舞台溢出均为 0；390px selector 238px、导航内部滚动 264/1254px；控件筛选首项 ArrowLeft 到 Liquid Metal 后焦点与选择同步；reduced-motion 下 Brand 1 iframe ready 且导览禁用 | 7–8 | pass | 无；未替代真实移动 GPU 帧时间矩阵 |
| 第五轮交付闭环 | 页面、README、能力地图、契约与实际运行一致 | 文档、HTTP、构建、diff、browser logs | 页面与三份文档统一 38 / 142、33 LIVE / 0 PARTIAL / 10 INDEX；222 模块独立构建、根目录 catalog check、diff check、HTTP 与浏览器日志通过 | 9 | pass | 无 |
| 第六轮十项 INDEX 接入 | 最后 10 个父能力各有可辨识真实运行案例 | Live Lab 39–48 | 十个固定包子路径 lazy import；逐项检查后均有可见 Canvas、WebGL 或同源 iframe 表面，健康状态 ready，单活动视觉实例，舞台溢出 0 | 2–6 | pass | 无 |
| 第六轮集合变体 | Globe Study 与 Shader Buttons 的 12 个登记变体均可现场选择 | Globe 6、Shader Buttons 6 | Text Path 6/6 以 5.6 秒首帧门槛逐项 ready；Shader 6/6 逐项 ready；标签、select、单 iframe 和舞台边界同步 | 4–6 | pass | 无；帧时间与业务语义仍待生产分级 |
| 第六轮同源资产与单实例 | 整页和 Sketchbook 不依赖第三方网络，重型 renderer 不并发 | Landing Pages、Sketchbook、全舞台 | 页面、Spark、Bestsellers、Sylva、Three runtime、Sketchbook、Koi 八条代表 URL 均 200；新增十项逐项仅 1 个 canvas 或 iframe | 6–8 | pass | Koi 约 16.8 MB、Gallery 约 1.13 MB gzip，必须受预算门禁 |
| 第六轮覆盖地图 | 43 个父能力全部具有实时证据 | 完整索引、搜索、分类、回跳 | 展开后 43 卡片、43 LIVE / 0 PARTIAL / 0 INDEX；Spark 原 INDEX 卡回跳后 hash=`#live`、`tab-spark-badge` 与 ready 同步 | 2–5 | pass | 无 |
| 第六轮跨表面 | 48 项选择、长 selector 与新增场景在桌面、平板、手机可用 | 1280、1024、390px、键盘、reduced-motion | 三个精确视口 page/stage overflow 均 0；筛选为 48/13/7/8/6/14；数据 6 项 ArrowLeft 首尾循环且焦点同步；reduced-motion 内容保留、导览禁用 | 7–8 | pass | 未替代真实移动 GPU 帧时间矩阵 |
| 第六轮交付闭环 | 页面、README、能力地图、契约与实际运行一致 | 文档、HTTP、构建、diff、browser logs | 页面与文档统一 48 / 162、43 LIVE / 0 PARTIAL / 0 INDEX；244 模块生产构建、根目录 catalog check、diff check、HTTP 200 与干净浏览器 error/warning 0 通过 | 9 | pass | 无 |
| 第七轮实时检索 | 48 项 Live Lab 可按页面角色、运行时和说明直接定位 | 搜索、类别组合、空结果、清空恢复、键盘 | `证书` 为 1 / 48 并自动选中 Engraved；`button` 为 5 / 48，首项 `ArrowLeft` 循环到 Shader Buttons 且焦点同步；无命中为 0 / 48、导览禁用、Escape 恢复 48 / 48；Sylva + 场景为 1 / 14 | 3–7 | pass | 无 |
| 第七轮 Sylva 适配成本 | authored source 保持原画面的同时移除无贡献的重型包装层 | Sylva 默认、切换、构建 chunk、单实例 | 桌面目视仍显示苔藓拱门、花粉与蝴蝶；390px 等待 5.6 秒后 ready、单 iframe、无舞台溢出。构建从 244 降到 240 模块，原 815.61 / 215.53 kB wrapper chunk 消失 | 6–9 | pass | authored source 的 1.45 MB 静态成本与真实移动 GPU 仍需产品预算 |
| 第七轮跨表面与交付 | 新搜索和 Sylva 适配在三种宽度、键盘、reduced-motion 下无回归 | 1280、1024、390px、键盘、浏览器日志、文档 | 1280/1024/390px 页面、舞台与 finder overflow 全为 0；390px 搜索高 46px；reduced-motion 下 Sylva ready、单 iframe、导览禁用；浏览器 error/warning 0、HTTP 200、build/check/diff 通过 | 7–9 | pass | 无 |
| 第八轮自动选型闭环 | 输入 brief、设备和预算后生成可解释组合，并能预览与回跳真实案例 | 默认、dirty、生成、候选选择、Live 回跳 | 四类 brief、两种设备、三档预算均可生成；自然品牌轻量档排除 3 个重型候选；机器 JSON 含规则、约束、三层组合与淘汰项；Newsletter 从推荐区准确打开 Live Lab | 3–6 | pass | 下一阶段用真实 Kage Planner 替换固定评分，并保留同一协议 |
| 第八轮渲染与降级 | 当前候选使用真实能力且不造成多 renderer 常驻 | 可见、离屏、reduced-motion、无 WebGL | 当前预览仅 1 个 Canvas 或 iframe；reduced-motion 仍有 1 个预览实例和完整 DOM；WebGL 拒绝时为 0 个视觉实例，但 fallback、三项推荐与操作均保留 | 6–8 | pass | 继续补真实设备帧时间与静态海报资产 |
| 第八轮跨表面与交付 | 选型主旅程在桌面、平板、手机和键盘下完整 | 1280、1024、390px、键盘、浏览器日志、构建、文档 | 三视口页面和 selector 横向溢出为 0；1280/1024 导航无碰撞；390px 最小控件高 44px；候选 ArrowLeft 首尾循环且焦点同步；240 模块构建通过 | 7–9 | pass | 无 |
| 第九轮组合成品闭环 | 三层推荐真正形成 Hero / System / Action 完整网页，并可返回单项检查 | 组合默认、三段导航、检查模式、重新生成 | 默认显示三段可滚动网页；导航依次激活 Scene anchor / System / Action；点击候选或“单项检查”进入独立预览，键盘 Enter 可返回组合；重新生成自然品牌方案后页面、revision 与 Sylva / Woven / Newsletter 同步 | 2–6 | pass | 下一阶段以真实 Planner 输出替换固定内容模板 |
| 第九轮单实例与降级 | 组合页面三个槽位不得让高成本 renderer 并发 | Hero、System、Action、离屏、reduced-motion、无 WebGL | 三段逐项均为 1 个活动组件根 + 2 个静态待机层，Canvas/iframe 不超过 1；reduced-motion 仍为 1 个活动根且内容完整；WebGL 拒绝时为 0 个 Canvas/iframe，但 fallback、三段 DOM、3 个导航与 CTA 均保留 | 6–8 | pass | 继续补真实设备帧时间、内存与静态海报资产 |
| 第九轮跨表面与交付 | 完整网页主旅程在桌面、平板、手机和键盘下可用 | 1280、1024、390px、键盘、构建、文档 | 三视口页面、selector、生成页和内部滚动区横向溢出均为 0；390px 三段导航高 44px、模式按钮高 58px；模式支持 Enter、左右键、Home / End；240 模块构建与文档一致性通过 | 7–9 | pass | 无 |
| 第十轮全屏成品体验 | 嵌套三段页面可进入独立全屏，并能恢复到原工作台 | 打开、三段浏览、Escape/按钮关闭、焦点返回 | 全屏矩形在 1280/1024/390px 均为 `0,0,viewport width,height`；背景 overflow 锁定；按钮与 Escape 可退出，焦点返回触发按钮；Tab 被限制在前景层；Live/检查先关闭前景层再导航 | 2–6 | pass | 无 |
| 第十轮集成透视 | 成品页内直接解释当前视觉能力的实际接入边界 | 成品视图、透视视图、Hero/System/Action | 两种视图可逆；透视 strip 随活动段同步 role、id、runtime、cost、fallback 与 reason；3 个 HOST DOM 和 3 个 renderer 边界有可见标注；Hero 新增 43 / 01 / READY 工程证据 | 3–6 | pass | 成本为固定基线，不冒充实时遥测 |
| 第十轮跨表面与预算 | 深化演示不能破坏移动端、降级与单实例约束 | 1280、1024、550、390px、键盘、reduced-motion、无 WebGL、构建、文档 | 1280×900、1024×820、550×898、390×844 无页面或全屏横向溢出；全屏均为 1 个 Canvas/iframe 与 2 个待机层；390px reduced-motion + 禁用 WebGL 时为 0 个视觉实例、fallback 可见、三段导航与 DOM 标题保留；240 模块构建通过 | 7–9 | pass | 未替代真实移动 GPU 帧时间与辅助技术人工验收 |
| 第十一轮自然语言输入 | 一个真实 Brief 能产生与 preset、设备、预算绑定的新 revision | 默认、长中文 Brief、dirty、重新生成 | textarea 与示例恢复可用；输入变化显示未应用；`Aurora Field` + Research + Desktop + Balanced 编译为 `R02.0`，正确提取品牌、`研究团队与品牌负责人` 和订阅目标 | 3–6 | pass | 当前为关键词提取 + preset + 固定模板，不冒充通用 AI 理解 |
| 第十一轮 PageSpec 与编辑 | 同一协议驱动摘要、成品 DOM、slot 和 JSON；内容可编辑且不重选 renderer | 摘要、编辑、保存、取消、全屏三段 | `kage.pagespec/0.1` 同时驱动 brand/audience/goal/content/slots；Hero 标题与 CTA 实时进入 Hero 和 Action；保存进入 `R02.1`，焦点回到编辑入口，slot id 前后不变 | 3–6 | pass | 本轮开放关键宿主文案，不是全量页面编辑器 |
| 第十一轮导出反馈 | 用户可以复制当前 PageSpec JSON，并知道是否成功 | Clipboard 成功与失败恢复 | 普通应用浏览器显示 `PageSpec JSON 已复制`；受限无头 Chrome 显示浏览器拒绝并引导展开机器结果手动复制；两条路径均使用 aria-live | 4–6 | pass | 系统剪贴板授权策略仍由部署环境决定 |
| 第十一轮跨表面与交付 | 新主旅程不破坏响应式、键盘、单实例和降级 | 1280、1024、390px、键盘、reduced-motion、无 WebGL、浏览器日志、构建、文档 | 1280×900、1024×820、390×844 的 Planner input、PageSpec、selector 和生成页横向溢出均为 0；全屏为 1 active + 2 standby，body 锁定；reduced-motion + WebGL 禁用时 fallback 1、语义内容保留；240 模块构建通过 | 7–9 | pass | 未替代真实移动 GPU 帧时间、系统剪贴板与辅助技术人工验收 |
| 第十二轮研究理解收束 | 一屏解释本质、真实能力、不能替代什么、采用方式与项目意义 | 研究 README、能力地图、Web 首屏 | README 新增最终理解表与完整调用链；能力地图区分上游四层和本 Demo 的 PageSpec 产品化链；Web 首屏明确“Registry 而非生成器”，三处口径一致 | 0–3 | pass | 无 |
| 第十二轮 Web 发布完善 | 主旅程可从首屏直接进入，公开页面具备准确元数据和目录信息 | Hero、SEO、目录卡、封面 | 两个首屏 CTA、48 / 162 / 43/43 / PageSpec 0.1 状态、skip link、canonical / OG / Twitter、更新后的目录摘要与 1440×900 WebP 封面均已实装 | 2–6 | pass | 无 |
| 第十二轮 Pages 子路径 | 根站构建后的真实发布路径可完整加载 | `/demos/003-mengto-threeui/`、静态资源、锚点 | 根站构建完成 8 项/8 封面/8 Demo；Demo、JS、CSS、封面及代表性同源 HTML/图片全部 HTTP 200；构建产物桌面与精确 390×844 均 overflow 0、overlay false、浏览器 error 0，Brief 生成 `Release Atlas / R02.0` | 6–9 | pass | 无 |
| 第十二轮 Git 与远端部署 | 只提交本项目相关改动，远端 workflow 完成且公开 URL 可访问 | git diff、commit、push、Actions、public URL | 仅定向提交 003、目录与根 README；`e100b04` 已推送至 `origin/main`；Pages run `33855715630` success；公开页面、目录、封面与 6 个代表性同源资源 HTTP 200；公网 `Release Atlas` Brief 编译为 `R02.0`，1280×720 页面/selector overflow 0、48 个 Live tab、1 个活动视觉实例、overlay false、console error 0 | 9 | pass | 上游 Performance Gauges iframe 仍报告 Tailwind CDN 生产提示，已作为第三方依赖治理边界公开记录 |

## 验证环境

- Windows，Chromium `151.0.7922.34`，Vite `7.3.6`。
- 视口：`1280×900`、`1024×820`、`390×844`；上一轮另覆盖 `550×898`。
- 能力路径：WebGL 正常、WebGL 人工拒绝、`prefers-reduced-motion: reduce`。
- 浏览器结果：HTTP 200，无错误 overlay；实时舞台保持 48 项、162 个可运行配置与 43 LIVE / 0 PARTIAL / 0 INDEX。自然语言 Brief → PageSpec → 可编辑成品 → JSON 主旅程通过：`Aurora Field` 正确形成受众、目标、三层 slot 与 `R02.0 → R02.1` 内容修订；编辑前后 slot 不变，普通浏览器复制成功，受限剪贴板有恢复路径。1280/1024/390px 的 Planner input、PageSpec、selector 与生成页均无横向溢出；全屏保持 1 active + 2 standby、Escape 恢复焦点并锁定背景。reduced-motion + WebGL 拒绝时可读 fallback、宿主 DOM、3 个导航和 CTA 保留。
- 发布预览：根目录 `build:site` 完成 8 个项目、8 张封面和 8 个 Demo；`/demos/003-mengto-threeui/` 的主 HTML、JS、CSS、封面与 8 条代表性同源资产请求均为 HTTP 200。构建产物在应用浏览器和独立 Chrome 152 DevTools 中通过；精确 390×844 下页面与 selector overflow 均为 0，首屏主按钮为 354×44px，应用异常、错误日志与非取消网络失败均为 0。`Release Atlas` Brief 在部署结构中编译为 `R02.0`。
- 远端交付：提交 `e100b04` 已推送到 `origin/main`；GitHub Pages workflow run `33855715630` 完成且结论为 `success`。公开页面、目录 JSON、封面和代表性同源 HTML/图片均返回 HTTP 200；公网 1280×720 实测无页面或 selector 横向溢出、无 Vite overlay、console error 为 0，保持 48 个 Live tab 与 1 个活动视觉实例。已知的 Tailwind CDN warning 来自上游 Performance Gauges iframe，不影响主流程，并保留为生产依赖治理项。
- 依赖结果：上一轮 `npm audit --audit-level=low` 为 0；第十二轮 240 模块 `npm run build` 通过，主应用 356.77 / 113.60 kB、CSS 180.29 / 45.57 kB（raw / gzip）；原 Sylva wrapper chunk 继续保持移除。

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
| 用户要求继续补全库能力 | 以 103 个公开入口为新基线，新增六种此前未进入实时舞台的能力形态，并把四个集合入口改成可切换真实 variant | 页面从 13 增至 19 个 LIVE；37 个集合变体逐一进入稳定表面；19 / 103 / 43 / 163 四个口径不再混用 |
| 新增能力带来新的交付成本 | Landscape 需要包内 HTML，Bookshelf 自带独立 Three.js 版本与大块代码 | Landscape 改为本地 URL；构建公开 2.43 MB HTML 与 Bookshelf 793.73 kB gzip 边界，不把“能运行”误写成“适合默认首屏” |
| 继续加案例会让 19 项 tab 在窄屏形成过长列表 | 新增六类真实能力时同步加入全部与五类筛选，并把 roving focus 改为只遍历可见集合 | 25 项仍可在 390px 以 46px 高筛选控制缩短为 3–9 个 tab；两组首尾键盘循环通过 |
| 目录仍缺系统结构、编辑标题、诊断 UI、材质与地域场景的现场证据 | 接入六个真实集合和 35 个 variant；Tower HTML 改为同源本地资产 | 35/35 均进入稳定非空表面，累计 72 个 variant；build 与页面同时公开新增成本和文化真实性边界 |
| 25 项仍偏重背景和沉浸场景，缺少成品页常用的结构角色 | 接入 Intro、Character、Globe、Laser、Generate、Newsletter 与 Complete Shelf，并按真实 API 标注业务边界 | 32 项覆盖从内容开场到页尾；8/8 新 variant、表单 success、同源整页和三视口均通过 |
| Character 与 Generate 首次构建暴露明显大块 | 保持独立 lazy、单舞台单实例，并公开 391.02 / 121.09 kB gzip 成本 | 用户可以基于页面角色和预算选择，而不会把可运行误解为默认推荐 |
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
| 32 个案例仍无法说明 43 个父能力的真实覆盖 | 逐项建立父条目到实时案例映射，区分全部变体、代表样本和仅元数据 | 索引显示 26 LIVE / 7 PARTIAL / 10 INDEX；33 个有证据父条目可回跳对应案例，案例数不再冒充父能力数 |
| 继续加 tab 让下半部案例远离主舞台 | 全部 38 项列表从无限增高改为 286 / 264px 内部滚动；加载探针识别首次离屏等待 | 列表查找路径受控，离屏选择不再进入假失败；回到舞台后 renderer 正常就绪 |
| Sylva Living World 虽返回 ready，但当前舞台截图主要是弱雾层 | 按可辨识成品画面标准淘汰该候选，改用直接 Canvas 的 Temple Night | 月夜、寺院、山体和灯光均清晰可辨，Temple Night 达到已就绪且舞台无溢出 |
| 390px 的普通 headless 截图实际使用 500px 最小布局视口 | 改用 DevTools `Emulation.setDeviceMetricsOverride` 生成真实 390px 证据，并收紧移动端 grid min-width | 精确 390px 下 `scrollWidth === clientWidth`，首屏标题、链路文案、Atlas 与覆盖地图无裁切 |
| 33 个父条目已有实时证据，但 7 个仍只接代表 variant | 在原有案例内补全七组 selector，不增加 tab；逐项运行 47 个登记变体 | 47/47 ready 且舞台溢出 0；新增 37 条选择路径，累计 142 个配置；覆盖地图变为 33 LIVE / 0 PARTIAL / 10 INDEX |
| Dock Sable/Modern 与 Toggle Modern 首轮视觉正常，但健康探针停在“仍在初始化” | 就绪检测增加尺寸有效的 `button` / `role=switch` 语义表面 | 四种 Dock 与四种 Toggle 全部正确显示“已就绪”，Canvas/DOM/iframe 分派保持不变 |
| Brand 原舞台用三个并发 iframe 证明代表性，无法浏览其余 20 个品牌 | 改成单一放大实例 + 23 项 selector，并复用 reduced-motion paused 属性 | 23/23 ready、每次仅 1 iframe；Codex 画面清晰，390px selector 为 238px 且无溢出 |
| Toggle 上游在内部 state updater 中同步调用 `onChange`，直接更新 App 会触发 React 跨组件更新警告 | 宿主回执延迟到当前事件提交后的下一任务，不修改上游包 | 全新浏览器标签中 Shader Toggle `on → off`、回执可见，应用 error log 为 0 |
| Spark Badge 的组件外壳返回 ready，但实际画面全黑 | 直接打开同包 HTML 并检查控制台，定位到 `params is not defined`；本地同源副本补齐 `URLSearchParams` 初始化 | 雨幕、发光 CODEX 徽章恢复；宿主案例 ready、单 iframe、无错误，明确证明 onLoad 不能替代像素检查 |
| Sylva Living World 的公开抽取适配器 ready 后只有雾层 | 保留上游组件入口作为挂载边界，改载同包 authored HTML 的 `scene-only` 模式；隐藏页面 UI，并以 1600×880 参考 iframe 做 cover 缩放 | 舞台稳定显示苔藓拱门、花粉与蝴蝶；仍标记为宿主恢复路径，不把上游适配缺陷隐去 |
| Text Path 的 Morphing、Cloth 与 Ball 初始 1–3 秒可能保持黑底 | 逐项延长像素观察，并把整组健康状态的最小视觉预热设为 5.2 秒 | 6/6 在 5.6 秒检查点均有单 iframe、ready 和无溢出，避免“状态先于首帧” |
| Sketchbook Landing 与 Interactive Sketchbook 各复制了一份内容完全相同的 8,607,345 字节素材 | 对 17 个文件逐一计算 SHA-256，确认名称、大小和哈希全部一致；Landing HTML 改为引用共享 `/sketchbook/` 路径并移除重复目录 | 两个案例重新截图均正常，发布静态资产减少约 8.61 MB |
| 48 项 Live Lab 的内部列表高 1584px、可视区仅 264px，只能分类后滚动查找 | 在舞台与分类间增加跨标题、角色、运行时、说明、边界和 variant 的现场搜索，并提供命中数、空结果与 Escape 恢复 | `证书` 精确定位 1 项，`button` 命中 5 项且保持 roving focus；搜索可与类别叠加，三视口无溢出 |
| Sylva 先下载 215.53 kB gzip 的公开 wrapper，再由宿主覆盖成 authored source，且 wrapper 本身只生成雾层 | 将参考框适配器改为直接创建同源 sandbox iframe，同时补回可见性、文档隐藏、load 状态和参考尺寸职责 | 真实 Sylva 画面与单实例保持；构建减少 4 个模块并完全移除 815.61 kB raw / 215.53 kB gzip wrapper |
| 用户要求“尝试一下，演示最终效果”，但页面仍只有人工搜索和概念路线图 | 新增可操作 Registry Selector，把 brief、设备、预算映射为三层组合，并连接真实 `DemoStage`、解释证据、预算淘汰和 Live Lab | 约束会产生可观察的不同结果；轻量档排除重型候选；键盘、JSON、回跳、多视口、reduced-motion、无 WebGL 和构建全部通过 |
| 首版评分上限过早截断，导致自然品牌沉浸档多个候选同为 99，Sylva 没有赢得主视觉层 | 调整分值组成，使意图优先级在截断前仍有区分，并为 Sketchbook 增加桌面端明确优势 | 自然品牌沉浸档稳定返回 Sylva；创意工作室移动/桌面分别选择 Gallery Heading / Sketchbook，证明设备输入真实生效 |
| 390px 复核发现设备切换按钮实际高度为 42px | 将 segmented 控件最小高度提升到 44px，并重新读取全部 selector button 尺寸 | 手机端最小按钮高 44px，页面与工作区横向溢出仍为 0 |
| 用户确认继续后，三项推荐仍只能一次看一个组件，无法判断组合后的网页是否成立 | 增加组合成品 / 单项检查双模式，把同一 plan 映射为 Hero、System、Action 三段宿主页面，并让导航和滚动同步活动段 | 自然品牌方案真实形成 Sylva → Woven → Newsletter；三段内容、评分、所用组件和检查入口同时可理解，模式可逆 |
| 首版 Action renderer 全幅铺在宿主 CTA 背后，Rectangle Button 与正文操作发生视觉竞争 | 将行动段改为正文与受控视觉卡片分栏，手机转为上下堆叠；显式重置局部 footer 的全局尺寸继承 | 390px 实测正文与视觉卡片几何不重叠，Newsletter / Rectangle 等行动组件均保留独立检查面且页面无横向溢出 |
| 三段同时挂载会把“组合成品”变成三个昂贵运行时并发 | 以 `data-active-layer` 驱动真实 `DemoStage`，非活动段只保留静态待机视觉；IntersectionObserver 与页面导航共用状态 | Hero / System / Action 逐段均为 1 个活动组件根 + 2 个待机层，Canvas/iframe 不超过 1；reduced-motion 与无 WebGL 独立 CDP 路径通过 |
