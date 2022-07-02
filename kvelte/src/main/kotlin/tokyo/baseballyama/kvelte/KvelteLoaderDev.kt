package tokyo.baseballyama.kvelte

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.delay
import kotlinx.coroutines.runBlocking
import kotlinx.coroutines.withContext
import org.slf4j.LoggerFactory
import java.io.BufferedReader
import java.io.File
import java.net.ConnectException
import java.net.HttpURLConnection
import java.net.URL
import java.net.URLEncoder

internal class KvelteLoaderDev(config: KvelteConfig) : KvelteLoader(config) {
    private val logger = LoggerFactory.getLogger(this::class.java)

    init {
        val pb = ProcessBuilder("npm", "run", "dev")
        pb.directory(File("./src/main/resources/kvelte"))
        val p = pb.start()
        Vite.printViteOutput(p.inputStream, logger::info)
        Vite.printViteOutput(p.errorStream, logger::error)
        val url = URL("http://localhost:3000")
        runBlocking {
            withContext(Dispatchers.IO) {
                do {
                    val connection = url.openConnection() as HttpURLConnection
                    try {
                        connection.responseCode
                        break
                    } catch (e: ConnectException) {
                        logger.debug("Vite server is not started")
                    } finally {
                        connection.disconnect()
                    }
                    delay(100)
                } while (true)
            }
        }
    }

    override fun loadPage(src: String, props: Map<String, *>): String {
        val propsStr = mapper.writeValueAsString(props)
        val url =
            URL("http://localhost:3000/pages/${src.removePrefix("/")}?props=${URLEncoder.encode(propsStr, "UTF-8")}")
        val connection = url.openConnection() as HttpURLConnection
        try {
            val statusCode = connection.responseCode
            if (statusCode == HttpURLConnection.HTTP_OK) {
                return connection.inputStream.bufferedReader().use(BufferedReader::readText)
            }
        } catch (e: Exception) {
            e.printStackTrace()
        } finally {
            connection.disconnect()
        }
        return ""
    }

    override fun loadJavaScript(path: String): String {
        return ""
    }
}