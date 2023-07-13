import type { ethers } from "ethers";

export type Web3Store = {
  isConnected: boolean,
  provider: ethers.providers.Web3Provider | null,
  signer: ethers.Signer | null,
  address: string | null,
  network: ethers.providers.Network | null,
}