# 008 · bannedbook/fanqiang

> 结论：`fanqiang` 是一个以可获得性与低门槛使用为目标的项目集合和分发入口。ChromeGo 与 FQNews2 是仓库中的两条并列产品路径；代理协议、加密、DNS、路由和数据转发主要来自 sing-box、Xray、Clash Meta 等上游内核，而不是 `fanqiang` 自研。

- 上游仓库：<https://github.com/bannedbook/fanqiang>
- 固定研究提交：[`6b09e61`](https://github.com/bannedbook/fanqiang/tree/6b09e61cd77c00020c24676f926d7374afd5dd04)
- 研究日期：2026-09-04
- 在线演示：<https://yydshly.github.io/0902_codex_project/demos/008-bannedbook-fanqiang/>
- 本地 Demo：[`apps/008-bannedbook-fanqiang`](../../apps/008-bannedbook-fanqiang)

![fanqiang 项目架构、能力归属与研究优先级](assets/cover.png)

## 一、项目到底是什么

最准确的分类不是“代理协议库”，也不是“一个 Clash 客户端”，而是四层结构：

```text
fanqiang 仓库
  ├─ 文档 / 配置 / 脚本 / Release / 产品目录
  ├─ ChromeGo：Windows 浏览器工具箱
  │    └─ 调用 Clash Meta / Xray / sing-box / Hysteria / Psiphon 等独立程序
  └─ FQNews2：Android RSS 新闻应用
       └─ Feeder 业务层 + 节点管理 + sing-box/libcore + OkHttp + 缓存

真正的网络能力层
  └─ 上游代理内核 + 外部节点：协议、加密、DNS、路由、连接与转发
```

因此可以说它是“工具合集”，但还要补一句：**仓库不仅收集工具，也包含两个不同程度的产品封装。** ChromeGo 的封装薄，主要是启动与打包；FQNews2 的封装深，已经进入业务应用的请求生命周期。

还要避免两个容易造成架构偏差的说法：`fanqiang` **不是统一适配框架**，仓库没有统一插件接口、配置模型、运行时或生命周期管理；FQNews2 能配置多种节点和协议，是因为当前集成了 sing-box/libcore，**可配置不等于可以任意替换代理内核**。

## 二、ChromeGo、FQNews2 与 Clash 的区别

| 对象 | 本质 | 核心抽象 | 能力范围 |
| --- | --- | --- | --- |
| `fanqiang` | 仓库与分发入口 | 项目目录、说明、配置、发行包 | 组织与传播，不统一执行代理 |
| ChromeGo | Windows 浏览器工具箱 | CMD 启动器、默认配置、Chrome 代理参数 | 选择并启动某个独立工具 |
| FQNews2 | Android 新闻产品 | RSS 业务 + 节点控制面 + 应用内本地代理 | 只为自身业务请求提供代理与离线体验 |
| Clash 类软件 | 代理内核/客户端体系 | 统一配置、规则、策略组、控制 API | 在一个运行时内统一执行路由和转发 |

ChromeGo 的“多内核”更像一个工具箱：每个程序保留自己的配置和运行方式。它没有把所有引擎适配成统一的 `RuntimeAdapter`，也没有提供 Clash 式的统一策略模型。

FQNews2 则不是“另一个 ChromeGo”。它从 Feeder 新闻阅读业务出发，把节点管理和本地代理变成 RSS 抓取的一部分，产品边界是应用自己的请求，而不是操作系统全部流量。

## 三、FQNews2 的真实调用链

从源码可以恢复出一条完整的控制面与数据面链路：

1. `NodeImporter` 接收节点链接或订阅内容；
2. `Formats` 把不同节点格式解析成内部代理实体；
3. 节点保存为 `ProxyEntity` 档案；
4. 对候选档案执行 URL 测试；
5. 从可用结果中选择延迟最低者；
6. `ConfigBuilder` 生成 sing-box 配置并声明本地 mixed 入站；
7. `BoxInstance` 启动 libcore，监听 `127.0.0.1:5888`；
8. RSS 客户端的 OkHttp 请求通过这个本地代理访问订阅源；
9. 抓取结果进入数据库与缓存，离线时继续阅读。

其中 1–6 属于应用控制面：管理节点、做决策、编译配置、控制生命周期。7–8 的协议连接、加密与转发属于 sing-box/libcore 数据面。第 9 步是新闻产品自己的业务能力。

关键证据：

- [`NodeImporter.kt`](https://github.com/bannedbook/fanqiang/blob/6b09e61cd77c00020c24676f926d7374afd5dd04/fqnews2/app/src/fqnews/java/app/NodeImporter.kt#L34-L138)：节点导入、URL 测试和最低延迟选择；
- [`Formats.kt`](https://github.com/bannedbook/fanqiang/blob/6b09e61cd77c00020c24676f926d7374afd5dd04/fqnews2/app/src/main/java/io/nekohasekai/sagernet/ktx/Formats.kt#L107-L202)：节点格式解析；
- [`ProxyEntity.kt`](https://github.com/bannedbook/fanqiang/blob/6b09e61cd77c00020c24676f926d7374afd5dd04/fqnews2/app/src/main/java/io/nekohasekai/sagernet/database/ProxyEntity.kt#L71-L91)：代理实体类型；
- [`ConfigBuilder.kt`](https://github.com/bannedbook/fanqiang/blob/6b09e61cd77c00020c24676f926d7374afd5dd04/fqnews2/app/src/main/java/io/nekohasekai/sagernet/fmt/ConfigBuilder.kt#L330-L498)：配置编译与本地 mixed 入站；
- [`BoxInstance.kt`](https://github.com/bannedbook/fanqiang/blob/6b09e61cd77c00020c24676f926d7374afd5dd04/fqnews2/app/src/main/java/io/nekohasekai/sagernet/bg/proto/BoxInstance.kt#L108-L256)：libcore 实例与插件边界；
- [`JsonFeedParser.kt`](https://github.com/bannedbook/fanqiang/blob/6b09e61cd77c00020c24676f926d7374afd5dd04/fqnews2/app/src/main/java/com/nononsenseapps/jsonfeed/JsonFeedParser.kt#L17-L40)：RSS HTTP 客户端连接本地代理。

## 四、FQNews2 的能力深度

### 产品深度：中高

它不是一个把浏览器 WebView 包起来的壳。现有代码把 RSS 同步、节点档案、测试、选择、配置生成、服务启动和离线缓存连接起来，已经形成业务闭环。这证明“按业务需要接入代理”可以是一项产品能力，而不必要求用户先配置系统代理。

### 代理集成深度：中等

应用具备自己的控制逻辑，但协议执行仍依赖 sing-box/libcore。它能够决定“用哪个节点、何时启动、请求走哪里”，并不等于它自己完成“如何握手、如何加密、如何封装和转发”。

### 协议与网络内核深度：低

仓库中存在协议类型、解析器和配置代码，只能证明它能描述或调用这些协议。真正实现仍位于编译后的上游核心。静态 APK 中出现协议字符串，也不能推导出所有外部插件都随包发布。

### 系统接管深度：低

[`SagerConnection.kt`](https://github.com/bannedbook/fanqiang/blob/6b09e61cd77c00020c24676f926d7374afd5dd04/fqnews2/app/src/main/java/io/nekohasekai/sagernet/bg/SagerConnection.kt#L23-L28) 当前只把连接模式映射到 `ProxyService`；[`NativeInterface.openTun()`](https://github.com/bannedbook/fanqiang/blob/6b09e61cd77c00020c24676f926d7374afd5dd04/fqnews2/app/src/main/java/moe/matsuri/nb4a/NativeInterface.kt#L29-L34) 的 VPN 路径未启用。因此更准确的说法是“应用级代理”，不能说成“Android 全局 VPN”。

## 五、风险与不可过度解读的地方

1. **TLS 安全默认值不适合作为生产基线。** [`OkHttpBuilderExtensions.kt`](https://github.com/bannedbook/fanqiang/blob/6b09e61cd77c00020c24676f926d7374afd5dd04/fqnews2/app/src/main/java/com/nononsenseapps/jsonfeed/OkHttpBuilderExtensions.kt#L12-L36) 的路径可以跳过证书链检查和主机名验证。
2. **失败节点直接删除过于激进。** 瞬时抖动、DNS 故障或目标测试站异常都可能被误判为节点永久失效；应改为失败计数、退避、冷却与恢复探测。
3. **桌面更新链缺少可信完整性门禁。** ChromeGo 相关脚本存在跳过 TLS 校验、直接覆盖配置的路径，适合研究分发便利性，不适合作为可信更新范式。
4. **源码无法直接一键复现发布包。** [`app/build.gradle.kts`](https://github.com/bannedbook/fanqiang/blob/6b09e61cd77c00020c24676f926d7374afd5dd04/fqnews2/app/build.gradle.kts#L269) 依赖本地 `libcore.aar`；[`libcore/go.mod`](https://github.com/bannedbook/fanqiang/blob/6b09e61cd77c00020c24676f926d7374afd5dd04/fqnews2/libcore/go.mod#L96-L125) 又引用仓库中不存在的兄弟目录。
5. **发布溯源较弱。** 已检查 APK 的版本控制元数据记录了一个不在当前 `fanqiang` 历史中的 revision，无法从仓库提交一一复现发布包。

这些发现不等于恶意判断；它们说明项目适合做思路样本，不应未经重新设计就作为生产依赖或安全基线。

## 六、研究优先级

| 排名 | 方向 | 优先级 | 原因 |
| --- | --- | --- | --- |
| 1 | sing-box / Xray / Clash 等底层内核 | 最高 | 真正理解协议、DNS、路由、TUN、转发和性能 |
| 2 | FQNews2 的应用内代理集成 | 中高 | 学习业务如何按需接入网络能力并提供弱网体验 |
| 3 | 可靠性与控制面 | 中高 | 可沉淀健康检测、熔断、自动切换、观测和可信更新 |
| 4 | ChromeGo 的打包与分发 | 中 | 学习低门槛触达、多工具兜底和便携封装 |
| 5 | `fanqiang` 仓库本体 | 低 | 主要研究目录组织、传播与发行策略即可 |

## 七、对我们的意义

不建议复制一个“多二进制工具箱”。更值得抽象的是一套独立于具体内核的业务代理运行时：

- `RuntimeAdapter`：统一启动、停止、健康和版本信息；
- `ConfigCompiler`：把业务策略编译为 sing-box、Xray 或 Clash 配置；
- 节点控制面：导入、校验、测速、质量评分、熔断、退避和自动切换；
- 可观测性：连接事件、选路原因、失败分类、DNS 与请求质量；
- 可信交付：签名清单、哈希验证、原子更新、配置回滚与构建溯源；
- 业务 SDK：让浏览器、移动端和具体应用只声明访问策略，不直接理解代理协议。

`fanqiang` 给出的启发不是“收藏更多工具”，而是：**底层能力只有被包装成具体任务、自动决策和失败兜底，才会成为普通用户真正能用的产品。**
