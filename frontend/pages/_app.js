import { MoralisProvider } from 'react-moralis';
import { NotificationProvider } from 'web3uikit';
import '../styles/globals.css';
import { WalletProvider } from '.././context/wallet';

export default function App({ Component, pageProps }) {
  return (
    <MoralisProvider initializeOnMount={false}>
      <WalletProvider>
        <NotificationProvider>
          <Component {...pageProps} />
        </NotificationProvider>
      </WalletProvider>
    </MoralisProvider>
  );
}
