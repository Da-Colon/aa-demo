import type { AccountSigner } from "@alchemy/aa-ethers";
import type { ethers } from "ethers";

export type Web3Store = {
  isConnected: boolean,
  provider: ethers.providers.Web3Provider | null,
  signer: AccountSigner | null,
  address: string | null,
  network: ethers.providers.Network | null,
}