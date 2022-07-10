package tokyo.baseballyama.kvelte.demo.routes

import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import tokyo.baseballyama.kvelte.demo.kvelte

private fun Route.get() {
    get("/about") {
        call.respondText(kvelte.loadPage("about.svelte"), ContentType.Text.Html)
    }
}

fun Application.aboutRoutes() {
    routing {
        get()
    }
}