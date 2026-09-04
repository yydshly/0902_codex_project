# Browser validation

验证日期：2026-09-04（Revision 3）
验证地址：`http://127.0.0.1:4177/`  
浏览器：Chromium，由 `agent-browser 0.27.0` 驱动  
构建：`npm run check` 与 `npm run build` 均通过

## 结果

| 检查项 | 结果 | 证据 |
| --- | --- | --- |
| 页面加载与非空正文 | pass | 标题为 `Yichen Skills｜全量能力图谱`；body 返回 `HAS_CONTENT` |
| 运行时错误 | pass | error overlay 为 `OK`；page errors 与 console 均为空 |
| 全量能力 | pass | 可访问性树包含 22 个能力详情按钮；data invariant 验证 22 个唯一 name |
| 全量典型场景 | pass | 22 张能力卡与详情 dialog 均显示独立使用场景；映射数量 invariant 为 22 |
| 采用决策矩阵 | pass | 22 项恰好进入四组；DOM 为 4 个 bucket / 22 个 item，数量依次 7 / 5 / 6 / 4 |
| 采用条目联动 | pass | 方法借鉴组首项打开“互联网研究总入口”详情，Escape 正常关闭 |
| 阶段性最终理解 | pass | `#final-verdict` 包含 4 项判断：本质、执行主体、真正价值、使用边界；结论明确“不是 Agent” |
| 按需使用路径 | pass | DOM 包含 3 步路径与 STOP RULE；明确遇到任务再查、低风险体验、多次有效再独立沉淀、无需试遍 22 项 |
| 路线收束 | pass | 原按周推进路线已替换为“带着问题回来查 / 只留下必要证据 / 再决定是否沉淀” |
| 场景切换 | pass | 内容创作 7 步、深度研究 6 步、私域资产 6 步；鼠标和 ArrowRight 切换均通过 |
| 手动流程浏览 | pass | 选择内容流程第 6 步后显示 2 个驱动 Skill、handoff、闸门、效果和示例输出 |
| 完整流程播放 | pass | 正常模式从 0/7 运行到 7/7，状态为“模拟流程完成”，4 项成果全部 ready |
| 流程重置 | pass | 完成后恢复 0/7、0 项 ready 和第 1 步预览状态 |
| Skill 联动 | pass | 从流程中的 `yichen-summary` 标签打开详情，典型场景内容正确，Escape 关闭 |
| 搜索 | pass | 搜索“微信”返回 6 / 22 项 |
| 层级筛选 | pass | 在上述查询中选择 V 后返回 2 / 22 项 |
| 空状态与恢复 | pass | 不存在的关键词显示空状态；重置恢复 22 / 22 |
| 能力域筛选 | pass | “内容与媒体”返回 6 / 22，`aria-pressed=true` |
| 详情 dialog | pass | X Article 详情展示输入、输出、机制、依赖、边界、价值和固定来源；Escape 关闭 |
| 架构键盘导航 | pass | Agent 宿主 tab 聚焦后 ArrowRight 切换到 Skill 协议，并同步更新详情标题 |
| 明暗主题 | pass | 主题按钮更新 `data-theme` 与可访问名称，浅色状态单独截图 |
| 390px 移动导航 | pass | 桌面导航隐藏、目录按钮显示；原生 dialog 打开且 Escape 关闭 |
| 响应式溢出 | pass | 768px：scrollWidth 753；390px：scrollWidth 375，均未超过可用视口 |
| reduced motion | pass | 模拟偏好后 `matchMedia` 为 true，内容保持 `opacity: 1` |
| 流程 reduced motion | pass | 点击播放后不等待动画，立即进入 7/7 与 4/4 ready 完成态 |
| 台账空状态与边界 | pass | 0 条时展示空状态、LOCAL ONLY 与敏感信息警示；导出入口不可用 |
| 新增真实记录 | pass | 真实填写任务、Skill、结果、42 分钟、人工介入、产物、问题并保存；成功反馈出现 |
| 本地持久化与统计 | pass | 刷新后仍有 1 条记录；指标恢复为 1 次 / 1 次有效 / 42 分钟 / 1 条建议沉淀 |
| 空状态回归 | pass | 新增记录后 `hidden=true` 且 computed display 为 none，修复了 author CSS 覆盖 `hidden` 的问题 |
| JSON 导出 | pass | 导出链接文件名为 `yichen-skill-trials-2026-09-04.json`；载荷解码为 `yichen-skill-trials/v1`、`browser-local-only`、1 条原始记录；点击后页面未跳转并显示完成反馈 |
| 两段式删除 | pass | 第一次操作显示“确认”，第二次操作后 DOM、统计和 localStorage 同步清零，空状态恢复 |
| Skill 模板 | pass | 模板包含 7 个章节；复制操作显示“模板已复制”成功状态 |
| 新表单键盘路径 | pass | 聚焦实际任务后按 Tab，焦点按 DOM 顺序进入 Skill 选择框 |
| 新模块 reduced motion | pass | `matchMedia` 为 true；采用模块全部 reveal 内容保持可见，scroll behavior 为 auto |
| Revision 4 双主题 | pass | 最终理解模块在深色和浅色主题均保持标题、状态、四项判断和停止条件的清晰层级 |
| Revision 4 响应式 | pass | 1440px 无溢出；768px 为 2 列判断，scrollWidth 753；390px 为单列，scrollWidth 375 |
| Revision 4 导航与回归 | pass | 桌面和移动导航均显示“结论与采用”；移动 dialog 可开关；22 张能力卡、22 项采用条目和空台账均保留 |
| 应用与站点构建 | pass | 005 的 `npm run check` / `npm run build`、根目录 catalog 校验和 `build:site` 均通过；本机全库安装曾受项目 001 正在运行的 Vite 锁定 `esbuild.exe` 影响，远端干净环境随后完成完整 `npm run verify` |
| GitHub Pages | pass | 主提交 `a6ec261` 触发 [Actions run 33860325800](https://github.com/yydshly/0902_codex_project/actions/runs/33860325800)，验证、构建、上传和部署在 5m48s 内全部成功 |
| 线上 Demo 回读 | pass | 公开 URL 返回正确标题；`STUDY SETTLED`、STOP RULE、4 项判断、3 步路径、22 张能力卡和 22 项采用条目均存在，错误 overlay 为空 |
| 线上目录回读 | pass | `catalog/projects.json` 中 005 的更新时间为 `2026-09-04`，摘要与公开 Demo URL 均已更新 |

## Revision 4 最终结论截图

- `validation-artifacts/005-mcncarl-yichen-skills/release-final-desktop.png`
- `validation-artifacts/005-mcncarl-yichen-skills/release-final-desktop-light.png`
- `validation-artifacts/005-mcncarl-yichen-skills/release-final-tablet-768.png`
- `validation-artifacts/005-mcncarl-yichen-skills/release-final-mobile-390.png`

## Revision 3 采用闭环截图

- `validation-artifacts/005-mcncarl-yichen-skills/adoption-desktop.png`
- `validation-artifacts/005-mcncarl-yichen-skills/adoption-desktop-light.png`
- `validation-artifacts/005-mcncarl-yichen-skills/adoption-tablet-768.png`
- `validation-artifacts/005-mcncarl-yichen-skills/adoption-mobile-390.png`
- `validation-artifacts/005-mcncarl-yichen-skills/adoption-ledger-populated.png`
- `validation-artifacts/005-mcncarl-yichen-skills/adoption-ledger-mobile-390.png`

## Revision 2 流程截图

- `validation-artifacts/005-mcncarl-yichen-skills/scenario-desktop.png`
- `validation-artifacts/005-mcncarl-yichen-skills/scenario-desktop-complete.png`
- `validation-artifacts/005-mcncarl-yichen-skills/scenario-desktop-light.png`
- `validation-artifacts/005-mcncarl-yichen-skills/scenario-tablet-768.png`
- `validation-artifacts/005-mcncarl-yichen-skills/scenario-mobile-390.png`
- `validation-artifacts/005-mcncarl-yichen-skills/scenario-mobile-step.png`

## 观察

- 页面不依赖滚动触发才显示内容；静态研究结论在 JavaScript 失效时仍可读，筛选和流程模拟需要 JavaScript。
- 流程模拟器仍是静态研究展示，不对上游 Skill、账号、外部平台或私人数据做真实 E2E；试用台账则保存用户主动填写的真实日常证据，两者在页面中明确区分。
- 验收结束后已删除两条测试记录，交付页面恢复为空台账；截图内文字均为虚构验证数据。
- 阶段研究在 Revision 4 收束；后续不以覆盖全部 Skill 为目标，只在真实需求出现时按需查阅和体验。
