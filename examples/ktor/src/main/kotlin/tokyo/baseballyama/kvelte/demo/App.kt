package tokyo.baseballyama.kvelte.demo

import io.ktor.http.*
import io.ktor.serialization.kotlinx.json.*
import io.ktor.server.application.*
import io.ktor.server.engine.*
import io.ktor.server.http.content.*
import io.ktor.server.netty.*
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.server.plugins.doublereceive.*
import io.ktor.server.plugins.statuspages.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import io.ktor.server.sessions.*
import io.ktor.util.*
import tokyo.baseballyama.kvelte.Kvelte
import tokyo.baseballyama.kvelte.KvelteConfig
import tokyo.baseballyama.kvelte.demo.plugins.CookiePlugin
import tokyo.baseballyama.kvelte.demo.plugins.UserSession
import tokyo.baseballyama.kvelte.demo.routes.aboutRoutes
import tokyo.baseballyama.kvelte.demo.routes.indexRoutes
import tokyo.baseballyama.kvelte.demo.routes.todoRoutes
import kotlin.time.Duration

val kvelte = Kvelte.create(KvelteConfig(Main::class))

class Main

fun main() {
    embeddedServer(Netty, port = 8080) {
        install(DoubleReceive)
        install(ContentNegotiation) {
            json()
        }
        install(StatusPages) {
            status(HttpStatusCode.NotFound) { call, status ->
                call.respondText(
                    kvelte.loadPage("404.svelte"),
                    ContentType.Text.Html,
                    status = status
                )
            }
        }

        install(Sessions) {
            val secretEncryptKey = hex("00112233445566778899aabbccddeeff")
            val secretSignKey = hex("6819b57a326945c1968f45236589")
            cookie<UserSession>(CookiePlugin.keyUserId) {
                cookie.path = "/"
                cookie.maxAge = Duration.INFINITE
                // cookie.secure = true
                transform(SessionTransportTransformerEncrypt(secretEncryptKey, secretSignKey))
            }
        }

        install(CookiePlugin.plugin)

        indexRoutes()
        aboutRoutes()
        todoRoutes()

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