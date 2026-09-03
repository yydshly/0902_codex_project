# Aurelia 扩展实验室交付契约

## 设计契约

| 字段 | 约定 |
| --- | --- |
| Entry mode | Revision-led：保留已验证基线，新增独立扩展表面 |
| Request revision | R2：从能力证明扩展到可调、可测的产品化实验室 |
| Target user and context | 评估 WebGPU 动态视觉复用价值的设计、创意技术与前端工程人员 |
| Desired first impression | 同一程序化生命场景从“能运行”变成“可度量、可取舍、可调参” |
| Visual ambition | Immersive |
| Experience architecture | Spatial Stage |
| Scene base | Three.js `WebGPURenderer` + TSL Compute |
| Scene persistence | 实验操作期间始终可见；基线说明仍保留在独立 `/` 页面 |
| Foreground control model | 左侧模式与参数，右侧实时规模/性能证据，顶部基线返回入口 |
| State-to-scene mapping | 档位改变真实实例数与计算频率；观察模式改变弹簧可视化、Bloom 与群体 charge |
| Mobile transformation | 控制和证据压缩为上下两个紧凑面板，不转成长文档流 |
| Fallback | WebGPU 不可用时仍显示配置、能力边界和返回基线入口 |
| Visual constraints | 延续现有深海、青蓝、半透明技术面板语言；不遮挡主要水母 |
| Information constraints | 明确区分“真实运行值”“本机观察值”和“非跨设备基准” |
| Operation constraints | 档位切换允许整页重建 GPU 资源；实时观察模式不得重建物理系统 |
| Environment constraints | localhost/HTTPS、WebGPU；单一深色主题；无后端、登录或持久化服务 |
| Primary journey | 选择档位 → 等待 GPU 重建 → 比较点/弹簧/Hz/FPS → 切换结构或能量视图 → 返回基线 |
| Required artifacts | `lab.html`、实验运行代码、响应式样式、构建适配、README、浏览器证据、仓库级构建 |
| Autonomy authorization | 用户明确要求“保留已有演示，然后进行扩展继续” |
| User-decision boundary | 新业务场景、后端采集、跨设备正式基准、改变上游物理模型需另行决定 |
| Observable completion criteria | `/` 默认行为保持；`lab.html` 三档真实规模不同；模式控件、键盘、移动布局、错误说明可用；构建与审计通过 |

## 路由结论

```text
Selected pattern: Technical capability demo + production-hardening lab
Evidence branch: pinned upstream source + hardware WebGPU runtime
Required inputs: existing validated demo and generated-source adapter
Expected output: preserved baseline plus independently addressable extension lab
What should update the skill: none; project evidence remains local to this research entry
```

## 覆盖清单

| 用户阶段 | 要求或产物 | 表面 / 状态 | 证据 | 阶段 | 状态 | 下一步 |
| --- | --- | --- | --- | --- | --- | --- |
| 保留 | 基线演示保持默认 10 实例、360 Hz | `/` 桌面 ready | 单画布运行；指标 `10 / 32.4K / 92.9K`；最终截图 | 1/9 | pass | — |
| 扩展 | 三个档位改变真实物理规模 | `lab.html` eco/balanced/full | `1 / 3.24K / 9.29K / 120 Hz`；`3 / 9.72K / 27.9K / 240 Hz`；`10 / 32.4K / 92.9K / 360 Hz` | 5/8 | pass | — |
| 扩展 | 结构、生命、能量观察模式 | `lab.html` ready | `aria-pressed`、场景变化和模式说明一致；结构状态截图 | 4/6 | pass | — |
| 扩展 | 桌面信息层不遮挡主体 | 1440×1000 | 居中出生适配后，三只水母在首屏可见；控制和遥测分列 | 2/3 | pass | — |
| 扩展 | 平板和手机仍可操作 | 900×900、390×844 | 两个视口均无横向溢出，控制与遥测可见；手机面板内部可滚动 | 7 | pass | — |
| 扩展 | 键盘焦点与语义状态完整 | 桌面键盘 | 首个 Tab 到达跳转链接，2px 可见轮廓；模式和暂停按钮提供语义状态 | 7 | pass | — |
| 扩展 | reduced-motion 与 WebGPU fallback 可读 | 两种能力状态 | reduced-motion 默认暂停；禁用 `navigator.gpu` 后错误卡可见、实验控件禁用、档位链接保留 | 6/8 | pass | — |
| 交付 | 文档、锁文件、目录与站点构建 | 仓库 | Aurelia `npm audit` 零漏洞、双入口构建通过，根目录 catalog 检查通过 | 9 | defer | 项目 002 的本地预览释放 `dist`、项目 003 的 Vite 释放 `esbuild.exe` 后重跑根目录 `npm run verify` |

## 支持边界

- 只支持深色主题；本次不新增浅色主题。
- 档位切换通过 URL 参数和整页重载安全重建 GPU 资源，不承诺无缝热切换。
- FPS 是当前浏览器窗口的短时观察值，不是跨设备性能结论。
- 当前仍不增加碰撞、自碰撞、XPBD 或 WebGL/CPU 物理降级。

## 浏览器验收记录

- Canonical runtime：`npm run dev` → `http://127.0.0.1:4173/` 与 `/lab.html`；
- 桌面：1440×1000；平板：900×900；手机：390×844；
- 状态：基线、三种质量档位、结构模式、暂停、阻尼输入、reduced-motion、无 WebGPU；
- 结果：所有页面单画布运行，交互控制台无错误，最终截图保存在被 Git 忽略的 `validation-artifacts/001-aurelia/`；
- 本机顺序采样曾观察到轻量约 32 FPS、均衡约 16 FPS、完整约 10 FPS。GPU 初始化、随机场景、窗口遮挡和连续多页面运行会影响数值，因此这里只能证明档位产生了可测负载差异，不能作为设备基准。

## 交付审计

本轮 Aurelia 范围已闭合：基线未被替换，扩展入口、真实工作集档位、观察与参数控制、响应式布局、能力降级、文档及子项目工程验证均有证据；没有剩余 `continue` 项。根目录聚合验证已尝试，但项目 002 的活动预览占用 `dist`，项目 003 的活动 Vite 占用其 `esbuild.exe`，因此不干扰其他并行工作并将聚合复核记为 `defer`；两个进程结束后重新执行 `npm run verify` 即可。跨设备正式基准和物理模型升级属于后续产品决策，不作为本轮延期项。
