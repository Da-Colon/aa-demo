<script lang="ts">
	import { ethers } from 'ethers';
	import { onMount } from 'svelte';
	import reloadIcon from '../images/reload.svg';

	// prop for update function
	export let updateMnemonic: (mnemonic: string) => void;
	
	let mnemonic = '';

	// Function to generate random mnemonic
	function generateMnemonic() {
		mnemonic = ethers.utils.entropyToMnemonic(ethers.utils.randomBytes(16));
		updateMnemonic(mnemonic);
	}

	// Generate mnemonic on component mount
	onMount(() => {
		generateMnemonic();
	});
</script>

<div class="flex-col">
	<h2>Your Mnemonic:</h2>
		<div class="mnemonic-container">
			{#each mnemonic.split(' ') as word (word)}
				<div class="mnemonic-word">{word}</div>
			{/each}
		</div>
	<button class="button-primary" on:click={generateMnemonic}>
		<img src={reloadIcon} alt="Reload Icon" />
	</button>
</div>

<style>
	h2 {
		color: var(--color-green-900);
	}
	button {
		align-self: center;
	}
	.mnemonic-container {
		display: flex;
		flex-direction: column;
		flex-wrap: wrap;
		gap: 10px;
		height: 325px;
		justify-content: space-around;
		align-items: center;
	}
	.mnemonic-word {
		background: var(--color-gray-100);
		padding: 10px;
		width: 100px;
		border-radius: 8px;
		color: var(--color-black);
		font-family: var(--font-mono);
	}
</style>
