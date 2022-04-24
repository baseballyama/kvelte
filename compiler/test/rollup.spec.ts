import { describe, assert, test } from "vitest";
import fs from 'fs';
import path from 'path';
import { manipulate, Props } from "../src/rollup";
import { Result } from "../src/utils/result";

function getProps(folderName: string): Props {
  return {
  svelteProjectAbsDirPath: `./test/resources/rollup/${folderName}`,
  svelteRelativeFilePath: './input/index.svelte',
  outputAbsDirPath: `./test/resources/rollup/${folderName}/output/rollup.config.js`,
  dom: true,
  debug: false,
  }
};

describe("rollup.ts", () => {
  describe("modify", () => {
    test("success", () => {
      const result = runModify("success");
      assert.equal(true, result.isSuccess());
    });
    test("success-no-virtual", () => {
      const result = runModify("success-no-virtual");
      assert.equal(true, result.isSuccess());
    });
    test("success-no-input", () => {
      const result = runModify("success-no-input");
      assert.equal(true, result.isSuccess());
    });
    test("success-no-compilerOptions", () => {
      const result = runModify("success-no-compilerOptions");
      assert.equal(true, result.isSuccess());
    });
    test("success-no-compilerOptions2", () => {
      const result = runModify("success-no-compilerOptions2");
      assert.equal(true, result.isSuccess());
    });
    test("no-plugin-virtual", () => {
      const result = runModify("no-plugin-virtual");
      assert.equal(true, result.isFailure());
    });
  });
});

function runModify(folderName: string): Result<string, Error> {
  const result = manipulate(getProps(folderName));
  // fs.rmSync(target);
  return result;
}