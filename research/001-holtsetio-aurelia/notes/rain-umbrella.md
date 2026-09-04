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

## 交互修复契约（R11）

| 字段 | 决策 |
| --- | --- |
| Entry mode | Repair-led；修复 `rain.html` 的三维场景缺少可拖动视角反馈 |
| Request revision | R11：不改变 R10 的伞面视觉、GPU 物理、声场和前景控制，只补齐空间舞台的相机操作 |
| Primary journey | 在空白场景按下并拖动 → 围绕伞面旋转观察 → 松开且不触发雨滴；轻点 → 只触发一次局部冲击；复位 → 返回初始视角 |
| Affected surfaces | 桌面鼠标、移动触摸、键盘；full-motion 与 reduced-motion；WebGPU fallback 保持原行为 |
| Operation constraints | 拖动阈值为 7px；超过阈值进入轨道旋转，未超过阈值在抬起时命中；俯仰限制在安全观察范围；前景按钮与滑杆不劫持手势 |
| State constraints | `camera=idle / dragging / moved`；暴露可检查的 yaw、pitch 和 manual impact 计数；复位恢复默认角度 |
| Autonomy authorization | 用户直接指出“无法拖动”；允许在现有样例内完成交互修复及等价可达性路径 |
| User-decision boundary | 不加入自由飞行、缩放、惯性、第一人称或模型编辑，不改变物理材料参数 |

### R11 可观察完成标准与覆盖

| 要求 | 表面 / 状态 | 证据需要 | 阶段 | 状态 | 下一步 |
| --- | --- | --- | --- | --- | --- |
| 拖动产生可见的三维环绕视角 | desktop pointer | 拖动前后 yaw 与截图变化 | 4/5 | pass | 1440×1000 下 yaw `0.617 → -0.463`、pitch `0.387 → 0.687`，截图显示明显绕行机位 |
| 拖动与落雨手势不冲突 | pointer / touch | 拖动时 manual impacts 不变；轻点时精确 +1 | 5/7 | pass | 桌面和 390px 拖动均为 `manual Δ0`；移动端随后轻触为 `manual Δ1` |
| 键盘具有等价操作 | keyboard | 方向键改变 yaw/pitch；Enter/Space 命中；0/复位恢复角度；焦点可见 | 5/7 | pass | 点击舞台后焦点归于 `#rain-stage`；Right 为 yaw `-0.140`，Enter 为 manual `+1`，0 回到 `0.617 / 0.387` |
| 移动端保留完整旅程 | 390×844 touch | 单指拖动旋转、轻触命中、控制坞可用、无横向溢出 | 7 | pass | yaw `0.588 → 0.048`、pitch `0.402 → 0.577`；轻触 +1；overflow `0` |
| reduced-motion 与 fallback 不回归 | reduced / unsupported | reduced 下仍可手动拖动且无自主漂移；fallback 控制维持禁用 | 7/8 | pass | `?motion=reduce` 动画 `0s` 且拖动 yaw `-0.600`、manual `Δ0`；fallback 无 canvas、全控制禁用 |
| 工程交付闭合 | build/routes/console | build、入口 HTTP 200、console 无 error/warn、依赖审计 | 9 | pass | 八入口构建与 HTTP 200；最终浏览器 0 error/warn；audit 0 vulnerabilities；diff check 通过 |

### R11 基线记录

- Canonical runtime：`http://127.0.0.1:4173/rain.html`，浏览器视口 `598×898`，WebGPU ready。
- 观察：页面呈现真实透视、遮挡、光照与空间雨场，但 body 没有 camera 交互状态；拖动场景只经过既有 pointerdown 命中逻辑，相机仍由微弱指针视差驱动。
- 根因：`rain.js` 在 `pointerdown` 立即调用 `impactAtScreen()`，没有按下—移动—抬起的手势判定；`scene.js` 的 `updateCamera()` 始终回归固定机位，仅叠加约 0.4 单位的视差，不是轨道旋转。
- 最小干预：增加受限球面轨道参数和 7px 拖动阈值；把轻点命中延后到 `pointerup`；补充方向键/Enter/Space/0，并让 DOM 暴露相机与手动命中状态用于验证。
- 相邻回归：自动雨、手动按钮、结构透视、音频、复位、移动控制坞、reduced-motion、WebGPU fallback。

