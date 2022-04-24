import { read } from './argv';

(async () => {
  const args = read();
  if (args.dev) {
    const server = await import("./server");
    server.start();
  } else {
    // do nothing
  }
})();