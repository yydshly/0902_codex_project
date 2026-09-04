# Windline / 风中的晾衣绳实验

## R19 设计契约

| 项目 | 决策 |
| --- | --- |
| Entry mode | Brief-led；沿 R9 研究图谱顺序，从 `FIELD 01 / 雨落伞面` 推进至 `FIELD 02 / 风中的晾衣绳` |
| Selected pattern | Physics interaction + immersive website；持续 WebGPU 场景承载可读 DOM 控制与因果说明 |
| Evidence branch | Aurelia `VerletPhysics` GPU 弹簧网络、Rain Membrane 已验证的浏览器运行路径、图谱 `#case-clothesline` 的既定机制映射 |
| Required inputs | 不依赖外部模型或真实业务接口；使用程序化绳索、衣物、城市屋顶和合成风场 |
| Expected output | 独立可运行 `clothesline.html`；用户能施加阵风、改变风力/负重/阻尼、查看拓扑并复位 |
| Primary journey | 打开样例 → 识别固定端与三件不同负重织物 → 拖动或点击制造有方向的阵风 → 看扰动沿绳索延迟传播 → 切换结构透视理解 GPU 节点/约束 → 复位 |
| User-defined phases | 保留既有全部页面；本轮只实现第二个现实机制样例，Weatherproof R18 暂停优化 |
| Autonomy authorization | 用户明确“继续下一个场景的实现”；允许在当前子项目内增加可逆页面、入口、样式、脚本与研究记录 |
| Support boundary | 桌面、平板、390px 手机；键盘与触摸等价控制；`prefers-reduced-motion`；WebGPU 不可用时保留完整静态解释和可操作导航 |
| Non-goals | 不宣称精确空气动力学、真实布料材质标定、衣物自碰撞或生产级天气接口；不修改 Weatherproof R18 的业务逻辑 |

## 能力映射

- Rendering stack：Vite + Three.js `WebGPURenderer` + TSL NodeMaterial；WebGPU 负责渲染与 GPU compute。
- Scene assets：程序化屋顶、绳索、夹子、三种织物、风迹与远景灯带；没有外部 GLB 或贴图依赖。
- Motion system：Aurelia `VerletPhysics`；链式绳索、二维布料拓扑、固定端、不同质量权重、方向场、阻尼、地面软碰撞。
- Interaction：在画布上按住拖动直接写入同方向阵风；按钮/Enter/Space 触发阵风；滑杆与预设改变风力、负重、阻尼；方向键改变风向；`0` 复位。
- Visual quality：黄昏屋顶、冷暖逆光、半透明织物、粒子风迹、结构透视和克制 bloom；镜头保持稳定，不与直接操控争夺方向感。
- Publishing path：本轮交付可运行网页与浏览器证据，不输出录屏或影片。
- Risks：WebGPU 兼容性、连续 compute 成本、快速连续阵风的能量积累、窄屏控制密度；分别以静态 fallback、质量分级、速度/位移预算和响应式布局处理。

## 可观察设计方向

| 决策 | 选择 | 可观察约束 | 验收标准 |
| --- | --- | --- | --- |
| 构图 | 一条斜跨画面的英雄绳索，三件织物形成不同面积与下垂 | 首帧无需说明也能读成屋顶晾衣绳 | 固定端、绳、夹子和织物轮廓同时可见 |
| 焦点层级 | 织物运动第一，因果链第二，控制与指标第三 | DOM 不遮挡主体；主按钮只有一个 | 桌面/平板/手机主任务无需滚动即可完成 |
| 色彩与材质 | 深蓝夜幕、铜橙风向、青白结构、三种织物色差 | 不靠颜色单独表达状态 | 结构开关同时改变节点/约束可见性与文字状态 |
| 深度 | 前景织物、中景绳索、远景城市与风迹 | 风向沿景深可读，背景不抢主体 | 初始截图能区分至少三层空间 |
| 运动 | 阵风先命中局部织物，再沿绳延迟传播并逐渐恢复 | 不使用纯装饰性抖动；reduced-motion 降低自动风与镜头漂移 | 触发前后指标、相位与物理形态均变化 |
| 响应式 | 桌面显示完整因果/指标，窄屏保留核心因果条与控制 | 390px 不横向溢出，控制触达不依赖 hover | 390×844 主按钮、预设、结构与复位均可用 |

