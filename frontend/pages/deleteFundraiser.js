import Delete from '../components/Delete';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import React from 'react';
export default function deleteFundraiser() {
  return (
    <React.Fragment>
      <Navbar />
      <Delete />
      <Footer />
    </React.Fragment>
  );
}
