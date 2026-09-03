import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const appDirectory = path.dirname(fileURLToPath(import.meta.url));
const outputDirectory = path.join(appDirectory, 'dist');
const host = '127.0.0.1';
const port = Number.parseInt(process.env.LAYOUT_ATLAS_PORT || '4197', 10);

const contentTypes = new Map([
  ['.css', 'text/css; charset=utf-8'],
  ['.csv', 'text/csv; charset=utf-8'],
  ['.html', 'text/html; charset=utf-8'],
  ['.jpg', 'image/jpeg'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.png', 'image/png'],
  ['.txt', 'text/plain; charset=utf-8'],
]);

function resolveRequestPath(requestUrl) {
  const pathname = decodeURIComponent(new URL(requestUrl, `http://${host}:${port}`).pathname);
  const relativePath = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '');
  const target = path.resolve(outputDirectory, relativePath);
  const relative = path.relative(outputDirectory, target);
  if (relative.startsWith('..') || path.isAbsolute(relative)) return null;
  return target;
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
    console.error(`端口 ${port} 已被占用；可设置 LAYOUT_ATLAS_PORT 后重试。`);
  } else {
    console.error(error);
  }
  process.exitCode = 1;
});

server.listen(port, host, () => {
  console.log(`350 Layout Compositions 全量网页： http://${host}:${port}/`);
  console.log('按 Ctrl+C 停止预览。');
});

process.on('SIGINT', () => server.close(() => process.exit(0)));
