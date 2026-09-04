# Metro Pulse / 地铁人流与拥堵传播实验

## R25 设计契约

| 项目 | 决策 |
| --- | --- |
| Entry mode | Brief-led；按 Field Atlas 顺序从 `FIELD 02 / 风中的晾衣绳` 推进到 `FIELD 03 / 地铁人流与拥堵` |
| Selected pattern | Spatial Stage + physics interaction；3D 网络既是视觉主体，也是选择站点、注入客流和观察回压的操作面 |
| Evidence branch | 图谱 `#case-metro` 的站点节点 / 线路弹簧 / 流量压力 / 拥塞传播模型；Aurelia `VerletPhysics` 与现有 WebGPU 浏览器运行路径 |
| Required inputs | 使用明确标注的合成客流、容量和恢复参数；不依赖真实城市、交通接口或外部模型 |
| Expected output | 独立可运行 `metro.html`；三种运营情景、站点选择/客流注入、拥塞传播、结构透视、3D 环绕与复位均可操作 |
| Primary journey | 打开样例 → 识别多线路换乘网络 → 选择情景 → 点击站点注入客流 → 看压力把站点顶出网络平面并沿线路传播 → 读取瓶颈与恢复指标 → 打开结构层理解 GPU 节点/约束 → 复位 |
| User-defined phases | 保留此前所有演示；本轮只新增第三个现实机制样例及其图谱/导航入口 |
| Autonomy authorization | 用户明确“继续下一个场景”；允许在现有子项目内新增页面、脚本、样式、入口与研究记录 |
| Scene base | Three.js `WebGPURenderer` + TSL + Aurelia GPU compute；可读 DOM 为前景操作层 |
| Scene persistence | 场景在整个主旅程持续可见；指标、因果链和控制不切换到独立文档页 |
| State-to-scene mapping | 平稳=低位冷色节点；积压=节点升高/变暖、流速下降；回压=邻站依次抬升并出现传播环；恢复=高度、颜色和延迟逐渐回落 |
| Mobile transformation | 390px 将完整侧栏压缩为四段因果条与底部主控；站点标签只保留当前瓶颈和选中站；场景持续可见 |
| Fallback | 无 WebGPU 时显示可读的静态多线路网络，预设、指标、解释和导航仍可操作；不伪装实时 GPU 运行 |
| Support boundary | dark-only 艺术装置主题；桌面、平板、390px；pointer/touch/keyboard；`prefers-reduced-motion`；WebGPU capability fallback |
| Non-goals | 不宣称交通预测、真实信号控制、乘客路径规划或生产调度精度；不接真实 API，不用假数据冒充运营事实 |

## 能力映射

- Rendering stack：Vite + Three.js WebGPU + TSL NodeMaterial + selective bloom。
- Scene assets：程序化 3D 站点、弹簧线路、换乘环、客流粒子、压力波和城市基座；本场景的价值来自网络行为，不需要外部美术模型。
- Motion system：Aurelia 自由站点与隐藏记忆锚、线路弹簧、GPU 压力外力；CPU 合成客流模型负责容量、扩散、回压和恢复，状态通过 storage buffer 桥接到 GPU。
- Interaction：hover 识别站点；轻点注入客流；拖动受限环绕；三种运营预设；结构透视；按钮/Enter/Space 注入；方向键切换站点；`0` 复位。
- Visual quality：斜置多层网络、克制的线路色、暖色拥塞、流向粒子、节点高度与阴影共同表达容量压力；不是平面发光地图。
- Publishing path：交付可运行网页、研究说明和浏览器验收；本轮不输出录屏。
- Risks：动态 storage 更新、GPU/CPU 状态语义漂移、粒子分配、窄屏 UI 密度和 WebGPU 兼容性；分别用单一状态源、有限对象池、响应式压缩与静态 fallback 处理。

## 可观察设计方向

