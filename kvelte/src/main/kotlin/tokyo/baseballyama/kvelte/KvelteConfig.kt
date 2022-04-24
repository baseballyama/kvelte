package tokyo.baseballyama.kvelte

import java.nio.file.Path

data class KvelteConfig(
    val lang: String,
    val svelteProjectDir: Path,
    val hydration: Boolean = true,
    val production: Boolean = true,
    val defaultLang: String = "en",
    val defaultTitle: String = "Kvelte App"
)