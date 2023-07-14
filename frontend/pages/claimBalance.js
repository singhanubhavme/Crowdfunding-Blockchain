import ClaimBalance from '../components/ClaimBalance';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import React from 'react';
export default function claimBalance() {
  return (
    <React.Fragment>
      <Navbar />
      <ClaimBalance />
      <Footer />
    </React.Fragment>
  );
}
