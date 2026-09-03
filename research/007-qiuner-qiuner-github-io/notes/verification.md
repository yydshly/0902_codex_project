# 验证说明

## 源码基线

- repository: `https://github.com/Qiuner/Qiuner.github.io`
- commit: `85b20634da13a02bcc2e67b2f42fb50d4aba7b93`
- captured: `2026-09-03`

## 已执行

- 上游 `npm ci --ignore-scripts`
- 上游 `npm test`
- 上游 `npm run build`
- 上游 `npm audit --json`
- 本 Demo `npm run verify`
- 本 Demo浏览器桌面端与移动端验证

## 浏览器验收

- 桌面端：页面正文、六个 World 选项和实时 iframe 均可见，控制台无 error / warning。
- 实时来源：从 Cosmic 切到 Archipelago 后，iframe 更新为 `?world=archipelago`，并能读取上游已加载的正文；Asset Wall 更新为 `/3d-assets/`。
- 场景判断：选择“业务后台”后，结论更新为 `POOR FIT / 高频业务操作不需要一座宇宙`。
- 移动端：在 375 CSS px 视口复验，`scrollWidth === clientWidth`，页面无横向溢出，六个 World 选项保留横向滚动操作。
- 真实品牌样例：从 `catalog/projects.json` 生成 6 个项目、6 个 Demo、5 个已验证项目、34 个唯一标签和 5 类能力视角。
- 能力筛选：选择“Agent 工作流”后只保留 Lieflat Charts、ThreeUI、Yichen Skills 三项真实证据。
- Demo 回放：选择 Yichen Skills 后，本地 iframe 成功加载 `/__portfolio/mcncarl-yichen-skills/`，可读取实际展示内容。
- 扩展后窄栏：在 492 CSS px 的应用侧栏中复验，`scrollWidth === clientWidth`；控制台无 error / warning。
- 个人品牌模拟：生成 5 项证据覆盖、3 种目标受众、3 项差异点与 3 个待补证缺口；所有推导字段均与真实项目数据分开标注。
- 受众切换：选择“品牌与创意团队”后，价值表达和对应证据更新为 Aurelia、ThreeUI、350 Layout Compositions；863 CSS px 视口无横向溢出，控制台无 error / warning。

## 解释边界

构建脚本只读取上游源码树并输出计数型事实元数据，不将源码或媒体复制到 `dist/`。实时世界通过上游自己发布的 GitHub Pages 加载。若上游撤下站点，Demo 的文字、架构和证据台仍可阅读，但实时 iframe 将不可用。
