<script lang="ts">
  import Layout from "../lib/layout/Layout.svelte";
  import Counter from "../lib/Counter.svelte";
  export let message: string;
</script>

<svelte:head>
  <title>Kvelte - Home</title>
  <meta name="description" content="Top page of Kvelte" />
</svelte:head>

<Layout>
  <section>
    <h1>Welcome to the {message} App!</h1>
    <h2>
      try editing <strong>src/main/resources/kvelte/pages/index.svelte</strong>
    </h2>
    <Counter />
  </section>
</Layout>

<style>
  section {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex: 1;
  }

  h1 {
    font-size: 60px;
    color: var(--accent-color);
  }
</style>
