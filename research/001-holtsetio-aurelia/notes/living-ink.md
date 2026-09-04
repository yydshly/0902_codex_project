# Living Ink / 活体书法实验

## R26 设计契约

| 项目 | 决策 |
| --- | --- |
| Entry mode | Brief-led + scope revision；用户要求继续 FIELD 04，并明确指出既有页面风格同质化，要求更换视觉语言 |
| Target user and context | 设计师、品牌与交互研究者；需要直接体会输入如何沉积为带时间记忆的视觉资产 |
| Desired first impression | 一张会呼吸、会吸墨的明亮宣纸；不是深色监控台，也不是一组发光卡片 |
| Visual ambition | Immersive；东方编辑式留白、暖象牙纸、自然墨黑与朱砂印记，克制地展示技术层 |
| Experience architecture | Spatial Stage；纸面既是主视觉，也是直接书写、观察洇染与读取时间状态的操作面 |
| Selected pattern | Physics interaction + persistent WebGPU canvas；Aurelia 模拟笔锋约束，CanvasTexture 承载不可逆笔迹记忆 |
| Evidence branch | 图谱 `#case-ink` 的笔迹锚点 / 压力宽度 / 流体粒子 / 扩散场 / 时间记忆；现有 Three.js WebGPU 与 Aurelia `VerletPhysics` |
| Required inputs | 鼠标、触控或 PointerEvent pressure；力度、含水量、纸张吸收三个可编辑变量；无外部资产与真实识别服务 |
| Expected output | 独立 `ink.html`；可直接落笔、自动示范、三种墨法、清纸、结构透视、实时指标、响应式与 2D fallback |
| Primary journey | 进入纸面 → 按住拖动书写 → 看到压力改变宽度、速度产生飞白、含水量控制洇染 → 停笔后观察扩散与干燥记忆 → 切换墨法或打开笔锋结构 → 清纸重来 |
| User-defined phases | 保留所有既有样例；本轮新增 FIELD 04，并以不同视觉系统打破系列同质化 |
| Autonomy authorization | 用户连续要求“继续”，并明确授权更换页面风格；允许新增本场景及必要入口、说明和验证记录 |
| Scene base | Three.js `WebGPURenderer` + Aurelia GPU 笔锋约束 + 2D ink deposition CanvasTexture；DOM 只承担可读操作与解释 |
| Scene persistence | 宣纸在整个主旅程持续可见；控制、因果阶段与指标贴近纸缘，不进入另一个长页面 |
| Foreground control model | 纸面拖动是唯一主操作；墨法、力度、含水、吸收、结构、示范与清纸为次级工具 |
| State-to-scene mapping | contact=墨核落纸；drag=压力宽度/速度飞白；diffuse=湿边沿纤维扩散；remember=墨色沉积并显示干燥年龄 |
| Mobile transformation | 390px 将标题与指标压到纸缘，底部工具改为可横向滚动的浅色工具托盘；画布仍占主视口 |
| Fallback | `?fallback=1` 或无 WebGPU 时使用可直接书写的 2D 宣纸；明确说明 GPU 笔锋约束未运行，但不丢失核心落笔旅程 |
| Support boundary | light-only 纸本艺术主题；桌面、平板、390px；pointer/touch/keyboard；`prefers-reduced-motion`；WebGPU capability fallback |
| Non-goals | 不做书法风格鉴定、汉字识别、真实流体或纸张材料标定；不把程序结果宣称为传统书法作品 |

## 视觉方向与可观察约束

