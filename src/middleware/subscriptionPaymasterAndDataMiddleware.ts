/* eslint-disable @typescript-eslint/no-explicit-any */
import { appConfig } from "$lib/components/config/app";
import type { AccountSigner } from "@alchemy/aa-ethers";
import { utils } from "ethers";

export const subscriptionPaymasterAndDataMiddleware: (blockNumber: number, smartAddress: string) => Parameters<AccountSigner["withPaymasterMiddleware"]>["0"] = (blockNumber, smartAddress) => ({
  dummyPaymasterDataMiddleware: async (struct: any) => {
    // The PaymasterAndData consists of the Paymaster address, the block number, and the smart wallet address
    const paymasterAddress = appConfig.demoSubscriptionPaymasterAddress.slice(2);
    const smartAddressHex = smartAddress.slice(2); // Remove the 0x prefix
    const paymasterAndData = `0x${paymasterAddress}${utils.hexZeroPad(utils.hexlify(blockNumber), 32).slice(2)}${smartAddressHex}`;

    return {
      ...struct,
      paymasterAndData,
    };
  },
  paymasterDataMiddleware: async (struct: any) => {
    // The PaymasterAndData consists of the Paymaster address, the block number, and the smart wallet address
    const paymasterAddress = appConfig.demoSubscriptionPaymasterAddress.slice(2);
    const smartAddressHex = smartAddress.slice(2); // Remove the 0x prefix
    const paymasterAndData = `0x${paymasterAddress}${utils.hexZeroPad(utils.hexlify(blockNumber), 32).slice(2)}${smartAddressHex}`;

    return {
      ...struct,
      paymasterAndData,
    };
  },
});
