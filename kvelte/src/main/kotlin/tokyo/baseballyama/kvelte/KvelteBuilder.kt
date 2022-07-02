package tokyo.baseballyama.kvelte

import java.io.File

object KvelteBuilder {
    fun build(projectDir: File) {
        val pb = ProcessBuilder("npm", "run", "build")
        val kvelteDir = File(projectDir, "src/main/resources/kvelte")
        println(kvelteDir.absolutePath)
        pb.directory(kvelteDir)
        val p = pb.start()
        Vite.printViteOutput(p.inputStream, ::println)
        Vite.printViteOutput(p.errorStream, ::println)
        p.waitFor()
        p.destroy()
    }
}