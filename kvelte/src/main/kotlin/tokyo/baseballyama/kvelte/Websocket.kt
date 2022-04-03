package tokyo.baseballyama.kvelte


import io.ktor.application.*
import io.ktor.http.cio.websocket.*
import io.ktor.routing.*
import io.ktor.server.engine.*
import io.ktor.server.netty.*
import io.ktor.util.*
import io.ktor.websocket.*
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.channels.SendChannel
import kotlinx.coroutines.channels.consumeEach
import kotlinx.coroutines.launch
import java.nio.file.Path
import java.time.Duration

fun main() {
    val p1 = Path.of("aaa/./bbb").normalize()
    val p2 = Path.of("aaa/.bbb").normalize()
    println(p1)
    println(p2)

}

class Websocket(private val port: Int = java.net.ServerSocket(0).localPort) {

    val url = "ws://localhost:$port"

    // キー: パス, 値: Pair<ユニークID, SendChannel>
    private val outgoings = mutableMapOf<String, MutableList<Pair<String, SendChannel<Frame>>>>()

    init {
        embeddedServer(Netty, port = port) {
            install(WebSockets) {
                pingPeriod = Duration.ofSeconds(15)
                timeout = Duration.ofSeconds(15)
                maxFrameSize = Long.MAX_VALUE
                masking = false
            }
            routing {
                webSocket("/") {
                    val uniqueId = generateNonce()
                    incoming.consumeEach { frame ->
                        val path = if (frame is Frame.Text) frame.readText() else ""
                        this@Websocket.addOutgoing(uniqueId, path, outgoing)
                    }
                }
            }
        }.start(wait = false)
        println("HMR server started at port $port")
    }

    fun update(path: String, text: String) {
        println("paths: ${outgoings.keys}")
        outgoings[path]?.forEach { (_, outgoing) ->
            CoroutineScope(Dispatchers.IO).launch {
                outgoing.send(Frame.Text(text))
            }
        }
    }

    private fun addOutgoing(uniqueId: String, path: String, outgoing: SendChannel<Frame>) {
        for (key in outgoings.keys) {
            outgoings[key] = outgoings[key]!!.filter { it.first == uniqueId }.toMutableList()
        }
        if (!outgoings.containsKey(path)) outgoings[path] = mutableListOf()
        outgoings[path]!!.add(Pair(uniqueId, outgoing))
    }
}