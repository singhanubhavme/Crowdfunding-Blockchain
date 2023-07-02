import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import NotificationIcon from '@mui/icons-material/Notifications';
import { useNotification } from 'web3uikit';
import ABI from '../constants/abi.json';
import ContractAddress from '../constants/contractAddress.json';

let funderContract;
export default function Register() {
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

  async function registerFundraiser(
    name,
    description,
    email,
    imageURL,
    target,
    event
  ) {
    funderContract
      .registerFundraiser(name, description, email, imageURL, target)
      .then((tx) => {
        handleNotification(
          'info',
          'Transaction Pending Please Wait!',
          <NotificationIcon />
        );
        setisButtonDisabled(true);
        return tx;
      })
      .then((tx) => tx.wait(1))
      .then(() => {
        handleNotification(
          'info',
          'Transaction Complete!',
          <NotificationIcon />
        );
        setisButtonDisabled(false);
        event.target.name.value = '';
        event.target.email.value = '';
        event.target.target.value = '';
        event.target.description.value = '';
        event.target.imageURL.value = '';
      })
      .catch(() =>
        handleNotification('error', 'Transaction Failed!', <NotificationIcon />)
      );
  }

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
      }
    })();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const ETHtoUSD = await fetch(
      'https://api.coinbase.com/v2/prices/ETH-USD/spot'
    );
    const targetData = data.get('target');
    const price = (await ETHtoUSD.json()).data.amount;

    const name = data.get('name');
    const email = data.get('email');
    const description = data.get('description');
    const imageURL = data.get('imageURL');
    const username = data.get('username');
    // const target = targetData / price;
    const target = targetData;

    // console.log({
    //     name: name,
    //     email: email,
    //     target: target,
    //     description: description
    // });
    if (
      name !== '' &&
      description !== '' &&
      email !== '' &&
      imageURL !== '' &&
      target !== ''
    ) {
      await registerFundraiser(
        name,
        description,
        email,
        imageURL,
        target,
        event
      );
    } else {
      dispatch({
        type: 'error',
        message: 'Please fill all the fields',
        title: 'Form Notification',
        position: 'bottomL',
        icon: <NotificationIcon />,
      });
    }
  };

  return (
    <section class="text-gray-400 bg-gray-900 body-font relative min-h-screen">
      <div class="container px-5 pb-24 pt-12 mx-auto">
        <div class="flex flex-col text-center w-full mb-12">
          <h1 class="sm:text-3xl text-2xl font-medium title-font mb-4 text-white">
            Register as Fundraiser
          </h1>
          <p class="lg:w-2/3 mx-auto leading-relaxed text-base">
            Whatever cardigan tote bag tumblr hexagon brooklyn asymmetrical
            gentrify.
          </p>
        </div>
        <div class="lg:w-1/2 md:w-2/3 mx-auto">
          <div class="flex flex-wrap -m-2">
            <div class="p-2 w-1/2">
              <div class="relative">
                <label for="name" class="leading-7 text-sm text-gray-400">
                  Name of Fundraiser
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  class="w-full bg-gray-800 bg-opacity-40 rounded border border-gray-700 focus:border-purple-500 focus:bg-gray-900 focus:ring-2 focus:ring-purple-900 text-base outline-none text-gray-100 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                />
              </div>
            </div>
            <div class="p-2 w-1/2">
              <div class="relative">
                <label for="username" class="leading-7 text-sm text-gray-400">
                  Your Name
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  class="w-full bg-gray-800 bg-opacity-40 rounded border border-gray-700 focus:border-purple-500 focus:bg-gray-900 focus:ring-2 focus:ring-purple-900 text-base outline-none text-gray-100 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                />
              </div>
            </div>
            <div class="p-2 w-1/2">
              <div class="relative">
                <label for="email" class="leading-7 text-sm text-gray-400">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  class="w-full bg-gray-800 bg-opacity-40 rounded border border-gray-700 focus:border-purple-500 focus:bg-gray-900 focus:ring-2 focus:ring-purple-900 text-base outline-none text-gray-100 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                />
              </div>
            </div>
            <div class="p-2 w-1/2">
              <div class="relative">
                <label for="target" class="leading-7 text-sm text-gray-400">
                  Target Amount in $
                </label>
                <input
                  type="number"
                  id="target"
                  name="target"
                  class="w-full bg-gray-800 bg-opacity-40 rounded border border-gray-700 focus:border-purple-500 focus:bg-gray-900 focus:ring-2 focus:ring-purple-900 text-base outline-none text-gray-100 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                />
              </div>
            </div>
            <div class="p-2 w-full">
              <div class="relative">
                <label for="imageURL" class="leading-7 text-sm text-gray-400">
                  Image URL
                </label>
                <input
                  type="text"
                  id="imageURL"
                  name="imageURL"
                  class="w-full bg-gray-800 bg-opacity-40 rounded border border-gray-700 focus:border-purple-500 focus:bg-gray-900 focus:ring-2 focus:ring-purple-900 text-base outline-none text-gray-100 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                />
              </div>
            </div>

            <div class="p-2 w-full">
              <div class="relative">
                <label for="message" class="leading-7 text-sm text-gray-400">
                  Description of the Fundraiser
                </label>
                <textarea
                  id="message"
                  name="message"
                  class="w-full bg-gray-800 bg-opacity-40 rounded border border-gray-700 focus:border-purple-500 focus:bg-gray-900 focus:ring-2 focus:ring-purple-900 h-32 text-base outline-none text-gray-100 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"
                ></textarea>
              </div>
            </div>
            <div class="p-2 w-full">
              <button
                onClick={() => handleSubmit()}
                class="flex mx-auto text-white bg-purple-500 border-0 py-2 px-8 focus:outline-none hover:bg-purple-600 rounded text-lg"
              >
                Register
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
