<script lang="ts">
	import { BigNumber, ethers } from 'ethers';
	import { onDestroy } from 'svelte';
	import { web3 } from '$lib/stores/web3';
	import type { Web3Store } from '$lib/types';
	import { MakoShard__factory, type MakoShard } from '../../typechain';
	import { appConfig, type TokenURI } from './config/app';
	import { makoPaymasterAndDataMiddleware } from '../../middleware/makopaymaster';
	import { getAddress } from 'ethers/lib/utils';
	import type { AccountSigner } from '@alchemy/aa-ethers';

	export let mintNFT: (
		accountSigner: AccountSigner,
		target: `0x${string}`,
		tokenURI: TokenURI
	) => Promise<any>;
	let state: Web3Store;
	let contract: MakoShard;
	let balance = '0';
	let loading = true;
	let isApproving = false;
	let isMaxApproved = false;

	const loadContract = async () => {
		if (!state.provider) return;
		const _contract = MakoShard__factory.connect(appConfig.demoTokenToPayAddress, state.provider);
		contract = _contract;
		return _contract;
	};

	const loadBalance = async () => {
		if (state.isConnected && state.smartAddress && contract) {
			const balanceInWei = await contract.balanceOf(state.smartAddress);
			balance = ethers.utils.formatUnits(balanceInWei, 18);
		}
		loading = false;
	};

	const requestTokens = async () => {
		if (state.isConnected && state.signer && state.smartAddress && contract) {
			await contract.connect(state.signer).requestTokens(state.smartAddress);
		}
	};

	const checkApproval = async () => {
		if (!contract || !state.smartAddress) return;
		const allowance = await contract.allowance(
			state.smartAddress,
			appConfig.demoTokenPaymasterAddress
		);
		isMaxApproved = allowance.eq(ethers.constants.MaxUint256);
	};

	// Helper function to approve TokenMaster to spend user's tokens
	// Approve helper function
	async function approveTokenMaster() {
		if (!state.accountSigner) {
			return console.log('no signer');
		}
		// Encode the approve function call
		const approveData = MakoShard__factory.createInterface().encodeFunctionData('approve', [
			appConfig.demoTokenPaymasterAddress,
			ethers.constants.MaxUint256
		]);

		// Send the user operation
		const tx = await state.accountSigner.sendUserOperation({
			target: appConfig.demoTokenToPayAddress, // target is the token address
			data: approveData as `0x${string}`, // callData is the encoded approve function call
			value: 0n // signature is initially an empty string
		});
		console.log('🚀 ~ file: DisplayERC20.svelte:72 ~ tx:', tx);
	}

	async function mintNFTWithERC20GasPayment() {
		if (!state.accountSigner || !state.provider || !state.address) {
			return console.log('no signer');
		}

		const withPaymaster = state.accountSigner.withPaymasterMiddleware(
			makoPaymasterAndDataMiddleware
		);

		const nftTarget = getAddress(state.address) as `0x${string}`;
		const tx = await mintNFT(withPaymaster, nftTarget, appConfig.tokenURI);
		console.log('🚀 ~ tx:', tx);
	}
	web3.subscribe(async (value) => {
		state = value;
		loading = true;
		await loadContract();
		await checkApproval();
		await loadBalance();
		contract?.on('Approval', (owner, spender) => {
			if (owner === state.smartAddress || spender === appConfig.demoTokenPaymasterAddress) {
				checkApproval();
			}
		});
		contract?.on('Transfer', (from, to, amount) => {
			if (from === state.smartAddress || to === state.smartAddress) {
				loadBalance();
			}
		});
	});

	onDestroy(() => {
		if (!contract) return;
		contract.off('Approval', (owner, spender) => {
			if (owner === state.smartAddress || spender === appConfig.demoTokenPaymasterAddress) {
				checkApproval();
			}
		});
		contract.off('Transfer', (from, to, amount) => {
			if (from === state.smartAddress || to === state.smartAddress) {
				loadBalance();
			}
		});
	});
</script>

<section>
	We require a single token, per transaction so that we will pay for your gas.
	{#if state.isConnected}
		<h2>Your MakoShard Balance: {balance}</h2>
		<button class="button-primary" on:click={requestTokens} disabled={loading}>
			Request Tokens
		</button>
		{#if !isMaxApproved}
			<button class="button-primary" on:click={approveTokenMaster} disabled={isApproving}>
				{#if isApproving}
					Approving...
				{:else}
					Approve
				{/if}
			</button>
		{:else}
			<button
				class="button-primary"
				on:click={mintNFTWithERC20GasPayment}
				disabled={!state.address || balance == '0' || isApproving}
			>
				Mint NFT With Paymaster (MakoShard)
			</button>
		{/if}
	{:else}
		<p>Please connect your wallet.</p>
	{/if}
</section>

<style>
	button {
		width: 100%;
	}
</style>