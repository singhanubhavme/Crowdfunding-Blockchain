import { ConnectButton } from '@web3uikit/web3';
import Link from 'next/link';
import { useRouter } from 'next/router';

const pages = ['Home', 'Register', 'Donate', 'Claim Balance'];
const links = ['/', '/register', '/donate', '/claimBalance'];

const ResponsiveAppBar = () => {
  const router = useRouter();
  return (
    <header className="text-gray-400 bg-gray-900 body-font">
      <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center lg:justify-between">
        <Link
          href="/"
          className="flex title-font font-medium items-center text-white mb-4 md:mb-0"
        >
          <span className="ml-3 text-xl">Decentralized Fundraiser</span>
        </Link>
        <nav className="md:mx-auto flex flex-wrap items-center text-base justify-center lg:absolute lg:left-1/2 lg:transform lg:-translate-x-1/2">
          {pages.map((page, index) => {
            const isActive = router?.pathname === links[index];
            const linkClasses = `${isActive ? 'text-white' : ''}`;
            return (
              <Link
                key={links[index]}
                href={links[index]}
                className={`mr-5 hover:text-white ${linkClasses}`}
              >
                {page}
              </Link>
            );
          })}
        </nav>
        <div className="lg:mx-0 lg:mt-0 sm:mx-auto sm:mt-5">
          <ConnectButton />
        </div>
      </div>
    </header>
  );
};
export default ResponsiveAppBar;
