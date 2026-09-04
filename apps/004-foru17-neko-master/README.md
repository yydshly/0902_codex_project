# Neko Master Capability Lab

- 关联研究：[`research/004-foru17-neko-master/`](../../research/004-foru17-neko-master/)
- 在线地址：`https://yydshly.github.io/0902_codex_project/demos/004-foru17-neko-master/`
- 上游基线：[`foru17/neko-master@6f72cfd`](https://github.com/foru17/neko-master/commit/6f72cfd0db69e2952713f24a648812407fef1e78)（v1.4.0）
- 验证目标：用合成流量完整演示总览、域名/IP、地区、代理、设备、规则、健康、数据管线，以及后端、数据库、偏好、安全和 Agent 设置能力。
- 不覆盖：真实网关连接、代理转发、抓包、真实 GeoIP、后端认证、SQLite/ClickHouse 性能或生产部署。

## 本地运行

```powershell
npm install
npm run build
npm run dev
```

打开 `http://127.0.0.1:4176/`。

## 构建与验证

```powershell
npm run check
npm run build
```

构建脚本优先从被 `.gitignore` 排除的 `.codex-tmp/upstreams/neko-master` 固定 clone 中复制 22 个研究所需的一手文件；本地 clone 不存在时，从 GitHub Raw 按固定 commit 下载。完整上游源码不会进入本仓库，`dist/upstream/` 也属于生成产物。

- [完整能力映射](docs/capability-matrix.md)
- [本机代理兼容性只读检查](docs/local-proxy-compatibility.md)
- [真实浏览器验收](docs/browser-validation.md)
- [我们的理解与后续恢复点](../../research/004-foru17-neko-master/notes/product-interpretation.md)

## 第三方来源

Demo 的 HTML、CSS、JavaScript、图形和合成数据均为本研究自制。构建产物中按需附带的上游文档与源码仍归 `foru17/neko-master` 作者所有，遵循其 [MIT License](https://github.com/foru17/neko-master/blob/main/LICENSE)。
