# Aurelia Morph Lab 交付契约

## 设计契约

| 字段 | 约定 |
| --- | --- |
| Entry mode | Revision-led：在基线与 Control Lab 之外新增第三个创意入口 |
| Request revision | R4：从多形态技术草图升级为视觉完成度高于原水母的电影级音画主视觉 |
| Target user and context | 需要评估程序化 GPU 视觉在品牌、装置、数据艺术中可塑性的创意技术人员 |
| Desired first impression | 第一眼先被一个具有巨大尺度、内部能量和空间纵深的“活体声场”吸引，再发现它可切换三套不同形态 |
| Visual ambition | Immersive |
| Experience architecture | Spatial Stage |
| Scene base | Three.js `WebGPURenderer` + TSL/PostProcessing；程序化几何、实例、动态带状网格、粒子场、光环与 Bloom |
| Scene persistence | 选择形态、播放音乐和调节音量时始终可见 |
| Foreground control model | 左侧形态选择，右侧音频映射与频谱，底部音乐运输控制 |
| State-to-scene mapping | 低频控制体积脉冲和冲击波，中频控制表面流动和空间扭转，高频触发粒子喷发、能量闪络和 Bloom；形态切换使用离场—变形—入场转场 |
| Mobile transformation | 形态按钮成为底部紧凑卡，音频控制保持拇指可达，说明压缩为实时频谱条 |
| Fallback | WebGPU 不可用时保留形态与音乐映射说明；AudioContext 不可用时保持无声自主动画 |
| Visual constraints | 不复用水母轮廓；主视觉占据画面并压过 UI；每种形态至少包含主体、内部结构、能量轮廓、粒子/轨迹和空间光场五层；高光不过曝；三种形态拥有不同轮廓和运动逻辑 |
| Information constraints | 明确音乐为 Web Audio 实时生成、无外部音频文件；频谱来自实际 Analyser 输出 |
| Operation constraints | 音频必须由用户手势解锁；提供暂停、静音、音量、BPM；切换形态不重启音乐 |
| State constraints | locked、playing、paused、muted、background-suspended、unsupported 均有可见反馈 |
| Environment constraints | localhost/HTTPS；现代 WebGPU 与 Web Audio 浏览器；单一深色主题；无外部音乐版权与网络服务 |
| Primary journey | 选择形态 → 点击启动原创声场 → 观察三频段视觉响应 → 调节节奏/音量/静音 → 切换形态继续播放 |
| Required artifacts | `morph.html`、程序化形态场景、原创音频引擎、响应式界面、README、浏览器与音频状态证据、构建 |
| Autonomy authorization | 用户明确要求沿多形态方向扩展，并允许生成或使用已有音乐 |
| User-decision boundary | 使用具体商业音乐、导入用户音频、录制发布视频或品牌定制需另行决定 |
| Observable completion criteria | 三种形态的首帧、运动轮廓与声频响应均明显不同；可观察到动态表面、内部结构、粒子、冲击波和后处理；切换具有连续转场；音频高频能触发瞬态视觉事件；主视觉层级强于控制面板；原有音频控制、移动端、键盘、reduced-motion 和能力降级仍可验证 |

## 路由结论

```text
Selected pattern: Audio-reactive procedural morph prototype
Evidence branch: Three.js WebGPURenderer + generated Web Audio + Analyser runtime
Required inputs: existing Aurelia visual language; no external audio asset required
Expected output: preserved baseline/control pages plus independently addressable Morph Lab
What should update the skill: none; evidence belongs to this project record
```

## 音频反馈地图

| 声音层 | 生成方式 | 视觉作用 | 无声等价反馈 |
| --- | --- | --- | --- |
| 低频脉冲 | 正弦/三角振荡器与短包络 | 形体呼吸、核心尺度、织带宽度 | `LOW` 频谱条与数值 |
| 中频和声 | 五声音阶振荡器、滤波与渐变包络 | 花瓣扭转、织带流速、节点轨道 | `MID` 频谱条与映射文字 |
| 高频颗粒 | 程序化噪声缓冲与短衰减 | 粒子闪烁、边缘亮度、细节尺度 | `HIGH` 频谱条与状态文案 |

## 覆盖清单

