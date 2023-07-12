import {
  getChain,
  SimpleSmartContractAccount,
} from "@alchemy/aa-core";
import { Alchemy, Network } from "alchemy-sdk";
import { Wallet } from "ethers";
import {
  type AccountSigner,
  EthersProviderAdapter,
  convertWalletToAccountSigner,
} from "@alchemy/aa-ethers";
const ALCHEMY_API_KEY = import.meta.env.VITE_ALCHEMY_API_KEY;
export class SmartAccount {
  // @todo add link to contract
  private static readonly SIMPLE_ACCOUNT_FACTORY_ADDRESS = "0x9406Cc6185a346906296840746125a0E44976454";
  // @todo add link to contract
  private static readonly BASE_ENTRYPOINT_ADDRESS = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789";
  private alchemy: Alchemy;
  private owner: Wallet;
  public accountSigner: AccountSigner | null = null;

  constructor(private MNEMONIC: string) {
    this.alchemy = new Alchemy({
      apiKey: ALCHEMY_API_KEY,
      network: Network.ETH_GOERLI,
    });
    this.owner = Wallet.fromMnemonic(this.MNEMONIC);
  }

  public async createNewWallet() {
    const alchemyProvider = await this.alchemy.config.getProvider();
    const adapter = EthersProviderAdapter.fromEthersProvider(
      alchemyProvider,
      SmartAccount.BASE_ENTRYPOINT_ADDRESS
    );

    this.accountSigner = adapter.connectToAccount(
      (rpcClient) =>
        new SimpleSmartContractAccount({
          entryPointAddress: SmartAccount.BASE_ENTRYPOINT_ADDRESS,
          chain: getChain(alchemyProvider.network.chainId),
          owner: convertWalletToAccountSigner(this.owner),
          factoryAddress: SmartAccount.SIMPLE_ACCOUNT_FACTORY_ADDRESS,
          rpcClient,
        })
    );
  }

  private async sendUserOperation(target: `0x${string}`, data: `0x${string}`, value?: bigint) {
    if (!this.accountSigner) {
      throw new Error("Account signer not initialized");
    }

    const { hash } = await this.accountSigner.sendUserOperation({
      target,
      data,
      value, // value: bigint or undefined
    });
    return hash;
  }
}
