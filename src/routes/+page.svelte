<script lang="ts">
	import Container from '$lib/components/Container.svelte';
	import { web3 } from '$lib/stores/web3';
	import { MakoEnergy__factory } from '../typechain';
	import type { Web3Store } from '$lib/types';
	import { alchemyPaymasterAndDataMiddleware } from '@alchemy/aa-alchemy';
	import { appConfig, type TokenURI } from '$lib/components/config/app';
	import DisplayNft from '$lib/components/DisplayNFT.svelte';
	import { getAddress } from 'ethers/lib/utils';
	import type { AccountSigner } from '@alchemy/aa-ethers';
	import DisplayErc20 from '$lib/components/DisplayERC20.svelte';
	import Subscription from '$lib/components/Subscription.svelte';
	let state: Web3Store;

	web3.subscribe((value) => {
		state = value;
	});

	// Mint NFT helper function
	async function mintNFT(accountSigner: AccountSigner, target: `0x${string}`, tokenURI: TokenURI) {
		const minTokenData = MakoEnergy__factory.createInterface().encodeFunctionData('mintEnergy', [
			target,
			JSON.stringify(tokenURI)
		]);
		return await accountSigner.sendUserOperation({
			target: appConfig.nftAddress,
			data: minTokenData as `0x${string}`,
			value: 0n
		});
	}

	async function mintNFTWithGasSponsor() {
		if (!state.accountSigner || !state.provider || !state.smartAddress) {
			console.log('no signer');
			return;
		}

		const withPaymaster = state.accountSigner.withPaymasterMiddleware(
			alchemyPaymasterAndDataMiddleware({
				provider: state.accountSigner.getPublicErc4337Client(),
				policyId: appConfig.gasPolicyId,
				entryPoint: appConfig.baseEntryPointAddress
			})
		);

		const nftTarget = getAddress(state.smartAddress) as `0x${string}`;
		const mintTransaction = await mintNFT(withPaymaster, nftTarget, appConfig.tokenURI);
		console.log('🚀 ~ mint transaction sent', mintTransaction);
	}

	async function mintNFTWithInjectedWallet() {
		if (!state.signer || !state.smartAddress) return console.log('no signer');
		const nftContract = MakoEnergy__factory.connect(appConfig.nftAddress, state.signer);
		const tx = await nftContract.mintEnergy(state.smartAddress, JSON.stringify(appConfig.tokenURI));
		tx.wait();
		console.log('🚀 Energy Minted and transfered', tx);
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
		<DisplayErc20 {mintNFT} />
	</Container>
	<Container>
		<section>
			Mint and have gas sponsored by Alchemy. Say thank you to Alchemy!
			<button
				class="button-primary"
				on:click={mintNFTWithGasSponsor}
				disabled={!import.meta.env.VITE_GAS_POLICY_ID || !state.address}
			>
				Mint Energy (Gas Sponsored)
			</button>
		</section>
	</Container>
	<Container>
		<section>
			Old school way
			<button class="button-primary" on:click={mintNFTWithInjectedWallet} disabled={!state.signer}>
				Mint Energy (Injected Wallet)
			</button>
		</section>
	</Container>

	<Container>
		<Subscription {mintNFT} />
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
	section section {
		gap: 0.5rem
	}
</style>
