package tokyo.baseballyama.kvelte

import java.io.BufferedReader
import java.io.FileReader
import java.nio.file.FileVisitResult
import java.nio.file.Files
import java.nio.file.Path
import java.nio.file.SimpleFileVisitor
import java.nio.file.attribute.BasicFileAttributes
import kotlin.io.path.name


private data class DependencyFile(
    val absolutePath: Path,
    val usedBy: List<Path>
)

class DependencyTree(private val basePath: Path) {
    // key: file path, value: file paths where the key's file is used
    private val dependencyFiles = mutableMapOf<Path, List<Path>>()

    init {
        Files.walkFileTree(basePath, object : SimpleFileVisitor<Path>() {
            override fun preVisitDirectory(dir: Path, attrs: BasicFileAttributes): FileVisitResult {
                println(dir.name)
                return if (dir.name == "node_modules" || dir.name == "build" || dir.name == "public") {
                    FileVisitResult.SKIP_SUBTREE
                } else {

                    FileVisitResult.CONTINUE
                }
            }
        })
    }

    fun addFile(path: Path) {
        getDependencies(path)
    }

    fun updateFile(path: Path) {
        TODO()
    }

    fun deleteFile(path: Path) {
        TODO()
    }

    private fun getDependencies(path: Path) {
        BufferedReader(FileReader(path.toFile())).use { br ->
            var isImportStatement = false
            var str = br.readLine()
            while (str != null) {
                println(str)
                if (str.trim().startsWith("import")) {
                    isImportStatement = true
                }
                str = br.readLine()
            }
        }
    }
}