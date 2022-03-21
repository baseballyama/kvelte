package tokyo.baseballyama.kvelte

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import java.io.File
import java.nio.file.Paths


fun main() {
    Kvelte.setSvelteProjectDir("/Users/baseballyama/Desktop/git/ksveltor/examples/ktor/svelte")
    println(Kvelte.load("en", "テストです!", "./src/App.svelte", mapOf<String, String>()))
}

object Kvelte {

    private var svelteProjectDir: File? = null
    fun setSvelteProjectDir(path: String) {
        this.svelteProjectDir = this.getSvelteProjectAbsolutePath(path)
        this.rollupConfigFileWriter = RollupConfigFileWriter(this.svelteProjectDir!!, this.isProduction)
    }

    private var enableSSR = true
    fun setEnableSSR(enableSSR: Boolean) {
        this.enableSSR = enableSSR
    }

    private var isProduction = true
    fun setIsProduction(isProduction: Boolean) {
        this.isProduction = isProduction
        this.rollupConfigFileWriter = RollupConfigFileWriter(this.svelteProjectDir!!, this.isProduction)
    }

    private var defaultLang = "en"
    fun setDefaultLang(defaultLang: String) {
        this.defaultLang = defaultLang
    }

    private var defaultTitle = "Hello Kvelte"
    fun setDefaultTitle(defaultTitle: String) {
        this.defaultTitle = defaultTitle
    }

    private var rollupConfigFileWriter: RollupConfigFileWriter? = null

    private val svelteFileMap = mutableMapOf<String, String>()

    fun load(
        lang: String = defaultLang,
        title: String = defaultTitle,
        rootSvelteFilePath: String,
        props: Map<String, *>
    ): String {
        if (svelteProjectDir == null) throw KvelteException("should set value to ${Kvelte::class.java.name}.${Kvelte::svelteProjectDir.name} before calling this method")

        // キャッシュが存在しない場合はSvelteファイルを読み込む
        if (!this.svelteFileMap.containsKey(rootSvelteFilePath)) {
            // ssr
            val ssrHTML = if (enableSSR) {
                val ssrOutDir = this.rollupConfigFileWriter!!.write(rootSvelteFilePath, false)
                val ssr = SvelteBuilder.build(svelteProjectDir!!, ssrOutDir)
                this.rollupConfigFileWriter!!.restore()
                Command.execute("node", ssr.js.absolutePath).stdout
            } else ""

            // dom
            val domOutDir = this.rollupConfigFileWriter!!.write(rootSvelteFilePath, true)
            val dom = SvelteBuilder.build(svelteProjectDir!!, domOutDir)
            this.rollupConfigFileWriter!!.restore()

            val js = dom.js.readText()
            val css = dom.css.readText()
            val html = KvelteBuilder.build(lang, title, ssrHTML, js, css)
            this.svelteFileMap[rootSvelteFilePath] = html
        }

        return this.svelteFileMap[rootSvelteFilePath]!!.replace(
            "__KVELTE_PROPS__",
            jacksonObjectMapper().writeValueAsString(props)
        )
    }

    private fun getSvelteProjectAbsolutePath(svelteProjectDirPath: String): File {
        val dir = if (svelteProjectDirPath.startsWith("/")) {
            File(svelteProjectDirPath)
        } else {
            val abs = File("").absolutePath
            Paths.get(abs).resolve(svelteProjectDirPath).toFile()
        }
        if (!dir.exists()) throw KvelteException("Svelte project does not exists. path: ${dir.absolutePath}")
        return dir
    }
}