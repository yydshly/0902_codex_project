# Living Identity / 活体品牌交付契约

## 设计契约

| 字段 | 约定 |
| --- | --- |
| Entry mode | Revision-led：在 R5 系列规划上继续 Direction 02，保留 Direction 01 与全部既有入口 |
| Request revision | R6：把“活体品牌”从路线图候选推进为第二件可独立体验的 GPU 物理作品 |
| Target user and context | 评估 Aurelia 是否能从有机/材料效果扩展到品牌识别、动态字标和舞台视觉系统的创意技术团队 |
| Desired first impression | 第一眼能读出 AURELIA；一次操作后字标真正展开为空间轨道；召回时不是切换贴图，而是由弹簧系统重建可读结构 |
| Visual ambition | Immersive |
| Experience architecture | Spatial Stage；品牌节点是持续可操作舞台，DOM 承载概念、状态、映射和主控制 |
| Scene base | Three.js `WebGPURenderer`、Aurelia `VerletPhysics`、GPU compute 锚点桥、storage-buffer 实例节点与连接线、TSL MRT selective bloom |
| Scene persistence | locked、playing、deconstructed、recalling、muted、paused 与 pointer 扰动期间舞台始终可见 |
| Foreground control model | 顶部系列导航与进度；左侧作品概念；右侧实时频段/结构状态；底部播放、解构/召回、凝聚力与重置操作 |
| State-to-scene mapping | locked 为平面可读字标；playing 让低频扩展深度、中频推进相位、高频触发短促切片；deconstructed 把各字母展开为三维轨道；recalling 让固定锚点连续回到字形并由弹簧拖回自由节点；unsupported 保留概念、映射和音频操作 |
| Mobile transformation | 上下信息压缩为紧凑覆盖层，指标横排，主操作保持触达；不把持久舞台改为长页面 |
| Fallback | 无 WebGPU 时保留真实 DOM 字标、方向说明、系列导航、声音状态和可运行音频；reduced-motion 关闭自动镜头并缩短空间行程/瞬态 |
| Visual constraints | 不复刻水母、不沿用 Direction 01 的青绿建筑语言；采用骨白、朱红、电蓝的编辑式品牌系统；必须先可读再解构；光效不能替代节点拓扑 |
| Information constraints | 明示 02 为 LIVE、03 为 NEXT；展示真实节点/连接数量与三频映射；候选方向不冒充已交付能力 |
| Operation constraints | 音频须由手势解锁；支持暂停、静音、解构/召回、凝聚力、重置和指针扰动；主控制均可键盘操作 |
| State constraints | locked、playing、paused、muted、deconstructed、recalling、background-suspended、unsupported 均有可见或语义反馈 |
| Environment constraints | localhost/HTTPS；现代 Chrome/Edge WebGPU；单一深色品牌主题；无外部音乐、字体、品牌资产、后端或网络依赖 |
| Primary journey | 从方向总览进入 02 → 启动声场 → 解构 AURELIA → 观察三频推动空间轨道 → 调节凝聚力并指针扰动 → 召回可读字形 → 返回总览或进入下一方向 |
| User-defined phases | 延续既定顺序：完成 02 活体品牌；保留 01；把 03 可演奏空间设为下一方向，不提前标记完成 |
| Required artifacts | `identity.html`、Direction 02 GPU 物理舞台、品牌形状采样与形状记忆、声音交互、响应式/降级界面、索引导航更新、README/研究记录、浏览器证据 |
| Autonomy authorization | 用户明确要求“继续，按我们的规划进行继续”，允许在既定 Direction 02 范围内直接实现与验证 |
| User-decision boundary | 真实商业品牌字形、授权音乐、用户上传、真实数据、录制发布包和外部部署仍需另行决定 |
| Observable completion criteria | AURELIA 由采样节点构成并保持可读；GPU 锚点连续驱动真实 Verlet 弹簧网络；解构/召回是同一 position storage 的物理变换；音频三频有不同结构作用；桌面/移动、键盘、reduced-motion、无 WebGPU 降级、构建和原页面回归都有证据 |

## 路由结论

```text
Selected pattern: product-case spatial brand system + GPU physics interaction prototype
Evidence branch: local Aurelia Verlet solver + Three.js WebGPURenderer/TSL + existing procedural Web Audio analyser
Required inputs: prepared upstream solver, system type rendering, existing audio engine; no external assets
Expected output: preserved Direction 01 plus a distinct, high-fidelity Direction 02 with reversible topology states
What should update the skill: none; reusable conclusions remain bounded to this project record
```

## 视觉方向表

