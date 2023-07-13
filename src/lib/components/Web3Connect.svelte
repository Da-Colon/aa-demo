<script lang="ts">
	import { onMount } from 'svelte';
	import { web3 } from '$lib/stores/web3';
	import type { Web3Store } from '$lib/types';
	import { ethers } from 'ethers';
	import { truncateAddress } from '$lib/utils/string';
	import disconnectIcon from '$lib/images/disconnect.svg';

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
		if (!window.ethereum) return;
		const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
		try {
			const signer = web3Provider.getSigner();
			await signer.getAddress();
			await connect();
		} catch {}
	});
</script>

<section>
	{#if state.isConnected && state.address && state.network}
		<p class="address-display">{state.network.name}:{truncateAddress(state.address)}</p>
		<button class="button-web3 red" on:click={disconnect}><img src={disconnectIcon} alt="disconnect"/></button>
	{:else}
		<button class="button-web3" on:click={connect}>Connect</button>
	{/if}
</section>

<style>
	section {
		display: flex;
		justify-content: center;
		align-items: center;
		height: fit-content;
		gap: 8px;
	}
	.button-web3 {
		background-color: var(--color-blue-500);
		border: none;
		color: var(--color-white);
		text-align: center;
		text-decoration: none;
		padding: 10px 20px;
		font-size: 16px;
		display: inline-block;
		margin: 4px 2px;
		cursor: pointer;
		border-radius: 8px;
	}
	.button-web3.red {
		background-color: var(--color-red-500);
		color: var(--color-white);
		padding: 4px 12px;
	}
	.address-display {
		color: var(--color-white);
		font-family: var(--font-mono);
	}
</style>