| 决策 | 选择 | 可观察约束 | 验收标准 |
| --- | --- | --- | --- |
| 构图 | 城市网络从左下进入、在中央换乘核交叉、向右上展开；节点高度承载压力 | 第一眼先读到“网络与换乘核”，不是控制面板 | 至少三条线路、两个换乘节点和前中后景同时可辨 |
| 焦点层级 | 当前瓶颈节点第一，传播线路第二，因果/指标第三 | DOM 不遮挡中央换乘核；只有一个暖色主操作 | 默认与压力态都能在首屏定位当前问题 |
| 状态语义 | 冷青/紫为线路身份，黄橙/珊瑚只表示容量压力 | 不仅靠颜色：节点高度、环宽、流速和文字同步变化 | 色弱或结构模式下仍能看出拥塞与传播方向 |
| 运动 | 客流持续沿边移动；事件后先局部抬升，再扩散到邻站，最后恢复 | 不用随机闪烁冒充业务变化；reduced-motion 降低连续粒子但保留事件状态 | 一次注入能观察到四个阶段和至少一个相邻站响应 |
| 操作 | 点击负责业务事件，拖动只负责环绕观察 | 点击与拖动必须互斥，避免旋转时误注入 | pointer、touch 和 keyboard 都能完成核心旅程 |
| 响应式 | 桌面完整工作台，平板收敛指标，手机保留情景、注入、结构、复位 | 390px 无横向溢出，按钮不小于 44px | 不滚动即可触发事件并理解当前阶段 |

## 覆盖清单

| User phase | Journey / state | Viewport / input | Evidence | Stage | Status | Next action |
| --- | --- | --- | --- | --- | --- | --- |
| FIELD 03 | 首帧识别 3D 多线路网络 | 1280×720 / default | 实际浏览器画面、canvas、DOM | 1–3 | pass | 15 个站点、4 条线路与中央换乘核首屏可辨，页面无溢出 |
| FIELD 03 | 点击站点注入客流 | desktop / pointer | 选中站、phase、负载与形态前后 | 5–6 | pass | 单击只产生一次事件；站点选择、压力、标签与相位同步变化 |
| FIELD 03 | 拥塞沿线路传播并恢复 | desktop / scenario | 邻站延迟、瓶颈、恢复 ETA | 6 | pass | 中央站由 0.720 升至 1.049，约 1.76 秒后相邻站同步抬升并进入 backflow，随后回落 |
| FIELD 03 | 三种运营情景 | desktop / controls | 通勤、散场、封站差异 | 6 | pass | `commute`、`event`、`closure` 均会重写合成需求、容量、热点与说明 |
| FIELD 03 | 3D 环绕、结构透视、复位 | pointer / keyboard | yaw/pitch、节点/约束、reset | 5–7 | pass | 拖动只改变镜头且不误注入；结构层显示 32 条约束；方向键、Enter/Space、`0` 等价可用 |
| FIELD 03 | 平板与手机 | 1024×768、390×844 | 实际浏览器画面、overflow、touch target | 7 | pass | 390×844 无横向溢出，主按钮高度 75px，72 个流量包保持场景可读与可操作 |
| FIELD 03 | reduced motion | media emulation / manual input | 连续运动削弱、手动事件保留 | 7–8 | pass | 减少连续流动和 GPU 扰动，但注入仍产生压力、相位与峰值变化 |
| FIELD 03 | WebGPU fallback | `?fallback=1` | 静态网络、说明、可用控制 | 8 | pass | 不创建 canvas；显示明确能力边界，情景、指标和注入反馈仍可操作 |
| 图谱连续性 | Atlas ↔ FIELD 03 | links / hash | URL 与选中状态 | 7 | pass | Atlas `#case-metro` 与上一样例均已接入 `metro.html` |
| 工程 | build、console、GPU readback、性能 | production/runtime | build、logs、finite sample、frame ms | 8–9 | pass | production build 与 `git diff --check` 通过；新页面 console 零 warning/error；高压样本全部 finite，约 7.8ms/frame |

## Refinement ledger

