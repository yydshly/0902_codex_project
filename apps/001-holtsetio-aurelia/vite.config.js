import { defineConfig } from "vite";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("./", import.meta.url));
const preparedUpstream = resolve(appRoot, ".generated", "aurelia");

export default defineConfig({
  base: "./",
  server: {
    host: "127.0.0.1",
    port: 4173,
  },
  resolve: {
    alias: {
      "@aurelia-upstream": preparedUpstream,
    },
  },
  build: {
    rollupOptions: {
      input: {
        baseline: resolve(appRoot, "index.html"),
        lab: resolve(appRoot, "lab.html"),
        morph: resolve(appRoot, "morph.html"),
        directions: resolve(appRoot, "directions.html"),
        resonance: resolve(appRoot, "resonance.html"),
        identity: resolve(appRoot, "identity.html"),
        atlas: resolve(appRoot, "atlas.html"),
        rain: resolve(appRoot, "rain.html"),
      },
    },
  },
});
