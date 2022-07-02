package tokyo.baseballyama.kvelte

import kotlin.reflect.KClass

data class KvelteConfig(
    val mainClass: KClass<*>,
    val lang: String = "en"
)