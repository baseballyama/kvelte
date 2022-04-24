

export function read(): Args {
  const { argv } = process;
  const index = argv.indexOf("--parallel");
  const parallel = index !== -1 ? parseInt(argv[index + 1] || "1") : 1;
  return { parallel, dev: argv.indexOf("--dev") !== -1 };
}
