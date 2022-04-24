package tokyo.baseballyama.kvelte

import java.io.BufferedWriter
import java.io.File
import java.io.FileWriter
import java.io.PrintWriter
import java.nio.file.Files
import java.nio.file.Path

/**
 * Svelteファイルをビルドするための仮想ファイルを rollup.config.js に書き込むクラスです.
 */
internal class RollupConfigFileWriter(private val svelteProjectDir: Path, private val isProduction: Boolean) {
    private val rollupFile: File
    private val originalText: String
    private val outputFolder = this.getOutputFolder()

    companion object {
        private const val ROLLUP_FILE_NAME = "rollup.config.js"
        private const val KVELTE_INPUT = "__KVELTE_INPUT__"
        private const val KVELTE_OUTPUT = "__KVELTE_OUTPUT__"
        private const val KVELTE_OUTPUT_CSS = "__KVELTE_OUTPUT_CSS__"
        private const val KVELTE_GENERATE = "__KVELTE_GENERATE__"
        private const val KVELTE_HYDRATABLE = "__KVELTE_HYDRATABLE__"
        private const val KVELTE_PRODUCTION = "__KVELTE_PRODUCTION__"
        private const val KVELTE_MODULE_CONTEXT = "__KVELTE_MODULE_CONTEXT__"
        const val OUTPUT_FILE_NAME_JS = "bundle.js"
        const val OUTPUT_FILE_NAME_JS_SOURCE_MAP = "bundle.js.map"
        const val OUTPUT_FILE_NAME_CSS = "bundle.css"
        private val outputBaseDir: Path

        init {
            val baseDir = File("./temp/svelte")
            if (baseDir.exists()) baseDir.deleteRecursively()
            baseDir.mkdirs()
            outputBaseDir = baseDir.toPath()
        }
    }

    init {
        rollupFile = this.getRollupConfigFile(svelteProjectDir)
        originalText = this.readRollupConfigFile(rollupFile)
    }

    /**
     * 仮想ファイルを作成して rollup.config.js に書き込みます.
     * @param rootSvelteFilePath Svelteファイルへのパス (Svelteリポジトリからの相対パス)
     */
    fun write(rootSvelteFilePath: String, dom: Boolean): File {
        this.throwExceptionIfSvelteFileIsNotExists(this.svelteProjectDir, rootSvelteFilePath)
        val outDir = outputFolder.resolve(rootSvelteFilePath).resolve(if (dom) "dom" else "ssr")
        val rollupConfig = this.buildRollupConfigFile(rootSvelteFilePath, dom, outDir)
        FileWriter(rollupFile).use { writer ->
            PrintWriter(BufferedWriter(writer)).use { pw -> pw.println(rollupConfig) }
        }
        return outDir
    }

    fun restore() {
        FileWriter(rollupFile).use { writer ->
            PrintWriter(BufferedWriter(writer)).use { pw -> pw.println(originalText) }
        }
    }

    private fun buildRollupConfigFile(rootSvelteFilePath: String, dom: Boolean, outputFolder: File): String {
        val virtualFile = VirtualFileBuilder.build(rootSvelteFilePath, dom)
        return originalText
            .replace(KVELTE_INPUT, virtualFile)
            .replace(KVELTE_OUTPUT, "\"" + outputFolder.resolve(OUTPUT_FILE_NAME_JS).absolutePath + "\"")
            .replace(KVELTE_OUTPUT_CSS, "\"" + "bundle.css" + "\"")
            .replace(KVELTE_GENERATE, "\"" + (if (dom) "dom" else "ssr") + "\"")
            .replace(KVELTE_HYDRATABLE, (if (dom) "true" else "false"))
            .replace(KVELTE_PRODUCTION, (if (isProduction) "true" else "true"))
            .replace(KVELTE_MODULE_CONTEXT, "(id) => { console.log(`kvelte_module_context: \${id}`); }")
    }

    private fun throwExceptionIfSvelteFileIsNotExists(svelteProjectDir: Path, rootSvelteFilePath: String) {
        val file = svelteProjectDir.resolve(rootSvelteFilePath).toFile()
        if (!file.exists()) throw KvelteException("Svelte file does not exists. path: ${file.absolutePath}")
    }

    private fun getRollupConfigFile(svelteProjectDir: Path): File {
        val file = svelteProjectDir.resolve(ROLLUP_FILE_NAME).toFile()
        if (!file.exists()) throw KvelteException("rollup.config.js does not exists. path: ${file.absolutePath}")
        return file
    }

    private fun readRollupConfigFile(rollupFile: File): String {
        val text = rollupFile.readText()
        if (text.indexOf(KVELTE_INPUT) == -1) throw KvelteException("rollup.config.js does not contains $KVELTE_INPUT")
        if (text.indexOf(KVELTE_OUTPUT) == -1) throw KvelteException("rollup.config.js does not contains $KVELTE_OUTPUT")
        if (text.indexOf(KVELTE_MODULE_CONTEXT) == -1) throw KvelteException("rollup.config.js does not contains $KVELTE_MODULE_CONTEXT")
        // MEMO: CSSファイルはないならないで良い
        // if (text.indexOf(KVELTE_OUTPUT_CSS) == -1) throw KvelteException("rollup.config.js does not contains $KVELTE_OUTPUT_CSS")
        if (text.indexOf(KVELTE_GENERATE) == -1) throw KvelteException("rollup.config.js does not contains $KVELTE_GENERATE")
        if (text.indexOf(KVELTE_HYDRATABLE) == -1) throw KvelteException("rollup.config.js does not contains $KVELTE_HYDRATABLE")
        if (text.indexOf(KVELTE_PRODUCTION) == -1) throw KvelteException("rollup.config.js does not contains $KVELTE_PRODUCTION")

        return text
    }

    private fun getOutputFolder(): File {
        return Files.createTempDirectory(outputBaseDir, "").toFile().also { it.deleteOnExit() }
    }
}

private object VirtualFileBuilder {
    fun build(svelteRootFilePath: String, dom: Boolean): String {
        if (dom) {
            return """`
            import App from '${svelteRootFilePath}';
            const app = new App({
              target: document.body,
              props: __KVELTE_PROPS__,
              hydrate: true
            });
            export default app;
        `""".trimIndent()
        }
        return """`
            import App from '${svelteRootFilePath}';
            console.log(App.render().html);
        `""".trimIndent()
    }
}