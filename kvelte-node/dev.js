import * as vite from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

const getIndexHTML = (path, html, css, head) => {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <script type="module" src="/@vite/client"></script>
    <meta charset="UTF-8" />
    <link rel="icon" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Svelte + TS + Vite App</title>
    <style>${css}</style>
    ${head}
  </head>
  <body>
    <div id="app">${html}</div>
    <script type="module">
      import App from "${path}";
      const app = new App({
        target: document.getElementById("app"),
        hydrate: true,
        props: {message: 'foo!'}
      });
      export default app;
    </script>
  </body>
</html>`;
};

(async () => {
  const pluginKvelte = () => ({
    name: "configure-server",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        console.log(req.url);
        if (req.url.indexOf(".") !== -1) {
          next();
        } else if (req.url === "/" || req.url === "/sub") {
          const endWithSlash = req.url.endsWith("/");
          const sveltePath = `./pages${req.url}${
            endWithSlash ? "index" : ""
          }.svelte`;

          const mod = await server.ssrLoadModule(sveltePath);
          const ssr = mod.default.render({ message: "foo!" });
          console.log({ ssr });
          res.setHeader("Content-Type", "text/html");
          res.end(getIndexHTML(sveltePath, ssr.html, ssr.css.code, ssr.head));
        } else {
          next();
        }
      });
    },
  });

  const server = await vite.createServer({
    plugins: [
      svelte({
        compilerOptions: {
          hydratable: true,
        },
      }),
      pluginKvelte(),
    ],
  });
  if (!server.httpServer) {
    throw new Error("HTTP server not available");
  }
  await server.listen();
  const info = server.config.logger.info;
  info(`vite server running at: ${server.config.server.port}\n`);
})();
