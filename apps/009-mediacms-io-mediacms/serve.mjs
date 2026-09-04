import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const appDirectory = path.dirname(fileURLToPath(import.meta.url));
const outputDirectory = path.join(appDirectory, 'dist');
const host = '127.0.0.1';
const port = Number.parseInt(process.env.MEDIACMS_ATLAS_PORT || '4209', 10);
const contentTypes = new Map([
  ['.css', 'text/css; charset=utf-8'], ['.html', 'text/html; charset=utf-8'],
  ['.js', 'text/javascript; charset=utf-8'], ['.json', 'application/json; charset=utf-8'],
  ['.png', 'image/png'], ['.txt', 'text/plain; charset=utf-8'],
]);

function resolveRequestPath(requestUrl) {
  const pathname = decodeURIComponent(new URL(requestUrl, `http://${host}:${port}`).pathname);
  const target = path.resolve(outputDirectory, pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, ''));
  const relative = path.relative(outputDirectory, target);
  return relative.startsWith('..') || path.isAbsolute(relative) ? null : target;
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
  response.writeHead(200, { 'Cache-Control': 'no-cache', 'Content-Type': contentTypes.get(path.extname(target).toLowerCase()) || 'application/octet-stream' });
  fs.createReadStream(target).pipe(response);
});

server.on('error', (error) => {
  console.error(error.code === 'EADDRINUSE' ? `端口 ${port} 已被占用；可设置 MEDIACMS_ATLAS_PORT 后重试。` : error);
  process.exitCode = 1;
});
server.listen(port, host, () => console.log(`MediaCMS Decision Atlas：http://${host}:${port}/`));
process.on('SIGINT', () => server.close(() => process.exit(0)));
