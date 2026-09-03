import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath, pathToFileURL } from 'node:url';

export const UPSTREAM_REPOSITORY = 'https://github.com/mcncarl/yichen-skills';
export const UPSTREAM_COMMIT = '14f10a96a719a1d60aa02c582e674d5b197d5861';

const appDirectory = path.dirname(fileURLToPath(import.meta.url));
const sourceDirectory = path.join(appDirectory, 'src');
const outputDirectory = path.join(appDirectory, 'dist');

function copyTree(source, destination) {
  const stat = fs.lstatSync(source);
  if (stat.isSymbolicLink()) throw new Error(`拒绝复制符号链接：${source}`);
  if (stat.isDirectory()) {
    fs.mkdirSync(destination, { recursive: true });
    for (const entry of fs.readdirSync(source, { withFileTypes: true })) {
      copyTree(path.join(source, entry.name), path.join(destination, entry.name));
    }
    return;
  }
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.copyFileSync(source, destination);
}

export function build() {
  if (!fs.existsSync(sourceDirectory)) throw new Error('缺少 src/ 静态应用目录');
  if (path.relative(appDirectory, outputDirectory) !== 'dist') {
    throw new Error(`拒绝清理意外输出目录：${outputDirectory}`);
  }

  fs.rmSync(outputDirectory, { recursive: true, force: true });
  copyTree(sourceDirectory, outputDirectory);
  fs.writeFileSync(
    path.join(outputDirectory, 'BUILD_INFO.json'),
    `${JSON.stringify({
      repository: UPSTREAM_REPOSITORY,
      upstreamCommit: UPSTREAM_COMMIT,
      builtAt: new Date().toISOString(),
      dataMode: 'fixed-research-snapshot',
    }, null, 2)}\n`,
    'utf8',
  );
  console.log('Yichen Skills Capability Atlas 已构建。');
}

const isMain = Boolean(process.argv[1]) && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url;
if (isMain) {
  try {
    build();
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
