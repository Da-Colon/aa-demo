<script lang="ts">
  import { onMount } from 'svelte';
  import { web3 } from '$lib/stores/web3';
  import type { Web3Store } from '$lib/types';
	import { ethers } from 'ethers';

  let state: Web3Store;

  web3.subscribe((value) => {
    state = value;
  });

  const connect = async () => {
    await web3.connect();
  };

  const disconnect = () => {
    web3.disconnect();
  };

  onMount(async () => {
		if(!window.ethereum) return;
		const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
		try {
			const signer = web3Provider.getSigner();
			await signer.getAddress();
			await connect();
		} catch {}
  });
</script>


<div>
		{#if state.isConnected && state.address && state.network}
			<p class="address-display">{state.network.name}:{state.address}</p>
			<button class="button-web3" on:click={disconnect}>Disconnect</button>
		{:else}
			<button class="button-web3" on:click={connect}>Connect</button>
		{/if}
</div>


<style>
	.button-web3 {
		background-color: var(--color-blue-500);
		border: none;
		color: var(--color-white);
		padding: 10px 20px;
		text-align: center;
		text-decoration: none;
		display: inline-block;
		font-size: 14px;
		margin: 4px 2px;
		cursor: pointer;
		border-radius: 3px;
	}
	.address-display {
		color: var(--color-white);
		font-family: var(--font-mono);
	}
</style>