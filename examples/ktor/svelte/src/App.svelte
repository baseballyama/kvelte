<script>
	export let name;
	let count = 0;
	export let names = [];
</script>

<svelte:head>
	<title>これはタイトルだよ</title>
</svelte:head>
<main>
		{#each names as name }
	<p>お名前です</p>		
	<div>{name}</div>
	{/each}
	<h1>Hello {name}!</h1>
	<p>Visit the <a href="https://svelte.dev/tutorial">Svelte tutorial</a> to learn how to build Svelte apps.</p>
	<div on:click="{() => count += 1}">count: {count}</div>


</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>