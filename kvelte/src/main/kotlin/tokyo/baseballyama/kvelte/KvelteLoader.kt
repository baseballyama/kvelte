package tokyo.baseballyama.kvelte

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper

internal abstract class KvelteLoader(private val config: KvelteConfig) {
    protected val mapper = jacksonObjectMapper()
    
    abstract fun loadPage(src: String, props: Map<String, *>): String
    abstract fun loadJavaScript(path: String): String
}