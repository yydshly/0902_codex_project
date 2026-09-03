# Aurelia：从程序化水母到 GPU 物理创意系统

> 一个紧凑的 Three.js WebGPU 案例，展示如何把解析主体动画、GPU 弹簧软体和程序化光色连接成无需外部美术资产的实时生命体。

[![Aurelia Field Atlas 首屏以大型中文标题说明从现实因果到交互作品的方法，右侧轨道图配合十项方向、十二个现实原型和十三层技术研究统计](assets/cover.png)](https://yydshly.github.io/0902_codex_project/demos/001-holtsetio-aurelia/atlas.html)

*核心演示图：研究 Demo 将 Aurelia 从单一水母案例扩展为“现实观察 → 物理语法 → GPU 状态 → 交互体验”的创意研究图谱。*

## 项目信息

| 字段 | 内容 |
| --- | --- |
| 研究编号 | `001` |
| 上游仓库 | [`holtsetio/aurelia`](https://github.com/holtsetio/aurelia/) |
| 研究基线 | [`724aba263459d1b11a49b72bfc7ce8baac840ca8`](https://github.com/holtsetio/aurelia/commit/724aba263459d1b11a49b72bfc7ce8baac840ca8) |
| 上游许可证 | [MIT License](https://github.com/holtsetio/aurelia/blob/724aba263459d1b11a49b72bfc7ce8baac840ca8/LICENSE) |
| 研究状态 | `validated` |
| 首次研究 | `2026-09-03` |
| 最近更新 | `2026-09-03` |
| 标签 | `three.js, webgpu, tsl, compute, procedural, soft-body, web-audio, audio-reactive` |

## 为什么值得研究

Aurelia 不是通用框架，也不是已封装的 npm 组件。它的价值是用约 2,200 行 JavaScript 串起一条完整、可观察的 GPU 数据链：CPU 只创建拓扑和更新少量实例状态，GPU 负责弹簧计算、顶点重建、程序化材质和后处理。

这个项目尤其适合回答一个可迁移的问题：**如何让一个艺术可控的解析主动画驱动具有自然拖尾的次级软体，同时避免逐帧 CPU 回读？**

## 研究问题

- [x] 水母主体、钟口、口腕和触手分别如何生成与运动？
- [x] GPU 弹簧数据如何组织，解析钟体如何与软体节点连接？
- [x] 程序化材质、假体积光和选择性 Bloom 如何协作？
- [x] 上游能否作为固定版本依赖被独立 Demo 获取并构建？
- [x] 同一求解器能否驱动非生物建筑与可读品牌字形，并在多种状态间保持可逆物理因果？
- [ ] 不同桌面和移动 GPU 上的帧率、显存与兼容性表现如何？

## 结论摘要

- **已验证：** 上游使用 `three/webgpu` 和 TSL Compute；默认创建 10 只水母，钟口、口腕和触手共享一套 GPU 弹簧位置缓冲，渲染顶点直接读取该缓冲。
- **已验证：** 按循环结构静态推导，场景约有 32,400 个物理点与 92,920 根弹簧；主体网格、浮游物、光柱和 Bloom 同样为程序化生成。
- **已验证：** 本项目能够通过固定 Git commit 的 npm Git 依赖获取上游源码，并由独立 Vite 子项目构建。
- **推断：** `MedusaVerletBridge` 所代表的“解析锚点 + GPU 次级运动”模式，比水母这一具体视觉更有复用价值。
- **评价：** 它是优秀的 WebGPU 教学和创意技术参考，但缺少公共 API、类型、测试、降级路径和通用求解器边界，不应直接作为生产物理库。
- **R3 已验证：** 形态层与输入层可以拆开；同一低/中/高频状态接口已经驱动流体花、能量织带与数据生命体，说明可迁移价值不局限于水母或软体生物。
- **R6 已验证：** 解析锚点不只可以跟随水母钟体，也可以编码字形记忆；1,264 个可见品牌节点能由同一 GPU 弹簧网络展开为空间轨道并连续召回为可读 AURELIA。

## 能力地图

| 能力 | 画面证据 | 关键实现 | 可迁移价值 |
| --- | --- | --- | --- |
| 解析钟形体 | 周期性收缩、边缘波纹 | `medusaBellFormula.js` | 用少量参数生成可控主动画 |
| GPU 弹簧软体 | 钟口与触手拖尾 | `physics/verletPhysics.js` | 并行处理大批次次级运动 |
| 主体—软体桥接 | 根节点随钟体、末端自然摆动 | `medusaVerletBridge.js` | 混合确定性动画与物理 |
| 缓冲驱动表面 | 离散点形成管状触手和带状口腕 | `medusaTentacles.js`、`medusaOralArms.js` | 避免 GPU→CPU 位置回读 |
| 程序化光色 | 花纹、雾、浮游物、光柱 | `medusaBellPattern.js`、`background.js`、`godrays.js` | 无外部贴图的统一视觉系统 |
| MRT Bloom | 交互时颜色和辉光同步变化 | `app.js` | 材质级选择性后处理 |

## 架构速览

```text
CPU：创建拓扑、弹簧邻接、每只水母的位姿与相位
  ↓ bake
GPU Storage Buffer：position / force / spring endpoints / adjacency
  ↓ 每个固定子步
Bridge Kernel：把固定根节点重新绑定到解析钟形体
  ↓
Spring Kernel：每根弹簧计算伸缩力
  ↓
Vertex Kernel：按邻接表汇总力、阻尼并更新位置
  ↓
Node Material：读取位置缓冲，重建表面并生成颜色、透明度、雾
  ↓
MRT：scene color + bloomIntensity/charge → Bloom → 最终输出
```

详细数据结构、规模推导与物理边界见 [`notes/architecture.md`](notes/architecture.md)。

## 关键实现

### 1. 解析主体

`getBellPosition(phase, zenith, azimuth, bottomFactor)` 用正弦相位控制半径和极角，并在靠近钟口处混入 16 次环向波纹及时变噪声。钟体无需骨骼、模型或 morph target。

### 2. GPU 弹簧

`VerletPhysics.bake()` 将对象图转成适合 GPU 的连续数组：顶点位置、弹簧端点、静止长度、每个顶点的邻接范围，以及带正负方向的弹簧索引。运行时先按弹簧计算力，再按顶点汇总。

### 3. 解析锚点与软体桥

固定点每个子步由钟体解析公式重新定位，非固定点继续接受弹簧力。这使钟体收缩能够稳定传递到钟口、口腕和触手，而不需要 CPU 逐点更新。

### 4. GPU 表面重建

触手渲染顶点只保存两个物理点 ID、截面角和半径；口腕渲染顶点保存四个物理点 ID及侧向偏移。顶点着色器读取物理位置后计算切线、法线和表面位置。

### 5. 光色与后处理

TSL 节点生成噪声花纹、距离雾、焦散式环境光和浮游物。材质通过 MRT 输出发光强度与 `charge`，Bloom 只作用于需要辉光的区域。

## 实验与验证

| 验证问题 | 方法 | 结果 | 证据 | 限制 |
| --- | --- | --- | --- | --- |
| 上游是否可获取 | 克隆并检出完整 commit | 成功固定到 `724aba2` | 上游 commit 链接 | 未依赖 tag/release |
| 上游基线能否构建 | `npm ci && npm run build` | 成功 | 本地命令记录 | 不代表 GPU 运行正确 |
| 能否作为子项目依赖获取 | 固定 commit 的 npm Git 依赖 + 构建前 TSL 转换 | 成功，22 个上游源码文件可重复准备并构建 | Demo `package.json`、`scripts/prepare-upstream.mjs` | 上游没有公共 exports，升级可能破坏适配 |
| 能力说明是否脱离画布可读 | 桌面与 390×844 视口可视检查 | 通过，说明和控制为独立 DOM，移动端无横向溢出 | 本地验证截图（不入库） | 尚未覆盖屏幕阅读器专项审计 |
| WebGPU 真实运行 | Windows Chrome 硬件 WebGPU 启动，操作弹簧与脉冲 | 通过，单画布运行、控件状态正确、控制台无错误 | 本地 Puppeteer 运行记录（不入库） | 单机样本，观察到约 26 FPS，不代表跨 GPU 基准 |

## 优点与局限

### 优点

- 全程序化，研究不被外部模型与贴图质量干扰；
- CPU 与 GPU 职责清晰，物理结果不需要逐帧读回；
- 主动画与次级运动连接自然，视觉结果具有较高完成度；
- MIT 许可证允许在保留声明的前提下修改和再发布。

### 局限

- 上游 `package.json` 标记为 `private`，没有公共 API 或语义化发布；
- 入口主动拒绝非 WebGPU 后端，而 Compute 路径也没有 CPU/WebGL 替代；
- 名称虽然使用 Verlet，但积分没有保存上一帧位置，更接近固定步长的阻尼速度—弹簧积分；
- 固定 360 Hz 子步会在典型 60 FPS 下产生多次串行 Compute 调度；
- 大量对象关闭视锥裁剪，透明对象依赖手工排序；
- 没有碰撞、自碰撞、质量、XPBD 柔度或正式性能基准。

## 可复用结论

- 将可控主体写成解析函数，再把软体根节点绑定到函数表面，可以同时获得设计可控性和自然次级运动。
- GPU 模拟数据直接供顶点着色器消费，比每帧读回 CPU 再更新几何更适合高密度程序化生物。
- 把发光强度作为 MRT 数据显式输出，可以建立材质级而非整屏级的后处理控制。
- 创意 Demo 的物理参数通常与固定步长深度耦合；抽取成库前，应先明确积分器、单位和稳定性契约。

## R2：扩展实验室

在保留默认能力演示的基础上，新增独立的 [`lab.html`](../../apps/001-holtsetio-aurelia/lab.html)。它把“值得复用”进一步变成可观察的工程问题：

- 轻量、均衡、完整三档分别创建 1、3、10 个真实实例，而不是仅切换可见性；
- GPU 物理工作集随档位从 3,240 点 / 9,292 弹簧扩展到 32,400 点 / 92,920 弹簧；
- 固定子步频率可选择 120、240、360 Hz，并同时约束 DPR 和浮游物密度；
- 生命、结构、能量视图分别强调主次动画桥接、弹簧约束和 `charge`—Bloom 状态联动；
- 阻尼与 Bloom 可以实时调节，档位切换则通过整页重建保证 GPU 资源释放边界清晰。

这次扩展也暴露并修正了一个重要的产品化问题：上游出生位置用 `medusaId / 10` 写死。实例数下降后，水母会全部生成在镜头下方。构建适配只在实验室配置存在时按实际实例数重新居中，基线继续执行原公式。详细契约和验证矩阵见 [`notes/extension-lab.md`](notes/extension-lab.md)。

## R3：声音驱动形态实验室

新增独立的 [`morph.html`](../../apps/001-holtsetio-aurelia/morph.html)，回答“只能沿水母这一种形态扩展吗”：不能，也不必。这个入口保留 Aurelia 的实时程序化思想和深海视觉语言，但不复用上游水母几何或物理实现；它刻意建立三种不同的结构语言：

- 流体花使用放射花瓣、核心与实例化花粉；
- 能量织带逐帧更新带状 `BufferGeometry`，形成连续传播表面；
- 数据生命体把实例节点、动态图边和轨道组合成网络对象。

浏览器内原创 Web Audio 生成低频脉冲、五声音阶和声与高频颗粒，`AnalyserNode` 将真实频谱压缩为 `low / mid / high` 三个连续控制量。各形态以不同映射消费这三个值，切换形态时音频时间线保持连续。由此形成一个更通用的结构：

```text
音乐 / 实时数据 / 用户动作 / 业务事件
                 ↓ 标准化连续状态
     low · mid · high（可替换为任意命名参数）
                 ↓ 映射层
  花瓣 / 织带 / 节点网络 / 未来的新形态
```

对我们的直接价值不是“多三个视觉效果”，而是得到一个可继续产品化的实时表现内核：输入源、状态映射和形态渲染彼此解耦。它可以进入品牌开场、音乐可视化、展览装置、数据叙事、实时舞台背景与产品状态表达；下一步若接入已有音乐，仅需增加媒体元素或文件源适配器，若接入业务数据则可直接替换 analyser 输出。详细设计边界和验证结果见 [`notes/morph-lab.md`](notes/morph-lab.md)。

## R4：Sonic Genesis 视觉重构

R3 证明了架构可替换，但画面仍是常规材质与基础几何组成的技术草图，缺少原水母的 GPU 次级运动、程序化表面、空间氛围和后处理协同。R4 没有用更强的亮度掩盖这个差距，而是重建了视觉层级：

- 三种形态都拆成主体、内部结构、能量轮廓、粒子/轨迹、空间光场五层；
- 星云花使用 30 片实例化曲面膜翼、合并光丝、晶核、光环与两类轨道粒子；
- 时空织体使用 14 条实时重建的带状膜、双重环面结、流动节点与空间门；
- 量子生命体使用嵌套晶体、210 个神经节点、动态图边、七重轨道与外层卫星；
- WebGPU PostProcessing 提供受控 Bloom，高频峰值与低频起音通过对象池触发冲击波和碎片喷发；
- 形态切换采用可中断的离场—重组—入场状态机，快速连续切换不会遗留多个场景；
- 桌面限制渲染分辨率以平衡多层透明与 Bloom，窄屏减少粒子/节点并改变镜头距离。

这次重构的意义是把“可复用内核”推进到“可用作主视觉的表现系统”：连续参数负责形变，离散峰值负责视觉事件，转场状态机负责叙事连续性，质量预算负责不同设备。它比单独复制水母造型更接近可持续扩展的创意技术资产。

## R5：Creative Directions 与 Resonant Matter

新增 [`directions.html`](../../apps/001-holtsetio-aurelia/directions.html) 与 [`resonance.html`](../../apps/001-holtsetio-aurelia/resonance.html)。前者把横向扩展整理成十个有顺序、有状态的作品方向；后者先完成 Direction 01「声场雕塑」，避免一次生成大量低完成度换皮形态。

Resonant Matter 将数据链重新接回上游 `VerletPhysics`：桌面由 24 片交叉张拉膜组成，实际作品拓扑为 3,120 个 GPU 节点和约 13,200 个约束，以 180 steps/s 求解。音频不会直接缩放场景，而是改变上下锚环的半径、跨度、相位和局部行波；锚点变化经过弹簧计算与位置积分后，膜面 `positionNode` 和弹簧线框再从同一 storage buffer 读取结果。TSL MRT 只对材料声明的结构边缘做选择性 Bloom。

实现中真实 GPU 回读发现自定义独立拓扑的 position storage index 0 会出现非有限值，并沿约束传播。Direction 01 隔离了一个不参与表面和约束的 guard 槽，同时降低高连接度膜网刚度并增加耗散；最终回读确认全部 3,120 个作品节点保持有限，半径约为 2.75–5.85。这个问题也说明直接复用求解器并不等于直接复用水母参数：新的拓扑仍需要稳定性校准。

完成后的视觉不再以中心球或粒子烟花为主角，而是上下锚环、交叉膜翼、暗色虹彩表面和弱线框构成的建筑性轮廓。硬件 Chrome 最终短时观察约 79–87 FPS，移动档位自动降为约 1,600 个节点、6,700 根约束和 120 steps/s；这只代表当前机器。Direction 02–05 依次为活体品牌、可演奏空间、引力织体和数据生命网络，另外记录记忆合金、声学黑洞、拓扑气候、晶体语法与群体字形作为候选。详细契约与证据见 [`notes/creative-directions.md`](notes/creative-directions.md)。

## R6：Living Identity / 活体品牌

新增 [`identity.html`](../../apps/001-holtsetio-aurelia/identity.html)，把 Direction 02 从路线图推进为第二件独立作品。它先在离屏 Canvas 中按设备档位采样 AURELIA 字形，再为每个样本生成两类物理点：隐藏的固定形状记忆锚与可见的自由节点。零静止长度 tether 负责召回，同字母的水平、纵向、对角与稀疏远邻弹簧负责局部连续性。

桌面拓扑包含 1,264 个可见节点、2,529 个总顶点（含 1,264 个锚点和 1 个隔离 guard）以及 6,382 根约束，以 160 steps/s 求解。解构不是从字形模型切到轨道模型：GPU bridge 连续把同一批锚点从平面字形插值到七个环向局部拓扑面，Aurelia 弹簧再拖动自由节点，渲染节点和结构线始终读取同一个 position storage。凝聚力滑杆还会在 GPU 上改变每根 tether 的 stiffness。

低频控制环形拓扑的空间深度，中频改变全局轨道相位，高频沿节点相位产生电荷并触发池化的信号切片；召回用有上限的椭圆环表达形状记忆。静音保留 analyser 和视觉，暂停后频谱衰减且瞬态对象归还对象池。无 WebGPU 时，页面保留真实 DOM 字标、概念/状态说明和可运行声音，而不伪造计算动画。

真实 GPU 回读确认全部 1,264 个显示节点为有限值，完全解构后的空间包围盒约为 `x -4.14..4.16 / y -1.28..1.25 / z -3.05..3.25`。桌面多个状态的本机短时观察约 55–67 FPS；移动档位自动变为 654 个显示节点、约 3,100 根约束、110 steps/s，并通过窄屏字宽和镜头策略保持完整字标。方向 01 保持不变，方向总览现将 01/02 标为 `LIVE`、03 标为 `NEXT`。设计、VFX/音频预算和完整验证矩阵见 [`notes/living-identity.md`](notes/living-identity.md)。

## 展示素材

本条目不提交上游截图或生成封面；本地浏览器验收截图分别保存在被 Git 忽略的 `validation-artifacts/001-aurelia/`、`validation-artifacts/001-aurelia-morph/`、`validation-artifacts/001-aurelia-directions/`、`validation-artifacts/001-aurelia-identity/`、`validation-artifacts/001-aurelia-atlas/` 与 `validation-artifacts/001-aurelia-rain/`。素材记录规则见 [`assets/README.md`](assets/README.md)。

## R8：Field Atlas / 创意研究图谱

新增 [`atlas.html`](../../apps/001-holtsetio-aurelia/atlas.html)，把此前分散的方向构想整理为一条可持续复用的方法链：`现实观察 → 物理抽象 → 技术模块 → 交互扩展 → 产品形态`。图谱保留原规划的十个方向与真实交付状态，并加入雨伞、晾衣绳、地铁人流、毛笔墨水、树影窗帘、磁铁铁屑和群体同步七类现实观察。

每个观察都明确固定点、自由度、约束、场、冲击、时间和可输入变量，再连接到九层技术研究与十种指针/交互模块。页面支持状态筛选、案例详情、方向/技术/模块联动高亮和 hash 深链；禁用 JavaScript 时核心正文仍完整保留。详细内容、研发优先级和浏览器覆盖记录见 [`notes/research-atlas.md`](notes/research-atlas.md)。

## R9：图谱查漏补缺

在 R8 初版上新增蛛网露珠、潮汐沙面、玻璃凝露、鸟群鱼群与根系菌丝，使现实样本从 7 个扩为 12 个，并补足脆性碰撞、侵蚀沉积、相变、群体运动和生长修剪机制。技术研究从 9 层扩为 13 层，将接触/碰撞、历史/重放、空间声化与可观测性从大类描述中独立出来。

十个原规划方向现在各自拥有下一最小实验、缺失内核、可量测成功标准与产品桥接；十个交互模块增加四种组合配方，并用因果可读、数值稳定、预算明确、数据诚实和降级保义五项质量门约束作品化。Web 页面同时增加现实案例的机制筛选与第七章实验矩阵，详细 R9 覆盖证据仍记录在 [`notes/research-atlas.md`](notes/research-atlas.md)。

## R10：Rain Membrane / 雨落伞面

新增 [`rain.html`](../../apps/001-holtsetio-aurelia/rain.html)，把图谱中的第一个现实观察推进为可运行作品。伞面使用 854 个 GPU 节点与约 3,300 根约束：外缘、中心和 12 根伞骨的隐藏固定锚维持结构，其他节点经 Aurelia `VerletPhysics` 接收有起点、有传播时间和衰减的冲击力。膜面、约束线、雨滴、飞溅和积水高光都读取或映射同一组冲击与湿润状态。

该样例新增三个可迁移内核：八槽冲击历史、可变湿载荷/张力桥和 GPU 能量边界。快速重击曾使自由节点超过材料允许范围；最终实现用速度预算、相对基形位移预算和 GPU reset kernel 保证可恢复，同时保留可见的局部响应。Web Audio 雨琴将张力与积水映射到基频、滤波和撞击音阶，不依赖外部音乐文件。

它证明的不是“能画一把伞”，而是 `离散事件 → 约束传播 → 时间积累 → 系统再调谐` 可以成为可复用体验语法。相同机制可以迁移到建筑膜面、天气品牌、触觉界面、实时降雨数据雕塑和材料状态声化。实现边界、设计契约与浏览器矩阵见 [`notes/rain-umbrella.md`](notes/rain-umbrella.md)。

## Web Demo

- 源码：[`apps/001-holtsetio-aurelia/`](../../apps/001-holtsetio-aurelia/)
- 在线地址：`https://yydshly.github.io/0902_codex_project/demos/001-holtsetio-aurelia/`
- 验证边界：运行真实上游实现，并解释四类核心能力；不证明科学准确性、全浏览器兼容性或生产性能。

## 来源与相关链接

- [上游仓库](https://github.com/holtsetio/aurelia/)
- [固定研究基线](https://github.com/holtsetio/aurelia/tree/724aba263459d1b11a49b72bfc7ce8baac840ca8)
- [Three.js WebGPURenderer](https://threejs.org/manual/en/webgpurenderer)
- [Three.js TSL 规范](https://threejs.org/docs/TSL.html)
- [MDN WebGPU API](https://developer.mozilla.org/en-US/docs/Web/API/WebGPU_API)

## 变更记录

- `2026-09-03`：创建研究条目、固定上游版本并增加能力演示子项目。
- `2026-09-03`：完成构建前 TSL 适配、硬件 WebGPU 交互验证和移动视口检查，状态更新为 `validated`。
- `2026-09-03`：保留基线并新增质量档位、运行指标、观察模式和参数控制扩展实验室。
- `2026-09-03`：新增三种非水母程序化形态、原创 Web Audio 声场与实时频谱映射，完成桌面、移动和降级验证。
- `2026-09-03`：将 Morph Lab 重构为 Sonic Genesis，增加五层形态、WebGPU Bloom、音频瞬态 VFX、可中断转场与移动端质量预算。
- `2026-09-03`：新增 Creative Directions 十方向索引与 Direction 01 Resonant Matter，以真实 Aurelia GPU 弹簧、缓冲驱动膜面和音乐锚点完成非生物声场雕塑。
- `2026-09-03`：完成 Direction 02 Living Identity，以字形采样、隐藏记忆锚、GPU tether stiffness、空间解构与物理召回验证动态品牌方向。
- `2026-09-03`：新增 Field Atlas，将原十方向、七类现实观察、九层技术研究和十种交互模块组织为可查询、可深链的 Web 研究图谱。
- `2026-09-03`：完成 Field Atlas R9 查漏补缺，扩为十二个现实观察、十三层技术研究，并增加四个组合配方、十方向实验矩阵和五项作品化质量门。
- `2026-09-03`：完成 Field Prototype 01 Rain Membrane，以雨滴冲击、伞骨锚、湿载荷记忆、GPU 能量边界和程序化雨琴验证首个现实机制样例。
