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

// Alchemy API key for the application
const ALCHEMY_API_KEY = import.meta.env.VITE_ALCHEMY_API_KEY;

/**
 * Class representing a smart account.
 * @class
 */
export class SmartAccount {
  // https://github.com/eth-infinitism/account-abstraction/blob/develop/contracts/samples/SimpleAccount.sol
  private static readonly SIMPLE_ACCOUNT_FACTORY_ADDRESS = "0x9406Cc6185a346906296840746125a0E44976454";
  // https://github.com/eth-infinitism/account-abstraction/blob/develop/contracts/core/EntryPoint.sol
  private static readonly BASE_ENTRYPOINT_ADDRESS = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789";

  // Alchemy SDK instance
  private alchemy: Alchemy;

  // Wallet instance for the owner
  private owner: Wallet;

  // Account signer instance for signing transactions
  public accountSigner: AccountSigner | null = null;

  /**
   * Create a smart account.
   * @param {string} MNEMONIC - The mnemonic for the wallet.
   */
  constructor(private MNEMONIC: string) {
    // Initialize Alchemy SDK
    this.alchemy = new Alchemy({
      apiKey: ALCHEMY_API_KEY,
      network: Network.ETH_GOERLI,
    });

    // Create a wallet from the mnemonic
    this.owner = Wallet.fromMnemonic(this.MNEMONIC);
  }

  /**
 * Send a user operation.
 * @param {string} target - The target of the operation.
 * @param {string} data - The data for the operation.
 * @param {bigint} [value] - The value for the operation.
 * @returns {Promise<string>} The hash of the operation.
 * @throws Will throw an error if the account signer is not initialized.
 */
  private async sendUserOperation(target: `0x${string}`, data: `0x${string}`, value?: bigint): Promise<string> {
    if (!this.accountSigner) {
      throw new Error("Account signer not initialized");
    }

    // Send the user operation using the account signer
    const { hash } = await this.accountSigner.sendUserOperation({
      target,
      data,
      value, // value: bigint or undefined
    });
    return hash;
  }

  /**
   * Create a new wallet.
   * @returns {Promise<void>}
   */
  public async createNewWallet(): Promise<void> {
    // Get provider from Alchemy SDK
    const alchemyProvider = await this.alchemy.config.getProvider();

    // Create an adapter for the provider
    const adapter = EthersProviderAdapter.fromEthersProvider(
      alchemyProvider,
      SmartAccount.BASE_ENTRYPOINT_ADDRESS
    );

    // Connect to the account using the adapter
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
}
