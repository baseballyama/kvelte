package tokyo.baseballyama.ksveltor

import io.ktor.application.*
import io.ktor.http.*
import io.ktor.response.*
import io.ktor.routing.*
import io.ktor.server.engine.*
import io.ktor.server.netty.*
import tokyo.baseballyama.kvelte.Kvelte


fun main() {
    Kvelte.setSvelteProjectDir("/Users/baseballyama/Desktop/git/ksveltor/examples/ktor/svelte")

    var i = 0
    embeddedServer(Netty, port = 80) {
        routing {
            get("/") {
                i += 1
                call.respondText(
                    Kvelte.load(
                        lang = "ja",
                        title = "これはタイトル!!",
                        rootSvelteFilePath = "./src/App.svelte",
                        props = mapOf("name" to "baseballyama-${i}")
                    ),
                    ContentType.Text.Html
                )
            }
        }
    }.start(wait = true)
}