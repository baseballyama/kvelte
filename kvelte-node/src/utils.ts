import fs from "fs";
import fse from 'fs-extra';

export function listFiles(dir: string): string[] {
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .flatMap((dirent) =>
      dirent.isFile()
        ? [`${dir}/${dirent.name}`]
        : listFiles(`${dir}/${dirent.name}`)
    );
}

export function copyFiles(srcPath: string, destPath: string) {
  fse.copySync(srcPath, destPath, { overwrite: true })
}