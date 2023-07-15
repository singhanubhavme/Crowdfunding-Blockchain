import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { IoMdNotifications } from 'react-icons/io';
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
    username,
    description,
    email,
    imageURL,
    target,
    deadline,
    event
  ) {
    funderContract
      .registerFundraiser(
        name,
        username,
        description,
        email,
        imageURL,
        target,
        deadline
      )
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
        event.target.name.value = '';
        event.target.username.value = '';
        event.target.email.value = '';
        event.target.target.value = '';
        event.target.description.value = '';
        event.target.imageURL.value = '';
        event.target.deadline.value = 0;
      })
      .catch(() => {
        handleNotification(
          'error',
          'Transaction Failed!',
          <IoMdNotifications />
        );
        setisButtonDisabled(true);
      });
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
        const funderAddress = ContractAddress['11155111'][0];
        funderContract = new ethers.Contract(funderAddress, ABI, signer);
      }
    })();
  }, []);

  const handleSubmit = async (event) => {
    setisButtonDisabled(true);
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    // const ETHtoUSD = await fetch(
    //   'https://api.coinbase.com/v2/prices/ETH-USD/spot'
    // );
    const targetData = data.get('target');
    // const price = (await ETHtoUSD.json()).data.amount;

    const name = data.get('name');
    const email = data.get('email');
    const description = data.get('description');
    const imageURL = data.get('imageURL');
    const username = data.get('username');
    const deadline = data.get('deadline');
    // const target = targetData / price;
    const target = targetData;

    console.log({
      name: name,
      email: email,
      target: target,
      description: description,
      imageURL: imageURL,
      deadline: deadline,
    });
    if (
      name !== '' &&
      description !== '' &&
      email !== '' &&
      imageURL !== '' &&
      target !== '' &&
      username !== '' &&
      deadline >= 1
    ) {
      await registerFundraiser(
        name,
        username,
        description,
        email,
        imageURL,
        target,
        deadline,
        event
      );
    } else {
      setisButtonDisabled(true);
      dispatch({
        type: 'error',
        message: 'Please fill all the fields',
        title: 'Form Notification',
        position: 'bottomL',
        icon: <IoMdNotifications />,
      });
    }
  };

  return (
    <section className="text-gray-400 bg-gray-900 body-font relative min-h-screen">
      <div className="container px-5 pb-24 pt-12 mx-auto">
        <div className="flex flex-col text-center w-full mb-12">
          <h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-white">
            Register as Fundraiser
          </h1>
          <p className="lg:w-2/3 mx-auto leading-relaxed text-base">
            Start a fundraiser to help someone.
          </p>
        </div>
        <div className="lg:w-1/2 md:w-2/3 mx-auto">
          <form onSubmit={handleSubmit}>
            <div className="flex flex-wrap -m-2">
              <div className="p-2 w-1/2">
                <div className="relative">
                  <label for="name" className="leading-7 text-sm text-gray-400">
                    Name of Fundraiser
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="w-full bg-gray-800 bg-opacity-40 rounded border border-gray-700 focus:border-purple-500 focus:bg-gray-900 focus:ring-2 focus:ring-purple-900 text-base outline-none text-gray-100 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                  />
                </div>
              </div>
              <div className="p-2 w-1/2">
                <div className="relative">
                  <label
                    for="username"
                    className="leading-7 text-sm text-gray-400"
                  >
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    className="w-full bg-gray-800 bg-opacity-40 rounded border border-gray-700 focus:border-purple-500 focus:bg-gray-900 focus:ring-2 focus:ring-purple-900 text-base outline-none text-gray-100 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                  />
                </div>
              </div>
              <div className="p-2 w-1/2">
                <div className="relative">
                  <label
                    for="email"
                    className="leading-7 text-sm text-gray-400"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="w-full bg-gray-800 bg-opacity-40 rounded border border-gray-700 focus:border-purple-500 focus:bg-gray-900 focus:ring-2 focus:ring-purple-900 text-base outline-none text-gray-100 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                  />
                </div>
              </div>
              <div className="p-2 w-1/2">
                <div className="relative">
                  <label
                    for="target"
                    className="leading-7 text-sm text-gray-400"
                  >
                    Target Amount in $
                  </label>
                  <input
                    type="number"
                    id="target"
                    name="target"
                    className="w-full bg-gray-800 bg-opacity-40 rounded border border-gray-700 focus:border-purple-500 focus:bg-gray-900 focus:ring-2 focus:ring-purple-900 text-base outline-none text-gray-100 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                  />
                </div>
              </div>
              <div className="p-2 w-1/2">
                <div className="relative">
                  <label
                    for="imageURL"
                    className="leading-7 text-sm text-gray-400"
                  >
                    Image URL
                  </label>
                  <input
                    defaultValue={`https://picsum.photos/400/400?random=${Math.round(
                      Math.random() * 1000
                    )}`}
                    type="text"
                    id="imageURL"
                    name="imageURL"
                    className="w-full bg-gray-800 bg-opacity-40 rounded border border-gray-700 focus:border-purple-500 focus:bg-gray-900 focus:ring-2 focus:ring-purple-900 text-base outline-none text-gray-100 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                  />
                </div>
              </div>
              <div className="p-2 w-1/2">
                <div className="relative">
                  <label
                    for="deadline"
                    className="leading-7 text-sm text-gray-400"
                  >
                    Deadline (in Days)
                  </label>
                  <input
                    type="number"
                    id="deadline"
                    name="deadline"
                    className="w-full bg-gray-800 bg-opacity-40 rounded border border-gray-700 focus:border-purple-500 focus:bg-gray-900 focus:ring-2 focus:ring-purple-900 text-base outline-none text-gray-100 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                  />
                </div>
              </div>

              <div className="p-2 w-full">
                <div className="relative">
                  <label
                    for="description"
                    className="leading-7 text-sm text-gray-400"
                  >
                    Description of the Fundraiser
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    className="w-full bg-gray-800 bg-opacity-40 rounded border border-gray-700 focus:border-purple-500 focus:bg-gray-900 focus:ring-2 focus:ring-purple-900 h-32 text-base outline-none text-gray-100 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"
                  ></textarea>
                </div>
              </div>
              <div className="p-2 w-full">
                <button
                  // disabled={isButtonDisabled}
                  type="submit"
                  className={`flex mx-auto text-white bg-purple-500 border-0 py-2 px-8 focus:outline-none hover:bg-purple-600 rounded text-lg`}
                >
                  {isButtonDisabled ? (
                    <div role="status" className="mx-auto py-1 px-7">
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
                    <span>Register</span>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
