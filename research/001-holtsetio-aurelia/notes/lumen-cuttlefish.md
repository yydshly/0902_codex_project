# Lumen Cuttlefish / 墨光乌贼群

## R31 设计契约

| 项目 | 决策 |
| --- | --- |
| Entry mode | Revision-led；R30 三候选未达到水母基准，用户要求先明确选题并选择一个主题做最佳探索 |
| Request revision | R31 |
| Target user and context | 创意技术、品牌与产品负责人；判断一个主题能否承载第二个旗舰级 WebGPU 作品 |
| Desired first impression | 第一眼看到的是一只有观察意图、鳍膜持续行波、触腕有惯性、皮肤内部有色素信号流动的深海乌贼，不是抽象几何或技术面板 |
| Visual ambition | Immersive |
| Experience architecture | Spatial Stage；单一持续 WebGPU 场景承担主体、空间、叙事和交互，DOM 只保留极少的身份、状态与动作 |
| Selected pattern | Cinematic living-creature showcase + spatial cause-and-effect |
| Evidence branch | Aurelia 原水母的 GPU Verlet、TSL NodeMaterial、MRT selective Bloom、群体相位与深海环境；R30 的扁平轮廓和界面过载作为反证 |
| Required inputs | 现有 Three.js 0.175 WebGPURenderer、TSL、Aurelia 通用 VerletPhysics、原创 Web Audio；不依赖外部 GLB 或占位模型 |
| Expected output | 新增 `cuttlefish.html`；一个英雄乌贼与远景群体；鳍膜/触腕/眼睛/色素波/墨云；pointer、signal、ink、sound、structure、reset；fallback 与研究记录 |
| Primary journey | 进入深海并观察自主漂浮 → 移动指针引起眼神、身体朝向和局部色素波 → 触发 SIGNAL 查看全身信号 → 触发 INK 观察墨云、逃逸和群体重组 → 打开结构查看真实参与运动的脊柱/触腕约束 → 重置 |
| User-defined phases | 第一：把选题扩展思考写入文档；第二：选择一个主题进行最佳优秀探索 |
| Required artifacts | 选题文档、设计契约、独立页面、样式、WebGPU 场景、音频、Vite 入口、README、桌面/平板/390px/reduced-motion/fallback/键盘/browser logs/build 证据 |
| Autonomy authorization | 用户明确要求选择一个主题并进行最佳探索；允许在现有子项目内新增独立可逆页面 |
| User-decision boundary | 不覆盖水母、竞技场或其他案例；不接真实业务与后端；不把本轮程序化资产称为已超越水母或 L4 商业模型 |
| Scene base | Three.js `WebGPURenderer`；TSL 节点材质与 MRT Bloom；触腕采用 GPU Verlet/弹簧缓冲，鳍膜与身体采用连续程序化表面 |
| Scene persistence | 场景贯穿全部操作；不滚动离开英雄主体 |
| Foreground control model | 左上只保留作品身份，右上保留水母基准/研究链接；右侧一条生命状态；底部四个主要动作；说明使用可折叠短句，不放评分板 |
| State-to-scene mapping | idle=安静巡游；pointer=眼神/朝向/局部色素波；signal=皮肤脉冲；ink=墨云/推进/群体散开；structure=骨架与触腕约束；audio=鳍膜速度、色素密度与低频呼吸 |
| Mobile transformation | 降低远景个体、触腕段数、墨粒和浮游物；保留英雄轮廓、眼神、信号、喷墨与主要控制；不出现横向滚动 |
| Fallback | `?fallback=1` 或 WebGPU 不可用时显示可呼吸、转眼、变色和喷墨的 CSS/Canvas 乌贼剪影；DOM 操作与能力边界仍清晰 |
| Support boundary | 单一深海主题；1280×720、1024×768、390×844；mouse/touch/keyboard；reduced-motion；WebGPU capability fallback |
| Non-goals | 不做科学级乌贼解剖；不从图片伪造 3D 模型；不靠全局 Bloom 掩盖轮廓；不把声音做成自动播放；不在首轮加入业务面板 |

## R31 视觉方向

| 层级 | 选择 | 可观察约束 |
| --- | --- | --- |
| Composition | 英雄乌贼位于偏右中景，头部和眼睛是焦点；两到四只远景个体形成深度三角 | 首屏静帧中主体不与文字或控制重叠，触腕至少保留 60% 可见长度 |
| Focal hierarchy | 先看到眼睛与虹彩头部，其次是鳍膜行波和触腕，最后才看到 DOM | DOM 面积不超过首屏约 18%，不出现数值评分墙 |
| Typography | 小型等宽技术标签 + 克制衬线中文标题 | 标题不超过两行，窄屏不遮挡主体眼睛 |
| Palette | 深钴蓝背景；琥珀/玫红色素细胞；青色结构；墨云为紫黑并带蓝边 | 暖色只集中在生命体和事件，不铺满背景 |
| Material | 半透明外膜、湿润高光、内部暖色器官、虹彩边缘、暗色眼球 | 表面/内部/边缘可在同一静帧辨认 |
| Depth | 程序化雾、光柱、浮游物、远景群体、墨云遮挡 | 至少出现前景粒子、中景英雄、后景个体三层视差 |
| Motion | 鳍膜快波、身体慢呼吸、触腕延迟、眼睛微动、色素传播、偶发群游 | 至少三种不同时间尺度；30 秒内不出现明显统一循环 |

## R31 覆盖清单

| User phase | Requirement / artifact | Surface / state | Evidence needed | Stage | Status | Next action |
| --- | --- | --- | --- | --- | --- | --- |
| 选题文档 | 水母选题原则、候选矩阵、最终决策 | research docs | file | 0 | pass | 已写入 `flagship-arena.md` 与本契约 |
| 可运行基线 | 新入口与持续主场景 | desktop / default | screenshot、DOM、runtime | 1 | pass | 1280×720 浏览器实测 `runtime=ready`，持续场景加载完成 |
| 英雄轮廓 | 身体、侧鳍、眼睛、腕冠和长触腕 | default / still frame | screenshot、visual review | 2 | pass | 第二轮改为更宽的乌贼外套膜、连续鳍缘、W 形瞳孔、两条横向展开的长触腕 |
| 物理与材质 | 触腕 GPU 约束、鳍膜行波、色素节点材质与选择性 Bloom | idle / structure | runtime、screenshot、metrics | 2 / 6 / 8 | pass | WebGPU 实测 268 个 Verlet 顶点、582 个弹簧、约 4696 个主体/触腕三角形；structure 显示真实约束线；材质警告已消除 |
| 生命交互 | 眼神、指针局部色波、signal、ink、reset | pointer / signal / ink | interaction、state | 4–6 | pass | pointer 事件直接写入凝视/朝向/物理射线；真实点击实测 `signal`、`ink` 与 `reset` 状态闭环 |
| 群体与空间 | 远景个体、雾、浮游物、光柱、墨云遮挡 | default / ink | screenshot、motion | 2 / 6 | pass | 桌面与窄屏静帧均可辨前景浮游物、中景英雄、后景群体；ink 实测触发紫黑遮挡、上浮与群体散开 |
| 声音 | 用户启动原创声场，频带连接生命状态 | locked / playing / muted | interaction、state | 4–6 | pass | 浏览器真实点击实测 `locked → playing → paused`，低中高频连接鳍膜、内脏呼吸与色素能量 |
| 跨表面 | 桌面、1024、390、键盘、reduced-motion | viewport / input / motion | screenshot、overflow、focus | 7 | pass | 1280×720、1024×768、390×844 均实测无页面溢出；`?motion=reduce` 实测 `motion=reduced`；动作均有键盘映射 |
| 能力降级 | forced/no WebGPU 可操作降级 | fallback | screenshot、controls、logs | 8 | pass | `?fallback=1` 实测 `runtime=fallback`，CSS 乌贼、能力说明与全部控制仍在 |
| 工程闭环 | Vite、README、build、console、diff | production | file、build、logs | 9 | pass | 15 入口生产构建通过；新页面与三处导航/README 已连接；最终浏览器日志无 error/warn |

