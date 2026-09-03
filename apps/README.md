# Web Demo 约定

`apps/` 保存研究项目附带的独立 Web Demo。Demo 用于验证或解释某项关键结论，不承担完整复刻上游产品的目标。

## 目录与地址

应用目录与研究编号保持一致：

```text
apps/001-owner-repository/
```

Pages 聚合后的公开地址为：

```text
https://yydshly.github.io/0902_codex_project/demos/001-owner-repository/
```

每个应用应有自己的 README，说明：

- 它关联的研究条目；
- 它验证的结论和明确不覆盖的范围；
- 本地开发、构建与验证命令；
- 浏览器、设备或能力限制；
- 引用代码、字体、图片和其他第三方资产的来源与许可证。

## 构建契约

- 应用可以选择自己的前端技术栈，但必须输出纯静态文件。
- 默认输出目录为应用自身的 `dist/`。
- 本地发布的应用使用 npm 构建，并提交 `package.json` 与 `package-lock.json`；根流程会在应用目录依次执行 `npm ci` 和 `npm run build`。
- 所有资源 URL 必须兼容 `/0902_codex_project/demos/<编号>-<slug>/` 子路径。
- 在 `catalog/projects.json` 的 `demo` 字段中登记源码目录、构建产物目录、公开子路径与状态。
- 每个已发布应用由根流程独立构建，随后统一聚合清单中登记的 `dist/`。
- 状态为 `published` 的 Demo 若缺少构建产物，聚合构建必须失败；`planned` 或 `building` 可以暂时没有产物。
- 不提交 `node_modules/` 和本地缓存。是否提交单个应用的 `dist/` 由项目说明决定，默认不提交。

## 推荐的应用 README

```markdown
# <Demo 名称>

- 关联研究：[`research/<NNN>-<slug>/`](../../research/<NNN>-<slug>/)
- 在线地址：`https://yydshly.github.io/0902_codex_project/demos/<NNN>-<slug>/`
- 验证目标：<这个 Demo 证明什么>
- 不覆盖：<它不证明什么>

## 本地运行

<命令>

## 构建与验证

<命令与可复现结果>

## 第三方来源

<依赖、素材与许可证>
```
