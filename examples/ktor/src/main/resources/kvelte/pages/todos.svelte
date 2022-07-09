<script lang="ts">
  import Layout from "../lib/layout/Layout.svelte";
  import { scale } from "svelte/transition";
  import { flip } from "svelte/animate";
  import type { Todo } from "../lib/todos/api";
  import {
    createTodo,
    updateTodo,
    deleteTodo as deleteTodoApi,
  } from "../lib/todos/api";

  export let todos: Todo[];

  let newTodoText: string;

  async function create(event: KeyboardEvent) {
    if (event.key !== "Enter" || event.isComposing) return;
    const created = await createTodo(newTodoText);
    todos = [...todos, created];
    newTodoText = "";
  }

  async function onClickTextInput(event: KeyboardEvent, todo: Todo) {
    if (event.key !== "Enter" || event.isComposing) return;
    await updateText(todo);
  }

  async function updateText(todo: Todo) {
    todos = todos.map((t) =>
      t.id === todo.id ? { ...t, text: todo.text } : t
    );
    await updateTodo(todo.id, { text: todo.text, done: todo.done });
  }

  async function toggleDone(todo: Todo) {
    todos = todos.map((t) => (t.id === todo.id ? { ...t, done: !t.done } : t));
    await updateTodo(todo.id, { text: todo.text, done: !todo.done });
  }

  async function deleteTodo(todo: Todo) {
    todos = todos.filter((t) => t.id !== todo.id);
    await deleteTodoApi(todo.id);
  }
</script>

<svelte:head>
  <title>Kvelte - Todos</title>
  <meta name="description" content="A todo list app" />
</svelte:head>

<Layout>
  <div class="todos">
    <h1>Todos</h1>

    <section class="new">
      <input
        name="text"
        aria-label="Add todo"
        placeholder="+ tap to add a todo"
        bind:value="{newTodoText}"
        on:keypress="{create}"
      />
    </section>

    {#each todos as todo (todo.id)}
      <div
        class="todo"
        class:done="{todo.done}"
        transition:scale|local="{{ start: 0.7 }}"
        animate:flip="{{ duration: 200 }}"
      >
        <button
          class="toggle"
          aria-label="Mark todo as {todo.done ? 'not done' : 'done'}"
          on:click="{() => toggleDone(todo)}"></button>

        <section class="text">
          <input
            aria-label="Edit todo"
            type="text"
            name="text"
            bind:value="{todo.text}"
            on:keypress="{(e) => onClickTextInput(e, todo)}"
          />

          <button
            class="save"
            aria-label="Save todo"
            on:click="{() => updateText(todo)}"></button>
        </section>

        <section>
          <input type="hidden" name="id" value="{todo.id}" />
          <button
            class="delete"
            aria-label="Delete todo"
            on:click="{() => deleteTodo(todo)}"></button>
        </section>
      </div>
    {/each}
  </div>
</Layout>

<style>
  .todos {
    width: 100%;
    max-width: var(--column-width);
    margin: var(--column-margin-top) auto 0 auto;
    line-height: 1;
  }

  .new {
    margin: 0 0 0.5rem 0;
  }

  input {
    border: 1px solid transparent;
  }

  input:focus-visible {
    box-shadow: inset 1px 1px 6px rgba(0, 0, 0, 0.1);
    border: 1px solid #ff3e00 !important;
    outline: none;
  }

  .new input {
    font-size: 28px;
    width: 100%;
    padding: 0.5em 1em 0.3em 1em;
    box-sizing: border-box;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 8px;
    text-align: center;
  }

  .text {
    position: relative;
    display: flex;
    align-items: center;
    flex: 1;
  }

  .todo {
    display: grid;
    grid-template-columns: 2rem 1fr 2rem;
    grid-gap: 0.5rem;
    align-items: center;
    margin: 0 0 0.5rem 0;
    padding: 0.5rem;
    background-color: white;
    border-radius: 8px;
    filter: drop-shadow(2px 4px 6px rgba(0, 0, 0, 0.1));
    transform: translate(-1px, -1px);
    transition: filter 0.2s, transform 0.2s;
  }

  .done {
    transform: none;
    opacity: 0.4;
    filter: drop-shadow(0 0 1px rgba(0, 0, 0, 0.1));
  }

  .todo input {
    flex: 1;
    padding: 0.5em 2em 0.5em 0.8em;
    border-radius: 3px;
  }

  .todo button {
    width: 2em;
    height: 2em;
    border: none;
    background-color: transparent;
    background-position: 50% 50%;
    background-repeat: no-repeat;
  }

  button.toggle {
    border: 1px solid rgba(0, 0, 0, 0.2);
    border-radius: 50%;
    box-sizing: border-box;
    background-size: 1em auto;
  }

  .done .toggle {
    background-image: url("data:image/svg+xml,%3Csvg width='22' height='16' viewBox='0 0 22 16' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20.5 1.5L7.4375 14.5L1.5 8.5909' stroke='%23676778' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  }

  .delete {
    background-image: url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M4.5 5V22H19.5V5H4.5Z' fill='%23676778' stroke='%23676778' stroke-width='1.5' stroke-linejoin='round'/%3E%3Cpath d='M10 10V16.5' stroke='white' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cpath d='M14 10V16.5' stroke='white' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cpath d='M2 5H22' stroke='%23676778' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cpath d='M8 5L9.6445 2H14.3885L16 5H8Z' fill='%23676778' stroke='%23676778' stroke-width='1.5' stroke-linejoin='round'/%3E%3C/svg%3E%0A");
    opacity: 0.2;
  }

  .delete:hover,
  .delete:focus {
    transition: opacity 0.2s;
    opacity: 1;
  }

  .save {
    position: absolute;
    right: 0;
    opacity: 0;
    background-image: url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20.5 2H3.5C2.67158 2 2 2.67157 2 3.5V20.5C2 21.3284 2.67158 22 3.5 22H20.5C21.3284 22 22 21.3284 22 20.5V3.5C22 2.67157 21.3284 2 20.5 2Z' fill='%23676778' stroke='%23676778' stroke-width='1.5' stroke-linejoin='round'/%3E%3Cpath d='M17 2V11H7.5V2H17Z' fill='white' stroke='white' stroke-width='1.5' stroke-linejoin='round'/%3E%3Cpath d='M13.5 5.5V7.5' stroke='%23676778' stroke-width='1.5' stroke-linecap='round'/%3E%3Cpath d='M5.99844 2H18.4992' stroke='%23676778' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E%0A");
  }

  .todo input:focus + .save,
  .save:focus {
    transition: opacity 0.2s;
    opacity: 1;
  }

  button:hover {
    cursor: pointer;
  }
</style>
