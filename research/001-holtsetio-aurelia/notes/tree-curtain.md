# Veil of Light / 树影与窗帘实验

## R27 设计契约

| 项目 | 决策 |
| --- | --- |
| Entry mode | Brief-led continuation；用户要求按既定现实样例序列继续 FIELD 05 |
| Target user and context | 空间、品牌与交互设计师；需要体验风、材料、遮挡、光和声音如何形成一个环境系统 |
| Desired first impression | 进入一间安静、真实有尺度的日光房；先看到会呼吸的亚麻帘和树影，再发现物理与声音控制 |
| Visual ambition | Immersive；暖白石灰墙、天然亚麻、灰绿树影和低饱和夕照，不复用暗色科技展板或宣纸书法布局 |
| Experience architecture | Spatial Stage；室内空间持续占据首屏，所有主操作直接改变窗帘、光影和声场 |
| Selected pattern | Physics interaction + environmental product scene；Aurelia 求解双幅帘布，动态投影纹理承担树影，Web Audio 承担可解锁的空间风声 |
| Evidence branch | 图谱 `#case-curtain` 的布料拓扑 / 风场 / 遮挡几何 / 光照投影 / 空间音频；Windline 已验证的 Aurelia cloth storage binding |
| Required inputs | 风强、开合、透光率、太阳时间、pointer proximity、drag wake、一次用户手势解锁音频 |
| Expected output | 独立 `curtain.html`；双幅动态窗帘、树影投影、时间/风/开合/透光控制、环境预设、空间声音、结构透视、复位、指标、移动端和 fallback |
| Primary journey | 进入房间 → 移近窗帘观察局部避让 → 拖动扫过形成同向风痕 → 改变风/开合/光照 → 解锁空间声音 → 打开结构层理解因果 → 复位 |
| User-defined phases | 保留 FIELD 01–04；本轮完成 FIELD 05，并继续坚持“每个自然机制拥有自己的视觉语言” |
| Autonomy authorization | 用户明确“继续”；允许新增本场景及必要入口、文档与验证记录，不引入真实业务服务 |
| Scene base | Three.js `WebGPURenderer` + Aurelia GPU Verlet 双帘布 + 动态 CanvasTexture 树影 + DOM 可读控制 |
| Scene persistence | 空间贯穿整个主旅程；解释与工具浮于场景边缘，不切成长文档页 |
| Foreground control model | pointer proximity 为默认主交互；拖动为空气扫动；三种日照预设和四项环境工具为次级控制 |
| State-to-scene mapping | still=帘布缓慢呼吸；near=局部鼓起/树影变形；wake=同向扫风；settle=阻尼恢复；sun=色温/影长；audio=风与室内共鸣交叉淡化 |
| Mobile transformation | 390px 保留全高窗景；标题和预设置顶，指标压为窄条，工具转为底部横向可滚动材料托盘 |
| Fallback | `?fallback=1` 或无 WebGPU 时显示可操作的 CSS/Canvas 双帘与动态树影；说明 GPU 拓扑未运行，环境控制与音频仍可用 |
| Support boundary | 单一暖色主题；桌面、平板、390px；mouse/touch/keyboard；`prefers-reduced-motion`；WebGPU capability fallback |
| Non-goals | 不声称真实建筑日照分析、声学仿真或医疗疗愈效果；不把程序化房间/树枝冒充真实商品资产 |

## R28 素材质量修订

用户指出首版“效果太差、看起来都是代码生成素材”。浏览器证据确认根因不在 Aurelia 布料，而在环境层：中央圆柱树枝、圆片叶群、BoxGeometry 长凳、渐变窗景和程序绘制树影共同暴露了技术样机感。本轮保留经过验证的 GPU 帘布和交互链，重新打开视觉、资产、fallback、移动端与性能覆盖。

