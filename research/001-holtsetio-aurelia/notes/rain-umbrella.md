# Rain Membrane / 雨落伞面实验

## 设计契约（R10）

| 字段 | 决策 |
| --- | --- |
| Entry mode | Brief-led；从 R9 图谱的 `FIELD 01 / 雨落在伞面` 进入首个现实机制样例 |
| Request revision | R10：按案例顺序开始作品化，不修改已完成的声场雕塑、活体品牌和研究图谱主结构 |
| Target user and context | 正在评估 Aurelia 可扩展性的创意技术负责人；需要先看懂因果，再判断作品与产品价值 |
| Desired first impression | 一张真实受力的夜雨伞面；雨滴、伞骨、膜面行波和积水是同一系统，而不是水母换皮 |
| Visual ambition | Immersive |
| Experience architecture | Spatial Stage |
| Scene base | Three.js WebGPU + Aurelia VerletPhysics；DOM 承担标题、机制、指标、控制与 fallback |
| Scene persistence | 伞面始终是操作面；所有主控制悬浮在场景前景，不进入下方长页面 |
| Foreground control model | 雨量预设、强度、手动落雨、排水、结构透视、声音、重置；原生按钮和 range 均可键盘操作 |
| State-to-scene mapping | 雨滴命中产生局部凹陷与波环；传播抵达伞骨；积水增加下坠并降低固有频率；排水逐步恢复张力 |
| Mobile transformation | 信息缩成顶部机制轨与底部控制坞；轻触伞面制造冲击；不依赖 hover |
| Fallback | 无 WebGPU 时保留伞面静态示意、四阶段机制、产品价值和可读错误说明；控制不可误导为可运行 |
| Visual constraints | 深蓝黑雨夜；半透明青色膜面；暖黄冲击核；酸绿色结构锚；雨滴必须有深度与速度差，不以全屏 Bloom 掩盖形体 |
| Information constraints | 首屏只展示作品名、四阶段因果、三个实时量和必要控制；技术细节放在可展开说明中 |
| Operation constraints | 指针/触摸命中伞面、按钮和滑杆均能触发可见状态；声音必须由明确用户手势解锁；有重置与排水恢复路径 |
| State constraints | `loading / ready / unsupported`、`drizzle / rain / storm`、`audio locked / playing / muted`、`structure hidden / visible` |
| Environment constraints | Canonical runtime `http://127.0.0.1:4173/rain.html`；桌面 1440×1000、移动 390×844；dark-only；reduced-motion 降低自动雨与相机漂移 |
| Primary journey | 打开样例 → 看见真实雨滴命中 → 点击或触摸伞面制造局部冲击 → 观察波向伞骨传播 → 提高雨量形成积水 → 听到音高变化 → 排水恢复 |
| User-defined phases | 图谱案例顺序推进；本轮交付第一个现实样例“雨落伞面” |
| Required artifacts | `rain.html`、场景/控制/样式、图谱入口、Vite 多入口、研究说明、README、浏览器证据 |
| Autonomy authorization | 用户明确“按样例进行推进”；允许在当前子项目内直接实现并验证可逆的页面与文档变更 |
| User-decision boundary | 真实天气 API、公共部署、外部音乐授权与硬件传感器接入不在本轮范围 |

## 可观察完成标准

1. 首帧能识别伞面、伞骨和雨，而不是抽象生物或纯粒子云。
2. 自动雨和手动命中均产生局部冲击；波环有空间起点、传播时间和衰减。
3. 强降雨使积水量上升、膜面下坠、张力/音高指标变化；排水能逆转该状态。
4. 结构透视明确展示由 Aurelia 求解的节点/弹簧层，不把分析着色冒充物理。
5. 声音只在用户启动后出现；冲击与水量共同改变声学反馈，静音不影响视觉旅程。
6. 桌面与移动无裁切、遮挡或横向溢出；触摸与键盘存在等价路径。
7. reduced-motion、无 WebGPU 与无 JavaScript 路径仍保留核心含义。
8. 生产构建、全部既有入口回归、console/page error 与依赖审计通过。

## 覆盖清单

