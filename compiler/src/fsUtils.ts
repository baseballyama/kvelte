import * as fs from "fs";
import * as path from "path";
import symlinkDir from "symlink-dir";

/**
 * Copy a node project as Symbolic link except `rollup.config.js`.
 *
 * @param source node project directory
 * @param target target directory
 */
export async function copyNodeProject(source: string, target: string) {
  const files = fs.readdirSync(source);
  for (const file of files) {
    if (file === "rollup.config.js") {
      fs.copyFileSync(path.join(source, file), path.join(target, file));
    } else {
      await symlinkDir(path.join(source, file), path.join(target, file));
    }
  }
}

export function walkNodeProject(
  absPath: string,
  shouldSkipNodeModules: boolean,
  fileCallback: (path: string) => void
) {
  const files = fs.readdirSync(absPath);
  files.forEach((f) => {
    const fp = path.join(absPath, f);
    if (fs.statSync(fp).isDirectory()) {
      if (!(f === "node_modules" && shouldSkipNodeModules)) {
        walkNodeProject(fp, shouldSkipNodeModules, fileCallback);
      }
    } else {
      fileCallback(fp);
    }
  });
}
