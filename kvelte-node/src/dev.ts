import * as vite from "vite";
import preprocess from "svelte-preprocess";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import fs from "fs";

const getIndexHTML = (
  path: string,
  html: string,
  css: string,
  head: string,
  props: string
) => {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <script type="module" src="http://localhost:3000/@vite/client"></script>
    <meta charset="UTF-8" />
    <link rel="icon" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>${css}</style>
    ${head}
  </head>
  <body>
    <div id="app">${html}</div>
    <script type="module">
      import App from "http://localhost:3000${path}.js";
      const app = new App({
        target: document.getElementById("app"),
        hydrate: true,
        props: ${props}
      });
      export default app;
    </script>
  </body>
</html>`;
};

(async () => {
  const pluginKvelte = () => ({
    name: "configure-server",
    configureServer(server: vite.ViteDevServer) {
      server.middlewares.use(async (req, res, next) => {
        const url = new URL(req.url ?? "");
        const path = url.pathname;
        if (path.startsWith("/pages/") && path.endsWith(".svelte")) {
          const query = url.search?.substring(1) || "";
          const queryProps = query
            .split("&")
            .find((q) => q.startsWith("props="));
          const propsStr = decodeURIComponent(
            queryProps?.replace("props=", "") || "{}"
          );
          if (queryProps) {
            const mod = await server.ssrLoadModule(path);
            const ssr = mod.default.render(JSON.parse(propsStr || "{}"));
            res.setHeader("Content-Type", "text/html");
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.end(
              getIndexHTML(path, ssr.html, ssr.css.code, ssr.head, propsStr)
            );
            return;
          }
          next();
        }
        if (path.endsWith(".svelte.js")) {
          req.url = `${path.replace(/.svelte.js$/, ".svelte")}`;
          const dom = await server.transformRequest(req.url);
          res.setHeader("Content-Type", "application/javascript");
          res.setHeader("Access-Control-Allow-Origin", "*");
          res.end(dom?.code ?? "");
          return;
        }
        next();
      });
    },
  });

  if (
    !fs.existsSync("/Users/baseballyama/Desktop/git/kvelte/kvelte-step2/assets")
  ) {
    fs.symlinkSync(
      "/Users/baseballyama/Desktop/git/kvelte/kvelte-step2/src/main/resources/kvelte/assets",
      "/Users/baseballyama/Desktop/git/kvelte/kvelte-step2/assets",
      "dir"
    );
  }

  const server = await vite.createServer({
    plugins: [
      svelte({
        compilerOptions: {
          hydratable: true,
        },
        preprocess: preprocess(),
      }),
      pluginKvelte(),
    ],
    server: {
      strictPort: true,
    },
  });
  if (!server.httpServer) {
    throw new Error("HTTP server not available");
  }
  await server.listen();
  const info = server.config.logger.info;
  info(`vite server running at: ${server.config.server.port}\n`);
})();
