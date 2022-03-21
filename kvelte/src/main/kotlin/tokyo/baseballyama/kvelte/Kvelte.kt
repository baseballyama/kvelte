package tokyo.baseballyama.kvelte

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.async
import kotlinx.coroutines.runBlocking
import kotlinx.coroutines.withContext
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

    private var isProduction = true
    fun setIsProduction(isProduction: Boolean) {
        this.isProduction = isProduction
        this.rollupConfigFileWriter = RollupConfigFileWriter(this.svelteProjectDir!!, this.isProduction)
    }

    private var rollupConfigFileWriter: RollupConfigFileWriter? = null

    private val svelteFileMap = mutableMapOf<String, String>()

    fun load(lang: String, title: String, rootSvelteFilePath: String, props: Map<String, *>): String {
        if (svelteProjectDir == null) throw KvelteException("should set value to ${Kvelte::class.java.name}.${Kvelte::svelteProjectDir.name} before calling this method")
        if (this.svelteFileMap.containsKey(rootSvelteFilePath)) return this.svelteFileMap[rootSvelteFilePath]!!.replace(
            "__KVELTE_PROPS__",
            jacksonObjectMapper().writeValueAsString(props)
        )

        return runBlocking {

            // ssr
            val ssrDeffer = async {
                withContext(Dispatchers.IO) {
                    println("ssr start")
                    val ssrOutDir = this@Kvelte.rollupConfigFileWriter!!.write(rootSvelteFilePath, false)
                    val ssr = SvelteBuilder.build(svelteProjectDir!!, ssrOutDir)
                    this@Kvelte.rollupConfigFileWriter!!.restore()
                    println("ssr end")
                    Command.execute("node", ssr.js.absolutePath).stdout
                }
            }

            // dom
            val domDeffer = async {
                withContext(Dispatchers.IO) {
                    println("dom start")
                    val domOutDir = this@Kvelte.rollupConfigFileWriter!!.write(rootSvelteFilePath, true)
                    val dom = SvelteBuilder.build(svelteProjectDir!!, domOutDir)
                    this@Kvelte.rollupConfigFileWriter!!.restore()
                    println("dom end")
                    dom
                }
            }

            val ssrHTML = ssrDeffer.await()
            val dom = domDeffer.await()
            val js = dom.js.readText()
            val css = dom.css.readText()
            val html = KvelteBuilder.build(lang, title, ssrHTML, js, css)
            this@Kvelte.svelteFileMap[rootSvelteFilePath] = html
            html.replace("__KVELTE_PROPS__", jacksonObjectMapper().writeValueAsString(props))
        }
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