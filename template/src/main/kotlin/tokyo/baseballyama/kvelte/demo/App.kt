package tokyo.baseballyama.kvelte.demo

import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.engine.*
import io.ktor.server.http.content.*
import io.ktor.server.netty.*
import io.ktor.server.plugins.statuspages.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import tokyo.baseballyama.kvelte.Kvelte
import tokyo.baseballyama.kvelte.KvelteConfig
import tokyo.baseballyama.kvelte.demo.routes.aboutRoutes
import tokyo.baseballyama.kvelte.demo.routes.indexRoutes

val kvelte = Kvelte.create(KvelteConfig(Main::class))

class Main

fun main() {
    embeddedServer(Netty, port = 80) {
        install(StatusPages) {
            status(HttpStatusCode.NotFound) { call, status ->
                call.respondText(
                    kvelte.loadPage("404.svelte"),
                    ContentType.Text.Html,
                    status = status
                )
            }
        }

        indexRoutes()
        aboutRoutes()

        routing {
            static("assets") { resources("assets") }
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