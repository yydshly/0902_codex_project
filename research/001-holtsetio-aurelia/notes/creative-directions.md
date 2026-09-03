# Aurelia Creative Directions 交付契约

## 设计契约

| 字段 | 约定 |
| --- | --- |
| Entry mode | Revision-led：保留基线、Control Lab 与 Sonic Genesis，新增可依次扩展的创意方向作品集 |
| Request revision | R5：从“多形态演示”升级为每个方向拥有独立物理逻辑和视觉叙事的系列作品 |
| Target user and context | 评估 Aurelia 技术能否成为音乐、品牌、空间与数据艺术通用视觉内核的创意技术团队 |
| Desired first impression | 先看到一个具有明确尺度、张力和因果传播的非生物主视觉，再理解声音如何成为结构力 |
| Visual ambition | Immersive |
| Experience architecture | Spatial Stage；方向总览为索引，每个完成方向拥有独立持久舞台 |
| Scene base | Three.js `WebGPURenderer`、Aurelia `VerletPhysics`、GPU storage-buffer 表面、TSL MRT selective bloom |
| Scene persistence | 播放、暂停、冲击、张力调节和镜头操作期间始终可见 |
| Foreground control model | 顶部作品序列导航；左侧概念与状态；右侧声音到物理的实时映射；底部主操作 |
| State-to-scene mapping | locked 为自主呼吸；playing 时低频改变锚环尺度、中频改变扭转、高频形成行波；pulse 施加一次可见结构冲击；unsupported 保留完整说明与音频层 |
| Mobile transformation | 信息缩为上下紧凑覆盖层，频谱横排，主要操作保持拇指可达，舞台不转成长文档 |
| Fallback | 无 WebGPU 时保留作品概念、映射说明、系列导航和可运行音频；reduced-motion 降低镜头漂移与瞬态强度 |
| Visual constraints | 非水母、非中心发光球、非纯粒子烟花；主体必须有可辨识的建筑性轮廓；表面、线框和光效读取同一物理状态；Bloom 不能遮蔽结构 |
| Information constraints | 明示哪些方向已完成、正在实现和候选；不把路线图描述为已交付能力 |
| Operation constraints | 音频由手势解锁；支持暂停、静音、张力、冲击、重置；指针可扰动物理结构 |
| State constraints | locked、playing、paused、muted、background-suspended、pulse、unsupported 均有可见或语义反馈 |
| Environment constraints | localhost/HTTPS；现代 Chrome/Edge WebGPU；深色主题；无外部音乐版权、后端或网络依赖 |
| Primary journey | 进入方向总览 → 打开 Direction 01 → 启动声场 → 观察三频到结构的传播 → 手动施加冲击并拖动观察 → 返回总览理解后续顺序 |
| User-defined phases | 依次实现：01 声场雕塑；02 活体品牌；03 可演奏空间；04 引力织体；05 数据生命网络；其余作为候选方向继续评估 |
| Required artifacts | `directions.html`、`resonance.html`、GPU 物理作品、声音交互、响应式/降级界面、README 与浏览器证据 |
| Autonomy authorization | 用户明确要求依次实现这些方向，并允许继续考虑更优扩展 |
| User-decision boundary | 商业品牌资产、用户音乐文件、真实业务数据、录制发布包和外部部署需另行决定 |
| Observable completion criteria | Direction 01 真实调用 Aurelia GPU 求解器；音乐不是直接缩放整个模型；冲击沿膜翼传播并回弹；表面与线框来自同一 position storage；选择性 Bloom、桌面/移动布局、键盘、reduced-motion、WebGPU 降级和构建均有证据 |

## 路由结论

```text
Selected pattern: reusable spatial-node portfolio + physics interaction prototype
Evidence branch: Aurelia GPU Verlet solver + TSL storage-buffer surface + Web Audio analyser
Required inputs: pinned upstream solver and existing procedural audio engine; no external assets
Expected output: preserved existing demos, a direction index, and a high-fidelity Direction 01 work
What should update the skill: none; evidence remains in this project record
```

## 方向序列

| 序号 | 方向 | 独特机制 | 当前状态 |
| --- | --- | --- | --- |
| 01 | Resonant Matter / 声场雕塑 | 张拉膜、锚点驱动、结构行波 | 本轮实现 |
| 02 | Living Identity / 活体品牌 | 字形约束、解体与重构 | R6 已实现（见 `living-identity.md`） |
| 03 | Playable Space / 可演奏空间 | 触碰、发声、物理反馈闭环 | 下一方向 |
| 04 | Gravity Loom / 引力织体 | 吸引子、轨道和时空褶皱 | 待实现 |
| 05 | Signal Ecology / 数据生命网络 | 图拓扑、实时数据流和兴奋传播 | 待实现 |
| 06 | Memory Alloy / 记忆合金 | 受力变形与形状记忆 | 候选 |
| 07 | Acoustic Black Hole / 声学黑洞 | 声谱吸积盘与事件视界 | 候选 |
| 08 | Topological Climate / 拓扑气候 | 流形天气、云层和风场 | 候选 |
| 09 | Crystal Syntax / 晶体语法 | 规则生长、断裂和重排 | 候选 |
| 10 | Collective Glyph / 群体字形 | 群体智能形成可读符号 | 候选 |