| Revision requirement | Decision | Status |
| --- | --- | --- |
| 环境不再由粗糙程序几何承担 | 使用摄影级建筑环境底片，删除墙、窗框、家具、树枝与叶片 primitive | pass |
| 树影不再由曲线和椭圆绘制 | 使用独立摄影质感树影 gobo，运行时只做裁切、漂移和密度混合 | pass |
| 物理真实性不退化 | Aurelia 双帘节点、约束、局部场、结构层和 GPU 诊断全部保留 | pass |
| 资产诚实可追溯 | 区分生成 2D、CC0 扫描与程序化物理层，新增 provenance 清单 | pass |
| WebGPU / mobile / fallback 都需复核 | 1280×720、390×844、`?fallback=1` 重新截图并检查日志/溢出 | pass |

## R29 动态与帘形修订

Entry mode 为 revision-led repair。用户指出 R28 虽提升了单帧素材，但树仍被读成静态照片，窗帘打开后的轮廓也不像真实垂帘。继续授权来自当前明确反馈；范围限定为 FIELD 05 的窗外动态层、布料拓扑/锚点、相邻 fallback、移动端、性能与验证，不更改 FIELD 01–04 或引入业务服务。

| User phase | Requirement / artifact | Surface / state | Evidence needed | Stage | Status | Next action |
| --- | --- | --- | --- | --- | --- | --- |
| 树有可读动态 | 独立枝叶层而非整图缩放 | default / dawn / dusk | screenshot、帧间位置与角度 witness | 2 / 6 | pass | 两张 RGBA 摄影枝叶使用不同枢轴、频率、振幅和视差，默认树冠约 `0.09rad` |
| 窗帘形态正确 | 垂直侧边、挂点聚拢、纵向褶皱、柔软下摆 | default / open slider / structure | screenshot、topology、GPU readback | 2 / 5 | pass | noon / dawn 的内缘保持垂直；可见挂环、12 道全高纵褶和不齐下摆成立 |
| 动态层相互关联 | 风同时影响枝叶、树影、帘布和声场 | wind / pointer wake / presets | interaction、metrics、visual state | 5 / 6 | pass | 同一风值与拖动冲量驱动四层；390px 拖动树冠 `0.217rad`、布面场 `0.826` |
| 移动与降级保持 | 390×844、reduced-motion、fallback | touch / capability | screenshot、overflow、runtime、logs | 7 / 8 | pass | 移动 704 节点且零溢出；reduced-motion 树冠约 `0.014rad`；fallback 保留双层枝叶动态 |
| 工程与资产可追溯 | 新素材、provenance、README、build | files / production | file、build、diff | 9 | pass | 透明摄影层、来源边界、当前拓扑预算与浏览器证据已同步 |

## 视觉方向与可观察约束

| 决策 | 选择 | 可观察约束 | 验收标准 |
| --- | --- | --- | --- |
| 构图 | 近景帘布围合中央窗景，室内地面与窗台提供尺度，控制退到上下边缘 | 第一眼是空间和光，不是卡片、图表或参数墙 | 1280×720 与 390×844 均保留连续可读窗景，帘布占画面主体 |
| 焦点 | 树影落在布面为第一焦点，窗外枝叶和日光池为第二，文字/指标为第三 | 无 Bloom、霓虹或高饱和报警色 | 无需说明即可理解“风使帘动，帘使影变” |
| 材质 | 使用已追溯 Poly Haven CC0 Terlenka 法线/粗糙度作为亚麻细节，程序化纹理只承担动态投影 | 帘布必须保留纤维尺度、折褶和透光层次；程序几何明确为原型空间 | 中近景不呈现光滑塑料片或纯色平面 |
| 运动 | 低频整体呼吸、高频自由边涟漪、局部 pointer wake 与阻尼恢复叠加 | 静止时不冻结，也不持续剧烈摆动；交互后 2–4 秒自然收敛 | 风强、pointer proximity 和 drag wake 三种运动可区分 |
| 声音 | 风噪、叶片高频和室内低频共鸣共享风强/开合/指针方位 | 默认静音；用户手势解锁；静音与视觉状态等价可读 | 首次点击、静音、重复切换、页面隐藏/恢复均无爆音和节点泄漏 |
| 技术可见性 | 默认隐藏节点/弹簧；结构透视以细灰绿线覆盖同一帘布 | 技术层不能改变摄影构图或永久遮挡树影 | 开关结构层前后控制与物理状态连续 |

