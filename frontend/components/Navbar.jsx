import { ConnectButton } from '@web3uikit/web3';
import Link from 'next/link';

const pages = ['Home', 'Register', 'Donate', 'Claim Balance'];
const links = ['/', '/register', '/donate', '/claimBalance'];

const ResponsiveAppBar = () => {
  return (
    <header className="text-gray-400 bg-gray-900 body-font">
      <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
        <a
          href="/"
          className="flex title-font font-medium items-center text-white mb-4 md:mb-0"
        >
          <span className="ml-3 text-xl">Decentralized Fundraiser</span>
        </a>
        <nav className="md:ml-auto md:mr-auto flex flex-wrap items-center text-base justify-center">
          {pages.map((page, index) => (
            <Link
              key={links[index]}
              href={links[index]}
              className="mr-5 hover:text-white"
            >
              {page}
            </Link>
          ))}
        </nav>
        <div className="lg:mx-0 lg:mt-0 sm:mx-auto sm:mt-5">
          <ConnectButton />
        </div>
      </div>
    </header>
  );
};
export default ResponsiveAppBar;