## 覆盖清单

| User phase | Journey / state | Viewport / input | Evidence | Stage | Status | Next action |
| --- | --- | --- | --- | --- | --- | --- |
| FIELD 02 | 首帧识别晾衣绳主体 | 1280×720 / pointer | 截图、canvas 非空、运行状态 | 5 | pass | `01-desktop.png`；黄昏屋顶、两端固定、共享绳索、三件织物与风迹同屏可见 |
| FIELD 02 | 同方向拖动制造阵风 | 1280×720 / pointer | 手势前后方向、gust 计数、相位与位移 | 6 | pass | 从 `(630,370)` 拖至 `(792,212)` 后 gust `0→1`、phase=`advect`，状态明确为“向右并向上抬升”；`02-drag-gust.png` |
| FIELD 02 | 风力/负重/阻尼改变系统 | desktop / controls | 指标与形态变化、状态文本 | 6 | pass | 滑杆进入 custom；72% 风、150% 负重、82% 阻尼对应 4.6kg 与 281ms；三套预设同步改写四项参数 |
| FIELD 02 | 查看真实 GPU 结构 | desktop / structure toggle | 节点/约束统计与屏幕证据 | 6 | pass | 桌面 386 GPU 节点、1,841 根约束、144 steps/s；`03-structure-squall.png` 显示绳索/布面/夹点拓扑 |
| FIELD 02 | 等价键盘路径 | desktop / keyboard | Tab 焦点、Enter/Space、方向键、0 | 7 | pass | stage 可聚焦；ArrowRight 改方向，Enter 增加 gust 并进入 advect，0 清零并恢复 breeze；焦点环由统一 `:focus-visible` 提供 |
| FIELD 02 | 平板布局 | 1024×768 / pointer | 截图、无裁切/溢出 | 8 | pass | `04-tablet.png`；0px 横向溢出，核心风力、结构与复位可见，运行帧时约 8.57ms |
| FIELD 02 | 手机布局与触摸语义 | 390×844 / touch-sized controls | 截图、主控可达、无横向溢出 | 8 | pass | `05-mobile.png`；233 节点 / 1,040 约束降档，0px 溢出，三枚主按钮均不小于 44px，帧时约 4.88ms |
| FIELD 02 | reduced motion | 1280×720 / query | 自动风降低、语义与手动控制保留 | 8 | pass | `?motion=reduce` 等待 7.2s 仍为 0 个自动 gust；手动按钮增加为 1，因果阶段仍更新 |
| FIELD 02 | WebGPU fallback | 1280×720 / query | 静态主体、错误说明、导航可用 | 8 | pass | `06-fallback.png`；0 canvas、静态主体与明确说明可见；预设同步更新 49km/h / 3.8kg / 279ms，结构按钮禁用，导航可用 |
| 图谱连续性 | 图谱进入样例并返回同一案例 | atlas / clothesline | 链接、URL 锚点、HTTP 200 | 8 | pass | `#case-clothesline` 链接进入 `/clothesline.html`；F02 品牌返回同一 hash，案例保持 `aria-pressed=true` |
| 工程 | 构建、审计、控制台、性能 | production / runtime | build、audit、console、frame time | 8 | pass | Vite 73 modules / 10 HTML entries；audit 0；`git diff --check` 通过；无 warning/error；桌面阵风+结构峰值观察约 11.60ms |

## R19 浏览器校准与实现结论

- Composition：首帧以中部重织物为视觉锚，左右轻/中负重建立节奏；DOM 信息退到四周，不遮挡主要固定端和中央传播区。
- Focal hierarchy：唯一暖色主操作为“释放阵风”；橙色风环标记输入点，青白结构层只在用户主动开启后出现。
- Material / depth：织物动态法线、程序化织纹、夹子、前景绳索、中景屋顶和远景城市灯带形成三层以上景深；风迹速度和方向与同一 wind vector 相连。
- Motion：自动 gust 有频率上限，手动 gesture 进入六槽事件缓冲；reduced-motion 取消自动 gust 并把风迹速度降至 24%，但保留手动因果反馈。
- Numerical boundary：正常手动阵风后的 GPU readback 为 385 个可动节点全部有限，最大相对基形位移 `0.6329`；速度上限 `0.00016`、绳/布不同位移预算与 `y=-2.18` 软碰撞共同保持恢复能力。
- Performance：桌面 386 节点 / 1,841 约束 / 110 条风迹，结构与阵风同时开启时观察帧时约 `11.60ms`；平板约 `8.57ms`；手机 233 节点 / 1,040 约束 / 52 条风迹约 `4.88ms`。
- Production boundary：构建仍共享 `three.webgpu` 约 `716.72kB`（gzip `198.00kB`）大块，Vite 给出既有 chunk warning；本轮未冒充生产级空气动力学或真实布料标定。

