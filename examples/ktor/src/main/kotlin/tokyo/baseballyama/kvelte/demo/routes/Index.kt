package tokyo.baseballyama.kvelte.demo.routes

import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import tokyo.baseballyama.kvelte.demo.kvelte

private fun Route.get() {
    get("/") {
        call.respondText(kvelte.loadPage("index.svelte", mapOf("message" to "Kvelte")), ContentType.Text.Html)
    }
}

fun Application.indexRoutes() {
    routing {
        get()
    }
}