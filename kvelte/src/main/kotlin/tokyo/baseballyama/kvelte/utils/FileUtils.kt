package tokyo.baseballyama.kvelte.utils

import java.nio.file.FileVisitResult
import java.nio.file.Files
import java.nio.file.Path
import java.nio.file.SimpleFileVisitor
import java.nio.file.attribute.BasicFileAttributes
import kotlin.io.path.name


object FileUtils {
    fun getDirectorySize(path: Path): Long {
        Files.walk(path).use { walk ->
            return walk.filter { path: Path ->
                Files.isRegularFile(path)
            }.mapToLong { p: Path ->
                return@mapToLong Files.size(p)
            }.sum()
        }
    }

    fun findFiles(baseDir: Path, excludeFolderPattern: Regex, includeFilePattern: Regex): List<Path> {
        val paths = mutableListOf<Path>()
        Files.walkFileTree(baseDir, object : SimpleFileVisitor<Path>() {
            override fun preVisitDirectory(dir: Path, attrs: BasicFileAttributes): FileVisitResult {
                return if (dir.name.matches(excludeFolderPattern)) FileVisitResult.SKIP_SUBTREE
                else FileVisitResult.CONTINUE
            }

            override fun visitFile(file: Path, attrs: BasicFileAttributes): FileVisitResult {
                if (file.fileName.name.matches(includeFilePattern)) paths.add(file)
                return FileVisitResult.CONTINUE
            }
        })
        return paths
    }
}