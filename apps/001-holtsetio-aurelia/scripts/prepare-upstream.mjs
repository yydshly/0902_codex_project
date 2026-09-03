import { mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { extname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import tslOperatorPlugin from "vite-plugin-tsl-operator";

const appRoot = fileURLToPath(new URL("../", import.meta.url));
const sourceRoot = join(appRoot, "node_modules", "aurelia-upstream", "src");
const outputRoot = join(appRoot, ".generated", "aurelia");
const transformer = tslOperatorPlugin({ logs: false });

const runtimeAdapters = {
  "app.js": [
    [
      "for (let i=0; i<10; i++)",
      "for (let i=0; i<(globalThis.__AURELIA_LAB_CONFIG__?.instanceCount ?? 10); i++)",
    ],
  ],
  "physics/verletPhysics.js": [
    [
      "const stepsPerSecond = 360;",
      "const stepsPerSecond = globalThis.__AURELIA_LAB_CONFIG__?.stepsPerSecond ?? 360;",
    ],
  ],
  "plankton.js": [
    [
      "Math.floor(volume * 0.02)",
      "Math.floor(volume * (globalThis.__AURELIA_LAB_CONFIG__?.planktonDensity ?? 0.02))",
    ],
  ],
  "medusa.js": [
    [
      "this.transformationObject.position.set((Math.random() - 0.5) * 10, (this.medusaId / 10 + Math.random() * 0.1 - 0.5) * 40, (Math.random() - 0.5) * 10);",
      `const labInstanceCount = globalThis.__AURELIA_LAB_CONFIG__?.instanceCount;
        if (labInstanceCount) {
            const lane = (this.medusaId + 0.5) / labInstanceCount - 0.5;
            const span = Math.min(22, 6 + labInstanceCount * 2);
            this.transformationObject.position.set((Math.random() - 0.5) * 7, lane * span + (Math.random() - 0.5) * 1.5, (Math.random() - 0.5) * 7);
        } else {
            this.transformationObject.position.set((Math.random() - 0.5) * 10, (this.medusaId / 10 + Math.random() * 0.1 - 0.5) * 40, (Math.random() - 0.5) * 10);
        }`,
    ],
  ],
};

function applyRuntimeAdapters(sourcePath, source) {
  const relativePath = relative(sourceRoot, sourcePath).replaceAll("\\", "/");
  const replacements = runtimeAdapters[relativePath] ?? [];
  return replacements.reduce((result, [needle, replacement]) => {
    if (!result.includes(needle)) {
      throw new Error(`Pinned upstream adapter no longer matches ${relativePath}: ${needle}`);
    }
    return result.replace(needle, replacement);
  }, source);
}

async function collectFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map(async (entry) => {
    const absolutePath = join(directory, entry.name);
    return entry.isDirectory() ? collectFiles(absolutePath) : [absolutePath];
  }));
  return nested.flat();
}

await rm(outputRoot, { recursive: true, force: true });

const sourceFiles = await collectFiles(sourceRoot);
for (const sourcePath of sourceFiles) {
  const destinationPath = join(outputRoot, relative(sourceRoot, sourcePath));
  await mkdir(join(destinationPath, ".."), { recursive: true });

  const source = applyRuntimeAdapters(sourcePath, await readFile(sourcePath, "utf8"));
  if (extname(sourcePath) !== ".js") {
    await writeFile(destinationPath, source);
    continue;
  }

  // Aurelia writes TSL nodes with JavaScript arithmetic inside Fn(). Its own
  // Vite plugin normally rewrites those operators, but deliberately ignores
  // packages under node_modules. Generate an ignored, build-local source tree
  // so this pinned Git dependency is compiled exactly as it is upstream.
  const transformId = sourcePath
    .replaceAll("\\", "/")
    .replace("/node_modules/", "/pinned-upstream/");
  const result = transformer.transform(source, transformId);
  await writeFile(destinationPath, result?.code ?? source);
}

console.log(`Prepared ${sourceFiles.length} pinned Aurelia source files.`);