### R11 实现结果

- 相机由固定机位视差改为受限球面轨道：水平可连续环绕，俯仰限制为 `0.16–0.82 rad`，仍以伞面中心为观察目标。
- 同一个 pointer 手势以 7px 判定：超过阈值只旋转；未超过阈值在抬起时只命中一次。pointer capture 保证拖出画布边界仍能完整收尾。
- 桌面显示 grab / grabbing 光标，窄屏保留 `DRAG TO ORBIT · TAP TO IMPACT` 提示；方向键、Enter/Space 和 0 提供键盘等价路径。
- DOM 的 `data-camera`、`data-camera-yaw`、`data-camera-pitch` 与 `data-manual-impacts` 是可复验状态，不参与视觉伪装或物理计算。

### R11 最终验证记录

- 桌面 `1440×1000`：拖动使 yaw `0.617 → -0.463`、pitch `0.387 → 0.687`，`manual impacts Δ0`，无横向溢出；轨道截图为 `rain-orbit-desktop.png`。
- 移动 `390×844`：单指拖动使 yaw `0.588 → 0.048`、pitch `0.402 → 0.577`，`manual impacts Δ0`；随后轻触 `Δ1`，无横向溢出。提示与正文间距 `19.3px`，机制轨与控制坞间距 `8.8px`；证据为 `rain-orbit-mobile.png`。
- 键盘：点击舞台后 `activeElement === #rain-stage` 且焦点轮廓 `2px`；ArrowRight 改变 yaw `-0.140`，Enter 使手动冲击 `+1`，0 恢复默认 `0.617 / 0.387`。
- reduced-motion：CSS 动画 `0s`，手动拖动 yaw 改变 `-0.600` 且没有冲击；无 WebGPU 预览保持 0 canvas、可读错误和全控制禁用。
- 最终默认页在 `1280×720` 为 `runtime=ready / camera=idle / canvas=1 / overflow=0`；浏览器 console 0 error/warn。
- 最终证据目录保留 6 张（R10 的 default / stress / mobile / fallback，R11 的 orbit desktop / mobile），符合空间舞台证据上限。
- Vite 八入口生产构建通过；八条本地路由均为 HTTP 200；`git diff --check` 通过；`npm audit --audit-level=high` 为 0 vulnerabilities。共享 WebGPU 包的大 chunk 警告与 R10 相同，不是本轮交互回归。

## 方向与伞体修复契约（R12）

| 字段 | 决策 |
| --- | --- |
| Entry mode | Repair-led + reference-led；依据用户截图修复拖动方向和伞柄结构，并提升程序化伞架可信度 |
| Request revision | R12：保留 R10–R11 的膜面物理、雨场、声场与控制层；只调整相机手势符号和静态伞架几何/材质 |
| Reference evidence | 截图中低角度可见直杆与独立 C 形圆环断开；伞柄缺少连续握持曲线，伞骨与中棒也缺少下撑连接 |
| Desired first impression | 拖动像抓住作品旋转；低角度看见连续、可握持、有连接逻辑的 J 形伞柄和完整伞架 |
| Primary journey | 向右拖 → 作品随手向右旋转且不落雨 → 降低视角 → 看见连续中棒、套环、下撑骨和 J 形握柄 → 轻点仍只触发一次冲击 |
| Operation constraints | 指针水平手势改为 object-grab 语义；方向键与手势语义一致；保留 7px 阈值、俯仰限制、复位和触摸路径 |
| Asset strategy | 动态膜面继续由代码 + Aurelia 物理生成；伞架为程序化几何；本轮不把 2D 生成图伪装成可交互 3D，也不引入来源与拓扑未验证的 AI 网格 |
| Visual constraints | 握柄必须是一条连续空间曲线；杆身、套环、握把材质分层；补充 12 根下撑骨，但不得遮蔽膜面传播或明显增加移动端负担 |
| User-decision boundary | 高精度外部 GLB、AI 生成 3D 资产、贴图授权和物理拓扑重绑定属于后续独立资产阶段，本轮先完成可验证的程序化改良 |
| Autonomy authorization | 用户明确提出“能否优化”并指出伞柄问题，允许在当前样例内实施可逆修复 |

### R12 覆盖清单

