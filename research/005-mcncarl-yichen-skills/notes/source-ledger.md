# 主张—来源账本

所有链接固定到研究提交 `14f10a96a719a1d60aa02c582e674d5b197d5861`；动态仓库主页只作为入口，不作为版本证据。

| 主张 | 类型 | 一手来源 | 研究结论 |
| --- | --- | --- | --- |
| 仓库定位为创作者个人工作流 Skill 集合 | 文档事实 | [README.zh.md](https://github.com/mcncarl/yichen-skills/blob/14f10a96a719a1d60aa02c582e674d5b197d5861/README.zh.md) | 已验证 |
| 商业使用和公司内部部署需要书面授权 | 许可证事实 | [LICENSE](https://github.com/mcncarl/yichen-skills/blob/14f10a96a719a1d60aa02c582e674d5b197d5861/LICENSE) | 已验证 |
| 研究总入口按搜索、归档、收藏和 ASR 分流 | 协议事实 | [yichen-web-research/SKILL.md](https://github.com/mcncarl/yichen-skills/blob/14f10a96a719a1d60aa02c582e674d5b197d5861/yichen-web-research/SKILL.md) | 已验证 |
| 搜索结束不自动取得归档授权 | 安全协议 | [yichen-web-research/SKILL.md](https://github.com/mcncarl/yichen-skills/blob/14f10a96a719a1d60aa02c582e674d5b197d5861/yichen-web-research/SKILL.md) | 已验证 |
| 搜索结果统一为 schema 1.0 candidate envelope | 数据契约 | [candidate-schema.md](https://github.com/mcncarl/yichen-skills/blob/14f10a96a719a1d60aa02c582e674d5b197d5861/yichen-unified-search/references/candidate-schema.md) | 已验证 |
| 搜索摘要、排名和打开页面均不能自动证明主张 | 数据契约 | [candidate-schema.md](https://github.com/mcncarl/yichen-skills/blob/14f10a96a719a1d60aa02c582e674d5b197d5861/yichen-unified-search/references/candidate-schema.md) | 已验证 |
| 归档与收藏 handoff 不传递授权 | 数据契约 | [handoff-contract.md](https://github.com/mcncarl/yichen-skills/blob/14f10a96a719a1d60aa02c582e674d5b197d5861/yichen-content-archive/references/handoff-contract.md) | 已验证 |
| 私人收藏 Skill 只导出链接，不下载正文和媒体 | 安全协议 | [yichen-bookmarks-export/SKILL.md](https://github.com/mcncarl/yichen-skills/blob/14f10a96a719a1d60aa02c582e674d5b197d5861/yichen-bookmarks-export/SKILL.md) | 已验证 |
| Content Archive 只接收已知目标并使用防覆盖执行器 | 实现协议 | [yichen-content-archive/SKILL.md](https://github.com/mcncarl/yichen-skills/blob/14f10a96a719a1d60aa02c582e674d5b197d5861/yichen-content-archive/SKILL.md) | 已验证 |
| ASR 路由在任务提交后禁止跨供应商重提 | 费用/幂等协议 | [yichen-asr/SKILL.md](https://github.com/mcncarl/yichen-skills/blob/14f10a96a719a1d60aa02c582e674d5b197d5861/yichen-asr/SKILL.md) | 已验证 |
| 豆包 ASR 负责时间戳、SRT 和粗剪 | 实现协议 | [yichen-volc-asr/SKILL.md](https://github.com/mcncarl/yichen-skills/blob/14f10a96a719a1d60aa02c582e674d5b197d5861/yichen-volc-asr/SKILL.md) | 已验证 |
| X Article 通过 dry-run、hash、媒体指纹和 reload 核验草稿 | 实现协议 | [x-article-draft-uploader/SKILL.md](https://github.com/mcncarl/yichen-skills/blob/14f10a96a719a1d60aa02c582e674d5b197d5861/yichen-x-article-draft-uploader/SKILL.md) | 已验证文档与实现入口；未做真实 X E2E |
| X Slicer 验证 PNG、ZIP、MP4、源视频帧和音频区间 | 实现协议 | [yichen-x-slicer/SKILL.md](https://github.com/mcncarl/yichen-skills/blob/14f10a96a719a1d60aa02c582e674d5b197d5861/yichen-x-slicer/SKILL.md) | 已验证文档与实现入口；未做真实 X E2E |
| Mac 微信 vault 包含 key 捕获、全量/增量解密和只读查询 | 实现协议 | [yichen-wechat-local-vault/SKILL.md](https://github.com/mcncarl/yichen-skills/blob/14f10a96a719a1d60aa02c582e674d5b197d5861/yichen-wechat-local-vault/SKILL.md) | 已验证静态代码与文档；未处理真实数据 |
| Windows reader 只接受用户提供的明文静态快照 | 安全协议 | [yichen-wechat-windows-reader/SKILL.md](https://github.com/mcncarl/yichen-skills/blob/14f10a96a719a1d60aa02c582e674d5b197d5861/yichen-wechat-windows-reader/SKILL.md) | 已验证 |
| Windows reader 使用 immutable read-only SQLite 和 query_only | 实现协议 | [snapshot_reader.py](https://github.com/mcncarl/yichen-skills/blob/14f10a96a719a1d60aa02c582e674d5b197d5861/yichen-wechat-windows-reader/scripts/snapshot_reader.py) | 已验证静态实现 |
| 公众号导出区分 publish groups、expanded URLs 和 originals | 计数协议 | [yichen-wechat-mp-batch-exporter/SKILL.md](https://github.com/mcncarl/yichen-skills/blob/14f10a96a719a1d60aa02c582e674d5b197d5861/yichen-wechat-mp-batch-exporter/SKILL.md) | 已验证 |
| 企微云操作依赖官方 WeCom CLI，不允许发送消息 | 安全协议 | [yichen-wecom-operations/SKILL.md](https://github.com/mcncarl/yichen-skills/blob/14f10a96a719a1d60aa02c582e674d5b197d5861/yichen-wecom-operations/SKILL.md) | 已验证 |
| Agent Memory 以 Markdown 为事实源，SQLite/FTS 和 Zvec 为派生索引 | 架构事实 | [yichen-agent-memory/SKILL.md](https://github.com/mcncarl/yichen-skills/blob/14f10a96a719a1d60aa02c582e674d5b197d5861/yichen-agent-memory/SKILL.md) | 已验证；核心实现位于外部仓库 |
| Codex × ChatGPT 规定 ChatGPT 只读审查、Codex 独占写入 | 协作协议 | [yichen-codex-chatgpt/SKILL.md](https://github.com/mcncarl/yichen-skills/blob/14f10a96a719a1d60aa02c582e674d5b197d5861/yichen-codex-chatgpt/SKILL.md) | 已验证协议；私有 Runtime 未分发 |
| C2C 使用固定状态机、消息 ID 和 marker 防重复执行 | 协作协议 | [c2c-protocol.md](https://github.com/mcncarl/yichen-skills/blob/14f10a96a719a1d60aa02c582e674d5b197d5861/yichen-codex-chatgpt/references/c2c-protocol.md) | 已验证 |
| Grok plugin 暴露四个 MCP 工具 | 插件事实 | [server.mjs](https://github.com/mcncarl/yichen-skills/blob/14f10a96a719a1d60aa02c582e674d5b197d5861/plugins/yichen-grok-consult/mcp/server.mjs) | 已验证静态实现 |
| Grok authenticated fallback 需要精确 boolean 授权 | 安全实现 | [authenticated-fallback-policy.mjs](https://github.com/mcncarl/yichen-skills/blob/14f10a96a719a1d60aa02c582e674d5b197d5861/plugins/yichen-grok-consult/mcp/authenticated-fallback-policy.mjs) | 已验证，Node 测试通过 |
| 多个 Skill 借鉴或调用第三方项目 | 供应链事实 | [THIRD_PARTY_NOTICES.md](https://github.com/mcncarl/yichen-skills/blob/14f10a96a719a1d60aa02c582e674d5b197d5861/THIRD_PARTY_NOTICES.md) | 已验证 |
| 当前重命名未完全同步 README 与 CI | 仓库观察 | [根 README](https://github.com/mcncarl/yichen-skills/blob/14f10a96a719a1d60aa02c582e674d5b197d5861/README.md)、[research-skills.yml](https://github.com/mcncarl/yichen-skills/blob/14f10a96a719a1d60aa02c582e674d5b197d5861/.github/workflows/research-skills.yml)、[实际新目录](https://github.com/mcncarl/yichen-skills/tree/14f10a96a719a1d60aa02c582e674d5b197d5861/yichen-codex-chatgpt) | 已验证，仅适用于固定提交 |

## 解释规则

- “已验证文档与实现入口”不等于运行了真实平台。
- 对外部账号、API、浏览器、媒体和数据库的运行效果，只有完成真实 E2E 后才能升级为已验证运行能力。
- 本研究中的架构评价和扩展优先级属于分析判断，不是上游作者声明。
