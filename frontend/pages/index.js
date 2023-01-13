import Head from 'next/head';
import Navbar from '../components/Navbar';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';


export default function Home() {
  return (
    <div>
      <Head>
        <title>Decentralized Fundraiser</title>
        <meta name="description" content="Decentralized Fundraiser for everyone" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
    </div>
  )
}