| 要求 | 表面 / 状态 | 证据需要 | 阶段 | 状态 | 下一步 |
| --- | --- | --- | --- | --- | --- |
| 拖动方向符合抓取直觉 | desktop / touch / keyboard | 向右拖 yaw 正向变化；拖动 manual Δ0；键盘方向一致 | 4/5/7 | pass | 桌面向右拖 yaw `Δ+0.510`，移动 `Δ+0.540`，两者 manual `Δ0`；ArrowRight `Δ+0.140` |
| 伞柄连续且连接正确 | low-angle desktop | 截图可见杆身到握把无断点、末端不开裂 | 2/5 | pass | `1440×1000` 与最终 `1280×720` 低角度均显示连续 J 形握把与封闭端帽 |
| 伞架结构更可信 | default / low-angle | 中棒套环与 12 根下撑骨可辨，仍不遮蔽膜面主体 | 2/5 | pass | `frameParts=12/12/1`；结构透视仍显示真实 GPU 膜面，静态伞架未取代物理解算 |
| 移动与性能不回归 | 390×844 / default | 无溢出、拖动可用、渲染规模增量可控、console 无错误 | 7/8 | pass | 390px overflow `0`、轻触 `Δ1`、console 0 error/warn；程序化伞架 13,080 triangles |
| 降级和工程闭合 | fallback / build / routes / audit | fallback 可读；八入口构建与 200；audit、diff check | 8/9 | pass | fallback 0 canvas / 全控制禁用；八入口 build 与 HTTP 200；audit 0；diff check 通过 |

### R12 基线记录

- Canonical runtime：`http://127.0.0.1:4173/rain.html`，硬件 WebGPU，`1280×720`，dark-only Spatial Stage。
- 向右拖约 85px：yaw `0.617 → 0.107`（`Δ-0.510`），manual impacts `Δ0`；说明手势分流正确，但水平符号与用户的 object-grab 心智相反。
- 当前伞架由 12 根 TubeGeometry 主伞骨、圆周边条、独立 Cylinder 中棒和部分 Torus 握把组成。截图中的断裂不是物理模拟错误，而是独立圆环的弧端、旋转和平面投影共同造成的结构错误。
- 既有默认机位、膜面、物理节点、自动雨和控制层保持通过；它们是本轮相邻回归面。

### R12 实现与资产决策

- 水平拖动由 orbit-camera 符号改为 object-grab 符号；向右拖和 ArrowRight 现在都使 yaw 正向增加。7px 阈值、pointer capture 与轻点命中逻辑不变。
- 原 `Cylinder + partial Torus` 被一条 96 段连续 Catmull–Rom 中棒曲线取代；J 形区再叠加独立握把材质和末端球形封帽，因此不存在几何断口。
- 新增 runner、collar 和 12 根 QuadraticBezier 下撑骨；主伞骨、边条、支撑和握把合计约 13,080 triangles，不改变 Aurelia 的 854 个 GPU 节点与约 3.3K 物理约束。
- 首次复查发现握把曲面虽然连续，但弯曲平面与测试镜头近似共线，投影仍像直杆；第二次把握把平面旋转到默认镜头横轴并增加漆面/金属材质差异，低角度轮廓才通过。

| 资产层 | 当前表示 | 原因 | 大模型适用方式 |
| --- | --- | --- | --- |
| 动态伞布 | 程序化网格 + Aurelia GPU Verlet | 必须与冲击、积水、张力和节点约束共享拓扑 | 可生成造型参考或材质图，不能用单张图替代可变形网格 |
| 伞骨 / 中棒 / 握把 | 程序化 Three.js 几何 | 连接、尺度、碰撞、移动预算和结构透视可控 | 后续可用生成式 3D/图生 3D 产出候选 GLB，但需清理拓扑、统一尺度、拆材质并重新绑定 |
| 夜雨氛围 | 程序化雨滴、灯光、后处理 | 与雨量和物理事件实时同步 | 可用生成图作为色彩、材质和构图概念板，不直接作为交互碰撞面 |
| UI / 说明 | 语义 DOM | 键盘、fallback 和可读性必须独立于 3D | 可辅助图形资产，但不能把文字和控制烘焙进图片 |

本轮没有把 AI 生成图或未清理网格放进运行时；资产 provenance 为 `procedural-r12`。推荐的下一资产阶段是“生成概念多视图 → 选定一个伞架外观 → 规范化 GLB 静态硬件 → 保留当前动态膜面”，而不是把整张 AI 图片贴到画布上冒充 3D。

