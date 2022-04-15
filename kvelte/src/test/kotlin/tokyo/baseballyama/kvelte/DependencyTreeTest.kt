package tokyo.baseballyama.kvelte

import org.junit.jupiter.api.Test
import java.nio.file.Path
import kotlin.io.path.toPath

internal class DependencyTreeTest {

    @Test
    fun getDependencies() {
        val file = javaClass.classLoader.getResource("js-imports.js")?.toURI()?.toPath()
        val a = DependencyTree(Path.of("./src/test/kotlin"))
        a.addFile(file!!)
    }
}