## R31 浏览器证据与修订台账

验收日期：2026-09-04。固定入口：`http://127.0.0.1:4173/cuttlefish.html`。

| 观察到的问题 | 修订 | 结果 |
| --- | --- | --- |
| 第一版形态偏“可爱鱿鱼”，外套膜细长、眼睛像白色球体 | 加宽并压扁外套膜，重排鳍膜包络，改为琥珀虹彩眼与乌贼特征性的 W 形瞳孔 | 主体在桌面、平板、手机静帧中都能先于界面被识别 |
| 两条摄食触腕过长并被底部控制遮挡 | 缩短段长、增加横向 S 形扫掠，普通触腕改为向外展开 | 主要触腕进入首屏，结构模式仍能看见约束惯性 |
| TSL 材质启动时报告缺少 `normal` 属性 | 给程序化触腕几何补充占位 normal，最终法线仍由 `normalNode` 从物理位置计算 | 新启动日志不再出现该警告 |
| 墨云只有暗粒子，事件不够可读 | 叠加紫黑遮挡精灵、共享几何的紫色体积边光和群体散开 | 喷墨瞬间形成可见暗团与紫色颗粒，不再只依赖文字反馈 |
| 远景个体身体比例在循环中被二次缩放 | 将个体总体比例与身体呼吸比例分离 | 群体不再随呼吸产生纵向塌陷 |

### 实测状态

- 默认 WebGPU：`runtime=ready`；桌面多轮采样约 41–100 FPS，截图、首次着色器编译以及同时打开多个 WebGPU 验收页都会降低采样值，因此不把单次 FPS 当作承诺。
- 物理：268 个 GPU Verlet 顶点、582 个弹簧；内部结构按钮可视化同一组参与运动的约束，而不是单独的装饰线。
- 事件：`signal` 在身体表面形成从头部向上行进的暖色带；`ink` 同时改变墨粒、主体上浮、触腕外力与远景群体位置。
- 音频：必须由用户动作启动，实测可播放并暂停；不自动播放。
- 跨尺寸：1024×768 与 390×844 的 `scrollWidth-innerWidth`、`scrollHeight-innerHeight` 均为 0；手机端隐藏长说明并保留五个操作。
- 低动态与降级：`?motion=reduce` 使用 0.16 的运动系数；`?fallback=1` 显示 CSS 动态生命体和明确能力边界。

## R31 诚实边界

这一版已经是“选择正确主题后做完整因果系统”的旗舰探索，不再是竞技场里的轮廓草图；但它仍是程序化研究原型，不应宣称已经在造型精度、触腕规模或声音设计上全面超过源水母。它证明的是：只要选题同时具备辨识轮廓、连续柔体、可传播表面状态、主动行为和群体关系，就能复用 Aurelia 的底层思想，同时生成不同于水母的原创作品。下一轮如果追求商业级角色精度，应保留当前运行时系统，用定制雕刻模型和贴图替换外套膜/头部基础几何，而不是推翻交互与物理层。

## R32：真实运动与点击因果修订

用户复核指出：主体仍与真实乌贼差异很大，缺少可感知的鼠标点击和运动效果；随后明确允许使用大模型能力并以最终效果为准。本轮因此重开造型、运动、资产与输入四项覆盖，R31 的构建、降级、导航证据继续保留。

| 合同项 | R32 决策 |
| --- | --- |
| Entry mode | Revision-led repair；不新增另一个主题，修正已选主题的生物形态与因果反馈 |
| Desired first impression | 首屏先看到横向/斜向游动的乌贼，而不是竖直悬浮的水母轮廓；鳍缘、外套膜和腕足必须有不同节奏 |
| Asset state | R31 为 L1 程序化占位资产；R32 使用内置图像大模型生成色素胞皮肤细节，形成 L2 可检查的混合资产；仍不宣称 L4 电影级生物模型 |
| Primary journey | 自主斜向巡游 → 指针靠近触发凝视与轻微转向 → 点击身体/水体触发局部冲击环、色素闪变、外套膜收缩喷射和腕足延迟甩动 → 恢复巡游 |
| State mapping | hover=凝视/转向；poke=局部冲击和逃逸；signal=主动色素波；ink=强防御；structure=真实约束 |
| Autonomy authorization | 用户明确允许使用大模型能力并以最终效果为准；允许在当前页面内替换程序化视觉资产和运动控制 |
| Support boundary | 保持 WebGPU、1280/1024/390、reduced motion、fallback；生成纹理作为增强层，加载失败时仍使用程序化色素材质 |
| Completion criteria | 乌贼不再竖直；至少三种可区分的运动节奏；真实鼠标点击可见并写入状态；纹理不破坏动态色素；浏览器无错误；构建通过 |

### R32 覆盖清单

| Requirement | Evidence | Stage | Status | Next action |
| --- | --- | --- | --- | --- |
| 大模型皮肤资产 | workspace image、runtime screenshot | 2 / 8 | pass | 内置 ImageGen 生成 1254×1254 色素胞纹理并接入 TSL `colorNode`；加载失败仍保留程序化颜色 |
| 乌贼形态与姿态 | desktop/mobile screenshot | 2 / 7 | pass | 1280×720 与 390×844 实测为斜向游姿；缩窄外套膜、收紧环状鳍缘、减小眼睛并让腕足指向前进方向 |
| 自主运动 | browser observation | 2 / 6 | pass | 连续 `pose` 采样从 `0.09,0.55,1.09` 变为 `0.04,0.51,1.08`；鳍缘 x/y 轮廓、外套膜尺度和触腕均独立变化 |
| 点击反馈 | real click、DOM state、screenshot | 4 / 6 | pass | 浏览器真实点击主舞台得到 `event=poke`、`poke=body`；实测出现冲击环、色素带、外套膜收缩、位置避让与腕足外力 |
| 相邻状态 | signal/ink/structure/audio/reduced/fallback | browser | 6–8 | pass | signal、ink、structure、audio `playing→paused`、reset、`motion=reduced` 和 fallback 点击均复测通过 |
| 工程闭环 | build、logs、diff、docs | terminal/browser | 9 | pass | R32 生产构建通过；最终 WebGPU 与 reduced-motion 浏览器日志无 error/warn；覆盖清单关闭 |