| Current stage | User phase | Coverage item | Observed evidence | Root cause / intervention | Adjacent regression surfaces | Observed result | Decision |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 0 Goal lock | FIELD 03 | 设计与交付边界 | 用户要求按既有样例顺序继续 | 以图谱已定义的机制和上一样例交互质量为约束，建立新 Spatial Stage 契约 | 既有页面、导航、fallback | 范围锁定为独立新样例，不改写既有场景 | pass |
| 4 Core build | FIELD 03 | 物理与业务状态耦合 | 单纯程序动画无法表达积压的因果 | 将 CPU 合成客流的压力写入 GPU storage，隐藏锚点高度驱动 Aurelia 自由节点与线路弹簧 | 节点稳定性、情景切换、复位 | 压力既改变指标，也真实改变站点高度、约束和流速 | pass |
| 5 Interaction | FIELD 03 | 点击与拖动互斥 | 初版 pointer 路径可能同时触发选择和注入 | 以移动阈值区分 tap / orbit，并让 hover、选中、注入使用同一 raycast 语义 | mouse、touch、keyboard | 单击事件计数 +1；拖动后事件计数不变且 yaw/pitch 改变 | pass |
| 6 State quality | FIELD 03 | 拥塞传播不是随机闪烁 | 中央站注入后需要可量化的邻接响应 | 采用容量比、邻接扩散、恢复率和线路权重构成单一状态源 | 标签、粒子、压力环、因果链 | 中央峰值先出现，邻站延迟抬升，随后整体恢复 | pass |
| 7 Responsive | FIELD 03 | 390px 核心旅程 | 桌面侧栏无法原样缩放 | 将因果链压成横向四段条，减少标签和粒子，保留情景与四个主控 | 触控命中、画面遮挡、横向溢出 | 无溢出，触控注入和拖动均通过，主控命中区大于 44px | pass |
| 8 Resilience | FIELD 03 | reduced motion 与 WebGPU fallback | 环境能力差异不能变成空白页 | reduced-motion 只减弱连续运动；fallback 用 DOM 静态网络和相同业务状态 | 情景按钮、指标、导航 | 两条降级路径都保留理解与操作，不伪装实时 GPU | pass |
| 9 Hardening | FIELD 03 | 重复事件、启动空引用与对象分配 | 浏览器轮次暴露重复注入、`hoverAt` 初始化时机和逐帧颜色分配 | 收敛事件入口、加入 `scene?.hoverAt` 防护、复用颜色对象与粒子池 | reload、长时间运行、移动端 | 新建干净标签页零 warning/error；150/72 粒子与 18 个压力环稳定复用 | pass |
| 9 Hardening | FIELD 03 | 高压稳定性 | `closure` 连续 5 次注入可能拉爆网络 | 打开结构层并读取 15 个 GPU 站点样本 | GPU readback、约束位移、帧时 | 15/15 finite；最大位移 1.975；峰值压力 1.247；约 7.8ms/frame | pass |

## R25 实现与验收结论

本样例不是一张会发光的地铁图，而是一套“业务状态 → 物理结构 → 人可感知反馈”的最小产品原型：需求和容量先形成站点压力，压力再通过邻接关系扩散，并同步改变 Aurelia 节点高度、线路张力、客流速度、传播环、标签与指标。用户既能从视觉上看到局部事件如何变成系统性影响，也能用结构透视理解背后的节点/约束关系。

- 默认桌面态：15 个站点、4 条线路、32 条 GPU 约束、150 个复用流量包；中央换乘核、瓶颈与传播方向均可辨。
- 定量传播：中央站一次注入由 `0.720 → 1.049`；约 1.76 秒后 `mist 0.557 → 0.638`、`market 0.647 → 0.714`、`academy 0.614 → 0.692`，随后恢复。
- 高压稳定性：封站情景连续注入 5 次后 15 个站点样本全部为有限数，最大结构位移约 `1.975`，峰值压力 `1.247`，实测约 `7.8ms/frame`。
- 交互完整性：鼠标/触控拖动只环绕，轻点只注入；键盘可选择、注入与复位；结构层、三种情景、移动端、减少动态和 fallback 均完成实际浏览器验证。
- 工程边界：全部数据均为演示用合成数据；它证明可视化与业务机制的耦合方式，不代表真实交通预测或调度精度。

本轮覆盖表已无 `continue`、`block` 或 `defer` 项，FIELD 03 可以作为完成样例进入下一阶段。
