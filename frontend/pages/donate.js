import { Fragment } from 'react';
import Donate from '../components/Donate';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
export default function donate() {
  return (
    <Fragment>
      <Navbar />
      <Donate />
      <Footer />
    </Fragment>
  );
}
