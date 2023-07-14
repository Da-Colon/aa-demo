<script lang="ts">
	import Container from '$lib/components/Container.svelte';
	import { web3 } from '$lib/stores/web3';
	import type { Web3Store } from '$lib/types';
	import { withAlchemyGasManager } from '@alchemy/aa-alchemy'
	let state: Web3Store;

	web3.subscribe((value) => {
		state = value;
	});

	// mint nft
	async function mintNFT() {
		// mint nft
		if(!state.signer || !state.provider || !state.alchemy) return console.log('no signer');
		// state.signer.withPaymasterMiddleware(
		// 	withAlchemyGasManager(state.signer, state.alchemy.config)
		// );
	}
	// mint nft with paymaster
	function mintNFTWithPaymaster() {
		// mint nft
	}
	// mint nft with gas sponsor
	function mintNFTWithGasSponsor() {
		// mint nft
	}
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
	<Container>
		<section>
			Mint NFT
			<button class="button-primary">Pay With Paymaster (USDC)</button>
		</section>
	</Container>
	<Container>
		<section>
			Mint NFT
			<button class="button-primary">Pay With Gas Sponsor</button>
		</section>
	</Container>
	<Container>Sign up for Subscriptions (tbd)</Container>
</section>

<style>
	section {
		display: flex;
		align-items: center;
		justify-content: space-around;
		flex-wrap: wrap;
		gap: 2.5rem;
		color: var(--color-white);
	}
</style>
