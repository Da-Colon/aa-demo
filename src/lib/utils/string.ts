/**
 * function to truncate a ethereum address to this format - "0x0000xxxx0000"
 * @param address
 * @returns truncated address
 */
export const truncateAddress = (address: string): string => {
  return `${address.slice(0, 6)}---${address.slice(-4)}`
}