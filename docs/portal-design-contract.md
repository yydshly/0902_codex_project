# 研究门户设计契约

## 交付边界

```text
Entry mode: brief-led repository initialization
Request revision: 1
Target user and context: 仓库维护者，以及从 GitHub README 或 Pages 进入的项目研究读者
Desired first impression: 有序、克制、可信，能立刻理解这是一个持续更新的研究档案
Visual ambition: Editorial
Experience architecture: Editorial Flow
Visual constraints: 不使用虚构项目或第三方装饰素材；系统字体；轻量色彩与清晰焦点；支持系统深浅主题
Information constraints: 根 README 只承担摘要和索引；结论、证据与图片解释下沉到研究条目
Operation constraints: 静态站点、原生链接与控件、键盘可达；不依赖后端或登录
State constraints: 明确覆盖加载、空目录、已收录项目和目录加载失败四种状态
Environment constraints: GitHub Pages 项目子路径；无运行时依赖；390 / 768 / 1440 像素宽度可用
Primary journey: 理解仓库定位 -> 浏览稳定编号索引 -> 打开研究记录或 Web Demo
User-defined phases: 初始化总库；建立有序索引与图片说明规范；预留多 Web 聚合部署
Required artifacts: README、目录清单、研究模板、图片说明模板、Pages 门户、部署工作流、维护说明
Autonomy authorization: 用户已明确要求直接初始化项目
User-decision boundary: 不替用户选择总库许可证；不虚构首个研究项目；不迁移旧 0831 项目内容
Observable completion criteria: 新仓库历史独立；目录和模板完整；清单可校验；站点可构建；空状态在目标视口和主题下可读；Pages 工作流指向统一发布产物
```

## 设计方向

| 决策 | 采用方向 | 可观察约束 | 验收标准 |
| --- | --- | --- | --- |
| 信息层级 | 定位、统计、索引、维护入口依次展开 | 首屏只有一个主标题与两类明确入口 | 初次浏览能辨认仓库用途和下一步 |
| 排版 | 编辑型长文节奏，辅以等宽编号 | 正文行长受限，编号不依赖颜色表达 | 390px 下无横向溢出，宽屏不松散 |
| 色彩与材质 | 中性纸张底色、墨色文字、蓝绿色强调 | 颜色全部来自语义变量 | 系统深浅主题下内容与焦点均清晰 |
| 交互 | 原生链接、状态筛选与卡片目录 | 所有操作可用键盘完成 | 焦点可见，筛选结果有状态反馈 |
| 动效 | 只在卡片进入与悬停时提供轻量反馈 | `prefers-reduced-motion` 下关闭非必要动画 | 无动画时不损失信息或操作 |

## 覆盖记录

| 用户阶段 | 需求或产物 | 表面 / 状态 | 所需证据 | 阶段 | 状态 | 下一步 |
| --- | --- | --- | --- | --- | --- | --- |
| 初始化总库 | 独立 Git 历史与标准目录 | 仓库 | Git 状态与文件清单 | 9 | `pass` | — |
| 有序索引 | 三位稳定编号与清单校验 | README / catalog | `npm run check` | 9 | `pass` | — |
| 图片说明 | 封面、截图描述和权利字段 | 研究模板 | 文件与字段检查 | 9 | `pass` | — |
| 多 Web 部署 | 门户与 Demo 子路径聚合 | 构建产物 | `npm run verify` 与工作流检查 | 9 | `pass` | — |
| 门户 | 目的清晰、空状态可行动 | 1440px，浅色 | 浏览器截图与 DOM 观察 | 2-6 | `pass` | — |
| 响应式 | 无裁切、顺序稳定 | 768px / 390px | 浏览器截图与溢出测量 | 7 | `pass` | — |
| 主题与可访问性 | 深浅主题、键盘、焦点、降级 | 主题 / 键盘 / reduced-motion | 浏览器观察 | 7-8 | `pass` | — |
| 交付关闭 | 构建、链接、Git 状态一致 | 全局 | 自动检查与最终审计 | 9 | `pass` | — |

详细运行环境和结果见 [`portal-validation.md`](portal-validation.md)。当前阶段为 Stage 9，初始化范围内没有待执行的 `continue` 项。