### R32 资产生成记录

- 模式：OpenAI 内置 ImageGen；项目资产，不使用 CLI 或外部 API Key。
- 保存路径：`apps/001-holtsetio-aurelia/public/assets/cuttlefish-skin-v1.png`。
- 尺寸与预算：1254×1254 PNG，3,686,068 bytes，属于 A2（2–8 MB）范围；当前作为单个可选增强纹理。
- 最终提示词目标：生成一张用于 WebGPU 英雄乌贼外套膜的无缝宏观生物纹理，包含大量不规则色素胞、珍珠膜、细微乳突和克制的发光脉络；采用深蓝黑、烟紫、锈橙、冷青虹彩和珍珠高光；正交平铺、无动物轮廓、无眼睛/触腕、无文字/标志/水印、无方向性阴影。

### R32 浏览器修订证据

| Surface / state | Observed result |
| --- | --- |
| 1280×720 idle | `runtime=ready`、65 FPS 采样、248 个物理顶点、532 个弹簧、无溢出；斜向主体与文字/控制不重叠 |
| 1280×720 click | `event=poke`、`poke=body`；主体立即出现青色冲击环和三条暖色色素带，向点击反方向移动 |
| 708×898 idle/click | 150 个物理顶点、312 个弹簧，采样最高约 100 FPS；真实点击和恢复路径通过 |
| 390×844 idle | 无横纵溢出；斜向主体、完整腕足和五个底部动作保持可见 |
| reduced motion | `motion=reduced`、`runtime=ready`、无溢出、无 error/warn |
| forced fallback click | `runtime=fallback`、`event=poke`；CSS 乌贼沿斜向短促避让并闪变，无溢出 |

R32 仍不等于 L4 写实模型：它把资产从纯代码占位提升为带真实微观细节的混合资产，并修正了运动语法和点击因果；如果需要自然历史纪录片级近景，下一步仍是引入经过拓扑、骨骼/形变与授权检查的定制 GLB，而不是继续用后期效果掩盖基础几何上限。

## R33：全链路生命感修订

用户要求继续从各个角度持续优化。本轮采用 revision-led / Spatial Stage 路线：不再增加平行案例，也不以更多 Bloom 或粒子掩盖基础形态，而是同时重开生物解剖、动力因果、镜头稳定性、交互反馈、渲染成本与无障碍覆盖。2026-09-04 的 708×898 基线为 `runtime=ready`、约 103 FPS、150 个物理顶点、312 个弹簧且无溢出；可见缺口是腕足在部分角度发黑并与头部断开、双眼过于正面、喷射缺少可见动力来源、主体自主游动偶尔离开最佳构图。

| 合同项 | R33 决策 |
| --- | --- |
| Entry mode | Revision-led holistic refinement；保留 R32 的主题、WebGPU/TSL/GPU Verlet 与生成纹理资产 |
| Desired first impression | 先看见一个有方向、有推进器官、有观察行为的完整乌贼，而不是外套膜、眼睛和腕足的拼装体 |
| Visual ambition / architecture | Immersive / Spatial Stage；生命体继续承担空间记忆，DOM 承担叙事、控制与可访问状态 |
| Primary journey | 稳定巡游 → 指针接近进入观察 → 点击产生局部惊跳、虹吸喷流和反向推进 → 腕足延迟展开 → 平滑恢复巡游 |
| Visual constraints | 主体保持在安全构图区；眼睛转为侧向嵌入；腕冠遮蔽连接缝；腕足在暗背景中可读；远景群体只提供尺度和视差 |
| Motion constraints | 鳍膜、外套膜、虹吸喷流、位移与腕足必须处于同一因果链；reduced-motion 保留状态结果但降低位移与连续摆动 |
| Performance constraints | 不增加第二张大纹理；消除每帧对象分配；鳍膜法线按需降频；不牺牲点击、控制和主体辨识度换 FPS |
| Autonomy authorization | 用户明确要求继续并从各角度持续优化；允许在当前主题内直接调整造型、运动、光照、交互、性能和文档 |
| User-decision boundary | 不接后端或真实业务；不新增需要授权的外部模型；不把程序化混合资产宣称为 L4/L5 |
| Completion criteria | 真实浏览器中腕足不再黑成剪影，头腕连接完整；推进方向可从喷流和位移读出；桌面/708/390、键盘、reduced-motion、fallback 无回归；构建与日志通过 |

### R33 覆盖清单

| Requirement | Surface / state | Evidence | Stage | Status | Next action |
| --- | --- | --- | --- | --- | --- |
| 解剖连续性 | desktop / 708 idle | screenshot | 2 | pass | 浏览器实测侧向嵌入眼、腕冠和虹吸形成连续头腕关系；腕足换为双面基础节点材质后暗面不再黑成剪影 |
| 动力因果 | idle / hover / poke / ink | interaction、DOM、screenshot | 5–6 | pass | `glide/observe/startle/defense` 写入行为状态；真实点击命中本体并同时出现收缩、色波、喷流/压力环、反向位移和腕足延迟 |
| 构图与空间 | desktop / 708 / 390 | screenshot、overflow | 2 / 7 | pass | 1280×720 与 708×898 新版实测无溢出；保留 R32 的 390×844 五控件实测证据，R33 未改变同一断点的控制网格与相机边界；远景数量从 5 降至 4 并后移 |
| 控制与无障碍 | pointer / keyboard / focus | interaction、AX | 4 / 7 | pass | 受限拖动使相机从 `0.00,0.40,14.10` 变为 `2.99,2.33,13.63` 且无溢出；Enter 触发 signal，Tab 从 signal 顺序进入 ink 并显示青色 solid focus |
| 高成本渲染 | normal / reduced / fallback | metrics、logs | 8 | pass | 射线向量与运动指标改为复用，鳍膜法线隔帧更新；708 窄屏最终采样约 94 FPS；reduced-motion 点击与 forced fallback 点击均无 error/warn |
| 工程闭环 | files / build / browser | build、diff、logs | 9 | pass | R33 README 与研究记录已更新；最终生产构建、diff 与浏览器日志通过，无未关闭覆盖项 |

### R33 浏览器证据

