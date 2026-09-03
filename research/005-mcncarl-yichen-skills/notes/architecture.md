# 架构与底层原理

## 1. 系统定位

Yichen Skills 的运行关系不是“仓库启动一个 Agent”，而是“宿主 Agent 加载多个能力包”：

```text
Agent host
  ├─ Codex
  ├─ Claude Code
  └─ 特定流程中的 ChatGPT/Grok
        │
        │ 根据 Skill name / description 和用户请求选择
        ▼
Skill package
  ├─ SKILL.md           自然语言协议
  ├─ agents/openai.yaml 展示或宿主元数据
  ├─ references/        按需读取的细化契约
  ├─ scripts/           确定性执行器
  ├─ tests/             离线契约与 fixture
  └─ assets/            模板和样式资产
```

仓库本身没有统一常驻进程、中央 planner、消息循环或自主目标。Agent 的能力来自宿主模型，仓库提供的是领域知识、工作流程和工具入口。

## 2. 四层架构

### 2.1 意图与协议层

每个 `SKILL.md` 的 frontmatter 至少提供 `name` 和 `description`。宿主根据 description 判断用户请求是否命中。正文继续规定：

- 适用和不适用请求；
- 最小必要动作；
- 前置检查和必要依赖；
- 命令、脚本或外部工具；
- 授权、费用、敏感数据与删除规则；
- 结果验证和最终报告结构；
- 阻塞、错误、回退和禁止降级条件。

这一层的作用是压缩 Agent 的选择空间，让相似任务反复采用同一套工作方法。

### 2.2 路由与编排层

路由层不直接提供底层业务能力，而是把模糊请求映射到最小执行面。

互联网研究家族：

```text
研究目标
  ├─ 多阶段、横纵研究 ───────→ yichen-web-research
  ├─ 关键词候选发现 ─────────→ yichen-unified-search
  ├─ 已知 URL/有限容器 ──────→ yichen-content-archive
  ├─ 私人收藏链接 ───────────→ yichen-bookmarks-export
  └─ 已有本地音视频 ─────────→ yichen-asr
```

ASR 家族：

```text
已有媒体
  ├─ 只要全文/摘要 ──────────→ Step ASR
  ├─ 时间戳/SRT ─────────────→ Doubao ASR
  └─ 停顿分析/口播粗剪 ──────→ Doubao ASR + FFmpeg
```

关键原则是路由后不递归返回总入口，避免代理循环；单阶段动作直接进入对应子 Skill，避免为了“显得智能”而扩大任务。

### 2.3 执行与适配层

执行层把 Agent 的决定转换成外部动作：

| 执行方式 | 用途 | 示例 |
| --- | --- | --- |
| Python CLI | 数据库、解析、下载、路由、doctor、manifest | 微信/企微 vault、研究家族、ASR |
| Node.js | MCP、浏览器脚本、图片与视频管线 | Grok plugin、X Slicer、收藏 collector |
| Playwright | 独立浏览器自动化和页面渲染 | X Article、抖音、X Slicer |
| Computer Use | 桌面 UI 与最后浏览器回退 | 剪映、ChatGPT 官网 |
| FFmpeg/ffprobe | 音视频探测、切片、concat、编码和 QA | ASR 粗剪、X Slicer |
| SQLite/SQLCipher | 私有数据快照、查询和索引 | 微信/企微 vault、Agent Memory |
| MCP | 向宿主暴露结构化外部工具 | Grok Consult、私有 remote-review |
| 外部 CLI/API | 复用平台或供应商能力 | WeCom CLI、Grok CLI、AnySearch、Firecrawl |

适配器不是隐藏第三方依赖，而是记录真实后端、登录态、路线原因和已知限制。这使同一上层意图可以在后端变化时保持相对稳定。

### 2.4 证据与验收层

复杂 Skill 不以“命令退出码为 0”作为唯一成功条件，而是生成或检查证据：

- `candidate envelope`：搜索请求、实际路线、候选、覆盖和错误；
- `archive-manifest.jsonl`：逐输入的状态、产物和实际后端；
- `handoff.json`：生产者、操作、范围、授权、计数和下一步；
- `pending request`：记录 ASR 已提交任务，避免重复计费；
- `content hash`：证明本地源、缓存、ZIP、视频或记忆观察一致；
- `qa-report.json`：把图片、视频、音频和文本验证拆成显式检查；
- `message_id / reply_marker`：保证跨浏览器和跨 Agent 消息不会重复执行。

