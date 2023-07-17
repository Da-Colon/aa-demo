export const appConfig = {
  // Alchemy API key
  // * Obtained from https://dashboard.alchemy.com/
  alchemyApiKey: import.meta.env.VITE_ALCHEMY_API_KEY as `0x${string}`,

  // Base entry point address
  // @todo This should be removed, this should be able to be obtained from the smart account factory
  baseEntryPointAddress: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789' as `0x${string}`,

  // Gas Policy ID
  // @note Gas Policies must be created using same App ID as the Alchemy API key
  // @note Gas Policies can also be programmatically created using the Alchemy API
  // * Obtained from https://dashboard.alchemy.com/gasManager/
  // * https://docs.alchemy.com/reference/gas-manager-admin-api-quickstart
  gasPolicyId: import.meta.env.VITE_GAS_POLICY_ID,

  // NFT address
  // @link https://github.com/Da-Colon/aa-demo-contracts/blob/main/contracts/MakoEnergy.sol
  nftAddress: '0x1a20e21B45996C8f155649F106E07dC20E01E3FA' as `0x${string}`,

  // Token URI
  tokenURI: {
    name: 'Mako Energy',
    description: 'Mako Energy is a decentralized energy company that is building a new energy economy in Midgar.',
    image: 'https://pin.ski/3PWwPOY'
  },

  // Smart Account Factory address
  // https://github.com/Da-Colon/aa-demo-contracts/blob/main/contracts/MakoAccount.sol
  smartAccountFactoryAddress: '0x151650A6F510D04842940c82bf097Ce9cFbF7E6b' as `0x${string}`,

  // Demo token pay address
  // @link https://github.com/Da-Colon/aa-demo-contracts/blob/main/contracts/MakoShard.sol
  demoTokenToPayAddress: "0x166B6f2E8581e9c4539CDC996699b630E429F6bc" as `0x${string}`,

  // Demo token paymaster address
  // @link https://github.com/Da-Colon/aa-demo-contracts/blob/main/contracts/TokenPaymaster.sol
  demoTokenPaymasterAddress: "0x5aCD1cfafFB8A06b212E46DD2A9aC6c2a2399361" as `0x${string}`,

  // Demo subscription paymaster address
  // @link https://github.com/Da-Colon/aa-demo-contracts/blob/main/contracts/SubscriptionPaymaster.sol
  demoSubscriptionPaymasterAddress: "0x800d0E3DC9474Be14e47441EcBe37d06115612a2" as `0x${string}`,
}

export type TokenURI = {
  name: string;
  description: string;
  image: string;
}

export type AppConfig = typeof appConfig;