## 资产与性能预算

| 层 | 预算 / 来源 | 约束 |
| --- | --- | --- |
| Curtain PBR | 复用 Poly Haven CC0 `terlenka_nor_gl_1k.jpg` 与 `terlenka_rough_1k.jpg`，来源沿用 `ASSET_SOURCES.md` | 原始资产约 1.7 MB；不新增未经追溯的外部素材 |
| Cloth topology | 桌面每幅 24×28，移动每幅 16×22；按当前开度建立基形，顶边锚定，结构/剪切/弯曲约束 | 位移与速度有限；GPU readback 必须 finite |
| Leaf shadow | 512–768 动态投影纹理，最多约 48 枚叶影，10–15 Hz 更新 | 不每帧分配 canvas / texture；reduced-motion 降至低频或静态 |
| Dust | 桌面 90、移动 42 个实例 | 对象池复用；fallback 不创建 3D 粒子 |
| Audio | 1 个循环噪声缓冲、3 个滤波/增益层、1 个 StereoPanner | 仅首次手势创建；最多一套节点图；切换只调整 gain |

## 覆盖清单

| User phase | Requirement / artifact | Surface / state | Evidence needed | Stage | Status | Next action |
| --- | --- | --- | --- | --- | --- | --- |
| FIELD 05 | 新的日光建筑视觉系统 | 1280×720 / default | browser screenshot、DOM、canvas | 1–3 | pass | 暖色日光房、双帘、窗景与边缘控件在一屏成立 |
| FIELD 05 | Aurelia 双帘布与风/开合 | WebGPU / controls | topology、结构层、变量映射、GPU readback | 4–6 | pass | 桌面 1,344 节点 / 7,548 约束；结构层与 finite 读回通过 |
| FIELD 05 | 树影与日照 | time/preset/transmission | 影长、色温、透光与布面形变可区分 | 5–6 | pass | 07:40 / 13:00 / 17:20 三预设同步改变空间状态 |
| FIELD 05 | 靠近与拖动互动 | pointer / touch | near/wake/settle 阶段和同向反馈 | 5–6 | pass | 鼠标与触控拖动均进入局部尾流，释放后回到 near / settle |
| FIELD 05 | 空间音频 | locked/playing/muted/hidden | 首次解锁、参数映射、静音和视觉等价反馈 | 5–7 | pass | 首次手势解锁、静音复切与标签状态通过且无应用错误 |
| FIELD 05 | 手机/平板 | 1024×768、390×844 | screenshot、overflow、触控、可达控制 | 7 | pass | 390×844 使用 704 节点 / 3,848 约束，无横纵溢出 |
| FIELD 05 | reduced motion | `?motion=reduce` | 语义保留、非必要持续运动减少 | 7–8 | pass | WebGPU 正常启动，状态与控制保留，持续纹理更新降频 |
| FIELD 05 | WebGPU fallback | `?fallback=1` | operable fallback、边界说明、控制状态 | 8 | pass | 2D ROOM MODE 明示边界，时刻、材料控制、拖动与声场保留 |
| 图谱连续性 | Ink → Curtain → Atlas | links/hash | Vite、Atlas、Ink 相邻导航 | 7 | pass | Vite 已纳入入口，Ink 下一样例与 Atlas FIELD 05 深链闭合 |
| 文档与工程 | README、研究图谱、build、logs | files/runtime | 内容、生产构建、console、性能 | 9 | pass | R27、入口清单、运行证据和终检同步完成 |

## Refinement ledger