这一层是仓库从“提示词集合”升级为“工作流协议库”的关键。

## 3. 数据契约

### 3.1 搜索候选 envelope

统一搜索的核心不是把结果拼成一段文字，而是将不同后端映射到同一结构：

```json
{
  "schema_version": "1.0",
  "request": {},
  "routes": [],
  "candidates": [],
  "coverage": [],
  "errors": []
}
```

一个 candidate 继续记录：

- 稳定 `candidate_id` 或 canonical URL hash；
- query、platform、真实 backend 和 rank；
- title、URL、author、published time、content type；
- 指标中的已知值和 `null`；
- public / authenticated_public；
- candidate、opened original、checked time；
- source ID、retrieval time、route reason 和 limitations。

设计目的：保留 provenance，避免把缺失值伪造为 0，避免把搜索排序当作全网热度，也避免打开页面后自动把所有内容升级为已验证事实。

### 3.2 归档 handoff

搜索、私人收藏和归档之间通过 `yichen-content-handoff/v1` 交接，但 handoff 明确不是新授权。核心字段包括：

```json
{
  "producer_skill": "yichen-bookmarks-export",
  "operation": "bookmark_export",
  "scope": {"discovery_performed": false},
  "authorization": {
    "private_read_authorized_this_turn": true,
    "download_authorized_this_turn": false,
    "authorization_not_transferable": true
  },
  "artifacts": [],
  "counts": {},
  "failures": [],
  "next_step": {"requires_explicit_user_request": true}
}
```

它把“这一步做了什么”和“下一步是否获得授权”彻底分开。

### 3.3 横纵研究证据 bundle

横纵研究先固定 subject、goal、起始日期、地区、受众和语言，再生成历史与当前维度的 workstream。正式报告要求：

- scope complete；
- 每个 workstream 有基础 claim；
- timeline 和 cross-sectional matrix 非空；
- 来源与 claim 通过 supports/contradicts link 关联；
- link 包含 locator、event date 和 scope；
- 矛盾、地区/语言覆盖和 retained gap 已处理；
- 未来类请求必须有基于纵横证据的 opportunity map；
- 三情景提供可观察 trigger 和 invalidator，不编造概率。

这里的脚本主要验证结构完备性，事实正确性仍需要 Agent 打开一手来源判断。

## 4. 状态机与恰好一次语义

`yichen-codex-chatgpt` 将双 Agent 协作定义成有限状态机：

```text
build:
PRECHECK → INIT → PLAN → EXECUTING → EXECUTED → REVIEW
                                                   ├─ DONE
                                                   ├─ PLAN（一次授权修复）
                                                   ├─ BLOCKED
                                                   └─ ERROR

review_only:
PRECHECK → INIT → REVIEW
                    ├─ DONE
                    ├─ BLOCKED
                    └─ ERROR
```

重要语义：

- ChatGPT 是 architect/reviewer，Codex 是唯一 writer 和 test runner；
- ChatGPT 只能通过绑定单一项目的七个只读 MCP 工具看真实代码；
- 浏览器消息只传任务 ID、短控制文本和 marker，不传代码、diff、日志和绝对路径；
- 每个 PLAN 通过 task ID、message ID、response ID 和 reply marker 绑定；
- 已消费 PLAN 在刷新、提取重试或应用重启后也不能再次执行；
- 发送状态不确定时先证明是否发送，不能换 ID 重发以“继续推进”；
- 默认最多两个 Codex 执行迭代，继续修复需要新的用户授权和 task ID。

这是一种面向 Agent 协作的应用层恰好一次协议，而不是分布式系统级绝对 exactly-once。

## 5. 验证深度案例

### 5.1 X Article

上传前：

- 检查 Markdown、图片路径、封面、表格尺寸和媒体上限；
- 计算规范化正文长度、SHA-256、3–5 个内容 checkpoints；
- 检查远程图片、raw HTML、reference image 和弱锚点。

上传后：

- 重新加载同一草稿；
- 校验标题、正文、表格、媒体数量、顺序和位置；
- 正文媒体通过 dHash、RGB/亮度样本、宽高比、锚点、出现序号和 DOM 顺序绑定；
- 缺少 `persistence_verified=true` 或证据不一致时不得报告成功。

### 5.2 X Slicer

它不仅输出图片和视频，还验证：

