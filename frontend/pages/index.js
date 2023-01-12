import Head from 'next/head'
// import Image from 'next/image'
import { Inter } from '@next/font/google'
// import Header from '../components/Header'
import Navbar from '../components/Navbar'

const inter = Inter({ subsets: ['latin'] })

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
