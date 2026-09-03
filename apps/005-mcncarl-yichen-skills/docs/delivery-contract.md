# Yichen Skills Capability Atlas · Delivery Contract

## Design contract

| Field | Decision |
| --- | --- |
| Entry mode | Brief-led greenfield Demo inside the existing research repository |
| Request revision | 2 — 增加 Skill 使用场景、端到端驱动流程与模拟效果展示 |
| Target user and context | 本研究库的维护者、读者，以及准备建设团队 Skill 体系的产品/技术人员 |
| Desired first impression | 一眼看出“这不是 Agent，而是一套围绕个人工作流组织的多 Skill 系统”；继续向下可亲自走完一条 Skill 驱动链并看到交付物如何逐步形成 |
| Visual ambition | Editorial |
| Experience architecture | Editorial Flow |
| Visual constraints | 用结构图、编号、线性轨道和高对比排版表达系统性；避免通用 KPI dashboard、卡片堆砌、夸张渐变和装饰性 3D |
| Information constraints | 必须覆盖固定提交中的 22 个 `SKILL.md`；每项给出典型使用场景；端到端案例要显示 Agent 决策、Skill、handoff、边界和最终效果；区分事实、研究判断、已实现能力和外部依赖 |
| Operation constraints | 纯静态前端；流程为基于研究的可视模拟，不联网获取实时数据、不登录、不调用上游 Skill、不生成虚假的真实执行结果 |
| State constraints | 原有总览/筛选/详情/主题/移动导航；新增三类场景、七步主流程、步骤选择、播放/重置、运行中与完成状态、示例产物面板 |
| Environment constraints | 输出静态 `dist/`；兼容仓库 Pages 子路径；Node.js 22+ 构建；无第三方运行时依赖 |
| Primary journey | 阅读定位 → 选择“内容创作闭环” → 逐步播放 Agent 调用七段 Skill 链 → 查看每步输入/输出/安全闸门 → 查看最终交付物 → 回到 22 项能力详情与团队采用路线 |
| User-defined phases | 1. 展示各 Skill 使用场景；2. 展示完整 Skill 驱动流程；3. 展示可理解的示例效果与意义 |
| Required artifacts | 更新后的可运行页面、结构化场景/流程数据、流程交互、构建/检查脚本、浏览器验收记录、桌面/平板/手机最终截图 |
| Autonomy authorization | 用户明确要求“用网页的方式”整理现有研究，授权在 `apps/005-mcncarl-yichen-skills` 内直接实现并接入现有目录 |
| User-decision boundary | 新增后端、真实账号/API、复制上游素材、商业使用、发布或部署以外的不可逆动作 |
| Observable completion criteria | 22 个模块均能看到典型场景；默认七步案例可手动选步并完整播放；每步展示驱动 Skill、交接产物、安全闸门和效果；三类流程可切换且明确为模拟；完成状态列出最终成果；1440/768/390px、双主题、键盘和 reduced-motion 通过；应用 check/build 通过 |

## Design direction

| Layer | Choice | Testable consequence |
| --- | --- | --- |
| Composition | 长页面叙事，首屏结论与能力轨道并列，随后进入可筛选 Atlas | 首屏无需滚动即可回答“是什么/不是什么”；主要交互在第二屏前出现 |
| Focal hierarchy | 主标题强调“22 个 Skill，不是 1 个 Agent”；关键许可风险为独立警示 | 标题优先于指标，许可证信息不被埋进页脚 |
| Typography | 系统无衬线正文 + 紧凑等宽元数据；大号标题但不超过移动端可读范围 | 中文段落行长受控，技术字段易扫描 |
| Palette | 深色墨蓝为默认，琥珀表示执行/风险，青色表示研究/证据；提供完整浅色主题 | 两主题均保持分类和状态语义，不仅反转背景 |
| Material | 细边框、网格线、编号和左侧轨道；少量 6–10px 圆角 | 视觉像研究图谱而不是消费级卡片墙 |
| Depth | 仅详情 dialog 和移动导航使用前景层 | 页面层级稳定，不依赖阴影堆叠 |
| Density | 总览压缩，Skill 详情按需展开；桌面网格、移动单列 | 22 个模块全部可发现，同时首屏不过载 |
| Motion | 筛选、dialog 和轻量进入动画；reduced-motion 关闭非必要过渡 | 动画只解释状态变化，不承担内容展示 |

## Coverage manifest

