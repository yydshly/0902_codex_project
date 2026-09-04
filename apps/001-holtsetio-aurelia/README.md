# Aurelia 能力演示

- 关联研究：[`research/001-holtsetio-aurelia/`](../../research/001-holtsetio-aurelia/)
- 项目总览：[`案例、能力与研究结论`](../../research/001-holtsetio-aurelia/notes/project-summary.md)
- 在线地址：`https://yydshly.github.io/0902_codex_project/demos/001-holtsetio-aurelia/`
- 上游基线：[`holtsetio/aurelia@724aba2`](https://github.com/holtsetio/aurelia/commit/724aba263459d1b11a49b72bfc7ce8baac840ca8)
- 验证目标：真实运行上游程序化水母实现，并用中文界面解释解析形体、GPU 弹簧、缓冲驱动表面和 MRT Bloom。
- 不覆盖：科学软体仿真、WebGL/CPU 降级、低端移动设备性能以及跨浏览器兼容性结论。

## 十六个入口

- `/`：保留上游默认的 10 实例、360 Hz 基线，负责解释原库能力；
- `/summary.html`：Project Synthesis「项目研究总账」R40；保留总览，并向下展开 15 个案例事实账、六阶段运行链、能力 × 案例矩阵、10 个创意方向、12 个现实映射、R0–R40 演进、来源索引、真实缺口、项目价值和当前决策。
- `/lab.html`：扩展实验室，默认使用 3 实例、240 Hz，可在轻量、均衡、完整档位间比较真实 GPU 工作集。
- `/morph.html`：形态实验室，用三种非水母拓扑和原创程序化音乐验证这套思路可迁移到不同视觉产品。
- `/directions.html`：创意方向作品集，按已完成、下一步和候选状态组织十个横向扩展方向；
- `/resonance.html`：Direction 01「Resonant Matter」，用上游真实 GPU Verlet 求解器实现音乐驱动的张拉声场雕塑；
- `/identity.html`：Direction 02「Living Identity」，让 AURELIA 字标沿同一 GPU 物理拓扑完成解构、受力与形状记忆召回。
- `/atlas.html`：Field Atlas「创意研究图谱」，把 10 个原方向、12 个现实观察、13 层技术、10 个交互模块与逐方向实验标准组织成可查询的研究文档。
- `/rain.html`：Field Prototype 01「Rain Membrane」，把雨滴碰撞、伞骨锚、膜面传播、积水质量记忆与程序化雨琴连接到同一物理状态，并支持拖动环绕三维伞面。
- `/weatherproof.html`：Weatherproof 业务官网原型，把同一雨幕物理状态接入场景推荐、商品比较和预约转化。
- `/clothesline.html`：Field Prototype 02「Windline」，用真实服装资产与扫描织物演示固定端、负重、方向风场与链式传播。
- `/metro.html`：Field Prototype 03「Metro Pulse」，用合成运营数据驱动 3D 站点、线路弹簧、容量压力、拥塞回压与恢复。
- `/ink.html`：Field Prototype 04「Living Ink」，以明亮宣纸而非暗色仪表盘展示压力笔锋、速度痕迹、纸纤维扩散与时间记忆。
- `/curtain.html`：Field Prototype 05「Veil of Light」，在暖色日光房中连接双幅 Aurelia 帘布、风场、树影遮挡、空间声场与人的靠近/扫动。
- `/arena.html`：Flagship Arena「第二旗舰竞技场」，以水母为正式基准，在同一 WebGPU 舞台比较光翼生命体、星种绽放与磁流体祭坛的轮廓、空间、运动、材质、结构和交互。
- `/cuttlefish.html`：Lumen Cuttlefish「墨光乌贼群」R38；在 R37 双模式运动与 8 腕 + 2 捕食触腕基础上，将透明发光装置重构为连续头胴、斑驳实体皮肤、嵌入式侧眼、腹侧虹吸与低亮度肉质腕束；HERO / PROFILE / CLOSE、自由拖动、点击喷射、SIGNAL、结构透视、声场、低动态和完整降级路径继续共享同一 WebGPU 三维主体。

实验室不是通过隐藏对象伪装负载变化。切换档位会整页重建物理缓冲，实际规模分别为：

| 档位 | 实例 | 物理点 | 弹簧 | 子步频率 | DPR 上限 |
| --- | ---: | ---: | ---: | ---: | ---: |
| 轻量 | 1 | 3,240 | 9,292 | 120 Hz | 1.0 |
| 均衡 | 3 | 9,720 | 27,876 | 240 Hz | 1.25 |
| 完整 | 10 | 32,400 | 92,920 | 360 Hz | 1.6 |

实验室还提供生命、结构、能量三种观察模式，以及阻尼、Bloom、暂停、脉冲和镜头控制。FPS 是当前窗口的短时观察值，仅用于本机档位比较。

## Sonic Genesis：从技术草图到音画主视觉

Sonic Genesis 没有复制水母轮廓，也没有把同一个模型换三种材质。R4 将最初的多形态技术草图升级为五层生成艺术场景：主体表面、内部结构、能量轮廓、粒子/轨迹和空间光场，并使用 Three.js WebGPU PostProcessing 增加受控 Bloom。

| 形态 | 几何语言 | 低频 | 中频 | 高频 |
| --- | --- | --- | --- | --- |
| 星云花 | 30 片实例化曲面膜翼、晶核、18 根合并光丝、190 粒星尘与三重光环 | 晶核与花冠呼吸 | 多层膜翼潮汐 | 星尘喷发与冲击波 |
| 时空织体 | 14 条动态带状膜、双重奇点、140 个流动节点与三道空间门 | 场域宽度 | 相位扭结与传播 | 电弧闪络与冲击波 |
| 量子生命体 | 嵌套晶体、210 个神经节点、动态图边、七重轨道与外层卫星 | 等离子核心 | 神经传播和轨道 | 突触放电与碎片喷发 |

音乐由 Web Audio 在浏览器内实时合成：低频振荡器、中频五声音阶与高频噪声打击进入同一个 `AnalyserNode`。连续频谱控制呼吸、流动和亮度，高频/低频的上升沿另行触发复用池中的冲击波与碎片喷发，因此反馈不再只是整体缩放。它不依赖商业音乐文件和网络服务；切换形态采用离场—重组—入场转场，不会重启音乐。支持播放/暂停、静音、音量与 84/108/132 BPM。

这层扩展验证的是 Aurelia 背后的方法，而不是复用它的水母资产：程序化拓扑负责“长什么样”，连续状态负责“怎么动”，音频、数据、指针或业务事件都可以成为状态输入。若后续改用现有音乐，只需把音频源接入当前 analyser；若改成实时数据，则可绕过音频层，直接驱动相同的形态参数。

## Creative Directions：横向作品序列

方向总览不把十个标题伪装成十个已完成效果。当前 Direction 01 与 02 标记为 `LIVE`，Direction 03 标记为 `NEXT`，其余保持待实现或候选状态。既有基线、Control Lab 和 Sonic Genesis 均保留。

第一件作品 [`resonance.html`](./resonance.html) 是非生物的声学张拉建筑：24 片交叉膜翼连接上下锚环，桌面档位包含 3,120 个实际雕塑节点、约 13,200 根弹簧约束，以 180 steps/s 更新；移动端减少为约 1,600 个节点、6,700 根约束和 120 steps/s。额外的隔离 guard 槽不参与表面或约束。

它与 Sonic Genesis 的关键区别是数据链重新接回了 Aurelia 的真实物理内核：

```text
Web Audio analyser
  → 低频 / 中频 / 高频 / 离散冲击
  → GPU 锚点位置
  → Aurelia spring force + vertex integration compute
  → shared position storage buffer
  → 膜面 positionNode + 弹簧线框
  → TSL MRT selective bloom
```

低频改变锚环尺度和纵向张力，中频让上下环反向扭转，高频产生沿环相位变化的行波；手动冲击和低频起音只作用于锚点，形变随后经过约束传向膜面中部。张力控制同时调整锚点跨度和阻尼，指针继续使用上游射线排斥力。因此它验证的是结构传播，而不是整体缩放。

第二件作品 [`identity.html`](./identity.html) 不把字标当成贴图或预录视频。系统先从本机字体光栅采样 AURELIA：桌面得到 1,264 个可见节点，为每个节点创建一个隐藏的固定记忆锚和一个自由物理点，再用零静止长度 tether 与同字母邻接弹簧组成 2,529 个 GPU 顶点、6,382 根约束。解构时，七个字母的锚点连续展开到环形空间；自由点由真实弹簧追随。召回时，同一批锚点与 position storage 返回平面字形，而不是替换另一个模型。

```text
Canvas glyph sampling
  → hidden memory anchors + free visible nodes + local adjacency
  → GPU anchor morph / tether stiffness
  → Aurelia spring force + vertex integration compute
  → shared position storage buffer
  → instanced octahedron nodes + structural lines
  → selective bloom + pooled signal cuts / recall rings
```

声音的低频增加空间深度，中频推进轨道相位，高频为既有节点增加短促电荷并触发有上限的切片反馈。凝聚力控制会直接重写记忆 tether 的 GPU stiffness，同时调整耗散；指针使用 Direction 02 专属的 GPU 局部射线场，只推动自由节点，并由记忆弹簧在离开后召回。移动端将字标按窄屏重采样为 654 个节点和约 3,100 根约束，并改变字宽与镜头距离，而不是只缩小 CSS。

第一个现实机制样例 [`rain.html`](./rain.html) 使用 854 个 GPU 节点与约 3,300 根约束构成伞面、固定边界与 12 根伞骨的弹性锚。自动雨与手动轻触共享八槽冲击缓冲；冲击同时进入 Aurelia force storage、膜面行波、对象池飞溅与程序化雨琴。积水是缓慢累积的质量状态，会降低弹簧刚度、膜面张力和声音基频；排水与复位分别验证可逆状态和 GPU 位置/力缓冲恢复。结构透视明确显示实际求解节点与约束，位移预算和速度预算限制快速重复输入下的能量。空白场景拖动会围绕伞面旋转，轻点才产生冲击；方向键、Enter/Space 和 0 分别对应旋转、落雨和视角复位。

```text
rain / touch impact
  → bounded GPU force field + water-load memory
  → Aurelia spring force + vertex integration compute
  → shared position storage buffer
  → translucent membrane + visible constraint layer
  → splash / travelling ring / procedural rain harp
```

第二个现实机制样例 [`clothesline.html`](./clothesline.html) 使用一条固定两端的链式绳索和三张不同面积、质量的二维织物拓扑。桌面质量共 591 个 GPU 节点、约 3,000 根约束；风力、方向、负重和阻尼通过独立桥接层写入 Aurelia force storage。可见素材不再由程序色块冒充：中央服装来自 Smithsonian Open Access 的 CC0 摄影测量 GLB，两侧织物采用 Poly Haven 的 CC0 扫描 PBR。服装的 56K+ 顶点以双线性权重绑定到 Aurelia 弹簧表面，因此保留真实褶皱和纹理的同时继承 GPU 风场形变。按住画布拖向哪里，阵风就按屏幕同方向进入局部织物，再以有限速度沿绳索传播；素材来源见 [`public/assets/clothesline/ASSET_SOURCES.md`](./public/assets/clothesline/ASSET_SOURCES.md)。

```text
screen-space drag / wind preset
  → directional gust slots + load / damping field
  → Aurelia spring force + vertex integration compute
  → shared rope and cloth position storage
  → dynamic fabric normals + structural topology + wind streaks
  → propagation phase / metrics / bounded reset
```

程序化黄昏屋顶、固定端、夹子、三种织物和风迹都不依赖外部模型；结构透视直接显示参与求解的节点与约束。GPU 速度预算、相对基形位移预算和地面软碰撞避免快速重复阵风积累失控；移动端降低拓扑与风迹数量，WebGPU fallback 仍保留静态因果说明和预设反馈。

第三个现实机制样例 [`metro.html`](./metro.html) 使用 15 个合成站点、4 条线路和 32 根 GPU 约束，把“容量”做成隐藏锚，把站点做成可被弹簧网络牵引的自由节点。CPU 侧只负责可解释的需求、容量、扩散和恢复状态；Aurelia bridge 将同一压力写入 GPU position / force storage，因此拥堵不是孤立变色，而会改变节点高度、线路空间形态、客流速度和相邻站节奏。

```text
synthetic demand / capacity event
  → per-station pressure + adjacency diffusion + recovery
  → GPU capacity anchors + Aurelia tether / route springs
  → shared position and pressure storage
  → 3D stations + heated routes + bounded flow packets / pulse rings
  → bottleneck metrics + causal phase + reset
```

晚高峰、活动散场和中央封站分别覆盖持续需求、短时脉冲和容量下降。桌面使用 150 个复用客流粒子，390px 使用 72 个；轻点站点负责注入事件，拖动只负责受限 3D 环绕。所有运营值均明确标为 `SYNTHETIC`，真实产品必须由经过节流、缺失处理、权限与隐私治理的数据源替换。

第四个现实机制样例 [`ink.html`](./ink.html) 刻意中断了前几页的暗色科技展陈语言。暖象牙宣纸、墨黑连续笔迹、朱砂落款、宋/衬线标题和沿纸缘排布的工具共同形成独立视觉系统；纸面就是主场景和主操作，不再把参数卡片放在体验中心。

```text
pointer pressure / velocity / water / absorption
  → 44-node Aurelia bristle topology + 53 spring constraints
  → bounded brush-tip response and paper contact
  → persistent ink deposition + fibre diffusion memory
  → dense / pale / cinnabar marks + readable causal phases
```

真实拖动方向与落笔方向一致；压感设备可覆盖力度滑块。结构透视只在用户主动打开时显示 GPU 节点与弹簧，默认不让技术骨架压过墨迹。桌面和 390px 均保持一屏可写，`?fallback=1` 在无 WebGPU 时仍提供可操作的 2D 宣纸，`?motion=reduce` 减少非必要飞墨但保留状态变化。设计契约与验证记录见 [`living-ink.md`](../../research/001-holtsetio-aurelia/notes/living-ink.md)。

第五个现实机制样例 [`curtain.html`](./curtain.html) 把视觉语言切换为暖白石灰墙、自然亚麻和灰绿树影构成的日光建筑空间。双幅窗帘不是预录动画：桌面 1,344 个可见 GPU 节点和 7,548 条 Aurelia 约束共同承受低频风场、开合锚点、局部靠近场与拖动尾流，移动端自动缩减为 704 个节点和 3,848 条约束。

R28 根据实景评审重做了环境资产层：首版的程序化墙面、渐变窗景、圆柱树枝、圆片叶群和 BoxGeometry 家具全部删除，改为独立生成的摄影级建筑环境底片与自然树影 gobo；运行时只对树影做裁切、漂移和密度混合。Aurelia 帘布、Poly Haven CC0 织物扫描和 GPU 交互保持独立，素材类型与来源见 [`public/assets/curtain/ASSET_PROVENANCE.md`](./public/assets/curtain/ASSET_PROVENANCE.md)。

R29 进一步修复“树像静态底图、帘头像梯形”的问题：窗外新增两张带 alpha 的摄影枝叶层，分别使用独立枢轴、频率、振幅与视差，风和真实拖动会共同为它们注入短时冲量；布料则改为按当前开度生成基形，增加可见挂环、12 道贯穿全高的纵向褶皱、柔软下摆与整幅跟随力。默认午后树冠摆角约 `0.09rad`，390px 实际拖动可到 `0.217rad`，同时局部布面场达到 `0.826`，因此枝叶、树影、帘布与声场来自同一输入而不是四段互不相关的动画。

```text
wind / proximity / screen-space drag / sun time
  → anchored double-curtain topology + bounded local wake
  → Aurelia spring force + vertex integration compute
  → shared position storage buffer
  → linen surface folds + dynamic leaf-shadow occlusion
  → wind / leaves / room-resonance Web Audio scene
```

晨雾、午后与薄暮不是换一张背景图，而是同时重设风强、开合、透光、影长、色温和室内声场比例。结构透视覆盖同一布面，GPU readback 可采样节点有限性与最大位移；`?fallback=1` 仍保留可操作的二维房间、时刻与声音控制，`?motion=reduce` 则降低非必要持续运动。完整设计契约与验证记录见 [`tree-curtain.md`](../../research/001-holtsetio-aurelia/notes/tree-curtain.md)。

后续顺序为 Playable Space、Gravity Loom 和 Signal Ecology；Memory Alloy、Acoustic Black Hole、Topological Climate、Crystal Syntax 与 Collective Glyph 作为更远候选。系列契约见 [`creative-directions.md`](../../research/001-holtsetio-aurelia/notes/creative-directions.md)，Direction 02 的独立设计与验证记录见 [`living-identity.md`](../../research/001-holtsetio-aurelia/notes/living-identity.md)。

## 上游获取方式

上游不是公开 npm 库，而是标记为 `private` 的应用项目。本 Demo 使用 npm Git 依赖将其固定在完整 commit：

```json
"aurelia-upstream": "https://github.com/holtsetio/aurelia/archive/724aba263459d1b11a49b72bfc7ce8baac840ca8.tar.gz"
```

运行 `npm ci` 时会通过固定 commit 的 GitHub 源码归档取得该版本，避免 CI 依赖 SSH 凭据。上游依赖使用自定义 TSL 运算符语法，而插件会主动跳过 `node_modules`；因此 `predev` / `prebuild` 会将 22 个 `src` 文件转换到被 Git 忽略的 `.generated/aurelia/`，应用再从该构建副本导入 `app.js` 和 `conf.js`。转换脚本还在实验室配置存在时解除上游写死的 10 实例、360 Hz 和出生位置假设；没有实验室配置时仍使用原始默认值。这是可重复的研究适配，不应被视为上游承诺的公共 API。

## 本地运行

```powershell
npm ci
npm run dev
```

使用支持 WebGPU 的浏览器打开 Vite 输出的 localhost 地址。页面中的 DOM 说明不依赖画布；WebGPU 初始化失败时会显示明确的降级说明。

实验室地址：`http://127.0.0.1:4173/lab.html`；声音形态地址：`http://127.0.0.1:4173/morph.html`；旗舰竞技场：`http://127.0.0.1:4173/arena.html`；墨光乌贼群：`http://127.0.0.1:4173/cuttlefish.html`；方向总览：`http://127.0.0.1:4173/directions.html`；声场雕塑：`http://127.0.0.1:4173/resonance.html`；活体品牌：`http://127.0.0.1:4173/identity.html`；创意研究图谱：`http://127.0.0.1:4173/atlas.html`；雨落伞面：`http://127.0.0.1:4173/rain.html`；业务官网原型：`http://127.0.0.1:4173/weatherproof.html`；风中的晾衣绳：`http://127.0.0.1:4173/clothesline.html`；城市拥塞传播：`http://127.0.0.1:4173/metro.html`；活体书法：`http://127.0.0.1:4173/ink.html`；树影与窗帘：`http://127.0.0.1:4173/curtain.html`。

## 交互

- 拖动：旋转镜头；
- 滚轮或触控缩放：改变观察距离；
- 移动指针：排斥靠近射线的软体节点，并提高附近水母的 `charge`；
- “结构”：显示或隐藏上游弹簧网络；
- “群体脉冲”：同时放大速度、冷色偏移和 Bloom；
- “能力导览”：按形体、物理、表面、光色四幕串联证据。

## 构建与验证

```powershell
npm run build
npm run preview
```

构建产物输出到 `dist/`，Vite `base` 使用相对路径，可发布到门户的嵌套子路径。

已在 Windows 版 Chrome 的硬件 WebGPU 后端完成一次桌面与 390×844 移动视口验证：画布初始化成功，弹簧显示和群体脉冲可操作，控制台无错误，页面无横向溢出。这不等价于跨设备性能或兼容性结论。

Sonic Genesis 在硬件 WebGPU 与真实 Web Audio 上完成验证：三个轮廓可切换，音频峰值会触发可见事件，转场中间态与结束态一致；暂停、静音、BPM、移动布局、键盘焦点与 reduced-motion 状态正确。窄屏采用更远镜头和较低的几何/粒子预算；禁用 WebGPU 后仍保留可运行的音乐与频谱说明。验证截图保存在仓库忽略的 `validation-artifacts/001-aurelia-morph/`。

Creative Directions 与 Resonant Matter 也在 Windows Chrome 硬件 WebGPU 中完成验证：桌面真实 GPU 回读确认 3,120 个作品节点保持有限且位于设计包围盒内；最终短时观察约 79–87 FPS，390×844 移动档位约 197 FPS，仅代表本机样本。播放、冲击、张力、指针、暂停、静音、键盘焦点、reduced-motion 与无 WebGPU 降级均通过，控制台无应用错误。最终证据保存在被忽略的 `validation-artifacts/001-aurelia-directions/`。

Living Identity 同样完成硬件 WebGPU 浏览器验证：桌面 1,264 个可见节点的 GPU 回读全部为有限值，解构包围盒约为 `x -4.14..4.16 / y -1.28..1.25 / z -3.05..3.25`；锁定、播放解构、召回、静音和暂停的本机短时观察约 55–67 FPS。指针修复后，450ms 悬停的最大自由节点位移约 `0.483`，移出 1.8s 后最大 tether 拉伸从 `0.471` 回落至 `0.014`。390×844 移动档位为 654 个节点、约 3,100 根约束和 110 steps/s，短时约 131 FPS。快速连续切换后对象池仍受 10 条切片/4 个召回环上限约束，暂停后活跃瞬态归零。键盘焦点、reduced-motion、无 WebGPU 音频降级、七入口构建与控制台健康均通过。最终证据保存在被忽略的 `validation-artifacts/001-aurelia-identity/`；数值只代表当前机器。

Field Atlas R9 在桌面与 390px 移动端完成浏览器验证：10 个原方向、12 个现实观察、13 层技术、10 个交互模块、4 个组合配方、10 行实验矩阵与 5 项质量门全部存在；状态、机制和模块筛选、案例联动、hash 深链、原生 details、键盘焦点、reduced-motion 与无 JavaScript 正文路径均通过，控制台无应用错误。最终证据保存在被忽略的 `validation-artifacts/001-aurelia-atlas/`。

Rain Membrane R10 在硬件 WebGPU 中完成桌面 `1440×1000` 与移动 `390×844` 验证。中雨约 4 秒后保持 9% 积水、79% 张力；14 次快速手动重击加暴雨后进入 36% 积水、68% 张力与 4.9 Hz。作品内 GPU 取样确认压力态 853 个有效节点全部有限、最大基形偏移 `0.116`，复位后偏移回落到 `0.017`。指针/触摸命中、结构透视、程序化声音启停、暴雨、排水与复位均可操作；查询参数 `?motion=reduce` 和 `?fallback=1` 分别用于验证降动效与无 WebGPU 语义降级。最终证据保存在被忽略的 `validation-artifacts/001-aurelia-rain/`；这些数值是当前机器与当前艺术参数的运行证据，不是科学伞布标定。

Rain Membrane R11 补齐空间舞台交互。桌面拖动使 yaw `0.617 → -0.463`、pitch `0.387 → 0.687`，移动端 `390×844` 拖动使 yaw `0.588 → 0.048`，两次拖动的手动冲击增量均为 0；移动端随后轻触精确增加 1 次冲击。方向键、Enter 与 0 的等价路径、低动效手动拖动及 WebGPU fallback 均通过浏览器回归。

Rain Membrane R12 将拖动语义从“移动相机”改为“抓住作品”：向右拖和 ArrowRight 都让 yaw 正向增加。伞柄由原来的独立圆柱与部分圆环重建为连续 Catmull–Rom 中棒/J 形握把，并增加握把包覆、端帽、runner、collar 与 12 根下撑骨。整个程序化伞架约 13,080 triangles；动态伞布仍由 854 个 GPU 节点与约 3.3K 约束驱动，没有使用 2D 生成图冒充三维物理。

Rain Membrane R13 补齐纵向 object-grab 语义：向上拖和 ArrowUp 都让 pitch 下降，伞面特征向屏幕上方跟随；向下方向相反。纵向灵敏度由 `0.005` 降至 `0.0032`，拖动跟随系数由 18 提高到 30；J 形握把同时收敛为低自发光的深瓶绿湿漆材质，保持可读轮廓但不再抢夺伞面焦点。

Rain Membrane R14 修复因果链面板的持续跳动和闪烁。自动雨不再反复重置 UI 阶段；默认稳定显示积累，手动冲击按 `IMPACT → PROPAGATE → ACCUMULATE` 展开，排水进入 `RETUNE`。活动行取消横向位移和无限明暗脉冲；阶段、指标和排水状态只在可见值真正改变时写入 DOM，并通过 `aria-current="step"` 提供语义反馈。

Rain Membrane R15 把视觉反馈推进为“接触核 → 双层波前 → 定向水冠 → 径流迁移 → 湿润材质”的连续链条，并增强伞骨之间的瓣状张力褶皱。短效使用 16 组波前池与桌面 90 / 移动 42 个飞溅实例；径流为桌面 12 / 移动 6 条固定路径，低动态模式减少飞溅并停止高光珠迁移。排水会同时降低积水、隐藏径流并恢复膜面粗糙度。

Weatherproof R16 新增 [`weatherproof.html`](./weatherproof.html)，把 Rain Membrane 从独立研究样片接入一条可操作的官网业务路径：用户选择日常通勤、城市暴雨或沿海阵风后，页面会同步改变共享的物理雨况、推荐型号、解释理由与深度实验链接；三个演示 SKU 可继续比较，预约弹窗完成一次前端转化并把事件记录到 `window.__WEATHERPROOF_EVENTS__`。业务页直接复用 `RainMembraneScene`，原实验页另提供隔离的 `embed=1` 同源消息桥，`rain.html` 默认入口保持原样；品牌、价格和评分均明确标注为原型数据，真实上线需由 PIM、检测数据、库存与 CRM/电商接口替换。

Weatherproof R17 进一步把三个演示 SKU 接到 3D 场景本身：产品选择会切换 8 / 12 / 14 骨的可视程序化框架，以及膜面颜色、粗糙度、基础张力、遇水软化、蓄水和排水参数。页面明确称其为“数字样机 / 演示参数”，并在技术区列出真实商品上线所需的商品几何（实拍、CAD 或 GLB）、PBR 材料扫描、实验室响应曲线和 PIM/SKU/库存/CRM 数据；当前共享求解器用于体验验证，不能代替真实 CAD 与检测认证。

Weatherproof R18 使用 [`src/data/weatherproof-demo.json`](./src/data/weatherproof-demo.json) 作为运行时合成数据源。它包含三个天气 source、三个 PIM/SKU、区域库存快照、三组实验批次，以及每款商品的张力、滞水和风速形变六点曲线。页面新增“合成数据实验”工作区：选择场景或商品会同步更新 3D profile、商品摘要、批次、对照曲线和可读数据表；所有值均标注为 `SYNTHETIC / 非检测数据`。详细口径见 [`weatherproof-synthetic-data.md`](../../research/001-holtsetio-aurelia/notes/weatherproof-synthetic-data.md)。

## 第三方来源

- [`holtsetio/aurelia`](https://github.com/holtsetio/aurelia/)：MIT License，Copyright (c) 2025 Holtsetio。
- [`three`](https://github.com/mrdoob/three.js/)：MIT License。
- Demo 的中文讲解层、控制编排、三种形态、Creative Directions 索引、Resonant Matter 与 Living Identity 拓扑、程序化音轨和响应式样式为本研究项目原创。
