# Neko Master：从连接快照到可查询事实

## 1. 观察边界

Neko Master 读取代理网关控制面，而不是网络接口上的原始数据包：

- Clash/Mihomo：WebSocket `/connections`，连接对象包含累计 upload/download、host、destination IP、source IP、chains 和 rule。
- Surge：HTTP `/v1/requests/recent`，以轮询方式获取最近请求，再从 notes 和策略接口补充链路信息。
- Agent：把以上读取动作移到远端 LAN 内，通过面板专用 token 向中心 collector 主动上报。

因此系统只能观察经过受支持网关、且由控制 API 暴露的字段。这个边界决定了它不能替代包捕获、DPI、终端进程观测或通用网络安全设备。

## 2. 正确性核心：水位与差分

设某连接在连续快照中的累计下载值为 `C(t)`，正常增量为：

```text
delta(t) = C(t) - C(t-1), when C(t) >= C(t-1)
```

当网关重启或连接 ID 被复用时，计数器可能回退。上游当前语义为：

```text
delta(t) = C(t), when C(t) < C(t-1)
```

同时把连接的 counted 状态复位，以便新连接计数不会遗漏。对仍存在但无新流量的连接也刷新 `lastSeen`，避免它被当作过期记录删除后，再以全部累计量重复加入。

## 3. 写入模型

`BatchBuffer` 的聚合键包含：

```text
backendId + minute + domain + ip + chain + fullChain + rule + rulePayload + sourceIP
```

同一键在刷新窗口内只保留一条 `TrafficUpdate`，数值相加。数据库的主写路径再同时维护：

- 域名、IP、代理链、规则、设备、国家等累计表；
- 分钟和小时事实表；
- 域名×代理、IP×代理、规则×链路等交叉表；
- 连接日志、网关健康、配置和 Agent 快照。

这是一种写时物化多种读取维度的选择：读取简单快速，但增加统计维度时必须同步修改多个 schema、写路径、清理路径和 ClickHouse 映射。

## 4. 热数据与持久化基线

批量落库会产生可见延迟。上游把每个 `TrafficUpdate` 同时写入 `RealtimeStore`，查询时执行：

```text
visible result = persisted base + unflushed realtime delta
```

只有持久化成功后才清除对应热增量。ClickHouse 详情表和聚合表可能部分成功，因此上游还区分清理 summary 侧或 dimension 侧，避免重复或丢失。

## 5. ClickHouse 渐进扩展

SQLite 始终承担配置和元数据。统计写入可经历以下阶段：

1. 只写/只读 SQLite；
2. SQLite + ClickHouse 双写，但仍读 SQLite；
3. `auto` 或 `clickhouse` 读取；
4. ClickHouse 健康时减少或停止 SQLite 统计写入；
5. ClickHouse 不健康时恢复 SQLite 兜底。

这条路径降低了自托管用户从单文件数据库迁移到分析数据库的风险。

## 6. Agent 语义

Go Agent 在网关旁执行水位追踪，将增量放入有上限的内存队列，并按批次上报。失败批次保留原 `requestId`，重试时服务端可以识别重复请求。心跳负责 agent identity、版本、网关类型和延迟；配置与策略状态以 hash 去重后同步。

当前可继续扩展：

- 内存队列改为磁盘 spool；
- 单调序列和持久化 acknowledgement；
- 服务端持久化幂等窗口；
- 上报压缩和动态背压；
- Agent 自身 Prometheus/OpenTelemetry 指标。

## 7. 对本总库的研究价值

这个案例把 UI 图表背后的数据语义完整暴露出来。对我们的可迁移价值按优先级是：

1. 数据库基线 + 内存增量的实时读取模型；
2. 累计计数器回退、连接去重和错误态的正确性契约；
3. Direct/Agent 两种拓扑共享一个领域事件；
4. SQLite → ClickHouse 的可回滚迁移；
5. 用 `AGENTS.md` 与任务型 skill 保存跨模块回归知识。

界面风格和具体网关字段反而是次要内容，不应成为复刻重点。