| Surface / state | Observed result |
| --- | --- |
| 1280×720 idle | `runtime=ready`、248 个物理顶点、532 个弹簧、约 56–70 FPS 采样、无溢出；标题、生命地图、主体和五控件互不遮挡 |
| 1280×720 drag | 真实拖动后相机位置改变且保持在方位/俯仰限制内；主体仍留在安全构图区，拖动方向采用反向 `rotateSpeed` 使视觉跟手 |
| 1280×720 keyboard | `signal-trigger` 的 Enter 触发 `event=signal`；Tab 后焦点进入 `ink-trigger`，computed outline 为 cyan solid |
| 708×898 idle | `runtime=ready`、150 个物理顶点、312 个弹簧、最终约 94 FPS、无溢出；侧向眼、腕冠、鳍缘与腕足均可辨认 |
| poke / adjacent states | 真实点击得到 `event=poke`、`poke=body`、`behavior=startle`；structure、ink=`defense`、audio=`playing→paused` 与 reset=`glide` 均通过 |
| reduced motion | `motion=reduced`、`runtime=ready`；点击仍得到 `poke=body/startle`，无溢出与 error/warn |
| forced fallback | `runtime=fallback`；点击得到 `poke=water/startle`，CSS 生命体、说明和五个语义按钮保持可操作且无 error/warn |

R33 的结论仍然受资产级别约束：这轮显著改善了程序化几何的连接、运动逻辑和观察体验，但没有凭借节点材质把 L2 混合资产冒充为 L4 自然历史模型。需要近景写实时，下一步依旧是定制拓扑、雕刻纹理和形变/骨骼资产替换；当前 WebGPU 物理、交互和状态机可以继续复用。

## R34：默认运动可感知性修订

用户在真实页面中指出“没有运动效果”。2026-09-04 于固定入口 `http://127.0.0.1:4173/cuttlefish.html`、708×898、默认深潜状态复现：间隔 1.5 秒的 `pose` 从 `-0.13,0.77,1.10,0.000,0.000` 变为 `-0.15,0.76,1.10,0.000,0.000`，两张截图几乎不可区分。根因不是渲染循环停止，而是巡游位移和转向低于像素感知阈值，同时 `sin^10` 喷射脉冲过窄，观察窗口中常同时得到 `squeeze=0`、`thrust=0`。

| 合同项 | R34 决策 |
| --- | --- |
| Entry mode | Repair-led；只修复默认运动不可感知，不重做视觉风格或资产 |
| Preserved invariants | 保留 R33 解剖、皮肤、受限拖动、点击/喷墨/结构/声场、暗色构图与五控件 |
| Motion hierarchy | 连续巡游轨迹（慢）＋身体航向/滚转（中）＋鳍缘行波（快）＋约 4 秒一次的宽喷射脉冲（事件）＋腕足惯性滞后 |
| Reduced motion | 保留状态与轻微呼吸，不执行大幅巡游或持续强喷流 |
| Completion criteria | 默认状态任意 1.5 秒窗口中位置或转向必须发生明确变化；4–6 秒内至少一次可见收缩/喷流；两张真实浏览器截图可区分；点击、拖动、低动态、fallback 和性能无回归 |
| Autonomy authorization | 用户明确要求继续优化并修复无运动效果；允许直接调整现有时间函数与运动参数 |

### R34 覆盖清单

| Requirement | Surface / state | Evidence | Stage | Status | Next action |
| --- | --- | --- | --- | --- | --- |
| 连续巡游 | 708 / 1280 idle | timed screenshots、pose | 2 / 6 | pass | 708 宽度 1.5 秒内由 `0.58,0.85,1.13` 移至 `0.23,1.01,1.11`；1280 宽度由 `1.48,0.39,1.30` 移至 `1.03,0.59,1.18`，主体保持在舞台安全区内 |
| 鳍膜与身体 | idle | screenshot、motion metrics | 2 / 6 | pass | 鳍缘行波提高到 3.5 Hz 时间函数，外套膜呼吸、航向和滚转均可在连续截图中辨认，腕足保留晚于身体的惯性 |
| 周期喷射 | 4–6 second idle window | timed observation、thrust | 5 / 6 | pass | 5 秒实测峰值 `squeeze=0.129`、`thrust=0.910`；宽脉冲取代难以观察的 `sin^10` 窄脉冲 |
| 相邻交互 | drag / poke / reset | browser interaction、DOM | 5 | pass | 点击真实几何后得到 `event=poke`、`poke=body`、`behavior=startle`；拖动将相机由 `0.00,0.40,19.20` 变为 `-4.49,4.16,18.26` 并进入 `inspect`，重置有效 |
| 运动边界 | reduced / fallback | browser observation、logs | 7 / 8 | pass | `motion=reduce` 1.5 秒位移约 0.04，仍可点击惊跳；主动 fallback 为 `runtime=fallback`，CSS 形态和 SIGNAL 交互有效 |
| 工程闭环 | build / diff / docs | terminal、browser logs | 9 | pass | R34 入口与研究记录已更新；生产构建、diff 和无 continue 审计通过，真实页面无运行错误覆盖层 |

### R34 浏览器证据

| 证据 | 结果 |
| --- | --- |
| 修复前 708×898，间隔 1.5 秒 | `-0.13,0.77,1.10,0.000,0.000` → `-0.15,0.76,1.10,0.000,0.000`，截图几乎相同 |
| 修复后 708×898，间隔 1.5 秒 | `0.58,0.85,1.13,0.000,0.000,-0.865` → `0.23,1.01,1.11,0.021,0.148,-0.873`，位置和收缩均发生可见变化 |
| 修复后 1280×720，间隔 1.5 秒 | `1.48,0.39,1.30,0.017,0.119,-0.706` → `1.03,0.59,1.18,0.024,0.168,-0.694`，构图稳定且主体没有侵入标题或动态层 |
| 完整喷射周期 | 5 秒采样得到 `squeeze=0.129`、`thrust=0.910` 峰值；喷射不再依赖恰好撞上很窄的时间窗口 |
| 点击 / 拖动 | 几何命中进入 `startle`；拖动更新真实 3D 相机并进入 `inspect`，自主巡游不会覆盖观察姿态 |
| reduced / fallback | 低动态保留小幅生命感并限制大位移；CSS fallback 显示清晰的能力降级提示并响应 SIGNAL |

R34 解决的是“运动读不出来”，不是把主体变成快速漂浮物。默认状态仍保持深海慢节奏：轨迹负责空间位移，航向和滚转负责解释运动方向，鳍膜、呼吸与腕足负责局部生命感，周期喷射才提供短促的动力峰值。下一阶段如果继续追求写实，应优先替换高精度形变资产和建立基于身体轴向的推进，而不是继续无上限放大振幅。

## R35：身体轴向推进与分阶段喷射

用户继续授权整体优化。2026-09-04 在固定入口 `http://127.0.0.1:4173/cuttlefish.html`、708×898、默认深潜状态复核 R34：1.3 秒内 `pose` 从 `0.17,0.28,1.02,0.092,0.651,0.228` 变为 `0.31,0.37,1.07,0.075,0.528,-0.206`。主体虽然已经明显移动，但位移向量约为 `(0.14,0.09)`，而局部尾端推进轴约为 `(-0.85,0.52)`，归一化点积约 `-0.43`；即观察窗口正处于强喷射，空间位移却朝向相反。源码同时显示外套膜在喷射时纵向缩短、横向变宽，更像呼吸气囊而不是径向收缩的头足类外套膜。

