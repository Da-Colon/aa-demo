<script>
	import Web3Connect from "$lib/components/Web3Connect.svelte";

	let logoText = 'Mako Wallet';
</script>

<header>
	<div class="logo" data-text={logoText}>
		{logoText}
	</div>
	<Web3Connect />
</header>

<style>
	@keyframes flame {
		0% {
			background-position: 0% 50%;
		}
		50% {
			background-position: 100% 50%;
		}
		100% {
			background-position: 0% 50%;
		}
	}

	header {
		display: flex;
		justify-content: space-between;
		padding: 20px;
	}

	.logo {
		border-radius: 10px;
		color: var(--color-white);
		font-size: 4rem;
		font-family: 'Lakki Reddy', sans-serif;
		letter-spacing: 0.5rem;
		overflow: hidden;
		position: relative;
		text-align: center;
		text-shadow: 0px 1px 10px var(--color-wallet-green);
	}

	.logo::after {
		content: attr(data-text);
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		color: transparent;
		background: linear-gradient(
			90deg,
			var(--color-wallet-green),
			var(--color-wallet-green-dark),
			var(--color-wallet-green)
		);
		background-size: 200% 200%;
		-webkit-background-clip: text;
		background-clip: text;
		animation: flame 2s linear infinite;
	}
</style>
