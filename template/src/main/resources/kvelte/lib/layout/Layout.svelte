<script lang="ts">
  import Header from "./Header.svelte";
</script>

<svelte:head>
  <link rel="stylesheet" href="/assets/app.css" />
</svelte:head>
<Header />

<main>
  <slot />
</main>

<footer>
  <p>
    visit <a
      href="https://github.com/baseballyama/kvelte"
      target="_blank"
      rel="noopener noreferrer"
    >
      GitHub
    </a>
    to learn Kvelte
  </p>
</footer>

<style>
  main {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 1rem;
    width: 100%;
    max-width: 1024px;
    margin: 0 auto;
    box-sizing: border-box;
  }

  footer {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 40px;
  }

  footer a {
    font-weight: bold;
  }

  @media (min-width: 480px) {
    footer {
      padding: 40px 0;
    }
  }
</style>
