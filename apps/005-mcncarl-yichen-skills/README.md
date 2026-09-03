# Yichen Skills Capability Atlas

一个零依赖静态网页，用于完整呈现 `mcncarl/yichen-skills` 的 22 个 Skill、四层运行原理、适用场景、风险边界与团队价值。

## 交互内容

- 22 个 Skill 均提供独立典型场景、输入输出、底层机制、依赖、边界和可借鉴价值。
- “内容创作闭环”用 7 步展示研究、搜索、归档、ASR、内容拆解、草稿/切片与记忆沉淀。
- 还可切换“深度研究闭环”和“私域资产闭环”，比较不同授权与交接方式。
- 流程支持手动选步、自动播放、完成态、重置和键盘切换；reduced-motion 下立即展示完成态。
- 所有运行数量与结果都是明确标注的说明性样例，不会调用任何真实平台。

## 本地运行

```powershell
npm ci
npm run check
npm run build
npm run dev
```

浏览器打开 `http://127.0.0.1:4177/`。构建产物输出到 `dist/`。

## 事实边界

- 研究基线固定在上游提交 `14f10a96a719a1d60aa02c582e674d5b197d5861`。
- 22 项指 21 个根目录 `SKILL.md` 加 1 个插件内部 `SKILL.md`；其中 `yichen-social-bookmarks-exporter` 是退役兼容入口。
- 实现层级 P / B / E / V / D 是本项目的分析标签，不是上游官方评级。
- 页面没有调用上游服务，也不会读取登录态或私人数据；所有交互只在浏览器本地进行。
- 流程演示用于解释 Skill orchestration，不是上游执行日志或真实性能基准。
- 上游许可证限定个人学习和非商业使用；企业复用前需获得授权或独立重写。

完整研究材料位于 `research/005-mcncarl-yichen-skills/`。
