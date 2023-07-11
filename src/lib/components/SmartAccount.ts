import {
  getChain,
  SimpleSmartContractAccount,
} from "@alchemy/aa-core";
import { Alchemy, Network } from "alchemy-sdk";
import { Wallet } from "ethers";
import {
  EthersProviderAdapter,
  convertWalletToAccountSigner,
} from "@alchemy/aa-ethers";
import { ALCHEMY_API_KEY } from '$env/static/private';

export class SmartAccount {
  private static readonly SIMPLE_ACCOUNT_FACTORY_ADDRESS = "0x9406Cc6185a346906296840746125a0E44976454";
  private alchemy: Alchemy;
  private owner: Wallet;
  private accountSigner: any;

  constructor(private MNEMONIC: string, private ENTRYPOINT_ADDRESS: `0x${string}`) {
    this.alchemy = new Alchemy({
      apiKey: ALCHEMY_API_KEY,
      network: Network.ETH_GOERLI,
    });
    this.owner = Wallet.fromMnemonic(this.MNEMONIC);

    this.initialize();
  }

  private async initialize() {
    const alchemyProvider = await this.alchemy.config.getProvider();

    this.accountSigner = EthersProviderAdapter.fromEthersProvider(
      alchemyProvider,
      this.ENTRYPOINT_ADDRESS
    ).connectToAccount(
      (rpcClient) =>
        new SimpleSmartContractAccount({
          entryPointAddress: this.ENTRYPOINT_ADDRESS,
          chain: getChain(alchemyProvider.network.chainId),
          owner: convertWalletToAccountSigner(this.owner),
          factoryAddress: SmartAccount.SIMPLE_ACCOUNT_FACTORY_ADDRESS,
          rpcClient,
        })
    );
  }

  // @todo function to handle converting data to data string


  public async sendUserOperation(target: string, data: string, value?: bigint) {
    const { hash } = await this.accountSigner.sendUserOperation({
      target,
      data,
      value, // value: bigint or undefined
    });
    return hash;
  }
}
