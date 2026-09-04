# 浏览器验收与交接

## 运行环境

| 字段 | 值 |
| --- | --- |
| 构建命令 | `npm run verify` |
| 本地服务 | 在应用目录执行 `npm run preview` |
| Canonical URL | `http://127.0.0.1:4197/` |
| 浏览器 | Chrome / Chromium，Windows |
| 验收时间 | `2026-09-04 16:04 +08:00` |
| 主题 | 单一浅色编辑主题 |
| 视口 | `1440×1000`、内置浏览器约 `570px`、`390×844` |

## 修订 8 可复现结果

| 覆盖项 | 观察 | 状态 |
| --- | --- | --- |
| 主视觉 | 案例首屏以非对称编辑网格同时呈现 350 主数字、8/33 数据条和三张固定上游真实海报 | pass |
| 候选版式 | 六条选择记录均有真实目录候选图、内容信号、编号、名称、理由与 `CATALOG CANDIDATE` 边界 | pass |
| 汇总网页 | 报告使用海报拼贴、八类真实数量比例条、四种能力图形、087 风险证据和五步 ETL 图 | pass |
| 社媒轮播 | 六页分别采用拼贴封面、大数字、便当盒、流程节点、证据对照和路线图；翻页 `01 / 06 → 02 / 06` | pass |
| 单页知识图 | 350 核心、三张真实素材、八类数据轨道、WHAT/HOW/LIMIT/NEXT 四象限在同一成品画布内 | pass |
| PPT 提纲 | 六张微型幻灯片分别使用图像、尺度、模块、流程、风险证据和决策构图 | pass |
| 素材边界 | 修复真实海报按固有长宽比越出知识图画布的问题；素材带现在被约束在成品内部，不遮挡标题 | pass |
| 标签与键盘 | 任一时刻只有一个 panel 可见；聚焦 PPT 标签后按 `ArrowLeft` 切换到知识图 | pass |
| 桌面与手机 | 1440×1000、390×844 均 `scrollWidth <= clientWidth`；内置浏览器约 570px 逐态实测无横向滚动 | pass |
| 低动态与错误 | `prefers-reduced-motion: reduce` 命中且根滚动为 `auto`；Runtime / Log 错误为空 | pass |
| 全量回归 | 页面仍有 350 张卡片、8 个一级分类、33 个主题；目录、搜索、详情和懒加载保留 | pass |
| 机器检查 | `check.mjs` 额外约束真实海报、数据图、六种轮播构图、知识图和 PPT 预览标记 | pass |

## 修订 9 公开交付结果

| 覆盖项 | 观察 | 状态 |
| --- | --- | --- |
| 理解收束 | 研究 README 新增三层能力表与产品公式，明确上游、Demo 和未来产品的能力归属 | pass |
| Web 完善 | `#image-case` 新增三列能力账本；桌面并列、窄屏纵向重排，信息与相邻仓库输入区无叠压 | pass |
| 自动回归 | CDP 实测 `ownershipCards=3`；1440×1000 与 390×844 零横向溢出，浏览器错误为空 | pass |
| 总库登记 | `catalog/projects.json` 的摘要、更新时间和封面说明已反映文章到四种媒介成品的研究闭环 | pass |
| 发布边界 | 提交只包含 `006` 项目、对应目录条目和自动生成的根 README；工作区其他项目修改未暂存 | pass |
| GitHub Pages | 主提交 `9157bc8` 推送后，Pages run `33858025809` 在 10m41s 内完成验证、构建、上传和部署；线上 HTML 与 catalog 均返回 200 | pass |

## 修订 7 可复现结果（历史）

