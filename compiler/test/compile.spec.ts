import { describe, assert, test } from "vitest";
import path from "path";
import fs from 'fs';
import { copyNodeProject } from "../src/fsUtils";
import { manipulate } from "../src/rollup";
import { compile, bulkCompile } from "../src/compile";
import { walkNodeProject } from "../src//fsUtils";
import { Worker } from "worker_threads";

describe("compile.ts", async () => {
  describe("compile", async () => {
    test("success", async () => {

      // const worker = new Worker('./src/build.mjs', { workerData: null });
      // worker.on("message", (msg) => {
      //   console.log(`受信：${msg}`); // 受信：返信:buff1=102 , buff2=202
      // });

      // // ③ワーカーへのメッセージ送信
      // worker.postMessage(
      //   {
      //     svelteProjectDir: new TextEncoder().encode("svelteProjectDir"),
      //     svelteFilePath: new TextEncoder().encode("svelteFilePath"),
      //     dom: new TextEncoder().encode("dom"),
      //   },
      // );


      const source = path.resolve("./test/resources/svelte-sample");

      const files: string[] = [];
      walkNodeProject(source, true, (path) => {
        if (path.match(/\.(svelte|svx)$/)) files.push(path);
      });

      const promises: (() => Promise<unknown>)[] = [];
      for (const file of files) {
        const temp1 = path.resolve(
          `./test/resources/temp/${new Date().getTime()}`
        );
        const target1 = path.resolve("./test/resources/.kvelte/dom");
        fs.mkdirSync(temp1, { recursive: true });
        fs.mkdirSync(target1, { recursive: true });
        const svelteFilePath = path.relative(source, file);
        promises.push(async () => {
          console.log("start");
          await copyNodeProject(source, temp1);
          manipulate({
            svelteProjectAbsDirPath: temp1,
            svelteRelativeFilePath: svelteFilePath,
            outputAbsDirPath: target1,
            dom: true,
            debug: false,
          });
          await compile(temp1, svelteFilePath, target1, true);
          fs.rmdirSync(temp1, { recursive: true });
          console.log("end");
        });

        const temp2 = path.resolve(
          `./test/resources/temp/${new Date().getTime()}`
        );
        const target2 = path.resolve("./test/resources/.kvelte/ssr");
        fs.mkdirSync(temp2, { recursive: true });
        fs.mkdirSync(target2, { recursive: true });
        promises.push(async () => {
          console.log("start");
          await copyNodeProject(source, temp2);
          manipulate({
            svelteProjectAbsDirPath: temp2,
            svelteRelativeFilePath: svelteFilePath,
            outputAbsDirPath: target2,
            dom: false,
            debug: false,
          });
          await compile(temp2, svelteFilePath, target2, false);
          fs.rmdirSync(temp2, { recursive: true });
          console.log("end");
        });
        const p = [];
        for (const promise of promises) {
          p.push(promise());
        }
      }

      for (const promise of promises) {
        await promise();
      }
    });
  });
});
