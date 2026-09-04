# Yichen Skills Capability Atlas · Delivery Contract

## Design contract

| Field | Decision |
| --- | --- |
| Entry mode | Revision-led finalization of an existing research Demo |
| Request revision | 4 — 收束最终理解、补齐必要网页信息并发布到远端 GitHub Pages |
| Target user and context | 本研究库的维护者、读者，以及准备建设团队 Skill 体系的产品/技术人员 |
| Desired first impression | 一眼看出“这不是 Agent，而是一套围绕个人工作流组织的多 Skill 系统”；读者能迅速获得阶段性结论、按需使用原则、采用判断和真实试用入口 |
| Visual ambition | Editorial |
| Experience architecture | Editorial Flow |
| Visual constraints | 用结构图、编号、线性轨道和高对比排版表达系统性；避免通用 KPI dashboard、卡片堆砌、夸张渐变和装饰性 3D |
| Information constraints | 保留 22 项能力、三类流程与 22 项采用判断；新增阶段性最终理解，明确本质、执行主体、价值、非目标、按需使用方式与停止研究条件；真实台账与模拟流程严格区分 |
| Operation constraints | 纯静态前端；试用记录只写浏览器 localStorage，可导出 JSON，不联网、不登录、不调用上游 Skill；不得收集凭据、密钥或私人原文；删除单条记录必须显式操作 |
| State constraints | 原有全部状态；新增采用矩阵四类状态、试用表单验证、空台账、添加成功、持久化恢复、结果汇总、单条删除、JSON 导出、模板复制反馈 |
| Environment constraints | 输出静态 `dist/`；兼容仓库 Pages 子路径；Node.js 22+ 构建；无第三方运行时依赖 |
| Primary journey | 阅读阶段性结论 → 按真实任务查找 Skill → 选择低风险方式体验 → 在本地台账留下证据 → 多次有效后独立沉淀，否则停止 |
| User-defined phases | 1. 整理最终理解；2. 补齐必要网页信息；3. 验证并提交远端；4. 完成 GitHub Pages 部署核验 |
| Required artifacts | 最终研究说明、更新后的可运行页面、同步后的目录元数据与门户 README、浏览器验收记录、应用与全站构建结果、范围明确的 Git 提交、Pages 线上验证 |
| Autonomy authorization | 用户明确要求整理、完善 Web、提交远端 GitHub 并注意部署，授权在本项目、目录元数据和 Pages 发布链路内直接完成 |
| User-decision boundary | 不引入后端或真实账号/API，不运行上游 Skill，不复制上游受限素材，不改动其他项目文件，不执行破坏性 Git 操作 |
| Observable completion criteria | 页面明确呈现最终理解和按需使用原则；现有 22 项能力、流程、矩阵与台账无回归；1440/768/390px 和双主题通过；应用与全站 verify 通过；仅范围内文件进入提交；推送 `origin/main` 后 Pages 工作流成功且线上 Demo 可访问 |

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
| 1 采用决策 | 22 个 Skill 恰好进入一个采用分组 | adoption matrix | data invariant + DOM count | 3 | pass | check 与 DOM 均为 22；四组数量为 7 / 5 / 6 / 4 |
| 1 采用决策 | 每项说明判断理由和下一步 | adoption matrix item | DOM + detail interaction | 3,5 | pass | 22 个条目均含 reason/next；方法借鉴条目可打开对应 Skill 详情 |
| 2 真实台账 | 空状态与本地数据声明 | ledger / empty | screenshot + DOM | 3,6 | pass | 空状态、LOCAL ONLY 和敏感信息警示已实测；记录后空状态正确隐藏 |
| 2 真实台账 | 新增真实试用记录 | ledger form / valid submit | browser form interaction | 4,5 | pass | 浏览器填写 7 个字段并提交，成功反馈与记录卡同步出现 |
| 2 真实台账 | 刷新后恢复与统计汇总 | ledger / populated | reload + localStorage evidence | 5,6 | pass | 刷新后 1 条记录恢复；统计为 1 / 1 / 42 / 1，localStorage 为 1 |
| 2 真实台账 | 单条删除与 JSON 导出 | ledger / populated | browser interaction + download | 5,6 | pass | 两段式删除先显示“确认”再清零；导出链接解码为 v1 schema、local-only 和 1 条记录 |
| 3 自有 Skill | 七段 Skill 设计模板可读可复制 | template / copy success | browser interaction + clipboard feedback | 4,5,6 | pass | DOM 验证 7 个二级章节；复制操作返回明确成功状态 |
| 3 自有 Skill | 从试用到沉淀的判断门清晰 | adoption method | DOM + screenshot | 3 | pass | 重复发生、效果可衡量、边界可解释、完成可验证四道门完整呈现 |
| 网页呈现 | 新模块双主题可读 | adoption / ledger / both themes | screenshots + computed state | 7 | pass | 深色与浅色采用矩阵截图通过，主题状态与对比度可读 |
| 网页呈现 | 新模块响应式布局 | 1440 / 768 / 390 | screenshots + overflow check | 7 | pass | 三档截图通过；768 scrollWidth 753、390 scrollWidth 375，无横向溢出 |
| 网页呈现 | 新表单键盘和 reduced-motion | form / copy / delete | keyboard path + media state | 7 | pass | task 按 Tab 到 skill；reduced-motion 为 true、内容 opacity 为 1、scroll-behavior 为 auto |
| 交付 | 文档、构建与最终证据同步 | README/docs/dist/screenshots | file + check/build output | 9 | pass | README、研究说明、验证记录、dist 与 6 张 Revision 3 截图已同步 |
| 4 最终理解 | 本质、执行主体、价值和非目标形成一屏可读结论 | adoption / final verdict | DOM + desktop screenshot | 2,3 | pass | 4 项结论与“不是 Agent”主判断已在桌面深浅主题验证 |
| 4 按需使用 | 明确“遇到任务再查、低风险体验、证据后沉淀、无需试遍” | final verdict / usage path | DOM + responsive screenshots | 3,7 | pass | 3 步路径、STOP RULE 与按需路线在 1440/768/390px 验证 |
| 4 研究收束 | 研究 README、应用 README、目录摘要和日期同步 | docs/catalog/root README | file + catalog check | 9 | continue | 更新说明并重新生成门户索引 |
| 4 发布验收 | 新结论模块在深浅主题及 1440/768/390px 可读 | final verdict / cross-surface | browser screenshots + overflow | 7 | pass | 4 张最终截图保留；768/390 scrollWidth 为 753/375，均无溢出 |
| 4 工程验收 | 应用 check/build 与全站 verify 通过 | local build + Pages artifact | command output | 9 | continue | 执行应用检查和根目录 verify |
| 4 远端提交 | 仅提交 005 项目、对应研究与目录文件 | git staged diff | status + staged diff | 9 | continue | 精确暂存、提交并推送 origin/main |
| 4 Pages 部署 | GitHub Actions Pages 成功且线上 Demo 更新 | workflow + production URL | GitHub run + browser DOM | 9 | continue | 等待工作流并核验公开 URL |

## Support boundaries

- 支持现代 Chromium、Firefox 和 Safari 的基础 HTML/CSS/JS 能力；浏览器实测以当前本机 Chromium 路线为准。
- 页面只支持中文内容；英文模块名和技术名保留原文。
- 数据固定到上游提交 `14f10a96a719a1d60aa02c582e674d5b197d5861`，不声称自动跟踪主分支。
- 页面是研究解释工具，不运行任何上游 Skill，也不证明真实平台集成成功。
