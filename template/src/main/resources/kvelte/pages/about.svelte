<script lang="ts">
  import Layout from "../lib/layout/Layout.svelte";
</script>

<svelte:head>
  <title>Kvelte - About</title>
  <meta name="description" content="About Kvelte" />
</svelte:head>

<Layout>
  <section>
    <div class="content">
      <h1>About this app</h1>

      <p>
        This is a <a
          href="https://github.com/baseballyama/kvelte"
          target="_blank"
          rel="noopener noreferrer"
          >Kvelte
        </a>
        app. You can make your own by typing the following into your command line
        and following the prompts:
      </p>

      <pre>
<span>></span>npx degit baseballyama/kvelte/docs kvelte-app
<span>></span>cd kvelte-app
<span>></span>cd ./src/main/resources/kvelte && npm i && cd ../../../../
<span>></span>./gradlew run
</pre>

      <p>
        The page you're looking at is purely static HTML, with no client-side
        interactivity needed. Because of that, we don't need to load any
        JavaScript. Try reloading this page with JavaScript disabled!
      </p>
    </div>
  </section>
</Layout>

<style>
  .content {
    width: 100%;
    max-width: var(--column-width);
    margin: var(--column-margin-top) auto 0 auto;
  }

  span {
    margin-right: 8px;
    color: var(--accent-color);
  }
</style>