| 决策 | 选择 | 可观察约束 | 验收标准 |
| --- | --- | --- | --- |
| 构图 | 暖色宣纸占据中央，标题像展签而非仪表盘，工具沿纸缘排布 | 首屏先看到可书写纸面和已有一笔，不先看到控制卡片 | 1280×720 与 390×844 都保留大于半屏的连续书写区域 |
| 焦点层级 | 黑色活体笔迹第一，朱砂落款第二，变量和技术证明第三 | 仅朱砂承担强调色；不用霓虹、Bloom 或深色玻璃面板制造焦点 | 默认态一眼可判断“可写、会洇、会干” |
| 材质 | CSS 纸纤维 + WebGPU 纸板阴影 + CanvasTexture 墨层 | 纸纹不能干扰文字与笔迹；墨边应有浓淡、断续和毛细扩散 | 慢压、快扫与高含水三种动作具有不同轮廓 |
| 运动 | 笔锋跟手，湿边缓慢扩散，飞墨短促并有上限 | 没有循环闪烁；停止输入后运动逐渐收敛 | reduced-motion 保留状态变化但减少飞墨与持续漂移 |
| 技术可见性 | 默认只见自然笔锋；结构透视显示 Aurelia 节点与弹簧 | 技术层不能永久压过墨迹 | 切换结构前后，书写、清纸和指标保持一致 |
| 操作 | 拖动写字，不复用轨道相机；按钮与键盘不抢纸面 | pointer capture；离开纸面不会留下失控长线；清纸可恢复 | mouse、touch、keyboard 都能完成核心旅程 |

## VFX 预算

| 效果 | 触发 / 含义 | 上限与清理 | reduced-motion |
| --- | --- | --- | --- |
| 墨核 | pointer down；接触纸面 | 单个复用笔尖，无泄漏 | 保留 |
| 飞白 | 快速拖动；墨量不足和纤维跳跃 | 每段最多 11 条受控鬃毛线，不创建 DOM | 保留但降低断裂频率 |
| 飞墨 | 高速或高压动作；动量溢出 | 桌面 96 / 移动 42 个对象池粒子，寿命后隐藏 | 数量降为 25% |
| 湿边 | 含水与吸收共同作用；毛细扩散 | 最多 320 个湿样本，达到干燥时间后沉积并移出活跃表 | 仍扩散，但更新频率降低 |
| 朱砂印 | 完成一笔或切换朱砂；记忆节点 | 1 个固定落款，不循环脉冲 | 静态 |

## 覆盖清单

| User phase | Requirement / artifact | Surface / state | Evidence needed | Stage | Status | Next action |
| --- | --- | --- | --- | --- | --- | --- |
| FIELD 04 | 新的明亮纸本视觉系统 | 1280×720 / default | browser screenshot、DOM、canvas | 1–3 | pass | 暖象牙宣纸、黑墨、朱砂、衬线/宋体、纸缘工具形成独立视觉家族，首屏纸面占主导 |
| FIELD 04 | 压力、速度、含水、吸收映射 | desktop / pointer | 慢压、快扫、湿画的轮廓与指标差异 | 5–6 | pass | 真实拖动后 stroke=1、pressure/speed/wet 同步；三变量分别进入宽度、飞白阈值与湿边寿命 |
| FIELD 04 | Aurelia 笔锋约束 | WebGPU / structure | 顶点、弹簧、GPU readback、笔尖跟随 | 4–6 | pass | 44 nodes / 53 springs；结构层可选；readback `FINITE · z 0.299..0.725 · 4.2ms` |
| FIELD 04 | 墨法、示范与清纸 | controls / keyboard | 三种墨法、自动示范、清理与焦点反馈 | 4–6 | pass | 浓墨/淡墨/朱砂共享笔锋，示范先清纸再书写，清纸恢复空白；原生控件和键盘路径可达 |
| FIELD 04 | 平板与手机 | 1024×768、390×844 / touch | screenshots、overflow、touch target、真实书写 | 7 | pass | 390×844 无页面横向/纵向溢出，纸面约 373×498px，底部工具内部滚动；真实拖动 stroke=1 |
| FIELD 04 | reduced motion | media/query / pointer | 事件状态保留、非必要粒子减少 | 7–8 | pass | `?motion=reduce` 保留落笔、扩散与指标，飞墨数量和更新频率降低 |
| FIELD 04 | WebGPU fallback | `?fallback=1` | 可书写 2D 纸面、边界说明、控制可用 | 8 | pass | runtime=fallback，仅保留可写 2D canvas；边界提示可见、结构按钮禁用，真实拖动 stroke=1 |
| 图谱连续性 | Metro → Ink → Atlas | links / hash | URL、案例入口、相邻导航 | 7 | pass | Vite 构建入口、Metro 下一样例、Ink 上一页/图谱链接与 Atlas `#case-ink` 直达均已接入 |
| 文档 | README、研究图谱、独立记录 | files | 内容与真实实现一致 | 9 | pass | 应用 README、研究 README、图谱状态与本记录同步为 FIELD 04 LIVE |
| 工程 | build、console、GPU readback、性能 | production/runtime | build、logs、finite sample、frame ms | 8–9 | pass | 多入口生产构建通过；新会话无 error/warning；GPU readback finite，观察帧时 4.2ms |