| 合同项 | R35 决策 |
| --- | --- |
| Entry mode | Revision-led；把 R34 的“可见运动”升级为方向、形变和尾流一致的因果运动系统 |
| Visual ambition / architecture | Immersive / Spatial Stage；WebGPU 生命体仍是持续主操作面 |
| Desired first impression | 不看指标也能辨认“鳍膜巡航 → 外套膜预压 → 虹吸喷射 → 腕足与尾流滞后”的同一个动物 |
| Preserved invariants | 保留 R34 构图、皮肤资产、双眼、腕冠、群体、五个控制、受限拖动、点击惊跳、低动态和 CSS fallback |
| Motion intervention | 轨迹切线驱动身体航向；外套膜径向收缩；收缩先于推力与尾流；鳍膜随速度变化并在强喷射时收拢；GPU 触腕接收推进流与转向力 |
| Asset boundary | 本轮不新增模型或图片；优先修正现有几何的动力学语义和喷流层次，不用更多发光遮掩结构问题 |
| Completion criteria | 默认巡游速度与尾端推进轴对齐；喷射峰值时 `alignment > 0.55`、外套膜径向尺度小于 1 且轴向不塌缩；喷流方向、压力环和微泡可读；点击、拖动、reduced、fallback、窄屏/桌面和性能无回归 |
| Autonomy authorization | 用户明确要求“继续优化”，允许在既有乌贼入口内直接迭代运动、形变、尾流和验证记录 |

### R35 覆盖清单

| Requirement | Surface / state | Evidence | Stage | Status | Next action |
| --- | --- | --- | --- | --- | --- |
| 推进方向 | 708 / 1280 idle | timed pose、velocity / axis alignment、screenshots | 2 / 6 | pass | 8 点完整周期中，`thrust > 0.25` 时推进轴对齐度最低 `0.976`、峰值 `0.996`；708 与 1280 截图中的头腕均稳定落在位移后方 |
| 外套膜动力 | jet cycle | scale metrics、peak screenshot | 2 / 6 | pass | `thrust=0.950` 时径向尺度 `0.955`、轴向尺度 `1.010`；下一周期先在 `thrust=0.484` 时收至 `0.935`，随后推力升至 `0.767`，验证预压早于主要加速 |
| 鳍膜与触腕 | glide / jet / turn | screenshots、GPU state | 5 / 6 | pass | 鳍相位由累计速度驱动，强喷射时收拢；`thrust` 与有符号 `turn` 已进入 GPU 触腕力场，桌面/窄屏连续截图可见腕足晚于身体转向 |
| 喷流可读性 | jet peak | screenshots、wake metrics | 2 / 6 | pass | 原实心高亮锥已降为低透明扩散层与细核心，配合 4 道压力环和桌面 18 / 窄屏 10 个复用微泡；尾流峰值 `wake=1.000` |
| 相邻交互 | poke / drag / signal / reset | browser interaction、DOM | 5 | pass | 点击命中 `poke=body / startle`；拖动相机 `0.00,0.40,19.20 → -3.88,3.81,18.47` 并进入 `inspect`；SIGNAL、结构开关与 reset 均实测恢复，reset 不再重置游动相位造成姿态突跳 |
| 运动边界 | reduced / fallback / 708 / 1280 | browser observation、metrics | 7 / 8 | pass | reduced 1.5 秒旋转仅约 `0.04rad` 且点击仍有效；fallback 为 `runtime=fallback` 并响应 SIGNAL；708 约 90–91 FPS，1280 约 77–88 FPS；R35 未扩大 R34 已验证的 390px 位移与控制边界 |
| 工程闭环 | build / diff / docs | terminal、browser | 9 | pass | R35 入口、实现与研究说明已更新；生产构建、diff 与无 continue 审计通过，固定入口最终为 `runtime=ready / event=idle / structure=off` |

### R35 浏览器证据

| 证据 | 结果 |
| --- | --- |
| R34 方向基线 | 强喷射窗口中位移 `(0.14,0.09)` 与尾端轴 `(-0.85,0.52)` 的归一化点积约 `-0.43`，主体移动和喷流因果相反 |
| R35 完整 7.6 秒周期 | 高推力样本对齐度 `0.976–0.996`；峰值 `thrust=0.950 / speed=0.235 / alignment=0.996 / wake=1.000` |
| 外套膜分阶段动力 | 峰值样本 `radial=0.955 / axial=1.010`；下一周期径向先收至 `0.935`，推力随后由 `0.484` 升至 `0.767`，轴向始终未塌缩 |
| 708×898 | 1.5 秒 `pose` 从 `0.75,0.72,-0.15,0.104,0.535` 变为 `0.73,0.88,0.09,0.061,0.719`；对齐度 `0.982 → 0.993`，约 90–91 FPS |
| 1280×720 | 1.5 秒 `pose` 从 `1.15,0.67,1.38` 变为 `0.78,0.63,1.62`；对齐度 `0.959 → 0.975`，约 77–88 FPS，主体与标题、动态层和控制条均无碰撞 |
| reduced / fallback | reduced 为 `runtime=ready / motion=reduced`，1.5 秒转向约 `0.04rad` 且几何点击进入 `startle`；fallback 为 `runtime=fallback` 并响应 SIGNAL |
| 相邻交互 | 几何点击进入 `poke=body / behavior=startle`；拖动真实更新相机并进入 `inspect`；SIGNAL、结构开关、reset 全部恢复到 `idle / off` |

R35 的关键进步不是“更多动画”，而是同一时间轴上的因果排序：解析轨迹先提供切线，身体航向追随切线，外套膜先径向压缩，虹吸随后沿局部尾端轴施加速度，鳍膜在喷射时收拢，压力环与微泡向反方向离开，GPU 触腕最后表现水阻滞后。现有 L2 混合资产的表面精度没有被夸大；如果继续提高近景写实度，下一步应该进入定制可形变拓扑、法线/置换细节和解剖级 GLB 资产，而不是继续叠加程序化光效。

## R36：近景解剖与混合资产边界

用户继续要求优化。2026-09-04 在固定入口 `http://127.0.0.1:4173/cuttlefish.html`、708×898、默认状态复核 R35：`runtime=ready`、约 138 FPS、150 个 GPU 物理顶点、312 个弹簧、约 2096 个统计三角形；运动因果已经成立，但普通腕与捕食腕仍共用光滑管状表面，没有吸盘列与触腕棒，结构模式会直接暴露“程序化线缆感”。外套膜近看只有颜色纹理，没有随表面法线形成的稳定微起伏；鳍只有发光外缘，没有解释膜面如何连接外套膜的鳍根线。