- 每帧固定 1080×1440；
- 规范化文本按顺序完整覆盖；
- source label 为空且视觉零尺寸；
- Quote 和排除节点未进入产物；
- ZIP 只含最终 PNG 且 hash 一致；
- MP4 为 H.264、30fps、可完整解码；
- 源视频起、中、末帧与成片媒体区匹配；
- 音频只在对应源视频区间出现，其余区间静音。

### 5.3 Windows 微信快照读取

它把输入视为不可信证据源：

- 禁止自动发现数据目录；
- 拒绝 WAL/SHM/journal、UNC、symlink、junction 和越界路径；
- 验证 manifest UUID、必需数据库、消息分片和 schema；
- 以 immutable read-only URI 和 `query_only` 打开；
- 聊天内容中的命令和 URL 不得执行或打开；
- 导出位置和覆盖分别需要显式确认。

## 6. 安全架构

### 6.1 主要原则

1. **匿名公开路线优先。** 登录态和私人数据是额外能力，不是默认便利。
2. **最小范围。** 平台、查询、日期、条数、容器和输出目录尽量固定。
3. **只读默认。** 多数社交和本地数据 Skill 禁止发布、互动、消息和账号变更。
4. **授权不可继承。** 历史授权、浏览器已登录或上游 handoff 不能替代当前任务授权。
5. **不覆盖、不删除。** 新 run、时间戳快照和 `-run-N` 优先；清理需要单独确认。
6. **密钥不进入仓库和结果。** 凭据来自环境变量、Keychain 或私有权限文件。
7. **失败关闭。** 认证、证据、schema 或目标不明确时停下，不靠换后端绕过边界。

### 6.2 软约束与硬约束

| 类型 | 例子 | 保障强度 |
| --- | --- | --- |
| Skill 文本规则 | “不得自动下载”“先向用户确认” | 依赖宿主 Agent 正确遵守 |
| CLI 参数校验 | `--confirm-attach`、`--confirm-overwrite-exact-dir` | 程序可阻止普通误用 |
| 数据库只读模式 | immutable URI、`query_only` | 对该连接提供较强写保护 |
| 文件排他创建 | 目标存在即失败、自动新 run | 降低覆盖风险 |
| hash/manifest | 源文件、缓存、ZIP、视频、记忆观察绑定 | 可检测错误或过期产物 |
| OS/进程隔离 | 私有目录权限、隔离 HOME、只读 MCP tool surface | 比提示词约束更强，但仍依赖配置正确 |

不能把 Skill 文本中的安全承诺等同于沙箱或访问控制。企业使用仍需要运行时级 least privilege、凭据代理、网络策略、审计和数据保留机制。

## 7. 外部依赖边界

仓库中存在四种“看起来有能力、实际上依赖外部实现”的情况：

1. **独立产品：** Agent Memory Vault 的核心脚本在另一个仓库。
2. **外部供应商：** AnySearch、Firecrawl、AI HOT、StepFun、Volcengine、xAI。
3. **外部 CLI：** Grok CLI、WeCom CLI、OpenCLI、Field Theory、`gh`、`yt-dlp`、`bili`。
4. **未公开私有 Runtime：** Codex × ChatGPT 的 Secure Tunnel、Runtime Key、private App 和 remote-review server。

因此“仓库声明支持某能力”应进一步区分：

- 仓库是否包含实现；
- 是否只包含适配器；
- 是否需要用户账号和登录态；
- 是否会把查询或媒体发送到第三方；
- 是否能在没有私有组件时复现；
- 是否有真实 E2E 验证，而不仅是离线契约测试。

## 8. 架构评价

### 已验证事实

- 模块边界主要按用户意图和授权阶段划分，而不是只按平台划分。
- 复杂模块使用 schema、manifest、hash 和状态机提高可检查性。
- 仓库同时存在 prompt-only、bridge、executor 和 verified executor，不是统一成熟度产品。
- 敏感平台路线普遍强调本地、只读、明确授权和不输出凭据。

### 推断

- 这些 Skill 很可能由作者在真实使用中逐步增加失败规则，形成“经验驱动的防错协议”。
- 研究家族正在从个人脚本集合向统一数据契约演进，但尚未形成通用 SDK。
- 最近的重命名和文档不同步表明结构仍在调整，不适合依赖隐式兼容。

### 评价

- 最强部分是授权分离、候选/事实分离和结果证据化。
- 最大架构缺口是缺少统一 Skill runtime、跨 Skill 生命周期管理和运行时级权限模型。
- 如果迁移到团队系统，应保留原则，重写与个人环境和非官方平台强耦合的执行层。