## Refinement ledger

| Current stage | User phase | Coverage item | Observed evidence | Root cause / intervention | Adjacent regression surfaces | Observed result | Decision |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 0 Goal lock | FIELD 04 | 风格与交付边界 | 用户指出既有样例都是同一种深色技术界面 | 放弃暗色监控台惯性，改用明亮纸本 Spatial Stage，并将“不同”写成构图、材质、层级和运动约束 | 既有样例、Atlas、mobile、fallback | 明亮纸本系统成立，未修改既有样例 | pass |
| 3 Structural | FIELD 04 | 可读层级 | 第一版 WebGPU 输出为黑底，fallback 提示被 CSS 覆盖为可见 | 接入显式 PostProcessing output，并增加 `.ink-error[hidden]` 约束 | desktop、fallback、loading | 纸面正常输出，默认不再显示错误提示 | pass |
| 4 Visual | FIELD 04 | 墨层对齐 | CanvasTexture 在目标浏览器中未稳定显现，初版结构线永久压过墨迹 | 将持久墨层对齐为纸面 DOM canvas overlay，默认隐藏结构透视 | resize、mobile、fallback、pointer | 墨迹与投影纸面准确重合，结构成为主动选择 | pass |
| 4 Visual | FIELD 04 | 笔迹质感 | 初始折线与逐段半透明叠加形成机械栅格和过密飞墨 | 使用三条连续 Bezier 迎宾笔迹、实色墨核、纤维细线、连接圆与受控喷溅阈值 | dense/pale/cinnabar、demo | 迎宾态和示范态连续，喷溅从主体退为事件反馈 | pass |
| 5 Interaction | FIELD 04 | 直接书写 | 桌面实际拖动 `340,440 → 810,310` | 同一 PointerEvent 进入 raycast、ink deposition 和 brush constraint bridge | mouse、pressure、clear | 方向一致，stroke=1、wet=34，笔尖停在拖动终点 | pass |
| 6 Fidelity | FIELD 04 | 物理证据 | 需要证明笔锋不是纯 CSS 跟随 | 开启结构层并执行 GPU storage readback | WebGPU、diagnostic | `FINITE · 44 nodes · z 0.299..0.725 · 4.2ms` | pass |
| 7 Responsive | FIELD 04 | 窄屏可写 | 390×844 首屏需要同时容纳标题、纸面、指标和工具 | 标题/墨法置顶、指标置于纸下、工具托盘内部横向滚动 | mobile、touch、safe viewport | 页面 overflowX/Y=0，真实拖动 stroke=1、wet=30 | pass |
| 8 Resilience | FIELD 04 | 低动态与无 GPU | 核心意义不能依赖 WebGPU 或高频粒子 | `motion=reduce` 降低喷溅/扩散频率；`fallback=1` 使用同一 InkPainter | reduced motion、fallback | fallback 仅一张 2D canvas、边界清楚、控件和拖动仍可用 | pass |
| 9 Delivery | FIELD 04 | 工程与连续性 | 新入口需进入现有多页项目且不破坏前序样例 | 补 Vite、Metro、Atlas、README 与研究图谱入口，执行生产构建和新会话日志检查 | routes、docs、build、console | FIELD 04 可独立访问并进入系列导航，生产构建和日志终检通过 | pass |
