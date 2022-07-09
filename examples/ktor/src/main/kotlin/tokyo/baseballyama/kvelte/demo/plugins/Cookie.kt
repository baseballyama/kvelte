package tokyo.baseballyama.kvelte.demo.plugins

import io.ktor.server.application.*
import io.ktor.server.sessions.*
import tokyo.baseballyama.kvelte.demo.UserID

private val charPool: List<Char> = ('a'..'z') + ('A'..'Z') + ('0'..'9')

private fun createUserId(): UserID {
    val str = (1..10)
        .map { kotlin.random.Random.nextInt(0, charPool.size) }
        .map(charPool::get)
        .joinToString("")
    return UserID(str)
}

data class UserSession(val id: UserID)

object CookiePlugin {
    const val keyUserId = "kvelteUserId"

    val plugin = createApplicationPlugin(name = "KvelteCookiePlugin") {
        onCall { call ->
            if (call.sessions.get(keyUserId) == null) {
                call.sessions.set(keyUserId, UserSession(createUserId()))
            }
        }
    }
}