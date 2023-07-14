import Register from '../components/Register';
import Navbar from '../components/Navbar';
import React from 'react';
import Footer from '../components/Footer';
export default function register() {
  return (
    <React.Fragment>
      <Navbar />
      <Register />
      <Footer />
    </React.Fragment>
  );
}
