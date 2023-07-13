import { writable } from 'svelte/store';
import { ethers } from 'ethers';
import type { Web3Store } from '$lib/types';

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

        // Request access to user accounts:
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

        if (accounts && accounts.length > 0) {
          const signer = provider.getSigner();
          const address = await signer.getAddress();
          const network = await provider.getNetwork();  // Get the current network

          set({
            isConnected: true,
            provider: provider,
            signer: signer,
            address: address,
            network: network,  // Set the network field
          });

          window.ethereum.on('accountsChanged', (accounts: string[]) => {
            update(state => ({ ...state, address: accounts[0] }));
          });

          window.ethereum.on('chainChanged', async () => {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const network = await provider.getNetwork();
          
            update(state => ({
              ...state, 
              provider: provider, 
              signer: signer,
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