### R12 最终验证记录

- `1280×720` 桌面：向右拖 yaw `0.617 → 1.127`（`Δ+0.510`），拖动 manual `Δ0`；最终交付复验为 `Δ+0.480`。低视角 pitch `0.160` 显示连续中棒、J 形握把和封闭端帽，console 0 error/warn。
- `1440×1000` 视觉：低视角截图确认握把轮廓不再退化为直杆；结构透视保留 854 个 GPU 节点与约 3.3K 约束。14 次手动冲击后达到积水 29%、张力 71%、5.1 Hz，静态伞架改造未破坏物理压力态。
- `390×844` 移动：向右拖 yaw `0.588 → 1.128`（`Δ+0.540`）、manual `Δ0`；随后轻触 `Δ1`；ArrowRight `Δ+0.140`，Enter `Δ1`，0 恢复 `0.588 / 0.402`；overflow `0`，console 0 error/warn。
- reduced-motion：动画 `0s`，向右拖 yaw `Δ+0.480`、manual `Δ0`；fallback 为 0 canvas、可读错误、全物理控制禁用、overflow `0`。
- 运行时资产证据：`frameProfile=procedural-r12`、`frameParts=12/12/1`、`frameTriangles=13080`。证据目录中的六张最终截图已经全部更新为 R12 几何。
- Vite 八入口生产构建通过；八条本地路由全部 HTTP 200；`git diff --check` 通过；`npm audit --audit-level=high` 为 0 vulnerabilities。仅保留既有 WebGPU 共享包 chunk 警告。

## 纵向抓取修复契约（R13）

| 字段 | 决策 |
| --- | --- |
| Entry mode | Repair-led；修复 R12 仍保留的纵向 camera-orbit 手势符号，并继续收敛操作质感 |
| Request revision | R13：横向 object-grab 已通过，保留；只反转纵向符号、降低俯仰灵敏度、提高拖动跟随，并把握把从高发光绿色收敛为湿润深色漆面 |
| Observed evidence | `1280×720` 默认 pitch `0.387`；向上拖 80px 后 pitch `0.787`（`Δ+0.400`），伞面视觉向下滑，manual `Δ0` |
| Primary journey | 向上拖 → 固定伞面特征在屏幕上向上跟随、pitch 下降 → 松开不落雨；向下拖反向；方向键上下与手势一致 |
| Operation constraints | object-grab 语义同时覆盖 X/Y；纵向灵敏度由 `0.005` 降为 `0.0032`；拖动跟随系数提高，仍保留 `0.16–0.82 rad` 安全边界和 reduced-motion |
| Visual constraints | 握把保持可辨但不成为荧光视觉焦点；不改膜面拓扑、物理参数、雨量与前景布局 |
| Autonomy authorization | 用户再次明确指出纵向反向并要求继续优化，允许完成局部交互与材质修复 |
| User-decision boundary | 不在本轮切换成旋转整个物理世界、不加入自由平移/缩放或外部 3D 资产 |

### R13 覆盖清单

| 要求 | 表面 / 状态 | 证据需要 | 阶段 | 状态 | 下一步 |
| --- | --- | --- | --- | --- | --- |
| 上下拖动与作品同向 | desktop pointer | 向上拖 pitch 负向变化、manual Δ0、截图运动方向可读 | 4/5 | pass | 上拖 `0.387 → 0.160`（`Δ-0.227`），下拖 `0.387 → 0.643`（`Δ+0.256`），均 manual `Δ0` |
| 键盘上下方向一致 | keyboard | ArrowUp pitch 负向、ArrowDown 正向、0 复位 | 5/7 | pass | ArrowUp `Δ-0.080`，ArrowDown `Δ+0.080`，0 恢复 `0.387 / 0.617` |
| 移动端同向且控件无回归 | 390×844 touch | 上拖 pitch 负向、轻触 +1、overflow 0 | 7 | pass | 上拖 `0.402 → 0.160`（`Δ-0.242`）、manual `Δ0`；伞面内轻触 `Δ1`；overflow `0` |
| 操作与材质进一步收敛 | desktop / low angle | 抓取延迟降低；握把仍可辨且不抢主视觉 | 2/5/8 | pass | 拖动跟随系数 `18 → 30`；握把自发光 `0.32 → 0.20`，低角度轮廓仍清晰且视觉焦点回到伞面 |
| 降级与工程闭合 | reduced / fallback / build | reduced 手动拖动；fallback；build/routes/audit/console | 7/8/9 | pass | reduced 与 fallback 均通过；八入口 build / HTTP 200；audit 0；diff check 与 console 终审通过 |

