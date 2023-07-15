<script lang="ts">
	import Container from '$lib/components/Container.svelte';
	import { web3 } from '$lib/stores/web3';
	import { DemoNFT__factory } from '../typechain';
	import type { Web3Store } from '$lib/types';
	import { alchemyPaymasterAndDataMiddleware } from '@alchemy/aa-alchemy';
	import { appConfig } from '$lib/components/config/app';
	let state: Web3Store;

	web3.subscribe((value) => {
		state = value;
	});

	// mint nft
	async function mintNFT() {
		// mint nft
	}
	// mint nft with paymaster
	async function mintNFTWithGasSponsor() {
		if (!state.signer || !state.provider || !state.provider) {
			return console.log('no signer');
		}

		const withPaymaster = state.signer.withPaymasterMiddleware(
			alchemyPaymasterAndDataMiddleware({
				provider: state.signer.getPublicErc4337Client(),
				policyId: appConfig.gasPolicyId,
				entryPoint: appConfig.baseEntryPointAddress
			})
		);
		// mint nft
		const target = appConfig.nftAddress;
		const txData = DemoNFT__factory.createInterface().encodeFunctionData('mintEnergy', [
			target,
			JSON.stringify(appConfig.tokenURI)
		]);
		const tx = await withPaymaster.sendUserOperation({
			target,
			data: txData as `0x${string}`,
			value: 0n
		});
		console.log('🚀 ~ file: +page.svelte:48 ~ tx:', tx);
	}

	// mint nft with gas sponsor
	async function mintNFTWithERC20GasPayment() {
		if (!state.signer || !state.provider || !state.provider) return console.log('no signer');
		const smartAddress = await state.signer.getAddress();
		const target = appConfig.nftAddress;
		const txData = DemoNFT__factory.createInterface().encodeFunctionData('mintEnergy', [
			target,
			JSON.stringify(appConfig.tokenURI)
		]);
		await state.signer.sendUserOperation({
			target: smartAddress as `0x${string}`,
			data: txData as `0x${string}`,
			value: 0n
		});
	}
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
	<Container>
		<section>
			<button class="button-primary" on:click={mintNFTWithGasSponsor} disabled={!import.meta.env.VITE_GAS_POLICY_ID}
				>Mint NFT With Gas Sponsor</button
			>
		</section>
	</Container>
	<Container>
		<section>
			<button class="button-primary" disabled>Mint NFT With Paymaster (USDC)</button>
		</section>
	</Container>
	<Container>
		<button class="button-primary" disabled>Sign up for Subscription</button>
	</Container>
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
