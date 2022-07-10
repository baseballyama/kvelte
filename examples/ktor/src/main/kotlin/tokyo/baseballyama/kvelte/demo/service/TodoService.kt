package tokyo.baseballyama.kvelte.demo.service

import kotlinx.serialization.Serializable
import tokyo.baseballyama.kvelte.demo.UserID
import java.util.*
import kotlin.math.max

@Serializable
data class TodoModel(
    val id: Long,
    val createdAt: Long,
    val text: String,
    val done: Boolean
)

@Serializable
data class TodoCreateModel(
    val text: String
)

@Serializable
data class TodoUpdateModel(
    val text: String,
    val done: Boolean
)

private val todoMap: MutableMap<UserID, MutableList<TodoModel>> = mutableMapOf()

object TodoService {

    fun get(userID: UserID): List<TodoModel> {
        return todoMap.getOrDefault(userID, emptyList()).toList()
    }

    fun create(userID: UserID, model: TodoCreateModel): TodoModel {
        val todos = todoMap[userID] ?: mutableListOf()
        val newId = if (todos.isEmpty()) Date().time else max(Date().time, todos[todos.size - 1].id + 1)
        val newTodo = TodoModel(newId, Date().time, model.text, false)
        todos.add(newTodo)
        todoMap[userID] = todos.toMutableList()
        return newTodo
    }

    fun update(userID: UserID, id: Long, model: TodoUpdateModel) {
        val todos = todoMap[userID] ?: return
        val existTodoIndex = todos.indexOfFirst { it.id == id }
        if (existTodoIndex == -1) return
        val existTodo = todos[existTodoIndex]
        val newTodo = existTodo.copy(text = model.text, done = model.done)
        todos[existTodoIndex] = newTodo
    }

    fun delete(userID: UserID, todoID: Long) {
        val todos = todoMap[userID] ?: return
        todoMap[userID] = (todos.filter { it.id != todoID }).toMutableList()
    }

    fun clearAll() {
        todoMap.clear()
    }
}