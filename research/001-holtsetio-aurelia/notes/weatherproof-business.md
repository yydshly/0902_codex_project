# Weatherproof / 业务官网纵向切片

## R16 设计契约

```text
Entry mode: Brief-led extension inside an existing product
Request revision: R16 / move from research demo to a business-facing journey
Target user and context: 需要在通勤、暴雨或沿海强风中选择雨具的城市消费者；首次访问品牌官网
Desired first impression: 克制、高级、可信；先看见产品价值，再发现背后的 Aurelia 物理能力
Visual ambition: Editorial
Experience architecture: Editorial Flow with an optional live WebGPU enhancement
Visual constraints: 延续 Rain Membrane 的深黑、冷青、酸绿与技术标注；不把研究控制台原样搬进官网
Information constraints: 虚拟品牌、型号与指标必须标注为演示数据；模拟不冒充实验室认证
Operation constraints: 场景选择必须同时改变可视雨况、推荐产品与推荐理由；主要转化必须可完成
State constraints: 默认、三种场景、三种产品、咨询弹窗、提交成功、WebGPU 降级、reduced-motion
Environment constraints: Vite 静态前端；无后端、登录、支付、真实库存或外部接口；桌面、平板、390px 手机
Primary journey: 进入官网 → 理解定位 → 选择天气场景 → 获得产品推荐 → 比较型号 → 提交体验预约
User-defined phases: 保留现有 rain.html；新增业务官网；建立业务闭环；验证与说明
Required artifacts: weatherproof.html、weatherproof.css、weatherproof.js、共享 Rain scene 与可选 embed bridge、README 与本记录、最终浏览器证据
Autonomy authorization: 用户已明确“确定并继续”，授权在上述可逆前端范围内持续完成
User-decision boundary: 真实品牌、真实 SKU/检测数据、支付/CRM/库存/API 接入留待业务资料确定后替换
Observable completion criteria: 场景、推荐、比较、实验室链接和预约表单均可操作；无 JS/WebGPU 时正文与转化仍可用；主要视口无横向溢出；构建通过
```

## 视觉方向

| 决策 | 选择 | 可观察约束 | 验收标准 |
| --- | --- | --- | --- |
| 信息层级 | 价值主张 → 场景诊断 → 推荐 → 比较 → 信任 → 转化 | 首屏只有一个主行动；研究信息后置 | 首次扫描能识别“开始诊断” |
| 3D 角色 | 真实 Rain Membrane 作为渐进增强 | 不承担正文、表单或唯一反馈 | WebGPU 失败仍可完成主路径 |
| 产品表达 | 三个可替换演示 SKU，强调使用情境而非虚假绝对参数 | 全局显著标注演示数据 | 不出现未注明的认证或科学结论 |
| 状态反馈 | 选择同时更新场景、推荐理由、评分与深度实验链接 | 不依赖颜色独自表达 | DOM 文本与 pressed/selected 语义同步 |
| 响应式 | 桌面双栏，平板收敛，手机单栏 | 不隐藏关键 CTA 与结果 | 390px 无裁切、横向溢出或不可达控件 |
| 动效 | 只解释选择、结果和弹窗状态 | reduced-motion 停止非必要动画 | 信息不因关闭动画而消失 |

## 覆盖清单

