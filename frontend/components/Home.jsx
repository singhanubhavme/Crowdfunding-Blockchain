import HeroImg from './assets/HeroImg';
import { useRouter } from 'next/router';

const Home = () => {
  const router = useRouter();
  return (
    <section className="text-gray-400 bg-gray-900 body-font py-6">
      <div className="container mx-auto flex px-5 py-24 md:flex-row flex-col items-center w-[80%]">
        <div className="lg:flex-grow md:w-1/2 lg:pr-24 md:pr-16 flex flex-col md:items-start md:text-left mb-16 md:mb-0 items-center text-center">
          <h1 className="title-font sm:text-4xl text-3xl mb-4 font-medium text-white">
            Empowering Innovation.
            <br className="hidden lg:inline-block" />
            Transforming Crowdfunding.
          </h1>
          <p className="mb-8 leading-relaxed">
            Welcome to our decentralized crowdfunding platform, where creativity
            meets collaboration. Discover groundbreaking projects, support
            visionary creators, and reshape the future of funding. Together, we
            ignite innovation and make ideas come to life, empowering a global
            community of changemakers. Join us and be part of the crowdfunding
            revolution
          </p>
          <div className="flex justify-center">
            <button
              onClick={() => router.push('/donate')}
              className="inline-flex text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg"
            >
              Donate
            </button>
            <button
              onClick={() => router.push('/register')}
              className="ml-4 inline-flex text-gray-400 bg-gray-800 border-0 py-2 px-6 focus:outline-none hover:bg-gray-700 hover:text-white rounded text-lg"
            >
              Register
            </button>
          </div>
        </div>
        <div className="lg:max-w-lg lg:w-full md:w-1/2 w-5/6">
          <HeroImg />
        </div>
      </div>
    </section>
  );
};
export default Home;