### R13 实现结果

- 根因不是物体真的在平移，而是轨道相机的纵向符号仍按“移动观察者”解释：向上拖抬高相机，固定伞面特征因此向屏幕下方移动。R13 将 `targetPitch -= deltaY × 0.005` 改为 `targetPitch += deltaY × 0.0032`，从视觉上模拟抓住物体同向转动。
- 纵向灵敏度降低 36%，交互中的相机平滑系数从 18 提高到 30；前者避免短拖越过过大俯仰，后者减少拖动目标与实际镜头之间的尾随。
- ArrowUp / ArrowDown 与指针方向同步反转。横向 R12 符号、7px 拖动阈值、点击命中、复位和俯仰安全限制保持不变。
- 握把材质从高亮酸绿调整为低自发光的深瓶绿湿漆，保留清漆高光和 J 形轮廓，但不再与暖色冲击核争夺视觉焦点。

### R13 最终验证记录

- `1280×720` 桌面：向上拖 80px，pitch `0.387 → 0.160`（`Δ-0.227`）；向下拖 80px，pitch `0.387 → 0.643`（`Δ+0.256`）；两次拖动均为 manual impacts `Δ0`。最终证据为 `rain-desktop.png` 与 `rain-orbit-desktop.png`。
- 键盘：ArrowUp 为 `Δ-0.080`，ArrowDown 为 `Δ+0.080`，0 恢复 pitch `0.387` / yaw `0.617`；与指针的 object-grab 语义一致。
- `390×844` 移动：向上拖 pitch `0.402 → 0.160`（`Δ-0.242`）、manual `Δ0`；在变换后的伞面范围内轻触精确 `Δ1`，横向 overflow `0`。
- reduced-motion：CSS 动画 `0s`，向上拖 pitch `0.387 → 0.160`、manual `Δ0`；fallback 仍为 0 canvas、可读错误和全控制禁用，console 0 error/warn。
- 结构压力态：结构透视开启并连续 14 次手动冲击后，积水 34%、张力 69%、共振 5.0 Hz；新握把材质没有遮蔽膜面约束和压力反馈。
- Vite 八入口生产构建通过；八条本地路由全部 HTTP 200；`npm audit --audit-level=high` 为 0 vulnerabilities；`git diff --check` 通过。仅保留既有 WebGPU 共享包 chunk 体积警告。

## 因果链稳定性修复契约（R14）

| 字段 | 决策 |
| --- | --- |
| Entry mode | Repair-led + reference-led；依据用户截图修复右上因果链卡片持续跳动和闪烁 |
| Request revision | R14：保留伞面、雨场、相机、指标和控制层；只重构因果阶段的展示节奏与活动行反馈 |
| Browser baseline | `http://127.0.0.1:4173/rain.html`，WebGPU ready，`1280×720`，中雨默认态 |
| Observed evidence | 24 次、80ms 间隔采样中出现 14 次 `impact ↔ propagate` 切换；活动行 X 坐标约 `938.11–942.11px`；亮线 opacity 由无限动画持续变化 |
| Root cause | 自动雨约每 0.28s 产生一次冲击并重置 youngest impact；UI 每 100ms 直接映射原始阶段，同时活动行使用位移过渡和 600ms 无限闪烁 |
| Primary journey | 稳态雨中因果链保持稳定；用户主动落雨时只依次显示 IMPACT → PROPAGATE → ACCUMULATE；排水时稳定进入 RETUNE |
| Visual constraints | 行文本和编号位置固定；右侧阶段线可做一次性平滑状态过渡，但不得循环闪烁；保留当前暗色仪器界面层级 |
| State constraints | 自动雨不再抢占人为事件的叙事阶段；手动冲击和排水仍应立即产生可读反馈；reduced-motion 无动画 |
| Autonomy authorization | 用户明确要求继续优化并询问闪烁原因，允许在当前样例内直接修复 |
| User-decision boundary | 不改变物理求解、雨滴生成频率、声场或整体布局，不扩展为新的可视化方向 |

