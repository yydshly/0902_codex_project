# Neko Master

> 以代理网关为数据源，把短生命周期连接的累计计数转换成实时、历史与多维可查询的流量事实；本研究重点验证它的数据正确性管线，而不是复刻管理面板。

[![Neko Master 能力全景图串联数据接入、实时采集、存储扩展、动态分析，并标出可观察范围、能力边界和产品扩展方向](../../apps/004-foru17-neko-master/docs/neko-master-capability-panorama.png)](https://yydshly.github.io/0902_codex_project/demos/004-foru17-neko-master/)

*架构与能力总图：说明从代理网关累计快照到实时流量分析的闭环，以及上游已有能力和仍需建设的治理层。*

## 项目信息

| 字段 | 内容 |
| --- | --- |
| 研究编号 | `004` |
| 上游仓库 | <https://github.com/foru17/neko-master> |
| 研究基线 | [`6f72cfd`](https://github.com/foru17/neko-master/commit/6f72cfd0db69e2952713f24a648812407fef1e78)，`v1.4.0`，2026-07-19 |
| 上游许可证 | [MIT License](https://github.com/foru17/neko-master/blob/6f72cfd0db69e2952713f24a648812407fef1e78/LICENSE) |
| 研究状态 | `validated` |
| 首次研究 | `2026-09-03` |
| 最近更新 | `2026-09-03` |
| 标签 | `observability, network, realtime, sqlite, clickhouse, edge-agent` |

## 为什么值得研究

Neko Master 不是代理内核，也不是抓包器。它位于 Clash/Mihomo/Surge 的控制接口之上，把网关连接快照转换为面向人的监控和审计视图。其研究价值主要来自三个工程问题：

1. 累计连接计数如何在连接复用、闲置和网关重启时正确转换成增量；
2. 如何同时得到低延迟界面和较低数据库写入压力；
3. 如何让本地直连采集与跨 LAN Agent 上报共享统计语义。

这使它成为“实时数据产品正确性”的完整案例，而不仅是一套图表页面。

## 研究问题

- [x] 它观察什么、不观察什么？
- [x] 如何从网关累计连接快照生成不会重复计算的增量？
- [x] 为什么批量落库后仍能接近实时显示？
- [x] Direct 与 Agent 模式如何统一？
- [x] SQLite 到 ClickHouse 的扩展路径是什么？
- [x] 哪些设计可以迁移到其他可观测产品？

## 结论摘要

- **已验证：** Clash/Mihomo 采集器读取连接累计值，用 connection id 保存上次水位并计算差值；遇到计数器回退时将当前累计值视为新流量，避免持续漏计。
- **已验证：** `BatchBuffer` 按 backend、分钟、域名、IP、源 IP、代理链和规则等维度聚合，默认周期性批量写入；未落库增量同时进入 `RealtimeStore`，查询时再与数据库基线合并。
- **已验证：** 远端 Go Agent 在网关旁做相同差分，通过带 `requestId` 的 HTTP 批次上报；服务端进行短期幂等去重，并用心跳维护在线与延迟状态。
- **已验证：** SQLite 是默认且保留的配置/统计存储；ClickHouse 是可选扩展，提供双写、读路由、迁移对账与失败回退。
- **推断：** 项目的竞争力更接近“网关遥测语义和实时数据一致性”，而不是通用网络安全或代理管理。
- **评价：** 它适合作为家庭、工作室、Homelab 和小型多站点的流量观察层；不应被当作全网抓包、DPI、IDS/IPS 或企业级多租户平台。

## 能力边界

| 能力 | 可以回答 | 不能回答 |
| --- | --- | --- |
| 总体与趋势 | 上下行总量、连接数、分钟/小时趋势 | 单个数据包内容或进程级网络调用 |
| 域名/IP | 哪些目的地址消耗流量、关联哪些代理和规则 | 绕过配置网关的流量 |
| 设备 | 哪个源 IP 产生流量、关联哪些域名 | 没有可靠 source IP 的连接来源 |
| 规则链 | 规则、策略组和最终代理之间的流量关系 | 通用防火墙策略执行与自动封禁 |
| 地域 | 通过目标 IP 的 GeoIP/ASN 推断目的区域 | Surge 代理端 DNS 场景下不可见的真实落地 IP |
| 多网关 | Direct 和 Agent 后端的统一视图与健康状态 | 任意网络设备的零配置发现 |

## 当前电脑兼容性观察

本次只读检查发现 Clash Verge Rev 的 Mihomo 核心正在运行，TUN 模式已开启并存在活跃连接，因此经 Mihomo 路由的本机流量在技术上属于 Neko Master 可统计范围。但当前 `enable_external_controller` 为 `false`，配置的 `127.0.0.1:9097` 控制端点不可达，所以现在无法直接接入。检查没有读取密钥、数据包内容，也没有修改代理设置。完整记录见 [本机代理兼容性检查](../../apps/004-foru17-neko-master/docs/local-proxy-compatibility.md)。

## 架构速览

```text
Clash/Mihomo WebSocket ─┐
Surge HTTP polling ─────┼─→ adapter snapshot
Remote Go Agent ────────┘          │
                                   ▼
                         per-flow delta tracker
                                   │
                      ┌────────────┴────────────┐
                      ▼                         ▼
                RealtimeStore              BatchBuffer
                  热增量               30s / 容量触发
                      │                         │
                      │             SQLite + optional ClickHouse
                      └────────────┬────────────┘
                                   ▼
                           REST / WebSocket
                                   ▼
                     Next.js + React Query dashboard
```

详细模块、关键契约和可扩展方向见 [`notes/architecture.md`](notes/architecture.md)。

## 关键实现

- [`gateway.collector.ts`](https://github.com/foru17/neko-master/blob/6f72cfd0db69e2952713f24a648812407fef1e78/apps/collector/src/modules/collector/gateway.collector.ts)：Clash/Mihomo WebSocket 生命周期、连接水位、计数器重置与批量刷新。
- [`surge.collector.ts`](https://github.com/foru17/neko-master/blob/6f72cfd0db69e2952713f24a648812407fef1e78/apps/collector/src/modules/collector/surge.collector.ts)：Surge 轮询、完成请求防重复和策略路径提取。
- [`batch-buffer.ts`](https://github.com/foru17/neko-master/blob/6f72cfd0db69e2952713f24a648812407fef1e78/apps/collector/src/modules/collector/batch-buffer.ts)：多维键合并、SQLite/ClickHouse 写入调度。
- [`realtime.store.ts`](https://github.com/foru17/neko-master/blob/6f72cfd0db69e2952713f24a648812407fef1e78/apps/collector/src/modules/realtime/realtime.store.ts)：落库前热增量及其与查询结果的合并。
- [`schema.ts`](https://github.com/foru17/neko-master/blob/6f72cfd0db69e2952713f24a648812407fef1e78/apps/collector/src/database/schema.ts)：累计表、分钟/小时事实表和交叉维度表。
- [`runner.go`](https://github.com/foru17/neko-master/blob/6f72cfd0db69e2952713f24a648812407fef1e78/apps/agent/internal/agent/runner.go)：远端差分、内存队列、批次重试、心跳和配置同步。

## 实验与验证

| 验证问题 | 方法 | 结果 | 证据 | 限制 |
| --- | --- | --- | --- | --- |
| 固定上游是否可复现 | clone 并 checkout `6f72cfd`；构建时校验 HEAD | 通过 | Demo 生成的 `upstream/UPSTREAM_VERSION.json` | 只复制研究所需的 22 个文件 |
| 累计计数能否演示为增量 | 合成连接保存 previous/current，正常路径取差；回退路径取 current | 通过 | Demo“模拟计数器重置”及数据管线视图 | 是语义复现，不运行上游 collector |
| 多维观察是否可理解 | 同一事件同步更新域名/IP、地区、代理、设备、规则和健康视图 | 通过 | Demo 九个能力视图 | 不验证真实 GeoIP 与规则解析 |
| 离线是否与空数据区分 | 触发模拟断联，保留历史指标并显式显示重连状态 | 通过 | Demo“模拟网关断联” | 不执行真实指数退避网络请求 |
| 静态交付是否成立 | 应用检查与独立构建；根目录目录校验 | 通过 | [`apps/004-foru17-neko-master/README.md`](../../apps/004-foru17-neko-master/README.md) | 根聚合重建受其他正在运行项目的 Windows 文件锁影响，见浏览器验收记录 |

## 优点与局限

### 优点

- 数据源、采集、差分、聚合、热数据、历史存储和前端消费形成完整闭环。
- 对计数器回退、半开 WebSocket、批量刷写失败、内存增长和错误态等真实问题有明确处理。
- SQLite 默认路径部署简单，ClickHouse 作为可选扩展而非强制依赖。
- Direct 与 Agent 模式复用同一 `TrafficUpdate` 和 `BatchBuffer` 语义。
- 仓库用 `AGENTS.md` 和任务型 skill 记录容易引发回归的跨模块契约，适合 AI 辅助维护。

### 局限

- 可见范围取决于代理网关控制 API，不是全流量或包级观测。
- 当前访问控制是共享 token 模型，不具备用户、租户和细粒度 RBAC。
- Agent 待上报队列及服务端短期 `requestId` 去重主要在内存中；长离线与进程重启仍可向磁盘 spool 和持久化序列扩展。
- 网关适配器是业务模块而非公开插件协议，增加 sing-box、dae 等数据源仍需改动核心代码。
- 当前产品偏可视化和人工审计，缺少告警、异常检测、Webhook 与标准可观测导出闭环。

## 可复用结论

1. **累计遥测必须先变成增量事件。** 直接累加连续快照一定会重复计算；必须保存水位并定义回退语义。
2. **低延迟不等于高频落库。** 数据库基线加内存热增量，可以同时控制写放大和界面延迟。
3. **同一领域事件应贯穿所有传输模式。** Direct 与 Agent 只改变采集位置和传输方式，不应改变统计口径。
4. **扩容存储要允许渐进迁移。** 双写、对账、读路由和失败回退比一次性切换更适合自托管产品。
5. **错误态不能伪装成空态。** 网关不可达、查询失败和真实零流量必须在 API 与 UI 上保持不同语义。
6. **把回归经验写成仓库契约。** 上游 `AGENTS.md` 明确记录规则命名、唯一写路径、schema 多注册点与协议版本联动，比泛化代码规范更有价值。

## 可扩展方向

1. Agent 磁盘 WAL/spool、持久化序列号和跨重启幂等。
2. 稳定的 Gateway Adapter 接口，扩展 sing-box、dae、Xray、NetFlow/sFlow。
3. 流量基线、突增和陌生目标检测，以及 Webhook/消息通知。
4. Prometheus/OpenTelemetry、CSV/Parquet 和 Grafana 数据源。
5. 多用户、RBAC、OIDC、凭证加密和操作审计。
6. 应用/厂商分类、DNS 日志关联和隐私可配置的数据脱敏。

## 展示素材

本条目不复制上游截图。Web Demo 的界面、图表、图形和合成数据均为研究自制，避免把视觉相似误写成运行上游产品的证据。素材说明见 [`assets/README.md`](assets/README.md)。

## Web Demo

- 源码：[`apps/004-foru17-neko-master/`](../../apps/004-foru17-neko-master/)
- 验收：[`docs/browser-validation.md`](../../apps/004-foru17-neko-master/docs/browser-validation.md)
- 在线地址：<https://yydshly.github.io/0902_codex_project/demos/004-foru17-neko-master/>
- 验证内容：九个顶层视图、多网关和时间范围、域名/IP 搜索、地区排序、代理/设备/规则钻取、健康连续性、五类设置、计数器重置和断联恢复。
- 验证边界：全部数据为确定性合成数据；不连接真实网关，不运行上游后端，不证明数据库性能。

## 来源与相关链接

- [上游 README](https://github.com/foru17/neko-master/blob/6f72cfd0db69e2952713f24a648812407fef1e78/README.zh.md)
- [系统架构](https://github.com/foru17/neko-master/blob/6f72cfd0db69e2952713f24a648812407fef1e78/docs/architecture.md)
- [Agent 模式](https://github.com/foru17/neko-master/blob/6f72cfd0db69e2952713f24a648812407fef1e78/docs/agent/overview.md)
- [v1.4.0 更新记录](https://github.com/foru17/neko-master/releases/tag/v1.4.0)
- [开放 Issue](https://github.com/foru17/neko-master/issues)

## 变更记录

- `2026-09-03`：固定 v1.4.0 研究基线，完成架构研究、九视图全量能力 Demo，并记录当前 Clash Verge Rev 的只读兼容性检查。
