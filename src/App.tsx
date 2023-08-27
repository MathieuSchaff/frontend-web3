// import { useEffect, useState } from 'react'
import './App.global.css'
import styles from './App.module.css'
// import detectEthereumProvider from '@metamask/detect-provider';
// import { formatBalance, formatChainAsNum } from './utils/crypto';
import { Navigation } from './components/Navigation'
import { Display } from './components/Display'
import { MetaMaskError } from './components/MetaMaskError'

// const initialStateAccounts = { accounts: [], balance: "", chainId: "" }
function App() {
  return (
    <>
      <div className={styles.appContainer}>
        <Navigation />
        <Display />
        <MetaMaskError />
      </div>
    </>
  )
}

export default App
