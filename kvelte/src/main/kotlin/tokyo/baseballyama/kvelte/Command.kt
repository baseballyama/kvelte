package tokyo.baseballyama.kvelte

import java.io.BufferedReader
import java.io.InputStream
import java.io.InputStreamReader
import java.util.function.Consumer

internal object Command {
    fun execute(vararg commands: String): CommandResult {
        val process = Runtime.getRuntime().exec(commands)
        return CommandResult(
            read(process.inputStream) { },
            read(process.errorStream) { },
            process.waitFor().toString()
        )
    }

    private fun read(input: InputStream, callback: Consumer<String>): String {
        val sb = StringBuilder()
        BufferedReader(InputStreamReader(input)).use {
            it.lines().map { line ->
                sb.append(line)
                sb.append(System.lineSeparator())
                line
            }.forEach(callback)
        }
        return sb.toString()
    }
}

internal data class CommandResult(val stdout: String, val stderr: String, val status: String)