## 覆盖清单

| 用户阶段 | 要求或产物 | 表面 / 状态 | 证据需要 | 阶段 | 状态 | 下一步 |
| --- | --- | --- | --- | --- | --- | --- |
| 保留 | 既有三个入口与功能不回退 | `/`、`/lab.html`、`/morph.html` | 五入口生产构建通过，原入口文件未替换并增加返回方向总览的导航 | 1/9 | pass | — |
| 总览 | 方向按完成/下一步/候选诚实呈现 | `/directions.html` 桌面/移动 | 10 张方向卡、仅 01 为 `LIVE`、02 为 `NEXT`；桌面全页截图无溢出 | 2/3/7 | pass | — |
| 作品 01 | 建筑性声场雕塑成为唯一主视觉 | `/resonance.html` locked/playing | 硬件 WebGPU 静止与播放/冲击截图均显示张拉膜、锚环和内部轨迹 | 2/5 | pass | — |
| 物理因果 | 锚点驱动真实 GPU 弹簧网络，表面读取同一缓冲 | playing/pulse/pointer | 3,120 个作品节点、约 13.2K 约束；GPU 回读全部作品节点有限；播放与冲击截图显示曲率变化 | 5/6 | pass | — |
| 音频 | 手势解锁、三频映射、暂停/静音正确 | 多个音频状态 | 真实 AudioContext/Analyser；播放态三频非零；静音 analyser 继续，暂停平滑衰减 | 4/5/6 | pass | — |
| 多表面 | 桌面和 390px 舞台无溢出与遮挡 | desktop/mobile | 1440×1000 与 390×844 实机截图；均无横向溢出，手机主操作和频谱可达 | 3/7 | pass | — |
| 可访问性 | 键盘、可见焦点、语义状态、reduced-motion | keyboard/media | 首次 Tab 到跳转链接且为 2px 焦点；按钮 pressed 状态与 body 状态一致；reduced-motion 被识别 | 7/8 | pass | — |
| 降级/性能 | WebGPU 缺失时仍可理解并操作音频；场景可操作 | fallback/full/reduced | 无 WebGPU 模拟中说明可见、视觉控制禁用而音频可用；桌面短时约 79–87 FPS，移动约 197 FPS | 8 | pass | — |
| 交付 | 文档与生产构建可重复 | 子项目 | README/研究记录已更新；五入口 `npm run build`、catalog 校验与页面回归通过 | 9 | pass | — |

## VFX 与音频反馈约束

- 结构冲击：由低频上升沿或“施加冲击”触发；属于作品本体；约 1.8 秒；轮廓为沿高度传播的环形波；最多同时 4 个；对象池复用；reduced-motion 只保留一次低强度亮度脉冲。
- 高频电荷：属于膜翼边缘；约 120–300ms；表达高频瞬态而不是持续噪声；同时最多 24 处；使用阈值与冷却时间限制触发。
- 音频状态：启动、暂停、静音和后台挂起有文字/按钮状态；首个声音必须由用户手势解锁；静音时 analyser 继续，暂停时能量平滑衰减。

## R5 支持边界（历史交付）

- 本轮交付作品序列的索引与 Direction 01；Direction 02–05 是明确顺序，不标记为已经完成的效果。
- 视觉增强需要 WebGPU；降级层保证内容与音频可用，但不伪造 Canvas 替代动画。
- 当前程序化声场用于稳定验证低/中/高频与离散起音，不等价于商业音乐制作。
- FPS 是本机 Chrome 短时样本，不构成跨显卡、浏览器或移动设备性能承诺。

Direction 02 已在后续 R6 中完成；其独立契约、实现边界与浏览器证据见 [`living-identity.md`](living-identity.md)。方向总览当前以 01/02 为 `LIVE`、03 为 `NEXT`。

## 验证记录

- Canonical runtime：`http://127.0.0.1:4175/`（Vite 请求 4174 后因端口占用自动选择 4175），2026-09-03，Chrome 硬件 WebGPU。
- Direction index：10 个方向、LIVE 链接指向 `./resonance.html`，无错误覆盖层和横向溢出。
- Resonant Matter 桌面档位：3,120 个作品物理点，加 1 个不参与渲染/约束的隔离 guard；约 13.2K 约束；180 steps/s。
- GPU buffer readback：全部 3,120 个作品点为有限值，半径约 2.75–5.85；guard 槽的后端异常值不进入任何 spring 或 geometry id。
- 真实音频观察：播放状态 low/mid/high 均出现非零值；静音时频谱继续，暂停后衰减；冲击状态和曲率变化可见。
- 最终短时性能观察：桌面约 79–87 FPS；移动约 197 FPS，自动缩为约 1.6K 节点、6.7K 约束、120 steps/s。只作为本机样本。
- 390×844：方向舞台、频谱和主控制均在首屏，无横向溢出；首次 Tab 聚焦“跳到作品控制”，焦点轮廓为 2px。
- 模拟 `navigator.gpu` 缺失：错误说明显示，冲击/张力/视角禁用，音频仍可启动并产生 analyser 数值。
- 浏览器各路径没有 console/page error；最终截图位于被忽略的 `validation-artifacts/001-aurelia-directions/`。