| 用户阶段 | 要求或产物 | 表面 / 状态 | 证据 | 阶段 | 状态 | 下一步 |
| --- | --- | --- | --- | --- | --- | --- |
| 保留现有演示 | `rain.html` 默认入口行为不变 | 桌面 / 默认 | 浏览器与回归交互 | 1/7 | pass | 默认 UI、画布和中雨状态通过；embed 仅由查询参数启用 |
| 新增业务官网 | 品牌首屏与明确主行动 | 桌面 / 默认 | 截图、DOM | 2/3 | pass | 1280×720 首屏完整显示主行动、场景与物理证据 |
| 建立业务闭环 | 三个场景驱动推荐与解释 | 桌面 / 三状态 | 交互与 DOM | 4/5/6 | pass | pressed 状态、推荐、理由、实验链接和场景强度同步 |
| 建立业务闭环 | 三个型号可比较并可进入深度实验 | 桌面 / 产品状态 | 交互与链接 | 5/6 | pass | 推荐型号与主动查看型号分别显示“当前推荐 / 正在查看” |
| 建立业务闭环 | 预约表单可打开、校验、关闭和成功提交 | 桌面 / 弹窗 / 成功 | 键盘、焦点、DOM | 5/6 | pass | 必填字段、成功状态、Escape、点击关闭与焦点返回通过 |
| 响应式 | 主路径适配平板与 390px 手机 | 1024px / 390px | 截图、溢出检查 | 7 | pass | 两视口均无横向溢出；移动端完整完成场景与预约路径 |
| 可访问性 | 语义状态、键盘焦点、Escape、焦点返回 | 键盘 | 交互观察 | 7 | pass | 按钮 pressed、原生 dialog、可见 focus 与主路径语义通过 |
| 渐进增强 | WebGPU fallback 与 reduced-motion 不阻塞业务路径 | fallback / reduce | 浏览器状态 | 8 | pass | fallback 无画布仍可推荐和预约；reduce 将非必要过渡降至 0.01ms |
| 工程交付 | Vite 多入口、文档、构建和控制台健康 | production build | 命令与浏览器 | 9 | pass | 九入口构建、最终控制台与 diff 审计通过 |

> 本页中的品牌、价格、产品名称、评分与适用场景均为体验原型数据。真实上线前必须由 PIM、检测报告、库存、价格与 CRM/电商接口替换。

## R16 最终验证

- 桌面 `1280×720`：首屏主行动、实时伞面、三场景选择完整可见；页面无横向溢出。城市暴雨把推荐切到 `STORM ARC`，深度实验链接同步为 `rain.html?mode=storm`，实测积水/张力读数继续变化。
- 平板 `1024×768`：推荐面板转为单列，三个产品仍保持可比较；无横向溢出。
- 手机 `390×844`：使用移动 GPU 预算，首屏、场景锚点、单列产品与预约弹窗可达；场景锚点停在固定导航下方，弹窗宽 `337px`，完整提交后出现成功状态。
- 转化：空表单会将焦点送到首个必填字段；完成提交写入 `conversion_submitted` 演示事件；关闭后焦点返回发起入口。
- 渐进增强：`?fallback=1` 下画布数量为 0，但场景推荐和预约保持可用；`?motion=reduce` 下产品过渡和非必要动画均为约 `0.01ms`。
- 原页回归：`rain.html` 保持完整顶栏、控制台与全视口画布；`?mode=drizzle` 正确选择微雨，`?embed=1` 才隐藏研究 UI。
- 当前机器短时帧间隔 EMA：桌面约 `17.17ms`，手机约 `15.17ms`。这是运行观测，不是跨设备性能承诺。
- 支持边界：本轮品牌视觉只定义深色主题，内容语言为 `zh-CN` 并保留英文技术标注；真实多主题、多语言和后端集成不在已授权范围内。
- 最终证据位于被仓库忽略的 `validation-artifacts/001-aurelia-weatherproof/`；保留桌面默认、暴雨状态、产品区、预约成功、手机默认和无 WebGPU 降级六张截图。

## R17 设计契约：从演示型号到真实商品接入