| 用户阶段 | 要求或产物 | 表面 / 状态 | 证据 | 阶段 | 状态 | 下一步 |
| --- | --- | --- | --- | --- | --- | --- |
| 保留 | 基线与 Control Lab 可独立进入 | `/`、`/lab.html` | 双向导航保留；三入口生产构建通过 | 1/9 | pass | — |
| 形态 | 流体花、能量织带、数据生命体有明显轮廓差异 | `/morph.html` 三状态 | 三状态真实 WebGPU 截图、`data-form` 与选中状态一致 | 2/5 | pass | — |
| 音乐 | 用户手势启动原创音乐，频谱驱动画面 | locked → playing | 实际 AudioContext/Analyser；LOW/MID/HIGH 均观察到非零值 | 5/6 | pass | — |
| 音频控制 | 暂停、恢复、静音、音量、BPM 状态一致 | playing/paused/muted | 132 BPM、暂停和静音语义状态验证；静音时频谱继续 | 4/6 | pass | — |
| 多表面 | 桌面、900px、390px 无遮挡或横向溢出 | 三个视口 | 响应式规则、1440×1000 与 390×844 实机截图，无横向溢出 | 3/7 | pass | — |
| 可访问性 | 键盘焦点、频谱文字等价物、reduced-motion | 键盘/媒体偏好 | 2px 可见焦点、数值与映射文字、`data-motion=reduced` | 7/8 | pass | — |
| 降级 | WebGPU 或 Web Audio 缺失时说明清楚 | unsupported | 模拟无 WebGPU：错误说明可见、形态禁用、音乐与频谱继续运行 | 6/8 | pass | — |
| 交付 | 文档、审计、三入口构建 | 子项目与仓库 | 子项目构建通过、0 漏洞、catalog 校验通过 | 9 | pass | 根目录聚合构建待其他活动项目释放文件锁后复跑 |
| R4 主视觉 | 主体具有超过原水母的层次、材质、光效与空间纵深 | 桌面三种形态 | 三种最终态均具备五层结构，硬件 WebGPU 截图通过 | 2 | pass | — |
| R4 动态 | 音频不仅连续缩放，还触发冲击波、闪络和粒子事件 | playing 三频状态 | 高频/低频上升沿触发复用池，最终截图可见环形波与碎片 | 5/6 | pass | — |
| R4 转场 | 三种形态切换连续、有明确离场和入场反馈 | flower → ribbon → organism | 切换 220ms 为 `active`，稳定态回到 `idle`；可中断路径不遗留场景 | 5 | pass | — |
| R4 层级 | 视觉主体先于界面被感知，控制仍清晰可达 | 1440、900、390 | 主体成为画面最大视觉面积；390px 控制、频谱和形态均可达且无溢出 | 2/3/7 | pass | — |
| R4 性能 | 增强效果在当前硬件保持可操作，移动/低动态偏好有节制版本 | full/reduced/mobile | 桌面短时约 31–53 FPS；移动初始加载 `quality=reduced`，独立镜头与预算生效 | 7/8 | pass | — |
| R4 交付 | 更新说明、构建与最终证据 | 子项目与研究记录 | 三入口生产构建、0 漏洞、真实浏览器全路径通过 | 9 | pass | — |

## 支持边界

- 本轮生成的是原创程序化声场，不下载或嵌入第三方商业音乐。
- 音乐不是 DAW 级作品；它的目标是提供稳定、可解释的低/中/高频控制信号和完整浏览器交互。
- 频谱与 FPS 都是当前运行环境的短时观察数据，不构成跨设备基准。
- 不增加麦克风、用户文件上传、流媒体服务、录音导出或后端存储。

## 验证记录

- Chrome 硬件 WebGPU 下三种形态均以单画布运行，页面控制台无应用错误；桌面观察帧率约 41–84 FPS，仅代表本机短时样本。
- 原创声场启动后观察到约 `LOW 0.82 / MID 0.25 / HIGH 0.13`；高频瞬态使用平均能量与峰值的组合，避免宽频段平均把短促打击稀释为零。
- 静音时 analyser 位于 master 输出之前，因此声音不可闻但实时信号与视觉响应继续；暂停时 AudioContext suspend，频段平滑衰减并回到自主动画。
- 模拟 `navigator.gpu` 缺失时，页面保持完整文字、原创音乐、频谱和运输控制；仅三维形态控制被禁用。
- 子项目 `npm run build` 与 `npm audit --audit-level=high` 通过，审计为 0 漏洞；根目录 catalog 校验为 4 个项目、编号严格递增。
- R4 在 1440×1000 Chrome 硬件 WebGPU 中观察到星云花约 53 FPS、时空织体约 31 FPS、量子生命体约 44 FPS；这是单机短时值，不是跨设备基准。
- R4 桌面将高成本画布像素比限制为 `0.65`，保留 DOM/UI 原生清晰度；390×844 从窄屏直接加载时为 `quality=reduced`，减少程序化节点与粒子并使用独立镜头距离。
- R4 浏览器回归中无 console/page error，三种稳定态均为 `transition=idle`；键盘首个焦点为跳转链接并显示 2px 轮廓，WebGPU 缺失时音乐、频谱和文本仍可运行。
