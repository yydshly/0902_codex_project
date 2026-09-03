import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const appDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(appDirectory, '..', '..');
const outputDirectory = path.join(appDirectory, 'dist');
const catalogPath = path.join(repositoryRoot, 'catalog', 'projects.json');
const host = '127.0.0.1';
const port = Number.parseInt(process.env.QIUNER_ATLAS_PORT || '4207', 10);
const contentTypes = new Map([
  ['.css', 'text/css; charset=utf-8'],
  ['.html', 'text/html; charset=utf-8'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.glb', 'model/gltf-binary'],
  ['.jpeg', 'image/jpeg'],
  ['.jpg', 'image/jpeg'],
  ['.mp3', 'audio/mpeg'],
  ['.png', 'image/png'],
  ['.svg', 'image/svg+xml'],
  ['.txt', 'text/plain; charset=utf-8'],
  ['.wasm', 'application/wasm'],
  ['.webm', 'video/webm'],
  ['.webp', 'image/webp'],
  ['.woff2', 'font/woff2'],
]);

const localDemoRoots = new Map();
if (fs.existsSync(catalogPath)) {
  const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
  for (const project of catalog.projects) {
    if (!project.demo?.buildOutput || project.id === '007') continue;
    const root = path.resolve(repositoryRoot, project.demo.buildOutput);
    const relative = path.relative(repositoryRoot, root);
    if (!relative.startsWith('..') && !path.isAbsolute(relative)) {
      localDemoRoots.set(project.slug, root);
    }
  }
}

function resolveInside(root, relativePath) {
  let target = path.resolve(root, relativePath || 'index.html');
  const relative = path.relative(root, target);
  if (relative.startsWith('..') || path.isAbsolute(relative)) return null;
  if (fs.existsSync(target) && fs.statSync(target).isDirectory()) {
    target = path.join(target, 'index.html');
  }
  return target;
}

function resolveRequestPath(requestUrl) {
  const pathname = decodeURIComponent(new URL(requestUrl, `http://${host}:${port}`).pathname);
  if (pathname.startsWith('/__portfolio/')) {
    const [, , slug, ...rest] = pathname.split('/');
    const demoRoot = localDemoRoots.get(slug);
    return demoRoot ? resolveInside(demoRoot, rest.join('/')) : null;
  }
  const relativePath = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '');
  return resolveInside(outputDirectory, relativePath);
}

if (!fs.existsSync(path.join(outputDirectory, 'index.html'))) {
  console.error('缺少 dist/index.html；请先运行 npm run build。');
  process.exit(1);
}

const server = http.createServer((request, response) => {
  const target = resolveRequestPath(request.url || '/');
  if (!target || !fs.existsSync(target) || !fs.statSync(target).isFile()) {
    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Not found');
    return;
  }

  response.writeHead(200, {
    'Cache-Control': 'no-cache',
    'Content-Type': contentTypes.get(path.extname(target).toLowerCase()) || 'application/octet-stream',
  });
  fs.createReadStream(target).pipe(response);
});

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`端口 ${port} 已被占用；可设置 QIUNER_ATLAS_PORT 后重试。`);
  } else {
    console.error(error);
  }
  process.exitCode = 1;
});

server.listen(port, host, () => {
  console.log(`Qiuner 多世界能力展台：http://${host}:${port}/`);
  console.log('按 Ctrl+C 停止预览。');
});

process.on('SIGINT', () => server.close(() => process.exit(0)));
