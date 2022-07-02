<script>
	let count = 0;

	function incrementCount() {
		count += 1;
	}
</script>

<p>This is Kvelte!</p>

<button on:click={incrementCount}>
	Clicked {count} {count === 1 ? 'time' : 'times'}
</button>

<style>
	p {
		color: purple;
		font-family: 'Comic Sans MS', cursive;
		font-size: 2em;
	}
</style>