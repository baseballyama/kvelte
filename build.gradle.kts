/*
 * This file was generated by the Gradle 'init' task.
 *
 * This is a general purpose Gradle build.
 * Learn more about Gradle by exploring our samples at https://docs.gradle.org/7.4.1/samples
 */
import java.util.Scanner

// ----------------------------------------------------------------------
// heroku config:set GRADLE_TASK="build"

// heroku buildpacks:add --index 1 heroku-community/apt
// heroku run bash

// ----------------------------------------------------------------------
plugins {
    id("application")
}

tasks.named("build") {
    doFirst {
       // command("", listOf("node", "--version"))
        // command("", listOf("npm", "--version"))

        // curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash
        command("./kvelte-node", listOf("npm", "run", "build"))
        command("./kvelte-node", listOf("npm", "link", "kvelte-node"))
        command("./kvelte", listOf("./gradlew", "build"))
        command("./examples/ktor/src/main/resources/kvelte", listOf("npm", "i"))
        command("./examples/ktor/src/main/resources/kvelte", listOf("npm", "link", "kvelte-node"))
        command("./examples/ktor", listOf("./gradlew", "build"))
    }
}

fun command(pwd: String, cmd: List<String>) {
    println("START:" + cmd.joinToString(" "))
    val pb = ProcessBuilder(*cmd.toTypedArray())
    val kvelteDir = File(projectDir, pwd)
    println(kvelteDir.absolutePath)
    pb.directory(kvelteDir)
    val p = pb.start()
    printViteOutput(p.inputStream, ::println)
    printViteOutput(p.errorStream, ::println)
    p.waitFor()
    p.destroy()
    println("END:" + cmd.joinToString(" "))
}

fun printViteOutput(inputStream: java.io.InputStream, func: (String) -> Unit) {
    Thread {
        val sc = Scanner(inputStream)
        while (sc.hasNextLine()) {
            val str = sc.nextLine()
            func(str)
        }
    }.start()
}