最终浏览器证据位于被忽略的 `validation-artifacts/001-aurelia-clothesline/`，共 6 张：桌面、同方向拖动、阵风结构透视、平板、390px 手机、WebGPU fallback。浏览器日志仅包含 Vite 连接与 Aurelia 节点/约束计数，没有 warning 或 error。

## Refinement ledger

| Current stage | User phase | Coverage item | Observed evidence | Root cause / intervention | Adjacent regression surfaces | Observed result | Decision |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 6 Interaction | FIELD 02 | 拖动方向 | 右上拖动后状态为右上抬升，gust 增加 | 将屏幕位移投影到 camera right/up，而不是旋转相机 | 轻点、按钮、键盘、触摸 | 四条路径共享同一 `addGust` 因果入口 | pass |
| 6 State | FIELD 02 | 阻尼语义 | 初版数值越高反而保留更多余振 | 反转 dampening 映射并修正文案 | breeze/cross/squall 与 delay 指标 | 高阻尼现在更快消退，预设方向一致 | pass |
| 8 Fallback | FIELD 02 | 无 WebGPU 预设 | 初版 fallback 改预设但指标仍停留默认值 | 在通用 `setPreset` 同步 DOM 指标 | ready、reset、squall、结构禁用 | fallback 指标与预设一致且无不可用假交互 | pass |
| 8 Responsive | FIELD 02 | 平板/手机控制密度 | 桌面三滑杆在窄屏过密 | 逐级收敛为一条风力滑杆，再在手机保留三枚主按钮 | 1024×768、390×844、触控尺寸 | 无横向溢出，主任务持续可达 | pass |

本轮设计契约内没有 `continue`、`blocked` 或有效 `defer`；FIELD 02 交付闭合。下一样例按图谱顺序为 `FIELD 03 / 地铁人流与拥堵`。

## R20 视觉返工契约

用户在真实页面反馈“效果这么差”，因此 R19 的机制验证仍有效，但所有视觉完成证据作废并重新进入 Stage 2。此次不是局部调色，而是 revision-led 的整体表现返工。

| 项目 | R20 决策 |
| --- | --- |
| Request revision | R20；从“物理机制可运行”提升到“第一眼具有原创风场装置的空间冲击力” |
| Desired first impression | 一条被风拉成空间弧线的发光绳索，三件真正不同轮廓、尺度、材质的织物悬在黄昏屋顶；空气先于说明文字被看见 |
| Visual ambition / architecture | Immersive / Spatial Stage；场景继续承担主任务，DOM 只做克制解释和控制 |
| Asset state | 当前为无外部资产的程序化 L1 原型；目标不是伪装写实商品，而是在程序化路线内达到可公开展示的生成艺术装置质量 |
| Main blocker | 不是 WebGPU 或节点数，而是扁平矩形轮廓、近正交镜头、微弱景深运动、调试环式反馈、低曝光和过大的说明面板共同削弱主体 |
| Selected pattern | Physics interaction + cinematic generative installation；保留 Aurelia 求解器，重做形体、空间、风的显形和因果节奏 |
| Scene revision | 绳索改为前后穿行的空间斜线；织物改为薄纱、宽袖外套、长幡三种轮廓；加入初始褶皱、动态法线、体积风带、双向能量脉冲和锚点回响 |
| Foreground revision | 缩窄因果面板、降低遮罩与 UI 竞争；增强场景曝光和冷暖层次；控制仍保持同一位置和语义 |
| Operation revision | 同方向拖动、参数、结构透视、键盘、fallback 全部保留；阵风反馈从圆形调试圈改为有朝向的开放弧与沿绳双向传播 |
| Autonomy authorization | 用户直接否定现有效果，允许在现有 FIELD 02 内完成整体视觉返工，不等待第二次确认 |
| Support boundary | 仍覆盖 desktop / tablet / 390px / reduced-motion / fallback；不引入外部 GLB、下载资产、后端或真实风洞标定 |

