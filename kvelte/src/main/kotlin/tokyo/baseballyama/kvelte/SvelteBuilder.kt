package tokyo.baseballyama.kvelte

import java.io.File

internal object SvelteBuilder {
    fun build(svelteProjectDir: File, outputDir: File): SvelteFilePaths {
        Command.execute("npm", "run", "build", "--prefix", svelteProjectDir.absolutePath)
        return SvelteFilePaths(
            outDir = outputDir,
            js = outputDir.resolve(RollupConfigFileWriter.OUTPUT_FILE_NAME_JS),
            jsSourceMap = outputDir.resolve(RollupConfigFileWriter.OUTPUT_FILE_NAME_JS_SOURCE_MAP),
            css = outputDir.resolve(RollupConfigFileWriter.OUTPUT_FILE_NAME_CSS)
        )
    }
}

internal data class SvelteFilePaths(
    val outDir: File,
    val js: File,
    val jsSourceMap: File,
    val css: File,
)