```text
Entry mode: Revision-led extension inside the existing Weatherproof business prototype
Request revision: R17 / make product selection materially affect the live model and expose the production asset pipeline
Target user and context: 在品牌官网比较真实雨具的消费者，以及评估体验能否连接商品业务的产品团队
Desired first impression: 这不是换文案的视觉噱头；不同产品具有可观察、可解释、可替换的结构与材料响应
Visual ambition: Immersive
Experience architecture: Hybrid Workspace / editorial business flow with a persistent WebGPU product twin in the hero
Visual constraints: 保留既有深色技术品牌系统；不生成或冒充真实商品图；数字样机与虚拟参数必须明确标注
Information constraints: 展示每个样机的材料、结构和响应策略；说明真实上线需要 GLB/CAD、PBR、PIM/SKU 与实测曲线
Operation constraints: 选择场景会推荐并加载对应样机；手动选择其他型号也会同步改变 3D 材质、骨架与物理响应
State constraints: 三种商品样机、推荐/主动查看、WebGPU fallback、reduced-motion、预约成功
Environment constraints: 延续 Vite 静态前端；无真实商品资产、检测报告、库存、价格、CRM 或购买接口
Primary journey: 选择天气 → 获得型号推荐 → 在实时数字样机看见材料/张力/蓄水差异 → 比较 → 预约
User-defined phases: 保留现有演示；增强商品真实性；说明真实接入方式；完成多端回归
Required artifacts: scene product-profile API、Weatherproof 商品状态映射、真实商品接入说明、浏览器证据与本记录
Autonomy authorization: 用户连续明确“继续”，授权在既有可逆前端与文档范围内完成本轮
User-decision boundary: 真实品牌、SKU、实拍/GLB、材料扫描、检测曲线和商业接口必须由真实资料替换，当前不得猜测
Observable completion criteria: 三个型号在场景中呈现不同颜色/材质/骨架与张力响应；UI 明示当前数字样机与参数；fallback 仍可理解差异；桌面、平板、390px、键盘、弹窗、reduced-motion 与构建通过
```

### R17 视觉与状态方向

| 决策 | 选择 | 可观察约束 | 验收标准 |
| --- | --- | --- | --- |
| 商品真实性 | 当前为可替换的数字孪生样机，不冒充实物 | 使用“数字样机 / 演示参数”标识 | 页面不存在未注明的真实商品或检测承诺 |
| 场景映射 | 商品选择改变可视材料、骨架色与物理响应 | 不能只更新文案或卡片描边 | 三个型号切换后 live 标签、张力/蓄水和 3D 外观同步变化 |
| 业务解释 | 增加真实商品数据接入层 | 不把内部工程术语堆进首屏 | 在技术区能理解资产、材质、实测、商品系统四类输入 |
| 渐进增强 | 3D 是证明层，正文与转化保持独立 | fallback 保留商品状态与解释 | 无 WebGPU 仍可选择、比较、预约并读取样机策略 |

### R17 覆盖清单

| 用户阶段 | 要求或产物 | 表面 / 状态 | 证据 | 阶段 | 状态 | 下一步 |
| --- | --- | --- | --- | --- | --- | --- |
| 增强商品真实性 | 三个型号驱动 3D 材质、骨架与物理参数 | 桌面 / 三产品 | 截图、DOM、场景指标 | 4/5/6 | pass | URBAN / STORM / COAST 分别呈现青绿、冷蓝、黄绿材料及 8 / 12 / 14 骨，并回传 profile 指标 |
| 增强商品真实性 | 当前数字样机及响应策略可读 | 默认 / 推荐 / 主动查看 | DOM、可访问文本 | 3/6 | pass | live 面板和推荐面板同步显示材料、结构、响应与初始张力 |
| 说明真实接入方式 | 真实商品生产资料管线可理解 | 技术区 | 截图、内容检查 | 3 | pass | 商品几何、PBR 材料、实测曲线与业务数据四层均可读 |
| 保留业务闭环 | 场景推荐、比较、实验室与预约不回退 | 主路径 / 弹窗 | 浏览器交互 | 5/6 | pass | 暴雨推荐、主动查看 COAST、必填校验、成功提交、关闭与 Escape 均通过 |
| 响应式与可访问性 | 桌面、平板、390px、键盘与 reduced-motion | 多视口 / 输入 | 浏览器证据 | 7 | pass | 1280 / 1024 / 390 均无横向溢出；焦点返回和 0.01ms 运动降级通过 |
| 渐进增强 | WebGPU fallback 可读可操作 | fallback | 浏览器交互 | 8 | pass | fallback 无 canvas，仍可切换 COAST 样机说明并打开预约 |
| 工程交付 | 文档、生产构建、控制台和 diff 健康 | production | 命令与日志 | 9 | pass | 九入口生产构建通过；最终日志无 warning/error；终端审计通过 |
| 保留研究演示 | `rain.html` 默认能力不回退 | 桌面 / 默认 | 浏览器回归 | 7/8 | pass | 默认中雨、完整顶栏、五个控制、WebGPU 画布与无溢出通过 |

### R17 最终验证

