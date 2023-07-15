<script lang="ts">
	import { BigNumber, ethers } from 'ethers';
	import { onDestroy } from 'svelte';
	import { web3 } from '$lib/stores/web3';
	import type { Web3Store } from '$lib/types';
	import { appConfig } from './config/app';
	import { DemoNFT__factory, type DemoNFT } from '../../typechain';

	let state: Web3Store;
	let contract: DemoNFT;
	let balance = BigNumber.from(0);
	let loading = true;

	const tokenImageUrl = appConfig.tokenURI.image;

	const loadContract = async () => {
		if (!state.provider) return;
		const _contract = DemoNFT__factory.connect(appConfig.nftAddress, state.provider);
		contract = _contract;
		return _contract;
	};

	const loadBalance = async () => {
		if (state.isConnected && state.address && contract) {
			balance = await contract.balanceOf(state.address);
		}
		loading = false;
	};

	web3.subscribe(async (value) => {
		state = value;
		loading = true;
		await loadContract();
		await loadBalance();
		// Listen to Transfer events and update balance
		contract?.on('Transfer', (from, to) => {
			if (from === state.address || to === state.address) {
				loadBalance();
			}
		});
	});

	onDestroy(() => {
		if (!contract) return;
		// Remove listener when component gets destroyed
		contract.off('Transfer', (from, to) => {
			if (from === state.address || to === state.address) {
				loadBalance();
			}
		});
	});
</script>

<section>
  {#if state.isConnected}
    <h2>Your Balance: {balance.toString()}</h2>
    <div>
      <img class="nft-image" src={tokenImageUrl} alt="ERC721" />
    </div>
  {:else}
    <p>Please connect your wallet.</p>
  {/if}
</section>

<style>
  .nft-image {
    width: 50%;
    height: auto;
  }
</style>