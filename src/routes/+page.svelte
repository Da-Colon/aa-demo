<script lang="ts">
	import Container from '$lib/components/Container.svelte';
	import { web3 } from '$lib/stores/web3';
	import { DemoNFT__factory } from '../typechain';
	import type { Web3Store } from '$lib/types';
	import { alchemyPaymasterAndDataMiddleware } from '@alchemy/aa-alchemy';
	import { appConfig, type TokenURI } from '$lib/components/config/app';
	import DisplayNft from '$lib/components/DisplayNFT.svelte';
	import { getAddress } from 'ethers/lib/utils';
	import type { AccountSigner } from '@alchemy/aa-ethers';
	let state: Web3Store;

	web3.subscribe((value) => {
		state = value;
	});

	// Mint NFT helper function
	async function mintNFT(accountSigner: AccountSigner, target: `0x${string}`, tokenURI: TokenURI) {
		const txData = DemoNFT__factory.createInterface().encodeFunctionData('mintEnergy', [
			target,
			JSON.stringify(tokenURI)
		]);
		return await accountSigner.sendUserOperation({
			target: appConfig.nftAddress,
			data: txData as `0x${string}`,
			value: 0n
		});
	}

	async function mintNFTWithGasSponsor() {
		if (!state.accountSigner || !state.provider || !state.address) {
			return console.log('no signer');
		}

		const withPaymaster = state.accountSigner.withPaymasterMiddleware(
			alchemyPaymasterAndDataMiddleware({
				provider: state.accountSigner.getPublicErc4337Client(),
				policyId: appConfig.gasPolicyId,
				entryPoint: appConfig.baseEntryPointAddress
			})
		);

		const nftTarget = getAddress(state.address) as `0x${string}`;
		const tx = await mintNFT(withPaymaster, nftTarget, appConfig.tokenURI);
		console.log('🚀 ~ file: +page.svelte:48 ~ tx:', tx);
	}

	async function mintNFTWithERC20GasPayment() {
		if (!state.accountSigner || !state.provider || !state.address) return console.log('no signer');
		// const nftTarget = state.address as `0x${string}`;
		// await mintNFT(state.signer, nftTarget, appConfig.tokenURI);
	}

	async function mintNFTWithInjectedWallet() {
		if(!state.signer || !state.address) return console.log('no signer');
		const nftContract = DemoNFT__factory.connect(appConfig.nftAddress, state.signer);
		const tx = await nftContract.mintEnergy(state.address, JSON.stringify(appConfig.tokenURI));
		tx.wait();
		console.log("🚀 ~ file: +page.svelte:58 ~ tx:", tx)
	}

	
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
	<Container>
		<DisplayNft />
	</Container>
	<Container>
		<section>
			<button
				class="button-primary"
				on:click={mintNFTWithGasSponsor}
				disabled={!import.meta.env.VITE_GAS_POLICY_ID || !state.address}
				>Mint NFT With Gas Sponsor</button
			>
		</section>
	</Container>
	<Container>
		<section>
			<button
				class="button-primary"
				on:click={mintNFTWithInjectedWallet}
				disabled={!state.signer}
				>Mint NFT With Injected Wallet</button
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
		justify-content: space-evenly;
		flex-wrap: wrap;
		gap: 2.5rem;
		color: var(--color-white);
	}
</style>
