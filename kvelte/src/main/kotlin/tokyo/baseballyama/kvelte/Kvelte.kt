package tokyo.baseballyama.kvelte

import java.io.File
import kotlin.reflect.KClass

class Kvelte private constructor(private val config: KvelteConfig) {
    companion object {
        private lateinit var instance: Kvelte
        fun create(config: KvelteConfig): Kvelte {
            if (::instance.isInitialized) return instance
            instance = Kvelte(config)
            return instance
        }

        fun getInstance(): Kvelte? = if (::instance.isInitialized) instance else null
    }

    private val loader: KvelteLoader

    init {
        this.loader = if (isProd(this.config.mainClass)) KvelteLoaderProd(config) else KvelteLoaderDev(config)
    }


    fun loadPage(path: String, props: Map<String, *> = emptyMap<String, String>()): String {
        return loader.loadPage(path, props)
    }

    fun loadJavaScript(path: String): ByteArray {
        return loader.loadJavaScript(path.removePrefix("/").replace(".kvelte", "")).toByteArray()
    }

    private fun isProd(mainClass: KClass<*>): Boolean {
        return File(mainClass.java.protectionDomain.codeSource.location.path).isFile
    }
}