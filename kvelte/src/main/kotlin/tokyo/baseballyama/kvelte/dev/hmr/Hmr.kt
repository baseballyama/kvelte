package tokyo.baseballyama.kvelte.dev.hmr

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import tokyo.baseballyama.kvelte.Constants
import tokyo.baseballyama.kvelte.RollupConfigFileWriter
import tokyo.baseballyama.kvelte.SvelteBuilder
import tokyo.baseballyama.kvelte.SvelteCache
import java.nio.file.Path
import kotlin.io.path.relativeTo

internal class Hmr(
    svelteProjectDir: Path,
    rollupConfigFileWriter: RollupConfigFileWriter,
    getDependencies: (dependencies: Map<String, Set<String>>) -> Unit,
    onUpdate: (cache: SvelteCache) -> Unit
) : AutoCloseable {
    private val websocket = Websocket()
    private val objectMapper = jacksonObjectMapper()
    private var stopped = false
    val websocketUrl = websocket.url

    init {
        CoroutineScope(Dispatchers.IO).launch {
            FileWatcher(svelteProjectDir).use { watcher ->
                while (true) {
                    if (this@Hmr.stopped) break
                    watcher.watch { path ->
                        if (path.toString().endsWith(".svelte")) {
                            val relativePath = path.toAbsolutePath().relativeTo(svelteProjectDir)
                            val domOutDir = rollupConfigFileWriter.write(relativePath.toString(), true)
                            val dom = SvelteBuilder.build(svelteProjectDir, domOutDir)
                            rollupConfigFileWriter.restore()
                            val js = dom.js.readText()
                            val css = if (dom.css.exists()) dom.css.readText() else ""
                            val map = mapOf(
                                "css" to css,
                                "js" to js.replace(Constants.KVELTE_PROPS, Constants.KVELTE_WEBHOOK_PROPS)
                            )
                            this@Hmr.websocket.update(path.toString(), objectMapper.writeValueAsString(map))
                        }
                    }
                }
            }
        }
    }

    override fun close() {
        this.stopped = true
    }
}