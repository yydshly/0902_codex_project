# 验证、成熟度与风险

## 1. 研究基线

| 项目 | 值 |
| --- | --- |
| 上游 | `mcncarl/yichen-skills` |
| 分支 | `main` |
| 提交 | `14f10a96a719a1d60aa02c582e674d5b197d5861` |
| 提交时间 | 2026-09-02 14:52:08 +08:00 |
| 提交说明 | `Rename codex-chatgpt skill` |
| 研究环境 | Windows / PowerShell / Python 3.10 / Node.js |
| 研究日期 | 2026-09-03 |

## 2. 仓库规模

对固定提交执行文件统计：

| 指标 | 数量 | 解释 |
| --- | ---: | --- |
| Git 跟踪文件 | 206 | 包括文档、源文件、测试、配置和资产 |
| `SKILL.md` | 22 | 21 个根级目录，加插件内 1 个 |
| Python 文件 | 76 | 包括 scripts、tests 和 fixture builder |
| Node `.mjs` 文件 | 8 | 包括浏览器 collector、X Slicer 和 MCP server |
| tests/fixture 文件 | 30 | 不是 30 个测试 case；部分文件包含大量 unittest |

结论：仓库不是纯提示词集合，但文件数量也不能证明真实平台路线均可运行。

## 3. 本地离线测试

### 汇总

| Suite | 总数 | 通过 | 跳过 | 失败/错误 | 结果 |
| --- | ---: | ---: | ---: | ---: | --- |
| Unified Search | 244 | 237 | 0 | 7 | fail |
| Web Research | 74 | 71 | 1 | 2 | fail |
| Content Archive | 33 | 33 | 0 | 0 | pass |
| Bookmarks Export | 4 | 4 | 0 | 0 | pass |
| Unified ASR | 6 | 6 | 0 | 0 | pass |
| X Article uploader | 2 | 0 | 0 | 2 | dependency load error |
| Windows WeChat reader | 1 | 0 | 0 | 1 | dependency load error |
| Grok fallback policy | 3 | 3 | 0 | 0 | pass |
| **总计** | **367** | **354** | **1** | **12** | partial |

### 失败分类

#### Windows 路径分隔符

Unified Search 有 5 个路由断言要求脚本路径以 `/adapter.py` 结尾；Windows 实际生成反斜杠路径。观察上更像测试可移植性问题，但也说明当前测试并未统一使用跨平台路径归一化。

#### POSIX 私有文件权限

- Firecrawl key 文件检查要求 `0600`；Windows 权限模型不同，因此测试失败。
- AnySearch HMAC receipt 的跨进程私有 key 文件测试也未在当前 Windows 环境通过。
- Web Research doctor 测试直接调用 `os.getuid()`，Windows 没有该接口。

这些问题说明研究家族的凭据安全设计主要以 POSIX/macOS/Linux 为基线。

#### 可选依赖未安装

- X Article uploader 因缺少 `Crypto`/`pycryptodome` 无法加载测试模块。
- Windows WeChat reader 因缺少 hash-locked `zstandard` 环境无法加载 fixture。

这两类错误不证明代码实现错误。上游 CI 会安装指定依赖，本次研究没有为了静态审计修改全局 Python 环境。

### Family validator

执行：

```powershell
python yichen-web-research\scripts\validate_family.py
```

结果：`ok: false`，原因是 Web Research 和 Unified Search 的上述 Windows 离线测试未通过。validator 的 Python AST、内部 Markdown links、router metadata、研究结构门和安全边界检查通过。

### 未执行范围

本次没有执行：

- 使用真实账号的 X、小红书、抖音、微信、企微或 ChatGPT 浏览器操作；
- 真实 AnySearch、Firecrawl、Grok、StepFun、Volcengine API 请求；
- 真实微信/企微数据库 key 捕获与解密；
- X Article 草稿创建和 reload 验收；
- X Slicer 对真实 Post 的完整图片、视频和音频 QA；
- 私有 Secure Tunnel 和 `remote-review` MCP；
- macOS 专用微信双开、剪映和 vault 路线。

所以 `validated` 代表“仓库结构、文档、脚本静态阅读和可运行离线测试范围内完成验证”，不代表所有真实平台集成均已端到端验证。

## 4. 当前一致性问题

### Codex × ChatGPT 重命名未完全同步

固定提交的实际目录和 frontmatter 已是：

```text
yichen-codex-chatgpt/
name: yichen-codex-chatgpt
```

但根 README 仍使用：

```text
codex-chatgpt/
npx skills add ... --skill codex-chatgpt
```

`.github/workflows/research-skills.yml` 的 path filters、扫描 roots 和相关说明也仍引用旧目录。这意味着：

- README 中对应安装命令和相对链接可能失效；
- 只修改新目录时，研究家族 CI 可能不会由 path filter 触发；
- 私有路径和 credential-shaped value 扫描没有覆盖新目录；
- 最近重命名后的发布状态需要重新确认。

这是固定提交的事实，不应外推为仓库长期状态；上游后续提交可能修复。

### Frontmatter 与目录命名不完全一致

`yichen-x-article-draft-uploader/SKILL.md` 的 `name` 是 `x-article-draft-uploader`，少了 `yichen-` 前缀。根 README 和安装说明需要同时理解目录名和触发名，可能造成安装、发现或迁移混淆。

