# 架构与获取方式

## 上游仓库结构

固定 commit 的主体由 450 张 PNG、450 张 JPEG、Markdown 文档、JSON/CSV 目录和两个 Python 脚本组成。450 对图片包括经典版 100 项与 v2 的 350 项。

```text
README.md                    GitHub 主画廊与使用说明
docs/350/                   总目录与 8 个分类画廊
images/ + thumbnails/       经典版 100 项
v2/images/                  新版 350 张高清 PNG
v2/thumbnails/              新版 350 张 JPEG 缩略图
v2/catalog.json|csv         机器目录
scripts/import-350.py       导入、派生素材、生成目录和文档
scripts/verify-collection.py 结构与链接验证
```

这不是一个前端应用或运行时组件库：仓库没有页面框架、npm 包、布局求解器或对外 API。GitHub Markdown 本身就是浏览界面。

## 导入数据流

`import-350.py` 将分类与主题范围硬编码成 Python 数据结构，从仓库外部的 `图片对应关系.tsv` 和按主题分组目录读取源素材，然后：

1. 校验映射表恰好 350 行且编号连续；
2. 按分类 slug 复制 PNG；
3. 用 Pillow LANCZOS 生成最大 480×640 的 progressive JPEG；
4. 记录名称、分类、路径、尺寸和 PNG SHA-256；
5. 生成 JSON/CSV、8 个分类页、总索引和 README 默认画廊。

这条管线将源映射表视为语义真值，因此无法发现映射表本身把某张图片分给了错误名称。

## 验证边界

`verify-collection.py` 覆盖：

- 经典版和 v2 文件是否存在；
- v2 是否恰好 350 项、编号连续、名称与路径唯一；
- 一级/二级分类是否为 8/33；
- JSON 与 CSV 关键字段是否一致；
- 图片能否解析、尺寸和 SHA-256 是否匹配；
- Markdown 本地链接、锚点和四列画廊是否完整。

它没有 OCR、图像分类或人工抽查步骤，所以文件名和 catalog 可以在“共同出错”的情况下完全通过。

## 本 Demo 的获取与构建

应用构建器把上游固定为：

```text
34dc39cb5128776b594754624fa2202d5942a35b
```

构建时优先使用：

```text
.codex-tmp/upstreams/350-layout-compositions/
```

目录不存在时，`build.mjs` 会执行 partial clone，并用 sparse checkout 只取得 README、许可证、目录、脚本、分类文档和 350 张缩略图。构建产物包含：

```text
dist/
├─ index.html / styles.css / app.js
└─ upstream/
   ├─ catalog.json
   ├─ meta.json
   ├─ UPSTREAM-LICENSE.txt
   └─ thumbs/001.jpg … 350.jpg
```

高清 PNG 不进入本项目源码或 Demo 产物；详情只链接到固定 commit 的 GitHub 文件页。这样既能离线浏览缩略图，又不会把总库变成完整第三方镜像。

## 前端数据流

浏览器只读取本地 `upstream/catalog.json`。筛选状态由一级分类、二级主题和文本查询组成，最多先渲染 24 张卡片，再由用户请求下一批。卡片图片使用原生懒加载；详情使用原生 `dialog`，保留 Escape、焦点约束和关闭后的焦点归还。

如果 catalog 获取失败，能力说明和质量边界仍是静态 HTML；图鉴区域提供明确错误和重试操作。
