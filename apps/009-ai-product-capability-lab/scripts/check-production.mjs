import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (relativePath) => fs.readFileSync(path.join(projectRoot, relativePath), "utf8");
const requireText = (source, marker, label) => {
  if (!source.includes(marker)) throw new Error(`${label} 缺少 ${marker}`);
};

const index = read("index.html");
const app = read("src/App.jsx");
const world = read("src/CapabilityWorld.jsx");
const vite = read("vite.config.mjs");
const builtIndex = read("dist/client/index.html");

for (const marker of ["rel=\"canonical\"", "property=\"og:image\"", "Content-Security-Policy", "Qiuner 架构落地"]) {
  requireText(index, marker, "index.html");
}
for (const marker of ["Yichen Skills", "Aurelia", "Neko Master", "Lieflat Charts", "350 Layout Compositions", "Qiuner Reference", "desktop-gate", "SOURCE_REPOSITORY"]) {
  requireText(app, marker, "App.jsx");
}
for (const marker of ["new THREE.WebGLRenderer", "new THREE.Raycaster", "requestAnimationFrame", "matchMedia", "renderer.dispose"]) {
  requireText(world, marker, "CapabilityWorld.jsx");
}
requireText(vite, 'base: "./"', "vite.config.mjs");
requireText(builtIndex, "./assets/", "dist/client/index.html");

for (const match of builtIndex.matchAll(/(?:src|href)="(\.\/assets\/[^"]+)"/g)) {
  const asset = path.resolve(projectRoot, "dist/client", match[1]);
  if (!fs.existsSync(asset)) throw new Error(`构建产物缺少资源 ${match[1]}`);
}

if (fs.existsSync(path.join(projectRoot, "public/assets/capability-atrium.png"))) {
  throw new Error("检测到已废弃的静态 3D 背景图。");
}

console.log("检查通过：真实 WebGL、内容边界、窄屏降级、发布元数据和相对资源路径均已登记。");
