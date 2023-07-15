import { createContext, useEffect, useState } from 'react';
import { ethers } from 'ethers';
import ABI from '../constants/abi.json';
import ContractAddress from '../constants/contractAddress.json';
const WalletContext = createContext();

function WalletProvider({ children }) {
  const [funderContract, setFunderContract] = useState();
  const [walletAdd, setWalletAdd] = useState();
  useEffect(() => {
    (async function () {
      if (
        typeof window.ethereum !== 'undefined' ||
        typeof window.web3 !== 'undefined'
      ) {
        const ethereum = window.ethereum;
        const accounts = await ethereum.request({
          method: 'eth_requestAccounts',
        });
        const provider = new ethers.providers.Web3Provider(ethereum);
        const walletAddress = accounts[0];
        setWalletAdd(walletAddress);
        const signer = provider.getSigner(walletAddress);
        const funderAddress = ContractAddress['11155111'][0];
        setFunderContract(new ethers.Contract(funderAddress, ABI, signer));
      }
    })();
  }, []);
  const value = {
    funderContract,
    walletAdd,
  };
  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
}

export { WalletContext, WalletProvider };