### 浏览器基线（R20 前）

`1280×720`、dark、WebGPU ready：三块近矩形织物正对镜头，默认运动主要进入 Z 轴而难以读取；主体被左侧 422px 文案和右侧 320px 因果面板压缩到中间约 458px；低曝光使动态法线和城市空间几乎消失；自动 gust 的完整圆环像调试准星。运行仍为 386 节点 / 1,841 约束、约 7.58ms，因此问题归类为 composition → focal hierarchy → material/depth → motion，而非性能故障。

### R20 重开覆盖

| User phase | Requirement | Surface / state | Evidence needed | Stage | Status | Next action |
| --- | --- | --- | --- | --- | --- | --- |
| FIELD 02 R20 | 首帧呈现明确英雄装置与空间深度 | 1280×720 / default | 返工前后截图；主体宽度、遮挡、前中后景 | 2 | continue | 重做镜头、绳索路径、形体与曝光 |
| FIELD 02 R20 | 三件织物不再像同一矩形换色 | desktop / default | 三种轮廓、尺度、褶皱与材质可辨 | 2 | continue | 改写程序化拓扑 profile 与 surface shader |
| FIELD 02 R20 | 风和传播无需结构模式也能看见 | drag / gust / settle | 有方向开放风弧、体积风带、沿绳双向脉冲 | 6 | continue | 新增 airflow 与 propagation VFX |
| FIELD 02 R20 | UI 不再压扁主场景 | desktop / tablet | 因果面板缩窄、遮罩减弱、主体不被首屏文字吞没 | 3 | continue | 校准前景尺寸与遮罩 |
| FIELD 02 R20 | 原交互与参数不回归 | pointer / keyboard / presets / structure | 手势同方向、参数状态、结构开关、reset | 5 | continue | 返工后复现原路径 |
| FIELD 02 R20 | 手机仍保留英雄形体与主控 | 390×844 | 手机截图、无溢出、触控按钮 ≥44px | 7 | continue | 重做后检查移动构图 |
| FIELD 02 R20 | reduced-motion / fallback 保义 | query states | 手动因果保留、静态新版轮廓与说明可读 | 8 | continue | 返工后复核两个降级状态 |
| FIELD 02 R20 | 性能和数值仍在预算内 | desktop/mobile/stress | frame time、finite readback、build、console | 8/9 | continue | 视觉完成后测量并构建 |

## R21 素材主导的修订

R20 的“继续程序化造型”假设被用户明确否定。新的资产门槛是：来源明确、许可可商用、专业建模或实物扫描、能进入浏览器运行预算，并且必须真正接入 Aurelia，而不是作为静态背景摆件。

### 资产决策

| 角色 | 最终资产 | 来源 / 许可 | 运行处理 | 决策 |
| --- | --- | --- | --- | --- |
| 英雄服装 | Smithsonian `Feedsack Dress`，100K 网格 / 2K 纹理标准 GLB | Smithsonian 3D API / Open Access / CC0 | 本地 4.70MB；56K+ 顶点绑定到 Aurelia 13×20 代理面 | pass |
| 轻质织物 | Poly Haven `Terlenka` 1K diffuse / normal GL / roughness | Poly Haven / CC0 | 本地约 2.42MB；WebGPU PBR 材质 | pass |
| 重质织物 | Poly Haven `Denim Fabric 02` 1K diffuse / normal GL / roughness | Poly Haven / CC0 | 本地约 3.33MB；WebGPU PBR 材质 | pass |
| 候选现代 T 恤 | GitHub 内含 GLB，但网格元数据指向 Sketchfab，原作者和再许可链不完整 | 仓库 MIT 不足以证明第三方模型权利 | 已从运行目录移出 | reject |
| 候选束腰人台 | Khronos glTF Sample Assets `Corset` | Khronos / CC0 | 授权清晰但与晾衣绳语义不匹配 | reject |

