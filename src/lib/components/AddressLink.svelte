<script lang="ts">
  import { truncateAddress } from "$lib/utils/string";

  export let address: string;
  export let network: string;

  function getEtherscanLink(network: string, address: string): string {
    const etherscanBaseUrl = network === 'goerli' ? 'https://goerli.etherscan.io' : '';
    return `${etherscanBaseUrl}/address/${address}`;
  }
</script>

<a href={getEtherscanLink(network, address)} target="_blank" rel="noopener noreferrer" class="address-link">
  {truncateAddress(address)}
</a>

<style>
  .address-link {
    color: var(--color-blue-300);
    font-family: var(--font-mono);
    text-decoration: none;
    display: inline-block;
    position: relative;
    transition: color 0.3s, opacity 0.2s;
  }

  .address-link:before {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 100%;
    height: 1px;
    background-color: var(--color-blue-500);
    visibility: hidden;
    transform: scaleX(0);
    transition: visibility 0s linear 0.2s, transform 0.2s ease-in-out;
  }

  .address-link:hover,
  .address-link:focus {
    color: var(--color-blue-500);
    opacity: 0.8;
  }

  .address-link:hover:before,
  .address-link:focus:before {
    visibility: visible;
    transform: scaleX(1);
    transition-delay: 0s;
  }

  .address-link:visited {
    color: var(--color-blue-400);
  }
</style>
