import { describe, assert, test } from "vitest";
import fs from 'fs';
import { copyNodeProject } from "../src/copy";

describe("copy.ts", async () => {
  test("copyNodeProject", async () => {
    const source = "./test/resources/svelte-sample";
    const target = "./test/resources/svelte-sample-copy";
    await copyNodeProject(source, target);
    const sourceFiles = fs.readdirSync(source);
    const targetFiles = fs.readdirSync(target);
    assert.notEqual(-1, sourceFiles.indexOf("rollup.config.js"));
    assert.equal(-1, targetFiles.indexOf("rollup.config.js"));
    assert.notEqual(-1, targetFiles.indexOf("node_modules"));
    assert.notEqual(-1, targetFiles.indexOf("node_modules"));
    assert.notEqual(-1, targetFiles.indexOf("src"));
    assert.notEqual(-1, targetFiles.indexOf("src"));
    assert.notEqual(-1, targetFiles.indexOf("package.json"));
    assert.notEqual(-1, targetFiles.indexOf("package.json"));
    fs.rmSync(target, { recursive: true });
  });
});