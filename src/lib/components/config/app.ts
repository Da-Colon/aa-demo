export const appConfig = {
  // @todo add link when repo is public
  // * Obtained from https://dashboard.alchemy.com/
  alchemyApiKey: import.meta.env.VITE_ALCHEMY_API_KEY as `0x${string}`,
  // @todo This should be removed, this should be able to be obtained from the smart account factory
  baseEntryPointAddress: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789' as `0x${string}`,
  // Gas Policy ID, obtained from https://dashboard.alchemy.com/gasManager/
  // @note Gas Policies much be created using same App ID as the Alchemy API key
  // @note Gas Policies can also be programatically created using the Alchemy API
  // * https://docs.alchemy.com/reference/gas-manager-admin-api-quickstart
  gasPolicyId: import.meta.env.VITE_GAS_POLICY_ID,
  // @todo add link when repo is public
  nftAddress: '0x0962C095fF4af9d35D84918a4DD0711Fc8362Ff6' as `0x${string}`,
	tokenURI: {
    name: 'Mako Energy',
		description:
    'Mako Energy is a decentralized energy company that is building a new energy economy in Midgar.',
		image: 'https://pin.ski/3PWwPOY'
	},
  smartAccountFactoryAddress: '0x6841B820CE95ffeb6600052F84EEAB4C7B7e3494' as `0x${string}`,
  demoTokenToPayAddress: "0x1173149a0De9cb3Af230336F61430a5A81074146" as `0x${string}`,
  demoTokenPaymasterAddress: "0x6A99110348Db821378a7F0D892132880dF4B1855" as `0x${string}`,
  demoSubscriptionPaymasterAddress: "0x181Fe737C658ac37e1ce0d1a493273F17b7c0304" as `0x${string}`,
}

export type TokenURI = {
  name: string;
  description: string;
  image: string;
}
export type AppConfig = typeof appConfig;