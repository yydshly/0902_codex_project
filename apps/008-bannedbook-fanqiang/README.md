# fanqiang Capability Atlas

[在线演示](https://yydshly.github.io/0902_codex_project/demos/008-bannedbook-fanqiang/) · [完整研究](../../research/008-bannedbook-fanqiang/README.md) · [上游仓库](https://github.com/bannedbook/fanqiang)

这个 Demo 用可交互架构图回答五个问题：

1. `fanqiang`、ChromeGo、FQNews2 分别位于哪一层；
2. 哪些能力属于产品封装，哪些来自上游代理内核；
3. FQNews2 如何把代理嵌入 RSS 业务请求；
4. 当前实现在哪些安全、构建与运行边界上不能过度解读；
5. 如果我们继续研究，时间应该投入到什么层级。

页面特别澄清两点：`fanqiang` 是松耦合的集合与分发仓库，不是统一适配框架；FQNews2 当前集成 sing-box/libcore，可配置节点与协议不代表可以任意替换代理内核。

## 本地运行

```bash
npm run preview
```

默认地址：`http://127.0.0.1:4208/`。

## 数据与发布边界

- 页面使用固定研究快照，不连接真实节点，也不启动代理。
- 源码证据固定到上游提交 `6b09e61cd77c00020c24676f926d7374afd5dd04`。
- 构建只输出原创分析、证据链接和交互模拟，不复制上游 APK、二进制、节点、配置或源码。
