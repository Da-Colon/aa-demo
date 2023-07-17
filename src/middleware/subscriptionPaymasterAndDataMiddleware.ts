/* eslint-disable @typescript-eslint/no-explicit-any */
import { appConfig } from "$lib/components/config/app";
import type { AccountSigner } from "@alchemy/aa-ethers";
import { BigNumber, utils } from "ethers";

export const subscriptionPaymasterAndDataMiddleware: Parameters<AccountSigner["withPaymasterMiddleware"]>["0"] = {
  dummyPaymasterDataMiddleware: async (struct: any) => {

    // The PaymasterAndData only consists of the Paymaster address, as no additional data is required
    const paymasterAndData = appConfig.demoSubscriptionPaymasterAddress;
    const additionalGas = utils.hexlify(1000000); // Add 1,000,000 gas to the estimation
    const newVerificationGasLimit = struct.verificationGasLimit
        ? utils.hexlify(BigNumber.from(struct.verificationGasLimit).add(additionalGas))
        : additionalGas;

    return {
      ...struct,
      paymasterAndData,
      verificationGasLimit: newVerificationGasLimit,
    };
  },
  paymasterDataMiddleware: async (struct: any) => {
    // The PaymasterAndData only consists of the Paymaster address, as no additional data is required
    const paymasterAndData = appConfig.demoSubscriptionPaymasterAddress;

    return {
      ...struct,
      paymasterAndData
    };
  },
};
