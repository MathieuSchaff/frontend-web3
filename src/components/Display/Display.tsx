import { string } from 'valibot'; // 0.6 kB
import { useRef } from 'react'
import { useMetaMask } from '../../hooks/useMetaMask'
import { formatBalance, formatChainAsNum } from '../../utils/crypto.ts'
import styles from './Display.module.css'
import { ethers } from 'ethers'
import { abi } from '../../utils/constants'
const FundAmountSchema = string([
  (input) => {
    if (input.length == 0) {
      return {
        issue: {
          error: true,
          validation: 'custom',
          message: 'Invalid length',
          input,
        },
      };
    }
    return { output: input };
  },
]);
export const contractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"

export const Display = () => {
  const amountRefInput = useRef<HTMLInputElement>(null)
  const { wallet } = useMetaMask()

  async function getBalance() {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.BrowserProvider(window.ethereum)
      console.log(provider)
      try {
        const balance = await provider.getBalance(contractAddress)
        const balanceFormated = formatBalance(balance)
        console.log(balance)
        console.log(balanceFormated)
      } catch (error) {
        console.log(error)
      }
    }
  }
  async function fund() {
    let signer = null;
    const amountToFund = amountRefInput.current?.value
    if (typeof amountToFund !== "string") {
      return
    }
    if (FundAmountSchema._parse(amountToFund).issues) {
      console.log(FundAmountSchema._parse(amountToFund))
      return
    }
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.BrowserProvider(window.ethereum)
      signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, abi, signer)
      try {
        const transactionResponse = await contract.fund({
          value: ethers.parseEther(amountToFund),
        })
        console.log(transactionResponse)
        const receipt = await transactionResponse.wait()
        console.log(receipt)
      } catch (error) {
        console.log(error)
      }
    }
  }




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
            <button onClick={fund} type="button" id="fundButton" > Fund </button>
          </section>
        </>
      }
    </div>
  )
}
