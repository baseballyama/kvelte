package tokyo.baseballyama.kvelte.file

import java.nio.file.Files
import java.nio.file.Path


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
}