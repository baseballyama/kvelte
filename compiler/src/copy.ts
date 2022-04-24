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
    if (file !== "rollup.config.js") {
      await symlinkDir(path.join(source, file), path.join(target, file));
    }
  }
}