### R14 覆盖清单

| 要求 | 表面 / 状态 | 证据需要 | 阶段 | 状态 | 下一步 |
| --- | --- | --- | --- | --- | --- |
| 默认中雨不再跳变或闪烁 | desktop default | 2s 高频采样 phase 稳定、活动行 X 固定、无无限 animation | 5/6 | pass | 24 次采样只出现 `accumulate`，0 次切换；X 恒为 `942.11px`，transform / animation 均为 `none` |
| 手动因果链仍然完整 | manual impact / drain | 主动落雨依次进入 impact、propagate、accumulate；排水进入 retune | 5/6 | pass | 真实按钮路径依次观察到 `impact → propagate → accumulate`；排水后为 `retune` |
| 移动端与 reduced-motion 不回归 | 390×844 / reduced | 无溢出、活动项可辨、无循环动画 | 7/8 | pass | 移动端默认 0 次切换、overflow `0`、手动落雨进入 impact；reduced-motion 所有阶段动画与过渡均为 `0s / none` |
| 工程交付闭合 | build/routes/console | build、入口 HTTP 200、console、audit、diff check | 9 | pass | 八入口 build / HTTP 200；console 0 error/warn；audit 0 vulnerabilities；diff check 通过 |

### R14 实现结果

- 因果阶段不再读取连续自动雨的 youngest impact。默认持续降雨稳定表现为 `ACCUMULATE`；只有用户主动落雨才启动 0.42s `IMPACT` 和随后至 1.5s 的 `PROPAGATE`，之后回到 `ACCUMULATE`；排水或高湿载荷进入 `RETUNE`。
- 活动行取消 `translateX(-0.25rem)`，因此编号、文字和右侧阶段线不再横向往返。原 600ms 无限 `causal-pulse` 被替换为仅在阶段真正改变时执行的一次性 scale/opacity 过渡。
- DOM 只在阶段变化时写入 `data-phase`，指标文字和 draining 状态也只在格式化结果真正改变时写入，避免每 100ms 对相同内容重复触发布局与样式计算；当前阶段同时以 `aria-current="step"` 暴露给辅助技术。
- 物理冲击频率、雨滴、膜面求解、声场、指标数值和空间布局均未改变；修复只影响因果叙事的节奏与展示反馈。

### R14 最终验证记录

- 修复前：24 次、80ms 间隔采样中出现 14 次 `impact ↔ propagate` 切换；活动行 X 在约 `938.11–942.11px` 之间变化，并运行 600ms 无限亮度脉冲。
- 修复后桌面：同样 24 次采样只有 `accumulate`，切换 0 次；活动行 X 恒为 `942.11px`，transform `none`，animation `none`，稳定亮线 opacity `0.82`。
- 手动路径：默认 `accumulate`；点击“落下一滴”后为 `impact / manual +1`，约 0.63s 为 `propagate`，约 1.68s 回到 `accumulate`；点击排水后为 `retune`。
- `390×844` 移动端：16 次采样保持 `accumulate`、X 恒定、transform / animation `none`、overflow `0`；手动落雨进入 `impact / manual +1`。
- reduced-motion：runtime ready，阶段稳定，四行 animation `none`、transition duration `0s`；fallback 为 0 canvas、全部控件禁用、overflow `0`。
- 结构压力态：结构透视 + 14 次冲击后为积水 29%、张力 71%、5.1 Hz，阶段最终稳定回到 `accumulate`，说明展示节流没有改变物理累积。
- 最终默认页 `runtime=ready / canvas=1 / overflow=0`，活动阶段唯一且带 `aria-current=step`；浏览器 console 0 error/warn。六张既有 Rain 最终证据已原位更新，没有增加仓库截图数量。
- Vite 八入口生产构建通过；八条本地路由全部 HTTP 200；`npm audit --audit-level=high` 为 0 vulnerabilities；`git diff --check` 通过。仍只有既有 WebGPU 共享包 chunk 体积警告。

## 雨幕材质与冲击表现扩展契约（R15）

