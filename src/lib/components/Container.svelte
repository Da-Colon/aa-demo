<script>
</script>

<section class="container">
	<slot />
</section>

<style>
	section.container {
		padding: 1rem;
		width: 275px;
		max-height: 250px;
		background-image: var(--color-black);
		box-shadow: 0px 4px 6px var(--color-green-900-faded), 0px 8px 12px var(--color-green-900-faded),
			0px 12px 18px var(--color-green-900-faded);
		border-radius: 4px;
		border: 1px solid var(--color-green-900-faded);
		text-align: center;
	}
</style>