### 旧实现仍留在退役目录

`yichen-social-bookmarks-exporter` 明确要求只转发新 Skill，但目录中仍保留 3 个旧脚本。宿主 Agent 若没有遵守当前 `SKILL.md` 或外部用户直接执行旧脚本，仍可能绕过新入口的规则。

## 5. 成熟度判断

### 较成熟的设计部分

- 研究家族的数据契约、权限分层、错误和 coverage 结构；
- 内容归档的防覆盖、manifest 和失败继续策略；
- X Article 的 preflight、正文 hash、媒体绑定和 reload 验证；
- X Slicer 的图片、ZIP、视频、帧和音频 QA；
- Windows 微信 reader 的只读、schema、路径、资源和 prompt injection 防线；
- Grok plugin 的 authenticated fallback gate 和工具隔离。

### 中等成熟部分

- 微信/企微 Mac vault：实现较深，但对客户端版本、系统权限和真实数据 schema 强耦合；
- ASR：有 pending/cache/费用边界，但依赖供应商和外部 Step executor；
- 公众号导出：流程完整，但由多个外部项目、登录、代理和凭据路径组合。

### 主要是个人 SOP 的部分

- 对话总结；
- 视频内容 13 模块分析；
- 剪映 UI 精修；
- ChatGPT 官网研究控制；
- Codex × ChatGPT 协作协议中未随仓库分发的 Runtime 部分。

这些部分仍有价值，但“文档详细”不能等同于“确定性实现完整”。

## 6. 风险矩阵

| 风险 | 概率 | 影响 | 涉及模块 | 建议 |
| --- | --- | --- | --- | --- |
| 平台 DOM/API 变化 | 高 | 高 | X Article、收藏、抖音、小红书、ChatGPT Web | adapter 隔离、版本探测、真实 E2E、失败关闭 |
| 登录态或 Cookie 泄露 | 中 | 极高 | X、Chrome 收藏、公众号、Grok fallback | OS 密钥库、凭据代理、最小日志、权限审计 |
| 明文私有数据库泄露 | 中 | 极高 | 微信/企微 vault | 加密磁盘、最小保留、禁止云同步、访问审计 |
| 重复 API 提交和计费 | 中 | 中/高 | ASR、批量搜索 | 幂等键、pending ledger、provider 锁定、费用预算 |
| 误把候选当事实 | 高 | 高 | Search、Grok、AI HOT | claim-source ledger、原文 locator、人工核验 |
| Agent 不遵守 Skill 文本 | 中 | 高 | 全部高风险模块 | 将边界下沉到脚本、权限和沙箱 |
| 跨平台失败 | 高 | 中 | 研究家族、Mac 专用 Skill | CI 矩阵、路径和 credential abstraction |
| 外部组件缺失 | 高 | 中/高 | Memory、Step ASR、C2C、公众号、WeCom | capability doctor、安装锁、明确 degraded state |
| 非官方协议触发风控 | 中/高 | 高 | X GraphQL、平台 DOM、FxTwitter | 低频、公开/官方 API 优先、停止而非绕过 |
| 上游许可不允许商业使用 | 确定 | 极高 | 整仓及衍生使用 | 商业使用前取得书面授权并做法务确认 |

## 7. 许可证边界

上游不是 MIT/Apache 等宽松开源许可证，而是 source-available 的个人学习与非商业许可。许可证明确允许个人非商业查看、克隆、学习和修改，但未经权利人书面许可，不允许：

- 商业使用和任何 revenue-generating/business-operational purpose；
- 客户交付、付费产品或服务；
- 公司内部工具包和内部部署；
- 公开镜像、重新打包、市场分发和课程打包；
- 将衍生作品作为竞争性 Skill 集合发布。

许可证还要求保留 attribution 与第三方 notices，并把隐私与合规责任留给用户。

本研究只进行阅读、分析和非商业研究记录，不复制上游代码或素材。任何进一步的公司使用应以作者书面授权和专业法律意见为准。

## 8. 供应链与数据流风险

### 外部服务

查询、URL、媒体或提示可能发送到：

- AI HOT、AnySearch、Firecrawl；
- 知乎、微博、小红书、抖音、X、YouTube 等平台；
- xAI/Grok；
- StepFun、火山引擎；
- 微信公众号导出服务；
- 企业微信官方 API。

每条路线的数据保留、服务条款、限额和账号权限不同。仓库明确提醒不能把搜索框当作秘密传输通道。

### 外部可执行文件

部分能力要求用户另行安装外部 CLI 或本地 helper。仓库不总是分发或验证这些二进制，因此运行前需要：

- 固定来源、版本和 checksum；
- 检查许可证和更新机制；
- 使用最小环境变量白名单；
- 禁止把完整环境、Home 或凭据目录暴露给子进程；
- 明确工具是否可能读取浏览器登录态。

## 9. 结论

仓库体现出很强的个人风险经验和验证意识，但成熟度是模块化而非整仓一致的：部分模块接近可测试工具，部分是外部产品的运行手册，部分只是 Prompt/SOP。

因此评估时应以单个 Skill 为单位做 threat model、依赖审计和真实 E2E，不应因为某些模块验证严谨，就默认整个能力库具备相同可靠性。
