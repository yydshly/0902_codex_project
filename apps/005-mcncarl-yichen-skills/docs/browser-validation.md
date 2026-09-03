# Browser validation

验证日期：2026-09-03（Revision 2）  
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

## Revision 2 流程截图

- `validation-artifacts/005-mcncarl-yichen-skills/scenario-desktop.png`
- `validation-artifacts/005-mcncarl-yichen-skills/scenario-desktop-complete.png`
- `validation-artifacts/005-mcncarl-yichen-skills/scenario-desktop-light.png`
- `validation-artifacts/005-mcncarl-yichen-skills/scenario-tablet-768.png`
- `validation-artifacts/005-mcncarl-yichen-skills/scenario-mobile-390.png`
- `validation-artifacts/005-mcncarl-yichen-skills/scenario-mobile-step.png`

## 观察

- 页面不依赖滚动触发才显示内容；静态研究结论在 JavaScript 失效时仍可读，筛选和流程模拟需要 JavaScript。
- 这是静态研究展示，不对上游 Skill、账号、外部平台或私人数据做真实 E2E。
