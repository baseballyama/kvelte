import fs from "fs";
import * as vite from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import virtual from "@rollup/plugin-virtual";
import esbuild from "esbuild";
import babel from "@babel/core";

(async () => {
  const listFiles = (dir) => {
    return fs
      .readdirSync(dir, { withFileTypes: true })
      .flatMap((dirent) =>
        dirent.isFile()
          ? [`${dir}/${dirent.name}`]
          : listFiles(`${dir}/${dirent.name}`)
      );
  };

  const getPages = () => {
    return listFiles("./pages").filter((file) => {
      return file.endsWith(".svelte");
    });
  };

  const pages = getPages();

  const input = {};
  pages.forEach((page) => {
    input[page.replace(/^(\.\/)*/, "")] = page;
  });

  const output = {
    format: "esm",
    entryFileNames: "[name].js",
    chunkFileNames: "chunks/[name]-[hash].js",
    assetFileNames: "assets/[name]-[hash][extname]",
  };

  const dom = vite.build({
    plugins: [
      virtual({
        "manifest.js": `
          export const components = [
            ${pages.map((page) => `() => import("${page}"),`)}
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
      }),
    ],
    build: {
      manifest: true,
      rollupOptions: {
        input: {
          start: "manifest.js",
          ...input,
        },
        output,
      },
      ssr: false,
      outDir: "../.kvelte/dom",
      emptyOutDir: true,
    },
  });

  const ssr = vite.build({
    plugins: [svelte()],
    build: {
      rollupOptions: { input, output },
      ssr: true,
      outDir: "../.kvelte/ssr",
      emptyOutDir: true,
    },
  });

  await Promise.all([dom, ssr]);

  const entryPoints = {};
  pages.forEach((page) => {
    const path = page.replace(/^(\.\/)*/, "");

    fs.writeFileSync(
      `../.kvelte/ssr/${path}.call.js`,
      `
        import App from "../${path}.js";
        App.render(props);
      `
    );

    entryPoints[path] = `../.kvelte/ssr/${path}.call.js`;
  });
  esbuild.buildSync({
    entryPoints,
    outdir: "../.kvelte/ssr",
    minify: true,
    format: "esm",
    bundle: true,
    allowOverwrite: true,
  });

  if (fs.existsSync("../.kvelte/ssr/chunks")) {
    fs.rmSync("../.kvelte/ssr/chunks", { recursive: true });
  }

  console.log({ entryPoints });
  const waits = [];
  Object.keys(entryPoints).forEach((path) => {
    const mPath = `../.kvelte/ssr/${path}.js`;
    waits.push(async () => {
      console.log(fs.readFileSync(mPath, "utf-8"));
      const res = await babel.transformAsync(fs.readFileSync(mPath, "utf-8"), {
        babelrc: false,
        presets: ["@babel/preset-env"],
      });
      console.log("==================================================");
      console.log(res);
      fs.writeFileSync(mPath, res.code);
    });
  });
  await Promise.all(waits.map((w) => w()));
})();