| Current stage | User phase | Coverage item | Observed evidence | Root cause / intervention | Adjacent regression surfaces | Observed result | Decision |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 0 Goal lock | FIELD 05 | 视觉与交付边界 | 图谱已定义树影、窗帘、光、风和空间声音；用户要求继续且上一轮明确反对统一模板 | 选择暖色日光房 Spatial Stage；材质、构图、控件和运动均重新定义，复用的只有已验证物理内核与 CC0 织物细节 | FIELD 01–04、Atlas、mobile、fallback | 契约建立，空间视觉不沿用暗色监控台或纸本书法 | pass |
| 3 Visual baseline | FIELD 05 | 日光房与材料 | 1280×720 首帧形成双帘围合中央窗景，暖白墙、亚麻、灰绿影和窗台提供尺度；控件退到边缘 | 动态 CanvasTexture 只承担树影，Poly Haven CC0 normal / roughness 提供织物高频细节 | mobile、fallback、preset | 三个时刻具有可辨色温和影长，画面无 Bloom / 霓虹报警色 | pass |
| 6 Physics interaction | FIELD 05 | 帘布、开合、靠近和尾流 | 结构层显示 864 节点 / 4.8K 约束；桌面真实拖动后场状态改变，释放后自然收敛 | 双幅 18×24 拓扑、顶边动态锚、有限局部 force 和额外可见褶皱统一读取同一输入 | audio、pointer、reset、diagnostics | GPU 采样 `FINITE · 864 nodes · max Δ 1.582 · 10.5ms` | pass |
| 7 Audio and states | FIELD 05 | 环境声场与预设 | 声场首次点击进入 playing，再次进入 muted；晨雾、午后、薄暮显示 07:40 / 13:00 / 17:20 | 单套噪声/滤波/振荡节点图按风、开合、日照和指针方位调参 | visibility、repeat toggle、visual label | 标签、ARIA、节点上限和视觉等价状态通过，控制台无应用错误 | pass |
| 8 Cross-surface | FIELD 05 | mobile / reduce / fallback | 390×844 为 432 节点 / 2.3K 约束且零溢出；低动态运行 WebGPU；强制降级显示 2D ROOM MODE | 小屏降低拓扑、叶影和尘埃预算；fallback 保留房间、时刻、材料和声音控制 | touch、horizontal dock、keyboard | 三条路径均可操作，fallback 清楚声明 GPU 未运行 | pass |
| 9 Delivery | FIELD 05 | 工程、图谱与文档 | `curtain.html` 纳入 Vite，多入口导航和 Atlas 深链闭合；README / R27 同步 | 生产构建与 diff 终检，最终浏览器停在作品入口 | all built entries | FIELD 05 从规划状态转为 LIVE，下一案例保持 FIELD 06 | pass |
| R28 Asset revision | FIELD 05 | 环境素材质量 | 首版中央程序树枝、圆叶、渐变窗景和盒子家具暴露技术原型感 | 以生成摄影底片承接建筑/植被/家具，以独立 gobo 承接树影；删除对应 primitive | desktop、mobile、fallback、physics | 1280×720 首屏呈现真实材料与空间深度，帘布仍为独立 GPU 前景 | pass |
| R28 Browser retest | FIELD 05 | 混合资产跨表面证据 | 桌面拖动 field `0.319`、GPU `FINITE · 864 nodes · max Δ 1.683 · 7.7ms`；移动端 field `0.503` | 摄影底片与 gobo 在 WebGPU / fallback 共享，移动端只降低求解预算 | controls、structure、overflow、logs | 1280×720、390×844、fallback 零溢出，控制台无 warning/error | pass |
| R29 Motion / silhouette | FIELD 05 | 树冠动态与垂帘轮廓 | 默认树冠约 `0.09rad`；noon / dawn 帘缘保持垂直；390px 拖动为树冠 `0.217rad` / field `0.826` | 双层透明摄影枝叶增加深度和差异运动；布料按开度建基形，并增加挂环、全高纵褶、柔软下摆和整幅跟随力 | presets、pointer、audio、fallback | 树、影、帘与声场共享风和拖动因果，单帧与连续运动均可读 | pass |
| R29 Performance closure | FIELD 05 | 新拓扑与跨表面预算 | 桌面 `FINITE · 1,344 nodes · max Δ 0.078 · 13.6ms`；移动 704 节点 / 3,848 约束且零溢出 | 桌面 24×28×2、移动 16×22×2；两层枝叶均复用材质与 authored PNG | desktop、mobile、reduce、fallback、build | 桌面和移动 WebGPU finite，低动态与 2D fallback 保留语义 | pass |