| 字段 | 决策 |
| --- | --- |
| Entry mode | Revision-led + brief-led；用户确认从界面稳定性转向画面本体优化 |
| Request revision | R15：保留 R10–R14 的物理、抓取交互、稳定因果链和程序化伞架；增强冲击、水流、湿润材质和张力褶皱 |
| Target user and context | 在桌面或移动端观察并主动敲击雨伞的创意技术研究者，需要从视觉上读出接触、传播、积累和再调谐 |
| Desired first impression | 雨滴真正“撞”在张紧湿膜上：先有集中接触，再有双层波前和水冠，随后水沿分片向低处迁移；伞布不是平滑圆盘而有受伞骨约束的瓣状张力 |
| Visual ambition | Immersive |
| Experience architecture | Spatial Stage；WebGPU 场景持续可见，现有 DOM 控制与因果链保持前景层 |
| Scene persistence | 点击、拖动、排水、结构透视和音频过程中均保持；仅 WebGPU fallback 让位于可读说明 |
| Foreground control model | 保留导航、因果链、指标和底部控制坞，不新增面板 |
| State-to-scene mapping | impact=接触闪光/水冠；propagate=双层波前；accumulate=径向细流/湿润高光；retune=积水减少、材质回干 |
| Mobile transformation | 保留 390px 紧凑叠层；VFX 使用更小对象池和更少径流路径，不改变操作布局 |
| Fallback | 无 WebGPU 时保留语义说明和禁用控件，不伪造画布效果 |
| Visual constraints | 冷青表示水与波，暖色只用于手动接触核心；不得覆盖标题、因果链和底部控件；避免全屏闪光与高频抖动 |
| Operation constraints | 拖动/轻点分流、方向键、Enter、0、排水、结构和雨琴行为不变 |
| Performance constraints | 所有短效使用对象池；不在帧循环中创建几何或材质；桌面/移动冲击池有明确上限；reduced-motion 降低数量和位移 |
| Autonomy authorization | 用户回复“确定”，确认按上一轮提出的画面本体方向继续实施 |
| User-decision boundary | 不引入外部 GLB、生成式 3D、HDRI、真实天气服务或新音乐资产；不改科学参数含义 |

### R15 VFX 规格

| 效果 | 触发 / owner | 时长 | 物理意义 | 远距轮廓与色彩 | 上限 / 清理 | reduced-motion |
| --- | --- | --- | --- | --- | --- | --- |
| 接触核 | 每次膜面命中 / impact slot | 约 0.26s | 雨滴动量集中进入膜面 | 小而亮的暖色圆盘，自动雨降低强度 | 复用 16 个波组；到期隐藏 | 降低亮度与扩张 |
| 双层波前 | 命中后 / wave pool | 约 1.18s | 主波与稍滞后的回波沿膜传播 | 青色主环 + 暖/青细回波，不遮挡主体 | 16 组固定池；到期隐藏 | 缩短半径、取消明显回波延迟 |
| 水冠飞溅 | 命中后 / splash pool | 0.24–0.54s | 局部反弹与水滴分离 | 细长青白水滴形成向上水冠 | 桌面 90 / 移动 42；实例复用并归零 | 数量减半、速度降低 |
| 径向细流 | 湿载荷超过阈值 / canopy | 持续 | 水沿伞面坡度迁移 | 低亮度青色细线与沿线移动的高光珠 | 桌面 12 / 移动 6 条；固定几何和实例 | 保留静态细流，停止移动珠 |
| 湿润膜面 | wetness / membrane | 持续 | 吸水后表面更平滑、反射更集中 | 粗糙度下降、清漆高光增强，颜色仍由现有湿度节点控制 | 单材质属性更新 | 保留静态湿度状态 |

### R15 覆盖清单

