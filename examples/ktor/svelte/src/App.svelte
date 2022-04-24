<script>
  export let count;
  let clientCount = 1;
</script>

<svelte:head>
  <title>Kvelte Demo</title>
  <html lang="ja">
</svelte:head>
<main>
  <h1>Kvelte Demo222</h1>
  <p>Server Request Count: {count}</p>
  <button on:click="{() => (clientCount += 1)}">Click Me!</button>
  <p>Clicked Count: {clientCount}</p> 
</main>

<style>
  main {
    text-align: center; 
    padding: 1em;
    margin: 0 auto;
  }

  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4em;
    font-weight: 100;
  }
</style>
