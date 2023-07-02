import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { IoMdNotifications } from 'react-icons/io';
import { useNotification } from 'web3uikit';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

import ABI from '../constants/abi.json';
import ContractAddress from '../constants/contractAddress.json';

let funderContract;

export default function Donate() {
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

  async function getAllFunders(setFunders) {
    const allFunders = await funderContract.getAllFunders();
    const runningFunders = [];
    for (let i = 0; i < allFunders.length; i++) {
      if (allFunders[i].isRunning) {
        runningFunders.push(allFunders[i]);
      }
    }
    setFunders(runningFunders);
  }

  const [funders, setFunders] = useState([]);
  const [amount, setAmount] = useState(0);
  const [isButtonDisabled, setisButtonDisabled] = useState(false);

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
        const funderAddress = ContractAddress['5'][0];
        funderContract = new ethers.Contract(funderAddress, ABI, signer);
        getAllFunders(setFunders);
      }
    })();
  }, []);

  const handleClick = async (e, funder) => {
    funderContract
      .donateToFundme(funder[0], { value: amount })
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
        getAllFunders(setFunders);
      })
      .catch(() =>
        handleNotification(
          'error',
          'Transaction Failed!',
          <IoMdNotifications />
        )
      );
    setAmount(0);
  };

  return (
    <section class="text-gray-400 body-font bg-gray-900 mx-auto min-h-screen">
      <div class="container px-5 py-24 mx-auto w-[90%]">
        <div class="flex flex-wrap w-full mb-20">
          <div class="lg:w-1/2 w-full mb-6 lg:mb-0">
            <h1 class="sm:text-3xl text-2xl font-medium title-font mb-2 text-white">
              Donate to these fundraisers
            </h1>
            <div class="h-1 w-20 bg-purple-500 rounded"></div>
          </div>
          <p class="lg:w-1/2 w-full leading-relaxed text-gray-400 text-opacity-90">
            Your donation can change lives. Join us in supporting fundraisers
            and making a positive impact on those in need. Together, we can make
            a difference.
          </p>
        </div>
        <div class="flex flex-wrap -m-4">
          {funders.map((funder, index) => {
            return (
              <div key={index} class="xl:w-1/4 md:w-1/2">
                <div class="bg-gray-800 bg-opacity-40 p-6 rounded-lg">
                  <img
                    class="h-40 rounded w-full object-cover object-center mb-6"
                    src={funder[4]}
                    alt="content"
                  />
                  <h3 class="tracking-widest text-purple-400 text-xs font-medium title-font">
                    {funder[2]}
                  </h3>
                  <h2 class="text-lg text-white font-medium title-font mb-4">
                    {funder[1]}
                  </h2>
                  <div className="flex flex-row mx-auto">
                    <CircularProgressbar
                      className="h-14 items-center mr-4"
                      value={
                        (JSON.parse(funder[7]) / JSON.parse(funder[5])) * 100
                      }
                      text={`${
                        (JSON.parse(funder[7]) / JSON.parse(funder[5])) * 100
                      }%`}
                      styles={{
                        text: {
                          fill: 'white',
                          fontSize: '24px',
                        },
                      }}
                    />
                    <h2 class="text-sm text-gray-400 font-medium title-font mb-4 flex self-center flex-col">
                      Raised
                      <h4 className="text-lg text-white">
                        <span className="text-xl">
                          ${JSON.parse(funder[7])}
                        </span>{' '}
                        &nbsp;
                        <span className="text-gray-200">
                          of ${JSON.parse(funder[5])}
                        </span>
                      </h4>
                    </h2>
                    <div className="ml-auto text-sm">
                      Created by
                      <br />
                      <span className="text-white text-lg">{funder[2]}</span>
                    </div>
                  </div>
                  <p class="leading-relaxed text-base">{funder[2]}</p>
                  <div class="flex my-5 justify-center">
                    <div class="w-16 h-1 rounded-full bg-purple-500 inline-flex"></div>
                  </div>
                  <div className="flex flex-row justify-between">
                    <div class="w-1/2">
                      <div class="relative">
                        <label
                          for="target"
                          class="leading-7 text-sm text-gray-400"
                        >
                          Target Amount in $
                        </label>
                        <input
                          onChange={(e) => setAmount(e.target.value)}
                          value={amount}
                          type="number"
                          id="target"
                          name="target"
                          class="w-full bg-gray-800 bg-opacity-40 rounded border border-gray-700 focus:border-purple-500 focus:bg-gray-900 focus:ring-2 focus:ring-purple-900 text-base outline-none text-gray-100 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                        />
                      </div>
                    </div>
                    <div class="self-end">
                      <button
                        disabled={isButtonDisabled}
                        onClick={(e) => handleClick(e, funder)}
                        class="flex mx-auto text-white bg-purple-500 border-0 py-2 px-8 focus:outline-none hover:bg-purple-600 rounded text-lg"
                      >
                        Donate
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
