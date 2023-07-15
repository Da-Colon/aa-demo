<script lang="ts">
	import Container from '$lib/components/Container.svelte';
	import { BASE_ENTRYPOINT_ADDRESS, GAS_POLICY_ID, SIMPLE_ACCOUNT_FACTORY_ADDRESS, web3 } from '$lib/stores/web3';
	import { DemoNFT__factory, SmartAccountFactory__factory } from '../typechain';
	import type { Web3Store } from '$lib/types';
	import { alchemyPaymasterAndDataMiddleware } from '@alchemy/aa-alchemy';
	let state: Web3Store;
	const NFT_ADDRESS = '0x0962C095fF4af9d35D84918a4DD0711Fc8362Ff6';
	const TOKEN_URI = {
		name: 'Mako Energy',
		description:
			'Mako Energy is a decentralized energy company that is building a new energy economy in Midgar.',
		image: 'https://pin.ski/3NKU3VC'
	};
	web3.subscribe((value) => {
		state = value;
	});

	// mint nft
	async function mintNFT() {
		// mint nft
	}
	// mint nft with paymaster
	async function mintNFTWithGasSponsor() {
		if (!state.accountSigner || !state.provider || !state.provider) {
			return console.log('no signer');
		}

		const withPaymaster = state.accountSigner.withPaymasterMiddleware(
			alchemyPaymasterAndDataMiddleware({
				provider: state.provider.rpcClient,
				policyId: GAS_POLICY_ID,
				entryPoint: BASE_ENTRYPOINT_ADDRESS
			})
		);
		// mint nft
		const smartAddress = await withPaymaster.getAddress();
		const target = NFT_ADDRESS;
		const txData = DemoNFT__factory.createInterface().encodeFunctionData('mintEnergy', [
			target,
			JSON.stringify(TOKEN_URI)
		]);
		const tx = await withPaymaster.sendUserOperation({
			target: smartAddress as `0x${string}`,
			data: txData as `0x${string}`,
			value: 0n
		});
		console.log('🚀 ~ file: +page.svelte:48 ~ tx:', tx);
	}

	// mint nft with gas sponsor
	async function mintNFTWithERC20GasPayment() {
		if (!state.accountSigner || !state.provider || !state.provider)
			return console.log('no signer');
		const smartAddress = await state.accountSigner.getAddress();
		const target = NFT_ADDRESS;
		const txData = DemoNFT__factory.createInterface().encodeFunctionData('mintEnergy', [
			target,
			JSON.stringify(TOKEN_URI)
		]);
		await state.accountSigner.sendUserOperation({
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
			<button class="button-primary">Mint NFT With Paymaster (USDC)</button>
		</section>
	</Container>
	<Container>
		<section>
			<button class="button-primary" on:click={mintNFTWithGasSponsor}>Mint NFT With Gas Sponsor</button>
		</section>
	</Container>
	<Container>
		<button class="button-primary" disabled>Sign up for Subscriptions (tbd)</button>
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
