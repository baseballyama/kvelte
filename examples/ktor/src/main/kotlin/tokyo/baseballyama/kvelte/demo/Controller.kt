package tokyo.baseballyama.kvelte.demo

import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.engine.*
import io.ktor.server.http.content.*
import io.ktor.server.netty.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import tokyo.baseballyama.kvelte.Kvelte
import tokyo.baseballyama.kvelte.KvelteConfig

val kvelte = Kvelte.create(KvelteConfig(Main::class))

class Main

fun main() {
    var count = 0
    embeddedServer(Netty, port = 80) {
        routing {
            get("/") {
                count += 1
                call.respondText(
                    kvelte.loadPage("index.svelte", mapOf("message" to "Hi Kvelte ${count}!")),
                    ContentType.Text.Html
                )
            }
            static("assets") {
                files("assets")
            }
            get(".kvelte/{...}") {
                call.response.header("Cache-Control", "public, max-age=86400")
                call.respondBytes(
                    kvelte.loadJavaScript(call.request.path()),
                    ContentType.Text.JavaScript,
                )
            }
        }
    }.start(wait = true)
}