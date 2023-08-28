
import { useRef } from 'react'
import { useMetaMask } from '../../hooks/useMetaMask'
import { formatChainAsNum } from '../../utils/crypto.ts'
import styles from './Display.module.css'
import { ethers, BrowserProvider, parseUnits } from 'ethers'
export const contractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"

export const Display = () => {
  const amountRefInput = useRef(null)
  const { wallet } = useMetaMask()

  async function getBalance() {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.BrowserProvider(window.ethereum)
      console.log(provider)
      try {
        const balance = await provider.getBalance(contractAddress)
        console.log(balance)
      } catch (error) {
        console.log(error)
      }
    }
  }
  // async function fund() {
  //   const amountToFund = amountRefInput.current.value 
  //   console.log(amountToFund)
  //   if (typeof window.ethereum !== "undefined") {
  //     const provider = new ethers.BrowserProvider(window.ethereum)



  return (
    <div className={styles.display}>
      {wallet.accounts.length > 0 &&
        <>
          <div>Wallet Accounts: {wallet.accounts[0]}</div>
          <div>Wallet Balance: {wallet.balance}</div>
          <div>Hex ChainId: {wallet.chainId}</div>
          <div>Numeric ChainId: {formatChainAsNum(wallet.chainId)}</div>
          <section>
            <button id="balanceButton" onClick={getBalance}>getBalance</button>
            <button id="withdrawButton">Withdraw</button>
            <label htmlFor="ethAmount">ETH Amount</label>
            <input id="ethAmount" placeholder="0.1" ref={amountRefInput} />
            <button type="button" id="fundButton" > Fund </button>
          </section>
        </>
      }
    </div>
  )
}
