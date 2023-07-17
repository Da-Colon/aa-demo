<script lang="ts">
	import { BigNumber } from 'ethers';
	import { onDestroy } from 'svelte';
	import { web3 } from '$lib/stores/web3';
	import type { Web3Store } from '$lib/types';
	import { appConfig } from './config/app';
	import { MakoEnergy__factory, type MakoEnergy } from '../../typechain';

	let state: Web3Store;
	let contract: MakoEnergy;
	let balance = BigNumber.from(0);
	let loading = true;

	const tokenImageUrl = appConfig.tokenURI.image;

	const loadContract = async () => {
		if (!state.provider) return;
		const _contract = MakoEnergy__factory.connect(appConfig.nftAddress, state.provider);
		contract = _contract;
		return _contract;
	};

	const loadBalance = async () => {
		if (state.isConnected && state.smartAddress && contract) {
			balance = await contract.balanceOf(state.smartAddress);
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
			if (from === state.smartAddress || to === state.smartAddress) {
				loadBalance();
			}
		});
	});

	onDestroy(() => {
		if (!contract) return;
		// Remove listener when component gets destroyed
		contract.off('Transfer', (from, to) => {
			if (from === state.smartAddress || to === state.smartAddress) {
				loadBalance();
			}
		});
	});
</script>

<section>
  {#if state.isConnected}
    <h2>Your Mako Energy: {balance.toString()}</h2>
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