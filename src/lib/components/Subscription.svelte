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

	// Exported function to mint an NFT
	export let mintNFT: (
		accountSigner: AccountSigner,
		target: `0x${string}`,
		tokenURI: TokenURI
	) => Promise<any>;

	// The state of the web3 provider
	let web3State: Web3Store;

	// The MakoShard and MakoAccount smart contracts
	let shardContract: MakoShard;
	let accountContract: MakoAccount;

	// Indicators for approval, subscription, and loading states
	let isTransferApproved = false;
	let isUserSubscribed = false;
	let isLoading = false;

	// Function to initialize the MakoShard contract
	const initializeShardContract = async () => {
		if (!web3State.provider) return;
		const _shardContract = MakoShard__factory.connect(
			appConfig.demoTokenToPayAddress,
			web3State.provider
		);
		shardContract = _shardContract;
		return _shardContract;
	};

	// Function to initialize the MakoAccount contract
	const initializeAccountContract = async () => {
		if (!web3State.provider || !web3State.smartAddress) return;
		const _accountContract = MakoAccount__factory.connect(
			web3State.smartAddress,
			web3State.provider
		);
		accountContract = _accountContract;
		return _accountContract;
	};

	// Function to check if the transfer has been approved
	const validateTransferApproval = async () => {
		if (!shardContract || !web3State.smartAddress || !appConfig.demoSubscriptionPaymasterAddress)
			return;
		const allowance = await shardContract.allowance(
			web3State.smartAddress,
			appConfig.demoSubscriptionPaymasterAddress
		);
		isTransferApproved = allowance.eq(ethers.constants.MaxUint256);
	};

	// Function to check the status of the subscription
	async function checkUserSubscription() {
		if (!accountContract) return console.log('No MakoAccount contract');
		try {
			const subscription = await accountContract.getSubscription();
			isUserSubscribed = subscription[5];
		} catch (error) {
			console.log('Error during subscription check:', error);
		}
	}

	// Function to approve the transfer
	async function approveTokenTransfer() {
		if (!web3State.accountSigner || !shardContract) {
			return console.log('No account signer');
		}

		const withPaymaster = web3State.accountSigner.withPaymasterMiddleware(
			alchemyPaymasterAndDataMiddleware({
				provider: web3State.accountSigner.getPublicErc4337Client(),
				policyId: appConfig.gasPolicyId,
				entryPoint: appConfig.baseEntryPointAddress
			})
		);

		const approveData = shardContract.interface.encodeFunctionData('approve', [
			appConfig.demoSubscriptionPaymasterAddress,
			ethers.constants.MaxUint256
		]);

		try {
			const tx = await withPaymaster.sendUserOperation({
				target: appConfig.demoTokenToPayAddress,
				data: approveData as `0x${string}`,
				value: 0n
			});
			console.log('Token transfer approval sent', tx);
		} catch (error) {
			console.log('Error during transfer approval:', error);
		}
	}

	// Function to activate the subscription
	async function activateUserSubscription() {
		if (!web3State.accountSigner || !web3State.provider || !web3State.smartAddress) {
			return console.log('No account signer');
		}

		const recipient = appConfig.demoSubscriptionPaymasterAddress;
		const token = appConfig.demoTokenToPayAddress;

		const subscribeData = MakoAccount__factory.createInterface().encodeFunctionData(
			'subscribeAndActivate',
			[recipient, token]
		);

		const withPaymaster = web3State.accountSigner.withPaymasterMiddleware(
			alchemyPaymasterAndDataMiddleware({
				provider: web3State.accountSigner.getPublicErc4337Client(),
				policyId: appConfig.gasPolicyId,
				entryPoint: appConfig.baseEntryPointAddress
			})
		);

		const target = getAddress(web3State.smartAddress) as `0x${string}`;
		const tx = await withPaymaster.sendUserOperation({
			target,
			data: subscribeData as `0x${string}`,
			value: 0n
		});
		console.log('Subscription activation transaction:', tx);
	}

	// Function to mint an NFT with subscription payment
	async function mintNFTWithSubscriptionPayment() {
		if (!web3State.accountSigner || !web3State.provider || !web3State.smartAddress) {
			return console.log('No account signer');
		}
		const currentBlockNumber = await web3State.provider.getBlockNumber();
		const withPaymaster = web3State.accountSigner.withPaymasterMiddleware(
			subscriptionPaymasterAndDataMiddleware(currentBlockNumber, web3State.smartAddress)
		);

		const nftTarget = getAddress(web3State.smartAddress) as `0x${string}`;
		const tx = await mintNFT(withPaymaster, nftTarget, appConfig.tokenURI);
		console.log('NFT minting transaction:', tx);
	}

	// Web3 subscription that loads contracts and checks approval and subscription
	web3.subscribe(async (value) => {
		web3State = value;
		await initializeShardContract();
		await initializeAccountContract();
		await validateTransferApproval();
		await checkUserSubscription();

		shardContract?.on('Approval', (owner, spender) => {
			if (
				owner === web3State.smartAddress ||
				spender === appConfig.demoSubscriptionPaymasterAddress
			) {
				validateTransferApproval();
			}
		});

		accountContract?.on('SubscriptionCreated', () => {
			isUserSubscribed = true;
		});

		accountContract?.on('SubscriptionDeleted', () => {
			isUserSubscribed = false;
		});
	});

	// Unsubscribe event listeners upon destruction
	onDestroy(() => {
		if (shardContract) {
			shardContract.off('Approval', (owner, spender) => {
				if (
					owner === web3State.smartAddress ||
					spender === appConfig.demoSubscriptionPaymasterAddress
				) {
					validateTransferApproval();
				}
			});
		}

		if (accountContract) {
			accountContract.off('SubscriptionCreated', () => {
				isUserSubscribed = true;
			});

			accountContract.off('SubscriptionDeleted', () => {
				isUserSubscribed = false;
			});
		}
	});
</script>

<section>
	{#if web3State.isConnected}
		3 Shards == 1 hour
		{#if !isTransferApproved}
			<button class="button-primary" on:click={approveTokenTransfer} disabled={isLoading}>
				Approve Shard Transfer
			</button>
		{:else if isTransferApproved && !isUserSubscribed}
			<button class="button-primary" on:click={activateUserSubscription} disabled={isLoading}>
				Activate Subscription (3 Shards)
			</button>
		{:else if isTransferApproved && isUserSubscribed}
			<button class="button-primary" on:click={mintNFTWithSubscriptionPayment}>
				Mint NFT (Active Subscription)
			</button>
		{/if}
	{:else}
		<p>Please connect your wallet.</p>
	{/if}
</section>

<style>
	section {
		display: flex;
		align-items: center;
		justify-content: space-evenly;
		flex-wrap: wrap;
		gap: 0.5rem;
		color: var(--color-white);
	}
	button {
		width: 100%;
	}
</style>