### 绑定原理

1. 加载摄影测量 GLB，保留其 UV、纹理、法线和原始几何细节。
2. 按服装包围盒把每个扫描顶点投影到 Aurelia 服装代理网格，找到相邻四个物理节点并计算双线性权重。
3. 保存“扫描顶点相对代理面的细节偏移”，避免模型被压成一张平面。
4. TSL `positionNode` 每帧从 GPU position storage 读取四个物理节点，按权重混合后再加回高频偏移。
5. 结果是低频形变来自 Aurelia，高频褶皱、厚度和照片纹理来自真实资产；程序不再承担服装造型。

### 返工验证

| Requirement | Evidence | Status |
| --- | --- | --- |
| 真实专业素材可见 | 1280×720 首帧能识别摄影测量连衣裙、Terlenka 与 Denim 三种不同表面 | pass |
| 素材不是静态摆件 | 强阵风下英雄服装随 13×20 代理网格弯折，结构模式可同时看到扫描表面和弹簧笼 | pass |
| 授权链可审计 | `public/assets/clothesline/ASSET_SOURCES.md` 记录对象、官方 API、作者/平台、许可、文件与体积 | pass |
| 数值稳定 | 强阵风 + 结构模式后 GPU readback：全部有限，最大位移约 `1.665`，观察帧时约 `4.2ms` | pass |
| 桌面布局 | 1280×720 无横向溢出；591 GPU 节点 / 约 3.0K 约束 / 144 steps/s | pass |
| 手机布局 | 390×844 无横向溢出；真实服装保持主焦点，主控仍可达，冗长操作说明在窄屏隐藏 | pass |
| 构建 | Vite production build 通过；74 modules / 10 HTML entries | pass |

R21 后，R20 中“程序化 L1 原型继续充当最终素材”“不引入外部资产”两项已被正式废止。保留的程序化部分仅限物理代理、固定端基础设施、风场可视化和无 WebGPU 降级；它们不再冒充服装美术资产。

## R22 风场与指针交互修复契约

用户在真实运行页指出两个可复现故障：有风但衣物缺少持续可读的动态；鼠标除释放瞬间外没有与靠近、按下、拖动相配的反馈。本轮为 localized repair，用户已明确授权直接优化，不引入新的业务形态。

| 项目 | 决策 |
| --- | --- |
| Primary journey | 进入页面后直接看到衣物受持续风场驱动；鼠标靠近出现命中提示，按下后蓄力，拖动过程中风向尾迹与衣物同步响应，释放后形成一次明确传播波 |
| Acceptance | 默认微风下 1 秒内可读出衣摆/侧布位移；拖动未释放时已经产生方向一致的局部受力；释放后只计一次正式阵风；指针反馈不遮挡主体且不会无限创建对象 |
| Affected surfaces | WebGPU 场景力核、pointer 四态、桌面与 390px 触控布局、reduced-motion、fallback 文案与原键盘路径 |
| Boundaries | 保留 Smithsonian / Poly Haven 资产与 Aurelia 求解器；不以模型整体旋转冒充布料动态；不增加相机拖拽；reduced-motion 保留手动因果但削弱持续摆动 |
| Performance budget | 指针 VFX 采用固定数量几何并复用；持续拖动只写一个 GPU 交互场，不在 pointermove 中无限生成 gust 或对象 |

### R22 覆盖清单

| User phase | Requirement | Viewport / input | Evidence | Stage | Status | Next action |
| --- | --- | --- | --- | --- | --- | --- |
| 默认风 | 三件衣物在无操作时持续受风且屏幕方向可读 | desktop / idle | 间隔 GPU 诊断与运行画面 | 6 | pass | 复位后最大位移从 `0.229` 持续变化到 `0.612`，地面接触保持 0 |
| 靠近 | 鼠标进入场景即出现轻量命中反馈 | desktop / hover | 浏览器画面、`data-pointer-phase` | 6 | pass | 开放风标与中心命中点跟随指针，phase=`hover` |
| 按下拖动 | 未释放时尾迹、方向和局部布料同步变化 | desktop / pointer drag | 拖动中截图、状态与形变 | 6 | pass | phase=`drag` 时三股复用尾迹可见，状态明确“释放前衣物就会开始受力”，三件织物同时发生网格形变 |
| 释放 | 形成一次正式阵风并进入传播阶段 | desktop / pointer up | gust 计数、状态、画面 | 6 | pass | reduced-motion 无自动 gust 条件下计数严格 `0→1`，方向为“向右并向上抬升” |
| 相邻回归 | 控件、键盘、结构、手机、reduced-motion、fallback | mixed | 浏览器路径、构建、日志 | 7–9 | pass | 390×844 为 0px 溢出且拖动中尾迹可见；键盘方向/Enter、结构/复位、fallback 均可用；fresh console 无 warning/error；production build 通过 |

