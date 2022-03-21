import svelte from "rollup-plugin-svelte";
import css from "rollup-plugin-css-only";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import virtual from "@rollup/plugin-virtual";
import { terser } from "rollup-plugin-terser";
import { rollup } from "rollup";

// ----------------------------------------------------------------------
//
// ----------------------------------------------------------------------

const production = !process.env.ROLLUP_WATCH;

async function bundle() {
  const rollupBuild = await rollup({
    input: "main",
    plugins: [
      virtual({
        main: createEntryModule(),
      }),
      svelte({
        compilerOptions: {
          dev: true,
          hydratable: true,
        },
      }),
      css({ output: "bundle.css" }),
      resolve({
        browser: true,
        dedupe: ["svelte"],
      }),
      commonjs(),
      !production && serve(),
      !production && livereload("public"),
      !production && terser(),
    ],
  });

  rollupBuild.write({
    sourcemap: true,
    format: "iife",
    name: "app",
    file: "public/build/bundle.js",
  });
}

function createEntryModule() {
  return `
import App from './src/App.svelte';

const app = new App({
  target: document.body,
  props: {
    name: 'world'
  }
});

export default app;
`;
}

bundle();
