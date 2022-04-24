const { build } = require("esbuild");
const glob = require("glob");
const entryPoints = glob.sync("./src/index.ts");

const isDev = process.argv.indexOf("--dev") !== -1;

build({
  entryPoints,
  bundle: true,
  minify: !isDev,
  outbase: "./src",
  outfile: "./build/bundle.js",
  platform: "node", 
  external: [],
  watch: isDev,
});
