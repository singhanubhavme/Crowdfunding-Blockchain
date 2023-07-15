import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { IoMdNotifications } from 'react-icons/io';
import { useNotification } from 'web3uikit';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import ABI from '../constants/abi.json';
import ContractAddress from '../constants/contractAddress.json';
import NotFoundImg from './assets/NotFoundImg';

let funderContract;

async function getFunder(setFunder, ownerAddress) {
  setFunder(await funderContract.getFunder(ownerAddress));
}

export default function Delete() {
  const [funder, setFunder] = useState([]);
  const [isButtonDisabled, setisButtonDisabled] = useState(false);

  const dispatch = useNotification();

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
    console.log(funder);
  }, funder);

  useEffect(() => {
    (async function () {
      if (
        typeof window.ethereum !== 'undefined' ||
        typeof window.web3 !== 'undefined'
      ) {
        const ethereum = window.ethereum;
        const accounts = await ethereum.request({
          method: 'eth_requestAccounts',
        });
        const provider = new ethers.providers.Web3Provider(ethereum);
        const walletAddress = accounts[0];
        const signer = provider.getSigner(walletAddress);
        const funderAddress = ContractAddress['11155111'][0];
        funderContract = new ethers.Contract(funderAddress, ABI, signer);
        await getFunder(setFunder, walletAddress);
      }
    })();
  }, []);

  const handleClick = async (e) => {
    console.log(funder);
    funderContract
      .deleteFundraiser()
      .then((tx) => {
        handleNotification(
          'info',
          'Transaction Pending Please Wait!',
          <IoMdNotifications />
        );
        setisButtonDisabled(true);
        return tx;
      })
      .then((tx) => tx.wait(1))
      .then(() => {
        handleNotification(
          'info',
          'Transaction Complete!',
          <IoMdNotifications />
        );
        setisButtonDisabled(false);
      })
      .catch(() =>
        handleNotification(
          'error',
          'Transaction Failed!',
          <IoMdNotifications />
        )
      );
  };
  return (
    <section className="text-gray-400 body-font bg-gray-900 mx-auto min-h-screen">
      <div className="container px-5 py-12 mx-auto w-[90%]">
        <div className="flex flex-wrap w-full mb-20">
          <div className="w-full mb-6 lg:mb-0">
            <h1 className="sm:text-3xl text-2xl font-medium title-font mb-2 text-white">
              Delete the fundraiser
            </h1>
            <div className="h-1 w-20 bg-purple-500 rounded"></div>
          </div>
        </div>
        <div className="flex flex-wrap -m-4 justify-evenly">
          {funder &&
          funder.length !== 0 &&
          funder[1] !== '' &&
          funder[4] === true ? (
            <div className="xl:w-1/4 md:w-1/2">
              <div className="bg-gray-800 bg-opacity-40 p-6 rounded-lg">
                <img
                  className="h-40 rounded w-full object-cover object-center mb-6"
                  src={funder[5]}
                  alt="content"
                />
                <h2 className="text-lg text-purple-400 font-medium title-font mb-4">
                  {funder[1]}
                </h2>
                <div className="flex flex-row mx-auto">
                  <CircularProgressbar
                    className="h-14 items-center mr-4"
                    value={
                      (JSON.parse(funder[8]) / JSON.parse(funder[6])) * 100
                    }
                    text={`${
                      (JSON.parse(funder[8]) / JSON.parse(funder[6])) * 100
                    }%`}
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
                  disabled={isButtonDisabled}
                  onClick={(e) => handleClick(e)}
                  className="flex mx-auto text-white bg-purple-500 border-0 py-2 px-8 focus:outline-none hover:bg-purple-600 rounded text-lg"
                >
                  Delete
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col justify-around items-center">
              <div className="text-2xl text-white mb-10">
                You haven&apos;t created any crowdfunding to Delete.
              </div>
              <NotFoundImg />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
