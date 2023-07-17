<script lang="ts">
	import { onMount } from 'svelte';
	import { web3 } from '$lib/stores/web3';
	import type { Web3Store } from '$lib/types';
	import { ethers } from 'ethers';
	import disconnectIcon from '$lib/images/disconnect.svg';
	import AddressLink from './AddressLink.svelte';

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
		<div class="address-container">
			<p class="address-display">Network Name {state.network.name}</p>
			<p>Inject Wallet Address</p>
			<AddressLink address={state.address} network={state.network.name} />
			{#if state.smartAddress}
				<p>Mako Smart Wallet Address</p>
				<AddressLink address={state.smartAddress} network={state.network.name} />
			{/if}
			<button class="button-web3 red" on:click={disconnect}>
				<img src={disconnectIcon} alt="disconnect" />
			</button>
		</div>
	{:else}
		<button class="button-web3" on:click={connect}>Connect</button>
	{/if}
</section>

<style>
	section {
		position: fixed;
		top: 20px;
		right: 20px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		width: 12.5rem;
		padding: 2rem;
		border-radius: 8px;
		border: 1px solid var(--color-gray-500);
		box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.1);
		background-color: var(--color-background);
		z-index: 999;
	}

	.address-container {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: flex-start;
		width: 100%;
	}

	.button-web3 {
		align-self: center;
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
		transition: background-color 0.3s;
	}

	.button-web3:hover {
		background-color: var(--color-blue-400);
	}

	.button-web3.red {
		background-color: var(--color-red-500);
		color: var(--color-white);
		padding: 4px 12px;
		width: 100%;
		margin-top: 16px;
	}

	.button-web3.red:hover {
		background-color: var(--color-red-400);
	}

	.address-display {
		color: var(--color-white);
		font-family: var(--font-mono);
		margin-bottom: 5px;
	}
</style>