| 决策 | 选择 | 可观察约束 | 验收标准 |
| --- | --- | --- | --- |
| 构图 | 超宽字标横贯舞台，界面悬浮于四角 | 主体不被左右信息块截断；首屏不滚动 | 桌面和 390px 均能识别字形/品牌状态并到达主操作 |
| 焦点 | 可读字标先于光效和指标 | locked/recall 收束时必须清楚读出 AURELIA | 首帧和召回终态的字母轮廓连续、字距稳定 |
| 字体角色 | DOM 使用紧凑无衬线标题 + 等宽技术标签；Canvas 使用系统黑体采样 | 无外链字体；字标采样与 DOM 备用文本同名 | 离线构建与 fallback 均有完整品牌文字 |
| 色彩 | 骨白结构、朱红记忆锚、电蓝频谱/瞬态、墨黑背景 | 状态不只依靠色彩；文字对比充足 | 控件、焦点、状态文本和场景轮廓均可辨 |
| 材质/深度 | 节点为哑光/发光混合，连接为低强度结构线；解构时形成前后轨道 | Bloom 只强化节点峰值和短暂信号切片 | 轨道深度来自视差与遮挡，不是全屏雾光 |
| 运动 | 物理召回为核心；镜头只做缓慢侧向呼吸 | reduced-motion 关闭自动旋转并降低锚点行程和切片数量 | 状态变化仍可理解且不会因降级丢失意义 |
| 密度 | 桌面约 1K–1.8K 显示节点、有限邻接线；移动端降低采样/像素比 | 连接线不能糊成实心字块，点数与约束数明示 | 本机 Chrome 无阻塞错误且保持可操作帧率 |

## VFX 与音频反馈预算

| 效果 | 触发/归属 | 时长/含义 | 轮廓与颜色 | 上限/清理 | Reduced motion |
| --- | --- | --- | --- | --- | --- |
| Signal cut | 解构、召回或高频上升沿；品牌系统 | 180–420ms；表达拓扑被重写 | 穿过字标的电蓝/朱红窄切片 | 池化 10 条，同时最多 4 条，结束归还 | 只保留 1 条低位移亮度线 |
| Recall ring | 点击召回；字标中心 | 900ms；表达形状记忆开始收束 | 骨白椭圆环，随收束缩小 | 池化 4 个；重置/暂停可重复清理 | 单次低亮度边框脉冲 |
| Node charge | 高频超过阈值；物理节点 | 120–260ms；表达频谱起音 | 电蓝小型节点峰值 | 每 140ms 至多触发一次，总体不新增粒子对象 | 仅提高现有节点亮度 |

音频使用现有原创程序化声场：首次点击解锁；同时音源上限 24；低/中/高频分别驱动深度、轨道相位、节点电荷；静音保留 analyser 与视觉，暂停让频谱平滑衰减；后台挂起并在返回时受控恢复；状态均有 DOM 文字等价反馈。

## 覆盖清单（终审）

| 用户阶段 | 要求或产物 | 表面 / 状态 | 证据需要 | 阶段 | 状态 | 下一步 |
| --- | --- | --- | --- | --- | --- | --- |
| 保留 | 01 与既有三个实验入口不回退 | `/`、`/lab.html`、`/morph.html`、`/resonance.html` | 生产构建与 HTTP 回归 | 1/9 | pass | 六入口纳入同一 Vite 构建；原入口文件未替换 |
| 总览 | 02 变为 LIVE、03 变为 NEXT，序列仍诚实 | `/directions.html` desktop/mobile | DOM 状态、链接、无横向溢出截图 | 2/3/7 | pass | 10 卡、两个 LIVE 链接与 03 NEXT 均由浏览器见证 |
| 作品 02 | AURELIA 可读字标成为唯一主视觉 | `/identity.html` locked/playing/recall | 桌面首帧、播放、解构和召回浏览器证据 | 2/5/6 | pass | 最终 coherent、deconstructed、recalled 截图均保留 |
| 物理因果 | 同一 GPU storage 支持字形、解构和召回 | deconstructed/recalling/pointer | 真实点/约束计数、GPU readback 有限值、可见连续状态 | 5/6 | pass | 1,264/1,264 显示节点有限，空间 z 深度约 6.30 |
| 音频 | 手势解锁、三频映射、暂停/静音/后台正确 | audio states | AudioContext/Analyser 观察和按钮/状态见证 | 4/5/6 | pass | playing 三频非零；muted analyser 继续；paused 衰减；沿用已验证后台挂起逻辑 |
| 控制与 VFX | 解构/召回、凝聚力、重置、指针、反馈池均工作 | controls/rapid repeat/pause | 触发—中间—结果—恢复，快速重复无泄漏 | 4/5/6 | pass | 连续 6 次切换后目标回到 coherent；池固定为 10/4，暂停后活跃对象为 0 |
| 多表面 | 桌面、平板邻近布局与 390px 舞台无溢出遮挡 | desktop/mobile | 代表性截图、scrollWidth、控件触达 | 3/7 | pass | 1440×1000 与 390×844 均无横向溢出；移动端完整字标与四个主按钮可见 |
| 可访问性 | 键盘、可见焦点、语义状态、reduced-motion | keyboard/media | Tab 顺序、2px 以上焦点、pressed/value 状态、media emulation | 7/8 | pass | skip→brand→overview→audio→structure→mute→reset 顺序完整，均为 2px focus；motion=reduced 被识别 |
| 降级/性能 | 无 WebGPU 仍可理解/播放音频；高成本视觉可操作 | fallback/full/reduced | 无 GPU 模拟、FPS/帧时或短时样本、console 健康 | 8 | pass | fallback 无画布仍可启动音频；桌面约 55–67 FPS、移动约 131 FPS；各路径无 console/page error |
| 交付 | 文档、构建和证据闭环 | 子项目 | README、研究记录、`npm run build`、audit、catalog check | 9 | pass | 六入口生产构建、0 漏洞审计、catalog 校验和 HTTP 200 回归全部通过 |

