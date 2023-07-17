<script lang="ts">
	// Import required libraries
	import { ethers } from 'ethers';
	import { onDestroy } from 'svelte';
	import { web3 } from '$lib/stores/web3';

	// Import types
	import type { Web3Store } from '$lib/types';
	import type { AccountSigner } from '@alchemy/aa-ethers';
	import type { TokenURI } from './config/app';
	import type { MakoShard } from '../../typechain';

	// Import modules
	import { MakoShard__factory } from '../../typechain';
	import { appConfig } from './config/app';
	import { makoPaymasterAndDataMiddleware } from '../../middleware/makoShardPaymasterMiddleware';
	import { getAddress } from 'ethers/lib/utils';

	// Function for minting NFT
	export let mintNFT: (
		accountSigner: AccountSigner,
		target: `0x${string}`,
		tokenURI: TokenURI
	) => Promise<any>;

	// Variable declarations
	let state: Web3Store;
	let contract: MakoShard;
	let balance = '0';
	let loading = true;
	let isApproving = false;
	let isMaxApproved = false;

	const loadContract = async () => {
		if (!state.provider) return;
		contract = MakoShard__factory.connect(appConfig.demoTokenToPayAddress, state.provider);
		return contract;
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
	async function approveTokenMaster() {
		if (!state.accountSigner) {
			console.log('No account signer found');
			return;
		}

		// Encode the approve function call
		const approveData = MakoShard__factory.createInterface().encodeFunctionData('approve', [
			appConfig.demoTokenPaymasterAddress,
			ethers.constants.MaxUint256
		]);

		// Send the user operation
		const userOp = await state.accountSigner.sendUserOperation({
			target: appConfig.demoTokenToPayAddress,
			data: approveData as `0x${string}`,
			value: 0n
		});
		console.log('Approval transaction sent', userOp);
	}

	async function mintNFTWithERC20GasPayment() {
		if (!state.accountSigner || !state.provider || !state.smartAddress) {
			console.log('No account signer found');
			return;
		}

		const withPaymaster = state.accountSigner.withPaymasterMiddleware(
			makoPaymasterAndDataMiddleware
		);

		const nftTarget = getAddress(state.smartAddress) as `0x${string}`;
		const mintUserOp = await mintNFT(withPaymaster, nftTarget, appConfig.tokenURI);
		console.log('Mint transaction sent', mintUserOp);
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
		contract?.on('Transfer', (from, to) => {
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
		contract.off('Transfer', (from, to) => {
			if (from === state.smartAddress || to === state.smartAddress) {
				loadBalance();
			}
		});
	});
</script>

<section>
	<h2>Mako Shards ~{balance}~</h2>
	{#if state.isConnected}
		<button class="button-primary" on:click={requestTokens} disabled={loading}>
			Request Shards
		</button>
		<p>You pay coin, I pay gas</p>
		{#if !isMaxApproved}
			<button class="button-primary" on:click={approveTokenMaster} disabled={isApproving}>
				{#if isApproving}
					Approving...
				{:else}
					Approve Shard Paymaster
				{/if}
			</button>
		{:else}
			<button
				class="button-primary"
				on:click={mintNFTWithERC20GasPayment}
				disabled={!state.address || balance == '0' || isApproving}
			>
				Mint Energy (ERC20 Payment)
			</button>
		{/if}
	{:else}
		<p>Please connect your wallet.</p>
	{/if}
</section>

<style>
	h2 {
		margin-top: 0;
	}
	button {
		width: 100%;
	}
</style>
