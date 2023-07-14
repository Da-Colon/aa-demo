<script lang="ts">
	import Container from '$lib/components/Container.svelte';
	import { BASE_ENTRYPOINT_ADDRESS, web3 } from '$lib/stores/web3';
	import type { Web3Store } from '$lib/types';
	import { alchemyPaymasterAndDataMiddleware } from '@alchemy/aa-alchemy';
	let state: Web3Store;

	web3.subscribe((value) => {
		state = value;
	});

	// mint nft
	async function mintNFT() {
		// mint nft
	}
	// mint nft with paymaster
	function mintNFTWithERC20GasPayment() {
		if (!state.signer || !state.provider || !state.alchemy || !state.adapter)
			return console.log('no signer');
		const client = state.signer.getPublicErc4337Client();
		const withPaymaster = state.signer.withPaymasterMiddleware(
			alchemyPaymasterAndDataMiddleware({
				provider: client,
				policyId: '',
				entryPoint: BASE_ENTRYPOINT_ADDRESS
			})
		);
		// mint nft
	}
	
	// mint nft with gas sponsor
	function mintNFTWithGasSponsor() {
		if (!state.signer || !state.provider || !state.alchemy || !state.adapter)
			return console.log('no signer');
		const client = state.signer.getPublicErc4337Client();
		const withPaymaster = state.signer.withPaymasterMiddleware(
			alchemyPaymasterAndDataMiddleware({
				provider: client,
				policyId: '',
				entryPoint: BASE_ENTRYPOINT_ADDRESS
			})
		);
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
