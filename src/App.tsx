import { useEffect, useState } from 'react'
import './App.css'
import detectEthereumProvider from '@metamask/detect-provider';
import { formatBalance, formatChainAsNum } from './utils/crypto';
const initialStateAccounts = { accounts: [], balance: "", chainId: "" }
function App() {
  const [hasProvider, setHasProvider] = useState<boolean | null>(null)
  const [wallet, setWallet] = useState(initialStateAccounts)
  console.log("wallet: ", wallet)
  useEffect(() => {
    const refreshAccounts = (accounts: any) => {
      console.log("accounts refreshAccounts: ", accounts)
      if (accounts.length > 0) {
        updateWallet(accounts)
      } else {
        setWallet(initialStateAccounts)
      }
    }
    // change the chainId
    const refreshChain = (chainId: any) => {
      console.log("chainId in refreshChain func: ", chainId)
      setWallet((prevState) => ({
        ...prevState,
        chainId
      }))
    }
    // This func is the main func to handle account and chainId changes.
    const getProvider = async () => {
      // detect if the provider exists
      const provider = await detectEthereumProvider({ silent: true });
      setHasProvider(Boolean(provider))
      if (provider) {
        // get the current accounts 
        // accounts will always be an array of string. The string are the current accounts connected.
        const accounts = await window.ethereum.request({ method: 'eth_accounts' })

        refreshAccounts(accounts)
        window.ethereum.on('accountsChanged', refreshAccounts)
        window.ethereum.on('chainChanged', refreshChain)
      }
    }
    getProvider()

    return () => {
      if (window.ethereum.removeListener) {
        window.ethereum.removeListener('accountsChanged', refreshAccounts)
        window.ethereum.removeListener('chainChanged', refreshChain)
      }
    }
  }, [])
  // this functin is to update the wallet data state
  const updateWallet = async (accounts: any) => {
    console.log("accounts in update wallet func: ", accounts)
    try {
      const balance = formatBalance(await window.ethereum.request({ method: 'eth_getBalance', params: [accounts[0], 'latest'] }))
      console.log("balance in updateWallet func: ", balance)
      const chainId = await window.ethereum.request({ method: 'eth_chainId' })
      console.log("chainId in updateWallet func: ", chainId)
      setWallet({ accounts, balance, chainId })
    } catch (error) {
      console.log(error)
    }
  }
  // This function handle the connection
  const handleConnect = async () => {
    try {
      // accounts is an array of string. The string are the current accounts connected.
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
      // ex: if only one account connected: accounts = ['0x...']
      updateWallet(accounts)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <div>
        <h2>Injected Provider {hasProvider ? 'DOES' : 'DOES NOT'} Exist</h2>
        {window.ethereum?.isMetaMask && wallet.accounts.length < 1 &&
          <button onClick={handleConnect}>connect</button>
        }
        {wallet.accounts.length > 0 &&
          <>                                                               {/* New */}
            <div>Wallet Accounts: {wallet.accounts[0]}</div>
            <div>Wallet Balance: {wallet.balance}</div>                    {/* New */}
            <div>Hex ChainId: {wallet.chainId}</div>                       {/* New */}
            <div>Numeric ChainId: {formatChainAsNum(wallet.chainId)}</div> {/* New */}
          </>
        }
      </div>
    </>
  )
}

export default App
