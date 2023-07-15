import { MoralisProvider } from 'react-moralis';
import { NotificationProvider } from 'web3uikit';
import { WalletProvider } from '.././context/wallet';
import { HandleNotificationProvider } from '../context/notification';
import '../styles/globals.css';

export default function App({ Component, pageProps }) {
  return (
    <MoralisProvider initializeOnMount={false}>
      <WalletProvider>
        <NotificationProvider>
          <HandleNotificationProvider>
            <Component {...pageProps} />
          </HandleNotificationProvider>
        </NotificationProvider>
      </WalletProvider>
    </MoralisProvider>
  );
}