### R22 实现与结论

- 持续风不再主要落在镜头难读的 Z 轴：力核增加低频 broad sway、横向/纵向 flutter 和按质量分级的迎风响应，仍受原速度与位移预算约束；reduced-motion 将持续风降到 46%。
- 指针输入被拆成 hover / press / drag / release 四态。拖动期间只更新一个 GPU 局部风场和三条固定 BufferGeometry 尾迹；不分配新对象，也不增加正式 gust 计数。
- 释放继续进入既有六槽阵风传播系统，因此指针连续受力与“沿绳传播”的因果语义没有分叉。
- 强连续拖动后的诊断仍为有限值；复位默认风采样为 `0.229 → 0.612`、0 地面接触，观察帧时约 `4.6–6.3ms`。390px 使用 316 节点 / 1.5K 约束，桌面使用 591 节点 / 2.986K 约束。
- 构建为 74 modules / 10 HTML entries；仅保留既有 Three WebGPU 大 chunk 构建提示。本轮覆盖没有 `continue`、`blocked` 或 `defer`。

## R23 默认衣物摆动可见性修复

R22 的数值与交互路径通过，但用户在真实页面仍无法观察到衣服摆动，因此“默认风下运动可读”证据作废，重新进入 Stage 6。本轮继续保留真实资产、Aurelia 约束、拖动风场、控制和镜头，只修复衣物运动在屏幕上的可见性。

| 项目 | 决策 |
| --- | --- |
| Browser baseline | `http://127.0.0.1:4173/clothesline.html`，1280×720，dark，WebGPU ready；间隔 1.2 秒的两张画面中风迹位移明显，但衣服主体轮廓变化很难在正常观看中辨认 |
| Root cause | 常风大部分形成近似恒定的整体偏转；现有 flutter 幅度小且没有按衣服自由边缘分级，弹簧约束把相邻节点的小幅同向力吸收，导致“GPU 数值变化”没有转化为“屏幕可见摆动” |
| Minimal intervention | 为每个布料节点记录自由边缘权重与衣物相位，在 GPU force kernel 中加入按下摆增幅的低频横摆和较快褶皱波；仍由物理节点驱动真实模型，不移动整个 Mesh |
| Acceptance | 微风预设、无鼠标操作时，1 秒左右即可从衣摆/侧布轮廓看见连续往返运动；三件衣物相位不同；绳索随挂点受力；不触地、不饱和位移预算，拖动、reduced-motion、手机和构建不回归 |
| Authorization | 用户明确指出未见摆动，属于已授权的局部修复，无需再次确认 |

| Coverage item | Evidence | Stage | Status | Next action |
| --- | --- | --- | --- | --- |
| 默认微风的屏幕可见摆动 | 0.76–0.9 秒间隔浏览器画面对比 | 6 | pass | 三件衣物的轮廓与褶皱方向均明显改变，顶部挂点保持固定 |
| 数值与性能边界 | GPU 诊断、frame time、console | 8 | pass | 有限值、最大物理位移 `0.500`、0 地面接触；桌面约 `4.82ms`，fresh console 无 warning/error |
| 相邻输入与视口 | drag、reduce、390px | 7–8 | pass | 拖动中仍为实时同向受力；reduce 5.2 秒无自动 gust；390×844 为 0px 溢出且 0.75 秒对比可见衣摆换向 |

### R23 实现结论

