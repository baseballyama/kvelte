package tokyo.baseballyama.kvelte

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import tokyo.baseballyama.kvelte.file.FileUtils
import tokyo.baseballyama.kvelte.file.FileWatcher
import java.nio.file.Path
import kotlin.io.path.relativeTo

fun main() {
    val kvelte =
        Kvelte(KvelteConfig(svelteProjectDir = Path.of("/Users/baseballyama/Desktop/git/ksveltor/examples/ktor/svelte")))
    println(kvelte.load("./src/App.svelte", mapOf<String, String>()))
}

class Kvelte(private val config: KvelteConfig) {

    private val rollupConfigFileWriter: RollupConfigFileWriter =
        RollupConfigFileWriter(config.svelteProjectDir, config.production)
    private val svelteFileMap = mutableMapOf<String, String>()
    private val dirSize = FileUtils.getDirectorySize(config.svelteProjectDir)
    private val totalSpace = config.svelteProjectDir.toFile().totalSpace
    private val availableProcessorsCount = Runtime.getRuntime().availableProcessors()
    private val threadCount = availableProcessorsCount.coerceAtMost((totalSpace / dirSize).toInt())
    private val websocket = if (config.production) null else Websocket()

    init {
        CoroutineScope(Dispatchers.IO).launch {
            FileWatcher(config.svelteProjectDir).use { watcher ->
                while (true) {
                    watcher.watch { path ->
                        println("update: $path")
                        println(path.toString().endsWith(".svelte"))
                        if (path.toString().endsWith(".svelte")) {
                            val relativePath = path.toAbsolutePath().relativeTo(config.svelteProjectDir)
                            val domOutDir =
                                this@Kvelte.rollupConfigFileWriter.write(relativePath.toString(), true)
                            val dom = SvelteBuilder.build(config.svelteProjectDir, domOutDir)
                            this@Kvelte.rollupConfigFileWriter.restore()
                            val js = dom.js.readText()
                            val css = dom.css.readText()
                            val map = mapOf("css" to css, "js" to js)
                            this@Kvelte.websocket?.update(
                                path.toString(),
                                jacksonObjectMapper().writeValueAsString(map)
                            )
                        }
                    }
                }
            }
        }
    }

    fun load(
        rootSvelteFilePath: String,
        props: Map<String, *>,
        lang: String = config.defaultLang,
        title: String = config.defaultTitle,
    ): String {

        val rootSvelteAbsoluteFilePath = config.svelteProjectDir.resolve(rootSvelteFilePath).normalize()

        // キャッシュが存在しない場合はSvelteファイルを読み込む
        if (!this.svelteFileMap.containsKey(rootSvelteFilePath)) {
            // ssr
            val ssrHTML = if (config.hydration) {
                val ssrOutDir = this.rollupConfigFileWriter.write(rootSvelteFilePath, false)
                val ssr = SvelteBuilder.build(config.svelteProjectDir, ssrOutDir)
                this.rollupConfigFileWriter.restore()
                Command.execute("node", ssr.js.absolutePath).stdout
            } else ""

            // dom
            val domOutDir = this.rollupConfigFileWriter.write(rootSvelteFilePath, true)
            val dom = SvelteBuilder.build(config.svelteProjectDir, domOutDir)
            this.rollupConfigFileWriter.restore()

            val js = dom.js.readText()
            val css = dom.css.readText()
            val html =
                KvelteBuilder.build(lang, title, ssrHTML, js, css, websocket?.url, props, rootSvelteAbsoluteFilePath)
            this.svelteFileMap[rootSvelteFilePath] = html
        }

        return replaceLast(
            this.svelteFileMap[rootSvelteFilePath]!!,
            Constants.KVELTE_PROPS,
            jacksonObjectMapper().writeValueAsString(props)
        )
    }

    private fun replaceLast(string: String, substring: String, replacement: String): String {
        val index = string.lastIndexOf(substring);
        if (index == -1) return string
        return string.substring(0, index) + replacement + string.substring(index + substring.length);
    }
}