# MediaCMS 研究展台交付契约

## 设计契约

```text
Entry mode: brief-led
Request revision: 1
Target user and context: 需要快速判断一个开源项目是否值得继续投入的技术负责人、产品负责人和研发团队
Desired first impression: 先得到“这是完整媒体平台、较重、需求匹配时才值得采用”的明确结论
Visual ambition: Editorial
Experience architecture: Editorial Flow
Visual constraints: 中文优先；深蓝、青绿与暖橙表示控制面、数据面与决策警示；不用装饰性 3D；核心链路首屏可见
Information constraints: 区分上游事实、代码推断和本研究评价；不把 README 宣称升级成生产能力结论
Operation constraints: 架构流程可切换；采用评估可键盘操作；无 JavaScript 时仍能阅读核心结论
State constraints: 架构包含上传、处理、播放三种状态；评估器包含未选择、建议采用、条件采用、不建议采用四类反馈
Environment constraints: 纯静态应用；兼容 GitHub Pages 子路径；不连接 MediaCMS 实例、不上传媒体、不依赖第三方运行时
Primary journey: 首屏结论 → 能力与代价 → 切换三条架构链路 → 勾选需求获得采用建议 → 阅读扩展与证据
User-defined phases: 整理理解；补充必要信息；完善 Web；构建验证；提交远端；确认部署
Required artifacts: 研究 README、来源与素材说明、架构图、Web Demo、目录登记、根 README 更新、浏览器验证记录
Autonomy authorization: 用户明确要求整理、完善、提交并部署，可直接实施和推送本次范围内的可逆变更
User-decision boundary: 不部署 MediaCMS 本体；不修改其他研究项目；不替用户作正式许可证法律结论
Observable completion criteria: 桌面与手机无横向溢出；首屏能读出定位与结论；交互状态可区分且可键盘完成；构建与目录校验通过；仅提交本项目文件；Pages workflow 成功
```

## 设计方向

| 决策 | 选择 | 可观察约束 | 验收标准 |
| --- | --- | --- | --- |
| 信息层级 | 结论先于功能列表 | 首屏同时出现项目定义、研究价值和重量判断 | 无需滚动即可回答“它是什么、是否值得研究” |
| 架构表达 | 三条任务链共用一张系统图 | 切换上传、处理、播放时只高亮相关节点 | 每条链都有文字说明，不依赖颜色理解 |
| 采用判断 | 需求选择器生成条件化建议 | 每个选项是原生复选框，结果区域使用 `aria-live` | 鼠标和键盘均可完成，建议随选择更新 |
| 响应式 | 1280px 桌面与 390px 手机 | 卡片、流程和表格不被裁切，不产生页面级横向滚动 | 两个目标视口均通过浏览器检查 |
| 动效 | 只解释状态变化 | `prefers-reduced-motion` 下取消平滑滚动和过渡 | 关闭动效不损失信息或操作 |

## 覆盖记录

| 用户阶段 | 要求或产物 | 表面 / 状态 | 证据 | 阶段 | 状态 | 下一步 |
| --- | --- | --- | --- | --- | --- | --- |
| 整理理解 | 研究结论与边界 | 研究 README | 固定版本源码链接与结论分层 | 3/9 | pass | `research/009-mediacms-io-mediacms/README.md` 已完成 |
| 补充信息 | 架构、容量、扩展、许可证、安全维护 | README + Demo | 一手来源与代码定位 | 3/9 | pass | 12 条固定版本证据进入构建产物 |
| 完善 Web | 首屏与三条链路 | 1280×800 / light | 截图与 DOM 状态 | 2–5 | pass | 无横向溢出；页签点击与 Home/End 通过 |
| 完善 Web | 手机阅读与评估器 | 390×844 / light / keyboard | 截图、溢出量、焦点与结果状态 | 5–7 | pass | 双列架构、目录 Escape、四态评估器通过 |
| 构建验证 | 项目与根目录检查 | production build | `npm run verify` 与根目录校验 | 9 | pass | MediaCMS app 与 9 个 catalog Demo 全量构建通过 |
| 提交远端 | 仅包含 MediaCMS 研究文件 | git main | staged diff、commit、push | 9 | pass | `1138002` 已推送，未包含现有 `006` 未跟踪素材 |
| 确认部署 | GitHub Pages | production URL | Actions 结论与线上 HTTP/页面检查 | 9 | pass | run `33867891924` 成功；页面、证据 JSON 与架构图均为 HTTP 200 |
