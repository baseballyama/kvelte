package tokyo.baseballyama.kvelte

import org.slf4j.LoggerFactory
import java.io.InputStream
import java.util.*
import kotlin.system.exitProcess

internal object Vite {
    private val logger = LoggerFactory.getLogger(this::class.java)
    fun printViteOutput(inputStream: InputStream, func: (String) -> Unit) {
        Thread {
            val sc = Scanner(inputStream)
            while (sc.hasNextLine()) {
                val str = sc.nextLine()
                func(str)
                if (str.indexOf("Port 3000 is already in use") != -1) {
                    logger.error("Port 3000 is already in use. Please close the application that is using port 3000.")
                    exitProcess(1)
                }
            }
        }.start()
    }
}