| 用户阶段 | 要求或产物 | 表面 / 状态 | 证据需要 | 阶段 | 状态 | 下一步 |
| --- | --- | --- | --- | --- | --- | --- |
| 第一样例 | 伞面、伞骨、雨滴形成一个可信视觉主体 | desktop default | 首帧截图、canvas 非空、主体轮廓可辨 | 1/2 | pass | `rain-desktop.png` 显示完整伞面、12 根伞骨、深度雨场和独立前景 UI |
| 第一样例 | 局部冲击沿膜面传播 | auto rain / manual hit | 命中前后截图、事件计数和传播阶段变化 | 5/6 | pass | 自动雨受频率预算；点击/轻触和按钮均增加冲击，阶段在 impact / propagate 间切换 |
| 第一样例 | 积水反向改变结构与声音 | storm / drain / audio | 水量、张力、频率 DOM 与场景变化；排水恢复 | 5/6 | pass | 暴雨 + 14 次重击达到 36% / 68% / 4.9 Hz；排水进入 retune，复位回到约 8–9% / 79% |
| 第一样例 | 可看见 Aurelia 物理层 | structure on/off | 节点/约束计数、结构透视状态与屏幕证据 | 4/5 | pass | 结构透视显示 854 GPU 节点、约 3.3K 约束；压力态证据已保留 |
| 图谱连续性 | 从雨伞案例进入作品并能返回 | atlas/rain navigation | 链接与 HTTP 200 | 3/4 | pass | `#case-rain` 出现“进入可运行样例”；作品顶栏返回同一图谱锚点 |
| 多表面 | 桌面与 390px 移动完成同一旅程 | pointer/touch/keyboard | 无溢出、控制可达、可见焦点、轻触命中 | 7 | pass | 1440×1000 与 390×844 均无横向溢出；轻触命中；Tab 焦点 2px 可见 |
| 降级 | reduced-motion / WebGPU unavailable / no JS | fallback states | 动效降档；语义正文与不可用说明仍存在 | 7/8 | pass | `?motion=reduce` 动画/过渡为 0s；`?fallback=1` 静态伞面、说明和全禁用控制通过；HTML 保留核心正文与 noscript |
| 工程交付 | 新入口不破坏原七入口 | build/routes/audit | 八入口构建、HTTP 200、无阻塞错误、审计结果 | 9 | pass | Vite 八入口构建与 HTTP 200 巡检通过；浏览器无 error/warn；审计 0 vulnerabilities |

## 技术边界

- Aurelia `VerletPhysics` 与 `SpringVisualizer` 负责真实节点、约束与结构响应。
- 膜面着色、雨滴、飞溅、积水高光和声化是围绕同一冲击/湿润状态建立的表达层。
- 本样例证明“离散冲击 → 约束传播 → 状态积累 → 结构再调谐”；不宣称已经实现流体薄膜、精确水滴接触角或真实伞布材料标定。

## R10 浏览器验证记录

- Canonical runtime：`http://127.0.0.1:4173/rain.html`，2026-09-03，Windows Chrome 硬件 WebGPU；桌面 `1440×1000`、移动 `390×844`，dark-only Spatial Stage。
- 默认态：1 个 WebGPU canvas；854 个 GPU 节点（含 1 个隔离 guard）、约 3.3K 约束、150 steps/s；约 4 秒中雨后积水 9%、张力 79%，桌面无横向溢出。
- 因果链：自动雨受事件间隔限制；舞台点击/触摸与“落下一滴”均触发冲击；暴雨叠加 14 次快速重击后为积水 36%、张力 68%、共振 4.9 Hz，UI 进入 `accumulate`。
- 数值边界：作品内 GPU 取样在压力态返回 `FINITE · 853 nodes · max Δ 0.116`；复位后返回 `FINITE · 853 nodes · max Δ 0.017`。位移与速度预算阻止快速输入把膜面推离设计材料范围。
- 声音：用户手势可从 `locked` 进入 `playing`，再次操作进入 `paused`；视觉、排水和结构透视不依赖音频解锁。
- 移动：390px 的 `scrollWidth === innerWidth`；机制轨位于底部控制上方，二者不重叠；键盘焦点为 2px；触摸命中可增加冲击。
- 降级：`?motion=reduce` 的装载动画和机制过渡均为 `0s`；`?fallback=1` 不创建 canvas，显示静态伞面和明确说明，并禁用所有物理控制。
- 最终证据仅保留 4 张：`rain-desktop.png`、`rain-structure-stress.png`、`rain-mobile.png`、`rain-fallback.png`，位于被忽略的 `validation-artifacts/001-aurelia-rain/`。
- Vite 八入口生产构建通过；八条本地路由返回 HTTP 200；最终浏览器 console 无 error/warn；`npm audit --audit-level=high` 为 0 vulnerabilities。现有 WebGPU 共享包仍触发大 chunk 警告，属于已知生产预算项，不影响本轮功能完成。
