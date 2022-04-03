package tokyo.baseballyama.ksveltor

import io.ktor.application.*
import io.ktor.http.*
import io.ktor.response.*
import io.ktor.routing.*
import io.ktor.server.engine.*
import io.ktor.server.netty.*
import tokyo.baseballyama.kvelte.Kvelte
import tokyo.baseballyama.kvelte.KvelteConfig
import java.nio.file.Path


fun main() {
    val kvelte = Kvelte(KvelteConfig(
        svelteProjectDir = Path.of("/Users/baseballyama/Desktop/git/kvelte/examples/ktor/svelte"),
        production = false
    ))

    var i = 0
    embeddedServer(Netty, port = 80) {
        routing {
            get("/") {
                i += 1
                call.respondText(
                    kvelte.load(
                        rootSvelteFilePath = "./src/App.svelte",
                        props = mapOf("name" to "baseballyama-${i}", "names" to listOf("banana", "apple"))
                    ),
                    ContentType.Text.Html
                )
            }
        }
    }.start(wait = true)
}