| 覆盖项 | 观察 | 状态 |
| --- | --- | --- |
| 仓库作为案例 | 输入区真实列出 README、JSON/CSV 目录、导入与验证脚本、350 张素材、固定 commit，并载入 291 字研究文章 | pass |
| 可编辑输入 | `#article-input` 可编辑；点击后按钮进入“正在分析”，最终状态为“读取 291 字 · 命中 6/6 类内容信号 · 输出 4 种成品” | pass |
| 分析过程 | 页面依次反馈读取、拆解、匹配、生成四个阶段，六类规则卡同步进入命中状态 | pass |
| 选版解释 | 六条记录分别显示内容模块、目录候选编号、版式名和选择理由 | pass |
| 汇总网页 | 默认输出包含定义、350/8/33 数字、四层能力、静态 ETL 流程和能力边界，不是一张配字图片 | pass |
| 社媒轮播 | 六张独立页面分别承担结论、规模、能力、流程、风险、意义；点击下一页后 `01 / 06 → 02 / 06` | pass |
| 单页知识图 | 切换后只显示 `repo-panel-poster`；以 350 为主数字，并组织 WHAT / HOW / LIMIT / NEXT 四象限 | pass |
| PPT 提纲 | 切换后只显示 `repo-panel-deck`；六页按 Definition / Scale / Capability / Mechanism / Risk / Decision 排列 | pass |
| 标签互斥 | 任一时刻只有一个 `#case-studio [role=tabpanel]` 可见；修复了固定 `display:grid` 覆盖 `[hidden]` 的问题 | pass |
| 键盘 | 聚焦第一个输出 tab 后按两次 `ArrowRight`，选中状态依次切到社媒轮播和单页知识图 | pass |
| 能力边界 | 页面明确“上游提供版式知识，Demo 新增文章拆解、规则匹配和网页渲染”，并注明 catalog 仍需 OCR 与人工复核 | pass |
| 桌面响应 | CDP 设为 1440×1000，`scrollWidth <= clientWidth`；案例双栏、文章输入和仓库材料均完整可读 | pass |
| 中间宽度 | 内置浏览器约 732px 真实点击四种成品，标题、标签和输出区域没有叠压 | pass |
| 手机响应 | CDP 设为 390×844，`scrollWidth <= clientWidth`；标题自然换行，CTA 与材料卡纵向可读 | pass |
| reduced-motion | 浏览器模拟 `prefers-reduced-motion: reduce` 后媒体查询命中，根滚动行为为 `auto` | pass |
| 控制台与页面错误 | CDP 监听 `Runtime.exceptionThrown` 与 `Log.entryAdded`，结果为空 | pass |
| 既有全量能力 | 浏览器 DOM 为 350 张卡片、8 个一级分类、33 个主题；JSON、CSV、详情、搜索与懒加载逻辑保留 | pass |
| 机器检查 | `check.mjs` 检查仓库文章分析、可解释选版、四种输出和全量目录标记 | pass |

## 精炼记录

| 观察 | 处理 | 结果 |
| --- | --- | --- |
| 旧案例使用另一个 FIELD 05 项目，无法直接回答“这个仓库怎样汇总自己” | 将案例输入改为当前仓库材料包和研究文章 | 示例对象、研究结论和输出内容完全一致 |
| “自主选择”容易被理解成上游原生 AI | 增加透明规则、六类信号、候选编号、选择理由和双层能力说明 | 用户能看见系统依据，也能分清上游与 Demo |
| 四种结果若只是同图换字，没有媒介差异 | 分别实现长网页、连续轮播、一屏知识图和讲述提纲 | 四种成品拥有不同信息结构和阅读任务 |
| poster 标签切换后报告仍然可见 | 为 `#repo-panel-report[hidden]` 增加明确隐藏规则 | DOM 与截图都只显示当前 panel |
| 上游 catalog 有语义错位风险 | 在选版区注明编号/名称为未完成语义校验的目录候选 | 演示不把候选映射冒充生产 ground truth |
| 案例变更可能破坏全量图鉴 | CDP 同时检查案例与 350/8/33 DOM 计数 | 新案例和全量档案共存 |
| 修订 7 视觉上仍像“背景加文字” | 把真实海报、真实数量驱动的数据图和媒介专属构图接入四种输出 | 四个 panel 的轮廓、视觉重心和阅读节奏显著不同 |
| 知识图素材带按图片固有比例越出成品画布 | 为拼贴容器建立明确裁切边界并约束海报高度 | 保留叠层张力，同时不再遮挡页面说明与标签 |

## 浏览器证据

- 桌面截图：`research/006-nevertoday-350-layout-compositions/assets/screenshots/repository-article-case.png`
- 手机截图：`research/006-nevertoday-350-layout-compositions/assets/screenshots/repository-article-case-mobile.png`
- 汇总网页：`research/006-nevertoday-350-layout-compositions/assets/screenshots/repository-visual-report.png`
- 社媒轮播：`research/006-nevertoday-350-layout-compositions/assets/screenshots/repository-visual-carousel.png`
- 单页知识图：`research/006-nevertoday-350-layout-compositions/assets/screenshots/repository-visual-poster.png`
- PPT 提纲：`research/006-nevertoday-350-layout-compositions/assets/screenshots/repository-visual-deck.png`
- 手机汇总网页：`research/006-nevertoday-350-layout-compositions/assets/screenshots/repository-visual-report-mobile.png`
- 三层能力账本：`research/006-nevertoday-350-layout-compositions/assets/screenshots/repository-capability-ownership.png`
- 自动验收脚本：`scripts/browser-verify.mjs`，使用 Chrome DevTools Protocol，无第三方运行时依赖。

## 终端审计

- 修订 8 设计契约已收口，无 `continue`、`blocked` 或 `defer`。
- `npm run verify` 已通过；根目录 `npm run check` 已通过。
- 发布目录已同步到 `dist/demos/006-nevertoday-350-layout-compositions/`，核心文件与应用构建哈希一致。
- 独立应用无运行时依赖和外部字体；高清原图链接仍需要网络。
- GitHub Pages 主部署：[Actions run 33858025809](https://github.com/yydshly/0902_codex_project/actions/runs/33858025809) 成功；线上 HTML 包含 `capability-ownership` 与“先分清三层”，`upstream/catalog.json` 返回 350 项。
