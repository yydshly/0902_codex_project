# Lieflat Charts 能力展厅

- 关联研究：[`research/002-larashero3-dotcom-lieflat-charts/`](../../research/002-larashero3-dotcom-lieflat-charts/)
- 在线地址：`https://yydshly.github.io/0902_codex_project/demos/002-larashero3-dotcom-lieflat-charts/`
- 验证目标：先用普通中文总结 Lieflat Charts 的能力、工作原理和边界，再集中运行固定上游版本的真实图表、报告、配色和案例网页。
- 不覆盖：不生成新的业务图表，不验证任意数据的自动选型质量，也不把上游仓库安装为全局 Codex skill。

界面默认使用中文，页头可切换完整英文版本。切换后，页面文案、筛选项、展品说明和 R01–R12 报告预览会一起换语言；选择结果与语言会写入网址片段，便于分享和刷新后恢复。

页面先从六个真实业务任务开始：电商运营周报、产品增长复盘、客服质量分析、市场调研报告、区域经营分析和系统依赖梳理。选择任务后会直接看到手头应有的数据、最终交付物，以及“业务问题 → 输入字段 → 图表编号与普通图名 → 库所负责的能力”三段调用链；点击“运行这个调用”会进入对应的真实样张，并在合集页面内定位和强调目标图。

业务工作台之后用一张中英双语的架构与能力总图解释完整链路：外部业务目标和数据进入 AI 助手执行层，AI 依据规则与目录调用 59 种常规图、2 种地图、3 种关系大图、12 套报告、4 种视觉系统和交付检查，再由 SVG、ECharts 或 Chart.js 在浏览器中生成单图或报告 HTML。总图明确标注这是一套 AI 辅助生产工作流，不是直接传数据的运行时 API。

这里的“调用”不是 JavaScript 函数或 npm 接口，而是 AI 助手读取仓库规则、选择编号模板、替换业务数据并生成 HTML 的过程。场景工作台之后再按选图、单图模板、地图与关系大图、整页报告、视觉交互规则和交付检查六层梳理库的完整能力与边界。

调用后的结果区会继续显示来源业务、原问题、模板编号和实际输入字段，并明确提醒“上游样张只演示表达结构，真正生成时会替换为业务数据”。用户可以直接返回原调用；`call` 状态随网址、刷新及浏览器前进后退恢复。手动改看其他展品时，这段调用上下文会自动退出，避免把自由浏览误认成当前业务结果。

## 上游版本

- 仓库：`https://github.com/larashero3-dotcom/lieflat-charts`
- commit：`4eef5ce00d0907a03b8eff42578b5a04942915e9`
- 日期：`2026-08-19`
- 许可证：PolyForm Noncommercial 1.0.0

完整 clone 只保存在根仓库已忽略的 `.codex-tmp/upstreams/lieflat-charts/`。应用不提交第三方 HTML；构建器优先从该 clone 复制，缺失时从固定 commit 的 GitHub Raw URL 获取，并把上游许可证与第三方声明一起放入产物。

## 本地构建

```powershell
npm ci
npm run build
npx serve dist
```

从根目录构建整个站点：

```powershell
npm run verify
```

## 构建产物

```text
dist/
├─ index.html                 # 能力摘要与样张浏览器
├─ app.js / exhibits.js      # 交互与展品元数据
├─ styles.css                # 响应式展厅外壳
└─ upstream/                 # 构建时取得的固定上游文件
```

展厅同一时间只加载一个 iframe。上游部分 ECharts、Chart.js、在线字体和地图 GeoJSON 仍需要网络；加载失败时，摘要、清单、源码链接和其他不依赖 CDN 的样张仍可使用。

## 验证

工程检查：

```powershell
npm run check
npm run build
```

浏览器检查与最终状态记录在 [`docs/delivery-contract.md`](docs/delivery-contract.md)。

已验证环境：Chromium，桌面 `1440×1000`、平板 `768×1024`、手机 `390×844`。已逐项检查六类业务任务、每项三段调用链、架构与能力总图、调用上下文与返回焦点、调用深链和历史恢复、数据字段与最终产出、具体图名、合集内目标图定位、当前展品适用提示、筛选、双语搜索、完整中英界面切换、中英报告同步、样张切换、内嵌视口切换、刷新、键盘路径、减少动态效果偏好，以及外部资源中断时的展厅外壳回退。

## 第三方来源与许可证

展厅中的 `upstream/` 构建产物来自 [Lieflat Charts 固定 commit](https://github.com/larashero3-dotcom/lieflat-charts/tree/4eef5ce00d0907a03b8eff42578b5a04942915e9)，仅作非商业研究和能力展示。上游使用 [PolyForm Noncommercial 1.0.0](https://github.com/larashero3-dotcom/lieflat-charts/blob/4eef5ce00d0907a03b8eff42578b5a04942915e9/LICENSE)；ECharts、Chart.js 与字体等继续适用上游 `THIRD_PARTY_NOTICES.md` 中的各自许可。商业使用前应另行取得许可。
