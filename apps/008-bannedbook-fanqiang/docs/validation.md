# fanqiang Capability Atlas · 验证记录

## 验证环境

- 本地预览：`npm run serve`，`http://127.0.0.1:4208/`
- 桌面视区：约 1265 × 712
- 窄屏视区：390 × 844
- 主题与语言：暗色主题、简体中文
- 证据目录：`E:\0902_codex_project\.codex-tmp\fanqiang-audit`

## 前后对照

| 检查项 | 优化前证据 | 优化后证据 | 结果 |
| --- | --- | --- | --- |
| 首屏能否直接回答“它是什么” | `01-before-desktop.png` | `05-after-desktop.png` | pass：结论、四者定义与三层架构同屏 |
| ChromeGo / FQNews2 是否易于比较 | `02-before-products.png`、`03-before-fqnews2.png` | `06-after-comparison.png` | pass：取消理解所需的切换，四者同屏 |
| FQNews2 能力链是否可见 | `04-before-runtime.png` | `07-after-runtime.png` | pass：默认正常工作，八步成功链可见 |
| 移动端可读性 | — | `08-after-mobile.png`、`09-after-mobile-runtime.png` | pass：无页面级横向溢出 |

## 功能与工程验证

- 五个运行状态均可点击，标题、结论、状态标签、事实说明和步骤高亮同步更新。
- 状态选项支持 `ArrowLeft`、`ArrowRight`、`Home`、`End`，焦点随选中项移动。
- 证据折叠入口可键盘操作，展开后可见 11 条固定提交源码链接。
- 390px 视区测得 `scrollWidth <= clientWidth`，无页面级横向溢出。
- `npm run verify` 通过；检查覆盖固定提交、四者定义、FQNews2 八步链、五状态、默认成功态和交付契约。
- 根目录目录检查与静态站点构建通过。
- 根目录完整 `npm run verify` 在重装项目 001 依赖时被已占用的 `esbuild.exe` 阻断（Windows `EPERM`）；本项目 008 的 `npm run verify`、根目录 `npm run check` 与 `npm run build:site` 均独立通过。

## 已知边界

- 验证覆盖桌面与窄屏主路径，不等同于完整 WCAG 审计；未使用真实屏幕阅读器。
- `prefers-reduced-motion` 由 CSS 保护规则覆盖，本轮未做浏览器级动态模拟。
- 页面只解释研究结论，不连接真实代理节点，也不运行 fanqiang、ChromeGo、FQNews2 或任何代理内核。

## 修订 3：反误解说明与响应式导航

- 时间：2026-09-04
- 运行入口：`npm run serve`，`http://127.0.0.1:4208/`
- 桌面 1265 × 712：完整章节导航可见；首屏“不是统一适配框架”说明和“源码确认”标签可见，证据为 `10-fixed-desktop.png`。
- 中等宽度 735 × 880：紧凑章节菜单可见、可展开、可通过链接跳转；`Escape` 可关闭并把焦点还给菜单按钮，证据为 `04-fixed-medium.png`、`05-fixed-menu-open.png`。
- 手机 390 × 844：紧凑章节菜单可见且打开后无页面级横向溢出，测得 `scrollWidth = clientWidth = 375`，证据为 `08-fixed-mobile.png`、`09-fixed-mobile-menu.png`。
- FQNews2：新增“可配置节点与协议，不等于可以任意替换代理内核”，并保留应用级、非系统全局代理边界，证据为 `07-fixed-boundary.png`。
- 证据状态：源码入口新增“源码确认 / 代码推断 / 尚未验证”图例，11 条固定提交源码链接仍可展开，证据为 `11-fixed-evidence.png`。
- 浏览器控制台：无 error 或 warning。
- 工程验证：项目 `npm run verify`、根目录 `npm run check`、根目录 `npm run build:site` 通过。
- 支持边界：仅暗色主题；无高成本视觉层或新增动画；现有 `prefers-reduced-motion` 保护保持不变。