- 桌面 `1280×720`：URBAN 08、STORM 12、COAST 14 的 live 标签、材料、8 / 12 / 14 骨架、张力与蓄水参数随产品选择同步；主动查看非推荐型号时保留“正在查看”和推荐归属两种状态。
- 平板 `1024×768`：推荐与产品区收敛为单列，真实接入区收敛为单列；页面无横向溢出。
- 手机 `390×844`：live 数字样机读数保持可读，产品卡和四层接入说明变为单列；完整完成暴雨 → COAST → 预约 → 必填校验 → 成功提交路径。
- 前景与键盘：原生 dialog 的 Escape、关闭按钮和提交后返回均关闭弹窗并将焦点还给发起入口；空表单焦点落在 `name` 必填字段。
- 渐进增强：`?fallback=1` 下 canvas 为 0，但产品选择、样机说明和预约仍可操作；`?motion=reduce` 下非必要过渡和动画为约 `0.01ms`。
- 原页回归：`rain.html` 默认仍为中雨、完整 UI 和 WebGPU 画布，未被商品 profile 扩展改变。
- 当前机器在依次创建三个可视骨架后的短时帧间隔读数约 `4.16ms`；这是本机浏览器观测，不是跨设备性能承诺。
- 证据目录仍为被仓库忽略的 `validation-artifacts/001-aurelia-weatherproof/`，已用 R17 的桌面默认、暴雨、沿海样机、真实接入区、手机和 fallback 六张最终截图替换 R16 的陈旧截图。

## R18 设计契约：合成数据驱动演示

```text
Entry mode: Revision-led extension of the R17 product twin
Request revision: R18 / construct a coherent synthetic dataset and make it drive the demo
Target user and context: 想评估“如果我们暂时没有真实商品数据，如何先验证业务体验”的产品、品牌与研发团队
Desired first impression: 数据不是装饰；场景、商品、3D 响应、证据曲线和转化使用同一份可追踪数据
Visual ambition: Editorial with interactive data evidence
Experience architecture: Hybrid Workspace / existing 3D product story plus a document-flow evidence lab
Visual constraints: 沿用现有深色技术品牌；数据可视化服从内容层级；不增加假商品图片或伪认证标识
Information constraints: 每个合成字段必须有来源标签、单位和批次；页面明确“非检测、非库存、非销售承诺”
Operation constraints: 产品和场景切换必须更新 3D profile、PIM 摘要、实验曲线、关键指标与库存快照；曲线维度可切换
State constraints: 三产品 × 三实验维度、三场景、fallback、reduced-motion、窄屏、预约流
Environment constraints: 静态 Vite 演示；数据存放在版本化 JSON；无后端、真实 API、真实库存或检测数据
Primary journey: 选择天气 → 获得商品 → 查看数字样机 → 切换实验维度理解取舍 → 查看数据来源 → 预约
User-defined phases: 构造数据；接入演示；保留原能力；完成多端验收与说明
Required artifacts: synthetic catalog JSON、data-evidence UI、canvas 曲线与可读数据表、文档与浏览器证据
Autonomy authorization: 用户明确“你来构造数据进行演示”，授权构造并接入合成数据
User-decision boundary: 合成数据只用于体验验证；真实商品上线仍需业务方或实验室提供可验证源数据
Observable completion criteria: JSON 成为场景/商品状态单一来源；三种曲线可操作且表格同步；产品切换更新全部证据；桌面/平板/390px/fallback/reduced-motion/键盘/构建通过
```

### R18 数据规则

| 数据域 | 合成方式 | 演示用途 | 真实性边界 |
| --- | --- | --- | --- |
| 天气场景 | 三组确定性雨量、风速、温度和数据源编号 | 驱动推荐与场景强度 | 不代表实时城市天气 |
| PIM / SKU | 三个版本化虚拟商品、价格、库存快照 | 验证选择、比较与转化 | 不代表可售库存或价格 |
| 实验曲线 | 六个采样点的雨时—张力、雨时—滞水、风速—形变 | 解释商品取舍并校准数字样机 | 不代表实验室检测或安全等级 |
| 批次与溯源 | `SYN-R18-*` 批次、生成时间和合成方法 | 证明数据血缘可见 | 不冒充认证编号 |

