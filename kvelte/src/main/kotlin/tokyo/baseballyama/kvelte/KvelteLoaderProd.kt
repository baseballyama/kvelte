package tokyo.baseballyama.kvelte

import kotlinx.coroutines.Deferred
import kotlinx.coroutines.async
import kotlinx.coroutines.awaitAll
import kotlinx.coroutines.runBlocking
import org.slf4j.LoggerFactory
import java.nio.file.FileSystems
import java.nio.file.Files
import java.util.*
import javax.script.Invocable
import javax.script.ScriptEngine
import javax.script.ScriptEngineManager
import kotlin.system.measureTimeMillis


private data class SSRResult(
    val html: String?,
    val css: SSRResultCSS?,
    val head: String?,
)

private data class SSRResultCSS(
    val code: String?,
    val map: String?,
)

internal class KvelteLoaderProd(private val config: KvelteConfig) : KvelteLoader(config) {
    private val logger = LoggerFactory.getLogger(this::class.java)

    private val now = Date().time
    private val scriptEngineMap = SimpleLruCache<String, ScriptEngine>()

    init {
        this.loadPages()
    }

    override fun loadPage(src: String, props: Map<String, *>): String {
        logger.debug("START loadPage: $src")
        val propsStr = mapper.writeValueAsString(props)
        val ssrResult: SSRResult
        val time = measureTimeMillis {
            val scriptEngine = this.getScriptEngine(src)
            val inv = scriptEngine as Invocable
            val res = inv.invokeFunction("render", propsStr).toString()
            ssrResult = mapper.readValue(res, SSRResult::class.java)
        }
        logger.debug("END loadPage: $src (${time} ms)")

        return """
            <!DOCTYPE html>
            <html lang="${this.config.lang}">
              <head>
                <meta charset="UTF-8" />
                <link rel="icon" href="/favicon.ico" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <style>${ssrResult.css}</style>
                ${ssrResult.head}
              </head>
              <body>
                <div id="kvelte">${ssrResult.html}</div>
                <script type="module">
                  import App from "/.kvelte/${src.removePrefix("/")}?${now}";
                  new App({
                    target: document.getElementById("kvelte"),
                    hydrate: true,
                    props: $propsStr
                  });
                </script>
              </body>
            </html>
        """.trimIndent()
    }

    override fun loadJavaScript(path: String): String {
        val paths = path.removePrefix("/").split("?").toMutableList().also {
            if (it.size > 1) it.removeLast()
        }.joinToString(separator = "?")
        return this.getResources(".kvelte/dom/pages/${paths}.js") ?: ""
    }


    private fun getScriptEngine(path: String): ScriptEngine {
        val resourcePath = ".kvelte/ssr/pages/${path.removePrefix("/")}.js"
        if (!scriptEngineMap.containsKey(resourcePath)) {
            val scriptEngine = this.getScriptEngine()
            val script = this.getResources(resourcePath)
            scriptEngine.eval(script)
            scriptEngineMap[resourcePath] = scriptEngine
        }
        return scriptEngineMap[resourcePath]!!
    }

    private fun getResources(fileName: String) = this.javaClass
        .classLoader
        .getResourceAsStream(fileName)
        ?.bufferedReader()
        ?.use { it.readText() }

    private fun loadPages() {
        val apiAsyncList = mutableListOf<Deferred<Unit>>()
        runBlocking {
            this@KvelteLoaderProd.getSvelteFilePaths().forEach { path ->
                apiAsyncList.add(async {
                    val scriptEngine = this@KvelteLoaderProd.getScriptEngine()
                    val script = this@KvelteLoaderProd.getResources(path)
                    scriptEngine.eval(script)
                    scriptEngineMap[path] = scriptEngine
                })
            }
            apiAsyncList.awaitAll()
        }
    }

    private fun getScriptEngine(): ScriptEngine {
        return ScriptEngineManager().getEngineByName("graal.js")
    }

    private fun getSvelteFilePaths(): List<String> {
        val files = mutableListOf<String>()
        val uri = this.javaClass.classLoader.getResource(".kvelte/ssr/pages").toURI()
        val fileSystem = FileSystems.newFileSystem(uri, mapOf<String, Any>())
        val myPath = fileSystem.getPath(".kvelte/ssr/pages")
        val ite = Files.walk(myPath).sorted().iterator()
        while (ite.hasNext()) {
            val path = ite.next().toString()
            if (path.endsWith(".js")) files.add(path)
        }
        return files
    }
}


