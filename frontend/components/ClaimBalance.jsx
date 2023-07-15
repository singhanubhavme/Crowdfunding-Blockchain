import { useState, useEffect } from 'react';
import { IoMdNotifications } from 'react-icons/io';
import { useNotification } from 'web3uikit';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import NotFoundImg from './assets/NotFoundImg';
import useWalletContext from '../hooks/use-wallet-hook';

export default function ClaimBalance() {
  const { funderContract, walletAdd } = useWalletContext();
  const [funder, setFunder] = useState([]);
  const [updateUI, setUpdateUI] = useState(false);
  const [isButtonDisabled, setisButtonDisabled] = useState(false);

  const dispatch = useNotification();

  async function getFunder(ownerAddress) {
    setFunder(await funderContract?.getFunder(ownerAddress));
  }

  const handleNotification = (type, msg, icon) => {
    dispatch({
      type: type,
      message: msg,
      title: 'Tx Notification',
      position: 'bottomL',
      icon: icon,
    });
  };

  useEffect(() => {
    (async function () {
      await getFunder(walletAdd);
    })();
  }, [funderContract, updateUI]);

  const handleClick = async (e) => {
    setisButtonDisabled(true);
    funderContract
      .claimBalance()
      .then((tx) => {
        handleNotification(
          'info',
          'Transaction Pending Please Wait!',
          <IoMdNotifications />
        );
        return tx;
      })
      .then((tx) => tx.wait(1))
      .then(() => {
        handleNotification(
          'info',
          'Transaction Complete!',
          <IoMdNotifications />
        );
        setUpdateUI(!updateUI);
        setisButtonDisabled(false);
      })
      .catch(() => {
        setisButtonDisabled(false);
        handleNotification(
          'error',
          'Transaction Failed!',
          <IoMdNotifications />
        );
      });
  };
  return (
    <section className="text-gray-400 body-font bg-gray-900 mx-auto min-h-screen">
      <div className="container px-5 py-12 mx-auto w-[90%]">
        <div className="flex flex-wrap w-full mb-20">
          <div className="w-full mb-6 lg:mb-0">
            <h1 className="sm:text-3xl text-2xl font-medium title-font mb-2 text-white">
              Claim Balance
            </h1>
            <div className="h-1 w-20 bg-purple-500 rounded"></div>
          </div>
        </div>
        <div className="flex flex-wrap -m-4 justify-evenly">
          {funder &&
          funder.length !== 0 &&
          funder[1] !== '' &&
          funder[7] !== false ? (
            <div className="xl:w-[45%] md:w-[45%] m-2">
              <div className="bg-gray-800 bg-opacity-40 p-6 rounded-lg">
                <img
                  className="rounded w-full object-cover object-center mb-6"
                  src={funder[5]}
                  alt="content"
                />
                <h2 className="text-lg text-purple-400 font-medium title-font mb-4">
                  {funder[1]}
                </h2>
                <div className="flex flex-row mx-auto">
                  <CircularProgressbar
                    className="h-14 items-center mr-4"
                    value={(
                      parseFloat(
                        JSON.parse(funder[8]) / JSON.parse(funder[6])
                      ) * 100
                    ).toFixed(1)}
                    text={`${(
                      parseFloat(
                        JSON.parse(funder[8]) / JSON.parse(funder[6])
                      ) * 100
                    ).toFixed(1)}%`}
                    styles={{
                      text: {
                        fill: 'white',
                        fontSize: '24px',
                      },
                    }}
                  />
                  <h2 className="text-sm text-gray-400 font-medium title-font mb-4 flex self-center flex-col">
                    Raised
                    <h4 className="text-lg text-white">
                      <span className="text-xl">${JSON.parse(funder[8])}</span>{' '}
                      &nbsp;
                      <span className="text-gray-200">
                        of ${JSON.parse(funder[6])}
                      </span>
                    </h4>
                  </h2>
                  <div className="ml-auto text-sm">
                    Created by
                    <br />
                    <span className="text-white text-lg">{funder[2]}</span>
                  </div>
                </div>
                <p className="leading-relaxed text-base">{funder[3]}</p>
                <div className="flex my-5 justify-center">
                  <div className="w-16 h-1 rounded-full bg-purple-500 inline-flex"></div>
                </div>
                <button
                  onClick={(e) => handleClick(e)}
                  disabled={isButtonDisabled}
                  className="flex mx-auto text-white bg-purple-500 border-0 py-2 px-8 focus:outline-none hover:bg-purple-600 rounded text-lg"
                >
                  {isButtonDisabled ? (
                    <div role="status" className="mx-auto py-1 px-5">
                      <svg
                        aria-hidden="true"
                        className="w-5 h-5 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600 mx-auto"
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                          fill="currentColor"
                        />
                        <path
                          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                          fill="currentFill"
                        />
                      </svg>
                      <span className="sr-only">Loading...</span>
                    </div>
                  ) : (
                    <span>Claim</span>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col justify-around items-center">
              <div className="text-2xl text-white mb-10">
                You haven&apos;t created any crowdfunding to Claim Balance from.
              </div>
              <NotFoundImg />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