| 合同项 | R36 决策 |
| --- | --- |
| Entry mode | Revision-led close-up refinement；保留 R35 的推进、构图与交互，只提高近景结构可信度 |
| Desired first impression | 近看能先辨认成有成对吸盘列、捕食腕末端触腕棒、细微乳突皮肤与连续鳍根的头足类，而不是发光管线拼接体 |
| Visual ambition / architecture | Immersive / Spatial Stage；GPU 动态主体继续是主操作面，DOM 不增加技术参数墙 |
| Preserved invariants | R35 轨迹切线航向、分阶段喷射、GPU Verlet 腕足、受限拖动、点击/信号/墨云/声场/结构、reduced motion 与 fallback |
| Asset strategy | L2–L3 混合资产：生成纹理负责色素细节，程序化可形变网格负责实时运动；吸盘直接绑定同一组 GPU 物理顶点。没有经过授权与拓扑验证的外部模型，不伪称 L4 写实 GLB |
| Anatomical intervention | 普通腕增加稀疏成对吸盘列；两条捕食腕在末端形成宽触腕棒与更密吸盘；皮肤增加低振幅静态微起伏；鳍增加独立鳍根缝线 |
| Performance boundary | 吸盘使用单一合并 BufferGeometry 与单一节点材质，不为每个吸盘创建 Mesh；窄屏降低密度；不新增大纹理或每帧对象分配 |
| Completion criteria | 吸盘必须读取 GPU 物理端点并随腕足变形；捕食腕末端宽度与吸盘密度可区分；结构/普通模式都能读出鳍根；三角形与吸盘数量进入可检查指标；桌面/708、点击、拖动、结构、reduced、fallback、日志与构建无回归 |
| Autonomy authorization | 用户明确要求继续优化；允许在当前乌贼入口中调整程序化几何、节点材质、指标、说明与研究记录 |

### R36 覆盖清单

| Requirement | Surface / state | Evidence | Stage | Status | Next action |
| --- | --- | --- | --- | --- | --- | --- |
| 成对吸盘列 | default / structure / moving arm | screenshot、GPU binding、metrics | 2 / 6 | pass | 单一合并几何直接读取每段 `vertexIds`；708/桌面连续转向时吸盘与腕足共同弯曲，没有独立漂移 |
| 捕食腕触腕棒 | default / turn / jet | screenshot、silhouette | 2 / 6 | pass | 两条 feeder 在约 0.79 长度形成高斯宽度包络，末端吸盘密度提高；桌面侧视截图可与普通腕区分 |
| 皮肤微起伏 | mantle close-up / signal | screenshot、shader | 2 / 6 | pass | 稳定 UV 乳突以 `0.011` 最大局部位移叠加慢呼吸；无时间爬动，SIGNAL 色波继续通过同一表面传播 |
| 鳍根连续性 | default / structure | screenshot | 2 / 6 | pass | 两侧独立根部线逐帧读取动态鳍面内列；普通模式低对比，结构模式提高到可检查透明度 |
| 性能与指标 | 708 / 1280 | FPS、triangles、suckers、logs | 8 | pass | 708 为 92 个吸盘/约 4304 统计三角面、约 140–190 FPS；1280 为 180 个/约 10176 面、约 94 FPS，多验收页并开时不作性能承诺 |
| 相邻状态 | poke / drag / signal / reset / reduced / fallback | browser interaction、DOM、logs | 5 / 7 / 8 | pass | `poke=body/startle`、墨云 `defense`、结构、SIGNAL、reset 均实测；拖动真实更新相机；reduced 与 forced fallback 无溢出 |
| 工程闭环 | build / diff / docs | terminal、browser | 9 | pass | R36 页面标识、来源文件、README 与研究记录已更新；生产构建、diff 与无 continue 审计通过 |

### R36 浏览器证据与修订台账

| 证据 / 问题 | 修订与结果 |
| --- | --- |
| 708×898 基线 | R35 为 150 个物理点、312 个弹簧、约 2096 个统计三角面；腕足为无吸盘的光滑管体 |
| 首版吸盘节点材质 | 第二套自定义位置节点进入 MRT 后画布变黑，但 RAF 仍约 157 FPS；隐藏该批次后主体立即恢复，证明不是物理或性能停摆 |
| 黑屏修复 | 吸盘改为复用已验证的腕足 storage-buffer 位置节点，只通过 `segmentBlend`、角度和宽度构成浅杯；独立暖色材质分支保留同一 MRT 输出，画布恢复且无 fallback 覆盖层 |
| 708×898 最终 | `runtime=ready`、92 个吸盘、约 4304 个统计三角面、约 140–190 FPS；结构开关、墨云与 reset 后保持 `structure=off / event=idle` |
| 1280×720 最终 | `runtime=ready`、180 个吸盘、约 10176 个统计三角面、采样约 94 FPS、横纵溢出均为 0；侧视截图可见普通腕成对吸盘和捕食腕末端加密区 |
| 拖动与点击 | 708 真实拖动将相机 `0.00,0.40,19.20 → 6.88,5.49,17.22`；真实点击主体得到 `event=poke / poke=body / behavior=startle`，并保留收缩、色波和腕足滞后 |
| 相邻与降级 | 桌面 SIGNAL 得到 `signal=0.766`；墨云进入 `defense`；reduced 为 `runtime=ready / motion=reduced` 且 SIGNAL 有效；forced fallback 为 `runtime=fallback` 且 SIGNAL 有效，两者均无页面溢出 |

R36 提升的是“近景可解释性”，不是把程序化资产重新命名成自然历史扫描。吸盘虽为真实三维浅杯并跟随 GPU 腕足，但仍受低面数和屏幕尺度约束；皮肤的微起伏也是稳定的程序化置换，不是显微扫描法线。资产来源与未来可替换边界记录在 `public/assets/ASSET_PROVENANCE.md`。如果继续追求纪录片级近景，下一步应引入经过授权检查、UV/法线验证和可形变拓扑整理的定制基础模型，同时保留当前 GPU 腕足、行为状态与交互系统。

## R37：双模式运动、乌贼轮廓与可证明的三维观察

用户明确指出四项缺陷：运行逻辑不对、形态不像乌贼、页面看不出是 3D、仍有补充优化空间。2026-09-04 于 `http://127.0.0.1:4173/cuttlefish.html`、1280×720 复现 R36：默认 `glide` 仍周期性产生 `thrust`，主体沿闭合轨迹持续绕 Z 轴改变朝向；1.6 秒内 `rotation 2.09 → 2.26`。虽然运行时确实使用 `WebGPURenderer`、PerspectiveCamera 和三维网格，但相机方位范围只有约 ±24°，主体大部分变化发生在屏幕平面，视觉上更接近一张会转动的扁平软体插画。窄屏还把附肢总数降为 8，实际只剩 6 腕加 2 触腕；两条捕食触腕在静息状态长期外露，进一步削弱乌贼辨识。

