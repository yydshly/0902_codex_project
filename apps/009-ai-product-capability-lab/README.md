# 3D AI 产品与能力实验室

- 关联研究：[`research/007-qiuner-qiuner-github-io/`](../../research/007-qiuner-qiuner-github-io/)
- 在线地址：<https://yydshly.github.io/0902_codex_project/demos/007-qiuner-qiuner-github-io/product-lab/>
- 上游仓库：<https://github.com/Qiuner/Qiuner.github.io>
- 验证目标：把 Qiuner 的共享渲染器、统一帧循环、空间节点、射线意图和引导式相机思路，转化为一个可运行的个人能力空间。
- 不覆盖：不复制上游世界、源码或媒体；不声称已经实现上游完整的多 World Registry、Portal Transaction、Resource Scope 或自适应质量系统。

## 它证明了什么

这不是“3D 风格图片 + HTML 热点”。首屏由真正的 `THREE.WebGLRenderer` 渲染：四个房间是程序化几何体，拖动和滚轮改变相机，点击房间通过 `Raycaster` 选择空间，DOM 标签由 3D 锚点投影到屏幕，选中后相机移动到对应空间。

项目内容层目前使用真实研究项目和演示映射：

- Agent 工作流：Yichen Skills、0902 Research Atlas；
- 视觉计算：Aurelia、ThreeUI；
- 数据系统：Neko Master、Lieflat Charts；
- 设计研究：350 Layout Compositions、Qiuner Reference。

项目名称和能力事实来自当前研究库；空间归类用于演示个人品牌信息架构，不代表上游项目的官方定位，也不替代真实履历、职责或量化成果。

## 与 Qiuner 的对应关系

| 上游架构信号 | 本原型的落地 | 尚未实现 |
| --- | --- | --- |
| Shared Renderer | 一个 `WebGLRenderer` 负责完整空间 | 多 World 复用同一 renderer |
| Frame Scheduler | 一个 RAF 依次更新相机、空间状态和渲染 | 可注册阶段任务与全局调度器 |
| World interaction | Pointer NDC + `Raycaster` 解析房间意图 | 独立 World 输入所有权 |
| Guided camera | 选择房间后阻尼移动相机与 target | Portal 跨世界旅程 |
| DOM / WebGL separation | WebGL 承载空间，React DOM 承载文字、导航和无障碍 | Astro 静态内容内核与完整 SSR |
| Resource cleanup | 卸载时释放监听器、Controls、Geometry、Material、Renderer | 上游 Resource Scope / Session 回滚协议 |

详细证据映射见 [`refinement-contract.md`](refinement-contract.md)，视觉与交互验证见 [`design-qa.md`](design-qa.md)。

## 本地运行

```bash
npm install
npm run dev
```

打开终端显示的地址。桌面端建议视口宽度不小于 1100px；更窄的设备只显示可读说明，不加载高负载 3D 场景。

## 交互

- 拖动场景：环绕观察；
- 滚轮：缩放；
- 点击房间或底部导航：选择空间并移动相机；
- 全景：回到初始视角；
- 进入项目区：切换样例并运行演示状态；
- Escape：关闭项目区并把焦点还给触发按钮。

可用 `?fallback=1` 强制查看 WebGL 不可用时的语义降级状态。

## 构建与验证

```bash
npm run build
npm run test:sites
```

Vite 使用相对资源路径，因此同一构建可以部署到 GitHub Pages 子路径。根项目发布时，`apps/007-qiuner-qiuner-github-io/build.mjs` 会构建本应用并把 `dist/client/` 收入 `product-lab/`。

## 第三方来源与权利

- Three.js：MIT License；
- React / React DOM：MIT License；
- Phosphor Icons：MIT License；
- 上游 Qiuner 仓库在研究基线未发现 `LICENSE`，本原型只参考可验证的架构思想，不复制上游源码或媒体；
- `public/og-cover.png` 是本原型最终生产路径的真实浏览器截图，不包含上游媒体。
