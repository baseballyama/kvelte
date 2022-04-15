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

    var count = 0
    embeddedServer(Netty, port = 80) {
        routing {
            get("/") {
                count += 1
                call.respondText(
                    kvelte.load(
                        pRootSvelteFilePath = "./src/App.svelte",
                        props = mapOf("count" to count)
                    ),
                    ContentType.Text.Html
                )
            }
        }
    }.start(wait = true)
}