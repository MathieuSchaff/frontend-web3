export const formatBalance = (rawBalance: bigint) => {
  const balanceNumber = parseFloat(rawBalance.toString()) / 1000000000000000000;
  const formattedBalance = balanceNumber.toFixed(2);
  return formattedBalance;
}

export const formatChainAsNum = (chainIdHex: string) => {
  const chainIdNum = parseInt(chainIdHex)
  return chainIdNum
}
export const formatAddress = (addr: string) => {
  return `${addr.substring(0, 8)}...`
}
