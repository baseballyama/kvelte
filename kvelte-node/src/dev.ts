import * as vite from "vite";
import preprocess from "svelte-preprocess";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import fs from "fs";

const buildHTML = (
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
    <link rel="icon" href="/assets/favicon.ico" />
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

const pluginKvelte = () => ({
  name: "configure-server",
  configureServer(server: vite.ViteDevServer) {
    server.middlewares.use(async (req, res, next) => {
      const url = new URL(`http://dummy${req.url ?? ""}`);
      const path = url.pathname;
      if (path.startsWith("/pages/") && path.endsWith(".svelte")) {
        const query = url.search?.substring(1) || "";
        const queryProps = query.split("&").find((q) => q.startsWith("props="));
        const propsStr = decodeURIComponent(
          queryProps?.replace("props=", "") || "{}"
        );
        if (queryProps) {
          try {
            const mod = await server.ssrLoadModule(path);
            const ssr = mod.default.render(JSON.parse(propsStr || "{}"));
            res.setHeader("Content-Type", "text/html");
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.end(
              buildHTML(path, ssr.html, ssr.css.code, ssr.head, propsStr)
            );
          } catch (e) {
            console.error(e);
            res.statusCode = 500;
            if (e instanceof Error) {
              res.end(`<pre>${e.message}\n${e.stack}</pre>`);
            } else {
              res.end('Unexpected error occurred');
            }
          }
        } else {
          next();
        }
      } else if (path.endsWith(".svelte.js")) {
        req.url = `${path.replace(/.svelte.js$/, ".svelte")}`;
        try {
          const dom = await server.transformRequest(req.url);
          res.setHeader("Content-Type", "application/javascript");
          res.setHeader("Access-Control-Allow-Origin", "*");
          res.end(dom?.code ?? "");
        } catch (e) {
          console.error(e);
        }
      } else {
        next();
      }
    });
  },
});

(async () => {
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

  const { logger } = server.config;
  if (!server.httpServer) {
    logger.error("HTTP server not available");
    process.exit(1);
  }
  await server.listen();
  logger.info(`vite server running at: ${server.config.server.port}\n`);
})();