## 验证记录

- Canonical runtime：`http://127.0.0.1:4173/`，2026-09-03，Windows Chrome 硬件 WebGPU；`agent-browser` CLI 在当前环境不可用，改用现有 Puppeteer + 本机 Chrome 路径完成等价浏览器证据。
- Direction index：10 个方向；01/02 为 `LIVE` 且分别链接 `resonance.html` / `identity.html`，03 为 `NEXT`；桌面全页无错误覆盖层与横向溢出。
- 桌面拓扑：1,264 个显示节点；1,264 个隐藏记忆锚；1 个不参与渲染或约束的隔离 guard；2,529 个总顶点；6,382 根约束；160 steps/s。
- GPU storage readback：显示节点 `1264/1264` 为有限值，`nonFinite=0`；完全解构包围盒约 `[-4.14,-1.28,-3.05]..[4.16,1.25,3.25]`。
- 音频与状态：播放后 low/mid/high 均出现非零值；静音时 analyser 继续；暂停后频谱接近零；coherent → deconstructing → deconstructed → recalling → coherent 状态与 `aria-pressed` 一致。
- VFX 压力：快速连续 6 次结构切换后最终 target=0、mode=coherent；10 条 Signal cut 与 4 个 Recall ring 均为固定池，暂停后活跃对象为 0。
- 移动端：390×844 自动缩为 654 个显示节点、约 3.1K 根约束、110 steps/s；完整 AURELIA 与主要控制均在舞台内，无横向溢出。
- 键盘：焦点依次经过跳转链接、品牌链接、方向总览、音频、结构、静音和召回；所有交互焦点为 2px 可见轮廓。
- Reduced motion：媒体偏好被识别为 `motion=reduced`，关闭 OrbitControls 自动旋转并降低瞬态数量/时长。
- 无 WebGPU：错误说明与 DOM 字标可见；结构/凝聚力/召回禁用；音频仍可由真实点击启动并产生 analyser 数据；透明加载层拦截点击的问题已通过 `[hidden]` 规则修复。
- 视觉校准：首轮移动画面横向裁掉首尾字母，已通过窄屏独立字宽采样和 21.5 距离镜头修正；最终截图共 6 张，位于被忽略的 `validation-artifacts/001-aurelia-identity/`。
- 浏览器路径均无 console/page error；六入口生产构建通过；`npm audit --audit-level=high` 为 0 vulnerabilities；根 catalog 校验通过且 README 已同步；六个开发路由均返回 HTTP 200。

## Pointer interaction repair ledger（R7）

| 项目 | 当前观察 | 验收标准 | 状态 |
| --- | --- | --- | --- |
| Pointer event | `pointermove` 已从整页舞台进入 `LivingIdentityScene.setPointer()`；移到控件区或离开舞台后切回 `pointer=idle` | 移入/移出均有明确状态，控制区不会产生误导性的持续响应 | pass |
| Physical response | 新增只作用于 1,264 个 free node 的 GPU 射线力场；450ms 悬停最大位移 `0.483`，291 个节点位移超过 `0.03` | 桌面指针靠近任一字母时，真实 free-node GPU position 产生可量测局部位移，并在离开后受弹簧召回 | pass |
| Visual feedback | 命中时同位置显示电蓝场环，并在结构说明中明确“拨动自由节点”；浏览器截图确认形变与场环同位 | 命中区域出现克制的场环/状态提示；形变与场环属于同一指针位置 | pass |
| Regression boundary | 移出 1.8s 后最大 tether 拉伸由 `0.471` 回落至 `0.014`；完整 QA 中 coherent/deconstructed/recall、音频、390px、reduced-motion、fallback 均无 console/page error；生产构建通过 | 修复后 build、console、coherent/deconstructed、桌面与移动布局不回退 | pass |
