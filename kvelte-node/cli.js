#!/usr/bin/env node
const mode = process.argv[2];

if (mode === "build") import("./build.js");
else if (mode === "dev") import("./dev.js");
else throw Error(`${mode} is not a valid`);