### R18 覆盖清单

| 用户阶段 | 要求或产物 | 表面 / 状态 | 证据 | 阶段 | 状态 | 下一步 |
| --- | --- | --- | --- | --- | --- | --- |
| 构造数据 | 独立版本化 JSON 覆盖场景、PIM、库存、实验曲线和 profile | 文件 / 三产品 | 文件检查、构建 | 3/6 | pass | 三场景、三产品、三指标、每款三条六点曲线通过结构、库存求和和摘要一致性检查 |
| 接入演示 | 产品/场景选择驱动现有推荐、3D 与新增数据证据 | 桌面 / 多状态 | DOM、截图、交互 | 4/5/6 | pass | STORM 场景和 COAST 主动查看分别同步天气、商品、3D、SKU、批次、库存与曲线 |
| 接入演示 | 三种实验维度可切换并同步曲线与表格 | 鼠标 / 键盘 | 交互、canvas、DOM | 4/5/7 | pass | 张力、滞水、形变按钮、pressed 状态、Canvas、标题、单位与六行表格同步 |
| 真实性边界 | 合成标签、批次、单位与非检测说明显著可读 | 默认 / 所有维度 | DOM、截图 | 3/6 | pass | 数据集、天气、PIM、库存、实验批次全部显示 `SYN-*` 血缘并保留免责声明 |
| 保留原能力 | 场景、商品、3D、实验室链接、预约不回退 | 主路径 | 浏览器回归 | 5/6 | pass | 手机完成暴雨 → COAST → 必填校验 → 成功提交 → 焦点返回；rain.html 默认行为通过 |
| 跨端适配 | 桌面、1024px、390px 无裁切或不可达控件 | 多视口 | 截图、溢出检查 | 7 | pass | 三视口均无横向溢出；平板双列来源、手机单列来源与 308px 图表均可读 |
| 渐进增强 | fallback 与 reduced-motion 仍可读可操作 | capability / motion | 浏览器状态 | 8 | pass | fallback 仅移除 3D canvas，数据 canvas 和表格可用；reduce 过渡/动画约 0.01ms |
| 工程交付 | 文档、九入口构建、审计、控制台与 diff 健康 | production | 命令、日志 | 9 | pass | 69 模块九入口构建、0 漏洞、最终日志与 diff 审计通过 |

### R18 最终验证

- 合成数据：`SYN-AF-R18-20260904` 包含 3 个天气 source、3 个商品、3 个实验维度；每款 3 条曲线各有 6 个点。区域库存求和与总量一致，曲线末点与摘要字段一致。
- 桌面 `1280×720`：默认加载 URBAN 08 / `SYN-R18-U08-01`；暴雨切换到 STORM 12 / `SYN-R18-S12-02` / 18 件库存，手动查看 COAST 后保持暴雨天气 source、同时把商品批次切到 `SYN-R18-C14-03`。
- 数据交互：张力、滞水、形变三种维度均更新 Canvas 对照曲线、标题、单位、pressed 状态、无障碍标签与当前商品六行表格；键盘 Enter 可切换维度。
- 平板 `1024×768`：证据工作区收敛为单列，数据来源为两列，图表宽约 909px；无横向溢出。
- 手机 `390×844`：商品摘要、曲线和数据表单列显示，三按钮宽约 103px、图表和表格宽约 308px；无横向溢出。
- 主路径：手机完成城市暴雨 → 主动查看 COAST → 打开预约 → 必填焦点落到姓名 → 提交成功 → 关闭后焦点返回发起入口。
- 渐进增强：`?fallback=1` 下 3D canvas 为 0，数据 canvas 为 1，STORM 的 17 m/s 形变末点仍为 70 mm；`?motion=reduce` 下数据切换可用且非必要运动约 `0.01ms`。
- 原页回归：`rain.html` 默认中雨、WebGPU canvas、五个控制和无横向溢出全部通过。
- 最终六张证据位于被仓库忽略的 `validation-artifacts/001-aurelia-weatherproof/`：桌面首屏、默认数据、COAST 风曲线、手机数据、fallback 和预约成功。R17 的六张旧证据已被 R18 可重建截图替换，产品代码和用户数据未被删除。