| 要求 | 表面 / 状态 | 证据需要 | 阶段 | 状态 | 下一步 |
| --- | --- | --- | --- | --- | --- |
| 手动冲击有清晰接触、传播和飞溅层次 | desktop default / manual | 冲击前后截图；池上限；快速重复后清理 | 2/5/6 | pass | 暖色接触核、青色主环、暖色回波和定向水冠在真实点击后可辨；固定池 `16/90`，复位后只剩自动雨基线 `1/2` |
| 积水能被看见为迁移而不只是百分比 | default / stress / drain | 径流路径与移动珠随湿度出现，排水后衰减 | 2/6 | pass | 29% 积水时径流 opacity `0.10`；排水至 3% 后为 `0.00`，高光珠同步隐藏 |
| 伞布具有伞骨约束下的瓣状褶皱和湿润材质 | desktop / low angle | 默认与低视角截图；材质数值随 wetness 变化 | 2/5 | pass | 12 分片 panel sag 写入基形；膜面 roughness 在 29% 积水时为 `0.21`，排水至 3% 后恢复 `0.40` |
| 交互与稳定因果链不回归 | pointer / keyboard / UI phase | 拖动 manual Δ0；轻点 Δ1；阶段稳定并按主动事件推进 | 5/6 | pass | 右上拖 yaw `Δ+0.360` / pitch `Δ-0.192` / manual `Δ0`；轻点 `Δ1`；默认 18 次采样 0 阶段切换 |
| 移动、reduced-motion、fallback 与性能预算 | 390×844 / reduce / unsupported | 对象池上限、无溢出、动画替代、console 和短时帧观察 | 7/8 | pass | 移动池 `16/42/6/6`、manual contact `4 waves / 13 splashes`、overflow `0`；reduced manual 6 splashes；fallback 0 canvas |
| 工程交付闭合 | build/routes/audit/docs | build、八入口 200、audit、diff check、六张证据更新 | 9 | pass | 最终 build、八入口 200、audit 0、diff check、console 终审通过；六张既有证据原位更新 |

### R15 实现结果

- 程序化冠面新增 12 分片 panel sag：伞骨方向维持张力冠脊，骨间膜面产生更深的瓣状下垂；固定锚、GPU 节点数和弹簧拓扑保持不变。
- 16 组波前对象池由单环扩为接触核、主波和回波三层。自动雨使用低强度冷色，用户手动冲击使用暖色接触核、青色主环和暖色回波，避免持续雨场变成高亮噪声。
- 飞溅从 9 个各向同性四面体升级为桌面最多 18 个、移动最多 12 个、reduced-motion 6 个的低面数水滴实例；水滴长轴实时对齐弹道速度，形成可读水冠。总池仍固定为桌面 90 / 移动 42，reset 会幂等清除活动短效。
- 新增桌面 12 / 移动 6 条固定预算径流曲线和同数量高光珠。它们只在 wetness 超过阈值时可见，正常模式沿坡度迁移，reduced-motion 保留静态位置。
- 膜面 roughness、clearcoat、clearcoatRoughness 和 iridescence 随 wetness 联动；排水不仅改变数值和声音，也让细流消退、镜面高光重新变粗糙。
- 所有短效复用预分配几何、材质和实例；帧循环没有新增几何或材质分配。径流不可见时整个路径和高光实例停止提交绘制。

### R15 最终验证记录

- 桌面手动冲击 70ms：活动状态约为 `4 waves / 21 splashes`，暖色接触核和向上水冠可辨；约 320ms 后双层波前占主导，约 680ms 继续传播并衰减。
- 快速重复 20 次真实按钮操作后，活动数仍受 `16 waves / 90 splashes` 固定池约束；1.7s 后回落到自动雨基线附近。6 次冲击后立即复位，从 `8/22` 清理到 `1/2`，manual 归零。
- 14 次手动冲击后为积水 29%、张力 71%、5.1 Hz，径流/roughness 为 `0.10/0.21`；排水 1.8s 后为 3%、`0.00/0.40`，阶段进入 `retune`。
- GPU 诊断为 `FINITE · 853 nodes`，max Δ `0.096`；当前机器湿载荷场景的平滑帧时间约 `4.2ms`，累计渲染统计折算约 `14.0 avg draws/frame`。这是本机观测值，不代表跨设备基准。
- `1280×720` 拖动回归：yaw `0.617 → 0.977`、pitch `0.387 → 0.195`、manual `Δ0`；随后膜面轻点 manual `Δ1`，ArrowUp 到安全边界 `0.160`。
- `390×844`：对象池为 `16/42/6/6`，默认 active `3/2`；手动冲击 active `4/13`、manual `Δ1`、overflow `0`。reduced-motion 下手动冲击最多观察到 6 个飞溅，径流珠停止迁移。
- fallback 为 `runtime=unsupported / canvas=0 / controls disabled / overflow=0`；R14 默认因果链 18 次采样仍只有 `accumulate`，切换 0 次。
- 六张 Rain 最终证据已原位替换：desktop default、desktop orbit/contact、mobile default、mobile orbit/contact、structure stress/wet 和 fallback。
