# MediaCMS Decision Atlas

一页式静态研究展台，用来回答 MediaCMS 是什么、为何较重、何时值得采用，以及哪些扩展工作优先级最高。

## 本地运行

```bash
npm run verify
npm run preview
```

默认地址为 <http://127.0.0.1:4209/>。应用没有运行时依赖，构建产物位于 `dist/`，所有路径均使用相对地址，适配 GitHub Pages 子目录部署。

## 内容边界

- 研究固定于 MediaCMS `v8.4.0` / `d146be7c3c6828075dfc83719c37819f1b6fbef7`。
- Demo 只展示原创研究内容与架构图，不连接 MediaCMS 实例，也不上传或处理媒体。
- `dist/upstream/evidence.json` 在构建时生成，保存可追溯的一手源码链接。
- 上游采用 AGPL-3.0；本研究不构成法律意见。
