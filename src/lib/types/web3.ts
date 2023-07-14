import type { AccountSigner, EthersProviderAdapter } from "@alchemy/aa-ethers";
import type { Alchemy, AlchemyProvider } from "alchemy-sdk";
import type { ethers } from "ethers";

export type Web3Store = {
  isConnected: boolean,
  provider: AlchemyProvider | null,
  signer: AccountSigner | null,
  address: string | null,
  network: ethers.providers.Network | null,
  alchemy: Alchemy | null,
  adapter: EthersProviderAdapter | null,
}