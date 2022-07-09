package tokyo.baseballyama.kvelte.demo.routes

import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import io.ktor.server.sessions.*
import tokyo.baseballyama.kvelte.demo.kvelte
import tokyo.baseballyama.kvelte.demo.plugins.UserSession
import tokyo.baseballyama.kvelte.demo.service.TodoCreateModel
import tokyo.baseballyama.kvelte.demo.service.TodoService
import tokyo.baseballyama.kvelte.demo.service.TodoUpdateModel

private fun Route.get() {
    get("/todos") {
        val userSession = call.sessions.get<UserSession>()
        val todos = if (userSession == null) emptyList() else TodoService.get(userSession.id)
        call.respondText(kvelte.loadPage("todos.svelte", mapOf("todos" to todos)), ContentType.Text.Html)
    }
}

private fun Route.post() {
    this.post("/api/todos") {
        val userSession = call.sessions.get<UserSession>() ?: throw Exception("missing user session")
        val postData = call.receive<TodoCreateModel>()
        val todo = TodoService.create(userSession.id, postData)
        call.request.call.respond(HttpStatusCode.Created, todo)
    }
}

private fun Route.put() {
    this.put("/api/todos/{id}") {
        val userSession = call.sessions.get<UserSession>() ?: throw Exception("missing user session")
        val id = call.parameters["id"]?.toIntOrNull() ?: throw Exception("missing id")
        val postData = call.receive<TodoUpdateModel>()
        val todo = TodoService.update(userSession.id, id, postData)
        call.request.call.respond(HttpStatusCode.OK, todo)
    }
}

private fun Route.delete() {
    this.delete("/api/todos/{id}") {
        val userSession = call.sessions.get<UserSession>() ?: throw Exception("missing user session")
        val id = call.parameters["id"]?.toIntOrNull() ?: throw Exception("missing id")
        TodoService.delete(userSession.id, id)
        call.request.call.respond(HttpStatusCode.NoContent)
    }
}

fun Application.todoRoutes() {
    routing {
        get()
        post()
        put()
        delete()
    }
}