| 合同项 | R37 决策 |
| --- | --- |
| Entry mode | Revision-led corrective redesign；保留 R36 皮肤、GPU 约束、吸盘、群体和基本视觉世界，重开运动、造型、相机和交互覆盖 |
| Desired first impression | 第一眼先看到宽扁外套膜、沿周缘连续鳍、侧向 W 形眼与成束短腕；主体稳定停留在三分之四姿态，不再像平面内旋转的发光水母替身 |
| Biological motion model | 双模式：默认/观察为周缘鳍低速巡航；点击或墨云才启动分阶段外套膜喷射逃逸。转向采用间歇目标与平滑短转，不再持续追随椭圆切线 |
| Anatomy model | 所有质量档均保留 8 腕 + 2 捕食触腕；普通腕缩短并成束，捕食触腕静息收纳/低可见，SIGNAL 时伸展并显露末端触腕棒；鳍根严格跟随外套膜侧缘 |
| 3D proof | 稳定三分之四初始姿态；扩大轨道相机方位、俯仰与近景范围；增加 HERO / PROFILE / CLOSE 三档显式视角；拖动观察时降低自主位移，避免镜头与动物争夺控制权 |
| Visual ambition / architecture | Immersive / Spatial Stage；同一 WebGPU 场景继续承担观察、交互和反馈，新增视角属于主舞台控制而不是独立页面 |
| State mapping | glide=鳍巡航/触腕收纳；observe=眼神与轻微侧倾；signal=色素传播+捕食触腕展开；startle=收缩+虹吸+后退；defense=墨云+较强后退；inspect=自主漂移减弱/相机优先 |
| Asset boundary | 仍为 L2–L3 混合程序化资产；本轮重建比例和运动语法，不声称获得 L4 扫描模型，也不使用 2D 图像冒充三维主体 |
| Performance boundary | 不新增大纹理；窄屏通过段数/径向分段而不是删除解剖部件降级；视角切换复用同一场景与材质 |
| Autonomy authorization | 用户要求继续优化并明确四项问题；允许直接修改现有乌贼场景、控制、样式、说明与研究记录 |
| Completion criteria | idle 期间 `thrust≈0` 且不持续自转；点击后收缩先于推力、喷流方向与后退一致；所有档为 10 附肢；静息主要读出 8 条短腕，SIGNAL 可见 2 条捕食触腕；HERO/PROFILE/CLOSE 和真实拖动产生可辨三维视差；桌面/708、reduced、fallback、构建与日志无回归 |

### R37 覆盖清单

| Requirement | Surface / state | Evidence | Stage | Status | Next action |
| --- | --- | --- | --- | --- | --- | --- |
| 运行逻辑 | idle / signal / poke / ink / recovery | timed metrics、screenshots、state | 2 / 5 / 6 | pass | idle 持续 `thrust=0`；点击首先得到 `squeeze=0.175 / thrust=0`，主喷射达到 `thrust=0.589 / alignment=0.975`，峰值对齐度 `1.000`，随后回到 `fin-cruise` |
| 乌贼形态 | desktop / narrow / idle / signal | screenshots、metrics | 2 / 7 | pass | 宽扁外套膜、连续鳍根、侧向 W 形瞳孔与短腕束已重排；桌面/窄屏均为 10 附肢，SIGNAL 可见两条捕食触腕及宽触腕棒 |
| 三维观察 | hero / profile / close / drag | screenshots、camera metrics、interaction | 4 / 5 | pass | PROFILE / CLOSE 产生明确侧面厚度与近景视差；真实拖动将相机 `(0,0.4,19.2) → (6.4,5.84,17.38)` |
| 补充优化 | material / depth / feedback | screenshots、DOM state | 2 / 6 | pass | 眼罩、收缩轴、动态鳍根、吸盘、虹吸和分阶段尾流共享一个三维主体；删除会导致 WebGPU MRT 黑屏的未使用 role 表面属性分支 |
| 跨表面 | 1280 / 507 / keyboard / reduced / fallback | browser、overflow、focus | 7 / 8 | pass | 1280×720 与 507×898 均为零溢出；reduced 约 1.1 秒仅旋转 `0.01rad`，fallback 禁用三维视角并保留 CSS 动态语义 |
| 工程闭环 | build / diff / docs | terminal、browser | 9 | pass | R37 页面、实现、资产边界与研究记录同步；生产构建、真实浏览器和最终复位已完成 |

### R37 浏览器证据与纠错台账

| 证据 / 问题 | 修订与结果 |
| --- | --- |
| R36 默认逻辑 | 默认 `glide` 仍约每四秒自动喷射并沿椭圆切线持续绕 Z 轴转向；用户无法区分鳍巡航与应激逃逸 |
| 双模式时间线 | idle 为 `fin-cruise / thrust=0 / wake=0`；点击或墨云才进入 `compress → jet → recover`，预压先于可测主推力，约 1.2 秒后自动恢复 |
| 推进方向 | 主喷射 `thrust=0.589` 时方向对齐度 `0.975`；峰值 `thrust=0.863` 时为 `1.000`。低于建立推力阈值的样本不再伪报方向一致性 |
| 507×898 | `runtime=ready`，168 点 / 342 弹簧 / 100 吸盘 / 10 附肢 / 约 4636 统计三角面，稳定观察约 74 FPS，横纵溢出均为 0 |
| 1280×720 | `runtime=ready`，200 点 / 418 弹簧 / 156 吸盘 / 10 附肢 / 约 8736 统计三角面，单页观察约 101 FPS，横纵溢出均为 0 |
| 捕食触腕 | 原先静息长期外露；现在按 coil 形态收纳在腕束中，SIGNAL 维持独立展开能量。桌面 `deploy=0.581` 时两条触腕茎与末端密集吸盘触腕棒均可见 |
| 三维证据 | HERO 为稳定三分之四，PROFILE 相机为 `(13.1,1.05,3.5)`，CLOSE 为 `(0.2,0.55,12.1)`；拖动相机实际跨越 X/Y/Z，不是 CSS 平移或二维旋转 |
| 相邻状态 | 真实点击主体得到 `poke=body / behavior=startle / stage=compress`；SIGNAL 不触发喷射，INK 触发防御喷射；reset 恢复 HERO / glide / structure off |
| 低动态与降级 | reduced 在 1.1 秒采样中姿态旋转约 `1.52 → 1.53rad` 且保持 10 附肢；`?fallback=1` 为 `runtime=fallback`、三维视角禁用、无页面溢出 |

R37 解决的是“这是不是一只按乌贼逻辑运行的三维生命体”，还不是“是否达到自然历史纪录片的扫描精度”。当前外套膜、头眼和鳍面是可控程序化拓扑，皮肤是项目生成的色素细节层，腕足与吸盘由 Aurelia GPU 约束实时驱动。若继续冲击水母基准的材质与微观层次，下一阶段应优先替换可形变外套膜基础拓扑、增加经过许可验证的 PBR 法线/粗糙度/次表面数据，并保留本轮已经正确的 8+2 解剖、双模式行为和相机系统。

## R38：从透明发光装置到有皮肤、有肌肉的生命体

