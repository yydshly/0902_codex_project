# 全量模块与能力清单

## 统计口径

本清单基于上游提交 [`14f10a9`](https://github.com/mcncarl/yichen-skills/commit/14f10a96a719a1d60aa02c582e674d5b197d5861)。

- 根目录存在 21 个包含 `SKILL.md` 的 Skill 目录。
- `plugins/yichen-grok-consult` 内另有 1 个插件型 Skill。
- 因此物理上共有 22 个 `SKILL.md`。
- `yichen-social-bookmarks-exporter` 是退役兼容入口，不再代表一套独立执行能力。
- README 的 24 项“能力”是产品口径：同一个 Skill 可以承担多项能力，例如抖音和小红书已知链接均归入 `yichen-content-archive`。

## 实现层级

以下层级是本研究的分析标签，不是上游官方评级：

| 层级 | 含义 |
| --- | --- |
| `P` Protocol | 主要由提示词、模板和 Agent 操作 SOP 构成，本仓库没有核心执行脚本 |
| `B` Bridge | 主要编排浏览器、外部仓库、外部 CLI、API 或私有 Runtime |
| `E` Executor | 仓库内包含承担主要工作的确定性执行脚本 |
| `V` Verified executor | 除执行器外，还有较系统的 preflight、schema、回读、hash、fixture 或测试契约 |
| `D` Deprecated | 仅为旧名称或迁移兼容，不应作为新入口 |

这些标签允许组合，例如 `B/V` 表示核心运行依赖外部系统，但仓库对交接和验证有较完整约束。

## 1. 研究与信息获取

### `yichen-web-research` — `B/V`

- **定位：** 互联网研究总入口和多阶段路由器，不是搜索引擎。
- **输入：** 研究目标、范围、时间、地区、受众、语言和来源约束。
- **输出：** 研究计划、子路由结果、证据 bundle、历史纵轴、当前横轴、矛盾与保留缺口、综合报告。
- **实际机制：** 读取研究 brief，运行离线计划器，将任务分发到统一搜索、已知链接归档、收藏导出或 ASR；横纵研究使用证据组装器校验结构门。
- **内置实现：** 4 个 Python 脚本，包括 doctor、family validator、横纵计划器和证据组装器；有测试契约。
- **核心边界：** 搜索结束不自动授权归档；候选和原文打开状态不自动等于事实已验证；范围字段不完整时阻止正式报告。
- **依赖：** 子 Skill、可选搜索后端、可能的登录态和第三方 CLI。
- **来源：** [`SKILL.md`](https://github.com/mcncarl/yichen-skills/blob/14f10a96a719a1d60aa02c582e674d5b197d5861/yichen-web-research/SKILL.md)

### `yichen-unified-search` — `B/V`

- **定位：** 公开网页与平台搜索的统一路由、适配和候选归一化层。
- **覆盖：** AI HOT、普通/批量/垂直网页、GitHub、微信公众号、微博、小红书、抖音、今日头条、知乎、X、B站、YouTube、小宇宙等。
- **输入：** 查询词、平台、模式、时间范围、限制数量、X 筛选条件等。
- **输出：** schema 1.0 envelope：`request`、`routes`、`candidates`、`coverage`、`errors`。
- **实际机制：** 离线路由器生成执行计划，各后端适配器把异构结果映射到统一候选；X 多查询执行去重、时间窗和互动排序。
- **内置实现：** 10 个 Python 适配器/路由脚本，22 个测试及 fixture 文件，是仓库内实现最密集的模块之一。
- **关键技术：** canonical URL、稳定平台 ID、provenance、候选回执、HMAC-SHA256、客户端时间过滤、确定性去重。
- **核心边界：** 不处理用户直接提供的已知 URL，不下载、不归档、不读取私人收藏；搜索摘要不能作为正文证据。
- **外部依赖：** AnySearch、AI HOT、Firecrawl、Grok CLI、FxTwitter、OpenCLI、`gh`、`yt-dlp`、平台 CLI/API 等，按路线选择。
- **来源：** [`SKILL.md`](https://github.com/mcncarl/yichen-skills/blob/14f10a96a719a1d60aa02c582e674d5b197d5861/yichen-unified-search/SKILL.md)、[候选 schema](https://github.com/mcncarl/yichen-skills/blob/14f10a96a719a1d60aa02c582e674d5b197d5861/yichen-unified-search/references/candidate-schema.md)

### `yichen-content-archive` — `E/V`

- **定位：** 已知 URL、URL 文件、已确认候选和明确有限容器的读取、下载与归档层。
- **覆盖：** 普通网页、X Post/Article、小红书、抖音、公众号、YouTube、B站、小宇宙。
- **输入：** 明确 URL、上游已确认候选或 `known_collection`；操作为 read、download 或 archive。
- **输出：** 平台目录、`archive-manifest.jsonl`、`run-summary.json`、`failures.json` 和标准 handoff。
- **内置实现：** 6 个 Python 执行器，覆盖小红书、抖音、公众号、小宇宙和 X 已知 URL。
- **可靠性设计：** `-run-N` 冲突目录、排他创建、只读 checkpoint、SHA-256 续跑校验、失败清单。
- **核心边界：** 不做关键词搜索、推荐发现或补量；只有用户明确要求才下载；授权和候选交接不自动扩大范围。
- **来源：** [`SKILL.md`](https://github.com/mcncarl/yichen-skills/blob/14f10a96a719a1d60aa02c582e674d5b197d5861/yichen-content-archive/SKILL.md)、[handoff contract](https://github.com/mcncarl/yichen-skills/blob/14f10a96a719a1d60aa02c582e674d5b197d5861/yichen-content-archive/references/handoff-contract.md)

### `yichen-bookmarks-export` — `E/V`

- **定位：** 私人收藏和书签链接的只读导出执行入口。
- **覆盖：** 小红书收藏、抖音收藏、X/Twitter 书签。
- **输入：** 用户当轮明确授权的平台、范围和输出位置。
- **输出：** 每平台 URL 文件、`export-summary.json`、`handoff.json`。
- **实际机制：** 小红书/抖音通过用户当前 Chrome 页面滚动和提取；X 通过另行安装的 Field Theory GraphQL-only 版本读取本地索引。
- **内置实现：** Chrome collector、X 导出器、链接验证器和契约测试。
- **核心边界：** 只导出链接，不读取正文、不分析收藏、不下载媒体；授权不跨平台、不跨任务，也不转移给归档。
- **风险：** 平台 DOM 和 X 内部 GraphQL 都是非官方兼容路径。
- **来源：** [`SKILL.md`](https://github.com/mcncarl/yichen-skills/blob/14f10a96a719a1d60aa02c582e674d5b197d5861/yichen-bookmarks-export/SKILL.md)

### `yichen-chatgpt-web-research` — `B`

- **定位：** 通过用户已登录的官方 ChatGPT 网页进行产品、市场、竞品或第二意见研究。
- **输入：** 研究问题、目标账号/浏览器 profile、所需模型和报告结构。
- **输出：** 网页生成的原始 Markdown、可读报告、对话 URL、提取方式和完成标记验证。
- **实际机制：** 优先控制 Chrome 扩展中的真实 ChatGPT 页面，失败后使用可见 Computer Use；通过唯一完成 marker 判断响应是否完整。
- **内置实现：** 本仓库没有浏览器客户端脚本，核心依赖宿主环境提供的 Chrome/Computer Use Skill。
- **核心边界：** 不用 API、普通 Web 搜索或另一个免费账号替代用户指定的 ChatGPT 官网路线。
- **风险：** 对 ChatGPT UI、宿主工具名称和模型标签高度敏感。
- **来源：** [`SKILL.md`](https://github.com/mcncarl/yichen-skills/blob/14f10a96a719a1d60aa02c582e674d5b197d5861/yichen-chatgpt-web-research/SKILL.md)

### `yichen-grok-consult` — `B/V`，Codex plugin

- **定位：** 在 GPT 主导的 Codex 会话中把 Grok 作为只读顾问和 X 原生搜索器。
- **工具：** `search_x_with_grok`、`ask_grok`、`review_with_grok`、`challenge_with_grok`。
- **实际机制：** Node MCP server 启动隔离 Grok CLI 会话；X 搜索要求核验原生 `x_search` 调用，并从 X Snowflake ID 确定性解码时间。
- **回退链：** 官方 Grok CLI；只有明确额度耗尽才进入匿名 FxTwitter；再失败且用户当轮明确授权后才允许 OpenCLI、xreach。
- **隔离：** 普通顾问工具禁用本地文件、shell、MCP、记忆、子 Agent 和 Web 工具；搜索工具只开放限定搜索能力。
- **风险：** 查询和回复会发送给 xAI，并可能保留在本地隔离会话目录；认证回退可能使用本机 X 登录态。
- **来源：** [Skill](https://github.com/mcncarl/yichen-skills/blob/14f10a96a719a1d60aa02c582e674d5b197d5861/plugins/yichen-grok-consult/skills/yichen-grok-consult/SKILL.md)、[plugin manifest](https://github.com/mcncarl/yichen-skills/blob/14f10a96a719a1d60aa02c582e674d5b197d5861/plugins/yichen-grok-consult/.codex-plugin/plugin.json)、[MCP server](https://github.com/mcncarl/yichen-skills/blob/14f10a96a719a1d60aa02c582e674d5b197d5861/plugins/yichen-grok-consult/mcp/server.mjs)

## 2. ASR、视频与内容生产

### `yichen-asr` — `B/V`

- **定位：** Step ASR 与豆包 ASR 的统一选择器，不是第三种识别模型。
- **路由：** 纯文本默认 Step；时间戳、SRT、停顿分析和粗剪默认豆包；用户点名服务商时不允许静默切换。
- **输入：** 本地媒体、是否需要时间戳/SRT/粗剪、指定 provider。
- **输出：** provider、mode、文件列表、request ID、计费状态和错误。
- **内置实现：** 离线路由器和不读取密钥内容的 doctor。
- **外部依赖：** Step 执行器不随仓库提供；豆包由 `yichen-volc-asr` 执行。
- **核心边界：** 一旦向某服务商提交，就必须恢复原任务，不能跨服务商重复提交和重复计费。
- **来源：** [`SKILL.md`](https://github.com/mcncarl/yichen-skills/blob/14f10a96a719a1d60aa02c582e674d5b197d5861/yichen-asr/SKILL.md)

### `yichen-volc-asr` — `E`

- **定位：** 火山引擎豆包 ASR 转写和口播自动粗剪。
- **输入：** 本地音视频工作副本、缓存/请求 ID、转写或剪辑模式。
- **输出：** 转写文本、SRT、ASR cache、pending 记录、粗剪 MP4、删留方案。
- **实际机制：** 视频音轨通过 FFmpeg 处理，调用火山长音频 ASR，按时间戳生成保留/删除区间，再分段 concat；粗剪结果需要复转写审核。
- **可靠性设计：** 原片不动、pending request 恢复、试用/付费 token 分离、三层剪辑审核。
- **风险：** 媒体需要上传到第三方 ASR；剪辑判断中仍有主观 Agent 参与；费用和额度必须外部确认。
- **来源：** [`SKILL.md`](https://github.com/mcncarl/yichen-skills/blob/14f10a96a719a1d60aa02c582e674d5b197d5861/yichen-volc-asr/SKILL.md)

### `yichen-video-content` — `P`

- **定位：** 对标视频口播稿的结构化内容拆解框架。
- **输入：** 视频元数据和完整口播稿。
- **输出：** 13 个模块，包括基本信息、标题、开头、正文、逐句作用、结构、话术、表达效率、认知落差、素材、AI 工作流、可模仿点和爆款结构模板。
- **实际机制：** 由宿主模型按固定分析框架生成报告，没有独立内容分析程序。
- **特点：** 强调每句话的作用标签、问题诊断和具体优化建议。
- **风险：** 结论高度依赖模型判断；“爆款”和“AI 味”没有量化验证基线。
- **来源：** [`SKILL.md`](https://github.com/mcncarl/yichen-skills/blob/14f10a96a719a1d60aa02c582e674d5b197d5861/yichen-video-content/SKILL.md)

### `yichen-jianying-editor` — `P/B`

- **定位：** 剪映/CapCut 桌面端导入、时间线、视觉精修、字幕和导出的操作 SOP。
- **输入：** 媒体文件、用户要求、当前剪映项目状态。
- **输出：** 剪映项目修改、导出视频和可选操作日志。
- **实际机制：** 依赖 Computer Use 控制 `com.lemon.lvpro`；本仓库不包含剪映自动化执行器。
- **边界：** ASR 删停顿和自动粗剪不在此 Skill 内，应先交给 `yichen-volc-asr`。
- **风险：** 桌面 UI 坐标和控件变化、人工确认、误操作恢复能力有限。
- **来源：** [`SKILL.md`](https://github.com/mcncarl/yichen-skills/blob/14f10a96a719a1d60aa02c582e674d5b197d5861/yichen-jianying-editor/SKILL.md)

### `yichen-x-article-draft-uploader` — `E/V`

- **实际 frontmatter 名称：** `x-article-draft-uploader`，与目录名不同。
- **定位：** 将本地 Markdown/Obsidian 长文转换成 X Article 草稿，只保存草稿，不点击发布。
- **支持：** 可选 5:2 封面、正文图片、Markdown pipe table 到 X 原生表格、最多 25 个正文媒体项。
- **实际机制：** 解析 Markdown，复用 Chrome cookies 启动独立 Playwright Chromium，上载标题、正文、表格和媒体。
- **验证：** dry-run 检查文件和边界；正文通过 Unicode code point 长度、SHA-256 和 checkpoints；媒体使用 dHash、RGB/亮度样本、锚点、出现序号和 DOM 顺序绑定；重载同一草稿后才允许报告持久化成功。
- **风险：** cookie 属于敏感凭据；X DOM 和编辑器行为可能变化；视觉指纹仍有误配边界。
- **来源：** [`SKILL.md`](https://github.com/mcncarl/yichen-skills/blob/14f10a96a719a1d60aa02c582e674d5b197d5861/yichen-x-article-draft-uploader/SKILL.md)

### `yichen-x-slicer` — `E/V`

- **定位：** 把一个公开 X Post、Quote Post 或同作者 Thread 转成 1080×1440 图片、PNG ZIP 和 H.264 MP4。
- **模板：** 默认 `sunset`，总计 11 套视觉模板。
- **实际机制：** 匿名 FxTwitter 获取公开数据，Node/Playwright 渲染卡片，FFmpeg 生成视频；原生视频在媒体区完整播放并保留对应源音频。
- **内容规则：** 只保留焦点 Post 或同作者直系 Thread；排除 Quote、其他作者回复和支线。
- **验证：** 文本覆盖、图片 contain、零尺寸 source label、ZIP hash、视频解码、帧率/时长、源视频起中末帧匹配、样本级音频区间校验。
- **边界：** 不生成 TTS、配音、BGM，不调用剪映，不发布；运行时媒体只允许限定 HTTPS 主机和 MIME/签名。
- **来源：** [`SKILL.md`](https://github.com/mcncarl/yichen-skills/blob/14f10a96a719a1d60aa02c582e674d5b197d5861/yichen-x-slicer/SKILL.md)

## 3. 微信、企微与平台数据

### `yichen-wechat-local-vault` — `E`

- **定位：** Mac 微信 4.x 本地数字资产库和查询分析台。
- **输入：** 本机微信数据库、已保存或经授权捕获的 key、会话/时间/内容范围。
- **输出：** 私密明文 vault、manifest、联系人/会话/消息查询、Markdown 导出、群聊摘要素材包、朋友圈和收藏结果。
- **实际机制：** key 匹配或 Frida 捕获、SQLCipher 4 页面解密、全量/增量快照；`vault_cli.py` 只读查询解密后的 vault。
- **内置实现：** 7 个 Python 脚本。
- **核心边界：** 默认不操作微信 UI，只处理第一官方容器；不把 key、明文库和真实身份信息放入项目或云盘。
- **风险：** 高敏感私人数据、版本和 schema 变化、密钥捕获的合规和系统安全边界。
- **来源：** [`SKILL.md`](https://github.com/mcncarl/yichen-skills/blob/14f10a96a719a1d60aa02c582e674d5b197d5861/yichen-wechat-local-vault/SKILL.md)

### `yichen-wechat-windows-reader` — `E/V`，实验性

- **定位：** Windows 微信明文静态快照的本地只读查询器，不负责发现、复制或解密源数据库。
- **输入：** 用户显式提供、已 checkpoint、无 WAL/SHM/journal sidecar 的明文 SQLite 快照和 UUIDv4 manifest。
- **输出：** 会话候选、历史、搜索结果和 Markdown 导出；会话 ID 按快照隔离和匿名化。
- **实际机制：** schema 白名单、路径/reparse/UNC 检查、SQLite 完整性校验、`mode=ro&immutable=1`、`PRAGMA query_only=ON`。
- **验证：** Windows CI、hash-locked dependency、合成 fixture 和 SBOM。
- **核心边界：** 不访问 `Weixin.exe`、进程内存、密钥、加密数据库或网络；快照文本始终视为不可信数据。
- **限制：** 只覆盖合成 fixture 验证过的 schema，未证明对真实 Windows 微信 4.x 广泛兼容。
- **来源：** [`SKILL.md`](https://github.com/mcncarl/yichen-skills/blob/14f10a96a719a1d60aa02c582e674d5b197d5861/yichen-wechat-windows-reader/SKILL.md)

### `yichen-wechat-mp-batch-exporter` — `B/E`

- **定位：** 公众号批量文章和历史数据导出。
- **输入：** 已知文章 URL、公众号历史目标、用户自有登录/凭据，以及可选指标和评论需求。
- **输出：** Markdown/HTML/JSON 文章、图片目录、history summary、去重清单、原创文章列表、可选互动指标与评论。
- **实际机制：** 内置 URL 下载、history 分析和 doctor；完整历史依赖 `wechat-article-exporter`，指标和评论依赖 `wxdown-service`。
- **重要口径：** 区分 `publish_groups`、`expanded_url_items` 和 `original_articles`，避免把不同计数都描述成文章总数。
- **核心边界：** 不控制微信 UI；QR 登录、证书、系统代理和凭据文件均需显式人工确认。
- **风险：** 上游服务、账号权限、证书代理和平台协议变化。
- **来源：** [`SKILL.md`](https://github.com/mcncarl/yichen-skills/blob/14f10a96a719a1d60aa02c582e674d5b197d5861/yichen-wechat-mp-batch-exporter/SKILL.md)

### `yichen-wecom-local-vault` — `E`

- **定位：** Mac 企业微信 5.x 本地数据库的密钥捕获、解密快照和只读查询。
- **输入：** 用户授权的本地数据集、可选 key 文件、明确的 attach/重签副本授权。
- **输出：** 带 plaintext 标识的时间戳快照、联系人/会话/消息查询和 Markdown/JSON 导出。
- **实际机制：** Frida 被动捕获、ad-hoc 重签副本启动、可选 Mach VM 扫描、AES key 候选与数据库首页验证、WAL 已提交页合并。
- **核心边界：** 不修改源数据库，不发送消息，不自动关闭 SIP 或放宽系统权限；每次生成新快照，不覆盖。
- **风险：** 企业数据敏感度高；二进制函数、key 路径和 schema 随客户端版本变化；媒体正文暂不解密。
- **来源：** [`SKILL.md`](https://github.com/mcncarl/yichen-skills/blob/14f10a96a719a1d60aa02c582e674d5b197d5861/yichen-wecom-local-vault/SKILL.md)

### `yichen-wecom-operations` — `B/V`

- **定位：** 通过官方 `@wecom/cli` 执行企微云端文档、待办、会议和日程操作。
- **输入：** 用户当轮明确要求、目标资源、Markdown 文档和可选图片 helper。
- **输出：** 创建/更新后的企微资源链接和本地 `0600` 回执。
- **实际机制：** doctor 先检查 CLI 版本、加密配置和 category 权限；脚本负责智能文档预检和执行。
- **核心边界：** 永不发送企微消息或控制客户端；删除、取消、覆写前重新确认精确目标；`errcode == 0` 才算远程成功。
- **外部依赖：** 官方 WeCom CLI；本地图片上传还依赖仓库不分发的 helper。
- **风险：** 企业租户权限差异；创建成功与回读验证成功需要分别报告。
- **来源：** [`SKILL.md`](https://github.com/mcncarl/yichen-skills/blob/14f10a96a719a1d60aa02c582e674d5b197d5861/yichen-wecom-operations/SKILL.md)

### `yichen-mac-wechat-dual-open` — `E`

- **定位：** 不使用注入工具，在 macOS 创建第二个微信应用实例。
- **实际机制：** 复制应用、修改 `CFBundleIdentifier`、ad-hoc codesign、Launch Services 注册和直接启动；Pillow 负责图标蓝色化。
- **输出：** `~/Applications/WeChat-2.app`、独立 bundle id、语言设置和可辨识图标。
- **核心边界：** 永不修改 `/Applications/WeChat.app`；删除现有副本前询问。
- **已知限制：** 微信更新后需要 repair；推送可能不可靠；签名检查收紧时可能失效。
- **来源：** [`SKILL.md`](https://github.com/mcncarl/yichen-skills/blob/14f10a96a719a1d60aa02c582e674d5b197d5861/yichen-mac-wechat-dual-open/SKILL.md)

## 4. 记忆、总结和 Agent 协作

### `yichen-summary` — `P`

- **定位：** 把当前对话精华保存为 Obsidian Markdown。
- **输入：** 当前完整对话和 Obsidian 目标路径。
- **输出：** 背景、核心内容、解决方案、关键要点和相关信息组成的 Markdown。
- **实际机制：** 由宿主模型筛选和生成文本，再通过 shell 创建文件；没有独立解析脚本。
- **特点：** 过滤低价值过渡和临时调试，保留决策理由、代码、经验和错误教训。
- **风险：** 示例使用 `cat >`，缺少明确冲突保护；总结质量与隐私筛选依赖宿主 Agent。
- **来源：** [`SKILL.md`](https://github.com/mcncarl/yichen-skills/blob/14f10a96a719a1d60aa02c582e674d5b197d5861/yichen-summary/SKILL.md)

### `yichen-agent-memory` — `B/V`

- **定位：** 安装和维护独立的 Agent Memory Vault，让 Claude Code 与 Codex 共享同一事实源。
- **事实源：** Markdown；SQLite/FTS 是快速索引，可选 Zvec 做语义检索。
- **操作：** bootstrap、索引、search、prewrite reconcile、claim、closeout、audit、doctor、hook 和定时审计。
- **一致性机制：** session claim ledger、进程锁、内容 hash observation、Git baseline，防止不同 Agent 会话互相提交对方未完成的记忆。
- **内置实现：** 本仓库只有 Agent-facing runbook 和元数据；核心脚本位于 `mcncarl/agent-memory-vault`。
- **核心边界：** 自动记忆不是正式事实源；搜索命中只是候选，必须回读 Markdown；修复派生索引不能改写事实。
- **来源：** [`SKILL.md`](https://github.com/mcncarl/yichen-skills/blob/14f10a96a719a1d60aa02c582e674d5b197d5861/yichen-agent-memory/SKILL.md)、[外部实现仓库](https://github.com/mcncarl/agent-memory-vault)

### `yichen-codex-chatgpt` — `P/B/V`

- **定位：** ChatGPT Pro 做研究、架构和只读审查，Codex 独占本地写入与测试的双 Agent 协作协议。
- **模式：** research、code、hybrid、review、显式 opt-in 的 local-only。
- **状态机：** `PRECHECK → INIT → PLAN → EXECUTING → EXECUTED → REVIEW → DONE/PLAN/BLOCKED/ERROR`。
- **数据通道：** 浏览器只传短控制消息；真实代码、diff 和验证证据由 Secure Tunnel 和只读 `remote-review` MCP 提供。
- **只读工具面：** `workspace_overview`、`list_files`、`search_code`、`read_snippet`、`review_changes`、`verification_report`、`review_packet`。
- **内置实现：** 主要是 `SKILL.md` 和 9 份协议参考；私有 Tunnel、Runtime Key、App ID 和 MCP runtime 不随仓库分发。
- **核心边界：** ChatGPT 建议不是授权；Codex 是唯一 writer；默认最多一次自动修复；消息 ID 和 marker 防止重复执行计划。
- **风险：** 缺失私有 Runtime 时无法复现完整代码协作；网页 UI 与模型标签变化会影响前置验证。
- **来源：** [`SKILL.md`](https://github.com/mcncarl/yichen-skills/blob/14f10a96a719a1d60aa02c582e674d5b197d5861/yichen-codex-chatgpt/SKILL.md)、[C2C protocol](https://github.com/mcncarl/yichen-skills/blob/14f10a96a719a1d60aa02c582e674d5b197d5861/yichen-codex-chatgpt/references/c2c-protocol.md)

### `yichen-social-bookmarks-exporter` — `D`

- **定位：** 已退役兼容调用名。
- **行为：** 仅在用户明确点名旧名称时触发，随后要求重新读取并使用 `yichen-bookmarks-export`。
- **注意：** 目录仍保留旧脚本，但 Skill 明确禁止执行，不能把它计为第二套收藏导出实现。
- **来源：** [`SKILL.md`](https://github.com/mcncarl/yichen-skills/blob/14f10a96a719a1d60aa02c582e674d5b197d5861/yichen-social-bookmarks-exporter/SKILL.md)

## 横向比较

| 类型 | 模块 | 主要价值 | 主要不确定性 |
| --- | --- | --- | --- |
| 完整执行与验证 | unified-search、content-archive、bookmarks-export、X Article、X Slicer、Windows reader | 可重复、可检查、失败边界较清楚 | 平台变化与跨平台兼容 |
| 本地敏感数据执行 | WeChat vault、WeCom vault | 把私人数据转成可查询资产 | 版本、隐私、权限和合规风险高 |
| 外部系统桥接 | ChatGPT Web、Grok、WeCom operations、公众号 exporter、Agent Memory | 复用成熟平台或独立产品 | 外部安装、账号、许可和服务稳定性 |
| 路由层 | web-research、asr | 稳定用户意图，替换具体后端 | 依赖下游全部契约一致 |
| Prompt/SOP | summary、video-content、Jianying | 快速把个人方法固化为可调用模板 | 结果质量主要依赖模型与 UI 操作 |
| 兼容层 | social-bookmarks-exporter | 旧调用不立即失效 | 容易造成能力重复和文档混淆 |

## 能力缺口

仓库当前没有提供以下通用平台能力：

- 统一的 Skill runtime、调度器、任务队列或持久化工作流引擎；
- 所有 Skill 共用的机器可读 manifest 和权限声明格式；
- 多用户、租户、RBAC、审批流和集中审计；
- 统一成本、配额、延迟、成功率和平台变更监控；
- 跨 Skill 的稳定事务、补偿、重试和幂等协议；
- 完整 Windows/Linux/macOS 兼容矩阵；
- 对所有真实外部平台的自动端到端 CI；
- 可商业使用的宽松上游许可证。
