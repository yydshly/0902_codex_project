# fanqiang Capability Atlas · 清晰度优化契约

## 设计契约

- Entry mode：Revision-led / repair-led
- Request revision：3
- Target user and context：不了解代理软件内部结构、希望快速判断项目价值的技术研究者与产品决策者
- Desired first impression：30 秒内明确“fanqiang 是分发仓库，不是协议内核；ChromeGo 与 FQNews2 是两种产品；真正能力来自上游内核”
- Visual ambition：Functional
- Experience architecture：Editorial Flow
- Visual constraints：保留暗色技术研究风格、荧光绿/青色语义、固定提交标识；降低超大标题占比，不引入装饰图片
- Information constraints：先结论再术语；同一屏比较三者；“控制面/数据面”必须紧邻白话解释；明确“集合不等于统一适配框架、可配置不等于可替换内核”；关键判断区分源码确认、代码推断与尚未验证；保留风险、研究顺序与源码证据
- Operation constraints：核心理解不依赖点击；FQNews2 状态切换用于解释运行阶段；所有按钮键盘可达并显示焦点；中等与窄屏必须保留章节跳转入口
- State constraints：默认展示“已连接”完整链路；保留无节点、测速、失败、离线状态，并说明恢复逻辑
- Environment constraints：静态页面、纯前端、暗色主题；不连接真实节点、不运行代理、不引入依赖
- Primary journey：首屏结论 → 三者横向对照 → FQNews2 完整请求链 → 能力归属/边界 → 研究优先级 → 源码证据
- User-defined phases：排查不清楚原因；优化信息与页面；补充反误解说明、证据状态和响应式导航；验证桌面、中等宽度、窄屏和交互状态
- Required artifacts：优化后的 HTML/CSS/JS、更新的构建检查、浏览器前后截图、验证记录
- Autonomy authorization：用户先明确要求“排查并优化”，并在审计结论后明确要求“修复”；允许在当前页面内直接调整信息架构、文案、视觉层级与交互
- User-decision boundary：不改变研究结论、不发布远端、不增加真实代理能力或外部服务

## 可观察完成标准

1. 桌面首屏同时出现一句话结论、四个对象的分类和一张简化层级图，不需要滚动才能知道“它是什么”。
2. fanqiang、ChromeGo、FQNews2、Clash 可在同一视区横向比较，不能再依赖切换才能理解差异。
3. FQNews2 默认显示完整成功链；业务层、控制面、数据面的白话定义与相关步骤同时可见。
4. 390px 宽度无页面级横向溢出，比较卡和步骤按单列/双列重排。
5. 五个运行状态都可点击，所选状态、当前决策和高亮步骤同步变化。
6. Tab 键可依次到达导航、运行状态与证据折叠入口，焦点可见。
7. 项目构建、契约检查和根目录目录校验通过。
8. 首屏明确说明仓库不是统一适配框架，FQNews2 区明确说明可配置节点/协议不等于任意替换内核。
9. 关键结论展示“源码确认 / 代码推断 / 尚未验证”的证据状态说明。
10. 721–1040px 中等宽度和 720px 以下窄屏均保留可操作的章节导航，不遮挡正文且支持键盘。

## 覆盖记录

| 阶段 | 要求 | 表面 / 状态 | 证据 | 状态 | 下一步 |
| --- | --- | --- | --- | --- | --- |
| 排查 | 复现描述不清楚 | 桌面首屏 | `01-before-desktop.png` | pass | 保留证据 |
| 排查 | 复现产品对照问题 | ChromeGo / FQNews2 | `02-before-products.png`、`03-before-fqnews2.png` | pass | 保留证据 |
| 排查 | 复现链路可读性问题 | FQNews2 / 无节点 | `04-before-runtime.png` | pass | 保留证据 |
| 优化 | 首屏先给明确答案 | 桌面首屏 | `05-after-desktop.png` | pass | 已验证 |
| 优化 | 四者同屏对照 | 桌面产品区 | `06-after-comparison.png` | pass | 已验证 |
| 优化 | FQNews2 完整链路可见 | 已连接状态 | `07-after-runtime.png` + 状态交互 | pass | 已验证 |
| 验证 | 窄屏无溢出 | 390px | `08-after-mobile.png`、`09-after-mobile-runtime.png` | pass | 已验证 |
| 验证 | 五状态与键盘路径 | 状态按钮 / 证据折叠 | 浏览器点击与方向键验证 | pass | 已验证 |
| 验证 | 工程校验 | Demo + 根目录 | `npm run verify`、根目录检查 | pass | 已验证 |
| 补充 | 排除“统一适配框架”误解 | 首屏结论 | `10-fixed-desktop.png`、`04-fixed-medium.png` + DOM | pass | 已验证 |
| 补充 | 排除“任意替换内核”误解 | FQNews2 能力边界 | `07-fixed-boundary.png` + DOM | pass | 已验证 |
| 补充 | 标明研究结论证据强度 | 结论与证据入口 | `11-fixed-evidence.png` + DOM | pass | 已验证 |
| 修复 | 中等与窄屏章节导航可用 | 735px / 390px | `05-fixed-menu-open.png`、`09-fixed-mobile-menu.png` + 点击 / Escape | pass | 已验证 |
| 验证 | 修订 3 工程验收 | Demo + 根目录 | 项目 `npm run verify`、根目录 `npm run check` 与 `npm run build:site` | pass | 已验证 |
