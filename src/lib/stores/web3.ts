import { writable } from 'svelte/store';
import { Wallet, ethers } from 'ethers';
import type { Web3Store } from '$lib/types';
import { SimpleSmartContractAccount, getChain } from '@alchemy/aa-core';
import { EthersProviderAdapter, convertWalletToAccountSigner } from '@alchemy/aa-ethers';
import { Alchemy, Network } from 'alchemy-sdk';

// Alchemy API key for the application
const ALCHEMY_API_KEY = import.meta.env.VITE_ALCHEMY_API_KEY;
// https://github.com/eth-infinitism/account-abstraction/blob/develop/contracts/samples/SimpleAccount.sol
const SIMPLE_ACCOUNT_FACTORY_ADDRESS = "0x9406Cc6185a346906296840746125a0E44976454";
// https://github.com/eth-infinitism/account-abstraction/blob/develop/contracts/core/EntryPoint.sol
const BASE_ENTRYPOINT_ADDRESS = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789";


function createWeb3Store() {
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
      if (typeof window.ethereum !== 'undefined') {
        const provider = new ethers.providers.Web3Provider(window.ethereum);

        const alchemy = new Alchemy({
          apiKey: ALCHEMY_API_KEY,
          network: Network.ETH_GOERLI,
        });
        const alchemyProvider = await alchemy.config.getProvider();


        // Request access to user accounts:
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

        if (accounts && accounts.length > 0) {
          const signer = provider.getSigner();
          const network = await alchemyProvider.getNetwork();  // Get the current network
          const adapter = EthersProviderAdapter.fromEthersProvider(
            alchemyProvider,
            BASE_ENTRYPOINT_ADDRESS
          );
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
          const address = await signer.getAddress();

          set({
            isConnected: true,
            provider: provider,
            signer: accountSigner,
            address: address,
            network: network,  // Set the network field
          });

          window.ethereum.on('accountsChanged', (accounts: string[]) => {
            update(state => ({ ...state, address: accounts[0] }));
          });

          window.ethereum.on('chainChanged', async () => {
            const signer = provider.getSigner();
            const adapter = EthersProviderAdapter.fromEthersProvider(
              alchemyProvider,
              BASE_ENTRYPOINT_ADDRESS
            );
            const network = await alchemyProvider.getNetwork();
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

            update(state => ({
              ...state,
              provider: provider,
              signer: accountSigner,
              network: network
            }));
          });
        } else {
          console.error("Unable to get accounts. User denied permission?");
        }
      } else {
        // @todo probably should show add a variable to hide connect button if no metamask
        console.error("Please install MetaMask!");
      }
    },
    disconnect: () => {
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

export const web3 = createWeb3Store();
