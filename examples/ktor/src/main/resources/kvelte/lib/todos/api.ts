import axios from "axios";

export type Todo = {
  id: string;
  createdAt: Date;
  text: string;
  done: boolean;
  pendingDelete: boolean;
};

export type TodoUpdate = {
  text: Todo["id"];
  done: Todo["done"];
};

export async function createTodo(text: String): Promise<Todo> {
  const res = await axios({
    method: "POST",
    url: "/api/todos",
    headers: {
      'Content-Type': 'application/json'
    },
    data: {
      text
    }
  });
  return res.data;
}

export async function updateTodo(id: Todo["id"], todo: TodoUpdate): Promise<void> {
  await axios({
    method: "PUT",
    url: `/api/todos/${id}`,
    headers: {
      'Content-Type': 'application/json'
    },
    data: {
      ...todo
    }
  });
}

export async function deleteTodo(id: Todo["id"]): Promise<void> {
  await axios({
    method: "DELETE",
    url: `/api/todos/${id}`,
  });
}