| User phase | Requirement / artifact | Surface / state | Evidence needed | Stage | Status | Next action |
| --- | --- | --- | --- | --- | --- | --- |
| 1 全量整理 | 22 个 Skill 定义全部出现 | Atlas / populated | DOM count + data invariant | 3 | pass | `check.mjs` 验证 22 个唯一 name |
| 1 全量整理 | 分类、形态、依赖、边界和价值可读 | Detail dialog | 浏览器打开代表模块 | 5 | pass | X Article 详情实测并截图 |
| 1 全量整理 | 能力链和底层架构准确 | Overview / architecture | DOM + visual observation | 3 | pass | 页面与研究主报告交叉核对 |
| 2 网页呈现 | 明暗主题 | Desktop / both themes | screenshots + computed state | 7 | pass | 主题状态与浅色截图已验证 |
| 2 网页呈现 | 搜索和筛选 | populated + empty + reset | browser interaction | 5 | pass | 微信 6 项、V 层 2 项、空状态与重置通过 |
| 2 网页呈现 | 移动导航 | 390px / open + close | screenshot + interaction | 5,7 | pass | dialog 打开、Escape 关闭通过 |
| 2 网页呈现 | 响应式布局 | 1440 / 768 / 390 | screenshots + overflow check | 7 | pass | 三档截图与 scrollWidth 检查通过 |
| 2 网页呈现 | 键盘与焦点 | keyboard journey | browser interaction + focus-visible | 7 | pass | 架构 tab 方向键与原生 dialog Escape 通过 |
| 2 网页呈现 | reduced-motion | emulated preference | computed style / browser evidence | 7 | pass | media query 命中且内容 opacity=1 |
| 2 网页呈现 | 可运行和可构建 | local runtime / dist | check + build output | 1,9 | pass | `npm run check`、`npm run build` 通过 |
| 2 网页呈现 | 最终证据 | desktop/tablet/mobile | retained screenshots | 9 | pass | 7 张最终截图已保留 |
| 3 对我们的意义 | 5 条可迁移原则和 3 阶段采用路线 | significance section | DOM + screenshot | 3 | pass | 完整进入页面与可访问性树 |
| 3 对我们的意义 | 许可证和采用边界明确 | risk section | DOM + link check | 3 | pass | 独立许可警示与固定来源完成 |
| 3 对我们的意义 | 与研究主报告互相链接 | page + app README | link and file checks | 9 | pass | catalog、研究 README、应用 README 已互联 |
| 1 使用场景 | 22 个 Skill 各有典型场景 | Atlas card + detail dialog | data invariant + DOM + dialog | 3,5 | pass | 22 项映射、卡片和详情均已验证 |
| 2 完整流程 | 三类组合场景可切换 | scenario selector | browser interaction + selected state | 4,5 | pass | 鼠标与方向键切换三类场景通过 |
| 2 完整流程 | 默认内容创作闭环展示七步驱动链 | workflow simulator | DOM count + manual step interaction | 3,5 | pass | 7 步 DOM 与第 6 步点选验证通过 |
| 2 完整流程 | 播放与重置形成运行中/完成闭环 | workflow simulator | browser state transitions | 5,6 | pass | 0/7 → 7/7 → 0/7，4 项成果 ready 后复位 |
| 3 效果展示 | 每步显示输入、Skill、handoff、闸门与效果 | workflow detail | DOM observation | 3,6 | pass | 第 1、6、7 步与 Skill 详情联动已核对 |
| 3 效果展示 | 完成态展示模拟交付物与业务意义 | outcome panel | screenshot + completed state | 3,6 | pass | 完成态截图与 4/4 ready DOM 证据 |
| 3 对我们的意义 | 使用场景与采用意义从抽象原则升级为流程证据 | scenario/meaning sections | DOM + screenshot | 3 | pass | 三场景意义标签、每步 effect 和总原则已呈现 |
| 2 网页呈现 | 新流程在明暗主题可读 | scenario simulator / both themes | screenshots + computed state | 7 | pass | 深色与浅色流程首屏截图通过 |
| 2 网页呈现 | 新流程响应式布局 | 1440 / 768 / 390 | screenshots + overflow check | 7 | pass | 1425/753/375 scrollWidth 均未超过 viewport |
| 2 网页呈现 | 新流程键盘与 reduced-motion | tabs/steps/run + emulation | keyboard journey + media state | 7 | pass | 场景 tab 方向键切换；reduced-motion 即时 7/7 |
| 交付 | 文档、构建与最终证据同步 | README/docs/dist/screenshots | file + check/build output | 9 | pass | README、研究说明、验证记录、dist 与截图已同步 |

## Support boundaries

- 支持现代 Chromium、Firefox 和 Safari 的基础 HTML/CSS/JS 能力；浏览器实测以当前本机 Chromium 路线为准。
- 页面只支持中文内容；英文模块名和技术名保留原文。
- 数据固定到上游提交 `14f10a96a719a1d60aa02c582e674d5b197d5861`，不声称自动跟踪主分支。
- 页面是研究解释工具，不运行任何上游 Skill，也不证明真实平台集成成功。
