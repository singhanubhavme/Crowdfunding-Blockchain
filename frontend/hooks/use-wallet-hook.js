import { useContext } from 'react';
import { WalletContext } from '../context/wallet';

function useWalletContext() {
  return useContext(WalletContext);
}

export default useWalletContext;
