import { Fragment } from 'react';
import Register from '../components/Register';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function register() {
  return (
    <Fragment>
      <Navbar />
      <Register />
      <Footer />
    </Fragment>
  );
}
