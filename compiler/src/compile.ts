import fs from "fs";
import path from "path";
import { walkNodeProject } from "./fsUtils";
import { rollup } from "rollup";
const loadConfigFile = require("rollup/dist/loadConfigFile.js");

export async function bulkCompile(
  svelteProjectPath: string,
  outputDirPath: string,
  dom: boolean
) {
  const svelteProjectAbsPath = path.resolve(svelteProjectPath);
  const outputDirAbsPath = path.resolve(outputDirPath);
  const files: string[] = [];
  walkNodeProject(svelteProjectAbsPath, true, (path) => {
    if (path.match(/\.(svelte|svx)$/)) files.push(path);
  });
  for (const file of files) {
    const relativePath = path.relative(svelteProjectPath, file);
    console.log(relativePath);
    await compile(svelteProjectPath, relativePath, outputDirAbsPath, dom);
  }
}

export async function compile(
  svelteProjectAbsPath: string,
  svelteFileRelativePath: string,
  outputDirAbsPath: string,
  dom: boolean
) {
  const rollupConfig = path.resolve(svelteProjectAbsPath, "rollup.config.js");
  const outputDir = path.resolve(outputDirAbsPath, svelteFileRelativePath);
  fs.mkdirSync(outputDir, { recursive: true });
  console.log("outputDir", outputDir);
  const config = await loadConfigFile(rollupConfig, { format: "es" });
  for (const optionsObj of config.options) {
    const bundle = await rollup(optionsObj);
    await Promise.all(optionsObj.output.map(bundle.generate));
    await Promise.all(optionsObj.output.map(bundle.write));
    bundle.close();
  }
  if (!dom) await import(path.join(outputDir, "bundle.js"));
}

