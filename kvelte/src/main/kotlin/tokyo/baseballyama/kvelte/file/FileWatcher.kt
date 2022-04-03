package tokyo.baseballyama.kvelte.file

import com.sun.nio.file.SensitivityWatchEventModifier
import java.nio.file.*
import java.nio.file.StandardWatchEventKinds.*
import java.nio.file.attribute.BasicFileAttributes
import kotlin.io.path.name


internal class FileWatcher(private val dir: Path) : AutoCloseable {
    private val watcher: WatchService = dir.fileSystem.newWatchService()
    private val watchKeys = mutableMapOf<WatchKey, Path>()

    init {
        Files.walkFileTree(dir, object : SimpleFileVisitor<Path>() {
            override fun preVisitDirectory(dir: Path, attrs: BasicFileAttributes): FileVisitResult {
                println(dir.name)
                return if (dir.name == "node_modules" || dir.name == "build" || dir.name == "public") {
                    FileVisitResult.SKIP_SUBTREE
                } else {
                    watchKeys[dir.register(
                        watcher,
                        listOf(
                            ENTRY_CREATE,
                            ENTRY_DELETE,
                            ENTRY_MODIFY
                        ).toTypedArray(),
                        SensitivityWatchEventModifier.HIGH
                    )] = dir
                    FileVisitResult.CONTINUE
                }
            }
        })
    }

    fun watch(listener: (Path) -> Unit) {
        watcher.take().run {
            watchKeys.forEach { (watchKey, path) ->
                watchKey.pollEvents().forEach {
                    println("path: ${path}")
                    println("it.context(): ${it.context()}")
                    listener(path.resolve(it.context().toString()))
                }
                watchKey.reset()
            }
        }
    }

    override fun close() = watcher.close()
}