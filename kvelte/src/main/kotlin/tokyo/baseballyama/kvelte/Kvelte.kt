package tokyo.baseballyama.kvelte

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import tokyo.baseballyama.kvelte.dev.hmr.Hmr
import tokyo.baseballyama.kvelte.utils.FileUtils
import java.nio.file.Path
import kotlin.io.path.relativeTo


class Kvelte(private val config: KvelteConfig) {

    private val rollupConfigFileWriter: RollupConfigFileWriter =
        RollupConfigFileWriter(config.svelteProjectDir, config.production)
    private val svelteFileMap = mutableMapOf<String, String>()
    private val dirSize = FileUtils.getDirectorySize(config.svelteProjectDir)
    private val totalSpace = config.svelteProjectDir.toFile().totalSpace
    private val availableProcessorsCount = Runtime.getRuntime().availableProcessors()
    private val threadCount = availableProcessorsCount.coerceAtMost((totalSpace / dirSize).toInt())

    private lateinit var hmr: Hmr

    init {
        CoroutineScope(Dispatchers.IO).launch {
            FileUtils.findFiles(
                config.svelteProjectDir,
                "(node_modules|build|public)".toRegex(),
                ".*\\.(svelte|svx)$".toRegex()
            ).forEach { file ->
                val rootSvelteFilePath = file.relativeTo(config.svelteProjectDir).normalize().toString()
                this@Kvelte.load(rootSvelteFilePath, mapOf<String, String>(), "en", "")
            }
        }

        if (!config.production) hmr = Hmr(config.svelteProjectDir, this.rollupConfigFileWriter, mapOf()) {}
    }

    fun load(
        pRootSvelteFilePath: String,
        props: Map<String, *>,
        lang: String = config.defaultLang,
        title: String = config.defaultTitle,
    ): String {

        val rootSvelteFilePath = Path.of(pRootSvelteFilePath).normalize()
        val rootSvelteAbsoluteFilePath = config.svelteProjectDir.resolve(rootSvelteFilePath).normalize()

        println("load: $rootSvelteFilePath")

        // キャッシュが存在しない場合はSvelteファイルを読み込む
        if (!this.svelteFileMap.containsKey(rootSvelteFilePath.toString())) {
            // ssr
            val ssrHTML = if (config.hydration) {
                val ssrOutDir = this.rollupConfigFileWriter.write(rootSvelteFilePath.toString(), false)
                val ssr = SvelteBuilder.build(config.svelteProjectDir, ssrOutDir)
                println("ssrOutDir: $ssrOutDir")
                println("ssr: $ssr")
                this.rollupConfigFileWriter.restore()
                Command.execute("node", ssr.js.absolutePath).stdout
            } else ""
            println(ssrHTML)

            // dom
            val domOutDir = this.rollupConfigFileWriter.write(rootSvelteFilePath.toString(), true)
            val dom = SvelteBuilder.build(config.svelteProjectDir, domOutDir)
            println("domOutDir: $domOutDir")
            println("dom: $dom")
            this.rollupConfigFileWriter.restore()

            val js = dom.js.readText()
            val css = if (dom.css.exists()) dom.css.readText() else ""
            val html =
                KvelteBuilder.build(
                    config.lang,
                    ssrHTML,
                    js,
                    css,
                    hmr.websocketUrl,
                    props,
                    rootSvelteAbsoluteFilePath
                )
            this.svelteFileMap[rootSvelteFilePath.toString()] = html
        }

        return this.svelteFileMap[rootSvelteFilePath.toString()]!!.replace(
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