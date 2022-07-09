<script lang="ts">
  import Layout from "../lib/layout/Layout.svelte";
</script>

<svelte:head>
  <title>Kvelte - 404</title>
</svelte:head>

<Layout>
  <section>
    <h1>Oops! Page Not Found</h1>
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
