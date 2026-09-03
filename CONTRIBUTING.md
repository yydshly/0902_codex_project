# 新增与维护研究项目

本仓库使用稳定三位编号组织研究。编号代表登记顺序，不代表质量排名；一经发布便不修改、不复用。

## 1. 领取下一个编号

查看 [`catalog/projects.json`](catalog/projects.json) 中的最大 `id`，将其加一并补齐为三位数字。空目录的第一个编号为 `001`。

研究目录命名规则：

```text
research/<编号>-<owner>-<repository>/
```

例如：

```text
research/001-facebook-react/
```

多仓库或主题研究可使用含义明确的稳定 slug，例如 `002-local-first-tools`，但必须在条目 README 中列全来源与关系。

## 2. 创建研究条目

复制 `research/_template/`，然后完整填写新的 README。至少要确认：

- 上游仓库 URL 可以访问；
- 研究基线是明确的 commit、tag 或 release；
- 上游许可证名称与链接已经记录；
- 事实、推断和个人判断有清晰区分；
- 验证过的结论写明方法，未验证内容明确标注；
- 引用的代码、截图和素材符合上游授权边界。

完整上游源码默认只在本地工作目录保存，不提交到本总库。需要复现实验时，只保留最小代码、补丁、输入和说明。

## 3. 记录图片

图片放在研究条目的 `assets/` 目录：

```text
assets/
├─ cover.webp
└─ screenshots/
   └─ architecture-overview.webp
```

每张对外图片都要在条目 README 或 `assets/README.md` 中记录：

| 字段 | 要求 |
| --- | --- |
| 替代文本 | 描述画面本身，不写“图片”或文件名 |
| 画面说明 | 读者能从画面看到什么 |
| 研究意义 | 它支持哪条结论，为什么值得展示 |
| 来源 | 自制、上游仓库、官方文档或其他明确链接 |
| 权利说明 | 上游许可证、使用许可或仅引用说明 |
| 截取日期 | 外部页面或可能变化的界面必须记录日期 |

根 README 只使用最能代表研究结论的封面。避免提交包含密钥、个人信息、内部地址或无关浏览器内容的截图。

每个项目必须有一张对外核心图，选择顺序如下：

1. 已验证 Demo 中最能说明核心能力的首屏或关键交互；
2. 无单一代表画面时，基于固定版本源码和研究结论自制架构图、能力总图或整体流程图；
3. 不使用与研究结论无关的装饰图、虚构产品截图或无法追溯来源的占位图。

## 4. 登记目录清单

在 `catalog/projects.json` 的 `projects` 数组末尾新增条目。数组必须严格按 `id` 递增，路径必须指向真实文件。`cover` 是必填字段，`demo` 仅在相应产物存在时填写。

条目字段以 [`catalog/projects.schema.json`](catalog/projects.schema.json) 为准。完成后同步根 README：

```json
{
  "id": "001",
  "slug": "owner-repository",
  "title": "Project Name",
  "repository": "https://github.com/owner/repository",
  "summary": "一句话说明项目价值和本次研究重点。",
  "status": "studying",
  "tags": ["architecture", "tooling"],
  "studyPath": "research/001-owner-repository/README.md",
  "createdAt": "2026-09-03",
  "updatedAt": "2026-09-03",
  "cover": {
    "path": "research/001-owner-repository/assets/cover.webp",
    "alt": "准确描述封面中可见的界面或结构",
    "caption": "说明这张封面支持的核心研究结论",
    "credit": "来源、作者与许可证说明"
  }
}
```

同时把目录根节点的 `updatedAt` 更新为本次变更日期。若暂时没有合规 Demo，可以省略 `demo`；若没有代表性界面，应先制作基于研究证据的架构或能力总图，再登记 `cover`，不要使用虚构占位路径。

```powershell
npm run catalog:sync
```

不要手工修改 README 中 `PROJECT_INDEX_START` 与 `PROJECT_INDEX_END` 之间的表格。

## 5. 可选：增加 Web Demo

源码目录使用与研究条目相同的编号和 slug：

```text
apps/001-facebook-react/
```

应用需要提交 `package.json` 与 `package-lock.json`，提供 `npm run build`，并将静态产物输出到自己的 `dist/`。根流程会对状态为 `published` 的本地 Demo 执行 `npm ci` 和构建。GitHub Pages 的最终访问路径为：

```text
/0902_codex_project/demos/001-facebook-react/
```

应用内的资源基础路径必须兼容该子路径。更多构建约定见 [`apps/README.md`](apps/README.md)。

## 6. 提交前检查

```powershell
npm run check
npm run build
```

检查还应包括：

- 根 README 索引与目录清单一致；
- 每个项目都有一张可追溯、能解释核心结论的演示图或架构图；
- 编号、slug、研究目录与 Demo 路径一致；
- Markdown 中的本地链接和图片路径有效；
- Pages 总入口可在桌面与手机宽度阅读；
- 新增素材的来源和权利说明完整；
- 没有提交 `node_modules/`、应用构建缓存、密钥或完整第三方源码。
