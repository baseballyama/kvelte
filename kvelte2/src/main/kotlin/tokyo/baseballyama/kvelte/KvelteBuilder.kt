package tokyo.baseballyama.kvelte

internal object KvelteBuilder {
    fun build(lang: String, title: String, ssrHtml: String, js: String, css: String): String {
        // val normalizedPath = this.removeLastSlash(path)
        return """
            <!DOCTYPE html>
            <html lang="$lang">
            <head>
            	<meta charset='utf-8'>
            	<meta name='viewport' content='width=device-width,initial-scale=1'>
            	<title>${title}</title>
            	<link rel='icon' type='image/png' href='/favicon.png'>
            	<style>${css}</style>
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