import { describe, assert, test } from "vitest";
import fs from 'fs';
import path from 'path';
import { modify } from '../src/rollup';
import { Result } from "../src/utils/result";

const baseConfig: RollupConfig = {
  dom: true,
  inputSvelteFilePath: "./test/resources/rollup/input/index.svelte",
  outputDir: "./test/resources/rollup/output/",
};

describe("rollup.ts", () => {
  describe("modify", () => {
    test("success", () => {
      const result = runModify("success", baseConfig);
      assert.equal(true, result.isSuccess());
      console.log(result);
    });
    test("success-no-virtual", () => {
      const result = runModify("success-no-virtual", baseConfig);
      assert.equal(true, result.isSuccess());
      console.log(result);
    });
    test("success-no-input", () => {
      const result = runModify("success-no-input", baseConfig);
      assert.equal(true, result.isSuccess());
    });
    test("success-no-compilerOptions", () => {
      const result = runModify("success-no-compilerOptions", baseConfig);
      assert.equal(true, result.isSuccess());
    });
    test("success-no-compilerOptions2", () => {
      const result = runModify("success-no-compilerOptions2", baseConfig);
      assert.equal(true, result.isSuccess());
    });
    test("no-plugin-virtual", () => {
      const result = runModify("no-plugin-virtual", baseConfig);
      assert.equal(true, result.isFailure());
    });
  });
});

function runModify(folderName: string, config: RollupConfig): Result<string, Error> {
  const source = path.resolve(`./test/resources/rollup/${folderName}/rollup.config.js`);
  const target = path.resolve(`./test/resources/rollup/${folderName}/output/rollup.config.js`);
  const result = modify(source, config, target);
  // fs.rmSync(target);
  return result;
}