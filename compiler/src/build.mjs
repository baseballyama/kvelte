import path from "path";
import fs from 'fs';
import os from 'os';
import { parentPort, workerData } from "worker_threads";
import { copyNodeProject } from "./fsUtils";
import { manipulate } from "./rollup";
import { compile } from "./compile";

const dataId = workerData.dataId;
parentPort.on("message", (msg) => {
  parentPort.postMessage(
    `svelteProjectDir=${msg.svelteProjectDir[dataId]}, svelteFilePath=${msg.svelteFilePath[dataId]}, dom=${msg.dom[dataId]}`
  );
});

async function build(svelteProjectDir, svelteFilePath, targetDir, dom) {
  const temp1 = fs.mkdtempSync(`${os.homedir}/${new Date().getTime()}`);
  const target1 = path.resolve(`${targetDir}/${dom ? 'dom' : 'ssr'}`);
  await copyNodeProject(svelteProjectDir, temp1);
  manipulate({
    svelteProjectAbsDirPath: temp1,
    svelteRelativeFilePath: svelteFilePath,
    outputAbsDirPath: target1,
    dom: true,
    debug: false,
  });
  await compile(temp1, svelteFilePath, target1, true);
  fs.rmdirSync(temp1);
}
