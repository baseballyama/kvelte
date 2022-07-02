<script lang="ts">
  import Child from "../lib/Child.svelte";
  import { onMount } from "svelte";
  import { isString } from "lodash";
  let count = 0;
  export let message: string;

  function incrementCount() {
    count += 1;
  }
</script>

<svelte:head>
  <title>This is svelte!</title>
</svelte:head>
<p>This is Kvelte! {message}</p>

<button on:click="{incrementCount}">
  Clicked {count}
  {count === 1 ? "time" : "times"}
</button>
<img src="/assets/svelte.png" alt="Svelte logo" />
<Child />
<div>message is {isString(message)}</div>

<style>
  p {
    color: purple;
    font-family: "Comic Sans MS", cursive;
    font-size: 2em;
  }
</style>