用户确认继续优化。2026-09-04 在固定入口 `http://127.0.0.1:4173/cuttlefish.html`、1280×720 复核 R37：三维、8+2 附肢和双模式运动已经成立，但外套膜的 `transmission=0.42` 与低透明度让内部橙色器官成为主焦点；腕足采用不写深度的半透明 Basic 材质，亮色吸盘会穿过腕体并形成串珠感；眼、口与虹吸的发光强度又让头部接近机械面具。当前约 196 FPS、零页面溢出，因此本轮优先修正材质角色与自然运动，而不是继续增加对象数量。

| 合同项 | R38 决策 |
| --- | --- |
| Entry mode | Revision-led visual refinement；保持 R37 行为与控制，重开材质、头腕和空间深度覆盖 |
| Desired first impression | 第一眼读到不透明、有斑驳色素和柔软周缘鳍的真实乌贼；生物发光只承担信号反馈，不再像透明水母或机械灯具 |
| Visual ambition / architecture | Immersive / Spatial Stage；WebGPU 主体仍是唯一视觉锚，DOM 控制和页面结构不改 |
| Preserved invariants | fin-cruise / compress→jet→recover、8 腕+2 捕食触腕、HERO/PROFILE/CLOSE、自由拖动、点击、SIGNAL、INK、结构层、声场、reduced motion 与 fallback |
| Material direction | 外套膜降低透射和镜面塑料感，增加不规则宏观斑驳与受控微起伏；内部器官退为低对比深层暗影；眼、虹吸和口部降低自发光 |
| Appendage direction | 腕体提高实体感与深度遮挡，吸盘降低亮度和透明穿透；触腕棒仍保留 SIGNAL 展开证据 |
| Motion direction | 鳍行波保持连续但加入左右相位差与局部扰动；瞳孔采用间歇凝视而非持续机械跟随；喷射事件保持 R37 顺序 |
| Asset boundary | 继续使用现有 L2–L3 混合资产；本轮不把程序拓扑伪称扫描模型，也不增加未经许可的外部 GLB |
| Performance boundary | 不新增网络资产、实例或后处理 pass；优先通过现有节点材质、深度写入和已分配对象提升观感 |
| Autonomy authorization | 用户明确“确定，继续优化效果”，允许直接修改当前乌贼入口、验证记录和说明 |
| Completion criteria | 默认帧不再由透明器官主导；腕体遮挡吸盘并保持 8+2；SIGNAL/INK/点击仍清楚；HERO/PROFILE/CLOSE 均有实体层次；1280 与窄屏、reduced、fallback、构建和日志无回归 |

### R38 覆盖清单

| Requirement | Surface / state | Evidence | Stage | Status | Next action |
| --- | --- | --- | --- | --- | --- |
| 皮肤与肌肉材质 | hero / close / signal | screenshots、material state | 2 / 6 | pass | 外套膜改为实体深度写入，透射降至 `0.08`；皮肤纹理退为 22% 细节层并叠加低频斑驳，内部器官在 idle 为不可见暗影，SIGNAL 才出现受控暖色传播 |
| 腕足与吸盘层级 | hero / close / signal | screenshots、GPU geometry | 2 / 6 | pass | 8 条普通腕与 2 条捕食触腕继续由 200 个 GPU 点驱动；腕体加粗并写深度，156 个吸盘默认降为近乎不可见，结构层才提高可读度，不再形成发光串珠 |
| 头部可信度 | hero / profile / pointer | screenshots、interaction | 2 / 5 | pass | 移除独立球形头与腕冠，扩展外套膜剖面形成连续头胴；单侧 W 形瞳孔嵌入表面，远侧眼由体积遮挡，虹吸移至腹侧并缩窄 |
| 鳍与空间深度 | hero / profile / moving | screenshots、timed observation | 2 / 6 | pass | 宽扁外套膜与两侧连续鳍在 HERO / PROFILE / CLOSE 均保持厚度；idle 650ms 样本位置 `1.07,0.24 → 1.13,0.22`，鳍相位 `-0.700 → -0.620` 且 `thrust=0` |
| 相邻交互 | click / signal / ink / view / drag / reset | browser state | 5 / 6 | pass | SIGNAL 保持独立 `deploy=0.752`；真实点击命中 `poke=body`，早期 `squeeze=0.165 / thrust=0.153`，主喷射 `thrust=0.730 / alignment=0.998 / wake=0.966`，随后恢复 `fin-cruise` |
| 跨表面与降级 | 1280 / narrow / reduced / fallback | browser、overflow、logs | 7 / 8 | pass | 1280×720 与 390×844 实测无横纵溢出、无 warning/error；窄屏冷启动为 100 吸盘/10 附肢、约 49 FPS；reduced 约 0.9 秒仅旋转 `0.01rad`；fallback 保留控制并禁用三维视角 |
| 工程闭环 | build / syntax / docs | terminal、browser | 9 | pass | R38 页面标识、实现、README 与本记录同步；生产构建、语法、diff、浏览器复位与日志审计通过 |

### R38 浏览器证据与修订台账

| 证据 / 问题 | 修订与结果 |
| --- | --- |
| 透明塑料感 | `transmission 0.42 → 0.08`，改为不透明深度写入；降低 clearcoat、环境暖光和纹理混合，内部橙色器官不再主导默认帧 |
| 球形拼装头 | 第一次提高不透明度后暴露独立头球接缝；随后删除独立头/大腕冠，让外套膜剖面连续延伸到头与腕根，HERO 和三分之四视图不再出现圆盘接缝 |
| 机械面部 | 双侧外露大眼改为单侧可读、远侧由身体遮挡的嵌入式 W 形眼；口器退到腕束内部，虹吸由背侧粗管改为腹侧细管 |
| 吸盘与触腕 | 吸盘默认透明贡献降至 `0.025`，只在结构层提升；普通腕提高实体遮挡并降低闲置外力，捕食触腕由卷曲线圈改为收纳折线，避免近景白色花状团块 |
| 三维视角 | PROFILE 从沿纵轴的 `(9.2,0.95,2.7)` 改为三分之四 `(4.6,1.65,10.1)`；CLOSE 为约 `(1.85,0.63,8.08)`，两个视角都能读出背腹厚度、鳍面与腕束前后关系 |
| 行为时间线 | idle 持续 `fin-cruise / thrust=0`；点击按收缩、主推力、尾流、恢复顺序运行，主推力样本对齐度 `0.998`；SIGNAL 只驱动皮肤与捕食触腕，不误触喷射 |
| 跨表面 | 390×844 冷启动 `runtime=ready / 10 appendages / 100 suckers / 0 overflow`；reduced 与 forced fallback 均无日志错误，fallback 明确禁用 3D 视角而保留语义控制 |

R38 把程序化主体从“透明、发光、拼装”的装置感推进到可读的实体头足类：造型、材质、相机和因果动作现在属于同一身体。它仍是 L2–L3 混合程序化资产，不是扫描级动物模型；若下一阶段继续追求纪录片级近景，应替换为经过许可和拓扑整理的可形变 GLB/PBR 基础资产，同时复用当前已经验证的 GPU 腕足、鳍波、色素状态、点击喷射和跨表面控制系统。
