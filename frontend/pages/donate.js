import Donate from '../components/Donate';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import React from 'react';
export default function donate() {
  return (
    <React.Fragment>
      <Navbar />
      <Donate />
      <Footer />
    </React.Fragment>
  );
}
