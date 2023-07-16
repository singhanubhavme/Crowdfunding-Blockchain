const { ethers, run, network } = require('hardhat');
const fs = require('fs');

const FRONTEND_ADDRESS_FILE =
  'C:/Users/singh/Desktop/Crowdfunding/frontend/constants/contractAddress.json';
const FRONTEND_ABI_FILE =
  'C:/Users/singh/Desktop/Crowdfunding/frontend/constants/abi.json';

const verify = async (contractAddress, args) => {
  console.log('Verifying contract...');
  try {
    await run('verify:verify', {
      address: contractAddress,
      constructorArguments: args,
    });
  } catch (e) {
    if (e.message.toLowerCase().includes('already verified')) {
      console.log('Already Verified!');
    } else {
      console.log(e);
    }
  }
};

async function main() {
  const Funder = await ethers.getContractFactory('Funder');
  const FUNDER_CONTRACT = await Funder.deploy();

  if (network.config.chainId === 11155111) {
    await FUNDER_CONTRACT.deployTransaction.wait(5);
    await verify(FUNDER_CONTRACT.address, []);
  } else {
    console.log('Deployed on Localhost');
  }
  console.log('Contract deployed to address: ', FUNDER_CONTRACT.address);
  const currentAddress = JSON.parse(
    fs.readFileSync(FRONTEND_ADDRESS_FILE, 'utf8')
  );
  currentAddress[11155111] = [FUNDER_CONTRACT.address];
  fs.writeFileSync(
    FRONTEND_ADDRESS_FILE,
    JSON.stringify(currentAddress).toString()
  );
  console.log('Contract Address Updated!!');
  fs.writeFileSync(
    FRONTEND_ABI_FILE,
    FUNDER_CONTRACT.interface.format(ethers.utils.FormatTypes.json)
  );
  console.log('ABI Updated!!');
}

module.exports = main;
