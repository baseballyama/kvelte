package tokyo.baseballyama.kvelte.demo.service

import org.junit.jupiter.api.Assertions
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import tokyo.baseballyama.kvelte.demo.UserID

internal class TodoServiceTest {

    @BeforeEach
    fun beforeEach() {
        TodoService.clearAll()
    }

    @Test
    fun `basic create and get`() {
        val userId = UserID("1")
        val text = "todo1"
        TodoService.create(userId, TodoCreateModel(text))
        val todos = TodoService.get(userId)
        Assertions.assertEquals(1, todos.size)
        Assertions.assertEquals(text, todos[0].text)
        Assertions.assertEquals(false, todos[0].done)
    }

    @Test
    fun `multiple users`() {
        val userId1 = UserID("1")
        val userId2 = UserID("2")
        val text11 = "todo11"
        val text12 = "todo12"
        val text21 = "todo21"

        TodoService.create(userId1, TodoCreateModel(text11))
        TodoService.create(userId1, TodoCreateModel(text12))
        TodoService.create(userId2, TodoCreateModel(text21))

        val todos1 = TodoService.get(userId1)
        Assertions.assertEquals(2, todos1.size)
        Assertions.assertEquals(text11, todos1[0].text)
        Assertions.assertEquals(false, todos1[0].done)
        Assertions.assertEquals(text12, todos1[1].text)
        Assertions.assertEquals(false, todos1[1].done)

        val todos2 = TodoService.get(userId2)
        Assertions.assertEquals(text21, todos2[0].text)
        Assertions.assertEquals(false, todos2[0].done)
    }

    @Test
    fun update() {
        val userId = UserID("1")
        TodoService.create(userId, TodoCreateModel("todo1"))
        val todos1 = TodoService.get(userId)
        TodoService.update(userId, todos1[0].id, TodoUpdateModel(text = "updated", done = true))
        val todos2 = TodoService.get(userId)
        Assertions.assertEquals(1, todos2.size)
        Assertions.assertEquals("updated", todos2[0].text)
        Assertions.assertEquals(true, todos2[0].done)
    }

    @Test
    fun delete() {
        val userId = UserID("1")
        TodoService.create(userId, TodoCreateModel("todo1"))
        val todos1 = TodoService.get(userId)
        TodoService.delete(userId, todos1[0].id)
        val todos2 = TodoService.get(userId)
        Assertions.assertEquals(0, todos2.size)
    }

    @Test
    fun `always id should set bigger value`() {
        val userId = UserID("1")
        TodoService.create(userId, TodoCreateModel("todo1"))
        TodoService.create(userId, TodoCreateModel("todo2"))
        val todos1 = TodoService.get(userId)
        TodoService.delete(userId, todos1[0].id)
        TodoService.create(userId, TodoCreateModel("todo3"))
        val todos2 = TodoService.get(userId)
        Assertions.assertEquals(2, todos2.size)
        Assertions.assertEquals(true, todos2[0].id < todos2[1].id)
    }
}