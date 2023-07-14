import { writable } from 'svelte/store';
import { Signer, Wallet, ethers } from 'ethers';
import type { Web3Store } from '$lib/types';
import { SimpleSmartContractAccount, getChain } from '@alchemy/aa-core';
import { EthersProviderAdapter, convertWalletToAccountSigner } from '@alchemy/aa-ethers';
import { Alchemy, Network, type AlchemyProvider } from 'alchemy-sdk';

// Alchemy API key for the application
const ALCHEMY_API_KEY = import.meta.env.VITE_ALCHEMY_API_KEY;
// https://github.com/eth-infinitism/account-abstraction/blob/develop/contracts/samples/SimpleAccount.sol
const SIMPLE_ACCOUNT_FACTORY_ADDRESS = "0x9406Cc6185a346906296840746125a0E44976454";
// https://github.com/eth-infinitism/account-abstraction/blob/develop/contracts/core/EntryPoint.sol
const BASE_ENTRYPOINT_ADDRESS = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789";

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
    BASE_ENTRYPOINT_ADDRESS
  );

  // Connect the adapter to the account to create the account signer
  const accountSigner = adapter.connectToAccount(
    (rpcClient) =>
      new SimpleSmartContractAccount({
        entryPointAddress: BASE_ENTRYPOINT_ADDRESS,
        chain: getChain(network.chainId),
        owner: convertWalletToAccountSigner({ signMessage: signer.signMessage, getAddress: signer.getAddress } as Wallet),
        factoryAddress: SIMPLE_ACCOUNT_FACTORY_ADDRESS,
        rpcClient,
      })
  );
  return { accountSigner, network };
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
    signer: null,
    address: null,
    network: null,
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
          apiKey: ALCHEMY_API_KEY,
          network: Network.ETH_GOERLI,
        });
        const alchemyProvider = await alchemy.config.getProvider();

        // Request access to user accounts
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

        // If there are accounts available
        if (accounts && accounts.length > 0) {
          // Get the signer from the provider
          const signer = provider.getSigner();

          // Create the account signer and obtain the network
          const { accountSigner, network } = await createAccountSigner(signer, alchemyProvider);

          // Obtain the address from the signer
          const address = await signer.getAddress();

          // Update the web3 store with the new details
          set({
            isConnected: true,
            provider: alchemyProvider,
            signer: accountSigner,
            address: address,
            network: network,  // Set the network field
          });

          // Update the address in the web3 store when the accounts change
          window.ethereum.on('accountsChanged', (accounts: string[]) => {
            update(state => ({ ...state, address: accounts[0] }));
          });

          // Update the provider, signer, and network in the web3 store when the chain changes
          window.ethereum.on('chainChanged', async () => {
            const { accountSigner, network } = await createAccountSigner(signer, alchemyProvider);
            update(state => ({ ...state, provider: alchemyProvider, signer: accountSigner, network: network }));
          });
        } else {
          console.error("Unable to get accounts. User denied permission?");
        }
      } else {
        console.error("Please install MetaMask!");
      }
    },
    disconnect: () => {
      // Reset the web3 store when disconnecting
      set({
        isConnected: false,
        provider: null,
        signer: null,
        address: null,
        network: null,
      });
    },
  };
}

// Export the created web3 store
export const web3 = createWeb3Store();
