# 源码核验记录

## 研究基线

- 仓库：`https://github.com/bannedbook/fanqiang`
- 提交：`6b09e61cd77c00020c24676f926d7374afd5dd04`
- 核验方式：目录结构、关键调用链、Gradle/Go 构建声明、发行 APK 静态信息与提交历史交叉检查。

## 已确认

- ChromeGo 与 FQNews2 是同一仓库中的并列目录/产品，不是同一软件的两个名字。
- ChromeGo 的主要编排入口是 Windows CMD 启动器和浏览器代理参数，打包多个独立内核。
- FQNews2 同时包含 Feeder RSS 业务代码、SagerNet/NekoBox 风格节点管理和 sing-box/libcore 接入。
- FQNews2 请求链使用 `127.0.0.1:5888` mixed 本地代理。
- FQNews2 当前连接到 `ProxyService`；现有 `openTun()` VPN 实现未启用。
- FQNews2 的 `trustAllCerts` 路径会跳过证书链与主机名校验。
- 源码构建引用未随仓库提供的本地 AAR 与 Go replace 兄弟目录。

## 规模观察

以包路径粗分，FQNews2 源码大致由以下部分组成：

- Feeder 业务层：约 204 个 Java/Kotlin 文件、3.38 万行；
- SagerNet 节点与代理层：约 92 个文件、0.98 万行；
- Matsuri/辅助集成层：约 26 个文件、0.47 万行；
- Go libcore 胶水：约 0.26 万行。

这些数字用于判断代码重心，不等同于原创代码量：整个 `fqnews2` 目录在 `98ffe10` 提交中一次性导入，且多个命名空间具有清晰上游血缘。

## 发布物静态检查

- 检查对象：Release `FQNews-v1.3.8/fqnews2.apk`
- SHA-256：`04DEDB646C4FB38CC59AF9F2F2483381A0999E523A66B0A1E4C3F7E1C628BD7A`
- 主要 native 库：`libgojni.so`、`libconscrypt_jni.so`
- APK 的 `META-INF/version-control-info.textproto` 记录 revision `e27e0590…`，未能在当前 `fanqiang` 历史中对应到提交。

静态检查只能确认打包内容和字符串线索，不能证明运行时可靠性、节点安全性或全部协议插件可用。
