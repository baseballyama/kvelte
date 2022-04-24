package tokyo.baseballyama.kvelte

import java.nio.file.Path

internal object KvelteBuilder {
    fun build(
        lang: String,
        ssrHtml: String,
        js: String,
        css: String,
        websocketUrl: String?,
        props: Map<String, *>,
        svelteFilePath: Path,
    ): String {
        val hmr = if (websocketUrl == null) ""
        else """
            <script id="kvelte">
                const props = JSON.stringify(${Constants.KVELTE_PROPS});
                const connection = new WebSocket('$websocketUrl');
                connection.onopen = function (event) {
                    connection.send('$svelteFilePath');
                  };
                connection.onmessage = function (event) {
                const jsonStr = event.data
                  const json = JSON.parse(jsonStr);
                  if (json.css) {
                    const style = document.getElementsByTagName("style")[0]
                    if (style) style.remove()
                    const newStyle = document.createElement('style');
                    document.head.appendChild(newStyle);
                    newStyle.type = 'text/css';
                    if (newStyle.styleSheet) newStyle.styleSheet.cssText = json.css;
                    else newStyle.appendChild(document.createTextNode(json.css));
                  }
                  if (json.js) {
                    const script = document.body.getElementsByTagName("script")[0];
                    if (script) script.remove();
                    const newScript = document.createElement('script');
                    const replaced = json.js.replace('${Constants.KVELTE_WEBHOOK_PROPS}', props);
                    newScript.appendChild(document.createTextNode(replaced));
                    document.body.appendChild(newScript);
                  }
                };
                document.getElementById("kvelte").remove();
            </script>
        """.trimIndent()

        // val normalizedPath = this.removeLastSlash(path)
        return """
            <!DOCTYPE html>
            <html lang="$lang">
            <head>
            	<meta charset='utf-8'>
            	<meta name='viewport' content='width=device-width,initial-scale=1'>
            	<link rel='icon' type='image/png' href='/favicon.png'>
            	<style>${css}</style>
                $hmr
            </head>
            <body>${ssrHtml}<script>${js}</script></body>
            </html>
        """.trimIndent()
    }

    private fun removeLastSlash(path: String): String {
        if (path.endsWith("/")) {
            return path.substring(0, path.length - 1)
        }
        return path
    }
}