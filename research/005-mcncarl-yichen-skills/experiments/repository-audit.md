# Repository audit

## 目的

固定上游版本，确认仓库实际包含的 Skill、代码和测试规模，并在当前 Windows 环境运行不需要真实账号的离线契约测试。

## 环境

| 字段 | 值 |
| --- | --- |
| 日期 | 2026-09-03 |
| 操作系统 | Windows |
| Shell | PowerShell |
| Python | 3.10 |
| Node | 当前工作区可用 Node.js |
| 上游提交 | `14f10a96a719a1d60aa02c582e674d5b197d5861` |

## 获取基线

```powershell
git clone --depth 1 --filter=blob:none `
  https://github.com/mcncarl/yichen-skills.git `
  D:\codex\tmp\yichen-skills-audit-20260903

git -C D:\codex\tmp\yichen-skills-audit-20260903 `
  log -1 --format='%H%n%aI%n%s'
```

观察：

```text
14f10a96a719a1d60aa02c582e674d5b197d5861
2026-09-02T14:52:08+08:00
Rename codex-chatgpt skill
```

## 文件统计

使用 `git ls-files` 统计，结果：

```text
tracked_files=206
skill_files=22
python_files=76
node_mjs_files=8
test_and_fixture_files=30
```

解释：

- 22 个 `SKILL.md` 包括插件内 Skill 和一个退役兼容 Skill。
- Python/Node 数量包括执行脚本、MCP、测试和 fixture，不代表全部是独立产品功能。
- README 的 24 项能力是产品功能枚举，不等同于 24 个独立 Skill。

## 测试命令

按目录运行：

```powershell
python -m unittest discover -s yichen-unified-search\tests -p 'test_*.py'
python -m unittest discover -s yichen-web-research\tests -p 'test_*.py'
python -m unittest discover -s yichen-content-archive\tests -p 'test_*.py'
python -m unittest discover -s yichen-bookmarks-export\tests -p 'test_*.py'
python -m unittest discover -s yichen-asr\tests -p 'test_*.py'
python -m unittest discover -s yichen-x-article-draft-uploader\tests -p 'test_*.py'
python -m unittest discover -s yichen-wechat-windows-reader\tests -p 'test_*.py'

node --test `
  plugins\yichen-grok-consult\mcp\authenticated-fallback-policy.test.mjs
```

## 测试结果

| Suite | 结果 |
| --- | --- |
| Unified Search | 244 项；6 failures、1 error |
| Web Research | 74 项；2 errors、1 skipped |
| Content Archive | 33 项通过 |
| Bookmarks Export | 4 项通过 |
| Unified ASR | 6 项通过 |
| X Article uploader | 2 个测试模块因缺少 `Crypto` 无法加载 |
| Windows WeChat reader | 测试模块因缺少 `zstandard` 无法加载 |
| Grok fallback policy | 3 项通过 |

合计：

```text
367 total
354 passed
1 skipped
12 failed or errored
```

## 失败解释

### 路径分隔符

5 个 Unified Search 断言使用 `endswith('/...py')`，Windows 返回反斜杠路径。这证明当前测试存在平台假设；没有进一步把它解释为路由业务逻辑错误。

### 私有文件权限

Firecrawl 和 AnySearch 测试依赖 POSIX `0600` 语义；Web Research 测试使用 `os.getuid()`。这些路径没有在本 Windows 环境适配。

### 可选依赖

本次研究没有安装 `pycryptodome` 和 Windows reader 的 hash-locked `zstandard` wheel，因此相应测试模块在 import 阶段终止。上游 CI 配置会为对应 job 安装依赖。

## Family validator

```powershell
python yichen-web-research\scripts\validate_family.py
```

结果为 `ok: false`，只列出两项失败：

```text
yichen-web-research: offline tests failed
yichen-unified-search: offline tests failed
```

同一输出中以下结构检查通过：

- Python AST；
- 内部 Markdown 链接；
- router metadata；
- 横纵研究结构门；
- 搜索、归档、收藏与 ASR 边界；
- X 搜索、Firecrawl、知乎和私人收藏的固定规则。

## 文档一致性检查

```powershell
rg -n "codex-chatgpt|yichen-codex-chatgpt" `
  README.md README.zh.md yichen-codex-chatgpt\README.md
```

观察：实际目录和模块 README 已使用 `yichen-codex-chatgpt`，但根 README 仍使用旧 `codex-chatgpt` 路径和安装命令。研究 CI workflow 的 path filters 和扫描 roots 也保留旧路径。

## 结论边界

本实验验证仓库结构和离线契约，不验证任何真实账号、登录态、平台 API、数据库解密、草稿写入或媒体生成。测试失败已按观察分类，没有把缺少依赖或 Windows 差异误写为核心功能缺陷。
