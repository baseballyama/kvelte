import fs from "fs";
import * as vite from "vite";
import preprocess from "svelte-preprocess";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import virtual from "@rollup/plugin-virtual";
import esbuild from "esbuild";
import { listFiles } from "./utils.js";
import { OutputOptions } from "rollup";

const cwd = process.cwd();
const outDir = `${cwd}/../.kvelte`;

function getSveltePages(): string[] {
  return listFiles("./pages").filter((file) => {
    return file.endsWith(".svelte");
  });
}

function getBuildInputConfig(sveltePages: string[]): { [key: string]: string } {
  const input: { [key: string]: string } = {};
  sveltePages.forEach((page) => (input[page.replace(/^(\.\/)*/, "")] = page));
  return input;
}

function getBuildOutputConfig(): OutputOptions {
  return {
    format: "esm",
    entryFileNames: "[name].js",
    chunkFileNames: "chunks/[name]-[hash].js",
    assetFileNames: "assets/[name]-[hash][extname]",
  };
}

function preBuild() {
  if (fs.existsSync(outDir)) fs.rmSync(outDir, { recursive: true });
  fs.mkdirSync(outDir);
  fs.symlinkSync(`${cwd}/node_modules`, `${outDir}/node_modules`, "dir");
}

async function buildDOM(sveltePages: string[]) {
  return await vite.build({
    plugins: [
      virtual({
        "manifest.js": `
          export const components = [
            ${sveltePages.map((page) => `() => import("${page}"),`)}
          ];
          components.forEach((Component) => {
            new Component({ target: document.getElementById("app") });
          });
        `,
      }),
      svelte({
        compilerOptions: {
          hydratable: true,
        },
        preprocess: preprocess(),
      }),
    ],
    build: {
      manifest: true,
      rollupOptions: {
        input: {
          start: "manifest.js",
          ...getBuildInputConfig(sveltePages),
        },
        output: getBuildOutputConfig(),
      },
      ssr: false,
      outDir: "../.kvelte/dom",
      emptyOutDir: true,
    },
  });
}

async function buildSSR(sveltePages: string[]) {
  const ssr = await vite.build({
    plugins: [svelte({ preprocess: preprocess() })],
    build: {
      rollupOptions: {
        input: getBuildInputConfig(sveltePages),
        output: getBuildOutputConfig(),
      },
      ssr: true,
      outDir: "../.kvelte/ssr",
      emptyOutDir: true,
    },
  });

  const entryPoints: { [key: string]: string } = {};
  sveltePages.forEach((page) => {
    const path = page.replace(/^(\.\/)*/, "");
    fs.writeFileSync(
      `../.kvelte/ssr/${path}.call.js`,
      `import App from "../${path}.js";
       function render(props) {
         return JSON.stringify(App.render(JSON.parse(props)));
       }`
    );

    entryPoints[path] = `../.kvelte/ssr/${path}.call.js`;
  });
  await esbuild.build({
    entryPoints,
    outdir: "../.kvelte/ssr",
    minify: false,
    format: "esm",
    bundle: true,
    treeShaking: false,
    allowOverwrite: true,
  });

  if (fs.existsSync("../.kvelte/ssr/chunks")) {
    fs.rmSync("../.kvelte/ssr/chunks", { recursive: true });
  }
  Object.keys(entryPoints).forEach((path) => {
    if (fs.existsSync(`../.kvelte/ssr/${path}.call.js`)) {
      fs.rmSync(`../.kvelte/ssr/${path}.call.js`);
    }
  });
}

function postBuild() {
  if (fs.existsSync("../.kvelte/dom/start.js")) {
    fs.rmSync("../.kvelte/dom/start.js");
  }
  if (fs.existsSync("../.kvelte/dom/manifest.json")) {
    fs.rmSync("../.kvelte/dom/manifest.json");
  }
}

(async () => {
  preBuild();

  const pages = getSveltePages();
  console.log(`${pages.length} Svelte pages found.`, pages);

  const dom = buildDOM(pages);
  const ssr = buildSSR(pages);
  await Promise.all([dom, ssr]);

  postBuild();
})();