- GPU 物理层新增每个布料节点的 `flex / phase` 数据：越靠近下摆，低频横摆和快速褶皱波越强；围巾、连衣裙、牛仔布使用不同相位，避免三件衣物机械同步。
- 渲染层在物理代理结果上增加同一风向驱动的次级布面变形，顶部权重接近 0、下摆权重逐渐增大。它不是整体旋转 Mesh，因此夹点不漂移，扫描服装仍保留 Aurelia 的大尺度形变。
- 默认微风下约 0.8 秒即可观察到连衣裙下摆左右换向、左右布面轮廓变化；reduced-motion 把该次级变形缩减到 20%。
- 桌面诊断为有限值、最大物理位移 `0.500`、0 地面接触，观察帧时约 `4.82ms`；390px 约 `5.44ms` 且无横向溢出。R23 覆盖已闭合。

## R24 三维视角与风向一致性修复

用户指出两个相连的体验缺口：页面使用 WebGPU 3D，但鼠标拖动只改变风场、相机完全固定，无法建立三维空间感；部分为增强可见性加入的有符号横摆会跨过静止中心，与风迹方向产生相反错觉。

| 项目 | 决策 |
| --- | --- |
| Browser baseline | `http://127.0.0.1:4173/clothesline.html`，782×898，WebGPU ready；拖动后衣物和状态变化，但前后截图相机视角完全一致，`data-camera-yaw` 不存在 |
| Interaction revision | 单指/左键拖动同时执行两件有共同因果的事：受限 3D 环绕观察 + 沿手势方向施加局部阵风；不会变成无关的自由相机 |
| Direction rule | 常风压力只把衣物推向风向，周期只改变偏转强弱；允许局部褶皱小幅回弹，但不能让主体越过静止中心形成反向受风错觉 |
| Camera bounds | yaw 约 ±24°、pitch 约 ±8°；位置和 look-at 分离平滑；释放后保留视角，复位回到英雄构图；reduced-motion 缩小视角幅度和过渡速度 |
| Acceptance | 拖动未释放时 yaw/pitch 数据与画面透视都变化；衣服、风迹和拖动尾迹保持同一世界风向；主体、两端锚点和控制不离开可读区域；手机拖动可用，构建和 console 通过 |
| Authorization | 用户直接要求 3D 拖动并纠正风向，允许在 FIELD 02 当前场景内修正相机与运动语义 |

| Coverage item | Evidence | Stage | Status | Next action |
| --- | --- | --- | --- | --- |
| 3D 拖动视角 | 拖动中/释放后截图、yaw/pitch 数据 | 5 | pass | 782×898 右向拖动后相机由 `0°` 平滑到约 `-20.47°` yaw / `1.64°` pitch，透视和前后遮挡明显改变 |
| 风与衣物一致 | 常风与手势两个方向的画面/状态 | 6 | pass | 主体压力使用与风迹相同的 `windDirection`，周期包络保持正值；拖动状态明确为“阵风向右，衣物沿同一方向受力” |
| 相邻回归 | 782px、1280px、390px、reduce、drag/reset、console/build | 7–9 | pass | 390px 环绕到约 `-23.51°` 且 0px 溢出；reduce 同手势限制为约 `-7.67°`；按钮/键盘 `0` 均复位到 `0°`；fresh console 无 warning/error，构建通过 |

### R24 实现结论

- 相机现在有独立的 yaw / pitch 当前值与目标值，拖动按画布尺寸归一化后写入有界目标，渲染循环用指数阻尼平滑跟随；这是真正的 PerspectiveCamera 环绕，不是移动 DOM 或伪 2D 视差。
- 拖动仍把同一手势投影到 camera right/up，写入局部 GPU 风场。因此一次手势同时完成“换角度观察”和“同方向施风”，没有拆成互相冲突的两套操作。
- 默认限制约 yaw ±24° / pitch ±8°，确保英雄衣物、锚点和控制仍在画面；reduced-motion 把可用幅度降到 34%。释放后保留视角，按钮和键盘 `0` 立即回到正视角。
- 常风摆动从有符号横摆改为正值压力包络：主体始终位于风向一侧，只改变偏转强弱；较小的局部 ripple 负责褶皱回弹。
- 浏览器 GPU 诊断为有限值、最大物理位移 `0.213`、0 地面接触，观察帧时约 `4.17ms`。R24 覆盖已闭合。
