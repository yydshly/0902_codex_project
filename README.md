# 0902 Codex Project

> 一个持续研究优秀 GitHub 项目、沉淀可复用结论，并用小型 Web Demo 验证关键想法的总项目库。

[研究索引](#研究索引) · [研究规范](CONTRIBUTING.md) · [研究模板](research/_template/README.md) · [在线门户](https://yydshly.github.io/0902_codex_project/)

## 这个仓库记录什么

这里不是第三方源码的镜像集合。每个研究项目会围绕一个明确问题，记录上游版本、许可证、架构观察、关键实现、实验依据、适用边界和可复用经验；需要交互验证时，再增加一个独立 Web Demo。

根 README 只保留摘要、入口和稳定索引。完整研究、证据与图片解释放在对应的 `research/` 子目录中，避免总览随着项目增加而失去可读性。

## 本次研究：Lieflat Charts

[Lieflat Charts](https://github.com/larashero3-dotcom/lieflat-charts) 不是新的运行时图表 SDK，而是一套面向 AI 助手的数据表达工作流：它把数据形状判断、图型选择、视觉约束、真实 HTML 模板和交付检查写成 Agent 可执行的规则。

本研究固定在上游 commit `4eef5ce`，梳理了 **64 种图表、12 套中英双语报告、4 种视觉系统**，并用六类真实业务任务解释什么时候选择什么效果。配套展厅支持完整中英切换，包含架构与能力总图，并可直接运行固定版本的 52 个原始 HTML 样张。

[阅读完整研究](./research/002-larashero3-dotcom-lieflat-charts/README.md) · [打开在线能力展厅](https://yydshly.github.io/0902_codex_project/demos/002-larashero3-dotcom-lieflat-charts/) · [查看上游源库](https://github.com/larashero3-dotcom/lieflat-charts)

## 研究索引

<!-- PROJECT_INDEX_START -->
| 编号 | 项目 | 一句话摘要 | 状态 | 标签 | 研究记录 | Web Demo | 最近更新 |
| ---: | --- | --- | --- | --- | --- | --- | --- |
| `002` | [Lieflat Charts](https://github.com/larashero3-dotcom/lieflat-charts) | 把数据形状判断、图型选型、编辑设计规则和真实 HTML 模板编码成 Agent 可执行的数据可视化工作流。 | 已验证 | `agent-skills` `data-visualization` `html` `svg` `design-system` | [查看](./research/002-larashero3-dotcom-lieflat-charts/README.md) | [打开](https://yydshly.github.io/0902_codex_project/demos/002-larashero3-dotcom-lieflat-charts/) | 2026-09-03 |
<!-- PROJECT_INDEX_END -->

研究编号使用三位数字：`001`、`002`、`003`……编号一经发布便不修改、不复用。目录清单 [`catalog/projects.json`](catalog/projects.json) 是顺序与元数据的唯一来源，上表由脚本同步生成。

研究状态统一使用：

- `planned`：已登记，尚未开始系统研究；
- `studying`：正在阅读、实验或补充证据；
- `validated`：当前结论已完成约定范围内的验证；
- `archived`：停止继续维护，但保留历史记录。

## 子项目与图片说明

每个研究项目放在 `research/<编号>-<owner>-<repository>/`，入口 README 至少包含：

- 上游仓库、研究基线与许可证；
- 为什么值得研究、研究问题与核心结论；
- 架构与关键实现观察；
- 实验方法、证据、优点与局限；
- 封面和关键截图的画面描述、研究意义、来源与权利说明。

图片统一放入条目的 `assets/`。封面建议命名为 `cover.webp`，其他截图放入 `assets/screenshots/`；仅有图片文件而没有替代文本、说明和来源记录的素材不进入对外索引。

## Web Demo 与 GitHub Pages

同一个仓库只维护一个 GitHub Pages 站点，并将多个 Web 项目聚合到独立子路径：

```text
https://yydshly.github.io/0902_codex_project/                       # 总入口
https://yydshly.github.io/0902_codex_project/demos/001-example/     # 子项目 Demo
https://yydshly.github.io/0902_codex_project/demos/002-example/     # 另一个 Demo
```

Web 源码放在 `apps/<编号>-<slug>/`。每个应用独立构建到自己的 `dist/`，根构建脚本再把已登记的产物汇总到最终 Pages 目录。完整约定见 [`apps/README.md`](apps/README.md)。

## 仓库结构

```text
.
├─ catalog/                    # 有序项目清单与字段约束
├─ research/                   # 研究记录
│  └─ _template/              # 新研究项目模板
├─ apps/                       # 可选的独立 Web Demo 源码
├─ site/                       # GitHub Pages 总入口
├─ scripts/                    # 清单校验、README 同步和站点聚合
├─ docs/                       # 总库设计与维护决策
├─ .github/workflows/         # GitHub Pages 自动部署
├─ CONTRIBUTING.md            # 新增项目流程
└─ README.md                  # 对外摘要与总索引
```

## 开始第一个研究项目

```powershell
Copy-Item -Recurse research/_template research/001-owner-repository
# 填写研究 README 与 catalog/projects.json 后：
npm run catalog:sync
npm run check
```

详细步骤、字段规则与发布检查见 [`CONTRIBUTING.md`](CONTRIBUTING.md)。

## 来源与许可证

第三方项目、代码片段、截图和其他素材继续受其各自许可证与权利声明约束。每个研究条目必须记录上游来源、研究基线和许可证，并区分事实、推断与个人评价。

本总库暂未选择统一开源许可证；在原创内容与第三方材料的授权边界明确前，请勿默认复制或再分发仓库内容。
