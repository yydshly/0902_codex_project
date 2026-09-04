# 350 Layout Compositions 能力图鉴

- 关联研究：[`research/006-nevertoday-350-layout-compositions/`](../../research/006-nevertoday-350-layout-compositions/)
- 在线地址：`https://yydshly.github.io/0902_codex_project/demos/006-nevertoday-350-layout-compositions/`
- 验证目标：以网页全量整理并展示上游 350 项；同时把对当前仓库的研究文章作为输入，现场演示“拆解内容 → 解释选版 → 生成四种汇总成品”，并呈现 8×33 分类结构、搜索、机器目录、素材管线和当前语义映射风险。
- 不覆盖：不提供自动排版、可编辑模板、生产级推荐器，也不宣称上游文件名和图片内容已经逐项一致。

## 上游版本

- 仓库：`https://github.com/nevertoday/350-layout-compositions`
- commit：`34dc39cb5128776b594754624fa2202d5942a35b`
- 许可证：CC BY 4.0
- 已知问题：[`v2 catalog 与图片内容大面积错位 #1`](https://github.com/nevertoday/350-layout-compositions/issues/1)

完整 clone 保存在根仓库已忽略的 `.codex-tmp/upstreams/350-layout-compositions/`。构建器会固定到上述 commit，只检出 README、许可证、目录、脚本、文档与 350 张缩略图；构建产物不提交到总库。

## 网页能力

- 当前仓库本身就是案例：输入区列出 README、catalog、导入/验证脚本、350 张缩略图和固定 commit，并提供一篇可编辑的仓库研究文章；
- 案例先用三层能力账本区分“原库已有 / 本 Demo 补上 / 真正产品仍需”，并用“清洗后的知识库 + 内容理解 + 可执行模板 + 质量检查”给出准确产品公式；
- 点击分析后，页面以规则识别定义、数字、能力、流程、边界和方向六类内容信号，逐项说明为什么选择 Hero、大数字、便当盒、流程、比较和时间线等版式候选；
- 同一份研究分别实际渲染为完整汇总网页、6 页社媒轮播、单页知识图和 6 页 PPT 提纲；四个输出通过可访问 tab 与方向键切换；
- 生成结果直接使用固定上游的真实海报：网页包含海报拼贴、八类比例图、能力便当盒和 ETL 证据链；轮播六页使用六种不同构图；知识图有真实素材带和八类数据轨道；PPT 以六张不同的 16:9 微型画面呈现讲述顺序；
- 页面明确区分上游与 Demo：上游是版式知识库，文章拆解、规则匹配和网页渲染属于本 Demo 的增强层；catalog 名称尚未完成语义校验，不能把规则演示宣传成上游原生 AI 或可靠的生产推荐器；
- 初始文档完整包含 350 张卡片，不需要点击“加载更多”；
- 先以 8 个一级分类、33 个二级主题和每组数量组成完整目录地图；
- 图鉴按“一级分类 → 二级主题 → 条目”分组，可搜索、筛选并打开详情；
- JSON、CSV 和构建版本信息均可直接下载或查看；
- 图片使用显式视口观察按需加载，350 张卡片进入 DOM 时不会同步请求全部图片；
- 所有上游名称继续标记为 `UNVERIFIED`，不会把当前错位标签包装成正确知识。

## 本地构建

```powershell
npm ci
npm run preview
```

然后打开 `http://127.0.0.1:4197/`。`npm run preview` 会先构建，再用项目内无依赖 HTTP 服务器提供完整网页。

不要直接双击 `src/index.html` 或 `dist/index.html`：`file://` 环境不能作为这个应用的目录获取入口，而且 `src/` 本身不包含构建生成的 350 张缩略图。误开源码文件时，页面会显示正确命令和地址。

首次构建需要访问 GitHub；已有固定上游 clone 时可离线重建。输出为纯静态文件，资源路径兼容总库的 GitHub Pages 子路径。仅执行检查与构建可使用：

```powershell
npm run verify
```

## 浏览器验收

最终设计契约、覆盖矩阵和浏览器证据记录在研究目录的 [`design-contract.md`](../../research/006-nevertoday-350-layout-compositions/design-contract.md) 与应用的 [`docs/delivery-contract.md`](docs/delivery-contract.md)。

## 第三方来源

缩略图、目录和许可证来自固定版本的 [nevertoday/350-layout-compositions](https://github.com/nevertoday/350-layout-compositions/tree/34dc39cb5128776b594754624fa2202d5942a35b)，依据 CC BY 4.0 用于署名研究与展示。高清原图通过固定 commit 的 GitHub 页面按需打开，不复制进本项目源码。
