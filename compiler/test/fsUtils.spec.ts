import { describe, assert, test } from "vitest";
import fs from "fs";
import path from "path";
import { copyNodeProject, walkNodeProject } from "../src/fsUtils";

describe("fsUtils.ts", async () => {
  test("copyNodeProject", async () => {
    const source = "./test/resources/svelte-sample";
    const target = "./test/resources/svelte-sample-copy";
    await copyNodeProject(source, target);
    const sourceFiles = fs.readdirSync(source);
    const targetFiles = fs.readdirSync(target);
    assert.notEqual(-1, sourceFiles.indexOf("rollup.config.js"));
    assert.notEqual(-1, targetFiles.indexOf("rollup.config.js"));
    assert.notEqual(-1, sourceFiles.indexOf("node_modules"));
    assert.notEqual(-1, targetFiles.indexOf("node_modules"));
    assert.notEqual(-1, sourceFiles.indexOf("src"));
    assert.notEqual(-1, targetFiles.indexOf("src"));
    assert.notEqual(-1, sourceFiles.indexOf("package.json"));
    assert.notEqual(-1, targetFiles.indexOf("package.json"));
    fs.rmSync(target, { recursive: true });
  });

  test("walkNodeProject", async () => {
    const source = path.resolve("./test/resources/svelte-sample");
    const files: string[] = [];
    walkNodeProject(source, true, (path) => files.push(path));
    assert.equal(files.length, 15);
  });
});
