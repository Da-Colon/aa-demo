import { writable } from 'svelte/store';
import { Signer, ethers } from 'ethers';
import type { Web3Store } from '$lib/types';
import { SimpleSmartContractAccount, getChain } from '@alchemy/aa-core';
import { EthersProviderAdapter } from '@alchemy/aa-ethers';
import { Alchemy, Network, type AlchemyProvider } from 'alchemy-sdk';
import { appConfig } from '$lib/components/config/app';

/**
 * Creates an account signer and obtains the network details.
 * @param signer - The provider signer
 * @param alchemyProvider - The Alchemy provider
 * @returns The account signer and network details
 */
const createAccountSigner = async (signer: Signer, alchemyProvider: AlchemyProvider) => {
  // Obtain the current network from the Alchemy provider
  const network = await alchemyProvider.getNetwork();
  // Create an adapter from the Ethers provider
  const adapter = EthersProviderAdapter.fromEthersProvider(
    alchemyProvider,
    appConfig.baseEntryPointAddress
  );
  // Connect the adapter to the account to create the account signer
  const accountSigner = adapter.connectToAccount(
    (rpcClient) =>
      new SimpleSmartContractAccount({
        entryPointAddress: appConfig.baseEntryPointAddress,
        chain: getChain(network.chainId),
        owner: {
          signMessage: async (msg: Uint8Array) => (await signer.signMessage(msg)) as `0x${string}`,
          getAddress: async () => (await signer.getAddress()) as `0x${string}`
        },
        factoryAddress: appConfig.smartAccountFactoryAddress,
        rpcClient
      })
  );
  const smartAddress = await accountSigner.getAddress();
  return { accountSigner, network, smartAddress, adapter };
};

/**
 * Creates a web3 store.
 * @returns An object that contains the web3 store and its related functions
 */
function createWeb3Store() {
  // Create a writable web3 store
  const { subscribe, set, update } = writable<Web3Store>({
    isConnected: false,
    provider: null,
    accountSigner: null,
    address: null,
    network: null,
    signer: null,
    alchemy: null,
    adapter: null,
    smartAddress: null
  });

  return {
    subscribe,
    connect: async () => {
      // Check if Ethereum is defined in the window object
      if (typeof window.ethereum !== 'undefined') {
        // Create a new Ethers provider
        const provider = new ethers.providers.Web3Provider(window.ethereum);

        // Create a new Alchemy instance and obtain the provider
        const alchemy = new Alchemy({
          apiKey: appConfig.alchemyApiKey,
          network: Network.ETH_GOERLI
        });
        const alchemyProvider = await alchemy.config.getProvider();

        // Request access to user accounts
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

        // If there are accounts available
        if (accounts && accounts.length > 0) {
          // Get the signer from the provider
          const signer = provider.getSigner();

          // Create the account signer and obtain the network
          const { accountSigner, network, adapter, smartAddress } = await createAccountSigner(
            signer,
            alchemyProvider
          );

          // Obtain the address from the signer
          const address = await signer.getAddress();

          // Update the web3 store with the new details
          set({
            isConnected: true,
            provider: alchemyProvider,
            accountSigner,
            signer,
            address,
            network, // Set the network field
            alchemy, // Set the alchemy field
            adapter, // Set the adapter field
            smartAddress
          });

          // Update the address in the web3 store when the accounts change
          window.ethereum.on('accountsChanged', (accounts: string[]) => {
            update((state) => ({ ...state, address: accounts[0] }));
          });

          // Update the provider, signer, and network in the web3 store when the chain changes
          window.ethereum.on('chainChanged', async () => {
            const { accountSigner, network } = await createAccountSigner(signer, alchemyProvider);
            update((state) => ({
              ...state,
              provider: alchemyProvider,
              signer: accountSigner,
              network: network
            }));
          });
        } else {
          console.error('Unable to get accounts. User denied permission?');
        }
      } else {
        console.error('Please install MetaMask!');
      }
    },
    disconnect: () => {
      // Reset the web3 store when disconnecting
      set({
        isConnected: false,
        provider: null,
        accountSigner: null,
        address: null,
        network: null,
        alchemy: null,
        adapter: null,
        signer: null,
        smartAddress: null
      });
    }
  };
}

// Export the created web3 store
export const web3 = createWeb3Store();
