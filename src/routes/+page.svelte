<script lang="ts">
	import Container from '$lib/components/Container.svelte';
	import Mnemonic from '$lib/components/Mnemonic.svelte';
	import { SmartAccount } from '$lib/components/SmartAccount';
	import type { AccountSigner } from '@alchemy/aa-ethers';

	$: mnemonic = '';
	let generatedWallet: AccountSigner | undefined;
	let walletAsJson: any;
	let newWalletAddress: string | undefined;

	$: {
		generatedWallet;
		newWalletAddress;
		walletAsJson;
	}

	function updateMnemonic(_mnemonic: string) {
		mnemonic = _mnemonic;
	}

	async function createNewAccount() {
		const account = new SmartAccount(mnemonic);
		await account.createNewWallet();
		newWalletAddress = await account.accountSigner!.getAddress();
		generatedWallet = account.accountSigner!;
		const jsonPrep = {
			address: newWalletAddress,
			mnemonic: mnemonic,
		}
		walletAsJson = JSON.stringify(jsonPrep);
	}

	function downloadWallet() {
		const blob = new Blob([walletAsJson], { type: 'application/json' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = 'smartWallet.json';
		a.click();
	}

</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
	<Container>
		{#if !generatedWallet}
			<div>
				<Mnemonic updateMnemonic={updateMnemonic} />
			</div>
			{#if mnemonic}
				<button on:click={createNewAccount} class="button-primary" >Generate Smart Wallet</button>
			{/if}
		{:else}
			<div class="info">
				<h1 class="info-title">Wallet generated!</h1>
				<p class="info-description">Here is your wallet's address:</p>
				<div class="wallet-address">{newWalletAddress}</div>
				<button on:click={downloadWallet} class="button-primary" >Download Wallet</button>
			</div>
		{/if}
	</Container>
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		color: var(--color-white);
	}
	.button-primary {
		margin-top: 24px;
	}
	.info {
		padding: 20px;
		color: var(--color-white);
		border-radius: 10px;
	}
	.info-title {
		margin-bottom: 10px;
	}
	.info-description {
		margin-bottom: 5px;
	}
	.wallet-address {
		padding: 10px;
		background-color: var(--color-gray-700);
		font-family: monospace;
		color: var(--color-green-500);
		border-radius: 5px;
		word-break: break-all;
	}
</style>