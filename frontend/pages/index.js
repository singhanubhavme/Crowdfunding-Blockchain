import Head from 'next/head';
import Navbar from '../components/Navbar';
import Home from '../components/Home';
import Footer from '../components/Footer';
import { Fragment } from 'react';

export default function Main() {
  return (
    <Fragment>
      <Head>
        <title>Decentralized Fundraiser</title>
        <meta
          name="description"
          content="Decentralized Fundraiser for everyone"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <Home />
      <Footer />
    </Fragment>
  );
}
