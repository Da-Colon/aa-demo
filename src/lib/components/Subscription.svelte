<script lang="ts">
	import { ethers } from 'ethers';
	import { onDestroy } from 'svelte';
	import { web3 } from '$lib/stores/web3';
	import type { Web3Store } from '$lib/types';
	import {
		MakoShard__factory,
		type MakoShard,
		MakoAccount__factory,
		type MakoAccount
	} from '../../typechain';
	import { appConfig, type TokenURI } from './config/app';
	import { getAddress } from 'ethers/lib/utils';
	import { subscriptionPaymasterAndDataMiddleware } from '../../middleware/subscriptionPaymasterAndDataMiddleware';
	import type { AccountSigner } from '@alchemy/aa-ethers';
	import { alchemyPaymasterAndDataMiddleware } from '@alchemy/aa-alchemy';

	export let mintNFT: (
		accountSigner: AccountSigner,
		target: `0x${string}`,
		tokenURI: TokenURI
	) => Promise<any>;

	let state: Web3Store;
	let contract: MakoShard;
	let smartAccountContract: MakoAccount;

	let isApproved = false;
	let isSubscribed = false;
	let loading = false;

	const loadContract = async () => {
		if (!state.provider) return;
		const _contract = MakoShard__factory.connect(appConfig.demoTokenToPayAddress, state.provider);
		contract = _contract;
		return _contract;
	};

	const loadSmartAccountContract = async () => {
		if (!state.provider || !state.smartAddress) return;
		const _smartAccountContract = MakoAccount__factory.connect(
			state.smartAddress,
			state.provider
		);
		smartAccountContract = _smartAccountContract;
		return _smartAccountContract;
	};

	const checkApproval = async () => {
		if (!contract || !state.smartAddress || !appConfig.demoSubscriptionPaymasterAddress) return;
		const allowance = await contract.allowance(
			state.smartAddress,
			appConfig.demoSubscriptionPaymasterAddress
		);
		console.log('🚀 ~ file: Subscription.svelte:52 ~ allowance:', allowance);
		isApproved = allowance.eq(ethers.constants.MaxUint256);
	};

	async function checkSubscription() {
		if (!smartAccountContract) return console.log('no smart account contract');
		try {
			const subscription = await smartAccountContract?.getSubscription();
			isSubscribed = subscription[5];
		} catch (error) {
			console.log('🚀 ~ file: Subscription.svelte:65 ~ error:', error);
		}
	}

	async function approveTransfer() {
		// Check if we have a signer
		if (!state.accountSigner || !contract) {
			return console.log('no signer');
		}

		// Create a new signer that uses a paymaster
		const withPaymaster = state.accountSigner.withPaymasterMiddleware(
			alchemyPaymasterAndDataMiddleware({
				provider: state.accountSigner.getPublicErc4337Client(),
				policyId: appConfig.gasPolicyId,
				entryPoint: appConfig.baseEntryPointAddress
			})
		);

		// Encode the data for the 'approve' function call
		const approveData = contract.interface.encodeFunctionData('approve', [
			appConfig.demoSubscriptionPaymasterAddress, // Address to approve
			ethers.constants.MaxUint256 // Maximum number of tokens to approve
		]);
		try {
			// Send a user operation to approve the transfer
			const tx = await withPaymaster.sendUserOperation({
				target: appConfig.demoTokenToPayAddress, // Target the token contract
				data: approveData as `0x${string}`, // The 'approve' function call
				value: 0n // No ether value transferred
			});
			console.log('🚀 Subscription Paymaster Approval Sent', tx);
		} catch (error) {
			console.log('🚀 ~ file: DisplayERC20.svelte:72 ~ error:', error);
		}
	}

	async function activateSubscription() {
		if (!state.accountSigner || !state.provider || !state.smartAddress) {
			return console.log('no signer');
		}

		const recipient = appConfig.demoSubscriptionPaymasterAddress;
		const token = appConfig.demoTokenToPayAddress; // The token address should be provided here

		// Encode the subscribeAndActivate function call
		const subscribeData = MakoAccount__factory.createInterface().encodeFunctionData(
			'subscribeAndActivate',
			[recipient, token]
		);

		const withPaymaster = state.accountSigner.withPaymasterMiddleware(
			alchemyPaymasterAndDataMiddleware({
				provider: state.accountSigner.getPublicErc4337Client(),
				policyId: appConfig.gasPolicyId,
				entryPoint: appConfig.baseEntryPointAddress
			})
		);

		const target = getAddress(state.smartAddress) as `0x${string}`;
		const tx = await withPaymaster.sendUserOperation({
			target,
			data: subscribeData as `0x${string}`,
			value: 0n
		});
		console.log('🚀 ~ tx:', tx);
	}

	async function mintNFTWithSubscriptionPayment() {
		if (!state.accountSigner || !state.provider || !state.smartAddress) {
			return console.log('no signer');
		}

		const withPaymaster = state.accountSigner.withPaymasterMiddleware(
			subscriptionPaymasterAndDataMiddleware
		);

		const nftTarget = getAddress(state.smartAddress) as `0x${string}`;
		const tx = await mintNFT(withPaymaster, nftTarget, appConfig.tokenURI);
		console.log('🚀 ~ tx:', tx);
	}

	web3.subscribe(async (value) => {
		state = value;
		await loadContract();
		await loadSmartAccountContract();
		await checkApproval();
		await checkSubscription();

		contract?.on('Approval', (owner, spender) => {
			if (owner === state.smartAddress || spender === appConfig.demoSubscriptionPaymasterAddress) {
				checkApproval();
			}
		});

		// Listen for SubscriptionCreated event
		smartAccountContract?.on('SubscriptionCreated', () => {
			isSubscribed = true;
		});

		// Listen for SubscriptionDeleted event
		smartAccountContract?.on('SubscriptionDeleted', () => {
			isSubscribed = false;
		});
	});

	onDestroy(() => {
		if (contract) {
			contract.off('Approval', (owner, spender) => {
				if (
					owner === state.smartAddress ||
					spender === appConfig.demoSubscriptionPaymasterAddress
				) {
					checkApproval();
				}
			});
		}

		if (smartAccountContract) {
			smartAccountContract.off('SubscriptionCreated', () => {
				isSubscribed = true;
			});

			smartAccountContract.off('SubscriptionDeleted', () => {
				isSubscribed = false;
			});
		}
	});
</script>

<section>
	{#if state.isConnected}
		{#if !isApproved}
			<button class="button-primary" on:click={approveTransfer} disabled={loading}>
				Approve Shard Transfer
			</button>
		{:else if isApproved && !isSubscribed}
			<button class="button-primary" on:click={activateSubscription} disabled={loading}>
				Activate Subscription
			</button>
		{:else if isApproved && isSubscribed}
			<button class="button-primary" on:click={mintNFTWithSubscriptionPayment}>
				Mint NFT with as active subscriber
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
