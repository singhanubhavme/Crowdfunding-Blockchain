import ClaimBalance from '../components/ClaimBalance';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Fragment } from 'react';

export default function claimBalance() {
  return (
    <Fragment>
      <Navbar />
      <ClaimBalance />
      <Footer />
    </Fragment>
  );
}
