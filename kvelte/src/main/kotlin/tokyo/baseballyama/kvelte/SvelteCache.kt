package tokyo.baseballyama.kvelte

import java.nio.file.Path

data class SvelteCache(
    val svelteFilePath: Path,
    val ssrHtml: String,
    val js: String,
    val css: String,
)
